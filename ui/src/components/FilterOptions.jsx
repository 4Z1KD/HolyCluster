import React, { useState } from "react";

import Button from "@/components/Button.jsx";

function FilterOptions({
  on_only_click,
  on_all_click,
  on_none_click,
  children,
}) {
    const [is_hovered, set_is_hovered] = useState(false);

    return (
      <div
          className="relative"
          onMouseEnter={() => set_is_hovered(true)}
          onMouseLeave={() => set_is_hovered(false)}
      >
        {children}

        {is_hovered && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/4 z-50 bg-white border shadow-xl rounded-lg p-4 flex space-x-4">
                <Button
                    color="blue"
                    on_click={() => {
                        on_only_click();
                        set_is_hovered(false);
                    }}
                >
                    ONLY
                </Button>
                <Button
                    color="green"
                    on_click={() => {
                        on_all_click();
                        set_is_hovered(false);
                    }}
                >
                    ALL
                </Button>
                <Button
                    color="red"
                    on_click={() => {
                        on_none_click();
                        set_is_hovered(false);
                    }}
                >
                  NONE
                </Button>
            </div>
        )}
      </div>
    );
};

export default FilterOptions;
