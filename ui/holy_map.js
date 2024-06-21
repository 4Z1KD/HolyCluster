function debounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

class HolyMap {
    static projection_types = [
        "AzimuthalEquidistant",
        "AzimuthalEqualArea",
        "Orthographic",
        "Equirectangular",
    ]

    static band_colors = {
        20: "#ff006e",
        15: "#8338ec",
        10: "#fb5607",
    }

    static default_projection = "AzimuthalEquidistant"

    constructor(map_data, callbacks) {
        // This fixes the order of polygon points for d3 compatability
        this.geojson = rewind(map_data, true)
        this.callbacks = callbacks
        this.lines = []
        this.geo_generator = d3.geoPath().projection(this.projection)
        this.graticule = d3.geoGraticule()
        this.state = {
            type: HolyMap.default_projection,
            // Rotation-by-dragging parameters
            q0: null,
            v0: null,
            r0: null
        }

        const drag = d3
            .drag()
            .on("start", event => this.drag_started(event))
            .on("drag", event => this.dragged(event))

        const zoom = d3.zoom().on("zoom", debounce(event => {
            const scale = Math.min(Math.max(event.transform.k * 150, 100), 400)
            this.projection.scale(scale)
            this.render()
        }, 0.1))

        d3.select("svg").call(drag).call(zoom)

        this.projection_type = "AzimuthalEquidistant"
        this.render()
    }

    set projection_type(projection_type) {
        this.projection = d3["geo" + projection_type]()
        this.projection.precision(0.1)
        this.geo_generator.projection(this.projection)
        this.render()
    }

    reset_view() {
        this.projection.rotate([0, 0, 0]).scale(100)
        this.render()
    }

    render() {
        // Update world map
        let u = d3.select("g.map")
            .selectAll("path")
            .data(this.geojson.features)

        u.enter()
            .append("path")
            .merge(u)
            .attr("d", this.geo_generator)

        u = d3.select("g.lines")
            .selectAll("path")
            .data(this.lines)

        u.enter()
            .append("path")
            .merge(u)
            .attr("d", this.geo_generator)
            .style("fill", "none")
            .style("stroke", d => HolyMap.band_colors[d.properties.band])
            .on("click", d => {
                this.callbacks.line_click(d.target.__data__.properties)
            })

        // Update projection center
        const projectedCenter = this.projection([0, 0])
        d3.select(".projection-center")
            .attr("cx", projectedCenter[0])
            .attr("cy", projectedCenter[1])

        // Update graticule
        d3.select(".graticule path")
            .datum(this.graticule())
            .attr("d", this.geo_generator)
    }

    drag_started(event) {
        this.state.v0 = versor.cartesian(this.projection.invert([event.x, event.y]))
        this.state.r0 = this.projection.rotate()
        this.state.q0 = versor(this.state.r0)
    }

    dragged(event) {
        const coordinates = this.projection.rotate(this.state.r0).invert([event.x, event.y])
        const v1 = versor.cartesian(coordinates)
        const q1 = versor.multiply(this.state.q0, versor.delta(this.state.v0, v1))
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
                    band: spot_data.Band
                }
            }
        )
    }
}

