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
            ...(item.image && item.image.startsWith('http') && { images: [item.image] }),
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

    const stripe = getStripe();

    // Create a Stripe coupon on-the-fly for the discount
    let discounts: { coupon: string }[] | undefined;
    if (discount_amount && discount_amount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: Math.round(discount_amount * 100),
        currency: 'eur',
        duration: 'once',
        name: coupon_code ? `Zľava ${coupon_code}` : 'Zľava',
      });
      discounts = [{ coupon: stripeCoupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      ...(discounts && { discounts }),
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const stack = error instanceof Error ? error.stack : '';
    const stripeError = (error as { type?: string; code?: string }).type || '';
    console.error('Stripe checkout error:', message, stripeError, stack);
    return NextResponse.json({
      error: 'Chyba pri vytváraní platby',
      detail: message,
      type: stripeError,
      key_prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 12) || 'missing',
      site_url: SITE_URL,
    }, { status: 500 });
  }
}
