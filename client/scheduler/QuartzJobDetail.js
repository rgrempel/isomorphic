/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2011-01-05 (2011-01-05)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

isc.defineClass("QuartzJobDetailPane", "VLayout").addProperties({

headerDefaults: {
	_constructor: "ToolStrip",
	width: "100%",
	height: 33,

	titleDefaults: {
	    _constructor: "Label",
	    contents: "&nbsp;<b>Job Detail</b>"
	},

	members: ["autoChild:title"]
},

editFormProperties: {
    _constructor: "DynamicForm",
    autoDraw: false,
    numCols: 4,
	colWidths: [100, 100, 100, "*"],
	dataSource: "QuartzJobs",
	autoFocus: true,
	fields: [
		{name: "group", width: 300, colSpan: 3, tabIndex: 10},
		{name: "name", width: 300, colSpan: 3, tabIndex: 20},
		{name: "description", width: 300, colSpan: 3, tabIndex: 30},
		{name: "class", width: 300, tabIndex: 40, colSpan: 3},
        {name: "startTime", tabIndex: 200},
        {name: "endTime", tabIndex: 210},
        {name: "cronExpression", width: 300, colSpan: 3, tabIndex: 220},
        {name: "timeZone", width: 300, tabIndex: 230, colSpan: 3, endRow: true},

        {type: "rowSpacer"},
		{name: "btnApply", type: "button", title: "Apply", width: 75, startRow: false, endRow: false,
			icon: "[SKIN]actions/save.png", 
			click: "form.save()" 
		},
		{name: "btnCancel", type: "button", title: "Cancel", width: 75, startRow: false, endRow: false,
			icon: "[SKIN]actions/undo.png",
			click: "form.reset()"
		}
	], 

	// Save (add/update) current record and set the status for editing
	save : function () {
		this.saveData(function(response, data, request) {
			this.editRecord(data);
		    // Don't allow primary key values to be edited
		    this.getField("group").setDisabled(true);
		    this.getField("name").setDisabled(true);
		});
	}
},


members: ["autoChild:header", "autoChild:editForm"],

// Public methods to affect editing
editNew : function () {
	this.editForm.editNewRecord();
    this.editForm.getField("group").setDisabled(false);
    this.editForm.getField("name").setDisabled(false);
},

edit : function (record) {
	this.editForm.editRecord(record);
	// Don't allow primary key values to be edited
	this.editForm.getField("group").setDisabled(true);
    this.editForm.getField("name").setDisabled(true);
}

});

