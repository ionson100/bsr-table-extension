import React, {ReactElement, ReactEventHandler} from "react";




export class DataRow<T =any>{

    public color?:string;
    public title?:string;
    public item?:T
    public style?: React.CSSProperties | undefined
    public className?: string;
    public onClick?:(dataRow:DataRow<T>,e: HTMLTableRowElement)=>void
    public id?:string
    public tag?:any
}


export type PropsTable<T=any> = {
    className?: string;
    style?: React.CSSProperties | undefined,
    styleHeader?: React.CSSProperties | undefined,
    styleBody?: React.CSSProperties | undefined,
    styleCaption?: React.CSSProperties | undefined,
    id?: string
    caption?:string|ReactElement;
    children?: string|React.ReactNode;
    rowItems:Array<DataRow<T>>
    onClickRow?:(dataRow:DataRow<T>,e: HTMLTableRowElement)=>void
    onClickColumn?: (id: string, index: number, propertyName: string)=>void
    onClickCell?:(id:string,row:number,column:number)=>void
    useInnerHTML?:boolean
    useRowSelection?:boolean
    useRowMultiSelection?:boolean
    classNameSelection?:string
}
export type PropsColumn ={
    colspan?:number
    propertyName:string
    className?: string;
    style?: React.CSSProperties | undefined,
    children?:string|React.ReactNode;
}
export type PropsColumnGroups ={
    id?:string;
    className?: string;
    style?: React.CSSProperties | undefined,
    children?:string|React.ReactNode;
}

export type PropsHeaderGroups ={
    id?:string;
    title?:string|ReactElement
    className?: string;
    style?: React.CSSProperties | undefined,
    children?:string|React.ReactNode;
    eventKey?:string
    onClick?:(eventKey?:string)=>void
}

// export  interface CustomCell{
//     data:ReactElement;
// }

