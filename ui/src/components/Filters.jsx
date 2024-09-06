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
    band_colors,
    enabled_bands,
    set_enabled_bands,
    enabled_modes,
    set_enabled_modes,
    spots_time_limit,
    set_spots_time_limit,
}) {
    const box_container_style = [
        "flex",
        "flex-wrap",
        "justify-start",
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
                            onChange={_ => set_enabled_bands(previous_state => {
                                const state = structuredClone(previous_state);
                                state[band] = !state[band];
                                return state;
                            })}
                            defaultChecked={enabled_bands[band]}
                        />
                    </div>
                })}
            </div>
            <div className={box_container_style}>
                {Object.keys(enabled_modes).map(mode => {
                    return <div key={mode} className={box_style}>
                        <span>{mode}</span>
                        <input
                            type="checkbox"
                            onChange={_ =>  set_enabled_modes(previous_state => {
                                const state = structuredClone(previous_state);
                                state[mode] = !state[mode];
                                return state;
                            })}
                            defaultChecked={enabled_modes[mode]}
                        />
                    </div>;
                })}
                <select className="rounded-lg px-4 py-2" onChange={event => set_spots_time_limit(event.target.value)}>
                    {Object.entries(spots_time_limits).map(([text, minutes]) => <option key={minutes} value={minutes}>{text}</option>)}
                </select>
            </div>
        </div>
    );
}

export default Filters;
