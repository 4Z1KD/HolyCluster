export const band_colors = new Map([
    [160, "rgb(150,99,99)"],
    [80, "rgb(150, 150, 252)"],
    [60, "rgb(80, 168, 252)"],
    [40, "rgb(66, 156, 71)"],
    [30, "rgb(206, 208, 103)"],
    [20, "rgb(240, 56, 64)"],
    [17, "rgb(144, 52, 132)"],
    [15, "rgb(56, 92, 252)"],
    [12, "rgb(99, 48, 48)"],
    [10, "rgb(240, 160, 79)"],
    [6, "rgb(252, 48, 150)"],
]);

// Taken from: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
const RGB_Linear_Shade=(p,c0)=>{
	var i=parseInt,r=Math.round,[a,b,c,d]=c0.split(","),n=p<0,t=n?0:255*p,P=n?1+p:1-p;
	return"rgb"+(d?"a(":"(")+r(i(a[3]=="a"?a.slice(5):a.slice(4))*P+t)+","+r(i(b)*P+t)+","+r(i(c)*P+t)+(d?","+d:")");
}

export const band_light_colors = Object.fromEntries(
    [...band_colors].map(([band, color]) => [band, RGB_Linear_Shade(0.25, color)])
);

export const modes = ["SSB", "CW", "FT8", "RTTY", "PSK", "AM", "FM"];

