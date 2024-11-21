import CallsignsList from "@/components/CallsignsList.jsx";

function CallsignFilters({ callsigns, set_callsigns }) {
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";

    return <CallsignsList
        callsigns={callsigns}
        set_callsigns={set_callsigns}
        title="Filters"
        help_text={
            <small>
                You can filter out a pattern of a callsign. For example,<br/>
                Israeli stations: <code className={exmaple_pattern_classes}>4X*</code>,&nbsp;&nbsp;
                                  <code className={exmaple_pattern_classes}>4Z*</code><br/>
                Portable stations: <code className={exmaple_pattern_classes}>*/P</code><br/>
            </small>
        }
    />
}

export default CallsignFilters;
