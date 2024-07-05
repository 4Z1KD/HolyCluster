function App() {
    const main_squares_classes = [
        "w-full",
        "flex-auto",
        "p-5",
        "aspect-square",
        "text-center",
    ].join(" ");

    const projection_types = [
        "AzimuthalEquidistant",
        "AzimuthalEqualArea",
        "Orthographic",
        // Equirectangular projection is currently broken due to zoom and drag bhaviours
        // "Equirectangular",
    ]

    return (
        <>
        <h1 className="pb-10 container mx-auto text-2xl font-bold text-slate-600">The holly cluster!</h1>
        <div className="mx-20 shadow-xl rounded-2xl border-solid border-slate-200 border-2">
            <div className="p-5 w-full mx-auto rounded-t-2xl border-b-solid border-b-sky border-b-2">
            Band list
            </div>
            <div className="flex divide-x divide-slate-300">
                <div className={main_squares_classes}>
                    <svg className="aspect-square w-full">
                        {/* Just a shape for example */}
                        <circle cx="300" cy="300" r="100"></circle>
                    </svg>
                    <div className="relative bottom-0 p-3 space-x-4">
                        <select className="p-2 rounded-lg">
                            {projection_types.map(type => <option value={type}>{type}</option>)}
                        </select>
                        <button className="text-white bg-blue-600 active:bg-blue-800 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2">Reset</button>
                        <input type="checkbox" autocomplete="off"></input>
                        <label className="text-slate-700">Show night</label>
                    </div>
                </div>
                <div className={main_squares_classes}>Spots</div>
            </div>
        </div>
        </>
    );
}

export default App;
