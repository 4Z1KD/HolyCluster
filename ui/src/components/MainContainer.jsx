import SvgMap from "@/components/SvgMap.jsx";
import CanvasMap from "@/components/CanvasMap/index.jsx";
import MapControls from "@/components/MapControls.jsx";
import TopBar from "@/components/TopBar.jsx";
import SpotsTable from "@/components/SpotsTable.jsx";
import Continents from "@/components/Continents.jsx";
import LeftColumn from "@/components/LeftColumn.jsx";
import CallsignsView from "@/components/CallsignsView.jsx";
import Tabs from "@/components/Tabs.jsx";
import { use_object_local_storage, is_matching_list } from "@/utils.js";
import { bands, modes, continents } from "@/filters_data.js";
import { useFilters } from "../hooks/useFilters";
import { get_flag } from "@/flags.js";

import { useState, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
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
                set_radio_status(lastJsonMessage.status);
            }
        }
    }, [lastJsonMessage]);

    const send_message_to_radio = message => {
        if (readyState == ReadyState.OPEN) {
            sendJsonMessage(message);
        }
    };

    return {
        send_message_to_radio: send_message_to_radio,
        radio_status: radio_status,
    };
}

function fetch_spots() {
    if (this.is_fetching_in_progress) {
        return;
    }
    this.is_fetching_in_progress = true;

    let url;
    // For debugging purposes
    if (window.location.port == "5173") {
        url = "https://holycluster.iarc.org/spots";
    } else {
        url = "/spots";
    }
    if (this.last_timestamp != null) {
        url += `?since=${this.last_timestamp}`;
    }

    if (!navigator.onLine) {
        this.set_network_state("disconnected");
    } else {
        return fetch(url, { mode: "cors" })
            .then(response => {
                if (response == null || !response.ok) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data == null) {
                    return Promise.reject(response);
                } else {
                    const new_spots = data.map(spot => {
                        if (spot.mode == "DIGITAL") {
                            spot.mode = "DIGI";
                        }
                        return spot;
                    });
                    const spots = new_spots.concat(this.spots);
                    spots.sort((spot_a, spot_b) => spot_b.time - spot_a.time);
                    spots.slice(500);
                    this.last_timestamp = spots[0].time;
                    this.set_spots(spots);
                    this.set_network_state("connected");
                }
                this.is_fetching_in_progress = false;
            })
            .catch(_ => {
                this.set_network_state("disconnected");
                this.is_fetching_in_progress = false;
            });
    }
}

function fetch_propagation() {
    let url;
    // For debugging purposes
    if (window.location.port == "5173") {
        url = "https://holycluster.iarc.org/propagation";
    } else {
        url = "/propagation";
    }

    if (navigator.onLine) {
        return fetch(url, { mode: "cors" })
            .then(response => {
                if (response == null || !response.ok) {
                    return Promise.reject(response);
                } else {
                    return response.json();
                }
            })
            .then(data => {
                if (data == null) {
                    return Promise.reject(response);
                } else {
                    this.set_propagation(data);
                }
            })
            .catch(_ => {});
    }
}

function MainContainer() {
    const [toggled_ui, set_toggled_ui] = useState({ left: true, right: true });

    const { filters } = useFilters();

    const include_filters_callsigns = filters.include_callsigns.filter(
        ([pattern, _]) => pattern.length > 0,
    );
    const exclude_filters_callsigns = filters.exclude_callsigns.filter(
        ([pattern, _]) => pattern.length > 0,
    );

    let [alerts, set_alerts] = useLocalStorage("alerts", []);
    alerts = alerts.filter(([pattern, _]) => pattern.length > 0);

    const [map_controls, set_map_controls_inner] = use_object_local_storage("map_controls", {
        night: false,
        location: {
            displayed_locator: "JJ00AA",
            // Longitude, latitude
            location: [0, 0],
        },
    });

    const set_map_controls = change_func => {
        set_map_controls_inner(previous_state => {
            const state = structuredClone(previous_state);
            change_func(state);
            return state;
        });
    };

    const [settings, set_settings] = use_object_local_storage("settings", {
        locator: "JJ00AA",
        default_radius: 20000,
        theme: "light",
        callsign: "",
    });

    const [table_sort, set_table_sort] = use_object_local_storage("table_sort", {
        column: "time",
        ascending: false,
    });

    const [radius_in_km, set_radius_in_km] = useState(settings.default_radius);

    const current_time = new Date().getTime() / 1000;

    const [spots, set_spots] = useState([]);
    const [propagation, set_propagation] = useState();

    const [network_state, set_network_state] = useState("connecting");

    const fetch_spots_context = useRef({
        spots,
        set_spots,
        set_network_state,
        last_timestamp: null,
    });
    // This is very importent because the spots are later sorted
    fetch_spots_context.current.spots = structuredClone(spots);

    const fetch_propagation_context = useRef({
        propagation,
        set_propagation,
    });
    fetch_propagation_context.current.propagation = propagation;

    useEffect(() => {
        const fetch_spots_with_context = fetch_spots.bind(fetch_spots_context.current);
        fetch_spots_with_context();
        let spots_interval_id = setInterval(fetch_spots_with_context, 30 * 1000);

        const fetch_propagation_with_context = fetch_propagation.bind(
            fetch_propagation_context.current,
        );
        fetch_propagation_with_context();
        let propagation_interval_id = setInterval(fetch_propagation_with_context, 3600 * 1000);

        // Try to fetch again the spots when the device is connected to the internet
        const handle_online = () => {
            set_network_state("connecting");
            fetch_spots_with_context();
            fetch_propagation_with_context();
        };
        const handle_offline = () => {
            set_network_state("disconnected");
        };

        window.addEventListener("online", handle_online);
        window.addEventListener("offline", handle_offline);

        return () => {
            window.removeEventListener("online", handle_online);
            window.removeEventListener("offline", handle_offline);
            clearInterval(spots_interval_id);
            clearInterval(propagation_interval_id);
        };
    }, []);

    for (const spot of spots) {
        spot.is_alerted = is_matching_list(alerts, spot.dx_callsign);
    }

    const [filter_missing_flags, set_filter_missing_flags] = useState(false);
    const [dev_mode, set_dev_mode] = useLocalStorage("dev_mode", false);

    if (dev_mode) {
        spots.sort((spot_a, spot_b) => {
            // Sorting by frequency should be always more accurate
            const column = table_sort.column == "band" ? "freq" : table_sort.column;
            const value_a = spot_a[column];
            const value_b = spot_b[column];
            if (typeof(value_a) == "string" && typeof(value_b) == "string") {
                if (table_sort.ascending) {
                    return value_a.localeCompare(value_b);
                } else {
                    return value_b.localeCompare(value_a);
                }
            } else if (typeof(value_b) == "number" && typeof(value_a) == "number") {
                if (table_sort.ascending) {
                    return value_a - value_b;
                } else {
                    return value_b - value_a;
                }
            } else {
                console.log(`Bad values of column ${table_sort.column}`, value_a, value_b, spot_a, spot_b);
            }
        });
    }

    const filtered_spots = spots
        .filter(spot => {
            if (filter_missing_flags) {
                if (
                    spot.dx_country != "" &&
                    spot.dx_country != null &&
                    get_flag(spot.dx_country) == null
                ) {
                    return true;
                } else {
                    return false;
                }
            }

            const is_in_time_limit = current_time - spot.time < filters.time_limit;
            // Alerted spots are displayed, no matter what.
            if (spot.is_alerted && is_in_time_limit) {
                return true;
            }

            const is_band_and_mode_active = filters.bands[spot.band] && filters.modes[spot.mode];

            const are_include_filters_empty = include_filters_callsigns.length == 0;
            const are_exclude_filters_empty = exclude_filters_callsigns.length == 0;
            const are_filters_including =
                is_matching_list(include_filters_callsigns, spot.dx_callsign) ||
                are_include_filters_empty ||
                !filters.is_include_filters_active;
            const are_filters_not_excluding =
                !is_matching_list(exclude_filters_callsigns, spot.dx_callsign) ||
                are_exclude_filters_empty ||
                !filters.is_exclude_filters_active;

            const is_dx_continent_active = filters.dx_continents[spot.dx_continent];
            const is_spotter_continent_active = filters.spotter_continents[spot.spotter_continent];

            const result =
                is_in_time_limit &&
                is_dx_continent_active &&
                is_spotter_continent_active &&
                is_band_and_mode_active &&
                are_filters_including &&
                are_filters_not_excluding;
            return result;
        })
        .slice(0, 100);

    const spots_per_band_count = Object.fromEntries(
        bands.map(band => [band, filtered_spots.filter(spot => spot.band == band).length]),
    );

    // Limit the count for 2 digit display
    for (const band in spots_per_band_count) {
        spots_per_band_count[band] = Math.min(spots_per_band_count[band], 99);
    }

    let { send_message_to_radio, radio_status } = connect_to_radio();

    function set_cat_to_spot(spot) {
        send_message_to_radio({ mode: spot.mode, freq: spot.freq, band: spot.band });
    }

    let [hovered_spot, set_hovered_spot] = useState({ source: null, id: null });
    let [pinned_spot, set_pinned_spot] = useState(null);

    const [canvas, set_canvas] = useLocalStorage("canvas", false);

    function on_key_down(event) {
        if (event.key == "Escape") {
            set_pinned_spot(null);
        }

        if (event.ctrlKey && event.altKey) {
            if (event.key == "c") {
                set_canvas(!canvas);
            } else if (event.key == "f") {
                set_filter_missing_flags(!filter_missing_flags);
            } else if (event.key == "p") {
                set_dev_mode(!dev_mode);
            }
        }
    }

    useEffect(() => {
        document.body.addEventListener("keydown", on_key_down);
        return () => {
            document.body.removeEventListener("keydown", on_key_down);
        };
    });

    const is_md_device = useMediaQuery("only screen and (max-width : 768px)");

    const map = (
        <div className="relative h-full w-full">
            <MapControls
                home_locator={settings.locator}
                map_controls={map_controls}
                set_map_controls={set_map_controls}
                radio_status={radio_status}
                default_radius={settings.default_radius}
                set_radius_in_km={set_radius_in_km}
                propagation={propagation}
                dev_mode={dev_mode}
            />
            {canvas ? (
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
            ) : (
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
            )}
        </div>
    );

    const table = (
        <SpotsTable
            spots={filtered_spots}
            hovered_spot={hovered_spot}
            set_hovered_spot={set_hovered_spot}
            pinned_spot={pinned_spot}
            set_pinned_spot={set_pinned_spot}
            set_cat_to_spot={set_cat_to_spot}
            table_sort={table_sort}
            set_table_sort={set_table_sort}
            dev_mode={dev_mode}
        />
    );

    return (
        <>
            <TopBar
                filters={filters}
                settings={settings}
                set_settings={set_settings}
                set_map_controls={set_map_controls}
                set_radius_in_km={set_radius_in_km}
                network_state={network_state}
                toggled_ui={toggled_ui}
                set_toggled_ui={set_toggled_ui}
                dev_mode={dev_mode}
            />
            <div className="flex relative h-[calc(100%-4rem)]">
                <LeftColumn
                    filters={filters}
                    spots_per_band_count={spots_per_band_count}
                    toggled_ui={toggled_ui}
                />
                {is_md_device ? (
                    <Tabs map={map} table={table}></Tabs>
                ) : (
                    <>
                        {map}
                        {table}
                    </>
                )}
                <CallsignsView alerts={alerts} set_alerts={set_alerts} toggled_ui={toggled_ui} />
                <Continents toggled_ui={toggled_ui} />
            </div>
        </>
    );
}

export default MainContainer;
