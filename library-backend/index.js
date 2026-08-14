import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import 'dotenv/config'

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
    bookCount: async () => {
      return Book.collection.countDocuments()
    },

    authorCount: async () => {
      return Author.collection.countDocuments()
    },

    allAuthors: async () => {
      return Author.find({})
    },

    allBooks: async (root, args) => {
      const filter = {}

      if (args.genre) {
        filter.genres = args.genre
      }

      if (args.author) {
        const author = await Author.findOne({
          name: args.author,
        })

        if (!author) {
          return []
        }

        filter.author = author._id
      }

      return Book.find(filter).populate('author')
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      let author = await Author.findOne({
        name: args.author,
      })

      if (!author) {
        author = await new Author({
          name: args.author,
        }).save()
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author._id,
      })

      return book.save()
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({
        name: args.name,
      })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      return author.save()
    },
  },

  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({
        author: root._id,
      })
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