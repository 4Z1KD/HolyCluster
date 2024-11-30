import CallsignsList from "@/components/CallsignsList.jsx";
import Button from "@/components/Button.jsx";

function CallsignFilters({ filters, set_filters, is_show_only }) {
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";
    const callsigns = is_show_only ? filters.include_callsigns : filters.exclude_callsigns;

    return <CallsignsList
        callsigns={callsigns}
        set_callsigns={is_show_only ?
            callsigns => set_filters(state => state.include_callsigns = callsigns) :
            callsigns => set_filters(state => state.exclude_callsigns = callsigns)}
        title={is_show_only ? "Show only" : "Hide"}
    />
}

export default CallsignFilters;
