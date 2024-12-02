import React, { useState } from "react";

import Button from "@/components/Button.jsx";

function FilterOptions({
    set_filters,
    filter_key,
    filter_value,
    align,
    orientation,
    children,
}) {
    const [is_hovered, set_is_hovered] = useState(false);
    let classes = [
        "absolute",
        "flex",
        "flex-col",
        "z-50",
        "border",
        "border-gray-500",
        "bg-gray-100",
        "shadow-xl",
        "rounded-lg",
        "p-3",
        "-translate-x-1/2",
        "w-22",
    ];
    const orientation_options = {
        "right": ["-translate-y-1/2", "translate-x-[4rem]"],
        "left": ["-translate-y-1/2", "-translate-x-[5.6rem]"],
    };
    classes.push(...orientation_options[orientation]);

    classes = classes.join(" ");

    // This function changes all the keys in the filter object.
    // For example: set_filter_keys("bands", true) will enable all bands.
    function set_filter_keys(filters_key, is_active) {
        set_filters(state => {
            Object.keys(state[filters_key]).forEach(key => {
                state[filters_key][key] = is_active;
            })
        })
    }

    // This function set only on filter on.
    // For example: set_only_filter_keys("modes", "CW"), enables only CW.
    function set_only_filter_keys(filters_key, selected_key) {
        set_filters(state => {
            Object.keys(state[filters_key]).forEach(key => {
                state[filters_key][key] = selected_key == key;
            })
        })
    }

    return (
      <div
          className="relative"
          onMouseEnter={() => set_is_hovered(true)}
          onMouseLeave={() => set_is_hovered(false)}
      >
        {children}
        {is_hovered && (
            <div className={classes}>
                <div className="space-y-4">
                    <Button
                        color="blue"
                        className="w-16 px-2"
                        on_click={() => {
                            set_only_filter_keys(filter_key, filter_value);
                            set_is_hovered(false);
                        }}
                    >
                        ONLY
                    </Button>
                    <Button
                        color="green"
                        className="w-16 px-2"
                        on_click={() => {
                            set_filter_keys(filter_key, true);
                            set_is_hovered(false);
                        }}
                    >
                        ALL
                    </Button>
                </div>
            </div>
        )}
      </div>
    );
};

export default FilterOptions;
