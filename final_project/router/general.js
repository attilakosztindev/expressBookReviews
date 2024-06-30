const express = require('express')
const axios = require('axios')
let books = require("./booksdb.js")
let isValid = require("./auth_users.js").isValid
let users = require("./auth_users.js").users

const public_users = express.Router()
const app = express()

app.use(express.json())

//Register customer
public_users.post("/register", (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "Username and password are required!" })
  if (users[username]) return res.status(400).json({ message: "This customer already exists!" })
  users[username] = { username, password }
  return res.status(200).json({ message: "Customer successfully registered. Now you can login!" })
})

// Get the book list available in the database
public_users.get('/', (req, res) => {
  if (!books) return res.status(400).json({ message: "The Books database is not established!" })
  return res.status(200).json(books)
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params
  const book = books[isbn]
  if (!book) return res.status(404).json({ message: "The requested book is not found!" })
  return res.status(200).json({book})
})

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params
  const filteredBooks = Object.values(books).filter(book => book.author === author)
  if (filteredBooks.length === 0) return res.status(404).json({ message: "No books found by this author!" })
  return res.status(200).json({ booksbyauthor: filteredBooks.map((book, index) => ({
    isbn: index + 1,
    title: filteredBooks[index].title,
    reviews: filteredBooks[index].reviews
  }))})
})

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params
  const filteredBooks = Object.entries(books)
  .filter(([isbn, book]) => book.title.toLowerCase() === title.toLowerCase())
  .map(([isbn, book]) => {
    const { title, ...props } = book
    return { isbn, ...props }
  })
  if (filteredBooks.length === 0) return res.status(404).json({ message: "No books found with this title!" })
  return res.status(200).json({ booksbytitle: filteredBooks })
})

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params
  const book = books[isbn]
  if (!book) return res.status(404).json({ message: "The requested book is not found!" })
  return res.status(200).json(book.reviews)
})

module.exports.general = public_users

//Implementation with async/await functions using Axios

/*const BOOKS_API_URL = 'http://localhost:5000'

// Get the book list available in the database
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(BOOKS_API_URL)
    const books = response.data
    if (!books) return res.status(400).json({ message: "The Books database is not established!" })
    res.status(200).json(books)
  } catch (error) {
    res.status(500).json({ message: "Error fetching books data!" })
  }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params
  try {
    const response = await axios.get(`${BOOKS_API_URL}/${isbn}`)
    const book = response.data
    if (!book) return res.status(404).json({ message: "The requested book is not found!" })
    res.status(200).json({ book })
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data!" })
  }
})

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params
  try {
    const response = await axios.get(BOOKS_API_URL)
    const books = response.data
    const filteredBooks = Object.values(books).filter(book => book.author === author)
    if (filteredBooks.length === 0) return res.status(404).json({ message: "No books found by this author!" })
    res.status(200).json({ booksbyauthor: filteredBooks.map((book, index) => ({
        isbn: index + 1,
        title: filteredBooks[index].title,
        reviews: filteredBooks[index].reviews
      }))})
  } catch (error) {
    res.status(500).json({ message: "Error fetching books data!" })
  }
})

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params
  try {
    const response = await axios.get(BOOKS_API_URL)
    const books = response.data
    const filteredBooks = Object.entries(books)
            .filter(([isbn, book]) => book.title.toLowerCase() === title.toLowerCase())
            .map(([isbn, book]) => {
              const { title, ...props } = book
              return { isbn, ...props }
            })
    if (filteredBooks.length === 0) return res.status(404).json({ message: "No books found with this title!" })
    res.status(200).json({ booksbytitle: filteredBooks })
  } catch (error) {
    res.status(500).json({ message: "Error fetching books data!" })
  }
})

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params
  try {
    const response = await axios.get(`${BOOKS_API_URL}/${isbn}`)
    const book = response.data
    if (!book) return res.status(404).json({ message: "The requested book is not found!" })
    res.status(200).json(book.reviews)
  } catch (error) {
    res.status(500).json({ message: "Error fetching book data!" })
  }
})*/