import MainContainer from "./MainContainer.jsx";
import holy_cluster_icon from "./icon.png";

function App() {
    return (
        <>
        <div className="flex flex-row items-center mx-20 my-5 gap-x-6">
            <h1 className="w-34 text-6xl font-bold text-slate-600">The holly cluster</h1>
            <img
                src={holy_cluster_icon}
                className="w-24"
                onMouseOver={event => event.target.style.transform = "scale(1.2, 1.2)"}
                onMouseLeave={event => event.target.style.transform = ""}
            />
        </div>
        <MainContainer/>
        </>
    );
}

export default App;
