const express = require('express');
const app = express();
const path = require('path');
const fetch = require('node-fetch');
const gAPI = require('google-trends-api');
const PORT = process.env.PORT || 3000; // process.env accesses heroku's environment variables

app.use(express.static('public'))

app.get('/', (request, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'))
})

// create route to get single book by its isbn
// app.get('/books/:isbn', (request, response) => {
//   // make api call using fetch
//   fetch(`http://openlibrary.org/api/books?bibkeys=ISBN:${request.params.isbn}&format=json&jscmd=data`)
//   .then((response) => {
//       return response.text();
//   }).then((body) => {
//       let results = JSON.parse(body)
//       console.log(results)   // logs to server
//       response.send(results) // sends to frontend
//     });
// });

app.get('/search/:term', (req, res) => {
  // gAPI.autoComplete({keyword: `${req.params.term}`})
  gAPI.autoComplete({keyword: `${req.params.term}`})
    .then(result => {
      res.send(result);
    })
})


app.get('/search/daily', (req, res) => {
  gAPI.dailyTrends({geo: 'US'})
    .then(result => {
      res.send(result);
    })
})

app.get('/IOT/:term', (req, res) => {
  gAPI.interestOverTime({keyword: `${req.params.term}`})
    .then(result => {
      res.send(result);
    })
})
// create a search route
// app.get('/search', (request, response) => {
//   fetch(`http://openlibrary.org/search.json?q=${request.query.string}`)
//   .then((response) => {
//       return response.text();
//   }).then((body) => {
//       let results = JSON.parse(body)
//       console.log(results)
//       response.send(results)
//     });
// });

app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})
