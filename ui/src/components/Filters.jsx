import Alerts from "@/components/Alerts.jsx";
import Clock from "@/components/Clock.jsx";

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
        "max-w-16",
        "rounded-xl",
        "border-slate-400",
        "border-2",

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

    return (
        <div className="flex flex-row justify-between min-h-[60px] border-b-solid border-b-sky border-b-2">
            <div className={box_container_style}>
                {[...band_colors].map(([band, color]) => {
                    return <FilterOptions
                        key={band}
                        on_only_click={() => set_only_filter_keys("bands", band)}
                        on_all_click={() => set_filter_keys("bands", true)}
                        on_none_click={() => set_filter_keys("bands", false)}
                    >
                        <div
                            className={box_style}
                            style={{ backgroundColor: color }}>
                            <span>{band}</span>
                            <input
                                type="checkbox"
                                onChange={_ => set_filters(state => state.bands[band] = !state.bands[band])}
                                checked={filters.bands[band]}
                            />
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
                        <div className={box_style}>
                            <span>{mode}</span>
                            <input
                                type="checkbox"
                                onChange={_ =>  set_filters(state => state.modes[mode] = !state.modes[mode])}
                                checked={filters.modes[mode]}
                            />
                        </div>
                    </FilterOptions>;
                })}
            </div>
            <div className={box_container_style + " self-center px-4"}>
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
