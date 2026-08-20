import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const genres = [
  'refactoring',
  'agile',
  'patterns',
  'design',
  'classic',
  'crime',
  'revolution',
  'graphql',
  'web',
  'testing',
]

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre,
    },
  })

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  const books = result.data.allBooks

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setGenre(null)}>
          all genres
        </button>

        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Books