function BandSpots({
    band,
    color,
    enabled_modes,
    spots = [],
    enabled = true,
}) {
    const filtered_spots = spots.filter(spot => enabled_modes[spot.Mode] && spot.Band == band)

    return (
        filtered_spots.length > 0 && enabled ?
        <div className="basis-[49%] border-slate-400 border-solid border-2 rounded-2xl p-0 h-fit min-h-48 max-h-80">
            <div
                className="p-0 w-full rounded-t-2xl border-b-solid border-b-2"
                style={{backgroundColor: color}}
            >
                {band}m
            </div>
            <table className="table-fixed w-full">
                <tbody className="divide-y divide-slate-200">
                    {filtered_spots
                        .map(spot => {
                        return <tr key={spot.Spotter + "_" + spot.DXCall + "_" + spot.Time}>
                            <td>{spot.Time}</td>
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
