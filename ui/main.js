let geojson

const projection_types = [
  "AzimuthalEqualArea",
  "AzimuthalEquidistant",
  "Orthographic",
  "Equirectangular",
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

const geojson_url = "https://gist.githubusercontent.com/d3indepth/f28e1c3a99ea6d84986f35ac8646fac7/raw/c58cede8dab4673c91a3db702d50f7447b373d98/ne_110m_land.json"
d3.json(geojson_url).then(data => {
    geojson = rewind(data, true)
    init_menu()
    update()
})
