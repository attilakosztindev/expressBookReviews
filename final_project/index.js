const express = require('express')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const customer_routes = require('./router/auth_users.js').authenticated
const genl_routes = require('./router/general.js').general

const app = express()
const JWT_SECRET = '7607612b820df9b239412bba76c67efecd641ce99ee576652d929cde2125de6a'

app.use(express.json())

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  const token = req.session.token
  if (!token) return res.status(401).json({ message: "Access denied!" })
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) { return res.status(403).json({ message: "Invalid token!" }) }
    req.user = user
    next()
  })
})

const PORT = 5000

app.use("/customer", customer_routes)
app.use("/", genl_routes)

app.listen(PORT,()=>console.log("Server is running"))