import CallsignsList from "@/components/CallsignsList.jsx";
import { useColors } from "../hooks/useColors";

function Alerts({ alerts, set_alerts }) {
    const { colors } = useColors();

    return (
        <CallsignsList
            callsigns={alerts}
            set_callsigns={set_alerts}
            title={
                <h3 className="text-2xl p-1" style={{ color: colors.theme.text }}>
                    Alerts
                </h3>
            }
        />
    );
}

export default Alerts;
