import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'Zadajte kód kupónu' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: 'Neplatný kupón' }, { status: 400 });
    }

    // Check validity dates
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return NextResponse.json({ error: 'Kupón ešte nie je platný' }, { status: 400 });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json({ error: 'Kupón už vypršal' }, { status: 400 });
    }

    // Check max uses
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: 'Kupón bol už vyčerpaný' }, { status: 400 });
    }

    // Check min order
    if (coupon.min_order && subtotal < coupon.min_order) {
      return NextResponse.json(
        { error: `Minimálna objednávka pre tento kupón je ${coupon.min_order}€` },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else {
      discount = Math.min(coupon.value, subtotal);
    }

    discount = Math.round(discount * 100) / 100;

    return NextResponse.json({ discount, type: coupon.type, value: coupon.value });
  } catch {
    return NextResponse.json({ error: 'Chyba servera' }, { status: 500 });
  }
}
