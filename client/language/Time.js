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






//> @class Time
// Helper methods and system-wide defaults for dealing with time values and time display formats.
// Note that Times are stored as JavaScript date objects on the client, though only the
// time information is typically displayed to the user. See 
// +link{group:dateFormatAndStorage,Date format and storage} for more information on working with
// <code>"time"</code> type fields.
//
// @treeLocation Client Reference/System
// @visibility external
//<
isc.ClassFactory.defineClass("Time");


isc.Time.addClassProperties({

    //> @classAttr  Time.UTCHoursOffset (number : null : IRA)
    // Time data is stored in Date type objects. 
    // In order to have times display consistently across browsers all times assumed to be stored
    // as UTC times.
    // This property allows you to specify an timezone offset between the stored time 
    // and the displayed time.
    // @visibility external
    // @deprecated As of 7.0 this attribute has been deprecated in favor of
    // +link{Time.setDefaultDisplayTimezone()}
    //<
    //UTCHoursOffset:0,
    // ** On page load we check for this property being set and use it to call
    //    setDefaultDisplayTimezone() with a deprecated warning
    
    
    //> @classMethod  Time.setDefaultDisplayTimezone()
    // Sets the offset from UTC to use when formatting values of type +link{FieldType,datetime} 
    // and +link{FieldType,time} with standard display formatters.
    // <P>
    // If this method is never called, the default display timezone for times and datetimes will
    // be derived from the native browser local timezone.
    // @param offset (string) offset from UTC. This should be a string in the format
    //    <code>+/-HH:MM</code> for example <code>"-08:00"</code>
    // @see group:dateFormatAndStorage
    // @visibility external
    //<
    setDefaultDisplayTimezone : function (offset) {
        if (offset == null) return;
        // Handle being passed an offset in minutes - this matches the format returned by
        // native Date.getTimezoneOffset()
        var hours, minutes;
        if (isc.isA.Number(offset)) {
            
            offset = -offset;
            hours = Math.floor(offset/60);
            minutes = offset - (hours*60);
        } else if (isc.isA.String(offset)) {
            var HM = offset.split(":");
            hours = HM[0];
            var negative = hours && hours.startsWith("-");
            minutes = HM[1];
            
            hours = (negative ? -1 : 1) * parseInt(hours,10);
            minutes = (negative ? -1 : 1) * parseInt(minutes,10);
        }
        
        if (isc.isA.Number(hours) && isc.isA.Number(minutes)) {
            this.UTCHoursDisplayOffset = hours;
            this.UTCMinutesDisplayOffset = minutes;
        }
     
    },
    
    //> @classMethod Time.getDefaultDisplayTimezone()
    // Returns the default display timezone set up by +link{Time.setDefaultDisplayTimezone}.
    // If no explicit timezone has been set this will return the browser locale timezone offset.
    // @return (string) String of the format <code>+/-HH:MM</code>
    // @visibility external
    //<
    // we don't call this internally since it's easier to to work with the stored hours/minutes
    // directly
    getDefaultDisplayTimezone : function () {
        var H = this.UTCHoursDisplayOffset,
            M = this.UTCMinutesDisplayOffset,
            negative = H < 0;
        return (!negative ? "+" : "") +
                H.stringify(2) + ":" + ((negative ? -1 : 1) * M).stringify(2);
    },
    
    
    //>	@classAttr	isc.Time._timeExpressions (Array : [..] : IRA)
	// List of regular expressions to parse a time string
	//		@group	parsing
	//<
	_timeExpressions : [				
			/^\s*(\d?\d)\s*[: ]\s*(\d?\d)\s*[: ]\s*(\d?\d)?\s*([AaPp][Mm]?)?\s*([+-]\d{2}:\d{2}|Z)?\s*$/,
			/^\s*(\d?\d)\s*[: ]\s*(\d?\d)(\s*)([AaPp][Mm]?)?\s*([+-]\d{2}:\d{2}|Z)?\s*$/,
			/^\s*(\d\d)(\d\d)(\d\d)?\s*([AaPp][Mm]?)?\s*([+-]\d{2}:\d{2}|Z)?\s*$/,
			/^\s*(\d)(\d\d)(\d\d)?\s*([AaPp][Mm]?)?\s*([+-]\d{2}:\d{2}|Z)?\s*$/,
			/^\s*(\d\d?)(\s)?(\s*)([AaPp][Mm]?)?\s*([+-]\d{2}:\d{2}|Z)?\s*$/
		],

    //> @type   timeFormatter
    // String designating a standard time formatter for displaying the times associated with 
    // dates strings.
    // @value   toTime
    //  String will display with seconds and am/pm indicator:<code>[H]H:MM:SS am|pm</code>. <br>
    //  Example: <code>3:25:15 pm</code>
    // @value  to24HourTime
    //  String will display with seconds in 24 hour time: <code>[H]H:MM:SS</code>. <br>
    //  Example: <code>15:25:15</code>
    // @value  toPaddedTime
    //  String will display with seconds, with a 2 digit hour and am/pm indicator: 
    //  <code>HH:MM:SS am|pm</code> <br>
    //  Example: <code>03:25:15 pm</code>
    // @value  toPadded24HourTime
    //  String will display with seconds, with a 2 digit hour in 24 hour format: 
    //  <code>HH:MM:SS</code> <br>
    //  Examples: <code>15:25:15</code>, <code>03:16:45</code>
    // @value toShortTime
    //  String will have no seconds and be in 12 hour format:<code>[H]H:MM am|pm</code><br>
    //  Example: <code>3:25 pm</code>
    // @value toShort24HourTime
    //  String will have no seconds and be in 24 hour format: <code>[H]H:MM</code><br>
    //  Example:<code>15:25</code>
    // @value toShortPaddedTime
    //  String will have no seconds and will display a 2 digit hour, in 12 hour clock format:
    //  <code>HH:MM am|pm</code><br>
    //  Example: <code>03:25 pm</code>
    // @value toShortPadded24HourTime
    //  String will have no seconds and will display with a 2 digit hour in 24 hour clock format:
    // <code>HH:MM</code><br>
    // Examples: <code>15:25</code>, <code>03:16</code>
    //
    // @visibility external
    //<

    // To simplify parsing / formatting, map valid formatter names to the details of the format
    formatterMap:{
        toTime:{showSeconds:true, padded:false, show24:false},
        to24HourTime:{showSeconds:true, padded:false, show24:true},

        toPaddedTime:{showSeconds:true, padded:true, show24:false},
        toPadded24HourTime:{showSeconds:true, padded:true, show24:true},
        
        toShortTime:{showSeconds:false, padded:false, show24:false},
        toShort24HourTime:{showSeconds:false, padded:false, show24:true},
        toShortPaddedTime:{showSeconds:false, padded:true, show24:false},

        toShortPadded24HourTime:{showSeconds:false, padded:true, show24:true}
    },
    
    
    
    //> @classAttr Time.displayFormat  (timeFormatter | function : "toTime" : RWA)
    // Standard formatter to be used when converting a date to a time-string via +link{Time.toTime()}
    // @setter Time.setNormalDisplayFormat()
    // @visibility external
    //<
    displayFormat:"toTime",

    //> @classAttr Time.shortDisplayFormat  (timeFormatter | function : "toShortTime" : RWA)
    // Standard formatter to be used when converting a date to a time-string via +link{Time.toShortTime()}
    // @setter Time.setShortDisplayFormat()
    // @visibility external
    //<
    shortDisplayFormat:"toShortTime",
    
    //> @classAttr Time.AMIndicator (string : " am" : RWA)
    // String appended to times to indicate am (when not using 24 hour format).
    // @visibility external
    // @group i18nMessages
    //<
    AMIndicator:" am",
    //> @classAttr Time.PMIndicator (string : " pm" : RWA)
    // String appended to times to indicate am (when not using 24 hour format).
    // @visibility external
    // @group i18nMessages
    //<
    PMIndicator:" pm"

    //> @classAttr Time.adjustForDST (boolean : true (see description) : RWA)
    // Determines whether date/time formatters should consider the effect of Daylight Saving
    // Time when computing offsets from UTC.  By default, this flag is set during framework
    // initialization if SmartClient detects that it is running in a locale that is observing 
    // DST this year.  If you do not want DST adjustments to be applied, set this flag to 
    // false.<p>
    // Note that setting this flag to true will have no effect unless you are in a locale 
    // that is observing Daylight Saving Time this year; this is because we rely on the 
    // browser for offset information, and browsers are only capable of returning local date
    // and time information for the computer's current locale.
    // @visibility external
    //<
    
});

isc.Time.addClassMethods({

    //> @classMethod Time.toTime()
    // Given a date object, return the time associated with the date as a string.
    // If no formatter is passed, use the standard formatter set up via +link{Time.setNormalDisplayFormat()}
    // @param date (Date) Date to convert to a time string.
    // @param [formatter] (timeFormatter | function) Optional custom formatter to use. Will accept
    //  a function (which will be passed a pointer to the date to perform the conversion), or
    //  a string designating a standard formatter
    // @visibility external
    //<
    toTime : function (date, formatter) {
        return this.format(date, formatter, false);
    },
    
    //> @classMethod Time.toShortTime()
    // Given a date object, return the time associated with the date as a short string.
    // If no formatter is passed, use the standard formatter set up via +link{Time.setShortDisplayFormat()}
    // @param date (Date) Date to convert to a time string.
    // @param [formatter] (timeFormatter | function) Optional custom formatter to use. Will accept
    //  a function (which will be passed a pointer to the Date to format), or
    //  a string designating a standard formatter
    // @visibility external
    //<    
    toShortTime : function (date, formatter) {
        return this.format(date, formatter, true);
    },

    // Given a date return a formatted time string
    _$timeTemplate:[null, ":", null, ":"],
    _$shortTimeTemplate:[null, ":"],
    format : function (date, formatter, shortFormat) {
        // If we're passed a random object (most likely null or a string), just return it
        if (!isc.isA.Date(date)) return date;

        var originalFormatter = formatter;

        // Sanity check - don't allow unexpected things passed in as a formatter to give us
        // odd results
        if (!formatter && !isc.isA.String(formatter) && !isc.isA.Function(formatter)) {
            formatter = shortFormat ? this.shortDisplayFormat : this.displayFormat;
        }

        // Support passing in a completely arbitrary formatter function
        if (isc.isA.Function(formatter)) return formatter(date);
        
        if (isc.isA.String(formatter)) formatter = this.formatterMap[formatter];
        
        if (!isc.isAn.Object(formatter)) {
            this.logWarn("Invalid time formatter:" + originalFormatter + " - using 'toTime'");
            formatter = this.formatterMap.toTime;
        }

        var showSeconds = formatter.showSeconds,
            padded = formatter.padded,
            show24 = formatter.show24;
        
        var hour = date.getUTCHours(),
            minutes = date.getUTCMinutes();
            
        // Add the display timezone offset to the hours / minutes so we display the
        // time in the appropriate timezone
        var hm = this._applyTimezoneOffset(hour, minutes,
                                            this.getUTCHoursDisplayOffset(date),
                                            this.getUTCMinutesDisplayOffset(date));
        hour = hm[0];
        minutes = hm[1];
        
        var seconds = showSeconds ? date.getUTCSeconds() : null,
            pm = show24 ? null : (hour >=12);
        
        // Hour will be in 24 hour format by default
        if (!show24) {
            if (hour > 12) hour = hour - 12;
            if (hour == 0) hour = 12;
        }
        if (padded) hour = hour.stringify(2);
        
        var template = showSeconds ? this._$timeTemplate : this._$shortTimeTemplate;
        template[0] = hour;
        template[2] = minutes.stringify();
        if (showSeconds) template[4] = seconds.stringify();
        
        if (!show24) template[5] = (pm ? this.PMIndicator : this.AMIndicator);
        else template[5] = null;

        return template.join(isc.emptyString);
    },
    
    //> @classMethod Time.parseInput()
    // Converts a time-string such as <code>1:00pm</code> to a date object with the appropriate
    // time set. Accepts most formats of time string.
    // <P>
    // Input time is expected to be in the local timezone specified by
    // +link{time.setDefaultDisplayTimezone()} by default unless the UTCTime parameter is
    // passed in. An explicit timezone offset from UTC
    // may also be specified directly in the timestring passed in - for example
    // <code>"00:00:00+02:00"</code>.
    // @param timeString (string) time string to convert to a date
    // @param validTime (boolean) If this method is passed a timeString in an unrecognized format,
    //  return null rather than a date object with time set to 00:00:00
    // @param UTCTime (boolean) if passed (and the time string passed in has no explicit timezone
    //  offset specified), assume the time passed in is in UTC time rather than
    //  the local display timezone.
    // @visibility external
    //<    
    // EXTREMELY forgiving of formatting, can accept the following:
	//		11:34:45 AM	=> 11:34:45
    //      11:34:45    => 11:34:45
	//		1:3:5 AM	=> 01:30:50
	//		1:3p		=> 13:30:00
	//		11 34 am	=> 11:34:00
	//		11-34		=> 11:34:00
	//		113445		=> 11:34:45
	//		13445		=> 01:34:45
	//		1134		=> 11:34:00
	//		134			=> 01:34:00
	//		11			=> 11:00:00
	//		1p			=> 13:00:00
	//		9			=> 09:00:00
    // Also supports explicitly specified timezone offset specified by "+/-HH:MM" at the end.
    
    // Note: technically being passed "1:00" is ambiguous - could be AM or PM.
    // We always interpret as 24 hour clock (so <12 = AM) unless am/pm is actually passed in.
    
    parseInput : function (string, validTime, UTCTime) {
        var hours = 0,
            minutes = 0,
            seconds = 0,
            // We don't currently extract milliseconds from a time-string. Instead we zero them
            // out for consistency across times created by this method.
            milliseconds = 0;
            
        var hoursOffset = UTCTime ? 0 : this.UTCHoursDisplayOffset,
            minutesOffset = UTCTime ? 0 : this.UTCMinutesDisplayOffset;
        // if we're passed a date we'll return a new date with the same time (h/m/s/ms, not the same
        // date).
        if (isc.isA.Date(string)) {
            // We'll match the specified time exactly - no need to manipulate timezone offsets
            // here since the underlying UTC time will match and any offsetting for display
            // will occur in formatters.
            UTCTime = true;
            hours = string.getUTCHours();
            minutes = string.getUTCMinutes();
            seconds = string.getUTCSeconds();
            milliseconds = string.getUTCMilliseconds();
            
        } else if (string) {
    		// iterate through the time expressions, trying to find a match
    		for (var i = 0; i < isc.Time._timeExpressions.length; i++) {
    			var match = isc.Time._timeExpressions[i].exec(string);
    			if (match) break;
    		}
            if (match) {
        		// get the hours, minutes and seconds from the match
        		// NOTE: this results in 24:00 going to 23:00 rather than 23:59...
        		var hours = Math.min(parseInt(match[1]|0, 10),23),
        			minutes = Math.min(parseInt(match[2]|0, 10),59),
        			seconds = Math.min(parseInt(match[3]|0, 10),59),
        			ampm = match[4];
        		;
                if (ampm) {
                    if (!this._pmStrings) this._pmStrings = {p:true, P:true, pm:true, PM:true, Pm:true};
                    if (this._pmStrings[ampm]) {
                        if (hours < 12) hours += 12;
                        } else if (hours == 12) hours = 0;
                }
                
                // if a timezone was explicitly specified on the value passed in, respect it
                // regardless of "UTCTime" parameter
                // So we'll handle 18:00:01 -01:00
                // as 6pm one hour offset from UTC
                // NOTE: the offset specifies the timezone the date is already in, so 
                // to get to UTC we have to subtract the offset
                
                if (match[5] != null && match[5] != "" && match[5].toLowerCase() != "z") {
                    var HM = match[5].split(":"),
                        H = HM[0],
                        negative = H && H.startsWith("-"),
                        M = HM[1];
                    hoursOffset = parseInt(H,10);
                    minutesOffset = (negative ? -1 : 1) * parseInt(M,10);
                }
            } else if (validTime) return null;
        } else if (validTime) return null;
        var date = new Date();
        
        // NOTE: we're creating UTC time -- any offset indicates the offset for the timezone
        // the inputted time is currently in [either browser local time or explicit offset
        // passed in as part of the time string], so we need to subtract this offset to get to
        // UTC time (not add it)
        var hm = this._applyTimezoneOffset(hours, minutes, (0-hoursOffset), (0-minutesOffset));
        
        hours = hm[0];
        minutes = hm[1];
        
        if (hours != null) date.setUTCHours(hours);
        if (minutes != null) date.setUTCMinutes(minutes);
        if (seconds != null) date.setUTCSeconds(seconds);
        if (milliseconds != null) date.setUTCMilliseconds(milliseconds);
        return date;
    },
    
    // Helper method to apply an arbitrary timezone offset to hours / minutes
    // Returns array: [newHours,newMinutes,dayOffset]
    // dayOffset ignored for time fields, but can be used to update datetimes
    _applyTimezoneOffset : function (hours, minutes, hOffset, mOffset) {
        if (minutes == null || hours == null) {
            this.logWarn("applyTimezoneOffset passed null hours/minutes");
            return [hours,minutes];
        }
        if (hOffset == null) hOffset = 0;
        if (mOffset == null) hOffset = 0;
        if (hOffset == 0 && mOffset == 0) return [hours,minutes,0];
        
        hours += hOffset;
        minutes += mOffset;
        
        // Catch the case where the display offset from UTC pushes the hours / minutes
        // past 60 [or 24] or below zero
        // (Don't worry about the date - we're only interested in the time!)
        while (minutes >= 60) {
            minutes -= 60;
            hours += 1;
        }
        
        while (minutes < 0) {
            minutes += 60;
            hours -= 1;
        }

        var dayOffset = 0;
        
        while (hours >= 24) {
            hours -= 24;
            dayOffset += 1;
        }
        while (hours < 0) {
            hours += 24;
            dayOffset -= 1;
        }
        
        return [hours,minutes, dayOffset];
    },
    
     
    //> @classMethod Time.createDate()
    // Creates a date object with the time set to the hours, minutes and seconds passed in.
    // Unless the <code>UTCTime</code> parameter is passed in, parameters are assumed
    // to specify the time in local display time -- offset from 
    // UTC by +link{Time.setDefaultDisplayTimezone(),default display timezone}.
    // @param [hours] (number) Hours for the date (defaults to zero)
    // @param [minutes] (number) Minutes for the date (defaults to zero)
    // @param [seconds] (number) Seconds for the date (defaults to zero)
    // @param [milliseconds] (number) Milliseconds for the date (defaults to zero)
    // @param [UTCTime] (boolean) If true, treat the time passed in as UTC time (so when the
    //  time is displayed using normal formatters it will be offset by the specified
    //  +link{Time.setDefaultDisplayTimezone(),default display timezone}). Otherwise assumes
    //  time passed in is already in the specified display timezone.
    // @visibility external
    //<
    
    createDate : function (hours, minutes, seconds, milliseconds, UTCTime) {
        var date = new Date();
        
        if (hours == null) hours = 0;
        if (minutes == null) minutes = 0;
        if (seconds == null) seconds = 0;
        if (milliseconds == null) milliseconds = 0;
        if (!UTCTime) {
            // to map from display timezone (say -06:00) to UTC we need to subtract
            // the timezone offset
            var hoursOffset = - this.UTCHoursDisplayOffset,
                minutesOffset = - this.UTCMinutesDisplayOffset;
            var hm = this._applyTimezoneOffset(hours, minutes, hoursOffset, minutesOffset);
            hours = hm[0];
            minutes = hm[1];
        }
        
        date.setUTCHours(hours);
        date.setUTCMinutes(minutes);
        date.setUTCSeconds(seconds);
        date.setUTCMilliseconds(milliseconds);
        return date;
    },
    
    //> @classMethod Time.setShortDisplayFormat()
    // Sets the default format for strings returned by +link{Time.toShortTime()}.
    // @param formatter (timeFormatter | function) Optional custom formatter to use. Will accept
    //  a function (which will be passed a pointer to the date to perform the conversion), or
    //  a string designating a standard formatter
    // @visibility external
    //<    
    setShortDisplayFormat : function (format) {
        this.shortDisplayFormat = format;
    },
    
    //> @classMethod Time.setNormalDisplayFormat()
    // Sets the default format for strings returned by +link{Time.toTime()}.
    // @param formatter (timeFormatter | function) Optional custom formatter to use. Will accept
    //  a function (which will be passed a pointer to the date to perform the conversion), or
    //  a string designating a standard formatter
    // @visibility external
    //<    
    setNormalDisplayFormat : function (format) {
        this.displayFormat = format;
    },
    
    //> @classMethod Time.compareTimes()
    // Compares the times of 2 dates, or strings. If a string is passed as one of the 
    // parameters it should be in a format that converts to a valid time such as <code>"1:30pm"</code>, 
    // <code>"13:30"</code>, or <code>"1:30:45pm"</code>
    // @param time1 (Date|string) First time to compare
    // @param time2 (Date|string) Second time to compare
    // @return (boolean) True if the times match, false if not
    // @visibility external
    //<    
    compareTimes : function (time1, time2) {
        // If this method becomes time-critical we could speed this up by avoiding the
        // date conversion and having parseInput return just an array of H,M,S
        if (isc.isA.String(time1)) time1 = isc.Time.parseInput(time1);
        if (isc.isA.String(time2)) time2 = isc.Time.parseInput(time2);
        
        if (time1 == null && time2 == null) return true;
        
        // If we get non-dates at this point just return false - we don't want to be
        // comparing other types
        if (!isc.isA.Date(time1) || !isc.isA.Date(time2)) return false;
        
        return ((time1.getUTCHours() == time2.getUTCHours()) && 
                (time1.getUTCMinutes() == time2.getUTCMinutes()) && 
                (time1.getUTCSeconds() == time2.getUTCSeconds()));
        
    },
    
    _performDstInit : function () {
        var now = new Date(),
            january = new Date(0),
            july = new Date(0);

        // Daylight Saving Time involves moving the clock forward in order to shift some of 
        // the daylight from very early morning (when most people are asleep) to mid-evening
        // (when people benefit from more hours of daylight, and energy can be saved that 
        // would otherwise be needed for lighting).  Not every country observes DST, and those
        // countries that do observe it set their own start and end dates, though there are 
        // common approaches - for example, many European countries start DST during the last
        // weekend of March and end it during the last weekend of October.
        //
        // Daylight Saving Time, if it is applicable at all, always starts sometime in spring 
        // and ends ends sometime in autumn, but there is no more accurate rule than that.
        // Currently, every country that observes DST does so by moving their local time 
        // forward by one hour; however, other values have been used, so this cannot be relied
        // upon either.
        //
        // It is common to transition to and from DST ar 02:00 local time - when
        // DST starts, the local time jumps instantly to 03:00, when DST ends it jumps 
        // instantly back to 01:00.  However, this is again a common approach rather than a
        // rule.
        // 
        // Note that it is important to think in terms of seasons rather than months, because 
        // the northern and southern hemispheres have opposite seasons.  Hence DST (if it 
        // applies at all) starts in March/April and ends in October/November in the northern 
        // hemisphere, and does the exact opposite in the southern hemisphere.
        // 
        // Because of all of this, and because the only timezone information you can retrieve 
        // from a Javascript Date object is the number of minutes that particular date/time 
        // is offset from UTC, we have quite limited information and must resort to roundabout
        // techniques.  We can discover if we are in a locale that observes DST by checking
        // the UTC offsets in January and July; if they are different, the current locale 
        // observes DST.  
        // 
        // Going a step further than this, we can tell whether we are observing DST or normal 
        // time on an arbitrary date: by looking to see whether the clock goes  forward or 
        // backward in the early part of the year (spring in the northern hemisphere), we can 
        // infer which hemisphere the current locale is in, and from that we can decide if 
        // the offset in January is the DST or non-DST offset.  Then, we can check the offset
        // of the given date against the offset in January; if it matches then it is in DST
        // if we're in the southern hemisphere, and in normal time if we're in the northern 
        // hemisphere.
        //
        // For more interesting information on this subject, see 
        // http://www.timeanddate.com/time/aboutdst.html
        
        january.setUTCFullYear(now.getUTCFullYear());
        january.setUTCMonth(0);
        january.setUTCDate(1);
        july.setUTCFullYear(now.getUTCFullYear());
        july.setUTCMonth(6);
        july.setUTCDate(1);
            
        var nowOffset = now.getTimezoneOffset();
        this.januaryDstOffset = january.getTimezoneOffset();
        var julyOffset = july.getTimezoneOffset();
        
        this.dstDeltaMinutes = this.januaryDstOffset - julyOffset;
        if (this.dstDeltaMinutes > 0) {
            // Time is offset further forward from UTC in July; this locale observes DST
            // and is in the northern hemisphere (this logic is curiously backwards, because
            // getTimezoneOffset() returns negative numbers for positive offsets)
            this.southernHemisphere = false;
            this.adjustForDST = true;
            if (nowOffset == julyOffset) this.currentlyInDST = true;
        } else if (this.dstDeltaMinutes < 0) {
            // Time is offset further forward from UTC in January; this locale observes DST
            // and is in the southern hemisphere
            this.southernHemisphere = true;
            this.adjustForDST = true;
            if (nowOffset == this.januaryDstOffset) this.currentlyInDST = true;
        } else {
            // the delta is 0 and DST is not a factor in this locale
            this.adjustForDST = false;
        }
            
        // As noted above, all current observations of Daylight Saving Time involve moving 
        // local time one hour forward, so right now these variables will always end up as
        // 1 and 0 
        this.dstDeltaMinutes = Math.abs(this.dstDeltaMinutes);
        this.dstDeltaHours = Math.floor(this.dstDeltaMinutes / 60);
        this.dstDeltaMinutes -= (this.dstDeltaHours * 60);
    },

    getUTCHoursDisplayOffset: function(date) {
        // If we're currently inside DST and wanting to calculate an offset for a datetime 
        // that is outside DST, we need to move the offset backwards because the offset we
        // stored on the Time class during startup already includes the DST offset
        var dstDelta = this.currentlyInDST ? -(this.dstDeltaHours) : 0;
        if (this.adjustForDST) {
            if (date.getTimezoneOffset() == this.januaryDstOffset) {
                if (this.southernHemisphere) {
                    dstDelta += this.dstDeltaHours;
                }
            } else {
                if (!this.southernHemisphere) {
                    dstDelta += this.dstDeltaHours;
                }
            }
        }
        return this.UTCHoursDisplayOffset + (this.adjustForDST ? dstDelta : 0);
    },

    getUTCMinutesDisplayOffset: function(date) {
        var dstDelta = this.currentlyInDST ? -(this.dstDeltaMinutes) : 0;
        if (this.adjustForDST) {
            if (date.getTimezoneOffset() == this.januaryDstOffset) {
                if (this.southernHemisphere) {
                    dstDelta += this.dstDeltaMinutes;
                }
            } else {
                if (!this.southernHemisphere) {
                    dstDelta += this.dstDeltaMinutes;
                }
            }
        }
        return this.UTCMinutesDisplayOffset + (this.adjustForDST ? dstDelta : 0);
    }
    
    
});

// Work out whether we're currently inside Daylight Saving Time, and compute the offset to 
// apply on the transition.
isc.Time._performDstInit();

// set up the default timezone offset based on the browser locale here.
isc.Time.setDefaultDisplayTimezone(new Date().getTimezoneOffset());



