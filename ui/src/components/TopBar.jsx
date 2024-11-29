import Clock from "@/components/Clock.jsx";
import NetworkState from "@/components/NetworkState.jsx";
import Spinner from "@/components/Spinner.jsx";
import Settings from "@/components/Settings.jsx";

import FilterOptions from "@/components/FilterOptions.jsx";
import FilterButton from "@/components/FilterButton.jsx";

import Icon from "@/icon.png";

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

const Hex = <svg fill="#000000" width="16" height="16" viewBox="0 0 256 256">
    <path d="M228,80.668V175.332a16.0255,16.0255,0,0,1-8.12695,13.9292l-84,47.47852a16.08782,16.08782,0,0,1-15.7461,0l-84-47.478A16.02688,16.02688,0,0,1,28,175.332V80.668a16.0255,16.0255,0,0,1,8.127-13.9292l84-47.47852a16.08654,16.08654,0,0,1,15.7461,0l84,47.478A16.02688,16.02688,0,0,1,228,80.668Z" />
</svg>

const Triangle = <svg width="16" height="16" viewBox="0 0 512 512">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="drop" fill="#000000" transform="translate(32.000000, 42.666667)">
            <path
                d="M246.312928,5.62892705 C252.927596,9.40873724 258.409564,14.8907053 262.189374,21.5053731 L444.667042,340.84129 C456.358134,361.300701 449.250007,387.363834 428.790595,399.054926 C422.34376,402.738832 415.04715,404.676552 407.622001,404.676552 L42.6666667,404.676552 C19.1025173,404.676552 7.10542736e-15,385.574034 7.10542736e-15,362.009885 C7.10542736e-15,354.584736 1.93772021,347.288125 5.62162594,340.84129 L188.099293,21.5053731 C199.790385,1.04596203 225.853517,-6.06216498 246.312928,5.62892705 Z"
            />
        </g>
    </g>
</svg>

const Square = <svg className="ml-1" width="12" height="12" viewBox="0 0 16 16">
    <rect width="100" height="100"/>
</svg>

function TopBar({
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
    const box_container_style = "flex flex-wrap h-full p-2 gap-3";

    const network_state_colors = { "connected": "#00EE00", "disconnected": "#EE0000" };

    return (
        <div className="flex flex-row justify-between min-h-16 border-2">
            <div className={box_container_style}>
                <img className="object-contain max-h-12 w-10 m-auto" src={Icon}/>
                {modes.map(mode => {
                    let align;
                    let symbol;
                    if (mode == "SSB") {
                        align = "slightly-right";
                        symbol = Square
                    } else {
                        align = "center";
                        if (mode == "CW") {
                            symbol = Triangle
                        } else {
                            symbol = Hex
                        }
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
                            svg={symbol}
                            text={mode}
                            is_active={filters.modes[mode]}
                            on_click={_ => set_filters(state => state.modes[mode] = !state.modes[mode])}
                        />
                    </FilterOptions>;
                })}
            </div>
            <h1 className="text-4xl m-auto font-bold">The Holy Cluster</h1>
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

export default TopBar;
