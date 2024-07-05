import dxcc_map from "./dxcc_map.json";

function Map({ width = 700, height = 700 }) {
    console.log(dxcc_map);
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
        <g clip-path="url(#map-clip)">
            <g className="graticule">
                <path></path>
            </g>
            <g className="map"></g>
            <g className="lines"></g>
        </g>
    </svg>;
}

export default Map;
