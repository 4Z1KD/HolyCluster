import * as d3 from "d3";
import geojsonRewind from "@mapbox/geojson-rewind";
import dxcc_map_raw from "./dxcc_map.json";

const dxcc_map = geojsonRewind(dxcc_map_raw, true);

function Map({
    width = 700,
    height = 700,
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
                        return <path fill="#def7cf" stroke="#777" d={path_generator(shape)}/>
                    })
                }
            </g>
            <g className="lines"></g>
        </g>
    </svg>;
}

export default Map;
