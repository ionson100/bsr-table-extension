import React, { ReactElement } from 'react';

declare class Column extends React.Component<PropsColumn, any> {
    constructor({ props }: {
        props: Readonly<PropsColumn>;
    });
    render(): undefined;
}

declare class HeaderGroup extends React.Component<PropsHeaderGroups, any> {
    constructor({ props }: {
        props: Readonly<PropsHeaderGroups>;
    });
    render(): undefined;
}

declare class ColumnGroup extends React.Component<PropsColumnGroups, any> {
    constructor({ props }: {
        props: Readonly<PropsColumnGroups>;
    });
    render(): undefined;
}

declare class CellFooter extends React.Component<CellFooterProperty, any> {
    constructor({ props }: {
        props: Readonly<CellFooterProperty>;
    });
    render(): undefined;
}

declare class RowFooter extends React.Component<RowFooterProperty, any> {
    constructor({ props }: {
        props: Readonly<RowFooterProperty>;
    });
    render(): undefined;
}

declare class DataRow<T = any, V = any> {
    title?: string;
    style?: React.CSSProperties | undefined;
    className?: string;
    onClick?: (dataRow: DataRow, target: EventTarget) => void;
    id?: string;
    tag?: T;
    getView?: () => V;
}
type PropsTable = {
    height?: number;
    className?: string;
    style?: React.CSSProperties | undefined;
    styleHeader?: React.CSSProperties | undefined;
    styleBody?: React.CSSProperties | undefined;
    styleCaption?: React.CSSProperties | undefined;
    id?: string;
    caption?: string | ReactElement;
    children?: ReactElement<Column> | ReactElement<HeaderGroup> | ReactElement<ColumnGroup> | ReactElement<RowFooter> | ReactElement<Column>[] | ReactElement<HeaderGroup>[] | ReactElement<ColumnGroup>[] | ReactElement<RowFooter>[];
    rowItems?: Array<DataRow>;
    onClickRow?: (dataRow: DataRow, e: HTMLTableRowElement) => void;
    onClickColumn?: (nameProperty: string, eventTarget: EventTarget, eventKey?: string) => void;
    onClickCell?: (nameProperty: string, props: DataRow, target: EventTarget) => void;
    useInnerHTML?: boolean;
    useRowSelection?: boolean;
    classNameSelection?: string;
    onSelect?: (map: Map<number, DataRow>) => void;
};
type PropsColumn = {
    colspan?: number;
    nameProperty: string;
    className?: string;
    eventKey?: string;
    style?: React.CSSProperties | undefined;
    children?: string | React.ReactNode;
};
type PropsColumnGroups = {
    id?: string;
    className?: string;
    style?: React.CSSProperties | undefined;
    children?: ReactElement<Column> | ReactElement<Column>[];
};
type PropsHeaderGroups = {
    id?: string;
    caption?: string | ReactElement;
    className?: string;
    style?: React.CSSProperties | undefined;
    children?: ReactElement<Column> | ReactElement<Column>[] | ReactElement<ColumnGroup> | ReactElement<ColumnGroup>[];
    eventKey?: string;
    onClick?: (eventKey?: string) => void;
};
type CellFooterProperty = {
    colspan?: number;
    className?: string;
    style?: React.CSSProperties | undefined;
    children?: any;
};
type RowFooterProperty = {
    useScrollContent?: boolean;
    className?: string;
    style?: React.CSSProperties | undefined;
    children?: ReactElement<CellFooter> | ReactElement<CellFooter>[];
};

declare class Table extends React.Component<PropsTable, any> {
    private shiftKey;
    private deleteUp;
    private deleteDown;
    private listDataRows;
    private indexSelect;
    private heightInner?;
    private mapTotal;
    private refDivWrapper;
    private refDiwBody;
    private refDivHeader;
    private refDivCaption;
    private refDivFooter;
    private list;
    private listRowFooter;
    private MapSelect;
    private listWidth;
    private id?;
    private listGroup;
    private listHeaderGroup;
    private refBody;
    private refTableBody;
    constructor({ props }: {
        props: Readonly<PropsTable>;
    });
    GetListSelect(): {
        value: number;
    }[];
    private innerRender;
    private innerParserProps;
    private columnClick;
    Refresh(callback?: () => void): void;
    GetDataRowByIndex(index: number): DataRow | undefined;
    onSelect(): void;
    private renderItemRowProperty;
    get height(): number | undefined;
    set height(value: number | undefined);
    private refreshHeight;
    componentDidMount(): void;
    updateHeightForScroll(): void;
    componentWillUnmount(): void;
    componentDidUpdate(): void;
    validatePosition(t: number): 1 | 3 | 2;
    keyUp(e: KeyboardEvent): void;
    private renderHeader;
    private renderColumnGroup;
    renderHeaderGroup(): React.JSX.Element | null | undefined;
    ShowRowByIndexAndClick(index: number): void;
    GetItemsRow(): DataRow<any, any>[];
    SetItemsRow(list: Array<DataRow>, callback?: () => void): void;
    render(): React.JSX.Element;
    private renderFootScroll;
    private renderFootNoScroll;
    private cellClickE;
}

export { CellFooter, Column, ColumnGroup, DataRow, HeaderGroup, type PropsColumn, type PropsTable, RowFooter, Table };
