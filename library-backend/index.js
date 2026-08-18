const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
require('dotenv').config()

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const MONGODB_URI = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log(
      'error connecting to MongoDB:',
      error.message
    )
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: {
    port: 4000,
  },

  context: async ({ req }) => {
    const auth = req.headers.authorization

    if (!auth || !auth.startsWith('Bearer ')) {
      return {}
    }

    try {
      const decodedToken = jwt.verify(
        auth.substring(7),
        process.env.JWT_SECRET
      )

      const currentUser = await User.findById(
        decodedToken.id
      )

      return {
        currentUser,
      }
    } catch (error) {
      return {}
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})