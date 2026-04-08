import { createClient } from '@/lib/supabase/server';
import { Coupon } from '@/types';
import AdminCouponList from '@/components/admin/AdminCouponList';

export default async function AdminKuponyPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('coupons')
    .select('*')
    .order('valid_until', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-medium mb-6">Kupóny</h1>
      <AdminCouponList coupons={(data || []) as Coupon[]} />
    </div>
  );
}
