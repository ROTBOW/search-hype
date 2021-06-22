const axios = require('axios');
const d3 = require('d3');




document.addEventListener('DOMContentLoaded', () => {
    let searchInput = document.getElementById('search-input');
    let searchHeader = document.getElementById('search-title');
    let visDiv = document.getElementsByClassName('vis-div')[0];

    searchInput.addEventListener('change', e => {
        let searchTerm = (e.target.value != '') ? e.target.value : 'beauty';
        console.log(searchTerm);
        searchHeader.innerHTML = `${searchTerm}`
        visDiv.innerHTML = null;


    
    let data = new Array();
    axios.get(`/IOT/${searchTerm}`)
        .then (results => {
            for (let id in results.data.default.timelineData) {
                dataClip = results.data.default.timelineData[id];
                data.push({
                    date: new Date(dataClip.formattedTime),
                    value: Number(dataClip.value)
                })
            }
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
                    .text(data.y))

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)]).nice()
                .range([height - margin.bottom, margin.top])

            const x = d3.scaleUtc()
                .domain(d3.extent(data, d => d.date))
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
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 1.5)
                    .attr("stroke-linejoin", "round")
                    .attr("stroke-linecap", "round")
                    .attr("d", line);

                return svg.node()
            }
            chart()


        })
        .catch (err => {
            console.log('Fetch failed...');
        })
    })
        
    

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
