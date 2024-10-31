import React, { Children } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  //
  // Note to future-self: No, you can't remove the `toLowerCase()` call.
  // REF: https://github.com/uuidjs/uuid/pull/677#issuecomment-1757351351
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}

// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).

var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  // lazy load so that environments that need to polyfill have a chance to do so
  if (!getRandomValues) {
    // getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
    getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
    }
  }
  return getRandomValues(rnds8);
}

var randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native = {
  randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && !buf && !options) {
    return native.randomUUID();
  }
  options = options || {};
  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80;
  return unsafeStringify(rnds);
}

var ColumnGroup = /** @class */ (function (_super) {
    __extends(ColumnGroup, _super);
    function ColumnGroup(_a) {
        var props = _a.props;
        return _super.call(this, props) || this;
    }
    ColumnGroup.prototype.render = function () {
        return undefined;
    };
    return ColumnGroup;
}(React.Component));

var HeaderGroup = /** @class */ (function (_super) {
    __extends(HeaderGroup, _super);
    function HeaderGroup(_a) {
        var props = _a.props;
        return _super.call(this, props) || this;
    }
    HeaderGroup.prototype.render = function () {
        return undefined;
    };
    return HeaderGroup;
}(React.Component));

function appendWidth(acum, value) {
    if (!value) {
        return acum;
    }
    else {
        if (!acum) {
            acum = value;
        }
        else {
            var int1 = getInteger(acum);
            var int2 = getInteger(value);
            var extension = getExtension(value);
            if (!extension) {
                extension = 'px';
            }
            var sum = parseInt(int1.toString()) + parseInt(int2.toString());
            acum = sum + extension;
        }
        return acum;
    }
}
function getInteger(str) {
    var arr = String(str).match(/^[0-9]*/);
    return arr.toString();
}
function getExtension(str) {
    var arr = String(str).match(/[\%a-z]*/);
    return arr.toString();
}

var RowFooter = /** @class */ (function (_super) {
    __extends(RowFooter, _super);
    function RowFooter(_a) {
        var props = _a.props;
        return _super.call(this, props) || this;
    }
    RowFooter.prototype.render = function () {
        return undefined;
    };
    return RowFooter;
}(React.Component));

var Table = /** @class */ (function (_super) {
    __extends(Table, _super);
    function Table(_a) {
        var props = _a.props;
        var _this = _super.call(this, props) || this;
        _this.listDataRows = [];
        _this.indexClick = -1;
        _this.indexSelect = -1;
        _this.mapTotal = new Map();
        _this.refDivWrapper = React.createRef();
        _this.refDiwBody = React.createRef();
        _this.refDivHeader = React.createRef();
        _this.refDivCaption = React.createRef();
        _this.refDivFooter = React.createRef();
        _this.list = [];
        _this.listRowFooter = [];
        _this.MapSelect = new Map();
        _this.listWidth = [];
        _this.listGroup = [];
        _this.listHeaderGroup = [];
        _this.refBody = React.createRef();
        _this.refTableBody = React.createRef();
        _this.keyUp = _this.keyUp.bind(_this);
        return _this;
    }
    Table.prototype.GetListSelect = function () {
        return Array.from(this.MapSelect, function (_a) {
            var value = _a[0];
            return ({ value: value });
        });
    };
    Table.prototype.innerRender = function () {
        var _this = this;
        var _a;
        this.listRowFooter.length = 0;
        this.list.length = 0;
        this.listGroup.length = 0;
        this.listHeaderGroup.length = 0;
        this.mapTotal.clear();
        this.MapSelect.clear();
        if (this.listDataRows.length == 0 && this.props.rowItems && this.props.rowItems.length > 0) {
            this.listDataRows = this.props.rowItems;
        }
        this.indexSelect = -1;
        this.indexClick = -1;
        this.mapTotal.clear();
        if (!this.id)
            this.id = (_a = this.props.id) !== null && _a !== void 0 ? _a : v4();
        if (Children) {
            this.list = [];
            this.listGroup = [];
            this.listHeaderGroup = [];
            Children.forEach(this.props.children, function (d) {
                var _a;
                var element = d;
                if (element.type == RowFooter) {
                    var footer_1 = {
                        useScrollContent: element.props.useScrollContent,
                        className: element.props.className,
                        style: element.props.style,
                        listCell: []
                    };
                    Children.map(element.props.children, function (cell) {
                        var _a;
                        (_a = footer_1.listCell) === null || _a === void 0 ? void 0 : _a.push({
                            className: cell.props.className,
                            style: cell.props.style,
                            colspan: cell.props.colspan,
                            content: cell.props.children
                        });
                    });
                    _this.listRowFooter.push(footer_1);
                    return;
                }
                else if (element.type === HeaderGroup) {
                    var header_1 = {
                        className: element.props.className,
                        style: element.props.style,
                        title: element.props.title,
                        id: element.props.id,
                        eventKey: element.props.eventKey,
                        onClick: element.props.onClick,
                        colspan: 0,
                    };
                    Children.map(element.props.children, function (ff) {
                        _this.innerParserProps(ff, header_1);
                    });
                    if (header_1.colspan && header_1.colspan > 0) {
                        _this.listHeaderGroup.push(header_1);
                    }
                }
                else {
                    var header = {
                        colspan: 0
                    };
                    _this.innerParserProps(d, header);
                    for (var i = 0; i < header.colspan; i++) {
                        _this.listHeaderGroup.push({
                            width: (_a = element.props.style) === null || _a === void 0 ? void 0 : _a.width
                        });
                    }
                }
            });
        }
    };
    Table.prototype.innerParserProps = function (d, header) {
        var _this = this;
        var _a, _b;
        var element = d;
        if (element.type === ColumnGroup) {
            Children.map(element.props.children, function (col) {
                _this.list.push({
                    propertyName: col.props.propertyName,
                    style: col.props.style,
                    className: col.props.className,
                    children: col.props.children,
                });
            });
            this.listGroup.push({
                id: element.props.id,
                className: element.props.className,
                style: element.props.style,
                span: React.Children.count(element.props.children)
            });
            if (header) {
                header.width = appendWidth(header.width, (_a = element.props.style) === null || _a === void 0 ? void 0 : _a.width);
                header.colspan += React.Children.count(element.props.children);
            }
        }
        else {
            this.listGroup.push({});
            this.list.push({
                propertyName: element.props.propertyName,
                style: element.props.style,
                className: element.props.className,
                children: element.props.children,
            });
            if (header) { // todo добавить стиль ширины
                header.width = appendWidth(header.width, (_b = element.props.style) === null || _b === void 0 ? void 0 : _b.width);
                header.colspan += 1; // React.Children.count((d as any).props.children);
            }
        }
    };
    Table.prototype.columnClick = function (propertyName, eventKey, eventTarget) {
        if (this.props.onClickColumn) {
            this.props.onClickColumn(propertyName, eventTarget, eventKey);
        }
    };
    Table.prototype.Refresh = function (callback) {
        var _this = this;
        this.forceUpdate(function () {
            _this.refreshHeight(callback);
        });
    };
    Table.prototype.SelectRowsById = function (id) {
        var _a;
        var d = document.getElementById(id);
        if (d) {
            d.classList.add((_a = this.props.classNameSelection) !== null && _a !== void 0 ? _a : 'row-select');
        }
    };
    Table.prototype.GetDataRowByIndex = function (index) {
        return this.mapTotal.get(index);
    };
    Table.prototype.renderItemRowProperty = function (props, index) {
        var _this = this;
        this.mapTotal.set(index, this.props);
        var view = props.getView ? props.getView() : undefined;
        return (React.createElement("tr", { key: v4(), id: props.id, className: props.className, style: props.style, title: props.title, onClick: function (e) {
                _this.indexClick = index;
                _this.indexSelect = index;
                if (_this.props.useRowSelection) {
                    if (!e.ctrlKey) {
                        document.querySelectorAll('[data-row-id]').forEach(function (r) {
                            var _a, _b, _c;
                            _this.MapSelect.clear();
                            r.classList.remove((_a = _this.props.classNameSelection) !== null && _a !== void 0 ? _a : 'row-select-key');
                            r.classList.remove((_b = _this.props.classNameSelection) !== null && _b !== void 0 ? _b : 'row-select');
                            if (r.getAttribute('data-row-id') === _this.id + "_" + index) {
                                r.classList.add((_c = _this.props.classNameSelection) !== null && _c !== void 0 ? _c : 'row-select');
                                _this.MapSelect.set(index, props);
                            }
                        });
                    }
                    else {
                        document.querySelectorAll('[data-row-id]').forEach(function (r) {
                            var _a, _b, _c;
                            if (r.getAttribute('data-row-id') === _this.id + "_" + index) {
                                r.classList.add((_a = _this.props.classNameSelection) !== null && _a !== void 0 ? _a : 'row-select');
                                if (_this.MapSelect.has(index)) {
                                    if (_this.MapSelect.delete(index)) {
                                        r.classList.remove((_b = _this.props.classNameSelection) !== null && _b !== void 0 ? _b : 'row-select-key');
                                        r.classList.remove((_c = _this.props.classNameSelection) !== null && _c !== void 0 ? _c : 'row-select');
                                    }
                                }
                                else {
                                    _this.MapSelect.set(index, props);
                                }
                            }
                        });
                    }
                }
                if (props.onClick) {
                    props.onClick(props, e.currentTarget);
                }
                else {
                    if (_this.props.onClickRow) {
                        _this.props.onClickRow(props, e.currentTarget);
                    }
                }
            }, "data-row-id": this.id + "_" + index }, this.list.map(function (c, indexD) {
            var w = _this.listWidth[indexD];
            if (c.propertyName === null || c.propertyName === undefined || c.propertyName.trim().length === 0) {
                return React.createElement("td", { onClick: function (e) {
                        _this.cellClickE(c.propertyName, props, e.currentTarget);
                    }, "data-propery-name": c.propertyName, style: { width: w }, key: v4() });
            }
            var ob = !view ? undefined : view[c.propertyName];
            if (ob === undefined || ob === null) {
                return React.createElement("td", { onClick: function (e) {
                        _this.cellClickE(c.propertyName, props, e.currentTarget);
                    }, "data-propery-name": c.propertyName, style: { width: w }, key: v4() });
            }
            else if (typeof ob === 'number') {
                return React.createElement("td", { onClick: function (e) {
                        _this.cellClickE(c.propertyName, props, e.currentTarget);
                    }, "data-propery-name": c.propertyName, style: { width: w }, key: v4() }, "".concat(ob));
            }
            else if (typeof ob === 'function') {
                return React.createElement("td", { onClick: function (e) {
                        _this.cellClickE(c.propertyName, props, e.currentTarget);
                    }, "data-propery-name": c.propertyName, style: { width: w }, key: v4() }, ob());
            }
            else {
                return React.createElement("td", { onClick: function (e) {
                        _this.cellClickE(c.propertyName, props, e.currentTarget);
                    }, "data-propery-name": c.propertyName, style: { width: w }, key: v4() }, ob);
            }
        })));
    };
    Object.defineProperty(Table.prototype, "height", {
        get: function () {
            return this.heightInner;
        },
        set: function (value) {
            var _this = this;
            this.heightInner = value;
            this.refreshHeight(function () {
                _this.forceUpdate();
            });
        },
        enumerable: false,
        configurable: true
    });
    Table.prototype.refreshHeight = function (callback) {
        var _a, _b, _c, _d;
        if (this.heightInner) {
            var w1 = (_b = (_a = this.refDivCaption.current) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0;
            var w2 = this.refDivHeader.current.offsetHeight;
            var w3 = (_d = (_c = this.refDivFooter.current) === null || _c === void 0 ? void 0 : _c.offsetHeight) !== null && _d !== void 0 ? _d : 0;
            var tw = this.heightInner - w1 - w2 - w3;
            if (tw > 0) {
                this.refDiwBody.current.style.height = tw + 'px';
            }
        }
        if (callback)
            callback();
    };
    Table.prototype.componentDidMount = function () {
        this.heightInner = this.props.height;
        this.updateHeightForScroll();
        this.refreshHeight();
        window.addEventListener('keydown', this.keyUp);
    };
    Table.prototype.updateHeightForScroll = function () {
        var hs = this.refDiwBody.current.offsetWidth - this.refDiwBody.current.clientWidth;
        if (hs > 0) {
            this.refDivHeader.current.style.marginRight = hs + 'px';
            if (this.refDivFooter.current) {
                this.refDivFooter.current.style.marginRight = hs + 'px';
            }
        }
    };
    Table.prototype.componentWillUnmount = function () {
        window.removeEventListener('keydown', this.keyUp);
    };
    Table.prototype.componentDidUpdate = function () {
        this.updateHeightForScroll();
    };
    Table.prototype.validatePosition = function (t) {
        var top = this.refDiwBody.current.scrollTop;
        var h = this.refDiwBody.current.offsetHeight;
        if (t < top) {
            return 1;
        }
        if (t > top + h) {
            return 3;
        }
        return 2;
    };
    Table.prototype.keyUp = function (e) {
        var _this = this;
        var _a, _b, _c, _d;
        if (!this.props.useRowSelection)
            return;
        if (this.mapTotal.size === 0)
            return;
        if (e.ctrlKey && e.key === 'Enter') {
            (_a = this.refBody.current) === null || _a === void 0 ? void 0 : _a.rows[this.indexSelect].click();
        }
        if (e.ctrlKey && e.key === 'ArrowDown') {
            if (this.indexSelect < this.mapTotal.size - 1) {
                this.indexSelect = this.indexSelect + 1;
                document.querySelectorAll('[data-row-id]').forEach(function (r) {
                    var _a, _b, _c;
                    r.classList.remove((_a = _this.props.classNameSelection) !== null && _a !== void 0 ? _a : 'row-select-key');
                    if (r.getAttribute('data-row-id') === _this.id + "_" + _this.indexSelect) {
                        r.classList.add((_b = _this.props.classNameSelection) !== null && _b !== void 0 ? _b : 'row-select-key');
                        var top_1 = r.offsetTop;
                        var hm = r.offsetHeight;
                        switch (_this.validatePosition(top_1 + hm)) {
                            case 1: {
                                _this.refDiwBody.current.scrollTop = top_1;
                                break;
                            }
                            case 2: {
                                break;
                            }
                            case 3: {
                                var t = (_c = _this.refDiwBody.current) === null || _c === void 0 ? void 0 : _c.scrollTop;
                                _this.refDiwBody.current.scrollTop = t + hm;
                                break;
                            }
                        }
                    }
                });
            }
            (_b = this.refBody.current) === null || _b === void 0 ? void 0 : _b.click();
        }
        if (e.ctrlKey && e.key === 'ArrowUp') {
            (_c = this.refDivWrapper.current) === null || _c === void 0 ? void 0 : _c.focus();
            if (this.indexSelect > 0) {
                this.indexSelect = this.indexSelect - 1;
                document.querySelectorAll('[data-row-id]').forEach(function (r) {
                    var _a, _b, _c;
                    r.classList.remove((_a = _this.props.classNameSelection) !== null && _a !== void 0 ? _a : 'row-select-key');
                    if (r.getAttribute('data-row-id') === _this.id + "_" + _this.indexSelect) {
                        r.classList.add((_b = _this.props.classNameSelection) !== null && _b !== void 0 ? _b : 'row-select-key');
                        var top_2 = r.offsetTop;
                        switch (_this.validatePosition(top_2)) {
                            case 1: {
                                _this.refDiwBody.current.scrollTop = top_2;
                                break;
                            }
                            case 2: {
                                break;
                            }
                            case 3: {
                                var t = (_c = _this.refDiwBody.current) === null || _c === void 0 ? void 0 : _c.scrollTop;
                                _this.refDiwBody.current.scrollTop = t + top_2;
                                break;
                            }
                        }
                    }
                });
            }
            (_d = this.refBody.current) === null || _d === void 0 ? void 0 : _d.click();
        }
    };
    Table.prototype.renderHeader = function (c, index) {
        var _this = this;
        if (index === 0) {
            this.listWidth.length = 0;
        }
        if (c.style && c.style.width) {
            this.listWidth.push(c.style.width);
        }
        else {
            this.listWidth.push(undefined);
        }
        return (React.createElement("th", { "data-column-index": index, onClick: function (e) {
                _this.columnClick(c.propertyName, c.eventKey, e.currentTarget);
            }, key: v4(), className: c.className, style: c.style }, c.children));
    };
    Table.prototype.renderColumnGroup = function () {
        return React.createElement("colgroup", null, this.listGroup.map(function (col) {
            if (!col.span) {
                return React.createElement("col", { key: v4() });
            }
            else {
                return React.createElement("col", { key: v4(), id: col.id, className: col.className, style: col.style, span: col.span });
            }
        }));
    };
    Table.prototype.renderHeaderGroup = function () {
        if (this.listHeaderGroup.length > 0) {
            if (this.listHeaderGroup.filter(function (a) { return a.colspan !== undefined; }).length > 0) {
                return React.createElement("tr", null, this.listHeaderGroup.map(function (g) {
                    if (g.colspan) {
                        var style = g.style;
                        if (!style) {
                            style = { width: g.width };
                        }
                        else {
                            if (!style.width) {
                                style = {};
                                Object.assign(style, g.style);
                                style.width = g.width;
                            }
                        }
                        return React.createElement("th", { key: v4(), onClick: function () {
                                if (g.onClick) {
                                    g.onClick(g.eventKey);
                                }
                            }, style: style, 
                            //style={g.style}
                            className: g.className, id: g.id, colSpan: g.colspan },
                            g.title,
                            " ");
                    }
                    else {
                        return React.createElement("th", { key: v4(), style: { width: g.width } });
                    }
                }));
            }
        }
        else {
            return null;
        }
    };
    Table.prototype.ShowRowByIndexAndClick = function (index) {
        var _a;
        if (index < 0 || index > this.mapTotal.size - 1)
            return;
        var r = (_a = this.refBody.current) === null || _a === void 0 ? void 0 : _a.rows[index];
        if (r) {
            var t = r.offsetTop;
            var h = this.refDiwBody.current.offsetHeight;
            this.refDiwBody.current.scrollTop = t - h / 2;
            r.click();
        }
    };
    Table.prototype.GetItemsRow = function () {
        return this.listDataRows;
    };
    Table.prototype.SetItemsRow = function (list, callback) {
        this.listDataRows = list;
        this.Refresh(callback);
    };
    Table.prototype.render = function () {
        var _this = this;
        var _a, _b;
        this.innerRender();
        return (React.createElement("div", { style: this.props.style, id: this.props.id, ref: this.refDivWrapper, className: (_a = this.props.className) !== null && _a !== void 0 ? _a : 'tbl-wrapper' },
            !this.props.caption ? null : (React.createElement("div", { className: 'tb-caption', style: this.props.styleCaption, ref: this.refDivCaption }, this.props.caption)),
            React.createElement("div", { className: 'tbl-header', ref: this.refDivHeader },
                React.createElement("table", { style: this.props.styleHeader, ref: this.refTableBody },
                    React.createElement("thead", null,
                        this.renderHeaderGroup(),
                        React.createElement("tr", null, this.list.map(function (c, index) {
                            return _this.renderHeader(c, index);
                        }))))),
            React.createElement("div", { className: 'tbl-content', ref: this.refDiwBody },
                React.createElement("table", { className: 'tbl-content-core', style: this.props.styleBody },
                    this.renderColumnGroup(),
                    React.createElement("thead", null),
                    React.createElement("tbody", { ref: this.refBody }, (_b = this.listDataRows) === null || _b === void 0 ? void 0 : _b.map(function (row, index) {
                        return _this.renderItemRowProperty(row, index);
                    })),
                    this.renderFootScroll())),
            this.renderFootNoScroll()));
    };
    Table.prototype.renderFootScroll = function (ignored) {
        function getContent(c) {
            if (typeof c === "function") {
                return c();
            }
            return c;
        }
        var res = React.createElement("tfoot", null, this.listRowFooter.map(function (r) {
            var _a;
            return (React.createElement("tr", { key: v4(), className: r.className, style: r.style }, (_a = r.listCell) === null || _a === void 0 ? void 0 : _a.map(function (c) {
                return React.createElement("td", { key: v4(), colSpan: c.colspan, className: c.className, style: c.style }, getContent(c.content));
            })));
        }));
        if (ignored) {
            return res;
        }
        else {
            if (this.listRowFooter.length > 0 && this.listRowFooter[0].useScrollContent) {
                return res;
            }
            else {
                return null;
            }
        }
    };
    Table.prototype.renderFootNoScroll = function () {
        if (this.listRowFooter.length > 0 && !this.listRowFooter[0].useScrollContent) {
            return (React.createElement("div", { ref: this.refDivFooter, className: 'tbl-footer' },
                React.createElement("table", null,
                    React.createElement("tbody", null,
                        React.createElement("tr", { style: { visibility: "collapse" } }, this.listWidth.map(function (col) {
                            return React.createElement("td", { key: v4(), style: { width: col } });
                        }))),
                    this.renderFootScroll(true))));
        }
        return null;
    };
    Table.prototype.cellClickE = function (propertyName, props, target) {
        if (this.props.onClickCell) {
            this.props.onClickCell(propertyName, props, target);
        }
    };
    return Table;
}(React.Component));

var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column(_a) {
        var props = _a.props;
        return _super.call(this, props) || this;
    }
    Column.prototype.render = function () {
        return undefined;
    };
    return Column;
}(React.Component));

var DataRow = /** @class */ (function () {
    function DataRow() {
    }
    return DataRow;
}());
// export  interface CustomCell{
//     data:ReactElement;
// }

var CellFooter = /** @class */ (function (_super) {
    __extends(CellFooter, _super);
    function CellFooter(_a) {
        var props = _a.props;
        return _super.call(this, props) || this;
    }
    CellFooter.prototype.render = function () {
        return undefined;
    };
    return CellFooter;
}(React.Component));

export { CellFooter, Column, ColumnGroup, DataRow, HeaderGroup, RowFooter, Table };
