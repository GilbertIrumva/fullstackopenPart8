import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'

const App = ({ initialToken }) => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(initialToken)

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    setPage('authors')
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

        {token ? (
          <>
            <button onClick={() => setPage('add')}>
              add book
            </button>

            <button onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>
            login
          </button>
        )}
      </div>

      <Authors
        show={page === 'authors'}
        loggedIn={Boolean(token)}
      />

      <Books show={page === 'books'} />

      {token && (
        <NewBook show={page === 'add'} />
      )}

      {!token && page === 'login' && (
        <LoginForm setToken={setToken} />
      )}
    </div>
  )
}

export default App