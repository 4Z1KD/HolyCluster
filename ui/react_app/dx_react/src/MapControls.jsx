function MapControls({ set_projection_type }) {
    const projection_types = [
        "AzimuthalEquidistant",
        "AzimuthalEqualArea",
        "Orthographic",
    ]

    function on_projection_change(event) {
        set_projection_type(event.target.value);
    }

    return (
        <div className="relative bottom-0 p-3 space-x-4">
            <select className="rounded-lg px-4 py-2" onChange={on_projection_change}>
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
