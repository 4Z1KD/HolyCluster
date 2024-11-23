import CallsignsList from "@/components/CallsignsList.jsx";

function Alerts({ alerts, set_alerts }) {
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";

    return <CallsignsList
        callsigns={alerts}
        set_callsigns={set_alerts}
        title="Alerts"
    />
}

export default Alerts;
