import { band_light_colors } from "../bands_and_modes.js";

function Callsign({callsign}) {
    return <a href={"https://www.qrz.com/db/" + callsign} target="_blank">{callsign}</a>
}

function BandSpots({
    band,
    color,
    spots = [],
    hovered_spot,
    set_hovered_spot,
}) {
    const filtered_spots = spots.filter(spot => spot.band == band)

    return (
        filtered_spots.length > 0 ?
        <div className="border-slate-400 border-solid border-2 rounded-2xl p-0 max-h-80 overflow-y-auto">
            <table className="table-fixed w-full">
                <tbody className="divide-y divide-slate-200">
                    <tr className="sticky top-0" style={{backgroundColor: color}}>
                        <td>Time</td>
                        <td>DX</td>
                        <td><strong>{band}m</strong></td>
                        <td>de</td>
                        <td>Mode</td>
                    </tr>
                    {filtered_spots
                        .map(spot => {
                            const formatted_time = new Date(spot.time * 1000).toLocaleTimeString("he-IL");
                            return <tr
                                key={spot.id}
                                style={{
                                    backgroundColor: spot.id == hovered_spot ? band_light_colors[band] : "white",
                                }}
                                onMouseOver={() => set_hovered_spot(spot.id)}
                                onMouseLeave={() => set_hovered_spot(null)}
                            >
                                <td>{formatted_time}</td>
                                <td><Callsign callsign={spot.dx_call}></Callsign></td>
                                <td>{spot.freq}</td>
                                <td><Callsign callsign={spot.spotter}></Callsign></td>
                                <td>{spot.mode}</td>
                            </tr>;
                        })}
                </tbody>
            </table>
        </div> : ""
    );
}

export default BandSpots;
