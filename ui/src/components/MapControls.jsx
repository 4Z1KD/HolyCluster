import Maidenhead from "maidenhead";

const projection_types = [
    "AzimuthalEquidistant",
    "AzimuthalEqualArea",
    "Orthographic",
]

function MapControls({
    set_projection_type,
    set_night,
    location,
    set_location,
}) {
    function reset_map() {
        set_location({displayed_locator: "", location: [0, 0]})
    }

    return (
        <div className="flex flex-wrap justify-center place-items-center w-full h-auto p-3 gap-4">
            <input
                className="shadow appearance-none border rounded-lg w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                value={location.displayed_locator}
                placeholder="Locator"
                onChange={event => {
                    const new_value = event.target.value;
                    if (Maidenhead.valid(new_value)) {
                        const [lat, lon] = Maidenhead.toLatLon(new_value);
                        set_location({displayed_locator: new_value, location: [lon, lat]})
                    } else if (new_value.length == 0) {
                        reset_map()
                    } else {
                        set_location(old_location => {
                            const new_location = structuredClone(old_location);
                            new_location.displayed_locator = new_value;
                            return new_location;
                        })
                    }
                }
            }/>
            <select className="rounded-lg px-4 py-2" onChange={event => set_projection_type(event.target.value)}>
                {projection_types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <button
                className="text-white bg-blue-600 active:bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
                onClick={reset_map}
            >
                Reset
            </button>
            <div className="space-x-2">
                <input
                    type="checkbox"
                    autoComplete="off"
                    onChange={() => set_night(previous_state => !previous_state)}
                ></input>
                <label className="text-slate-700">Show night</label>
            </div>
        </div>
    );
}

export default MapControls;
