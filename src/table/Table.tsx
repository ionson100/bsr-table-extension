import React, {Children} from "react";
import {DataRow, PropsColumn, PropsTable} from "./PropsTable";
import {v4 as key} from 'uuid';
import {ColumnGroup} from "./ColumnGroup";
import {HeaderGroup} from "./HeaderGroup";

import {appendWidth} from "./utils";


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


export class Table extends React.Component<PropsTable, any> {
    private indexClick:number=-1
    private indexSelect:number=-1
    private heightInner?: number
    private mapTotal=new Map<number,DataRow>()
    private refDivWrapper = React.createRef<HTMLDivElement>();
    private refDiwBody = React.createRef<HTMLDivElement>();
    private refDivHeader = React.createRef<HTMLDivElement>();
    private refDivCaption = React.createRef<HTMLDivElement>();
    private list: Array<PropsColumn> = []
    private MapSelect = new Map<number, DataRow>()
    private listWidth: Array<string | number | undefined> = [];

    private id?: string;
    private listGroup: Array<colGroupType> = [];
    private listHeaderGroup: Array<headerGroupType> = [];
    private refBody = React.createRef<HTMLTableSectionElement>()


    constructor({props}: { props: Readonly<PropsTable> }) {
        super(props);


    }

    public GetListSelect() {
        return Array.from(this.MapSelect, ([value]) => ({value}));
    }

    private innerRender() {
        this.mapTotal.clear()
        if (!this.id)
            this.id = this.props.id ?? key()

        if (Children) {
            this.list = [];
            this.listGroup = [];
            this.listHeaderGroup = [];
            Children.map(this.props.children, (d) => {
                const element = d as React.ReactElement<any>
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

        this.forceUpdate(()=>{
            this.refreshHeight()
            if(callback){
                callback()
            }
        })

    }

    public SelectRowsById(id: string) {
        const d = document.getElementById(id)
        if (d) {
            d.classList.add(this.props.classNameSelection ?? 'row-select')
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


                    if (this.props.useRowSelection) {
                        if (!e.ctrlKey) {
                            document.querySelectorAll('[data-row-id]').forEach(r => {
                                this.MapSelect.clear()
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
                                            r.classList.remove(this.props.classNameSelection ?? 'row-select')
                                        }

                                    } else {
                                        this.MapSelect.set(index, props)
                                    }
                                }
                            })
                        }

                    }
                    if(props.onClick){
                        props.onClick(props,e.currentTarget as HTMLTableRowElement)
                    }else {
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
        this.refreshHeight()
        this.forceUpdate()
    }

    private refreshHeight() {
        if (this.heightInner) {
            const w1 = this.refDivCaption.current?.offsetHeight ?? 0
            const w2 = this.refDivHeader.current!.offsetHeight
            const tw = this.heightInner - w1 - w2
            if (tw > 0) {
                this.refDiwBody.current!.style.height = tw + 'px'
            }

        }
    }

    componentDidMount() {
        this.heightInner = this.props.height
        let hs = this.refDiwBody.current!.offsetWidth - this.refDiwBody.current!.clientWidth;
        if (hs > 0) {
            this.refDivHeader.current!.style.marginRight = hs + 'px'
        }
        this.refreshHeight()
    }

    componentDidUpdate() {
        let hs = this.refDiwBody.current!.offsetWidth - this.refDiwBody.current!.clientWidth;
        if (hs > 0) {
            this.refDivHeader.current!.style.marginRight = hs + 'px'
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
                this.listGroup.map((col, index) => {
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
                        this.listHeaderGroup.map((g, index) => {
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
                                return <th key={'c7' + index}

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
                                return <th style={{width: g.width}}></th>
                            }
                        })
                    }

                </tr>
            }
        } else {
            return null;
        }

    }

    render() {
        this.innerRender()
        return (
            <div style={this.props.style} id={this.props.id} ref={this.refDivWrapper} className={this.props.className}>
                {!this.props.caption ? null : (
                    <div className={'tb-caption'} style={this.props.styleCaption} ref={this.refDivCaption}>
                        {
                            this.props.caption
                        }
                    </div>


                )}
                <div className={'tbl-header'} ref={this.refDivHeader}>
                    <table style={this.props.styleHeader}>

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
                    <table style={this.props.styleBody}>
                        {
                            this.renderColumnGroup()
                        }
                        <thead/>
                        <tbody ref={this.refBody}>

                        {

                            this.props.rowItems?.map((row, index) => {

                                return this.renderItemRowProperty(row, index)

                            })
                        }
                        </tbody>
                    </table>
                </div>


            </div>


        )

    }

    private cellClickE(propertyName: string, props: DataRow, target: EventTarget) {


        if (this.props.onClickCell) {
            this.props.onClickCell(propertyName, props, target)
        }


    }
}