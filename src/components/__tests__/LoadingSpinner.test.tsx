import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status', { name: 'Loading' })
    expect(spinner).toBeInTheDocument()
  })

  it('has correct accessibility attributes', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveAttribute('aria-label', 'Loading')
  })

  it('applies correct CSS classes for styling', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass(
      'animate-spin',
      'rounded-full',
      'h-12',
      'w-12',
      'border-b-2',
      'border-gray-900'
    )
  })

  it('applies correct container CSS classes', () => {
    render(<LoadingSpinner />)
    
    const container = screen.getByRole('status').parentElement
    expect(container).toHaveClass(
      'flex',
      'justify-center',
      'items-center',
      'py-12'
    )
  })

  it('renders as a div with proper structure', () => {
    const { container } = render(<LoadingSpinner />)
    
    const outerDiv = container.firstChild
    expect(outerDiv).toHaveClass('flex', 'justify-center', 'items-center', 'py-12')
    
    const spinner = outerDiv?.firstChild
    expect(spinner).toHaveClass('animate-spin', 'rounded-full')
  })
})