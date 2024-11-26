import { useEffect, forwardRef, useRef } from "react";

import flags from "@/assets/flags.json";
import { band_colors, band_light_colors } from "@/filters_data.js";
import { is_matching_list } from "@/utils.js";

const cell_classes = {
    time: "w-14",
    flag: "min-w-[1.3rem]",
    dx: "w-24",
    freq: "w-12",
    spotter: "w-24",
    band: "w-12",
    mode: "w-12",
    comment: "w-80 text-left",
}

const dxcc_to_country_flag = {
    "Czech Republic": "Czechia",
    "Slovak Republic": "Slovakia",
    "European Russia": "Russia",
    "Asiatic Russia": "Russia",
    "Kaliningrad": "Russia",
    "Sardinia": "Italy",
    "Madeira Islands": "Portugal",
    "Azores": "Portugal",
    "Virgin Islands": "United States Virgin Islands",
    "St. Kitts and Nevis": "Saint Kitts and Nevis",
    "Ceuta and Melilla": "Spain",
    "Canary Islands": "Spain",
    "Balearic Islands": "Spain",
    "Rodriguez Island": "Mauritius",
    "Reunion Island": "France",
    "Aland Islands": "Åland Islands",
    "East Malaysia": "Malaysia",
    "West Malaysia": "Malaysia",
    "St. Helena": "Saint Helena, Ascension and Tristan da Cunha",
    "Bonaire": "Caribbean Netherlands",
    "Curacao": "Caribbean Netherlands",
    "Chatham Islands": "New Zealand",
    "United Nations HQ": "United Nations",
    "ITU HQ": "United Nations",
    "Kure Island": "United States Minor Outlying Islands",
    "Mariana Islands": "United States Minor Outlying Islands",
    "Guantanamo Bay": "United States of America",
    "Corsica": "France",
    "Wallis and Futuna Islands": "France",
    "North Cook Islands": "Cook Islands",
    "Galapagos Islands": "Ecuador",
    "Svalbard": "Norway",
    "Crete": "Greece",
    "The Gambia": "Gambia",
}

function Callsign({ callsign }) {
    return <a
        href={"https://www.qrz.com/db/" + callsign}
        target="_blank"
    >{callsign}</a>
}

function Spot({
    spot,
    alerts,
    hovered_spot,
    pinned_spot,
    set_pinned_spot,
    set_hovered_spot,
    set_cat_to_spot,
}, ref) {

    const time = new Date(spot.time * 1000);
    const utc_hours = String(time.getUTCHours()).padStart(2, "0")
    const utc_minutes = String(time.getUTCMinutes()).padStart(2, "0");
    const formatted_time = utc_hours + ":" + utc_minutes;
    const is_pinned = spot.id == pinned_spot;
    const is_hovered = spot.id == hovered_spot.id || is_pinned;
    const is_alerted = is_matching_list(alerts, spot.dx_callsign);

    let row_classes = "odd:bg-white even:bg-slate-100";
    if (is_alerted) {
        row_classes += " outline-2 outline outline-dashed outline-offset-[-2px]";
    }

    let flag;
    if (dxcc_to_country_flag[spot.dx_country]) {
        flag = flags[dxcc_to_country_flag[spot.dx_country]]
    } else if (flags[spot.dx_country]) {
        flag = flags[spot.dx_country]
    } else {
        flag = null;
    }

    return <tr
        ref={ref}
        style={{
            backgroundColor: is_hovered ? band_light_colors[spot.band] : "",
            outlineColor: is_alerted ? band_colors.get(spot.band) : "",
        }}
        className={row_classes}
        onMouseEnter={() => set_hovered_spot({source: "table", id: spot.id})}
        onClick={() => set_pinned_spot(spot.id)}
    >
        <td className={cell_classes.time}>
            {is_pinned
                ? <span
                    className="text-xs rounded-full px-1 border border-slate-700 bg-white text-red-500 font-bold cursor-pointer"
                    onClick={event => {
                        event.stopPropagation();
                        return set_pinned_spot(null)
                    }}
                >
                    X
                </span>
                : formatted_time
            }
        </td>

        <td className={cell_classes.flag} title={spot.dx_country}>
            { flag ? <img className="m-auto" width="16" src={`data:image/webp;base64, ${flag}`}/> : ""}
        </td>
        <td className={cell_classes.dx + " font-bold"}><Callsign callsign={spot.dx_callsign}></Callsign></td>
        <td className={cell_classes.freq}>
            <div className="cursor-pointer" onClick={() => set_cat_to_spot(spot)}>
                {spot.freq}
            </div>
        </td>
        <td className={cell_classes.spotter}><Callsign callsign={spot.spotter_callsign}></Callsign></td>
        <td className={cell_classes.band + "flex justify-center items-center"}>
            <p
                className="w-fit px-3 rounded-xl"
                style={{ backgroundColor: band_colors.get(spot.band) }}
            >
                <strong>{spot.band}</strong>
            </p>
        </td>
        <td className={cell_classes.mode}>{spot.mode}</td>
        <td className={cell_classes.comment}>{spot.comment.replace(/&lt;/g, "<").replace(/&gt;/g, ">")}</td>
    </tr>;
}

Spot = forwardRef(Spot);

function SpotsTable({
    spots,
    hovered_spot,
    set_hovered_spot,
    pinned_spot,
    set_pinned_spot,
    set_cat_to_spot,
    alerts,
}) {
    const row_refs = useRef({});

    useEffect(() => {
        const hovered_ref = row_refs.current[hovered_spot.id];

        if (hovered_ref != undefined && hovered_spot.source == "map") {
            hovered_ref.scrollIntoView({block: "center", behavior: "instant"});
        }
    }, [hovered_spot]);

    return <div className="flex-grow min-w-[30rem] w-[80rem] h-full text-sm overflow-y-auto border-4">
        <table
            className="table-fixed text-center border-collapse"
            onMouseLeave={_ => set_hovered_spot({source: null, id: null})}
        >
            <tbody className="divide-y divide-slate-200">
                <tr className="sticky top-0 bg-slate-300">
                    <td className={cell_classes.time}>Time</td>
                    <td className={cell_classes.flag}></td>
                    <td className={cell_classes.dx}>DX</td>
                    <td className={cell_classes.freq}>Freq</td>
                    <td className={cell_classes.spotter}>Spotter</td>
                    <td className={cell_classes.band}>Band</td>
                    <td className={cell_classes.mode}>Mode</td>
                    <td className={cell_classes.comment}>Comment</td>
                </tr>
                {spots
                    .map(spot => <Spot
                            ref={element => row_refs.current[spot.id] = element}
                            key={spot.id}
                            spot={spot}
                            alerts={alerts}
                            hovered_spot={hovered_spot}
                            pinned_spot={pinned_spot}
                            set_pinned_spot={set_pinned_spot}
                            set_hovered_spot={set_hovered_spot}
                            set_cat_to_spot={set_cat_to_spot}
                        ></Spot>
                    )}
            </tbody>
        </table>
    </div>;
}

export default SpotsTable;
