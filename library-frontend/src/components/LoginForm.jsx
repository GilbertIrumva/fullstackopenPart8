import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { LOGIN } from '../queries'

const LoginForm = ({ setToken, setPage, show }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const [login] = useMutation(LOGIN)

  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    try {
      const result = await login({
        variables: {
          username,
          password,
        },
      })

      const token = result.data.login.value

      localStorage.setItem('library-user-token', token)
      setToken(token)

      // After successful login, go back to the authors page
      setPage('authors')

      setUsername('')
      setPassword('')
      setError(null)
    } catch (error) {
      setError('login failed')
    }
  }

  return (
    <div>
      <h2>login</h2>

      {error && <div>{error}</div>}

      <form onSubmit={submit}>
        <div>
          <label htmlFor="username">
            username
          </label>

          <input
            id="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">
            password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>

        <button type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm