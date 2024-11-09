import FilterButton from "@/components/FilterButton.jsx";
import { continents } from "@/filters_data.js";

function Continents({}) {
    return <div className="w-32 min-w-20 p-2 flex flex-col text-center h-full gap-3 overflow-y-auto">
        <strong>DX</strong>
        {continents.map(continent => <FilterButton key={continent} text={continent} is_active={true} on_click={_ => {}}/>)}
        <strong>DE</strong>
        {continents.map(continent => <FilterButton key={continent} text={continent} is_active={true} on_click={_ => {}}/>)}
    </div>;
}

export default Continents;
