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

 






//>	@class	LinkItem
//	A FormItem that displays an HTML link
// @visibility external
//<
isc.ClassFactory.defineClass("LinkItem", "StaticTextItem");
isc.LinkItem.addProperties({
    wrap: false,
    
    // The link item is focusable
    canFocus:true
    
    //> @attr linkItem.target (string : "_blank" : IRW)
    // By default, clicking a link rendered by this item opens it in a new browser window.  You 
    // can alter this behavior by setting this property.  The value of this property will be 
    // passed as the value to the <code>target</code> attribute of the anchor tag used to render 
    // the link.
    // <P>
    // If you set linkItem.target to "javascript", the default behaviour is to catch and consume
    // mouse-clicks that would result in the link being followed.  Instead, the
    // +link{formItem.click()} event is fired.
    // 
    // @visibility external
    //<
    
    //> @attr   linkItem.linkTitle (string : null : IRW)
    // Optional title text to display for this item's link. If unspecified the value of the item
    // will be the title text as well as the target of the link.
    // @setter linkItem.setLinkTitle()
    // @visibility external
    //<
    
});

isc.LinkItem.addMethods({

    // Even though we don't have a data element, we don't need a focus proxy - <a..> will
    // recieve focus in all browsers
    _writeOutFocusProxy : function () {
        return false;
    },
    
    _getLinkElement : function () {
        if (!this.isDrawn()) return null;
        return (isc.Element.get(this.getID() + "_link"));
    },
    
    // Apply focus/blur handlers to the link itself
    getFocusElement : function () {
        return this._getLinkElement();
    },

    // modify the text box template slightly - we're writing out a text box but it doesn't
    // need to be focusable
    _$textBoxTemplate:[ "<DIV ID='", // 0
                        ,            // 1: ID for text box
                        "' " + isc.DynamicForm._containsItem + "='", // 2
                        ,            // 3 [formItem ID]
                        "' " + isc.DynamicForm._itemPart + "='" + isc.DynamicForm._textBoxString, // 4
                        "' CLASS='", // 5
                        ,            // 6: this.getTextBoxStyle(),
                        "' STYLE='", // 7
                        ,            // 8: this.getTextBoxCSS(), 
                        "' onclick='if(window.", // 10:ID     
                        ,
                        ") return ", // 12:ID
                        ,
                        "._linkClicked(event);",
                        "'>",        
                        ,            // 15: actual value
                        "</DIV>"
    ],

    _linkClicked : function (event) {
        // don't allow the click if the cell should not be interactive.
        var mustCancel = (this.destroyed || !this.isDrawn() || !this.isVisible());
        // If a clickMask is up and the item is masked, cancel the event.
        // Check both the containerWidget and the form. If they differ and  either is unmasked
        // the item is not considered masked.
        if (!mustCancel) {
            mustCancel = isc.EH.targetIsMasked(this.containerWidget);
            if (mustCancel && (this.form != this.containerWidget)) {
                mustCancel = isc.EH.targetIsMasked(this.form);
            }
        }
        if (this.target == "javascript") {
            mustCancel=true;
            this.handleClick();
        }

        if (mustCancel) {            
            
            if (!isc.Browser.isIE) {
                event.preventDefault();
            }
            return false;
        }

        return true;
    },
	getElementHTML : function (value) {
        var linkHTML = this.getLinkHTML(value);
        
        var template = this._$textBoxTemplate;
        template[1] = this._getTextBoxID();
        template[3] = this.getID();
        template[6] = this.getTextBoxStyle();
        template[8] = this.getTextBoxCSS();
        
        template[10] = this.getID();
        template[12] = this.getID();
        
        template[15] = linkHTML;
        
        return template.join(isc.emptyString);
    },
    
    getLinkHTML : function (text) {
        var valueIconHTML = this._getValueIconHTML(this._value);
        if (this.showValueIconOnly) return valueIconHTML;

        // convert to String
        if (text != null) text = isc.iscToLocaleString(text);
        if (text == null) text = isc.emptyString;
        var title = this.linkTitle;
        if (title == null) title = text;
        // Convert to actual link
        var target = this.target;
        if (target == "javascript") {
            text = "javascript:void";
        }

        text = isc.Canvas.linkHTML(text, title, target, 
                                    (this.getID() + "_link"), this.getGlobalTabIndex(), 
                                    this.accessKey)
        if (valueIconHTML != null) text = valueIconHTML + text;

        return text;
    },
    
    // Override setElementValue to update the text box with the correct value
    setElementValue : function (value) {
        if (this.isDrawn()) {
            var textBox = this._getTextBoxElement();
            if (textBox) textBox.innerHTML = this.getLinkHTML(value);
            // Re apply the event handlers
            this._applyHandlersToElement();
        }
    },
    
    //> @method linkItem.setLinkTitle()
    // Method to set the linkTitle for this item
    // @param title (string) new linkTitle for this item
    // @visibility external
    //<
    setLinkTitle : function (title) {
        this.linkTitle = title;
        this.redraw();
    }

});