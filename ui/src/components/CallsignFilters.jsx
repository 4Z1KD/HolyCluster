import CallsignsList from "@/components/CallsignsList.jsx";
import { useFilters } from "../hooks/useFilters"; 
import Button from "@/components/Button.jsx";

function CallsignFilters({is_show_only }) {
    const { filters, setFilters} = useFilters()
    const exmaple_pattern_classes = "bg-slate-300 rounded-sm p-0.5";
    const callsigns = is_show_only ? filters.include_callsigns : filters.exclude_callsigns;

    return <CallsignsList
        callsigns={callsigns}
        set_callsigns={is_show_only ?
            callsigns => setFilters(_filters =>( {..._filters, include_callsigns: callsigns})) :
            callsigns => setFilters(_filters => ({..._filters, exclude_callsigns: callsigns}))}
        title={is_show_only ? "Show only" : "Hide"}
    />
}

export default CallsignFilters;
