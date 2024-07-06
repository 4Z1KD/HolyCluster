import Map from "./Map.jsx";
import MapControls from "./MapControls.jsx";
import { useState } from "react";

function MainContainer() {
    const main_squares_classes = [
        "w-full",
        "flex",
        "p-0",
        "aspect-square",
        "text-center",
    ].join(" ");

    const [projection_type, set_projection_type] = useState("AzimuthalEquidistant");
    const [night_enabled, set_night] = useState(false);

    return (
        <div className="mx-20 shadow-xl rounded-2xl border-solid border-slate-200 border-2">
            <div className="p-5 w-full mx-auto rounded-t-2xl border-b-solid border-b-sky border-b-2">
            Band list
            </div>
            <div className="flex divide-x divide-slate-300">
                <div className={`${main_squares_classes} flex-wrap`}>
                    <Map projection_type={projection_type} night_enabled={night_enabled}/>
                    <MapControls
                        set_projection_type={set_projection_type}
                        set_night={set_night}
                    />
                </div>
                <div className={main_squares_classes}>Spots</div>
            </div>
        </div>
    );
}

export default MainContainer;
