import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserView, MobileView } from 'react-device-detect';

import MainContainer from "@/components/MainContainer.jsx"
import MobileNotAvailable from "@/components/MobileNotAvailable.jsx"
import "@/index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserView className="h-full">
            <MainContainer/>
        </BrowserView>
        <MobileView className="h-full">
            <MobileNotAvailable/>
        </MobileView>
    </React.StrictMode>
)
