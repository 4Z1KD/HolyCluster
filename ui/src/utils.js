import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect } from "react";

export function to_radian(deg) {
    return deg * (Math.PI / 180);
}

export const mod = (n, m) => ((n % m) + m) % m;

export function is_matching_list(list, callsign) {
    return list.some(([pattern, is_suffix]) => {
        if (is_suffix) {
            return callsign.endsWith(pattern);
        } else {
            return callsign.startsWith(pattern);
        }
    });
}

export function use_object_local_storage(key, default_value) {
    const [current_value, set_value] = useLocalStorage(key, default_value);

    const should_update = Object.keys(default_value) != Object.keys(current_value);

    let merged_value;
    if (should_update) {
        merged_value = Object.fromEntries(
            Object.entries(default_value).map(([key, default_value]) => {
                return [key, current_value[key] != null ? current_value[key] : default_value];
            }),
        );
    } else {
        merged_value = current_value;
    }

    useEffect(() => {
        if (should_update) {
            set_value(merged_value);
        }
    }, [current_value]);

    return [merged_value, set_value];
}
