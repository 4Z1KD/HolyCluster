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
function pSBC(p,c0,c1,l) {
	let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
	if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))
        return null;
	if(!this.pSBCr)this.pSBCr=(d)=>{
		let n=d.length,x={};
		if(n>9){
			[r,g,b,a]=d=d.split(","),n=d.length;
			if(n<3||n>4)return null;
			x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
		}else{
			if(n==8||n==6||n<4)return null;
			if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
			d=i(d.slice(1),16);
			if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
			else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
		}return x};
	h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
	if(!f||!t)return null;
	if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
	else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
	a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
	if(h)
        return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
	else
        return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
pSBC = pSBC.bind({});

export const default_colors = {
    bands: {
        4: "#666062",
        6: "#FF61EA",
        10: "#E87421",
        12: "#47DFF0",
        15: "#1515CB",
        17: "#751F6B",
        20: "#DC2828",
        30: "#FAFA00",
        40: "#18A018",
        60: "#152F47",
        80: "#903727",
        160: "#156184",
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
    theme: {
        background: "#FFFFFF",
        columns: "#F3F4F6",
        modals: "#F3F4F6",
        borders: "#F3F4F6",
        text: "#000000",
        input_background: "#FFFFFF",
    },
    buttons: {
        modes: "#96FF9F",
        dx_continents: "#BEDBFE",
        spotter_continents: "#FECDD3",
        utility: "#484848",
        disabled_background: "#F3F4F6",
        disabled: "#484848",
    },
    table: {
        header: "#CBD5E1",
        even_row: "#F1F5F9",
        odd_row: "#FFFFFF",
        header_text: "#000000",
        even_text: "#000000",
        odd_text: "#000000",
    },
    map: {
        background: "#FFFFFF",
        land: "#D7D7D7",
        land_borders: "#777777",
        graticule: "#EEEEEE",
        night: "#000080",
        borders: "#000000",
    },
};

export const ColorsProvider = ({ children }) => {
    const [colors, setColors] = use_object_local_storage("colors", default_colors);
    colors.light_bands = Object.fromEntries(
        Object.entries(colors.bands).map(([band, color]) => [band, pSBC(0.25, colors.bands[band])]),
    );

    for (const band in colors.text) {
        if (colors.text[band] == "default_dark") {
            colors.text[band] = colors.dark_text;
        } else if (colors.text[band] == "default_bright") {
            colors.text[band] = colors.bright_text;
        }
    }

    function setSectionColor(section, name, color) {
        setColors(state => ({
            ...state,
            [section]: {
                ...state[section],
                [name]: color,
            },
        }));
    }

    return (
        <Provider
            value={{
                colors,
                setColors,
                setSectionColor,
            }}
        >
            {children}
        </Provider>
    );
};
