function Button({
    color = "blue",
    text_color = "white",
    on_click = () => {},
    children,
}) {
    const classes = [
        `text-${text_color}`,
        `bg-${color}-600`,
        `active:bg-${color}-800`,
        `hover:bg-${color}-700`,
        "font-medium",
        "rounded-lg",
        "text-sm",
        "px-4 py-2"
    ].join(" ");

    return <button className={classes} onClick={on_click}>{children}</button>;
}

export default Button;
