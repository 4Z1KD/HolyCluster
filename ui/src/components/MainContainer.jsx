import SvgMap from "@/components/SvgMap.jsx";
import CanvasMap from "@/components/CanvasMap.jsx";
import MapControls from "@/components/MapControls.jsx";
import TopBar from "@/components/TopBar.jsx";
import SpotsTable from "@/components/SpotsTable.jsx";
import Continents from "@/components/Continents.jsx";
import LeftColumn from "@/components/LeftColumn.jsx";
import CallsignsView from "@/components/CallsignsView.jsx";
import Tabs from "@/components/Tabs.jsx";
import { is_matching_list } from "@/utils.js";
import { band_colors, modes, continents } from "@/filters_data.js";

import Maidenhead from "maidenhead";
import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useLocalStorage, useMediaQuery } from "@uidotdev/usehooks";


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
                    set_spots(data.map(spot => {
                        if (spot.mode == "DIGITAL") {
                            spot.mode = "DIGI";
                        }
                        return spot
                    }))
                    set_network_state("connected")
                }
            })
            .catch(_ => {
                set_network_state("disconnected")
            })
    }
}

function use_object_local_storage(key, default_value) {
    const [current_value, set_value] = useLocalStorage(key, default_value);

    const should_update = Object.keys(default_value) != Object.keys(current_value);

    let merged_value;
    if (should_update) {
        merged_value = Object.fromEntries(Object.entries(default_value).map(([key, default_value]) => {
            return [key, current_value[key] != null ? current_value[key] : default_value];
        }));
    } else {
        merged_value = current_value;
    }

    useEffect(() => {
        if (should_update) {
            set_value(merged_value);
        }
    }, [current_value]);

    return [merged_value, set_value];
}

function MainContainer() {
    const [toggled_ui, set_toggled_ui] = useState({ left: true, right: true });
    const [filters, set_filters_inner] = use_object_local_storage(
        "filters",
        {
            bands: Object.fromEntries(Array.from(band_colors.keys()).map(band => [band, true])),
            modes: Object.fromEntries(modes.map(mode => [mode, true])),
            dx_continents: Object.fromEntries(continents.map(continent => [continent, true])),
            spotter_continents: Object.fromEntries(continents.map(continent => [continent, true])),
            include_callsigns: [],
            exclude_callsigns: [],
            is_include_filters_active: true,
            is_exclude_filters_active: true,
            time_limit: 3600,
        }
    );

    const include_filters_callsigns = filters.include_callsigns.filter(([pattern, _]) => pattern.length > 0);
    const exclude_filters_callsigns = filters.exclude_callsigns.filter(([pattern, _]) => pattern.length > 0);

    const set_filters = (change_func) => {
        set_filters_inner(previous_state => {
            const state = structuredClone(previous_state);
            change_func(state);
            return state;
        })
    }

    let [alerts, set_alerts] = useLocalStorage("alerts", [])
    alerts = alerts.filter(([pattern, _]) => pattern.length > 0);

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

    for (const spot of spots) {
        spot.is_alerted = is_matching_list(alerts, spot.dx_callsign);
    }

    const filtered_spots = spots
        .filter(spot => {
            const is_in_time_limit = (current_time - spot.time) < filters.time_limit;
            // Alerted spots are displayed, no matter what.
            if (spot.is_alerted && is_in_time_limit) {
                return true;
            }

            const is_band_and_mode_active = filters.bands[spot.band] && filters.modes[spot.mode];

            const are_include_filters_empty = include_filters_callsigns.length == 0;
            const are_exclude_filters_empty = exclude_filters_callsigns.length == 0;
            const are_filters_including = (
                is_matching_list(include_filters_callsigns, spot.dx_callsign) || are_include_filters_empty
            ) || !filters.is_include_filters_active;
            const are_filters_not_excluding = (
                !is_matching_list(exclude_filters_callsigns, spot.dx_callsign) || are_exclude_filters_empty
            ) || !filters.is_exclude_filters_active;

            const is_dx_continent_active = filters.dx_continents[spot.dx_continent];
            const is_spotter_continent_active = filters.spotter_continents[spot.spotter_continent];

            const result = (
                is_in_time_limit
                && is_dx_continent_active
                && is_spotter_continent_active
                && is_band_and_mode_active
                && are_filters_including
                && are_filters_not_excluding
            );
            return result;
        })
        .slice(0, 100);

    const spots_per_band_count = Object.fromEntries(
        Array
            .from(band_colors.keys())
            .map(band => [band, filtered_spots.filter(spot => spot.band == band).length])
    );

    // Limit the count for 2 digit display
    for (const band in spots_per_band_count) {
        spots_per_band_count[band] = Math.min(spots_per_band_count[band], 99);
    }

    let { send_message_to_radio, radio_status } = connect_to_radio();

    function set_cat_to_spot(spot) {
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
    const [canvas, _] = useLocalStorage("canvas", false);


    const is_md_device = useMediaQuery("only screen and (max-width : 768px)");

    const map = <div className="relative h-full w-full">
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
                radius_in_km={radius_in_km}
                set_radius_in_km={set_radius_in_km}
            />
        }
    </div>;

    const table = <SpotsTable
        spots={filtered_spots}
        hovered_spot={hovered_spot}
        set_hovered_spot={set_hovered_spot}
        pinned_spot={pinned_spot}
        set_pinned_spot={set_pinned_spot}
        set_cat_to_spot={set_cat_to_spot}
    />;

    return <>
        <TopBar
            filters={filters}
            set_filters={set_filters}
            settings={settings}
            set_settings={set_settings}
            set_map_controls={set_map_controls}
            set_radius_in_km={set_radius_in_km}
            network_state={network_state}
            toggled_ui={toggled_ui}
            set_toggled_ui={set_toggled_ui}
        />
        <div className="flex relative h-[calc(100%-4rem)]">
            <LeftColumn
                filters={filters}
                set_filters={set_filters}
                spots_per_band_count={spots_per_band_count}
                toggled_ui={toggled_ui}
            />
            { is_md_device
                ? <Tabs map={map} table={table}></Tabs>
                : <>{map}{table}</>}
            <CallsignsView
                alerts={alerts}
                set_alerts={set_alerts}
                filters={filters}
                set_filters={set_filters}
                toggled_ui={toggled_ui}
            />
            <Continents
                filters={filters}
                set_filters={set_filters}
                toggled_ui={toggled_ui}
            />
        </div>
    </>;
}

export default MainContainer;
