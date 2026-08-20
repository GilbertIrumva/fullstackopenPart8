import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'

const App = ({ initialToken }) => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(initialToken)

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>
          authors
        </button>

        <button onClick={() => setPage('books')}>
          books
        </button>

        {token && (
          <>
            <button onClick={() => setPage('add')}>
              add book
            </button>

            <button onClick={() => setPage('recommended')}>
              recommended
            </button>

            <button onClick={logout}>
              logout
            </button>
          </>
        )}

        {!token && (
          <button onClick={() => setPage('login')}>
            login
          </button>
        )}
      </div>

      <Authors
        show={page === 'authors'}
        token={token}
      />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add' && token} />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
      />

      <Recommended
        show={page === 'recommended' && token}
      />
    </div>
  )
}

export default App