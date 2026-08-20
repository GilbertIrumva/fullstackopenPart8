import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN)

  const submit = async (event) => {
    event.preventDefault()

    const result = await login({
      variables: {
        username,
        password,
      },
    })

    const token = result.data.login.value

    console.log('1. TOKEN FROM LOGIN:', token)

    localStorage.setItem('library-user-token', token)

    console.log(
      '2. TOKEN IN STORAGE:',
      localStorage.getItem('library-user-token')
    )

    setToken(token)

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>login</h2>

      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>

        <div>
          password
          <input
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