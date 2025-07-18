import type { Game, CartItem } from "@/types/game"

export class CartService {
  private static STORAGE_KEY = "gamershop_cart"

  static getCart(): CartItem[] {
    if (typeof window === "undefined") return []

    try {
      const cart = localStorage.getItem(this.STORAGE_KEY)
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  }

  static saveCart(cart: CartItem[]): void {
    if (typeof window === "undefined") return

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
  }

  static addToCart(game: Game): void {
    const cart = this.getCart()
    const existingItem = cart.find((item) => item.id === game.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...game, quantity: 1 })
    }

    this.saveCart(cart)
  }

  static removeFromCart(gameId: string): void {
    const cart = this.getCart()
    const updatedCart = cart.filter((item) => item.id !== gameId)
    this.saveCart(updatedCart)
  }

  static isInCart(gameId: string): boolean {
    const cart = this.getCart()
    return cart.some((item) => item.id === gameId)
  }

  static getCartTotal(): number {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  static getCartItemsCount(): number {
    const cart = this.getCart()
    return cart.reduce((total, item) => total + item.quantity, 0)
  }
}
