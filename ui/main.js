import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm'

import HolyMap from "./holy_map.js"

const radio_socket = new WebSocket("ws://localhost:1111")
function line_click_callback(spot_data) {
    console.log(spot_data)
    radio_socket.send(JSON.stringify(spot_data))
}

// The agalega and st brandon dxcc is a multi polygon that is made of 2 ring,
// That I switched in order manually. This is most likely a bug in the rewind function.
d3.json("./dxcc.geojson").then(data => {
    const holy_map = new HolyMap(
        data,
        600, 600,
        {line_click: line_click_callback}
    )

    d3.select("#menu .projection-type select")
        .on("change", event => {
            holy_map.projection_type = event.target.options[event.target.selectedIndex].value
        })
        .selectAll("#menu .projection-type select option")
        .data(HolyMap.projection_types)
        .enter()
        .append("option")
        .attr("value", d => d)
        .text(d => d)

    d3.select("#menu .reset")
        .on("click", _ => holy_map.reset_view())

    return holy_map
}).then(holy_map => {

    d3.json("./spots.json").then(data => {
        for (const spot of data) {
            holy_map.add_spot(spot)
        }
        holy_map.render()
    })
})
