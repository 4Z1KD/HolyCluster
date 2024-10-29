import { band_light_colors } from "@/bands_and_modes.js";

function Callsign({ callsign, is_alerted }) {
    return <a
        className={is_alerted ? "bg-emerald-100" : ""}
        href={"https://www.qrz.com/db/" + callsign}
        target="_blank"
    >{callsign}</a>
}

function BandSpots({
    band,
    color,
    spots = [],
    hovered_spot,
    set_hovered_spot,
    on_spot_click,
    alerts,
}) {
    return (
        spots.length > 0 ?
        <div className="border-slate-400 mb-2 border-solid border-2 rounded-2xl p-0 max-h-80 overflow-y-auto">
            <table className="table-fixed w-full">
                <tbody className="divide-y divide-slate-200">
                    <tr className="sticky top-0" style={{backgroundColor: color}}>
                        <td>Time</td>
                        <td>DX</td>
                        <td><strong>{band}m</strong></td>
                        <td>Spotter</td>
                        <td>Mode</td>
                    </tr>
                    {spots
                        .map(spot => {
                            const time = new Date(spot.time * 1000);
                            const utc_hours = String(time.getUTCHours()).padStart(2, "0")
                            const utc_minutes = String(time.getUTCMinutes()).padStart(2, "0");
                            const formatted_time = utc_hours + ":" + utc_minutes;
                            const is_alerted = alerts.some(regex => spot.dx_callsign.match(regex));

                            return <tr
                                key={spot.id}
                                style={{
                                    backgroundColor: spot.id == hovered_spot ? band_light_colors[band] : "",
                                }}
                                className="odd:bg-white even:bg-slate-100"
                                onMouseOver={() => set_hovered_spot(spot.id)}
                                onMouseLeave={() => set_hovered_spot(null)}
                            >
                                <td>{formatted_time}</td>
                                <td><Callsign callsign={spot.dx_callsign} is_alerted={is_alerted}></Callsign></td>
                                <td>
                                    <div className="cursor-pointer" onClick={() => on_spot_click(spot)}>
                                        {spot.freq}
                                    </div>
                                </td>
                                <td><Callsign callsign={spot.spotter_callsign}></Callsign></td>
                                <td>{spot.mode}</td>
                            </tr>;
                        })}
                </tbody>
            </table>
        </div> : ""
    );
}

export default BandSpots;
