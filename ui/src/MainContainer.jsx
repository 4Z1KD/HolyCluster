import Map from "./Map.jsx";
import MapControls from "./MapControls.jsx";
import Bands from "./Bands.jsx";
import BandSpots from "./BandSpots.jsx";

import { useState } from "react";
import Maidenhead from "maidenhead";

import spots_data from "./spots.json";

const band_colors = {
    160: "#f65356",
    80: "#fb8066",
    40: "#fea671",
    30: "#fec979",
    20: "#feea80",
    17: "#d7e586",
    15: "#a5de94",
    12: "#5daad8",
    10: "#8187c7",
    6: "#c56bba",
}

function MainContainer() {
    const main_squares_classes = [
        "w-full",
        "flex",
        "aspect-square",
        "text-center",
    ].join(" ");

    const [projection_type, set_projection_type] = useState("AzimuthalEquidistant");
    const [night_enabled, set_night] = useState(false);
    const [spots, _] = useState(spots_data);
    const [station, set_station] = useState(new Maidenhead(0, 0));

    const [enabled_bands, set_enabled_bands] = useState(
        Object.fromEntries(Object.keys(band_colors).map(band => [band, true]))
    )

    return (
        <div className="mx-20 shadow-xl rounded-2xl border-solid border-slate-200 border-2">
            <div className="p-0 w-full rounded-t-2xl border-b-solid border-b-sky border-b-2">
                <Bands
                    band_colors={band_colors}
                    set_enabled_bands={set_enabled_bands}
                    enabled_bands={enabled_bands}
                />
            </div>
            <div className="flex divide-x divide-slate-300">
                <div className={`${main_squares_classes} flex-wrap divide-y divide-slate-300`}>
                    <Map
                        spots={spots}
                        band_colors={band_colors}
                        projection_type={projection_type}
                        night_enabled={night_enabled}
                        enabled_bands={enabled_bands}
                        center={Maidenhead.toLatLon(station.locator)}
                    />
                    <MapControls
                        set_projection_type={set_projection_type}
                        set_night={set_night}
                        set_station={set_station}
                    />
                </div>
                <div className={`${main_squares_classes} flex content-start flex-wrap gap-2 p-4`}>
                    {Object.entries(band_colors).map(([band, color]) => {
                        return <BandSpots
                            key={band}
                            band={band}
                            color={color}
                            spots={spots}
                            enabled={enabled_bands[band]}
                        />;
                    })}
                </div>
            </div>
        </div>
    );
}

export default MainContainer;