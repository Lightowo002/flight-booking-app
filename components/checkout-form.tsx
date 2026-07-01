'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, ArrowRight, LogIn, UserX, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth-provider';
import { SeatMap, type SeatInfo } from '@/components/seat-map';

interface CheckoutProps {
  flightId: string;
}

interface Passenger {
  name: string;
  email: string;
  phone: string;
  documento: string;
}

type Step = 'passengers' | 'seats' | 'payment' | 'confirmation';

const cabinLabels: Record<SeatInfo['cabin'], string> = {
  first: 'First / VIP',
  business: 'Business',
  premium: 'Premium Economy',
  economy: 'Economy',
};

function validatePassengers(passengers: Passenger[]): string[] {
  const errs: string[] = [];
  passengers.forEach((p, i) => {
    const n = i + 1;
    if (!p.name.trim()) errs.push(`Pasajero ${n}: nombre requerido`);
    if (!p.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email))
      errs.push(`Pasajero ${n}: email inválido`);
    if (!p.phone.trim()) errs.push(`Pasajero ${n}: teléfono requerido`);
    if (!p.documento.trim()) errs.push(`Pasajero ${n}: número de documento requerido`);
  });
  return errs;
}

function validateCard(card: { cardNumber: string; holder: string; expiry: string; cvv: string }): string[] {
  const errs: string[] = [];
  if (!/^\d{16}$/.test(card.cardNumber.replace(/\s/g, '')))
    errs.push('Número de tarjeta inválido (16 dígitos)');
  if (!card.holder.trim()) errs.push('Nombre del titular requerido');
  if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.push('Vencimiento inválido (MM/AA)');
  if (!/^\d{3,4}$/.test(card.cvv)) errs.push('CVV inválido');
  return errs;
}

function LoginRequiredScreen({ returnPath }: { returnPath: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-10 text-center space-y-6">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Inicia sesión para continuar</h2>
          <p className="text-muted-foreground text-sm">
            Necesitas una cuenta para comprar boletos. Tus datos se rellenarán automáticamente al iniciar sesión.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <Link href={`/auth/login?redirect=${encodeURIComponent(returnPath)}`} className="block">
            <Button className="w-full flex items-center justify-center gap-2">
              <LogIn size={18} />
              Iniciar sesión
            </Button>
          </Link>
          <Link href={`/auth/register?redirect=${encodeURIComponent(returnPath)}`} className="block">
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <UserX size={18} />
              Crear cuenta nueva
            </Button>
          </Link>
          <Link href="/booking" className="block">
            <Button variant="ghost" className="w-full text-muted-foreground">
              Volver a buscar vuelos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://flightbookingapi-production.up.railway.app';

export function CheckoutForm({ flightId }: CheckoutProps) {
  const { user, isReady } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const flightData = {
    id: flightId,
    airline: searchParams.get('airline') || 'SkyTracker Airlines',
    from: searchParams.get('from') || 'MAD',
    to: searchParams.get('to') || 'BCN',
    fromCity: searchParams.get('fromCity') || 'Madrid',
    toCity: searchParams.get('toCity') || 'Barcelona',
    departure: searchParams.get('departure') || '10:30',
    arrival: searchParams.get('arrival') || '12:15',
    duration: searchParams.get('duration') || '1h 45m',
    stops: parseInt(searchParams.get('stops') || '0'),
    price: parseInt(searchParams.get('price') || '89'),
    image: searchParams.get('image') || '/images/airplane-cabin.png',
    tripType: searchParams.get('tripType') || 'oneWay',
    returnDate: searchParams.get('returnDate') || '',
  };

  const initialPassengers = parseInt(searchParams.get('passengers') || '1');

  const buildPassengers = (count: number): Passenger[] =>
    Array.from({ length: count }, (_, i) =>
      i === 0
        ? {
            name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
            email: user?.email ?? '',
            phone: user?.phone ?? '',
            documento: user?.numeroDocumento ?? '',
          }
        : { name: '', email: '', phone: '', documento: '' }
    );

  const [step, setStep] = useState<Step>('passengers');
  const [passengers, setPassengers] = useState<Passenger[]>(() => buildPassengers(initialPassengers));
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'transfer'>('card');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', holder: '', expiry: '', cvv: '' });
  const [bookingRef, setBookingRef] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (user) {
      setPassengers((prev) =>
        prev.map((p, i) =>
          i === 0
            ? {
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.email,
                phone: user.phone,
                documento: user.numeroDocumento,
              }
            : p
        )
      );
    }
  }, [user]);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handleAddPassenger = () => {
    if (passengers.length < 9) {
      setPassengers([...passengers, { name: '', email: '', phone: '', documento: '' }]);
      setSeats([]);
    }
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
      setSeats([]);
    }
  };

  const handleNextToSeats = async () => {
    const errs = validatePassengers(passengers);
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);

    try {
      const res = await fetch(`${API_BASE}/api/boletos/vuelo/${flightData.id}/asientos-ocupados`);
      if (res.ok) {
        const data = await res.json();
        setOccupiedSeats(data.asientosOcupados || []);
      }
    } catch {
      // Si falla, continúa sin bloquear asientos
    }

    setStep('seats');
  };

  const handleToggleSeat = (seat: SeatInfo) => {
    setSeats((prev) =>
      prev.some((s) => s.id === seat.id) ? prev.filter((s) => s.id !== seat.id) : [...prev, seat]
    );
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = paymentMethod === 'card' ? validateCard(cardDetails) : [];
    if (errs.length > 0) { setErrors(errs); return; }
    setErrors([]);
    setPaying(true);

    try {
      const claseLabels: Record<string, string> = {
        first: 'Primera clase',
        business: 'Business',
        premium: 'Premium Economy',
        economy: 'Económica',
      };

      const body = {
        usuarioId: user!.id,
        vueloId: flightData.id,
        pasajeros: passengers.map((p) => ({
          nombres: p.name,
          documento: p.documento,
          correo: p.email,
        })),
        asientos: seats.map((s) => s.id),
        clases: seats.map((s) => claseLabels[s.cabin] || 'Económica'),
        montoTotal: totalPrice,
        moneda: 'PEN',
      };

      const res = await fetch(`${API_BASE}/api/boletos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setBookingRef(data.codigosReserva?.[0] || 'R-ERROR');
      setStep('confirmation');
    } catch (err) {
      console.error('Error al guardar boleto:', err);
      setErrors(['No se pudo guardar la reserva. Verifica que el backend esté corriendo.']);
    } finally {
      setPaying(false);
    }
  };

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const c = v.replace(/\D/g, '').slice(0, 4);
    return c.length >= 3 ? c.slice(0, 2) + '/' + c.slice(2) : c;
  };

  const seatsTotal = seats.reduce((s, x) => s + x.price, 0);
  const basePrice = flightData.price * passengers.length;
  const airportTax = 15;
  const insurance = passengers.length * 5;
  const totalPrice = basePrice + seatsTotal + airportTax + insurance;

  const steps: { id: Step; label: string }[] = [
    { id: 'passengers', label: 'Pasajeros' },
    { id: 'seats', label: 'Asientos' },
    { id: 'payment', label: 'Pago' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/booking/checkout';
    return <LoginRequiredScreen returnPath={currentPath} />;
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-2xl border border-border p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">¡Reserva confirmada!</h2>
              <p className="text-muted-foreground">Tu vuelo ha sido reservado exitosamente</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border text-left">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Referencia de reserva</p>
                <p className="text-2xl font-bold text-primary font-mono">{bookingRef}</p>
              </div>
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vuelo</span>
                  <span className="text-foreground font-medium">{flightData.fromCity} → {flightData.toCity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Aerolínea</span>
                  <span className="text-foreground">{flightData.airline}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Horario</span>
                  <span className="text-foreground">{flightData.departure} → {flightData.arrival}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pasajeros</span>
                  <span className="text-foreground">{passengers.map((p) => p.name || 'Pasajero').join(', ')}</span>
                </div>
                {seats.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Asientos</span>
                    <span className="text-foreground">{seats.map((s) => s.id).join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                  <span className="text-foreground">Total pagado</span>
                  <span className="text-primary text-lg">€{totalPrice}</span>
                </div>
              </div>
            </div>
            <div className="space-y-3 pt-4">
              <p className="text-muted-foreground text-sm">
                Confirmación enviada a <span className="text-foreground">{passengers[0].email}</span>
              </p>
              <Link href="/">
                <Button className="w-full">Volver al inicio</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 pb-24 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
          {steps.map((s, index) => {
            const reached = index <= currentStepIndex;
            return (
              <div key={s.id} className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${reached ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {index + 1}
                  </div>
                  <span className={`font-semibold hidden md:inline ${reached ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-8 md:w-12 rounded ${index < currentStepIndex ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>

        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-500 font-semibold text-sm mb-1">Corrige los siguientes errores:</p>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, i) => <li key={i} className="text-red-400 text-sm">{err}</li>)}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">

            {step === 'passengers' && (
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Información de pasajeros</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Los datos del primer pasajero se han rellenado con tu cuenta.
                </p>
                <div className="space-y-6">
                  {passengers.map((passenger, index) => {
                    const isAccountHolder = index === 0;
                    return (
                      <div key={index} className="space-y-4 p-6 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="text-foreground font-semibold">Pasajero {index + 1}</h3>
                            {isAccountHolder && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                Tu cuenta
                              </span>
                            )}
                          </div>
                          {!isAccountHolder && (
                            <button
                              type="button"
                              onClick={() => handleRemovePassenger(index)}
                              className="text-xs text-red-400 hover:text-red-500 transition-colors"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                              Nombre completo <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="text"
                              placeholder="Juan Pérez García"
                              value={passenger.name}
                              onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                              Correo electrónico <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="email"
                              placeholder="juan@example.com"
                              value={passenger.email}
                              onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                              Teléfono <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="tel"
                              placeholder="+51 987 654 321"
                              value={passenger.phone}
                              onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                              N° de documento <span className="text-red-400">*</span>
                            </label>
                            <Input
                              type="text"
                              placeholder="DNI / Pasaporte"
                              value={passenger.documento}
                              onChange={(e) => handlePassengerChange(index, 'documento', e.target.value)}
                            />
                          </div>
                        </div>
                        {isAccountHolder && (
                          <p className="text-xs text-muted-foreground">
                            Datos tomados de tu cuenta. Puedes editarlos si es necesario para este vuelo.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {passengers.length < 9 && (
                  <Button onClick={handleAddPassenger} variant="outline" className="w-full mt-6">
                    + Agregar otro pasajero
                  </Button>
                )}
                <Button onClick={handleNextToSeats} className="w-full mt-4">
                  Elegir asientos
                </Button>
              </div>
            )}

            {step === 'seats' && (
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-foreground">Elige tus asientos</h2>
                  <span className="text-sm text-muted-foreground">{seats.length}/{passengers.length}</span>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">
                  Selecciona {passengers.length} asiento{passengers.length > 1 ? 's' : ''}. Cada cabina tiene un precio distinto.
                </p>
                <SeatMap
                  requiredSeats={passengers.length}
                  selectedSeats={seats.map((s) => s.id)}
                  onToggleSeat={handleToggleSeat}
                  occupiedSeats={occupiedSeats}
                />
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button variant="outline" onClick={() => setStep('passengers')} className="sm:flex-1">Atrás</Button>
                  <Button
                    onClick={() => setStep('payment')}
                    disabled={seats.length !== passengers.length}
                    className="sm:flex-1"
                  >
                    {seats.length === passengers.length ? 'Continuar al pago' : `Selecciona ${passengers.length - seats.length} más`}
                  </Button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Método de pago</h2>
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-3">
                    {([
                      { id: 'card', label: 'Tarjeta de crédito / débito' },
                      { id: 'paypal', label: 'PayPal' },
                      { id: 'transfer', label: 'Transferencia bancaria' },
                    ] as const).map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                          paymentMethod === method.id
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-muted/50 border border-border hover:border-primary'
                        }`}
                      >
                        <input
                          type="radio"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => { setPaymentMethod(e.target.value as typeof paymentMethod); setErrors([]); }}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-foreground font-semibold">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Número de tarjeta <span className="text-red-400">*</span></label>
                        <Input
                          type="text"
                          placeholder="4532 1234 5678 9010"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Titular de la tarjeta <span className="text-red-400">*</span></label>
                        <Input
                          type="text"
                          placeholder="JUAN PEREZ GARCIA"
                          value={cardDetails.holder}
                          onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value.toUpperCase() })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Vencimiento <span className="text-red-400">*</span></label>
                          <Input
                            type="text"
                            placeholder="MM/AA"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">CVV <span className="text-red-400">*</span></label>
                          <Input
                            type="password"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-foreground">Serás redirigido a PayPal para pagar <strong>€{totalPrice}</strong> de forma segura.</p>
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg space-y-2">
                      <p className="text-foreground font-semibold">Datos de transferencia:</p>
                      <p className="text-muted-foreground text-sm">Banco: SkyTracker Bank</p>
                      <p className="text-muted-foreground text-sm">IBAN: ES91 1234 5678 9012 3456 7890</p>
                      <p className="text-muted-foreground text-sm">Importe: <strong className="text-foreground">€{totalPrice}</strong></p>
                      <p className="text-muted-foreground text-sm">Concepto: {passengers[0].name} – {flightData.from}/{flightData.to}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={paying}>
                    {paying ? 'Procesando reserva...' : `Confirmar y pagar €${totalPrice}`}
                  </Button>
                  <Button type="button" onClick={() => { setStep('seats'); setErrors([]); }} variant="outline" className="w-full" disabled={paying}>
                    Atrás
                  </Button>
                </form>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-card rounded-2xl border border-border p-6 space-y-6">
              <div className="relative h-40 w-full rounded-lg overflow-hidden">
                <Image src={flightData.image} alt="Flight" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <p className="text-white text-xs font-medium">{flightData.airline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-semibold truncate">{user.firstName} {user.lastName}</p>
                  <p className="text-muted-foreground text-xs truncate">{user.email}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                  {flightData.tripType === 'roundTrip' ? 'Ida y vuelta' : 'Solo ida'}
                </p>
                <p className="text-lg font-bold text-foreground">{flightData.fromCity} → {flightData.toCity}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{flightData.departure}</p>
                    <p className="text-sm text-muted-foreground">{flightData.from}</p>
                  </div>
                  <ArrowRight className="text-primary" size={20} />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{flightData.arrival}</p>
                    <p className="text-sm text-muted-foreground">{flightData.to}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock size={16} /> {flightData.duration}
                    {flightData.stops === 0
                      ? <span className="ml-auto text-green-500 text-xs font-medium">Directo</span>
                      : <span className="ml-auto text-accent text-xs">{flightData.stops} parada{flightData.stops > 1 ? 's' : ''}</span>}
                  </p>
                  {flightData.tripType === 'roundTrip' && flightData.returnDate && (
                    <p className="text-xs text-muted-foreground mt-1">Vuelta: {flightData.returnDate}</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{passengers.length} pasajero{passengers.length > 1 ? 's' : ''} × €{flightData.price}</span>
                  <span className="text-foreground font-semibold">€{basePrice}</span>
                </div>
                {seats.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Asientos ({seats.map((s) => `${s.id} · ${cabinLabels[s.cabin]}`).join(', ')})</span>
                    <span className="text-foreground font-semibold">€{seatsTotal}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tasa de aeropuerto</span>
                  <span className="text-foreground font-semibold">€{airportTax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seguro de viaje</span>
                  <span className="text-foreground font-semibold">€{insurance}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-between items-center">
                <span className="text-foreground font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">€{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}