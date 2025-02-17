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
            } else if (data.mediumRange && data.mediumRange.series && data.mediumRange.series.data) {
                forecastData = data.mediumRange.series.data;
            } else if (data.longRange && data.longRange.series && data.longRange.series.data) {
                forecastData = data.longRange.series.data;
            } else {
                alert('No forecast data available for the selected range.');
                return;
            }
            displayForecastTable(forecastData);
            drawForecastGraph(forecastData);
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}

//Function to display the data on the table
function displayForecastTable(data) {
    const tableBody = document.getElementById('forecast_table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; //clear existing table data

    data.forEach(forecast => {
        const row = tableBody.insertRow();
        const timeCell = row.insertCell(0);
        const flowCell = row.insertCell(1);

        timeCell.textContent = forecast.validTime;
        flowCell.textContent = forecast.flow;
    });
}

//function to draw the graph
function drawForecastGraph(data) {
    const ctx = document.getElementById('forecast_graph').getContext('2d');
    const labels = data.map(forecast => forecast.validTime);
    const flows = data.map(forecast => forecast.flow);

    // Delete existing graph
    if (chartInstance) {
        chartInstance.destroy();
    }

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
            }
        }
    });
}
