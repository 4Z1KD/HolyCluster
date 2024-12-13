import Alerts from "@/components/Alerts.jsx";
import CallsignFilters from "@/components/CallsignFilters.jsx";

function CallsignsView({ alerts, set_alerts, filters, set_filters, toggled_ui }) {
    const toggled_classes = toggled_ui.right
        ? "hidden "
        : "max-2xl:absolute z-50 right-20 top-0 border-l border-slate-300 ";
    return (
        <div
            className={
                toggled_classes +
                " 2xl:flex flex-col bg-white h-full divide-y divide-slate-300 w-60"
            }
        >
            <Alerts alerts={alerts} set_alerts={set_alerts} />
            <CallsignFilters filters={filters} set_filters={set_filters} is_show_only={true} />
            <CallsignFilters filters={filters} set_filters={set_filters} is_show_only={false} />
        </div>
    );
}

export default CallsignsView;
