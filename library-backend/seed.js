import mongoose from 'mongoose'
import 'dotenv/config'

import Author from './models/Author.js'
import Book from './models/book.js'

const authors = [
  { name: 'Robert Martin', born: 1952 },
  { name: 'Martin Fowler', born: 1963 },
  { name: 'Fyodor Dostoevsky', born: 1821 },
  { name: 'Joshua Kerievsky' },
  { name: 'Sandi Metz' },
]

const books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    genres: ['classic', 'revolution'],
  },
]

const seed = async () => {
  await mongoose.connect('mongodb+srv://Gilbert_db_user:melvin2000@cluster1.2arnqyw.mongodb.net/?appName=Cluster1')

  await Author.deleteMany({})
  await Book.deleteMany({})

  const savedAuthors = {}

  for (const author of authors) {
    const saved = await new Author(author).save()
    savedAuthors[saved.name] = saved
  }

  for (const book of books) {
    await new Book({
      title: book.title,
      published: book.published,
      genres: book.genres,
      author: savedAuthors[book.author]._id,
    }).save()
  }

  console.log('Database seeded')

  await mongoose.connection.close()
}

seed()