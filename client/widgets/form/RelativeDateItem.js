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

 


// Class will not work without the ListGrid
if (isc.ListGrid) {





//> @class RelativeDateItem
// A FormItem for entering a date relative to today or relative to some other date, or a specific
// date.  Typically used for filtering data by date.
// <P>
// The RelativeDateItem consists of a +link{ComboBoxItem} where the user may directly choose 
// one of several +link{relativeDateItem.presetOptions, preset options}, choose to enter a 
// +link{relativeDateItem.quantityField, quantity} and +link{type:TimeUnit, time unit} 
// (eg "4 months ago" or "3 years from now") or directly type in 
// an absolute date value (7/18/2009).
// @visibility external
//<
isc.defineClass("RelativeDateItem", "CanvasItem");

isc.RelativeDateItem.addClassMethods({

    //> @type RelativeDate
    // A RelativeDate is a special string that represents a shortcut to a date phrase that can 
    // be automatically mapped to a +link{type:RelativeDateString} for use in widgets that 
    // leverage relative-dates, such as the +link{class:RelativeDateItem}.
    // <P>
    // Builtin options include
    // <ul>
    // <li> $now - this moment </li>
    // <li> $today - the start of today </li>
    // <li> $startOfToday - the start of today (same as $today) </li>
    // <li> $endOfToday - the end of today (one millisecond before the $startOfTomorrow </li>
    // <li> $yesterday - the start of yesterday </li>
    // <li> $startOfYesterday - the start of yesterday (same as $yesterday) </li>
    // <li> $endOfYesterday - the end of today (one millisecond before the $startOfToday) </li>
    // <li> $tomorrow - the start of tomorrow </li>
    // <li> $startOfTomorrow - the start of tomorrow (same as $tomorrow) </li>
    // <li> $endOfTomorrow - the end of tomorrow </li>
    // <li> $startOfWeek - the start of the current week </li>
    // <li> $endOfWeek - the end of the current week </li>
    // <li> $startOfMonth - the start of the current month </li>
    // <li> $endOfMonth - the end of the current month </li>
    // <li> $startOfYear - the start of the current year </li>
    // <li> $endOfYear - the end of the current year </li>
    // </ul>
    // 
    // <P>
    // 
    // @visibility external
    //<

    mapRelativeDateShortcut : function (relativeDate) {
        switch (relativeDate) {
            case "$now": return "+0MS";

            case "$today": 
            case "$startOfToday": 
                return "-0D";
            case "$endOfToday": return "+0D";

            case "$yesterday": 
            case "$startOfYesterday": 
                return "-1D";
            case "$endOfYesterday": return "-1ms[-0D]";

            case "$tomorrow": 
            case "$startOfTomorrow": 
                return "+1ms[D]";
            case "$endOfTomorrow": return "+1D";

            case "$startOfWeek": return "-0W";
            case "$endOfWeek": return "+0W";

            case "$startOfMonth": return "-0M";
            case "$endOfMonth": return "+0M";

            case "$startOfYear": return "-0Y";
            case "$endOfYear": return "+0Y";
        }
        return relativeDate;
    },

    //> @type RelativeDateString
    //  A string of known format used to specify a period of time.  For example, a 
    // RelativeDateString that represents "one year from today" is written as "+1y".
    // <P>
    // RelativeDateStrings are comprised of the following parts:
    // <ul>
    // <li>direction: the direction in which the quantity applies - one of + or - </li>
    // <li>quantity: the number of units of time to apply - a number </li>
    // <li>timeUnit: an abbreviated timeUnit to use - one of ms (millisecond), s (second), 
    //      mn (minute), h (hour), d (day), w (week), m (month), q (quarter, 3-months), 
    //      y (year), dc (decade) or c (century). </li>
    // <li>[qualifier]: an optional timeUnit encapsulated in square-brackets and used to offset 
    //      the calculation - eg. if +1d is "plus one day", +1d[W] is "plus one day from the 
    //      end of the week".  You may also specify another complete RelativeDateString as the
    //      [qualifier], which offers more control - eg, +1d[+1W] indicates "plus one day from 
    //      the end of NEXT week".</li>
    // </ul>
    // <P>
    // 
    // @visibility external
    //<

    //> @classMethod relativeDateItem.getAbsoluteDate() 
    //  Converts a +link{type:RelativeDate} to a concrete Date.
    // @param relativeDate (RelativeDate) the relative date to convert
    // @param [baseDate] (Date) base value for conversion.  Defaults to today
    // @return (Date) resulting absolute date value
    // @visibility external
    //<
    getAbsoluteDate : function (relativeDate, baseDate) {
        var RDI = isc.RelativeDateItem,
            value = relativeDate,
            localBaseDate = new Date()
        ;

        // if the relativeDate is one of the special values, map it to it's associated parsable
        // value
        value = RDI.mapRelativeDateShortcut(relativeDate);

        var parts = RDI.getRelativeDateParts(value);

        var absoluteDate;

        // if no baseDate passed in, assume now
        baseDate = baseDate || new Date();

        localBaseDate.setTime(baseDate.getTime());

        if (parts.qualifier) {
            parts.qualifier = parts.qualifier.toUpperCase();
            var qParts = RDI.getRelativeDateParts(parts.qualifier);

            var options = ["S", "MN", "H", "D", "W", "M", "Q", "Y"];
            // we have a qualifier, get rid of the brackets and upper-case it because we're
            // just going to run the baseDate through addDate(), which already understands
            // about capitals
            if (options.contains(qParts.period)) {
                localBaseDate = RDI.dateAdd(localBaseDate, 
                    qParts.period, qParts.countValue, (qParts.direction == "+" ? 1 : -1));
            } else {
                // invalid qualifier - log a warning and skip
                isc.logWarn("Invalid date-offset qualifier provided: "+qParts.period+".  Valid "+
                    "options are: S, MN, H, D, W, M, Q and Y.");
            }
        }

        // perform the date calculation
        absoluteDate = RDI.dateAdd(localBaseDate, parts.period, 
            parts.countValue, (parts.direction == "+" ? 1 : -1));

        /*
        alert("\n relativeDate="+relativeDate+
            "\n qualifier="+qualifier+
            "\n countValue="+countValue+
            "\n period="+period+
            "\n absoluteDate="+absoluteDate.toString());
        */

        return absoluteDate;
    },

    getRelativeDateParts : function (relativeDateString) {
        var value = relativeDateString,
            direction = value.substring(0,1),
            bracketIndex = value.indexOf("["),
            qualifier = (bracketIndex > 0 ? value.substring(bracketIndex) : null),
            withoutQualifier = (qualifier != null ? value.substring(1, bracketIndex) : value.substring(1)),
            countValue = parseInt(withoutQualifier),
            period = withoutQualifier.replace(countValue, "")
        ;

        return { 
            direction: (direction == "+" || direction == "-" ? direction : "+"), 
            qualifier: qualifier ? qualifier.replace("[", "").replace("]", "").replace(",", "") : null, 
            countValue: isc.isA.Number(countValue) ? countValue : 0, 
            period: period ? period : direction 
        };
    },

    isRelativeDate : function (value) {
        if (isc.isA.Date(value)) return false;

        if (isc.isAn.Object(value) && value._constructor == "RelativeDate") return true;

        return false;
    },

    getPeriodName : function (period) {
        var value = period.toLowerCase();
        switch (value) {
            case "ms": return "Millisecond";
            case "s": return "Second";
            case "mn": return "Minute";
            case "h": return "Hour";
            case "d": return "Day";
            case "w": return "Week";
            case "m": return "Month";
            case "q": return "Quarter";
            case "y": return "Year";
            case "dc": return "Decade";
            case "c": return "Century";
        }
    },

    // helper method for adding positive and negative amounts of any time-unit from 
    // milliseconds to centuries to a given date
    dateAdd : function (date, period, amount, multiplier) {
        var RDI = isc.RelativeDateItem,
            newDate = date;

        switch (period) {
            case "MS":
            case "ms":
                newDate.setMilliseconds(date.getMilliseconds()+(amount*multiplier));
                break;
            case "S":
            case "s":
                newDate.setSeconds(date.getSeconds()+(amount*multiplier));
                if (period == "S") {
                    newDate = RDI.getEndOf(newDate, "S");
                    break;
                }
                break;
            case "MN":
            case "mn":
                newDate.setMinutes(date.getMinutes()+(amount*multiplier));
                if (period == "MN") {
                    newDate = RDI.getEndOf(newDate, "MN");
                    break;
                }
                break;
            case "H":
            case "h":
                newDate.setHours(date.getHours()+(amount*multiplier));
                if (period == "H") {
                    newDate = RDI.getEndOf(newDate, "H");
                    break;
                }
                break;
            case "D":
            case "d":
                newDate.setDate(date.getDate()+(amount*multiplier));
                if (period == "D") {
                    switch (multiplier) {
                        case 1:
                            newDate = RDI.getEndOf(newDate, "D");
                            break;
                        case -1:
                            newDate = RDI.getStartOf(newDate, "D");
                            break;
                    }
                }
                break;
            case "W":
            case "w":
                newDate.setDate(date.getDate()+((amount*7)*multiplier));
                if (period == "W") {
                    // the end of whatever week newDate is in
                    newDate = RDI.getEndOf(newDate, "W");
                }
                break;
            case "M":
            case "m":
                newDate.setMonth(date.getMonth()+(amount*multiplier));
                if (period == "M") {
                    newDate = RDI.getEndOf(newDate, "M");
                }
                break;
            case "Q":
            case "q":
                newDate.setMonth(date.getMonth()+((amount*3)*multiplier));
                if (period == "Q") {
                    newDate = RDI.getEndOf(newDate, "Q");
                }
                break;
            case "Y":
            case "y":
                newDate.setFullYear(date.getFullYear()+(amount*multiplier));
                if (period == "Y") {
                    newDate = RDI.getEndOf(newDate, "Y");
                }
                break;
            case "DC":
            case "dc":
                newDate.setFullYear(date.getFullYear()+((amount*10)*multiplier));
                if (period == "DC") {
                    newDate = RDI.getEndOf(newDate, "DC");
                }
                break;
            case "C":
            case "c":
                newDate.setFullYear(date.getFullYear()+((amount*100)*multiplier));
                if (period == "C") {
                    newDate = RDI.getEndOf(newDate, "C");
                }
                break;
        }

        return newDate;
    },

    getStartOf : function (date, period) {
        var newDate = date;

        switch (period) {
            case "s":
            case "S":
                // start of second - bit dramatic, but may as well be there
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),
                    newDate.getHours(),newDate.getMinutes(),newDate.getSeconds(),0);
            case "mn":
            case "MN":
                // start of minute
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),
                    newDate.getHours(),newDate.getMinutes(),0,0);
            case "h":
            case "H":
                // start of hour
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),
                    newDate.getHours(),0,0,0);
            case "d":
            case "D":
                // start of day
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),0,0,0,0);
            case "w":
            case "W":
                // start of week
                newDate.setDate(date.getDate()-date.getDay());
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),0,0,0,0);
            case "m":
            case "M":
                // start of month
                return new Date(date.getFullYear(), date.getMonth(), 1,0,0,0,0);
            case "q":
            case "Q":
                // start of quarter
                var quarterStart = Math.floor((date.getMonth()+1)/3) * 3;
                return new Date(date.getFullYear(), quarterStart-1, 1,0,0,0,0);
            case "y":
            case "Y":
                // start of year
                return new Date(date.getFullYear(), 0, 1,0,0,0,0);
            case "dc":
            case "DC":
                // start of decade
                var decade = Math.floor(date.getFullYear() / 10) * 10;
                return new Date(decade, 0, 1,0,0,0,0);
            case "c":
            case "C":
                // start of century
                var century = Math.floor(date.getFullYear() / 100) * 100;
                return new Date(century, 0, 1,0,0,0,0);
        }

        return newDate;
    },
    getEndOf : function (date, period) {
        var newDate = date;

        switch (period) {
            case "s":
            case "S":
                // end of second - bit dramatic, but may as well be there
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),
                    newDate.getHours(),newDate.getMinutes(),newDate.getSeconds(),999);
            case "mn":
            case "MN":
                // end of minute
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),
                    newDate.getHours(),newDate.getMinutes(),59,999);
            case "h":
            case "H":
                // end of hour
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),
                    newDate.getHours(),59,59,999);
            case "d":
            case "D":
                // end of day
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(),23,59,59,999);
            case "w":
            case "W":
                // end of week
                newDate.setDate(date.getDate()+(6-date.getDay()));
                return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(),23,59,59,999);
            case "m":
            case "M":
                // end of month
                newDate = new Date(date.getFullYear(), date.getMonth()+1, 1, 23,59,59,999);
                newDate.setDate(newDate.getDate()-1);
                return newDate;
            case "q":
            case "Q":
                // end of quarter
                var quarterEnd = Math.floor((date.getMonth()+4)/3) * 3;
                newDate = new Date(date.getFullYear(), quarterEnd, 1,23,59,59,999);
                newDate.setDate(newDate.getDate()-1);
                return newDate;
            case "y":
            case "Y":
                // end of year
                return new Date(date.getFullYear(), 11, 31,23,59,59,999);
            case "dc":
            case "DC":
                // end of decade
                var decade = ((date.getFullYear() / 10) * 10) + 9;
                return new Date(decade, 11, 1,23,59,59,999);
            case "c":
            case "C":
                // end of century
                var century = (Math.floor(date.getFullYear() / 100) * 100) + 99;
                return new Date(century, 11, 1,23,59,59,999);
        }

        return newDate;
    }
});


isc.RelativeDateItem.addProperties({
//    titleOrientation: "top",
    height: 20,
    cellHeight: 20,
    canFocus: true,

    //> @type TimeUnit
    //   An enum of time-units available for use with the +link{RelativeDateItem}
    // 
    // @value "millisecond"    a millisecond time-unit
    // @value "second"    a second time-unit
    // @value "minute"    a minute time-unit
    // @value "hour"    an hour time-unit
    // @value "day"    a day time-unit
    // @value "week"    a week time-unit
    // @value "month"    a month time-unit
    // @value "quarter"    a quarter (3 month) time-unit
    // @value "year"    a year time-unit
    // 
    // @visibility external
    //<

    //> @attr relativeDateItem.timeUnitOptions (Array of TimeUnit : ["day", "week", "month"] : IR)
    // List of time units that will be offered for relative dates.
    // <P>
    // Each available time unit option will cause two options to appear in the 
    // +link{valueField}.  For example, if "day" is an available +link{type:TimeUnit,time unit}
    // option, there will be +link{relativeDateItem.daysAgoTitle, "N days ago"} and 
    // +link{relativeDateItem.daysFromNowTitle, "N days from now"}.
    // 
    // @visibility external
    //<
    timeUnitOptions: ["day", "week", "month"],

    // i18n attributes
    
    //> @attr relativeDateItem.todayTitle (string : "Today" : IR)
    // The title to show when the no +link{baseDate} is provided and the default becomes today.
    // @visibility external
    // @group i18nMessages
    //<
    todayTitle: "Today",

    //> @attr relativeDateItem.millisecondsAgoTitle (string : "N milliseconds ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "millisecond".
    // @visibility external
    // @group i18nMessages
    //<
    millisecondsAgoTitle: "N milliseconds ago",

    //> @attr relativeDateItem.secondsAgoTitle (string : "N seconds ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "second".
    // @visibility external
    // @group i18nMessages
    //<
    secondsAgoTitle: "N seconds ago",

    //> @attr relativeDateItem.minutesAgoTitle (string : "N minutes ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "minute".
    // @visibility external
    // @group i18nMessages
    //<
    minutesAgoTitle: "N minutes ago",

    //> @attr relativeDateItem.hoursAgoTitle (string : "N hours ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "hour".
    // @visibility external
    // @group i18nMessages
    //<
    hoursAgoTitle: "N hours ago",

    //> @attr relativeDateItem.daysAgoTitle (string : "N days ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "day".
    // @visibility external
    // @group i18nMessages
    //<
    daysAgoTitle: "N days ago",

    //> @attr relativeDateItem.weeksAgoTitle (string : "N weeks ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "week".
    // @visibility external
    // @group i18nMessages
    //<
    weeksAgoTitle: "N weeks ago",

    //> @attr relativeDateItem.monthsAgoTitle (string : "N months ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "month".
    // @visibility external
    // @group i18nMessages
    //<
    monthsAgoTitle: "N months ago",

    //> @attr relativeDateItem.yearsAgoTitle (string : "N years ago" : IR)
    // The title to show for historical periods when the +link{type:TimeUnit} is "year".
    // @visibility external
    // @group i18nMessages
    //<
    yearsAgoTitle: "N years ago",

    //> @attr relativeDateItem.millisecondsFromNowTitle (string : "N milliseconds from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "millisecond".
    // @visibility external
    // @group i18nMessages
    //<
    millisecondsFromNowTitle: "N milliseconds from now",

    //> @attr relativeDateItem.secondsFromNowTitle (string : "N seconds from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "second".
    // @visibility external
    // @group i18nMessages
    //<
    secondsFromNowTitle: "N seconds from now",

    //> @attr relativeDateItem.minutesFromNowTitle (string : "N minutes from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "minute".
    // @visibility external
    // @group i18nMessages
    //<
    minutesFromNowTitle: "N minutes from now",

    //> @attr relativeDateItem.hoursFromNowTitle (string : "N hours from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "hour".
    // @visibility external
    // @group i18nMessages
    //<
    hoursFromNowTitle: "N hours from now",

    //> @attr relativeDateItem.daysFromNowTitle (string : "N days from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "day".
    // @visibility external
    // @group i18nMessages
    //<
    daysFromNowTitle: "N days from now",

    //> @attr relativeDateItem.weeksFromNowTitle (string : "N weeks from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "week".
    // @visibility external
    // @group i18nMessages
    //<
    weeksFromNowTitle: "N weeks from now",

    //> @attr relativeDateItem.monthsFromNowTitle (string : "N months from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "month".
    // @visibility external
    // @group i18nMessages
    //<
    monthsFromNowTitle: "N months from now",

    //> @attr relativeDateItem.yearsFromNowTitle (string : "N years from now" : IR)
    // The title to show for future periods when the +link{type:TimeUnit} is "year".
    // @visibility external
    // @group i18nMessages
    //<
    yearsFromNowTitle: "N years from now",

    //> @attr relativeDateItem.defaultValue (Date or RelativeDateString or TimeUnit : "$today" : IR)
    // Default value to show.  Can be a concrete Date, a +link{RelativeDateString} that matches 
    // one of the +link{relativeDateItem.presetOptions}, or one of the available 
    // +link{relativeDateItem.timeUnitOptions, time units}.  If setting a +link{type:TimeUnit},
    // use +link{relativeDateItem.defaultQuantity, defaultQuantity} to establish a default 
    // value for the +link{relativeDateItem.quantityField, quantityField}.
    // 
    // @visibility external
    //<
    defaultValue: "$today",

    //> @attr relativeDateItem.operator (OperatorId : "greaterThan" : IR)
    // What operator to use when +link{getCriterion()} is called.
    // 
    // @visibility external
    //<
    operator: "greaterThan",

    //> @attr relativeDateItem.presetOptions (Object : see below : IR)
    // Preset relative dates, such as "today" or "tomorrow", that the user can choose directly
    // from the +link{valueField}.
    // <P>
    // Format is an Object mapping user-visible titles to +link{RelativeDateString}s.  The 
    // default value (expressed in JSON) is:
    // <pre>
    // {
    //     "$today" : "Today",
    //     "$yesterday" : "Yesterday",
    //     "$tomorrow" : "Tomorrow",
    //     "-1w" : "Current day of last week",
    //     "+1w" : "Current day of next week",
    //     "-1m" : "Current day of last month",
    //     "+1m" : "Current day of next month"
    // }
    // </pre>
    // In addition to these presets, options are shown for each of the 
    // +link{type:TimeUnit, timeUnit options}.
    // 
    // @visibility external
    //<
    presetOptions: {
        "$today" : "Today",
        "$yesterday" : "Yesterday",
        "$tomorrow" : "Tomorrow",
        "-1w" : "Current day of last week",
        "+1w" : "Current day of next week",
        "-1m" : "Current day of last month",
        "+1m" : "Current day of next month"
    },

    //> @attr relativeDateItem.valueField (AutoChild ComboBoxItem : null : IR)
    // +link{ComboBoxItem} field where a user may choose among 
    // +link{relativeDateItem.presetOptions, presets}, 
    // +link{type:TimeUnit, time unit} plus +link{relativeDateItem.quantityField,quantity}, or 
    // direct entry of a date as text.
    // 
    // @visibility external
    //<
    valueFieldDefaults: {
        type: "ComboBoxItem",
        name: "valueField",
        showTitle: false,
        shouldSaveValue: false,
        validateOnChange: false
    },

    //> @attr relativeDateItem.defaultQuantity (integer : 1 : IR)
    // Default quantity to show in the +link{quantityField}.
    // 
    // @visibility external
    //<
    defaultQuantity: 1,

    //> @attr relativeDateItem.quantityField (AutoChild SpinnerItem : null : IR)
    // Field allowing user to pick units of time, eg, number of days.
    // 
    // @visibility external
    //<
    quantityFieldDefaults: {
        type: "SpinnerItem",
        name: "quantityField",
        width: 60,
        min: 0,
        step: 1,
        showTitle: false,
        shouldSaveValue: false,
        selectOnFocus: true
    },

    //> @attr relativeDateItem.showChooserIcon (boolean : true : IRW)
    //      Should we show the icon that shells a date-chooser?
    // @visibility external
    //<
    showChooserIcon:true,

    //> @attr relativeDateItem.pickerIcon (AutoChild FormItemIcon : null : IR)
    // Icon that launches a +link{DateChooser} for choosing an absolute date.
    // 
    // @visibility external
    //<
    pickerIconDefaults: {
        name: "chooserIcon",
        showOver: false,
        showFocused: false,
        showFocusedWithItem: false,
        neverDisable: true,
        src:"[SKIN]/DynamicForm/DatePicker_icon.gif"
    },

    //> @attr relativeDateItem.pickerIconPrompt (string : "Show Date Chooser" : IR)
    // Prompt to show when the user hovers the mouse over the picker icon for this 
    // RelativeDateItem. May be overridden for localization of your application.
    // @visibility external
    // @group i18nMessages
    //<
    pickerIconPrompt : "Show Date Chooser",

    //> @attr relativeDateItem.pickerConstructor (string : "DateChooser" : [IR])
    // SmartClient class for the +link{picker, dateChooser} autoChild displayed to allow the user
    // to directly select dates.
    // @visibility external
    //<
    pickerConstructor: "DateChooser",

    //> @attr relativeDateItem.baseDate (Date : null : IR)
    // Base date for calculating the relative date entered by the user.
    // <P>
    // The default is to use the current date.
    // 
    // @visibility external
    //<

    //> @attr relativeDateItem.showCalculatedDateField (boolean : true : IRW)
    //  Should the Calculated-Date be displayed to the right of the +link{pickerIcon}.
    // @visibility external
    //<
    showCalculatedDateField:true,

    //> @attr relativeDateItem.calculatedDateField (AutoChild BlurbItem : null : IR)
    // Field that shows the current calculated date by adding the user-entered relative date to
    // the +link{baseDate}.
    // 
    // @visibility external
    //<
    calculatedDateFieldDefaults: {
        type: "BlurbItem",
        name: "calculatedDateField",
        border:"1px solid black;",
        width: "*",
        startRow: false,
        showTitle: false,
        shouldSaveValue: false
    },

    //> @attr relativeDateItem.inputFormat (DateInputFormat : null : IR)
    // Format for direct user input of date values.
    // <P>
    // If unset, the input format will be determined based on the specified
    // +link{displayFormat} if possible, otherwise picked up from the Date class (see
    // +link{Date.setInputFormat()}).
    // 
    // @visibility external
    //<

    //> @attr relativeDateItem.displayFormat (DateFormat : null : IR)
    // Format for displaying dates in the +link{valueField} and +link{calculatedDateField}.  
    // Defaults to the system-wide default established by +link{Date.setDefaultDisplayFormat()}.
    // 
    // @visibility external
    //<

    //> @attr relativeDateItem.startDate (Date : 1/1/1995 : IRW)
    // @include dateItem.startDate
    // @group appearance
    // @visibility external
    //<
    startDate:isc.DateItem.DEFAULT_START_DATE,    

    //> @attr relativeDateItem.endDate (Date : 12/31/2015 : IRW)
    // @include dateItem.endDate
    // @group appearance
    // @visibility external
    //<
    endDate:isc.DateItem.DEFAULT_END_DATE,

    //> @attr relativeDateItem.centuryThreshold (number : 25 : IRW)
    // @include dateItem.centuryThreshold
    // @visibility external
    //<
    centuryThreshold:isc.DateItem.DEFAULT_CENTURY_THRESHOLD,

    shouldSaveValue: true,

    //> @attr relativeDateItem.editor (AutoChild : null : [IRW])
    //
    // The editor that will be rendered inside this item.  Unless overridden, the editor will be
    // an instance of +link{class:DynamicForm}. It will be created using the overrideable 
    // defaults standard to the +link{group:autoChildren,AutoChild} subsystem - editorConstructor 
    // and editorProperties.
    //
    //  @visibility internal
    //<
    editorConstructor: "DynamicForm",
    editorDefaults: {
        numCols: 4,
        width: 290,
        colWidths: [130, "*", "*"],
        itemChanged : function (item, newValue) {
            this.creator.updateValue(this.creator.getValue());
        }
    },

    //> @attr relativeDateItem.useSharedPicker (boolean : true : [IR])
    // When set to true (the default), use a single shared date-picker across all widgets that
    // use one.  When false, create a new picker using the autoChild system.  See 
    // +link{dateItem.pickerDefaults, picker} and 
    // +link{dateItem.pickerProperties, pickerProperties} for details on setting up an unshared
    // picker.
    // @visibility external
    //<
    useSharedPicker: false,

    //> @attr relativeDateItem.pickerDefaults (DateChooser : see below : [IR])
    // Defaults for the +link{DateChooser} created by this form item.
    //<
    pickerDefaults: {
        width: isc.DateItem.chooserWidth,
        height: isc.DateItem.chooserHeight,
//        border: "none",
        // show a cancel button that closes the window
        showCancelButton: true,
        autoHide: true
    }

    //> @attr relativeDateItem.pickerProperties (DateChooser : see below : [IR])
    // Properties for the +link{DateChooser} created by this form item.
    //<

/*
    
    //> @attr relativeDateItem.pickerIconProperties (object : {...} : IRW)
    // Properties for the pickerIcon.
    // @visibility pickerIcon
    //<
    pickerIconProperties:{
    },
*/
    

});

isc.RelativeDateItem.addMethods({
    
    init : function () {
        this._createEditor();
        this.Super("init", arguments);
    },

    isEditable : function () {
        return true;
    },

    _createEditor: function(){
        var ds;
        var dynProps = { _suppressColWidthWarnings: true };
        this.addAutoChild("editor", dynProps);
        this.canvas = this.editor;        

        var _this = this,
            items = [],
            blurbIndex=2
        ;

        items[0] = isc.addProperties({}, this.valueFieldDefaults, this.valueFieldProperties,
            { 
                valueMap: this.getValueFieldOptions(),
                changed : function (form, item, value) {
                    
                    _this.delayCall("valueFieldChanged", [value], 1);
                }
            } 
        );
        items[1] = isc.addProperties({}, this.quantityFieldDefaults, 
            this.quantityFieldProperties, 
            { 
                defaultValue: this.defaultQuantity,
                changed : function (form, item, value) {
                    _this.quantityFieldChanged(value);
                }
            } 
        );
        
        if (this.showChooserIcon) {
            blurbIndex = 3;
            items[2] = { name: "iconPlaceholder", type: "staticText", width: 1, 
                showTitle: false,
                icons: [
                    isc.addProperties({ prompt: this.pickerIconPrompt }, 
                        this.pickerIconDefaults, this.pickerIconProperties,
                            {
                                click : function () {
                                _this.showPicker();
                            }
                        }
                    )
                ]
            };
        }

        // set a default baseDate is one wasn't provided
        this.baseDate = this.baseDate || new Date();

        if (this.showCalculatedDateField) {
            items[blurbIndex] = isc.addProperties({}, this.calculatedDateFieldDefaults, 
                this.calculatedDateFieldProperties,
                { cellStyle: this.getHintStyle() });
        }

        this.canvas.setFields(items);

        this.valueField = this.canvas.getField("valueField");
        this.quantityField = this.canvas.getField("quantityField");
        if (this.showCalculatedDateField) 
            this.calculatedDateField = this.canvas.getField("calculatedDateField");
        if (this.showChooserIcon) {
            this.iconPlaceholder = this.canvas.getField("iconPlaceholder");
            this.pickerIcon = this.iconPlaceholder.icons.find("name", "chooserIcon");
        }

        this.setValue(this.defaultValue);
    },

    valueFieldChanged : function (value, fromSetValue) {
        var range = this.valueField.getSelectionRange();
        this.fieldChanged();
        if (range) this.valueField.delayCall("setSelectionRange", [range[0], range[1]]);
        if (!fromSetValue && this.quantityField.isVisible()) this.quantityField.delayCall("focusInItem");
    },
    quantityFieldChanged : function (value) {
        this.fieldChanged();
    },

    fieldChanged : function () {
        if (!this.valueField || !this.quantityField) return;
        
        var value = this.valueField.getValue(),
            quantity = this.quantityField.getValue();

        var showQuantity = (value && isc.isA.String(value) && this.relativePresets[value]);

        if (!showQuantity) {
            this.quantityField.hide();
        } else {
            this.quantityField.show();
        }

        if (this.calculatedDateField) {
            var value = this.getValue();
            this.calculatedDateField.setValue(!value ? "" : 
                "("+this.formatDate(value)+")");
        }
    },
    
    getValueFieldOptions : function () {
        var options = isc.clone(this.presetOptions);

        this.relativePresets = {};

        // add two entries for each available time-unit, one historical, the other futuristic
        for (var i=0; i< this.timeUnitOptions.length; i++) {
            var key = this.timeUnitOptions[i];
            options[key+"_ago"] = this[key+"sAgoTitle"];
            options[key+"_fromNow"] = this[key+"sFromNowTitle"];
            this.relativePresets[key+"_ago"] = true;
            this.relativePresets[key+"_fromNow"] = true;
        }

        return options;
    },

    setValue : function (value) {
        if (value == null) {
            this.valueField.setValue(null);
            this.valueFieldChanged(value, true);
            return;
        }

        if (isc.isA.Date(value) || this.valueField.valueMap[value] || 
                (value.value && this.valueField.valueMap[value.value])) 
        {
            // the defaultValue is a preset or a date, just set the value
            this.valueField.setValue(isc.isA.Date(value) ? this.formatDate(value) : 
                    value.value ? value.value : value);
            this.valueFieldChanged(value, true);
            return;
        }

        if (this.timeUnitOptions.contains(value)) {
            // the defaultValue is a timeUnit - select the future version of it
            value += "_fromNow";
            this.valueField.setValue(value);
            this.valueFieldChanged(value, true);
            return;
        }

        if (value != null) {
            // a defaultValue was provided, but it's none of preset, timeUnit or date 
            // if it's NOT a relativeDate, just use the original default, $today
            if (!isc.RelativeDateItem.isRelativeDate(value)) {
//                this.valueField.setValue("$today");
//                this.valueFieldChanged(value);
            } else {
                var key, quantity;
                // it's a relatievDate - we need to parse it out and set both value and quantity
                if (isc.isAn.Object(value) && value.value) {
                    var parts = isc.RelativeDateItem.getRelativeDateParts(value.value),
                        period = isc.RelativeDateItem.getPeriodName(parts.period),
                        suffix = (parts.direction == "+" ? "fromNow" : "ago")
                    ;
                    quantity = parts.countValue;
                    key = period ? period.toLowerCase()+"_"+suffix : null;
                }

                if (key && this.valueField.valueMap[key]) {
                    this.valueField.setValue(key);
                    this.quantityField.setValue(quantity);
                } else {
                    // the period to which this relativeDate applies is not in the list
//                    this.valueField.setValue("$today");
                }
                this.valueFieldChanged(value, true);
            }
        }
    },

    getValue : function () {
        if (!this.valueField || !this.quantityField) return;
        var relativeDate = this.getRelativeDate();
        if (relativeDate) 
            return isc.RelativeDateItem.getAbsoluteDate(relativeDate.value, this.baseDate);

        var value = this.valueField.getValue(),
            dateValue = this.parseDate(value, this.getInputFormat());
        if (isc.isA.Date(dateValue)) return dateValue;

        return null;
    },

    //> @method relativeDateItem.getRelativeDate()
    // Returns an object that specifies a RelativeDate.
    // <pre>
    //     { _constructor: "RelativeDate", value: "$today" }
    // </pre>
    //
    // @return object an object containing the relativeDate string for the current value
    // @visibility external
    //<
    getRelativeDate : function () {
        var value = this.valueField.getValue(),
            quantity = this.quantityField.getValue()
        ;

        if (!value || !isc.isA.String(value)) return null;

        var firstChar = value.substring(0,1);

        if (firstChar == "+" || firstChar == "-" || firstChar == "$") {
            // this is a relativeDate anyway, just return it
            return this.getRelativeDateObject(value);
        }

        // check for one of the other built-in types (in the format [period]_ago, [period]_fromNow
        var underscoreIndex = value.indexOf("_");

        if (underscoreIndex >= 0) {
            var period = value.substring(0, underscoreIndex),
                direction = (value.substring(underscoreIndex+1) == "ago" ? "-" : "+"),
                key
            ;

            switch (period) {
                case "millisecond": key = "ms"; break;
                case "second": key = "s"; break;
                case "minute": key = "mn"; break;
                case "hour": key = "h"; break;
                case "day": key = "d"; break;
                case "week": key = "w"; break;
                case "month": key = "m"; break;
                case "quarter": key = "q"; break;
                case "year": key = "y"; break;
                case "decade": key = "dc"; break;
                case "century": key = "c"; break;
                default: key = null;
            }

            if (key) {
                value = direction + quantity + key;
                return this.getRelativeDateObject(value);
            }
        }

        return null;
    },

    getRelativeDateObject : function (relativeDate) {
        return { _constructor: "RelativeDate", value: relativeDate };
    },

    updateValue : function(data) {
        var tempValue = this.valueField.getValue();
        this._updateValue(data);
        this._suppressUpdates = true;
        this.valueField.setValue(tempValue);
        this.valueFieldChanged();
        this._suppressUpdates = false;
    },

    getCriteriaValue : function () {
        return this.getRelativeDate();
    },

    //> @method relativeDateItem.getCriterion()
    // Get the criterion based on the values the user has entered.
    // @param [absolute] (boolean) whether to use an absolute date in the Criterion produced.  
    //                             By default a +link{RelativeDate} will be used if the user 
    //                             entered a relative date value
    // @return Criterion
    // 
    // @visibility external
    //<
    getCriterion : function (absolute) {
        var value = this.valueField.getValue();

        if (absolute == null && isc.RelativeDateItem.isRelativeDate(value)) absolute = false;

        var date = (absolute ? this.getValue() : this.getRelativeDate());
        return { operator: this.operator, value: date };
    },


//////  Possibly unnecessary methods that show the dateChooser and suchlike

    getCellHeight : function () {
        var cellHeight = this.Super("getCellHeight", arguments);
        if (isc.Browser.isIE && this.useTextField && isc.isA.Number(cellHeight)) cellHeight += 2;
        return cellHeight;
    },    

    // Methods effecting the dateChooser

    getPickerIcon : function (a,b,c,d) {
        var icon = this.invokeSuper(isc.DateItem, "getPickerIcon", a,b,c,d);
        if (icon.prompt == null) icon.prompt = this.pickerIconPrompt;
        return icon;
    },

    // override 'showPicker' - instead of creating a picker instance we're reusing a shared
    // one.
    showPicker : function () {

        if (!this.picker) {
            if (this.useSharedPicker) this.picker = isc.DateChooser.getSharedDateChooser();
            else {
                this.picker = isc[this.pickerConstructor].create(
                    isc.addProperties({}, this.pickerDefaults, this.pickerProperties, 
                        {
                            _generated:true,
                            // When re-using a DateChooser, we're almost certainly displaying it as a 
                            // floating picker rather than an inline element. Apply the common options for 
                            // a floating picker
                            autoHide:true,
                            showCancelButton:true
                        }
                    )
                );
            }
        }

        var picker = this.picker;

        var oldItem = picker.callingFormItem;
        if (oldItem != this) {
            if (oldItem) oldItem.ignore(picker, "dataChanged");
            this.observe(picker, "dataChanged", "observer.pickerDataChanged(observed)");
            
            picker.callingFormItem = this;
            picker.callingForm = this.canvas; // this.form;
            
            picker.locatorParent = this.canvas; //this.form;
        }

        picker.startYear = this.getStartDate().getFullYear();
        picker.endYear = this.getEndDate().getFullYear();

        return this.Super("showPicker", arguments);
        
    },

    // custom code to center the picker over the picker icon
    getPickerRect : function () {
        // we want the date chooser to float centered over the picker icon.
        var left = this.getPageLeft(),
            top = this.getPageTop(),
            
            chooserWidth = isc.DateItem.chooserWidth + 3,
            chooserHeight = isc.DateItem.chooserHeight + 3,
            form = this.canvas,
            item
        ;

        item = form.getItem("iconPlaceholder");

        left += item.getLeft();
        left += Math.round((item.getVisibleWidth() - (this.getPickerIconWidth() /2)) -
                (chooserWidth/2));
        top += Math.round((this.getPickerIconHeight() / 2) - (chooserHeight/2));

        // NOTE: don't return chooserWidth/Height as part of the rect, which would cause the
        // picker to actually be resized to those dimensions, and they may match the natural
        // size at which the chooser draws given skinning properties.
        return [left, top];
    },
    

    //> @method relativeDateItem.pickerDataChanged()
    //      Store the date passed in, and fire the change handler for this item.
    //      Called when the user selects a date from the date-chooser window.  
    //  @visibility internal
    //<
    pickerDataChanged : function (picker) {

        var date = picker.getData();
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();

        // avoid firing 'updateValue' while setting the values of sub items
        this._suppressUpdates = true;

        this.valueField.setValue(this.formatDate(date));

        this._suppressUpdates = false;

        // Explicitly call 'updateValue' to save the new date (handles firing change
        // handlers, etc. too)
        this.updateValue();
        
        this.fieldChanged();

        // Ensure we have focus
        
        if (!this.hasFocus) this.focusInItem();
    },
    
    //> @method relativeDateItem.getStartDate() (A)
    //    use this method, rather than referring to this.startDate, to guarantee that it
    //    returns a date
    //      Note - Does not update this.startDate - should it?
    //<
    getStartDate : function () {
        var startDate = this.parseDate(this.startDate);
        if(!isc.isA.Date(startDate)) {
            //>DEBUG
            this.logWarn("startDate was not in valid date format - using default start date");
            //<DEBUG
            startDate = isc.DateItem.DEFAULT_START_DATE;
        }
        return startDate;
    },
    
    //> @method relativeDateItem.getEndDate() (A)
    //    use this method, rather than referring to this.endDate, to guarantee that it
    //      returns a date
    //<
    getEndDate : function () {
        var endDate = this.parseDate(this.endDate);
        if(!isc.isA.Date(endDate)) {
            //>DEBUG
            this.logWarn("endDate was not in valid date format - using default end date");
            //<DEBUG
            endDate = isc.DateItem.DEFAULT_END_DATE;
        }
        return endDate;
    },

    //> @method relativeDateItem.parseDate()
    // Parse a date passed in as a string.
    //    @group elements
    //
    //    @param dateString (string) date value as a string
    //    @param inputFormat (DateInputFormat) format for date strings to be parsed
    //
    //    @return (date) date value
    //<
    parseDate : function (dateString, inputFormat) {
        if (inputFormat == null) inputFormat = this.getInputFormat();
        return Date.parseInput(dateString, inputFormat, 
                                this.centuryThreshold, true, this.useCustomTimezone);
    },

    // formatDate() - given a live date object, returns the formatted date string to display
    // Only applies if useTextField is true.
    formatDate : function (date) {
        return isc.isA.Date(date) ? 
                    date.toShortDate(this.displayFormat, this.useCustomTimezone) : date;
    },

    //> @method relativeDateItem.getInputFormat() (A)
    // @include dateItem.getInputFormat
    // @visibility external
    //<
    getInputFormat : function () {
        // developer may explicitly specify an inputFormat (this used to be the only way to change
        // input/display format for text-based date items)
        if (this.inputFormat) return this.inputFormat;
        // If a display format, but no inputFormat is specified attempt to derive the inputFormat
        // from the displayFormat. This works for the standard shortDate display formatters but
        // you'll still need to specify an explicit input format for anything more exotic
        if (this.displayFormat) { 
            return Date.mapDisplayFormatToInputFormat(this.displayFormat);
        }
        // couldn't get an input format - rely on the standard global Date inputFormat
        return null;
    }

});

}
