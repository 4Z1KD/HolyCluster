import { useState } from "react";

import { band_colors, band_light_colors } from "../bands_and_modes.js";

function Spot({
    spot,
    path_generator,
    projection,
    on_spot_click,
    hovered_spot,
    set_hovered_spot,
}) {
    const line = {
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

    const [spotter_x, spotter_y] = projection(spot.spotter_loc);
    const [dx_x, dx_y] = projection(spot.dx_loc);

    const [spotter_hovered, set_spotter_hovered] = useState(false);
    const spotter_size = spotter_hovered ? 7 : 5;
    const [dx_hovered, set_dx_hovered] = useState(false);
    const dx_size = dx_hovered ? 12 : 10;

    const is_hovered = spot.id == hovered_spot;
    const color = band_colors[spot.band];
    const light_color = band_light_colors[spot.band];

    return <>
        <path
            fill="none"
            stroke={is_hovered ? light_color : color}
            strokeWidth={is_hovered ? "5px" : "3px"}
            onMouseOver={() => set_hovered_spot(spot.id)}
            onMouseLeave={() => set_hovered_spot(null)}
            onClick={() => on_spot_click(spot)}
            d={path_generator(line)}
        />
        <circle
            cx={spotter_x}
            cy={spotter_y}
            r={spotter_size}
            fill={light_color}
            onMouseOver={() => set_spotter_hovered(true)}
            onMouseLeave={() => set_spotter_hovered(false)}
            onClick={() => on_spot_click(spot)}
        >
        <title>Callsign: {spot.spotter}</title>
        </circle>
        <rect
            x={dx_x - dx_size / 2}
            y={dx_y - dx_size / 2}
            width={dx_size}
            height={dx_size}
            fill={light_color}
            onMouseOver={() => set_dx_hovered(true)}
            onMouseLeave={() => set_dx_hovered(false)}
            onClick={() => on_spot_click(spot)}
        >
            <title>
                Callsign: {spot.dx_call}{'\n'}
                Grid: {spot.dx_locator}{'\n'}
                Continent: {spot.continent_dx}
            </title>
        </rect>
    </>;
}

export default Spot;
