import { useColors } from "@/hooks/useColors";

function Input({ className, type = "text", ...props_without_classes }) {
    const { colors } = useColors();

    if (className == null) {
        className = "";
    }
    className +=
        " shadow appearance-none border rounded-lg w-24 py-2 px-3 leading-tight focus:outline-none focus:shadow-outline";

    return (
        <input
            style={{
                backgroundColor: colors.theme.input_background,
                borderColor: colors.theme.borders,
                color: colors.theme.text,
            }}
            className={className}
            type={type}
            {...props_without_classes}
        />
    );
}

export default Input;
