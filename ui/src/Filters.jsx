function Filters({
    band_colors = {},
    enabled_bands = {},
    set_enabled_bands,
}) {
    const center_content_classes = [
        "flex",
        "flex-row",
        "justify-center",
        "items-center",
        "gap-x-4"
    ].join(" ");
    const style_classes = [
        "h-full",
        "w-24",
        "rounded-2xl",
        "border-solid",
        "border-slate-500",
        "border-2",
    ].join(" ");

    return (
        <div className="flex justify-around h-16 p-2">
            {Object.entries(band_colors).map(([band, color]) => {
                return <div
                    key={band}
                    className={`${center_content_classes} ${style_classes}`}
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
    );
}

export default Filters;
