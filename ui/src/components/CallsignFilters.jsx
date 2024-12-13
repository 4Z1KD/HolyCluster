import CallsignsList from "@/components/CallsignsList.jsx";
import Button from "@/components/Button.jsx";
import Toggle from "@/components/Toggle.jsx";

function CallsignFilters({ filters, set_filters, is_show_only }) {
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";
    const callsigns = is_show_only ? filters.include_callsigns : filters.exclude_callsigns;

    const title = is_show_only ? "Show only" : "Hide";

    function set_callsigns(callsigns) {
        if (is_show_only) {
            set_filters(state => (state.include_callsigns = callsigns));
        } else {
            set_filters(state => (state.exclude_callsigns = callsigns));
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
                                    set_filters(
                                        state =>
                                            (state.is_include_filters_active =
                                                !state.is_include_filters_active),
                                    );
                                }}
                            />
                        ) : (
                            <Toggle
                                value={filters.is_exclude_filters_active}
                                on_click={() => {
                                    set_filters(
                                        state =>
                                            (state.is_exclude_filters_active =
                                                !state.is_exclude_filters_active),
                                    );
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
