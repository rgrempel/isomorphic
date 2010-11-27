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

 


// Class will not work without the ListGrid
if (isc.ListGrid) {





//>	@class	DateItem
//
// Item for manipulating Dates.
// <p>
// Can be rendered as a text field, or as 3 selects for day, month, year.  Includes optional
// pop-up picker.
//
// @visibility external
// @example dateItem
//<
isc.defineClass("DateItem", "ContainerItem");

isc.DateItem.addClassProperties({
	//>	@classAttr	DateItem.mapCache		(object : {} : IRW)
	//		Cache for the map of day, month and year values 
	//			-- so we don't have to calculate the values over and over.
	//		Items are keyed in the map by "<code>day|month|year</code>.<code>start</code>.<code>end</code>".
	//<
	mapCache:{},	
 
	//>	@type	DateItemSelectorFormat
    // Order of pickers and which pickers are present when using a DateItem with
    // +link{dateItem.useTextField} false.
	DAY_MONTH_YEAR:"DMY",		//	@value	isc.DateItem.DAY_MONTH_YEAR		Output fields in day, month, year order.
	MONTH_DAY_YEAR:"MDY",		//	@value	isc.DateItem.MONTH_DAY_YEAR		Output fields in month, day, year order.
	YEAR_MONTH_DAY:"YMD",		//	@value	isc.DateItem.YEAR_MONTH_DAY		Output fields in year, month, day order.

	DAY_MONTH:"DM",		//	@value	isc.DateItem.DAY_MONTH		Output only day, month fields.
    MONTH_DAY:"MD",		//	@value	isc.DateItem.MONTH_DAY		Output only month, day fields.
	YEAR_MONTH:"YM",	//	@value	isc.DateItem.YEAR_MONTH		Output only year, month fields.
    MONTH_YEAR:"MY",	//	@value	isc.DateItem.YEAR_MONTH		Output only month, year fields.
    // @visibility external
	//<

    DEFAULT_START_DATE:new Date(1995, 0, 1),
    DEFAULT_END_DATE:new Date(2015, 11, 31),
    DEFAULT_CENTURY_THRESHOLD:25,
    
	chooserWidth:150,			//	@classAttr	isc.DateItem.chooserWidth	(number)	Width of the date chooser -- used to choose a date graphically.
	chooserHeight:171			//	@classAttr	isc.DateItem.chooserHeight	(number)	Height of the date chooser -- used to choose a date graphically.

});

isc.DateItem.addProperties({
        
    //>	@attr dateItem.textField (AutoChild : null : R)
    // Text field hold the entire date in "type in" format, if 'useTextField' is true
    // for an item.
    // 
    // @group dateItemAppearance
    // @visibility external
    //<	
    
    // Its documented as an autoChild so Defaults / Properties are implied but
    // explicitly expose the 'properties' block as this is good to have clearly visible
    // for customization of items.
    //> @attr dateItem.textFieldProperties (TextItem properties : null : IRA)
    // Custom properties to apply to this dateItem's generated +link{dateItem.textField}.
    // Only applies if +link{dateItem.useTextField} is true.
    // @group dateItemAppearance
    // @visibility external
    //<

    textFieldDefaults:    {name:"dateTextField",   type:"text",    changeOnBlur:true,
                    
                        // on keypress run standard 'change' behavior to store the value
                        // as this._value - also mark as "dirty"
                        // This allows us to preserve partially typed entries across redraws
                        // while the item has focus.
                        // We clear the dirty flag when we actually update the DateItem's value
                        // on blur, or in setValue() if we're changing to a new value.
                        changeOnKeypress:true,
                        changed : function () {
                            this.isDirty = true;
                        },
                        
                        // Override the blur method to update the DateItem value
                        // Using blur rather than saveValue / change allows changeOnKeypress to
                        // be set to true without the dateItem clobbering the user's half-typed
                        // strings
                        blur : function () {
                            this.isDirty = false;
                            if (this.parentItem) this.parentItem.updateValue();
                        },
                        
                        shouldSaveValue:false,
                        // Determine our size based on our parents specified textBox size
                        getInnerWidth : function () {
                            if (this.parentItem) return this.parentItem.getTextBoxWidth();
                            return this.Super("getInnerWidth", arguments);
                        }
                   },
                   
    //>	@attr	DateItem.daySelector		(AutoChild : null : R)
	//	Select item to hold the day part of the date.
	// @group dateItemAppearance
	// @visibility external
	//<	
	
	//> @attr dateItem.daySelectorProperties (SelectItem properties : null : IRA)
    // Custom properties to apply to this dateItem's generated +link{dateItem.daySelector}.
    // @group dateItemAppearance
    // @visibility external
    //<
    
	daySelectorDefaults:	{name:"daySelector",		prompt:"Choose a day", type:"select", 	
                        valueMap:"this.parentItem.getDayOptions()", shouldSaveValue:false,
                        // Override saveValue to update the parent.
                        
                        saveValue:function () {
                            this.Super("saveValue", arguments);
                            this.parentItem.updateValue();
                        },
                        cssText:"padding-left:3px;",
                        width:45},

	
    //>	@attr	DateItem.monthSelector		(AutoChild : null : R)
	//	Select item to hold the month part of the date.
    // @group dateItemAppearance
	// @visibility external
	//<	
	
	//> @attr dateItem.monthSelectorProperties (SelectItem properties : null : IRA)
    // Custom properties to apply to this dateItem's generated +link{dateItem.monthSelector}.
    // @group dateItemAppearance
    // @visibility external
    //<
    
	monthSelectorDefaults:	{name:"monthSelector",	prompt:"Choose a month", type:"select", 	
                        valueMap:"this.parentItem.getMonthOptions()", shouldSaveValue:false,
                        saveValue:function () {
                            this.Super("saveValue", arguments);
                            this.parentItem.updateValue();
                        },
                        width:55},
	

	//>	@attr	DateItem.yearSelector		(AutoChild : null : R)
	//	Select item to hold the year part of the date.
    // @group dateItemAppearance
	// @visibility external
	//<	
	
	
	//> @attr dateItem.yearSelectorProperties (SelectItem properties : null : IRA)
    // Custom properties to apply to this dateItem's generated +link{dateItem.yearSelector}.
    // @group dateItemAppearance
    // @visibility external
    //<
    
	yearSelectorDefaults:	{name:"yearSelector",		prompt:"Choose a year", type:"select",	
                        valueMap:"this.parentItem.getYearOptions()", shouldSaveValue:false,
                        saveValue:function () {
                            this.Super("saveValue", arguments);
                            this.parentItem.updateValue();
                        },
                        cssText:"padding-left:3px;",
                        width:60},
                        
    // Default to 150 wide
    // This is an appropriate default if we're showing the text field 
    // If we're showing the selectors, this value will be forced to 200 during setItems
    width:150,

    cellPadding:0,

    //> @attr dateItem.useSharedPicker (boolean : true : [IR])
    // When set to true (the default), use a single shared date-picker across all widgets that
    // use one.  When false, create a new picker using the autoChild system.  See 
    // +link{dateItem.pickerDefaults, picker} and 
    // +link{dateItem.pickerProperties, pickerProperties} for details on setting up an unshared
    // picker.
    // @visibility external
    //<
    useSharedPicker: true,

    //> @attr dateItem.pickerConstructor (string : "DateChooser" : [IR])
    // SmartClient class for the +link{FormItem.picker} autoChild displayed to allow the user
    // to directly select dates.
    // @visibility external
    //<
    pickerConstructor: "DateChooser",

    //> @attr dateItem.pickerDefaults (DateChooser : see below : [IR])
    // Defaults for the +link{DateChooser} created by this form item.
    //<
    pickerDefaults: {
        width: isc.DateItem.chooserWidth,
        height: isc.DateItem.chooserHeight,
        border:"1px solid black;",
        // show a cancel button that closes the window
        showCancelButton: true,
        autoHide: true
    },

    //> @attr dateItem.pickerProperties (DateChooser : see below : [IR])
    // Properties for the +link{DateChooser} created by this form item.
    //<

    //>	@attr	dateItem.useTextField   (boolean    : null : IRW)
    //      Should we show the date in a text field, or as 3 select boxes?
    // @group basics
    // @visibility external
    // @example dateItem
    //<                                            
 
    //> @attr   dateItem.textAlign  (Alignment : isc.Canvas.RIGHT : IRW)
    // If +link{dateItem.useTextField} is <code>true</code> this property governs the alignment
    // of text within the text field.
    // @group appearance
    // @visibility external
    //<
    textAlign:isc.Canvas.RIGHT,
    
    //> @attr   dateItem.useMask   (boolean : null : IA)
    // If +link{dateItem.useTextField} is not <code>false</code> this property determines if
    // an input mask should be used. The format of the mask is determined by the 
    // +link{dateItem.inputFormat} or +link{dateItem.displayFormat} (in that order).
    // <p>NOTE: If neither +link{dateItem.inputFormat} nor +link{dateItem.displayFormat}
    // is set (default), the mask for input format MDY is used.
    // @group basics
    // @see dateItem.maskDateSeparator
    // @visibility external
    //<

    //> @attr   dateItem.maskDateSeparator   (string : "/" : IA)
    // If +link{dateItem.useTextField} and +link{dateItem.useMask} are both <code>true</code>
    // this value is the separator between date components.
    // @group basics
    // @visibility external
    //<
    maskDateSeparator: "/",

    //> @attr dateItem.enforceDate  (boolean : false : IRWA)
    // Can this field be set to a non-date value [other than null]?
    // <P>
    // When set to true, +link{formItem.setValue()} will return false without setting the item value
    // and log a warning if passed something other than a valid date value.
    // If the dateItem is showing a +link{dateItem.useTextField,free-form text entry field},
    // and a user enters a text value which cannot be parsed into a valid date, the item will
    // automatically redraw and display the +link{dateItem.invalidDateStringMessage} (though at this
    // point calling +link{formItem.getValue()} will return the string entered by the user).
    // <P>
    // When set to false, a user may enter value that is not a valid date (for example, "Not
    // applicable") and the value will not immediately be flagged as an error.  However note
    // that for the value to actually pass validation you would need to declare the field as
    // not of "date" type, for example:
    // <pre>
    //     {name:"startDate", type:"dateOrOther", editorType:"DateItem", useTextField:true },
    // </pre>
    // The type "dateOrOther" could be declared as a +link{SimpleType}, with validators that
    // will accept either a valid date or certain special Strings (like "Not Available").
    // <P>
    // Only applies to dateItems where +link{dateItem.useTextField} is true. Non-Date values
    // are never supported in items where useTextField is false.
    //
    // @visibility external
    //<
    // Note: this is very similar to setting validateOnChange, with the exception of actually
    // rejecting setValue() calls with an invalid date.
    enforceDate:false,
    
    //>	@attr	dateItem.invalidDateStringMessage   (string : "Invalid date" : IRW)
    //  Validation error message to display if the user enters an invalid date
    // @visibility external
    // @group i18nMessages
    //<                                            
    invalidDateStringMessage:"Invalid date",
    
    //>	@attr	dateItem.showPickerIcon (boolean : true : IRW)
    //      Should we show the pick button icon?
    // @visibility pickerIcon
    //<
    
    showPickerIcon:true,
    
    //>	@attr	dateItem.pickerIconWidth (number : 20: IRW)
    // Width for the date item's pickerIcon.
    // @visibility pickerIcon
    //<    
    pickerIconWidth:20,

    //>	@attr	dateItem.pickerIconHeight (number : 20 : IRW)
    // Height for the date item's pickerIcon.
    // @visibility pickerIcon
    //<    
    pickerIconHeight:20,
    
    //>	@attr	dateItem.pickerIconSrc (SCImgURL : "[SKIN]/DynamicForm/DatePicker_icon.gif" : IRW)
    // Src for the picker icon image
    // @visibility pickerIcon
    //<
    pickerIconSrc:"[SKIN]/DynamicForm/DatePicker_icon.gif", 
    
    // give the picker icon 3px of horizontal space by default
    pickerIconHSpace:3,
    
    //>@attr dateItem.pickerIconPrompt (string : "Show Date Chooser" : IR)
    // Prompt to show when the user hovers the mouse over the picker icon for this DateItem. May
    // be overridden for localization of your application.
    // @visibility external
    // @group i18nMessages
    //<
    pickerIconPrompt : "Show Date Chooser",
    
    //>	@attr	dateItem.pickerIconProperties (object : {...} : IRW)
    // Properties for the pickerIcon.
    // @visibility pickerIcon
    //<
    pickerIconProperties:{
    },

    
        
    //>	@attr	dateItem.startDate		(Date : 1/1/1995 : IRW)
	// Minimum date the selectors will allow the user to pick.
    // <P>
    // <b>NOTE:</b> by design, setting <code>startDate</code> and <code>endDate</code> will not
    // always prevent the user from picking invalid values.  In particular:
    // <ul>
    // <li> the set of available days will only be restricted if the start and end dates fall
    // within the same month
    // <li> the set of available months will only be restricted if the start and end dates fall
    // within the same year
    // </ul>
    // <P>
    // This is <b>by design</b> as it allows the user to set the day, month and year in
    // whatever order is convenient, rather than forcing them to pick in a specific order.
    // <P>
    // For actual enforcement of a date being in correct range before data is submitted, a
    // +link{Validator} of type "dateRange" should always be declared.
    //
	// @group appearance
    // @visibility external
	//<
    startDate:isc.DateItem.DEFAULT_START_DATE,    

    //>	@attr	dateItem.endDate		(Date : 12/31/2015 : IRW)
	// Maximum date the selectors will allow the user to pick.
    // <P>
    // See +link{dateItem.startDate} for details on how this restriction works.
    //
	// @group appearance
    // @visibility external
	//<
    endDate:isc.DateItem.DEFAULT_END_DATE,

    //>	@attr	dateItem.centuryThreshold		(number : 25 : IRW)
	// Only used if we're showing the date in a text field. When parsing a date, if the year
    // is specified with only 2 digits and is less than the centuryThreshold, then the year will
    // be assumed to be 20xx; otherwise it will be interpreted according to default browser
    // behaviour, which will consider it to be 19xx.
	//		@group	appearance
    // @visibility external
	//<
    centuryThreshold:isc.DateItem.DEFAULT_CENTURY_THRESHOLD
    
    //> @attr dateItem.dateFormatter (DateDisplayFormat : null : IA)
    // If <code>dateFormatter</code> is set at init time, it will be used instead of
    // +link{DateItem.displayFormat} to govern how dates are displayed in this item.
    // @visibility external
    //<
    
    //>	@attr	dateItem.displayFormat  (DateDisplayFormat : null : IRW)
    // If +link{dateItem.useTextField} is <code>true</code> this property can be used to 
    // customize the format in which dates are displayed.<br>
    // Should be set to a standard +link{type:DateDisplayFormat} or
    // a function which will return a formatted date string.
    // <P>
    // If unset, the standard shortDate format as set up via +link{Date.setShortDisplayFormat()}
    // will be used.
    // <P>
    // <B>NOTE: you may need to update the +link{DateItem.inputFormat, inputFormat} to ensure the
    // DateItem is able to parse user-entered date strings back into Dates</B>
    // @see dateItem.inputFormat
    // @visibility external
    //<
    //displayFormat:"toShortDate"
    
    //> @attr  dateItem.inputFormat  (DateInputFormat : null : IRW)
    // If +link{dateItem.useTextField} is <code>true</code> this property can be used to specify
    // the input format for date strings. 
    // If unset, the input format will be determined based on the specified
    // +link{DateItem.displayFormat} if possible (see +link{DateItem.getInputFormat()}), otherwise
    // picked up from the Date class (see +link{Date.setInputFormat()}).
    // <P>
    // Should be set to a standard +link{type:DateInputFormat} or
    // a function which will take a date string as a parameter and return a Javascript Date object.
    // 
    // @see dateItem.displayFormat
    // @visibility external
    //<
    //inputFormat:null,

    //>	@attr	dateItem.selectorFormat		(DateItemSelectorFormat : null : IRW)
    // If showing date selectors rather than the date text field (so when 
    // <code>this.useTextField</code> is false), this property allows customization of the 
    // order of the day, month and year selector fields.  If unset these fields will match the
    // specified inputFormat for this item.
    // <P>
    // Note: selectors may be ommitted entirely by setting selectorFormat to (for example) 
    // <code>"MD"</code>. In this case the value for the omitted selector will match the
    // +link{defaultValue} specified for the item.  For example, if the selector format is "MD"
    // (month and day only), the year comes from the Date specified as the defaultValue.
    //
    // @visibility external
    //<
    
	//selectorFormat:null

});

isc.DateItem.addMethods({
    
    init : function () {
        // Set the default value of useTextField if not explicitly defined
        if (this.useTextField == null) this.useTextField = this.useMask || false;

        // perform a one-time conversion from dateFormatter to display format
        if (this.dateFormatter != null) {
            this.logInfo("Configuration block for this item has an explicitly specified " +
                "'dateFormatter' value:" + this.dateFormatter + ". This will be used instead of " +
                "the specified 'displayFormat' attribute for this item.");
            this.displayFormat = this.dateFormatter;
        }
        return this.Super("init", arguments);
    },

    // if selectorFormt is unset, back off to standard inputFormat.
    getSelectorFormat : function () {
        if (this.selectorFormat) { 
            return this.selectorFormat;
        } else if (this.inputFormat && isc.isA.String(this.inputFormat)) {
            return this.inputFormat;
        } else {
            var inputFormat = Date.getInputFormat();
            if (isc.isA.String(inputFormat)) return inputFormat;
            // Asssume US date format if we can't deduce the desired format from the date input
            // format
            this.logInfo("DateItem selectorFormat unspecified - assuming US format");
            return "MDY"
        }
    },

    getInputFormatMask : function (inputFormat) {
        
        var separator = this.maskDateSeparator || this._getDefaultDateSeparator();
        
        var mask;
        // Could use indexOf etc but quicker just to look at the standard set of options
        if (inputFormat == "YMD") {
            mask = [this._yearMask,separator,this._monthMask,separator,this._dayMask];
        } else if (inputFormat == "DMY") {
            mask = [this._dayMask,separator,this._monthMask,separator,this._yearMask];
        } else {
            // assume MDY as last valid format
            mask = [this._monthMask,separator,this._dayMask,separator,this._yearMask];
        }
        
        // Support DateTimeItem with additional mask
        if (isc.isA.DateTimeItem(this)) {
            mask.addList([" ",this._timeMask]);
        }
        return mask.join("");

    },
    _monthMask:"[01][0-9]",
    _dayMask:"[0-3]#",
    _yearMask:"####",
    _timeMask: "[0-2][0-9]:[0-6][0-9]",

    _maskDisplayFormats:{
        "MDY": "toUSShortDate",
        "DMY": "toEuropeanShortDate",
        "YMD": "toJapanShortDate"
    },

    //>	@method	dateItem.setItems()	(A)
    //
    // 	Override the setItems() routine to set the order of the fields according to this.dateFormat
    //<
    _getDefaultDateSeparator:function () {
        return Date.getDefaultDateSeparator();
    },
    _getDefaultDateSeparatorRegex : function () {
        var sep = this._getDefaultDateSeparator();
        return new RegExp(sep, "/g");
    },
    setItems : function (itemList) {
    
        var DI = isc.DateItem,
            format = this.getSelectorFormat()
        ;
        
        if (itemList != null && itemList.length != 0) {
            this.logWarn("setItems() called for dateItem with itemList:" + itemList + 
                            " - ignoring, and making use of default date fields");
        }

        // create a new itemList
        itemList = this.items = [];      

        if (this.useTextField) {
            // Setup properties that are being merged from the date item into the text field
            var mergeProperties = {
                textAlign: this.textAlign,
                emptyDisplayValue: this.emptyDisplayValue
            };
            if (this.showHintInField) {
                mergeProperties.showHintInField = this.showHintInField;
                mergeProperties.hint = this.hint;
                this.hint = null;
            }

            var maskProperties = {};
            if (this.useMask) {
                var inputFormat = this.getInputFormat();
                // Default to US date format
                if (!inputFormat) inputFormat = "MDY";
                
                var mask = this.getInputFormatMask(inputFormat);
                
                maskProperties.mask = mask;
                maskProperties.maskSaveLiterals = true;
                maskProperties.maskOverwriteMode = true;

                // Display format must match input so we force it here
                if (this.inputFormat) {
                    this.displayFormat = this._maskDisplayFormats[inputFormat];
                }
            }
            
            var textField = isc.addProperties(mergeProperties,
                                              this.textFieldDefaults,
                                              DI.TEXT_FIELD,
                                              this.textFieldProperties,
                                              maskProperties);
            // Ensure noone overrode the name of the dtf!
            textField.name = "dateTextField";
            // If we have a specified height, expand the text box to fill the available space
            
            if (this.height && (!this.textFieldProperties || !this.textFieldProperties.height)) 
            {
                textField.height = this.getTextBoxHeight();
            }

            itemList.add(textField);
    
            //>EditMode for dynamically changing useTextField
            
            var undef;
            this.daySelector = this.yearSelector = this.monthSelector = undef;
            //<EditMode
        
        } else {
            
            
    		// iterate through the characters of the format
    		for (var i = 0; i < format.length; i++) {
    			var field = format.charAt(i);
    			// assigning the selector for that format to the itemList
                var dayField, monthField, yearField;
                if (field == "D") {
                    var dayField;
                    if (this.daySelectorProperties != null) {
                        dayField = isc.addProperties({}, this.daySelectorDefaults, DI.DAY_SELECTOR, this.daySelectorProperties);
                    } else {
                        dayField = isc.addProperties({}, this.daySelectorDefaults, DI.DAY_SELECTOR);
                    }
                    dayField.name = "daySelector";
                    itemList.add(dayField);
                } else if (field == "M") {
                    var monthField;
                    if (this.monthSelectorProperties != null) {
                        monthField = isc.addProperties({}, this.monthSelectorDefaults, DI.MONTH_SELECTOR, this.monthSelectorProperties);
                    } else {
                        monthField = isc.addProperties({}, this.monthSelectorDefaults, DI.MONTH_SELECTOR);
                    }     
                    monthField.name = "monthSelector";

                    itemList.add(monthField);
                } else if (field == "Y") {
                    var yearField;
                    if (this.yearSelectorProperties != null) {
                        yearField = isc.addProperties({}, this.yearSelectorDefaults, DI.YEAR_SELECTOR, this.yearSelectorProperties);
                    } else {
                        yearField = isc.addProperties({}, this.yearSelectorDefaults, DI.YEAR_SELECTOR);
                    }
                    yearField.name = "yearSelector";

                    itemList.add(yearField);
                }
    		}
        }
        
		// call the superclass routine to properly set the items
		this.Super("setItems", [itemList]);
		
		
		if (this.useTextField) {
		    this.textField = this.dateTextField;
		}
	},

    // override getInnerWidth().
    // If we're showing selectors, explicitly fit to them (ignore any specified size)
    
    getInnerWidth : function () {
        
        if (this.useTextField) {
            return this.Super("getInnerWidth", arguments);
        }
        
        var size = 0, 
            selectorCount = 0;
        if (this.daySelector) {
            selectorCount +=1;
            size += this.daySelector.width;
        }
        if (this.monthSelector) {
            selectorCount += 1;
            size += this.monthSelector.width;
        }
        if (this.yearSelector) {
            selectorCount += 1;
            size += this.yearSelector.width;
        }
        if (this.showPickerIcon) size += this.getPickerIconWidth();
        
        if (selectorCount > 0) size += (selectorCount-1) * this.selectorPadding;
        
        return size;
    },
    selectorPadding:2,

    // Override isEditable() to indicate that the user can edit this items value directly
    isEditable : function () {
        return true;
    },

	//>	@method	dateItem.setValue()	(A)
	//  Override setValue to set the values for the sub-items of the date.
	//<
	setValue : function (value) {        
        this._setValueCalled = true;    
        
        // may still be null if we're working with a text field
        var setToDefault = false;
        if (value == null) {
            value = this.getDefaultValue();    
            setToDefault = true;
        }

        var setToExisting = (isc.isA.Date(value) && isc.isA.Date(this._value)
                                    ? (Date.compareLogicalDates(value,this._value) == 0) 
                                    : value == this._value);
        
        var date, invalidDate;
        // allow null values if useTextField is true and field is blank
        // Note - For consistency it would seem like 'allowEmptyValue' should be supported in
        // some way on DateItems, but we currently don't suport setting null dates on date items
        // showing selectors - 
        // not clear how this mechanism would work 
        // - once a date was null, presumably all 3 selectors would be showing "". 
        // - when the user then chose a value from one selector, would we default the other 2 to
        //   some default?
        // - similarly if the 3 selectors showed a valid date, how would the user set it to an
        //   empty date (one at a time?)
        if (isc.is.emptyString(value)) value = null;
        if (value == null) {
            invalidDate = true;
            date = null;
        } else {
            
            date = this.parseDate(value);
            // parseDate returns null if passed something it doesn't understand
            if (date == null) {
                invalidDate = true;
                date = value;
            }
        }
        if (invalidDate) {
        	
            // If setValue() is called with an invalid date:
            // - if we're not showing a text field, essentially no-op, and maintain the current
            //   value - we have no way of displaying a non-date value
            // - if we're showing a text field
            //  - if this.enforceDate is false, just allow the non-date
            //  - if this.enforceDate is true, 2 possibilities:
            //      - the non-date was entered by a user, and setValue() has subsequently been
            //        called due to a redraw - check this._inavlidDate flag for this case, and
            //        silently allow the non-date
            //      - this method was called direclty with a new non-date value. In this case 
            //        just log a warning and refuse to set the value.
            var dropDate;
            if (!this.useTextField) {
                dropDate = true;
            // explicitly support 'clearValue()' on a date field with a textItem even if
            // enforceDate is set
            } else if (this.enforceDate && value != null) {
                var textField = this.dateTextField;
                dropDate = !this._invalidDate || !textField || (textField.getValue() != value);
            }
                
            if (dropDate) {
                //>DEBUG
                this.logInfo("dateItem.setValue(): invalid date passed: '" + value + 
                            "'.  Ignoring this value. Non date values are only supported " +
                            " for dateItems where useTextField is true and enforceDate is false.");
                //<DEBUG
                return false;
                
            }
        }
        
        // If enforceDate was true, and we're changing from an invalidDate to a valid date,
        // clear errors.
        if (!invalidDate && this._invalidDate) {
            delete this._invalidDate;
            this.clearErrors();
            this.redraw();
        }
         
        // hang onto the value passed in
        this.saveValue(date, setToDefault);
        
        // Avoid attempting to parse / correct the dates in response to these setValues calls
        this._suppressUpdates = true;
        if (this.useTextField) {
            if (this.dateTextField) {
                // If the dateTextField is dirty this implies it has focus and the user
                // has entered some characters
                // Unless we're actually setting to a *new* date value, don't wipe out what
                // the user has entered.
                // This is required to ensure that if a redraw occurs 
                // (which calls setItemValues(), then falls through to setValue()) 
                // we don't lose a partially typed entry
                // If it's truly a new value, we can change the typed entry of course.
                if (setToExisting && this.dateTextField.isDirty) {
                    this.dateTextField.setValue(this.dateTextField._value);                    
                } else {
                    // re-format the date-string entered by the user if necessary
                    var textValue = invalidDate ? date : this.formatDate(date);
                    this.dateTextField.setValue(textValue);
                    delete this.dateTextField.isDirty;
                }
            }

        }
		// set the day, month and year selectors
		if (this.daySelector) 		this.daySelector.setValue(date.getDate());
		if (this.monthSelector) 	this.monthSelector.setValue(date.getMonth());
		if (this.yearSelector)		this.yearSelector.setValue(date.getFullYear());
        delete this._suppressUpdates;

        return true;
	},
    
    
    // if we're doing a direct submit of the DateItem value, convert it to the 
    // dbDate format so it can be parsed on the server.
    _setHiddenDataElementValue : function (value) {
        var hde = this._getHiddenDataElement();
        if (hde != null) {
            if (isc.isA.Date(value)) hde.value = value.toDBDate();
            
            else hde.value = value;
        }
    },
    
    // Override getCellHeight() to ensure the containing form leaves enough space for this item.
    
    getCellHeight : function () {
        var cellHeight = this.Super("getCellHeight", arguments);
        if (isc.Browser.isIE && this.useTextField && isc.isA.Number(cellHeight)) cellHeight += 2;
        return cellHeight;
    },    
    
    
    elementChanged : function () {
        return;
    },
    
    // Override updateValue to verify that the contents of the element(s) make a valid date.
    updateValue : function () {
        // _suppressUpdates flag set when we're in the process of setting our sub items' values
        // to represent a known, valid date.
        
        if (this._suppressUpdates) return;

        // We're likely to manipulate the values of the form items as this method runs - avoid
        // re-running updateValue in response to 'saveValue()' on the sub items.
        this._suppressUpdates = true;

        var date;
        if (this.useTextField) {
        
            // Note: this method is called from "saveValue()" on the sub-items (after saving out 
            // their values) so typically the sub item values will be up to date.
            // However this method may also be called externally while the text item is pending
            // an update (from blur [or keypress]).
            // Call updateValue() to ensure the text field value matches the current element
            // value for that field.
            this.dateTextField.updateValue();
            var value = this.dateTextField.getValue(),
                invalidDate;
            
            if (value == isc.emptyString || value == null) date = null;
            else {
                // This will return a null value if the date string is invalid.
                // If enforceDate is false we allow a dateItem to be set to a non-date value
                // though typically validation would fail for the field if it's data-type was
                // date
                // If enforce date is true, accept this value, but show a validation error
                
                date = this.parseDate(value);
                if (date == null) {
                    invalidDate = true;
                    
                    // we're going to store the text value even though it's not a valid date
                    date = value;
                } else {
                       
                    // If the date was valid, the format may have slightly changed
                    // (01/01/01 -> 1/1/2001, for example) - if necessary update the text
                    // field here.
                    var dateString = this.formatDate(date);
                    if (value != dateString) {
                        // we've set _suppressUpdates, so we won't end up in an infinite loop 
                        // from this call
                        this.dateTextField.setValue(dateString);
                    }
                }
            }
            
            // If value hasn't actually changed, stop here
            if (value == this.getValue()) return;

            // If enforceDate is true and we're showing an invalid date error, clear it unless
            // we still have an invalid date
            if (this.enforceDate) {
                if (this._invalidDate && !invalidDate) {
                    delete this._invalidDate;
                    this.clearErrors();
                    this.redraw();
                } else if (invalidDate) {
                    this.logWarn("Invalid date string entered in date text field :"+ date);
                    if (!this._invalidDate) {
                        this._invalidDate = true;
                        this.setError(this.invalidDateStringMessage);
                        
                        // We need to redraw to show the error. We don't want the user's entry
                        // to vanish, so we store it under a temp var. which the text field will
                        // display
                        
                        this.redraw();
                    }
                }
            }
            
            
        } else {
        
            // If we're not showing a text field, start with the last remembered date, and update
            // that based on the values in the selector items
            date = (this._value || this.getDefaultValue());
            // copy the date object to allow us to reset to _value if change handler fails
            date = date.duplicate();

            var day, month, year;
            
            // Store the specified day first, and apply it after setting month/year
            //
            // Note: Before setting month / year, we set the date to 1 so that setting the month
            // will not lead to an invalid date like Feb 30.
            // This avoids the case where 
            //  - the selectors are set to Feb 30, and the previous date was Jan 30.
            //  - the date object has 'setMonth()' called, setting the month is set to "Feb", 
            //    causing the date to be automatically updated to March 2
            //  - the day is set to 30 (from the date selector), leaving us with a date of
            //    March 30.
            //  At this point the logic to roll the days back to the end of the month would fail
            day = (this.daySelector ? this.daySelector.getValue() : date.getDate());
            date.setDate(1);
            
            if (this.yearSelector) {
                year = this.yearSelector.getValue()
                date.setYear(year);
            }
            if (this.monthSelector) {
                month = this.monthSelector.getValue();
                
                
                date.setMonth(month);
            }
            
            // Now set date to the appropriate "day" value
            // this is the value of the daySelector, or if we're not showing a day selector
            // the previously selected day value
            date.setDate(day);
            
            // If set to an invalid date, such as Feb 30, or Feb 29th on a non-leap year, the month 
            // will have been rolled forward (making it easy to catch such errors)
            // make sure the date's month is the same as that specified in the list
            // if it's not, we should roll back the day selector, and update the date to the 
            // appropriate day / month
            if (month != date.getMonth()) {
                // This rolls the date back to the end of the previous month
                day = day - date.getDate();
                if (this.daySelector) this.daySelector.setValue(day);
                date.setMonth(month);
                date.setDate(day);
            }
        }
        delete this._suppressUpdates;
        
        // bail if the value hasn't changed
        if (this.compareValues(date, this._value) == true) return false;
        
        // now fire the default handlers:
        if (this.handleChange(date, this._value) == false) return;

        // In case the change handler modified the date
        date = this._changeValue;

        // save the value
        this.saveValue(date);    

        // fire the 'changed' handler
        this.handleChanged(date);
                    
    },
    	
	//>	@method	dateItem.resetValue()
	//      Overridden to get the value from the old value stored in the form, rather than
    //      replacing this item's value with the date object
	//		@group	elements
	//<
	resetValue : function () {
		var oldValue = this.form._oldValues[this.getFieldName()];
        if (isc.isA.Date(oldValue) && isc.isA.Date(this._value)) 
            oldValue = this._value.setTime(oldValue.getTime());
		this.setValue(oldValue);
	},    


    // getItemValue() - method to get the initial value of items when writing out this 
    // containerItem's innerHTML.
    // For the Date Item we give our sub items (selects / text item) the correct value when they
    // are initially set up.
    getItemValue : function (item, values) {
        
        if (isc.isAn.emptyObject(values)) values = null;
        
        var dateVal = isc.isA.Date(values),
            currDateVal = isc.isA.Date(this._value);
        
        if (values == this._value || 
            (dateVal && currDateVal && (Date.compareDates(values, this._value) == 0)))
        {
            return item.getValue();
        }
        
        // If we're rendering out inactiveItemHTML we may be showing a value that doesn't 
        // match the value stored by the form item. An example of this is showing
        // inactive editor HTML in grids where alwaysShowEditors is true.
        if (item == this.dateTextField) return dateVal ? this.formatDate(values) : values;
        else if (item == this.daySelector) return dateVal ? values.getDate() : null;
        else if (item == this.monthSelector) return dateVal ? values.getMonth() : null;
        else if (item == this.yearSelector) return dateVal ? values.getFullYear() : null;
        
    },
    
    // Override getDisplayValue() to return the short-date formatted value.
    
    getDisplayValue : function () {
        var dataValue = this.getValue();
        if (!isc.isA.Date(dataValue)) return this.Super("getDisplayValue", arguments);
        if (this.useTextField || !this.items) {
            return this.formatDate(dataValue);
        } else {
            // If we're undrawn the sub items won't yet be populated! Do this now.
            if (!this.isDrawn()) {
                
                if (this.yearSelector)		this.yearSelector.setValue(dataValue.getFullYear());
                if (this.monthSelector) 	this.monthSelector.setValue(dataValue.getMonth());
                if (this.daySelector) 		this.daySelector.setValue(dataValue.getDate());
            }
            // This will give us a the contents of each selector separated by a space,
            // for example "Jun 25 2009" for MDY dates
            return this.items.map("getDisplayValue").join(" ");
        }
    },
    
	//>	@method	dateItem.getDefaultValue()	(A)
	//  Override getDefaultValue to guarantee that it returns a date if 
    //  <code>item.enforceDate</code> is true. If no default date is supplied, defaults to the
    //  current date.
	//<
    // Note: As currently written this method will not consistently return the same date instance
    // unless this.defaultValue is explicitly specifed as a date object. Instead we create a
    // new date instance each time the method is called and return that. 
    // This can be a gotcha - for exmaple when checking for changes to a date item we have to 
    // use compareDates() rather than ==.
	getDefaultValue : function () {
        var value = this.Super("getDefaultValue");
        if (!isc.isA.Date(value)) {
            var dateValue = this.parseDate(value);
            if (isc.isA.Date(dateValue)) value = dateValue;
            else if (!this.useTextField || this.enforceDate) {
                var replaceDefaultValue;
                if (value != null) {
                    this.logWarn("Default DateItem value provided as:" + value + 
                             ". This is not recognized as a valid date - defaulting to a new date");
                    // if this came from a static default value, replace it so we don't see
                    // multiple warnings
                    replaceDefaultValue = this.defaultValue == value;
                }
                
                // if we still don't have a valid date, default to a new Date().
                // NOTE: can't just set the defaultValue to "new Date()" as this object would then
                // be shared amongst all date instances
                // Exception: We DO support null value for dateItems where useTextField is true
                // even if enforceDate is set.
                if (!this.useTextField) value = this._getEmptyDate();
                
                if (replaceDefaultValue) this.defaultValue = value;
            }
        }
        return value;
	},
    
    _getEmptyDate : function () {
        var value = new Date();
        // zero out the time by default
        value.setHours(0);
        value.setMinutes(0);
        value.setSeconds(0);
        value.setMilliseconds(0);
        return value;
    },
    
    //>	@method	dateItem.getStartDate()	(A)
	//		use this method, rather than referring to this.startDate, to guarantee that it
    //      returns a date
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
    
    //>	@method	dateItem.getEndDate()	(A)
	//		use this method, rather than referring to this.endDate, to guarantee that it
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
    
    
    _canFocus : function () {
        if (this.canFocus != null) return this.canFocus;
        return true;
    },
    
    // Override focusInItem to focus in the appropriate sub-item
    focusInItem : function () {
        if (!this.isVisible()) return;

        if (this.useTextField) {
            if (this.dateTextField) this.dateTextField.focusInItem();
        } else {
			var format = this.getSelectorFormat(),

                // Format will be "DMY" / "YMD" / "MDY" / etc.
                // (Parse the string rather than comparing with the DateItem.DAY_MONTH_YEAR class 
                // constants - it's slower but will support the user specifying just "MY" or something)
                firstSelector = format.charAt(0)
            ;
            
            if (firstSelector == "D" && this.daySelector) this.daySelector.focusInItem();
            if (firstSelector == "M" && this.monthSelector) this.monthSelector.focusInItem();
            if (firstSelector == "Y" && this.yearSelector) this.yearSelector.focusInItem();
        }
        // If it couldn't find the appropriate sub-item, this method is a no-op        
    },
    
    // override get/setSelectionRange - if we're showing a text field, call through to the
    // methods on that sub-item
    
    //> @method dateItem.setSelectionRange()
    // If +link{dateItem.useTextField} is true, falls through to standard
    // +link{formItem.setSelectionRange()} implementation on this items freeform text entry field.
    // Otherwise has no effect.
    // @param start (integer) character index for start of new selection
    // @param end (integer) character index for end of new selection
    // @visibility external
    //<
    setSelectionRange : function (start,end) {
        if (this.dateTextField) return this.dateTextField.setSelectionRange(start,end);
    },

	//> @method dateItem.getSelectionRange()
    // If +link{dateItem.useTextField} is true, falls through to standard
    // +link{formItem.getSelectionRange()} implementation on this items freeform text entry field.
    // Otherwise has no effect.
    // @return (array) 2 element array indicating start/end character index of current selection
    //  within our text entry field. Returns null if this item is undrawn or doesn't have focus.
    // @visibility external
    //<
    getSelectionRange : function () {
        if (this.dateTextField) return this.dateTextField.getSelectionRange();
    },
    
    //> @method dateItem.selectValue()
    // If +link{dateItem.useTextField} is true, falls through to standard
    // +link{formItem.selectValue()} implementation on this items freeform text entry field.
    // Otherwise has no effect.
    // @visibility external
    //<
    selectValue : function () {
        if (this.dateTextField) return this.dateTextField.selectValue();
    },
    
    //> @method dateItem.deselectValue()
    // If +link{dateItem.useTextField} is true, falls through to standard
    // +link{formItem.deselectValue()} implementation on this items freeform text entry field.
    // Otherwise has no effect.
    // @param [start] (boolean) If this parameter is passed, new cursor insertion position will be
    //   moved to the start, rather than the end of this item's value.
    // @visibility external
    //<
    deselectValue : function (start) {
        if (this.dateTextField) return this.dateTextField.deselectValue()
    },
    
    //>	@method	dateItem.getDayOptions()	(A)
	//		Return the list of options for the day selector.
	//
	//		@return	(array)	Array of day numbers from 1-31;
	//<
	getDayOptions : function () {

        var startDate = this.getStartDate(),
            endDate = this.getEndDate();

        // If the date range spans more than one month, return [1 - 31]
        // Only time we want to have this return a range smaller than 1-31 is if we have a range
        // within a single month (Feb 2 - 20th, 1945), for example.  Otherwise we force the
        // user to pick fields in a specific order.
        var startDay = 1, 
            endDay = 31;
        
        // If it's within a single month in a year, return appropriate subset of days    
        if (startDate.getYear() == endDate.getYear() &&
            startDate.getMonth() == endDate.getMonth()) 
        {
            startDay = startDate.getDate()
            endDay = endDate.getDate()
        }
            
		// if the list of options is already in the mapCache, just pull it from there
		var key = "day." + startDay + "." + endDay;
		if (isc.DateItem.mapCache[key]) return isc.DateItem.mapCache[key];

		// otherwise build the options and store it in the dayMapCache
		var options = isc.DateItem.mapCache[key] = [];
		for (var i = startDay; i <= endDay; i++) options[i - startDay] = i;

		return options;	
	},
	
	//>	@method	dateItem.getMonthOptions()	(A)
	//		Return the list of options for the month selector.
	//
	//		@return	(array)	Object of month number (0-based!) to short month name ["Jan","Feb",...]
	//<
	getMonthOptions : function () {

        var startDate = this.getStartDate(),
            endDate = this.getEndDate();
            
        // If the date range spans more than one year, return ["Jan" - "December"]
        // Only time we want to have this return an incomplete range is if we have a range
        // within a single year (Feb - April, 1945), for example.  Otherwise we force the user
        // to pick fields in a specific order.
        var startMonth = 0, 
            endMonth = 11;

        // If it's within a single month in a year, return appropriate subset of days    
        if (startDate.getYear() == endDate.getYear()) {
            startMonth = startDate.getMonth()
            endMonth = endDate.getMonth()
        }
    
		// if the list of options is already in the mapCache, just pull it from there
		var key = "month." + startMonth + "." + endMonth;
		if (isc.DateItem.mapCache[key]) return isc.DateItem.mapCache[key];

		// otherwise build the options and store it in the dayMapCache
		var options = isc.DateItem.mapCache[key] = {};

		// get the list of names as an array
		var monthNames = Date.getShortMonthNames();
		// and convert it to an object
		for (; startMonth <= endMonth; startMonth++) {
			options[startMonth] = monthNames[startMonth];
		}

		return options;	
	},
	
	//>	@method	dateItem.getYearOptions()	(A)
	//		Return the list of options for the year selector.
	//
	//		@return	(array)	Array of day numbers from this.startYear - this.endYear;
	//<
	getYearOptions : function () {

        var startYear = this.getStartDate().getFullYear(),
            endYear = this.getEndDate().getFullYear();

		// if the list of options is already in the mapCache, just pull it from there
		var key = "year." + startYear + "." + endYear;
		if (isc.DateItem.mapCache[key]) return isc.DateItem.mapCache[key];

		// otherwise build the options and store it in the dayMapCache
		var options = isc.DateItem.mapCache[key] = [];
        for (var i = startYear; i <= endYear; i++) {
			options[i-startYear] = i;
		}
		return options;	
	},

    //> @attr dateItem.useCustomTimezone (boolean : false : IRA)
    // Should this dateItem display dates in the native browser local time or use the
    // custom timezone set up in +link{Time.setDefaultDisplayFormat()}.
    // <P>
    // Default behavior is to show dates in the native browser time. Overridden for
    // DateTimeItems where we will be editing fields of type datetime rather than date.
    //<
    
    useCustomTimezone:false,
	
	//>	@method	dateItem.parseDate()
	// Parse a date passed in as a string.
	//		@group	elements
	//
	//		@param	dateString (string)     date value as a string
    //      @param  inputFormat   (DateInputFormat) format for date strings to be parsed
	//
	//		@return	(date)		date value
	//<
	parseDate : function (dateString, inputFormat) {
        if (inputFormat == null) inputFormat = this.getInputFormat();

        var date = Date.parseInput(dateString, inputFormat, 
                                this.centuryThreshold, true, this.useCustomTimezone);
        return date;
	},
    
    // formatDate() - given a live date object, returns the formatted date string to display
    // Only applies if useTextField is true.
    formatDate : function (date) {
        return isc.isA.Date(date) ? 
                    date.toShortDate(this.displayFormat, this.useCustomTimezone) : date;
    },

    
    //>@method dateItem.getInputFormat() (A)
    // If +link{dateItem.useTextField} is <code>true</code> this method returns a
    // standard +link{type:DateInputFormat}, or parsing function, determining how values entered
    // by the user are to be converted to Javascript Date objects.
    // <P>
    // If an explicit +link{DateItem.inputFormat} has been specified it will be returned.
    // <P>
    // Otherwise, if an explicit +link{DateItem.displayFormat} has been specified as one of
    // <code>toUSShortDate</code>, <code>toEuropeanShortDate</code> or <code>toJapanShortDate</code>
    // this method will return the appropriate DateInputFormat to parse strings entered in the
    // specified displayFormat.
    // <P>
    // If no inputFormat can be derived, the method will return null, meaning the standard input
    // format for Date objects (specified via +link{Date.setInputFormat()}) will be used.
    // @return (DateInputFormat) expected format of date strings to parse
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
        this.updateValue();

        if (!this.picker) {
            if (this.useSharedPicker) this.picker = isc.DateChooser.getSharedDateChooser();
            else {
                this.picker = isc[this.pickerConstructor].create(
                    isc.addProperties({}, this.pickerDefaults, this.pickerProperties, 
                        {
                            border: "none",
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
            picker.callingForm = this.form;
            
            picker.locatorParent = this.form;
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
            chooserHeight = isc.DateItem.chooserHeight + 3;

        left += Math.round((this.getVisibleWidth() - (this.getPickerIconWidth() /2)) - 
                (chooserWidth/2));
        
        top += Math.round((this.getPickerIconHeight() / 2) - (chooserHeight/2));

        // NOTE: don't return chooserWidth/Height as part of the rect, which would cause the
        // picker to actually be resized to those dimensions, and they may match the natural
        // size at which the chooser draws given skinning properties.
        return [left, top];
    },
    

	//>	@method	dateItem.pickerDataChanged()
    //      Store the date passed in, and fire the change handler for this item.
    //      Called when the user selects a date from the date-chooser window.  
    //  @visibility internal
	//<
	pickerDataChanged : function (picker) {

        var date = picker.getData();
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();
            
        // The date-picker creates "logical dates" -- dates with time set to zero
        // in browser local time
        // Note that browser local time (offset from UTC) can vary by date due to
        // daylight savings time.
        //
        // If useCustomTimezone is set to true (as with dateTimeItems) ensure we apply
        // the standard UTCHoursOffset so the time displays as zero
        if (this.useCustomTimezone) {
            // Apply the timezone offset to effectively zero out the time, but
            // ensure that the target time > 0 so we don't change date!
            var hourOffset = isc.Time.getUTCHoursDisplayOffset(date),
                minuteOffset = isc.Time.getUTCMinutesDisplayOffset(date),
                utcHours = hourOffset > 0 ? 24-hourOffset : 0-hourOffset,
                utcMins = minuteOffset > 0 ? 60-minuteOffset : 0-minuteOffset;
            date.setUTCHours(utcHours)
            date.setUTCMinutes(utcMins);
        }
        
            
        // avoid firing 'updateValue' while setting the values of sub items
        this._suppressUpdates = true;

        if (this.useTextField) {
            var formatted = this.formatDate(date);
            this.dateTextField.setValue(formatted);
        } else {
            var date = this._value || this.getDefaultValue(),
                hiddenSelector;
            if (this.yearSelector) this.yearSelector.setValue(year);
            else {
                date.setFullYear(year);
                hiddenSelector = true;
            }
            if (this.monthSelector) this.monthSelector.setValue(month);
            else {
                date.setMonth(month-1);
                hiddenSelector = true;
            }
            if (this.daySelector) this.daySelector.setValue(day);
            else {
                date.setDate(day);
                hiddenSelector = true;
            }
            // if this._value was unset before this method fired, set it now
            // This will be duplicated as part of update value and the selector values overlayed
            if (hiddenSelector) {
                this._value = date;
            }
        }
        this._suppressUpdates = false;
        
        // Explicitly call 'updateValue' to save the new date (handles firing change
        // handlers, etc. too)
        this.updateValue();
        
        // Ensure we have focus
        
        if (!this.hasFocus) this.focusInItem();
    },

    setHint : function (hintText) {
        if (this.useTextField && this.showHintInField) {
            this.dateTextField.setHint(hintText);
        } else {
            this.Super("setHint", arguments); 
        }
    },

    // Override getPickerData() -- add support for providing a default picker date separate
    // from the default date for the item as a whole    
    getPickerData : function () {
        var date = this.getValue();
        if (date != null && isc.isA.Date(date)) return date;
        return this.getDefaultChooserDate();
    },
    
    //> @attr DateItem.defaultChooserDate (Date : null : IRW)
    // Default date to show in the date chooser. If this items value is currently unset,
    // this property may be specified to set a default date to highlight in the dateChooser 
    // for this item. If unset, the date chooser will highlight the current date by default.
    // Note that this has no effect if the item as a whole currently has a value - in that
    // case the date chooser will always highlight the current value for the item.
    // @visibility external
    //<
    //defaultChooserDate:null,
    
    //> @method DateItem.getDefaultChooserDate()
    // Returns the default date to display in the date chooser if this form items value is
    // currently unset.
    // <P>
    // Default implementation returns +link{dateItem.defaultChooserDate}
    // @return (Date) date to display, or null, indicating the current system date should be
    //   displayed.
    // @visibility external
    //<
    getDefaultChooserDate : function () {
        return this.defaultChooserDate;
    }

    //>EditMode dynamically changing useTextField
    , 
    propertyChanged : function (propertyName) {
        if (propertyName == "useTextField" ||
            propertyName == "useMask") this.setItems();
    }
    //<EditMode
});

}
