import * as d3 from "d3";
import { useRef, useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Maidenhead from "maidenhead";
import geojsonRewind from "@mapbox/geojson-rewind";
import { century, equationOfTime, declination } from "solar-calculator";

import MapAngles from "./MapAngles.jsx";

import { to_radian } from "../utils.js";
import dxcc_map_raw from "../assets/dxcc_map.json";
import Spot from "./Spot.jsx";

const dxcc_map = geojsonRewind(dxcc_map_raw, true);

function get_sun_coordinates() {
    const now = new Date
    const day = new Date(+now).setUTCHours(0, 0, 0, 0)
    const t = century(now)
    const longitude = (day - now) / 864e5 * 360 - 180
    return [longitude - equationOfTime(t) / 4, declination(t)]
}

function get_night_circle() {
    const antipode = ([longitude, latitude]) => [longitude + 180, -latitude]
    return d3.geoCircle()
        .radius(90)
        .center(antipode(get_sun_coordinates()))()
}

function calculate_distance([lat1, lon1], [lat2, lon2]) {
    const earth_radius = 6371;
    const diff_lat = to_radian(lat2 - lat1);
    const diff_lon = to_radian(lon2 - lon1);
    const a =
        Math.sin(diff_lat / 2) * Math.sin(diff_lat / 2) +
        Math.cos(to_radian(lat1)) * Math.cos(to_radian(lat2)) *
        Math.sin(diff_lon / 2) * Math.sin(diff_lon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = earth_radius * c;
    return d;
}

function Map({
    location,
    set_location,
    spots = [],
    band_colors = {},
    enabled_bands = {},
    night_enabled = false,
    projection_type = "AzimuthalEquidistant",
}) {
    const svg_ref = useRef(null);
    const [dimensions, set_dimensions] = useState({ width: 700, height: 700 });

    const inner_padding = 50;
    const center_x = dimensions.width / 2;
    const center_y = dimensions.height / 2;
    const radius = Math.min(center_x, center_y) - inner_padding;

    const [center_lon, center_lat] = location.location;
    const projection = d3["geo" + projection_type]()
        .precision(0.1)
        .fitSize(
            [dimensions.width - inner_padding * 2, dimensions.height - inner_padding * 2],
            dxcc_map
        )
        .rotate([-center_lon, -center_lat, 0])
        .translate([center_x, center_y]);
    const path_generator = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule10();

    const displayed_radius = calculate_distance(
        projection.invert([center_x, center_y]),
        projection.invert([center_x + radius, center_y]),
    );

    // Auto resize effect hook that updates the dimensions state
    useEffect(() => {
    const resize = () => {
        const { width, height } = svg_ref.current.getBoundingClientRect();
        set_dimensions({ width, height });
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
    }, []);


    const host = window.location.host;
    const protocol = window.location.protocol;
    const websocket_url = (protocol == "https:" ? "wss:" : "ws:") + "//" + host + "/radio";

    const { sendJsonMessage, readyState } = useWebSocket(websocket_url);
    function on_spot_click(spot) {
        if (readyState == ReadyState.OPEN) {
            sendJsonMessage({mode: spot.Mode, freq: spot.Frequency})
        }
    }

    return <svg
        ref={svg_ref}
        className="aspect-square w-full self-center"
        onClick={event => {
            const dims = svg_ref.current.getBoundingClientRect();
            const x = event.clientX - dims.left;
            const y = event.clientY - dims.top;
            const distance_from_center = Math.sqrt((center_x - x) ** 2 + (center_y - y) ** 2);

            if (event.detail == 2 && distance_from_center <= radius) {
                const [lon, lat] = projection.invert([x, y]);
                const displayed_locator = new Maidenhead(lat, lon).locator.slice(0, 6);
                set_location({
                    displayed_locator: displayed_locator,
                    location: [ lon, lat ],
                });
            }
        }}
    >
        <defs>
            <clipPath id="map-clip">
                <circle r={radius} cx={center_x} cy={center_y}/>
            </clipPath>
        </defs>
        <circle r={radius} cx={center_x} cy={center_y} fill="none" stroke="black"/>

        <text
            x="30"
            y="30"
            style={{font: "bold 20px sans-serif", userSelect: "none"}}>
            Radius: {Math.round(displayed_radius)} KM
        </text>

        <MapAngles
            center_x={center_x}
            center_y={center_y}
            radius={radius + inner_padding / 2}
        />

        <g clipPath="url(#map-clip)">
            <path fill="none" stroke="#eee" pointerEvents="none" d={path_generator(graticule)}></path>
            {dxcc_map.features.map(shape => {
                return (
                    <path
                        fill="#def7cf"
                        stroke="#777"
                        pointerEvents="none"
                        key={shape.properties.dxcc_name}
                        d={path_generator(shape)}
                    >
                        <title>{shape.properties.dxcc_name} ({shape.properties.dxcc_prefix})</title>
                    </path>
                )
            })}
            {spots
                .filter(spot => enabled_bands[spot.Band])
                .map((spot, index) => {
                return <Spot
                    key={index}
                    spot={spot}
                    color={band_colors[spot.Band]}
                    path_generator={path_generator}
                    projection={projection}
                    on_spot_click={on_spot_click}
                ></Spot>;
            })}
            {night_enabled ?
                <path
                    style={{pointerEvents: "none", fill: "rgba(0,0,128,0.2)"}}
                    d={path_generator(get_night_circle())}
                /> : ""
            }
        </g>
    </svg>;
}

export default Map;
