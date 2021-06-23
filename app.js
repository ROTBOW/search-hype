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


app.get('/search/:term', (req, res) => {
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


app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})
