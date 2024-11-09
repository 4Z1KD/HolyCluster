import Input from "@/components/Input.jsx";
import Button from "@/components/Button.jsx";
import Radio from "@/components/Radio.jsx";
import Night from "@/components/Night.jsx";

import Maidenhead from "maidenhead";

function MapControls({
    home_locator,
    map_controls,
    set_map_controls,
    radio_status,
    default_radius,
}) {
    function reset_map() {
        const locator = home_locator == "" ? "JJ00AA" : home_locator;
        const [lat, lon] = Maidenhead.toLatLon(locator);
        set_map_controls(state => {
            state.radius_in_km = default_radius;
            state.location = { displayed_locator: locator, location: [ lon, lat ] };
        })
    }

    const radio_status_to_color = {
        unknown: "#888888",
        unavailable: "#888888",
        connected: "#00DD00",
        disconnected: "#DD0000",
    }

    return (
        <div className="flex flex-wrap justify-start place-items-center w-full h-16 p-3 gap-4">
            <p className="rounded-lg bg-slate-200 p-2">{map_controls.location.displayed_locator}</p>
            <Button on_click={reset_map}>MyQTH</Button>
            <Night
                is_active={map_controls.night}
                size="32"
                on_click={event => set_map_controls(state => state.night = !state.night)}
            />

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
