import Input from "@/components/Input.jsx";
import Button from "@/components/Button.jsx";
import X from "@/components/X.jsx";
import FilterModal from "@/components/FilterModal.jsx";
import { useColors } from "../hooks/useColors";

function Indicator({ text }) {
    return (
        <div
            className="flex border border-gray-700 items-center justify-center p-2 w-7 h-7 rounded-md mr-2 text-xs font-bold bg-green-600 text-white"
            title="Prefix"
        >
            {text}
        </div>
    );
}

function FilterLine({
    filtered_field,
    filter_type, // pfx, sfx, entity
    spotter_or_dx,
}) {
    const { colors } = useColors();

    let filter_type_label;
    if (filter_type == "prefix") {
        filter_type_label = "Pfx";
    } else if (filter_type == "suffix") {
        filter_type_label = "Sfx";
    } else if (filter_type == "entity") {
        filter_type_label = "Ent";
    }

    let spotter_or_dx_label;
    if (spotter_or_dx == "spotter") {
        spotter_or_dx_label = "DE";
    } else if (spotter_or_dx == "dx") {
        spotter_or_dx_label = "DX";
    }

    return (
        <div
            className="flex justify-around items-center mb-1 w-full"
            style={{ color: colors.theme.text }}
        >
            <Input
                className="h-7 text-sm mr-1 w-20"
                disabled
                disabled_text_color={colors.theme.text}
                value={filtered_field}
            />
            <Indicator text={filter_type_label} />
            <Indicator text={spotter_or_dx_label} />
            <FilterModal />
            <X size="24" />
            <br />
        </div>
    );
}

function Filters({}) {
    const { colors } = useColors();

    return (
        <div className="p-2" style={{ color: colors.theme.text }}>
            <div className="flex pb-2 items-center">
                <h3 className="text-2xl p-1 w-fit inline">Filters</h3>
                <Button className="ml-auto h-8 py-0">Add</Button>
            </div>
            <FilterLine filtered_field="4X1XP" filter_type="entity" spotter_or_dx="dx" />
            <FilterLine filtered_field="4Z1KD" filter_type="suffix" spotter_or_dx="spotter" />
        </div>
    );
}

export default Filters;
