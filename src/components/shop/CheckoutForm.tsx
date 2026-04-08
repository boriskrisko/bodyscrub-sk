'use client';

import { useState } from 'react';
import { useCartStore } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '@/lib/constants';

export default function CheckoutForm() {
  const { items, totalPrice } = useCartStore();
  const total = totalPrice();
  const shippingCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  const [form, setForm] = useState({
    email: '',
    name: '',
    street: '',
    city: '',
    zip: '',
    country: 'SK',
  });
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState('');
  const [loading, setLoading] = useState(false);

  const finalTotal = total - discount + shippingCost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: total }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.discount);
        setCouponApplied(couponCode);
      } else {
        setCouponError(data.error || 'Neplatný kupón');
        setDiscount(0);
        setCouponApplied('');
      }
    } catch {
      setCouponError('Chyba pri overovaní kupónu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          shipping_address: {
            name: form.name,
            street: form.street,
            city: form.city,
            zip: form.zip,
            country: form.country,
          },
          email: form.email,
          coupon_code: couponApplied || undefined,
          discount_amount: discount,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Chyba pri vytváraní platby.');
        setLoading(false);
      }
    } catch {
      alert('Chyba pri spracovaní objednávky.');
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sand-600 mb-4">Váš košík je prázdny</p>
        <a href="/produkty" className="btn-primary inline-block">
          Pokračovať v nákupe
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Address form */}
      <div>
        <h2 className="font-display text-xl font-medium mb-6">Dodacie údaje</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-sand-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-sand-600 mb-1">Meno a priezvisko</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-sand-600 mb-1">Ulica a číslo</label>
            <input
              type="text"
              name="street"
              required
              value={form.street}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-sand-600 mb-1">Mesto</label>
              <input
                type="text"
                name="city"
                required
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-sand-600 mb-1">PSČ</label>
              <input
                type="text"
                name="zip"
                required
                value={form.zip}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-sand-200 bg-white text-sm outline-none focus:border-moss-600 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <div>
        <h2 className="font-display text-xl font-medium mb-6">Súhrn objednávky</h2>
        <div className="bg-white rounded-xl border border-sand-200 p-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}

          <div className="border-t border-sand-200 mt-3 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-sand-600">Medzisúčet</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sand-600">Doprava</span>
              <span>{shippingCost === 0 ? 'Zadarmo' : formatPrice(shippingCost)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-moss-600">
                <span>Zľava ({couponApplied})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
          </div>

          {/* Coupon */}
          <div className="border-t border-sand-200 mt-3 pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Zľavový kód"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 rounded-lg border border-sand-200 text-sm outline-none focus:border-moss-600 transition-colors"
              />
              <button
                type="button"
                onClick={applyCoupon}
                className="btn-outline !py-2 !px-4 !text-xs"
              >
                Použiť
              </button>
            </div>
            {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
            {couponApplied && !couponError && (
              <p className="text-moss-600 text-xs mt-1">Kupón {couponApplied} aplikovaný!</p>
            )}
          </div>

          <div className="border-t border-sand-200 mt-3 pt-3 flex justify-between font-display text-lg font-medium">
            <span>Celkom</span>
            <span className="text-moss-600">{formatPrice(finalTotal)}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 disabled:opacity-50"
          >
            {loading ? 'Spracovávam...' : 'Zaplatiť cez Stripe'}
          </button>

          <p className="text-[11px] text-sand-400 text-center mt-3">
            Budete presmerovaní na zabezpečenú platobnú bránu Stripe.
          </p>
        </div>
      </div>
    </form>
  );
}
