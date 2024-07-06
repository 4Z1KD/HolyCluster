function MainContainer({
    band_colors = {},
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
                    className={`${center_content_classes} ${style_classes}`}
                    style={{ backgroundColor: color }}
                >
                    <span>{band}</span><input type="checkbox"/>
                </div>
            })}
        </div>
    );
}

export default MainContainer;
