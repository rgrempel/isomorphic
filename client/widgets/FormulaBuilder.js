/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-03-13 (2010-03-13)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */




// ----------------------------------------------------------------------------------------

//> @class FormulaBuilder 
// Shows an interface allowing a user to enter simple formulas by typing them into a text
// field.
// <P>
// Available values for the formula are determined by the DataSource fields, and are given
// simple single-letter aliases (such as "A", "B", ...) similar to column names in Excel.
// The set of available values is shown in the +link{formulaBuilder.fieldKey} as a simple
// mapping between the +link{dataSourceField.title,field title} and it's short name.
// <P>
// By default, available math functions are shown in a hover from the
// +link{formulaBuilder.helpIcon,helpIcon} that appears after the formula field.
//
// @treeLocation Client Reference/Data Binding
// @group formulaFields
// @visibility external
//<
isc.ClassFactory.defineClass("FormulaBuilder", "VLayout");

isc.FormulaBuilder.addProperties({
// attributes 
vertical: true,
padding: 10,

//> @attr formulaBuilder.dataSource (DataSource or ID : null : IRW)
// DataSource providing the available fields for the formulaBuilder.
// <P>
// By default the formulaBuilder will include <b>only</b> fields of numeric type or derived
// from a numeric type.  Set +link{formulaBuilder.fields} to override this.
//
// @group formulaFields
// @visibility external
//<

//> @attr formulaBuilder.fields (Array of Field : null : IRW)
// Set this to override the underlying set of available fields.
//
// @group formulaFields
// @visibility external
//<

//> @attr formulaBuilder.field (Field : null : IR)
// The Field object representing the field being created or edited.
//
// @group formulaFields
// @visibility external
//<

//> @attr formulaBuilder.editMode (boolean : false : IR)
// Are we editing an existing field?
//
// @group formulaFields
// @visibility external
//<

//> @attr formulaBuilder.formulaField (AutoChild TextItem : null : IR)
// TextItem that users type into when entering a formula.
//
// @group formulaFields
// @visibility external
//<
showFormulaField: true,
formulaFieldDefaults: {
    type: "text", 
    formItemType: "AutoFitTextAreaItem",
    height: 20,
    width: "*",
    hoverWidth: 300,
    keyPress : function () {
        if (this.form.creator.autoTest) {
            this.fireOnPause("autoTest", {
                target: this.form.creator,
                methodName: "testFunction"
            }, this.form.creator.autoTestDelay);
        }
    }
},

//> @attr formulaBuilder.titleField (AutoChild TextItem : null : IR)
// TextItem that allows users to set the title for this field.
//
// @group formulaFields
// @visibility external
//<
showTitleField: true,
titleFieldDefaults: {title: "Title", 
    type: "text", 
    width: "*"
},

//> @attr formulaBuilder.showHelpIcon (boolean : true : IR)
// Whether to show the help icon that appears after the +link{formulaField}.
//
// @group formulaFields
// @visibility external
//<
showHelpIcon: true,

//> @attr formulaBuilder.helpIcon (AutoChild FormItemIcon : null : IRA)
// Icon that appears after the +link{formulaField}, showing help on hover.
//
// @group formulaFields
// @visibility external
//<
helpIconDefaults: { src: "[SKIN]actions/help.png"
},

//> @attr formulaBuilder.autoHideCheckBoxLabel (String : "Auto hide fields used in formula" : IRW)
// Text label for the checkbox that allows the user to automatically hide the
// fields used in the formula.
//
// @group i18nMessages
// @visibility external
//<
autoHideCheckBoxLabel: "Auto hide fields used in formula",

//> @attr formulaBuilder.showAutoHideCheckBox (boolean : true : IR)
// Whether to show a checkbox offering the user the ability to automatically
// hide any fields involved in the formula.
//
// @group formulaFields
// @visibility external
//<
showAutoHideCheckBox: true,

//> @attr formulaBuilder.autoHideCheckBox (AutoChild TextItem : null : IR)
// CheckBox that, when selected, hides columns in the component that are used in this formula.
//
// @group formulaFields
// @visibility external
//<
autoHideCheckBoxDefaults: { type: "boolean"
},

//> @attr formulaBuilder.builderTypeText (String : "formula" : IR)
// Indicates whether to use "formula" or some other keyword in various captions and text
//
// @group formulaFields
// @visibility external
//<
builderTypeText: "Formula",

//> @attr formulaBuilder.helpTextIntro (String : "For basic arithmetic, type in symbols (+-/%) directly.<P>The following functions are also available:" : IR)
// Text that appears in the hover from the +link{helpIcon}, as a pre-amble to the list of
// available functions.
//
// @group i18nMessages
// @visibility external
//<
helpTextIntro: "For basic arithmetic, type in symbols (+-/%) directly.<P>The following functions are also available:",

//> @attr formulaBuilder.mathFunctions (Array of String : null : IR)
// The list of math functions available in this FormulaBuilder, as an array of 
// +link{MathFunction, MathFunction} names.
// <P>
// The following function list is supported in FormulaBuilders by default: min(), max(), 
// round(), ceil(), floor(), abs(), pow(), sin(), cos(), tan(), ln() and log().
//
// @group formulaFields
// @visibility external
//<

//> @attr formulaBuilder.cancelled (Boolean : false : R)
// Was the builder operation cancelled?  Set to true when the user cancels with the cancel
// button or the dialog's close-button.
//
// @group formulaFields
// @visibility external
//<

// ------------------------------------------
// autoChildren
//
//> @attr formulaBuilder.fieldKey (AutoChild ListGrid : null : IR)
// ListGrid displaying the list of available fields and their corresponding formula keys.
//
// @group formulaFields
// @visibility external
//<
fieldKeyDefaults: {_constructor: "ListGrid",
    leaveScrollbarGap: false,  
    showResizeBar: true,  
    autoFitData: "vertical",
    autoFitMaxRecords: 6,
    autoFetchData: true,
    // non-interactive, so don't show rollover / selection
    showRollOver:false, selectionType:"none", 
    fields: [
        {name: "mappingKey", title: "Key", width: 40},
        {name: "title", title: "Source Field"},
        {name: "name", showIf: "false"},
        {name: "type", showIf: "false"},
        {name: "length", showIf: "false"}
    ]
},

//> @attr formulaBuilder.instructionsTextStart (String : "The following fields are available for use in this ": IRW)
// Text label for the start of the instruction text that appears in the instructions label.
//
// @group i18nMessages
// @visibility external
//<
instructionsTextStart: "The following fields are available for use in this ",

//> @attr formulaBuilder.instructions (AutoChild Label : null : IR)
// Label displaying the instruction text above the fieldKey grid.
//
// @visibility external
//<
instructionsDefaults: {
    _constructor: "Label",
    height: 1,
    extraSpace: 10,
    overflow: "visible"
},

// defaults for dynamicForms that host the various controls
titleFormDefaults: { _constructor: "DynamicForm", extraSpace: 5 
},
formulaFormDefaults: { _constructor: "DynamicForm", extraSpace: 5
},
hideFieldsFormDefaults: { _constructor: "DynamicForm", extraSpace: 20
},

sampleHeaderDefaults : { _constructor: "Label",
    height: 15,
    contents: "Sample:",
    extraSpace: 5
},
sampleLabelDefaults : { _constructor: "Canvas",
    height: 40,
    width: "100%", 
    align: "center", 
    valign: "top",
    extraSpace: 10,
    showHover: true,
    overflow:"hidden",
    styleName: "sampleOutput"
},

messageLabelDefaults : { _constructor: "Label",
    height: 20, 
    width: "100%", 
    align: "right", 
    valign: "center",
    overflow:"hidden",
    showHover: true
},
        
// buttonLayout - HLayout to organise the buttons
buttonLayoutDefaults: { _constructor: "HLayout",
    width: "100%", 
    align: "right"
},

//> @attr formulaBuilder.cancelButton (AutoChild Button : null : IR)
// Button to Cancel this FormulaBuilder.  The formula is not tested, formulaBuilder.cancelled
// is set to true and formulaBuilder.fireOnClose is fired.
//
// @group formulaFields
// @visibility external
//<
cancelButtonDefaults: {_constructor: "IButton",
    autoParent: "buttonLayout",
    title: "Cancel",
    width: 70,
    extraSpace: 10,
    click: function () {
        this.creator.completeEditing(true);
    }
},

//> @attr formulaBuilder.testButton (AutoChild Button : null : IR)
// Button to Test the formula by generating it's function and executing it
//
// @group formulaFields
// @visibility external
//<
testButtonDefaults: {_constructor: "IButton", 
    autoParent: "buttonLayout",
    title: "Test", 
    width: 70, 
    extraSpace: 10,
    click: function () {
        this.creator.testFunction();
    }
},

//> @attr formulaBuilder.saveButton (AutoChild Button : null : IR)
// Button to Save the formula, by generating it's function, testing it and firing 
// formulaBuilder.fireOnClose
//
// @group formulaFields
// @visibility external
//<
saveButtonDefaults: {_constructor: "IButton", 
    autoParent: "buttonLayout",
    title: "Save", 
    width: 70, 
    click: function () {
        if (this.creator.titleForm.validate()) this.creator.save();
    }
},

// when true, allow #A syntax as well as A
allowEscapedKeys: false

});

isc.FormulaBuilder.addMethods({
// methods
getValue : function () {
    return this.formulaField ? this.formulaField.getValue() : null;
},

setValue : function (newValue) {
    if (this.formulaField) {
        this.formulaField.setValue(newValue);
    }
},

//> @method formulaBuilder.setFormula()
// Call to set the formula-string in this FormulaBuilder.
// <P>
// Note that calling setFormula() will update the UI, generate the formula's function and 
// test it automatically.
//
// @param (String) The new formula-string for this builder
// @group formulaFields
// @visibility external
//<
setFormula : function (newValue) {
    this.setValue(newValue);
},

getFieldIdProperty : function () {
    return this.getClass().getFieldIdProperty(this.component);
},

getTitle : function () {
    return this.titleField ? this.titleField.getValue() : null;
},

setTitle : function (newTitle) {
    if (this.titleField) {
        this.titleField.setValue(newTitle);
    }
},

getFieldFromMappingKey : function (mappingKey) {
    var fields = this.getAvailableFields();

    for (var i=0; i<fields.length; i++) {
        var item = fields.get(i);
        if (item.mappingKey == mappingKey) return item;
    }
    return null;
},

getFields : function () {
    if (this.fields) return this.fields;

    if (this.component) return this.component.getAllFields();
    return isc.getValues(this.dataSource.getFields());
},

shouldHideUsedFields : function () {
    if (this.showAutoHideCheckBox && this.autoHideCheckBox && this.autoHideCheckBox.getValue()) {
        return this.autoHideCheckBox.getValue();
    } else return false;
},

//> @method formulaBuilder.getHelpText()
// Call to retrieve the text the FormulaBuilder would show by default for help, or override to
// provide alternate help text.
//
// @return (String) The results of getHoverText()
// @group formulaFields
// @visibility external
//<
getHelpText : function () {
    return this.getHoverText();
},

initWidget : function () {
    this.Super("initWidget", arguments);

    // get the dataSource so we know what fields to support
    this.dataSource = isc.DataSource.get(this.dataSource);

    if (!this.field) {
        this.field = {
            name: this.getUniqueFieldName(),
            title: "New Field",
            width: "50",
            canFilter: false,
            canSortClientOnly: true
        };
    }
    // --------------
    // draw the layout

    // add the fieldKey that displays the list of available fields
    this.instructions = this.createAutoChild("instructions", {
        contents: this.instructionsTextStart + this.builderTypeText
    });
    this.addMember(this.instructions);        

    var availableFields = this.getAvailableFields();

    this.fieldKeyDS = isc.DataSource.create({
        ID: this.getID()+"DS",
        clientOnly: true,
        testData: availableFields,
        fields: [
            {name: "mappingKey", title: "Key", width: 40},
            {name: "title", title: "Source Field"},
            {name: "name", showIf: "false", primaryKey: true},
            {name: "type", showIf: "false"},
            {name: "length", showIf: "false"}                
        ]
    });

    this.fieldKey = this.createAutoChild("fieldKey", { 
        dataSource: this.fieldKeyDS
    });
    if (this.fieldKey.showFilterEditor !== false && this.fieldKey.autoFitMaxRecords && 
        availableFields.length > this.fieldKey.autoFitMaxRecords) 
    {
        this.fieldKey.setShowFilterEditor(true);
    }
    this.addMember(this.fieldKey);

    // add the titleField that allows the user to re-caption the Field
    if (this.showTitleField) {
        this.addAutoChild("titleForm", {
            fields: [isc.addProperties(
                this.titleFieldDefaults, 
                this.titleFieldProperties,
                { name: "titleField" }
            )]
        });
        this.titleField = this.titleForm.getField("titleField");
        this.setTitle(this.field.title);
    }

    // add the formulaField TextItem - maybe override visibility of this because FormulaBuilder
    // is useless without a formula!
    if (this.showFormulaField) {
        this.addAutoChild("formulaForm", {
            fields: [isc.addProperties({ title: this.builderTypeText }, 
                this.formulaFieldDefaults, this.formulaFieldProperties, 
                this.showHelpIcon ? {
                icons: [isc.addProperties({ prompt: this.getHelpText() },
                    this.helpIconDefaults, this.helpIconProperties,
                    { click: "form.creator.showHelpWindow();" }
                )]
                } : {}, 
                { name: "formulaField"}
            )]
        });
        this.formulaField = this.formulaForm.getField("formulaField");
        if (this.showHelpIcon) this.helpIcon = this.formulaField.icons[0];
    }

    // display the test status or error here following a call to testFunction()
    this.addAutoChild("messageLabel");
    // display the test-case here following a call to testFunction()
    this.addAutoChild("sampleHeader");
    this.addAutoChild("sampleLabel");

    // add the checkbox that allows hiding of fields used in the formula
    if (this.showAutoHideCheckBox) {
        this.addAutoChild("hideFieldsForm", {  
            fields:[ isc.addProperties( { title: this.autoHideCheckBoxLabel },
                this.autoHideCheckBoxDefaults, 
                this.autoHideCheckBoxProperties,
                { name: "autoHide" }
            )]
        });
        this.autoHideCheckBox = this.hideFieldsForm.getField("autoHide");
    }

    // show the buttons in a layout
    this.addAutoChild("buttonLayout");
    this.addAutoChild("cancelButton");
    if (!this.autoTest) this.addAutoChild("testButton");
    this.addAutoChild("saveButton");

    if (this.showTitleField) this.titleForm.focusInItem(this.titleField);
    else this.formulaForm.focusInItem(this.formulaField);

    // set the initialValue specific to FormulaBuilder.  Override in subclasses
    this.setInitialValue();

    if (this.editMode && this.autoTest) this.testFunction();
},

getUniqueFieldName : function () {
    return this.getNewUniqueFieldName("formulaField");
},

getNewUniqueFieldName : function (namePrefix) {
    // assume return values in the format "fieldXXX" if namePrefix isn't passed
    if (!namePrefix || namePrefix == "") namePrefix = "field";
    var fields = this.getFields(),
        maxIncrement = 1,
        keyLength = namePrefix.length;

    // find the next available increment for the namePrefix
    for (var i = 0; i<fields.length; i++) {
        var item = fields.get(i);
        if (item.name.startsWith(namePrefix)) {
            var suffix = item.name.substr(keyLength),
                increment = new Number(suffix);
            if (increment && increment >= maxIncrement) maxIncrement = increment + 1;
        }
    }
    // return the new fieldName
    return namePrefix + maxIncrement;
},

destroy : function () {
    if (this.fieldKeyDS) this.fieldKeyDS.destroy();
    this.Super("destroy", arguments);
},

// set the initialValue specific to FormulaBuilder (field.userFormula). Override in subclasses
setInitialValue : function () {
    if (this.editMode && this.field.userFormula) {
        this.initialValue = this.field.userFormula.text;
        if (this.field.userFormula.allowEscapedKeys)
            this.allowEscapedKeys = this.field.userFormula.allowEscapedKeys;
    }
    this.initialValue = this.initialValue || "";
    this.setValue(this.initialValue);
},

showHelpWindow : function () {
    var window = this.locatorParent,
        top = window ? window.getTop() : this.top,
        left = window ? window.getLeft() : this.left,
        width = window ? window.getWidth() : this.width,
        height = window ? window.getVisibleHeight() : this.getVisibleHeight();

    if (window) window.centerInPage();

    if (this.helpWindow && this.helpWindow != null) {
        this.hideHelpWindow();
    } else {
        this.helpIcon.prompt = null;
        this.formulaField.stopHover();

        left -= (width / 2);
        if (window) window.setLeft(left);

        this.helpWindow = isc.Window.create({
            autoDraw:true,
            title: this.builderTypeText + " Help",
            showMinimizeButton: false,
            showMaximizeButton: false,
            showCloseButton: false,
            isModal: false,
            headerIconProperties: {
                src: "[SKIN]actions/help.png"
            },

            items: [isc.Label.create({
                contents: this.getHelpText(),
                padding: 10
            })]
        });
        this.helpWindow.moveTo(left + width, top);
        this.helpWindow.resizeTo(width, height);
    }
},

hideHelpWindow : function () {
    if (this.helpWindow) {
        this.helpWindow.destroy();
        this.helpWindow = null;
    }
    this.helpIcon.prompt = this.getHelpText();
    this.formulaField.stopHover();
},

// Internal method that provides the default help-text when hovering over the helpIcon
getHoverText : function () {
	var output = isc.SB.create();

    output.append("<b>", this.helpTextIntro, "</b> <P>");
    output.append("<ul>");
    var index = isc.MathFunction.getRegisteredFunctionIndex(),
        functions = this.mathFunctions;
    for (var i=0; i< functions.length; i++) {
        var item = index[functions[i]];
        output.append("<li> <b>", item.name, ": </b> ", item.description, "<p>");
        output.append("<i>usage: ", item.usage, "</i> </li>");
    }
    output.append("</ul>");

    return output.toString();
},

getAvailableFields : function () {
    return this.getClass().getAvailableFields(this.getFields());
},

getUsedFields : function () {
    return this.getClass().getUsedFields(this.getValue(), this.getAvailableFields());
},

getCompleteValueObject : function () {
    var usedFields = this.getUsedFields(),
        func = this.generateFunction(),
        properties = { sortNormalizer: func, _generatedFormulaFunc: func,
            userFormula : { text: this.getValue(), formulaVars: {} }
        },
	    fieldIdProperty = this.getFieldIdProperty();


    if (this.allowEscapedKeys) properties.userFormula.allowEscapedKeys = true;

    for (var i=0; i<usedFields.length; i++) {
        var item = usedFields.get(i);
        properties.userFormula.formulaVars[item.mappingKey] = item[fieldIdProperty];
    }

    return properties;    
},

getBasicValueObject : function () {
    var usedFields = this.getUsedFields(),
        userFormula = { text: this.getValue(), formulaVars: {} },
	    fieldIdProperty = this.getFieldIdProperty();

    if (this.allowEscapedKeys) userFormula.allowEscapedKeys = true;

    for (var i=0; i<usedFields.length; i++) {
        var item = usedFields.get(i);
        userFormula.formulaVars[item.mappingKey] = item[fieldIdProperty];
    }

    return userFormula;    
},

//> @method formulaBuilder.getUpdatedFieldObject()
// Returns the entire property-set for the updated field, including title and formula-related
// properties
// 
// @return (Field) The original field along with the updated title and formula
// @group formulaFields
// @visibility external
//<
getUpdatedFieldObject : function () {
    return isc.addProperties( this.field, 
        { title: this.getTitle() }, 
        this.getCompleteValueObject() 
    );
},

//> @method formulaBuilder.testFunction()
// Test the formula by generating it's function and trying to run it 
// @return (string) result of the function
// @group formulaFields
// @visibility external
//<
testFunction : function () {
    var result = this.getClass().testFunction(this.field, this.getBasicValueObject(), 
        this.component, 
        this.getFields()
    );
    if (result.failedGeneration || result.failedExecution) {
        this.setTestMessage("Invalid " + this.builderTypeText + ": " + result.errorText);
    } else if (result.emptyTestValue) {
        this.setTestMessage("Invalid blank " + this.builderTypeText);
    } else {
        this.setTestMessage("Valid " + this.builderTypeText);
    }
    this.setSamplePrompt(this.getSamplePrompt(result));

    return result;
},

//> @method formulaBuilder.getTestRecord()
// Gets the +link{formulaBuilder.testRecord, test record} for this formula.
// @return (Object) the +link{formulaBuilder.testRecord, testRecord} for this formula
// @group formulaFields
// @visibility external
//<
getTestRecord : function () {
    if (this.testRecord) return this.testRecord;
    return this.getClass().getTestRecord(this.component, this.getAvailableFields());
},

setTestMessage: function (message) {
    this.messageLabel.setContents(message);
},

setSamplePrompt: function (message) {
    this.sampleLabel.setContents("<center>"+message+"</center>");
},

// Create a function to wrap a calculation
//      * script local vars for all used fields
//      * script local vars for all mapped MathFunctions
//      * return the result of the formula
generateFunction : function () {
    return this.getClass().generateFunction(this.getBasicValueObject(), this.getUsedFields(),
        this.component);
},

//> @method formulaBuilder.save()
// Call to finish working, test the formula and call 
// +link{FormulaBuilder.fireOnClose(), fireOnClose()}.  Called automatically
// when the Save button is clicked.
//
// @group formulaFields
// @visibility external
//<
save : function () {
    var result = this.testFunction();

    if (result.emptyTestValue) {
        isc.warn("Invalid blank "+this.builderTypeText+".");
        return;
    } else if (result.failedGeneration || result.failedExecution) {
        isc.warn("The generated function is invalid - Check your "+this.builderTypeText+
            " and retry.");
        return;
    }

    if (this.editMode) {
        if (this.getValue() != this.initialValue) {
            var _this = this;
            isc.confirm("Save changes to this " + this.builderTypeText + "?", 
                function (shouldSave) {
                    if (shouldSave) {
                        _this.completeEditing(false);
                    }
                }
            );
        } else {
            this.completeEditing(false);
        }
    } else this.completeEditing(false);

},

// call this to finish working with the builder
completeEditing : function (cancelled) {
    if (cancelled) this.cancelled = true;
    if (this.helpWindow) this.hideHelpWindow();
    this.fireOnClose();
},

//>	@method	formulaBuilder.fireOnClose()	(A)
// Override to execute a callback function when the Formula is Cancelled or Saved.
// 
// @group formulaFields
// @visibility external
//<
fireOnClose : function () {},

//> @attr formulaBuilder.autoTest (boolean : true : IRWA)
// When set to true, automatically tests the formula by calling 
// +link{formulaBuilder.testFunction(), testFunction()} whenever typing into the 
// +link{formulaBuilder.formulaField, formulaField} pauses.
// <P>
// The default is true.
// 
// @group formulaFields
// @visibility external
//<
autoTest : true,

//> @attr formulaBuilder.autoTestDelay (integer : 200 : IRWA)
// When +link{formulaBuilder.autoTest} is true, this property indicates the delay in 
// milliseconds between a user pausing and +link{formulaBuilder.testFunction(), testFunction()}
// being called.
// <P>
// The default is 200 milliseconds.
// 
// @group formulaFields
// @visibility external
//<
autoTestDelay : 200,

//> @attr formulaBuilder.testRecord (Record : null : IRA)
// Record to use when testing the formula dynamically (if +link{formulaBuilder.autoTest} is enabled) or when
// showing samples of formula output.
// <P>
// If not specified, the selected record in the component that launched the FormulaBuilder will
// be used, or if there's no selection, the first visible row, or with no component, a dummy
// data row derived automatically from the provided DataSource.
//
// @group formulaFields
// @visibility external
//<

//> @attr formulaBuilder.samplePrompt (string : "<nobr>For record: \${title}</nobr><br><nobr>Output: \${output}</nobr>" : IRWA)
// This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
// when the message is displayed.
// <P>
// Default value returns <P>
// <code>
// <i>For Record: + the value of the rows title-field <br>
// Output: + the result of he generated function<br>
// </i>
// </code>
// @group i18nMessages
// @visibility external
//<
samplePrompt : "<nobr>For Record: ${title}</nobr><br><nobr>Output: ${output}</nobr>",

//> @method formulaBuilder.getSamplePrompt()
// Evaluates and returns the dynamic +link{formulaBuilder.samplePrompt} string which is 
// displayed beneath the formulaField and updated when typing pauses.
// 
// @param (TestFunctionResult) The return value from a call to testFunction().
// @return (string) Caption displaying dynamic row-title and the result of the formula
// @group i18nMessages
// @visibility external
//<
getSamplePrompt : function (result) {
    var titleField = this.dataSource.getTitleField(),
        output = result.result != null ? result.result : "Invalid " + this.builderTypeText,
        title = result.record[titleField];

    return this.samplePrompt.evalDynamicString(this, { title: title, output: output });
}

});

isc.FormulaBuilder.addClassMethods({

// 0 = A, 1 = B, etc.
mappingKeyForIndex : function (index) {
    // Use ascii table for range of A-Z, then repeat as AA, AB, etc.
    // A = 65, Z = 90
    var key = "",
        div = Math.floor(index/26);
    for (var i = 0; i < div; i++) key += "A";
    key += String.fromCharCode(65+index%26);
    return key;
},

getFieldIdProperty : function (component) {
    return component ? component.fieldIdProperty : "name";
},

// Get an array of those fields available for use in the formula (based on visibility and 
// numeric type)
getAvailableFields : function (fields) {
    var availableFields = [],
        j=0;

    if (!fields) return availableFields;

    for (var i = 0; i < fields.getLength(); i++) {
        var item = fields.get(i),
            type = item.type;

        if (item.userFormula ||
            isc.SimpleType.inheritsFrom(type, "integer") || 
            isc.SimpleType.inheritsFrom(type, "float"))
        {
            item.mappingKey = isc.FormulaBuilder.mappingKeyForIndex(j++);
            availableFields.add(item);
        }
    }
    return availableFields;
},

// Get an array of used-fields from those fields available for use in the formula
getUsedFields : function (formula, fields) {
    var availableFields = this.getAvailableFields(fields), 
        usedFields = [];

    if (!availableFields || !formula) return usedFields;

    availableFields = availableFields.sortByProperties([ "mappingKey" ], [ false ]);

    for (var i = 0; i < availableFields.length; i++) {
        var item = availableFields.get(i);
        // check for #key syntax if allowEscapedKeys:true, then just key - both are supported
        if (this.allowEscapedKeys && (
            formula.indexOf("#" + item.mappingKey) >= 0 ||
            formula.indexOf("#{" + item.mappingKey + "}") >= 0)) 
        {
            usedFields.add(item);
        } else if (formula.indexOf(item.mappingKey) >= 0) {
            usedFields.add(item);
        }
    }
    return usedFields;
},

// Get an array of those fields used in the formula-string
getFieldDetailsFromValue : function (value, fields, component) {
    var used = value,
        fieldIdProperty = this.getFieldIdProperty(component),
        fieldDetails = { usedFields: [], missingFields: [] }
    ;

    for (var key in used) {
        var item = used[key],
            fieldID = fields.findIndex(fieldIdProperty, item);

        if (!fields[fieldID]) {
            isc.logWarn("Field " + item + " is not in the list of available-fields");
            fieldDetails.missingFields.add(item);
        } else {
            var field = isc.addProperties({}, fields[fieldID]);
            field.mappingKey = key;
            fieldDetails.usedFields.add(field);
        }
    }

    return fieldDetails;
},

// Test the formula by generating it's function and trying to run it
testFunction : function (field, userFormula, component, usedFields) {
    var result = {};
    try {
        result.component = component;
        result.record = this.getTestRecord(component, usedFields);
        if (userFormula.text == "") {
            result.emptyTestValue = true;
            return result;
        }
        result.jsFunction = this.generateFunction(userFormula, usedFields, component);
        result.result = result.jsFunction(result.record, component);
    } catch (err) {
        if (!result.jsFunction) result.failedGeneration = true;
        result.failedExecution = true;
        result.errorText = err.message;
    }
    return result;
},

getTestRecord : function (component, fields) {
    var fieldIdProperty = this.getFieldIdProperty(component),
        record;

    if (component) {
    	record = component.getSelectedRecord();

        if (!record) {
            if (component.body) {
                var visibleRows = component.body.getVisibleRows();
                record = visibleRows ? component.getRecord(visibleRows[0]) : component.data.get(0);
            } else {
                record = component.data.get(0);
            }
        }
    }
    if (!record && fields) {
        // no data to use, build a dummy record from the passed fields
        record = [];
        for (var i = 0; i < fields.length; i++) {
            var item = fields.get(i);
            
            if (item.userFormula) {
                item._generatedFormulaFunc = item.sortNormalizer =
                    isc.FormulaBuilder.generateFunction(item.userFormula, fields, component);
            }
            
            if (item._generatedFormulaFunc) {
                // this is a formula - get the value of its _generatedFormulaFunc()
                record[item[fieldIdProperty]] = item._generatedFormulaFunc(record, component);
            } else if (item.type) 
                if (isc.SimpleType.inheritsFrom(item.type, "integer") ||
                    isc.SimpleType.inheritsFrom(item.type, "float"))
                {
                    record[item[fieldIdProperty]] = 1;
                } else record[item[fieldIdProperty]] = item[fieldIdProperty];
            else 
                record[item[fieldIdProperty]] = item[fieldIdProperty]
        }
    }
    return record;
},


// Creates a function to wrap the calculation of a formula.  userFormula contains the
// properties held in field.userFormula.
generateFunction : function (userFormula, fields, component) {
	var output = isc.SB.create(),
        formula = userFormula.text,
        fieldIdProperty = this.getFieldIdProperty(component),
        fieldDetails = this.getFieldDetailsFromValue(userFormula.formulaVars, fields, component),
        usedFields = fieldDetails.usedFields,
        missingFields = fieldDetails.missingFields
    ;

    usedFields = usedFields.sortByProperties([ "mappingKey" ], [false]);

    if (missingFields.length == 0) {
        if (usedFields.length > 0) {
            // script local vars for record-values
            output.append("var ");
            for (var i = 0; i < usedFields.length; i++) {
                var item = usedFields.get(i);
                if (i > 0) output.append("        ");
                output.append(item.mappingKey, "= (record['", item[fieldIdProperty], "'] ? ",
                    "record['", item[fieldIdProperty], "'] : component ? ", 
                    "component.getSpecificFieldValue(record, '",
                    item[fieldIdProperty], "', true) : 0)");
                output.append(i == usedFields.length - 1 ? ";" : ",", "\n");
                if (userFormula.allowEscapedKeys) {
                    formula = formula.replaceAll("#" + item.mappingKey, item.mappingKey);
                    formula = formula.replaceAll("#{" + item.mappingKey + "}", item.mappingKey);
                }
            }
            output.append("\n");
        }

        // script local vars for MathFunction-pointers
        var functions = isc.MathFunction.getRegisteredFunctions();
        if (functions.length > 0) {
            output.append("var functions=isc.MathFunction.getRegisteredFunctionIndex(),\n");
            for (var i = 0; i < functions.length; i++) {
                var item = functions.get(i);
                output.append("        ");
                output.append(item.name, "=", "functions.", item.name, ".jsFunction");
                output.append(i == functions.length - 1 ? ";" : ",", "\n");
            }
            output.append("\n");
        }

        // If NaN, use badFormulaResultValue
        output.append("var value=" + formula + ";" +
            "if (isNaN(value)) return (component && component.badFormulaResultValue) || '.'; " +
            "return value;");
    } else {
        this.logWarn("Formula failed due to missing fields: " + missingFields.join(", ") + ".");
        var result = (component && component.badFormulaResultValue) || ".";
        if (result) result = "'" + result + "'";
        output.append("return ", result, ";");
    }

	// return the wrapped function
    var content = output.toString();

    var func = new Function("record,component", content);
	return func;

}

 
});

// -----------------------------------------------------------------------------------------

//> @class SummaryBuilder 
// Shows an interface allowing a user to create or edit fields by typing simple
// format-strings into a text field.  The format-strings can include the values of other fields
// and additional text as required.
// <P>
// Available values for the format-string are determined by the DataSource fields, and are given
// simple single-letter aliases (such as "A", "B", ...) similar to column names in Excel.
// The set of available values is shown in the +link{formulaBuilder.fieldKey} as a simple
// mapping between the +link{dataSourceField.title,field title} and it's short name.
// <P>
// To include a field in the format-string, prefix it with a hash sign (#).
//
// @treeLocation Client Reference/Data Binding
// @group summaryFields
// @visibility external
//<
isc.ClassFactory.defineClass("SummaryBuilder", "FormulaBuilder");

isc.SummaryBuilder.addProperties({
// attributes
builderTypeText: "Summary",

//> @attr summaryBuilder.dataSource (DataSource or ID : null : IRW)
// @include formulaBuilder.dataSource
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.fields (Array of Field : null : IRW)
// DataSource providing the available fields for the SummaryBuilder.
// <P>
// By default the SummaryBuilder will include all fields.  Set +link{summaryBuilder.fields} to 
// override this.
//
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.editMode (boolean : false : IR)
// @include formulaBuilder.editMode
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.field (Field : null : IR)
// @include formulaBuilder.field
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.formulaField (AutoChild TextItem : null : IR)
// @include formulaBuilder.formulaField
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.titleField (AutoChild TextItem : null : IR)
// @include formulaBuilder.titleField
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.showHelpIcon (boolean : true : IR)
// @include formulaBuilder.showHelpIcon
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.helpIcon (AutoChild FormItemIcon : null : IRA)
// @include formulaBuilder.helpIcon
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.showAutoHideCheckBox (boolean : true : IR)
// @include formulaBuilder.showAutoHideCheckBox
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.autoHideCheckBox (AutoChild TextItem : null : IR)
// @include formulaBuilder.autoHideCheckBox
// @group summaryFields
// @visibility external
//<

//> @attr summaryBuilder.testRecord (Record : null : IRA)
// Record to use when showing sample output for the format string.
// <P>
// If not specified, the selected record in the component that launched the SummaryBuilder will
// be used, or if there's no selection, the first visible row, or with no component, a dummy
// data row derived automatically from the provided DataSource.
//
// @group formulaFields
// @visibility external
//<

//> @attr summaryBuilder.autoHideCheckBoxLabel (String : "Auto hide fields used in summary" : IRW)
// Text label for the checkbox that allows the user to automatically hide the
// fields used in the summary format.
//
// @group i18nMessages
// @visibility external
//<
autoHideCheckBoxLabel: "Auto hide fields used in Summary",

//> @attr summaryBuilder.helpTextIntro (String : "The following functions are available:" : IR)
// Text that appears in the hover from the +link{helpIcon}, as a pre-amble to the list of
// available format-tokens.
//
// @group i18nMessages
// @visibility external
//<
helpTextIntro: "Building Summary Columns",

// when true, allow #AA syntax for multi-char keys, as well as #{AA}
allowBasicMultiCharKeys: false

});

isc.SummaryBuilder.addMethods({

//> @method summaryBuilder.setSummary()
// Call to set the format-string in this SummaryBuilder.
// <P>
// Note that calling setSummary() will update the UI, generate the summary's function and 
// test it automatically.
//
// @param (String) The new format-string for the summary
// @group formulaFields
// @visibility external
//<
setSummary : function (newValue) {
    this.setValue(newValue);
},

//> @method summaryBuilder.getHelpText()
// Call to retrieve the text the SummaryBuilder would show by default for help, or override to
// provide alternate help text.
//
// @return (String) By default, the results of getHoverText()
// @group summaryFields
// @visibility external
//<

// set initialValue and then call this.Super to do the internal work
setInitialValue : function () {
    if (this.editMode && this.field.userSummary) {
        this.initialValue = this.field.userSummary.text;
    }
    this.initialValue = this.initialValue || "";
    this.setValue(this.initialValue);
},

getUniqueFieldName : function () {
    return this.getNewUniqueFieldName("summaryField");
},

// Override providing help-text specific to building Summary columns
getHoverText : function () {
	var output = isc.SB.create(),
            record = this.getTestRecord(), 
            fieldIdProperty = this.getFieldIdProperty(),
            fieldA = this.getFieldFromMappingKey("A"),
            fieldAName = fieldA[fieldIdProperty],
            fieldATitle = fieldA.title,
            fieldB = this.getFieldFromMappingKey("B"),
            fieldBName = fieldB ? fieldB[fieldIdProperty] : null,
            fieldBTitle = fieldB ? fieldB.title : null
        ;

    output.append("<b>", this.helpTextIntro, "</b> <P>");
    output.append("Summary columns are user-created fields that combine dynamic-values " +
        "from other fields in the current record with static text specified by the user.<P>");
    output.append("Dynamic-values are specified by prefixing a mapping-key from the table " +
        "opposite with #");
    if (this.getFields().length > 26) output.append(", or by using #{key} when the key " +
        "is 2 or more characters long,");
    output.append(" and everything else is copied directly into the output.<P>");

    if (this.dataSource) {
        output.append("For example, in the current DataSource, key <b>A</b> maps to field <i>",
            fieldATitle, "</i> and <b>B</b> is <i>", !fieldB ? "missing" : fieldBTitle, "</i>.<P>");
        output.append("So, if we enter the Summary format-string as:<P>",
            "<i>#A is relative to #B</i><P>", 
            "then example output using the current data would look like:<P>");
        
        if (record) {
            output.append("<i>", record[fieldAName], " is relative to ", 
                !fieldB ? "{missing}" : record[fieldBName], "</i><P>");
        }
    }

    return output.toString();
},

getAvailableFields : function () {
    return this.getClass().getAvailableFields(this.getFields());
},

getUsedFields : function () {
    return this.getClass().getUsedFields(this.getValue(), this.getAvailableFields(), 
        this.allowBasicMultiCharKeys);
},

// return the complete set of properties for the builder-type, including functions
getCompleteValueObject : function () {
    var usedFields = this.getUsedFields(),
        func = this.generateFunction(),
        fieldIdProperty = this.getFieldIdProperty(),
        properties = { sortNormalizer: func, _generatedSummaryFunc: func,
            userSummary : { text: this.getValue()
            }
        };

    if (usedFields && usedFields.length > 0) {
        properties.userSummary.summaryVars = {};
        for (var i = 0; i < usedFields.length; i++) {
            var item = usedFields.get(i);
            properties.userSummary.summaryVars[item.mappingKey] = 
                item[fieldIdProperty];
        }
    }

    return properties;
},

// return the basic set of properties for the builder-type, excluding field-title and functions
getBasicValueObject : function () {
    var usedFields = this.getUsedFields(),
        fieldIdProperty = this.getFieldIdProperty(),
        userSummary = { text: this.getValue(), summaryVars: {} };

    for (var i=0; i<usedFields.length; i++) {
        var item = usedFields.get(i);
        userSummary.summaryVars[item.mappingKey] = item[fieldIdProperty];
    }

    return userSummary;    
},



// Call the ClassMethod to generate the function for this Format
generateFunction : function (){
    return this.getClass().generateFunction(this.getBasicValueObject(), this.getUsedFields(),
        this.component
    );
},

initWidget: function(){
    this.Super("initWidget", arguments);
}

//>	@method	summaryBuilder.fireOnClose()	(A)
// Override to execute a callback function when the Format is Cancelled or Saved.
// 
// @group summaryFields
// @visibility external
//<

//> @method summaryBuilder.save()
// @include formulaBuilder.save
// @visibility external
//<


});

isc.SummaryBuilder.addClassMethods({

// Get an array of those fields available for use in the summary based on visibility.
getAvailableFields : function (fields) {
    var availableFields = [];

    if (!fields) return availableFields;

    for (var i = 0, j = 0; i < fields.getLength(); i++) {
        var item = fields.get(i);
        if (!item.userSummary) {
            item.mappingKey = isc.FormulaBuilder.mappingKeyForIndex(j++);
            availableFields.add(item);
        }
    }
    return availableFields;
},

// Get an array of used-fields from those fields available for use in the Summary
getUsedFields : function (formula, fields, allowBasicMultiCharKeys) {
    var availableFields = this.getAvailableFields(fields), 
        usedFields = [];

    if (!availableFields || !formula) return usedFields;

    availableFields = availableFields.sortByProperties([ "mappingKey" ], [ false ]);

    for (var i = 0; i < availableFields.length; i++) {
        var item = availableFields.get(i);
        // check for #{key}, then #key syntax being used - both are supported
        if (formula.indexOf("#{" + item.mappingKey + "}") >= 0) 
            usedFields.add(item);
        else if ((item.mappingKey.length == 1 || allowBasicMultiCharKeys) && 
            formula.indexOf("#" + item.mappingKey) >= 0) usedFields.add(item);
        
    }
    return usedFields;
},

// Test the format-string by generating it's function and trying to run it.
// "userSummary" is the properties in field.userSummary
testFunction : function (field, userSummary, component, usedFields){
    var result = {},
        fieldIdProperty = this.getFieldIdProperty(component);
    try {
        result.component = component;
        result.record = this.getTestRecord(component, usedFields);
        if (userSummary.text == "") {
            result.emptyTestValue = true;
            return result;
        }
        result.jsFunction = this.generateFunction(userSummary, usedFields, component);
        result.result = result.jsFunction(result.record, field[fieldIdProperty], component);

    } catch (err) {
        if (!result.jsFunction) result.failedGeneration = true;
        result.failedExecution = true;
        result.errorText = err.message;
    }
    return result;
},


// Create a function to produce a summary-value according to the format-string supplied
generateFunction : function (userSummary, fields, component) {
	var output = isc.SB.create(),
        format = userSummary.text,
        fieldIdProperty = this.getFieldIdProperty(component),
        fieldDetails = this.getFieldDetailsFromValue(userSummary.summaryVars, fields, component),
        usedFields = fieldDetails.usedFields,
        missingFields = fieldDetails.missingFields
    ;

    usedFields = usedFields.sortByProperties([ "mappingKey" ], [false]);

    if (usedFields.length > 0) {
        // script local vars for record-values
        output.append("var ");
        for (var i = 0; i < usedFields.length; i++) {
            var item = usedFields.get(i);
            if (i > 0) output.append("        ");
            output.append(item.mappingKey, "=(component ? component.getSpecificFieldValue(record,'",
                item[fieldIdProperty], "') : record['", item[fieldIdProperty],
                "']");
            output.append(i == usedFields.length - 1 ? ");" : "),", "\n");
            // first replace tokens in the format #{key}, then in the format #key
            format = format.replaceAll("#{" + item.mappingKey + "}", "'+" + item.mappingKey + "+'");
            format = format.replaceAll("#" + item.mappingKey, "'+" + item.mappingKey + "+'");
        }
        output.append("\n");
    }

    // Replace disallowed field aliases with component.missingSummaryFieldValue
    format = format.replace(/(#({[A-Z][A-Z]?}|[A-Z][A-Z]?))/g, 
        (component && component.missingSummaryFieldValue) || "-");

    // ensure the format-string is properly formed following field-token replacement
    if (format.substr(0, 2) == "'+") { // usedField starts the string (strip leading '+)
        format = format.substr(2);
    } else if (format.substr(0, 1) != "'") { // otherwise start the string (prefix with ')
        format = "'" + format;
    }
    if (format.substr(format.length - 2) == "+'") { // usedField ends the string (strip trailing +')
        format = format.substr(0, format.length - 2);
    } else if (format.substr(format.length - 1) != "'") { // otherwise terminate the string
        format = format + "'";
    }

    output.append("return ", format, ";");

	// return the wrapped function
    var content = output.toString(),
        func = new Function("record,fieldName,component", content);

	return func;

}

});

