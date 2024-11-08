import React, {ReactElement} from "react";
import {Column} from "./Column";
import {HeaderGroup} from "./HeaderGroup";
import {ColumnGroup} from "./ColumnGroup";
import {CellFooter} from "./CellFooter";
import {RowFooter} from "./RowFooter";





export class DataRow<T =any,V =any>{
    public title?:string;
    public style?: React.CSSProperties | undefined
    public className?: string;
    public onClick?:(dataRow:DataRow,target: EventTarget)=>void
    public id?:string
    public tag?:T
    public getView?:()=>V
}


export type PropsTable = {
    height?:number
    className?: string;
    style?: React.CSSProperties | undefined,
    styleHeader?: React.CSSProperties | undefined,
    styleHeaderGroup?: React.CSSProperties | undefined,
    styleBody?: React.CSSProperties | undefined,
    styleCaption?: React.CSSProperties | undefined,
    id?: string
    caption?:string|ReactElement;
    children?: ReactElement<Column>|ReactElement<HeaderGroup>|ReactElement<ColumnGroup>|ReactElement<RowFooter>|
              ReactElement<Column>[]|ReactElement<HeaderGroup>[]|ReactElement<ColumnGroup>[]|ReactElement<RowFooter>[];
    rowItems?:Array<DataRow>
    onClickRow?:(dataRow:DataRow,e: HTMLTableRowElement)=>void
    onClickColumn?: (nameProperty: string, eventTarget: EventTarget, eventKey?:string,)=>void
    onClickCell?:(nameProperty: string, props: DataRow, target: EventTarget)=>void

    useRowSelection?:boolean
    classNameSelection?:string
    onSelect?:(map:Map<number,DataRow>)=>void
}
export type PropsColumn ={
   // colspan?:number
    nameProperty:string
    className?: string;
    eventKey?:string
    style?: React.CSSProperties | undefined,
    children?:string|React.ReactNode;
}
export type PropsColumnGroups ={
    id?:string;
    className?: string;
    style?: React.CSSProperties | undefined,
    children?:ReactElement<Column>|ReactElement<Column>[];
}

export type PropsHeaderGroups ={
    id?:string;
    caption?:string|ReactElement
    className?: string;
    style?: React.CSSProperties | undefined,
    children?:ReactElement<Column>|ReactElement<Column>[]|ReactElement<ColumnGroup>|ReactElement<ColumnGroup>[];
    eventKey?:string
    onClick?:(eventKey?:string)=>void
}
export type CellFooterProperty ={
    colspan?:number
    className?: string;
    style?: React.CSSProperties | undefined,
    children?:any;
}
export type RowFooterProperty ={
    useScrollContent?:boolean
    className?: string;
    style?: React.CSSProperties | undefined,
    children?:ReactElement<CellFooter>|ReactElement<CellFooter>[]
}

// export  interface CustomCell{
//     data:ReactElement;
// }

