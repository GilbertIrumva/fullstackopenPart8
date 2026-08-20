import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'


const Recommended = (props) => {
  const meResult = useQuery(ME)
  const booksResult = useQuery(ALL_BOOKS)

  if (!props.show) {
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

  const user = meResult.data.me
  const books = booksResult.data.allBooks

  const recommendedBooks = books.filter(
    (book) => book.genres.includes(user.favoriteGenre)
  )

  return (
    <div>
      <h2>books in your favourite genre</h2>

      <p>
        books in your favourite genre <strong>{user.favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>

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