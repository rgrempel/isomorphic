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

 






//>	@class	Menu
//
// The Menu widget class implements interactive menu widgets, with optional icons, submenus,
// and shortcut keys.
// <p>
// A Menu is initialized with an Array of items, specified as menu.data, each of which represents
// one row in the menu's display and specifies the action to take when that menu item is selected.
// <p>
// Generally to create a context menu for a component, provide a Menu instance for the 
// <code>contextMenu</code> property.  Note that some components have special context menu support
// because they have distinct regions or because they have a default set of context menu actions
// available.
// <p>
// If you want a button that pops up a menu when clicked, or a bar of such buttons, see the
// MenuButton and MenuBar classes.
//
// @see attr:Menu.data
// @see attr:Canvas.contextMenu
// @see class:MenuButton
// @see class:MenuBar
//  @treeLocation Client Reference/Control
//  @visibility external
// @example fullMenu
//<






// define us as a subclass of the ListGrid
isc.ClassFactory.defineClass("Menu", "ListGrid");


// add contants
isc.Menu.addClassProperties({
    
    //>@type    MenuFieldID
    // Simple string identifiers for standard menu fields.
    // @value   "icon"  Displays the icon field for the menu. This field contains the items
    //                  specified icon (if there is one), or if the item is checked, the 
    //                  checkmark icon for the item.
    // @value   "title" Displays the item's title 
    // @value   "key" Displays the key field for the menu. This field contains the name or
    //                title of any shortcut keys for this menu item.
    // @value   "subMenu" Field to display the submenu image for items that have a submenu.
    // @visibility external
    //<
    
    // support the developer specifying standard fields via simple names
    // (EG: ["key", "icon", "title"])
    standardFields : {
        icon:"ICON_FIELD",
        title:"TITLE_FIELD",
        key:"KEY_FIELD",
        subMenu:"SUBMENU_FIELD"
    },

    //=	@const	isc.Menu.ICON_FIELD		
	ICON_FIELD:{name:"icon",
                width:25, 
                getCellValue : function (list, item) { return list.getIcon(item) }
    },		
    //=	@const	isc.Menu.TITLE_FIELD		 		
	TITLE_FIELD:{name:"title",	
                 width:"*", 
                 getCellValue : function (list, item) { return list.getItemTitle(item) }
    },		
    //=	@const	isc.Menu.KEY_FIELD		
	KEY_FIELD:{name:"keys",
               width:35, 
               getCellValue : function (list, item) { return list.getKeyTitle(item) }
    },			
    //=	@const	isc.Menu.SUBMENU_FIELD		
	SUBMENU_FIELD:{name:"submenu",
                   width:18, 
                   getCellValue : function (list, item) { return list.getSubmenuImage(item) }
    },	
	
    //>	@classAttr	isc.Menu._openMenus		(attrtype : [] : IRWA)
	//			list of all menus that are currently open
	//<
	_openMenus:[],

	// user-displayable names for modifier key combinations
    // NOTE that on the Mac this is actually generally done with icons.
    //=	@const	isc.Menu.SHIFT
	SHIFT:(isc.Browser.isWin ? "Shift+" : "shift-"),
    //=	@const	isc.Menu.CTRL
	CTRL:(isc.Browser.isWin ? "Ctrl+" : "ctrl-"),
    //=	@const	isc.Menu.ALT	
	ALT:(isc.Browser.isWin ? "Alt+" : "option-"),
    //=	@const	isc.Menu.META
	META:(isc.Browser.isWin ? "Windows+" : "command-")

});


isc.Menu.addProperties({

	//>	@attr	menu.data		(Array of MenuItem : null : IRW)
	// An array of menuItem objects, specifying the menu items this menu should show.
	// @group	data
    // @visibility external
    // @example fullMenu
	//<
    
	//>	@attr	menu.items      (Array of MenuItem : null : IRW)
	// Synonym for +link{menu.data}
	// @group	data
    // @visibility external
	//<
    
    //> @attr menu.target (Canvas : null : IRW)
    // Optional target canvas for this menu. Available as a parameter to dynamic menuItem configuration
    // methods such as +link{MenuItem.checkIf}.
    // <P>
    // If this item has any +link{menuItem.submenu,submenus} the <code>target</code> will be propogated down
    // to these child menus.
    // @visibility external
    //<
    
    //> @attr   menu.fields     (Array of MenuFieldID | Array of ListGridFields : null : IRWA)
    // Array of columns to show for this menu.<br>
    // Standard menu fields may be included by specifying +link{type:MenuFieldID, MenuFieldIDs}
    // directly. Additional custom fields may be specifed as +link{ListGridField} objects.<br>
    // If this property is unset, default behavior will show the
    // +link{type:MenuFieldID, standard set of fields}, with the exception of any that have
    // been suppressed via +link{Menu.showIcons}, +link{Menu.showKeys} and +link{Menu.showSubmenus} 
    // @visibility external
    // @example menuColumns
    //<
    
    //> @object MenuItem
    // Menu items are specified are object literals, not class instances.  For example, when
    // developing in JavaScript, a typical initialization block for a Menu would look like
    // this:
    // <pre>
    // Menu.create({
    //     data: [
    //         {title: "item1", click: "alert(1)"},
    //         {title: "item2"}
    //     ]
    // });
    // </pre>
    // And in XML:
    // <pre>
    // &lt;Menu&gt;
    //    &lt;data&gt;
    //        &lt;MenuItem title="item1" click="alert(1)"/&gt;
    //        &lt;MenuItem title="item2"/&gt;
    //    &lt;/data&gt;
    // &lt;/Menu&gt;
    // </pre>
    //
    // @inheritsFrom ListGridRecord
    // @treeLocation Client Reference/Control/Menu
    // @visibility external
    //<

    //> @attr menuItem.title (HTML : null : IR)
    // The text displayed for the menu item
    // @group menuBasic
    // @visibility external
    //<

    //> @attr menuItem.submenu (Menu : null : IR)
    // A reference to another menu, to display as a submenu when the mouse cursor hovers over
    // this menu item.
    // @group menuBasic
    // @visibility external
    // @example subMenus
    //<

    //> @attr menuItem.canSelectParent (boolean : null : IR)
    // A MenuItem that has a submenu normally cannot be selected, instead clicking or hitting Enter
    // while keyboard focus is on the item shows the submenu.  Setting canSelectParent:true allows
    // a menu item with a submenu to be selected directly.
    // @visibility external
    //<

    //> @attr menuItem.isSeparator (boolean : false : IR)
    // When set to <code>true</code>, this menu item shows a horizontal separator instead of
    // the +link{menuItem.title} text.  Typically specified as the only property of a menu item,
    // since the separator will not respond to mouse events.
    // @group menuBasic
    // @visibility external
    // @example fullMenu
    //<

    //> @attr menuItem.enabled (boolean : true : IR)
    // Affects the visual style and interactivity of the menu item.  If set to
    // <code>false</code>, the menu item will not respond to mouse rollovers or clicks.
    // <p>
    // If you need to set this state dynamically, use +link{menuItem.enableIf} instead.
    // @group menuBasic
    // @visibility external
    //<

    //> @attr menuItem.checked (boolean : null : IR)
    // If true, this item displays a standard checkmark image to the left of its title.  You
    // can set the checkmark image URL by setting +link{menu.checkmarkImage}.
    // <p>
    // If you need to set this state dynamically, use +link{menuItem.checkIf} instead.
    // @group menuIcons
    // @visibility external
    // @example fullMenu
    //<

    //> @attr menuItem.icon (string : null : IR)
    // The base filename for this item's custom icon. If both this property and
    // +link{menuItem.checked} are both specified, only icon specified by this property will be
    // displayed. The path to the loaded skin directory and the skinImgDir are prepended to
    // this filename to form the full URL.
    // <p>
    // If you need to set this state dynamically, use +link{menuItem.dynamicIcon} instead.
    // @group menuIcons
    // @visibility external
    // @example fullMenu
    //<

    //> @attr menuItem.iconWidth (number : 16 : IR)
    // The width applied to this item's icon.  The default of <code>16</code> can be changed
    // for all MenuItems by overriding +link{Menu.iconWidth}.
    // @group menuIcons
    // @visibility external
    //<

	fixedIconWidth: true,
	
    //> @attr menuItem.iconHeight (number: 16 : IR)
    // The height applied to this item's icon.  The default of <code>16</code> can be changed
    // for all MenuItems by overriding +link{Menu.iconHeight}.
    // @group menuIcons
    // @visibility external
    //<

    //> @attr menuItem.keys (KeyIdentifier | Array of KeyIdentifer : null : IR)
    // Shortcut key(s) to fire the menu item action. Each key can be defined as a +link{KeyIdentifier}.
    // To apply multiple shortcut keys to this item, set this property to an array of such key
    // identifiers. 
    //
    // @group menuKeys
    // @visibility external
    //<

    //> @attr menuItem.keyTitle (string : see below : IR)
    // A string to display in the shortcut-key column for this item. If not
    // specified, the first KeyName value in +link{menuItem.keys} will be used by default.
    // @group menuKeys
    // @visibility external
    // @example fullMenu
    //<


    //> @method menuItem.enableIf()
    // Contains the condition that will enable or disable the curent menuItem. The handler must be specified
    // as a function or string of script.  Return false to disable the menuItem or true to enable it
    // <p>
    // If you don't need to set this state dynamically, use +link{menuItem.enabled} instead.
    // <p>
    // May be defined as a +link{group:stringMethods,stringMethod}.
    // <p>
    // @param target (Canvas) +link{Menu.target,target} attribute for the top level menu.
    // @param menu (Menu) +link{Menu,menu} contains the reference to the menu that contains the current item
    // @param item (MenuItem) contains the reference to the current item
    // @return (boolean) Return true to show a checkmark by this menu item
    //
    // @group dynamicMenuItem
    // @visibility external
    // @example menuDynamicItems
    //<


    //> @method menuItem.checkIf()
    // Contains the condition that will check or uncheck the curent menuItem. The handler must be specified
    // as a function or string of script.  Return false to uncheck the menuItem or true to check it
    // <p>
    // If you don't need to set this state dynamically, use +link{menuItem.checked} instead.
    // <p>
    // May be defined as a +link{group:stringMethods,stringMethod}.
    // <p>
    // @param target (Canvas) +link{Menu.target,target} attribute for the top level menu.
    // @param menu (Menu) +link{Menu, menu} contains the reference to the menu that contains the current item
    // @param item (MenuItem) contains the reference to the current item
    // @return (boolean) Return true to show a checkmark by this menu item
    //
    // @group dynamicMenuItem
    // @visibility external
    // @example menuDynamicItems
    //<


    //> @method menuItem.dynamicTitle()
    // Contains the condition that will change the curent items' title when met. The handler must be specified
    // as a function or string of script.  
    // <p>
    // If you don't need to set this state dynamically, use +link{menuItem.title} instead.
    // <p>
    // May be defined as a +link{group:stringMethods,stringMethod}.
    // <p>
    // @param target (Canvas) +link{Menu.target,target} attribute for the top level menu.
    // @param menu (Menu) +link{Menu, menu} contains the reference to the menu that contains the current item
    // @param item (MenuItem) contains the reference to the current item
    // @return (String) the title of this menuItem
    //
    // @group dynamicMenuItem
    // @visibility external
    // @example menuDynamicItems
    //<


    //> @method menuItem.dynamicIcon()
    // Contains the condition that will change the curent items' icon when met. The handler must be specified
    // as a function or string of script.
    // <p>
    // If you don't need to set this state dynamically, use +link{menuItem.icon} instead.
    // <p>
    // May be defined as a +link{group:stringMethods,stringMethod}.
    // <p>
    // @param target (Canvas) +link{Menu.target,target} attribute for the top level menu.
    // @param menu (Menu) +link{Menu, menu} contains the reference to the menu that contains the current item
    // @param item (MenuItem) contains the reference to the current item
    // @return (SCImgURL) the url of this menuItems icon
    //
    // @group dynamicMenuItem
    // @visibility external
    // @example menuDynamicItems
    //<


    //> @method menuItem.click()
    // Executed when this menu item is clicked by the user. The click handler must be specified
    // as a function or string of script.  Return false to suppress the +link{Menu.itemClick()}
    // handler if specified.
    //
    // @param target (Canvas) for a menu shown as a context menu, the Canvas the menu was shown
    //                        on.  Otherwise the +link{Menu} instance of which this
    //                        +link{MenuItem} is a member.
    // @param item   (MenuItem) The +link{MenuItem} that was clicked on.
    // @param menu   (Menu)     The +link{Menu} instance of which this +link{MenuItem} is a
    //                          member.
    // @param [colNum] (number) Index of the column the user clicked. May be null if the
    //                          user activated the menu via a keyboard event.
    // @group menuItemEvents
    // @visibility external
    //<
    
    // Also support menuItem.action, of type "Action"
    // Documentation is bare-bones at the moment. Has to be visible in order to show up
    // in Visual Builder.
    //> @method menuItem.action()
    // Action to fire when this menu is activated.
    // @group menuBasic
    // @visibility external
    //<

    //>	@attr	menu.styleName		(CSSStyleName : "normal" : IRW)
	//			css class for the layer's contents
	//		@group	appearance
	//<
    // don't use the default ListGrid component/body styles, which usually have partial borders 
	styleName:"normal",
    bodyStyleName:"normal",
    //iconBodyStyleName:null,


    //>	@attr   menu.submenuDelay (integer : 200 : [IRWA])
    //  Number of milliseconds to delay before hiding/changing submenu
    //  NOTE: in Windows this is 400ms, but it's also an official Windows Annoyance.
    //<
	submenuDelay:200,

    // shift the submenu this many pixels right of the right border of the parent menu.
    submenuOffset: -4,

    //>	@attr	menu.defaultWidth		(number : 150 : [IRW])
    //          The default menu width.
    //      @visibility external
    //      @group  sizing
    //<
	defaultWidth:150,

    //>	@attr	menu.defaultHeight		(number : 20 : [IRW])
    //          The default menu height.
    //<
	defaultHeight:20,
    
    // enforceMaxHeight:
    // If a menu contains enough items that the height of the menu exceeds the result of
    // this.getMaxHeight() [overridden to default to page height if this.maxHeight is unset]
    // we want to introduce scrollbars so the user can access all menu items without 
    // scrolling the page.
    
    
    //> @attr   menu.enforceMaxHeight (boolean : true : [IRW])
    // If true, don't allow the menu to grow beyond +link{Menu.maxHeight} - or the height of the
    // page if this is unspecified.
    // If menu content exceeds this size, introduce scrollbars to allow the user to access
    // all menu items.
    // @see menu.maxHeight
    // @group sizing
    //<
    enforceMaxHeight:true,

    //> @attr   menu.maxHeight  (number : null : [IRW])
    // Maximum height for this menu before it starts scrolling if +link{Menu.enforceMaxHeight} 
    // is true.
    // If unset defaults to the height of the page
    // @group sizing
    // @see menu.enforceMaxHeight
    //<
    // This is an override - canvas.maxHeight is 10000
    maxHeight:null,
    
	//>	@attr	menu.cellHeight		(number : 20 : [IRW])
	// The height of each item in the menu, in pixels.
	//		@group	sizing
    //      @visibility external
    //      @group  sizing
	//<

	//>	@attr	menu.backgroundColor		(CSScolor : null : IRWA)
	// No background color -- if we had one, it'd be visible below the part of the menu that
    // draws.
	//		@group	appearance
	//<
	backgroundColor:null,

	//>	@attr	menu.overflow		(Overflow : isc.Canvas.VISIBLE : IRWA)
	// Show everything
	//<
	overflow:isc.Canvas.VISIBLE,

    //>	@attr	menu.bodyOverflow		(Overflow : isc.Canvas.VISIBLE : IRWA)
	// Have the body show everything as well
	//<
	bodyOverflow:isc.Canvas.VISIBLE,	
    
    //> @attr menu.arrowKeyAction (string : "focus" : IRWA)
    // Override arrowKeyAction so we focus on menu items when the user hits the up and down
    // arrows, but don't fire the click action unless the user hits space or enter
    //<
    arrowKeyAction:"focus",

    //>	@attr	menu.selectionType		(SelectionStyle : isc.Selection.NONE : IRWA)
    //			menus aren't really selectable as ListGrids are
    //<	
	selectionType:isc.Selection.NONE,
    
    //> @attr   menu.autoDraw       (boolean : false : IRWA)
    //      Menus will not draw on initialization, until they're explicitly show()n
    //  @visibility external
    //<
    autoDraw:false,

    //>	@attr	menu.tableStyle		(string : "menuTable" : IRW)
	// CSS style for the menu table
	//<
	tableStyle:"menuTable",					
	
    //>	@attr	menu.showRollOver		(boolean : true : IRW)
	//			Should we show mouseOver effects for the menu itself?
	//<
	showRollOver:true,	
    
    //>@attr    menu.showFocusOutline (boolean : false : IRW)
    // Don't show the native focus outline around menus.
    // @visibility internal
    //<
    showFocusOutline:false,

    //>	@attr	menu.showAllRecords		(boolean : true : IRW)
	//			Show all records in the menu by default
	//<
	showAllRecords:true,						
                                            
    // allow columns and rows to expand to show full menu item title text
    fixedFieldWidths:false,
    fixedRecordHeights:false,    
    // don't leave a gap for a scrollbar
    leaveScrollbarGap:false,
	
	// CSS styles
    //>	@attr	menu.baseStyle		(CSSStyleName : "menu" : IRW)
	//			CSS style for a normal cell
	//<
	baseStyle:"menu",

    //>	@attr	menu.showHeader		(boolean : false : IRWA)
	//	Don't display a normal header in the menu.
	//<
	showHeader:false,

    //>	@attr	menu.showSortArrow		(SortArrow : isc.ListGrid.NONE : IRWA)
	//		@group	appearance	
	//			Don't show any sorting appearance at all.
	//<
	showSortArrow:isc.ListGrid.NONE,

    //>	@attr	menu.canDrag		(boolean : false : IRWA)
	//			can't drag into menus
	//<
	canDrag:false,

    //>	@attr	menu.canAcceptDrop		(boolean : false : IRWA)
	//			can't drop into menus (hmmmmm)
	//<
	canAcceptDrop:false,

	//>	@attr	menu.canReorderRecords		(boolean : false : IRWA)
	//			can't reorder menu items by dragging
	//<
	canReorderRecords:false,
			
    //>	@attr	menu.useKeys		(boolean : true : [IRW])
    // A boolean indicating whether this menu should use shortcut keys. Set useKeys to
    // false in a menu's initialization block to explicitly disable shortcut keys.
    //      @visibility external
    //<
	useKeys:true,

    //>	@attr	menu.showKeys		(boolean : true : [IRW])
    // A boolean, indicating whether the shortcut key column should be displayed. If
    // showKeys is not set, the menu will show the key column only if one of its items
    // specifies a keys property. If showKeys is false, the keys will not be displayed,
    // but will still function.
    //      @visibility external
    //<
	showKeys:true,
    
    //>	@attr	menu.showIcons		(boolean : true : [IRW])
    // A boolean, indicating whether the checkmark/custom icon column should be displayed.
    // If showIcons is not set, the menu will show the icon column only if one of its items
    // specifies an icon, checked, checkIf, or dynamicIcon property.
    //      @visibility external
    //<
	showIcons:true,
    
    //>	@attr	menu.showSubmenus		(boolean : true : [IRW])
    // A boolean, indicating whether the submenu indicator column should be displayed. If
    // showSubmenus is not set, the menu will show the indicator column only if one of its
    // items specifies a submenu property. If showSubmenus is false, the submenu arrows
    // will not be displayed, but submenus will still appear on rollover.
    //      @visibility external
    //<
	showSubmenus:true,
    
    //>	@attr	menu.submenuDirection (string : "right" : [IRW])
    // Should submenus show up on our left or right. Can validly be set to <code>"left"</code>
    //  or <code>"right"</code>
    //      @visibility external
    //<    
    submenuDirection:"right",

    //>	@attr	menu.showFieldsSeparately		(boolean : false : IRWA)
	// We never clip menu contents, so we have no reason to show fields separately, and it's
    // faster to show them together!
    //<
	showFieldsSeparately:false,

    //>	@attr	menu.emptyMessage		(string : "[Empty menu]" : IRWA)
	//  Message to show when a menu is shown with no items.
    // @visibility external
	//<
	emptyMessage : "[Empty menu]",
    
    //>	@attr	menu.cellSpacing		(number : 0 : IRWA)
	//			No cell spacing.
	//<
	cellSpacing:0,

    //>	@attr	menu.cellPadding		(number : 0 : IRWA)
	//			Put some space between the text and cell boundaries
	//<
	cellPadding:2,							

    //>	@attr	menu.iconWidth		(number : 16 : [IRW])
    //          The default width applied to custom icons in this menu. This is used whenever
    //          item.iconWidth is not specified.
    //      @visibility external
    //<
	iconWidth:16,

    //>	@attr	menu.iconHeight		(number : 16 : [IRW])
    //          The default height applied to custom icons in this menu. This is used whenever
    //          item.iconHeight is not specified.
    //      @visibility external
    //<
	iconHeight:16,

    //>Animation
    //> @attr menu.showAnimationEffect (string : null : [IRWA])
    // When this menu is shown how should it animate into view? By default the menu will just
    // show at the specified size/position. Options for animated show effects are <code>"fade"</code>
    // to fade from transparent to visible, <code>"slide"</code> to slide the menu into view,
    // or <code>"wipe"</code> to have the menu grow into view, revealing its content as it
    // grows. Can be overridden by passing the 'animationEffect' parameter to 'menu.show()'
    // @visibility animation
    //<
    //<Animation
    
    //>	@attr	menu.autoSetDynamicItems		(boolean : true : IRWA)
	//			true == check menu items for an 'enableif', etc. properties and update dynamically
	//		@group	appearance
	//<
	autoSetDynamicItems:true,

    //>	@attr	menu.skinImgDir		(URL : "images/Menu/" : IRWA)
	//		@group	appearance, images
	//		Where do 'skin' images (those provided with the class) live?
	//		This is local to the Page.skinDir
	//<
	skinImgDir:"images/Menu/",				

	//>	@attr	menu.submenuImage		(ImgProperties : {...} : IRWA)
	// Default image to use for the submenu indicator. Valid src, width and height must be
    // specified. See +link{class:ImgProperties} for format.<br>
    // If +link{menu.submenuDirection} is set to <code>"left"</code>, the image src will have
    // the suffix <code>"_left"</code> appended to it.
    //
    // @visibility external
	//<
	submenuImage:{src:"[SKIN]submenu.gif", width:7, height:7},

	//>	@attr	menu.submenuDisabledImage		(ImgProperties : {...} : IRWA)
	// Default image to use for the submenu indicator when item is disabled. Valid src, width and
    // height must be specified. See +link{class:ImgProperties} for format.<br>
    // If +link{menu.submenuDirection} is set to <code>"left"</code>, the image src will have
    // the suffix <code>"_left"</code> appended to it.    
    //
    // @visibility external
	//<
	submenuDisabledImage:{src:"[SKIN]submenu_disabled.gif", width:7, height:7},

    	
	//>	@attr	menu.checkmarkImage		(ImgProperties : {...} : IRWA)
	// Default image to display for checkmarked items. See +link{class:ImgProperties} for format.
    // Valid src, width and height must be specified.
    //
    // @visibility external
	//<
	checkmarkImage:{src:"[SKIN]check.gif", width:9, height:9},

	//>	@attr	menu.checkmarkDisabledImage		(ImgProperties : {...} : IRWA)
	// Default image to display for disabled checkmarked items. See +link{class:ImgProperties}
    // for format. Valid src, width and height must be specified.
    //
    // @visibility external
	//<
	checkmarkDisabledImage:{src:"[SKIN]check_disabled.gif", width:9, height:9},

    
    useBackMask:true,
    
    //>	@attr	menu.submenuInheritanceMask (array  : (various)[] : RWA)
    //  Array of the property names that submenus should inherit from their parents (on creation)
	//<    
    // This is basically all the properties a developer is likely to apply to a menu
    submenuInheritanceMask : [
        // Allow the developer to specify some custom class for submenus (advanced!)
        "submenuConstructor",
        
        "_treeData", // Tree data model for tree menus

        "className",
        "submenuDelay",
        "submenuOffset",
        "defaultWidth",
            
        "backgroundColor",
            
        "tableStyle",
        "showRollOver",
        
        "baseStyle",
        
        "emptyMessage",
        
        "canDrag",
        "canAcceptDrop",
        "canReorderRecords",
        
        "useKeys",
        "showKeys",
        "showIcons",    
        "showSubmenus",
        "submenuDirection",
        "cellPadding",
        "iconWidth","iconHeight",
        "autoSetDynamicItems",
        "skinImgDir",
        "submenuImage","submenuDisabledImage","checkmarkImage","checkmarkDisabledImage",
        "bodyDefaults",
        
        // actual behaviours
    		"itemClick",
    		"canSelectParentItems",

        // updated on the fly
        "childrenProperty",
        
        // A freeform object - can be used for custom overrides that need to percolate down
        // the submenu chain.
        "inheritedProperties"
        
    ],

	//>	@attr	menu.mergeSingleParent		(boolean : true : I)
	//		If the menu items are a tree and the top level has just one item, should
	//		we merge that item with its children in the menu for usability? If mergeSingleParent
	//		is true, this single parent item will be appended to its list of child items, after a
	//		separator, so the top level menu will not be just a single item.
	//<
	mergeSingleParent:true,

	//>	@attr	menu.canSelectParentItems		(boolean : null : IRW)
	//		If true, clicking or pressing Enter on a menu item that has a submenu will
	//		select that item (with standard behavior of hiding the menus, calling click
	//		handlers, etc) instead of showing the submenu.
    // @group selection
    // @visibility external
    // @example treeBinding
	//<
	
	//> @attr menu.autoDismiss (boolean : true : IRW)
	// When true, when a menu item is chosen (via mouse click or keyboard), the menu is not 
    // automatically hidden, staying in place for further interactivity
	// @visibility external
	//<
	autoDismiss:true
});

isc.Menu.addMethods({

//>	@method	menu.initWidget()	(A)
// Initialize this object.
//		@param	[all arguments]	(object)	objects with properties to override from default
//<
initWidget : function () {
    // Show an empty menu as a single disabled item
    this._setUpEmptyMessage();
    
    // Always define menus to be absolutely positioned.  Placing a MenuBar or MenuButton into
    // the document flow via relative positioning makes sense - but placing a Menu as such
    // would be bizarre and probably indicates a mistake.
    this.position = isc.Canvas.ABSOLUTE;

    // Handle menus being bound to hierachichal structured datasources
    
    if (this.dataSource != null && isc.ResultTree) {
        // Don't show the prompt as we load child menu data.
        var tree = this.createResultTree(null,null, {
            showPrompt:false,
            dataProperties: {autoOpenRoot: false}
        });
        // If we're loading all the data upfront, do this now rather than on the first 
        // menu-show
        if (this.loadDataOnDemand == false) {
            tree.loadChildren(tree.getRoot(), {caller:this, methodName:"treeDataLoaded"});
        }
        this.data = tree;
    }
    
    // make items a synonym for data
    if (this.data == null && this.items != null) this.data = this.items;

	// if items were specified as a tree or resultTree, skip over the root
	// (check for isc.Tree first to eliminate dependency)
	if (isc.Tree && isc.isA.Tree(this.data)) {

        // hang onto the Tree object since we set this.data to an Array of nodes
        this._treeData = this.data;

        // Hang onto the childrenProperty, so we can easily tell which menu should
        // have auto-generated submenus
        this.childrenProperty = this.data.childrenProperty;
        
		// if only one top-level item and it has children, we can merge it with its children 
        // for usability.
        
		var topLevel = this.data.getChildren(),
            mergeSingleParent = this.mergeSingleParent && !isc.isA.ResultTree(this._treeData) &&
                                topLevel.length == 1 && this.data.hasChildren(topLevel[0]);
                                
		if (mergeSingleParent) {
			var topLevelItem = topLevel[0];
			// make a copy of the children array so we don't munge the data model
			this.data = this.data.getChildren(topLevelItem).duplicate();
			// add a separator between the children and the original top-level item
			this.data.add({isSeparator:true});
			// copy the top-level item, minus children
			var copiedItem = {};
			isc.addProperties(copiedItem, topLevelItem);
            // clear out the 'children property' on the merged item, so we don't get another
            // submenu
			copiedItem[this.childrenProperty] = null;
			// append it to the new top-level list
			this.data.add(copiedItem);
			
		// otherwise just start with the top level of the tree
		} else {
			
//            this.data = topLevel
            this.data = null;
		}

        // submenus will be passed a treeParentNode - the node whose children this menu will
        // display.  It's also possible to have a Menu show a portion of a Tree by passsing a
        // treeParentNode in as part of the constructor.
	}
//    alert(this.data);

	this.Super(this._$initWidget);
	
	// if the fields are not set, set with the class default items
	if (!this.fields) {
        // this flag can be used when creating submenus to detect the case where we have
        // explicitly specified fields that should be copied down to our children
        this._standardFields = true;
		this.fields = [];
		
        var submenusOnLeft = (this.submenuDirection == this._$left);
        if (submenusOnLeft && this.showSubmenus) this.fields.add(isc.Menu.SUBMENU_FIELD);
		if (this.showIcons) this.fields.add(isc.Menu.ICON_FIELD);
		this.fields.add(isc.Menu.TITLE_FIELD);
		if (this.showKeys) this.fields.add(isc.Menu.KEY_FIELD);
		if (!submenusOnLeft && this.showSubmenus) this.fields.add(isc.Menu.SUBMENU_FIELD);
	} else {
        this._standardFields= false;
        for (var i = 0; i < this.fields.length; i++) {
            var field = this.fields[i];
            if (isc.isA.String(field)) {
                if (isc.Menu.standardFields[field] != null) {
                    // Menu.standardFields is a mapping from the simple field name "title" etc
                    // to the name of the constant containing the field definition
                    this.fields[i] = isc.Menu[isc.Menu.standardFields[field]];
                } else {
                    this.logWarn("Menu field specified as :" + field + ". This is not a recognized standard field name");
                    this.fields.removeAt(i);
                    i -= 1;
                }
            }
        }
    }
		
	if (this.iconBodyStyleName != null && this.fields != null) {
		for (var i = 0; i < this.fields.length; i++) {
			if (this.fields[i] == "icon" || this.fields[i] == isc.Menu.ICON_FIELD) {
				this.bodyStyleName = this.iconBodyStyleName;
				break;
			}
		}
	}

    // If you place an image without text into a table cell safari aligns it to the top of
    // the cell.  Providing align=BOTTOM forces the image into the center of the cell.
    if (isc.Browser.isSafari) {
        isc.addProperties(this.submenuImage, { align: "BOTTOM"});
        isc.addProperties(this.submenuDisabledImage, { align: "BOTTOM"});
    }

	// set up key listening if necessary
	if (this.useKeys) this.setUpKeyListening();

    // tree mode
    if (this._treeData) {
        if (!this.treeParentNode) this.treeParentNode = this._treeData.getRoot();
        this.setTreeNode(this.treeParentNode);
    }
},

// Override setFields - if called with custom fields set the _standardFields flag to false
setFields : function (fields, a,b,c,d) {
    if (fields && (fields != this.fields)) {
        this._standardFields = false;
    }
    this.invokeSuper(isc.Menu, "setFields", fields, a,b,c,d);
},

// If we're loading our data up-front, this is notification that our data has been loaded.
treeDataLoaded : function () {
    // call the standard treeDataArrived method - this handles showing the data in the menu
    
    this.treeDataArrived(this._lastNode);
},

setTreeNode : function (node) {
    var loadState = this._treeData.getLoadState(node);
    this._lastNode = node;

    // If the children array is already loaded ensure it's visible in the menu as items
    if (loadState == isc.Tree.LOADED) {
        this.treeDataArrived(node);

    // Otherwise, if we've never kicked off a fetch for the data (first time this menu shown)
    // do so now.
    } else if (loadState != isc.Tree.LOADING) {
        this._treeData.loadChildren(node, this.getID()+".treeDataArrived(node)");
        this._loadingTreeNode = true;
        this.setData(null); // show loading message instead of current menu
    }
},

// called through from ResultTree whenever we get tree data from the server.
treeDataArrived : function (node) {
    delete this._loadingTreeNode;
    if (node == this._lastNode) {
        this.setData(this._treeData.getChildren(node));
        // Note: only show the submenu if we're still visible - the user may have made a
        // selection before the data came back.
        if (this.masterMenu && this.masterMenu.isVisible()) 
            this.masterMenu.placeSubmenu(node, this);
    }
},

getEmptyMessage : function () { 
    if (this._loadingTreeNode) return this.loadingDataMessage;
    return this.Super("getEmptyMessage", arguments);    
},

isEmpty : function () {
    if (this._loadingTreeNode) return true;
    return this.Super("isEmpty", arguments);    
},


// Ensure that the empty message shows up like a disabled menu item
_setUpEmptyMessage : function () {
    isc.addProperties(this, {
        emptyMessageTableStyle : this.tableStyle,
        emptyMessageStyle : this.baseStyle + isc.GridRenderer.standardStyleSuffixes[4]
    });
},


//>	@method menu._observeData() (A)
//		Override the _observeData method to set up the enableIf etc. functions
//		 for the menu items.
//	@param	data	(object)		new data to be observed
//<
_observeData : function (data, a,b,c,d) {

    // If we're working with a tree-menu, this.data will just be the array of children
    // which is not expected to change directly.
    // Therefore in this case observe this._treeData instead.
    var alreadyObserving;
    if (this._treeData) {
        // Note: For tree submenus, setData() is used to populate the menu with
        // data, in response to dataArrived(), or a change of parent node.
        // setData() falls through to _observeData(). Therefore we may already be observing
        // the tree-menu data - if so, avoid calling the method to observe the data again.
        alreadyObserving = this.isObserving(this._treeData, "dataChanged");
        data = this._treeData;
    }
    if (!alreadyObserving) this.invokeSuper(isc.Menu, "_observeData", data, a,b,c,d);

	// initialize the enable/disable function if necessary
	if (this.autoSetDynamicItems) {
		this._makeDynamicItemsFunction();
	}
},

//>	@method menu._ignoreData() (A)
//		Override the _ignoreData method to clear the enableIf, etc. function.
//	@param	data	(object)		old data to be ignored
//<
_ignoreData : function (data) {
	this.Super("_ignoreData", arguments);
	// initialize the enable/disable function if necessary
	if (this.autoSetDynamicItems) {
		// get rid of the setDynamicItems function
		delete this.setDynamicItems;
	}
},


// Event handling
// --------------------------------------------------------------------------------------------


//>	@method	menu.rowClick()	(A)
//		Handle the rowClick pseudo-event in the menu. Selects the appropriate menu item
//		@return	(boolean)	false == stop processing this event
//		@group	event handling
//<
rowClick : function (record, rowNum, colNum) {
	this.Super("rowClick", arguments);
    this.selectMenuItem(rowNum, colNum);
},

//>	@method	menu.selectMenuItem()	(A)
// Handle a selected menu item, either through a menu key or clicking on the item itself.
// <p>
// Calls item.click() or itemClick() for the selected item
//		@param	item		(item | number)		pointer to or number of the item that was clicked on
//      @param  colNum      (number)    Index of column that recieved the click. May be null if
//                                      the item was selected via keyboard selection.
//		@return	(boolean)	false == stop processing this event
//<
selectMenuItem : function (item, colNum) {
	if (item == null) item = this.getEventRecordNum();
	// normalize item to the item pointer in case a number was passed in
	item = this.getItem(item);
    	
	var returnValue = true;
	
	// if the item was not found, bail
	if (item == null || !this.itemIsEnabled(item)) {
		isc.Menu.hideAllMenus();
		return false;
	}

	// if the item has a submenu or children, and parent selection is not
	// enabled, show the submenu
	// (clear the submenu timer and hide any other submenu first)
	if (this.hasSubmenu(item) && !this.canSelectParentItems && !item.canSelectParent) {
		if (this.submenuTimer) this.submenuTimer = isc.Timer.clear(this.submenuTimer);
		if (this._openItem != item) this.hideSubmenu();
		this.showSubmenu(item);
		// return false so subclasses know not to do their thing
		return false;
	}

	// hide all menus automatically 
    
	// get the autoDismiss property from the top level menu or the menu item
	var rootMenu = this;
	while (rootMenu._parentMenu) {
		rootMenu = rootMenu._parentMenu;	
	}
	if (rootMenu.autoDismiss && (item.autoDismiss || item.autoDismiss == null) ) {
		isc.Menu.hideAllMenus();	
	}
	

	// if the item that was clicked on has an action, or click handler, call that
    if (item.action) {
        // Actions are a particular format of objects.
        // Also handle being pased an action string expression
        if (!isc.isA.Function(item.action)) {
            isc.Func.replaceWithMethod(item, "action", "");
        }
        if (item.action() == false) return false;
            
    } 
    
    if (item.click) {
		// if the handler was defined as a string, convert it to a function
		if (!isc.isA.Function(item.click)) {
			isc.Func.replaceWithMethod(item, "click", "target,item,menu,colNum");
		}
		var target = (this.target ? this.target : this);
		// now call the handler -- return whether or not it returned false
		returnValue = item.click(target,item,this,colNum);
	} 
    if (returnValue != false) {
    	// otherwise call the generic itemClick() handler
		returnValue = this.itemClick(item, colNum);
	}
	// refresh the row after click if autoDismiss is false
	if (!(rootMenu.autoDismiss && (item.autoDismiss || item.autoDismiss == null))) {
		this.refreshRow(this.getRecordIndex(item));	
	}
	return returnValue;
},

//>	@method	menu.mouseOver()	(A)
//          special mouseOver handler for submenus - simulates mouse over behavior for the 
//          appropriate parent menu item.  Ensures that item is hilited and this submenu 
//          won't be hidden by the parent menu's submenuTimer
//		@group	events, hiliting
//
//<
mouseOver : function () {
    // Make sure the appropriate parent menu item is hilighted
    // Will only be fired if necessary
    var parentMenu = this._parentMenu;
    if (parentMenu && parentMenu.body.lastOverRow != this._parentItemNum){
        // Prevent this submenu from being killed by the parent's submenuTimer
        if (parentMenu.submenuTimer) parentMenu.submenuTimer = isc.Timer.clear(parentMenu.submenuTimer);

        // Update the parent's hilight to point to the appropriate row
        parentMenu._hiliteRecord(this._parentItemNum);
    }
    
},

//>	@method	menu.rowOver()	(A)
// When the mouse goes over a row, start the submenu timer to show the appropriate submenu
//		@group	events, hiliting
//<
rowOver : function (row, field) {
    if (this.submenuTimer) this.submenuTimer = isc.Timer.clear(this.submenuTimer);
	this.submenuTimer = isc.Timer.setTimeout({target:this,method:this.changeSubmenu}, 
                                             this.submenuDelay);
},

//>	@method	menu.itemClick()    ([A])
//          Executed when a menu item with no click handler is clicked by the user. This
//          itemClick handler must be specified as a function. It is passed an item parameter that
//          is a reference to the clicked menu item.
//
//      @visibility external
//		@param	item		(object)		pointer to the item in question
//      @param  [colNum]  (number)  Index of the column clicked by the user. May be null if
//                                  this menu item was activated in response to a keyboard event.         
//
//		@return	(boolean)	false if event processing should be stopped, true to continue
//      @example menuColumns
//<
itemClick : function (item, colNum) {
	// don't do anything by default
},

// show / hide submenus on right/left click [depending on which side they're being shown on] 
getShowSubmenuKey : function () {
    return this.submenuDirection == "right" ? "Arrow_Right" : "Arrow_Left";
},

getHideSubmenuKey : function () {
    return this.submenuDirection == "right" ? "Arrow_Left" : "Arrow_Right";    
},

//>	@method	menu.bodyKeyPress()
// Handler for keypress events called from this.body.keyPress - overridden to allow arrow 
// key navigation of submenus, proper handling of "Enter" to select a menu item, 
// and "Escape" to hide the menu.
//		@group	events
//
//		@return	(boolean)	false == stop processing this event
//<
bodyKeyPress : function (event, eventInfo) {
    var keyName = isc.EventHandler.lastEvent.keyName;
    
    // Navigate submenus with arrow left / arrow right
    if (keyName == this.getHideSubmenuKey()) {
        if (this._parentMenu != null) {
            this._parentMenu.hideSubmenu();
            this._parentMenu.focus();
            return false;
        }
    } else if (keyName == this.getShowSubmenuKey()) {
        var item = this.getItem(this.getFocusRow());

        if (this.hasSubmenu(item)) {
            this.changeSubmenu();
            // Note: Windows handling of submenus seems to be that if you open one via keyboard
            // the first item is hilighted by default, otherwise no item is hilighted.
            // therefore hilight first item here, but not in changeSubmenu()
            this._open_submenu._navigateToNextRecord(1);
            return false;   // stop propogation
        }
        
    // hide the menu if escape is hit  
	
    } else if (keyName == "Escape") {
		if (this._parentMenu != null) {
			this._parentMenu.hideSubmenu();
			this._parentMenu.focus();
		} else {
	        isc.Menu.hideAllMenus();
		}
        return false;
    
    // override keypress on "Enter" to do a single record click rather than a double
    // (which has no meaning for menus)    
    } else if (keyName == "Enter") {
        return this._generateFocusRecordClick();
		// hilite the first item?
    }
    
    return this.Super("bodyKeyPress", arguments);
},

// Override _navigateToNextRecord() to close the menu when the user attempts to select record
// '-1'. (IE: They have pressed the Arrow Up key while the first item in the menu is hilighted)
_navigateToNextRecord : function (step) {

    var newSelectionIndex = this.getFocusRow();

    // default to starting at zero
    if (newSelectionIndex == null) newSelectionIndex = 0;

    // If we're attempting to navigate to the previous item in the menu, check whether we'll
    // iterate up off the top of the menu.    
    if (step == -1) {
        do {
            newSelectionIndex += step;
            
            // hide the list if you go off the top 
            // (will focus back in whatever previously had focus)            
            if (newSelectionIndex < 0) {
                this.hide();
                return false;   // cancel event propogation
            }
            
        } while (!this.itemIsEnabled(newSelectionIndex))
    }
    
    return this.Super("_navigateToNextRecord", arguments);
},

// Showing and hiding
// --------------------------------------------------------------------------------------------
//>	@method	menu.show()
// Show the menu, hiding other visible menus as appropriate.
// <p>
// Sets up to dismiss on any click outside the menu.
//		@group	visibility
//<
//>Animation
// @param animationEffect (string) Allows the user to specify an animation effect for showing
// the menu - valid options are <code>"fade"</code>, <code>"slide"</code> and <code>"wipe"</code>
// If no value is passed for this parameter, checks <code>this.showAnimationEffect</code>
//<Animation

show : function (animationEffect) {
    
    // If the menu is currently offscreen, shift it back to last onscreen position before
    // showing.
    if (this._isOffscreen) {
        this.moveTo(this._onscreenPosition[0], this._onscreenPosition[1]);
        this._isOffscreen = null;
    }

    //>Animation
    // Note: if an animation effect was passed in we call this.animateShow(), which will
    // call this method again - that's why we need the _animating parameter
    if (animationEffect == null) animationEffect = this.showAnimationEffect;
    var shouldAnimate = !this._animating && (animationEffect != null) && 
                                            (animationEffect != "none");
    if (shouldAnimate) {
        this._animating = true; 
        this.animateShow(animationEffect, "this._showComplete()")
        return;
    } 
    //<Animation
    
    // reset the enabled and title of menu items if necessary
    if (this.setDynamicItems) this.setDynamicItems()

    // if the menu hasn't been drawn, draw it now
    if (!this.isDrawn()) {
        // Pass in the 'showing' parameter to avoid draw() calling show again.
        this.draw(true);
    }
    
    // ensure that when we get hidden, we focus back into whatever previously had focus
    this.body.focusOnHide = isc.EH.getFocusCanvas();    
    
    // if this is the first menu being opened, show the click mask
    if (isc.Menu._openMenus.length == 0) {
        isc.Menu._menusClickMask = isc.EH.showClickMask("isc.Menu.hideAllMenus()", true);
    }
    
    // bring this menu above everything else
    this.bringToFront();
    
    // now add this menu to the list of _openMenus so it can be hidden automatically
    isc.Menu._openMenus.add(this);

	this.Super("show", arguments);
    
    if (!this._animating) this._showComplete();
},


_showComplete : function () {
    if (this._animating) delete this._animating;

    
    if (isc.Browser.isMoz) {
        this.getClipHandle().offsetLeft;
    }
    // grab focus for keyboard handling
    this.body.focus();
},


//>	@method	menu.hide()
//			hide this menu.
//          Overridden to clear all selections and clear open submenu pointers
//		@group	visibility
//
//<
hide : function () {

    // no-op if no change in visibility
    if (this.visibility == isc.Canvas.HIDDEN) return;
    
	this.Super("hide", arguments);
    
    // We occasionally get menus that are as taller than the page (introducing v-scrollbars).
    // In this case we don't want the height of the hidden menu to continue to effect the 
    // page scroll height, so shift offscreen when hiding.
    this._moveOffscreen();
    
    // clear hilite, as menus should always start with no hilite
	this.clearLastHilite();
    
    this._lastRecordClicked = null; 

    if (this._openItem) delete this._openItem;
    if (this.submenuTimer) isc.Timer.clearTimeout(this.submenuTimer);
    
    
},

// Context menu handling
// --------------------------------------------------------------------------------------------

//>	@method	menu.showContextMenu()
// Show this menu as a context menu, that is, immediately adjacent to the current mouse position.
//
// @visibility external
//
//		@group	visibility
//		@return	(boolean)	false == stop processing this event
//<
showContextMenu : function (event) {
    
    if (event && (event.target == this || (this.body && event.target == this.body))) {
        if (this.body) {
    
            
            if (isc.Browser.isSafari) {
                this.body._mouseDownRow = this.getEventRow(); 
                this.body._mouseDownCol = this.getEventColumn();
            }
     
            this.body.click();
        }
        return false;
    }
    
    var target;
    // if we were explicitly passed a target canvas, use it
    if (isc.isA.Canvas(event)) target = event;
    // otherwise, if passed an event, use the target of the event
    if (event != null && event.target != null) target = event.target;
    
    if (target != null) this.target = target;

    this.positionContextMenu();
    this.show();

	return false;
},



getMaxHeight : function () {
    if (this.maxHeight != null) return this.maxHeight;
    return isc.Page.getHeight() - this.getScrollbarSize();
},

_showOffscreen : function () {
    if(!this.isDrawn()) {
        // draw, but avoid the call to 'show()' since we don't want to focus on this widget
        this.setVisibility(isc.Canvas.HIDDEN);
        this.draw();
    }
    
    this.setVisibility(isc.Canvas.VISIBLE);

    this._moveOffscreen();
    
    if (this.isDirty() || this.body.isDirty()) this.redraw();
    
    if (this._overflowQueued) this.adjustOverflow();
    
    // If we're enforcing max height, handle this now - introducing scrollbars if necessary
    // (Can skip if we've already calculated the height and the content / sizing of the
    // menu has not changed).
    if (!this._heightCalculated && this.enforceMaxHeight) {
        // If we're currently showing scrollbars, reset to overflow visible and default sizing
        // to ensure that they're necessary
        
        if (this.overflow != isc.Canvas.VISIBLE) {
            this.leaveScrollbarGap = false;
            this.setOverflow(isc.Canvas.VISIBLE);
            this.setHeight(this.defaultHeight);
            this.setWidth(this._origWidth || this.defaultWidth);
            this.adjustOverflow();
        }
        var height = this.getVisibleHeight(),
            width = this.getVisibleWidth(),
            maxHeight = this.getMaxHeight();
        if (this.overflow == isc.Canvas.VISIBLE && height > maxHeight) {
            this.leaveScrollbarGap = true;
            this.setHeight(maxHeight);
            this._origWidth = this.getWidth();  // remember the user-specified width so we can
                                                // set back to it if we have fewer items
            this.setWidth(this.getVisibleWidth() + this.getScrollbarSize())
            this.setOverflow(isc.Canvas.AUTO);
            this.adjustOverflow();
        }
        this._heightCalculated = true;
    }
    
    this.setVisibility(isc.Canvas.HIDDEN);
},

// If our set of items changes (due to a setData() call, or a change to our data object)
// we will have to determine whether we exceed this.maxHeight (and thus need scrollbars)
// or not.
// For tree data, each generated submenu observes the main tree, so this 
// method will fire for every submenu when the tree data changes, (causing a redraw of every
// visible menu to show the new data).
dataChanged : function (a,b,c,d) {
    // for tree submenus, if our parent node has been removed, self-destruct.
    // Note: We re-use tree submenus for each folder at any level of a tree.
    // This means that if our parent node has been removed from the tree, this menu is not
    // necessarily obsolete - it could be re-used for other folder nodes in the parent folder.
    // Rather than destroy() ing the submenu here, we could just hide it, but this would mean
    // in the case where there are no other folder nodes in the parent folder we'd end up with
    // orphaned menus that would never get destroyed.
    if (this._treeData && this._lastNode != null) {
         if (!this._treeContains(this._lastNode)) {
            // Note this will also fire for any submenus of this menu
            this.destroy();
            return;
        }
    }

    var rv = this.invokeSuper(isc.Menu, "dataChanged", a,b,c,d);
    delete this._heightCalculated;

    return rv;
},

_treeContains : function (node) {
    while (node) {
        if (this._treeData.isRoot(node)) return true;
        node = this._treeData.getParent(node);
    }
    return false;
},

//> @method Menu.setData()
// Change the set of items to display in this menu
// @param items (array of MenuItems) new items for this menu
// @group data
// @visibility external
//<
setData : function (a,b,c,d) {
    var rv = this.invokeSuper(isc.Menu, "setData", a,b,c,d);
    delete this._heightCalculated;
    return rv;
},

//> @method Menu.setItems()
// Synonym for +link{Menu.setData()}.
// @param items (array of MenuItems) new items for this menu
// @group data
// @visibility external
//<
setItems : function (a,b,c,d) {
    return this.setData(a,b,c,d);
},

//>EditMode add a method to retrieve menu items by a "name" property, discoverable
// by type.
getMenuItem : function (name) {
    return isc.Class.getArrayItem(name, this.data, "name");
},
//<EditMode

// hang a flag on this item when we move it offscreen so we can tell if we need to reposition
// on show.
_moveOffscreen : function () {
    if (this.parentElement != null) return;
    // No op if we're already offscreen
    if (this._isOffscreen) return;
    
    this._onscreenPosition = [this.getLeft(), this.getTop()];
    this.moveTo(null, -9999);
    
    this._isOffscreen = true;
},

// Override moveBy: If the menu has been moved offscreen, and is being moved again, clear
// out the 'isOffscreen' flag, so we don't incorrectly reposition to original onscreen position
// on show().

moveBy : function () {
    var returnVal = this.Super("moveBy", arguments);    
    if (this._isOffscreen) this._isOffscreen = false;
    return returnVal;
},

// Override resizesBy: If we have calculated the drawn size of the menu 
// (potentially with scrollbars) and the developer changes the specified height or width
// we're going to have to recalculate when we next show the menu.
resizeBy : function (dX, dY, a,b,c,d) {
    if ((dX != null && dX != 0) || (dY != null && dY != 0)) delete this._heightCalculated;
    return this.invokeSuper(isc.Menu, "resizeBy", dX,dY, a,b,c,d);
},

//>	@method	menu.hideContextMenu()
// Hide the context menu - alias for hide()
// @group	visibility
// @visibility external    
//<
hideContextMenu : function () {
	this.hide();
},

// place the context menu immediately adjacent to the mouse pointer, keeping it onscreen
positionContextMenu : function () {
        
    this._showOffscreen();        

    // place the menu immediately adjacent to the mouse pointer, keeping it onscreen
    
	var event = isc.EH.getLastEvent();
    this.placeNear(event.x, event.y);
        
},

// Menu items and submenus	
// --------------------------------------------------------------------------------------------


//>	@method	menu.getItem()
// Get a particular MenuItem by index.
// <P>
// If passed a MenuItem, returns it.
//
// @param item (int) index of the MenuItem
// @return (MenuItem) the MenuItem, Pointer to the item, or null if not defined
// @group menuItems
// @visibility external
//<
getItem : function (item) {
    return isc.Class.getArrayItem(item, this.data, "name");
},

//>	@method	menu.getItemNum()
// Given a MenuItem, return it's index in the items array.
//
// @param item (MenuItem | int)	index of the item or MenuItem itself
// @return (int) index of the item, or -1 if not defined.
// @group menuItems
// @visibility external
//<
getItemNum : function (item) {
    return isc.Class.getArrayItemIndex(item, this.data, "name");
},

//> @method menu.getItems()
// Get all the MenuItems in the current menu as an Array.
//
// @return (Array of MenuItem)
// @visibility external
//<
getItems : function () {
    return this.getData();
},

//>EditMode
addItem : function (item, index) {
    if (index == null) index = this.data.getLength();
    this.data.addAt(item, index);
    this.markForRedraw();
},
removeItem : function (item) {
    this.data.remove(item);
    this.markForRedraw();
},
//<EditMode

//>	@method	menu.changeSubMenu()	(A)
// Hide the last open submenu, if any, and show the submenu for this.body.lastOverRow, if
// specified
//		@group	visibility
//<
changeSubmenu : function () {
    
    var overItem = this.getItem(this.body.lastOverRow);

    // If the menu to be shown is already showing, just bail.
    if (overItem && this._openItem == overItem) return;
    
    this.hideSubmenu();
	if (overItem != null) this.showSubmenu(overItem);
},

// Helper method to determine whether an item has a submenu
hasSubmenu : function (item) {
    if (!item) return false;
    if (item.submenu) return true;
    if (isc.isA.Tree(this._treeData)) {
        // If this is a client-only tree we can avoid showing submenus if the node
        // has no children.
        return (this._treeData.isFolder(item) && 
                ((isc.ResultTree && isc.isA.ResultTree(this._treeData)) || 
                 this._treeData.hasChildren(item)));
    }
    
    return false;
},


//>	@method	menu.showSubmenu()	(A)
// Show the submenu for the specified item, if it has one.
// <P>
// Normally triggered automatically by user interaction.
//
//		@group	visibility
//		@param	item		(MenuItem | number)		the item in question, or it's index
// @visibility external
//<
showSubmenu : function (item) {
    var submenu = this.getSubmenu(item);
    if (!submenu) return;

    this.placeSubmenu(item, submenu);    
},

//> @method menu.getSubmenu()  (A)
// Get the submenu for a particular menu item.
// <P>
// Override to provide dynamic generation of submenus.
// 
// @param	item		(MenuItem | number)		the item in question, or it's index
// @return (Menu) the submenu
// @visibility external
//<

getSubmenu : function (item) {

	// normalize item to the item pointer in case a number was passed in
	item = this.getItem(item);
    
    // if there's no submenu (or no children in tree-mode), bail
    if (!this.hasSubmenu(item)) return;
    

    // Force the submenu to inherit most developer defined UI properties 
    // from this menu.
    // Note: This properties block will be applied to the submenus that we generate here, 
    // but not to a submenu that's already a Menu widget
    var properties = isc.applyMask(this, this.submenuInheritanceMask);
    // Have submenus inherit any custom fields (need to duplicate rather than just inherit
    // the fields array)
    if (!this._standardFields) {
        var fields = [];
        for (var i = 0; i < this.fields.length; i++) {
            // do a deep duplicate of our fields so we don't manipulate our
            // submenus' field objects by accident
            fields[i] = isc.addProperties({}, this.fields[i]);
        }
        properties.fields = fields;
    }
    
	var submenu = item.submenu;
    // tree mode
    if (!submenu) {
        // item is a parent in a Tree; create a submenu based on the Tree children of this
        // parent.
        
        var rootMenu = (this._rootMenu || this),
            menuLevel = (rootMenu == this ? 0 : this._menuLevel);
        
        if (!rootMenu._submenus) rootMenu._submenus = [];

        //>DEBUG
        this.logDebug("RootMenu:" + rootMenu.getID() + ", submenus:" + 
                      rootMenu._submenus + ", Level:" + menuLevel);
        //<DEBUG
        
        // check if we've already created a submenu at this level
        submenu = rootMenu._submenus[menuLevel];
        if (!submenu) {

            // create the menu
            isc.addProperties(properties, {
            	ID:(rootMenu.getID() + "_childrenSubMenu_" + menuLevel),
                _rootMenu:rootMenu,
                _menuLevel:menuLevel + 1,   // it's submenu will be one level below itself
            	autoDraw:false,
                // for treeMenus, pass the parentNode to the submenu so it can initiate a fetch
                // for the relevant node
                treeParentNode: this._treeData ? item : null,
                masterMenu: this
            });
            var cons = this.submenuConstructor || isc.Menu;
            submenu = cons.create(properties);  
          
            // cache the submenu for this level
            rootMenu._submenus[menuLevel] = submenu;     

            // Ensure that we clean up when submenus get destroy()d
            rootMenu.observe(submenu, "destroy", "observer.submenuDestroyed(" + menuLevel +");");

        }
	} else if (!isc.isA.Menu(submenu)) {
        // keep track of autoGenerated submenus so we can auto-destroy
        if (!this._submenus) this._submenus = [];

        if (isc.isA.String(submenu)) {
            submenu = window[submenu];
        } else if (isc.isAn.Array(submenu)) {
            submenu = isc.Menu.create({autoDraw: false, data: submenu}, properties);
            this._submenus.add(submenu);
        } else if (isc.isAn.Object(submenu)) {
            submenu = isc.Menu.create(isc.addProperties({autoDraw: false}, properties, submenu));
            this._submenus.add(submenu);
        }
        item.submenu = submenu;
    }
    if (this._treeData) submenu.setTreeNode(item);
    return submenu;
},

// Method invoked when a generated submenu gets destroy()d.
// Clean out our reference to it to avoid leaks.
submenuDestroyed : function (menuLevel) {
    delete this._submenus[menuLevel];
},

// show a menu as a submenu next to the given item
placeSubmenu : function (item, submenu) {

	// remember the submenu so we can close it later
	this._openItem = item;
	this._open_submenu = submenu;

    // Show the submenu offscreen.  This ensures that is has been drawn (so we can determine
    // it's size), but is not visible to the user.
    // It also prevents Moz's strange "flash" in the old position.
    submenu._showOffscreen();
	
	// place the menu adjacent to the item that's showing it
    // Note: use '_placeRect()' to avoid placing submenus offscreen (and avoid occluding the
    // super-menu)
	var itemNum = this.getItemNum(item),
        submenuRect = submenu.getPeerRect(),
        pos = isc.Canvas._placeRect(
        submenuRect[2], submenuRect[3],
        {left:this.getPageLeft() - this.submenuOffset, 
         width:this.getVisibleWidth()  + this.submenuOffset,
         top:this.body.getRowPageTop(itemNum)
         // No need for height - we want it to be as close to that point as possible
         },
         this.submenuDirection == this._$left ? this._$left : this._$right,
         false
    )

    
    submenu.setPageRect(pos[0], pos[1]);
    
    // the "target" property is passed to the click() function.  if the main menu has been
    // given a "target" other than itself (the default), give it to the submenu if it also has
    // no target.
    if (this.target != this && submenu.target != submenu) {
        submenu.target = this.target;
    }

	submenu.show();
	submenu._parentMenu = this;
	submenu._parentItemNum = itemNum;
    
    // If we just placed a submenu, we don't want to do a delayed 'placeSubmenu' for another
    // menu that we're waiting on data from.
    if (isc.Menu._submenuQueue) delete isc.Menu._submenuQueue[this.getID()];
},


//>	@method	menu.hideMenuTree()	(A)
//			Hide this menu and any open submenus of this menu
//		@group	visibility
//<
hideMenuTree : function () {
    this.hideSubmenu();
    this.hide();
},

//>	@method	menu.hideSubmenu()	(A)
//			hide the open sub menu of this menu if there is one
//		@group	visibility
//<
hideSubmenu : function () {
    if (this._open_submenu) {
        this._open_submenu.hideSubmenu();
        this._open_submenu.hide();
        delete this._open_submenu;
		delete this._openItem;
    }
},


//>	@method	menu.getSubmenuImage()	(A)
//			return the icon that indicates that there's a submenu in this item (if there is one)
//
//		@param	item		(paramtype)	item in question
//<
_$left:"left", _$right:"right",
getSubmenuImage : function (item) {

	if (!this.hasSubmenu(item)) return "&nbsp;";
	
	if (!this._submenuImage) {
        var leftSM = (this.submenuDirection == this._$left),
            
            subImgObj = isc.addProperties({}, this.submenuImage),
            subDisImgObj = isc.addProperties({}, this.submenuDisabledImage);

        subImgObj.src = isc.Img.urlForState(subImgObj.src, null, null,
                                                (leftSM ? this._$left : null));
        subDisImgObj.src = isc.Img.urlForState(subDisImgObj.src, null, null,
                                                (leftSM ? this._$left : null));
        
		this._submenuImage = this.imgHTML(subImgObj);
		this._submenuDisabledImage = this.imgHTML(subDisImgObj);
	}
    
	return (this.itemIsEnabled(item) ? this._submenuImage : this._submenuDisabledImage);
},


// Enabling and disabling items, setting titles, showing icons, etc.
// --------------------------------------------------------------------------------------------

//>	@method	menu.itemIsEnabled()	(A)
//		@group enable
//			Return if a particular item (specified by number) is enabled
//		@param	item		(item | number)		pointer to (or number of) the item in question
//		@return			(boolean)	true == item is enabled, false == disabled
//<
itemIsEnabled : function (item) {
	// normalize item to the item pointer in case a number was passed in
	item = this.getItem(item);
	return (item && item.enabled != false && item.isSeparator != true);
},

//>	@method	menu._makeDynamicItemsFunction()	(A)
// Create "this.setDynamicItems", a function that for all items will:
//					* enable/disable them automatically based on an 'enableif' property
//					* change their titles based on a 'dynamicTitle' property
//					* set their icons based on a 'dynamicIcon' property
//					* check/uncheck items based on a 'checkIf' property
//<

_makeDynamicItemsFunction : function (){

	var output = isc.SB.create();
	
	// if the menu has an 'enableIf' item, stick that first
	// this way you can pre-seed the individual enableIf items with variables, etc.
	if (this.enableIf) output.append(this.enableIf, ";");
	
	// iterate through the items, checking for enableif or dynamicTitle properties
	output.append("var menu=this\r");
	for (var i = 0; i < this.data.length; i++) {
		var item = this.getItem(i);
		if (!item) continue;
	    output.append("var item=this.data[" + i + "];\r");
		if (item.enableIf) {
            if (isc.isA.String(item.enableIf)) {
                output.append("changed|=this._setItemEnabled(",i,",",item.enableIf,");\r");
            } else if (isc.isA.Function(item.enableIf)) {
                output.append("changed|=this._setItemEnabled(",i,",this.data[",i,"].enableIf(target,menu,item));\r");
            }
        }
		if (item.checkIf) {
            if (isc.isA.String(item.checkIf)) {
                output.append("changed|=this._setItemChecked(",i,",",item.checkIf,");\r");
            } else if (isc.isA.Function(item.checkIf)) {
                output.append("changed|=this._setItemChecked(",i,",this.data[",i,"].checkIf(target,menu,item));\r");
            }
        }
		if (item.dynamicTitle) {
            if (isc.isA.String(item.dynamicTitle)) {
                output.append("changed|=this.setItemTitle(",i,",",item.dynamicTitle,");\r");
            } else if (isc.isA.Function(item.dynamicTitle)) {
                output.append("changed|=this.setItemTitle(",i,",this.data[",i,"].dynamicTitle(target,menu,item));\r");
            }
        }
		if (item.dynamicIcon) {
            if (isc.isA.String(item.dynamicIcon)) {
                output.append("changed|=this.setItemIcon(",i,",",item.dynamicIcon,");\r");
            } else if (isc.isA.Function(item.dynamicIcon)) {
                output.append("changed|=this.setItemIcon(",i,",this.data[",i,"].dynamicIcon(target,menu,item));\r");
            }
        }
	}

	// if nothing to do, just skip it
    var updateCode = output.toString();
	if (updateCode == "") return;
    output = isc.SB.create();

	// add a 'redraw' command to the function
	output.append("var target=this.target,changed=false;\r",
			      updateCode,
			      "if(changed&&this.isDrawn()){\r",
			      "this.redraw('dynamic item change');\r",
                  
			      (isc.Browser.isIE ? "this.body.setRowStyle(0);\r" : ""),
			      "}");

	// create the setDynamicItems which will be called automatically before the menu is shown
	this.addMethods({setDynamicItems:new Function(output.toString())});
},

refreshRow : function () {
    // force execution of setDynamicItems() on row refresh to pick up new title, checkIf, etc.
    if (this.setDynamicItems) this.setDynamicItems();
    return this.Super("refreshRow", arguments);
},

// called when evaluating expressions like checkIf.  Calling setItemEnabled(item) with no
// "newState" argument should enable the item, however, an enableIf expression that returns
// null or undef should disable the item, rather than requiring that expression to return false
// explicitly.
_setItemEnabled : function (item, newState) {
    return this.setItemEnabled(item, !!newState);
},
_setItemChecked : function (item, newState) {
    return this.setItemChecked(item, !!newState);
},

//>	@method	menu.setItemEnabled()   ([])
// Enables or disables the menu item according to the value of newState, and redraws
// the menu if necessary. Returns true if there's a change in the enabled state.
//
// @param item (MenuItem or number) MenuItem in question, or it's index
// @param [newState] (boolean) true to enable the menu item, false to disable it.  If not
//                             passed, true is assumed
//
// @return	(boolean)	true if the enabled state was changed
// @visibility external
//<
setItemEnabled : function (item, newState) {
    if (newState == null) newState = true;

	// normalize item to the item pointer in case a number was passed in
	item = this.getItem(item);
	if (! item) return;

	// set the enable of the item
	if (item.enabled != newState) {
		item.enabled = newState;

		// mark the menu to be redrawn to show the new state
		this.markForRedraw("itemEnabled");

		// changed something -- return true so the caller knows to redraw
		return true;
	}

	// nothing changed -- return false
	return false;
},


//>	@method	menu.setItemChecked()
// Checks or unchecks the menu item according to the value of newState, and redraws
// the menu if necessary. Returns true if there's a change in the checked state.
//
// @param item (MenuItem or number) MenuItem in question, or it's index
// @param [newState] (boolean) true to check the menu item, false to uncheck it.  If not
//                             passed, true is assumed
//
// @return	(boolean)	true if the checked state was changed
//
// @visibility external
//<
setItemChecked : function (item, newState) {
    if (newState == null) newState = true;
	
	// normalize item to the item pointer in case a number was passed in
	item = this.getItem(item);
	if (! item) return;

	// set the enable of the item
	if (item.checked != newState) {
		item.checked = newState;

		// mark the menu to be redrawn to show the new state
		this.markForRedraw("itemChecked");

		// changed something -- return true so the caller knows to redraw
		return true;
	}
	// nothing changed -- return false
	return false;
},


//>	@method	menu.setItemTitle() ([])
// Sets the title of a particular menu item to the string specified by newTitle and
// redraws the menu if necessary.
//
// @param	item		(MenuItem or number) MenuItem in question, or it's index
// @param	newTitle	(string)	new title
//
// @return	(boolean)	true if the title was changed, and false otherwise
// @visibility external
//<
// NOTE: this is dependent on the title coming directly from the 'title' property... ???
setItemTitle : function (item, newTitle) {
	// normalize item to the item pointer in case a number was passed in
	item = this.getItem(item);
	if (! item) return;

	// set the title
	if (item.title != newTitle) {
		item.title = newTitle;

		// mark the menu to be redrawn to show the new state
		this.markForRedraw("item title change");

		// return true so the caller knows that something has changed
		return true;
	}
	// nothing changed -- return false
	return false;
},


//>	@method	menu.setItemIcon()
// Sets the icon and disabled icon (if specified) for a particular menu item and redraws
// the menu if necessary. Returns true if the icon changed.
//
// @param	item		(MenuItem or number) MenuItem in question, or it's index
// @param	newIcon				(string)	new icon URL
// @param	[newDisabledIcon]	(string)	new icon URL for disabled image
//
// @return	(boolean)	true == something changed, redraw is called for
// @visibility external
//<
setItemIcon : function (item, newIcon, newDisabledIcon) {
	// normalize item to the item pointer in case a number was passed in
	item = this.getItem(item);
	if (! item) return;

	// set the title
	if (item.icon != newIcon) {
		item.icon = newIcon;
		if (newDisabledIcon) item.disabledIcon = newDisabledIcon;

		// mark the menu to be redrawn to show the new state
		this.markForRedraw("item icon change");

		// return true so the caller knows that something has changed
		return true;
	}
	// nothing changed -- return false
	return false;		
},


//>	@method	menu.getIcon()	(A)
//			get the icon for a particular item of the list
//
//		@param	item		(object)		menu item (member of this.data)
//
//		@return	(HTML)	HTML for the icon field for this item
//<
getIcon : function (item) {
	// NOTE: separators are caught before this is called
	//		to change the separator, change ListGrid.getCellValue()
    
	var shouldFixIconWidth = this.fixedIconWidth && this.getRecordIndex(item) == 0,
        iconSpacerWidth = shouldFixIconWidth ? this.iconWidth : null;
    
    var imgHTML;
	if (item.icon) {
		var icon = (this.itemIsEnabled(item) || !item.disabledIcon ? item.icon 
                                                                    : item.disabledIcon);
		imgHTML = this.imgHTML(icon,
							(item.iconWidth? item.iconWidth : this.iconWidth),
							(item.iconHeight? item.iconHeight : this.iconHeight));
        if (shouldFixIconWidth && (item.iconWidth == null || item.iconWidth >= iconSpacerWidth)) {
            shouldFixIconWidth = false;
        } else {
            iconSpacerWidth -= item.iconWidth;
        }
	}
	if (item.checked) {
		imgHTML = this.getCheckmarkImage(item);
        if (shouldFixIconWidth) {
            // we size our checkmark by directly applying a width to the image
            var checkmarkWidth = this.checkmarkImage ? this.checkmarkImage.width : this.iconWidth;
            if (checkmarkWidth < iconSpacerWidth) {
                iconSpacerWidth -= checkmarkWidth;
            } else {
                shouldFixIconWidth = false;
            }
        }
	}
	
    if (shouldFixIconWidth) {
        if (imgHTML) return imgHTML + this.imgHTML("[SKIN]/../blank.gif", iconSpacerWidth, 1);
        else return this.imgHTML("[SKIN]/../blank.gif", iconSpacerWidth, 1);
    }
	return imgHTML || "&nbsp;";
},


//>	@method	menu.getItemTitle()	(A)
// Get the title for this menu item
//		@group	appearance
//
//		@param	item		(object)		menu item (member of this.data)
//
//		@return	(HTML)		HTML for the keyTitle field
//<
getItemTitle : function (item) {
    var title;
    // if we're a treeMenu, use the tree to derive the item title
    if (this._treeData) {
        title = this._treeData.getTitle(item);
        
    // otherwise try title and other likely properties
    } else {
        title = item.title || item.name || item.id;     
    }

    // ensure non-blank
    title = title || "&nbsp;";

    return title;
},


//>	@method	menu.getKeyTitle()	(A)
// Get the keyTitle for a particular item of the list
//		@group	appearance
//
//		@param	item		(object)		menu item (member of this.data)
//
//		@return	(HTML)		HTML for the keyTitle field
//<
getKeyTitle : function (item) {
	if (item.keyTitle) return item.keyTitle;
	return "&nbsp;";
},


//>	@method	menu.getCheckmarkImage()	(A)
// Return the checkmark image for a item.
//		@group	appearance
//
//		@param	item		(object)		menu item (member of this.data)
//		@return	(HTML)	HTML for the checkmark image
//<
getCheckmarkImage : function (item) {
    // cache the HTML for the image so it doesn't have to be calculated over and over
	if (!this._checkmarkImage) {
		this._checkmarkImage = this.imgHTML(this.checkmarkImage);
		this._checkmarkDisabledImage = this.imgHTML(this.checkmarkDisabledImage);
	}
	return (this.itemIsEnabled(item) ? this._checkmarkImage : this._checkmarkDisabledImage);
},


// Keyboard Handling
// ----------------------------------------------------------------------------------------


//>	@method	menu.setUpKeyListening()	(A)
// Set up the key listening for this menu. <P>
// After this, when a key corresponding to a menu item is pressed, it's like they clicked
// on that item
//			NOTE: each item can have:
//				* no keys
//				* a single key designated by a string (key name, "A", "Space" etc)
//              * a single key designated by a keyIdentifier object 
//                ({keyName:"A", shiftKey:true}, etc)
//				* an array contining strings / objects
//			the keys are stored in the item.keys variable
//		@group	event handling
//<
// Note: this could be done in a more desirable manner by making them ctrl+key handlers 
// (for example)
setUpKeyListening : function () {
	var output = "";
	
	// iterate through the items, checking for keys property
    var item, 
        keys, 
        length = this.data.length;
        
	for(var i = 0; i < length; i++) {
		// get the menu item and it's keys
		item = this.getItem(i);
		if (!item) continue;
		keys = item.keys;
		
		// if no keys are defined, skip to the next item
		if (!keys) continue;
		
		// normalize the keys into an array			
		if (!isc.isAn.Array(keys)) keys = [keys];
		// for each item in the array
		for (var key, k = 0, klen = keys.length; k < klen; k++) {
			key = keys[k];
			
			// if this key is null, skip this
			//	this lets us work cleanly with special menu keys, set up above
			if (key == null) continue;
            
			// register the event with the Page
			isc.Page.registerKey(key, "target.menuKey(" + i + ");", this);

            // keep track of the keys we registered so we can unregister on destroy()
            if (!this.registeredKeys) this.registeredKeys = [];
            this.registeredKeys.add(key);
		}
		// set up the keyTitle if it hasn't been set up already to the first key
		if (! item.keyTitle) this.setItemKeyTitle(item, keys[0]);
	}
},

destroy : function () {
    // unregister any registered keys
    if (this.registeredKeys) {
        for (var i = 0; i < this.registeredKeys.length; i++) {
            isc.Page.unregisterKey(this.registeredKeys[i], this);
        }
    }
    if (this._submenus) this._submenus.map("destroy");
    

    this.Super("destroy", arguments);
},

//>	@method	menu.menuKey()	(A)
// A key that we've registered interest in was pressed
//
//		@param	item		(item | number)		pointer to (or number of) the item in question
//
//		@return	(boolean)	false == stop handling this event
//<
menuKey : function (item) {
	// if we have an setDynamicItems function, call that to updated the enabled state
	if (this.setDynamicItems) this.setDynamicItems();

	// call the 'click' handler for the menu with the item
	//	to actually do whatever should be done for the menu item
    // Note: in this case the colNum param is null
    return this.selectMenuItem(item);
},


//>	@method	menu.setItemKeyTitle()
//			set the keyTitle of an item according to the menuKey passed in
//		@param	item		(object)		menu item
//		@param	menuKey		(string)		key that invokes this item
//<
setItemKeyTitle : function (item, menuKey) {
    var keyTitle;
    if (isc.isA.String(menuKey)) keyTitle = menuKey
    else if (isc.isAn.Object(menuKey)) {
        if (menuKey.title) keyTitle = menuKey.title
        else keyTitle = menuKey.keyName;
    }
    item.keyTitle = keyTitle;
}

});



isc.Menu.addClassMethods({

//>	@classMethod	Menu.hideAllMenus()
// Hide all menus that are currently open, and dismisses the clickMask
//		@group	visibility
//<
hideAllMenus : function () {
	// if there are any open menus
	if (isc.Menu._openMenus.length > 0) {

		// hide each of them 
                
        var menus = isc.Menu._openMenus,
            forceFocusOnHide = false, 
            topMenu,
            focusCanvas = isc.EH.getFocusCanvas();
            
        for (var i = menus.length -1; i >= 0; i--) {
            var currentMenu = menus[i];
            // Note hide() doesn't remove menus from the _openMenus array
            if (!currentMenu.isVisible()) {                
                continue;
            }
            
            if (currentMenu._isVisibilityAncestorOf(focusCanvas)) {
                if (topMenu == null) topMenu = currentMenu;
                forceFocusOnHide = true;
            }
			currentMenu.hide();
        }
                
        if (forceFocusOnHide && isc.isA.Canvas(topMenu.body.focusOnHide)) {
            topMenu.body.focusOnHide.focus();
        }            
        
		// and clear the open menu list
		isc.Menu._openMenus = [];
	}

    // Kill any submenus pending show() on data fetch returns
    isc.Menu._submenuQueue = {};
	// hide the canvas clickmask (may not always be necessary, as this method is typically called 
    // from a clickMask click and the CM is autoHide true, but this allows the method to also be
    // called programatically).
    // Note: the clickMask was shown when the first menu was opened, and the ID recorded on the
    // Menu class object
	if (isc.Menu._menusClickMask) isc.EH.hideClickMask(isc.Menu._menusClickMask);
    
    isc.Menu._menusClickMask = null;

    // If the menu(s) were triggered from a menubutton click, notify the menubutton that we're
    // in the process of hiding the menu so it doesn't re-show in response to the current click
    // Also clear this flag on mouseUp
    if (isc.Menu._currentMenuButton != null) {
        var button = isc.Menu._currentMenuButton;
        delete isc.Menu._currentMenuButton;
        if (isc.EH.lastEvent.eventType == isc.EH.MOUSE_DOWN) {
            
            button._hidingMenuClick = true;
            
            isc.Page.setEvent(isc.EH.CLICK, button,   
                              isc.Page.FIRE_ONCE, "_hidingMenuClickComplete");
        }
    }

},


//>	@classMethod	menu.menuForValueMap()
// Given a valueMap like that displayed in a ListGrid or FormItem, create a Menu that allows picking
// an item from that valueMap.
// <P>
// This is typically used to show a contextMenu of the values in the valueMap, for example:<pre>
//    var menu = Menu.menuForValueMap(valueMap);
//    menu.showContextMenu(target);
// </pre>
// When an item is selected, the target will receive a call<pre>
//			target.valueMapMenuSelected(newValue)
// </pre> where <code>newValue</code> is the selected value from the valueMap.
// <P>
// NOTE: By default, the same menu is recycled every time this is called --
//	this saves memory and time.  However, to create a unique menu for
//	your valueMap, pass "false" for the <code>reuseMenu</code> parameter.
//
//		@param	valueMap		(object | array)	ValueMap as either an object of key:value pairs or an array of strings.
//		@param	[reuseMenu]	(boolean : true)	If false is passed in, we create a new menu as the result of this call.
//													Passing true (or leaving the parameter blank) re-uses the same menu,
//													thus saving system resources.
//		@return					(Menu)				Menu for this value map.
//<
menuForValueMap : function (valueMap, reuseMenu) {
	// get the list of items for the menu
	var itemList = [];

    // if the valueMap is a string, eval it
    if (isc.isA.String(valueMap)) valueMap = this.getPrototype().getGlobalReference(valueMap);
    
	if (isc.isAn.Array(valueMap)) {
		for (var i = 0; i < valueMap.length; i++) {
			itemList[i] = {value:valueMap[i], title:valueMap[i]};
		}
	} else {
		for (var value in valueMap) {
			itemList.add({value:value, title:valueMap[value]});
		}
	}

	var menu = isc.Menu._valueMapMenu;
	if (reuseMenu == false || isc.Menu._valueMapMenu == null) {
		menu = isc.Menu.newInstance({
			autoDraw:false,
			itemClick : function(item) { 
				if (this.target.valueMapMenuSelected) {
					this.target.valueMapMenuSelected(item.value) 
				}
			}
		});
	}
	
	// remember the menu if we're supposed to reuse them
	if (reuseMenu != false && isc.Menu._valueMapMenu == null) isc.Menu._valueMapMenu = menu;

	// assign the menu items to the menu
	menu.setData(itemList);

	// now return the menu
	return menu;
}

});

//
//  'registerStringMethods()' - add all the instance properties that can be defined as strings
//  to evaluate (or as methods) to a central registry, together with their arguments as comma
//  separated strings.
// 
isc.Menu.registerStringMethods({
    // note - JSDoc comment attached to default (no-op) implementation
    itemClick:"item"
})

// Override the ListGrid 'showHeaderContextMenu' property to show the menu by default, as we know
// that the Menu class has been defined
isc.ListGrid.addProperties({showHeaderContextMenu:true});
// Ditto with the showHeaderMenuButton property
isc.ListGrid.addProperties({showHeaderMenuButton:false});
