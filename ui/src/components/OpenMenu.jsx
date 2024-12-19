function OpenMenu({ size, on_click }) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" onClick={on_click}>
            <g fill="#000000">
                <path d="m 1 2 h 14 v 2 h -14 z m 0 0" />
                <path d="m 1 7 h 14 v 2 h -14 z m 0 0" />
                <path d="m 1 12 h 14 v 2 h -14 z m 0 0" />
            </g>
        </svg>
    );
}

export default OpenMenu;
