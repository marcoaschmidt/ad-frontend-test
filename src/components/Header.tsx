"use client"

import Link from "next/link"
import Image from "next/image"
import ShoppingCart  from "../../public/cartIcon.svg"
import { useEffect, useState } from "react"
import { CartService } from "@/services/cartService"

export default function Header() {
  const [cartItemsCount, setCartItemsCount] = useState(0)

  useEffect(() => {
    const updateCartCount = () => {
      setCartItemsCount(CartService.getCartItemsCount())
    }

    updateCartCount()

    window.addEventListener("storage", updateCartCount)
    window.addEventListener("cartUpdated", updateCartCount)

    return () => {
      window.removeEventListener("storage", updateCartCount)
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  return (
    <header className="bg-[#EEEEEE]">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-semibold font-area text-[#585660]">
            GamerShop
          </Link>

          <Link href="/cart" className="relative p-2">
            <Image alt='Cart Icon' src={ShoppingCart} className="w-6 h-6 text-gray-700" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
