import FilterButton from "@/components/FilterButton.jsx";
import { continents } from "@/filters_data.js";

function Continents({ filters, set_filters }) {
    return <div className="w-32 min-w-20 p-2 flex flex-col text-center h-full gap-3 overflow-y-auto">
        <strong>DX</strong>
        {continents.map(continent => <FilterButton
            key={continent}
            text={continent}
            is_active={filters.dx_continents[continent]}
            on_click={_ => {
                set_filters(state => state.dx_continents[continent] = !state.dx_continents[continent]);
            }}
        />)}
        <strong>DE</strong>
        {continents.map(continent => <FilterButton
            key={continent}
            text={continent}
            is_active={filters.spotter_continents[continent]}
            on_click={_ =>  set_filters(state => {
                state.spotter_continents[continent] = !state.spotter_continents[continent];
            })}
        />)}
    </div>;
}

export default Continents;
