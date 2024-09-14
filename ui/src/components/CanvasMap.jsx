import { useEffect, useState, useRef } from "react";

import * as d3 from "d3";
import geojsonRewind from "@mapbox/geojson-rewind";

import dxcc_map_raw from "@/assets/dxcc_map.json";

const dxcc_map = geojsonRewind(dxcc_map_raw, true);

function CanvasMap({
    spots = [],
    map_controls,
    set_map_controls,
    on_spot_click,
    hovered_spot,
    set_hovered_spot,
    alerts,
}) {
    const canvas_ref = useRef(null);
    const [dimensions, set_dimensions] = useState({ width: 837, height: 837 });

    const inner_padding = 50;
    const center_x = dimensions.width / 2;
    const center_y = dimensions.height / 2;
    const [center_lon, center_lat] = map_controls.location.location;

    const projection = d3["geo" + map_controls.projection_type]()
        .precision(0.1)
        .fitSize(
            [dimensions.width - inner_padding * 2, dimensions.height - inner_padding * 2],
            dxcc_map
        )
        .rotate([-center_lon, -center_lat, 0])
        .translate([center_x, center_y]);

    useEffect(() => {
        const canvas = canvas_ref.current;
        const context = canvas.getContext("2d");

        const path_generator = d3
            .geoPath()
            .projection(projection)
            .context(context);

        context.beginPath();
        path_generator(d3.geoGraticule10())
        context.strokeStyle = "#eeeeee";
        context.stroke();

        dxcc_map.features.forEach(feature => {
            context.beginPath();
            path_generator(feature);
            context.fillStyle = "#def7cf";
            context.strokeStyle = "#777777";
            context.fill();
            context.stroke();
        });

    }, [dxcc_map]);

    return <canvas
        ref={canvas_ref}
        width={dimensions.width}
        height={dimensions.height}
    ></canvas>;
}

export default CanvasMap;
