import { useState } from "react";

function Spot({ spot, color, path_generator, projection }) {
    const line = {
        type: "LineString",
        coordinates: [
            spot.spotter_loc,
            spot.dx_loc,
        ],
        properties: {
            band: spot.Band,
            freq: Number(spot.Frequency) * 1000,
            mode: spot.Mode
        }
    };

    const [spotter_x, spotter_y] = projection(spot.spotter_loc);
    const [dx_x, dx_y] = projection(spot.dx_loc);

    const [spotter_hovered, set_spotter_hovered] = useState(false);
    const spotter_size = spotter_hovered ? 7 : 5;
    const [dx_hovered, set_dx_hovered] = useState(false);
    const dx_size = dx_hovered ? 12 : 10;

    return <>
        <path
        fill="none"
        stroke={color}
        onMouseOver={event => {
            event.target.style["stroke-width"] = "5px"
            event.target.style.filter = "brightness(110%)"
        }}
        onMouseLeave={event => {
            event.target.style["stroke-width"] = ""
            event.target.style.filter = ""
        }}
        strokeWidth="3px"
        d={path_generator(line)}></path>
        <circle
            cx={spotter_x}
            cy={spotter_y}
            r={spotter_size}
            fill={color}
            style={{ filter: "brightness(120%)" }}
            onMouseOver={() => set_spotter_hovered(true)}
            onMouseLeave={() => set_spotter_hovered(false)}
        >
        <title>Callsign: {spot.Spotter}</title>
        </circle>
        <rect
            x={dx_x - dx_size / 2}
            y={dx_y - dx_size / 2}
            width={dx_size}
            height={dx_size}
            fill={color}
            style={{ filter: "brightness(120%)" }}
            onMouseOver={() => set_dx_hovered(true)}
            onMouseLeave={() => set_dx_hovered(false)}
        >
            <title>
                Callsign: {spot.DXCall}{'\n'}
                Grid: {spot.DXLocator}{'\n'}
                Continent: {spot.Continent_dx}
            </title>
        </rect>
    </>;
}

export default Spot;
