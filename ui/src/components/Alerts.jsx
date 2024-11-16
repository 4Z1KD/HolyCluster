import CallsignsList from "@/components/CallsignsList.jsx";

function Alerts({ alerts, set_alerts }) {
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";

    return <CallsignsList
        callsigns={alerts}
        set_callsigns={set_alerts}
        title="Alerts"
        help_text={
            <small>
                You can highlight a pattern of a callsign. For example,<br/>
                Israeli stations: <code className={exmaple_pattern_classes}>4X*</code>,&nbsp;&nbsp;
                                  <code className={exmaple_pattern_classes}>4Z*</code><br/>
                Portable stations: <code className={exmaple_pattern_classes}>*/P</code><br/>
            </small>
        }
    />
}

export default Alerts;
