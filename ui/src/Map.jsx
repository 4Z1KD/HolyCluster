import * as d3 from "d3";
import geojsonRewind from "@mapbox/geojson-rewind";
import { century, equationOfTime, declination } from "solar-calculator";
import dxcc_map_raw from "./dxcc_map.json";

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

function to_radian(deg) {
  return deg * (Math.PI / 180)
}

function Map({
    width = 700,
    height = 700,
    spots = [],
    band_colors = {},
    enabled_bands = {},
    night_enabled = false,
    projection_type = "AzimuthalEquidistant",
}) {
    const projection = d3["geo" + projection_type]()
        .precision(0.1)
        .fitSize([width, height], dxcc_map)
        .translate([height / 2, width / 2]);
    const path_generator = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule10();

    const displayed_radius = calculate_distance(
        projection.invert([width / 2, height / 2]),
        projection.invert([0, height / 2]),
    );

    return <svg
        className="aspect-square w-full self-center"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}>
        <defs>
            <clipPath id="map-clip">
                <circle r={Math.min(width / 2, height / 2)} cx={width / 2} cy={height / 2}/>
            </clipPath>
        </defs>
        <circle
            r={Math.min(width / 2, height / 2)}
            cx={width / 2}
            cy={height / 2}
            style={{fill: "none", stroke: "black"}}
        />

        <text x="0" y="30" style={{font: "bold 20px sans-serif"}}>Radius: {Math.round(displayed_radius)} KM</text>

        <g clipPath="url(#map-clip)">
            <g>
                <path fill="none" stroke="#eee" d={path_generator(graticule)}></path>
            </g>
            <g>{
                dxcc_map.features.map(shape => {
                    return (
                        <path
                            fill="#def7cf"
                            stroke="#777"
                            key={shape.properties.dxcc_name}
                            d={path_generator(shape)}>
                            <title>{shape.properties.dxcc_name} ({shape.properties.dxcc_prefix})</title>
                        </path>
                    )
                })
            }</g>
            <g>
                {spots
                    .filter(spot => enabled_bands[spot.Band])
                    .map((spot, index) => {
                    return <Spot
                        key={index}
                        spot={spot}
                        color={band_colors[spot.Band]}
                        path_generator={path_generator}
                    ></Spot>;
                })}
            </g>
            <g>{
                night_enabled ?
                    <path
                        style={{pointerEvents: "none", fill: "rgba(0,0,128,0.2)"}}
                        d={path_generator(get_night_circle())}
                    /> : ""
            }</g>
        </g>
    </svg>;
}

export default Map;
