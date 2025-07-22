import { render, screen, fireEvent } from '@testing-library/react'
import GameCard from '../GameCard'
import { CartService } from '@/services/cartService'
import type { Game } from '@/types/game'

jest.mock('@/services/cartService', () => ({
  CartService: {
    isInCart: jest.fn(),
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
  },
}))

const mockGame: Game = {
  id: '1',
  name: 'Test Game',
  genre: 'Action',
  price: 59.99,
  image: '/test-image.jpg',
  isNew: true,
}

describe('GameCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders game information correctly', () => {
    ;(CartService.isInCart as jest.Mock).mockReturnValue(false)
    
    render(<GameCard game={mockGame} />)
    
    expect(screen.getByText('Test Game')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
    expect(screen.getByText('$59.99')).toBeInTheDocument()
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('shows ADD TO CART when game is not in cart', () => {
    ;(CartService.isInCart as jest.Mock).mockReturnValue(false)
    
    render(<GameCard game={mockGame} />)
    
    expect(screen.getByText('ADD TO CART')).toBeInTheDocument()
  })

  it('shows REMOVE when game is in cart', () => {
    ;(CartService.isInCart as jest.Mock).mockReturnValue(true)
    
    render(<GameCard game={mockGame} />)
    
    expect(screen.getByText('REMOVE')).toBeInTheDocument()
  })

  it('adds game to cart when ADD TO CART is clicked', () => {
    ;(CartService.isInCart as jest.Mock).mockReturnValue(false)
    
    render(<GameCard game={mockGame} />)
    
    const addButton = screen.getByText('ADD TO CART')
    fireEvent.click(addButton)
    
    expect(CartService.addToCart).toHaveBeenCalledWith(mockGame)
  })

  it('removes game from cart when REMOVE is clicked', () => {
    ;(CartService.isInCart as jest.Mock).mockReturnValue(true)
    
    render(<GameCard game={mockGame} />)
    
    const removeButton = screen.getByText('REMOVE')
    fireEvent.click(removeButton)
    
    expect(CartService.removeFromCart).toHaveBeenCalledWith(mockGame.id)
  })
})