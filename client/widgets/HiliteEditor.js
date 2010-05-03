/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-05-02 (2010-05-02)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 




// Hilite Rule
// ---------------------------------------------------------------------------------------
// Interface for defining and editing a single grid hilite Rule

//>	@class HiliteRule
// A widget for editing the criteria of a single +link{class:DataboundComponent} hilite.  
// The default implementation presents a series of +link{class:FormItem, formItems}
// for selecting the various elements of a simple criterion and a foreground or background
// color.  To specify more complex criteria, include both foreground and background colors or
// to apply the hilite to multiple fields, you can create an 
// +link{class:AdvancedHiliteEditor, advanced hilite rule}.
//
// @visibility hiliteEditor
//<
isc.defineClass("HiliteRule", "HStack");

isc.HiliteRule.addProperties({
    height: 1,

    //> @attr hiliteRule.clause (AutoChild : null : IR)
    // AutoChild +link{class:FilterClause} displaying the +{class:FormItem, formItems} used to 
    // specify the criteria for this HiliteRule.
    //
    // @visibility hiliteEditor
    //<
    clauseConstructor: "FilterClause",

    //> @attr hiliteRule.hiliteForm (AutoChild : null : IR)
    // AutoChild +link{class:DynamicForm} displaying the +{class:FormItem, formItems} used to 
    // specify the hiliting properties of this rule.
    //
    // @visibility hiliteEditor
    //<
    hiliteFormDefaults: {
        _constructor: "DynamicForm",
        numCols: 3,
        items: [
            { name: "cycler", type: "CycleItem", showTitle: false, valign: "center", 
                valueMap: { foreground: "Foreground", background: "Background" },
                valueIcons: { 
                    foreground: "[SKINIMG]/DynamicForm/checked.png",
                    background: "[SKINIMG]/DynamicForm/unchecked.png"
                },
                defaultValue: "foreground"
            },
            { name: "color", title: "Color", type: "ColorItem", width: 80 }
        ]
    },

    advancedClauseLayout: {
        _constructor: "HStack",
        height: 1,
        width: "100%"
    },

    //> @attr hiliteRule.advancedClauseLabel (AutoChild : null : IR)
    // AutoChild +link{class:Label} displaying the human-readable description of an advanced
    // hilite-rule.
    //
    // @visibility hiliteEditor
    //<
    advancedClauseLabelDefaults: {
        _constructor: "Label",
        width: 645,
        maxWidth: 800,
        overflow: "hidden",
        height: 18,
        valign: "center",
        wrap: false,
        padding: 1
    },

    //> @attr hiliteRule.advancedClauseEditButton (AutoChild : null : IR)
    // AutoChild +link{class:ImgButton} displayed after an after hilite-rule and used to open
    // it for editing in an AdvancedHiliteEditor.
    //
    // @visibility hiliteEditor
    //<
    advancedClauseEditButtonDefaults: {
        _constructor: "ImgButton",
        width: 18, height: 18, layoutAlign: "center",
        src: "[SKINIMG]/actions/edit.png", 
        showRollOver:false, showDown:false, showDisabled:false, 
        click: function () { this.creator.editAdvancedRule(); }
    },

    //> @attr HiliteRule.showRemoveButton (boolean : true : IR) 
    // If true, show a button for this HiliteRule, allowing it to be removed. 
    //
    // @visibility hiliteEditor
    //<
    showRemoveButton:true,

    //> @attr hiliteRule.removeButtonPrompt (string : "Remove" : IR) 
    // The hover prompt text for the remove button. 
    //
    // @group i18nMessages 
    // @visibility hiliteEditor
    //<
    removeButtonPrompt: "Remove",

    //> @attr hiliteRule.removeButton (AutoChild : null : IR) 
    // The Hilite removal ImgButton that appears before this Hilite if +link{showRemoveButton} is set.
    // 
    // @visibility hiliteEditor
    //<
    removeButtonDefaults : {
        _constructor:isc.ImgButton,
        width:18, height:18, layoutAlign:"center",
        src:"[SKIN]/actions/remove.png",
        showRollOver:false, showDown:false, showDisabled:false, 
        click: function () { this.creator.remove(); }
    }

});

isc.HiliteRule.addMethods({

    initWidget: function () {
    
        if (!this.isAdvanced && this.criterion) {
            var criteria = this.criterion.criteria;
            if (criteria.criteria && isc.isAn.Array(criteria.criteria))
                // the criterion we were passed is really an advancedCriteria - switch on 
                // this.isAdvanced so we show an appropriate UI
                this.isAdvanced = true;
        }

        if (this.isAdvanced) {
            // need to show a removeButton, label and editButton here instead of an isc.FilterClause
            var description = isc.FilterBuilder.getFilterDescription(
                this.criterion.criteria, 
                this.dataSource
            );

            this.membersMargin = 2;
            this.addAutoChild("removeButton");
            this.addAutoChild("advancedClauseLabel", 
                {
                    contents: description,
                    prompt: description
                }
            );
            this.addAutoChild("advancedClauseEditButton"); 
            this.addMembers([
                this.removeButton, this.advancedClauseLabel, this.advancedClauseEditButton
            ]);
        } else {
            this.addAutoChild("clause", 
                { 
                    dataSource: this.dataSource,
                    fieldName: this.fieldName,
                    criterion: this.criterion ? this.criterion.criteria : null,
                    showRemoveButton: this.showRemoveButton,
                    remove : function () {
                        this.creator.remove();
                    }
                }
            );
            this.addMember(this.clause);
            this.addAutoChild("hiliteForm");
            if (this.criterion) {
                this.hiliteForm.setValues(
                    { 
                        cycler: (this.criterion.textColor ? "foreground" : "background"),
                        color: (this.criterion.textColor ? this.criterion.textColor : this.criterion.backgroundColor)
                    }
                );
            }
            this.addMember(this.hiliteForm);
        }
    },
    
//> @method hiliteRule.remove()
// Remove this HiliteRule.  Default implementation calls markForDestroy(). 
//
// @visibility external
//<
    remove : function () {
        this.markForDestroy();
    },

//> @method hiliteRule.getHiliteRule()
// Return the definition of this HiliteRule, including criteria and hilite properties.
//
// @visibility external
//<
    getHiliteRule : function () {
        var result = isc.addProperties(this.criterion, { fieldName: this.fieldName });

        if (this.isAdvanced) {
            result = this.criterion;
        } else {
            var cycleValue = this.hiliteForm.getValue("cycler"),
                colorValue = this.hiliteForm.getValue("color"),
                criterion = this.clause.getCriterion();

            result.criteria = criterion;

            if (cycleValue == "foreground") {
                result.textColor = colorValue;
                result.cssText = "color:" + colorValue + ";";
            } else {
                result.backgroundColor = colorValue;
                result.cssText = "background-color:" + colorValue + ";";
            }
            
            if (this.criterion && this.criterion.id) result.id = this.criterion.id;
        }

        return result;
    },

//> @method hiliteRule.editAdvancedRule()
// Show an +link{class:AdvancedHiliteEditor} to edit this advanced rule.
//
// @visibility external
//<
    editAdvancedRule : function () {
        var callback = this.getID()+".editAdvancedRuleReply(criteria)";

        this.advancedHiliteDialog = isc.Window.create({
            title: "Advanced Hilite Editor",
            width: isc.Page.getWidth()/2,
            height: 300,
            overflow: "visible",
            isModal: true,
            showModalMask: true,
            showResizer: true,
            autoCenter: true,
            items: [
                isc.AdvancedHiliteEditor.create({
                    width: "100%", height: "100%",
                    dataSource: this.fieldDataSource ? null : this.dataSource,
                    fieldDataSource: this.fieldDataSource,
                    criteria: this.criterion,
                    callback: callback
                })
            ]
        });

        this.advancedHiliteDialog.show();
    },

    editAdvancedRuleReply : function (criteria) {
        this.advancedHiliteDialog.hide();
        this.advancedHiliteDialog.markForDestroy();
        
        if (criteria) {

            this.criterion = criteria;

            var description = isc.FilterBuilder.getFilterDescription(
                this.criterion.criteria, 
                this.dataSource
            );

            this.advancedClauseLabel.setContents(description);
            this.advancedClauseLabel.setPrompt(description);
        }
    }

});


// Hilite Editor
// ---------------------------------------------------------------------------------------
// Interface for defining and editing grid hilites 

//>	@class HiliteEditor
// A widget for defining and editing a set of +link{class:HiliteRule, hilite rules} for use by 
// +link{class:DataboundComponent, databoundComponents}.  Presents a list of available fields 
// and allows editing of simple hilites directly and more complex hilites via  
// +link{class:AdvancedHiliteEditor}s. 
//
// @visibility hiliteEditor
//<
isc.defineClass("HiliteEditor", "VLayout");

isc.HiliteEditor.addProperties({

    mainLayoutDefaults : {
        _constructor:"HLayout",
        width: "100%",
        extraSpace: 5
    },

    fieldLayoutDefaults: {
        _constructor: "VLayout",
        width: 180,
        autoParent: "mainLayout",
        showResizeBar: true
    },
    
    //> @attr hiliteEditor.advancedRuleButton (AutoChild : null : IR)
    // AutoChild +link{class:IButton} that opens an +link{AdvancedHiliteEditor} to create a new
    // advanced rule.
    //
    // @visibility hiliteEditor
    //<
    addAdvancedHiliteButtonDefaults: {
        _constructor: "IButton",
        title: "Add Advanced Rule",
        align: "center",
        width: "100%",
        height: 22,
        autoParent: "fieldLayout",
        click: function () {
            this.creator.addAdvancedHilite();
        }
    },
    
    //> @attr hiliteEditor.fieldList (AutoChild : null : IR)
    // AutoChild +link{class:ListGrid} showing the list of fields to create hilites for.
    //
    // @visibility hiliteEditor
    //<
    fieldListDefaults: {
        _constructor: "ListGrid",
        width: "100%",
        height: "*",
        autoParent: "fieldLayout",
        fields: [
            { name: "name", showIf: "false" },
            { name: "title", title: "Available Fields"}
        ],
        recordClick : function (grid, record) {
            this.creator.addHilite(record);
        }
    },

    ruleLayoutDefaults : {
        _constructor:"VLayout",
        top: 22,
        membersMargin: 1,
        padding: 1,
        overflow: "auto",
        autoParent: "mainLayout",
        border: "1px solid grey",
        width: "100%",
        height: "100%"
    },

    //> @attr hiliteEditor.hiliteRule (AutoChild : null : IR)
    // AutoChild +link{class:HiliteRule} used to create new simple hilites.
    //
    // @visibility hiliteEditor
    //<
    hiliteRuleDefaults: {
        _constructor: "HiliteRule"
    },

    hiliteButtonsDefaults : {
        _constructor:"HLayout", 
        membersMargin:8, height:1
    },

    //> @attr hiliteEditor.saveButton (AutoChild : null : IR)
    // Saves the hilites in this editor.
    //
    // @visibility hiliteEditor
    //<
    saveButtonDefaults : {
        _constructor:"IButton", 
        autoParent:"hiliteButtons",
        title:"Save",
        click : function () {
            this.creator.saveHilites();
        }
    },
    //> @attr hiliteEditor.cancelButton (AutoChild : null : IR)
    // Cancels this HiliteEditor without saving changes.
    //
    // @visibility hiliteEditor
    //<
    cancelButtonDefaults : {
        _constructor:"IButton", 
        autoParent:"hiliteButtons",
        title:"Cancel",
        click : function () {
            this.creator.completeEditing();
        }
    },

    // overall layout
    // ---------------------------------------------------------------------------------------
    defaultWidth:800, defaultHeight:300


    //> @attr hiliteEditor.callback (Callback : null : IR)
    // The callback to fire when +link{hiliteEditor.saveHilites} is called.
    //
    // @visibility hiliteEditor
    //<
});

isc.HiliteEditor.addMethods({

    initWidget : function () {
        this.Super("initWidget", arguments);

        this.addAutoChildren([
            "mainLayout", 
            "fieldLayout", "addAdvancedHiliteButton", "fieldList",
            "ruleLayout",
            "hiliteButtons", "saveButton", "cancelButton"
        ]);

        if (this.fieldDataSource) {
            this.fieldList.autoFetchData = true;
            this.fieldList.setDataSource(this.fieldDataSource);
            this.fieldList.setFields([
                { name: "name", showIf: "false" },
                { name: "title", title: "Available Fields" },
                { name: "type", showIf: "false" }
            ]);
        } else {
            var ds = this.getDataSource();

            var fieldNames = this.fieldNames || ds.getFieldNames(),
                fieldListData = this.fieldListData = [];
            for (var i = 0; i < fieldNames.length; i++) {
                var fieldName = fieldNames[i],
                    field = ds.getField(fieldName),
                    fieldTitle = field.title;
                if (field.hidden) continue;
                fieldTitle = fieldTitle ? fieldTitle : fieldName;
                fieldListData.add({name: fieldName, title: fieldTitle})
            }
            this.fieldListData = fieldListData;
            this.fieldList.setData(this.fieldListData);
        }
        this.fieldList.markForRedraw();

        this.setHilites(this.hilites);
    },

    //> @method hiliteEditor.addHilite()
    // Adds a new HiliteRule for a passed record.
    //
    // @visibility hiliteEditor
    //<
    addHilite : function (record) {
        var newRule = this.createAutoChild("hiliteRule", {
            width: "100%",
            fieldName: record.name,
            dataSource: this.dataSource
        });
      
        this.showNewHilite(newRule);
    },
    //> @method hiliteEditor.removeHilite()
    // Removes a Hilite.
    //
    // @visibility hiliteEditor
    //<
    removeHilite : function (hilite) {
        this.ruleLayout.members.remove(hilite);
        hilite.destroy();
    },

    showNewHilite : function (newRule) {
        this.ruleLayout.addMember(newRule);
    },

    //> @method hiliteEditor.addAdvancedHilite()
    // Shows a dialog to add a new Advanced HiliteRule.
    //
    // @visibility hiliteEditor
    //<
    addAdvancedHilite : function () {
        var callback = this.getID()+".addAdvancedHiliteReply(criteria)";

        this.advancedHiliteDialog = isc.Window.create({
            title: "Advanced Hilite Editor",
            width: isc.Page.getWidth()/2,
            height: 300,
            isModal: true,
            showModalMask: true,
            showResizer: true,
            canDragResize: true,
            autoCenter: true,
            items: [
                isc.AdvancedHiliteEditor.create({
                    width: "100%", height: "100%",
                    dataSource: this.fieldDataSource ? null : this.dataSource,
                    fieldDataSource: this.fieldDataSource,
                    callback: callback
                })
            ]
        });

        this.advancedHiliteDialog.show();
    },

    addAdvancedHiliteReply : function (criteria) {
        this.advancedHiliteDialog.hide();
        this.advancedHiliteDialog.markForDestroy();

        if (!criteria) return;

        var newRule = this.createAutoChild("hiliteRule", {
            width: "100%",
            isAdvanced: true,
            dataSource: this.dataSource,
            fieldDataSource: this.fieldDataSource,
            fieldName: criteria.fieldName,
            criteria: criteria,
            criterion: criteria
        });

        this.showNewHilite(newRule);
    },

    //> @method hiliteEditor.clearHilites()
    // Clear all Hilite.
    //
    // @visibility hiliteEditor
    //<
    clearHilites : function () {
        for (var i=this.ruleLayout.members.length-1; i>=0; i--)
            this.removeHilite(this.ruleLayout.getMember(i));
    },
    
    //> @method hiliteEditor.setHilites()
    // Initialize this editor with a set of Hilites.
    //
    // @visibility hiliteEditor
    //<
    setHilites : function (hilites) {

        hilites = this.hilites = hilites || [];

        for (var i=0; i<hilites.length; i++) {
            var hilite = hilites[i],
                newRule = this.createAutoChild("hiliteRule", 
                    {
                        fieldName: hilite.fieldName,
                        criterion: hilite,
                        dataSource: this.dataSource
                    }
                )
            ;
      
            this.showNewHilite(newRule);
        }
    },

    //> @method hiliteEditor.saveHilites()
    // Save the set of Hilites and fire the +link{hiliteEditor.callback, callback};
    //
    // @visibility hiliteEditor
    //<
    saveHilites : function (callback) {
        var rules = this.ruleLayout.members,
            hilites = []
        ;

        for (var i=0; i<rules.length; i++) {
            var rule = rules[i],
                result = rule.getHiliteRule();

            hilites.add(result);
        }

        this.completeEditing(hilites);
    },
    
    completeEditing : function (hilites) {
        isc.logWarn("returning hilites: " + isc.echoFull(hilites));
        if (this.callback) this.fireCallback(this.callback, "hilites", [hilites]);
    }    
});


//>	@class AdvancedHiliteEditor 
// A widget for editing a single, advanced +link{class:HiliteRule, hilite rule} for use by  
// +link{class:DataboundComponent, databoundComponents}.  Where a simple hilite provides  
// configuration of a single criterion and either foreground or background color for  
// application to a single field, an advanced hilite can specify more complex criteria which can 
// both test and affect multiple fields and allow both background and foreground colors to 
// be specified in a single rule. 
// 
// @visibility hiliteEditor
//<
isc.defineClass("AdvancedHiliteEditor", "VStack");

isc.AdvancedHiliteEditor.addProperties({
    // editor for advanced  highlights
    // ---------------------------------------------------------------------------------------

    //> @attr advancedHiliteEditor.filterBuilder (AutoChild : null : IR)
    // AutoChild +link{class:FilterBuilder} for configuring the criteria for this Hilite.
    //
    // @visibility hiliteEditor
    //<
    filterBuilderDefaults : {
        _constructor:"FilterBuilder",
        isGroup:true,
        groupTitle:"Filter",
        padding:8,
        maxHeight: 200,
        overflow: "automatic"
    },
    
    //> @attr advancedHiliteEditor.hiliteForm (AutoChild : null : IR)
    // AutoChild +link{class:DynamicForm} for configuring the details of this Hilite.
    //
    // @visibility hiliteEditor
    //<
    hiliteFormDefaults : {
        _constructor:"DynamicForm",
        isGroup:true,
        groupTitle:"Appearance",
        extraSpace:4,
        padding:8,
        numCols:4
    },

    hiliteButtonsDefaults : {
        _constructor:isc.HLayout, 
        membersMargin:8, height:1
    },

    //> @attr advancedHiliteEditor.saveButton (AutoChild : null : IR)
    // Accepts this Hilite and fires the +{advancedHiliteEditor.callback, callback}.
    //
    // @visibility hiliteEditor
    //<
    saveButtonDefaults : {
        _constructor:"IButton", 
        autoParent:"hiliteButtons",
        title:"Save",
        click : function () {
            this.creator.saveHilite();
        }
    },

    //> @attr advancedHiliteEditor.cancelButton (AutoChild : null : IR)
    // Cancels this AdvancedHiliteEditor without saving any changes.
    //
    // @visibility hiliteEditor
    //<
    cancelButtonDefaults : {
        _constructor:"IButton", 
        autoParent:"hiliteButtons",
        title:"Cancel",
        click : function () {
            this.creator.cancelEditing();
        }
    },

    // overall layout
    // ---------------------------------------------------------------------------------------
    defaultWidth:800, defaultHeight:600,
    visibilityMode:"multiple",


    //> @attr advancedHiliteEditor.invalidCriteriaPrompt (string : "Either enter valid criteria or hit 'Cancel' to abandon changes." : IR) 
    // The message to show when the user clicks "Save" without entering any criteria. 
    //
    // @group i18nMessages 
    // @visibility hiliteEditor
    //<
    invalidCriteriaPrompt: "Either enter valid criteria or hit 'Cancel' to abandon changes."

    //> @attr advancedHiliteEditor.callback (Callback : null : IR)
    // The callback to fire when the +link{advancedHiliteEditor.saveButton} is clicked.
    //
    // @visibility hiliteEditor
    //<
});

isc.AdvancedHiliteEditor.addMethods({
    
    initWidget : function () {
        this.Super("initWidget", arguments);

        var ds = this.getDataSource();

        this.addAutoChild("filterBuilder", 
            { dataSource: ds, fieldDataSource: this.fieldDataSource }
        );

        var items = [
            {title:"Target Field(s)", name:"fieldName", multiple:true, type:"select", rowSpan:2,
             defaultDynamicValue:"isc.firstKey(item.valueMap)"},
            {title:"Text", name:"textColor", type:"color" },
            {title:"Background", name:"backgroundColor", type:"color" }
        ];

        this.addAutoChild("hiliteForm");
        
        if (this.fieldDataSource) {
            items[0] = isc.addProperties({}, items[0], {
                height: 100,
                valueField: "name",
                displayField: "title",
                optionDataSource: this.fieldDataSource
            });
            delete items[0].defaultDynamicValue;
            this.hiliteForm.addItems(items);
        } else {
            this.hiliteForm.addItems(items);
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
        }

        this.addAutoChildren(["hiliteButtons", "saveButton", "cancelButton"]);

        this.addMembers([this.filterBuilder, this.hiliteForm, this.hiliteButtons]);

        if (this.criteria != null) {
            // we're editing an existing hilite
            this.filterBuilder.setCriteria(this.criteria.criteria);
            this.hiliteForm.editRecord(this.criteria);
        }

    },

    //> @method advancedHiliteEditor.saveHilite()
    // Save changes and fire the +link{advancedHiliteEditor.callback, callback}.
    //
    // @visibility hiliteEditor
    //<
    saveHilite : function () {
        this.hiliteForm.setValue("criteria", this.filterBuilder.getCriteria());
        var hilite = this.hiliteForm.getValues();

        if (hilite.criteria.criteria == null || hilite.criteria.criteria.length == 0) {
            isc.say(this.invalidCriteriaPrompt);
            return;
        }

        var cssText = "";

        if (hilite.textColor && hilite.textColor != "") {
            cssText += "color:"+hilite.textColor+";";
        } 
        if (hilite.backgroundColor && hilite.backgroundColor != "") {
            cssText += "background-color:"+hilite.backgroundColor+";";
        }

        hilite.cssText = cssText;
        if (this.criteria && this.criteria.id) hilite.id = this.criteria.id;
        
        this.completeEditing(hilite);
    },
    
    //> @method advancedHiliteEditor.cancelEditing()
    // Discard changes and fire the +link{advancedHiliteEditor.callback, callback} with a null parameter.
    //
    // @visibility hiliteEditor
    //<
    cancelEditing : function () {
        this.completeEditing(null);        
    },

    completeEditing : function (result) {
        if (this.callback) this.fireCallback(this.callback, ["criteria"], [result]);
    }    
});

