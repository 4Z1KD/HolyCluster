function Callsign({callsign}) {
    return <a href={"https://www.qrz.com/db/" + callsign} target="_blank">{callsign}</a>
}

function BandSpots({
    band,
    color,
    spots = [],
}) {
    const filtered_spots = spots.filter(spot => spot.band == band)

    return (
        filtered_spots.length > 0 ?
        <div className="basis-[49%] border-slate-400 border-solid border-2 rounded-2xl p-0 max-h-80 overflow-y-auto min-w-80 max-w-[50%]">
            <table className="table-fixed w-full">
                <tbody className="divide-y divide-slate-200">
                    <tr style={{backgroundColor: color}}>
                        <td>Time</td>
                        <td>DX</td>
                        <td><strong>{band}m</strong></td>
                        <td>de</td>
                        <td>Mode</td>
                    </tr>
                    {filtered_spots
                        .map(spot => {
                            const formatted_time = new Date(spot.time * 1000).toLocaleTimeString("he-IL");
                            return <tr key={spot.spotter + "_" + spot.dx_call + "_" + spot.time}>
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
