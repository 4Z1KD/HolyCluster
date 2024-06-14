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

let projection = d3.geoAzimuthalEquidistant()
const geo_generator = d3.geoPath().projection(projection)

const graticule = d3.geoGraticule()

const state = {
    type: "AzimuthalEqualArea",
    scale: 120,
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
            projection = d3["geo" + state.type]()
            geo_generator.projection(projection)
            update()
        })
        .selectAll("#menu .projection-type select option")
        .data(projection_types)
        .enter()
        .append("option")
        .attr("value", function (d) { return d })
        .text(function (d) { return d })

    d3.select("#menu .reset")
        .on("click", function (_) {
            Object.assign(state, initial_state)
            update()
        })
        .selectAll("input[type=range]")
        .data(state)
        .attr("value", function(d) { constole.log("aaaa"); return d })
}

function update() {
    // Update projection
    projection
        .scale(state.scale)
        .translate([600, 300])

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

let q0, v0, r0
function drag_started(event) {
    v0 = versor.cartesian(projection.invert([event.x, event.y]))
    r0 = projection.rotate()
    q0 = versor(r0)
}

function dragged(event) {
    const v1 = versor.cartesian(projection.rotate(r0).invert([event.x, event.y]))
    const q1 = versor.multiply(q0, versor.delta(v0, v1))
    const r1 = versor.rotation(q1)
    projection.rotate(r1)
    update()
}

const drag = d3
    .drag()
    .on("start", drag_started)
    .on("drag", dragged)

d3.select("svg").call(drag)


// The agalega and st brandon dxcc is a multi polygon that is made of 2 ring,
// That I switched in order manually. This is most likly a bug in the rewind function.
const geojson_url = "./dxcc.geojson"
d3.json(geojson_url).then(data => {
    geojson = rewind(data, true)
    init_menu()
    update()
})
