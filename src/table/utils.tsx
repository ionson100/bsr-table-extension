import React, {ReactElement}from "react";



export function ParseString(str: string,useInnerHtml?:boolean): string|ReactElement|undefined|null {
    if(useInnerHtml){
        str=HtmlEncode(str).replace(/ /g,'&nbsp;')
        return (<div className="content" dangerouslySetInnerHTML={{__html: str}}></div>)
    }else{
        return str
    }

}
function HtmlEncode(s:string)
{
    const el = document.createElement("div");
    el.innerText = el.textContent = s;
    s = el.innerHTML;
    return s;
}
