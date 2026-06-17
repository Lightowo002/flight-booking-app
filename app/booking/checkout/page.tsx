import { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout-form';

export const metadata: Metadata = {
  title: 'Checkout - SkyTracker',
  description: 'Completa tu reserva de vuelo',
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ flightId?: string }>;
}) {
  const { flightId } = await searchParams;
  return (
    <main>
      <CheckoutForm flightId={flightId || '1'} />
    </main>
  );
}
