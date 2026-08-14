import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: String,
  born: Number,
})

export default mongoose.model('Author', schema)