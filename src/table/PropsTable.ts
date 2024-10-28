import React, {ReactElement, ReactEventHandler} from "react";




export class DataRow{
    public title?:string;
    public style?: React.CSSProperties | undefined
    public className?: string;
    public onClick?:(dataRow:DataRow,target: EventTarget)=>void
    public id?:string
    public tag?:any
    public getView?:()=>any
}


export type PropsTable<T=any> = {
    height?:number
    className?: string;
    style?: React.CSSProperties | undefined,
    styleHeader?: React.CSSProperties | undefined,
    styleBody?: React.CSSProperties | undefined,
    styleCaption?: React.CSSProperties | undefined,
    id?: string
    caption?:string|ReactElement;
    children?: string|React.ReactNode;
    rowItems:Array<DataRow>
    onClickRow?:(dataRow:DataRow,e: HTMLTableRowElement)=>void
    onClickColumn?: ( propertyName: string,eventTarget: HTMLTableHeaderCellElement,eventKey?:string,)=>void
    onClickCell?:(propertyName: string, props: DataRow, target: EventTarget)=>void
    useInnerHTML?:boolean
    useRowSelection?:boolean
    //useRowMultiSelection?:boolean
    classNameSelection?:string
}
export type PropsColumn ={
    colspan?:number
    propertyName:string
    className?: string;
    eventKey?:string
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

