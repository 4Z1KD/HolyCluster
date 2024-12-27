import X from "@/components/X.jsx";
import { useEffect, forwardRef, useRef } from "react";

import { get_flag } from "@/flags.js";
import { band_colors, band_text_colors, band_light_colors } from "@/filters_data.js";

const cell_classes = {
    time: "w-14",
    flag: "w-[1.3rem] md:min-w-[1.3rem]",
    dx: "w-16 2xs:w-24",
    freq: "w-12",
    band: "w-12 hidden md:table-cell",
    spotter: "w-16 2xs:w-24",
    mode: "w-12 lg:w-[14rem]",
    comment: "w-[40rem] text-left hidden xl:table-cell",
};

function Callsign({ callsign }) {
    return (
        <a href={"https://www.qrz.com/db/" + callsign} target="_blank">
            {callsign}
        </a>
    );
}

function Spot(
    { spot, hovered_spot, pinned_spot, set_pinned_spot, set_hovered_spot, set_cat_to_spot },
    ref,
) {
    const time = new Date(spot.time * 1000);
    const utc_hours = String(time.getUTCHours()).padStart(2, "0");
    const utc_minutes = String(time.getUTCMinutes()).padStart(2, "0");
    const formatted_time = utc_hours + ":" + utc_minutes;
    const is_pinned = spot.id == pinned_spot;
    const is_hovered = spot.id == hovered_spot.id || is_pinned;

    let row_classes = "odd:bg-white even:bg-slate-100";
    if (spot.is_alerted) {
        row_classes += " outline-2 outline outline-dashed outline-offset-[-2px]";
    }

    const flag = get_flag(spot.dx_country);

    return (
        <tr
            ref={ref}
            style={{
                backgroundColor: is_hovered ? band_light_colors[spot.band] : "",
                outlineColor: spot.is_alerted ? band_colors.get(spot.band) : "",
            }}
            className={row_classes + " h-7"}
            onMouseEnter={() => set_hovered_spot({ source: "table", id: spot.id })}
            onClick={() => set_pinned_spot(spot.id)}
        >
            <td className={cell_classes.time}>
                {is_pinned ? (
                    <X
                        size="16"
                        on_click={event => {
                            event.stopPropagation();
                            return set_pinned_spot(null);
                        }}
                    />
                ) : (
                    formatted_time
                )}
            </td>

            <td className={cell_classes.flag} title={spot.dx_country}>
                {flag ? (
                    <img className="m-auto" width="16" src={`data:image/webp;base64, ${flag}`} />
                ) : (
                    ""
                )}
            </td>
            <td className={cell_classes.dx + " font-semibold"}>
                <Callsign callsign={spot.dx_callsign}></Callsign>
            </td>
            <td className={cell_classes.freq}>
                <div
                    onClick={() => set_cat_to_spot(spot)}
                    className="px-1 rounded-full cursor-pointer"
                    style={{
                        backgroundColor: `${window.matchMedia("(max-width: 767px)").matches ? band_colors.get(spot.band) : "transparent"}`,
                        color: `${window.matchMedia("(max-width: 767px)").matches ? band_text_colors[spot.band] : "black"}`,
                    }}
                >
                    {spot.freq}
                </div>
            </td>
            <td className={cell_classes.band + " flex justify-center items-center"}>
                <p
                    className="px-1 rounded-full font-medium"
                    style={{
                        backgroundColor: band_colors.get(spot.band),
                        color: band_text_colors[spot.band],
                    }}
                >
                    {spot.band}
                </p>
            </td>
            <td className={cell_classes.spotter}>
                <Callsign callsign={spot.spotter_callsign}></Callsign>
            </td>
            <td className={cell_classes.mode}>{spot.mode}</td>
            <td className={cell_classes.comment}>
                {spot.comment.replace(/&lt;/g, "<").replace(/&gt;/g, ">")}
            </td>
        </tr>
    );
}

Spot = forwardRef(Spot);

function SpotsTable({
    spots,
    hovered_spot,
    set_hovered_spot,
    pinned_spot,
    set_pinned_spot,
    set_cat_to_spot,
}) {
    const row_refs = useRef({});

    useEffect(() => {
        const hovered_ref = row_refs.current[hovered_spot.id];

        if (hovered_ref != undefined && hovered_spot.source == "map" && pinned_spot == undefined) {
            hovered_ref.scrollIntoView({ block: "center", behavior: "instant" });
        }
    }, [hovered_spot]);

    return (
        <div className="text-sm h-full overflow-x-visible border-4">
            <div className="overflow-y-scroll h-full w-full">
                <table
                    className="max-md:table-fixed max-md:w-full text-center border-collapse"
                    onMouseLeave={_ => set_hovered_spot({ source: null, id: null })}
                >
                    <tbody className="divide-y divide-slate-200">
                        <tr className="sticky top-0 bg-slate-300">
                            <td className={cell_classes.time}>Time</td>
                            <td className={cell_classes.flag}></td>
                            <td className={cell_classes.dx}>DX</td>
                            <td className={cell_classes.freq}>Freq</td>
                            <td className={cell_classes.band}>Band</td>
                            <td className={cell_classes.spotter}>Spotter</td>
                            <td className={cell_classes.mode}>Mode</td>
                            <td className={cell_classes.comment}>Comment</td>
                        </tr>
                        {spots.map(spot => (
                            <Spot
                                ref={element => (row_refs.current[spot.id] = element)}
                                key={spot.id}
                                spot={spot}
                                hovered_spot={hovered_spot}
                                pinned_spot={pinned_spot}
                                set_pinned_spot={set_pinned_spot}
                                set_hovered_spot={set_hovered_spot}
                                set_cat_to_spot={set_cat_to_spot}
                            ></Spot>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SpotsTable;
