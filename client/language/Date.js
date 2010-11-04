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

 






//>	@class Date
//
//	Extensions to the Date class, including added static methods on the Date object, and 
//  additional instance methods available on all date instances.
//
//  @treeLocation Client Reference/System
//  @visibility external
//<

//>	@classMethod    isc.timeStamp()
//  Shorthand for <code>new Date().getTime();</code>, this returns a timeStamp - a large number
//  which is incremented by 1 every millisecond.  Can be used to generate unique identifiers,
//  or perform timing tasks.
//
//  @visibility external
//	@return	(number)	a large integer (actually the number of milliseconds since 1/1/1970)
//<

isc.addGlobal("timeStamp", function () {
    
    return new Date().getTime()
});


// synonym
isc.addGlobal("timestamp", isc.timeStamp);


  //>DEBUG
// This lets us label methods with a name within addMethods
Date.prototype.Class = "Date";
Date.Class = "Date";
  //<DEBUG 


isc.Date = Date;


isc.addProperties(Date, {
    // add a constant for an error message when attempting to convert an invalid string to a 
    // date
    INVALID_DATE_STRING:"Invalid date format"
});  
  

//
// add methods to the Date object itself for parsing additional formats
//
isc.addMethods(Date, {

//>	@classMethod	Date.newInstance()
//			Cover function for creating a date in the 'Isomorphic-style', 
//				eg:   Date.newInstance(args)
//			rather than new Date(args)
//		@return				(Date)		Date object
//      @deprecated As of SmartClient 5.5, use +link{Date.create}.
//<
newInstance : function (arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
	return new Date(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
},


//>	@classMethod	Date.create()
//  Create a new <code>Date</code> object - synonym for <code>new Date(arguments)</code>
//	@return (Date) Date object
//  @visibility external
//<
create : function (arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
	return new Date(arg1, arg2, arg3, arg4, arg5, arg6, arg7);
},

//>	@classMethod	Date.compareDates()
// Compare two dates; returns 0 if equal, -1 if the first date is greater (later), or 1 if
// the second date is greater.
//  @param  date1   (date)  first date to compare
//  @param  date2   (date)  second date to compare
//  @return (number)    0 if equal, -1 if first date &gt; second date, 1 if second date &gt; first date
// @visibility external
//<
compareDates : function (a, b) {
	var aval = (a != null ? a.getTime() : 0),
        bval = (b != null ? b.getTime() : 0);
	return aval > bval ? -1 : (bval > aval ? 1 : 0); 
},

//>	@classMethod	Date.compareLogicalDates()
// Compare two dates, normalizing out the time elements so that only the date elements are 
// considered; returns 0 if equal, -1 if the first date is greater (later), or 1 if
// the second date is greater.
//  @param  date1   (date)  first date to compare
//  @param  date2   (date)  second date to compare
//  @return (number)    0 if equal, -1 if first date &gt; second date, 1 if second date &gt;
//                      first date.  Returns false if either argument is not a date
// @visibility external
//<
compareLogicalDates : function (a, b) {
    if (a == b) return 0; // same date instance
    if (!isc.isA.Date(a) || !isc.isA.Date(b)) return false; // bad arguments, so return false
	var aYear = a.getFullYear(),
	    aMonth = a.getMonth(),
	    aDay = a.getDate(),
	    bYear = b.getFullYear(),
	    bMonth = b.getMonth(),
	    bDay = b.getDate();

    var aval = aYear * 10000 + aMonth * 100 + aDay,
        bval = bYear * 10000 + bMonth * 100 + bDay;
        
	return aval > bval ? -1 : (bval > aval ? 1 : 0); 
},

//>	@type	DateInputFormat
//  3 character string containing the <code>"M"</code>, <code>"D"</code> and <code>"Y"</code>
//  characters to indicate the format of strings being parsed into Date instances via 
//  <code>Date.parseInput()</code>.
//  <P>
//  As an example - an input format of "MDY" would parse "01/02/1999" to Jan 2nd 1999
//  <P>
//  Note: In addition to these standard formats, a custom date string parser function may be
//  passed directly to +link{Date.setInputFormat()} or passed into +link{Date.parseInput()} as 
//  the inputFormat parameter.
//  @visibility external
//<

//> @classMethod Date.setInputFormat() 
// Sets up the default format for strings being parsed into dates via <code>Date.parseInput()</code>
// @param format (DateInputFormat | function) Default format for strings to be parsed into Dates.
// If this method is passed a function, it is expected to take a single parameter 
// (the formatted date string), and return the appropriate Javascript Date object (or null if 
// appropriate).
// @see Date.parseInput()
// @example dateFormat
// @example customDateFormat
// @visibility external
//<
setInputFormat : function (format) {
    
    this._inputFormat = format; 
},

//> @classMethod Date.getInputFormat() 
// Retrieves the default format for strings being parsed into dates via 
// <code>Date.parseInput()</code>
// @see Date.setInputFormat()
// @visibility external
//<
getInputFormat : function () {
    return this._inputFormat;
},

// Given a display format return the associated input format
_inputFormatMap:{
    toUSShortDate:"MDY",
    toUSShortDateTime:"MDY",
    toEuropeanShortDate:"DMY",
    toEuropeanShortDateTime:"DMY",
    toJapanShortDate:"YMD",
    toJapanShortDateTime:"YMD"
},
mapDisplayFormatToInputFormat : function (displayFormat) {
    if (displayFormat == "toShortDate") {
        displayFormat = Date.prototype._shortFormat;
    } else if (displayFormat == "toNormalDate") {
        displayFormat = Date.prototype.formatter;   
    }
    if (isc.isA.Function(displayFormat)) {
        isc.Log.logInfo("Unable to determine input format associated with display format " +
                        "function - returning default input format", "Date");
        return this.getInputFormat();
    }
    var inputFormat = this._inputFormatMap[displayFormat];
    // Note: isA.String check is necessary - all objects have toString / toLocaleString
    // present on them and we definitely don't want to return those native object formatters
    // as what will become a dateString parsing function!
    if (inputFormat != null && isc.isA.String(inputFormat)) return inputFormat;
    
    // a couple of special cases where we actually return functions.
    if (displayFormat == "toSerializeableDate") return this.parseSchemaDate;
    
    // Otherwise you're on your own - assume you've set up input foramt, or overridden this method
    isc.Log.logInfo("Unable to determine input format associated with display format " +
                     displayFormat + " - returning default input format", "Date");

    return this.getInputFormat();
},

//>	@classMethod	Date.parseInput()
// Parse a date passed in as a string, returning the appropriate date object.
//		@group	dateFormatting
//
//		@param	dateString  (string)	date value as a string
//      @param  [format]   (DateInputFormat) Format of the date string being passed.
//                                      If not passed, the default date input format as set up
//                                      via setInputFormat() will be used.
//      @param  [centuryThreshold]  (number)    For date formats that support a 2 digit
//                                  year, if parsed year is 2 digits and less than this
//                                  number, assume year to be 20xx rather than 19xx
//      @param [suppressConversion] (boolean) 
//          If the string passed in was not a valid date, in some cases we can convert to a
//          valid date (for example incrementing the year if the month is greater than 12).
//          This optional parameter will suppress such conversions - anything that doesn't
//          parse directly to a valid date will simply return null.
//
//		@return	(Date)		date value, or null if the string could not be parsed to a valid date.
//  @visibility external
//<


parseInput : function (dateString, format, centuryThreshold, suppressConversion,
                        useCustomTimezone) 
{

    if (isc.isA.Date(dateString)) return dateString;

    if (!isc.isA.String(dateString) || isc.isAn.emptyString(dateString)) {
        return null;
    }   
    
    // Default to the standard input format
    if (format == null) format = this.getInputFormat();
    
    // If the format passed in is the name of a function on the Date class, or an
    // explicit function, assume its a parser and call it directly
    if (isc.isA.Function(Date[format])) format = Date[format];
    if (isc.isA.Function(format)) {
        return format(dateString, centuryThreshold, suppressConversion, useCustomTimezone);
    }

    // use the helper method _splitDateString() to get an array of values back
    // (representing year / month / day, etc.)
    // If null is returned, this was not a valid date - just return null.
    // Otherwise make the month zero-based, by reducing by one, and pass construct a new date
    // from the values returned.
    var array = this._splitDateString(dateString, format);
    if (array != null) {
        var year = array[0];

        if (year && year.length <= 2) {
            year = parseInt(year, 10);
            if (year < centuryThreshold) year += 2000;
            else year += 1900
            array[0] = year;
        }
        
        var hours = array[3],
            minutes = array[4],
            seconds = array[5];
        
        array[3] = hours = parseInt(hours || 0, 10);
        array[4] = minutes = parseInt(minutes || 0, 10);
        array[5] = seconds = parseInt(seconds || 0, 10);
        
        var newDate;
        if (!useCustomTimezone) {
            newDate = new Date(array[0], array[1], array[2], hours,minutes,seconds);
                       
            if (!suppressConversion) return newDate;
            
            // If the 'suppressConversion' flag was passed, we will want to return null to indicate
            // we were passed an invalid date if the values passed in had to be converted
            // (For example a month of 13 effecting the year, etc)
            var isValid = (newDate.getFullYear() == array[0] &&
                           newDate.getMonth() == array[1] &&
                           newDate.getDate() == array[2] &&
                           (array[3] == null || newDate.getHours() == array[3]) &&
                           (array[4] == null || newDate.getMinutes() == array[4]) &&
                           (array[5] == null || newDate.getSeconds() == array[5])
                           );
            return (isValid ? newDate : null);
        } else {
            
            // We need a date where the UTCTime is set such that when we apply our
            // custom timezone offset we get back the local time.
            // Do this by creating a new date with UTC time matching this custom display time
            // and then shifting that date by the inverse of our display timezone offset.
            newDate = new Date(Date.UTC(array[0], array[1], array[2],
                                          array[3], array[4], array[5]));
                                          
            // If the 'suppressConversion' flag was passed, we will want to return null to indicate
            // we were passed an invalid date if the values passed in had to be converted
            // (For example a month of 13 effecting the year, etc)
            // Easiest to check this against the date before we apply the offset to correct for
            // our timezone           
            if (suppressConversion) {
                var isValid = (newDate.getUTCFullYear() == array[0] &&
                               newDate.getUTCMonth() == array[1] &&
                               newDate.getUTCDate() == array[2] &&
                               (array[3] == null || newDate.getUTCHours() == array[3]) &&
                               (array[4] == null || newDate.getUTCMinutes() == array[4]) &&
                               (array[5] == null || newDate.getUTCSeconds() == array[5])
                               );
                if (!isValid) newDate = null;
            }
            if (newDate != null) {
                newDate._applyTimezoneOffset(
                    -isc.Time.getUTCHoursDisplayOffset(newDate), 
                    -isc.Time.getUTCMinutesDisplayOffset(newDate)
                );
            }
            return newDate;
        }
        
    } else {
        return null;
    }
},


parseDateTime : function (dateString, format, centuryThreshold, suppressConversion) {
    return this.parseInput(dateString,format,centuryThreshold,suppressConversion,true);
},

// Parse a date or datetime value from a dataset or specified in code.
// NB: unlike parseInput, this method should not change behavior in different locales, or dates
// coming over the wire or specified in code will suddenly break!
//
// For DateTime, XML Schema uses "2005-08-01T21:35:48.350Z", see 
//    http://www.w3.org/TR/xmlschema-2/#dateTime
// SmartClient Server parses "yyyy-mm-dd" format
parseSchemaDate : function (value) {
    if (isc.isA.Date(value)) return value;

    if (!isc.isA.String(value)) value = (value.toString ? value.toString() : value + "");

    // Notes on regex:
    // - result[4] is the optional timestamp including the T and colon separators
    // - result[8] would be the optional milliseconds including the ".", whereas
    //   result[9] is just the numeric part
    //   results[10] is the timezone - either "Z" (zulu time or GMT) or +/- HH:MM
    var result = value.match(/(\d{4})[\/-](\d{2})[\/-](\d{2})([T ](\d{2}):(\d{2}):(\d{2}))?(\.(\d+))?([+-]\d{2}:\d{2}|Z)?/);
           
    //isc.Log.logWarn("isDate: '" + value + "', regex match: " + result);

    if (result == null) return null;
            
    
    var dateValue;
    // NOTE: pass only the relevant arguments as Moz does not like being passed nulls
    
    if (!result[4]) { // no time
        dateValue = new Date(result[1], result[2] - 1, result[3]);
    } else if (!result[9]) { // no ms
        dateValue = new Date(Date.UTC(result[1], result[2] - 1, result[3],
                                      result[5], result[6], result[7]));
    } else {
        var ms = result[9];
        
        // XML Schema says any number of fractional digits can be specified.  new Date() is
        // expecting a whole number of milliseconds (and further precision would be ignored).
        // Multiply by a power of ten based on the number of digits provided, such that ".9"
        // becomes 900 and ".98367" becomes 984.
        if (ms.length != 3) {
            var multiplier = Math.pow(10,3-ms.length);
            ms = Math.round(parseInt(ms,10) * multiplier);
        }
        //isc.Log.logWarn("ms is: " + ms);
        
        dateValue = new Date(Date.UTC(result[1], result[2] - 1, result[3],
                                      result[5], result[6], result[7], ms));
    }
    // Handle timezone offset from GMT
    if (result[10] && result[10].toLowerCase() != "z") {
        var HM = result[10].split(":"),
            H = HM[0],
            negative = H && H.startsWith("-"),
            M = HM[1];
        H = parseInt(H, 10);
        M = parseInt(M, 10);
        var dateTime = dateValue.getTime();

        
        // Note no need to account for negative on hours since the "+" or "-" prefix was picked up
        // in parseInt
        if (isc.isA.Number(H)) dateTime -= (3600000 * H);
        if (isc.isA.Number(M)) dateTime -= (60000 * M * (negative ? -1 : 1));
        dateValue.setTime(dateTime);
    }
     
    return dateValue
},

//>!BackCompat 2005.11.3
// parseDate() was old name for parseInput
parseDate : function (dateString, format, centuryThreshold, suppressConversion) {
    return this.parseInput(dateString, format, centuryThreshold, suppressConversion);
},

// For completeness also support parseDateTime()
parseDateTime : function (dateString, format, centuryThreshold, suppressConversion) {
    return this.parseInput(dateString, format, centuryThreshold, suppressConversion);
},
//<!BackCompat

// ISC DSResponses that use our SQLTransform logic (basically our backend DB implementation)
// will call this method by default - giving the user an opportunity to override.  This can be
// disabled by setting jsTranslater.writeNativeDate: true in server.properties.
//
// Note: month is zero-based, just like the native Date constructor.
parseServerDate : function (year, month, day) {
    return new Date(year, month, day);
},


_splitDateString : function (string, format) {

    var month, day, year, hour, minute, second;
    
    var monthIndex = format ? format.indexOf("M") : 0,
        dayIndex = format ? format.indexOf("D") : 1,
        yearIndex = format ? format.indexOf("Y") : 2; 
    // shortDate implies it's of the format MM/DD/YYYY
    
    //>Safari12
    if (isc.Browser.isSafari && isc.Browser.safariVersion <= 312) {
        var splitDate = this._splitDateViaSubstring(string, monthIndex, dayIndex, yearIndex);
        year = splitDate[0];
        month = splitDate[1];
        day = splitDate[2];
        hour = splitDate[3];
        minute = splitDate[4];
        second = splitDate[5];
        
    // For browsers that support RegExp properly, use regexp pattern matching to get the result
    // (This has the advantage that we can deal with dates of the form 1/1/1999, and attempt to 
    //  convert MM/YY/DD -- though we're relying on the native browser handling for the 
    //  Date constructor being passed a 2 digit year)            
    } else {
    //<Safari12
    
        // Each of the first three slots is either YYYY / YY or MM / M (or DD/D) (depends on the
        // format passed in)
        // Note: We don't support years greater than 9999. Attempting to set a year greater than 
        // 9999 on a JS date causes a native browser crash on IE6
        var regex =
        //          YYYY || YY/[M]M  /  YYYY || YY/[M]M  /  YYYY || YY/[M]M [(space) [H]H  :    MM    [:     SS]]  
        new RegExp(/^\s*(\d{4}|\d{1,2})[^\d](\d{4}|\d{1,2})[^\d](\d{4}|\d{1,2})([^\d](\d{1,2})[^\d](\d\d)[^\d]?(\d\d)?)?\s*$/),
            results = string.match(regex);
            
        if (results == null) return null;
        // Notes - we need to match the order of day / month / year to the format passed in
        // Also - the month value in the string is 1-based rather than zero based
                
        // Note: this was parseInt(results[index]) -1, but both IE and Mozilla will do the 
        // wrong thing here - if the substring was "09", the parseInt would return 0 rather 
        // than 9.
        // In any case, the parseInt is rendered unnecessary by the 'isA.Number' check below.
        month = results[monthIndex +1] -1;
        day = results[dayIndex+1];
        year = results[yearIndex +1];

        // Note - results[4] is the whole time string (if present)
        // Zero out any time fields that are not present - this may happen if 
        // - time has invalid format (could check by examining results[4] too)
        // - time not included in dateString (could check by examining results[4] too)
        // - time has no seconds (legal - just zero out the seconds)
        hour = results[5] || 0;
        minute = results[6] || 0;
        second = results[7] || 0;
    //>Safari12
    }
    //<Safari12
    // If they all are numbers, this was a valid date string
    // NOTE: If year - month - day gives a number then they 
    // are all numbers, or strings that implicitly convert to numbers.
    // We could also use this syntax:
    // if(parseInt(year) == year && parseInt(month) == month ...)
    // but this is slower in both Moz and IE
    if (isc.isA.Number(year - month - day - hour - minute - second))
        return ([year,month,day,hour,minute,second]);        
    else return null
},  
    
//>	@type	DateDisplayFormat
// Valid display formats for dates.  These strings are the names of formatters which can be 
// passed to <code>Date.setNormalDisplayFormat()</code> or <code>Date.setShortDisplayFormat()</code>
// and will be subsequently used as default long or short formatters for date objects by
// SmartClient components.<br>
// Default set of valid display formats is as follows:<br><br>
//
// @value toString   
// Default native browser 'toString()' implementation. May vary by browser.<br>
// <i>Example</i>: <code>Fri Nov 04 2005 11:03:00 GMT-0800 (Pacific Standard Time)</code>
// @value toLocaleString
// Default native browser 'toLocaleString()' implementation. May vary by browser.
// <i>Example</i>: <code>Friday, November 04, 2005 11:03:00 AM</code>
// @value toUSShortDate Short date in format MM/DD/YYYY.<br>
// <i>Example</i>: <code>11/4/2005</code>
// @value toUSShortDateTime Short date with time in format MM/DD/YYYY HH:MM<br>
// <i>Example</i>: <code>11/4/2005 11:03</code>
// @value toEuropeanShortDate Short date in format DD/MM/YYYY.<br>
// <i>Example</i>: <code>4/11/2005</code>
// @value toEuropeanShortDateTime Short date with time in format DD/MM/YYYY HH:MM<br>
// <i>Example</i>: <code>4/11/2005 11:03</code>
// @value toJapanShortDate Short date in format YYYY/MM/DD.<br>
// <i>Example</i>: <code>2005/11/4</code>
// @value toJapanShortDateTime Short date with time in format YYYY/MM/DD HH:MM<br>
// <i>Example</i>: <code>2005/11/4 11:03</code>
// @value toSerializeableDate Date in the format YYYY-MM-DD HH:MM:SS<br>
// <i>Example</i>: <code>2005-11-04 11:09:15</code>
// @value toDateStamp   Date in the format &lt;YYYYMMDD&gt;T&lt;HHMMSS&gt;Z
// <i>Example</i>: <code>20051104T111001Z</code>
// <br>
// <br>
// Note: In addition to these standard formats, custom formatting can be set by passing
// a function directly to +link{Date.setNormalDisplayFormat()} et al. This 
// function will then be executed whenever the appropriate formatter method is called [eg 
// +link{date.toNormalDate()}], in the scope of the date instance in question.
//
//  @visibility external
//<
    
//> @classMethod Date.setNormalDisplayFormat()
// Set the default formatter for date objects to the method name passed in.  After calling this
// method, subsequent calls to +link{Date.toNormalDate()} will return a string formatted
// according to this format specification. Note: this will be the standard long date format used 
// by SmartClient components.<br>
// The <code>format</code> parameter may be either a +link{DateDisplayFormat} string, or 
// a function. If passed a function, this function will be executed in the scope of the Date
// and should return the formatted string.<br>
// Initial default normalDisplayFormat is <code>"toLocaleString"</code>
// @group	dateFormatting
// @param	format	(DateDisplayFormat | function)	new formatter
//      @visibility external
//<
setNormalDisplayFormat : function (format) {
    // if a valid formatter was passed in, set our .formatter property
	if (isc.isA.Function(Date.prototype[format]) || isc.isA.Function(format)) {
	    Date.prototype.formatter = format;
    }
},

//>	@classMethod	Date.setShortDisplayFormat()
// Set the default short format for dates. After calling this method, subsequent calls to 
// +link{Date.toShortDate()} will return a string formatted according to this format 
// specification. Note that this will be the standard short date format used by
// SmartClient components.
// <P>
// The <code>format</code> parameter may be either a +link{DateDisplayFormat} string, or 
// a function. If passed a function, this function will be executed in the scope of the Date
// and should return the formatted string.
// <P>
// Initial default shortDateFormat is <code>"toUSShortDate"</code>.
//
// @group	dateFormatting
// @param	format	(DateDisplayFormat | function)	new formatter
// @example dateFormat
// @example customDateFormat
// @visibility external
//<
setShortDisplayFormat : function (format) {
    if (isc.isA.Function(Date.prototype[format]) || isc.isA.Function(format)) {    
        Date.prototype._shortFormat = format;
    }
},

//>	@classMethod Date.setDefaultDateSeparator
// Sets a new default separator that will be used when formatting dates. By default, this
// is a forward slash character: "/"
// @group   dateFormatting
// @param separator (string) separator to use in dates 
// @visibility external
//<
setDefaultDateSeparator : function (separator) {
    Date.prototype._shortDateTemplate = [,,,,separator,,,,,separator,,,,null];
    Date.prototype._separator = separator;
},

//>	@classMethod Date.getDefaultDateSeparator
// gets the default date separator string
// @group   dateFormatting
// @return(string) the default date separator 
// @visibility external
//<
getDefaultDateSeparator : function (separator) {
    if (Date.prototype._separator) return Date.prototype._separator;
    else return "/";    
},

//> @classMethod Date.setShortDatetimeDisplayFormat()
//  Set the default short format for datetime values. After calling this method, subsequent calls to 
// +link{Date.toShortDateTime()} will return a string formatted according to this format 
// specification. Note that this will be the standard datetime format used by
// SmartClient components.
// <P>
// The <code>format</code> parameter may be either a +link{DateDisplayFormat} string, or 
// a function. If passed a function, this function will be executed in the scope of the Date
// and should return the formatted string.
// <P>
// Initial default format is <code>"toUSShortDateTime"</code>.
//
// @group	dateFormatting
// @param	format	(DateDisplayFormat | function)	new formatter
// @example dateFormat
// @example customDateFormat
// @visibility external
//<
setShortDatetimeDisplayFormat : function (format) {
    if (isc.isA.Function(Date.prototype[format]) || isc.isA.Function(format)) {    
        Date.prototype._shortDatetimeFormat = format;
    }
},

//>!BackCompat 2005.11.3
// -- Older depracated synonym of setNormalDisplayFormat  
//>	@classMethod		Date.setFormatter()
//  Set the formatter for all date objects to the method name passed in.  After this call
//  all <code>theDate.toNormalDate()</code> calls will fall through to this formatter function to 
//  return the date as a string.
//		@group	dateFormatting
//		@param	functionName	(string)	name of a date formatter method on this Date 
//      @visibility internal
//<

setFormatter : function (formatter) {
    Date.setNormalDisplayFormat(formatter);
},
//<!BackCompat

//>	@classMethod Date.setLocaleStringFormatter() (A)
// Set default the +link{Date.iscToLocaleString()} formatter for all date instances.
//
//		@param	format (DateDisplayFormat | function) new formatter for iscToLocaleString()
//		@group	dateFormatting
//      @visibility internal
//<

setLocaleStringFormatter : function (functionName) {
	if (isc.isA.Function(Date.prototype[functionName]) || isc.isA.Function(functionName)) 
        Date.prototype.localeStringFormatter = functionName;
},

// Localizing dayName / monthNames
//> @classAttr  Date.shortDayNames  (Array : null : IRWA)
// This property may be set to an array of names of days of the week. <br>
// For example:
// <pre>
// ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
// </pre>
// The appropriate day name will then be returned from +link{date.getShortDayName()}, and may 
// be used whenever SmartClient components display day-names (for example in the 
// +link{class:DateItem, DateItem class}).<br>
// Note: For US based applications the first item in the array should be the name for Sunday, 
// then Monday, Tuesday, etc. For browsers with different locales this may vary. 
// To determine the first day for some locale, you can run the following code:
// <pre>
//    alert(new Date(2000, 0, 2).getDay());
// </pre>
// You should see an alert with a number between zero and 6. This represents the numerical
// 'day' value for Sunday for your browser's locale, since Jan 2nd 2000 was a Sunday. 
// Therefore if this code alerted the number 6, Sunday should appear last in your list 
// of day-names, and Monday first.
// @group i18nMessages
// @visibility external
//<

//> @classAttr  Date.shortMonthNames  (Array : null : IRWA)
// This property may be set to an array of names of months.<br>
// For example:
// <pre>
// ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
// </pre>
// The appropriate month name will then be returned from +link{date.getShortMonthName()}, 
// and may be used whenever  SmartClient components display month-names (for example in the 
// +link{class:DateItem, DateItem class}).
// @group i18nMessages
// @visibility external
//<

//>	@method		date.getShortMonthNames()	(A)
// Return an array of the short names of each month, suitable for us in a selection list, etc.
// If +link{Date.shortMonthNames} is specified, this list will be used. Otherwise the value
// will be derived from the native browser date formatters.
//		@group	dateFormatting
//
//      @param  length  (number)    Number of characters for each day (Defaults to 3, can't be 
//                                  longer than 3)
//		@return		(string[])	array of short month names
//<
getShortMonthNames : function (length) {
    length = length || 3;
    var rawNames = Date.shortMonthNames;
    if (rawNames == null) rawNames = Date._derivedShortMonthNames;
    if (rawNames == null) {
        var list = Date._derivedShortMonthNames = [];
        for (var i = 0; i < 12; i++) {
            // Changed the day in this synthetic date to 2 in order to derive the 
            // correct month in timezones that are ahead of GMT (if you convert 
            // midnight on the first of a month to UTC in such timezones, you
            // get the previous month...)
            var date = new Date(2000,i,2);
            list[i] = date.deriveShortMonthName();
        }
        rawNames = Date._derivedShortMonthNames;
    }
    var names = [];
    for (var i =0; i< 12; i++) {
        names[i] = rawNames[i].substring(0,length);
    }
    return names;
},

//>	@method		date.getShortDayNames()	(A)
// Return an array of the short names of each day, suitable for us in a selection list, etc.
// Day names will be picked up from +link{Date.shortDayNames} if specified - otherwise derived
// from the native browser date string.
//		@group	dateFormatting
//
//      @param  length  (number)    Number of characters for each day (Defaults to 3, can't be 
//                                  longer than 3)
//		@return		(string[])	array of short day names
//<
getShortDayNames : function (length) {
    length = length || 3;
        var rawNames = Date.shortDayNames;
    if (rawNames == null) rawNames = Date._derivedShortDayNames;
    if (rawNames == null) {
        Date._derivedShortDayNames = [];
        var dateObj = new Date();
        dateObj.setDate(1);
        if (dateObj.getDay() > 0) dateObj.setDate(dateObj.getDate() + (7-dateObj.getDay()));
        var startDate = dateObj.getDate();
        for (var i = 0; i < 7; i++) {
            dateObj.setDate(startDate + i);
            Date._derivedShortDayNames[i] = dateObj.deriveShortDayName();
        }
        rawNames = Date._derivedShortDayNames;
    }
    var names = [];
    for (var i = 0; i < 7; i++) {
        names[i] = rawNames[i].substring(0,length);
    }
    return names;
},

//> @classAttr Date.weekendDays (Array of int : [0, 6] : IR)
// Days that are considered "weekend" days.   Values should be the integers returned by the
// JavaScript built-in Date.getDay(), eg, 0 is Sunday and 6 is Saturday.  Override to
// accommodate different workweeks such as Saudi Arabia (Saturday -> Wednesday) or Israel 
// (Sunday -> Thursday).
//
// @visibility external
//<

//>	@classMethod		Date.getWeekendDays()	
// Return an array of days that are considered "weekend" days. Values will be the integers 
// returned by the JavaScript built-in Date.getDay(), eg, 0 is Sunday and 6 is Saturday. 
// Override +link{date.weekendDays} to accommodate different workweeks such as Saudi Arabia 
// (Saturday -> Wednesday) or  Israel (Sunday -> Thursday).
//		@group	dateFormatting 
//                                  
//		@return		(int[])	array of weekend days
//<
getWeekendDays : function () {
    var daysArr = Date.weekendDays;
    if (daysArr == null) daysArr = Date._derivedWeekendDays;
    if (daysArr == null) {
        daysArr = Date._derivedWeekendDays = [0, 6];    
    }
    return daysArr;
},

getFormattedDateRangeString : function (fromDate, toDate) {
    var fromMonth = fromDate ? fromDate.getMonth() : null,
        fromMonthName = fromDate ? fromDate.getShortMonthName() : null,
        fromYear = fromDate ? fromDate.getFullYear() : null,
        fromDay = fromDate ? fromDate.getDate() : null,
        toMonth = toDate ? toDate.getMonth() : null,
        toMonthName = toDate ? toDate.getShortMonthName() : null,
        toYear = toDate ? toDate.getFullYear() : null,
        toDay = toDate ? toDate.getDate() : null,
        result = ""
    ;

    if (fromDate && toDate) {
        if (fromYear == toYear) {
            // dates are in the same year - check the months 
            if (fromMonth == toMonth) {
                // dates are in the same month - check the day-numbers
                if (fromDay == toDay) {
                    // dates are the same - use just the one date
                    result = fromMonthName + " " + fromDate.getDate() + ", " + fromYear;
                } else {
                    // day-numbers are different, use "month start - end, year"
                    result = fromMonthName + " " + fromDate.getDate() + " - " +
                        toDate.getDate() + ", " + fromYear;
                }
            } else {
                // dates are in different months, use "month start - month end, year"
                result = fromMonthName + " " + fromDate.getDate() + " - " +
                    toMonthName + " " + toDate.getDate() + ", " + fromYear;
            }
        } else {
            // different years - use "month start year - month end year"
                result = fromMonthName + " " + fromDate.getDate() + ", " + fromYear + " - " +
                    toMonthName + " " + toDate.getDate() + ", " + toYear;
        }
    } else if (fromDate) {
        // only a fromDate provided use "month start - end, year"
        result = fromMonthName + " " + fromDate.getDate() + ", " + fromYear;
    } else if (toDate) {
        // only a toDate provided use "month start - end, year"
        result = toMonthName + " " + toDate.getDate() + ", " + toYear;
    }

    return result;
}

});

//
//	add methods to the Date.prototype for additional formatting options
//
isc.addMethods(Date.prototype, {

//>	@method		date.duplicate()	(A)
//      Copy the value of this date into a new Date() object for independent manipulation
//  @visibility external
//<
duplicate : function () {
    var newDate = new Date();
    newDate.setTime(this.getTime());
	newDate.logicalDate = this.logicalDate;
    newDate.logicalTime = this.logicalTime;
    return newDate;
},

//>	@method		date.clearTimeFields()	(A)
//			Zero-out the time fields for a date.
//		@group	dateFormatting
//<
clearTimeFields : function () {
	this.setHours(0);
	this.setMinutes(0);
	this.setSeconds(0);
	this.setMilliseconds(0);
	return this;
},




// Determine the day name from this.toString()
deriveShortDayName : function (length) {
	var string = this.toString();
    if (length == null || length <=0 || length > 3) length = 3;
	return string.substring(0,length);
},

//>	@method		date.getShortDayName()	
// Return the abbreviated (up to 3 chars) day of week name for this date (Mon, Tue, etc).
// To modify the value returned by this method, set +link{Date.shortDayNames}
//
//		@group	dateFormatting
//      @param  length  (number)    Number of characters to return (Defaults to 3, can't be 
//                                  longer than 3)
//		@return		(string)	Abbreviated day name
//      @visibility external
//<
getShortDayName : function () {
    return Date.getShortDayNames()[this.getDay()];
},

// deriveShortMonthNames() - figure out the names of months from the native browser
// date formatting methods.
deriveShortMonthName : function (length) {
    // Use this.toUTCString - to work around Opera's different toString format
	var string = this.toUTCString();
	var start = 8;  // The correct start point if we have a 2-digit day portion in the date
    if (length == null || length < 0 || length > 3) length = 3;
    if (string.substring(6, 7) == ' ') {  // we have a single-digit day number - only IE
                                          // does this, the others put a leading 0 in
        start = 7;
    }
	return string.substring(start, (start+length));
},


//>	@method		date.getShortMonthName()	
// Return the abbreviated (up to 3 chars) name of the month for this date (Jan, Feb, etc)
// To modify the value returned by this method, set +link{Date.shortMonthNames}
//		@group	dateFormatting
//      @param  length  (number)    Number of characters to return (Defaults to 3, can't be
//                                  longer than 3)
//		@return		(string)	Abbreviated month name (3 character string)
//  @visibility external
//<
getShortMonthName : function () {
    return Date.getShortMonthNames()[this.getMonth()];
},

//>	@method		date.getShortYear()	
//      Return a 2 digit year for this date.
//	@group	dateFormatting
//	@return		(string)	year number, padded to 2 characters
//  @visibility external
//<
getShortYear : function () {
	var year = this.getFullYear();
	return (year % 100).stringify(2);
},

//>	@method		date.getWeek()
//      Returns an integer containing the week number
//	@group	dateFormatting
//	@return		(integer)	week number, starting with 1
//  @visibility external
//<
getWeek : function() {
	var yearstart = new Date(this.getFullYear(),0,1);
	return Math.ceil((((this - yearstart) / 86400000) + yearstart.getDay())/7);
},

//
// Date Formatters (toNormalDate(), toShortDate(), etc.)
//
// Date formatters are applied to date objects to convert them into strings for display.
// Dates are intended to be localizable.  
// For localization, a developer would typically set either the shortDateFormatter or 
// normalDateFormatter, as well as the inputDateFormat, and then call
// "toNormalDate()" / "toShortDate()" and "parseInput()" as normal.

//>	@method		date.toDateStamp()
//			Return this date in the format (UTC timezone):
//				<code><i>YYYYMMDD</i>T<i>HHMMSS</i>[Z]</code>
//		@group	dateFormatting
//		@return					(string)	formatted date string
//  @visibility external
//<
toDateStamp : function () {
	return	this.getUTCFullYear()
		  + (this.getUTCMonth()+1).stringify()
		  + this.getUTCDate().stringify()
		  + "T"
		  +	this.getUTCHours().stringify()
		  + this.getUTCMinutes().stringify()
		  + this.getUTCSeconds().stringify()
		  + "Z";
},

//>	@method date.toNormalDate()
// Returns the date as a formatted string using the format set up via the 
// <code>setNormalDisplayFormat()</code> method. Note that the default formatter for this
// method is <code>"toLocaleString"</code>.
// @group   dateFormatting
// @param format (DateDisplayFormat) Optional Format for the date returned 
// @return  (string) formatted date string
// @visibility external
//<
// This method is used by our data components such as ListGrid to display long format dates.
// @param useCustomTimezone (boolean) If true, format the date using the timezone
//  setDefaultDisplayTimezone() rather than the native browser locale. Not supported for
//  all formatters.
toNormalDate : function (formatter, useCustomTimezone) {
    
    
    if (!formatter) formatter = this.formatter;    
    // fire the formatter in the scope of this date, so date is available as 'this'

    if (isc.isA.Function(formatter)) {
        return formatter.apply(this, [useCustomTimezone])
    } else if (this[formatter]) {
        return this[formatter](useCustomTimezone);
    }
},

//>	@method date.toShortDate()
// Returns the date as a formatted string using the format set up via the 
// <code>setShortDisplayFormat()</code> method.
// @group   dateFormatting
// @param format (DateDisplayFormat) Optional Format for the date returned 
// @param useCustomTimezone (boolean) If true, format the date using the timezone set via
//  Time.setDefaultDisplayTimezone() rather than the native browser locale.
// @return  (string) formatted date string
// @visibility external
//<
toShortDate : function (formatter, useCustomTimezone) {
    if (!formatter) formatter = this._shortFormat;
    if (isc.isA.Function(formatter)) return formatter.apply(this, [useCustomTimezone]);
    else if (isc.isA.Function(this[formatter])) return this[formatter](useCustomTimezone);
    
    isc.logWarn("Date.toShortDate() specified formatter not understood:" + formatter);
    return this.toUSShortDate();
                
},


//>	@method date.toShortDateTime()
// Returns the datetime as a formatted string using the format set up via the 
// <code>setShortDatetimeDisplayFormat()</code> method.
// @group   dateFormatting
// @param format (DateDisplayFormat) Optional Format for the date returned 
// @param useCustomTimezone (boolean) If true, format the date using the timezone
//  Time.setDefaultDisplayTimezone() rather than the native browser locale. This is the
//  default behavior within SmartClient components for datetime fields.
// @return  (string) formatted date string
// @visibility external
//<

toShortDateTime : function (formatter, useCustomTimezone) {
    if (!formatter) formatter = this._shortDatetimeFormat;
    return this.toShortDate(formatter, useCustomTimezone);
},


//>	@method date.setDefaultDateSeparator
// Sets a new default separator that will be used when formatting dates. By default, this
// is a forward slash character: "/"
// @group   dateFormatting
// @param separator (string) separator to use in dates 
// @visibility external
//<
setDefaultDateSeparator : function (separator) {
    this._shortDateTemplate = [,,,,separator,,,,,separator,,,,null];
    this._separator = separator;
},

//>	@method date.getDefaultDateSeparator
// gets the default date separator string
// @group   dateFormatting
// @return(string) the default date separator 
// @visibility external
//<
getDefaultDateSeperator : function (separator) {
    if (this._separator) return this._separator;
    else return "/";    
},


_shortDateTemplate:[,,,,"/",,,,,"/",,,,null],
_$MDY:"MDY",
_$DMY:"DMY",
_$YMD:"YMD",
_$MDY:"MDY",

// _applyTimezoneOffset()
// shift a date by some arbitrary number of hours/minutes
// third parameter allows you to specify the starting date time [result of date.getTime()] 
// to offset from
_applyTimezoneOffset : function (hourOffset, minuteOffset, dateTime) {
    if (dateTime == null) dateTime = this.getTime();
    if (isc.isA.Number(hourOffset)) dateTime += (3600000 * hourOffset);
    if (isc.isA.Number(minuteOffset)) dateTime += (60000 * minuteOffset);
    this.setTime(dateTime);
},

// _getTimezoneOffsetDate()
// This is a helper method - given a date with a certain UTC time, apply an explicit timezone
// offset to return a date where the UTC time is offset by the specified hours/minutes.
// We'll use this when formatting dates for display in arbitrary local times [so we can't just
// use the native browser local timezone methods like getHours()]

_getTimezoneOffsetDate : function (hourOffset, minuteOffset) {
    var offsetDate = Date._timezoneOffsetDate;
    if (offsetDate == null) offsetDate = Date._timezoneOffsetDate = new Date();
    
    offsetDate._applyTimezoneOffset(hourOffset, minuteOffset, this.getTime());
    return offsetDate;
    
},
               
                
// _toShortDate()
// Internal method to give us a shortDate - either DD/MM/YYYY, MM/DD/YYYY or YYYY/MM/DD.
// this will be passed "MDY" / "DYM" / etc. as a format parameter.
// useCustomTimezone parameter: use the hour and minute offset specified by
// Time.setDefaultDisplayTimezone() rather than the native browser local timezone
_$zero:"0",
_toShortDate : function (format, useCustomTimezone) {
    
    var template = this._shortDateTemplate,
        month,day,year;
    
    if (!useCustomTimezone) {
        month = this.getMonth()+1;
        day = this.getDate();
        year = this.getFullYear();
    } else {
        var offsetDate = this._getTimezoneOffsetDate(
                            isc.Time.getUTCHoursDisplayOffset(this), 
                            isc.Time.getUTCMinutesDisplayOffset(this)
                         );

        month = offsetDate.getUTCMonth() + 1;
        day = offsetDate.getUTCDate();
        year = offsetDate.getUTCFullYear();
    }
    
    var monthIndex, dayIndex, yearIndex;
        
    if (format == this._$MDY) {
        monthIndex = 0;
        dayIndex = 5;
        yearIndex = 10;
    } else if (format == this._$DMY) {
        dayIndex = 0;
        monthIndex = 5;
        yearIndex = 10;
    } else if (format == this._$YMD) {
        yearIndex = 0;
        monthIndex = 5;
        dayIndex = 10    
    // Unlikely - don't bother avoiding string alloc's for every one of these options
    } else {
        dayIndex = format.indexOf("D")*5;
        yearIndex = format.indexOf("Y")*5;
        monthIndex = format.indexOf("M")*5;
    }
        
    // Note: each number has 4 slots so it can accommodate a full year
    // For month/day - if we need a leading zero, fill the first slot with it
    // Use fillNumber to fill 3 slots even though we have a max of 2 digits to ensure
    // the last slot gets cleared out if it was populated by a year already.
    template[dayIndex] = day < 10 ? this._$zero : null
    isc._fillNumber(template, day, dayIndex+1, 3);
        
    template[monthIndex] = month < 10 ? this._$zero : null
    isc._fillNumber(template, month, monthIndex+1, 3);
            
    isc._fillNumber(template, this.getFullYear(), yearIndex, 4);
    return template.join(isc.emptyString);
},

//>	@method		date.toUSShortDate()
//			Return this date in the format: <code>MM/DD/YYYY</code>
//		@group	dateFormatting
//		@return					(string)	formatted date string
//  @visibility external
//<
toUSShortDate : function (useCustomTimezone) {
    return this._toShortDate(this._$MDY, useCustomTimezone);
},

// _toShortTime - returns the time portion of the date in HH:MM

_timeTemplate:[null,null],
_toShortTime : function (useCustomTimezone) {
    if (!useCustomTimezone) {
        var timeTemplate = this._timeTemplate;
        timeTemplate[0] = this.getHours().stringify();
        timeTemplate[1] = this.getMinutes().stringify();
        return timeTemplate.join(":");
    } else {
        // allow the Time class to apply the default display timezone offset
        
        return isc.Time.toShortTime(this, "toShortPadded24HourTime");
    }
},

//>	@method		date.toUSShortDateTime()
//  Return this date in the format: <code>MM/DD/YYYY HH:MM</code>
//   
//		@group	dateFormatting
//		@return					(string)	formatted date string
//  @visibility external
//<
toUSShortDateTime : function (useCustomTimezone) {
    return this.toUSShortDate(useCustomTimezone) + " " + this._toShortTime(useCustomTimezone);
},


//>	@method		date.toEuropeanShortDate()
//			Return this date in the format: <code>DD/MM/YYYY</code>
//		@group	dateFormatting
//		@return					(string)	formatted date string
//      @visibility external
//<
toEuropeanShortDate : function (useCustomTimezone) {
    return this._toShortDate(this._$DMY, useCustomTimezone);
},

//>	@method		date.toEuropeanShortDateTime()
// Return this date in the format: <code>DD/MM/YYYY HH:MM</code>.
//		@group	dateFormatting
//		@return					(string)	formatted date string
//      @visibility external
//<
toEuropeanShortDateTime : function (useCustomTimezone) {
    return this.toEuropeanShortDate(useCustomTimezone) + " " +
            this._toShortTime(useCustomTimezone);
},

//> @method date.toJapanShortDate()
// Return the date in this format: <code>YYYY/MM/DD</code>
// @group dateFormatting
// @return (string) formatted date string
// @visibility external
//<
toJapanShortDate : function (useCustomTimezone) {
    return this._toShortDate(this._$YMD, useCustomTimezone);
},

//>	@method		date.toJapanShortDateTime()
//			Return this date in the format: <code>YYYY/MM/DD HH:MM:SS</code>
//		@group	dateFormatting
//		@return					(string)	formatted date string
//      @visibility external
//<
toJapanShortDateTime : function (useCustomTimezone) {
    return this.toJapanShortDate(useCustomTimezone) + " " + this._toShortTime(useCustomTimezone);
},

  
//>	@method		date._serialize()	(A)
//			Serialize this date to a string in a format that can be reinstantiated back into a date.
//				<code>$$DATE$$:<i>YYYY</i>-<i>MM</i>-<i>DD</i></code>
//		@group	dateFormatting
//		@return					(string)	formatted date string
//      @visibility internal
//<
_serialize : function () {
    if (isc.Comm._legacyJSMode) {
        // legacy mode: add $$DATE$$ that only our server-side JS parser understands
        return isc.SB.concat('"' + this.toDBDate(), '"');
    } else {
        // any other caller: return code that would reconstruct the same Date in a JS
        // interpreter
        
        return isc.SB.concat("new Date(", this.getTime(), ")");
    }
},


//> @groupDef dateFormatAndStorage
// The SmartClient system has the following features for handling Date and Time type values
// within DataSources and databound components.
// <P>
// DataSources and databound components may define fields of type <code>date</code>,
// <code>time</code>, or <code>datetime</code>.
// <P>
// Fields of type +link{type:FieldType,date} are considered to be logical Dates. System wide
// formatting for dates may be controlled via the +link{Date.setNormalDisplayFormat()} and
// +link{Date.setShortDisplayFormat()} methods.  Components also support applying custom display
// formats for specific date fields, typically achieved via the <code>dateFormatter</code> or
// <code>field.displayFormat</code> attributes.
// <P>
// On the client date type fields are stored as JavaScript Date objects. When formatted for display
// to the user, they are typically displayed without any time information.
// <P>
// When communicating with a non SmartClient server via an "xml" DataSource, date field
// values in requests will be serialized out as logical date information only (omitting time)
// in the standard truncated
// <a target=_blank href="http://www.w3.org/TR/xmlschema-2/#dateTime">XML Schema date format</a> -
// <code>YYYY-MM-DD</code>.
// Date values received from the server in responses are expected to be in the same format, though
// if time information is included in the returned date-string it will be understood. 
// This matches the default date serialization behavior for "json" dataSources, though dates may
// also be communicated as a JavaScript date instantiation string 
// (EG: <code>new Date(1238792738633)</code>). See +link{JSONEncoder.dateFormat}.
// <P>
// Fields of type +link{type:FieldType,datetime} are dates with full time information. System wide formatting
// for datetimes may be controlled via the +link{Date.setShortDatetimeDisplayFormat()} method, or
// at a component level by <code>datetimeFormatter</code> or <code>field.displayFormat</code>
// attributes. DateTimes willbe displayed to the user in local time as set up via 
// +link{Time.setDefaultDisplayTimezone()}. Note that if not explicitly set, this will default
// to the browser native timezone.
// <P>
// On the client datetime type fields are stored as JavaScript Date objects. 
// When communicating with a non SmartClient server via an "xml" DataSource, datetime field
// values in requests will be serialized out as full datetimes in UTC using the standard
// <a target=_blank href="http://www.w3.org/TR/xmlschema-2/#dateTime">XML Schema date format</a> -
// <code>YYYY-MM-DDTHH:MM:SS</code>.
// Date values received from the server in responses are expected to also be in XML Schema date
// format - and assumed to be in UTC time unless an explicit timezone offset is specified on
// the datetime string (EG:<code>2006-01-10T12:22:04-04:00</code>).
// As with dates, "json" format dataSources use the same XML Schema format by default but may
// use JavaScript date instantiation strings instead.
// <P>
// Fields of type +link{type:FieldType,time} are logical time values. These are stored on the client as
// JavaScript date objects, but only the time information is displayed to the user.
// Time formatting is handled by the +link{Time} class APIs. By default times are displayed to users
// in the display timezone set up via +link{Time.setDefaultDisplayTimezone()} [if not explicitly
// set, defaults to native browser local time]. Note that depending on the specific date being
// displayed, a Daylight Savings Time offset may also be applied based on the browser locale.
// To disable this behavior set +link{isc.Time.adjustForDST} to false.<br>
// When communicating with a non SmartClient server via an "xml" DataSource, time field
// values in requests will be serialized out as full times in UTC using the standard
// <a target=_blank href="http://www.w3.org/TR/xmlschema-2/#dateTime">XML Schema date / time
// format</a> - <code>HH:MM:SS</code>. Note that the flag +link{DataSource.serializeTimeAsDatetime}
// may be set to serialize all times as full datetimes rather than just time strings.
// Time values received from the server in responses are expected to be in the same format, in UTC,
// or with an explicit timezone offset specified (for example <code>"22:01:45-01:00"</code>)
// <P>
// When communicating with the SmartClient server fields of type <code>date</code>,
// <code>datetime</code> and <code>time</code> are all automatically translated to Java date objects
// on the server side. 
//
// @title Date and Time Format and Storage
// @treeLocation Concepts
// @visibility external
//<


_xmlSerialize : function (name, type, namespace, prefix) {
	return isc.Comm._xmlValue(name, this.toSchemaDate(), 
                              type || (this.logicalDate ? "date" : 
                                        (this.logicalTime &&
                                        !isc.DataSource.serializeTimeAsDatetime ? "time" : "datetime")), 
                              namespace, prefix);
},

// logicalType parameter - option to specify "date" vs "datetime" vs "time" which impacts
// how this date instance should be serialized out.
// Alternatively logicalDate / logicalTime attributes may be hung onto the date objet
// directly.
// Used by DataSources when serializing dates out
toSchemaDate : function (logicalType) {
    // logical date values have no meaningful time
    // Note that they also have "no meaningful timezone" - we display native browser locale time
    // to the user and when we serialize to send to the server we serialize in that same
    // local timezone.
    if ((logicalType == "date") || this.logicalDate) {
        return isc.SB.concat(
			this.getFullYear().stringify(4),
			"-",
			(this.getMonth() + 1).stringify(2), 	// getMonth() is zero-based
			"-",	
			this.getDate().stringify(2)
        );
    };
    
    // logical times are serialized as truncated schema strings (HH:MM:SS) by default
    if ((!isc.DataSource || !isc.DataSource.serializeTimeAsDatetime) && 
        (logicalType == "time" || this.logicalTime))
    {
        return isc.SB.concat(
            this.getUTCHours().stringify(2),":", 
            this.getUTCMinutes().stringify(2), ":", 
            this.getUTCSeconds().stringify(2)
        );
    }

    // represent date time values in UTC
    return isc.SB.concat(
			this.getUTCFullYear().stringify(4),
			"-",
			(this.getUTCMonth() + 1).stringify(2), 	// getMonth() is zero-based
			"-",	
			this.getUTCDate().stringify(2),
            "T",
            this.getUTCHours().stringify(2),
            ":",
            this.getUTCMinutes().stringify(2),
            ":",
            this.getUTCSeconds().stringify(2)
    );
},

//>	@method		date.toSerializeableDate()	(A)
// Return this date in 'serialized' format <code>YYYY-MM-DD HH:MM:SS</code>
// @group dateFormatting
// @return (String) formatted date string
// @visibility external
//<

toSerializeableDate : function (omitTime) {
    var output = isc.SB.create();
    output.append(
			this.getFullYear().stringify(4),
			"-",
			(this.getMonth() + 1).stringify(2), 	// getMonth() is zero-based
			"-",	
			this.getDate().stringify(2)
    );
    if (!omitTime) output.append(
            (isc.Comm.xmlSchemaMode ? "T" : " "),
            this.getHours().stringify(2),
            ":",
            this.getMinutes().stringify(2),
            ":",
            this.getSeconds().stringify(2)
			);
    return output.toString();
},

//>	@method		date.toDBDate()	(A)
//			Return this date in the format the database can parse as a dateTime:
//				<code>$$DATE$$:<i>YYYY-MM-DD HH:MM:SS</i></code>
//		@group	dateFormatting
//
//		@return					(string)	formatted date string
//  @visibility internal
//<
// Leave this internal for now
toDBDate : function () {
	return isc.StringBuffer.concat(
			"$$DATE$$:",
			this.toSerializeableDate()
			);
},


//>	@method		date.toDBDateTime()	(A)
//			Return this date in the format the database can parse as a dateTime:
//				<code>$$DATE$$:<i>YYYY-MM-DD HH:MM:SS</i></code>
//		@group	dateFormatting
//
//		@return					(string)	formatted date string
//      @visibility internal
//<

toDBDateTime : function () {    return this.toDBDate();       },	

//>	@method		date.setFormatter()
//  Set the formatter for this date object to the method name passed in.  After this call
//  wherever appropriate SmartClient components will use this formatter function to return 
//  the date as a string.
//		@group	dateFormatting
//		@param	functionName	(string)	name of a date formatter method on this Date 
//      @visibility external
//      @deprecated As of SmartClient 5.5 use the static methods
//              +link{classMethod:Date.setNormalDisplayFormat} and 
//              +link{classMethod:Date.setShortDisplayFormat} to set default formatters for all dates
//<
setFormatter : function (formatter) {
    this.setNormalDisplayFormat(formatter);
},

//>	@method	date.setLocaleStringFormatter() (A)
//			Set the <code>iscToLocaleString()</code> formatter for a specific date object.
//			After this call, all  <code>theDate.toLocaleString()</code>  calls will yield a string
//			 in this format.
//
//		@param	functionName	(string)	name of a dateFormatting function
//		@group	dateFormatting
//      @visibility internal
//      @deprecated As of SmartClient 5.5 use the static method 
//                  +link{classMethod:Date.setLocaleStringFormatter} instead
//<

setLocaleStringFormatter : function (functionName) {
	if (isc.isA.Function(this[functionName]) || isc.isA.Function(functionName)) 
        this.localeStringFormatter = functionName;
},

// ------------------------Advanced Date Comparison -------------------------------------------
// (currently undocd)
isBeforeToday : function (dateObj) {
    var today = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0).getTime();
    if (dateObj.getTime() < today) return true;
    else return false;
},

isToday : function (dateObj) {
    if (this.getFullYear() == dateObj.getFullYear() && this.getMonth() == dateObj.getMonth() 
        && this.getDate() == dateObj.getDate())
        return true;
    else return false;
},

isTomorrow : function (dateObj) {
    var tomorrowStart = new Date(this.getFullYear(), this.getMonth(), this.getDate() + 1, 0);
    var tomorrowEnd = new Date(this.getFullYear(), this.getMonth(), this.getDate() + 1, 23);
    var dateTime = dateObj.getTime();
    if (dateTime >= tomorrowStart.getTime() && dateTime <= tomorrowEnd.getTime()) {
        return true;    
    } else {
        return false;    
    }
},

isThisWeek : function (dateObj) {
    var weekStart = new Date(this.getFullYear(), this.getMonth(), this.getDate() - this.getDay(), 0);
    var weekEnd = new Date(this.getFullYear(), this.getMonth(), this.getDate() + (7 - this.getDay()), 23);
    var dateTime = dateObj.getTime();
     if (dateTime >= weekStart.getTime() && dateTime <= weekEnd.getTime()) {
        return true;    
    } else {
        return false;    
    }
},

isNextWeek : function (dateObj) {
    var weekStart = new Date(this.getFullYear(), this.getMonth(), (this.getDate() - this.getDay()) + 7, 0);
    var weekEnd = new Date(this.getFullYear(), this.getMonth(), (this.getDate() - this.getDay()) + 14, 23);
    var dateTime = dateObj.getTime();
     if (dateTime >= weekStart.getTime() && dateTime <= weekEnd.getTime()) {
        return true;    
    } else {
        return false;    
    }      
}, 

isNextMonth : function (dateObj) {
    var monthStart = new Date(this.getFullYear(), this.getMonth());
    monthStart.setMonth(monthStart.getMonth() + 1);
    if (monthStart.getFullYear() == dateObj.getFullYear() && monthStart.getMonth() == dateObj.getMonth()) {
        return true;         
    } else {
        return false;    
    }
}

});


//>	@method		date.toBrowserString()
//  Native <code>date.toString()</code> provided by the browser for Date objects
//		@group	dateFormatting
//      @visibility internal
//      @deprecated As of SmartClient 5.5
//<
// Note that the default formatter varies by browser/platform so it's not that useful.
// This was exposed in 5.2 so we're keeping it around for back-compat only
Date.prototype.toBrowserString = Date.prototype.toString;

//>	@method		date.toBrowserLocaleString()    (A)
//  Synonym for <code>date.toLocaleString()</code> provided by the browser for Date objects
//		@group	dateFormatting
//      @visibility internal
//      @deprecated As of SmartClient 5.5
//<

Date.prototype.toBrowserLocaleString = Date.prototype.toLocaleString;

// set the standard formatter for the date prototype to the native browser string
//	so everything works as normal until it is overridden.
if (!Date.prototype.formatter) Date.prototype.formatter = "toLocaleString"

// set the standard toShortDate() formatter to US Short Date
if (!Date.prototype._shortFormat) Date.setShortDisplayFormat("toUSShortDate");
if (!Date.prototype._shortDatetimeFormat) Date.setShortDatetimeDisplayFormat("toUSShortDateTime");

//>	@method		date.iscToLocaleString()   (A)
// Customizeable toLocaleString() type method.
// This method is called when isc.iscToLocaleString(date) is called.
//
//		@group	dateFormatting
//		@return				(string)	formatted date string
//      @visibility internal
//<
// Leave this internal - we don't really expect this to be called directly or overridden by
// the developer

Date.prototype.iscToLocaleString = function () {
    var formatter = this.localeStringFormatter;
    if (isc.isA.Function(formatter)) return formatter.apply(this);
    else if (this[formatter]) return this[formatter]();
}

// By default have iscToLocaleString() call date.toLocaleString()
if (!Date.prototype.localeStringFormatter) 
    Date.prototype.localeStringFormatter = "toLocaleString";

// Explicitly set the default date input format to "MDY" (standard US format)
Date.setInputFormat("MDY");
    
//>Safari12
isc.addMethods(Date, {
    // Simple substring matching for splitting up a date string to avoid using unsupported
    // string.match() method in early Safari
    // Note - somewhat flawed: we're assuming well never be handed a single digit month or day
    _splitDateViaSubstring : function (string, monthIndex, dayIndex, yearIndex) {
        
        // We know that year may be after month and/or day - allow 3 chars ("DD/") for each
        var yearCharIndex = yearIndex * 3,
            year = string.substring(yearCharIndex, yearCharIndex +4) ;
        
        // If we have a 2 char year, this may effect the position of the day/month in the string
        var twoCharYear = (parseInt(year) != year);
        if (twoCharYear) year = year.substring(0,2);
        
        var monthCharIndex = 0,
            dayCharIndex = 0;
        if (monthIndex > dayIndex) monthCharIndex += 3;
        else dayCharIndex += 3;
        
        if (monthIndex > yearIndex) monthCharIndex += (twoCharYear?3 : 5);
        if (dayIndex > yearIndex) dayCharIndex += (twoCharYear ? 3 : 5);
        
        // Note: Month is zero based rather than 1 based.
        var month = string.substring(monthCharIndex, monthCharIndex + 2) -1;
        var day = string.substring(dayCharIndex, dayCharIndex +2);
        
        // Hour minute second are not expected to change orders
        var hourCharIndex = twoCharYear ? 9 : 11,
            hour = (string.substring(hourCharIndex,hourCharIndex + 2) || 0),
            minute = (string.substring(hourCharIndex + 3, hourCharIndex + 5) || 0),
            second = (string.substring(hourCharIndex + 6, hourCharIndex + 8) || 0);
        
        return[year,month,day,hour,minute,second];
    }
});
//<Safari12

//>!BackCompat 2005.11.3

isc.addMethods(Date.prototype, {

//>	@method		date.toPrettyString()
//			Return this date in the format: <code>MM/DD/YY HH:MM</code>
//	@group  dateFormatting
//	@return (string)	formatted date string
//  @visibility external
//  @deprecated As of SmartClient 5.5 use +link{date.toShortDate()} instead 
//<
toPrettyString : function () {
    return this.toUSShortDateTime();
} 

});

isc.addMethods(Date, {


// --- Parsing functions --- :
// In 5.2 the paradigm was to provide formatters and complimentary parsers, like 
// 'toEuropeanShortDate' and 'parseEuropeanShortDate'.
// We've moved away from this to instead use a single 'parseInput' function which takes a 
// 'format' parameter specifying "MDY" / "DMY", etc.
// This is appropriate since we do not plan to provide parsing functions for every date formatter
// format.
// Leaving the older explicit parsing functions in place for back-compat only.

//>	@classMethod	Date.parseStandardDate()
//      Parse a date passed in as a string of format:
//      <code>YYYY-MM-DD HH:MM:SS</code> or <code>YYYY-MM-DD</code>
//      Returning a new <code>Date</code> object with the appropriate value.
// 
//      @group  dateFormatting
//
//      @param  dateString  (string)	date value as a string
//
//      @return	(date)      date value
//      @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseStandardDate : function (dateString) {
    if (!isc.isA.String(dateString)) return null;

    // Note: we could be using a regexp here rather than substring matches
    var year = dateString.substring(0,4),
        month = dateString.substring(5,7)-1,
        day = dateString.substring(8,10),
        hour = dateString.substring(11, 13),
        minute = dateString.substring(14, 16),
        second = dateString.substring(17, 19);
    
    // If they all are numbers, construct a new date
    // NOTE: If year - month - day gives a number then they 
    // are all numbers, or strings that implicitly convert to numbers.
    // We could also use this syntax:
    // if(parseInt(year) == year && parseInt(month) == month ...)
    // but this is slower in both Moz and IE
    if (dateString.length < 19) {
        if (!isc.isA.Number(year - month - day)) return null;
    } else {
        if (!isc.isA.Number(year - month - day - hour - minute - second)) return null;    
    }

    return new Date(year, month, day, hour, minute, second);

},

//>	@classMethod	Date.parseSerializeableDate()
//      Parse a date passed in as a string of format:
//      <code>YYYY-MM-DD HH:MM:SS</code> or <code>YYYY-MM-DD</code>
//      Returning a new <code>Date</code> object with the appropriate value.
//      <i>This is a synonym for </i><code>Date.parseStandardDate()</code>
// 
//      @group  dateFormatting
//      @param  dateString  (string)	date value as a string
//      @return	(Date)      date value
//      @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseSerializeableDate : function (dateString) {
    // synonym for parseStandardDate
    return this.parseStandardDate(dateString);
},


//>	@classMethod	Date.parseDBDate()
// Parse a date passed in as a string of format:   
//  <code>$$DATE$$:<i>YYYY-MM-DD HH:MM:SS</i></code>
//      Returning a new <code>Date</code> object with the appropriate value.
//
//      @group  dateFormatting
//		@param	dateString  (string)	date value as a string
//		@return	(date)		date value
//      @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseDBDate : function (dateString) {

    // remove the leading "$$DATE$$:"
    if (isc.isA.String(dateString) && dateString.startsWith("$$DATE$$:")) {
        dateString = dateString.substring(9)    
        return this.parseStandardDate(dateString);
    }        

    return null;

},

//>	@classMethod	Date.parseDateStamp()
// 
// Parse a dateStamp of the format: <code><i>YYYYMMDD</i>T<i>HHMMSS</i>[Z]</code><br><br>
//
// @group  dateFormatting
// @param	dateString	(string)	String to parse
// @return				(Date)		Date object, or null if not parsed correctly.
//
// @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseDateStamp : function (string) {
	if (string == null || isc.isA.Date(string)) return string;
	
    var date = new Date( Date.UTC(
                string.substring(0,4),                // year
                parseInt(string.substring(4,6), 10)-1,    // mon
                string.substring(6,8),              // day
                // omit this character (T)
                string.substring(9,11),             // hour
                string.substring(11,13),            // min
                string.substring(13,15)
                // Technically we should look at the last character - if its something other
                // than "z" the timezone would be something other than UTC.
               ));

	if (isc.isA.Date(date)) return date;
	else				return null;

},

//>	@classMethod	Date.parseShortDate()
// Parse a date passed in as a string of format:   <code>MM/DD/YYYY</code>
//
//      @group  dateFormatting
//		@param	dateString  (string)	date value as a string
//      @param  [centuryThreshold]  (number)    if parsed year is 2 digits and less than this
//                                              number, assume year to be 20xx
//
//		@return	(date)		date value
//  @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseShortDate : function (string, centuryThreshold) {
    return this.parseInput(string, "MDY", centuryThreshold);
},

//>	@classMethod	Date.parseShortDateTime()
// Parse a date passed in as a string of format:   <code>MM/DD/YYYY HH:MM:SS</code>
//
//      @group  dateFormatting
//		@param	dateString  (string)	date value as a string
//      @param  [centuryThreshold]    (number)    if parsed year is 2 digits and less than this
//                                              number, assume year to be 20xx
//
//		@return	(date)		date value
//  @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseShortDateTime : function (string, centuryThreshold) {
    // synonym for parseShortDate - included for completeness and to provide the appropriate 
    // compliment to date.toShortDateTime()
    return this.parseShortDate(string, centuryThreshold);
},

//>	@classMethod	Date.parsePrettyString()
// Parse a date passed in as a string of format:   <code>MM/DD/YY HH:MM:SS</code>
//
//      @group  dateFormatting
//		@param	dateString  (string)	date value as a string
//      @param  [centuryThreshold]    (number)    if parsed year is less than this
//                                              number, assume year to be 20xx rather than 19xx
//
//		@return	(date)		date value
//  @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parsePrettyString : function (string, centuryThreshold) {
    // this is just the same as a short date with a 2 digit year.
    return this.parseShortDate(string, centuryThreshold);
},

//>	@classMethod	Date.parseEuropeanShortDate()
//			parse a date passed in as a string of format:   <code>DD/MM/YYYY</code>
//		@group	dateFormatting
//		@param	dateString  (string)	date value as a string
//      @param  [centuryThreshold]    (number)    if parsed year is 2 digits and less than this
//                                              number, assume year to be 20xx
//
//		@return	(date)		date value
//      @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseEuropeanShortDate : function (string, centuryThreshold) {
    return this.parseInput(string, "DMY", centuryThreshold);
},

//>	@classMethod	Date.parseEuropeanShortDateTime()
//			parse a date passed in as a string of format:   <code>DD/MM/YYYY HH:MM:SS</code>
//		@group	dateFormatting
//		@param	dateString  (string)	date value as a string
//      @param  [centuryThreshold]    (number)    if parsed year is 2 digits and less than this
//                                              number, assume year to be 20xx
//
//		@return	(date)		date value
//  @visibility internal
//  @deprecated As of SmartClient 5.5 use +link{date.parseInput} instead
//<
parseEuropeanShortDateTime : function (string, centuryThreshold) {
    return this.parseInput(string, "DMY", centuryThreshold);
}   
});
//<!BackCompat




