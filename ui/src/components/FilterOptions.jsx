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
    const base_classes = "absolute flex left-1/2 z-50 bg-white border shadow-xl rounded-lg p-4";
    const align_options = {
        "right": "-translate-x-7",
        "slightly-right": "-translate-x-16",
        "center": "-translate-x-1/2",
    };
    const orientation_options = {
        "vertical": "flex-col space-y-4 -translate-y-1/3 translate-x-8",
        "horizontal": "space-x-4",
    };

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
        {orientation == "horizontal" ? children : ""}
        {is_hovered && (
            <div className={`${base_classes} ${orientation_options[orientation]} ${align_options[align]}`}>
                <Button
                    color="blue"
                    on_click={() => {
                        set_only_filter_keys(filter_key, filter_value);
                        set_is_hovered(false);
                    }}
                >
                    ONLY
                </Button>
                <Button
                    color="green"
                    on_click={() => {
                        set_filter_keys(filter_key, true);
                        set_is_hovered(false);
                    }}
                >
                    ALL
                </Button>
                <Button
                    color="red"
                    on_click={() => {
                        set_filter_keys(filter_key, false);
                        set_is_hovered(false);
                    }}
                >
                  NONE
                </Button>
            </div>
        )}
        {orientation == "vertical" ? children : ""}
      </div>
    );
};

export default FilterOptions;
