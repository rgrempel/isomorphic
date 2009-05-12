/*
 * Isomorphic SmartClient
 * Version 7.0RC (2009-04-21)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 






//>	@class	AutoFitTextAreaItem
// Class for editable multi-line text areas (uses HTML <code>&lt;TEXTAREA&gt;</code> object)
// automatically expands to accomodate its content
// @visibility external
// @example textAreaItem
//<
isc.ClassFactory.defineClass("AutoFitTextAreaItem", "TextAreaItem");


isc.AutoFitTextAreaItem.addProperties({
    
    // getScrollHeight / getScrollWidth
    // Neither IE nor moz seems to reliably support the scroll height of a text area if it
    // is less than the inner size of the text box. This means that if we've grown to accomodate
    // content we cant reliably detect when the content is shrunk by looking at our text-box.
    // We therefore create an offscreen 'tester' textarea which remains at the specified size
    // and measure the scrollHeight / scrollWidth of that element
    getTestBox : function (forceResize) {
        var value = this.mapValueToDisplay(this.getValue());
        var AFTAI = isc.AutoFitTextAreaItem;
        if (!AFTAI._testBoxCanvas) {
            AFTAI._testBoxCanvas = isc.Canvas.create({
                autoDraw:true, overflow:"hidden",
                left:0, top:-100,
                contents:
                    ["<textarea ID='isc_autoFitTextArea_sizeTester'",
                     "style='overflow:hidden;",
                     (isc.Browser.isIE ?
                        "margin-top:-1px;margin-bottom:-1px;margin-left:0px;margin-right:0px;" :
                        "margin:0px;"),
                     "'></textarea>"].join("")
            });
        }
        var box = isc.Element.get("isc_autoFitTextArea_sizeTester");   
        // Match the text box's className and CSS Text to ensure our measurement is 
        // accurate
        if (AFTAI.currentItem != this || forceResize) {
            box.className = this.getTextBoxStyle();
            
            // would be nice to apply this.getElementCSSText directly but doesn't seem to be
            // an obvious way to do this.
            if (isc.Browser.isMoz) {
                if (isc.isA.String(this.wrap) && this.wrap.toLowerCase() != "off") {
                    box.rows = 10; box.cols = 10;
                } else {
                    box.rows = ""; box.cols = "";
                }
            }
            
            box.setAttribute("wrap", this.wrap);
            
            box.style.width = this.getTextBoxWidth();
            box.style.height = this.getTextBoxHeight();
            
            box.style.textAlign = this.textAlign || "";
            
            box.cssText = this.getElementCSSText(this.getTextBoxWidth(), this.getTextBoxHeight());
            AFTAI.currentItem = this;
        }
                
        box.value = value;
        
        var touch = box.scrollHeight;

        return box;
    },
    
    getScrollHeight : function (resized) {
        var testBox = this.getTestBox(resized);
        return testBox.scrollHeight;
    },
    
    getScrollWidth : function (resized) {
        var testBox = this.getTestBox(resized);
        return testBox.scrollWidth;
    },
    
    // force overflow to be hidden
    // Note: we're writing out the specified size rather than the overflowed size - this is 
    // appropriate to force wrapping in the right places - we'll check the rendered size after
    // drawing and resize if necessary
    getElementCSSText : function (width, height) {
        var txt = this.Super("getElementCSSText", arguments);
        txt += "overflow:hidden;"
        return txt;
    },
    
    // These methods are required to determine the delta between the specified size of the
    // TextArea and the available space for content
    _getTextBoxHPadding : function () {
        if (this._tbhpadding != null) return this._tbhpadding;
        var textBox = this.getDataElement();
        if (!textBox) return 0;
        var leftPadding = 
                parseInt(isc.Element.getComputedStyleAttribute(textBox, "paddingLeft")),
            rightPadding =
                parseInt(isc.Element.getComputedStyleAttribute(textBox, "paddingRight")),
            hPadding = (isc.isA.Number(leftPadding) ? leftPadding : 0) +
                       (isc.isA.Number(rightPadding) ? rightPadding : 0);
                               
        this._tbhpadding = hPadding;
        return hPadding;
        
    },
    _getTextBoxVPadding : function () {
        if (this._tbvpadding != null) return this._tbvpadding;
        var textBox = this.getDataElement();
        if (!textBox) return 0;
        // In IE we've seen textBox.currentStyle be reported as null in some cases
        // if this happens, don't cache that value
        if (isc.Browser.isIE && textBox.currentStyle == null) return 0;
        var topPadding = 
                parseInt(isc.Element.getComputedStyleAttribute(textBox, "paddingTop")),
            bottomPadding = 
                parseInt(isc.Element.getComputedStyleAttribute(textBox, "paddingBottom")),
            vPadding = (isc.isA.Number(topPadding) ? topPadding : 0) + 
                       (isc.isA.Number(bottomPadding) ? bottomPadding : 0);
        this._tbvpadding = vPadding;
        return vPadding;
    },
    
    
    updateSize : function (resized) {
        var textBox = this.getDataElement();
        if (!textBox) return;
        
        var resetHandle, sizeChanged;
        
        var specifiedHeight = this.getTextBoxHeight(),
            vPadding = this._getTextBoxVPadding(),
            scrollHeight = this.getScrollHeight(resized),
            boxHeight = textBox.offsetHeight;
         
        if ((scrollHeight + vPadding) > boxHeight) {
            textBox.style.height = scrollHeight + vPadding;
            sizeChanged = true;
        
            // Catch the case where the box is shrinking
        } else if ((scrollHeight + vPadding) < boxHeight && boxHeight > specifiedHeight) {
            if ((scrollHeight + vPadding) < boxHeight) {
                // If we're shrinking, the dynamicForm will need to _resetHandleOnAdjustOverflow
                // to detect the shrinking of contents
                resetHandle = true;
                textBox.style.height = Math.max(scrollHeight + vPadding, specifiedHeight);
            }
            sizeChanged = true
        }
        
        // width is trickier - we can expand easily to fit a non-wrapping line of text but
        // it will be hard to shrink since content will not rewrap smaller.
        var specifiedWidth = this.getTextBoxWidth(),
            hPadding = isc.Browser.isIE ? 0 : this._getTextBoxHPadding(),
            scrollWidth = this.getScrollWidth(resized),
            boxWidth = textBox.offsetWidth;
        
        if ((scrollWidth + hPadding) > boxWidth) {
            textBox.style.width = (scrollWidth + hPadding);
            sizeChanged = true;
        
        } else if ((scrollWidth + hPadding) < boxWidth && boxWidth > specifiedWidth) {
            textBox.style.width = Math.max(specifiedWidth, scrollWidth+hPadding);
            resetHandle = true
            sizeChanged = true
        }
        
        if (resetHandle) this.containerWidget._resetHandleOnAdjustOverflow = true;
        if (sizeChanged) this.adjustOverflow("Updated size to fit content");
    },
    
    handleChanged : function () {
        this.updateSize();
        return this.Super("handleChanged", arguments);
    },
    drawn : function () {
        
        this.Super("drawn", arguments);
        delete this._tbhpadding;
        delete this._tbvpadding;
        this.updateSize(true);
    },
    redrawn : function () {        
        this.Super("redrawn", arguments);
        delete this._tbhpadding;
        delete this._tbvpadding;
        this.updateSize(true);
    },
    
    
    // supportsSelectionRange - does getSelectionRange() return null on this item? (IE only)
    // See FormItem._getIESelectionRange() for background on this
    // Enable this in AutoFitTextAreas where modifying the value of the item is likely to change
    // the form's geometry and cause redraws and you really don't want to lose cursor positioning 
    supportsSelectionRange:true
});
