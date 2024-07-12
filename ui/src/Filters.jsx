function Filters({
    band_colors,
    enabled_bands,
    set_enabled_bands,
    enabled_modes,
    set_enabled_modes,
}) {
    const center_content_classes = [
        "flex",
        "justify-around",
        "px-2",
        "items-center",
    ].join(" ");
    const box_container_style = [
        "flex",
        "justify-start",
        "h-full",
        "p-2",
        "w-1/2",
    ].join(" ");
    const box_style = [
        "h-full",
        "w-20",
        "rounded-xl",
        "mx-2",
        "border-solid",
        "border-slate-500",
        "border-2",
    ].join(" ");


    return (
        <div className="flex flex-row w-full h-16 ">
            <div className={box_container_style}>
                {Object.entries(band_colors).map(([band, color]) => {
                    return <div
                        key={band}
                        className={`${center_content_classes} ${box_style}`}
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
                    return <div key={mode} className={`${center_content_classes} ${box_style}`}>
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
            </div>
        </div>
    );
}

export default Filters;
