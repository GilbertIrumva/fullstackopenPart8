import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  title: String,
  published: Number,

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },

  genres: [String],
})

export default mongoose.model('Book', schema)