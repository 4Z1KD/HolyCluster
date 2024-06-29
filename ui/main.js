import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm'

import HolyMap from "./holy_map.js"

const loc = window.location
let new_uri
if (loc.protocol === "https:") {
    new_uri = "wss:";
} else {
    new_uri = "ws:";
}
new_uri += "//" + loc.host + "/radio";
const radio_socket = new WebSocket(new_uri)
function line_click_callback(spot_data) {
    radio_socket.send(JSON.stringify(spot_data))
}

const band_colors = {
    160: "#f65356",
    80: "#fb8066",
    40: "#fea671",
    30: "#fec979",
    20: "#feea80",
    17: "#d7e586",
    15: "#a5de94",
    12: "#a5de94",
    10: "#8187c7",
    6: "#c56bba",
}

// The agalega and st brandon dxcc is a multi polygon that is made of 2 ring,
// That I switched in order manually. This is most likely a bug in the rewind function.
d3.json("./dxcc.geojson").then(data => {
    const holy_map = new HolyMap(
        data,
        band_colors,
        600, 600,
        {line_click: line_click_callback}
    )

    d3.select("#projection-select")
        .on("change", event => {
            holy_map.projection_type = event.target.options[event.target.selectedIndex].value
        })
        .selectAll("#projection-select option")
        .data(HolyMap.projection_types)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d)

    d3.select("#prjection-reset").on("click", _ => holy_map.reset_view())

    d3.select("#night").on("change", function() {
        holy_map.night.enabled = this.checked
    })

    const band_elements = d3.selectAll(".bands")
        .selectAll(".bands .band")
        .data(Object.entries(band_colors).reverse())
        .enter()
        .append("div")
        .classed("band", true)
        .style("background-color", d => d[1])

    band_elements.append("div").text(d => d[0]).style("font-weight", "bold")
    band_elements.append("input")
        .attr("type", "checkbox")
        .attr("checked", true)
        .on("click", (event, data) => {
            holy_map.set_band_state(data[0], event.target.checked)
        })

    return holy_map
}).then(holy_map => {

    d3.json("./spots.json").then(data => {
        for (const spot of data) {
            holy_map.add_spot(spot)
        }
        holy_map.render()
    })
})
