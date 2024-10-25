import React, {Children} from "react";
import {DataRow, PropsColumn, PropsTable} from "./PropsTable";
import {v4 as key} from 'uuid';
import {ColumnGroup} from "./ColumnGroup";
import {HeaderGroup} from "./HeaderGroup";


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
}
type Widther = {
    percent?: number;
    pixel?: number;
}


export class Table<T = any> extends React.Component<PropsTable<T>, any> {
    private list: Array<PropsColumn> = []
    private MapSelect = new Map<number, DataRow>()
    private listWithder?: Array<Widther> = undefined
    private id?: string;
    private listGroup: Array<colGroupType> = [];
    private listHeaderGroup: Array<headerGroupType> = [];
    private refBody = React.createRef<HTMLTableSectionElement>()
    private refRowBody = React.createRef<HTMLTableRowElement>()


    constructor({props}: { props: Readonly<PropsTable<T>> }) {
        super(props);
        this.cellClick = this.cellClick.bind(this)

    }

    private innerRender() {
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
                        colspan: 0
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
                        this.listHeaderGroup.push({})
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
                    propertyName: col.propertyName,
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
            if (header) {
                header.colspan! += 1;// React.Children.count((d as any).props.children);
            }
        }
    }

    private columnClick(column: number, propertyName: string) {

        if (this.props.onClickColumn) {
            this.props.onClickColumn(this.id!, column, propertyName)
        }
    }

    private cellClick(row: number, column: number) {
        if (this.props.onClickCell) {
            this.props.onClickCell(this.id!, row, column)
        }
    }

    public Refresh(callback?: () => void) {
        this.forceUpdate(() => {
            this.resize()
        })
        setTimeout(() => {

        })
    }

    private renderHeaderGroup() {

        if (this.listHeaderGroup.length > 0) {
            if (this.listHeaderGroup.filter(a => a.colspan !== undefined).length > 0) {
                return <tr>
                    {
                        this.listHeaderGroup.map((g, index) => {
                            if (g.colspan) {
                                return <th key={key()}
                                           onClick={() => {
                                               if (g.onClick) {
                                                   g.onClick(g.eventKey)
                                               }
                                           }}
                                           style={g.style} className={g.className} id={g.id}
                                           colSpan={g.colspan}>{g.title} </th>
                            } else {
                                return <th></th>
                            }
                        })
                    }

                </tr>
            }
        } else {
            return null;
        }

    }


    private renderItemRowProperty(props: DataRow<T>, index: number) {

        const rowCells = props.item


        return (

            <tr

                key={key()}
                id={props.id}
                className={props.className}
                style={props.style}
                title={props.title}
                color={props.color}
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

                    if (this.props.onClickRow) {
                        this.props.onClickRow(props, e.currentTarget as HTMLTableRowElement)
                    }


                    if (props.onClick) {
                        props.onClick(props, e.currentTarget as HTMLTableRowElement)
                    }
                }}
                data-row-id={this.id + "_" + index}>
                {

                    this.list.map((c, indexD) => {
                        let w = this.listWithder ? this.listWithder[indexD].pixel : undefined

                        if (c.propertyName === null || c.propertyName === undefined || c.propertyName.trim().length == 0) {
                            return <td data-propery-name={c.propertyName} style={{width: w}} key={key()}></td>
                        }
                        const ob = !rowCells ? undefined : (rowCells as any)[c.propertyName];

                        if(c.propertyName==='age')
                        console.log('33333333'+typeof ob +"  "+ob)
                        if (ob===undefined||ob===null) {
                            return <td data-propery-name={c.propertyName} style={{width: w}} key={key()}></td>
                        } else if (typeof ob === 'number') {
                            return <td data-propery-name={c.propertyName} style={{width: w}} key={key()}>{`${ob}`}</td>
                        } else if (typeof ob === 'function') {
                            return <td data-propery-name={c.propertyName} style={{width: w}} key={key()}>{ob()}</td>
                        } else {
                            return <td data-propery-name={c.propertyName} style={{width: w}} key={key()}>{ob}</td>
                        }


                    })
                }


            </tr>
        )
    }


    private renderTd(row: DataRow<T>, index: number) {

        return this.renderItemRowProperty(row, index)

    }

    componentDidMount() {
        this.resize()
        const THIS = this;
        this.refBody.current!.addEventListener('resize', function (event) {
            THIS.resize()
        }, true);
        //alert(this.refBody.current?.offsetWidth)
    }

    resize() {
        if (!this.refRowBody.current) return
        let tot = 0;
        let countFree = 0;
        this.listWithder = []
        this.list.forEach((c, index) => {
            const w: Widther = {
                percent: undefined,
                pixel: undefined
            }
            if (c.style && c.style.width) {
                if (c.style.width.toString().includes("%")) {
                    w.percent = parseInt(c.style.width.toString().replace("%", ""))
                } else {
                    const h = this.refRowBody.current!.querySelector('[data-column-index="' + index + '"]');
                    if (h) {
                        w.pixel = (h as HTMLElement).offsetWidth
                        tot = tot + w.pixel;
                    }

                }
            }
            if (!w.pixel && !w.percent) {
                countFree++
            }

            this.listWithder!.push(w)
        })
        let wTotal = this.refBody.current!.offsetWidth - tot;
        this.listWithder.forEach(r => {
            if (r.percent) {
                r.pixel = Math.floor(wTotal / 100 * r.percent);
            }
        })

        tot = 0;
        this.listWithder.forEach(r => {
            if (r.pixel) {
                tot = tot + r.pixel;
            }
        })


        let hs = this.refBody.current!.offsetWidth - this.refBody.current!.clientWidth;


        let wReal = Math.floor((this.refBody.current!.offsetWidth - hs * 2 - tot) / countFree);

        if (countFree === 0 && Math.abs(this.refBody.current!.offsetWidth - tot) < 3 && hs > 0) {
            console.log('countFree:' + countFree)
            console.log('hs:' + hs)
            console.log('offsetWidth:' + this.refBody.current!.offsetWidth)
            console.log("tot:" + tot)
            console.log("eReal:" + wReal)
            tot = 0;
            for (let i = 0; i < this.listWithder.length - 1; i++) {
                tot = tot + this.listWithder[i].pixel!
            }
            this.listWithder[this.listWithder.length - 1].pixel = Math.floor((this.refBody.current!.offsetWidth - hs * 2 - tot))

        } else {
            this.listWithder!.forEach(r => {
                if (!r.pixel && !r.percent) {
                    r.pixel = wReal;
                }
            })
        }
        //validate
        tot = 0;
        this.listWithder.forEach(r => {
            const t = tot + r.pixel!;
            if (t + 3 > this.refBody.current!.offsetWidth) {

            }

        })


        // console.log(this.listWithder)
        this.forceUpdate(() => {
            this.listWithder!.forEach((h, index) => {
                setTimeout(() => {
                    const head = this.refRowBody.current!.querySelector('[data-column-index="' + index + '"]');
                    (head as HTMLElement).style.width = h.pixel + "px"
                })


            })
        })
        // const head=this.refRowBody.current!.querySelector('[data-column-index="'+4+'"]');
        //
        // const d=(head as HTMLElement).offsetWidth;
        // (head as HTMLElement).style.width=0+"px"

    }


    render() {
        this.innerRender()
        return (

            <table style={this.props.style} is={this.props.id} className={this.props.className}>
                <thead>
                {!this.props.caption ? null : (
                    <caption>
                        {
                            this.props.caption
                        }
                    </caption>


                )}

                {
                    this.renderHeaderGroup()
                }
                <tr ref={this.refRowBody} style={{marginRight: 16}}>
                    {
                        this.list.map((c, index) => {
                            return <th
                                data-column-index={index}
                                onClick={this.columnClick.bind(this, index, c.propertyName)}
                                key={key()}
                                className={c.className}
                                style={c.style}>{c.children}
                            </th>
                        })
                    }
                </tr>
                </thead>
                <tbody ref={this.refBody}>
                {
                    this.props.rowItems?.map((row, index) => {

                        return this.renderTd(row, index)

                    })
                }
                </tbody>
            </table>
        )
            ;
    }

}