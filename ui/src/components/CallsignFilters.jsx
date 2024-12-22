import CallsignsList from "@/components/CallsignsList.jsx";
import { useFilters } from "../hooks/useFilters";
import Toggle from "@/components/Toggle.jsx";

function CallsignFilters({ is_show_only }) {
    const { filters, setFilters } = useFilters();
    const callsigns = is_show_only ? filters.include_callsigns : filters.exclude_callsigns;

    const title = is_show_only ? "Show only" : "Hide";

    function set_callsigns(callsigns) {
        if (is_show_only) {
            setFilters(_filters => ({ ..._filters, include_callsigns: callsigns }));
        } else {
            setFilters(_filters => ({ ..._filters, exclude_callsigns: callsigns }));
        }
    }

    return (
        <CallsignsList
            callsigns={callsigns}
            set_callsigns={set_callsigns}
            title={
                <div className="flex w-full items-center p-1">
                    <h3 className="text-2xl">{title}</h3>
                    <div className="ml-auto">
                        {is_show_only ? (
                            <Toggle
                                value={filters.is_include_filters_active}
                                on_click={() => {
                                    setFilters(state => ({
                                        ...state,
                                        is_include_filters_active: !state.is_include_filters_active,
                                    }));
                                }}
                            />
                        ) : (
                            <Toggle
                                value={filters.is_exclude_filters_active}
                                on_click={() => {
                                    setFilters(state => ({
                                        ...state,
                                        is_exclude_filters_active: !state.is_exclude_filters_active,
                                    }));
                                }}
                            />
                        )}
                    </div>
                </div>
            }
        />
    );
}

export default CallsignFilters;
