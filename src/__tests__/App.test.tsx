import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import App from '../App.jsx'

describe('App Component', () => {
  test('renders main heading', () => {
    render(<App />)
    const headingElement = screen.getByText(/Vite \+ React/i) // Убрали "on GitHub Pages! 🚀"
    expect(headingElement).toBeInTheDocument()
  })

  test('renders Vite and React logos', () => {
    render(<App />)
    const viteLogo = screen.getByAltText('Vite logo')
    const reactLogo = screen.getByAltText('React logo')
    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
  })

  test('renders Counter component', () => {
    render(<App />)
    const counterElement = screen.getByText(/Counter component is working!/i)
    expect(counterElement).toBeInTheDocument()
  })
})