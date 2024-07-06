import * as d3 from "d3";
import geojsonRewind from "@mapbox/geojson-rewind";
import { century, equationOfTime, declination } from "solar-calculator";
import dxcc_map_raw from "./dxcc_map.json";

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

function Map({
    width = 700,
    height = 700,
    night_enabled = false,
    projection_type = "AzimuthalEquidistant",
}) {
    const projection = d3["geo" + projection_type]()
        .precision(0.1)
        .fitSize([width, height], dxcc_map);
    const path_generator = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule10();

    return <svg className="aspect-square w-full" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
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

        <g clipPath="url(#map-clip)">
            <g className="graticule">
                <path
                    fill="none"
                    stroke="#eee"
                    d={path_generator(graticule)}
                ></path>
            </g>
            <g className="map">
                {
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
                }
            </g>
            <g className="lines"></g>
            <g className="night">{
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
