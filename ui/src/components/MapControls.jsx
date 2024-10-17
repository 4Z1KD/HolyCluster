import Input from "@/components/Input.jsx";
import Button from "@/components/Button.jsx";
import Radio from "@/components/Radio.jsx";

import Maidenhead from "maidenhead";

function MapControls({
    map_controls,
    set_map_controls,
    radio_status,
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
        <div className="flex flex-wrap justify-start place-items-center w-full h-auto min-h-[35px] p-3 gap-4">
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
            <Button on_click={reset_map}>MyQTH</Button>
            <div className="space-x-2">
                <input
                    type="checkbox"
                    checked={map_controls.night}
                    onChange={event => set_map_controls(state => state.night = event.target.checked)}
                ></input>
                <label className="text-slate-700">Show night</label>
            </div>

            <div className="ml-auto">
                {
                    // Remove this when we release the radio CAT control feature!!!
                    radio_status != "unavailable" && radio_status != "unknown"
                    ? <Radio color={radio_status_to_color[radio_status]} size="36"></Radio>
                    : ""
                }
            </div>
        </div>
    );
}

export default MapControls;
