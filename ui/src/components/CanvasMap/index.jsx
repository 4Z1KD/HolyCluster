import { useEffect, useState, useRef } from "react";

import * as d3 from "d3";
import haversine from "haversine-distance";
import Maidenhead from "maidenhead";
import { useMeasure } from "@uidotdev/usehooks";

import { mod } from "@/utils.js";
import { build_geojson_line, dxcc_map, apply_context_transform, draw_map } from "./draw_map.js";
import SpotPopup from "@/components/SpotPopup.jsx";

function apply_zoom_and_drag_behaviors(
    context,
    {
        zoom_transform,
        set_zoom_transform,
        set_map_controls,
        width,
        height,
        draw_map,
        projection,
        canvas,
        center_lat,
    },
) {
    let is_drawing = false;
    let local_zoom_transform = zoom_transform;

    const zoom = d3
        .zoom()
        .scaleExtent([1, 20])
        .translateExtent([
            [0, 0],
            [width, height],
        ])
        .on("zoom", event => {
            if (!is_drawing) {
                is_drawing = true;
                requestAnimationFrame(() => {
                    context.clearRect(0, 0, width, height);
                    local_zoom_transform = event.transform;
                    draw_map(local_zoom_transform);
                    is_drawing = false;
                });
            }
        })
        .on("end", event => {
            set_zoom_transform(local_zoom_transform);
        });

    let lon_start = null;
    let current_lon = null;
    let drag_start = null;

    const drag = d3
        .drag()
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
                    context.clearRect(0, 0, width, height);
                    draw_map_inner(local_zoom_transform);
                    is_drawing = false;
                });
            }
        })
        .on("end", event => {
            const displayed_locator = new Maidenhead(center_lat, -current_lon).locator.slice(0, 6);
            set_zoom_transform(local_zoom_transform);
            set_map_controls(state => {
                state.location = {
                    displayed_locator: displayed_locator,
                    location: [-current_lon, center_lat],
                };
            });
        });

    zoom.transform(d3.select(canvas).call(drag).call(zoom), zoom_transform);
}

function CanvasMap({
    spots,
    map_controls,
    set_map_controls,
    set_cat_to_spot,
    hovered_spot,
    set_hovered_spot,
    pinned_spot,
    set_pinned_spot,
}) {
    const canvas_ref = useRef(null);
    const [div_ref, { width, height }] = useMeasure();
    const [popup_position, set_popup_position] = useState(null);
    const [zoom_transform, set_zoom_transform] = useState(d3.zoomIdentity);

    const inner_padding = 50;
    const center_x = width / 2;
    const center_y = height / 2;
    const radius = Math.min(center_x, center_y) - inner_padding;
    const [center_lon, center_lat] = map_controls.location.location;

    const projection = d3
        .geoAzimuthalEquidistant()
        .precision(0.1)
        .fitSize([width - inner_padding * 2, height - inner_padding * 2], dxcc_map)
        .rotate([-center_lon, -center_lat, 0])
        .translate([center_x, center_y]);

    useEffect(() => {
        if (width == null || height == null) {
            return;
        }
        const canvas = canvas_ref.current;
        const context = canvas.getContext("2d");

        const path_generator = d3.geoPath().projection(projection).context(context);

        function draw_map_inner(transform) {
            draw_map(
                context,
                spots,
                hovered_spot,
                width,
                height,
                center_x,
                center_y,
                radius,
                transform,
                path_generator,
                projection,
                map_controls.night,
            );
        }

        draw_map_inner(zoom_transform);

        apply_zoom_and_drag_behaviors(context, {
            zoom_transform,
            set_zoom_transform,
            set_map_controls,
            width,
            height,
            draw_map: draw_map_inner,
            projection,
            canvas,
            center_lat,
        });

        const handle_mouse_move = event => {
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
                set_hovered_spot({ source: "map", id: found_spot });
            }
        };

        // Add event listener for mousemove
        canvas.addEventListener("mousemove", handle_mouse_move);

        return () => {
            canvas.removeEventListener("mousemove", handle_mouse_move);
        };
    }, [
        spots,
        center_lon,
        center_lat,
        zoom_transform,
        hovered_spot,
        width,
        height,
        map_controls,
    ]);

    const hovered_spot_data = spots.find(spot => spot.id == hovered_spot);
    const hovered_spot_distance =
        hovered_spot_data != null
            ? (haversine(hovered_spot_data.dx_loc, hovered_spot_data.spotter_loc) / 1000).toFixed()
            : "";

    return (
        <div ref={div_ref} className="h-full w-full">
            <canvas ref={canvas_ref} width={width} height={height} />
            <SpotPopup
                visible={hovered_spot.source == "map" && popup_position != null}
                hovered_spot={hovered_spot}
                set_hovered_spot={set_hovered_spot}
                set_pinned_spot={set_pinned_spot}
                popup_position={popup_position}
                hovered_spot_data={hovered_spot_data}
                distance={hovered_spot_distance}
            />
        </div>
    );
}

export default CanvasMap;
