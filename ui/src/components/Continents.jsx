import FilterOptions from "@/components/FilterOptions.jsx";
import FilterButton from "@/components/FilterButton.jsx";
import { continents } from "@/filters_data.js";

function Continents({ filters, set_filters }) {
    const title = { dx: "DX", spotter: "DE" };

    return <div className="w-32 p-2 flex flex-col text-center h-full gap-3">
        {["dx", "spotter"].map(spot_type => {
            const filter_key = `${spot_type}_continents`;
            return <>
                <strong>{title[spot_type]}</strong>
                {continents.map(continent => <FilterOptions
                    key={continent}
                    set_filters={set_filters}
                    filter_key={filter_key}
                    filter_value={continent}
                    orientation="left"
                    align="center">
                        <FilterButton
                            key={continent}
                            text={continent}
                            is_active={filters[filter_key][continent]}
                            on_click={_ => {
                                set_filters(state => state[filter_key][continent] = !state[filter_key][continent]);
                            }}
                            size="small"/>
                    </FilterOptions>
                )}
            </>;
        })}
    </div>;
}

export default Continents;
