"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ArrowLeft from "../../../public/arrowLeft.svg";
import X from "../../../public/X.svg";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartService } from "@/services/cartService";
import type { CartItem } from "@/types/game";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const items = CartService.getCart();
    setCartItems(items);
    setTotal(CartService.getCartTotal());
  };

  const removeFromCart = (gameId: string) => {
    CartService.removeFromCart(gameId);
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="bg-gray-50">
      <Header />
      <main className="min-h-screen max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 text-base mb-8"
        >
          <Image src={ArrowLeft} alt="ArrowLeft" className="w-3 h-3 mr-2" />
          Back to Catalog
        </Link>
        <div>
          <div>
            <h1 className="sm:text-4xl text-2xl font-bold text-gray-900 mb-2">
              Your Cart
            </h1>
            <p className="text-gray-600 sm:text-2xl text-xl mb-6">
              {cartItems.length} items
            </p>
          </div>
          <div className="flex sm:flex-row flex-col justify-between">
            {cartItems.length === 0 ? (
              <div className="w-full text-center py-12">
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <Link
                  href="/"
                  className="inline-block mt-4 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="w-full max-w-[678px] space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-6 ${
                      cartItems.length > 1 && index < cartItems.length - 1
                        ? "border-b border-gray-200"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex gap-4">
                        <div className="relative w-64 h-[156px] flex-shrink-0 bg-gray-100 overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {item.isNew && (
                            <span className="absolute top-2 left-2 bg-white text-[#3B3B3B] text-xs px-2 py-1 rounded">
                              New
                            </span>
                          )}
                        </div>
                        <div className="min-w-3 min-h-3 w-3 h-3 flex-shrink-0 block sm:hidden">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-gray-600 p-1 w-full h-full flex items-center justify-center"
                          >
                            <Image src={X} alt="X" className="w-3 h-3 min-w-3 min-h-3 flex-shrink-0" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <div className="flex flex-col max-w-[335px] justify-between items-start mb-2">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                              {item.genre}
                            </p>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            {item.description ? (
                              <p className="text-sm text-gray-600 mb-3">
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                          <p className="text-lg w-full text-right font-bold text-gray-900">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="min-w-3 min-h-3 w-3 h-3 flex-shrink-0 sm:block hidden">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-gray-600 w-full h-full flex items-center justify-center"
                          >
                            <Image src={X} alt="X" className="w-3 h-3 min-w-3 min-h-3 flex-shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <div className="w-full max-w-[522px]">
                <div className="sticky top-8">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="mb-10">
                      <h2 className="sm:text-2xl text-xl font-bold text-gray-900">
                        Order Summary
                      </h2>
                      <p className="text-gray-600 text-lg">
                        {cartItems.length} items
                      </p>
                    </div>

                    <div className="space-y-3 mb-6">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-lg"
                        >
                          <span className="text-gray-600">{item.name}</span>
                          <span className="text-gray-900">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Order Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-[#585660] hover:bg-gray-800 text-white sm:text-base text-sm py-3 rounded-md font-medium transition-colors">
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
