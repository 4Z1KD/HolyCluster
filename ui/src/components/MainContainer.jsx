import Map from "./Map.jsx";
import MapControls from "./MapControls.jsx";
import Filters from "./Filters.jsx";
import BandSpots from "./BandSpots.jsx";
import Maidenhead from "maidenhead";

import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';


const band_colors = {
    160: "#f65356",
    80: "#fb8066",
    40: "#fea671",
    30: "#fec979",
    20: "#feea80",
    17: "#d7e586",
    15: "#a5de94",
    12: "#5daad8",
    10: "#8187c7",
    6: "#c56bba",
};

const modes = ["SSB", "CW", "FT8", "RTTY", "PSK", "AM", "FM"];

function connect_to_radio() {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const websocket_url = (protocol == "https:" ? "wss:" : "ws:") + "//" + host + "/radio";

    const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(websocket_url);
    const [radio_status, set_radio_status] = useState("unknown");

    useEffect(() => {
        if (lastJsonMessage != null) {
            set_radio_status(lastJsonMessage.status)
        }
    }, [lastJsonMessage, set_radio_status]);

    const send_message_to_radio = (message) => {
        if (readyState == ReadyState.OPEN) {
            sendJsonMessage(message)
        }
    }

    return {
        send_message_to_radio: send_message_to_radio,
        radio_status: radio_status,
    }
}

function MainContainer() {
    const [projection_type, set_projection_type] = useState("AzimuthalEquidistant");
    const [night_enabled, set_night] = useState(false);

    const [location, set_location] = useState({
        displayed_locator: "",
        // Longitude, latitude
        location: [0, 0]
    });

    const [enabled_bands, set_enabled_bands] = useState(
        Object.fromEntries(Object.keys(band_colors).map(band => [band, true]))
    )
    const [enabled_modes, set_enabled_modes] = useState(
        Object.fromEntries(modes.map(mode => [mode, true]))
    )
    const [spots_time_limit, set_spots_time_limit] = useState(300)

    const current_time = new Date().getTime() / 1000

    const [spots, set_spots] = useState([])
    const [is_spots_failed, set_is_spots_failed] = useState(false)

    const fetch_spots = () => {
        let url;
        // For debugging purposes
        if (window.location.port == "5173") {
            url = "https://holycluster.iarc.org/spots"
        } else {
            url = "/spots"
        }
        return fetch(url, {mode: "cors"})
            .then(response => {
                if (response == null || !response.ok) {
                    return Promise.reject(response)
                } else {
                    return response.json()
                }
            })
            .then(data => {
                if (data == null) {
                    return Promise.reject(response)
                } else {
                    set_spots(data)
                }
            })
            .catch(_ => {
                set_spots([])
                set_is_spots_failed(true)
            })
    }

    useEffect(() => {
        fetch_spots()
        setInterval(fetch_spots, 30 * 1000)
    }, [])

    const filtered_spots = spots
        .filter(spot => (current_time - spot.time) < spots_time_limit)
        .filter(spot => enabled_bands[spot.band] && enabled_modes[spot.mode])
        .slice(0, 1000)

    // Just a hack for displaying locations of the dx
    filtered_spots.forEach(spot => {
        const [lat, lon] = Maidenhead.toLatLon(spot.dx_locator);
        spot.dx_loc = [lon, lat];
        spot.spotter_loc = [lon, lat];
    })

    let { send_message_to_radio, radio_status } = connect_to_radio();

    return (
        <div className="mt-6 xl:mx-20 shadow-xl rounded-2xl border-solid border-slate-200 border-2 min-w-[740px]">
            <Filters
                band_colors={band_colors}
                enabled_bands={enabled_bands}
                set_enabled_bands={set_enabled_bands}
                enabled_modes={enabled_modes}
                set_enabled_modes={set_enabled_modes}
                set_spots_time_limit={set_spots_time_limit}
            />
            <div className="flex max-lg:flex-wrap divide-x divide-slate-300">
                <div className="w-full divide-y divide-slate-300">
                    <MapControls
                        set_projection_type={set_projection_type}
                        set_night={set_night}
                        location={location}
                        set_location={set_location}
                        radio_status={radio_status}
                    />
                    <Map
                        spots={filtered_spots}
                        band_colors={band_colors}
                        projection_type={projection_type}
                        night_enabled={night_enabled}
                        enabled_bands={enabled_bands}
                        location={location}
                        set_location={set_location}
                        send_message_to_radio={send_message_to_radio}
                    />
                </div>
                {is_spots_failed ?
                    <div className="flex items-start justify-center w-full p-6">
                        <p class="border-red-400 border bg-red-100 text-red-700 px-1 py-3 w-80 text-center rounded-md relative" role="alert">
                            <strong className="font-bold">Error!</strong> <span className="block">Failed to get spots data.</span>
                        </p>
                    </div>
                :
                    <div className="md:columns-1 xl:columns-2 w-full gap-x-2 space-y-2 text-center p-4 overflow-x-auto">
                    {
                        Object.entries(band_colors).map(([band, color]) => {
                            if (enabled_bands[band]) {
                                return <BandSpots
                                    key={band}
                                    band={band}
                                    color={color}
                                    spots={filtered_spots}
                                    enabled_modes={enabled_modes}
                                />;
                            } else {
                                return <></>
                            }
                        })
                    }
                    </div>
                }
            </div>
        </div>
    );
}

export default MainContainer;
