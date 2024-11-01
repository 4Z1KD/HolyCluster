import * as d3 from "d3";
import { useRef, useState, useEffect } from "react";
import Maidenhead from "maidenhead";
import geojsonRewind from "@mapbox/geojson-rewind";
import { century, equationOfTime, declination } from "solar-calculator";

import dxcc_map_raw from "@/assets/dxcc_map.json";
import MapAngles from "@/components/MapAngles.jsx";
import Spot from "@/components/Spot.jsx";

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

function SvgMap({
    spots = [],
    map_controls,
    set_map_controls,
    set_cat_to_spot,
    hovered_spot,
    set_hovered_spot,
    alerts,
}) {
    const svg_ref = useRef(null);
    const [dimensions, set_dimensions] = useState({ width: 700, height: 700 });
    const max_radius = 20000;
    const [radius_in_km, set_radius_in_km] = useState(max_radius);

    const inner_padding = 50;
    const center_x = dimensions.width / 2;
    const center_y = dimensions.height / 2;
    const radius = Math.min(center_x, center_y) - inner_padding;
    const [center_lon, center_lat] = map_controls.location.location;

    const projection = d3["geoAzimuthalEquidistant"]()
        .precision(0.1)
        .fitSize(
            [dimensions.width - inner_padding * 2, dimensions.height - inner_padding * 2],
            dxcc_map
        )
        .rotate([-center_lon, -center_lat, 0])
        .translate([center_x, center_y]);

    projection.scale(max_radius / radius_in_km * projection.scale());

    const path_generator = d3.geoPath().projection(projection);

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
    }, [svg_ref]);

    useEffect(() => {
        const svg = d3.select(svg_ref.current);
        const zoom = d3.zoom()
            .scaleExtent([1, 20])
            .on("zoom", event => {
                const radius_in_km = (21 - Math.round( event.transform.k)) * 1000;
                set_radius_in_km(radius_in_km);
            })
        svg.call(zoom);
    }, [radius_in_km])

    const text_height = 20
    const text_y = 30

    return <svg
        ref={svg_ref}
        className="aspect-square h-[calc(100%-4rem)] w-full"
        onClick={event => {
            const dims = svg_ref.current.getBoundingClientRect();
            const x = event.clientX - dims.left;
            const y = event.clientY - dims.top;
            const distance_from_center = Math.sqrt((center_x - x) ** 2 + (center_y - y) ** 2);

            if (event.detail == 2 && distance_from_center <= radius) {
                const [lon, lat] = projection.invert([x, y]);
                const displayed_locator = new Maidenhead(lat, lon).locator.slice(0, 6);
                set_map_controls(state => {
                    state.location = {displayed_locator, location: [ lon, lat ]};
                })
            }
        }}
    >
        <defs>
            <clipPath id="map-clip">
                <circle r={radius} cx={center_x} cy={center_y}/>
            </clipPath>
        </defs>
        <circle r={radius} cx={center_x} cy={center_y} fill="none" stroke="black"/>

        <g style={{font: `bold ${text_height}px sans-serif`, userSelect: "none"}}>
            <text x={text_height} y={text_y}>Radius: {Math.round(radius_in_km)} KM</text>
            <text x={text_height} y={text_y + text_height + 10}>Spots: {spots.length}</text>
        </g>

        <MapAngles
            center_x={center_x}
            center_y={center_y}
            radius={radius + inner_padding / 2}
        />

        <g clipPath="url(#map-clip)">
            <path
                fill="none"
                stroke="#eee"
                pointerEvents="none"
                d={path_generator(d3.geoGraticule10())}
            ></path>
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
                .toReversed()
                .map((spot, index) => {
                return <Spot
                    key={index}
                    spot={spot}
                    path_generator={path_generator}
                    projection={projection}
                    set_cat_to_spot={set_cat_to_spot}
                    hovered_spot={hovered_spot}
                    set_hovered_spot={set_hovered_spot}
                    alerts={alerts}
                ></Spot>;
            })}
            {map_controls.night ?
                <path
                    style={{pointerEvents: "none", fill: "rgba(0,0,128,0.2)"}}
                    d={path_generator(get_night_circle())}
                /> : ""
            }
        </g>
    </svg>;
}

export default SvgMap;
