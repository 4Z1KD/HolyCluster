function Spot({ spot, color, path_generator }) {
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

    return <path
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
        d={path_generator(line)}></path>;
}

export default Spot;
