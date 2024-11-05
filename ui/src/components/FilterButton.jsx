function FilterButton({
    text,
    is_active,
    on_click,
    color = "#D1FAE5",
    hover_brightness = "110",
}) {
    const inactive_background_color = "#AAAAAA";
    const active_text_color = "#000000";
    const inactive_text_color = "#666666";

    const box_style = [
        "min-w-12",
        "max-w-18",
        "text-center",
        "text-base",
        "font-bold",
        "rounded-lg",
        "border-slate-400",
        "border-2",
        "cursor-pointer",
        `hover:brightness-${hover_brightness}`,
        "py-2",
        "px-1",
    ].join(" ");

    return <div
        className={box_style}
        onClick={on_click}
        style={{
            backgroundColor: is_active ? color : inactive_background_color,
            userSelect: "none",
        }}>
        <span>{text}</span>
    </div>;
}

export default FilterButton;
