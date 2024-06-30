const express = require('express')
const session = require('express-session')
const jwt = require('jsonwebtoken')
let books = require("./booksdb.js")

const regd_users = express.Router()
const app = express()

const secretKey = "7607612b820df9b239412bba76c67efecd641ce99ee576652d929cde2125de6a"

let users = {}

app.use(express.json())

// Check if the username exists
const isValid = (username) => {
  return users.hasOwnProperty(username)
}

// Check if username and password match the records
const authenticatedUser = (username, password) => {
  return users[username] && users[username].password === password
}

// User registration
app.post("/register", (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" })
  if (isValid(username)) return res.status(400).json({ message: "Username already exists" })
  users[username] = { username, password }
  return res.status(200).json({ message: "User successfully registered. Now you can login!" })
})

// Only registered users can log in
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ message: "Username and password are required!" })
  if (!authenticatedUser(username, password)) return res.status(401).json({ message: "Invalid credentials!" })
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' })
  req.session.token = token
  return res.status(200).send("Customer successfully logged in")
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params
  const { review } = req.query
  const username = req.user.username
  if (!books[isbn]) return res.status(404).json({ message: 'The requested book is not found!' })
  if (!books[isbn].reviews) books[isbn].reviews = {}
  books[isbn].reviews[username] = review
  return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`)
})

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params
  const username = req.user.username
  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) return res.status(404).json({ message: 'The review is not found!' })
  delete books[isbn].reviews[username]
  return res.status(200).send(`Reviews for ISBN ${isbn} posted by the user ${username} deleted.`)
})

module.exports = { authenticated: regd_users, isValid, users }
