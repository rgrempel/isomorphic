/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-12-07 (2010-12-07)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 


// Class will not work without the ListGrid
if (isc.ListGrid) {





//> @class DateRangeItem
// Allows a user to select an absolute or relative range of dates via two
// +link{RelativeDateItem}s (if +link{DateRangeItem.allowRelativeDates} is true) or two
// +link{DateItems}.
// @visibility external
//<
isc.defineClass("DateRangeItem", "CanvasItem");

isc.DateRangeItem.addProperties({
        
//> @attr dateRangeItem.shouldSaveValue (boolean : true : IR)
// Allow dateRangeItems' values to show up in the form's values array, or if 
// +link{dynamicForm.getValuesAsCriteria()} is called, for the criterion to be included
// in the returned AdvancedCriteria object
// @visibility external
//<
shouldSaveValue:true,

//> @object DateRange
// A JavaScript object specifying a range of dates.  Values are +link{dateRange.start, start}
// and +link{dateRange.end, end}.  If either value is omitted, the range is assumed to be
// open-ended in that direction - so if dateRange.start is omitted, the range will include any
// date earlier than the value specified in dateRange.end.
// 
// @visibility external
//<

//> @attr dateRange.start (RelativeDate or Date : null : IR)
// The start of this DateRange.
// @visibility external
//<

//> @attr dateRange.end (RelativeDate or Date : null : IR)
// The end of this DateRange.
// @visibility external
//<

//> @attr dateRangeItem.fromTitle (string : "From" : IR)
// The title for the "from" part of the range.
// @visibility external
// @group i18nMessages
//<
fromTitle: "From",

//> @attr dateRangeItem.toTitle (string : "To" : IR)
// The title for the "to" part of the range.
// @visibility external
// @group i18nMessages
//<
toTitle: "To",

//> @attr dateRangeItem.allowRelativeDates (boolean : false : IR)
// Whether to allow the user to specify relative dates (via +link{RelativeDateItem}s) or whether
// dates are absolute (via +link{DateItem}s).
// @visibility external
//<
allowRelativeDates: false,

//> @attr dateRangeItem.fromField (AutoChild FormItem : null : IR)
// The field for the "from" date - a +link{RelativeDateItem} or +link{DateItem} according to
// +link{allowRelativeDates}.
// @visibility external
//<

//> @attr dateRangeItem.toField (AutoChild FormItem : null : IR)
// The field for the "to" date - a +link{RelativeDateItem} or +link{DateItem} according to
// +link{allowRelativeDates}.
// @visibility external
//<

//> @attr dateRangeItem.fromDate (Date or RelativeDateString or TimeUnit : today : IRW)
// Initial value for the "from" date.
// @setter setFromDate
// @visibility external
//<
//fromDate: "$today",

//> @method dateRangeItem.setFromDate()
// Sets the +link{fromDate} for this DateRangeItem.
// @param fromDate (Date) the date from which this item should start it's range
// @visibility external
//<
setFromDate : function (fromDate) {
    this.fromDate = fromDate;
    if (this.fromField) this.fromField.setValue(this.fromDate);
},

//> @attr dateRangeItem.toDate (Date or RelativeDateString or TimeUnit : today : IRW)
// Initial value for the "to" date.
// @setter setToDate
// @visibility external
//<
//toDate: "$today",

//> @method dateRangeItem.setToDate()
// Sets the +link{toDate} for this DateRangeItem.
// @param fromDate (Date) the date at which this item should end it's range
// @visibility external
//<
setToDate : function (toDate) {
    this.toDate = toDate;
    if (this.toField) this.toField.setValue(this.toDate);
},

//> @attr dateRangeItem.dateInputFormat (DateInputFormat : null : IR)
// Format for direct user input of date values.
// <P>
// If unset, the input format will be determined based on the specified
// +link{dateDisplayFormat} if possible, otherwise picked up from the Date class (see
// +link{Date.setInputFormat()}).
// 
// @visibility external
//<

//> @attr dateRangeItem.dateDisplayFormat (DateDisplayFormat : null : IR)
// Format for displaying dates in to the user.  
// Defaults to the system-wide default established by +link{Date.setDefaultDisplayFormat()}.
// 
// @visibility external
//<

//> @method dateRangeItem.hasAdvancedCriteria()
// Overridden to return true: dateRangeItems always generate AdvancedCriteria.
// @return (boolean) true
// @visibility external
// @group criteriaEditing
//<
hasAdvancedCriteria : function () {
    return true;
},

//> @method dateRangeItem.getCriterion()
// Returns the Criterion entered in the date field.
// <P>
// A Criterion with an "and" +link{type:OperatorId,operator} will be
// returned with both a "greaterOrEqual" and "lessOrEqual" sub-criteria.  If either date is omitted,
// only the "greaterOrEqual" (from date) or "lessOrEqual" (to date) Criterion is included.
//
// @return (Criterion)
//
// @group criteriaEditing
// @visibility external
//<

getCriterion : function (absolute) {
    
    absolute = absolute || !this.allowRelativeDates;
    
    var fromValue = absolute ? this.fromField.getValue() :
            this.fromField.getRelativeDate() || this.fromField.getValue(),
            
        hasFromValue = fromValue != null,
        
        toValue = absolute ? this.toField.getValue() :
            this.toField.getRelativeDate() || this.toField.getValue(),
            
        hasToValue = toValue != null,
        result = null
    ;

    if (hasFromValue || hasToValue) {
        // return an AdvanvedCriteria with one or two subCriteria
        result = { _constructor: "AdvancedCriteria", operator: "and", criteria: [ ] };

        if (hasFromValue) {
            result.criteria.add({
                fieldName: this.name, 
                operator: "greaterOrEqual", 
                value: fromValue 
            });
        }
        if (hasToValue) {
            result.criteria.add({
                fieldName: this.name, 
                operator: "lessOrEqual", 
                value: toValue 
            });
        }
    }

    return result;    
},

//> @method dateRangeItem.canEditCriterion()
// Returns true if the specified criterion contains:
// <ul><li>A single "lessOrEqual" or "greaterOrEqual" criterion on this field</li>
//     <li>An "and" type criterion containing a "lessOrEqual" and a "greaterOrEqual" criterion on
//         this field</li>
// </ul>
// @param criterion (Criterion) criterion to test
// @return (boolean) returns true if this criterion can be edited by this item
// @group criteriaEditing
// @visibility external
//<
canEditCriterion : function (criterion) {
    
    if (criterion == null) return false;
    var dateField = this.getCriteriaFieldName();
    if (criterion.operator == "and") {
        var innerCriteria = criterion.criteria;
        // we always produce one or 2 criteria only (to and from date range)
        
        if (innerCriteria.length == 0 || innerCriteria.length > 2) {
            return false;
        }
        for (var i = 0; i < innerCriteria.length; i++) {
            var innerCriterion = innerCriteria[i];
            
            // other field - just bail
            if (innerCriterion.fieldName != dateField) return false;
            
            
            // wrong operator - bail, but with a warning since this could confuse a 
            // developer
            if (innerCriterion.operator != "greaterThan" && innerCriterion.operator != "greaterOrEqual" 
                && innerCriterion.operator != "lessThan"
                && innerCriterion.operator != "lessOrEqual") 
            {
                this.logWarn("DynamicForm editing Advanced criteria. Includes criterion for " +
                    "field " +  dateField + ". A dateRange editor is showing for this field but " +
                    "the existing criteria has operator:" + innerCriterion.operator + ". DateRange " +
                    "items can only edit criteria greaterThan/greaterOrEqual or lessThan/lessOrEqual " +
                    "so leaving this unaltered.");
                return false;
            }
        }
        // Only contains a range, with one or 2 values, so we'll allow editing of that.
        return true;
        
    // single criterion matching to or from of range.. We support that..
    } else if (criterion.fieldName == dateField) {
        if (criterion.operator != "greaterThan" && criterion.operator != "greaterOrEqual"
            && criterion.operator != "lessThan"
            && criterion.operator != "lessOrEqual") {
            this.logWarn("DynamicForm editing Advanced criteria. Includes criterion for " +
                "field " +  dateField + ". A dateRange editor is showing for this field but " +
                "the existing criteria has operator:" + criterion.operator + ". DateRange " +
                "items can only edit criteria greaterThan/greaterOrEqual or lessThan/lessOrEqual " +
                "so leaving this unaltered.");
            return false;
        }
        return true;
    }
    
    // in this case it's not on our field at all
    return false;
},

//> @method dateRangeItem.setCriterion()
// Applies the specified criterion to this item for editing. Applies any specified "greaterOrEqual"
// operator criterion or sub-criterion to our +link{fromField} and any
// specified "lessOrEqual" operator criterion or sub-criterion to our +link{toField}.
// @param criterion (Criterion) criterion to edit
// @group criteriaEditing
// @visibility external
//<
setCriterion : function (criterion) {
    var fromCrit, toCrit;
    if (criterion.operator == "and") {
        fromCrit = criterion.criteria.find("operator", "greaterThan");
        if (!fromCrit) fromCrit = criterion.criteria.find("operator", "greaterOrEqual");
        toCrit = criterion.criteria.find("operator", "lessThan");
        if (!toCrit) toCrit = criterion.criteria.find("operator", "lessOrEqual");
    } else {
        if (criterion.operator == "greaterThan") fromCrit = criterion;
        else if (criterion.operator == "greaterOrEqual") fromCrit = criterion;
        else if (criterion.operator == "lessThan") toCrit = criterion;
        else if (criterion.operator == "lessOrEqual") toCrit = criterion;
    }

    // just call setValue on the relevant items.
    // If we're showing relative date items they should handle being passed an absolute
    // date value
    if (fromCrit != null) {
        this.fromField.setValue(fromCrit.value);
    }
    if (toCrit != null) {
        this.toField.setValue(toCrit.value);
    }
},

dateRangeFormDefaults: {
    _constructor: "DynamicForm",
    numCols: 2,
    colWidths: [50, "*"],
    margin: 0,
    padding: 0,
    itemChanged : function (item, newValue) {
        var values = this.getValues(),
            dateRange = {_constructor:"DateRange"};
        if (values.fromField != null) dateRange.start = values.fromField;
        if (values.toField != null) dateRange.end = values.toField;
        this.creator.updateValue(dateRange);
    }
}

});

isc.DateRangeItem.addMethods({
    init : function () {
        this._createEditor();
        this.Super("init", arguments);
    },
    
    isEditable : function () {
        return true;
    },

    _createEditor: function () {
        var ds;
        var dynProps = { _suppressColWidthWarnings: true };

        if (this.form.dataSource) { // Should be, otherwise how have we ended up with a complex field?
            ds = isc.DataSource.getDataSource(this.form.dataSource);
            var field = ds.getField(this.name);
            if (field) {
                dynProps.dataSource = ds.getFieldDataSource(field);
            }
        }

        if (this.form && this.form.showComplexFieldsRecursively) {
            dynProps.showComplexFields = true;
            dynProps.showComplexFieldsRecursively = true;
        } else {
            dynProps.showComplexFields = false;
        }

        dynProps.height = 22;
        
        this.addAutoChild("dateRangeForm", dynProps);
        this.canvas = this.dateRangeForm;        

        // set a default baseDate is one wasn't provided
        this.baseDate = this.baseDate || new Date();

        var _this = this,
            _constructor = this.allowRelativeDates ? "RelativeDateItem" : "DateItem",
            items = []
        ;

        items[0] = isc.addProperties({}, this.fromFieldDefaults, this.fromFieldProperties,
            { 
                name: "fromField", _constructor: _constructor, baseDate: this.baseDate,
                displayFormat: this.dateDisplayFormat, inputFormat: this.dateInputFormat,
                title: this.fromTitle, titleOrientation: this.form.titleOrientation,
                defaultValue: this.fromValue, 
                useTextField: (_constructor == "DateItem" ? true : null)
            } 
        );
        items[1] = isc.addProperties({}, this.toFieldDefaults, this.toFieldProperties,
            {
                name: "toField", _constructor: _constructor, baseDate: this.baseDate,
                displayFormat: this.dateDisplayFormat, inputFormat: this.dateInputFormat,
                title: this.toTitle, titleOrientation: this.form.titleOrientation,
                defaultValue: this.toValue,
                useTextField: (_constructor == "DateItem" ? true : null)
            }
        );

        this.canvas.setFields(items);

        this.toField = this.canvas.getField("toField");
        this.fromField = this.canvas.getField("fromField");

        if (this.allowRelativeDates) {
            this.fromField.canvas._nextTabWidget = this.toField.canvas;
            this.toField.canvas._previousTabWidget = this.fromField.canvas;
        }

        if (this.defaultValue) {
            this.setValue(this.defaultValue);
        } else {
            if (this.fromDate) this.setFromDate(this.fromDate);
            if (this.toDate) this.setToDate(this.toDate);
        }
    },

    fieldChanged : function () {
    },

    //> @method dateRangeItem.setValue()
    // Sets the value for this dateRangeItem.  The value parameter is a 
    // +link{object:DateRange} object that optionally includes both start and end values.  If
    // passed null, both start and end range-values are cleared.
    // @param value (DateRange) the new value for this item
    // @visibility external
    //<
    setValue : function (value) {

        var start = value ? value.start : null,
            end = value ? value.end : null,
            RDI = isc.RelativeDateItem;

        if (!this.allowRelativeDates && RDI.isRelativeDate(start)) this.setFromDate(null);
        else this.setFromDate(start);
        if (!this.allowRelativeDates && RDI.isRelativeDate(end)) this.setToDate(null);
        else this.setToDate(end);
        this.Super("setValue", arguments);
    },

    //> @method dateRangeItem.getValue()
    // Retrieves the current value of this dateRangeItem.  The return value is a 
    // +link{object:DateRange} object that excludes start and end values if they aren't
    // set.
    // @return (DateRange) the current value of this item
    // @visibility external
    //<
    getValue : function () {
        if (!this.fromField || !this.toField) return;
        var isRelative = this.allowRelativeDates,
            fromValue = isRelative && this.fromField.getRelativeDate() ? 
                this.fromField.getRelativeDate() : this.fromField.getValue(),
            toValue = isRelative && this.toField.getRelativeDate() ? 
                this.toField.getRelativeDate() : this.toField.getValue(),
            result = {_constructor:"DateRange"};
        if (fromValue == null && toValue == null) return null;
        if (fromValue != null) result.start = fromValue;
        if (toValue != null) result.end = toValue;

        return result;
    },

    updateValue : function(data) {
        // we get passed getValuesAsCriteria
        this._updateValue(data);
    }

});


if (isc.Window) {
// dateRangeDialog and miniDateRangeItem require isc.Window

//> @class DateRangeDialog
// Simple modal dialog for collecting a date range from the end user.
// 
// @visibility external
//<

isc.defineClass("DateRangeDialog", "Window");


isc.DateRangeDialog.addClassMethods({
//> @classMethod DateRangeDialog.askForRange()
// Helper method to launch a DateRangeDialog to have a date range input by the user.
// @param allowRelativeDates (boolean) whether to allow relative date entry via
//                                    +link{RelativeDateItem}s, default true
// @param rangeItemProperties (DateRangeItem Properties) properties for the DateRangeItem
// @param windowProperties (DateRangeDialog Properties) properties for the Window
// @param callback (Callback) method to fire once user has input values, with a single parameter
//                           "criterion" of type +link{Criterion}
// 
// @visibility external
//<
askForRange : function (allowRelativeDates, rangeItemProperties, windowProperties, callback) {
    var drd = isc.DateRangeDialog.create({
        allowRelativeDates: allowRelativeDates != null ? allowRelativeDates : true,
        rangeItemProperties: rangeItemProperties,
        callback: callback
    }, windowProperties);

    drd.show();
}
});

isc.DateRangeDialog.addProperties({
isModal: true,
showModalMask: true,
dismissOnEscape: true,
autoCenter: true,
width: 380,
height: 140,
vertical: "true",
showMinimizeButton: false,
headerIconProperties: {
    src: "[SKIN]/DynamicForm/DatePicker_icon.gif"
},

returnCriterion: false,

//> @attr dateRangeDialog.headerTitle (String : "Select Date Range" : IR)
// The title to display in the header-bar of this Dialog.
// 
// @visibility external
// @group i18nMessages
//<
headerTitle: "Select Date Range",

mainLayoutDefaults: {
    _constructor: "VLayout",
    width: "100%",
    height: "100%",
    layoutMargin: 5
},

rangeFormDefaults: {
    _constructor: "DynamicForm",
    numCols: 1,
    width: "100%",
    height: "100%",
    autoParent: "mainLayout"
},

//> @attr dateRangeDialog.rangeItem (AutoChild DateRangeItem : null : IR)
// 
// @visibility external
//<
rangeItemDefaults: {
    _constructor: "DateRangeItem",
    allowRelativeDates: true,
    showTitle: false
},

buttonLayoutDefaults: {
    _constructor: "HLayout",
    width: "100%",
    height: 22,
    align: "right",
    membersMargin: 5,
    autoParent: "mainLayout"
},

//> @attr dateRangeDialog.clearButtonTitle (string : "Clear" : IR)
// The title for the "Clear" button on this dialog.
// @visibility external
// @group i18nMessages
//<
clearButtonTitle: "Clear",
//> @attr dateRangeDialog.clearButton (AutoChild : null : IR)
// Button used for clearing the dialog.  Note that, since this is an AutoChild, it can be 
// configured using clearButtonDefaults and clearButtonProperties.
// @visibility external
// @group i18nMessages
//<
clearButtonDefaults: {
    _constructor: "IButton",
    height: 22,
    width: 80,
    autoParent: "buttonLayout",
    click : function () {
        this.creator.clear();
    }
},

//> @attr dateRangeDialog.okButtonTitle (string : "OK" : IR)
// The title for the "OK" button on this dialog.
// @visibility external
// @group i18nMessages
//<
okButtonTitle: "OK",
//> @attr dateRangeDialog.okButton (AutoChild : null : IR)
// Button used for accepting the values entered into the dialog.  Note that, since this is an 
// AutoChild, it can be configured using okButtonDefaults and okButtonProperties.
// @visibility external
// @group i18nMessages
//<
okButtonDefaults: {
    _constructor: "IButton",
    height: 22,
    width: 80,
    autoParent: "buttonLayout",
    click : function () {
        this.creator.accept();
    }
},

//> @attr dateRangeDialog.cancelButtonTitle (string : "Cancel" : IR)
// The title for the "Cancel" button on this dialog.
// @visibility external
// @group i18nMessages
//<
cancelButtonTitle: "Cancel",
//> @attr dateRangeDialog.cancelButton (AutoChild : null : IR)
// Button used for cancelling the dialog.  Note that, since this is an AutoChild, it can be 
// configured using cancelButtonDefaults and cancelButtonProperties.
// @visibility external
// @group i18nMessages
//<
cancelButtonDefaults: {
    _constructor: "IButton",
    height: 22,
    width: 80,
    autoParent: "buttonLayout",
    click : function () {
        this.creator.cancel();
    }
},

destroyOnClose: true

});

isc.DateRangeDialog.addMethods({
    initWidget : function () {
        this.title = this.headerTitle;
        
        this.Super("initWidget", arguments);
        this.addAutoChild("mainLayout");
        this.addAutoChild("rangeForm",
            {
                _suppressColWidthWarnings: true,
                items: [
                    isc.addProperties({}, this.rangeItemDefaults, this.rangeItemProperties,
                        { name: "rangeItem", fromDate: this.fromDate, toDate: this.toDate,
                            dateDisplayFormat: this.dateDisplayFormat
                        }
                    )
                ]
            }
        );

        this.rangeItem = this.rangeForm.getField("rangeItem");

        this.rangeItem.canvas.numCols = 1;

        this.addAutoChild("buttonLayout");
        this.addAutoChild("clearButton", { title: this.clearButtonTitle});
        this.addAutoChild("okButton", { title: this.okButtonTitle});
        this.addAutoChild("cancelButton", { title: this.cancelButtonTitle});
        this.addItem(this.mainLayout);
    },

    clear : function () {
        this.rangeItem.setValue(null);
    },

    accept : function () {
        this.finished(
            this.rangeItem.returnCriterion ? this.rangeItem.getCriterion() : this.rangeItem.getValue()
        );
    },

    cancel : function () {
        this.hide();
        if (this.destroyOnClose) this.markForDestroy();
    },
    
    finished : function (value) {
        if (this.callback) this.fireCallback(this.callback, "value", [value]);
        this.hide();
        if (this.destroyOnClose) this.markForDestroy();
    }

});

//> @class MiniDateRangeItem
// Provides a compact interface for editing a date range, by providing a read-only display of 
// the current selected date range with an icon to launch a +link{DateRangeDialog} to edit the 
// range.
// 
// @visibility external
//<
isc.defineClass("MiniDateRangeItem", "StaticTextItem");

isc.MiniDateRangeItem.addProperties({
        
//> @attr miniDateRangeItem.textBoxStyle (FormItemBaseStyle : "textItem" : IRW)
// @include formItem.textBoxStyle
//<
textBoxStyle:"textItem",
        
clipValue: true,
wrap: false,
iconVAlign: "top",
height: 20,
width: 100,

//> @attr miniDateRangeItem.shouldSaveValue (boolean : true : IR)
// Allow miniDateRangeItems' values to show up in the form's values array, or if 
// +link{dynamicForm.getValuesAsCriteria()} is called, for the criterion to be included
// in the returned AdvancedCriteria object
// @visibility external
//<
shouldSaveValue:true,

//> @attr miniDateRangeItem.rangeDialog (AutoChild DateRangeDialog : null : IR)
// Pop-up +link{DateRangeDialog} for entering a date range.
//
// @visibility external
//<
rangeDialogDefaults: {
    _constructor: "DateRangeDialog",
    autoDraw: false, 
    destroyOnClose: false
},

//> @attr miniDateRangeItem.fromDateOnlyPrefix (string : "Since" : IR)
// The text to prepend to the formatted date when only a +link{fromDate} is supplied.
// @group i18nMessages
//<
fromDateOnlyPrefix: "Since",

//> @attr miniDateRangeItem.toDateOnlyPrefix (string : "Before" : IR)
// The text to prepend to the formatted date when only a +link{toDate} is supplied.
// @group i18nMessages
//<
toDateOnlyPrefix: "Before",

//> @attr miniDateRangeItem.pickerIconPrompt (String : "Show Date Chooser" : IR)
// The prompt to show when the mouse is hovered over the +link{pickerIcon}.
// 
// @visibility external
// @group i18nMessages
//<
pickerIconPrompt: "Show Date Chooser",

//> @attr miniDateRangeItem.pickerIcon (FormItemIcon Properties : null : IR)
// Icon that launches a +link{DateChooser} for choosing an absolute date.
// 
// @visibility external
//<
pickerIconDefaults: {
    name: "showDateRange", 
    src: "[SKIN]/DynamicForm/DatePicker_icon.gif",
    width: 20, height: 20,
    neverDisable: true,
    showDisabled: false,
    showOver: false,
    showFocused: false,
    showFocusedWithItem: false,
    hspace: 0,
    click : function (form, item, icon) {
        item.showRangeDialog();
    }
},

//> @method miniDateRangeItem.allowRelativeDates()
// Whether the +link{DateRangeDialog} opened when the 
// +link{miniDateRangeItem.pickerIcon, pickerIcon} is clicked should display 
// +link{RelativeDateItem}s or +link{DateItem}s.
// @return (boolean) true
// @visibility external
//<
allowRelativeDates: true,

//> @attr miniDateRangeItem.dateDisplayFormat (DateDisplayFormat : null : IR)
// Format for displaying dates in to the user.  
// Defaults to the system-wide default established by +link{Date.setDefaultDisplayFormat()}.
// <P>
// If this attribute is unset, the display value is formatted intelligently according to the
// dates involved.  For example, if both dates appear in the same month, the value will be 
// formatted as <code>Month date1 - date2, Year</code> and, if in different months of the same
// year, <code>Month1 date1 - Month2 date2, Year</code>.
// 
// @visibility external
//<

//> @attr miniDateRangeItem.fromDate (Date or RelativeDateString or TimeUnit : today : IRW)
// Initial value for the "from" date.
// @setter setFromDate
// @visibility external
//<
//fromDate: "$today",

//> @attr miniDateRangeItem.toDate (Date or RelativeDateString or TimeUnit : today : IRW)
// Initial value for the "to" date.
// @setter setFromDate
// @visibility external
//<
//fromDate: "$today",


handleClick : function () {
    this.showRangeDialog();
}

});

isc.MiniDateRangeItem.addMethods({
    init : function () {
        this.addAutoChild("rangeDialog", 
            {
                fromDate: this.fromDate, 
                toDate: this.toDate,
                rangeItemProperties: {
                    allowRelativeDates: this.allowRelativeDates
                },
                dateDisplayFormat: this.dateDisplayFormat,
                callback: this.getID()+".rangeDialogCallback(value)"
            }
        );

        this.icons = [ 
            isc.addProperties({ prompt: this.pickerIconPrompt }, 
                this.pickerIconDefaults, this.pickerIconProperties
            )
        ];

        this.rangeItem = this.rangeDialog.rangeItem;
        this.rangeItem.name = this.name;
    },

    showRangeDialog : function () {
        this.rangeDialog.rangeItem.setFromDate(this.fromDate);
        this.rangeDialog.rangeItem.setToDate(this.toDate);
        this.rangeDialog.show();
    },

    rangeDialogCallback : function (value) {
        this.updateValue(value);
    },

    //> @method miniDateRangeItem.hasAdvancedCriteria()
    // @include dateRangeItem.hasAdvancedCriteria()
    // @group criteriaEditing
    //<
    hasAdvancedCriteria : function () {
        return true;
    },

    //> @method miniDateRangeItem.getCriterion()
    // Returns the Criterion entered in the fields shown in the 
    // +link{miniDateRangeItem.rangeDialog}.
    // <P>
    // If both dates are entered, a Criterion with an "and" +link{type:OperatorId,operator} will be
    // returned with both a "greaterOrEqual" and "lessOrEqual" sub-criteria.  If either date is omitted,
    // only the "greaterOrEqual" (from date) or "lessOrEqual" (to date) Criterion is returned.
    //
    // @return (Criterion)
    //
    // @group criteriaEditing
    // @visibility external
    //<
    getCriterion : function () {
        var criteria = this.rangeItem ? this.rangeItem.getCriterion() : null;
        return criteria;
    },

    //> @method miniDateRangeItem.setCriterion()
    // @include dateRangeItem.setCriterion()
    // @visibility external
    //<
    setCriterion : function (criterion) {
        if (this.rangeItem) {
            this.rangeItem.setCriterion(criterion);
            var value = this.rangeItem.getValue();
            
            // call superclass 'setValue()' to update display and store
            // the new DateRange value derived from the criterion passed in
            // Pass flag to suppress updating the dateRangeItem again
            this.setValue(value, null, true);
        }
        
    },

    //> @method miniDateRangeItem.canEditCriterion()
    // @include dateRangeItem.canEditCriterion()
    // @visibility external
    //<
    canEditCriterion : function (criterion) {
        return this.rangeItem ? this.rangeItem.canEditCriterion(criterion) : false;
    },

    //> @method miniDateRangeItem.setValue()
    // Sets the value for this miniDateRangeItem.  The value parameter is a 
    // +link{object:DateRange} object that optionally includes both start and end values.
    // @param value (DateRange) the new value for this item
    // @visibility external
    //<
    setValue : function (value, allowNull, fromRangeItem) {
        // update this.fromDate / this.toDate
        this.updateStoredDates(value);
     
        // update the rangeItem
        if (!fromRangeItem) {
            this.rangeItem.setFromDate(this.fromDate);
            this.rangeItem.setToDate(this.toDate);
        }
        // this will store the value in the DynamicForm values object, and
        // refresh to display the value
        var newArgs = [this.getValue()];
        this.Super("setValue", newArgs, arguments);
    },
    
    updateStoredDates : function (value) {
       
        if (value != null) {
            if (isc.DataSource.isAdvancedCriteria(value)) {
                // value has come back as an AdvancedCriteria!
                var newValue = {};

                for (var i=0; i<value.criteria.length; i++) {
                    var criterion = value.criteria[i];
                    if (criterion.operator == "greaterThan" || criterion.operator == "greaterOrEqual")
                        newValue.start = criterion.value;
                    else if (criterion.operator == "lessThan" || criterion.operator == "lessOrEqual")
                        newValue.end = criterion.value;
                }
                value = newValue
            }

            this.fromDate = value.start;
            this.toDate = value.end;
        } else {
            this.fromDate = null;
            this.toDate = null;
        }
    },
    
    saveValue : function () {
        this.Super("saveValue", arguments);
        this.updateStoredDates(this._value);
    },
    
    // show the current value in our text box (called from setValue / updateValue)
    displayValue : function (value) {
        var displayValue = this.mapValueToDisplay(value) || "";
        this.setElementValue(displayValue, value);

    },
    
    updateValue : function(data) {
        // fires change handler / calls this.saveValue()
        if (!this._updateValue(data)) return;
        
        this.displayValue(data);
    },


    mapValueToDisplay : function (value) {
        if (value == null) return "";
        var fromDate = value.start,
            toDate = value.end,
            RDI = isc.RelativeDateItem,
            start = (RDI.isRelativeDate(fromDate) ?
                RDI.getAbsoluteDate(fromDate.value) : fromDate),
            end = (RDI.isRelativeDate(toDate) ? 
                RDI.getAbsoluteDate(toDate.value) : toDate)
        ;

        var prompt;
        if (start || end) {
            if (this.dateDisplayFormat) {
                if (start) prompt = this.formatDate(start);
                if (end) {
                    if (prompt) prompt += " - " + this.formatDate(end);
                    else prompt = this.formatDate(end);
                }
            } else prompt = Date.getFormattedDateRangeString(start, end);
            if (!start) prompt = this.toDateOnlyPrefix + " " + prompt;
            else if (!end) prompt = this.fromDateOnlyPrefix + " " + prompt;
        }
        this.prompt = prompt || "";
        return this.prompt;
    },

    //> @method miniDateRangeItem.getValue()
    // Retrieves the current value of this dateRangeItem.  The return value is a 
    // +link{object:DateRange} object that excludes start and end values if they aren't
    // set.
    // @return (DateRange) the current value of this item
    // @visibility external
    //<
    getValue : function () {
        if (!this.rangeItem) return;
        return this.rangeItem.getValue();
    },

    // formatDate() - given a live date object, returns the formatted date string to display
    // Only applies if useTextField is true.
    formatDate : function (date) {
        return isc.isA.Date(date) ? 
                    date.toShortDate(this.displayFormat, this.useCustomTimezone) : date;
    },
    
    getCriteriaValue : function () {
        return this.getCriterion();
    }


});


}


}
