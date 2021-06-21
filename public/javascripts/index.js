const axios = require('axios');
const d3 = require('d3');
const gAPI = require('google-trends-api');

document.addEventListener('DOMContentLoaded', () => {
    
    

    gAPI.autoComplete({keyword: 'Back to School'})
    .then(function(results) {
      console.log(results);
    })
    .catch(function(err) {
      console.error(err);
    })

    // let info = document.createElement("div");
    // info.appendChild(document.createTextNode());
    // document.body.insertBefore(info, document.getElementById('main'))
    
    // let isbn = '0201558025';
    // axios.get(`/books/${isbn}`)
    // .then((response) => {
    //     let info = document.createElement("div");

    //     for (id in response.data) {
    //         info.appendChild(document.createTextNode(response.data[id].number_of_pages));
    //         console.log(response.data[id].number_of_pages);
    //     }

    //     document.body.insertBefore(info, document.getElementById('main'))

    //     // console.log(response.data); 
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });

    // let query = "grace hopper";
    // axios.get(`/search?string=${query}`)
    // .then((response) => {
    //     console.log(response);
    // })
    // .catch(function (error) {
    //     console.log(error);
    // });
    
})
