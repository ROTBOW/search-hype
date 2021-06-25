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

app.get('/IOTC/:term1/:term2', (req, res) => {
  let dataset1;
  let dataset2;
  let bestTime = {date: null, value: 0};
  let worstTime = {date: null, value: 100};
  let dataToSendBack = {data: []};

  let secondTerm = (req.params.term2 === "<INVALID-SEARCH>") ? '' : req.params.term2;

  gAPI.interestOverTime({keyword: `${req.params.term1}`})
    .then(result =>{
      dataset1 = JSON.parse(result);
    })
    .then(() => {
    gAPI.interestOverTime({keyword: `${req.params.term2}`})
      .then(result =>{
        dataset2 = JSON.parse(result);
      })
      .then(() => {

        let tempArr = []
        for (let id in dataset1.default.timelineData) {
          dataClip = dataset1.default.timelineData[id];
          tempData = {
            date: new Date(dataClip.formattedTime),
            value: Number(dataClip.value)
          }
          
          if (tempData.value >= bestTime.value) bestTime = tempData;
          if (tempData.value <= worstTime.value) worstTime = tempData;
          
          tempArr.push(tempData)
        }
        dataToSendBack.data.push(tempArr);

        tempArr = []
        for (let id in dataset2.default.timelineData) {
          dataClip = dataset2.default.timelineData[id];
          tempData = {
            date: new Date(dataClip.formattedTime),
            value: Number(dataClip.value)
          } 
          tempArr.push(tempData)
        }
        dataToSendBack.data.push(tempArr);

        

        


        dataToSendBack['bestTime'] = bestTime;
        dataToSendBack['worstTime'] = worstTime;
        res.send(dataToSendBack);
      })
  })

    
})


app.listen(PORT, () => {
  console.log(__dirname);
  console.log(`listening on ${PORT}`)
})
