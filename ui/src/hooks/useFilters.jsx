import { createContext, useContext, useEffect } from "react";
import { use_object_local_storage } from "@/utils.js";
import { band_colors, modes, continents } from "@/filters_data.js";

const FiltersContext = createContext(undefined);

const { Provider } = FiltersContext;

export const useFilters = () => {
    const context = useContext(FiltersContext);
    return { ...context };
};

export const FiltersProvider = ({ children }) => {
    const initial_filters = {
        bands: Object.fromEntries(Array.from(band_colors.keys()).map(band => [band, true])),
        modes: Object.fromEntries(modes.map(mode => [mode, true])),
        dx_continents: Object.fromEntries(continents.map(continent => [continent, true])),
        spotter_continents: Object.fromEntries(continents.map(continent => [continent, true])),
        include_callsigns: [],
        exclude_callsigns: [],
        time_limit: 3600,
    };

    const [filters, setFilters] = use_object_local_storage("filters", initial_filters);

    useEffect(() => {
        if (Object.keys(initial_filters) != Object.keys(filters)) {
            const merged = {
                ...initial_filters,
                ...Object.keys(filters).reduce((acc, key) => {
                    acc[key] = filters[key];
                    return acc;
                }, {}),
            };
            const new_keys = Object.keys(initial_filters);
            Object.keys(merged).forEach(key => {
                if (!new_keys.includes(key)) {
                    delete merged[key];
                }
            });
            setFilters(merged);
        }
    }, []);

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
