import { useEffect, useState, useRef } from "react";

import * as d3 from "d3";
import geojsonRewind from "@mapbox/geojson-rewind";

import { to_radian } from "@/utils.js";
import { band_colors, band_light_colors } from "@/bands_and_modes.js";
import dxcc_map_raw from "@/assets/dxcc_map.json";

const dxcc_map = geojsonRewind(dxcc_map_raw, true);

function build_geojson_line(spot) {
    return {
        type: "LineString",
        coordinates: [
            spot.spotter_loc,
            spot.dx_loc,
        ],
        properties: {
            band: spot.band,
            freq: Number(spot.freq) * 1000,
            mode: spot.mode
        }
    };
}

function draw_spot(
    spot,
    hovered_spot,
    context,
    transform,
    path_generator,
    projection,
) {
    const line = build_geojson_line(spot);
    const is_hovered = spot.id == hovered_spot;

    // Render the arc of the spot
    context.beginPath();
    if (is_hovered) {
        context.strokeStyle = band_light_colors[spot.band];
        context.lineWidth = 6;
    } else {
        context.strokeStyle = band_colors.get(spot.band);
        context.lineWidth = 2;
    }
    context.lineWidth = context.lineWidth / transform.k;
    path_generator(line)
    context.stroke();

    const dx_size = (is_hovered ? 12 : 10) / transform.k;
    const [dx_x, dx_y] = projection(spot.dx_loc);

    // Render the dx rectangle
    context.beginPath();
    context.strokeStyle = "grey";
    context.fillStyle = band_light_colors[spot.band];
    context.lineWidth = 1 / transform.k;
    context.rect(
        dx_x - dx_size / 2,
        dx_y - dx_size / 2,
        dx_size,
        dx_size
    );
    context.fill();
    context.stroke();

    const spotter_size = (is_hovered ? 16 : 12) / transform.k;
    const [spotter_x, spotter_y] = projection(spot.spotter_loc);
    const t = (Math.sin(to_radian(60)) * spotter_size) / 2;

    context.beginPath();

    context.strokeStyle = "grey";
    context.fillStyle = band_light_colors[spot.band];
    context.lineWidth = 1 / transform.k;
    context.moveTo(-spotter_size / 2 + spotter_x, t + spotter_y);
    context.lineTo(spotter_size / 2 + spotter_x, t + spotter_y);
    context.lineTo(spotter_x, -t + spotter_y);
    context.closePath();
    context.fill();
    context.stroke();
}

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
    const [zoom_transform, set_zoom_transform] = useState(d3.zoomIdentity);

    const inner_padding = 50;
    const center_x = dimensions.width / 2;
    const center_y = dimensions.height / 2;
    const radius = Math.min(center_x, center_y) - inner_padding;
    const [center_lon, center_lat] = map_controls.location.location;

    const projection = d3["geoAzimuthalEquidistant"]()
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

        function apply_context_transform(transform) {
            context.setTransform(
                transform.k, 0, 0,
                transform.k, transform.x, transform.y,
                1, 1, 1
            );
        }

        function draw_map(transform) {
            // Clear the map before rendering
            context.clearRect(0, 0, dimensions.width, dimensions.height);

            context.save()

            // Map outline
            context.beginPath();
            context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
            context.stroke();

            // Clip the map content to the circle
            context.beginPath();
            context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
            context.clip();

            apply_context_transform(transform);
            context.lineWidth = 1 / transform.k;

            // Render the graticule
            context.beginPath();
            path_generator(d3.geoGraticule10())
            context.strokeStyle = "#eeeeee";
            context.stroke();

            // Render the map countries from geojson
            dxcc_map.features.forEach(feature => {
                context.beginPath();
                path_generator(feature);
                context.fillStyle = "#def7cf";
                context.strokeStyle = "#777777";
                context.fill();
                context.stroke();
            });

            spots.forEach(spot => {
                draw_spot(
                    spot,
                    hovered_spot,
                    context,
                    transform,
                    path_generator,
                    projection,
                );
            })

            context.restore()
        }

        draw_map(zoom_transform);

        let is_drawing = false;
        const zoom = d3.zoom()
            .scaleExtent([1, 20])
            .translateExtent([[0, 0], [dimensions.width, dimensions.height]])
            .on("zoom", event => {
                const { transform } = event;
                if (!is_drawing) {
                    is_drawing = true;
                    requestAnimationFrame(() => {
                        context.clearRect(0, 0, dimensions.width, dimensions.height);
                        set_zoom_transform(transform)
                        draw_map(transform);
                        is_drawing = false;
                    })
                }
            }
        );
        d3.select(canvas).call(zoom);

        const handle_mouse_move = (event) => {
            const { offsetX, offsetY } = event;
            let found_spot = null;

            context.save();
            spots.forEach(spot => {
                const line = build_geojson_line(spot);
                context.beginPath();
                apply_context_transform(zoom_transform);
                path_generator(line);
                context.lineWidth = 8 / zoom_transform.k;

                if (context.isPointInStroke(offsetX, offsetY)) {
                    found_spot = spot.id;
                }
            });
            context.restore();
            if (found_spot !== hovered_spot) {
                set_hovered_spot(found_spot);
            }
        };

        // Add event listener for mousemove
        canvas.addEventListener("mousemove", handle_mouse_move);

        return () => {
            canvas.removeEventListener("mousemove", handle_mouse_move);
        };
    }, [dxcc_map, spots, center_lon, center_lat, zoom_transform, hovered_spot]);

    return <canvas
        ref={canvas_ref}
        width={dimensions.width}
        height={dimensions.height}
    />;
}

export default CanvasMap;
