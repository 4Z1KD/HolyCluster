function MapControls() {
    const projection_types = [
        "AzimuthalEquidistant",
        "AzimuthalEqualArea",
        "Orthographic",
        // Equirectangular projection is currently broken due to zoom and drag bhaviours
        // "Equirectangular",
    ]

    return (
        <div className="relative bottom-0 p-3 space-x-4">
            <select className="rounded-lg px-4 py-2">
                {projection_types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <button className="text-white bg-blue-600 active:bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">
                Reset
            </button>
            <input type="checkbox" autoComplete="off"></input>
            <label className="text-slate-700">Show night</label>
        </div>
    );
}

export default MapControls;
