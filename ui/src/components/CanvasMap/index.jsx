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
    draw_spots,
    draw_shadow_map,
    Dimensions,
} from "./draw_map.js";
import SpotPopup from "@/components/SpotPopup.jsx";
import { useColors } from "@/hooks/useColors";

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

function build_canvas_storage(projection, canvas_map) {
    return Object.fromEntries(
        Object.entries(canvas_map).map(([key, canvas_ref]) => {
            const canvas = canvas_ref.current;
            const context = canvas?.getContext("2d");
            return [key, { canvas, context }];
        }),
    );
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
    const map_canvas_ref = useRef(null);
    const spots_canvas_ref = useRef(null);
    const shadow_canvas_ref = useRef(null);

    const animation_id_ref = useRef(null);
    const dash_offset_ref = useRef(0);

    const [div_ref, { width, height }] = useMeasure();
    const dims = new Dimensions(width, height, 50);
    const [popup_position, set_popup_position] = useState(null);
    const [zoom_transform, set_zoom_transform] = useState(d3.zoomIdentity);

    const [center_lon, center_lat] = map_controls.location.location;

    const { colors } = useColors();

    const projection = d3
        .geoAzimuthalEquidistant()
        .precision(0.1)
        .fitSize(dims.padded_size, dxcc_map)
        .rotate([-center_lon, -center_lat, 0])
        .translate([dims.center_x, dims.center_y]);

    const canvas_storage = build_canvas_storage(projection, {
        map: map_canvas_ref,
        spots: spots_canvas_ref,
        shadow: shadow_canvas_ref,
    });

    const [shadow_palette, reverse_shadow_palette] = generate_shadow_palette(spots);

    useEffect(() => {
        if (dims.width == null || dims.height == null) {
            return;
        }

        function draw_spots_inner(transform) {
            draw_spots(
                canvas_storage.spots.context,
                spots,
                colors,
                hovered_spot,
                pinned_spot,
                dims,
                dash_offset_ref.current,
                transform,
                projection,
            );

            // This recursion redraws the spot every frame with changing sash_offset to animate the alerted spots.
            dash_offset_ref.current -= 0.5;
            if (dash_offset_ref.current < -20) {
                dash_offset_ref.current = 0;
            }
            animation_id_ref.current = requestAnimationFrame(() => draw_spots_inner(transform));
        }

        function draw_map_inner(transform) {
            draw_map(
                canvas_storage.map.context,
                spots,
                dims,
                transform,
                projection,
                map_controls.night,
            );
            if (animation_id_ref.current != null) {
                cancelAnimationFrame(animation_id_ref.current);
            }
            draw_spots_inner(transform);
            draw_shadow_map(
                canvas_storage.shadow.context,
                spots,
                dims,
                transform,
                projection,
                shadow_palette,
            );
        }

        draw_map_inner(zoom_transform);

        apply_zoom_and_drag_behaviors(canvas_storage.map.context, {
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

        function get_data_from_shadow_canvas(x, y) {
            const [red, green, blue] = canvas_storage.shadow.context
                .getImageData(x, y, 1, 1)
                .data.slice(0, 3);
            const color = [red, green, blue];
            return reverse_shadow_palette.get(color);
        }

        function on_mouse_move(event) {
            const { offsetX, offsetY } = event;
            const searched = get_data_from_shadow_canvas(offsetX, offsetY);
            if (searched != null) {
                let [type, spot_id] = searched;
                if (hovered_spot.source != "map" || hovered_spot.id != spot_id) {
                    set_hovered_spot({ source: "map", id: spot_id });
                }
                if (type == "dx") {
                    if (popup_position == null) {
                        set_popup_position({ x: offsetX, y: offsetY });
                    }
                } else {
                    set_popup_position(null);
                }
            } else {
                if (hovered_spot.source != null || hovered_spot.id != null) {
                    set_hovered_spot({ source: null, id: null });
                }
                if (popup_position != null) {
                    set_popup_position(null);
                }
            }
        }

        function on_click(event) {
            const { offsetX, offsetY } = event;
            const searched = get_data_from_shadow_canvas(offsetX, offsetY);
            if (searched != null) {
                let [type, spot_id] = searched;
                switch (event.detail) {
                    case 1:
                        set_pinned_spot(spot_id);
                        break;
                    case 2:
                        const spot = spots.find(spot => spot.id == spot_id);
                        set_cat_to_spot(spot);
                        break;
                }
            }
        }

        // Add event listener for mousemove
        canvas_storage.shadow.canvas.addEventListener("mousemove", on_mouse_move);
        canvas_storage.shadow.canvas.addEventListener("click", on_click);

        return () => {
            canvas_storage.shadow.canvas.removeEventListener("mousemove", on_mouse_move);
            canvas_storage.shadow.canvas.removeEventListener("click", on_click);
            cancelAnimationFrame(animation_id_ref.current);
        };
    }, [spots, center_lon, center_lat, zoom_transform, hovered_spot, width, height, map_controls]);

    const hovered_spot_data = spots.find(spot => spot.id == hovered_spot.id);
    const hovered_spot_distance =
        hovered_spot_data != null
            ? (haversine(hovered_spot_data.dx_loc, hovered_spot_data.spotter_loc) / 1000).toFixed()
            : "";

    return (
        <div ref={div_ref} className="relative h-full w-full">
            <canvas
                className="absolute top-0 left-0"
                ref={map_canvas_ref}
                width={width}
                height={height}
            />
            <canvas
                className="absolute top-0 left-0"
                ref={spots_canvas_ref}
                width={width}
                height={height}
            />
            <canvas
                className="opacity-0 absolute top-0 left-0 none"
                ref={shadow_canvas_ref}
                width={width}
                height={height}
            />
            {hovered_spot.source == "map" && popup_position != null ? (
                <SpotPopup
                    hovered_spot={hovered_spot}
                    set_hovered_spot={set_hovered_spot}
                    set_pinned_spot={set_pinned_spot}
                    popup_position={popup_position}
                    hovered_spot_data={hovered_spot_data}
                    distance={hovered_spot_distance}
                />
            ) : (
                ""
            )}
        </div>
    );
}

export default CanvasMap;
