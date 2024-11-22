function FilterButton({
    text,
    is_active,
    on_click,
    color = "#D1FAE5",
    hover_brightness = "110",
    size = "normal",
}) {
    const inactive_background_color = "#FFFFFF";
    const active_text_color = "#000000";
    const inactive_text_color = "#666666";

    const box_style = [
        "max-w-18",
        "text-center",
        "text-base",
        "font-bold",
        "rounded-lg",
        "border-2",
        "cursor-pointer",
        `hover:brightness-${hover_brightness}`,
    ];
    if (size == "normal") {
        box_style.push(...["py-2", "px-1", "min-w-12"])
    } else if (size == "small") {
        box_style.push(...["w-12"])
    }

    if (is_active) {
        box_style.push("border-slate-400");
    } else {
        box_style.push("border-slate-700");
    }

    return <div
        className={box_style.join(" ")}
        onClick={on_click}
        style={{
            backgroundColor: is_active ? color : inactive_background_color,
            userSelect: "none",
        }}>
        <span>{text}</span>
    </div>;
}

export default FilterButton;
