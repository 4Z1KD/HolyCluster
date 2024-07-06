import * as d3 from "d3";
import geojsonRewind from "@mapbox/geojson-rewind";
import dxcc_map from "./dxcc_map.json";

function Map({
    width = 700,
    height = 700,
    projection_type = "AzimuthalEquidistant",
}) {
    const projection = d3["geo" + projection_type]().fitSize([width, height], dxcc_map);
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
            <g className="map"></g>
            <g className="lines"></g>
        </g>
    </svg>;
}

export default Map;
