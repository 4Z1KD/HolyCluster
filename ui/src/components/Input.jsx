function Input({ className, type = "text", ...props_without_classes }) {
    if (className == null) {
        className = "";
    }
    className +=
        " shadow appearance-none border rounded-lg w-24 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline";

    return <input className={className} type={type} {...props_without_classes} />;
}

export default Input;
