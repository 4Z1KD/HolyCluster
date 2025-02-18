import Alerts from "@/components/Alerts.jsx";
import CallsignFilters from "@/components/CallsignFilters.jsx";
import Filters from "@/components/Filters.jsx";
import { useColors } from "../hooks/useColors";

function CallsignsView({ alerts, set_alerts, toggled_ui }) {
    const { colors } = useColors();

    const toggled_classes = toggled_ui.right
        ? "hidden "
        : "max-2xl:absolute z-40 right-20 top-0 border-l border-slate-300 ";
    return (
        <div
            className={
                toggled_classes +
                " 2xl:flex flex-col bg-white h-full divide-y divide-slate-300 w-56 2xl:w-[30rem] overflow-y-auto"
            }
            style={{ backgroundColor: colors.theme.background }}
        >
            <Filters />
        </div>
    );
}

export default CallsignsView;
