import Input from "@/components/Input.jsx";
import Button from "@/components/Button.jsx";
import Radio from "@/components/Radio.jsx";

import Maidenhead from "maidenhead";

const projection_types = [
    "AzimuthalEquidistant",
    "AzimuthalEqualArea",
    "Orthographic",
]

function MapControls({
    map_controls,
    set_map_controls,
    radio_status,
    canvas_rendering,
    set_canvas_rendering,
}) {
    function reset_map() {
        set_map_controls(state => state.location = {displayed_locator: "", location: [ 0, 0 ]})
    }

    const radio_status_to_color = {
        unknown: "#888888",
        unavailable: "#888888",
        connected: "#00DD00",
        disconnected: "#DD0000",
    }

    return (
        <div className="flex flex-wrap justify-start place-items-center w-full h-auto p-3 gap-4">
            <Input
                value={map_controls.location.displayed_locator}
                placeholder="Locator"
                onChange={event => {
                    const new_value = event.target.value;
                    if (Maidenhead.valid(new_value)) {
                        const [lat, lon] = Maidenhead.toLatLon(new_value);
                        set_map_controls(state => {
                            state.location = {displayed_locator: new_value, location: [lon, lat]};
                        })
                    } else if (new_value.length == 0) {
                        reset_map()
                    } else {
                        set_map_controls(state => state.location.displayed_locator = new_value)
                    }
                }
            }/>
            <select
                className="rounded-lg px-4 py-2"
                value={map_controls.projection_type}
                onChange={event => set_map_controls(state => state.projection_type = event.target.value)}
            >
                {projection_types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <Button on_click={reset_map}>Reset</Button>
            <div className="space-x-2">
                <input
                    type="checkbox"
                    checked={map_controls.night}
                    onChange={event => set_map_controls(state => state.night = event.target.checked)}
                ></input>
                <label className="text-slate-700">Show night</label>
            </div>

            <div className="ml-auto flex gap-4">
                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        onChange={_ => set_canvas_rendering(!canvas_rendering)}
                        defaultChecked={canvas_rendering}
                    />
                <span>Canvas</span>
                </div>
                <Radio color={radio_status_to_color[radio_status]} size="36"></Radio>
            </div>
        </div>
    );
}

export default MapControls;
