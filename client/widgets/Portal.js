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


// Portlet
// ---------------------------------------------------------------------------------------

//> @class Portlet
// Custom subclass of Window configured to be embedded within a PortalLayout.
// @visibility external
// @treeLocation Client Reference/Layout/PortalLayout
//<
isc.defineClass("Portlet", "Window").addProperties({
    showShadow:false,
    
    // enable predefined component animation
    animateMinimize:true,

    // Window is draggable with "outline" appearance by default.
    // "target" is the solid appearance.
    dragAppearance:"outline",
    
    //>@attr portlet.canDrop (boolean : true : IRW)
    // Portlets have canDrop set to true to enable drag/drop reposition within the portalLayout
    // @visibility external
    //<
    canDrop:true,
    
    //>@attr portlet.dragType (string : "Portlet" : IRW)
    // Portlets have their dragType set to "Portlet" - this is required for the PortalLayout
    // handle drag/drop correctly.
    // @visibility external
    //<
    dragType: "Portlet", 

    // resize from any edge
    resizeFrom: null,

    // customize the appearance and order of the controls in the window header
    // (could do this in load_skin.js instead)
    showMaximizeButton: true,
    headerControls:["headerLabel", "minimizeButton", "maximizeButton", "closeButton"],

    // show either a shadow, or translucency, when dragging a portlet
    // (could do both at the same time, but these are not visually compatible effects)
    //showDragShadow:true,
    dragOpacity:30,
    
    //>@attr portlet.showCloseConfirmationMessage (boolean : true : IRW)
    // If true, +link{closeConfirmationMessage} will be displayed before portlets are closed
    // @visibility external
    //<
    showCloseConfirmationMessage:true,
    
    //>@attr portlet.closeConfirmationMessage (string : "Close portlet?" : IRW)
    // Confirmation message to show the user when closing portlets if
    // +link{showCloseConfirmationMessage} is true.
    // @visibility external
    // @group i18nMessages
    //<
    closeConfirmationMessage:"Close portlet?",
    
    //>@method portlet.closeClick()
    // closeClick overridden to show +link{portlet.closeConfirmationMessage} to the user before
    // removing the portlet from the PortalLayout via +link{portalLayout.removePortlet()}
    // @visibility external
    //<
    closeClick : function () {
        if (this.showCloseConfirmationMessage) {
            isc.confirm(this.closeConfirmationMessage, 
                    {target:this, methodName:"confirmedClosePortlet"});
        } else {
            this.confirmedClosePortlet(true);
        }
    },
    
    confirmedClosePortlet : function (value) {
        if (!value) return;
        
        var row = this.parentElement,
            column = row ? row.parentElement : null,
            portalLayout = column ? column.parentElement : null;
        if (!isc.isA.PortalLayout(portalLayout)) this.clear();
        else portalLayout.removePortlet(this);
    },

    maximize : function () {
        var width = this.getVisibleWidth(), 
            height = this.getVisibleHeight(),
            pageLeft = this.getPageLeft(), 
            pageTop = this.getPageTop()
        ;

        this._portletPlaceholder = isc.Canvas.create({
            width: this.getVisibleWidth(),
            height: this.getVisibleHeight()
        });
        this.masterLayout = this.parentElement;
        this.masterLayout.portletMaximizing = true;
        this.masterLayout.replaceMember(this, this._portletPlaceholder, false);
        this.masterLayout.portletMaximizing = false;

        // maximize to the dashboard container, not whole window
        this.setWidth(width);
        this.setHeight(height);

        this.moveTo(pageLeft, pageTop);
        this.bringToFront();
        this.draw();

        this.delayCall("doMaximize");
    },
    

    completeRestore : function () {
        this.Super("completeRestore", arguments);
        this.masterLayout.portletMaximizing = true;            
        this.masterLayout.replaceMember(this._portletPlaceholder, this);
        this.masterLayout.portletMaximizing = false;
        this._portletPlaceholder.destroy();
        delete this._portalPlaceholder;
        delete this.masterLayout;
    },

    doMaximize : function () {
        this.Super("maximize", arguments);
    }
});

// provides a menu for adding a remove columns
isc.defineClass("PortalColumnHeader", "HLayout").addProperties({
    height: 20,
    noResizer: true,

    border:"1px solid #CCCCCC",

    // allow dragging by the header
    canDragReposition: true, 

    initWidget : function () {
        this.Super("initWidget", arguments);

        // header drags the portalColumn
        this.dragTarget = this.portalColumn;

        this.addMember(isc.LayoutSpacer.create());

        this.menu = isc.Menu.create({
            width: 150,
            portalColumn: this.portalColumn,
            data:[
                {title:"Remove Column",
                 click:"menu.portalColumn.destroy()"},
                {title:"Add Column",
                 click:"menu.portalColumn.addNewColumn()"}
            ]
        });

        this.addMember(isc.MenuButton.create({
            title: "Column Properties",
            width: 150,
            menu: this.menu
        }));

        this.addMember(isc.LayoutSpacer.create());
    }
});

// Manages horizontal vs vertical drag and drop such that a drop to the sides is a drop within
// this PortalRow and a drop above or below is a drop within the parent, before or after this
// PortalRow.
// Created whenever a drop occurs in a PortalColumn (even if it's the first drop).
isc.defineClass("PortalRow", "Layout").addProperties({
    defaultResizeBars : "marked",    
    vertical : false,

    overflow: "hidden",
    // leave some space between portlets
    layoutMargin: 3,

    // enable drop handling
    canAcceptDrop:true,
    dropTypes: ["Portlet"],
    
    // change appearance of drag placeholder and drop indicator
    dropLineThickness:2,
    dropLineProperties:{backgroundColor:"blue"},

    // number of pixels you have to be within the left or right border of a portlet for us to
    // show a drop to the left or right of this portlet.  If not within this margin, drop is
    // indicated above or below instead.
    hDropOffset: 15,
    isHDrop : function () {
        var dropPosition = this.getDropPosition();
        var dropOverTarget = this.getMember(dropPosition == 0 ? 0 : dropPosition - 1);
        if (!dropOverTarget.containsEvent() && dropPosition < this.members.length) {
            dropOverTarget = this.getMember(dropPosition);
        }

        var targetOffsetX = dropOverTarget.getOffsetX();
        if (targetOffsetX < this.hDropOffset || targetOffsetX > dropOverTarget.getVisibleWidth() - this.hDropOffset) {
            return true;
        } else {
            return false;
        }
    },

    dropMove : function () {
        if (this.isHDrop()) {
            this.Super("dropMove", arguments);        
            this.parentElement.hideDropLine();
            return isc.EH.STOP_BUBBLING;        
        } else {
            this.hideDropLine();
        }
    },
    
    dropOver : function () {
        if (this.isHDrop()) {
            this.Super("dropOver", arguments);        
            this.parentElement.hideDropLine();
            return isc.EH.STOP_BUBBLING;        
        } else {
            this.hideDropLine();
        }
    },
    

    drop : function () {
        if (this.isHDrop()) {
            this.Super("drop", arguments);
            
            this.parentElement.hideDropLine();
            this.hideDropLine();
            return isc.EH.STOP_BUBBLING;        
        } else {
            this.hideDropLine();
        }        
    },

    membersChanged : function () {
        if (this.members.length == 0 && !this.portletMaximizing) this.destroy();
        // No need to invoke Super - membersChanged is undefined by default
    }

});

//> @class PortalColumn
// Vertical layout based container rendered within a +link{PortalLayout}
// PortalColumns are automatically constructed by the PortalLayout class and will not typically
// be directly instantiated.
// @visibility internal
//<
// The only reason to expose this would be to allow customization of appearance - and it makes
// more sense to do that via attributes on the 

// ---------------------------------------------------------------------------------------

// Offers Drag and drop creation of Portlets, where a new PortalRow is created to manage the
// portlet.
isc.defineClass("PortalColumn", "Layout").addProperties({
    vertical:true,
    defaultResizeBars : "marked",

    //>@attr portalColumn.layoutMargin (integer : 3 : IRW)
    // @include layout.layoutMargin
    //<
    layoutMargin: 3,
    
    
    dragAppearance:"outline",

    // enable drop handling
    canAcceptDrop:true,
    canDrop: true,

    dragType: "PortalColumn",
    dropTypes: ["Portlet"],
    
    // change appearance of drag placeholder and drop indicator
    dropLineThickness:2,
    dropLineProperties:{backgroundColor:"blue"},
    
    showColumnHeader:true,

    initWidget : function () {
        this.Super("initWidget", arguments);
        if (this.showColumnHeader) {
            this.columnHeader = isc.PortalColumnHeader.create({
                title: "Column",
                portalColumn: this
            });
            this.addMember(this.columnHeader);
        }
    },

    addNewColumn : function () {
        this.portalLayout.addColumnAfter(this);
    },

    getDropComponent : function (dragTarget, dropPosition) {
        this.addPortlet(dragTarget, this.getDropPosition());
        // Don't return it - that would cause standard layout add-on-drop behavior 
        // but we've already added the component to a sub-component!
    },
    
    rowConstructor:"PortalRow",
    addPortlet : function (portlet, position) {

        // offset position to be position within rows
        if (this.showColumnHeader) position += 1;
        
        var rows = this.getMembers();
        if (rows == null) position = 0;
        else if (position > rows.length) position = rows.length;
        
        // Copy explicit user-specified height across to the generated row (and always
        // fill that row)
        var userHeight = portlet._userHeight;
        if (userHeight != null) {
            portlet.setHeight("100%");
        }
        
        var dynamicProperties =  // canResizeRows attribute derived from parent
            {showResizeBar:this.canResizeRows};
        if (userHeight != null) {
            dynamicProperties.height = userHeight;
        }
        var portalRow = this.createAutoChild("row",
            dynamicProperties
        );
        
        this.addMember(portalRow, position);
        
        portalRow.addMember(portlet);
    },

    addPortletToExistingRow : function (portlet, rowNum, rowOffset) {

        // offset position to be position within rows
        if (this.showColumnHeader) rowNum += 1;

        var rows = this.getMembers();

        if (rows == null || rows.length <= rowNum) {
            this.addPortlet(portlet);
        } else {
            var portalRow = this.getMember(rowNum);
            portalRow.addMember(portlet, rowOffset);
        }
    },
    
    getDropPosition : function () {
        var dropPosition = this.Super("getDropPosition", arguments);

        // do not allow drop above column header
        if (dropPosition == 0) dropPosition = 1;
        return dropPosition;
    }
});


//>	@class	PortalLayout
// A PortalLayout is a special subclass of Layout designed to display +link{Portlet} windows.
// A PortalLayout displays Portlets in columns and supports drag-drop interaction for moving 
// Portlets around within the PortalLayout. Portlets may be drag-reordered within columns, dragged
// into other columns, or dragged next to other Portlets to sit next to them horizontally
// within a column. 
//
// @visibility external
// @treeLocation Client Reference/Layout
//<
isc.defineClass("PortalLayout", "Layout").addProperties({
    vertical:false,
    
    //> @attr portalLayout.numColumns (integer : 2 : IR)
    // Initial number of columns to show in this PortalLayout. Note that after initialization
    // columns should be added / removed via +link{addColumn()} and +link{removeColumn}
    // @visibility external
    //<
    numColumns:2,
    
    //> @attr portalLayout.getNumColumns()
    // Returns the current number of columns displayed in this PortalLayout.
    // @visibility external
    //<
    // Overridden to return this.getMembers.length. Will have been set up at initialization time.
    getNumColumns : function () {
        return this.getMembers().length;
    },
    
    //> @attr portalLayout.showColumnMenus (boolean : true : IR)
    // Should a menu be shown within each column with options to add / remove columns?
    // @visibility external
    //<
    showColumnMenus:true,
    
    //> @attr portalLayout.columnBorder (string : "1px solid gray" : IRW)
    // Border to show around columns in this PortalLayout
    // @visibility external
    //<
    columnBorder:"1px solid gray",
    
    
    //> @method portalLayout.setColumnBorder()
    // Sets the columnBorder for to the specified value and updates any drawn columns to reflect
    // this.
    // @param columnBorder (string) New border to show around columns
    // @visibility external
    //<
    setColumnBorder : function (columnBorder) {
        this.columnBorder = columnBorder;
        var members = this.members || [];
        for (var i = 0; i < members.length; i++) {
            members[i].setBorder(columnBorder);
        }
    },
    
    //> @attr portalLayout.canResizeColumns (boolean : false : IR)
    // Are columns in this portalLayout drag-resizeable?
    // @visibility external
    //<
    canResizeColumns:false,


    //> @attr portalLayout.canResizeRows (boolean : false : IR)
    // Should vertical drag-resize of portlets within columns be allowed?
    // @visibility external
    //<
    // Can resize rows since we want to resize the entire row of portlets probably
    canResizeRows:false,
    
    // This allows drag/drop reordering within the portal layout
    canAcceptDrop: true,
    dropTypes: ["PortalColumn"],

    // change appearance of drag placeholder and drop indicator
    dropLineThickness:2,
    dropLineProperties:{backgroundColor:"blue"},

    initWidget : function () {
        this.Super("initWidget", arguments);
        // create multiple PortalColumn components
        for (var i = 0; i < this.numColumns; i++) this.addMember(this.makePortalColumn());
    },
    
    // make columns using autoChild logic
    // (Unexposed as yet)
    columnConstructor:"PortalColumn",
    makePortalColumn : function (props) {
        if (props == null) props = {};
        isc.addProperties(props, 
            {portalLayout:this,
             showColumnHeader:this.showColumnMenus,
             border:this.columnBorder,
             showResizeBar:this.canResizeColumns,
             canResizeRows:this.canResizeRows
            });
        
        var portalColumn = this.createAutoChild("column", props);
        return portalColumn;
    },

    //> @method portalLayout.addColumn()
    // Adds a new portal column to this layout at the specified position
    // @param index (integer) target position for the new column
    // @visibility external
    //<
    addColumn : function (index) {
        this.addMember(this.makePortalColumn({
        }), index);
    },
    
    //> @method portalLayout.removeColumn()
    // Removes the specified column from this layout.
    // All portlets displayed within this column will be destroyed when the column is removed.
    // @param index (integer) column number to remove
    // @visibility external
    //<
    removeColumn : function (index) {
        var column = this.members[index];
        if (column != null) column.destroy();
    },
    
    // addColumnAfter is used by the header menus shown within columns if appropriate
    addColumnAfter : function (portalColumn) {
        var targetIndex = this.getMemberNumber(portalColumn)+1;
        this.addColumn(targetIndex);
        
    },
    
    //>@method portalLayout.addPortlet()
    // Adds a +link{Portlet} instance to this portalLayout in the specified position.
    // @param portlet (Portlet) Portlet to add to this layout.
    // @param [colNum] (integer) Column in which the Portlet should be added. If unspecified
    //  defaults to zero.
    // @param [rowNum] (integer) Position within the column for the Portlet
    // @visibility external
    //<
    // Notes: through drag/drop users can also shift portlets to appear next to each other
    // within a column. No API to do this programmatically yet.
    //>EditMode in EditMode users can drag/drop from paletteNodes to add portlets to columns.
    // This will never run through this method so this is not a valid override point to catch every
    // newly added portlet //<EditMode
    addPortlet : function (portlet, colNum, rowNum) {
        if (rowNum == null) rowNum = 0;
        if (colNum == null) colNum = 0;
        
        var column = this.getMember(colNum);
        if (column != null) column.addPortlet(portlet, rowNum);
    },
    
    getColumn : function (colNum) {
        return this.getMember(colNum);
    },
    
    //>@method portalLayout.removePortlet()
    // Removes a +link{Portlet} which is currently rendered in this PortalLayout.
    // Portlet will not be destroyed by default - if this is desired the calling code should
    // do this explicitly.
    // @param portlet (Portlet) portlet to remove
    // @visibility external
    //<
    //>EditMode We *DO* auto-destroy portlets on closeclick in editMode if they were dragged in
    // from a paletteNode //<EditMode
    removePortlet : function (portlet) {
        if (!this.contains(portlet)) return;
        portlet.deparent();
        // Note: the row will self-destruct if appropriate -- see membersChanged handler
    }
});

//>EditMode

// In editmode we need to support drag/drop from palettes
// subclass row and column layouts to support this, and change the default constructors as required

isc.defineClass("EditModePortalRow", "PortalRow");
isc.ClassFactory.mixInInterface("EditModePortalRow", "EditContext");
isc.EditModePortalRow.addProperties({
    getDropComponent : function (dragTarget, dropPosition) {
         // portlet moved
        if (!isc.isA.Palette(dragTarget)) return dragTarget;
    
        // other, drag and drop from palette, create new portlet
        var data = dragTarget.transferDragData(),
            component = (isc.isAn.Array(data) ? data[0] : data);
    
        // create a new portlet
        var newPortlet = isc.Portlet.create({
                autoDraw:false,
                title: component.title,
                items:[ component.liveObject ],
                // destroy ourselves on close!
                confirmedClosePortlet : function (value) {
                    this.Super("closePortlet",arguments);
                    if (value) this.destroy();
                }
        });
        return newPortlet;
    }
});

isc.defineClass("EditModePortalColumn", "PortalColumn");
isc.ClassFactory.mixInInterface("EditModePortalColumn", "EditContext");
isc.EditModePortalColumn.addProperties({
    rowConstructor:"EditModePortalRow",
    
    getDropComponent : function (dragTarget, dropPosition) {
        var dropComponent;
         // portlet moved
        if (!isc.isA.Palette(dragTarget)) dropComponent = dragTarget;
        else {
        
            // other, drag and drop from palette, create new portlet
            var data = dragTarget.transferDragData(),
                component = (isc.isAn.Array(data) ? data[0] : data);
        
            // create a new portlet
            var newPortlet = isc.Portlet.create({
                autoDraw:false,
                title: component.title,
                items:[ component.liveObject ],
                // destroy ourselves on close!
                confirmedClosePortlet : function (value) {
                    this.Super("closePortlet",arguments);
                    if (value) this.destroy();
                }
            });
            dropComponent = newPortlet;
        }
        this.addPortlet(dropComponent, this.getDropPosition());
       // Don't return it - that would cause standard layout add-on-drop behavior 
       // but we've already added the component to a sub-component!
    }
});

isc.PortalLayout.addProperties({
    columnConstructor:"EditModePortalColumn"
});


//<EditMode

