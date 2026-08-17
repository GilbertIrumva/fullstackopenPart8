import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import 'dotenv/config'

import Author from './models/Author.js'
import Book from './models/book.js'
import User from './models/User.js'

const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY'

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
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

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.countDocuments()
    },

    authorCount: async () => {
      return Author.countDocuments()
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

    me: (root, args, context) => {
      return context.currentUser
    },
  },

  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        await user.save()
        return user
      } catch (error) {
        throw new GraphQLError(
          'Creating user failed',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error,
            },
          }
        )
      }
    },

    login: async (root, args) => {
      const user = await User.findOne({
        username: args.username,
      })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError(
          'Wrong credentials',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          }
        )
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return {
        value: jwt.sign(
          userForToken,
          JWT_SECRET
        ),
      }
    },

    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError(
          'Not authenticated',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          }
        )
      }

      try {
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
      } catch (error) {
        throw new GraphQLError(
          'Saving book failed',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error,
            },
          }
        )
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError(
          'Not authenticated',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
            },
          }
        )
      }

      const author = await Author.findOne({
        name: args.name,
      })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
        return author
      } catch (error) {
        throw new GraphQLError(
          'Updating author failed',
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error,
            },
          }
        )
      }
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

  context: async ({ req }) => {
    const auth = req?.headers?.authorization

    if (
      auth &&
      auth.toLowerCase().startsWith('bearer ')
    ) {
      const decodedToken = jwt.verify(
        auth.substring(7),
        JWT_SECRET
      )

      const currentUser = await User.findById(
        decodedToken.id
      )

      return { currentUser }
    }

    return {}
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})