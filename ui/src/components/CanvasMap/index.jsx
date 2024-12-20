import { useEffect, useState, useRef } from "react";

import * as d3 from "d3";
import haversine from "haversine-distance";
import Maidenhead from "maidenhead";
import { useMeasure } from "@uidotdev/usehooks";
import { HashMap } from "hashmap";

import { mod } from "@/utils.js";
import {
    build_geojson_line,
    dxcc_map,
    apply_context_transform,
    draw_map,
    draw_shadow_map,
    Dimensions,
} from "./draw_map.js";
import SpotPopup from "@/components/SpotPopup.jsx";

function apply_zoom_and_drag_behaviors(
    context,
    {
        zoom_transform,
        set_zoom_transform,
        set_map_controls,
        width,
        height,
        draw_map_inner,
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
                    draw_map_inner(local_zoom_transform);
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

function random_color() {
    const random_byte = () => Math.floor(Math.random() * 256);
    return [random_byte(), random_byte(), random_byte()];
}

function generate_shadow_palette(spots) {
    const shadow_palette = new HashMap(
        spots
            .map(spot => [
                [["dx", spot.id], random_color()],
                [["arc", spot.id], random_color()],
                [["spotter", spot.id], random_color()],
            ])
            .flat(),
    );
    const reverse_shadow_palette = new HashMap(
        shadow_palette.entries().map(([key, value]) => [value, key]),
    );
    return [shadow_palette, reverse_shadow_palette];
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
    const shadow_canvas_ref = useRef(null);

    const [div_ref, { width, height }] = useMeasure();
    const dims = new Dimensions(width, height, 50);
    const [popup_position, set_popup_position] = useState(null);
    const [zoom_transform, set_zoom_transform] = useState(d3.zoomIdentity);

    const [center_lon, center_lat] = map_controls.location.location;

    const projection = d3
        .geoAzimuthalEquidistant()
        .precision(0.1)
        .fitSize(dims.padded_size, dxcc_map)
        .rotate([-center_lon, -center_lat, 0])
        .translate([dims.center_x, dims.center_y]);

    const [shadow_palette, reverse_shadow_palette] = generate_shadow_palette(spots);

    useEffect(() => {
        if (dims.width == null || dims.height == null) {
            return;
        }
        const context = canvas_ref.current.getContext("2d");
        const shadow_canvas = shadow_canvas_ref.current;
        const shadow_context = shadow_canvas.getContext("2d");

        function draw_map_inner(transform) {
            draw_map(context, spots, hovered_spot, dims, transform, projection, map_controls.night);
            draw_shadow_map(shadow_context, spots, dims, transform, projection, shadow_palette);
        }

        draw_map_inner(zoom_transform);

        apply_zoom_and_drag_behaviors(context, {
            zoom_transform,
            set_zoom_transform,
            set_map_controls,
            width,
            height,
            draw_map_inner,
            projection,
            canvas: shadow_canvas_ref.current,
            center_lat,
        });

        const handle_mouse_move = event => {
            const { offsetX, offsetY } = event;
            const [red, green, blue] = shadow_context
                .getImageData(offsetX, offsetY, 1, 1)
                .data.slice(0, 3);
            const color = [red, green, blue];
            const searched = reverse_shadow_palette.get(color);
            if (searched != null) {
                const [type, spot_id] = searched;
                set_hovered_spot({ source: "map", id: spot_id });
            } else {
                set_hovered_spot({ source: null, id: null });
            }
        };

        // Add event listener for mousemove
        shadow_canvas.addEventListener("mousemove", handle_mouse_move);

        return () => {
            shadow_canvas.removeEventListener("mousemove", handle_mouse_move);
        };
    }, [spots, center_lon, center_lat, zoom_transform, hovered_spot, width, height, map_controls]);

    const hovered_spot_data = spots.find(spot => spot.id == hovered_spot);
    const hovered_spot_distance =
        hovered_spot_data != null
            ? (haversine(hovered_spot_data.dx_loc, hovered_spot_data.spotter_loc) / 1000).toFixed()
            : "";

    return (
        <div ref={div_ref} className="relative h-full w-full">
            <canvas
                className="absolute top-0 left-0"
                ref={canvas_ref}
                width={width}
                height={height}
            />
            <canvas
                className="opacity-0 absolute top-0 left-0 none"
                ref={shadow_canvas_ref}
                width={width}
                height={height}
            />
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
