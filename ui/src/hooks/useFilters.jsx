import { createContext, useContext, useEffect } from "react";
import { use_object_local_storage } from "@/utils.js";
import { bands, modes, continents } from "@/filters_data.js";

const FiltersContext = createContext(undefined);

const { Provider } = FiltersContext;

export const useFilters = () => {
    const context = useContext(FiltersContext);
    return { ...context };
};

export const FiltersProvider = ({ children }) => {
    const initial_filters = {
        bands: Object.fromEntries(Array.from(bands).map(band => [band, true])),
        modes: Object.fromEntries(modes.map(mode => [mode, true])),
        dx_continents: Object.fromEntries(continents.map(continent => [continent, true])),
        spotter_continents: Object.fromEntries(continents.map(continent => [continent, true])),
        is_include_filters_active: true,
        is_exclude_filters_active: true,
        include_callsigns: [],
        exclude_callsigns: [],
        time_limit: 3600,
    };

    const [filters, setFilters] = use_object_local_storage("filters", initial_filters);

    // This function changes all the keys in the filter object.
    // For example: setFilterKeys("bands", true) will enable all bands.
    function setFilterKeys(filters_key, is_active) {
        setFilters(state => ({
            ...state,
            [filters_key]: Object.keys(state[filters_key]).reduce((acc, key) => {
                acc[key] = is_active;
                return acc;
            }, {}),
        }));
    }

    // This function set only one filter on.
    // For example: set_only_filter_keys("modes", "CW"), enables only CW.
    function setOnlyFilterKeys(filters_key, selected_key) {
        setFilters(state => ({
            ...state,
            [filters_key]: Object.fromEntries(
                Object.keys(state[filters_key]).map(key => [
                    key,
                    selected_key.toString() === key.toString(),
                ]),
            ),
        }));
    }
    return (
        <Provider
            value={{
                filters,
                setFilters,
                setFilterKeys,
                setOnlyFilterKeys,
            }}
        >
            {children}
        </Provider>
    );
};
