import React, {Children} from "react";
import {DataRow, PropsColumn, PropsTable} from "./PropsTable";
import {v4 as key} from 'uuid';
import {ColumnGroup} from "./ColumnGroup";
import {HeaderGroup} from "./HeaderGroup";

import {appendWidth} from "./utils";
import {RowFooter} from "../table";


type colGroupType = {
    className?: string;
    style?: React.CSSProperties | undefined,
    span?: number;
    id?: string;
}
type headerGroupType = {
    className?: string;
    style?: React.CSSProperties | undefined,
    colspan?: number;
    title?: string
    id?: string;
    eventKey?: string;
    onClick?: (eventKey?: string) => void
    width?: string
}
type rowFooter = {
    className?: string;
    style?: React.CSSProperties | undefined,
    listCell?: Array<cellFooter>
    useScrollContent:boolean
}
type cellFooter = {
    style?: React.CSSProperties | undefined,
    colspan?: number;
    className?: string;
    content?: string | React.ReactNode;
}


export class Table extends React.Component<PropsTable, any> {
    private listDataRows:Array<DataRow>=[]
    private indexClick: number = -1
    private indexSelect: number = -1
    private heightInner?: number
    private mapTotal = new Map<number, DataRow>()
    private refDivWrapper = React.createRef<HTMLDivElement>();
    private refDiwBody = React.createRef<HTMLDivElement>();
    private refDivHeader = React.createRef<HTMLDivElement>();
    private refDivCaption = React.createRef<HTMLDivElement>();
    private refDivFooter=React.createRef<HTMLDivElement>()
    private list: Array<PropsColumn> = []
    private listRowFooter: Array<rowFooter> = []
    private MapSelect = new Map<number, DataRow>()
    private listWidth: Array<string | number | undefined> = [];

    private id?: string;
    private listGroup: Array<colGroupType> = [];
    private listHeaderGroup: Array<headerGroupType> = [];
    private refBody = React.createRef<HTMLTableSectionElement>()
    private refTableBody = React.createRef<HTMLTableElement>();


    constructor({props}: { props: Readonly<PropsTable> }) {
        super(props);
        this.keyUp = this.keyUp.bind(this)



    }

    public GetListSelect() {
        return Array.from(this.MapSelect, ([value]) => ({value}));
    }

    private innerRender() {
        this.listRowFooter.length=0;
        this.list.length=0;
        this.listGroup.length=0
        this.listHeaderGroup.length=0
        this.mapTotal.clear()
        this.MapSelect.clear()
        if(this.listDataRows.length==0&&this.props.rowItems&&this.props.rowItems.length>0){
            this.listDataRows=this.props.rowItems
        }

        this.indexSelect = -1;
        this.indexClick = -1
        this.mapTotal.clear()
        if (!this.id)
            this.id = this.props.id ?? key()

        if (Children) {
            this.list = [];
            this.listGroup = [];
            this.listHeaderGroup = [];

            Children.forEach(this.props.children, (d) => {
                const element = d as React.ReactElement<any>

                if (element.type == RowFooter) {

                    const footer: rowFooter = {
                        useScrollContent:element.props.useScrollContent,
                        className: element.props.className,
                        style: element.props.style,
                        listCell: []
                    }
                    Children.map(element.props.children, (cell) => {
                        footer.listCell?.push({
                            className: cell.props.className,
                            style: cell.props.style,
                            colspan: cell.props.colspan,
                            content: cell.props.children
                        })
                    })
                    this.listRowFooter.push(footer)
                    return

                } else
                if (element.type === HeaderGroup) {
                    const header: headerGroupType = {
                        className: element.props.className,
                        style: element.props.style,
                        title: element.props.title,
                        id: element.props.id,
                        eventKey: element.props.eventKey,
                        onClick: element.props.onClick,
                        colspan: 0,
                    }
                    Children.map(element.props.children, (ff) => {
                        this.innerParserProps(ff, header);
                    })

                    if (header.colspan && header.colspan > 0) {
                        this.listHeaderGroup.push(header)
                    }

                } else {
                    const header = {
                        colspan: 0
                    }
                    this.innerParserProps(d, header);
                    for (let i = 0; i < header.colspan; i++) {
                        this.listHeaderGroup.push({
                            width: element.props.style?.width
                        })
                    }
                }
            })
        }
    }

    private innerParserProps(d: any, header?: headerGroupType) {

        const element = d as React.ReactElement<any>
        if (element.type === ColumnGroup) {
            Children.map(element.props.children, (col) => {
                this.list.push({
                    propertyName: col.props.propertyName,
                    style: col.props.style,
                    className: col.props.className,
                    children: col.props.children,
                })
            })
            this.listGroup.push({
                id: element.props.id,
                className: element.props.className,
                style: element.props.style,
                span: React.Children.count(element.props.children)
            })
            if (header) {
                header.width = appendWidth(header.width, element.props.style?.width)
                header.colspan! += React.Children.count(element.props.children);
            }
        } else {

            this.listGroup.push({})
            this.list!.push({
                propertyName: element.props.propertyName,
                style: element.props.style,
                className: element.props.className,
                children: element.props.children,
            })
            if (header) {// todo добавить стиль ширины
                header.width = appendWidth(header.width, element.props.style?.width)
                header.colspan! += 1;// React.Children.count((d as any).props.children);
            }

        }
    }

    private columnClick(propertyName: string, eventKey: string | undefined, eventTarget: HTMLTableHeaderCellElement) {

        if (this.props.onClickColumn) {
            this.props.onClickColumn(propertyName, eventTarget, eventKey,)
        }
    }


    public Refresh(callback?: () => void) {
        this.forceUpdate(() => {
            this.refreshHeight(callback)
        })
    }

    public SelectRowsById(id: string) {
        const d = document.getElementById(id)
        if (d) {
            d.classList.add(this.props.classNameSelection ?? 'row-select')
        }
    }

    public GetDataRowByIndex(index: number): DataRow | undefined {
        return this.mapTotal.get(index);
    }


    private renderItemRowProperty(props: DataRow, index: number) {
        this.mapTotal.set(index, this.props)

        const view = props.getView ? props.getView() : undefined


        return (

            <tr

                key={key()}
                id={props.id}
                className={props.className}
                style={props.style}
                title={props.title}
                onClick={(e) => {


                    this.indexClick = index
                    this.indexSelect = index
                    if (this.props.useRowSelection) {
                        if (!e.ctrlKey) {
                            document.querySelectorAll('[data-row-id]').forEach(r => {
                                this.MapSelect.clear()
                                r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                                r.classList.remove(this.props.classNameSelection ?? 'row-select')
                                if (r.getAttribute('data-row-id') === this.id + "_" + index) {
                                    r.classList.add(this.props.classNameSelection ?? 'row-select')
                                    this.MapSelect.set(index, props)

                                }
                            })
                        } else {
                            document.querySelectorAll('[data-row-id]').forEach(r => {
                                if (r.getAttribute('data-row-id') === this.id + "_" + index) {
                                    r.classList.add(this.props.classNameSelection ?? 'row-select')
                                    if (this.MapSelect.has(index)) {
                                        if (this.MapSelect.delete(index)) {
                                            r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                                            r.classList.remove(this.props.classNameSelection ?? 'row-select')
                                        }

                                    } else {
                                        this.MapSelect.set(index, props)
                                    }
                                }
                            })
                        }

                    }
                    if (props.onClick) {
                        props.onClick(props, e.currentTarget as HTMLTableRowElement)
                    } else {
                        if (this.props.onClickRow) {
                            this.props.onClickRow(props, e.currentTarget as HTMLTableRowElement)
                        }
                    }

                }}
                data-row-id={this.id + "_" + index}>
                {


                    this.list.map((c, indexD) => {
                        const w = this.listWidth[indexD]

                        if (c.propertyName === null || c.propertyName === undefined || c.propertyName.trim().length === 0) {
                            return <td onClick={(e) => {
                                this.cellClickE(c.propertyName, props, e.currentTarget)
                            }} data-propery-name={c.propertyName} style={{width: w}} key={key()}></td>
                        }
                        const ob = !view ? undefined : (view as any)[c.propertyName];

                        if (ob === undefined || ob === null) {
                            return <td onClick={(e) => {
                                this.cellClickE(c.propertyName, props, e.currentTarget)
                            }}
                                       data-propery-name={c.propertyName} style={{width: w}} key={key()}></td>
                        } else if (typeof ob === 'number') {
                            return <td onClick={(e) => {
                                this.cellClickE(c.propertyName, props, e.currentTarget)
                            }}
                                       data-propery-name={c.propertyName} style={{width: w}} key={key()}>{`${ob}`}</td>
                        } else if (typeof ob === 'function') {
                            return <td onClick={(e) => {
                                this.cellClickE(c.propertyName, props, e.currentTarget)
                            }}
                                       data-propery-name={c.propertyName} style={{width: w}} key={key()}>{ob()}</td>
                        } else {
                            return <td onClick={(e) => {
                                this.cellClickE(c.propertyName, props, e.currentTarget)
                            }}
                                       data-propery-name={c.propertyName} style={{width: w}} key={key()}>{ob}</td>
                        }


                    })
                }


            </tr>
        )
    }


    get height(): number | undefined {
        return this.heightInner;
    }

    set height(value) {
        this.heightInner = value;
        this.refreshHeight(()=>{
            this.forceUpdate()
        })

    }

    private refreshHeight(callback?:()=>void) {
        if (this.heightInner) {
            const w1 = this.refDivCaption.current?.offsetHeight ?? 0
            const w2 = this.refDivHeader.current!.offsetHeight
            const w3=  this.refDivFooter.current?.offsetHeight??0
            const tw = this.heightInner - w1 - w2-w3
            if (tw > 0) {
                this.refDiwBody.current!.style.height = tw + 'px'
            }

        }
        if(callback) callback()
    }

    componentDidMount() {
        this.heightInner = this.props.height

        this.updateHeightForScroll()
        this.refreshHeight()
        window.addEventListener('keydown', this.keyUp)
    }
    updateHeightForScroll(){
        let hs = this.refDiwBody.current!.offsetWidth - this.refDiwBody.current!.clientWidth;
        if (hs > 0) {
            this.refDivHeader.current!.style.marginRight = hs + 'px'
            if(this.refDivFooter.current){
                this.refDivFooter.current!.style.marginRight=hs+'px'
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyUp)
    }


    componentDidUpdate() {
        this.updateHeightForScroll()
    }

    validatePosition(t: number) {
        let top = this.refDiwBody.current!.scrollTop;
        let h = this.refDiwBody.current!.offsetHeight;
        if (t < top) {
            return 1
        }
        if (t > top + h) {
            return 3
        }
        return 2
    }

    keyUp(e: KeyboardEvent) {

        if(!this.props.useRowSelection) return;
        if (this.mapTotal.size === 0) return


        if (e.ctrlKey && e.key === 'Enter') {
            this.refBody.current?.rows[this.indexSelect].click()
        }

        if (e.ctrlKey && e.key === 'ArrowDown') {


            if (this.indexSelect < this.mapTotal.size - 1) {
                this.indexSelect = this.indexSelect + 1;
                document.querySelectorAll('[data-row-id]').forEach(r => {
                    r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                    if (r.getAttribute('data-row-id') === this.id + "_" + this.indexSelect) {
                        r.classList.add(this.props.classNameSelection ?? 'row-select-key')
                        let top = (r as HTMLTableRowElement).offsetTop
                        let hm = (r as HTMLTableRowElement).offsetHeight

                        switch (this.validatePosition(top + hm)) {
                            case 1: {
                                this.refDiwBody.current!.scrollTop = top;
                                break
                            }
                            case 2: {
                                break
                            }
                            case 3: {
                                const t = this.refDiwBody.current?.scrollTop
                                this.refDiwBody.current!.scrollTop = t! + hm;
                                break
                            }
                        }
                    }
                })
            }

            this.refBody.current?.click()
        }
        if (e.ctrlKey && e.key === 'ArrowUp') {
            this.refDivWrapper.current?.focus()
            if (this.indexSelect > 0) {
                this.indexSelect = this.indexSelect - 1;

                document.querySelectorAll('[data-row-id]').forEach(r => {
                    r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                    if (r.getAttribute('data-row-id') === this.id + "_" + this.indexSelect) {
                        r.classList.add(this.props.classNameSelection ?? 'row-select-key')
                        let top = (r as HTMLTableRowElement).offsetTop


                        switch (this.validatePosition(top)) {
                            case 1: {
                                this.refDiwBody.current!.scrollTop = top;
                                break
                            }
                            case 2: {
                                break
                            }
                            case 3: {
                                const t = this.refDiwBody.current?.scrollTop
                                this.refDiwBody.current!.scrollTop = t! + top;
                                break
                            }
                        }
                    }
                })
            }
            this.refBody.current?.click()
        }


    }


    private renderHeader(c: PropsColumn, index: number) {
        if (index === 0) {
            this.listWidth.length = 0
        }
        if (c.style && c.style.width) {
            this.listWidth.push(c.style.width)
        } else {
            this.listWidth.push(undefined)
        }

        return (
            <th
                data-column-index={index}
                onClick={(e) => {
                    this.columnClick(c.propertyName, c.eventKey, e.currentTarget as HTMLTableHeaderCellElement)
                }}
                key={key()}
                className={c.className}
                style={c.style}>{c.children}
            </th>
        )
    }

    private renderColumnGroup() {
        return <colgroup>
            {
                this.listGroup.map((col) => {
                    if (!col.span) {
                        return <col key={key()}/>
                    } else {
                        return <col key={key()} id={col.id} className={col.className} style={col.style}
                                    span={col.span}/>
                    }
                })

            }
        </colgroup>

    }

    renderHeaderGroup() {
        if (this.listHeaderGroup.length > 0) {
            if (this.listHeaderGroup.filter(a => a.colspan !== undefined).length > 0) {
                return <tr>
                    {
                        this.listHeaderGroup.map((g) => {
                            if (g.colspan) {
                                let style = g.style;
                                if (!style) {
                                    style = {width: g.width}
                                } else {
                                    if (!style.width) {
                                        style = {}
                                        Object.assign(style, g.style)
                                        style.width = g.width;
                                    }

                                }
                                return <th key={key()}

                                           onClick={() => {
                                               if (g.onClick) {
                                                   g.onClick(g.eventKey)
                                               }
                                           }}
                                           style={style}
                                    //style={g.style}
                                           className={g.className} id={g.id}
                                           colSpan={g.colspan}>{g.title} </th>
                            } else {
                                return <th key={key()} style={{width: g.width}}></th>
                            }
                        })
                    }

                </tr>
            }
        } else {
            return null;
        }

    }

    public ShowRowByIndexAndClick(index: number) {
        if (index < 0 || index > this.mapTotal.size - 1) return
        const r = this.refBody.current?.rows[index];
        if (r) {
            const t = r.offsetTop
            const h = this.refDiwBody.current!.offsetHeight;
            this.refDiwBody.current!.scrollTop = t - h / 2
            r.click()
        }
    }

    public GetItemsRow() {
        return this.listDataRows;
    }
    public SetItemsRow(list:Array<DataRow>,callback?:()=>void){
        this.listDataRows=list;
        this.Refresh(callback)
    }



    render() {
        this.innerRender()
        return (
            <div style={this.props.style} id={this.props.id} ref={this.refDivWrapper} className={this.props.className??'tbl-wrapper'}>
                {!this.props.caption ? null : (
                    <div className={'tb-caption'} style={this.props.styleCaption} ref={this.refDivCaption}>
                        {
                            this.props.caption
                        }
                    </div>


                )}
                <div className={'tbl-header'} ref={this.refDivHeader}>
                    <table style={this.props.styleHeader} ref={this.refTableBody}>
                        <thead>
                        {
                            this.renderHeaderGroup()
                        }
                        <tr>
                            {
                                this.list.map((c, index) => {
                                    return this.renderHeader(c, index)
                                })
                            }
                        </tr>
                        </thead>
                    </table>
                </div>
                <div className={'tbl-content'} ref={this.refDiwBody}>
                    <table className={'tbl-content-core'}

                        style={this.props.styleBody}>
                        {
                            this.renderColumnGroup()
                        }
                        <thead/>
                        <tbody ref={this.refBody}>

                        {

                            this.listDataRows?.map((row, index) => {

                                return this.renderItemRowProperty(row, index)

                            })
                        }

                        </tbody>
                        {
                            this.renderFootScroll()
                        }
                    </table>
                </div>
                {
                    this.renderFootNoScroll()
                }


            </div>


        )

    }
    private renderFootScroll(ignored?:boolean){
        function getContent(c:any){
            if(typeof c ==="function"){
                return c();
            }
            return c
        }

        const res= <tfoot>
        {
            this.listRowFooter.map(r => {
                return (
                    <tr key={key()} className={r.className} style={r.style}>
                        {
                            r.listCell?.map(c => {
                                return <td
                                    key={key()}
                                    colSpan={c.colspan}
                                    className={c.className}
                                    style={c.style}>
                                    {getContent(c.content)}
                                </td>
                            })
                        }
                    </tr>
                )
            })
        }
        </tfoot>
        if(ignored){
            return  res;
        }else {
            if(this.listRowFooter.length>0&&this.listRowFooter[0].useScrollContent){
                return res;
            }else {
                return null;
            }
        }


    }
    private renderFootNoScroll(){
        if(this.listRowFooter.length>0&&!this.listRowFooter[0].useScrollContent){
            return (
                <div ref={this.refDivFooter} className={'tbl-footer'}>
                    <table>
                        <tbody>
                        <tr style={{visibility:"collapse"}}>
                            {
                                this.listWidth.map((col) => {
                                    return <td key={key()} style={{width:col}}/>
                                })
                            }
                        </tr>
                        </tbody>

                        {
                            this.renderFootScroll(true)
                        }
                    </table>
                </div>
            )
        }
        return null;

    }

    private cellClickE(propertyName: string, props: DataRow, target: EventTarget) {
        if (this.props.onClickCell) {
            this.props.onClickCell(propertyName, props, target)
        }
    }

}