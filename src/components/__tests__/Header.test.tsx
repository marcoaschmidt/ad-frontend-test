/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react'
import Header from '../Header'
import { CartService } from '@/services/cartService'

jest.mock('@/services/cartService', () => ({
  CartService: {
    getCartItemsCount: jest.fn(),
  },
}))

jest.mock('next/link', () => {
  return function MockedLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

jest.mock('next/image', () => {
  return function MockedImage({ alt, ...props }: any) {
    return <img alt={alt} {...props} />
  }
})

describe('Header', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    window.addEventListener = jest.fn()
    window.removeEventListener = jest.fn()
  })

  it('renders header with logo and cart link', () => {
    ;(CartService.getCartItemsCount as jest.Mock).mockReturnValue(0)
    
    render(<Header />)
    
    expect(screen.getByText('GamerShop')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Cart Icon' })).toBeInTheDocument()
  })

  it('shows cart items count when cart has items', () => {
    ;(CartService.getCartItemsCount as jest.Mock).mockReturnValue(3)
    
    render(<Header />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show cart items count when cart is empty', () => {
    ;(CartService.getCartItemsCount as jest.Mock).mockReturnValue(0)
    
    render(<Header />)
    
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('displays correct cart items count for large numbers', () => {
    ;(CartService.getCartItemsCount as jest.Mock).mockReturnValue(99)
    
    render(<Header />)
    
    expect(screen.getByText('99')).toBeInTheDocument()
  })

  it('sets up event listeners on mount', () => {
    ;(CartService.getCartItemsCount as jest.Mock).mockReturnValue(0)
    
    render(<Header />)
    
    expect(window.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('cartUpdated', expect.any(Function))
  })

  it('has correct navigation links', () => {
    ;(CartService.getCartItemsCount as jest.Mock).mockReturnValue(0)
    
    render(<Header />)
    
    const homeLink = screen.getByText('GamerShop').closest('a')
    const cartLink = screen.getByRole('img', { name: 'Cart Icon' }).closest('a')
    
    expect(homeLink).toHaveAttribute('href', '/')
    expect(cartLink).toHaveAttribute('href', '/cart')
  })

  it('applies correct CSS classes', () => {
    ;(CartService.getCartItemsCount as jest.Mock).mockReturnValue(5)
    
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('bg-[#EEEEEE]')
    
    const cartBadge = screen.getByText('5')
    expect(cartBadge).toHaveClass('absolute', '-top-1', '-right-1', 'bg-red-500', 'text-white')
  })
})