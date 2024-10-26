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



export class Table<T = any> extends React.Component<PropsTable<T>, any> {

    private refDiwHeader= React.createRef<HTMLDivElement>();
    private refDiwBody= React.createRef<HTMLDivElement>();
    private list: Array<PropsColumn> = []
    private MapSelect = new Map<number, DataRow>()
    private listWidth:Array<string|number|undefined>=[];

    private id?: string;
    private listGroup: Array<colGroupType> = [];
    private listHeaderGroup: Array<headerGroupType> = [];
    private refBody = React.createRef<HTMLTableSectionElement>()



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
                        const w=this.listWidth[indexD]

                        if (c.propertyName === null || c.propertyName === undefined || c.propertyName.trim().length === 0) {
                            return <td data-propery-name={c.propertyName} style={{width:w}} key={key()}></td>
                        }
                        const ob = !rowCells ? undefined : (rowCells as any)[c.propertyName];

                        if (ob===undefined||ob===null) {
                            return <td data-propery-name={c.propertyName}  style={{width:w}}  key={key()}></td>
                        } else if (typeof ob === 'number') {
                            return <td data-propery-name={c.propertyName}  style={{width:w}}  key={key()}>{`${ob}`}</td>
                        } else if (typeof ob === 'function') {
                            return <td data-propery-name={c.propertyName}  style={{width:w}}  key={key()}>{ob()}</td>
                        } else {
                            return <td data-propery-name={c.propertyName}  style={{width:w}}  key={key()}>{ob}</td>
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

            let hs = this.refDiwBody.current!.offsetWidth - this.refDiwBody.current!.clientWidth;
            if(hs > 0) {
                this.refDiwHeader.current!.style.marginRight= hs + 'px'
            }

            console.log(hs)





    }
    componentDidUpdate(prevProps: Readonly<PropsTable<T>>, prevState: Readonly<any>, snapshot?: any) {
        let hs = this.refDiwBody.current!.offsetWidth - this.refDiwBody.current!.clientWidth;
        if(hs > 0) {
            this.refDiwHeader.current!.style.marginRight= hs + 'px'
        }

    }


    renderHeader(c:PropsColumn,index:number){
        if(index===0){this.listWidth.length=0}
        if(c.style&&c.style.width){
            this.listWidth.push(c.style.width)
        }else {
            this.listWidth.push(undefined)
        }
        
        return (
            <th
                data-column-index={index}
                onClick={this.columnClick.bind(this, index, c.propertyName)}
                key={key()}
                className={c.className}
                style={c.style}>{c.children}
            </th>
        )

    }

    render() {
        this.innerRender()
        return (
            <div style={this.props.style} id={this.props.id}>
                {!this.props.caption ? null : (
                    <div className={'tb-caption'} style={this.props.styleCaption}>
                        {
                            this.props.caption
                        }
                    </div>


                )}
                <div className={'tbl-header'} ref={this.refDiwHeader}>
                    <table style={this.props.styleHeader} >
                        <thead>
                        <tr >
                            {
                                this.list.map((c, index) => {
                                   return this.renderHeader(c,index)
                                })
                            }
                        </tr>
                        </thead>
                    </table>
                </div>
                <div className={'tbl-content'} ref={this.refDiwBody}>
                    <table style={this.props.styleBody} >
                        <tbody ref={this.refBody}>
                        {
                            this.props.rowItems?.map((row, index) => {

                                return this.renderTd(row, index)

                            })
                        }
                        </tbody>
                    </table>
                </div>


            </div>


        )
            ;
    }

}