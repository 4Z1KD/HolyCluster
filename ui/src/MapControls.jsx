import { useState } from "react";
import Maidenhead from "maidenhead";

const projection_types = [
    "AzimuthalEquidistant",
    "AzimuthalEqualArea",
    "Orthographic",
]

function MapControls({
    set_projection_type,
    set_night,
    set_station
}) {
    const [locator, set_locator] = useState("");

    function reset_map() {
        set_locator("");
        set_station(new Maidenhead(0, 0));
    }

    return (
        <div className="relative w-full bottom-0 p-3 space-x-4 self-end">
            <label>Locator:</label>
            <input
                className="shadow appearance-none border rounded-lg w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={locator}
                onChange={event => {
                    const new_value = event.target.value;
                    set_locator(new_value);
                    if (Maidenhead.valid(new_value)) {
                        const new_maidenhead = new Maidenhead();
                        new_maidenhead.locator = new_value;
                        set_station(new_maidenhead);
                    } else if (new_value.length == 0) {
                        reset_map()
                    }
                }
            }/>
            <select className="rounded-lg px-4 py-2" onChange={() => set_projection_type(event.target.value)}>
                {projection_types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <button
                className="text-white bg-blue-600 active:bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
                onClick={reset_map}
            >
                Reset
            </button>
            <input
                type="checkbox"
                autoComplete="off"
                onChange={() => set_night(previous_state => !previous_state)}
            ></input>
            <label className="text-slate-700">Show night</label>
        </div>
    );
}

export default MapControls;