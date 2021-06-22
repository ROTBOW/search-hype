const axios = require('axios');
const d3 = require('d3');
const topojson = require('topojson');



document.addEventListener('DOMContentLoaded', () => {
    let dataVis = document.getElementsByClassName('vis-div')[0];
    
    const svg = d3.select(".vis-div").append('svg')
        .attr('width', 800)
        .attr('height', 800)
        .style('background-color', '#666666')
    

    // let term = 'magic'
    // axios.get(`/search/${term}`)
    //     .then(response => {
    //         // console.log(response);
    //         dataVis.appendChild(document.createTextNode(response));
    //     })
    //     .catch(function (err) {
    //         console.log(err);
    //     })

})
