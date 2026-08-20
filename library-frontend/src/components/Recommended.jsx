import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommended = ({ show }) => {
  const meResult = useQuery(ME, {
    skip: !show,
  })

  const booksResult = useQuery(ALL_BOOKS, {
    skip: !show,
  })

  if (!show) {
    return null
  }

  if (meResult.loading || booksResult.loading) {
    return <div>loading...</div>
  }

  if (meResult.error) {
    return <div>Error: {meResult.error.message}</div>
  }

  if (booksResult.error) {
    return <div>Error: {booksResult.error.message}</div>
  }

  const user = meResult.data?.me
  const books = booksResult.data?.allBooks || []

  if (!user) {
    return <div>Error: user information could not be loaded</div>
  }

  const recommendedBooks = books.filter((book) =>
    book.genres.includes(user.favoriteGenre)
  )

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre{' '}
        <strong>{user.favoriteGenre}</strong>
      </p>

      <table>
        <thead>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>

        <tbody>
          {recommendedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended