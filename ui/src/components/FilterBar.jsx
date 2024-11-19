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
    set_radius_in_km,
    network_state,
}) {
    const Hex = <svg fill="#000000" width="16" height="16" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
    <path d="M228,80.668V175.332a16.0255,16.0255,0,0,1-8.12695,13.9292l-84,47.47852a16.08782,16.08782,0,0,1-15.7461,0l-84-47.478A16.02688,16.02688,0,0,1,28,175.332V80.668a16.0255,16.0255,0,0,1,8.127-13.9292l84-47.47852a16.08654,16.08654,0,0,1,15.7461,0l84,47.478A16.02688,16.02688,0,0,1,228,80.668Z"/>
  </svg>
    const box_container_style = "flex flex-wrap h-full p-2 gap-3";

    const network_state_colors = { "connected": "#00EE00", "disconnected": "#EE0000" };

    return (
        <div className="flex flex-row justify-between min-h-16 border-b-solid border-b-sky border-b-2">
            <div className={box_container_style}>
                <div className="w-12"></div>
                {modes.map(mode => {
                    let align;
                    if (mode == "SSB") {
                        align = "slightly-right";
                    } else {
                        align = "center";
                    }
                    return <FilterOptions
                        key={mode}
                        set_filters={set_filters}
                        filter_key="modes"
                        filter_value={mode}
                        orientation="bottom"
                        align={align}
                    >
                        <FilterButton
                            Svg={Hex}
                            text={mode}
                            is_active={filters.modes[mode]}
                            on_click={_ => set_filters(state => state.modes[mode] = !state.modes[mode])}
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
                    ? <Spinner size="32" color="lightblue" />
                    : <NetworkState
                        size="32"
                        color={network_state_colors[network_state]}
                        title={network_state}
                    />
                }
                <Settings
                    settings={settings}
                    set_settings={set_settings}
                    set_map_controls={set_map_controls}
                    set_radius_in_km={set_radius_in_km}
                />
                <Clock />
            </div>
        </div>
    );
}

export default FilterBar;
