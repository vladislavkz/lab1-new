import { useState, useMemo } from 'react'

type User = {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

type SortDirection = 'asc' | 'desc' | null

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User
    direction: SortDirection
  }>({ key: 'name', direction: null })

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: User[] = await response.json()
      setUsers(data)
      setSortConfig({ key: 'name', direction: null }) // Сброс сортировки при новой загрузке
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (key: keyof User) => {
    let direction: SortDirection = 'asc'
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc'
      } else if (sortConfig.direction === 'desc') {
        direction = null
      } else {
        direction = 'asc'
      }
    }
    
    setSortConfig({ key, direction })
  }

  const sortedUsers = useMemo(() => {
    if (!sortConfig.direction) return users
    
    return [...users].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [users, sortConfig])

  const getSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) return '↕️'
    if (sortConfig.direction === 'asc') return '↑'
    if (sortConfig.direction === 'desc') return '↓'
    return '↕️'
  }

  return (
    <div className="user-table-container">
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить пользователей'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {users.length > 0 && (
        <table
          border={1}
          style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              <th 
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('name')}
              >
                Имя {getSortIcon('name')}
              </th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Сайт</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <a href={`http://${user.website}`} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}