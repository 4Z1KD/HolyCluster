import Map from "./Map.jsx";
import MapControls from "./MapControls.jsx";

function MainContainer() {
    const main_squares_classes = [
        "w-full",
        "flex-auto",
        "p-5",
        "aspect-square",
        "text-center",
    ].join(" ");

    return (
        <div className="mx-20 shadow-xl rounded-2xl border-solid border-slate-200 border-2">
            <div className="p-5 w-full mx-auto rounded-t-2xl border-b-solid border-b-sky border-b-2">
            Band list
            </div>
            <div className="flex divide-x divide-slate-300">
                <div className={main_squares_classes}>
                    <Map/>
                    <MapControls/>
                </div>
                <div className={main_squares_classes}>Spots</div>
            </div>
        </div>
    );
}

export default MainContainer;
