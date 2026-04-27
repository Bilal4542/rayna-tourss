import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useLanguageCurrency } from '../context/LanguageCurrencyContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartCount } = useCart();
  const { currencySymbol, currency } = useLanguageCurrency();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.options.totalPrice * item.quantity);
  }, 0);

  const taxesAndFees = subtotal * 0.05; // Example 5% tax/fees
  const total = subtotal + taxesAndFees - discount;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'rayna10') {
      setDiscount(subtotal * 0.1); // 10% discount
    } else {
      setDiscount(0);
      alert('Invalid Promo Code');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50 px-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-300" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center">
          Looks like you haven't added any tours or activities to your cart yet. Explore our top destinations and find your next adventure!
        </p>
        <Link
          to="/"
          className="px-8 py-3.5 bg-gray-800 text-white font-medium rounded-xl hover:bg-gray-700 transition-all shadow shadow-gray-800 flex items-center gap-2"
        >
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20 pt-8">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-500 mt-1">You have {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Cart Items */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 group transition-all hover:shadow-md">

                {/* Image */}
                <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={item.product?.image || 'https://images.unsplash.com/photo-1512453979436-5a50ce8c6d18?w=800&q=80'}
                    alt={item.product?.name || 'Experience'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="inline-flex px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-semibold rounded-lg mb-2">
                        {item.product?.category?.name || 'Activity'}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                        {item.product?.name || 'Experience Title'}
                      </h3>

                      {/* Options Details */}
                      <div className="text-sm text-gray-500 mt-2 space-y-1">
                        {item.options?.date && (
                          <p><span className="font-medium text-gray-700">Date:</span> {new Date(item.options.date).toLocaleDateString()}</p>
                        )}
                        <p className="flex gap-4">
                          {item.options?.adults > 0 && <span><span className="font-medium text-gray-700">Adults:</span> {item.options.adults}</span>}
                          {item.options?.children > 0 && <span><span className="font-medium text-gray-700">Children:</span> {item.options.children}</span>}
                        </p>
                        {item.options?.optionName && (
                          <p><span className="font-medium text-gray-700">Option:</span> {item.options.optionName}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Price & Quantity */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded-md transition-all disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold text-gray-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm rounded-md transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-0.5">Price</p>
                      <p className="text-lg font-bold text-gray-900">
                        {currencySymbol} {(item.options.totalPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-32">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Have a promo code?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter code (try RAYNA10)"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all uppercase"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{currencySymbol} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes & Fees <span className="text-xs text-gray-400">(5%)</span></span>
                  <span className="font-medium text-gray-900">{currencySymbol} {taxesAndFees.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span>
                    <span>-{currencySymbol} {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-xs text-gray-400">Including VAT</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-gray-900">{currencySymbol} {total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex justify-center items-center gap-2 group"
              >
                Proceed to Checkout
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">✓</span>
                  Safe and secure checkout
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Cart;
