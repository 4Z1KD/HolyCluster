import { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { band_colors, modes, continents } from "@/filters_data.js";


const FiltersContext = createContext(undefined)

const { Provider } = FiltersContext


export const useFilters = () =>{
    const context = useContext(FiltersContext)
    return {...context}
}


export const FiltersProvider = ({ children }) => {
    function useObjectLocalStorage(key, default_value) {
        const [current_value, set_value] = useLocalStorage(key, default_value);
    
        const should_update = Object.keys(default_value) != Object.keys(current_value);
    
        let merged_value;
        if (should_update) {
            merged_value = Object.fromEntries(Object.entries(default_value).map(([key, value]) => {
                return [key, current_value[key] || value];
            }));
        } else {
            merged_value = current_value;
        }
    
        useEffect(() => {
            if (should_update) {
                set_value(merged_value);
            }
        }, [current_value]);
    
        return [merged_value, set_value];
    }

    const [filters, setFilters] = useObjectLocalStorage(
        "filters",
        {
            bands: Object.fromEntries(Array.from(band_colors.keys()).map(band => [band, true])),
            modes: Object.fromEntries(modes.map(mode => [mode, true])),
            dx_continents: Object.fromEntries(continents.map(continent => [continent, true])),
            spotter_continents: Object.fromEntries(continents.map(continent => [continent, true])),
            include_callsigns: [],
            exclude_callsigns: [],
            time_limit: 3600,
        }
    );

    // This function changes all the keys in the filter object.
    // For example: setFilterKeys("bands", true) will enable all bands.
    function setFilterKeys(filters_key, is_active) {
        setFilters(state => ({
            ...state,
            [filters_key]: Object.keys(state[filters_key]).reduce((acc, key) => {
                acc[key] = is_active;
                return acc;
            }, {})
        }));
    }

    // This function set only one filter on.
    // For example: set_only_filter_keys("modes", "CW"), enables only CW.
    function setOnlyFilterKeys(filters_key, selected_key) {
        setFilters(state => ({
            ...state,
            [filters_key]: Object.fromEntries(
                Object.keys(state[filters_key]).map(key => [key, selected_key === key])
            )
        }));
    }
    return (<Provider value={{
        filters,
        setFilters,
        setFilterKeys,
        setOnlyFilterKeys
    }}>{children}</Provider>
    )

}

