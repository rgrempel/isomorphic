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





//>	@class	DateTimeItem
//
// Subclass of DateItem for manipulating +link{type:FieldType,datetimes}.
//
// @visibility external
// @example dateItem
//<

isc.defineClass("DateTimeItem", "DateItem");


isc.DateTimeItem.addProperties({
    //>	@attr dateTimeItem.useTextField   (boolean : true : IRW)
    // DateTimeItems show datetime values in a freeform text entry area.
    // @group basics
    // @visibility external
    //<              
    useTextField:true,

    //>	@attr	dateTimeItem.displayFormat  (DateDisplayFormat : null : IRW)
    // This property can be used to customize the format in which datetimes are displayed.<br>
    // Should be set to a standard +link{type:DateDisplayFormat} or
    // a function which will return a formatted date time string.
    // <P>
    // If unset, the standard shortDateTime format as set up in 
    // +link{Date.setShortDatetimeDisplayFormat()} will be used.
    // <P>
    // <B>NOTE: you may need to update the +link{DateTimeItem.inputFormat, inputFormat}
    // to ensure the DateItem is able to parse user-entered date strings back into Dates</B>
    // @see dateTimeItem.inputFormat
    // @visibility external
    //<
    
    // Override formatDate to call toShortDateTime rather than toShortDate so we use
    // the 'toShortDateTime()' formatter
    formatDate : function (date) {
        if (!isc.isA.Date(date)) return date;
        return date.toShortDateTime(this.displayFormat, this.useCustomTimezone);
    },
    
    //> @attr  dateTimeItem.inputFormat  (DateInputFormat : null : IRW)
    // @include dateItem.inputFormat
    // @visibility external
    //<
    
    // useCustomTimezone - this property ensures we format the 
    // displayed dates in the custom timezone set up via Time.setStandardDisplayTimezone rather
    // than using the native browser locale as we do for DateItems
    useCustomTimezone:true
});


} // end of if (isc.ListGrid)
