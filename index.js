// Load .env file
require('dotenv').config();

// Load required libraries from node_modules
const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const withQuery = require('with-query').default

// USE X-Api-Key HTTP header to hide API KEY

// Configure the environment
const PORT = parseInt(process.env.PORT) || 3000

// Create an instance of the express application
const app = express()

// Configure handlebars to manage views
app.engine('hbs', hbs({ defaultLayout: 'default.hbs' }))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

// Configure the static files
app.use(express.static(__dirname + '/static'))

const headers = {'X-Api-Key': process.env.API_KEY }

// var cache = {"":{
//   keyword: "asd",
//   country: "sg",
//   category: "abc",
//   result : {}
// }

// Prefix match
app.get('/search', async (req, res) => {
  console.log('--- New Req ---')
  console.log('search keyword: ', req.query.keyword)
  console.log('search region: ', req.query.country)
  console.log('search category: ', req.query.category)
  const url = withQuery(
    process.env.ENDPOINT,
    {
      q: req.query.keyword,
      country: req.query.country,
      category: req.query.category
    })
  console.log('search url: ', url)
  const results = await fetch(url, { headers })
  const headlines = await results.json()
  console.log(headlines.totalResults)
  if (headlines.totalResults > 0) {
    res.render('index', {
      articleArr: headlines.articles,
      searchKeyword: req.query.keyword,
      searchRegion: req.query.country,
      searchCategory: req.query.category
    })
    res.status(201)
  } else {
    console.log('--- NO RESULTS ---')
    console.log(' ')
    res.render('index')
  }
})

app.get('/', (req, res) => {
  console.log('--- HOME NO REQ ---')
  console.log(' ')
  res.status(200)
  res.type('text/html')
  res.render('index')
})

// Start express
app.listen(PORT, () => { // first parameter = port number
  console.log(`Application started on port ${PORT} at ${new Date()}`)
})
