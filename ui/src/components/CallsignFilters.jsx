import CallsignsList from "@/components/CallsignsList.jsx";
import Button from "@/components/Button.jsx";

function CallsignFilters({ filters, set_filters }) {
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";

    return <CallsignsList
        callsigns={filters.callsigns}
        set_callsigns={callsigns => set_filters(state => state.callsigns = callsigns)}
        title="Filters"
        pre={<Button
            className="mb-2 w-28"
            color={filters.callsigns_mode ? "emerald" : "amber"}
            onClick={() => set_filters(state => state.callsigns_mode = !state.callsigns_mode)}
        >{filters.callsigns_mode ? "Show Only" : "Hide"}</Button>}
    />
}

export default CallsignFilters;
