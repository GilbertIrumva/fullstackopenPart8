
const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 4,
    required: true,
  },
  born: {
    type: Number,
  },
})

module.exports = mongoose.model('Author', authorSchema)

