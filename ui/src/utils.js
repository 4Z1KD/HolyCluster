export function to_radian(deg) {
    return deg * (Math.PI / 180)
}

export const mod = (n, m) => (n % m + m) % m;

export function is_matching_list(list, callsign) {
    return list.some(([pattern, is_suffix]) => {
        if (is_suffix) {
            return callsign.endsWith(pattern);
        } else {
            return callsign.startsWith(pattern);
        }
    });
}
