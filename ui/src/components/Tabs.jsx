import { useState } from "react";

function Tabs({ map, table }) {
    const [active_tab, set_active_tab] = useState(0);

    const tabs = [
        { label: "Map", content: map },
        { label: "Table", content: table },
    ];

    return <div className="h-full w-full">
        <div className="flex border-b">
            {tabs.map((tab, index) => <button
                key={index}
                className={`flex-1 text-center py-2 text-sm font-medium ${
                    active_tab === index
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500"
                }`}
                onClick={() => set_active_tab(index)}
                >
                {tab.label}
            </button>)}
        </div>

        <div className="w-full h-full">
            {tabs[active_tab].content}
        </div>
    </div>
};

export default Tabs;
