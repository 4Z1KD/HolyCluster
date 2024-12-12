export const band_colors = new Map([
    [4, "rgb(135, 90, 90)"],
    [6, "rgb(255, 91, 91)"],
    [10, "rgb(255, 170, 91)"],
    [12, "rgb(161, 236, 66)"],
    [15, "rgb(84, 243, 233)"],
    [17, "rgb(50, 126, 239)"],
    [20, "rgb(133, 18, 241)"],
    [30, "rgb(248, 80, 252)"],
    [40, "rgb(236, 30, 104)"],
    [60, "rgb(47, 144, 85)"],
    [80, "rgb(32, 75, 157)"],
    [160, "rgb(197, 72, 33)"],
]);

export const bright_text_color = "white";
export const dark_text_color = "black";

export const band_text_colors = {
    4: dark_text_color,
    6: dark_text_color,
    10: dark_text_color,
    12: dark_text_color,
    15: dark_text_color,
    17: dark_text_color,
    20: dark_text_color,
    30: dark_text_color,
    40: dark_text_color,
    60: bright_text_color,
    80: bright_text_color,
    160: bright_text_color,
};

// Taken from: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
const RGB_Linear_Shade=(p,c0)=>{
	var i=parseInt,r=Math.round,[a,b,c,d]=c0.split(","),n=p<0,t=n?0:255*p,P=n?1+p:1-p;
	return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}

export const band_light_colors = Object.fromEntries(
    [...band_colors].map(([band, color]) => [band, RGB_Linear_Shade(0.25, color)])
);

export const modes = ["SSB", "CW", "FT8", "FT4", "DIGI"];

export const continents = [
    "AS",
    "AF",
    "EU",
    "NA",
    "SA",
    "AU",
    "OC",
];

export const map_land_color = "#def7cf";
