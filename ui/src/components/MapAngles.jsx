import { to_radian } from "@/utils.js";

function MapAngles({
    radius,
    center_x,
    center_y,
    degrees_diff = 15,
}) {
    const angle_labels = Array.from(Array(Math.round(360 / degrees_diff)).keys())
        .map(x => {
            const angle_degrees = x * degrees_diff;
            const angle_radians = to_radian(angle_degrees - 90);
            return [
                angle_degrees,
                [
                    Math.cos(angle_radians) * radius + center_x,
                    Math.sin(angle_radians) * radius + center_y,
                ],
            ]
        })

    return <g>
        {angle_labels.map(([label, [x, y]]) => <text
            key={label}
            dominantBaseline="middle"
            textAnchor="middle"
            x={x}
            y={y}
            fontSize="20px"
        >{label}°</text>)}
    </g>;

}

export default MapAngles;
