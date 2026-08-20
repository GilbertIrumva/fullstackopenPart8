import { useEffect, useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'

import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const result = useQuery(ALL_AUTHORS)

  const authors = result.data?.allAuthors || []

  useEffect(() => {
    if (authors.length > 0 && !name) {
      setName(authors[0].name)
    }
  }, [authors, name])

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  const submit = async (event) => {
    event.preventDefault()

    await editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    })

    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>

          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.loggedIn && (
        <>
          <h2>Set birthyear</h2>

          <form onSubmit={submit}>
            <div>
              <label htmlFor="author-name">
                name
              </label>

              <select
                id="author-name"
                name="name"
                value={name}
                onChange={({ target }) => setName(target.value)}
              >
                {authors.map((author) => (
                  <option
                    key={author.name}
                    value={author.name}
                  >
                    {author.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="born">
                born
              </label>

              <input
                id="born"
                name="born"
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>

            <button type="submit">
              update author
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors