import React from "react";
import {CellFooterProperty, PropsColumn, RowFooterProperty} from "./PropsTable";

export class Column extends React.Component<PropsColumn, any>{
    constructor({props}: { props: Readonly<PropsColumn> }) {
        super(props);
    }
    render() {
        return undefined;
    }
}
export class CellFooter extends React.Component<CellFooterProperty, any>{
    constructor({props}: { props: Readonly<CellFooterProperty> }) {
        super(props);
    }
    render() {
        return undefined;
    }
}
export class RowFooter extends React.Component<RowFooterProperty, any>{
    constructor({props}: { props: Readonly<RowFooterProperty> }) {
        super(props);
    }
    render() {
        return undefined;
    }
}

