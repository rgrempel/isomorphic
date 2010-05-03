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
// If both dates are entered, a Criterion with an "and" +link{type:OperatorId,operator} will be
// returned with both a "greaterThan" and "lessThan" sub-criteria.  If either date is omitted,
// only the "greaterThan" (from date) or "lessThan" (to date) Criterion is returned.
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

    if (hasFromValue && hasToValue) {
        // return an AdvanvedCriteria with two subCriteria
        result = { _constructor: "AdvancedCriteria", operator: "and",
            criteria: [
                { fieldName: this.fieldName || this.name, operator: "greaterThan", value: fromValue },
                { fieldName: this.fieldName || this.name, operator: "lessThan", value: toValue }
            ]
        };
    } else if (hasFromValue || hasToValue) {
        result = { 
            fieldName: this.fieldName || this.name, 
            operator: (hasFromValue ? "greaterThan" : "lessThan"), 
            value: (hasFromValue ? fromValue : toValue)
        };
    }

    return result;    
},

//> @method dateRangeItem.canEditCriterion()
// Returns true if the specified criterion contains:
// <ul><li>A single "lessThan" or "greaterThan" criterion on this field</li>
//     <li>An "and" type criterion containing a "lessThan" and a "greaterThan" criterion on
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
            if (innerCriterion.operator != "greaterThan" && innerCriterion.operator != "lessThan") 
            {
                this.logWarn("DynamicForm editing Advanced criteria. Includes criterion for " +
                    "field " +  dateField + ". A dateRange editor is showing for this field but " +
                    "the existing criteria has operator:" + innerCriterion.operator + ". DateRange " +
                    "items can only edit criteria greaterThan or lessThan so leaving this " +
                    "unaltered.");
                return false;
            }
        }
        // Only contains a range, with one or 2 values, so we'll allow editing of that.
        return true;
        
    // single criterion matching to or from of range.. We support that..
    } else if (criterion.fieldName == dateField) {
        if (criterion.operator != "greaterThan" && criterion.operator != "lessThan") {
            this.logWarn("DynamicForm editing Advanced criteria. Includes criterion for " +
                "field " +  dateField + ". A dateRange editor is showing for this field but " +
                "the existing criteria has operator:" + criterion.operator + ". DateRange " +
                "items can only edit criteria greaterThan or lessThan so leaving this " +
                "unaltered.");
            return false;
        }
        return true;
    }
    
    // in this case it's not on our field at all
    return false;
},

//> @method dateRangeItem.setCriterion()
// Applies the specified criterion to this item for editing. Applies any specified "greaterThan"
// operator criterion or sub-criterion to our +link{fromField} and any
// specified "lessThan" operator criterion or sub-criterion to our +link{toField}.
// @param criterion (Criterion) criterion to edit
// @group criteriaEditing
// @visibility external
//<
setCriterion : function (criterion) {
    var fromCrit, toCrit;
    if (criterion.operator == "and") {
        fromCrit = criterion.criteria.find("operator", "greaterThan");
        toCrit = criterion.criteria.find("operator", "lessThan");
    } else {
        if (criterion.operator == "greaterThan") fromCrit = criterion;
        else if (criterion.operator == "lessThan") toCrit = criterion;
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
    margin: 0,
    padding: 0,
    itemChanged : function (item, newValue) {
        this.creator.updateValue(this.getValuesAsCriteria());
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

    _createEditor: function(){
        var ds;
        var dynProps = {};

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
                displayformat: this.dateDisplayFormat, inputFormat: this.dateInputFormat,
                title: this.fromTitle, titleOrientation: this.form.titleOrientation,
                defaultValue: this.fromValue, 
                useTextField: (_constructor == "DateItem" ? true : null)
            } 
        );
        items[1] = isc.addProperties({}, this.toFieldDefaults, this.toFieldProperties,
            {
                name: "toField", _constructor: _constructor, baseDate: this.baseDate,
                displayformat: this.dateDisplayFormat, inputFormat: this.dateInputFormat,
                title: this.toTitle, titleOrientation: this.form.titleOrientation,
                defaultValue: this.toValue,
                useTextField: (_constructor == "DateItem" ? true : null)
            }
        );

        this.canvas.setFields(items);

        this.toField = this.canvas.getField("toField");
        this.fromField = this.canvas.getField("fromField");

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
    // +link{object:DateRange} object that optionally includes both start and end values.
    // @param value (DateRange) the new value for this item
    // @visibility external
    //<
    setValue : function (value) {
        if (value == null) return;
        if (value.start != null) this.setFromDate(value.start);
        if (value.end != null) this.setToDate(value.end);
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
            result = {};
        
        if (fromValue == null && toValue == null) return null;
        if (fromValue != null) result.start = fromValue;
        if (toValue != null) result.end = toValue;

        return result;
    },

    updateValue : function(data) {
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
width: 400,
height: 160,
vertical: "true",
showMinimizeButton: false,
headerIconProperties: {
    src: "[SKIN]/DynamicForm/DatePicker_icon.gif"
},

//> @attr headerTitle (String : "Select Date Range" : IR)
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

okButtonDefaults: {
    _constructor: "IButton",
    height: 22,
    title: "OK",
    autoParent: "buttonLayout",
    click : function () {
        this.creator.accept();
    }
},

cancelButtonDefaults: {
    _constructor: "IButton",
    height: 22,
    title: "Cancel",
    autoParent: "buttonLayout",
    click : function () {
        this.creator.cancel();
    }
},

buttonAutoChildren: ["buttonLayout", "okButton", "cancelButton"],

destroyOnClose: true


});

isc.DateRangeDialog.addMethods({
    initWidget : function () {
        this.title = this.headerTitle;
        
        this.Super("initWidget", arguments);
        this.addAutoChild("mainLayout");
        this.addAutoChild("rangeForm",
            {
                items: [
                    isc.addProperties({}, this.rangeItemDefaults, this.rangeItemProperties,
                        { name: "rangeItem", fromDate: this.fromDate, toDate: this.toDate }
                    )
                ]
            }
        );

        this.rangeItem = this.rangeForm.getField("rangeItem");
        
        this.rangeItem.canvas.numCols = 1;

        this.addAutoChildren(this.buttonAutoChildren);
        this.addItem(this.mainLayout);
    },

    accept : function () {
        this.finished(this.rangeItem.getValue());
    },

    cancel : function () {
        this.finished(null);
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
clipValue: true,
wrap: false,
valign: "center",
iconVAlign: "top",

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
allowRelativeDates: true

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


});

isc.MiniDateRangeItem.addMethods({
    init : function () {
        this.addAutoChild("rangeDialog", 
            {
                fromDate: this.fromDate, 
                toDate: this.toDate,
                callback: this.getID()+".rangeDialogCallback(value)"
            }
        );

        this.icons = [ 
            isc.addProperties({ prompt: this.pickerIconPrompt }, 
                this.pickerIconDefaults, this.pickerIconProperties
            )
        ];

        this.rangeItem = this.rangeDialog.rangeItem;
        this.rangeItem.fieldName = this.name;
    },

    showRangeDialog : function () {
        this.rangeDialog.rangeItem.setFromDate(this.fromDate);
        this.rangeDialog.rangeItem.setToDate(this.toDate);
        this.rangeDialog.show();
    },

    rangeDialogCallback : function (value) {
        if (value != null) {
            this.setValue(value);
        }
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
    // returned with both a "greaterThan" and "lessThan" sub-criteria.  If either date is omitted,
    // only the "greaterThan" (from date) or "lessThan" (to date) Criterion is returned.
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
        if (this.rangeItem) this.rangeItem.setCriterion(criterion);
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
    setValue : function (value) {
        if (value == null) return;

        if (isc.DataSource.isAdvancedCriteria(value)) {
            // value has come back as an AdvancedCriteria!
            var newValue = {};

            newValue.start = value.criteria[0].value;
            newValue.end = value.criteria[1].value;
            value = newValue
        }

        this.fromDate = value.start;
        this.toDate = value.end;

        var displayValue = this.mapValueToDisplay(value);
        this.setElementValue(displayValue, value);

        this.Super("setValue", [value]);
    },

    mapValueToDisplay : function (value) {
        if (value == null) return;
        var RDI = isc.RelativeDateItem,
            start = (RDI.isRelativeDate(this.fromDate) ?
                RDI.getAbsoluteDate(this.fromDate.value) : this.fromDate),
            end = (RDI.isRelativeDate(this.toDate) ? 
                RDI.getAbsoluteDate(this.toDate.value) : this.toDate)
        ;

        var prompt;
        if (start || end) {
            if (start) prompt = this.formatDate(start);
            if (end) {
                if (prompt) prompt += " - " + this.formatDate(end);
                else prompt = this.formatDate(end);
            }
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

    updateValue : function(data) {
        this._updateValue(data);
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
