import React from "react";

const Bar = ({ value, label, min = 0, max = 100, reverseColors = false }) => {
    // Clamp the value between min and max
    const clampedValue = Math.max(min, Math.min(max, value));

    // Calculate the percentage relative to the range
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    // Calculate dynamic color (green to red or red to green based on reverseColors)
    const hue = reverseColors ? percentage * 1.2 : 120 - percentage * 1.2;
    const color = `hsl(${hue}, 100%, 50%)`;

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
            <span className="mt-2 text-sm text-gray-700">{label}</span>
        </div>
    );
};

export default Bar;
