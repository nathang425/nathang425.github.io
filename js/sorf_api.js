let chartInstance; //variable to store chart

//event listener for river_station change, filter for having an input
document.getElementById("river_station").addEventListener("change", function() {
    const reachid = document.getElementById('river_station').value;
    const type = document.getElementById('forecast_type').value;
    console.log("Get Forecast button clicked");
    if (reachid) {
        getForecast(reachid, type);
    } else {
        alert('Error: Bad API inputs');
    }
});

//event listener for forecast_type change, filter for having an input
document.getElementById("forecast_type").addEventListener("change", function() {
    const reachid = document.getElementById('river_station').value;
    const type = document.getElementById('forecast_type').value;
    console.log("Get Forecast button clicked");
    if (reachid) {
        getForecast(reachid, type);
    } else {
        alert('Error: Bad API inputs');
    }
});

//event listener for button push, filter for having an input
document.getElementById('get_forecast').addEventListener('click', function() {
    const reachid = document.getElementById('river_station').value;
    const type = document.getElementById('forecast_type').value;
    console.log("Get Forecast button clicked");
    if (reachid) {
        getForecast(reachid, type);
    } else {
        alert('Error: Bad API inputs');
    }
});

//function that calls data from the API
function getForecast(reachid, type) {
    document.querySelectorAll('.loading').forEach(el => el.style.display = 'flex'); //Show loading animation
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
            } else if (data.longRange && data.longRange.member3 && data.longRange.member3.data) {
                forecastData = data.longRange.member3.data;
            } else {
                alert('No forecast data available.');
                drawForecastGraph([]);
                document.querySelectorAll('.loading').forEach(el => el.style.display = 'none'); //Hide loading animation
                return;
            }
            if (forecastData.length === 0) {
                alert("An error occurred: the API returned blank data. Please try refreshing the forecast a few times.");
                return;
            }
            drawForecastGraph(forecastData);
            document.querySelectorAll('.loading').forEach(el => el.style.display = 'none'); //Hide loading animation
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert("An error occurred while fetching forecast data. Please check your input and try again.");
            document.querySelectorAll('.loading').forEach(el => el.style.display = 'none'); //Hide loading animation
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

    // Determine y-axis limits
    const yMax = Math.ceil(Math.max(...flows) / 5) * 5; //Round up to nearest 5
    const yMin = Math.floor((Math.min(...flows) - 5) / 5) * 5; //Round down to nearest 5


    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Flow (cfs)',
                data: flows,
                borderColor: '#016FB9',
                pointBackgroundColor: '#ffffff',
                
            }]
        },
        options: {            //no idea
            responsive: true,
            scales: {
                x: {
                type: 'time',
                time: {
                    unit: 'hour',  // Adjust to the appropriate time unit (e.g., 'hour', 'minute')
                    tooltipFormat: 'MMM dd, yyyy HH:mm',  // Tooltip format
                    displayFormats: {
                        hour: 'MMM dd, HH:mm',  // Format displayed on the axis
                        }
                    },
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
                    min: yMin,
                    max: yMax
                }
            },
        }
    });
}
