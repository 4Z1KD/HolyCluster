import SvgMap from "@/components/SvgMap.jsx";
import CanvasMap from "@/components/CanvasMap.jsx";
import MapControls from "@/components/MapControls.jsx";
import FilterBar from "@/components/FilterBar.jsx";
import SpotsTable from "@/components/SpotsTable.jsx";
import Continents from "@/components/Continents.jsx";
import Bands from "@/components/Bands.jsx";
import CallsignsView from "@/components/CallsignsView.jsx";
import { band_colors, modes, continents } from "@/filters_data.js";

import Maidenhead from "maidenhead";
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useLocalStorage } from "@uidotdev/usehooks";


function connect_to_radio() {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const websocket_url = (protocol == "https:" ? "wss:" : "ws:") + "//" + host + "/radio";

    const { sendJsonMessage, readyState, lastJsonMessage } = useWebSocket(websocket_url);
    const [radio_status, set_radio_status] = useState("unknown");

    useEffect(() => {
        if (lastJsonMessage != null) {
            if ("status" in lastJsonMessage) {
                set_radio_status(lastJsonMessage.status)
            }
        }
    }, [lastJsonMessage]);

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

function fetch_spots(set_spots, set_network_state) {
    let url;
    // For debugging purposes
    if (window.location.port == "5173") {
        url = "https://holycluster.iarc.org/spots"
    } else {
        url = "/spots"
    }
    if (!navigator.onLine) {
        set_network_state("disconnected")
    } else {
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
                    set_network_state("connected")
                }
            })
            .catch(_ => {
                set_network_state("disconnected")
            })
    }
}

function use_object_local_storage(key, default_value) {
    const [value, set_value] = useLocalStorage(key, default_value);

    const merged_value = {...default_value, ...value};

    if (JSON.stringify(value) !== JSON.stringify(merged_value)) {
        set_value(merged_value);
    }

    return [merged_value, set_value];
}

function MainContainer() {
    const [filters, set_filters_inner] = use_object_local_storage(
        "filters",
        {
            bands: Object.fromEntries(Array.from(band_colors.keys()).map(band => [band, true])),
            modes: Object.fromEntries(modes.map(mode => [mode, true])),
            dx_continents: Object.fromEntries(continents.map(continent => [continent, true])),
            spotter_continents: Object.fromEntries(continents.map(continent => [continent, true])),
            callsigns: [],
            time_limit: 3600,
        }
    );
    const callsign_filters_regex = filters.callsigns.map(regex => new RegExp(`^${regex.replaceAll("*", ".*")}$`))

    const set_filters = (change_func) => {
        set_filters_inner(previous_state => {
            const state = structuredClone(previous_state);
            change_func(state);
            return state;
        })
    }

    const [alerts, set_alerts] = useLocalStorage("alerts", [])
    const alerts_regex = alerts.map(regex => new RegExp(`^${regex.replaceAll("*", ".*")}$`))

    const [map_controls, set_map_controls_inner] = use_object_local_storage(
        "map_controls",
        {
            night: false,
            location: {
                displayed_locator: "JJ00AA",
                // Longitude, latitude
                location: [0, 0]
            },
        }
    );

    const set_map_controls = (change_func) => {
        set_map_controls_inner(previous_state => {
            const state = structuredClone(previous_state);
            change_func(state);
            return state;
        })
    }

    const [settings, set_settings_inner] = use_object_local_storage(
        "settings",
        { locator: "JJ00AA", default_radius: 20000 }
    );

    const [radius_in_km, set_radius_in_km] = useState(settings.default_radius);

    const set_settings = (change_func) => {
        set_settings_inner(previous_state => {
            const state = structuredClone(previous_state);
            change_func(state);
            return state;
        })
    }

    const current_time = new Date().getTime() / 1000

    const [spots, set_spots] = useState([])
    const [network_state, set_network_state] = useState("connecting")

    useEffect(() => {
        fetch_spots(set_spots, set_network_state)
        let interval_id = setInterval(() => fetch_spots(set_spots, set_network_state), 30 * 1000);

        // Try to fetch again the spots when the device is connected to the internet
        const handle_online = () => {
            set_network_state("connecting");
            fetch_spots(set_spots, set_network_state);
        };
        const handle_offline = () => {
            set_network_state("disconnected");
        };

        window.addEventListener("online", handle_online);
        window.addEventListener("offline", handle_offline);

        return () => {
            window.removeEventListener("online", handle_online);
            window.removeEventListener("offline", handle_offline);
            clearInterval(interval_id);
        };
    }, [])

    const filtered_spots = spots
        .filter(spot => {
            const is_in_time_limit = (current_time - spot.time) < filters.time_limit;
            const is_band_and_mode_active = filters.bands[spot.band] && filters.modes[spot.mode];
            const are_filters_empty = callsign_filters_regex.length == 0;
            const are_filters_matching = callsign_filters_regex.some(regex => spot.dx_callsign.match(regex));

            const is_dx_continent_active = filters.dx_continents[spot.dx_continent];
            const is_spotter_continent_active = filters.spotter_continents[spot.spotter_continent];

            return (
                is_in_time_limit
                && is_dx_continent_active
                && is_spotter_continent_active
                && is_band_and_mode_active
                && (are_filters_empty || are_filters_matching)
            );
        })
        .slice(0, 100)

    let { send_message_to_radio, radio_status } = connect_to_radio();

    function set_cat_to_spot(spot) {
        console.log("set_cat", spot)
        send_message_to_radio({mode: spot.mode, freq: spot.freq, band: spot.band})
    }

    let [hovered_spot, set_hovered_spot] = useState({ source: null, id: null });
    let [pinned_spot, set_pinned_spot] = useState(null);

    function on_escape_clicked(event) {
        if (event.key == "Escape") {
            set_pinned_spot(null)
        }
    }

    useEffect(() => {
        document.body.addEventListener("keydown", on_escape_clicked);
        return () => {
            document.body.removeEventListener("keydown", on_escape_clicked);
        }
    });

    // This is a debug variable that should be set from the dev console
    let [canvas, _] = useLocalStorage("canvas", false);

    return <>
        <FilterBar
            filters={filters}
            set_filters={set_filters}
            alerts={alerts}
            set_alerts={set_alerts}
            settings={settings}
            set_settings={set_settings}
            set_map_controls={set_map_controls}
            set_radius_in_km={set_radius_in_km}
            network_state={network_state}
        />
        <div className="flex h-[calc(100%-4rem)] max-lg:flex-wrap divide-x divide-slate-300">
            <Bands filters={filters} set_filters={set_filters}/>
            <div className="w-full divide-y divide-slate-300">
                <MapControls
                    home_locator={settings.locator}
                    map_controls={map_controls}
                    set_map_controls={set_map_controls}
                    radio_status={radio_status}
                    default_radius={settings.default_radius}
                    set_radius_in_km={set_radius_in_km}
                />
                {canvas ?
                    <CanvasMap
                        spots={filtered_spots}
                        map_controls={map_controls}
                        set_map_controls={set_map_controls}
                        set_cat_to_spot={set_cat_to_spot}
                        hovered_spot={hovered_spot}
                        set_hovered_spot={set_hovered_spot}
                        pinned_spot={pinned_spot}
                        set_pinned_spot={set_pinned_spot}
                        alerts={alerts_regex}
                    />
                    :
                    <SvgMap
                        spots={filtered_spots}
                        map_controls={map_controls}
                        set_map_controls={set_map_controls}
                        set_cat_to_spot={set_cat_to_spot}
                        hovered_spot={hovered_spot}
                        set_hovered_spot={set_hovered_spot}
                        pinned_spot={pinned_spot}
                        set_pinned_spot={set_pinned_spot}
                        alerts={alerts_regex}
                        radius_in_km={radius_in_km}
                        set_radius_in_km={set_radius_in_km}
                    />
                }
            </div>
            <SpotsTable
                spots={filtered_spots}
                hovered_spot={hovered_spot}
                set_hovered_spot={set_hovered_spot}
                pinned_spot={pinned_spot}
                set_pinned_spot={set_pinned_spot}
                set_cat_to_spot={set_cat_to_spot}
                alerts={alerts_regex}
            />
            <CallsignsView
                alerts={alerts}
                set_alerts={set_alerts}
                filters={filters}
                set_filters={set_filters}
            />
            <Continents filters={filters} set_filters={set_filters}/>
        </div>
    </>;
}

export default MainContainer;
