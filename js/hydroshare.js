let config = {
  minZoom: 3,
  maxZoom: 18,
}

// map starting properties
const zoom = 10
const lat = 40.210038
const lng = -111.736817

// call the map
const map = L.map("map", config).setView([lat, lng], zoom)

// Load tile layers from the link, include attribution
const baselayer = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
  },
).addTo(map)

//Add Hydroshare layers
const ft_faults = L.tileLayer
  .wms(
    "https://geoserver.hydroshare.org/geoserver/HS-c647cbb66048497dbca360cfc7ac4863/wms",
    {
      layers: "HS-c647cbb66048497dbca360cfc7ac4863:100ft_faults",
      format: "image/png",
      transparent: true,
      attribution: "Hydroshare GeoServer",
    },
  )
  .addTo(map)

const power = L.tileLayer
  .wms(
    "https://geoserver.hydroshare.org/geoserver/HS-c647cbb66048497dbca360cfc7ac4863/wms",
    {
      layers: "HS-c647cbb66048497dbca360cfc7ac4863:PowerPlants_CO2",
      format: "image/png",
      transparent: true,
      attribution: "Hydroshare GeoServer",
    },
  )
  .addTo(map)

const goats = L.tileLayer
  .wms(
    "https://geoserver.hydroshare.org/geoserver/HS-c647cbb66048497dbca360cfc7ac4863/wms",
    {
      layers: "HS-c647cbb66048497dbca360cfc7ac4863:Utah_Mountain_Goat_Habitat",
      format: "image/png",
      transparent: true,
      attribution: "Hydroshare GeoServer",
    },
  )
  .addTo(map)

// Organize layers into a control object
var overlays = {
  "Roads Near Faults": ft_faults,
  "Power Stations": power,
  "Goat Habitats": goats,
}

L.Control.LayerButtons = L.Control.extend({
  onAdd: function (map) {
    let div = L.DomUtil.create("div", "leaflet-bar leaflet-control")

    function createButton(name, layer) {
      let button = L.DomUtil.create("button", "button", div)
      button.innerHTML = name
      button.style.display = "block"
      button.style.margin = "5px"
      button.style.width = "100%"
      button.style.background = "#2e5b29"

      //On click, change button color
      button.onclick = function () {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer)
          button.style.background = "#1e1e1e" //black when off
        } else {
          map.addLayer(layer)
          button.style.background = "#2e5b29" //green when on
        }
      }
      return button
    }

    createButton("Roads Near Faults", ft_faults)
    createButton("Power Stations", power)
    createButton("Goat Habitats", goats)

    return div
  },
  onRemove: function () {},
})

// Add the custom control to the map
map.addControl(new L.Control.LayerButtons({ position: "topright" }))
