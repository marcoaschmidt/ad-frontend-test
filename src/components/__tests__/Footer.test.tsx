/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

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

describe('Footer', () => {
  it('renders footer with logo', () => {
    render(<Footer />)
    
    expect(screen.getByRole('img', { name: 'Apply Logo' })).toBeInTheDocument()
  })

  it('has correct link to home page', () => {
    render(<Footer />)
    
    const logoLink = screen.getByRole('img', { name: 'Apply Logo' }).closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('applies correct CSS classes', () => {
    render(<Footer />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveClass('bg-[#404040]', 'text-white', 'py-14')
  })

  it('centers the logo horizontally', () => {
    render(<Footer />)
    
    const logoContainer = screen.getByRole('img', { name: 'Apply Logo' }).closest('div')
    expect(logoContainer).toHaveClass('flex', 'justify-center')
  })

  it('renders as footer element', () => {
    render(<Footer />)
    
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})