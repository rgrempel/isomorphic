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

 




// Hilite Rule
// ---------------------------------------------------------------------------------------
// Interface for defining and editing a single grid hilite Rule

//>	@class HiliteRule
// A widget for editing the criteria of a single +link{class:DataBoundComponent} hilite.  
// The default implementation presents a series of +link{class:FormItem, formItems}
// for selecting the various elements of a simple criterion and a foreground or background
// color.  To specify more complex criteria, include both foreground and background colors or
// to apply the hilite to multiple fields, you can create an 
// +link{class:AdvancedHiliteEditor, advanced hilite rule}.
//
// @visibility hiliteEditor
//<
isc.defineClass("HiliteRule", "HLayout");

isc.HiliteRule.addProperties({
    height: 1,

    //> @attr hiliteRule.clause (AutoChild : null : IR)
    // AutoChild +link{class:FilterClause} displaying the +{class:FormItem, formItems} used to 
    // specify the criteria for this HiliteRule.
    //
    // @visibility hiliteEditor
    //<
    clauseConstructor: "FilterClause",
	
	clauseProperties: {
		width: "50%",
		fieldPickerWidth: "*",
		operatorPickerWidth: 140,
		valueFieldWisth: 100,
        excludeNonFilterableFields: false
	},

    //> @attr hiliteRule.hiliteForm (AutoChild : null : IR)
    // AutoChild +link{class:DynamicForm} displaying the +{class:FormItem, formItems} used to 
    // specify the hiliting properties of this rule.
    //
    // @visibility hiliteEditor
    //<
    hiliteFormDefaults: {
        _constructor: "DynamicForm",
        numCols: 3,
		colWidths: ["*", 40, "45%"],
		width: "*",
        items: [
            { name: "colorType", type: "SelectItem", showTitle: false, valign: "center", 
                valueMap: { foreground: "Foreground", background: "Background" },
                defaultValue: "foreground", width: "*"
            },
            { name: "color", title: "Color", type: "ColorItem", width: "*" }
        ]
    },

    advancedClauseLayoutDefaults: {
        _constructor: "HLayout",
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
		autoParent: "advancedClauseLayout",
        width: "*",
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
		autoParent: "advancedClauseLayout",
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
        hoverWidth:80,
        click: function () { this.creator.remove(); }
    }

});

isc.HiliteRule.addMethods({

    initWidget: function () {
    
        if (!this.isAdvanced && this.hilite) {
            var criteria = this.hilite.criteria;
            if (criteria && criteria.criteria && isc.isAn.Array(criteria.criteria))
                // the criterion we were passed is really an advancedCriteria - switch on 
                // this.isAdvanced so we show an appropriate UI
                this.isAdvanced = true;
        }

        if (isc.isA.String(this.dataSource)) this.dataSource = isc.DS.getDataSource(this.dataSource);

        // make sure cssText and textColor/backgroundColor attributes are in sync
        if (this.hilite) this.checkHiliteProperties(this.hilite);

        if (this.isAdvanced) {
            // need to show a removeButton, label and editButton here instead of an isc.FilterClause
            var description = isc.FilterBuilder.getFilterDescription(
                this.hilite.criteria, 
                this.dataSource
            );

            var missingField = (description.indexOf(isc.FilterBuilder.missingFieldPrompt) >= 0);

            this.membersMargin = 2;
			this.addAutoChild("advancedClauseLayout");
            this.addAutoChild("removeButton", 
                { 
                    disabled: missingField ? true : false, 
                    autoParent: "advancedClauseLayout" 
                }
            );
            this.addAutoChild("advancedClauseLabel", 
                {
                    contents: description,
                    prompt: description,
                    disabled: missingField ? true : false
                }
            );
            this.addAutoChild("advancedClauseEditButton", { disabled: missingField ? true : false }); 
        } else {
            var missingField = (this.dataSource.getField(this.fieldName) == null);

            this.addAutoChild("clause", 
                { 
                    dataSource: this.dataSource,
                    field: this.dataSource.getField(this.fieldName),
                    fieldName: this.fieldName,
                    criterion: this.hilite ? this.hilite.criteria : null,
                    showRemoveButton: this.showRemoveButton,
                    disabled: missingField ? true : false,
                    remove : function () {
                        this.creator.remove();
                    }
                }
            );
            this.addMember(this.clause);
            this.addAutoChild("hiliteForm", { disabled: missingField ? true : false });
            if (this.hilite) {
                this.hiliteForm.setValues(
                    { 
                        colorType: (this.hilite.textColor ? "foreground" : "background"),
                        color: (this.hilite.textColor ? this.hilite.textColor : this.hilite.backgroundColor)
                    }
                );
            }
            this.addMember(this.hiliteForm);
        }
    },

    checkHiliteProperties : function (hilite) {
        if (!hilite) return;
        
        if (hilite.cssText) {
            // the hilite has cssText - ensure it coincides with the direct textColor and
            //  backgroundColor attributes
            var cssElements = hilite.cssText.split(";");

            for (var i=0; i<cssElements.length; i++) {
                var item = cssElements[i],
                    parts = item.split(":")
                ;

                if (parts[0] == "textColor" && !hilite.textColor)
                    hilite.textColor = parts[1];
                else if (parts[0] == "backgroundColor" && !hilite.backgroundColor)
                    hilite.backgroundColor = parts[1];
            }
        } else if (hilite.textColor || hilite.backgroundColor) {
            // no cssText but color attributes are set - build cssText now
            hilite.cssText = "";
            if (hilite.textColor) 
                hilite.cssText += "color:" + hilite.textColor + ";";
            if (hilite.backgroundColor) 
                hilite.cssText += "background-color:" + hilite.backgroundColor + ";";
            
            alert(hilite.cssText);
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

//> @method hiliteRule.getHilite()
// Return the hilite definition being edited, including criteria and hilite properties.
//
// @return (Hilite) the hilite 
// @visibility external
//<
    getHilite : function () {

        if (this.isAdvanced) {
            // externally edited in advanced editor
            return this.hilite;
        }
        var hilite = this.hilite = 
                isc.addProperties(this.hilite || {}, { fieldName: this.fieldName }),
            colorTypeValue = this.hiliteForm.getValue("colorType"),
            colorValue = this.hiliteForm.getValue("color"),
            criterion = this.clause.getCriterion();

        hilite.criteria = criterion;

        if (colorTypeValue == "foreground") {
            hilite.textColor = colorValue;
            hilite.cssText = "color:" + colorValue + ";";
        } else {
            hilite.backgroundColor = colorValue;
            hilite.cssText = "background-color:" + colorValue + ";";
        }
            
        if (this.hilite && this.hilite.id) hilite.id = this.hilite.id;

        return hilite;
    },

//> @method hiliteRule.editAdvancedRule()
// Show an +link{class:AdvancedHiliteEditor} to edit this advanced rule.
//
// @visibility external
//<
    editAdvancedRule : function () {
        var callback = this.getID()+".editAdvancedRuleReply(hilite)";

        this.advancedHiliteDialog = isc.Window.create({
            title: "Advanced Hilite Editor",
            width: Math.round(isc.Page.getWidth()/2),
            height: 1,
            isModal: true,
            showModalMask: true,
            showResizer: true,
            autoSize: true,
            autoCenter: true,
            items: [
                isc.AdvancedHiliteEditor.create({
                    width: "100%", height: "100%",
                    dataSource: this.fieldDataSource ? null : this.dataSource,
                    fieldDataSource: this.fieldDataSource,
                    hilite: this.hilite,
                    callback: callback
                })
            ]
        });

        this.advancedHiliteDialog.show();
    },

    editAdvancedRuleReply : function (hilite) {
        this.advancedHiliteDialog.hide();
        this.advancedHiliteDialog.markForDestroy();
        
        if (hilite) {

            this.hilite = hilite;

            var description = isc.FilterBuilder.getFilterDescription(
                this.hilite.criteria, 
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
// +link{class:DataBoundComponent, dataBoundComponents}.  Presents a list of available fields 
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
        overflow: "hidden",
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
		layoutMargin: 5,
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

        this.setDataSource(this.dataSource);

        this.setHilites(this.hilites);
    },

    setDataSource : function (ds) {
        this.dataSource = ds;
        if (this.fieldDataSource && !this.fieldDataSource._autoDerived) {
            this.setupFieldList();
        } else if (this.dataSource) {
            this.getClientOnlyFieldDS();
        } else {
            this.logWarn("No DataSource present, can't edit hilites");
        }
        this.fieldList.markForRedraw();
    },

    setFieldDataSource : function (ds) {
        this.fieldDataSource = ds;
        this.setupFieldList();
    },

    // override point - if showFieldList is false, override this method to set up data for 
    // whatever replacement list is provided
    setupFieldList : function () {
        this.fieldList.showFilterEditor = true;
        this.fieldList.setDataSource(this.fieldDataSource);
        this.fieldList.setFields([
            { name: "name", showIf: "false" },
            { name: "title", title: "Available Fields" },
            { name: "type", showIf: "false" }
        ]);
        this.fieldList.fetchData();
    },

    getClientOnlyFieldDS : function () {
        var sourceFields = isc.getValues(this.dataSource.getFields());
        var fields = [];
        for (var i = 0; i < sourceFields.length; i++) {
            var field = sourceFields[i];
            if (!field.hidden) fields.add(field);
        }
        this.fieldDataSource = isc.DataSource.create({
            _autoDerived:true,
            fields: [
                { name: "name", showIf: "false" },
                { name: "title", title: "Available Fields" },
                { name: "type", showIf: "false" }
            ],
            cacheData: fields,
            clientOnly: true
        });

        this.setupFieldList();
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
        var callback = this.getID()+".addAdvancedHiliteReply(hilite)";

        this.advancedHiliteDialog = isc.Window.create({
            title: "Advanced Hilite Editor",
            width: Math.round(isc.Page.getWidth()/2),
            height: 1,
            isModal: true,
            showModalMask: true,
            showResizer: true,
            canDragResize: true,
            autoSize: true,
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

    addAdvancedHiliteReply : function (hilite) {
        this.advancedHiliteDialog.hide();
        this.advancedHiliteDialog.markForDestroy();

        if (!hilite) return;

        var newRule = this.createAutoChild("hiliteRule", {
            width: "100%",
            isAdvanced: true,
            dataSource: this.dataSource,
            fieldDataSource: this.fieldDataSource,
            fieldName: hilite.fieldName,
            hilite : hilite
        });

        this.showNewHilite(newRule);
    },

    //> @method hiliteEditor.clearHilites()
    // Clear all Hilite.
    //
    // @visibility hiliteEditor
    //<
    clearHilites : function () {
        for (var i = this.ruleLayout.members.length-1; i >= 0; i--)
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
                        hilite: hilite,
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

        for (var i = 0; i < rules.length; i++) {
            var rule = rules[i],
                hilite = rule.getHilite();

            hilites.add(hilite);
        }

        this.completeEditing(hilites);
    },
    
    completeEditing : function (hilites) {
        if (this.logIsInfoEnabled()) this.logInfo("returning hilites: " + isc.echoFull(hilites));
        if (this.callback) this.fireCallback(this.callback, "hilites", [hilites]);
    }    
});


//>	@class AdvancedHiliteEditor 
// A widget for editing a single, advanced +link{class:HiliteRule, hilite rule} for use by  
// +link{class:DataBoundComponent, dataBoundComponents}.  Where a simple hilite provides  
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

    padding: 10,
    membersMargin: 10,

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
        overflow: "visible"
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
        width:"100%",
        numCols: 6,
        colWidths:[200,150,100,150,100,150]
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


    //> @attr advancedHiliteEditor.invalidHilitePrompt (string : "Enter at least one rule, a color and a target field, or press 'Cancel' to abandon changes." : IR) 
    // The message to show when the user clicks "Save" without entering any criteria. 
    //
    // @group i18nMessages 
    // @visibility hiliteEditor
    //<
    invalidHilitePrompt: "Enter at least one rule, a color and a target field, or press 'Cancel' to abandon changes."

    //> @attr advancedHiliteEditor.callback (Callback : null : IR)
    // The callback to fire when the +link{advancedHiliteEditor.saveButton} is clicked.
    //
    // @visibility hiliteEditor
    //<
});

isc.AdvancedHiliteEditor.addMethods({

    initWidget : function () {
        this.Super("initWidget", arguments);

        var ds = this.getDataSource(),
            _this = this;

        this.addAutoChild("filterBuilder", 
            { dataSource: ds, fieldDataSource: this.fieldDataSource,
              fieldNameChanged : function (filterClause) {
                  this.Super("fieldNameChanged", arguments);
                  _this.fieldChosen(filterClause.getFieldName());
              }
             }
        );

        var items = [
            {title:"Target Field(s)", name:"fieldName", multiple:true, allowMultiSelect: true,
             type:"select"
            },
            {title:"Text", name:"textColor", type:"color" },
            {title:"Background", name:"backgroundColor", type:"color" }
        ];

        this.addAutoChild("hiliteForm");

        if (this.fieldDataSource) {
            items[0] = isc.addProperties({}, items[0], {
                valueField: "name",
                displayField: "title",
                optionDataSource: this.fieldDataSource
            });
            delete items[0].defaultDynamicValue;
            this.hiliteForm.addItems(items);
        } else {
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
            items[0].valueMap = fieldMap;
            this.hiliteForm.addItems(items);
        }

        this.addAutoChildren(["hiliteButtons", "saveButton", "cancelButton"]);

        this.addMembers([this.filterBuilder, this.hiliteForm, this.hiliteButtons]);

        if (this.hilite != null) {
            // we're editing an existing hilite
            this.filterBuilder.setCriteria(this.hilite.criteria);
            this.hiliteForm.editRecord(this.hilite);
        }

    },

    // the first time a field is chosen when defining criteria, default the target field to
    // that field.
    fieldChosen : function (fieldName) {
        if (fieldName && this.hiliteForm.getValue("fieldName") == null) {
            this.hiliteForm.setValue("fieldName", fieldName);
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

        if (hilite.criteria.criteria == null || hilite.criteria.criteria.length == 0 ||
            (!hilite.textColor && !hilite.backgroundColor) || hilite.fieldName == null) 
        {
            isc.say(this.invalidHilitePrompt);
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
        if (this.hilite && this.hilite.id) hilite.id = this.hilite.id;
        
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
        if (this.callback) this.fireCallback(this.callback, ["hilite"], [result]);
    }    
});

