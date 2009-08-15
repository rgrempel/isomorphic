/*
 * Isomorphic SmartClient
 * Version 7.0rc2 (2009-05-30)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 
 


//>	@class	SectionItem
// Header item for a collapsable section in a +link{DynamicForm}.  Each <code>SectionItem</code>
// is associated with a number of other <code>item</code>s in the form, which will be shown or
// hidden as a group when the section is expanded or collapsed.  Clicking on a
// <code>SectionItem</code> will expand or collapse the section.
// <P>
// To make a form where only one section is expanded at a time, set
// +link{DynamicForm.sectionVisibilityMode} to "mutex".
// 
// @treeLocation Client Reference/Forms/Form Items
// @visibility external
// @see DynamicForm.sectionVisibilityMode
// @example formSections
//<

// XXX not integrated with showIf - items whose showIf evaluates to true will show up even if they
// belong to a section that's hidden.  Also not integrated with validation.  Items that are in a
// hidden section during the validation run are not validated on the client.
isc.defineClass("SectionItem", "CanvasItem").addProperties({

    shouldSaveValue:false,

    //> @attr   SectionItem.defaultValue    (string : "Section Header" : IRW)
    // Section items show their <code>value</code> as title text for the section.
    // Therefore the simplest way to specify this text on the form item directly is via the
    // <code>defaultValue</code> attribute.
    // @visibility external
    //<
    defaultValue:"Section Header",

    //> @attr sectionItem.itemIds      (Array of ID: null : IR)
    // IDs of the items that should be considered a member of this section.
    // @visibility external
    //<
  
    //> @attr sectionItem.sectionVisible   (boolean: true : IR)
    // Whether this form section should initially be visible.
    // @deprecated As of SmartClient version 5.5, use +link{sectionItem.sectionExpanded}
    //             instead.
    // @visibility external
    //<
    sectionVisible:true,
    
    //> @attr sectionItem.sectionExpanded   (boolean: true : IR)
    // Whether this form section should be initially collapsed. Can be set programatically
    // via +link{SectionItem.expandSection()} and +link{SectionItem.collapseSection()}.
    // @visibility external
    // @example formSections
    //<
    sectionExpanded: true,

    //> @attr SectionItem.sectionHeaderClass (Classname : "SectionHeader" : [IRA])
    // Name of the Canvas subclass to use as a header that labels the section and allows
    // showing and hiding.  The default class be skinned, or trivial subclasses created to
    // allow different appearances for SectionItems in different forms.
    // Very advanced developers can use the following information to create custom header
    // classes.
    //
    // @visibility external
    //<
    sectionHeaderClass:"SectionHeader",

    //> @attr sectionItem.canCollapse (boolean : true : IR)
    // Whether this section header can be collapsed.  If set false, suppresses open/close state
    // icon
    // @visibility external
    //< 
    canCollapse:true,

    // destroy the (generated) SectionHeader when this item is destroyed
    autoDestroy:true,

    showTitle:false, 
    startRow:true, endRow:true, colSpan:"*",
    
    width:"*",

    height:20
});

//>!BackCompat 2005.6.15
isc.addGlobal("GroupItem", isc.SectionItem);
//<!BackCompat

isc.SectionItem.addMethods({
    init : function () {
        //>!BackCompat 2005.12.22
        // We use sectionExpanded now - if the user override the default of sectionVisible,
        // synch up sectionExpanded
        if (this.sectionVisible == false) this.sectionExpanded = false;
        //<!BackCompat
        this.Super("init", arguments);
    },

    _createCanvas : function () {
        var headerClass = isc.ClassFactory.getClass(this.sectionHeaderClass),
            attributes = {autoDraw: false,
                 section: this,
                 title: this.defaultValue,
                 expanded : this.sectionExpanded,
                 layout: this,
                 height: this.height,
                 canCollapse:this.canCollapse,
                 canDrag: false
            };
            
        if (this.baseStyle != null) attributes.baseStyle = this.baseStyle;
        if (this.printStyleName != null) attributes.printStyleName = this.printStyleName;
        
        // support canvasProperties / defaults for freeform customization
        isc.addProperties(attributes, this.canvasDefaults, this.canvasProperties);
        
        var label = headerClass.create(attributes);
        this.canvas = label;
        this.Super("_createCanvas", arguments);
    },

    // The user is unable to directly interact with the 'value' of a sectionItem
    isEditable : function () {
        return false;
    },
    
    setValue : function (newValue) {
        this.Super("setValue", arguments);
        // NOTE: call getValue(), since if newValue is null, we'll be reverted to default
        if (this.canvas) this.canvas.setTitle(this.getValue());
    },

    sectionHeaderClick : function () {
        this.cellClick();
    },

    // clicking on the sectionHeader toggles visibility of the section
    cellClick : function () {

        if (this.sectionExpanded) {
            this.collapseSection();
        } else {                
            this.expandSection();
        }
    },
 
    //> @method     SectionItem.expandSection()
    // Expands a section, showing all the items contained within the section.
    // @visibility external
    //<
    expandSection : function () {
        // notify the form we're about to expand - allows it to handle mutex sections
        this.form._sectionExpanding(this);

        this._createItems();
        
        if (this.itemIds == null) {
            this.logWarn("sectionItem defined with no items or itemIds");
            return;
        }
        
        for (var i = 0; i < this.itemIds.length; i++) {
            var itemName = this.itemIds[i],
            item = this.form.getItem(itemName);
            
            if (item == null) {
                this.logWarn("expandSection: no such item: " + itemName);
                continue;
            }
            // allow selective showing of sectionItems via showIf:
            // item.show()/hide() normally wipes out the showIf function to ensure member is
            // hidden or shown.  On show we want the showIf preserved.  On hide, we need it
            // wiped out (section hide should be unconditional) but we need to restore it when
            // the section is re-shown
            if (item.showIf == null && item._oldShowIf != null) item.showIf = item._oldShowIf;
            item.show(true);
        }
        
        this.canvas.setExpanded(true);
        this.sectionExpanded = true;
        // ask for layout/sizing recaculation
        this.form._itemsChanged = true;
    },

    _createItems : function () {
        // this.items is expected to be a bunch of form initialization blocks.  This allows
        // lazy initialization of FormItems in a given Section
        if (this.items != null && !this._itemsInstantiated) {
            this.form.addItems(this.items, this.form.items.indexOf(this)+1);
            this.itemIds = [];
            for (var i = 0; i < this.items.length; i++) {
                this.itemIds[i] = this.items[i].getFieldName();
                if (this.itemIds[i] == null) {
                    this.logWarn("unable to include item:"+ this.items[i] + " with no name in section");
                }
            }
            
            // set a flag so we don't re-instantiate the items next time this method is called
            this._itemsInstantiated = true;
        }
    },

    //>EditMode dynamic adding and removing of items
    addItem : function (item, index) {
        this.form.addItems(item, this.form.items.indexOf(this)+1+(index||0));

        this.itemIds = this.itemIds || [];
        this.itemIds.add(item.name);
    },
    removeItem : function (item) {
        var itemName = (isc.isA.Object(item) ? item.name : item);
        this.itemIds.remove(itemName);

        this.form.removeItems(item);
    },
    getItem : function (item) { return this.form.getItem(item) },
    //<EditMode

    //> @method     SectionItem.collapseSection()
    // Collapse a sectionItem, and hide all the items within the section (not including
    // the header).
    // @visibility external
    //<
    collapseSection : function () {
        
        // notify the form we're about to collapse (currently unused)
        this.form._sectionCollapsing(this);
        
        if (this.itemIds == null) {
            // The lack of itemIds is acceptable if we have not yet initialized our "items" array
            if (this.items == null || this._itemsInstantiated) {
                this.logWarn("collapseSection with no sectionItem.itemIds");
                return;
            }
        } else {
            for (var i = 0; i < this.itemIds.length; i++) {
                var itemName = this.itemIds[i],
                    item = this.form.getItem(itemName);
                if (item == null) {
                    this.logWarn("collapseSection: no such item: " + itemName);
                    continue;
                }
                // if this item has a showIf, hold onto it.  We want to hide it unconditionally
                // now, but want the showIf to work on a re-show
                if (item.showIf != null) item._oldShowIf = item.showIf;
                item.hide();
            }
        }
        this.canvas.setExpanded(false);
        this.sectionExpanded = false;
        // ask for layout/sizing recaculation
        this.form._itemsChanged = true;
    }
    
    
});


