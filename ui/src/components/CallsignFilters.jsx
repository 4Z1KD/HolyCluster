import CallsignsList from "@/components/CallsignsList.jsx";
import Button from "@/components/Button.jsx";

function CallsignFilters({ filters, set_filters }) {
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";

    return <CallsignsList
        callsigns={filters.callsigns}
        set_callsigns={callsigns => set_filters(state => state.callsigns = callsigns)}
        title="Filters"
        help_text={
            <small>
                You can filter out a pattern of a callsign. For example,<br/>
                Israeli stations: <code className={exmaple_pattern_classes}>4X*</code>,&nbsp;&nbsp;
                                  <code className={exmaple_pattern_classes}>4Z*</code><br/>
                Portable stations: <code className={exmaple_pattern_classes}>*/P</code><br/>
            </small>
        }
        pre={<Button
            className="mb-2 w-20"
            color={filters.callsigns_mode ? "emerald" : "amber"}
            onClick={() => set_filters(state => state.callsigns_mode = !state.callsigns_mode)}
        >{filters.callsigns_mode ? "Include" : "Exclude"}</Button>}
    />
}

export default CallsignFilters;
