import versor from "https://cdn.jsdelivr.net/npm/versor@0.2.0/+esm"
import geojsonRewind from 'https://cdn.jsdelivr.net/npm/geojson-rewind@0.3.1/+esm'
import { century, equationOfTime, declination } from 'https://cdn.jsdelivr.net/npm/solar-calculator@0.3.0/+esm'
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm'

function debounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

export default class HolyMap {
    static projection_types = [
        "AzimuthalEquidistant",
        "AzimuthalEqualArea",
        "Orthographic",
        // Equirectangular projection is currently broken due to zoom and drag bhaviours
        // "Equirectangular",
    ]

    static default_projection = "AzimuthalEquidistant"

    constructor(map_data, band_colors, width, height, callbacks) {
        // This fixes the order of polygon points for d3 compatability
        this.geojson = geojsonRewind(map_data, true)
        this.band_colors = band_colors
        this.bands_state = Object.fromEntries(
            Object.entries(band_colors).map(([band, _]) => [band, true])
        )
        this.width = width
        this.height = height
        this.callbacks = callbacks
        this.is_night_enabled = false

        this.lines = []
        this.geo_generator = d3.geoPath().projection(this.projection)
        this.graticule = d3.geoGraticule()
        this.rotation_params = {
            // Rotation-by-dragging parameters
            q0: null,
            v0: null,
            r0: null
        }

        this.build_ui(this.width, this.height)

        const drag = d3
            .drag()
            .on("start", event => this.drag_started(event))
            .on("drag", event => this.dragged(event))

        const zoom = d3
            .zoom()
            .scaleExtent([100, 600])
            .on("zoom", debounce(event => {
                this.projection.scale(event.transform.k)
                this.render()
            }, 0.1))

        d3.select("svg").call(drag).call(zoom)

        this.projection_type = HolyMap.default_projection
        this.render()
    }

    fit_map() {
        this.projection.fitSize([this.width, this.height], this.geojson)
        this.projection.translate([this.height / 2, this.width / 2])
    }

    set projection_type(projection_type) {
        this.projection = d3["geo" + projection_type]()
        this.projection.precision(0.1)
        this.geo_generator.projection(this.projection)

        this.fit_map()
        this.render()
    }

    set_band_state(band, is_enabled) {
        this.bands_state[band] = is_enabled
        this.render()
    }

    set night_enabled(is_enabled) {
        this.is_night_enabled = is_enabled

        if (is_enabled) {
            d3.select("g.night")
                .append("path")
                .style("pointer-events", "none")
                .style("fill", "rgba(0,0,128,0.2)")
        } else {
            d3.select("g.night path").remove()
        }
        this.render()
    }

    reset_view() {
        this.projection.rotate([0, 0, 0])
        this.render()
    }

    build_ui(width, height) {
        const svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)

        svg.append("defs")
            .append("clipPath")
            .attr("id", "map-clip")
            .append("circle")
            .attr("r", Math.min(width / 2, height / 2))
            .attr("cx", width / 2)
            .attr("cy", height / 2)

        svg.append("circle")
            .attr("r", Math.min(width / 2, height / 2))
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", "none")
            .style("stroke", "black")

        svg.append("g")
            .classed("graticule", true)
            .attr("clip-path", "url(#map-clip)")
            .append("path")
        svg.append("g")
            .attr("clip-path", "url(#map-clip)")
            .classed("map", true)
        svg.append("g")
            .attr("clip-path", "url(#map-clip)")
            .classed("lines", true)
        svg.append("g")
            .attr("clip-path", "url(#map-clip)")
            .classed("night", true)
    }

    render() {
        // Update world map
        let u = d3.select("g.map")
            .selectAll("path")
            .data(this.geojson.features)
            .style("fill", "#def7cf")
            .style("stroke", "#777")

        u.enter()
            .append("path")
            .merge(u)
            .attr("d", this.geo_generator)

        u = d3.select("g.lines")
            .selectAll("path")
            .data(this.lines.filter(line => this.bands_state[line.properties.band]))

        u.exit().remove()

        u.enter()
            .append("path")
            .merge(u)
            .attr("d", this.geo_generator)
            .style("fill", "none")
            .style("stroke", d => this.band_colors[d.properties.band])
            .on("click", d => {
                this.callbacks.line_click(d.target.__data__.properties)
            })

        if (this.is_night_enabled) {
            d3.select("g.night path")
                .datum(this.get_night_circle())
                .attr("d", this.geo_generator)
        }

        // Update graticule
        d3.select(".graticule path")
            .datum(this.graticule())
            .attr("d", this.geo_generator)
            .style("fill", "none")
            .style("stroke", "#eee")
    }

    drag_started(event) {
        this.rotation_params.v0 = versor.cartesian(this.projection.invert([event.x, event.y]))
        this.rotation_params.r0 = this.projection.rotate()
        this.rotation_params.q0 = versor(this.rotation_params.r0)
    }

    dragged(event) {
        const coordinates = this.projection.rotate(this.rotation_params.r0).invert([event.x, event.y])
        const v1 = versor.cartesian(coordinates)
        const q1 = versor.multiply(this.rotation_params.q0, versor.delta(this.rotation_params.v0, v1))
        const r1 = versor.rotation(q1)
        this.projection.rotate(r1)
        this.render()
    }

    add_spot(spot_data) {
        this.lines.push(
            {
                type: "LineString",
                coordinates: [
                    spot_data.spotter_loc,
                    spot_data.dx_loc,
                ],
                properties: {
                    // Just temporary until we have proper API
                    band: spot_data.Band,
                    freq: Number(spot_data.Frequency) * 1000,
                    mode: spot_data.Mode
                }
            }
        )
    }

    get_sun_coordinates() {
        const now = new Date
        const day = new Date(+now).setUTCHours(0, 0, 0, 0)
        const t = century(now)
        const longitude = (day - now) / 864e5 * 360 - 180
        return [longitude - equationOfTime(t) / 4, declination(t)]
    }

    get_night_circle() {
        const antipode = ([longitude, latitude]) => [longitude + 180, -latitude]
        return d3.geoCircle()
            .radius(90)
            .center(antipode(this.get_sun_coordinates()))()
    }
}
