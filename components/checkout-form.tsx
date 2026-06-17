'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
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
}

type Step = 'passengers' | 'seats' | 'payment' | 'confirmation';

const cabinLabels: Record<SeatInfo['cabin'], string> = {
  first: 'First / VIP',
  business: 'Business',
  premium: 'Premium Economy',
  economy: 'Economy',
};

export function CheckoutForm({ flightId }: CheckoutProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('passengers');
  const [passengers, setPassengers] = useState<Passenger[]>([
    {
      name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
      email: user?.email ?? '',
      phone: '',
    },
  ]);
  const [seats, setSeats] = useState<SeatInfo[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'transfer'>('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    holder: '',
    expiry: '',
    cvv: '',
  });
  const [bookingRef, setBookingRef] = useState('');

  // Mock flight data
  const flightData = {
    id: flightId,
    airline: 'SkyTracker Airlines',
    from: 'MAD',
    to: 'BCN',
    fromCity: 'Madrid',
    toCity: 'Barcelona',
    departure: '10:30',
    arrival: '12:15',
    duration: '1h 45m',
    aircraft: 'Boeing 787 Dreamliner',
    price: 89,
    image: '/images/airplane-cabin.png',
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };

  const handleAddPassenger = () => {
    if (passengers.length < 9) {
      setPassengers([...passengers, { name: '', email: '', phone: '' }]);
    }
  };

  const handleToggleSeat = (seat: SeatInfo) => {
    setSeats((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat],
    );
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'ST' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setBookingRef(ref);
    setStep('confirmation');
  };

  const seatsTotal = seats.reduce((sum, s) => sum + s.price, 0);
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
              <h2 className="text-3xl font-bold text-foreground mb-2">Reserva confirmada</h2>
              <p className="text-muted-foreground">Tu vuelo ha sido reservado exitosamente</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-6 space-y-4 border border-border">
              <div>
                <p className="text-sm text-muted-foreground">Referencia de reserva</p>
                <p className="text-2xl font-bold text-primary font-mono">{bookingRef}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Pasajeros</p>
                  <p className="text-lg font-semibold text-foreground">{passengers.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asientos</p>
                  <p className="text-lg font-semibold text-foreground">
                    {seats.length ? seats.map((s) => s.id).join(', ') : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-semibold text-primary">€{totalPrice}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-muted-foreground text-sm">
                Se ha enviado un correo de confirmación a {passengers[0].email || 'tu correo'}
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
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
          {steps.map((s, index) => {
            const reached = index <= currentStepIndex;
            return (
              <div key={s.id} className="flex items-center gap-2 md:gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      reached ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`font-semibold hidden md:inline ${
                      reached ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'passengers' && (
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Información de pasajeros</h2>

                <div className="space-y-6">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="space-y-4 p-6 bg-muted/50 rounded-lg border border-border">
                      <h3 className="text-foreground font-semibold">Pasajero {index + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Nombre completo</label>
                          <Input
                            type="text"
                            placeholder="Juan Pérez García"
                            value={passenger.name}
                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Correo electrónico</label>
                          <Input
                            type="email"
                            placeholder="juan@example.com"
                            value={passenger.email}
                            onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-muted-foreground mb-2">Teléfono</label>
                          <Input
                            type="tel"
                            placeholder="+34 612 345 678"
                            value={passenger.phone}
                            onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {passengers.length < 9 && (
                  <Button onClick={handleAddPassenger} variant="outline" className="w-full mt-6">
                    + Agregar pasajero
                  </Button>
                )}

                <Button onClick={() => setStep('seats')} className="w-full mt-6">
                  Elegir asientos
                </Button>
              </div>
            )}

            {step === 'seats' && (
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-bold text-foreground">Elige tus asientos</h2>
                  <span className="text-sm text-muted-foreground">
                    {seats.length}/{passengers.length}
                  </span>
                </div>
                <p className="text-muted-foreground mb-6 text-sm">
                  Selecciona {passengers.length} asiento{passengers.length > 1 ? 's' : ''} en el avión. Cada cabina tiene un precio distinto.
                </p>

                <SeatMap
                  requiredSeats={passengers.length}
                  selectedSeats={seats.map((s) => s.id)}
                  onToggleSeat={handleToggleSeat}
                />

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button variant="outline" onClick={() => setStep('passengers')} className="sm:flex-1">
                    Atrás
                  </Button>
                  <Button
                    onClick={() => setStep('payment')}
                    disabled={seats.length !== passengers.length}
                    className="sm:flex-1"
                  >
                    {seats.length === passengers.length
                      ? 'Continuar al pago'
                      : `Selecciona ${passengers.length - seats.length} más`}
                  </Button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-card rounded-2xl border border-border p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Método de pago</h2>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    {([
                      { id: 'card', label: 'Tarjeta de crédito' },
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
                          onChange={(e) => setPaymentMethod(e.target.value as any)}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-foreground font-semibold">{method.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Número de tarjeta</label>
                        <Input
                          type="text"
                          placeholder="4532 1234 5678 9010"
                          value={cardDetails.cardNumber}
                          onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Titular de la tarjeta</label>
                        <Input
                          type="text"
                          placeholder="JUAN PEREZ GARCIA"
                          value={cardDetails.holder}
                          onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Vencimiento</label>
                          <Input
                            type="text"
                            placeholder="MM/AA"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">CVV</label>
                          <Input
                            type="text"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                      <p className="text-foreground">Serás redirigido a PayPal para completar tu pago de forma segura.</p>
                    </div>
                  )}

                  {paymentMethod === 'transfer' && (
                    <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg space-y-2">
                      <p className="text-foreground font-semibold">Datos de transferencia:</p>
                      <p className="text-muted-foreground text-sm">Banco: SkyTracker Bank</p>
                      <p className="text-muted-foreground text-sm">IBAN: ES91 1234 5678 9012 3456 7890</p>
                      <p className="text-muted-foreground text-sm">Concepto: {bookingRef || 'TU REFERENCIA'}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    Confirmar pago
                  </Button>

                  <Button type="button" onClick={() => setStep('seats')} variant="outline" className="w-full">
                    Atrás
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-card rounded-2xl border border-border p-6 space-y-6">
              <div className="relative h-40 w-full rounded-lg overflow-hidden">
                <Image src={flightData.image} alt="Flight" fill className="object-cover" />
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Resumen de vuelo</p>
                <p className="text-lg font-bold text-foreground">{flightData.airline}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{flightData.departure}</p>
                    <p className="text-sm text-muted-foreground">{flightData.from}</p>
                  </div>
                  <ArrowRight className="text-primary" size={20} />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{flightData.arrival}</p>
                    <p className="text-sm text-muted-foreground">{flightData.to}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mb-1">
                    <Clock size={16} /> {flightData.duration}
                  </p>
                  <p className="text-sm text-foreground">{flightData.aircraft}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pasajeros: {passengers.length}</span>
                  <span className="text-foreground font-semibold">€{basePrice}</span>
                </div>
                {seats.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Asientos ({seats.map((s) => `${s.id} · ${cabinLabels[s.cabin]}`).join(', ')})
                    </span>
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
