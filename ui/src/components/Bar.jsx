import React from "react";

import { useColors } from "../hooks/useColors";

const Bar = ({ value, label, min = 0, max = 100, reverse_colors = false }) => {
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
            <div className="flex justify-center items-end w-10 h-20 border border-gray-300 rounded-lg bg-gray-100 p-1">
                <div
                    className="w-full rounded transition-all duration-300"
                    style={{
                        height: `${percentage}%`,
                        backgroundColor: color,
                    }}
                ></div>
            </div>
            <span className="mt-2 text-sm" style={{ color: colors.theme.text }}>
                {label}
            </span>
        </div>
    );
};

export default Bar;
