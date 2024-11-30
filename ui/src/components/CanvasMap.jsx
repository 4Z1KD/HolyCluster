import { useEffect, useState, useRef } from "react";

import * as d3 from "d3";
import geojsonRewind from "@mapbox/geojson-rewind";
import Maidenhead from "maidenhead";
import { century, equationOfTime, declination } from "solar-calculator";

import { to_radian, mod } from "@/utils.js";
import { band_colors, band_light_colors } from "@/filters_data.js";
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

function apply_context_transform(context, transform) {
    context.setTransform(
        transform.k, 0, 0,
        transform.k, transform.x, transform.y,
        1, 1, 1
    );
}

function draw_night_circle(context, { path_generator }) {
    const now = new Date();
    const day = new Date(+now).setUTCHours(0, 0, 0, 0);
    const t = century(now);
    const longitude = (day - now) / 864e5 * 360 - 180;
    const [sun_lon, sun_lat] = [longitude - equationOfTime(t) / 4, declination(t)];
    const sun_antipode = [sun_lon + 180, -sun_lat];

    const night_circle = d3.geoCircle().radius(90).center(sun_antipode)();

    context.beginPath();
    context.fillStyle = "rgba(0,0,128,0.2)";
    path_generator(night_circle);
    context.fill();
}

function draw_spot(
    context,
    spot,
    {
        hovered_spot,
        transform,
        path_generator,
        projection,
    }
) {
    const line = build_geojson_line(spot);
    const is_hovered = spot.id == hovered_spot.id;

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
    if (spot.is_alerted) {
        context.setLineDash([10 / transform.k, 10 / transform.k])
    } else {
        context.setLineDash([])
    }
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

    const [spotter_x, spotter_y] = projection(spot.spotter_loc);
    const spotter_radius = (is_hovered ? 5 : 3) / transform.k;

    context.beginPath();

    context.strokeStyle = "grey";
    context.fillStyle = band_light_colors[spot.band];
    context.lineWidth = 1 / transform.k;

    context.arc(spotter_x, spotter_y, spotter_radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}

function draw_map_angles(context, {
    radius,
    center_x,
    center_y,
    dimensions,
    scale,
    degrees_diff = 15,
}) {
    if (dimensions.height < 300) {
        return;
    }

    const angle_radius = radius + 25 * scale;
    // Calculate the positions for angle labels
    const angle_labels = Array.from(Array(Math.round(360 / degrees_diff)).keys())
        .map(x => {
            const angle_degrees = x * degrees_diff;
            const angle_radians = to_radian(angle_degrees - 90);
            return [
                angle_degrees,
                [
                    Math.cos(angle_radians) * angle_radius + center_x,
                    Math.sin(angle_radians) * angle_radius + center_y,
                ],
            ];
        }
    );

    const font_size = Math.floor(20 * scale);
    // Set font properties
    context.font = font_size + "px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#000000";

    // Draw each angle label on the canvas
    angle_labels.forEach(([label, [x, y]]) => {
        context.beginPath();
        context.fillText(`${label}°`, x, y);
    });
}

function draw_map_info_text(context, { spots, scale }) {
    const font_size = 20;
    context.font = `bold ${font_size}px Arial`;
    context.fillStyle = "#000000";
    context.beginPath();
    context.fillText(`Spots: ${spots.length}`, font_size, 30);
}

function apply_zoom_and_drag_behaviors(context, {
    zoom_transform,
    set_zoom_transform,
    set_map_controls,
    dimensions,
    draw_map,
    projection,
    canvas,
    center_lat,
}) {
    let is_drawing = false;
    let local_zoom_transform = zoom_transform;

    const zoom = d3.zoom()
        .scaleExtent([1, 20])
        .translateExtent([[0, 0], [dimensions.width, dimensions.height]])
        .on("zoom", event => {
            if (!is_drawing) {
                is_drawing = true;
                requestAnimationFrame(() => {
                    context.clearRect(0, 0, dimensions.width, dimensions.height);
                    local_zoom_transform = event.transform;
                    draw_map(local_zoom_transform);
                    is_drawing = false;
                });
            }
        })
        .on("end", event => {
            set_zoom_transform(local_zoom_transform)
        });

    let lon_start = null;
    let current_lon = null;
    let drag_start = null

    const drag = d3.drag()
        .on("start", event => {
            drag_start = [event.x, event.y];
            lon_start = projection.rotate()[0];
        })
        .on("drag", event => {
            if (zoom_transform.k > 1) {
                // Panning logic: Adjust the zoom translation (transform.x, transform.y)
                const dx = (event.x - drag_start[0]) / zoom_transform.k;
                const dy = (event.y - drag_start[1]) / zoom_transform.k;

                // Update zoom translation (panning)
                local_zoom_transform = zoom_transform.translate(dx, dy);

            } else {
                const dx = (event.x - drag_start[0]) / local_zoom_transform.k;
                current_lon = mod(lon_start + dx + 180, 360) - 180;

                const current_rotation = projection.rotate();
                projection.rotate([current_lon, current_rotation[1], current_rotation[2]]);
            }

            if (!is_drawing) {
                is_drawing = true;
                requestAnimationFrame(() => {
                    context.clearRect(0, 0, dimensions.width, dimensions.height);
                    draw_map(local_zoom_transform);
                    is_drawing = false;
                });
            }
        })
        .on("end", event => {
            const displayed_locator = new Maidenhead(center_lat, -current_lon).locator.slice(0, 6);
            set_zoom_transform(local_zoom_transform);
            set_map_controls(state => {
                state.location = {displayed_locator: displayed_locator, location: [-current_lon, center_lat]};
            })
        });

    zoom.transform(d3.select(canvas).call(drag).call(zoom), zoom_transform);
}

function CanvasMap({
    spots = [],
    map_controls,
    set_map_controls,
    set_cat_to_spot,
    hovered_spot,
    set_hovered_spot,
}) {
    const canvas_ref = useRef(null);
    const div_ref = useRef(null);
    const [dimensions, set_dimensions] = useState({ width: 700, height: 700 });
    const [zoom_transform, set_zoom_transform] = useState(d3.zoomIdentity);

    const inner_padding = 50;
    const center_x = dimensions.width / 2;
    const center_y = dimensions.height / 2;
    const radius = Math.min(center_x, center_y) - inner_padding;
    const [center_lon, center_lat] = map_controls.location.location;

    useEffect(() => {
        const resize = () => {
            const { width, height } = div_ref.current.getBoundingClientRect();
            // The height - 1 is a hack to prevent a scrollbar of the entire page to appear.
            // I'm not sure why this happens.
            set_dimensions({ width, height: height - 1 });
        };

        resize();
        window.addEventListener("resize", resize);

        return () => {
          window.removeEventListener("resize", resize);
        };
    }, [div_ref]);

    const projection = d3.geoAzimuthalEquidistant()
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

        function draw_map(transform) {
            // Clear the map before rendering
            context.clearRect(0, 0, dimensions.width, dimensions.height);

            context.save()

            // Map outline
            context.beginPath();
            context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
            context.stroke();

            // Heuristics for the scale of the map. This is good enough
            const scale = Math.max(Math.min(dimensions.height / 900, 1.1), 0.5);

            draw_map_info_text(context, { spots, scale });
            draw_map_angles(context, { radius, center_x, center_y, dimensions, scale });

            // Clip the map content to the circle
            context.beginPath();
            context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
            context.clip();

            apply_context_transform(context, transform);
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
                    context,
                    spot,
                    { hovered_spot, transform, path_generator, projection }
                );
            })

            if (map_controls.night) {
                draw_night_circle(context, { path_generator });
            }

            context.restore()
        }

        draw_map(zoom_transform);

        apply_zoom_and_drag_behaviors(context, {
            zoom_transform,
            set_zoom_transform,
            set_map_controls,
            dimensions,
            draw_map,
            projection,
            canvas,
            center_lat,
        });

        const handle_mouse_move = (event) => {
            const { offsetX, offsetY } = event;
            let found_spot = null;

            context.save();
            spots.forEach(spot => {
                const line = build_geojson_line(spot);
                context.beginPath();
                apply_context_transform(context, zoom_transform);
                path_generator(line);
                context.lineWidth = 8 / zoom_transform.k;

                if (context.isPointInStroke(offsetX, offsetY)) {
                    found_spot = spot.id;
                }
            });
            context.restore();
            if (found_spot !== hovered_spot.id) {
                set_hovered_spot({source: "map", id: found_spot});
            }
        };

        // Add event listener for mousemove
        canvas.addEventListener("mousemove", handle_mouse_move);

        return () => {
            canvas.removeEventListener("mousemove", handle_mouse_move);
        };
    }, [
        dxcc_map,
        spots,
        center_lon,
        center_lat,
        zoom_transform,
        hovered_spot,
        dimensions,
        map_controls,
    ]);

    return <div ref={div_ref} className="aspect-square h-[calc(100%-4rem)] w-full">
        <canvas
            ref={canvas_ref}
            width={dimensions.width}
            height={dimensions.height}
        />
    </div>;
}

export default CanvasMap;
