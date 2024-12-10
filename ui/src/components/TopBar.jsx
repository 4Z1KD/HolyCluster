import Clock from "@/components/Clock.jsx";
import NetworkState from "@/components/NetworkState.jsx";
import Spinner from "@/components/Spinner.jsx";
import Settings from "@/components/Settings.jsx";

import Icon from "@/icon.png";
import OpenMenu from "@/components/OpenMenu.jsx";

import { modes } from "@/filters_data.js";

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

function TopBar({
    filters,
    set_filters,
    settings,
    set_settings,
    set_map_controls,
    set_radius_in_km,
    network_state,
    toggled_ui,
    set_toggled_ui,
}) {
    const box_container_style = "flex h-full p-2 gap-3";

    const network_state_colors = { "connected": "#00EE00", "disconnected": "#EE0000" };

    return (
        <div className="flex flex-row justify-between items-center min-h-16 border-2">
            <div className="p-2 hidden max-xl:block">
                <OpenMenu size="32" on_click={() => set_toggled_ui({...toggled_ui, left: !toggled_ui.left})}/>
            </div>
            <div className={box_container_style}>
                <img className="object-contain max-h-12 w-10 m-auto" src={Icon}/>
            </div>
            <h1 className="text-4xl m-auto font-bold">The Holy Cluster</h1>
            <div className={box_container_style}>
            <Clock/>
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
                        size="40"
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
                
                <div className="p-2 hidden max-2xl:block">
                    <OpenMenu size="32" on_click={() => set_toggled_ui({...toggled_ui, right: !toggled_ui.right})}/>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
