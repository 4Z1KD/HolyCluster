

const Square = (handleClick, dx_x, dx_size, dx_y, light_color) => {
    return <rect
        x={dx_x - dx_size / 2}
        y={dx_y - dx_size / 2}
        width={dx_size}
        height={dx_size}
        fill={light_color}
        stroke="grey"
        strokeWidth="1px"
        onClick={() => handleClick()}
    />
}

export default Square