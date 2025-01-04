import Triangle from "./Spot/components/Triangle";
import { useColors } from "../hooks/useColors";

function FilterButton({
    text,
    is_active,
    on_click,
    color,
    text_color = "#000000",
    hover_brightness = "110",
    size = "normal",
}) {
    const { colors } = useColors();

    const box_style = [
        "max-w-18",
        "text-center",
        "text-base",
        "rounded-full",
        "cursor-pointer",
        "select-none",
        `hover:brightness-${hover_brightness}`,
    ];
    if (size == "normal") {
        box_style.push(...["py-2", "px-2", "min-w-12"]);
    } else if (size == "small") {
        box_style.push(...["w-16"]);
    }

    if (is_active) {
        box_style.push("border", "border-slate-700");
    } else {
        box_style.push(
            "border",
            "border-slate-400",
            "bg-transparent",
            "outline",
            "outline-[1px]",
            "outline-offset-[-1px]",
        );
    }

    return (
        <div
            className={box_style.join(" ")}
            onClick={on_click}
            style={{
                backgroundColor: is_active ? color : colors.buttons.disabled_background,
                color: is_active ? text_color : colors.buttons.disabled,
                outlineColor: is_active ? "" : colors.buttons.disabled,
            }}
        >
            <span className="inline-flex items-center space-x-2">{text}</span>
        </div>
    );
}

export default FilterButton;
