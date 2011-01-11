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

 




//>	@class	ToolStrip
// 
// Base class for creating toolstrips like those found in browsers and office applications: a
// mixed set of controls including +link{ImgButton,icon buttons}, 
// +link{button.radioGroup,radio button groups}, +link{MenuButton,menus},
// +link{ComboBoxItem,comboBoxes}, +link{LayoutSpacer,spacers}, +link{Label,status displays} and 
// +link{SelectItem,drop-down selects}.  
// <P>
// All of the above components are placed in the +link{ToolStrip.members,members array} to form
// a ToolStrip.  Note that the +link{FormItem,FormItems} mentioned above (ComboBox and
// drop-down selects) need to be placed within a +link{DynamicForm} as usual.
// <P>
// The special strings "separator" and "resizer" can be placed in the members array to create
// separators and resizers respectively.
// <P>
// Also see the +explorerExample{toolstrip} example in the Feature Explorer.
//
// @treeLocation Client Reference/Layout
// @visibility external
// @example toolstrip
//<

isc.defineClass("ToolStrip", "Layout").addProperties({
	
    //> @attr toolStrip.members (Array of Canvas : null : IR)
    // Array of components that will be contained within this Toolstrip, like
    // +link{Layout.members}, with the following special behaviors:
    // <ul>
    // <li>the String "separator" will cause a separator to be created (instance of 
    // +link{separatorClass})
    // <li>the String "resizer" will cause a resizer to be created (instance of
    // +link{resizeBarClass}).  This is equivalent to setting
    // +link{canvas.showResizeBar,showResizeBar:true} on the preceding member.
    // </ul>
    // 
    // @visibility external
    // @example toolstrip
    //<

    //> @attr toolStrip.height (Number : 20 : IRW)
    // ToolStrips set a default +link{Canvas.height,height} to avoid being stretched by
    // containing layouts.
    // @group sizing
    // @visibility external
    //<
    height: 20,
    
    defaultWidth: 250,

    //> @attr toolStrip.styleName (CSSClassName : "toolStrip" : IRW)
    // CSS class applied to this toolstrip.
    // <P>
    // Note that if +link{toolStrip.vertical} is true for this toolStrip, 
    // +link{toolStrip.verticalStyleName} will be used instead of this value if it is non-null.
    //<
    styleName: "toolStrip",
    
    //> @attr toolStrip.verticalStyleName (CSSClassName : null : IR)
    // Default stylename to use if +link{toolStrip.vertical,this.vertical} is true.
    // If unset, the standard +link{styleName} will be used for both vertical and horizontal
    // toolstrips.
    // <P>
    // Note that this property only applies to the widget at init time. To modify the 
    // styleName after this widget has been initialized, you should
    // simply call +link{canvas.setStyleName(),setStyleName()} rather than updating this 
    // property.
    // @group appearance
    // @visibility external
    //<
    
	//>	@attr	toolStrip.vertical		(boolean : false : IR)
	// Indicates whether the components are drawn horizontally from left to right (false), or
    // vertically from top to bottom (true).
	//		@group	appearance
    //      @visibility external
	//<
	vertical:false,

    //> @attr toolStrip.resizeBarClass (String : "ToolStripResizer" : IR)
    // Customized resizeBar with typical appearance for a ToolStrip
    // @visibility external
    //<
    // NOTE: class definition in Splitbar.js
    resizeBarClass: "ToolStripResizer",

	//> @attr toolStrip.resizeBarSize (integer : 14 : IRA)
    // Thickness of the resizeBars in pixels
    // @visibility external
	//<
    resizeBarSize: 14,

    //> @attr toolStrip.separatorClass (String : "ToolStripSeparator" : IR)
    // Class to create when the string "separator" appears in +link{toolStrip.members}.
    // @visibility external
    //<
    separatorClass : "ToolStripSeparator",

    //> @attr toolStrip.separatorSize (integer : 8 : IR)
    // Separator thickness in pixels
    // @visibility external
    //<
    separatorSize : 8,
    
    initWidget : function (a,b,c,d,e,f) {
        this.members = this._convertMembers(this.members);
        this.invokeSuper(isc.ToolStrip, this._$initWidget, a,b,c,d,e,f);
        
        if (this.vertical && this.verticalStyleName != null) {
            this.setStyleName(this.verticalStyleName);
        }
        
    },

    // support special "separator" and "resizer" strings
    _convertMembers : function (members) {
        var separatorClass = isc.ClassFactory.getClass(this.separatorClass);
        if (members == null) return null;
        var newMembers = [];
        for (var i = 0; i < members.length; i++) {
            var m = members[i];
            if (m == "separator") {
                var separator = separatorClass.createRaw();
                separator.autoDraw = false;
                separator.vertical = !this.vertical;
                if (this.vertical) {
                    separator.height = this.separatorSize;
                } else {
                    separator.width = this.separatorSize;
                }
                separator.completeCreation();
                newMembers.add(separator);
            } else if (m == "resizer" && i > 0) {
                members[i-1].showResizeBar = true;
            // handle being passed an explicitly created ToolStripResizer instance.
            // Incorrect usage but plausible.
            } else if (m == "starSpacer") {
                newMembers.add(isc.LayoutSpacer.create({width: "*"}));
            } else if (isc.isA.ToolStripResizer(m) && i > 0) {
                members[i-1].showResizeBar = true;
                m.destroy();
            } else {
                // handle being passed an explicitly created ToolStripSeparator instance.
                // Incorrect usage but plausible.
                if (isc.isA.ToolStripSeparator(m)) {
                    var separator = m;
                    separator.vertical = !this.vertical;
                    separator.setSrc(this.vertical ? separator.hSrc : separator.vSrc);
                    if (this.vertical) {
                        separator.setHeight(this.separatorSize);
                    } else {
                        separator.setWidth(this.separatorSize);
                    }
                    separator.markForRedraw();
                }
                newMembers.add(m);
            }
        }
        return newMembers;
    },
    addMembers : function (newMembers, position, dontAnimate,d,e) {
        if (!newMembers) return;
        if (!isc.isAn.Array(newMembers)) newMembers = [newMembers];

        var firstMember = newMembers[0],
            isResizerWidget = isc.isA.ToolStripResizer(firstMember);
        if (firstMember == "resizer" || isResizerWidget) {
            position = position || this.members.length;
            var precedingPosition = Math.min(position, this.members.length) -1;
            if (precedingPosition > 0) {
                var precedingMember = this.getMember(precedingPosition);
                if (precedingMember != null) {
                    precedingMember.showResizeBar = true;
                    this.reflow();
                }
            }
            var resizer = newMembers.shift();
            if (isResizerWidget) resizer.destroy();
        }
            
        newMembers = this._convertMembers(newMembers);
        return this.invokeSuper(isc.ToolStrip, "addMembers", newMembers,position,dontAnimate,d,e);
    },
    
    //> @method toolStrip.addFormItem()
    // Add a form item to this toolStrip. This method will create a DynamicForm autoChild with the
    // item passed in as a single item, based on the 
    // +link{formWrapper,formWrapper config}, and add it to the toolstrip
    // as a member.
    // Returns a pointer to the generated formWrapper component.
    // @param formItem (FormItem Properties) properties for the form item to add to this
    //  toolStrip.
    // @param [formProperties] (DynamicForm Properties) properties to apply to the generated
    //  formWrapper component. If passed, specified properties will be overlaid onto the
    //  properties derived from +link{toolStrip.formWrapperDefaults} and
    //  +link{toolStrip.formWrapperProperties}.
    // @param [position] (integer) desired position for the form item in the tools
    // @return (DynamicForm) generated wrapper containing the form item.
    // @visibility external
    //<
    addFormItem : function (formItem, formProperties, position) {
        // Sanity check - if passed a canvas, add it and return.
        if (isc.isA.Canvas(formItem)) {
            this.addMember(formItem, position);
            return formItem;
        }
        
        var wrapper = this.createAutoChild("formWrapper", formProperties);
        wrapper.setItems([formItem]);
        this.addMember(wrapper, position);
        return wrapper;
        
    },
    
    //> @attr toolStrip.formWrapper (AutoChild : null : IR)
    // DynamicForm instance created by +link{addFormItem()} to contain form items for
    // display in this toolStrip. Each time addFormItem() is run, a new formWrapper
    // autoChild will be created, picking up properties according to the standard
    // +link{type:AutoChild} pattern.
    // @visibility external
    //<
    
    //> @attr toolStrip.formWrapperConstructor (String : "DynamicForm" : IRA)
    // SmartClient class for generated +link{toolStrip.formWrapper} components.
    // @visibility external
    //<
    formWrapperConstructor:"DynamicForm",
    
    //> @attr toolStrip.formWrapperDefaults (Object : ... : IR)
    // Default properties to apply to +link{formWrapper} components. Default object
    // is as follows:
    // <pre>
    // { showTitle:false,
    //   numCols:1,
    //   overflow:"visible",
    //   width:1, height:1 }
    // </pre>
    // @visibility external
    //<
    formWrapperDefaults:{
        showTitle:false,
        numCols:1,
        overflow:"visible",
        width:1, height:1
    }
    
    //> @attr toolStrip.formWrapperProperties (Object : null : IR)
    // Properties to apply to +link{formWrapper} components.
    // @visibility external
    //<

});

//> @class ToolStripSeparator
// Simple subclass of Img with appearance appropriate for a ToolStrip separator
// @treeLocation Client Reference/Layout/ToolStrip
//
// @visibility external
//<
isc.defineClass("ToolStripSeparator", "Img").addProperties({
    //> @attr toolStripSeparator.skinImgDir (URL : "images/ToolStrip/" : IR)
    // Path to separator image.
    // @visibility external
    //<
    skinImgDir:"images/ToolStrip/",

    //> @attr toolStripSeparator.vSrc (SCImgURL : "[SKIN]separator.png" : IR)
    // Image for vertically oriented separator (for horizontal toolstrips).
    // @visibility external
    //< 
    vSrc:"[SKIN]separator.png",

    //> @attr toolStripSeparator.hSrc (SCImgURL : "[SKIN]hseparator.png" : IR)
    // Image for horizontally oriented separator (for vertical toolstrips).
    // @visibility external
    //< 
    hSrc:"[SKIN]hseparator.png",

    // NOTE: we keep the default imageType:"stretch", which looks fine for the default image,
    // which is just two vertical lines.
    
    // prevents misalignment if ToolStrip is stretched vertically by members
    layoutAlign:"center",

    initWidget : function () {
        // vertical switch of hSrc/vSrc is handled by StretchImg, but not by Img
        if (isc.isA.Img(this)) this.src = this.vertical ? this.vSrc : this.hSrc;

        this.Super("initWidget", arguments);
    }

});

//> @class ToolStripButton
// Simple subclass of StretchImgButton with appearance appropriate for a ToolStrip button.
// Can be used to create an icon-only button, and icon with text, or a text only button by setting the 
// icon and title attibutes as required.
// @treeLocation Client Reference/Layout/ToolStrip
//<
isc.defineClass("ToolStripButton", "StretchImgButton").addProperties({
    showTitle:true,
    showRollOver:true,
    showDown:true,
    labelVPad:0,
    labelHPad:7,
    autoFit:true,
    src:"[SKIN]/ToolStrip/button/button.png",
    capSize:3,
    height:22
});

