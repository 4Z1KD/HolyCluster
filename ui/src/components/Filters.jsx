import Alerts from "@/components/Alerts.jsx";
import Clock from "@/components/Clock.jsx";
import NetworkState from "@/components/NetworkState.jsx";
import Spinner from "@/components/Spinner.jsx";

import FilterOptions from "@/components/FilterOptions.jsx";

import { band_colors, modes } from "@/bands_and_modes.js";

const spots_time_limits = {
    "5 Minutes": 300,
    "15 Minutes": 900,
    "30 Minutes": 1800,
    "1 Hour": 3600,
    "3 Hour": 10800,
    "9 Hour": 32400,
    "12 Hour": 43200,
    "24 Hour": 86400,
}

function Filters({
    filters,
    set_filters,
    alerts,
    set_alerts,
    network_state,
}) {
    const box_container_style = [
        "flex",
        "flex-wrap",
        "h-full",
        "p-2",
        "gap-3",
    ].join(" ");
    const box_style = [
        // Related to the layout of the box itself
        "min-w-12",
        "max-w-18",
        "text-center",
        "text-base",
        "font-bold",
        "rounded-xl",
        "border-slate-400",
        "border-2",
        "cursor-pointer",

        // Related to the content of each box
        "p-2",
    ].join(" ");

    // This function changes all the keys in the filter object.
    // For example: set_filter_keys("bands", true) will enable all bands.
    function set_filter_keys(filters_key, is_active) {
        set_filters(state => {
            Object.keys(state[filters_key]).forEach(key => {
                state[filters_key][key] = is_active;
            })
        })
    }

    // This function set only on filter on.
    // For example: set_only_filter_keys("modes", "CW"), enables only CW.
    function set_only_filter_keys(filters_key, selected_key) {
        set_filters(state => {
            Object.keys(state[filters_key]).forEach(key => {
                state[filters_key][key] = selected_key == key;
            })
        })
    }
    const network_state_colors = {"connected": "#00EE00", "disconnected": "#EE0000"};
    const inactive_background_color = "#AAAAAA";
    const active_text_color = "#000000";
    const inactive_text_color = "#666666";

    return (
        <div className="flex flex-row justify-between h-16 border-b-solid border-b-sky border-b-2">
            <div className={box_container_style}>
                {[...band_colors].map(([band, color]) => {
                    return <FilterOptions
                        key={band}
                        on_only_click={() => set_only_filter_keys("bands", band)}
                        on_all_click={() => set_filter_keys("bands", true)}
                        on_none_click={() => set_filter_keys("bands", false)}
                    >
                        <div
                            className={box_style + " hover:brightness-125"}
                            onClick={_ => set_filters(state => state.bands[band] = !state.bands[band])}
                            style={{
                                backgroundColor: filters.bands[band] ? color : inactive_background_color,
                                color: filters.bands[band] ? active_text_color : inactive_text_color,
                                userSelect: "none",
                            }}>
                            <span>{band}</span>
                        </div>
                    </FilterOptions>;
                })}
            </div>
            <div className={box_container_style}>
                {modes.map(mode => {
                    return <FilterOptions
                        key={mode}
                        on_only_click={() => set_only_filter_keys("modes", mode)}
                        on_all_click={() => set_filter_keys("modes", true)}
                        on_none_click={() => set_filter_keys("modes", false)}
                    >
                        <div
                            className={box_style + " hover:brightness-110"}
                            onClick={_ =>  set_filters(state => state.modes[mode] = !state.modes[mode])}
                            style={{
                                backgroundColor: filters.modes[mode] ? "#D1FAE5" : inactive_background_color,
                                color: filters.modes[mode] ? active_text_color : inactive_text_color,
                                userSelect: "none",
                            }}>
                            <span>{mode}</span>
                        </div>
                    </FilterOptions>;
                })}
            </div>
            <div className={box_container_style + " self-center px-4"}>
                {network_state == "connecting"
                    ? <Spinner size="32" color="lightblue"></Spinner>
                    : <NetworkState
                        size="32"
                        color={network_state_colors[network_state]}
                        title={network_state}
                    />
                }
                <select
                    className="rounded-lg px-4 py-2"
                    value={filters.time_limit}
                    onChange={event => set_filters(state => state.time_limit = event.target.value)}
                >
                    {Object.entries(spots_time_limits).map(([text, minutes]) => {
                        return <option key={minutes} value={minutes}>{text}</option>
                    })}
                </select>
                <Alerts alerts={alerts} set_alerts={set_alerts}></Alerts>
                <Clock></Clock>
            </div>
        </div>
    );
}

export default Filters;
