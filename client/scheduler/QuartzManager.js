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

isc.defineClass("QuartzManager", "VLayout").addProperties({

headerDefaults: {
	_constructor: "ToolStrip",
	width: "100%",
	height: 33,

	titleDefaults: {
	    _constructor: "Label",
	    contents: "&nbsp;<b>Jobs</b>"
	},

	refreshBtnDefaults: {
		_constructor: "ToolStripButton",
		showRollOver: false,
		icon: "[SKIN]actions/refresh.png",
		prompt: "Refresh jobs",
		click: "this.creator.creator.jobGrid.refresh()"
	},

	addBtnDefaults: {
		_constructor: "ToolStripButton",
		showRollOver: false,
		icon: "[SKIN]actions/add.png",
		prompt: "Add job",
		click: "this.creator.creator.jobEdit.editNew()"
	},

	removeBtnDefaults: {
		_constructor: "ToolStripButton",
		showRollOver: false,
		icon: "[SKIN]actions/remove.png",
		prompt: "Remove job",
		click: "this.creator.creator.jobGrid.removeSelectedData()"
	},

	members: ["autoChild:title", "starSpacer", "autoChild:refreshBtn", "autoChild:addBtn", "autoChild:removeBtn"]
},

jobGridDefaults: {
	_constructor: "ListGrid",
	autoDraw: false,
	width: "100%",
	height: 300,
	dataSource: "QuartzJobs",
	useAllDataSourceFields: true,
	autoFetchData: true,
	selectionType: "single",
	recordClick: "this.creator.jobEdit.edit(record)",
	refresh : function() {
	    this.invalidateCache();
	    this.fetchData();
	},
	add : function() {
		this.creator.jobEdit.editNew();
	},
	remove : function() {
	}
},

jobDetailHeaderDefaults: {
	_constructor: "ToolStrip",
	width: "100%",
	height: 33,

	titleDefaults: {
	    _constructor: "Label",
	    contents: "&nbsp;<b>Job Detail</b>"
	},

	members: ["autoChild:title"]
},

jobEditDefaults: {
	_constructor: "QuartzJobDetailPane",
	autoDraw: false
},

members: ["autoChild:header", "autoChild:jobGrid", "autoChild:jobEdit"]

});
