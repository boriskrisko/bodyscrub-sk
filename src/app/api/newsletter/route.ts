import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Neplatný email' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        { email, is_active: true, subscribed_at: new Date().toISOString() },
        { onConflict: 'email' }
      );

    if (error) {
      console.error('Newsletter subscribe error:', error);
      return NextResponse.json({ error: 'Chyba pri prihlásení' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Chyba servera' }, { status: 500 });
  }
}
