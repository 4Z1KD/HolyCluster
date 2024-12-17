import Alerts from "@/components/Alerts.jsx";
import CallsignFilters from "@/components/CallsignFilters.jsx";


function CallsignsView({
    alerts,
    set_alerts,
}) {
    return <div className="flex flex-col divide-y divide-slate-300 w-[32rem]">
        <Alerts alerts={alerts} set_alerts={set_alerts}/>
        <CallsignFilters is_show_only={true}/>
        <CallsignFilters is_show_only={false}/>

    </div>
}

export default CallsignsView;
