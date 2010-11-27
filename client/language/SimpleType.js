/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-11-26 (2010-11-26)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 





//> @class GroupingMessages
// Grouping titles that will be displayed when data is grouped
// in a +link{ListGrid}.
// @treeLocation Client Reference/Grids/ListGrid
// @visibility external
//<
isc.ClassFactory.defineClass("GroupingMessages");

isc.GroupingMessages.addClassProperties({
    //> @classAttr GroupingMessages.upcomingTodayTitle   (string : "Today" : IRW)
    // When a +link{ListGrid} is grouped by a date field in 'Upcoming' mode, 
    // this is the group title for all records in which the grouped date field occurs today,
    // relative to the current date.
    // 
    // @visibility external
    // @group i18nMessages
    //<
    upcomingTodayTitle: "Today",
    
    //> @classAttr GroupingMessages.upcomingTomorrowTitle   (string : "Tomorrow" : IRW)
    // When a +link{ListGrid} is grouped by a date field in 'Upcoming' mode, 
    // this is the group title for all records in which the grouped date field occurs tomorrow,
    // relative to the current date.
    //
    // @visibility external
    // @group i18nMessages
    //<
    upcomingTomorrowTitle: "Tomorrow",
    
    //> @classAttr GroupingMessages.upcomingThisWeekTitle   (string : "This Week" : IRW)
    // When a +link{ListGrid} is grouped by a date field in 'Upcoming' mode, 
    // this is the group title for all records in which the grouped date field occurs this week,
    // relative to the current date.
    //
    // @visibility external
    // @group i18nMessages
    //<
    upcomingThisWeekTitle: "This Week",
    
    //> @classAttr GroupingMessages.upcomingNextWeekTitle   (string : "Next Week" : IRW)
    // When a +link{ListGrid} is grouped by a date field in 'Upcoming' mode, 
    // this is the group title for all records in which the grouped date field occurs next week, 
    // relative to the current date.
    // 
    // @visibility external
    // @group i18nMessages
    //<
    upcomingNextWeekTitle: "Next Week",
    
    //> @classAttr GroupingMessages.upcomingNextMonthTitle   (string : "Next Month" : IRW)
    // When a +link{ListGrid} is grouped by a date field in 'Upcoming' mode, 
    // this is the group title for all records in which the grouped date field occurs next month,
    // relative to the current date.
    //
    // @visibility external
    // @group i18nMessages
    //<
    upcomingNextMonthTitle: "Next Month",
    
    //> @classAttr GroupingMessages.upcomingBeforeTitle   (string : "Before" : IRW)
    // When a +link{ListGrid} is grouped by a date field in 'Upcoming' mode, 
    // this is the group title for all records in which the grouped date field occurs before
    // the current date.
    //
    // @visibility external
    // @group i18nMessages
    //<
    upcomingBeforeTitle: "Before",
    
    //> @classAttr GroupingMessages.upcomingLaterTitle   (string : "Later" : IRW)
    // When a +link{ListGrid} is grouped by a date field in 'Upcoming' mode, 
    // this is the group title for all records in which the grouped date field occurs later than
    // one month after today's date.
    //
    // @visibility external
    // @group i18nMessages
    //<
    upcomingLaterTitle: "Later",
    
    // ----------------date constants----------------------------------------------------------
    
    //> @classAttr GroupingMessages.byDayTitle   (string : "by Day" : IRW)
    // Title to use for the menu option which groups a date field by day.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byDayTitle: "by Day",
    
    //> @classAttr GroupingMessages.byWeekTitle   (string : "by Week" : IRW)
    // Title to use for the menu option which groups a date field by week. 
    //
    // @visibility external
    // @group i18nMessages
    //<
    byWeekTitle: "by Week",
    
    //> @classAttr GroupingMessages.byMonthTitle   (string : "by Month" : IRW)
    // Title to use for the menu option which groups a date field by month. 
    //
    // @visibility external
    // @group i18nMessages
    //<
    byMonthTitle: "by Month",
    
    //> @classAttr GroupingMessages.byQuarterTitle   (string : "by Quarter" : IRW)
    // Title to use for the menu option which groups a date field by quarter.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byQuarterTitle: "by Quarter",
    
    //> @classAttr GroupingMessages.byYearTitle   (string : "by Year" : IRW)
    // Title to use for the menu option which groups a date field by year.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byYearTitle: "by Year",
    
    //> @classAttr GroupingMessages.byDayOfMonthTitle   (string : "by Day of Month" : IRW)
    // Title to use for the menu option which groups a date field by day of month.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byDayOfMonthTitle: "by Day of Month",
    
    //> @classAttr GroupingMessages.byUpcomingTitle   (string : "by Upcoming" : IRW)
    // Title to use for the menu option which groups a date field by upcoming dates.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byUpcomingTitle: "by Upcoming",
    
    // -------------time contants--------------------------------------------------------------
    
    //> @classAttr GroupingMessages.byHoursTitle   (string : "by Hours" : IRW)
    // Title to use for the menu option which groups a time field by hours.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byHoursTitle: "by Hours",
    
    //> @classAttr GroupingMessages.byMinutesTitle   (string : "by Minutes" : IRW)
    // Title to use for the menu option which groups a time field by minutes.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byMinutesTitle: "by Minutes",
    
    //> @classAttr GroupingMessages.bySecondsTitle   (string : "by Seconds" : IRW)
    // Title to use for the menu option which groups a time field by seconds.
    //
    // @visibility external
    // @group i18nMessages
    //<
    bySecondsTitle: "by Seconds",
    
    //> @classAttr GroupingMessages.byMillisecondsTitle   (string : "by Milliseconds" : IRW)
    // Title to use for the menu option which groups a time field by milliseconds.
    //
    // @visibility external
    // @group i18nMessages
    //<
    byMillisecondsTitle: "by Milliseconds"
});

isc.builtinTypes =
{
    // basic types
  
    
    //any:{},
    text:{validators:{type:"isString", typeCastValidator:true}},
    "boolean":{validators:{type:"isBoolean", typeCastValidator:true}},
    integer:{validators:{type:"isInteger", typeCastValidator:true},
        normalDisplayFormatter : function (value, field) {
           if (isc.isA.Number(value)) return value.toFormattedString();
           return value;
        },
        getGroupValue : function(value, record, field, fieldName, grid) {
           var g = field.groupGranularity;
           return g ? Math.ceil(value / g) : value;
        },
        getGroupTitle : function(value, record, field, fieldName, grid) {
           // if the field is an integer and groupGranularity is set,
           // form the granularity string
           var g = field.groupGranularity;
           return g ? ((value - 1) * g) + " - " + (value * g) : value;
        }
    },
    "float":{validators:{type:"isFloat", typeCastValidator:true},
        normalDisplayFormatter : function (value, field) {
           if (isc.isA.Number(value)) return value.toFormattedString();
           return value;
        },
        getGroupValue : function(value, record, field, fieldName, grid) {
           // the field is a float and groupPrecision is set as positive integer
           field.groupPrecision = parseInt(field.groupPrecision);
           if (field.groupPrecision < 0) field.groupPrecision = field.groupPrecision * -1;
           var p = field.groupPrecision ? Math.pow(10, field.groupPrecision) : null;
           return p ? Math.floor(value * p) / p : value;
        },
        getGroupTitle : function(value, record, field, fieldName, grid) {
           // the field is a float type and groupPrecision is set
           // the return title should be appended with a *
           return field.groupPrecision ? value+"*" : value;
        }
    },
    date:{validators:{type:"isDate", typeCastValidator:true},
        normalDisplayFormatter : function (value, field) {
           if (isc.isA.Date(value)) return value.toNormalDate();
           return value;
        },
        groupingModes : {
            day: isc.GroupingMessages.byDayTitle,
            week: isc.GroupingMessages.byWeekTitle,
            month: isc.GroupingMessages.byMonthTitle,
            quarter:isc.GroupingMessages.byQuarterTitle,
            year:isc.GroupingMessages.byYearTitle,
            dayOfMonth:isc.GroupingMessages.byDayOfMonthTitle,
            upcoming:isc.GroupingMessages.byUpcomingTitle
        },
        defaultGroupingMode : "day", //default grouping mode
        groupingMode : this.defaultGroupingMode,
        getGroupValue : function(value, record, field, fieldName, grid) {
           var returnValue=value;
           // if groupingMode is undefined, pick it up here from defaultGroupingMode
           var groupingMode = field.groupingMode =
                (field.groupingMode || field._simpleType.defaultGroupingMode || null);
           // the field is a date and groupingModes is set
           if (isc.isA.Date(value) && groupingMode) {
               // check all possible values in the form {identified : return string}
               // { week:"by week", month:"by month", year:"by year" }
               // { dayOfWeek:"by day of week", dayOfMonth:"by day of month" }
               // { timezoneHours:"by Timezone hours", timezoneMinutes:"by Timezone Minutes" }
               // { timezoneSeconds:"by Timezone Seconds" }
               // { default: { day:"by day" }
               switch (groupingMode) {
                   case "year":
                       returnValue = value.getFullYear();
                   break;
                   case "quarter":
                       returnValue = Math.floor(value.getMonth() / 3) + 1;
                   break;
                   case "month":
                       returnValue = value.getMonth();
                   break;
                   case "week":
                       returnValue = value.getWeek();
                   break;
                   case "day":
                   case "dayOfWeek":
                       returnValue = value.getDay();
                   break;
                   case "dayOfMonth":
                       returnValue = value.getDate();
                   break;
                   case "timezoneHours":
                       returnValue = value.getTimezoneOffset()/60;
                   break;
                   case "timezoneMinutes":
                       returnValue = value.getTimezoneOffset();
                   break;
                   case "timezoneSeconds":
                       returnValue = value.getTimezoneOffset()*60;
                   break;
                   case "upcoming":
                       var today = new Date();
                       if (today.isToday(value)) return 1;
                       else if (today.isTomorrow(value)) return 2;
                       else if (today.isThisWeek(value)) return 3;
                       else if (today.isNextWeek(value)) return 4;
                       else if (today.isNextMonth(value)) return 5;
                       else if (today.isBeforeToday(value)) return 7;
                       else return 6;
                   break;
               }
           }
           return returnValue;
        },
        getGroupTitle : function(value, record, field, fieldName, grid) {
           var returnValue=value;
           // if groupingMode is undefined, pick it up here from defaultGroupingMode
           var groupingMode = field.groupingMode =
                (field.groupingMode || field._simpleType.defaultGroupingMode || null);
           // the field is a date and groupingModes is set

           if (groupingMode && value != "-none-") {
               // check all possible values in the form {identified : return string}
               // { week:"by week", month:"by month", year:"by year" }
               // { dayOfWeek:"by day of week", dayOfMonth:"by day of month" }
               // { timezoneHours:"by Timezone hours", timezoneMinutes:"by Timezone Minutes" }
               // { timezoneSeconds:"by Timezone Seconds" }
               // { default: { day:"by day" }
               switch (groupingMode) {
                   case "month":
                       returnValue = Date.getShortMonthNames()[value];
                   break;
                   case "quarter":
                       returnValue = "Q" + value;
                   break;
                   case "week":
                       returnValue = "Week #" + value;
                   break;
                   case "day":
                   case "dayOfWeek":
                       returnValue = Date.getShortDayNames()[value];
                   break;
                   case "dayOfMonth":
                       returnValue = value;
                   break;
                   case "timezoneHours":
                       returnValue = "GMT+" + value;
                   break;
                   case "timezoneMinutes":
                       returnValue = "GMT+" + value + " minutes";
                   break;
                   case "timezoneSeconds":
                       returnValue = "GMT+" + value + " seconds";
                   break;
                   case "upcoming":
                       var today = new Date();
                       if (value == 1) return isc.GroupingMessages.upcomingTodayTitle;
                       else if (value == 2) return isc.GroupingMessages.upcomingTomorrowTitle;
                       else if (value == 3) return isc.GroupingMessages.upcomingThisWeekTitle;
                       else if (value == 4) return isc.GroupingMessages.upcomingNextWeekTitle;
                       else if (value == 5) return isc.GroupingMessages.upcomingNextMonthTitle;
                       else if (value == 7) return isc.GroupingMessages.upcomingBeforeTitle;
                       else return isc.GroupingMessages.upcomingLaterTitle;
                   break;
               }
           }
           return returnValue;
        }
    },
    time:{validators:{type:"isTime", typeCastValidator:true},
        normalDisplayFormatter : function (value, field) {
           if (isc.isA.Date(value)) return isc.Time.toTime(value);
           return value;
        },
        groupingModes : {
            hours:isc.GroupingMessages.byHoursTitle,
            minutes:isc.GroupingMessages.byMinutesTitle,
            seconds:isc.GroupingMessages.bySecondsTitle,
            milliseconds:isc.GroupingMessages.byMillisecondsTitle
        },
        defaultGroupingMode : "hours", //default grouping mode
        groupingMode : this.defaultGroupingMode,
        getGroupValue : function(value, record, field, fieldName, grid) {
           var returnValue=value;
           // if groupingMode is undefined, pick it up here from defaultGroupingMode
           var groupingMode = field.groupingMode =
                (field.groupingMode || field._simpleType.defaultGroupingMode || null);
           // the field is a date and groupingModes is set
           if (isc.isA.Date(value) && groupingMode) {
               // check all possible values in the form {identified : return string}
               // { hours:"by Hours", minutes:"by Minutes", seconds:"by Seconds" }
               // { milliseconds:"by Milliseconds", }
               // { default: { hours:"by hours" }
               switch (groupingMode) {
                   case "hours":
                       returnValue = value.getHours();
                   break;
                   case "minutes":
                       returnValue = value.getMinutes();
                   break;
                   case "seconds":
                       returnValue = value.getSeconds();
                   break;
                   case "milliseconds":
                       returnValue = value.getMilliseconds();
                   break;
               }
           }
           return returnValue;
        },
        getGroupTitle : function(value, record, field, fieldName, grid) {
           var returnValue=value;
           var groupingMode = field.groupingMode || field._simpleType.defaultGroupingMode || null;
           // the field is a date and groupingModes is set
           if (groupingMode && value != "-none-") {
               // check all possible values in the form {identified : return string}
               // { hours:"by Hours", minutes:"by Minutes", seconds:"by Seconds" }
               // { milliseconds:"by Milliseconds", }
               // { default: { hours:"by hours" }
               switch (groupingMode) {
                   case "hours":
                   case "minutes":
                   case "seconds":
                   case "milliseconds":
                       returnValue = value;
                   break;
               }
           }
           return returnValue;
        }
    },

    // synonyms of basic types.  NOTE: must inheritFrom rather than duplicate base type
    // definitions, so that the equivalent of "instanceof" checks will detect them as
    // being of the same base type
    string:{inheritsFrom:"text"}, // XML Schema
    "int":{inheritsFrom:"integer"}, // XML Schema
    "long":{inheritsFrom:"integer"},
    number:{inheritsFrom:"integer"},
    decimal:{inheritsFrom:"float"}, // XML Schema
    "double":{inheritsFrom:"float"}, // XML Schema

    // derived types
    datetime:{inheritsFrom:"date",
        normalDisplayFormatter : function (value, field) {
           if (isc.isA.Date(value)) return value.toShortDateTime(null, true);
           return value;
        }
    },
    dateTime:{inheritsFrom:"datetime"},

    positiveInteger:{
        inheritsFrom:"integer",
        validators:{type:"integerRange", min:0}
    },
    integerPercent:{
        inheritsFrom:"integer",
        validators:{type:"integerRange", min:0, max:100}
    },
    percent:{inheritsFrom:"integerPercent"},
    sequence:{inheritsFrom:"integer"},
    "enum":{validators:"isOneOf"},
    "intEnum":{inheritsFrom:"integer",validators:"isOneOf"},
    regexp:{inheritsFrom:"text", validators:"isRegexp"},
    identifier:{inheritsFrom:"text", validators:"isIdentifier"},
    URL:{inheritsFrom:"text"},
    image:{inheritsFrom:"text"},
    HTML:{inheritsFrom:"text"},
    measure:{validators:"isMeasure"},
    integerOrAuto:{validators:"integerOrAuto"},
    expression:{inheritsFrom:"text"},
    method:{inheritsFrom:"text"},
    "function":{inheritsFrom:"text"},
    alignEnum:{
        inheritsFrom:"enum",
        valueMap:{left:"left", center:"center", right:"right"}
    },
    valignEnum:{
        inheritsFrom:"enum",
        valueMap:{top:"top", bottom:"bottom", center:"center"}
    },
    sideEnum:{
        inheritsFrom:"enum",
        valueMap:{left:"left", right:"right", top:"top", bottom:"bottom"}
    },
    color:{inheritsFrom:"string", validators:"isColor"},
    
    modifier: {inheritsFrom:"text", hidden: true, canEdit: false},
    modifierTimestamp: {inheritsFrom:"datetime", hidden: true, canEdit: false},
    creator: {inheritsFrom:"text", hidden: true, canEdit: false},
    creatorTimestamp: {inheritsFrom:"datetime", hidden: true, canEdit: false},
    password: {
        inheritsFrom:"text",
        normalDisplayFormatter : function (value, field) {
           return new Array((value && value.length > 0 ? value.length+1 : 0)).join("*");
        },
        shortDisplayFormatter : function (value, field) {
           return new Array((value && value.length > 0 ? value.length+1 : 0)).join("*");
        }
    }
};

(function () { 
    
    for (var typeName in isc.builtinTypes) {
        isc.builtinTypes[typeName].name = typeName;
    }
})();



//> @class SimpleType
// An atomic type such as a string or number, that is generally stored, displayed and
// manipulated as a single value.
// <P>
// SimpleTypes can be created at any time, and subsequently referred to as a 
// +link{dataSourceField.type,field type} in +link{DataSource,DataSources} and
// +link{DataBoundComponent,DataBoundComponents}.  This allows you to define
// +link{simpleType.validators,validation}, +link{simpleType.normalDisplayFormatter,formatting}
// and +link{simpleType.editorType,editing} behaviors for a type to be reused across all
// +link{DataBoundComponent,DataBoundComponents}.
// <P>
// Note that the term "simpleType" is used in the same sense as in
// +externalLink{XML Schema,http://www.w3.org/TR/xmlschema-0/}, and
// +link{XMLTools.loadXMLSchema()} will create new SimpleType definitions.
// <P>
// An +explorerExample{customSimpleType,example} is here.
//
// @treeLocation Client Reference/Data Binding
// @visibility external
// @example customSimpleType
//<

isc.defineClass("SimpleType").addClassMethods({

    //> @attr simpleType.name (identifier : null : IR)
    // Name of the type, used to refer to the type from +link{DataSourceField.name,field.name}.
    // @visibility external
    //<

    //> @attr simpleType.inheritsFrom (identifier : null : IR)
    // Name of another SimpleType from which this type should inherit.
    // <P>
    // Validators, if any, will be combined.  All other SimpleType properties default to the
    // inherited type's value.
    //
    // @visibility external
    // @example customSimpleType
    //<

    //> @attr simpleType.validators (Array of Validator : null : IR)
    // Validators to apply to value of this type.
    //
    // @group validation
    // @visibility external
    //<
    
    //> @attr simpleType.valueMap (ValueMap : null : IR)
    // List of legal values for this type, like +link{DataSourceField.valueMap}.
    //
    // @group dataType
    // @visibility external
    //<

    //> @attr simpleType.editorType (FormItem ClassName : null : IR)
    // Classname of the FormItem that should be the default for editing values of this type (eg
    // "SelectItem").
    // <P>
    // You can create a simple custom FormItem by adding default +link{FormItem.icons} that
    // launch custom value picking dialogs (an example is in the <i>QuickStart
    // Guide</i>, Chapter 9, <i>Extending SmartClient</i>).  By setting simpleType.editorType
    // to the name of your custom FormItem, forms will automatically use the custom FormItem,
    // as will grids performing +link{listGrid.canEdit,inline editing}.
    //
    // @visibility external
    //<

    //> @method simpleType.shortDisplayFormatter() 
    // Formatter for values of this type when compact display is required, for example, in a
    // +link{ListGrid} or +link{TreeGrid}.
    // <P>
    // When this formatter is called, the SimpleType object is available as "this".  
    // <P>
    // A formatter can make itself configurable on a per-component or per-field basis by
    // checking properties on the component or field.  For example, a formatter for account IDs
    // may want to omit a prefix in views where it is redundant, and could check a flag
    // listGridField.omitAccountIdPrefix for this purpose.
    //
    // @param value (any) value to be formatted
    // @param [field] (Field) field descriptor from the component calling the formatter, if
    //                      applicable.  Depending on the calling component, this could be a
    //                      +link{ListGridField}, +link{TreeGridField}, etc
    // @param [component] (DataBoundComponent) component calling this formatter, if applicable
    // @param [record] (Object) Full record, if applicable
    //
    // @visibility external
    //< 

    //> @method simpleType.normalDisplayFormatter() 
    // Normal formatter for values of this type used in a +link{StaticTextItem} or
    // +link{DetailViewer}.
    // <P>
    // When this formatter is called, the SimpleType object is available as "this".  
    // <P>
    // A formatter can make itself configurable on a per-component or per-field basis by
    // checking properties on the component or field.  For example, a formatter for account IDs
    // may want to omit a prefix in views where it is redundant, and could check a flag
    // detailViewer.omitAccountIdPrefix for this purpose.
    //
    // @param value (any) value to be formatted
    // @param [field] (Field) field descriptor from the component calling the formatter, if
    //                      applicable.  Depending on the calling component, this could be a
    //                      +link{FormItem}, +link{DetailViewerField}, etc
    // @param [component] (DataBoundComponent) component calling this formatter, if applicable
    // @param [record] (Object) Full record, if applicable
    //
    // @visibility external
    //<
    
    //> @method simpleType.editFormatter()
    // Formatter for values of this type when displayed in a freeform text editor, such as
    // a +link{TextItem}.
    // <P>
    // See also +link{simpleType.parseInput()} for parsing an edited text value back to
    // a data value.
    // @param value (any) value to be formatted
    // @param [field] (FormItem) Editor for this field
    // @param [form] (DynamicForm) DynamicForm containing this editor
    // @param [record] (Record) Current edit values for this record, as displayed in
    //      the edit component.
    //
    // @return (string) formatted value
    //
    // @visibility external
    //<
    
    //> @method simpleType.parseInput()
    // Parser to convert some user-edited value to an underlying data value of this type.
    // This parser is called when storing out values edited in a freeform editor such as
    // a +link{TextItem}. Typically this will convert from the format produced by 
    // +link{simpleType.editFormatter} back to a data value.
    //
    // @param value (String) edited value provided by the user
    // @param [field] (FormItem) Editor for this field
    // @param [form] (DynamicForm) DynamicForm containing this editor
    // @param [record] (Record) Current edit values for this record, as displayed in
    //      the edit component.
    //
    // @return (any) data value derived from display string passed in.
    //
    // @visibility external
    //<

    //> @classMethod SimpleType.getType()
    // Retrieve a simpleType definition by type name
    // @param typeName (string) the <code>name</code> of the simpleType to return
    // @returns (SimpleType) simple type object
    // @visibility external
    //<
    getType : function (typeName, ds) {
        // respect local types (dataSource.getType() calls us back, but without passing itself)
        if (ds) return ds.getType(typeName); 

        var type = isc.builtinTypes[typeName];
        return type;
    },

    
    
    // get the type this typeName or type definition inherits from
    getBaseType : function (type, ds) {
        if (isc.isA.String(type)) type = this.getType(type, ds);
        if (type == null) return null; // return null for being passed null and for
                                       // non-existent types
        while (type.inheritsFrom) {
            var parentType = this.getType(type.inheritsFrom, ds);
            if (parentType == null) return null; // no such parentType
            type = parentType;
        }
        return type.name;
    },

    // determine whether one type inherits from another
    inheritsFrom : function (type, otherType, ds) {
        if (isc.isA.String(type)) type = this.getType(type, ds);
        if (type == null) return false; // return false for non-existent types

        if (type.name == otherType) return true;
        while (type.inheritsFrom) {
            var parentType = this.getType(type.inheritsFrom, ds);
            if (parentType == null) return null; // no such parentType
            if (parentType.name == otherType) return true;
            type = parentType;
        }
        return false;
    },

    // validate a value of simple type
    validateValue : function (type, value, ds) {
        
        var field = { name:"_temp", type:type };
        isc.SimpleType.addTypeDefaults(field);
        var ds = ds || isc.DS.get("Object");
        return ds.validateFieldValue(field, value);
    },

    // add the type defaults to a field, once ever per field.
    // Happens to DataSources fields when fields are first accessed for the DataSource.
    // Happens to component.fields *which don't have a DataSource field* during DataSource
    // binding.  Otherwise, copied from DataSource fields like other properties.
    addTypeDefaults : function (field, ds) {
 
        if (field == null || field._typeDefaultsAdded) return;
        field._typeDefaultsAdded = true; // should only ever happen once per field

        // get the type definition, looking for locally defined type if a DataSource is passed
        // in
        var type = this.getType(field.type, ds);
        if (type == null) return;

        // hang the type definition itself on the field, since when formatters are called, they
        // need to be invoked on the type
        field._simpleType = type;

        // add the valueMap to the field
        if (field.valueMap == null) {
            var valueMap = this.getInheritedProperty(type, "valueMap", ds);
            if (valueMap != null) type.valueMap = field.valueMap = valueMap;
        }
        
        if (field.editorType == null) {
            var editorType = this.getInheritedProperty(type, "editorType", ds);
            if (editorType != null) type.editorType = field.editorType = editorType;
        }

        // add formatters / parsers
        
        var formatter = this.getInheritedProperty(type, "shortDisplayFormatter", ds)
        if (formatter != null) type.shortDisplayFormatter = field._shortDisplayFormatter = formatter;
        var formatter = this.getInheritedProperty(type, "normalDisplayFormatter", ds)
        if (formatter != null) type.normalDisplayFormatter = field._normalDisplayFormatter = formatter;
        // these aren't documented yet because they only get called by inline editing, not
        // normal forms
        var formatter = this.getInheritedProperty(type, "editFormatter", ds)
        if (formatter != null) type.editFormatter = field._editFormatter = formatter;
        var parser = this.getInheritedProperty(type, "parseInput", ds)
        if (parser != null) type.parseInput = field._parseInput = parser;

        // add validators
        var typeValidators = this.getValidators(type, ds);
        if (typeValidators == null) return;
    
        if (!field.validators) {
            
            field.validators = typeValidators;
        } else {
            // there are both field validators and type validators
            if (!isc.isAn.Array(field.validators)) field.validators = [field.validators];
            field.validators.addAsList(typeValidators);
            this._reorderTypeValidator(field.validators);
        }
    },

    // get a property that can be defined in this type, or any type this type inherits from
    getInheritedProperty : function (type, propertyName, ds) {
        while (type != null) {
            if (type[propertyName] != null) return type[propertyName]
            type = this.getType(type.inheritsFrom, ds);
        }
    },

    // return all validators for the given type (can be the name or the type definition), taking
    // inheritance into account
    
    getValidators : function (type, ds) {
        if (isc.isA.String(type)) type = this.getType(type, ds);

        // _normalized flag indicates we've already made sure the "validators" Array is in the
        // canconical Array of Objects format
        if (type._normalized) return type.validators;

        var validators = type.validators;

        if (validators != null) { 
            // handle validators expressed as a single string or object
            if (!isc.isAn.Array(validators)) validators = [validators];

            var normalizedValidators = [];
            // if any of the validators are strings, replace them with validator objects,
            // setting the type to the string
            for (var i = 0; i < validators.length; i++) {
                var validator = validators[i];
                if (isc.isA.String(validator)) {
                    validator = {"type":validator};
                
                } else if (validator.type == null && isc.isAn.emptyObject(validator)) {
                    continue;
                }
                validator._generated = true;
                normalizedValidators.add(validator);
            }
            validators = normalizedValidators;
        }

        // lookup the parent type's validators and combine
        var parentTypeID = type.inheritsFrom;
        if (parentTypeID != null) {
            var parentType = this.getType(parentTypeID, ds);
            if (parentType != null) {
                var parentValidators = this.getValidators(parentType, ds);
                if (parentValidators != null) {
                    validators = validators || [];
                    // NOTE: this intentionally places the subType's validators first, to allow
                    // error message overrides
                    validators.addAsList(parentValidators);
                    this._reorderTypeValidator(validators);
                }
            }
        }

        // flag this Array of validators as the default for the type
        if (validators) validators._typeValidators = true;

        // store the normalized and combined validators
        type.validators = validators;
        type._normalized = true;
        return validators;
    },
    _$typeCastValidator:"typeCastValidator",
    _reorderTypeValidator : function (validators) {
        

        //this.logWarn("validators are: " + this.echoAll(validators));

        // find the typeCast validator to determine the basic type this field inherits from
        // (equivalent to looking up the base type given the field type)
        var castValidator = validators.find(this._$typeCastValidator, true);
        if (castValidator) {
            // look for the most recent declaration of the basic type validator, in order to 
            // support redeclaration of the type validator with a custom error message, eg
            // { type:"isDate", errorMessage:"customMessage" }
            var castType = castValidator.type;
            //this.logWarn("cast validator is type: " + castType);
            for (var i = 0; i < validators.length; i++) {
                if (validators[i].type == castType) break;
            }
    
            // promote the most recent declaration of the basic type validator so that it will
            // run first, so subsequent validators don't have to check type
            
            //this.logWarn("moving validator to front: " + this.echo(validators[i]));
            if (i != 0) validators.unshift(validators[i]);
            validators[0].stopIfFalse = true;
        }
    },
    
    // -------------------------------------------------------------------------------
    // summary functions

    //> @type SummaryFunction
    // Function to produce a summary value based on an array of records and a field definition.
    // An example usage is the +link{listGrid.showGridSummary,listGrid summary row}, where
    // a row is shown at the bottom of the listGrid containing summary information about each
    // column.
    // <P>
    // SummaryFunctions may be specified in one of 2 ways:<ul>
    // <li>as an explicit function or executable
    // +link{type:stringMethod}, which will be passed <code>records</code> (an array of records)
    // and <code>field</code> (the field definition for which the summary is required).</li>
    // <li>as a standard SummaryFunction identifier</li></ul>
    //
    // @value sum Iterates through the set of records, picking up and summing all numeric values
    // for the specified field. Returns null to indicate invalid summary value if
    // any non numeric field values are encountered.
    // @value avg Iterates through the set of records, picking up all numeric values
    // for the specified field and determining the mean value. Returns null to indicate invalid
    // summary value if any non numeric field values are encountered.
    // @value max Iterates through the set of records, picking up all values
    // for the specified field and finding the maximum value. Handles numeric fields and
    // date type fields only. Returns null to indicate invalid
    // summary value if any non numeric/date field values are encountered.
    // @value min Iterates through the set of records, picking up all values
    // for the specified field and finding the minimum value.  Handles numeric fields and
    // date type fields only. Returns null to indicate invalid summary value if
    // any non numeric field values are encountered.
    // @value multiplier Iterates through the set of records, picking up all numeric values
    // for the specified field and multiplying them together.
    // Returns null to indicate invalid summary value if
    // any non numeric field values are encountered.
    // @value count Returns a numeric count of the total number of records passed in.
    //
    // @visibility external
    //<
    
    // set up default registered summary functions (documented above)
    _registeredSummaryFunctions:{
      sum : function (records, field) {
            var fieldName = field.name;
            if (!fieldName) return;
            var total = 0;
            for (var i = 0; i < records.length; i++) {
                var value = records[i][fieldName],
                    floatVal = parseFloat(value);

                if (value == null || value == isc.emptyString) continue;

                if (isc.isA.Number(floatVal) && (floatVal == value)) total += floatVal;
                // if we hit any invalid values, just return null - the grid will show
                // the 'invalidSummaryValue' marker
                else return null;
            }
            return total;
        },
        
        avg : function (records, field) {
            var fieldName = field.name;
            if (!fieldName) return;
            var total = 0, count=0;
            for (var i = 0; i < records.length; i++) {
                var value = records[i][fieldName],
                    floatVal = parseFloat(value);
                if (value == null || value == isc.emptyString) continue;

                if (isc.isA.Number(floatVal) && (floatVal == value)) {
                    count += 1;
                    total += floatVal;
                } else {
                    // if we hit any invalid values, just return null - the grid will show
                    // the 'invalidSummaryValue' marker
                    return null;
                }
            }
            return count > 0 ? total/count : null;
        },
        
        max : function (records, field) {
            var fieldName = field ? field.name :  null;
            if (!fieldName) return;
            
            var dateCompare = (field && (field.type == "date"));
            var max;
            for (var i = 0; i < records.length; i++) {
                var value = records[i][fieldName];
                if (value == null || value == isc.emptyString) continue;

                if (dateCompare) {
                    if (!isc.isA.Date(value)) return null;
                    if (max == null || value.getTime() > max.getTime()) max = value.duplicate(); 
                } else {
                    var floatVal = parseFloat(value);
                        
                    if (isc.isA.Number(floatVal) && (floatVal == value)) {
                        if (max == null) max = floatVal;
                        else if (max < value) max = floatVal;
                    } else {
                        // if we hit any invalid values, just return null - the grid will show
                        // the 'invalidSummaryValue' marker
                        return null;
                    }
                }
            }
            return max;
        },
        min : function (records, field) {
            var fieldName = field ? field.name : null;
            if (!fieldName) return;
            var dateCompare = (field.type == "date")
            var min;
            for (var i = 0; i < records.length; i++) {
                var value = records[i][fieldName];
                if (value == null || value == isc.emptyString) continue;

                if (dateCompare) {
                    if (!isc.isA.Date(value)) return null;
                    if (min == null || value.getTime() < min.getTime()) min = value.duplicate();
                } else {
                    var floatVal = parseFloat(value);
                    if (isc.isA.Number(floatVal) && (floatVal == value)) {
                        if (min == null) min = floatVal;
                        else if (min > value) min = floatVal;
                    } else {
                        return null;
                    }
                }
            }
            return min;
        },
        multiplier : function (records, field) {
            var fieldName = field ? field.name : null;
            if (!fieldName) return;
            var multiplier = 0;
            for (var i = 0; i < records.length; i++) {
                var value = records[i][fieldName];
               
                var floatVal = parseFloat(value);
                if (isc.isA.Number(floatVal) && (floatVal == value)) {
                    if (i == 0) multiplier = floatVal;
                    else multiplier = (multiplier * floatVal);
                } else {
                    return null;
                }
            }
            return multiplier;
        },
        count : function (records, field) {
            return records.length;
        }
        
    },
    
    //> @classMethod SimpleType.registerSummaryFunction()
    // Registers a new +link{type:summaryFunction} by name. After calling this method,
    // developers may specify the name passed in as a standard summaryFunction
    // (for example in +link{listGridField.summaryFunction}).
    // @param functionName (string) name for the newly registered summaryFunction
    // @param method (function) New summary function. This function should take 2 parameters -
    //   <code>records</code>: an array of records for which a summary must be generated, 
    //   and <code>field</code>: a field definition - and return a summary value for the field.
    // @visibility external
    //<
    registerSummaryFunction : function (functionName, method) {
        
        if (functionName == null) return;
        // handle being passed a stringMethod
        if (isc.isA.String(method)) {
             method = isc.Func.expressionToFunction("records,field", functionName);
        }
        this._registeredSummaryFunctions[functionName] = method;
    },
    
    //> @classMethod SimpleType.setDefaultSummaryFunction()
    // Set up a default summary function for some field type.
    // <P>
    // Note that the following default summary functions are set up when SmartClient initializes:
    // <br>- <code>"integer"</code> defaults to <code>"sum"</code>
    // <br>- <code>"float"</code> defaults to <code>"sum"</code>.
    //
    // @param typeName (string) type name
    // @param summaryFunction (SummaryFunction) summary function to set as the default for
    //   this data type.
    // @visibility external
    //<
    setDefaultSummaryFunction : function (type, summaryFunction) {
        var typeObj = this.getType(type);
        if (typeObj) typeObj._defaultSummaryFunction = summaryFunction;
    },
    
    //> @classMethod SimpleType.getDefaultSummaryFunction()
    // Retrieves the default summary function for some field type.
    // @param typeName (string) type name
    // @return (SummaryFunction) default summary function for this data type.
    // @visibility external
    //<
    getDefaultSummaryFunction : function (type) {
        var typeObj = this.getType(type);
        if (typeObj) {
            if (typeObj._defaultSummaryFunction != null) {
                return typeObj._defaultSummaryFunction;
            }
            if (typeObj.inheritsFrom != null && typeObj.inheritsFrom != type) {
                return this.getDefaultSummaryFunction(typeObj.inheritsFrom);
            }
        }
    },
    
    //> @classMethod SimpleType.applySummaryFunction()
    // Applies a +link{type:SummaryFunction} to an array of records
    // @param records (Array of Objects) set of records to retrieve a summary value for
    // @param field (DataSourceField) field for which we're picking up a summary value
    // @param summaryFunction (SummaryFunction) SummaryFunction to apply to the records
    //  in order to retrieve the summary value. May be specified as an explicit function
    //  or string of script to execute, or a SummaryFunction identifier
    // @return (any) summary value generated from the applied SummaryFunction
    // @visibility external
    //< 
    applySummaryFunction : function (records, field, summaryFunction) {
        if (!summaryFunction || !field || !records) return;
        
        // convert to an actual method to execute if necessary
        if (isc.isA.String(summaryFunction)) {
            if (this._registeredSummaryFunctions[summaryFunction]) {
                summaryFunction = this._registeredSummaryFunctions[summaryFunction];
            } else {
                summaryFunction = isc.Func.expressionToFunction("records,field", summaryFunction);
            }
        }
        if (isc.isA.Function(summaryFunction)) {
            return summaryFunction(records,field);
        }
    } 
    
});

// these are documented in setDefaultSummaryFunction
isc.SimpleType.setDefaultSummaryFunction("integer", "sum");
isc.SimpleType.setDefaultSummaryFunction("float", "sum");

isc.SimpleType.addMethods({
    init : function () {
        // anonymous type; really only occurs validly with xsd:list and xsd:union, otherwise
        // anonymous types are just rolled into a DataSourceField definition and never create a
        // SimpleType as such
        if (!this.name) this.name = isc.ClassFactory.getNextGlobalID(this);

        if (isc.builtinTypes[this.name] != null) {
            // clobber existing types, but not if the new type came from XML Schema (and hence
            // is namespaced and still available via the SchemaSet)
            if (!this.xmlSource) {
                this.logWarn("SimpleType '" + this.name + "' defined twice: " +
                             this.getStackTrace());
                isc.builtinTypes[this.name] = this;
            }
        } else {
            isc.builtinTypes[this.name] = this;
        }
        
        // If validOperators is set, register it with isc.DataSource
        if (this.validOperators != null) {
            isc.DataSource.setTypeOperators(this.name, this.validOperators);
        }
    }
});


isc.SimpleType.getPrototype().toString = function () {
    return "[" + this.Class + " name=" + this.name + 
        (this.inheritsFrom ? " inheritsFrom=" + this.inheritsFrom : "") + "]";
};
