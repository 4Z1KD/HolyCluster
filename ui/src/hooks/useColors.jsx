import { createContext, useContext, useEffect } from "react";
import { use_object_local_storage } from "@/utils.js";
import { bands, modes, continents } from "@/filters_data.js";

const ColorsContext = createContext(undefined);

const { Provider } = ColorsContext;

export const useColors = () => {
    const context = useContext(ColorsContext);
    return { ...context };
};

// Taken from: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
// biome-ignore format: This code is a mess and should not be touched.
const RGB_Linear_Shade=(p,c0)=>{
    var i=parseInt,r=Math.round,[a,b,c,d]=c0.split(","),n=p<0,t=n?0:255*p,P=n?1+p:1-p;
    return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}

export const ColorsProvider = ({ children }) => {
    const initial_colors = {
        bands: {
            4: "rgb(103, 97, 99)",
            6: "rgb(255, 98, 235)",
            10: "rgb(231, 117, 33)",
            12: "rgb(70, 224, 240)",
            15: "rgb(21, 21, 205)",
            17: "rgb(115, 31, 105)",
            20: "rgb(220, 38, 38)",
            30: "rgb(252, 252, 0)",
            40: "rgb(24, 160, 24)",
            60: "rgb(20, 45, 69)",
            80: "rgb(144, 55, 40)",
            160: "rgb(21, 96, 130)",
        },
        light_bands: {
            4: 0.25,
            6: 0.25,
            10: 0.25,
            12: 0.25,
            15: 0.25,
            17: 0.25,
            20: 0.25,
            30: 0.25,
            40: 0.25,
            60: 0.25,
            80: 0.25,
            160: 0.25,
        },
        bright_text: "white",
        dark_text: "black",
        text: {
            4: "default_bright",
            6: "default_dark",
            10: "default_dark",
            12: "default_dark",
            15: "default_bright",
            17: "default_bright",
            20: "default_bright",
            30: "default_dark",
            40: "default_dark",
            60: "default_bright",
            80: "default_bright",
            160: "default_bright",
        },
    };

    const [colors, setColors] = use_object_local_storage("colors", initial_colors);
    for (const band in colors.light_bands) {
        if (typeof colors.light_bands[band] == "number") {
            colors.light_bands[band] = RGB_Linear_Shade(
                colors.light_bands[band],
                colors.bands[band],
            );
        }
    }
    for (const band in colors.text) {
        if (colors.text[band] == "default_dark") {
            colors.text[band] = colors.dark_text;
        } else if (colors.text[band] == "default_bright") {
            colors.text[band] = colors.bright_text;
        }
    }

    // This function changes all the keys in the filter object.
    // For example: setFilterKeys("bands", true) will enable all bands.
    function setOneColor(color_name, value) {
        setColors(state => ({
            ...state,
            [color_name]: value,
        }));
    }

    return (
        <Provider
            value={{
                colors,
                setColors,
                setOneColor,
            }}
        >
            {children}
        </Provider>
    );
};
