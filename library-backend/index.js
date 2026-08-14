import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import 'dotenv/config'
import mongoose from 'mongoose'

import Author from './models/Author.js'
import Book from './models/book.js'

const MONGODB_URI = 'mongodb+srv://Gilbert_db_user:melvin2000@cluster1.2arnqyw.mongodb.net/?appName=Cluster1'

mongoose.set('strictQuery', false)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const typeDefs = `#graphql
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: async () =>
      Book.collection.countDocuments(),

    authorCount: async () =>
      Author.collection.countDocuments(),

    allBooks: async () => {
      return Book.find({}).populate('author')
    },

    allAuthors: async () => {
      return Author.find({})
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({
        name: args.author,
      })

      if (!author) {
        author = new Author({
          name: args.author,
        })

        await author.save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      })

      await book.save()

      return await book.populate('author')
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo
      await author.save()
      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})