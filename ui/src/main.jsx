import React from "react";
import ReactDOM from "react-dom/client";

import MainContainer from "@/components/MainContainer.jsx";
import { FiltersProvider } from "./hooks/useFilters";
import { ColorsProvider } from "./hooks/useColors";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <ColorsProvider>
        <FiltersProvider>
            <React.StrictMode>
                <MainContainer />
            </React.StrictMode>
        </FiltersProvider>
    </ColorsProvider>,
);
