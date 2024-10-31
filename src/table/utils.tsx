import React from "react";



export function appendWidth(acum?:string,value?:string){
    if(!value){
        return acum;
    }else{


        if(!acum){
            acum=value
        }else {
            let int1 = getInteger(acum);
            let int2 = getInteger(value);
            let extension =getExtension(value);
            if(!extension){
                extension='px'
            }

            let sum=parseInt(int1!.toString())+parseInt(int2!.toString())
            acum=sum+extension

        }
        return acum
    }
}
function getInteger(str:string) {
    const arr = String(str).match(/^[0-9]*/)
    return arr!.toString();
}
function getExtension(str:string) {
    const arr = String(str).match(/[\%a-z]*/)
    return arr!.toString();

}
