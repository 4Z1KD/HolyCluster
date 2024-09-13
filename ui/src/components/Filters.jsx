import Alerts from "./Alerts.jsx";
import Clock from "./Clock.jsx";

import { band_colors } from "../bands_and_modes.js";

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
        "justify-around",
        "h-full",
        "p-2",
        "gap-3",
        "w-1/2",
        "inline-block",
    ].join(" ");
    const box_style = [
        // Related to the layout of the box itself
        "flex-grow",
        "max-w-16",
        "rounded-xl",
        "border-slate-400",
        "border-2",

        // Related to the content of each box
        "flex",
        "justify-around",
        "items-center",
        "p-2",
    ].join(" ");

    return (
        <div className="flex flex-row flex-wrap w-full border-b-solid border-b-sky border-b-2">
            <div className={box_container_style}>
                {Object.entries(band_colors).map(([band, color]) => {
                    return <div
                        key={band}
                        className={box_style}
                        style={{ backgroundColor: color }}
                    >
                        <span>{band}</span>
                        <input
                            type="checkbox"
                            onChange={_ => set_filters(state => state.bands[band] = !state.bands[band])}
                            defaultChecked={filters.bands[band]}
                        />
                    </div>
                })}
            </div>
            <div className={box_container_style}>
                {Object.keys(filters.modes).map(mode => {
                    return <div key={mode} className={box_style}>
                        <span>{mode}</span>
                        <input
                            type="checkbox"
                            onChange={_ =>  set_filters(state => state.modes[mode] = !state.modes[mode])}
                            defaultChecked={filters.modes[mode]}
                        />
                    </div>;
                })}
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
