function Button({
    color = "blue",
    text_color = "white",
    on_click = () => {},
    children,
    className,
    ...other_props
}) {
    let classes;
    if (className == null) {
        classes = "";
    } else {
        classes = className;
    }
    const builtin_classes = [
        `text-${text_color}`,
        `bg-${color}-600`,
        `active:bg-${color}-800`,
        `hover:bg-${color}-700`,
        "font-medium",
        "rounded-lg",
        "text-sm",
        "px-4 py-2"
    ].join(" ");

    return <button
        className={`${builtin_classes} ${classes}`}
        onClick={on_click}
        {...other_props}
    >{children}</button>;
}

export default Button;
