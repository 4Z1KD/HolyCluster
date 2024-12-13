import * as d3 from "d3";
import { century, equationOfTime, declination } from "solar-calculator";
import geojsonRewind from "@mapbox/geojson-rewind";

import { to_radian } from "@/utils.js";
import { band_colors, band_light_colors, map_land_color } from "@/filters_data.js";
import dxcc_map_raw from "@/assets/dxcc_map.json";

export const dxcc_map = geojsonRewind(dxcc_map_raw, true);

function draw_night_circle(context, { path_generator }) {
    const now = new Date();
    const day = new Date(+now).setUTCHours(0, 0, 0, 0);
    const t = century(now);
    const longitude = ((day - now) / 864e5) * 360 - 180;
    const [sun_lon, sun_lat] = [longitude - equationOfTime(t) / 4, declination(t)];
    const sun_antipode = [sun_lon + 180, -sun_lat];

    const night_circle = d3.geoCircle().radius(90).center(sun_antipode)();

    context.beginPath();
    context.fillStyle = "rgba(0,0,128,0.2)";
    path_generator(night_circle);
    context.fill();
}

export function build_geojson_line(spot) {
    return {
        type: "LineString",
        coordinates: [spot.spotter_loc, spot.dx_loc],
        properties: {
            band: spot.band,
            freq: Number(spot.freq) * 1000,
            mode: spot.mode,
        },
    };
}

function draw_spot(context, spot, { hovered_spot, transform, path_generator, projection }) {
    const line = build_geojson_line(spot);
    const is_hovered = spot.id == hovered_spot.id;

    // Render the arc of the spot
    context.beginPath();
    if (is_hovered) {
        context.strokeStyle = band_light_colors[spot.band];
        context.lineWidth = 6;
    } else {
        context.strokeStyle = band_colors.get(spot.band);
        context.lineWidth = 2;
    }
    context.lineWidth = context.lineWidth / transform.k;
    if (spot.is_alerted) {
        context.setLineDash([10 / transform.k, 10 / transform.k]);
    } else {
        context.setLineDash([]);
    }
    path_generator(line);
    context.stroke();

    const dx_size = (is_hovered ? 12 : 10) / transform.k;
    const [dx_x, dx_y] = projection(spot.dx_loc);

    // Render the dx rectangle
    context.beginPath();
    context.strokeStyle = "grey";
    context.fillStyle = band_light_colors[spot.band];
    context.lineWidth = 1 / transform.k;
    context.rect(dx_x - dx_size / 2, dx_y - dx_size / 2, dx_size, dx_size);
    context.fill();
    context.stroke();

    const [spotter_x, spotter_y] = projection(spot.spotter_loc);
    const spotter_radius = (is_hovered ? 5 : 3) / transform.k;

    context.beginPath();

    context.strokeStyle = "grey";
    context.fillStyle = band_light_colors[spot.band];
    context.lineWidth = 1 / transform.k;

    context.arc(spotter_x, spotter_y, spotter_radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}

function draw_map_angles(
    context,
    { radius, center_x, center_y, height, scale, degrees_diff = 15 },
) {
    if (height < 300) {
        return;
    }

    const angle_radius = radius + 25 * scale;
    // Calculate the positions for angle labels
    const angle_labels = Array.from(Array(Math.round(360 / degrees_diff)).keys()).map(x => {
        const angle_degrees = x * degrees_diff;
        const angle_radians = to_radian(angle_degrees - 90);
        return [
            angle_degrees,
            [
                Math.cos(angle_radians) * angle_radius + center_x,
                Math.sin(angle_radians) * angle_radius + center_y,
            ],
        ];
    });

    const font_size = Math.floor(20 * scale);
    // Set font properties
    context.font = font_size + "px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#000000";

    // Draw each angle label on the canvas
    angle_labels.forEach(([label, [x, y]]) => {
        context.beginPath();
        context.fillText(`${label}°`, x, y);
    });
}

function draw_map_info_text(context, { spots, scale }) {
    const font_size = 20;
    context.font = `bold ${font_size}px Arial`;
    context.fillStyle = "#000000";
    context.beginPath();
    context.fillText(`Spots: ${spots.length}`, font_size, 30);
}

export function apply_context_transform(context, transform) {
    context.setTransform(transform.k, 0, 0, transform.k, transform.x, transform.y, 1, 1, 1);
}

export function draw_map(
    context,
    spots,
    hovered_spot,
    width,
    height,
    center_x,
    center_y,
    radius,
    transform,
    path_generator,
    projection,
    night_displayed,
) {
    // Clear the map before rendering
    context.clearRect(0, 0, width, height);

    context.save();

    // Heuristics for the scale of the map. This is good enough
    const scale = Math.max(Math.min(height / 900, 1.1), 0.5);

    draw_map_info_text(context, { spots, scale });
    draw_map_angles(context, { radius, center_x, center_y, height, scale });

    // Clip the map content to the circle
    context.beginPath();
    context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
    context.clip();

    apply_context_transform(context, transform);
    context.lineWidth = 1 / transform.k;

    // Render the graticule
    context.beginPath();
    path_generator(d3.geoGraticule10());
    context.strokeStyle = "#eeeeee";
    context.stroke();

    // Render the map countries from geojson
    dxcc_map.features.forEach(feature => {
        context.beginPath();
        path_generator(feature);
        context.fillStyle = map_land_color;
        context.strokeStyle = "#777777";
        context.fill();
        context.stroke();
    });

    spots.forEach(spot => {
        draw_spot(context, spot, { hovered_spot, transform, path_generator, projection });
    });

    if (night_displayed) {
        draw_night_circle(context, { path_generator });
    }

    context.restore();

    // Map outline
    context.beginPath();
    context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
    context.stroke();
}
