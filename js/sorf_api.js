let chartInstance; //variable to store chart

//event listener for button push, filter for having an input
document.getElementById('get_forecast').addEventListener('click', function() {
    const reachid = document.getElementById('river_station').value;
    const type = document.getElementById('forecast_type').value;
    if (reachid) {
        getForecast(reachid, type);
    } else {
        alert('Error: Bad API inputs');
    }
});

//function that calls data from the API
function getForecast(reachid, type) {
    const api_url = `https://api.water.noaa.gov/nwps/v1/reaches/${reachid}/streamflow?series=${type}`;

    fetch(api_url)
        .then(response => response.json())
        .then(data => {
            console.log(data); //Log response data on the console

            let forecastData = [];
            if (data.shortRange && data.shortRange.series && data.shortRange.series.data) {
                forecastData = data.shortRange.series.data;
            } else if (data.mediumRange && data.mediumRange.member1 && data.mediumRange.member1.data) {
                forecastData = data.mediumRange.member1.data;
            } else if (data.longRange && data.longRange.member1 && data.longRange.member1.data) {
                forecastData = data.longRange.member1.data;
            } else {
                alert('No forecast data available for the selected range.');
                drawForecastGraph();
                return;
            }
            drawForecastGraph(forecastData);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

//Function to display the data on the table --> COMMENTED OUT, DON'T NEED TABLE
//function displayForecastTable(data) {
    //const tableBody = document.getElementById('forecast_table').getElementsByTagName('tbody')[0];
    //tableBody.innerHTML = ''; //clear existing table data

    //data.forEach(forecast => {
        //const row = tableBody.insertRow();
        //const timeCell = row.insertCell(0);
        //const flowCell = row.insertCell(1);

        //timeCell.textContent = forecast.validTime;
        //flowCell.textContent = forecast.flow;
    //});
//}

//function to draw the graph
function drawForecastGraph(data) {
    const ctx = document.getElementById('forecast_graph').getContext('2d');
    const labels = data.map(forecast => forecast.validTime);
    const flows = data.map(forecast => forecast.flow);

    // Delete existing graph
    if (chartInstance) {
        chartInstance.destroy();
    }

    //Logic to apply minor/moderate/major flood levels
    const minorFlood = 50000;
    const moderateFlood = 20000;
    const majorFlood = 22000;

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Flow (cfs)',
                data: flows,
                borderColor: '#ffffff',
                pointBackgroundColor: '#ffffff',
                
            }]
        },
        options: {            //no idea
            responsive: true,
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'hour'},
                    ticks: { color: 'white'},
                    title: {
                        display: true,
                        text: 'Date/Time',
                        color: 'white',
                    },
                    grid: { color: '#6b8b8c'}
                },
                y: {
                    title: {
                        display: true,
                        text: 'Streamflow (cfs)',
                        color: 'white',
                    },
                    grid: { color: '#6b8b8c'},
                    ticks: {
                        color: 'white',
                        callback: function(value) {
                            return value.toLocaleString(); // Format y-axis labels
                        }
                    },
                    min: Math.floor((Math.min(...flows) - 5) / 5) * 5, //Round min val to nearest 5
                    max: Math.ceil((Math.max(...flows) + 5) / 5) * 5  //Round max value to nearest 5
                }
            },
            plugins: {
                annotation: {
                    annotations: [
                        {
                            type: 'line',
                            mode: 'horizontal',
                            scaleID: 'y',
                            value: minorFloodLevel,
                            borderColor: 'yellow',
                            borderWidth: 2,
                            label: {
                                content: 'Minor Flood',
                                enabled: true,
                                position: 'end',
                                backgroundColor: 'yellow',
                                color: 'white',
                            }
                        },
                        {
                            type: 'line',
                            mode: 'horizontal',
                            scaleID: 'y',
                            value: moderateFloodLevel,
                            borderColor: 'orange',
                            borderWidth: 2,
                            label: {
                                content: 'Moderate Flood',
                                enabled: true,
                                position: 'end',
                                backgroundColor: 'orange',
                                color: 'white',
                            }
                        },
                        {
                            type: 'line',
                            mode: 'horizontal',
                            scaleID: 'y',
                            value: majorFloodLevel,
                            borderColor: 'red',
                            borderWidth: 2,
                            label: {
                                content: 'Major Flood',
                                enabled: true,
                                position: 'end',
                                backgroundColor: 'red',
                                color: 'white',
                            }
                        }
                    ]
                }
            }
        }
    });
}
