import Alerts from "@/components/Alerts.jsx";
import CallsignFilters from "@/components/CallsignFilters.jsx";
import Clock from "@/components/Clock.jsx";
import NetworkState from "@/components/NetworkState.jsx";
import Spinner from "@/components/Spinner.jsx";
import Settings from "@/components/Settings.jsx";

import FilterOptions from "@/components/FilterOptions.jsx";
import FilterButton from "@/components/FilterButton.jsx";

import { band_colors, modes } from "@/filters_data.js";

const spots_time_limits = {
    "5 Minutes": 300,
    "15 Minutes": 900,
    "30 Minutes": 1800,
    "1 Hour": 3600,
    // "3 Hour": 10800,
    // "9 Hour": 32400,
    // "12 Hour": 43200,
    // "24 Hour": 86400,
}

function FilterBar({
    filters,
    set_filters,
    alerts,
    set_alerts,
    settings,
    set_settings,
    set_map_controls,
    network_state,
}) {
    const box_container_style = "flex flex-wrap h-full p-2 gap-3";

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

    return (
        <div className="flex flex-row justify-between min-h-16 border-b-solid border-b-sky border-b-2">
            <div className={box_container_style}>
                <div className="w-12"></div>
                {modes.map(mode => {
                    return <FilterOptions
                        key={mode}
                        on_only_click={() => set_only_filter_keys("modes", mode)}
                        on_all_click={() => set_filter_keys("modes", true)}
                        on_none_click={() => set_filter_keys("modes", false)}
                        align="center"
                    >
                        <FilterButton
                            text={mode}
                            is_active={filters.modes[mode]}
                            on_click={_ =>  set_filters(state => state.modes[mode] = !state.modes[mode])}
                        />
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
                {network_state == "connecting"
                    ? <Spinner size="32" color="lightblue"/>
                    : <NetworkState
                        size="32"
                        color={network_state_colors[network_state]}
                        title={network_state}
                    />
                }
                <Alerts alerts={alerts} set_alerts={set_alerts}/>
                <CallsignFilters
                    filtered_callsigns={filters.callsigns}
                    set_filtered_callsigns={callsigns => set_filters(state => state.callsigns = callsigns)}
                />
                <Settings
                    settings={settings}
                    set_settings={set_settings}
                    set_map_controls={set_map_controls}
                />
                <Clock/>
            </div>
        </div>
    );
}

export default FilterBar;
