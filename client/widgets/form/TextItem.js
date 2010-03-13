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

 





//>	@class	TextItem
//
// FormItem for managing a text field.
//
// @visibility external
// @example textItem
//<
isc.ClassFactory.defineClass("TextItem", "FormItem");

//	Add class-level properties
//		You can access these properties on the static class object.
//		e.g.,	Canvas.myStaticProperty

isc.TextItem.addClassProperties({

    //>	@type CharacterCasing
    // @visibility external
    // @group validation
    // @value isc.TextItem.DEFAULT No character translation
    DEFAULT:"default",
    // @value  isc.TextItem.UPPER  Map characters to uppercase
    UPPER:"upper",
    // @value  isc.TextItem.LOWER  Map characters to lowercase
    LOWER:"lower",
    //<

    // Filter definitions for mask characters
    _filterDefinitions: {
        '0': { charFilter: "[0-9+\\-]" },
        '#': { charFilter: "[0-9]" },
        '9': { charFilter: "[0-9 ]" },
        'L': { charFilter: "[A-Za-z]" },
        '?': { charFilter: "[A-Za-z ]" },
        'a': { charFilter: "[0-9A-Za-z]" },
        'A': { charFilter: "[0-9A-Za-z]" },
        'C': { charFilter: "." }
    }
});

isc.TextItem.addProperties({
    //>	@attr	textItem.width		(number : 150 : IRW)
	//			Default width for fields.
	//		@group	appearance
    // @visibility external
	//<
	width:150,		
    
    //>	@attr	textItem.height		(number : 19 : IRW)
	//			Default height for text items.
	//		@group	appearance
    // @visibility external
	//<                                       
    
    height:isc.Browser.isSafari ? 22 : 19,

    //>	@attr	textItem.textBoxStyle     (FormItemBaseStyle : "textItem" : IRW)
	//  Base CSS class name for this item's input element.
    // NOTE: See the +link{group:CompoundFormItem_skinning} discussion for special skinning considerations.    
	// @group	appearance
    // @visibility external
	//<
	textBoxStyle:"textItem",		

    //>	@attr	textItem.length		(number : null : IRW)
	//			if set, maximum number of characters for this field
	//		@group	validation
    // @visibility external
	//<
	length:null,

    // whether its possible for this type of FormItem to do autoCompletion
    canAutoComplete:true,

	//>	@attr	textItem._elementType			(string : "TEXT" : IRW)
	//			type of field (eg: "PASSWORD", "UPLOAD", etc)
	//<		
	_elementType:"TEXT",

    //> @attr   textItem._hasDataElement    (boolean : true : IRW)
    //      Text items have a data element.
    // @group formValues
    // @visibility   internal
    // @see     method:FormItem.hasDataElement
    // @see     method:FormItem.getDataElement
    //<
    _hasDataElement:true,
    
    // Set flag to indicate that our data element is used as the textBox for this item.
    // This flag means updateState will apply the result of this.getTextBoxStyle() to this item's
    // data element - appropriate for native text boxes, text areas and selects.
    _dataElementIsTextBox:true,

    //> @attr   textItem.emptyStringValue   (any : null : IRW)
    //      Should the empty string be mapped to null, or stored as an empty string.
    //      Updated on 'setValue(null)' or 'setValue("")'
    // @group formValues
    // @visibility   internal
    //<    
    
    _emptyStringValue:null,
    
    // Override redrawOnShowFormIcon - we can handle dynamically updating the item's HTML to
    // show / hide text item icons
    redrawOnShowIcon:false,
    
    // _nativeEventHandlers is a place to specify native event handlers to be applied to the
    // form item element once it has been written into the DOM (without having to override 
    // '_applyHandlersToElement()'
    _nativeEventHandlers : {
        
        
        onmousedown : (
            isc.Browser.isIE ? function () {
                var element = this,
                    itemInfo = isc.DynamicForm._getItemInfoFromElement(element),
                    item = itemInfo.item;
                if (item) item._setupFocusCheck();
    
            } : null
        )
    }
    
    //>@attr TextItem.browserSpellCheck (boolean : null : IRWA)
    // @include FormItem.browserSpellCheck
    // @visibility internal
    //<
    
    //>@attr TextItem.selectOnFocus (boolean : null : IRW)
    // @include FormItem.selectOnFocus
    // @visibility external
    //<
    
    //>@method TextItem.getSelectionRange()
    // @include FormItem.getSelectionRange()
    // @visibility external
    //<
    
    //>@method TextItem.setSelectionRange()
    // @include FormItem.setSelectionRange()
    // @visibility external
    //<
    
    //>@method TextItem.selectValue()
    // @include FormItem.selectValue()
    // @visibility external
    //<
    
    //>@method TextItem.deselectValue()
    // @include FormItem.deselectValue()
    // @visibility external
    //<
    
    //>@attr TextItem.readOnly  (boolean : null : IRWA)
    // Setter for the standard HTML readonly property of the input element.
    // If set to true, text will be non editable (though it can still be selected and copied etc)
    // @visibility internal
    //<

    //>@attr TextItem.showHintInField (boolean : null : IRWA)
    // If showing hint for this form item, should it be shown within the field?
    // <P>CSS style for the hint is +link{textItem.textBoxStyle} with the suffix
    // "Hint" appended to it. 
    // @group appearance
    // @see FormItem.hint
    // @visibility external
    //<

                                        
});
isc.TextItem.addMethods({
    // _handlePaste: Handler for the native onpaste event
    // this fires in IE only.
    // Fires before the value is pasted into the form item, so returning false would cancel the
    // paste.
    // Perform update on a delay so we have the new value available from the form item element.
    _handleCutPaste : function () {
        
        // Fire change handlers on paste.
        
        if (this.changeOnKeypress) this._queueForUpdate();
    },
    
    // _willHandleInput()
    // Can we use the "input" event in this browser / form item?
    // True for Moz and Safari, but not IE. See comments near FormItem._handleInput()
    _willHandleInput : function () {
        return !isc.Browser.isIE;
    },
    
    // by putting 'nowrap' on the text box cell we avoid the value icon / text box appearing 
    // on different lines
    getTextBoxCellCSS : function () {
        return this._$nowrapCSS
    },

    // NOTE: this is here for doc generation
    //>	@method textItem.keyPress		(A)
	//		@group	event handling
	//			event handler for keys pressed in this item
	//<

	//>	@method	textItem.getElementHTML()	(A)
	//			output the HTML for a text field element
	//		@group	drawing
	//		@param	value	(string)	Value of the element [Unused because it is more reliably set by setValue].
	//		@return	(HTML)	HTML output for this element
	//<
    _$elementStartTemplate:[
        ,                   // [0] possible value icon stuff
        "<INPUT TYPE=",         // [1]
        ,                       // [2] this._elementType,
        " NAME='",               // [3]
        ,                       // [4] this.getElementName(),
        "' ID='",                 // [5]
        ,                       // [6] this.getDataElementId(),
            // We want the EH system to handle events rather than writing native
            // handlers into the form item.
        "' handleNativeEvents=false" // [7]
    ],
    _$tabIndexEquals:" TABINDEX=",
    _$rightAngle:">",
            
    _$disabled:" DISABLED ",
    _$native:"native",
    _$autoCompleteOff:" AUTOCOMPLETE=OFF ",
    _$accessKeyEquals:" ACCESSKEY=",
    
	getElementHTML : function (value, dataValue) {
        var valueIconHTML = this._getValueIconHTML(dataValue);
        if (this.showValueIconOnly) return valueIconHTML;
        
		var template = this._$elementStartTemplate,
            form = this.form,
			formID = form.getID(),
			itemID = this.getItemID()
		;

        // May be null
        template[0] = valueIconHTML;
		
        template[2] = this._elementType;
        template[4] = this.getElementName();
        template[6] = this.getDataElementId();
        
        // hang a flag on the element marking it as the data element for the
        // appropriate form item.
        template[8] = this._getItemElementAttributeHTML();
        
        // At this point we're appending to the end of the template Disable spellchecker in
        // Moz if appropriate so we don't get the red wavy line under email addresses etc.
         
        
        if (isc.Browser.isMoz || isc.Browser.isSafari) {
            if (this.getBrowserSpellCheck()) template[template.length] = " spellcheck=true";
            else template[template.length] = " spellcheck=false"
        }
        
        // If we get an oninput event for this browser, write it out into our element's HTML
        
        if (this._willHandleInput) {
            template[template.length] = " ONINPUT='" 
            template[template.length] = this.getID() 
            template[template.length] = "._handleInput()'"
        }
        
        if (this.isDisabled()) template[template.length] = this._$disabled;
        
        // Write out 'readOnly' setting if present
        if (this.isInactiveHTML() || this.readOnly) {
            template[template.length] = " READONLY=TRUE"
        }
        
        if (this.isInactiveHTML() && value != null && value != isc.emptyString) {
            template[template.length] = " value='" + value + "'";
        }
        
        // disable native autoComplete 
              
        if (this._getAutoCompleteSetting() != this._$native) {
            template[template.length] = this._$autoCompleteOff;
        }
        
        template[template.length] = this.getElementStyleHTML();
        
        
        var tabIndex = this._getElementTabIndex();
        if (tabIndex != null) {
            var end = template.length;
            template[end] = this._$tabIndexEquals;  
            isc._fillNumber(template, tabIndex, end+1, 5);
        }
        
        // Note: if we're showing a title for the element, we don't need to set
        // up an accessKey here, since the label tag takes care of that
        if (this.showTitle == false && this.accessKey != null) {
            template[template.length] = this._$accessKeyEquals;
            template[template.length] = this.accessKey;
        }
        
        template[template.length] = this._$rightAngle;

        var result = template.join(isc.emptyString);
        
        // Trim the entries off the end of the template so we can reuse it.
        template.length = 8;
        return result;
	},  
    
    
    _sizeTextBoxAsContentBox : function () {
        return isc.Browser.isStrict;
    },
    
    // override _nativeElementBlur() to fire blur and change handlers in response to a native 
    // blur
    //
    // Natively onblur is fired when focus is taken from the text item, but onchange will
    // only fire if the value on leaving the text item is different from what it was when
    // the user put focus into the text item.
    //
    // Since we do internal values handling, having the same element value when focus is 
    // taken from a form item as when focus first went to a form item is not a guarantee
    // that our stored value for the form item has not changed, and vice versa - 
    // typically we are saving values in response to key events due to 'changeOnKeypress'.
    // 
    // Therefore instead of relying on the native change handler, on blur we will always fire
    // our change handler if changeOnBlur is true, and otherwise compare our stored value to
    // the current element value, and fire the change handler if they do not match.
    
    
    _nativeElementBlur : function (element, itemID) {
        var returnVal = this.Super("_nativeElementBlur", arguments);

        if (this.changeOnBlur) this.form.elementChanged(this);
        else {
            var elementValue = this.getElementValue();
            // unmap the value if necessary 
            if (this.mapDisplayToValue) {
                elementValue = this.mapDisplayToValue(elementValue);
            }
            if (this._value != elementValue) this.form.elementChanged(this);
        }
        
        if (this.mask) { 
            // Get value in display format and update the field.
            var value = this.getValue();
            if (this.mapValueToDisplay) {
                value = this.mapValueToDisplay(value);
            }
            this.setElementValue (value);
        }

        // If showing hint within data field, see if it should be shown now.
        if (this.showHintInField) {
            var undef;
            var value = this.getElementValue();
            if (value === undef || value == null || isc.is.emptyString(value)) {
                this._showInFieldHint();
            }
        }

        return returnVal;
    },
    
	//>	@method	textItem.getElementStyleHTML()	(I)
    //      	Get the HTML string used to set the visual characteristics for a text item.
    //          This includes the STYLE=... & CLASS=... properties to be written into this
    //          form item's element.
	//			This varies by platform, as we attempt to make Netscape think in pixels rather than 
    //          characters and rows
	//
	//		@group	appearance
	//		@return	(string)    String of HTML containing STYLE=... & CLASS=... properties for 
    //                          this items element.
	//
	//<
    _$styleTemplate:[
        " CLASS='",          // [0]
        ,                   // [1] this.getTextBoxStyle(),
        "' STYLE='",         // [2]
        ,                   // [3] null or 'width:'
        ,,,,                // [4-7] null or width
        ,                   // [8] null or 'px;'

             
        ,                   // [9] null or 'height:'
        ,,,,                // [10-13] null or height
        ,                   // [14] null or 'px;'

            // text align property, known to be supported in IE6 and Moz/Firefox on
            // Windows, not supported on Safari 1.2
        ,                   // [15] null or 'text-align'
        ,                   // [16] null or this.textAlign
        ,                   // [17] null or ";"
        
            // In Mozilla we must use the '-moz-user-focus' css property to govern
            // whether this element can recieve focus or not.
            // (slots 18 and 19)
        (isc.Browser.isMoz ? "-moz-user-focus:" 
            
            : isc.Browser.isIE ? "margin-top:-1px;margin-bottom:-1px;" : null),    // [18]
        ,                   // [19] Moz: 'normal' or 'ignore' - otherwise null
        "' "                // [20]
    ],
    _$widthColon:"WIDTH:",
    _$pxSemi:"px;",
    _$heightColon:"HEIGHT:",
    _$textAlignColon:"text-align:",
    _$semi:";",
    _$normal:"normal;", _$ignore:"ignore;",
	getElementStyleHTML : function () {
        
        var template = this._$styleTemplate,
            width = this.getTextBoxWidth(),
            height = this.getTextBoxHeight(),
            style = this.getTextBoxStyle();

        template[1] = style;
        
        
        if (isc.isA.Number(width)) {
            template[3] = this._$widthColon;
            isc._fillNumber(template, width, 4, 4);            
            template[8] = this._$pxSemi;
        } else {
            template[3] = template[4] = template[5] = template[6] = 
                template[7] = template[8] = null;
        }
        
        if (isc.isA.Number(height)) {
            template[9] = this._$heightColon;
            isc._fillNumber(template, height, 10, 4);                        
            template[14] = this._$pxSemi;
        } else {
            template[9] = template[10] = template[11] = template[12] = 
                template[13] = template[14] = null;            
        }
        
        if (this.textAlign) {
            template[15] = this._$textAlignColon;
            template[16] = this.textAlign;
            template[17] = this._$semi;
        } else {
            template[15] = template[16] = template[17] = null;
        }
        
        if (isc.Browser.isMoz) {
            template[19] = (this._getElementTabIndex() > 0 ? this._$normal
                                                           : this._$ignore);
        }
        return template.join(isc.emptyString);
    },
    
    //>@method textItem.mapValueToDisplay()  (A)
    // Map from the internal value for this item to the display value.
    // @param   internalValue   (string)   Internal value for this item.
    // @return  (string)   Displayed value corresponding to internal value.
    // @group   drawing
    //<
    mapValueToDisplay : function (internalValue) {
        if (this.mask) {
            // Map value to editable mask
            var x = this._getMaskBuffer();
            if (!this.hasFocus) 
                x = this._maskValue(internalValue);
            return x;
        }
        
        var value = isc.FormItem._instancePrototype.mapValueToDisplay.call(this, internalValue);
        // always display the empty string for null values, rather than "null" or "undefined"
        if (value == null) return isc.emptyString;
        
        return value;
    },
        
    // Don't apply arbitrary formatters specified via SimpleType definitions to this item's
    // display value - we have no way to parse it back to a real data value
    applyStaticTypeFormat:false,
	
    //>@method textItem.mapDisplayToValue()  (A)
    // @group	drawing
    // Map from a the display value for this item to the internal value.
    // @param   displayValue   (string)   Value displayed to the user.
    // @return  (string)   Internal value corresponding to that display value.
    //<
    mapDisplayToValue : function (displayValue) {
       
        if (this.mask) {
            var value = this._unmaskValue(displayValue);
        } else {
            value = this._unmapKey(displayValue);
        }
        if (!this.applyStaticTypeFormat && this.parseEditorValue != null) {
            return this.parseEditorValue(displayValue, this.form, this);
        }

        // if the value to be saved is an empty string, map it to 'null' if necessary
        if (isc.is.emptyString(value)) value = this._emptyStringValue;
        return value;
    },
    
    // override 'saveValue' so new value can be mapped into mask if used.
    saveValue : function (value, isDefault) {

        // Save the new value into our mask buffer
        if (this.mask) this._maskValue (value);

        this.Super("saveValue", arguments);
    },

    // override 'setValue'.
    // If passed null or the empty string, we store this as the 'empty string value' - this will
    // then be returned whenever the user clears out the text item element.
    setValue : function (value,b,c,d) {
        
        

        // Make sure in-field hint is hidden
        this._hideInFieldHint();

        var undef;
        if (value !== undef && (value == null || isc.is.emptyString(value)))
            this._emptyStringValue = value;

        // Translate incoming value based on characterCasing if needed
        if (value !== undef && value != null && this.characterCasing != isc.TextItem.DEFAULT) {
            if (this.characterCasing == isc.TextItem.UPPER) {
                value = value.toUpperCase();
            } else if (this.characterCasing == isc.TextItem.LOWER) {
                value = value.toLowerCase();
            }
        }

        // Let parent take care of saving the value
        value = this.invokeSuper(isc.TextItem, "setValue", value,b,c,d);

        // See if the in-field hint needs to be shown
        if (!this.hasFocus && this.showHint && this.showHintInField && this.getHint()) {
            if (value === undef || value == null || isc.is.emptyString(value)) {
                this._showInFieldHint();
            }
        }

        return value;
    },
    
    // Override getCriteriaFieldName - if we have a displayField, return it rather than the
    // item name
    getCriteriaFieldName : function () {
        if (this.displayField) return this.displayField;
        return this.getFieldName();
    },

    // When focus is received, the hint should be hidden if TextItem.showHintInField is true.
    _nativeElementFocus : function (element, itemID) {
        var returnVal = this.Super("_nativeElementFocus", arguments);

        // Hide in-field hint if being shown
        this._hideInFieldHint();

        if (this.mask) {
            // Force buffer back into control so unfilled mask spaces
            // will be shown with the maskPromptChar
            this._saveMaskBuffer(false);

            // Determine caret position. By default the caret is placed on the next
            // unfilled mask position or at the end of the field. If selectOnFocus
            // is true, the entire field is selected.
            var begin = 0;
            var end = this._length;
            if (!this.selectOnFocus) {
                begin = this._getEndPosition ();
                end = begin;
            }
            this.delayCall ("_setSelection", [begin, end]);
        }

        return returnVal;
    },

    // Case conversion and keyPressFilter handling

    //> @attr   textItem.characterCasing   (CharacterCasing : isc.TextItem.DEFAULT : IRWA)
    // Should entered characters be converted to upper or lowercase?
    // Also applies to values applied with +link{formItem.setValue}.
    // <P>
    // Note: character casing cannot be used at the same time as a +link{textItem.mask}.
    // @example formFilters
    // @visibility  external
    //<    
    characterCasing: isc.TextItem.DEFAULT,

    //> @attr   textItem.keyPressFilter   (string : null : IRWA)
    // Sets a keypress filter regular expression to limit valid characters
    // that can be entered by the user. If defined, keys that match the
    // regular expression are allowed; all others are suppressed. The
    // filter is applied after character casing, if defined.
    // <P>
    // Note: keypress filtering cannot be used at the same time as a +link{textItem.mask}.
    // @see textItem.characterCasing
    // @setter setKeyPressFilter
    // @example formFilters
    // @visibility  external
    //<    

    //>@method textItem.setKeyPressFilter()
    // Set the keyPressFilter for this item
    // @param filter (string) new keyPress filter for the item
    // @visibility external
    //<
    setKeyPressFilter : function (filter) {
        if (this.mask) {
            this.logWarn("setKeyPressFilter() ignored because mask is enabled");
            return;
        }
        this.keyPressFilter = filter;
        this._keyPressRegExp = null;
        if (this.keyPressFilter) {
            this._keyPressRegExp = new RegExp (this.keyPressFilter);
        }
    },
    
    init : function() {
        this.Super("init", arguments);

        // Setup mask or keyPress filter
        if (this.mask && !isc.isA.ComboBoxItem(this) && !isc.isA.SpinnerItem(this)) {
            this._parseMask ();
            if (this.keyPressFilter) {
                this.logWarn("init: keyPressFilter ignored because mask is enabled");
            }
        } else if (this.keyPressFilter) {
            this._keyPressRegExp = new RegExp (this.keyPressFilter);
        }
    },

    keyPress : function (item, form, keyName, characterValue) {

        // Let standard key handling process this keyPress if
        // - Ctrl or Alt key is also pressed
        // - not performing case conversion, key press filtering or masked entry
        if (isc.EventHandler.ctrlKeyDown() || isc.EventHandler.altKeyDown()) return true;
        if ((!this.characterCasing || this.characterCasing == isc.TextItem.DEFAULT) &&
            !this._keyPressRegExp &&
            !this.mask)
        {
            return true;
        }

        // Perform in-field navigation and deletion
        if (this.mask) {
            var selection = this._getSelection();
            var isSafari = isc.Browser.isSafari;

            var pos = selection.begin;

            // Handle backspace and delete keys
            if (keyName == "Backspace" || keyName == "Delete") {
                // If there is a selection, these keys the result is identical
                if ((selection.begin - selection.end) != 0 || 
                    (isSafari && this._lastSelection))
                {
                    if (isc.Browser.isSafari && this._lastSelection) {
                        selection = this._lastSelection;
                        this._lastSelection = null;
                    }
                    if (this.maskOverwriteMode) {
                        this._clearMaskBuffer (selection.begin, selection.end);
                    } else {
                        //var len = selection.end - selection.begin + (isSafari ? 1 : 0);
                        var len = selection.end - selection.begin;
                        this._shiftMaskBufferLeft (selection.begin, len);
                    }
                    this._saveMaskBuffer (true);
                    this._positionCaret (selection.begin, 0);
                } else {
                    // No selection
                    if (keyName == "Backspace") {
                        // Note Safari's caret position already reflects backspace
                        var shiftPos = ((isSafari && selection.begin == selection.end)
                            ? pos : pos - 1);
                        if (shiftPos >= 0) {
                            if (this.maskOverwriteMode) {
                                while (!this._maskFilters[shiftPos] && shiftPos >= 0) shiftPos--;
                                this._maskBuffer[shiftPos] = this.maskPromptChar;
                            } else {
                                this._shiftMaskBufferLeft (shiftPos);
                            }
                            this._saveMaskBuffer (true);
                            this._positionCaret (shiftPos, -1);
                        }
                    } else {
                        if (this.maskOverwriteMode) {
                            this._maskBuffer[pos] = this.maskPromptChar;
                        } else {
                            this._shiftMaskBufferLeft (pos);
                        }
                        this._saveMaskBuffer (true);
                        this._positionCaret (pos, 0);
                    }
                }
                return false;
            }

            // If there is a selection, see if it should be cleared first
            if (this._isTypableCharacter (characterValue) &&
                ((selection.begin - selection.end) != 0 || (isSafari && this._lastSelection)))
            {
                if (isc.Browser.isSafari && this._lastSelection) {
                    selection = this._lastSelection;
                    this._lastSelection = null;
                }
                if (this.maskOverwriteMode) {
                    this._clearMaskBuffer (selection.begin, selection.end);
                } else {
                    var len = selection.end - selection.begin;
                    this._shiftMaskBufferLeft (selection.begin, len);
                }
            }

            // For Safari, save selection
            if (isSafari && (selection.begin - selection.end) != 0 &&
                !this._isTypableCharacter (characterValue))
            { 
                this._lastSelection = selection;
            } else {
                this._lastSelection = null;
            }

            // Handle ESC key
            if (keyName == "Escape") {
                this._clearMaskBuffer (0, this._length)
                this._saveMaskBuffer (true);
                this._setSelection (this._firstNonMaskPos);
                return false;
            }
        }

        // Completely unhandled characters can be filtered
        if ((this.mask && !this._isTypableCharacter (characterValue)) ||
            (!this.mask && ((!this._keyPressRegExp && !this._isAlphaCharacter (characterValue)) ||
                            (this._keyPressRegExp && !this._isTypableCharacter (characterValue)))))
        {
            return true;
        }

        var c = String.fromCharCode (characterValue);

        if (this.mask) {
            // Get next typable position
            var p = this._getNextEntryPosition (pos - 1);
            if (p < this._length) {
                var filter = this._maskFilters[p];
                if (filter) {
                    // Perform character case changes
                    if (filter.casing) {
                        c = this._mapCharacterCase (c, filter.casing);
                    }

                    // Validate against the mask filter
                    if (filter.filter.test (c)) {
                        if (!this.maskOverwriteMode)
                            this._shiftMaskBufferRight (p);
                        this._maskBuffer[p] = c;
                        var next = p;
                        if (this._saveMaskBuffer (true)) {
                            next = this._getNextEntryPosition (p);
                        }
                        this._setSelection (next);
                    }
                }
            }
            return false;
        }

        // Perform character case changes
        var nc = c;
        if (!this.mask) nc = this._mapCharacterCase (c, this.characterCasing);

        // If no conversion was performed and a key press filter is not registered,
        // revert to standard keyPress handling
        if (c == nc && !this._keyPressRegExp) return true;

        // Check keyPress filter to determine if entered character is valid
        if (this._keyPressRegExp) {
            if (this._isTypableCharacter (characterValue) && !this._keyPressRegExp.test (nc)) {
                // Keypress is not valid. Suppress it by telling keyPress
                // handler that we handled the character but do nothing with it.
                return false;
            }
        }

        // If we get this far, the character entered is valid.
        // However, if case conversion was not performed we are done.
        if (c == nc) return true;

        // Case-converted character needs to be added to the current value.
        // Using the current selection (or insertion point) write the new character.
        var value = this.getValue() || "";
        var selection = this.getSelectionRange();

        if ((selection[0] - selection[1]) != 0) {
            value = value.substring(0, selection[0]) + nc + value.substring(selection[1] + 1);
        } else {
            value = value.substring(0, selection[0]) + nc + value.substring(selection[1]);
        }
   
        // Push new value to field and update caret position
        this.setValue (value);
        this.setSelectionRange (selection[0] + 1, selection[0] + 1);

        // Don't process this keyPress event further
        return false;
    },

    // Helper methods to determine valid typed characters
    _isTypableCharacter : function (characterValue) {
        return ((characterValue >= 32 && characterValue <= 126) || characterValue > 127);
    },
    _isAlphaCharacter : function (characterValue) {
        return (characterValue >= 65 && characterValue <= 90) ||
            (characterValue >= 97 && characterValue <= 122);
     },
    _mapCharacterCase : function (c, casing) {
        if (casing == isc.TextItem.UPPER) {
            c = c.toUpperCase();
        } else if (casing == isc.TextItem.LOWER) {
            c = c.toLowerCase();
        }
        return c; 
    },

    //> @attr   textItem.mask   (string : null : IRWA)
    // Input mask used to filter text entry.
    // <P>
    // Sample masks:
    // <UL>
    // <LI>Phone number: (###) ###-####</LI>
    // <LI>Social Security number: ###-##-####
    // <LI>First name: &gt;?&lt;??????????</LI>
    // <LI>Date: ##/##/####</LI>
    // <LI>State: &gt;LL</LI>
    // </UL>
    // Overview of available mask characters
    // <P>
    // <table class="normal">
    // <tr><th>Character</th><th>Description</th></tr>
    // <tr><td>0</td><td>Digit (0 through 9) or plus [+] or minus [-] signs</td></tr>
    // <tr><td>9</td><td>Digit or space</td></tr>
    // <tr><td>#</td><td>Digit</td></tr>
    // <tr><td>L</td><td>Letter (A through Z)</td></tr>
    // <tr><td>?</td><td>Letter (A through Z) or space</td></tr>
    // <tr><td>A</td><td>Letter or digit</td></tr>
    // <tr><td>a</td><td>Letter or digit</td></tr>
    // <tr><td>C</td><td>Any character or space</td></tr>
    // <tr><td>&nbsp;</td></tr>
    // <tr><td>&lt;</td><td>Causes all characters that follow to be converted to lowercase</td></tr>
    // <tr><td>&gt;</td><td>Causes all characters that follow to be converted to uppercase</td></tr>
    // </table>
    // <P>
    // Any character not matching one of the above mask characters or that is escaped
    // with a backslash (\) is considered to be a literal.
    // <P>
    // Custom mask characters can be defined by standard regular expression character set
    // or range. For example, a hexadecimal color code mask could be:
    // <UL>
    // <LI>Color: \#>[0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F][0-9A-F]</LI>
    // </UL>
    // <P>
    // Note: input mask cannot be used at the same time as a +link{textItem.keyPressFilter}.
    // @setter  textItem.setMask()
    // @see textItem.keyPressFilter
    // @example maskedTextItem
    // @visibility  external
    //<    

    //> @attr   textItem.maskOverwriteMode   (boolean : null : IRWA)
    // During entry into masked field, should keystrokes overwrite current position value?
    // By default new keystrokes are inserted into the field.
    // @visibility  external
    //<    

    //> @attr   textItem.maskSaveLiterals   (boolean : null : IRWA)
    // Should entered mask value be saved with embedded literals?
    // @visibility  external
    //<    

    //> @attr   textItem.maskPadChar   (string : " " : IRWA)
    // Character that is used to fill required empty mask positions
    // to display text while control has no focus.
    // @visibility  external
    //<    
    maskPadChar: " ",

    //> @attr   textItem.maskPromptChar   (string : "_" : IRWA)
    // Character that is used to fill required empty mask positions
    // to display text while control has focus.
    // @visibility  external
    //<    
    maskPromptChar: "_",

    //> @method textItem.setMask ()
    // Set the mask for this item.
    // <P>
    // Note that the current value of the field is cleared when changing the mask.
    // @param mask (string) mask to apply to text item
    // @see textItem.mask
    // @visibility external
    //<
    setMask : function (mask) {
        if (isc.isA.ComboBoxItem(this) || isc.isA.SpinnerItem(this)) {
            return;    
        }
        // Setup mask
        this.mask = mask;
        this._parseMask ();
        if (this.keyPressFilter) {
            this._keyPressRegExp = null;
            this.logWarn("setMask: keyPressFilter ignored because mask is enabled");
        }

        // Clear the field value
        this.setValue ("");
    },

    _parseMask : function() {
        // Create an array of mask position checks for keyPress filtering.
        // Each entry will be an object holding the regular expression of
        // valid characters, whether the character should be converted to
        // upper of lower case, and it the cahracter is required (for
        // validation).
        this._maskFilters = [];

        // This buffer holds the prompt characters and fixed characters from
        // the mask along with the cahracters entered by the user. It is
        // updated and then rewritten to the field when ready.
        this._maskBuffer = [];

        this._length = 0;

        // Current casing state
        var casing = null;     // no casing change
        // Current escape sequence state
        var escaping = false;
        // Are we processing a custom regex?
        var inRegex = false;
        // Current custom regex value
        var customRegex = "";

        // Build the mask filters and buffer
        var maskChars = this.mask.split("");
        for (var i = 0; i < maskChars.length; i++) {
            var c = maskChars[i];

            // Check for case conversion
            if (c == "<") {
                // lowercase
                casing = (casing == isc.TextItem.LOWER ? null : isc.TextItem.LOWER);
            } else if (c == ">") {
                // uppercase
                casing = (casing == isc.TextItem.UPPER ? null : isc.TextItem.UPPER);
            } else {
                if (!escaping && c == "\\") {
                    escaping = true;
                } else if (escaping) {
                    this._addLiteralToMask (c, casing);
                    escaping = false;
                } else {
                    if (!inRegex && c == "[") {
                        // Start of custom regex
                        inRegex = true;
                        customRegex += c;
                    } else if (inRegex && c == "]") {
                        // End of custom regex
                        inRegex = false;
                        customRegex += c;

                        this._maskFilters.push(
                            { filter: new RegExp (customRegex),
                              casing: casing }
                        );
                        if (this._firstNonMaskPos == null) {
                            this._firstNonMaskPos = this._maskFilters.length - 1;
                        }
                        this._maskBuffer.push (this.maskPromptChar);
                        this._length++;

                        customRegex = "";
                    } else if (inRegex) {
                        // Building custom regex
                        customRegex += c;
                    } else {
                        this._addUnknownToMask (c, casing);
                    }
                }
            }
        }
    },

    _addLiteralToMask : function(c, casing) {
        this._maskFilters.push (null);
        this._maskBuffer.push (c);
        this._length++;
    },

    _addUnknownToMask : function(c, casing) {
        // Define standard keypress filters
        var def = isc.TextItem._filterDefinitions[c];
        if (def) {
            this._maskFilters.push(
                { filter: new RegExp (def.charFilter),
                  casing: casing }
            );
            if (this._firstNonMaskPos == null) {
                this._firstNonMaskPos = this._maskFilters.length - 1;
            }
            this._maskBuffer.push (this.maskPromptChar);
        } else {
            // No filter defined for character. Assumed to be a literal.
            this._maskFilters.push (null);
            this._maskBuffer.push (c);
        }
        // Add to our length
        this._length++;
    },

    // Mask handling private helper methods
    // Selection handling wrapper methods
    _getSelection : function() {
        var range = this.getSelectionRange();
        return { begin: range[0], end: range[1] };
    },
    _setSelection : function (begin, end) {
        // end parameter is optional. If not passed, it is matched to begin
        // to set the caret position.
        if (this.hasFocus) {
            end = (isc.isA.Number (end) ? end : begin);
            this.setSelectionRange (begin, end);
        }
    },
    // Get position of next user-entered character (i.e. non-literal)
    _getNextEntryPosition : function (pos) {
        while (++pos < this._length) {
            if (this._maskFilters[pos]) return pos;
        }
        return this._length;
    },
    // Get last unentered character position
    _getEndPosition : function () {
        var lastMatch = 0;
        for (var i = this._length-1; i >= 0; i--) {
            if (this._maskFilters[i]) {
                if (this._maskBuffer[i] == this.maskPromptChar) 
                    lastMatch = i;
                else
                    break;
            }
        }
        return lastMatch;
    },
    // Map the stored value to the display (edit) format.
    // There are two ways a value can be stored: with literals and without.
    // If stored with literals, all entered characters and literals are mapped
    // directly into the mask.
    // If stored without literals the characters have to be placed into the
    // mask from left to right as if typed by the user. 
    // When this control has focus, maskPromptChars are used to fill in unentered
    // characters in the mask. When focus is lost, these same characters are
    // replaced by the maskPadChar.
    // 
    _maskValue : function (value) {
        if (value == null) value = "";

        // Clear buffer contents of entered characters. All that is left are
        // the literals and maskPromptChars.
        this._clearMaskBuffer (0, this._length);

        // Keep up with the last character matched into the mask.
        var lastMatch = -1;

        // Merge value into buffer
        if (this.maskSaveLiterals) {
            // value should be a one-to-one match for mask
            for (var i = 0, pos = 0; i < value.length; i++) {
                if (this._maskFilters[i]) {
                    // Position expects user entry
                    var c = value.charAt(i);

                    // Map a space to maskPromptChar when focused.
                    // Or place entered character into buffer.
                    if (c == " " ) {
                        if (!this.hasFocus)
                            this._maskBuffer[i] = c;
                    } else if (this._maskFilters[i].filter.test(c)) {
                        this._maskBuffer[i] = c;
                        lastMatch = i;
                    }
                }
            }
        } else {
            // try to place characters into mask as if type manually.
            for (var i = 0, pos = 0; i < this._length; i++) {
                if (this._maskFilters[i]) {
                    while (pos < value.length) {
                        var c = value.charAt (pos++);

                        // If there is a space in this position, let it be
                        // replaced with the maskPromptChar because it can
                        // be entered.
                        if (c == " ") {
                            if (!this.hasFocus) this._maskBuffer[i] = c;
                            break;
                        } else if (this._maskFilters[i].filter.test(c)) {
                            this._maskBuffer[i] = c;
                            lastMatch = i;
                            break;
                        }
                    }
                    if (pos > value.length) break;
                }
            }
        }

        value = this._getMaskBuffer();
        if (!this.hasFocus) {
            // If there are literals after the last matched entry, include
            // those in display.
            if (lastMatch >= 0) {
                for (var i = lastMatch + 1; i < this._length; i++) {
                    if (this._maskFilters[i]) break;
                    lastMatch++;
                }
            }
            // Chop display value to remove trailing spaces
            value = value.substring (0, lastMatch + 1);
        }

        return value;
    },
    // Map the edit value to the stored format.
    _unmaskValue : function (value) {
        // Display should be in masked format. Convert it to desired output format.
        if (value == null) value = "";

        // We need to know if there is anything in the display value other
        // than literals. This way an empty value is produced when done.
        // The resulting value should also be chopped after the last entered
        // or literal character.
        var hasNonLiterals = false;
        var lastValidChar = -1;

        var newValue = "";
        for (var i = 0, pos = 0; i < value.length; i++) {
            var c = value.charAt (i);

            if (this._maskFilters[i]) {
                if (c != this.maskPromptChar && this._maskFilters[i].filter.test (c)) {
                    // Valid character at this position
                    newValue += c;
                    hasNonLiterals = true;
                    lastValidChar = pos++;
                } else {
                    // Invalid character
                    newValue += this.maskPadChar;
                    pos++;
                }
            } else if (this.maskSaveLiterals) {
                // Literal character
                newValue += c;
                lastValidChar = pos++;
            }
        }

        // Truncate result
        if (!hasNonLiterals) {
            newValue = "";
        } else {
            newValue = newValue.substring (0, lastValidChar + 1);
        }

        return newValue;
    },

    // Mask buffer helper methods
    _getMaskBuffer : function () {
        return this._maskBuffer.join('');
    },
    _clearMaskBuffer : function (start, end) {
        for (var i = start; i < end && i < this._length; i++) {
            if (this._maskFilters[i]) this._maskBuffer[i] = this.maskPromptChar;
        }
    },
    _saveMaskBuffer : function (changed) {
        // Update our saved value so a call to getValue() will return our
        // current edit value. Don't call setValue() because it requires
        // the unformatted value and then formats it. We already have a
        // formatted (display) value.
        var buffer = this._getMaskBuffer();

        // Show current display value
        this.setElementValue (buffer);

        if (changed && this.changeOnKeypress) {
            var value = this._unmaskValue(buffer);
            
            // fire the change handler, (handles validation etc)
            var returnVal = this.handleChange(value, this._value);
            // The change handler may call 'setItems' on the form (particularly likely in LG
            // editing) in which case we'll be destroyed
             
            if (this.destroyed) return;
            // Ensure we have the latest value (stored as this._changeValue)
            value = this._changeValue;
            // We may need to perform some visual updates based on the new value - do this here
            this.updateAppearance(value);
            // save the value
            this.saveValue (value);
            // fire any specifed 'changed' handler for this item.
            this.handleChanged(value);

            return returnVal;
        } 
        return true;
    },
    // Position caret at offset in field
    _positionCaret : function (pos, offset) {
        if (offset < 0) {
            while (!this._maskFilters[pos] && pos >= 0) pos--;
        } else {
            while (!this._maskFilters[pos] && pos < this._length) pos++;
        }
        this._setSelection (pos);
    },
    // Shift contents of buffer to left starting at <pos>
    _shiftMaskBufferLeft : function (pos, len) {
        // Skip any user-entered positions to find left-most position to
        // receive shifted contents.
        if (!len) len = 1;
        while (!this._maskFilters[pos] && pos >= 0) pos--;

        // Move each character <len> positions to the left where the character
        // matches the new position's filter.
        for (var i = pos, pos2 = i+len-1; i < this._length; i++) {
            if (this._maskFilters[i]) {
                this._maskBuffer[i] = this.maskPromptChar;
                var j = this._getNextEntryPosition (pos2++);
                var filter = this._maskFilters[i];
                var c = this._maskBuffer[j];
                if (j < this._length && filter.filter.test (c)) {
                    // Perform character case changes
                    if (filter.casing) {
                        c = this._mapCharacterCase (c, filter.casing);
                    }
                    this._maskBuffer[i] = c;
                } else {
                    while (i < j) {
                        if (this._maskFilters[i]) this._maskBuffer[i] = this.maskPromptChar;
                        i++;
                    }
                    break;
                }
            }
        }
    },

    // Shift contents of buffer to right starting at <pos>
    _shiftMaskBufferRight : function (pos) {
        for (var i = pos, c = this.maskPromptChar; i < this._length; i++) {
            var filter = this._maskFilters[i];
            if (filter) {
                // Perform character case changes
                if (filter.casing) {
                    c = this._mapCharacterCase (c, filter.casing);
                }
                var j = this._getNextEntryPosition (i);
                var t = this._maskBuffer[i];
                this._maskBuffer[i] = c;
                if (j < this._length && this._maskFilters[j].filter.test (t)) {
                    c = t;
                } else {
                    break;
                }
            }
        }
    }

});

