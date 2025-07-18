"use client";

import Image from "next/image";
import type { Game } from "@/types/game";
import { CartService } from "@/services/cartService";
import { useState, useEffect } from "react";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    setIsInCart(CartService.isInCart(game.id));
  }, [game.id]);

  const handleCartAction = () => {
    if (isInCart) {
      CartService.removeFromCart(game.id);
      setIsInCart(false);
    } else {
      CartService.addToCart(game);
      setIsInCart(true);
    }

    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 pt-6">
        <div className="relative aspect-video bg-gray-100">
          <Image
            src={game.image || "/placeholder.svg"}
            alt={game.name}
            fill
            className="object-cover rounded-t-2xl"
            unoptimized
          />
          {game.isNew && (
            <span className="absolute top-3 left-3 bg-white text-[#3B3B3B] text-base px-2 py-1 rounded">
              New
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
          {game.genre}
        </p>
        <div className="flex justify-between items-start mb-2">
          <p className="font-semibold text-gray-900">{game.name}</p>
          <p className="text-lg font-bold text-gray-900">
            ${game.price.toFixed(2)}
          </p>
        </div>
        <button
          onClick={handleCartAction}
          className={`px-4 py-4 text-sm w-full font-medium rounded transition-colors ${
            isInCart
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-white hover:bg-[#3B3B3B] text-[#3B3B3B] hover:text-white border border-[#3B3B3B]"
          }`}
        >
          {isInCart ? "REMOVE" : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}
