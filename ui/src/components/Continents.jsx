import FilterButton from "@/components/FilterButton.jsx";
import { continents } from "@/filters_data.js";

function Continents({}) {
    console.log(continents)
    return <div className="w-32 text-center p-2 flex flex-col h-full gap-3">
        <strong>DX</strong>
        {continents.map(continent => <FilterButton text={continent} is_active={true} on_click={_ => {}}/>)}
        <strong>DE</strong>
        {continents.map(continent => <FilterButton text={continent} is_active={true} on_click={_ => {}}/>)}
    </div>;
}

export default Continents;
