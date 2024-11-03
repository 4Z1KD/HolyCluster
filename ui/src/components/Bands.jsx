import { band_colors } from "@/filters_data.js";
import FilterButton from "@/components/FilterButton.jsx";

function Bands({ filters, set_filters }) {
    return <div className="text-center p-2 flex flex-col h-full gap-3">
        {[...band_colors].map(([band, color]) => {
            return <FilterButton
            text={band + "m"}
            is_active={filters.bands[band]}
            color={color}
            on_click={_ => set_filters(state => state.bands[band] = !state.bands[band])}
            hover_brightness="125"
            />
        })}
    </div>;
}

export default Bands;
