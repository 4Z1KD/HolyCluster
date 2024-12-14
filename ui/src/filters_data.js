export const band_colors = new Map([
    [4, "rgb(103, 97, 99)"],
    [6, "rgb(255, 98, 235)"],
    [10, "rgb(231, 117, 33)"],
    [12, "rgb(70, 224, 240)"],
    [15, "rgb(21, 21, 205)"],
    [17, "rgb(115, 31, 105)"],
    [20, "rgb(254, 0, 0)"],
    [30, "rgb(252, 252, 0)"],
    [40, "rgb(24, 160, 24)"],
    [60, "rgb(20, 45, 69)"],
    [80, "rgb(144, 55, 40)"],
    [160, "rgb(21, 96, 130)"],
]);

export const bright_text_color = "white";
export const dark_text_color = "black";

export const band_text_colors = {
    4: bright_text_color,
    6: dark_text_color,
    10: dark_text_color,
    12: dark_text_color,
    15: bright_text_color,
    17: bright_text_color,
    20: bright_text_color,
    30: dark_text_color,
    40: dark_text_color,
    60: bright_text_color,
    80: bright_text_color,
    160: bright_text_color,
};

// Taken from: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
// biome-ignore format: This code is a mess and should not be touched.
const RGB_Linear_Shade=(p,c0)=>{
	var i=parseInt,r=Math.round,[a,b,c,d]=c0.split(","),n=p<0,t=n?0:255*p,P=n?1+p:1-p;
	return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}

export const band_light_colors = Object.fromEntries(
    [...band_colors].map(([band, color]) => [band, RGB_Linear_Shade(0.25, color)]),
);

export const modes = ["SSB", "CW", "FT8", "FT4", "DIGI"];

export const continents = ["AS", "AF", "EU", "NA", "SA", "AU", "OC"];

export const map_land_color = "#D7D7D7";
