function BandSpots({
    band,
    color,
    spots = [],
}) {
    const filtered_spots = spots.filter(spot => spot.Band == band)

    return (
        filtered_spots.length > 0 ?
        <div className="basis-[49%] border-slate-400 border-solid border-2 rounded-2xl p-0 max-h-80 overflow-y-auto min-w-80 max-w-[50%]">
            <div
                className="p-0 w-full rounded-t-2xl border-b-solid border-b-2 sticky top-0"
                style={{backgroundColor: color}}
            >
                {band}m
            </div>
            <table className="table-fixed w-full">
                <tbody className="divide-y divide-slate-200">
                    {filtered_spots
                        .map(spot => {
                            const formatted_time = new Date(spot.time * 1000).toLocaleTimeString("he-IL");
                            return <tr key={spot.Spotter + "_" + spot.DXCall + "_" + spot.time}>
                                <td>{formatted_time}</td>
                                <td>{spot.DXCall}</td>
                                <td>{spot.Frequency}</td>
                                <td>{spot.Spotter}</td>
                                <td>{spot.Mode}</td>
                            </tr>;
                        })}
                </tbody>
            </table>
        </div> : ""
    );
}

export default BandSpots;
