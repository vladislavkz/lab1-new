import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import UserTable from './UserTable'

// Мокаем fetch
global.fetch = vi.fn()

describe('UserTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders button and does not show table initially', () => {
    render(<UserTable />)
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument()
    expect(screen.queryByText(/иван/i)).not.toBeInTheDocument()
  })

  test('loads users and displays them when button is clicked', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
    ]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    })

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    expect(await screen.findByText(/иван иванов/i)).toBeInTheDocument()
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument()
  })

  test('shows error when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  test('sorts users by name when name header is clicked', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Борис Борисов',
        email: 'boris@example.com',
        phone: '+7 (999) 111-11-11',
        website: 'boris.com',
      },
      {
        id: 2,
        name: 'Анна Аннова',
        email: 'anna@example.com',
        phone: '+7 (999) 222-22-22',
        website: 'anna.com',
      },
    ]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    })

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    await waitFor(() => {
      expect(screen.getByText(/анна аннова/i)).toBeInTheDocument()
    })

    // Проверяем что есть заголовок таблицы
    expect(screen.getByRole('columnheader', { name: /имя/i })).toBeInTheDocument()
  })

  test('shows sort icon in name header', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
    ]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    })

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    await waitFor(() => {
      expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
    })
    
    expect(screen.getByRole('columnheader', { name: /имя/i })).toBeInTheDocument()
  })
})
