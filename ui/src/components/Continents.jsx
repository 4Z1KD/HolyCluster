import FilterOptions from "@/components/FilterOptions.jsx";
import FilterButton from "@/components/FilterButton.jsx";
import { continents } from "@/filters_data.js";

const title = { dx: "DX", spotter: "DE" };

function ContinentColumn({ spot_type, filters, set_filters }) {
    const filter_key = `${spot_type}_continents`;

    return <>
        <strong>{title[spot_type]}</strong>
        {continents.map(continent => <FilterOptions
            key={spot_type + "_" + continent}
            set_filters={set_filters}
            filter_key={filter_key}
            filter_value={continent}
            orientation="left"
            align="center">
                <FilterButton
                    text={continent}
                    is_active={filters[filter_key][continent]}
                    on_click={_ => {
                        set_filters(state => state[filter_key][continent] = !state[filter_key][continent]);
                    }}
                    size="small"/>
            </FilterOptions>
        )}
    </>;
}

function Continents({ filters, set_filters }) {
    return <div className="w-32 p-2 flex flex-col text-center h-full gap-3">
        {["dx", "spotter"].map(spot_type => <ContinentColumn
            key={spot_type}
            spot_type={spot_type}
            filters={filters}
            set_filters={set_filters}
        />)}
    </div>;
}

export default Continents;
