function App() {
    const main_squares_classes = [
        "w-full",
        "flex-auto",
        "p-5",
        "aspect-square",
        "text-center",
    ];

    return (
        <>
        <h1 className="pb-10 container mx-auto text-2xl font-bold text-slate-600">The holly cluster!</h1>
        <div className="mx-20 shadow-xl rounded-2xl border-solid border-slate-200 border-2">
            <div className="p-5 w-full mx-auto rounded-t-2xl border-b-solid border-b-sky border-b-2">
            Band list
            </div>
            <div className="flex divide-x divide-slate-300">
                <div className={main_squares_classes.join(" ")}>Map</div>
                <div className={main_squares_classes.join(" ")}>Spots</div>
            </div>
        </div>
        </>
    );
}

export default App;
