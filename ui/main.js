let geojson

const projection_types = [
  "AzimuthalEqualArea",
  "AzimuthalEquidistant",
  "Orthographic",
  "Equirectangular",
]

const lines = [
    {type: "LineString", coordinates: [[0.1278, 51.5074], [-74.0059, 40.7128]]},
    {type: "LineString", coordinates: [[34.851612, 31.046051], [24.6727135, -28.4792625]]},
    {type: "LineString", coordinates: [[34.851612, 31.046051],[144.948693002555, -37.854759842877925] ]}
]

let projection
const geo_generator = d3.geoPath().projection(projection)

const graticule = d3.geoGraticule()

const state = {
    type: "AzimuthalEqualArea",
    scale: 120,
    rotateLambda: 0.1,
    rotatePhi: 0,
    rotateGamma: 0
}

function init_menu() {
    d3.select("#menu")
        .selectAll(".slider.item input")
        .on("input", function (_) {
            const attr = d3.select(this).attr("name")
            state[attr] = this.value
            d3.select(this.parentNode.parentNode).select(".value").text(this.value)
            update()
        })

    d3.select("#menu .projection-type select")
        .on("change", function (_) {
            state.type = this.options[this.selectedIndex].value
            update()
        })
        .selectAll("option")
        .data(projection_types)
        .enter()
        .append("option")
        .attr("value", function (d) { return d })
        .text(function (d) { return d })
}

function update() {
    // Update projection
    projection = d3["geo" + state.type]()
    geo_generator.projection(projection)

    projection
        .scale(state.scale)
        .rotate([state.rotateLambda, state.rotatePhi, state.rotateGamma])

    // Update world map
    let u = d3.select("g.map")
        .selectAll("path")
        .data(geojson.features)

    u.enter()
        .append("path")
        .merge(u)
        .attr("d", geo_generator)

    u = d3.select("g.lines")
        .selectAll("path")
        .data(lines)

    u.enter()
        .append("path")
        .merge(u)
        .attr("d", geo_generator)

    // Update projection center
    const projectedCenter = projection([0, 0])
    d3.select(".projection-center")
        .attr("cx", projectedCenter[0])
        .attr("cy", projectedCenter[1])

    // Update graticule
    d3.select(".graticule path")
        .datum(graticule())
        .attr("d", geo_generator)
}

// The agalega and st brandon dxcc is a multi polygon that is made of 2 ring,
// That I switched in order manually. This is most likly a bug in the rewind function.
const geojson_url = "./dxcc.geojson"
d3.json(geojson_url).then(data => {
    geojson = rewind(data, true)
    init_menu()
    update()
})
