import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();
  const metadata = session.metadata || {};

  const items = JSON.parse(metadata.items || '[]');
  const shippingAddress = JSON.parse(metadata.shipping_address || '{}');
  const subtotal = parseFloat(metadata.subtotal || '0');
  const shippingCost = parseFloat(metadata.shipping_cost || '0');
  const discountAmount = parseFloat(metadata.discount_amount || '0');
  const couponCode = metadata.coupon_code || null;

  const total = subtotal - discountAmount + shippingCost;

  // Generate order number: BS-YYYYMMDD-XXXX
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  const orderNumber = `BS-${dateStr}-${rand}`;

  // Create order
  const { error: orderError } = await supabase.from('orders').insert({
    order_number: orderNumber,
    email: session.customer_email || '',
    status: 'paid',
    items,
    subtotal,
    shipping_cost: shippingCost,
    discount_amount: discountAmount,
    total,
    shipping_address: shippingAddress,
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : null,
    coupon_code: couponCode,
  });

  if (orderError) {
    console.error('Error creating order:', orderError);
    return;
  }

  // Decrease stock for each item
  for (const item of items) {
    const { error } = await supabase.rpc('decrease_stock', {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });
    if (error) {
      console.error(`Error decreasing stock for ${item.product_id}:`, error);
    }
  }

  // Increment coupon used_count if coupon was used
  if (couponCode) {
    await supabase.rpc('increment_coupon_usage', { p_code: couponCode });
  }
}
