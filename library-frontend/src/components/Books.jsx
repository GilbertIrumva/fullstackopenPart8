import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = (props) => {
  const [genre, setGenre] = useState(null)

  const result = useQuery(ALL_BOOKS)

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

  const genres = [
    ...new Set(books.flatMap((book) => book.genres)),
  ]

  const filteredBooks = genre
    ? books.filter((book) => book.genres.includes(genre))
    : books

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

          {filteredBooks.map((book) => (
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