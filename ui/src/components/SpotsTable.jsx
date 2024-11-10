import { useEffect, forwardRef, useRef } from "react";

import { band_colors, band_light_colors } from "@/filters_data.js";

const cell_classes = {
    time: "w-12",
    dx: "w-24",
    freq: "w-12",
    spotter: "w-24",
    band: "w-12",
    mode: "w-12",
}

function Callsign({ callsign, is_alerted }) {
    return <a
        className={is_alerted ? "bg-emerald-100" : ""}
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
    const is_hovered = spot.id == hovered_spot.id || spot.id == pinned_spot;
    const is_alerted = alerts.some(regex => spot.dx_callsign.match(regex));

    return <tr
        ref={ref}
        style={{
            backgroundColor: is_hovered ? band_light_colors[spot.band] : "",
        }}
        className="odd:bg-white even:bg-slate-100"
        onMouseEnter={() => set_hovered_spot({source: "table", id: spot.id})}
        onClick={() => set_pinned_spot(spot.id)}
    >
        <td className={cell_classes.time}>{formatted_time}</td>
        <td className={cell_classes.dx + " font-bold"}><Callsign callsign={spot.dx_callsign} is_alerted={is_alerted}></Callsign></td>
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
        const pinned_ref = row_refs.current[pinned_spot];

        if (pinned_ref != undefined) {
            pinned_ref.scrollIntoView({block: "center", behavior: "instant"});
        } else if (hovered_ref != undefined && hovered_spot.source == "map") {
            hovered_ref.scrollIntoView({block: "center", behavior: "instant"});
        }
    });

    return <div className="w-full h-full text-sm overflow-y-auto">
        <table
            className="max-w-[34rem] table-fixed text-center border-collapse"
            onMouseLeave={_ => set_hovered_spot({source: null, id: null})}
        >
            <tbody className="divide-y divide-slate-200">
                <tr className="sticky top-0 bg-slate-300">
                    <td className={cell_classes.time}>Time</td>
                    <td className={cell_classes.dx}>DX</td>
                    <td className={cell_classes.freq}>Freq</td>
                    <td className={cell_classes.spotter}>Spotter</td>
                    <td className={cell_classes.band}>Band</td>
                    <td className={cell_classes.mode}>Mode</td>
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
