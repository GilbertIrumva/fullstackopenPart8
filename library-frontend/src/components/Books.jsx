import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const result = useQuery(ALL_BOOKS, {
    variables: {
      genre,
    },
    fetchPolicy: 'network-only',
  })

  if (!props.show) {
    return null
  }

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

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <h3>
          in genre {genre}
        </h3>
      )}

      {result.loading && (
        <div>loading...</div>
      )}

      {result.error && (
        <div>Error: {result.error.message}</div>
      )}

      {!result.loading && !result.error && (
        <table>
          <tbody>
            <tr>
              <th>title</th>
              <th>author</th>
              <th>published</th>
            </tr>

            {result.data.allBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        {genres.map((genreName) => (
          <button
            key={genreName}
            onClick={() => setGenre(genreName)}
          >
            {genreName}
          </button>
        ))}

        <button onClick={() => setGenre(null)}>
          all genres
        </button>
      </div>
    </div>
  )
}

export default Books