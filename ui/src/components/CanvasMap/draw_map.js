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

function draw_spot_dx(context, spot, color, stroke_color, dx_x, dx_y, dx_size, transform) {
    context.beginPath();
    context.strokeStyle = stroke_color;
    context.fillStyle = color;
    context.lineWidth = 1 / transform.k;
    if (spot.mode === "SSB") {
        context.rect(dx_x - dx_size / 2, dx_y - dx_size / 2, dx_size, dx_size);
    } else if (spot.mode === "CW") {
        context.moveTo(dx_x, dx_y - dx_size / 2);
        context.lineTo(dx_x - dx_size / 2, dx_y + dx_size / 2);
        context.lineTo(dx_x + dx_size / 2, dx_y + dx_size / 2);
    } else {
        dx_size = dx_size / 1.6;
        const hex_points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = dx_x + dx_size * Math.cos(angle);
            const y = dx_y + dx_size * Math.sin(angle);
            hex_points.push([x, y]);
        }

        context.moveTo(hex_points[0][0], hex_points[0][1]);
        for (let i = 1; i < hex_points.length; i++) {
            context.lineTo(hex_points[i][0], hex_points[i][1]);
        }
    }
    context.closePath();
    context.fill();
    context.stroke();
}

function draw_spot(
    context,
    spot,
    dash_offset,
    { hovered_spot, transform, path_generator, projection },
) {
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
        context.lineDashOffset = dash_offset / transform.k;
    } else {
        context.setLineDash([]);
    }
    path_generator(line);
    context.stroke();

    const dx_size = (is_hovered ? 12 : 10) / transform.k;
    const [dx_x, dx_y] = projection(spot.dx_loc);

    draw_spot_dx(
        context,
        spot,
        band_light_colors[spot.band],
        "grey",
        dx_x,
        dx_y,
        dx_size,
        transform,
    );

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

function rgb_triplet_to_color([red, green, blue]) {
    return `rgb(${red}, ${green}, ${blue})`;
}

function draw_shadow_spot(
    context,
    spot,
    shadow_palette,
    { transform, path_generator, projection },
) {
    const line = build_geojson_line(spot);

    // Render the arc of the spot
    context.beginPath();
    context.strokeStyle = rgb_triplet_to_color(shadow_palette.get(["arc", spot.id]));
    context.lineWidth = 8 / transform.k;
    path_generator(line);
    context.stroke();

    const dx_size = 12 / transform.k;
    const [dx_x, dx_y] = projection(spot.dx_loc);

    // Render the dx rectangle
    const dx_color = rgb_triplet_to_color(shadow_palette.get(["dx", spot.id]));
    draw_spot_dx(context, spot, dx_color, dx_color, dx_x, dx_y, dx_size, transform);

    const [spotter_x, spotter_y] = projection(spot.spotter_loc);
    const spotter_radius = 7 / transform.k;

    context.beginPath();
    context.fillStyle = rgb_triplet_to_color(shadow_palette.get(["spotter", spot.id]));
    context.lineWidth = 2 / transform.k;
    context.arc(spotter_x, spotter_y, spotter_radius, 0, 2 * Math.PI);
    context.fill();
}

function draw_map_angles(context, dims, degrees_diff = 15) {
    if (dims.height < 300) {
        return;
    }

    const angle_radius = dims.radius + 25 * dims.scale;
    // Calculate the positions for angle labels
    const angle_labels = Array.from(Array(Math.round(360 / degrees_diff)).keys()).map(x => {
        const angle_degrees = x * degrees_diff;
        const angle_radians = to_radian(angle_degrees - 90);
        return [
            angle_degrees,
            [
                Math.cos(angle_radians) * angle_radius + dims.center_x,
                Math.sin(angle_radians) * angle_radius + dims.center_y,
            ],
        ];
    });

    const font_size = Math.floor(20 * dims.scale);
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

export class Dimensions {
    constructor(width, height, inner_padding) {
        this.width = width;
        this.height = height;
        this.inner_padding = inner_padding;

        this.center_x = width / 2;
        this.center_y = height / 2;
        this.radius = Math.min(this.center_x, this.center_y) - inner_padding;

        this.padded_size = [width - inner_padding * 2, height - inner_padding * 2];
        // Heuristics for the scale of the map. This is good enough
        this.scale = Math.max(Math.min(height / 900, 1.1), 0.5);
    }
}

export function draw_map(context, spots, dims, transform, projection, night_displayed) {
    const path_generator = d3.geoPath().projection(projection).context(context);

    // Clear the map before rendering
    context.clearRect(0, 0, dims.width, dims.height);

    context.save();

    draw_map_info_text(context, { spots, scale: dims.scale });
    draw_map_angles(context, dims);

    // Clip the map content to the circle
    context.beginPath();
    context.arc(dims.center_x, dims.center_y, dims.radius, 0, 2 * Math.PI);
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

    if (night_displayed) {
        draw_night_circle(context, { path_generator });
    }

    context.restore();

    // Map outline
    context.beginPath();
    context.arc(dims.center_x, dims.center_y, dims.radius, 0, 2 * Math.PI);
    context.stroke();
}

export function draw_spots(context, spots, hovered_spot, dims, dash_offset, transform, projection) {
    const path_generator = d3.geoPath().projection(projection).context(context);

    // Clear the map before rendering
    context.clearRect(0, 0, dims.width, dims.height);

    context.save();

    // Clip the map content to the circle
    context.beginPath();
    context.arc(dims.center_x, dims.center_y, dims.radius, 0, 2 * Math.PI);
    context.clip();

    apply_context_transform(context, transform);
    context.lineWidth = 1 / transform.k;

    spots.forEach(spot => {
        draw_spot(context, spot, dash_offset, {
            hovered_spot,
            transform,
            path_generator,
            projection,
        });
    });

    context.restore();
}

export function draw_shadow_map(
    shadow_context,
    spots,
    dims,
    transform,
    projection,
    shadow_palette,
) {
    const shadow_path_generator = d3.geoPath().projection(projection).context(shadow_context);
    shadow_context.clearRect(0, 0, dims.width, dims.height);

    shadow_context.save();

    // Clip the map content to the circle
    shadow_context.beginPath();
    shadow_context.arc(dims.center_x, dims.center_y, dims.radius, 0, 2 * Math.PI);
    shadow_context.clip();

    apply_context_transform(shadow_context, transform);

    spots.forEach(spot => {
        draw_shadow_spot(shadow_context, spot, shadow_palette, {
            transform,
            path_generator: shadow_path_generator,
            projection,
        });
    });

    shadow_context.restore();
}
