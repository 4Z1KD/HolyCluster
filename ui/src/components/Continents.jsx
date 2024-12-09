import FilterOptions from "@/components/FilterOptions.jsx";
import FilterButton from "@/components/FilterButton.jsx";
import { continents } from "@/filters_data.js";

const title = { dx: "DX", spotter: "DE" };
const button_color = { dx: "rgb(191 219 254)", spotter: "rgb(254 205 211)" };

function ContinentColumn({ spot_type, filters, set_filters, color }) {
    const filter_key = `${spot_type}_continents`;

    return <>
        <strong>{title[spot_type]}</strong>
        {continents.map(continent => <FilterOptions
            key={spot_type + "_" + continent}
            set_filters={set_filters}
            filter_key={filter_key}
            filter_value={continent}
            orientation="left">
                <FilterButton
                    color={color}
                    text={continent}
                    is_active={filters[filter_key][continent]}
                    on_click={_ => {
                        set_filters(state => state[filter_key][continent] = !state[filter_key][continent]);
                    }}
                    size="small"/>
            </FilterOptions>
        )}
        <div className="h-8"></div>
    </>;
}

function Continents({ filters, set_filters, toggled_ui }) {
    const toggled_classes = (toggled_ui.right ? "max-xl:hidden " : "max-xl:absolute z-50 right-0 top-0 ");
    return <div className={toggled_classes + "flex flex-col w-20 p-2 text-center h-full gap-3 items-center bg-gray-100"}>
        {["dx", "spotter"].map(spot_type => <ContinentColumn
            key={spot_type}
            spot_type={spot_type}
            filters={filters}
            set_filters={set_filters}
            color={button_color[spot_type]}
        />)}
    </div>;
}

export default Continents;
