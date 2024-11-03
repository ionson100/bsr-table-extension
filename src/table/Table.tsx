import React, {Children} from "react";
import {DataRow, PropsColumn, PropsTable} from "./PropsTable";
import {v4 as key} from 'uuid';
import {ColumnGroup} from "./ColumnGroup";
import {HeaderGroup} from "./HeaderGroup";

import {appendWidth} from "./utils";
import {RowFooter} from "./RowFooter";


type colGroupType = {
    className?: string;
    style?: React.CSSProperties | undefined,

}
type headerGroupType = {
    className?: string;
    style?: React.CSSProperties | undefined,
    colspan?: number;
    caption?: string
    id?: string;
    eventKey?: string;
    onClick?: (eventKey?: string) => void
    width?: string
}
type rowFooter = {
    className?: string;
    style?: React.CSSProperties | undefined,
    listCell?: Array<cellFooter>
    useScrollContent: boolean
}
type cellFooter = {
    style?: React.CSSProperties | undefined,
    colspan?: number;
    className?: string;
    content?: string | React.ReactNode;
}


export class Table extends React.Component<PropsTable, any> {
    private shiftKey = -1
    private deleteUp = false;
    private deleteDown = false

    private listDataRows: Array<DataRow> = []

    private indexSelect: number = -1
    private heightInner?: number
    private mapTotal = new Map<number, DataRow>()
    private refDivWrapper = React.createRef<HTMLDivElement>();
    private refDivBody = React.createRef<HTMLDivElement>();
    private refDivHeader = React.createRef<HTMLDivElement>();
    private refDivCaption = React.createRef<HTMLDivElement>();
    private refDivFooter = React.createRef<HTMLDivElement>()
    private list: Array<PropsColumn> = []
    private listRowFooter: Array<rowFooter> = []
    private MapSelect = new Map<number, DataRow>()
    private listWidth: Array<string | number | undefined> = [];

    private id?: string;
    private listGroup: Array<colGroupType | undefined> = [];
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
        this.listRowFooter.length = 0;
        this.list.length = 0;
        this.listGroup.length = 0
        this.listHeaderGroup.length = 0
        this.mapTotal.clear()
        this.MapSelect.clear()
        if (this.listDataRows.length === 0 && this.props.rowItems && this.props.rowItems.length > 0) {
            this.listDataRows = this.props.rowItems
        }


        this.indexSelect = -1;
        this.mapTotal.clear()
        if (!this.id)
            this.id = this.props.id ?? key()

        if (Children) {
            this.list = [];
            this.listGroup = [];
            this.listHeaderGroup = [];

            Children.forEach(this.props.children, (d) => {
                const element = d as React.ReactElement

                if (element.type === RowFooter) {

                    const footer: rowFooter = {
                        useScrollContent: element.props.useScrollContent,
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

                } else if (element.type === HeaderGroup) {
                    const header: headerGroupType = {
                        className: element.props.className,
                        style: element.props.style,
                        caption: element.props.caption,
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

        const element = d as React.ReactElement
        if (element.type === ColumnGroup) {
            Children.map(element.props.children, (col) => {
                this.list.push({
                    nameProperty: col.props.nameProperty,
                    style: col.props.style,
                    className: col.props.className,
                    children: col.props.children,
                })
            })
            Children.map(element.props.children, (col) => {
                this.listGroup.push({
                    className: element.props.className,
                    style: element.props.style,
                })
            })

            if (header) {
                header.width = appendWidth(header.width, element.props.style?.width)
                header.colspan! += React.Children.count(element.props.children);
            }
        } else {

            this.listGroup.push(undefined)
            this.list!.push({
                nameProperty: element.props.nameProperty,
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

    private columnClick(nameProperty: string, eventKey: string | undefined, eventTarget: EventTarget) {

        if (this.props.onClickColumn) {
            this.props.onClickColumn(nameProperty, eventTarget, eventKey,)
        }
    }


    public Refresh(callback?: () => void) {
        this.forceUpdate(() => {
            this.refreshHeight(callback)
        })
    }


    public GetDataRowByIndex(index: number): DataRow | undefined {
        return this.mapTotal.get(index);
    }


    onSelect() {
        if (this.props.onSelect) {
            this.props.onSelect(this.MapSelect)
        }
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


                    this.indexSelect = index
                    if (this.props.useRowSelection) {
                        if (e.shiftKey) {


                            if (this.shiftKey === -1) {
                                this.MapSelect.clear()
                                this.refDivBody.current!.querySelectorAll('[data-row-index]').forEach(r => {

                                    r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                                    r.classList.remove(this.props.classNameSelection ?? 'row-select')
                                    if (r.getAttribute('data-row-index') === index + "") {
                                        r.classList.add(this.props.classNameSelection ?? 'row-select')
                                        this.MapSelect.set(index, props)
                                        this.deleteUp = false;

                                    }
                                    this.onSelect()
                                })
                                this.shiftKey = index;
                            } else {

                                let start = 0;
                                let finish = 0;
                                if (index > this.shiftKey) {
                                    start = this.shiftKey
                                    finish = index

                                }
                                if (this.shiftKey > index) {
                                    start = index
                                    finish = this.shiftKey;

                                }


                                this.MapSelect.clear()
                                if (start === finish) return
                                this.refDivBody.current!.querySelectorAll('[data-row-index]').forEach(r => {
                                    r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                                    r.classList.remove(this.props.classNameSelection ?? 'row-select')
                                    const d = parseInt(r.getAttribute('data-row-index')!)
                                    if (d >= start && d <= finish) {
                                        r.classList.add(this.props.classNameSelection ?? 'row-select')
                                        this.MapSelect.set(d, props)
                                        this.deleteUp = false

                                    }


                                })
                                this.onSelect()
                                this.shiftKey = -1


                            }
                            const d = getSelection()
                            if (d) {
                                d.removeAllRanges()
                            }
                            return false


                        }
                        if (!e.ctrlKey) {
                            this.shiftKey = index;
                            this.MapSelect.clear()
                            this.refDivBody.current!.querySelectorAll('[data-row-index]').forEach(r => {

                                r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                                r.classList.remove(this.props.classNameSelection ?? 'row-select')
                                if (r.getAttribute('data-row-index') === "" + index) {
                                    r.classList.add(this.props.classNameSelection ?? 'row-select')
                                    this.MapSelect.set(index, props)

                                }

                            })
                            //this.onSelect() click
                        } else {
                            this.shiftKey = index
                            this.refDivBody.current!.querySelectorAll('[data-row-index]').forEach(r => {
                                if (r.getAttribute('data-row-index') === "" + index) {
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
                            this.onSelect()
                        }

                    }
                    this.deleteDown = false;
                    this.deleteUp = false;
                    if (props.onClick) {
                        props.onClick(props, e.currentTarget as HTMLTableRowElement)
                    } else {
                        if (this.props.onClickRow) {
                            this.props.onClickRow(props, e.currentTarget as HTMLTableRowElement)
                        }
                    }


                }}
                data-row-index={index}>
                {


                    this.list.map((c, indexD) => {
                        const w = this.listWidth[indexD]
                        let styleGroup = this.listGroup[indexD]?.style
                        if(!styleGroup){
                            styleGroup={width:w}
                        }else {

                                styleGroup = {}
                                Object.assign(styleGroup, this.listGroup[indexD]?.style)
                                styleGroup.width = w;

                        }

                        const classGroup = this.listGroup[indexD]?.className

                        if (c.nameProperty === null || c.nameProperty === undefined || c.nameProperty.trim().length === 0) {
                            return <td className={classGroup} onClick={(e) => {
                                this.cellClickE(c.nameProperty, props, e.currentTarget)
                            }} data-property-name={c.nameProperty} style={styleGroup} key={key()}></td>
                        }
                        const ob = !view ? undefined : (view as any)[c.nameProperty];

                        if (ob === undefined || ob === null) {
                            return <td className={classGroup} onClick={(e) => {
                                this.cellClickE(c.nameProperty, props, e.currentTarget)
                            }}
                                       data-property-name={c.nameProperty} style={styleGroup} key={key()}></td>
                        } else if (typeof ob === 'number') {
                            return <td className={classGroup} onClick={(e) => {
                                this.cellClickE(c.nameProperty, props, e.currentTarget)
                            }}
                                       data-property-name={c.nameProperty} style={styleGroup} key={key()}>{`${ob}`}</td>
                        } else if (typeof ob === 'function') {
                            return <td className={classGroup} onClick={(e) => {
                                this.cellClickE(c.nameProperty, props, e.currentTarget)
                            }}
                                       data-property-name={c.nameProperty} style={styleGroup} key={key()}>{ob()}</td>
                        } else {
                            return <td className={classGroup} onClick={(e) => {
                                this.cellClickE(c.nameProperty, props, e.currentTarget)
                            }}
                                       data-property-name={c.nameProperty} style={styleGroup} key={key()}>{ob}</td>
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
        this.refreshHeight(() => {
            this.forceUpdate()
        })

    }

    private refreshHeight(callback?: () => void) {
        if (this.heightInner) {
            const w1 = this.refDivCaption.current?.offsetHeight ?? 0
            const w2 = this.refDivHeader.current!.offsetHeight
            const w3 = this.refDivFooter.current?.offsetHeight ?? 0
            const tw = this.heightInner - w1 - w2 - w3
            if (tw > 0) {
                this.refDivBody.current!.style.height = tw + 'px'
            }

        } else {
            this.refDivBody.current!.removeAttribute('style')
            this.refDivHeader.current!.removeAttribute('style')
            this.refDivFooter.current?.removeAttribute('style')
        }
        if (callback) callback()
    }

    componentDidMount() {
        this.heightInner = this.props.height

        this.updateHeightForScroll()
        this.refreshHeight()
        window.addEventListener('keydown', this.keyUp)
    }

    updateHeightForScroll() {
        setTimeout(() => {
            let hs = this.refDivBody.current!.offsetWidth - this.refDivBody.current!.clientWidth;
            if (hs > 0) {
                this.refDivHeader.current!.style.marginRight = hs + 'px'
                if (this.refDivFooter.current) {
                    this.refDivFooter.current!.style.marginRight = hs + 'px'
                }
            } else {
                this.refDivHeader.current!.removeAttribute('style')
                this.refDivFooter.current?.removeAttribute('style')
            }
        }, 100)

    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.keyUp)
    }


    componentDidUpdate() {
        this.updateHeightForScroll()
    }

    validatePosition(t: number) {
        let top = this.refDivBody.current!.scrollTop;
        let h = this.refDivBody.current!.offsetHeight;
        if (t < top) {
            return 1
        }
        if (t > top + h) {
            return 3
        }
        return 2
    }

    keyUp(e: KeyboardEvent) {

        if (!this.props.useRowSelection) return;
        if (this.mapTotal.size === 0) return


        if (e.ctrlKey && e.key === 'Enter') {
            this.refBody.current?.rows[this.indexSelect].click()
        }
        if (e.shiftKey && e.key === "ArrowUp") {
            if (this.indexSelect > 0) {
                this.deleteDown = true
                let oldIndex = this.indexSelect;
                this.indexSelect = this.indexSelect - 1;

                if (this.deleteUp) {
                    if (this.MapSelect.has(oldIndex)) {
                        if (this.MapSelect.size > 2) {
                            const el = this.refDivBody.current!.querySelector('[data-row-index="' + oldIndex + '"]');
                            if (el) {
                                el.classList.remove(this.props.classNameSelection ?? 'row-select')
                                this.MapSelect.delete(oldIndex)
                                this.onSelect()
                            }
                        } else {
                            this.deleteUp = false
                        }
                    }


                } else {
                    const el = this.refDivBody.current!.querySelector('[data-row-index="' + this.indexSelect + '"]');
                    if (el) {
                        el.classList.add(this.props.classNameSelection ?? 'row-select')
                        this.MapSelect.set(this.indexSelect, this.listDataRows[this.indexSelect])
                        this.onSelect()
                    }
                }

            }
        }

        if (e.shiftKey && e.key === "ArrowDown") {

            if (this.indexSelect < this.mapTotal.size - 1) {
                this.deleteUp = true;
                let oldIndex = this.indexSelect;
                this.indexSelect = this.indexSelect + 1;
                if (this.deleteDown) {

                    if (this.MapSelect.has(oldIndex)) {
                        if (this.MapSelect.size > 2) {
                            const el = this.refDivBody.current!.querySelector('[data-row-index="' + oldIndex + '"]');
                            if (el) {
                                el.classList.remove(this.props.classNameSelection ?? 'row-select')
                                this.MapSelect.delete(oldIndex)
                                this.onSelect()
                            }
                        } else {
                            this.deleteDown = false
                        }
                    }

                } else {

                    const el = this.refDivBody.current!.querySelector('[data-row-index="' + this.indexSelect + '"]');
                    if (el) {
                        el.classList.add(this.props.classNameSelection ?? 'row-select')
                        this.MapSelect.set(this.indexSelect, this.listDataRows[this.indexSelect])
                        this.onSelect()

                    }
                }

            }
        }

        if (e.ctrlKey && e.key === 'ArrowDown') {


            if (this.indexSelect < this.mapTotal.size - 1) {
                this.deleteUp = false;
                this.indexSelect = this.indexSelect + 1;
                this.refDivBody.current!.querySelectorAll('[data-row-index]').forEach(r => {
                    r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                    if (r.getAttribute('data-row-index') === "" + this.indexSelect) {
                        r.classList.add(this.props.classNameSelection ?? 'row-select-key')
                        let top = (r as HTMLTableRowElement).offsetTop
                        let hm = (r as HTMLTableRowElement).offsetHeight

                        switch (this.validatePosition(top + hm)) {
                            case 1: {
                                this.refDivBody.current!.scrollTop = top;
                                break
                            }
                            case 2: {
                                break
                            }
                            case 3: {
                                const t = this.refDivBody.current?.scrollTop
                                this.refDivBody.current!.scrollTop = t! + hm;
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
                this.deleteUp = false
                this.indexSelect = this.indexSelect - 1;

                this.refDivBody.current!.querySelectorAll('[data-row-index]').forEach(r => {
                    r.classList.remove(this.props.classNameSelection ?? 'row-select-key')
                    if (r.getAttribute('data-row-index') === "" + this.indexSelect) {
                        r.classList.add(this.props.classNameSelection ?? 'row-select-key')
                        let top = (r as HTMLTableRowElement).offsetTop


                        switch (this.validatePosition(top)) {
                            case 1: {
                                this.refDivBody.current!.scrollTop = top;
                                break
                            }
                            case 2: {
                                break
                            }
                            case 3: {
                                const t = this.refDivBody.current?.scrollTop
                                this.refDivBody.current!.scrollTop = t! + top;
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
                    this.columnClick(c.nameProperty, c.eventKey, e.currentTarget)
                }}
                key={key()}
                className={c.className}
                style={c.style}>{c.children}
            </th>
        )
    }



    private renderHeaderGroup() {
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
                                           colSpan={g.colspan}>{g.caption} </th>
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
            const h = this.refDivBody.current!.offsetHeight;
            this.refDivBody.current!.scrollTop = t - h / 2
            r.click()
        }
    }

    public GetItemsRow() {
        return this.listDataRows;
    }

    public SetItemsRow(list: Array<DataRow>, callback?: () => void) {
        this.listDataRows = list;
        this.Refresh(callback)
    }


    render() {
        this.innerRender()
        return (
            <div data-host-table={1} style={this.props.style} id={this.props.id} ref={this.refDivWrapper}
                 className={this.props.className ?? 'tbl-wrapper'}>
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

                <div className={'tbl-content'} ref={this.refDivBody}>
                    <table style={this.props.styleBody}>

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

    private renderFootScroll(ignored?: boolean) {
        function getContent(c: any) {
            if (typeof c === "function") {
                return c();
            }
            return c
        }

        const res = <tfoot>
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
        if (ignored) {
            return res;
        } else {
            if (this.listRowFooter.length > 0 && this.listRowFooter[0].useScrollContent) {
                return res;
            } else {
                return null;
            }
        }


    }

    private renderFootNoScroll() {
        if (this.listRowFooter.length > 0 && !this.listRowFooter[0].useScrollContent) {
            return (
                <div ref={this.refDivFooter} className={'tbl-footer'}>
                    <table>
                        <tbody>
                        <tr style={{visibility: "collapse"}}>
                            {
                                this.listWidth.map((col) => {
                                    return <td key={key()} style={{width: col}}/>
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

    private cellClickE(nameProperty: string, props: DataRow, target: EventTarget) {
        if (this.props.onClickCell) {
            this.props.onClickCell(nameProperty, props, target)
        }
    }

}