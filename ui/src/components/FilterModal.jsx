import Modal from "@/components/Modal.jsx";
import Select from "@/components/Select.jsx";
import Input from "@/components/Input.jsx";
import { useColors } from "../hooks/useColors";
import entities from "@/assets/dxcc_entities.json";

import { default as SearchSelect } from "react-select";
import { useState } from "react";

const dxcc_entities = entities.map(entity => ({ value: entity, label: entity }));

const empty_temp_data = {
    action: "show_only",
    type: "prefix",
    value: "",
    spotter_or_dx: "dx",
};

function FilterModal({ initial_data = null, on_apply, button }) {
    const [temp_data, set_temp_data] = useState(empty_temp_data);
    const { colors } = useColors();

    return (
        <Modal
            title={<h1 className="text-2xl">Filter</h1>}
            button={button}
            on_open={() => {
                if (initial_data != null) {
                    set_temp_data(initial_data);
                }
            }}
            on_apply={() => on_apply(temp_data)}
            on_cancel={() => set_temp_data(empty_temp_data)}
        >
            <table
                className="table-fixed w-80 mt-3 mx-2 border-separate border-spacing-y-2"
                style={{ color: colors.theme.text }}
            >
                <tbody>
                    <tr>
                        <td className="w-1/3">Type:</td>
                        <td className="w-2/3">
                            <Select
                                value={temp_data.type}
                                onChange={event => {
                                    let result = {
                                        ...temp_data,
                                        type: event.target.value,
                                    };
                                    if (
                                        event.target.value == "entity" ||
                                        temp_data.type == "entity"
                                    ) {
                                        result.value = "";
                                    }
                                    set_temp_data(result);
                                }}
                            >
                                <option value="prefix">Prefix</option>
                                <option value="suffix">Suffix</option>
                                <option value="entity">Entity</option>
                            </Select>
                        </td>
                    </tr>
                    <tr>
                        <td className="w-1/3">{temp_data.type}:</td>
                        <td className="w-2/3">
                            {temp_data.type == "entity" ? (
                                <SearchSelect
                                    value={{ value: temp_data.value, label: temp_data.value }}
                                    onChange={option => {
                                        set_temp_data({
                                            ...temp_data,
                                            value: option.value,
                                        });
                                    }}
                                    styles={{
                                        control: (base_style, state) => ({
                                            ...base_style,
                                            backgroundColor: colors.theme.input_background,
                                            borderColor: colors.theme.borders,
                                            color: colors.theme.text,
                                            width: "12rem",
                                        }),
                                        menu: (base_style, state) => ({
                                            ...base_style,
                                            backgroundColor: colors.theme.input_background,
                                            borderColor: colors.theme.borders,
                                            width: "12rem",
                                        }),
                                        option: (base_style, { isFocused }) => ({
                                            ...base_style,
                                            backgroundColor: isFocused
                                                ? colors.theme.disabled_text
                                                : colors.theme.input_background,
                                            color: colors.theme.text,
                                            width: "12rem",
                                        }),
                                        input: (base_style, state) => ({
                                            ...base_style,
                                            color: colors.theme.text,
                                        }),
                                        singleValue: (base_style, state) => ({
                                            ...base_style,
                                            color: colors.theme.text,
                                        }),
                                    }}
                                    options={dxcc_entities}
                                />
                            ) : (
                                <Input
                                    value={temp_data.value}
                                    onChange={event => {
                                        set_temp_data({
                                            ...temp_data,
                                            value: event.target.value,
                                        });
                                    }}
                                />
                            )}
                        </td>
                    </tr>
                    {temp_data.type == "entity" ? (
                        ""
                    ) : (
                        <tr>
                            <td className="w-1/3">Selection:</td>
                            <td className="w-2/3">
                                <Select
                                    value={temp_data.spotter_or_dx}
                                    onChange={event => {
                                        set_temp_data({
                                            ...temp_data,
                                            spotter_or_dx: event.target.value,
                                        });
                                    }}
                                >
                                    <option value="dx">DX</option>
                                    <option value="spotter">Spotter</option>
                                </Select>
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td className="w-1/3">Action:</td>
                        <td className="w-2/3">
                            <Select
                                value={temp_data.action}
                                onChange={event => {
                                    set_temp_data({
                                        ...temp_data,
                                        action: event.target.value,
                                    });
                                }}
                            >
                                <option value="show_only">Shoy only</option>
                                <option value="hide">Hide</option>
                                <option value="alert">Alert</option>
                            </Select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Modal>
    );
}

export default FilterModal;
