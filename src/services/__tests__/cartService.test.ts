import { CartService } from '../cartService'
import type { Game, CartItem } from '@/types/game'

const mockGame: Game = {
  id: '1',
  name: 'Test Game',
  genre: 'Action',
  price: 59.99,
  image: '/test-image.jpg',
  description: 'A test game',
  isNew: true,
}

const mockGame2: Game = {
  id: '2',
  name: 'Test Game 2',
  genre: 'RPG',
  price: 39.99,
  image: '/test-image2.jpg',
  description: 'Another test game',
  isNew: false,
}

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('CartService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('getCart', () => {
    it('returns empty array when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const cart = CartService.getCart()
      
      expect(cart).toEqual([])
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('gamershop_cart')
    })

    it('returns parsed cart from localStorage', () => {
      const mockCart: CartItem[] = [{ ...mockGame, quantity: 2 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockCart))
      
      const cart = CartService.getCart()
      
      expect(cart).toEqual(mockCart)
    })

    it('returns empty array when localStorage contains invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')
      
      const cart = CartService.getCart()
      
      expect(cart).toEqual([])
    })

  })

  describe('saveCart', () => {
    it('saves cart to localStorage', () => {
      const mockCart: CartItem[] = [{ ...mockGame, quantity: 1 }]
      
      CartService.saveCart(mockCart)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gamershop_cart',
        JSON.stringify(mockCart)
      )
    })

  })

  describe('addToCart', () => {
    it('adds new game to empty cart', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      CartService.addToCart(mockGame)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gamershop_cart',
        JSON.stringify([{ ...mockGame, quantity: 1 }])
      )
    })

    it('increases quantity when game already exists in cart', () => {
      const existingCart: CartItem[] = [{ ...mockGame, quantity: 1 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.addToCart(mockGame)
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gamershop_cart',
        JSON.stringify([{ ...mockGame, quantity: 2 }])
      )
    })

    it('adds new game when different game exists in cart', () => {
      const existingCart: CartItem[] = [{ ...mockGame, quantity: 1 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.addToCart(mockGame2)
      
      const expectedCart = [
        { ...mockGame, quantity: 1 },
        { ...mockGame2, quantity: 1 }
      ]
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gamershop_cart',
        JSON.stringify(expectedCart)
      )
    })
  })

  describe('removeFromCart', () => {
    it('removes game from cart', () => {
      const existingCart: CartItem[] = [
        { ...mockGame, quantity: 1 },
        { ...mockGame2, quantity: 2 }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.removeFromCart('1')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gamershop_cart',
        JSON.stringify([{ ...mockGame2, quantity: 2 }])
      )
    })

    it('does nothing when game is not in cart', () => {
      const existingCart: CartItem[] = [{ ...mockGame, quantity: 1 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      CartService.removeFromCart('nonexistent')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'gamershop_cart',
        JSON.stringify(existingCart)
      )
    })
  })

  describe('isInCart', () => {
    it('returns true when game is in cart', () => {
      const existingCart: CartItem[] = [{ ...mockGame, quantity: 1 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const result = CartService.isInCart('1')
      
      expect(result).toBe(true)
    })

    it('returns false when game is not in cart', () => {
      const existingCart: CartItem[] = [{ ...mockGame, quantity: 1 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const result = CartService.isInCart('2')
      
      expect(result).toBe(false)
    })

    it('returns false when cart is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const result = CartService.isInCart('1')
      
      expect(result).toBe(false)
    })
  })

  describe('getCartTotal', () => {
    it('returns 0 for empty cart', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const total = CartService.getCartTotal()
      
      expect(total).toBe(0)
    })

    it('calculates total correctly for single item', () => {
      const existingCart: CartItem[] = [{ ...mockGame, quantity: 2 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const total = CartService.getCartTotal()
      
      expect(total).toBe(119.98)
    })

    it('calculates total correctly for multiple items', () => {
      const existingCart: CartItem[] = [
        { ...mockGame, quantity: 2 },
        { ...mockGame2, quantity: 1 } 
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const total = CartService.getCartTotal()
      
      expect(total).toBe(159.97)
    })
  })

  describe('getCartItemsCount', () => {
    it('returns 0 for empty cart', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      
      const count = CartService.getCartItemsCount()
      
      expect(count).toBe(0)
    })

    it('returns correct count for single item', () => {
      const existingCart: CartItem[] = [{ ...mockGame, quantity: 3 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const count = CartService.getCartItemsCount()
      
      expect(count).toBe(3)
    })

    it('returns correct count for multiple items', () => {
      const existingCart: CartItem[] = [
        { ...mockGame, quantity: 2 },
        { ...mockGame2, quantity: 3 }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingCart))
      
      const count = CartService.getCartItemsCount()
      
      expect(count).toBe(5)
    })
  })
})