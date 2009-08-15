/*
 * Isomorphic SmartClient
 * Version 7.0rc2 (2009-05-30)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 


// Hilite Editor
// ---------------------------------------------------------------------------------------
// Interface for defining and editing grid hilites

isc.defineClass("HiliteEditor", "SectionStack").addProperties({

    // DataSource for storing highlights
    // ---------------------------------------------------------------------------------------
    hilitesDSDefaults : {
        _constructor:"DataSource",
        clientOnly:true,
        fields : [
            { name:"id", primaryKey:true, type:"sequence" }
        ]
    },

    // list of current highlights
    // ---------------------------------------------------------------------------------------
    hiliteListDefaults : {
        _constructor:isc.ListGrid,
        selectionType:"single",
        leaveScrollbarGap:false,
        // prevents hilite.cssText from triggering record.cssText behavior
        recordCSSTextProperty:"_none",
        fields : [
            // exists only so that hilite.cssText will apply to it
            {name:"fieldName", title:"Target Field", 
             recordClick:function (grid) { grid.creator.hiliteClicked() },
             formatCellValue : function (value, record, rowNum, colNum, grid) {
                 return grid.creator.formatFieldNames(value);
             }
            },
            // exists only so that hilite.cssText will apply to it
            {name:"sample", title:"Sample", 
             formatCellValue:function (value, record) {
                 return "<span style='" + record.cssText + "'>Sample Text</span>";
             },
             recordClick:function (grid) { grid.creator.hiliteClicked() }
            },
            {name:"Delete", type:"icon", iconSize:16, icon:"[SKINIMG]/actions/remove.png",
             recordClick:function (grid) { grid.removeSelectedData() }
            }
        ]
    },

    // editor for new highlights
    // ---------------------------------------------------------------------------------------
    hiliteEditorDefaults : {
        _constructor:isc.VStack
    },

    filterBuilderDefaults : {
        _constructor:"FilterBuilder",
        autoParent:"hiliteEditor",
        isGroup:true,
        groupTitle:"Filter",
        padding:8
    },
    
    hiliteFormDefaults : {
        _constructor:"DynamicForm",
        autoParent:"hiliteEditor",
        isGroup:true,
        groupTitle:"Appearance",
        extraSpace:4,
        padding:8,
        numCols:4,
        items:[
            {title:"Target Field(s)", name:"fieldName", multiple:true, type:"select", rowSpan:2,
             defaultDynamicValue:"isc.firstKey(item.valueMap)"},
            {title:"Text", name:"textColor", type:"color" },
            {title:"Background", name:"backgroundColor", type:"color" }
        ]
    },

    hiliteButtonsDefaults : {
        _constructor:isc.HLayout, 
        membersMargin:8, height:1,
        autoParent:"hiliteEditor"
    },

    addButtonDefaults : {
        _constructor:"IButton", 
        autoParent:"hiliteButtons",
        title:"Save",
        click : function () {
            this.creator.saveHilite();
        }
    },
    newButtonDefaults : {
        _constructor:"IButton", 
        autoParent:"hiliteButtons",
        title:"New",
        click : function () {
            this.creator.newHilite();
        },
        extraSpace:50
    },
    doneButtonDefaults : {
        _constructor:"IButton", 
        autoParent:"hiliteButtons",
        title:"Done",
        click : function () {
            this.creator.doneEditing();
        }
    },

    // overall layout
    // ---------------------------------------------------------------------------------------
    defaultWidth:800, defaultHeight:600,
    visibilityMode:"multiple",

    initWidget : function () {
        this.Super("initWidget", arguments);
        
        this.hilitesDS = this.createAutoChild("hilitesDS");
        this.setHilites();

        this.hiliteList = this.createAutoChild("hiliteList", {dataSource:this.hilitesDS});
        this.hiliteList.fetchData();

        this.addSection({ 
            title: "Current Highlights", expanded:true, 
            items : ["autoChild:hiliteList" ]
        });
        this.addSection({
            title: "Define New Highlight", expanded:true, 
            items : ["autoChild:hiliteEditor"]
        });

        var ds = this.getDataSource();

        this.addAutoChild("filterBuilder", {dataSource:ds});
        this.addAutoChild("hiliteForm", {dataSource:this.hilitesDS});
	
        var fieldNames = this.fieldNames || ds.getFieldNames(),
            fieldMap = this.fieldMap = {};
        for (var i = 0; i < fieldNames.length; i++) {
            var fieldName = fieldNames[i],
                field = ds.getField(fieldName),
                fieldTitle = field.title;
            if (field.hidden) continue;
            fieldTitle = fieldTitle ? fieldTitle : fieldName;
            fieldMap[fieldName] = fieldTitle;
        }
        this.fieldMap = fieldMap;
        this.hiliteForm.setValueMap("fieldName", fieldMap);

        this.addAutoChildren(["hiliteButtons", "addButton", "newButton", "doneButton"]);
    },

    formatFieldNames : function (fieldNames) {
        if (!isc.isAn.Array(fieldNames)) fieldNames = [fieldNames];
        var fieldMap = this.fieldMap;
        return fieldNames.map(function (fieldName) { return fieldMap[fieldName] });
    },

    setHilites : function (hilites) {
        hilites = hilites || this.hilites;
        this.hilitesDS.testData = hilites;
        if (this.hiliteList) {
            this.hiliteList.data.invalidateCache();
        }
        if (this.hiliteForm) this.hiliteForm.editNewRecord();
        if (this.filterBuilder) this.filterBuilder.clearCriteria();
    },

    hiliteClicked : function () {
        var hilite = this.hiliteList.getSelectedRecord();
        this.filterBuilder.setCriteria(hilite.criteria);
        this.hiliteForm.editRecord(hilite);
    },

    newHilite : function () {
        this.hiliteList.deselectAllRecords();
        this.filterBuilder.clearCriteria()
        this.hiliteForm.editNewRecord();
    },

    // save or add a hilite (depending on whether we edited an existing hilite or not)
    saveHilite : function (callback) {
        this.hiliteForm.setValue("criteria", this.filterBuilder.getCriteria());
        var hilite = this.hiliteForm.getValues();

        hilite.cssText = "" +
                (hilite.textColor ? "color:" + hilite.textColor + ";" : "") +
                (hilite.backgroundColor ? "background-color:" + hilite.backgroundColor + ";" : "");
        this.hiliteForm.setValue("cssText", hilite.cssText);

        var editor = this;
        this.hiliteForm.saveData(function (dsResponse, data) {
            var record = isc.isAn.Array(data) ? data[0] : data;
            editor.hiliteList.deselectAllRecords();
            editor.hiliteList.selectRecord(record);
            // for change detection
            editor.hiliteForm.editRecord(record);
            if (callback) editor.fireCallback(callback);
        });
    },
    doneEditing : function () {
        // XXX technically should check filterBuilder for changes as well
        if (!this.hiliteForm.valuesHaveChanged()) {
            this.completeEditing();
            return;
        }
        var editor = this;
        isc.confirm("Save changes to selected highlight?", function (shouldSave) {
            if (shouldSave) {
                editor.saveHilite(function () {
                    editor.completeEditing();
                });
            } else {
                editor.completeEditing();
            }
        });
        
    },
    completeEditing : function () {
        
        this.hiliteList.deselectAllRecords();

        var hilites = this.hilitesDS.testData;

        // the id field exists purely for the client-only DataSource, so wipe it out, since
        // it's valid for highlights defined at different times (eg different users) to be
        // combined.
        if (hilites) hilites.clearProperty("id");

        //isc.logWarn("returning hilites: " + isc.echoAll(hilites));
        this.fireCallback(this.callback, "hilites", [hilites]);
    }    
});


