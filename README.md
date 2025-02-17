# nathang425.github.io
# Colors: #121212 night, #1e1e1e eerie black, #2e5b29 hunter green, #a95537 rust, #6b8b8c slate gray, #016FB9 azul
# Reach ID: 4512772 - unnamed, Potomac River at Little Falls
#APP IDEAS: Design a bridge (find max depth for different return periods, use Hydrology equations)
# WEB APP: Rafting in Southern Oregon
Initial steps:
1. Calculate the watershed using Hydrology lab steps - download shapefiles (river/streams AND watershed boundary)
2. Record all Reach IDs of the stations I want to use (Rogue River 5, Applegate 3, Umpqua 10)
3. Create Leaflet map with a point for each station
4. Add the rivers/streams and watershed boundary
5. Create space for graph, dropdown for forecast selection

API steps:
6. On click of a point, zoom to it, input that reachID and forecast length into the API
7. Return the forecast graph, and info on that section of river
