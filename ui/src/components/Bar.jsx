import React from "react";

import { useColors } from "../hooks/useColors";

const Bar = ({ value, label, min = 0, max = 100, low = 10, mid = 10, high = 80, reverse_colors = false }) => {

    const valueToColor = (value) => {
        if (value < 0) value = 0;
        if (value > 100) value = 100;
    
        let r, g, b;
        if (value <= 50) {
          // Green to Orange
          const t = value / 50;
          r = Math.round(0 + (255 - 0) * t);
          g = Math.round(255 + (165 - 255) * t);
          b = 0;
        } else {
          // Orange to Red
          const t = (value - 50) / 50;
          r = 255;
          g = Math.round(165 + (0 - 165) * t);
          b = 0;
        }
    
        return `rgb(${r}, ${g}, ${b})`;
    }
    // Clamp the value between min and max
    const clamped_value = Math.max(min, Math.min(max, value));

    // Calculate the percentage relative to the range
    const percentage = ((clamped_value - min) / (max - min)) * 100;

    // Calculate dynamic color (green to red or red to green based on reverseColors)
    const hue = reverse_colors ? percentage * 1.2 : 120 - percentage * 1.2;
    const color = `hsl(${hue}, 100%, 50%)`;

    const { colors } = useColors();

    return (
        <div className="flex flex-col items-center">
            <span className="mt-2 text-sm" style={{ color: colors.theme.text }}>
                {label}
            </span>
            <div className="flex justify-center items-end w-6 h-20 border border-gray-300 rounded-lg bg-gray-100 p-1">
                <div
                    className=" rounded-tl-md rounded-bl-md w-1 transition-all duration-300"
                    style={{
                        height: `100%`,
                        background: reverse_colors?'linear-gradient(to top, red 20%, orange 20% 60%, green 20%)':'linear-gradient(to top, green 20%, orange 20% 60%, red 20%)',
                      }}
                ></div>
                <div
                    className="w-full rounded-tr-md rounded-br-md w-5 transition-all duration-300"
                    style={{
                        height: `${percentage}%`,
                        backgroundColor: color,
                    }}
                ></div>
            </div>
            <span className="mt-2 text-sm" style={{ color: colors.theme.text }}>
                {value}
            </span>
        </div>
    );
};

export default Bar;
