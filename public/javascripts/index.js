const axios = require('axios');
const d3 = require('d3');
const d3Collection = require('d3-collection');

const randomWords = [
    'love',
    'beauty',
    'music',
    'progamming',
    'exodia the forbidden one',
    'javascript',
    'search term',
    'hype'
]


const trialEvent = searchInput => {
    return new CustomEvent('change', {detail: { value: `${searchInput}` } })
}


const formatDate = date => {

    return `${[
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sept',
        'Oct',
        'Nov',
        'Dec'
    ][date.getMonth()]} ${date.getFullYear()}`
}


const arrowTimeout = function () {
    let hoverArrow = document.getElementsByClassName('hover-arrow')[0];
    return new Promise((res, rej) => {
        setTimeout(() => {
            hoverArrow.classList.add('hide-me');
            res(hoverArrow);
        }, 2000);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    let searchInput = document.getElementById('search-input');
    let searchHeaders = document.getElementsByClassName('search-title');
    let visDiv = document.getElementsByClassName('vis-div')[0];
    let secondInput = document.getElementById('second-input');
    let searchForm = document.getElementById('search-form');

    arrowTimeout()
        .then( div => {
            setTimeout(() => {
                div.classList.add('remove-me');
            }, 5000)
        })

    searchForm.addEventListener('submit', e => {
        console.log('this is from form log: ', e);
    })

    

    document.addEventListener('change', e => {
        let searchTerm = searchInput.value;
        let compareTerm = secondInput.value;

        if (typeof e.detail != 'undefined') {
            searchTerm = e.detail.value;
        } else if (e.target.value === '') {
            secondInput.classList.remove('show-search')
            secondInput.value = '';
            document.dispatchEvent(trialEvent(randomWords[Math.floor(Math.random()*randomWords.length)]));
            return
        } else {
            secondInput.classList.add('show-search')
        }

        searchHeaders[0].innerHTML = `${searchTerm}`
        searchHeaders[1].innerHTML = `${searchTerm}`
        visDiv.innerHTML = null;

    
    let data = new Array();
    if (compareTerm === '') compareTerm = '<INVALID-SEARCH>'
    axios.get(`/IOTC/${searchTerm}/${compareTerm}`)
        .then (results => {
            data = results.data;
            
            data.data[0].forEach(item => {
                item.date = new Date(item.date);
            })
            data.data[1].forEach(item => {
                item.date = new Date(item.date);
            })
            
            
            window.data = data;
            const margin = ({top: 20, right: 30, bottom: 30, left: 40});
            const height = 500;
            const width = 500;
         

            let xAxis = g => g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

            let yAxis = g => g
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
                .call(g => g.select(".domain").remove())
                .call(g => g.select(".tick:last-of-type text").clone()
                    .attr("x", 3)
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .text(data.data[0].y))

            const y = d3.scaleLinear()
                .domain([0, d3.max(data.data[0], d => d.value)]).nice()
                .range([height - margin.bottom, margin.top])

            const x = d3.scaleUtc()
                .domain(d3.extent(data.data[0], d => d.date))
                .range([margin.left, width - margin.right])

            const line = d3.line()
                .defined(d => !isNaN(d.value))
                .x(d => x(d.date))
                .y(d => y(d.value))



                
            function chart() {
                const svg = d3.select(".vis-div").append('svg')
                    .attr("viewBox", [0, 0, width, height]);

                svg.append("g")
                    .call(xAxis);

                svg.append("g")
                    .call(yAxis);


                    svg.append("path")
                        .datum(data.data[0])
                        .attr("fill", "none")
                        .attr("stroke", "steelblue")
                        .attr("stroke-width", 1.2)
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("d", line);

                    svg.append("path")
                        .datum(data.data[1])
                        .attr("fill", "none")
                        .attr("stroke", "red")
                        .attr("stroke-width", 1.2)
                        .attr("stroke-linejoin", "round")
                        .attr("stroke-linecap", "round")
                        .attr("d", line);

                return svg.node()
            }
            chart()

            
            document.getElementById('p-date').innerHTML = `${formatDate(new Date(data.bestTime.date))}`
            document.getElementById('p-val').innerHTML = `${data.bestTime.value}`

            document.getElementById('w-date').innerHTML = `${formatDate(new Date(data.worstTime.date))}`
            document.getElementById('w-val').innerHTML = `${data.worstTime.value}`


        })
        .catch (err => {
            console.log('Fetch failed...', err);
        })
    })
       
    document.dispatchEvent(trialEvent(randomWords[Math.floor(Math.random()*randomWords.length)]));
    

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
