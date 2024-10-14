import haversine from "haversine-distance";
import { useState } from "react";

import { to_radian } from "@/utils.js";
import { band_colors, band_light_colors } from "@/bands_and_modes.js";

function Spot({
    spot,
    path_generator,
    projection,
    on_spot_click,
    hovered_spot,
    set_hovered_spot,
    alerts
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

    const is_hovered = spot.id == hovered_spot;
    const dx_size = is_hovered ? 14 : 10;

    const color = band_colors.get(spot.band);
    const light_color = band_light_colors[spot.band];

    const distance = (haversine(spot.dx_loc, spot.spotter_loc) / 1000).toFixed();

    const is_alerted = alerts.some(regex => spot.dx_callsign.match(regex));
    let style;
    if (is_alerted) {
        style = {
            strokeDasharray: 5,
            strokeDashoffset: 50,
            animation: "dash 2s linear forwards infinite"
        };
    } else {
        style = {};
    }

    return <g>
        <path
            fill="none"
            stroke={is_hovered ? light_color : color}
            strokeWidth={is_hovered ? "6px" : "2px"}
            d={path_generator(line)}
            style={style}
        />
        <path
            fill="none"
            opacity="0"
            strokeWidth="8px"
            stroke="#FFFFFF"
            onMouseOver={() => set_hovered_spot(spot.id)}
            onMouseLeave={() => set_hovered_spot(null)}
            onClick={() => on_spot_click(spot)}
            d={path_generator(line)}
        />
        {is_alerted ?
            <style>
            {`
                @keyframes dash {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}
            </style>
        : ""}
        <circle
            r={is_hovered ? 5 : 3}
            fill={light_color}
            stroke="grey"
            cx={spotter_x}
            cy={spotter_y}
            onMouseOver={() => set_hovered_spot(spot.id)}
            onMouseLeave={() => set_hovered_spot(null)}
            onClick={() => on_spot_click(spot)}>
        </circle>
        <rect
            x={dx_x - dx_size / 2}
            y={dx_y - dx_size / 2}
            width={dx_size}
            height={dx_size}
            fill={light_color}
            stroke="grey"
            strokeWidth="1px"
            onMouseOver={() => set_hovered_spot(spot.id)}
            onMouseLeave={() => set_hovered_spot(null)}
            onClick={() => on_spot_click(spot)}
        />
        <title>
            DX: {spot.dx_callsign} ({spot.freq}{"continent_dx" in spot ? ", " + spot.continent_dx : ""}){"\n"}
            Spotter: {spot.spotter_callsign}{'\n'}
            Distance: {distance} KM
        </title>
    </g>;
}

export default Spot;
