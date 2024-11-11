import React, { useMemo } from "react";

import { to_radian } from "@/utils.js";
import { band_colors, band_light_colors } from "@/filters_data.js";
import Hexagon from "./components/Hexagon.jsx";
import Square from "./components/Square.jsx";
import Triangle from "./components/Triangle.jsx";

function Spot({
    spot,
    path_generator,
    projection,
    set_cat_to_spot,
    hovered_spot,
    set_hovered_spot,
    set_popup_position,
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

    const is_hovered = spot.id == hovered_spot.id;
    const dx_size = is_hovered ? 14 : 10;

    const color = band_colors.get(spot.band);
    const light_color = band_light_colors[spot.band];

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


    let SymbolComponent;
    if (spot.mode === "SSB") {
        SymbolComponent = (
            <Hexagon
                dx_x={dx_x}
                dx_y={dx_y}
                dx_size={dx_size}
                light_color={light_color}
                handleClick={() => set_cat_to_spot(spot)}
            />
        );
    } else if (spot.mode === "CW") {
        SymbolComponent = (
            <Triangle
                dx_x={dx_x}
                dx_y={dx_y}
                dx_size={dx_size}
                light_color={light_color}
                handleClick={() => set_cat_to_spot(spot)}
            />
        );
    } else {
        SymbolComponent = (
            <rect
                x={dx_x - dx_size / 2}
                y={dx_y - dx_size / 2}
                width={dx_size}
                height={dx_size}
                fill={light_color}
                stroke="grey"
                strokeWidth="1px"
                onClick={() => set_cat_to_spot(spot)}
            />
        );
    }



    return <g
        onMouseOver={event => {
            set_popup_position({ x: event.nativeEvent.layerX, y: event.nativeEvent.layerY });
            set_hovered_spot({ source: "map", id: spot.id });
        }}
        onMouseLeave={() => set_hovered_spot({ source: null, id: null })}
    >
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
            onClick={() => set_cat_to_spot(spot)}
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
            onClick={() => set_cat_to_spot(spot)}>
        </circle>
        {SymbolComponent}
    </g>;
}

export default Spot;
