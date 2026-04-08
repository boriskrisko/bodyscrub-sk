import { createClient } from '@/lib/supabase/server';
import { Coupon } from '@/types';
import AdminCoupons from '@/components/admin/AdminCoupons';

export default async function AdminKuponyPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .order('valid_until', { ascending: false });

  return <AdminCoupons coupons={(data || []) as Coupon[]} />;
}
