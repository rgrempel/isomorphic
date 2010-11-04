/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-11-04 (2010-11-04)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */




// ----------------------------------------------------------------------------------------

// If ListGrid isn't loaded don't attempt to create this class - it's a requirement.
if (isc.ListGrid != null) {
    
//> @class DataSourceEditor
// Provides a UI for creating and editing +link{DataSource, DataSources).
// 
// @visibility devTools
//<
isc.ClassFactory.defineClass("DataSourceEditor", "VLayout");

isc.DataSourceEditor.addProperties({
// attributes 
overflow: "visible",


//> @attr dataSourceEditor.dataSource (DataSource or ID : null : IRW)
// DataSource being edited.
//
// @visibility devTools
//<

//> @attr dataSourceEditor.mainEditor (AutoChild ComponentEditor : null : IRW)
//
// @visibility devTools
//<
mainEditorDefaults: {
    _constructor: "ComponentEditor",
    autoDraw:false,
    numCols:4,
    overflow:"visible",
    backgroundColor:"black",
    dataSource:"DataSource",
    fields : [
        {name:"ID", required:true},
        //{name:"dataFormat", defaultValue:"iscServer", redrawOnChange:true},

        {type:"section", defaultValue:"XPath Binding", showIf:"values.dataFormat != 'iscServer'",
         itemIds:["dataURL", "selectBy", "recordXPath", "recordName"]},
        {name:"dataURL", showIf:"values.dataFormat != 'iscServer'"},
        {name:"selectBy", title:"Select Records By", 
         shouldSaveValue:false,
         valueMap:{ tagName:"Tag Name", xpath:"XPath Expression" },
         defaultValue:"xpath",
         redrawOnChange:true,
         // can't use tagName in JSON
         showIf:"values.dataFormat == 'xml'"},
        // allowed in XML or JSON
        {name:"recordXPath", 
         showIf:"values.dataFormat != 'iscServer' && form.getItem('selectBy').getValue() == 'xpath'"},
        // allow in XML only
        {name:"recordName", 
         showIf:"values.dataFormat == 'xml' && values.selectBy == 'tagName'"},

        {type:"section", defaultValue:"SQL Binding", 
         showIf:"values.serverType == 'sql' || values.serverType == 'hibernate'",
         itemIds:["tableName", "dbName"]},
        {name:"tableName", 
         showIf:"values.serverType == 'sql' || values.serverType == 'hibernate'"},
        {name:"dbName", showIf:"values.serverType == 'sql'"}, 

        {type:"section", defaultValue:"Record Titles", sectionExpanded:false,
         itemIds:["title", "pluralTitle", "titleField"]},
        {name:"title"},
        {name:"pluralTitle"},
        {name:"titleField"}
    ]
},

fieldEditorDefaults: {
    _constructor: "ListEditor",
    autoDraw:false,
    inlineEdit:true,
    dataSource:"DataSourceField",
    saveLocally:true,
    gridButtonsOrientation:"right",
    backgroundColor:"white",
    fields:[
        {name:"name", treeField: true},
        {name:"title"},
        {name:"type", width:60},
        {name:"required", title:"Req.", width:40, canToggle:true},
        {name:"hidden", width:40},
        {name:"length", width:60},
        {name:"primaryKey", title:"is PK", width:40}
    ],
    formConstructor:isc.ComponentEditor, // to get documentation hovers, property groupings
    formProperties: { 
        numCols:4,
        initialGroups:10
    },
    formFields : [
        {name:"name", canEdit:false},
        {name:"type"},
        {name:"title"},
        {name:"primaryKey"},
        {name:"valueXPath", colSpan:2, 
            showIf:function () {
                var grid = this.form.creator,
                    mainEditor = grid ? grid.creator.mainEditor : null;
                return (mainEditor && mainEditor.getValues().dataFormat != 'iscServer');
                
            }
        },

        {type:"section", defaultValue:"Value Constraints",
         itemIds:["required", "length", "valueMap"] },
        {name:"valueMap", rowSpan:2},
        {name:"required"},
        {name:"length"},

        {type:"section", defaultValue:"Component Binding", 
         itemIds:["hidden", "detail", "canEdit"] },
        {name:"canEdit"},
        {name:"hidden"},
        {name:"detail"},

        {type:"section", defaultValue:"Relations", sectionExpanded:false,
         itemIds:["foreignKey", "rootValue"] },
        {name:"foreignKey"},
        {name:"rootValue", showTitle:false, colSpan:4}
    ],
    gridDefaults:{ 
        editEvent:"click",
        
        listEndEditAction:"next",
        autoParent:"gridLayout",
        selectionType:isc.Selection.SINGLE,
        recordClick:"this.creator.recordClick(record)",
        modalEditing:true,
        editorEnter:"if (this.creator.moreButton) this.creator.moreButton.enable()",
        selectionChanged: function() {
            if (this.anySelected() && this.creator.moreButton) {
                this.creator.moreButton.enable();
            }
        },
        contextMenu : {
            data : [
                {title:"Remove", click: "target.creator.removeRecord()" }
            ]
        },
        // get rid of default LG borders
        styleName:"rightBorderOnly",
        validateByCell:true,
        leaveScrollbarGap:false,
        alternateRecordStyles:true,
        // show a delete column
        canRemoveRecords:true,
        canEdit: true,
        canEditCell : function (rowNum, colNum) {
            var record = this.getRecord(rowNum),
                field = this.getField(colNum),
                fieldName = field[this.fieldIdProperty],
                isNameOrTitle = (fieldName == "name" || fieldName == "title");
            if (isc.isA.TreeGrid(this)) {
                if (record.isFolder &&
                !(isNameOrTitle || fieldName == "required" || fieldName == "hidden")) {
                    return false;
                }
            }
            else {
                if (this.getDataSource().fieldIsComplexType(field) && !isNameOrTitle) 
                    return false;
            }
            return this.Super('canEditCell', arguments);
        }

    },

    newRecord : function () {
        if (this.creator.canEditChildSchema) {
            var grid = this.grid,
                tree = grid.data,
                selectedNode = this.getSelectedNode();
                
            if (!selectedNode) selectedNode = tree.root;
            var parentNode = tree.getParent(selectedNode)

            if (selectedNode) {
                if (!selectedNode.isFolder) selectedNode = parentNode;
                var newNode = { 
                    name: this.getNextUniqueFieldName(selectedNode, "field"),
                    id: this.getNextUnusedNodeId(),
                    parentId: selectedNode ? selectedNode.id : null
                };
                this.addNode(newNode, selectedNode);
            }
        } else this.Super("newRecord", arguments);
    },
    getSelectedNode : function () {
        return this.grid.getSelectedRecord();
    },
    addNode : function (newNode, parentNode) {
        var tree = this.grid.data;

        tree.linkNodes([newNode]);
    },
    getNextUniqueFieldName : function (node, prefix) {
        var childFields = node ? node.fields || [] : [],
	        inc=1;

        if (!prefix || prefix.length == 0) prefix = "field";
        if (childFields && childFields.length > 0) {
            for (var i = 0; i < childFields.length; i++) {
                var item = childFields.get(i), 
                    itemName = item.name;
                if (itemName.substring(0, prefix.length) == prefix && itemName.length > prefix.length) {
                    var thisInc = parseInt(itemName.substring(prefix.length));
                    if (!isNaN(thisInc) && thisInc >= inc) 
                        inc = thisInc+1;
                }
            }
        }
        return prefix + inc;
    },
    getNextUnusedNodeId : function () {
        var tree = this.grid.data;
        for (var i = 1; i<10000; i++) {
            var item = tree.findById(i);
            if (!item) return i;
        }
        return 1;
    }
},

newButtonDefaults:{
    _constructor:isc.AutoFitButton,
    autoParent:"gridButtons",
    title: "New Field",
    click:"this.creator.newRecord()"
},

moreButtonDefaults:{
    _constructor:isc.AutoFitButton,
    autoParent:"gridButtons",
    click:"this.creator.editMore()",
    disabled:true
},

buttonLayoutDefaults: {
    _constructor: "HLayout",
    width: "100%"
},

saveButtonDefaults: {
    _constructor: "IButton",
    autoDraw: false,
    title: "Save",
    autoFit: true,
    autoParent: "buttonLayout",
    click: function(){
        var valid=true;
        if (this.creator.showMainEditor != false) valid = this.creator.mainEditor.validate();
        if (valid && this.creator.fieldEditor.validate()) this.creator.save();
    }
},

addChildButtonDefaults: {
    _constructor: "IButton",
    autoDraw: false,
    title: "Add Child Object",
    autoFit: true,
    click: function() {
        var editor = this.creator.fieldEditor,
            grid = editor.grid,
            tree = grid.data,
            selectedNode = grid.getSelectedRecord() || tree.root,
            parentNode = tree.getParent(selectedNode),
            newNode = {
                isFolder: true,
                children: [],
                multiple: true,
                childTagName: "item"
            }
        ;

        if (selectedNode) {
            if (!selectedNode.isFolder) selectedNode = parentNode;
            newNode.name = editor.getNextUniqueFieldName(selectedNode, "child"),
            newNode.id = editor.getNextUnusedNodeId(),
            newNode.parentId = selectedNode.id;
            tree.linkNodes([newNode], parentNode);
            tree.openFolder(newNode);
        }

    }
},

mainStackDefaults: {
    _constructor: "SectionStack",
    overflow: "visible",
    width: "100%", height:"100%",
    visibilityMode: "multiple"
},

instructionsSectionDefaults: {
    _constructor: "SectionStackSection",
    title: "Instructions",
    expanded:true, canCollapse:true
},

instructionsDefaults: {
    _constructor: "HTMLFlow", 
    autoFit:true,
    padding:10
},

mainSectionDefaults: {
    _constructor: "SectionStackSection",
    title:"DataSource Properties", 
    expanded:true, canCollapse:false
},

fieldSectionDefaults: {
    _constructor: "SectionStackSection",
    title:"DataSource Fields &nbsp;<span style='color:#BBBBBB'>(click to edit or press New)</span>", 
    expanded:true, canCollapse:false
},

fieldLayoutDefaults: {
    _constructor: "Layout",
    vertical:true,
   height: "*"
},

bodyProperties:{
    overflow:"auto",
    backgroundColor:"black",
    layoutMargin:10
},

// properties
canEditChildSchema: false,
canAddChildSchema: false,

// methods
editNew : function (dataSource, callback, instructions) {
    if (dataSource.defaults) {
        this.paletteNode = dataSource;
        this.start(dataSource.defaults, callback, true, instructions);
    } else {
        this.start(dataSource, callback, true, instructions);
    }
},
    
editSaved : function (dataSource, callback, instructions) {
    this.start(dataSource, callback, false, instructions);
},

start : function (dataSource, callback, isNew, instructions) {
    if (instructions) {
        this.mainStack.showSection(0);
        this.instructions.setContents(instructions);
    } else { 
        this.mainStack.hideSection(0);
    }

    if (this.mainEditor) this.mainEditor.clearValues();
    if (this.fieldEditor) this.fieldEditor.setData(null);

    // to be called when editing completes
    this.saveCallback = callback;

    this.logWarn("editing " + (isNew ? "new " : "" ) + 
                 "DataSource: " + this.echo(dataSource));

    if (!dataSource) {       
        // no initial dataSource properties at all, start editing from scratch 
        return this.show(); 
    }

    this.dsClass = dataSource.Class;
    if (isNew) {
        // dataSource has never been saved
        if (isc.isA.DataSource(dataSource)) {
            // serializeableFields picks up the fields data - also pick up the
            // sfName if it's defined
            var sfName = dataSource.sfName;
            // currently used only for web service / SalesForce pathways, where we
            // dynamically retrieve a DataSource generated from XML schema.
            dataSource = dataSource.getSerializeableFields();
            if (sfName) dataSource.sfName = sfName;
            
            this.logWarn("editing new DataSource from live DS, data: " + 
                         this.echo(dataSource));
        } else {
            dataSource.ID = this.getUniqueDataSourceID();
        }
        this._startEditing(dataSource);
    } else {
        // we need the clean initialization data for this DataSource (the live data
        // contains various derived state) 
        isc.DMI.callBuiltin({
            methodName: "loadSharedXML", 
            callback: this.getID() + "._loadSchemaReply(data)", 
            arguments: [
                "DS",
                dataSource.ID
            ]
        });
    }
},

// override point to provide a unique datasource-id
getUniqueDataSourceID : function () {
    return "newDataSource";
},

_loadSchemaReply : function (data) {
    //!OBFUSCATEOK
    // instantiate the DataSource in "captureInitData" mode, where Class.create()
    // returns a editComponent instead
    isc.captureInitData = true;
    var dsComponent = isc.eval(data.js);
    isc.captureInitData = null;

    var initData = dsComponent.defaults;
    this.logWarn("captured DS initData: " + this.echo(initData));

    // do some automatic defaulting otherwise done at DataSource.init()
    if (initData.serverType == "sql") initData.dataFormat = "iscServer";
    if (initData.recordXPath != null && initData.dataFormat == null) {
        initData.dataFormat = "xml";
    }

    this._startEditing(initData);
},
_startEditing : function (initData) {
    if (this.mainEditor) this.mainEditor.setValues(initData);
    else this.mainEditorValues = initData;
    var fields = initData.fields;

    if (!isc.isAn.Array(fields)) fields = isc.getValues(initData.fields);

    if (this.fieldEditor) {
        if (this.canEditChildSchema) {
            this.setupIDs(fields, 1, null);

            var tree = isc.Tree.create({
                modelType: "parent",
                childrenProperty: "fields",
                titleProperty: "name",
                idField: "id",
	            nameProperty: "id",
                root: { id: 0, name: "root"},
                data: fields
            });
            tree.openAll();
            this.fieldEditor.setData(tree);
        } else this.fieldEditor.setData(fields);
    }
    this.show();
},

setupIDs : function (fields, nextId, parentId) {
    var index=nextId,
        item,
        subItem
    ;

    if (!index) index = 1;
    for (var i = 0; i < fields.length; i++) {
        var item = fields.get(i);
        item.parentId = parentId;
        item.id = index++;
        if (item.fields) {
            if (!isc.isAn.Array(item.fields)) item.fields = isc.getValues(item.fields);
            index = this.setupIDs(item.fields, index, item.id);
        }
    }
    return index;
},

save : function () {
    // NOTE: dsClass is set when we begin editing
    var dsClass = this.dsClass || "DataSource",
        dsData = isc.addProperties({}, 
            this.mainEditor ? this.mainEditor.getValues() : this.mainEditorValues
        )
    ;
    
    if (this.canEditChildSchema) {
        var tree = this.fieldEditor.grid.data,
            fields = tree.getCleanNodeData(tree.getRoot(), true).fields;

        dsData.fields = this.getExtraCleanNodeData(fields);
    } else { 
        dsData.fields = this.fieldEditor.getData();
    }

    if (dsData.serverType == "sql" || dsData.serverType == "hibernate") {
        if (!dsData.fields.getProperty("primaryKey").or()) {
            isc.warn("SQL / Hibernate DataSources must have a field marked as the primary key");
            return; 
        }
    }

    this.doneEditing(dsData);

},

getExtraCleanNodeData : function (nodeList, includeChildren) {
    if (nodeList == null) return null;

    var nodes = [], 
        wasSingular = false;
    if (!isc.isAn.Array(nodeList)) {
        nodeList = [nodeList];
        wasSingular = true;
    }

    for (var i = 0; i < nodeList.length; i++) {
        var treeNode = nodeList[i],
            node = {};
        // copy the properties of the tree node, dropping some further Tree/TreeGrid artifacts
		for (var propName in treeNode) {
            if (propName == "id" || propName == "parentId" || propName == "isFolder") continue;

            node[propName] = treeNode[propName];

            // Clean up the children as well (if there are any)
            if (propName == this.fieldEditor.grid.data.childrenProperty && isc.isAn.Array(node[propName])) {
                node[propName] = this.getExtraCleanNodeData(node[propName]);
            }
        }
        nodes.add(node);
    }
    if (wasSingular) return nodes[0];
    return nodes;
},

doneEditing : function (dsData) {
    // handle custom subclasses of DataSource for which there is no schema defined by
    // serializing based on the DataSource schema but adding the _constructor property to
    // get the correct class.
    // XXX problem: if you ask an instance to serialize itself, and there is no schema for
    // it's specific class, it uses the superClass schema but loses it's Constructor
    // XXX we to preserve the class, we need to end up with the "constructor" property set
    // in XML, but this has special semantics in JS
    var dsClass = this.dsClass || "DataSource",
        schema;
    if (isc.DS.isRegistered(dsClass)) {
        schema = isc.DS.get(dsClass);
    } else {
        schema = isc.DS.get("DataSource");
        dsData._constructor = dsClass;
    }

    // explicit class properties:
    // - in XML: "constructor" or xsi:type in instances, or "instanceConstructor" in schema
    // - for ClassFactory.newInstance(): _constructor

    // serialize to XML and save to server
    var xml = schema.xmlSerialize(dsData);
    this.logWarn("saving DS with XML: " + xml);

    isc.DMI.callBuiltin({
        methodName: "saveSharedXML",
        arguments: [
            "DS",
            dsData.ID,
            xml
        ]
    });

    // create a live instance
    var liveDS = isc.ClassFactory.getClass(dsClass).create(dsData);

    // fire the callback passed in when editing began
    this.fireCallback(this.saveCallback, "dataSource", [liveDS]);
    this.saveCallback = null;
},
clear : function () {
    if (this.mainEditor) this.mainEditor.clearValues();
    else this.mainEditorValues = null;
    this.fieldEditor.setData([]);
},

initWidget : function () {
    this.Super('initWidget', arguments);

    this.addAutoChildren(["mainStack", "fieldLayout", "instructions", "mainEditor", 
        "buttonLayout", "saveButton"]);

    if (this.canAddChildSchema) {
        this.canEditChildSchema = true;
        this.addAutoChild("addChildButton");
    }

    this.addAutoChild("fieldEditor", {
		gridConstructor: this.canEditChildSchema ? isc.TreeGrid : isc.ListGrid,
        showMoreButton: this.showMoreButton,
        newButtonTitle: "New Field",
		newButtonDefaults: this.newButtonDefaults,
        newButtonProperties: this.newButtonProperties,
		moreButtonDefaults: this.moreButtonDefaults,
        moreButtonProperties: this.moreButtonProperties
    });
    this.moreButton = this.fieldEditor.moreButton;
    this.newButton = this.fieldEditor.newButton;

    if (this.canAddChildSchema) this.fieldEditor.gridButtons.addMember(this.addChildButton);

    this.fieldLayout.addMembers([ this.fieldEditor, this.saveButton ]);

    var stack = this.mainStack;

    stack.addSections([isc.addProperties(this.instructionsSectionDefaults,
        this.instructionsSectionProperties,
        { items:[this.instructions] }
    )]);

	stack.addSections([isc.addProperties(this.mainSectionDefaults,
        this.mainSectionProperties,
        { items:[this.mainEditor] }
    )]);
    if (this.showMainEditor==false) stack.hideSection(1);

    stack.addSections([isc.addProperties(this.fieldSectionDefaults,
        this.fieldSectionProperties,
        { items:[this.fieldLayout] }
    )]);

}

});

}
