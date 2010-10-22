/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-10-22 (2010-10-22)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */
isc.defineClass("DBList", "ListGrid").addProperties({

dataSource: "DBListDS",
showFilterEditor: true,
filterOnKeypress: true,
sortField: "name",

initWidget : function () {
    this.Super("initWidget", arguments);
},

dataArrived : function () {
    this.Super("dataArrived", arguments);

    if (!this.initialCriteriaSet) {
        var initialCriteria = {status: "OK"};
        this.setFilterEditorCriteria(initialCriteria);
        this.initialCriteriaSet = true;
        this.filterData(initialCriteria);
    }
    this.initialCriteriaSet = false;
    
},

cellHoverHTML : function (record) {
    if (!this.hoverDV) this.hoverDV = isc.DetailViewer.create({dataSource: this.dataSource,width:200,autoDraw:false});
    this.hoverDV.setData(record);
    return this.hoverDV.getInnerHTML();
},

destroy : function () {
    this.Super("destroy", arguments);
    if (this.hoverDV) this.hoverDV.destroy();
}

});