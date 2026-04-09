import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('id, name, slug')
      .eq('slug', 'coffee-scrub')
      .single();

    return NextResponse.json({ data, error: error?.message || null });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message, stack: (e as Error).stack?.split('\n').slice(0, 5) });
  }
}
