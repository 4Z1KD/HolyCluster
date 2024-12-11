export const band_colors = new Map([
    [6, "#FF5B5B"],
    [10, "#FFAA5B"],
    [12, "#B7FF5B"],
    [15, "#5BFFF5"],
    [17, "#5B9DFF"],
    [20, "#A35BFF"],
    [30, "#FC5BFF"],
    [40, "#FF5B96"],
    [60, "#23AF5B"],
    [80, "#2352AF"],
    [160, "#C54821"],
]);

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
