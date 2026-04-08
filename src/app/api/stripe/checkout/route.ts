import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { SITE_URL, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, shipping_address, email, coupon_code, discount_amount } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Košík je prázdny' }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    );
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

    const line_items = items.map(
      (item: { name: string; price: number; quantity: number; image?: string }) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
            ...(item.image && { images: [item.image] }),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })
    );

    // Add shipping as line item if not free
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Doprava' },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Apply discount as negative line item
    if (discount_amount && discount_amount > 0) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { name: `Zľava (${coupon_code || 'kupón'})` },
          unit_amount: -Math.round(discount_amount * 100),
        },
        quantity: 1,
      });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      customer_email: email,
      metadata: {
        items: JSON.stringify(
          items.map((i: { id: string; name: string; price: number; quantity: number; image?: string }) => ({
            product_id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image || '',
          }))
        ),
        shipping_address: JSON.stringify(shipping_address),
        coupon_code: coupon_code || '',
        discount_amount: String(discount_amount || 0),
        subtotal: String(subtotal),
        shipping_cost: String(shippingCost),
      },
      success_url: `${SITE_URL}/dakujeme?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/pokladna`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Chyba pri vytváraní platby' }, { status: 500 });
  }
}
