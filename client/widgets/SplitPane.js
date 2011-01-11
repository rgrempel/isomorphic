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


//> @class SplitPane extends VLayout
// A device- and orientation-sensitive layout that implements the common pattern of rendering 
// two panes side-by-side on desktop devices and tablets (eg iPad) in landscape orientation, 
// while switching to showing a single pane for handset-sized devices or tablets in portrait
// orientation.
// <P>
// The SplitPane's main components are the +link{navigationPane} and the +link{detailPane}.
// Both components will be displayed side by side as columns when viewed on a
// desktop device or a tablet in landscape mode.<br>
// Only one pane will be shown at a time when viewed on a handset sized device
// (such as iPhone), or a tablet in portrait orientation. By default the +link{detailPane} is 
// shown, and the +link{showNavigationPane()} / +link{showDetailPane()} methods may be called
// to switch between views.
// <P>
// 
//
// @visibility external
// @treeLocation Client Reference/Layout
//<
isc.defineClass("SplitPane", "VLayout");

isc.SplitPane.addProperties({

    mainLayoutDefaults: {
        _constructor: "HLayout",
        width: "100%",
        height: "100%"
    },

    leftLayoutDefaults: {
        _constructor: "VLayout",
        width: 320,
        height: "100%"
    },

    rightLayoutDefaults: {
        _constructor: "VLayout",
        width: "*",
        height: "100%"
    },

    navigationLayoutDefaults: {
        _constructor: "VLayout",
        width: "100%",
        height: "100%"
    },

    listLayoutDefaults: {
        _constructor: "VLayout",
        width: "100%",
        height: "100%"
    },

    detailLayoutDefaults: {
        _constructor: "VLayout",
        width: "100%",
        height: "100%"
    },

    //> @attr splitPane.navigationBar (NavigationBar : null : IR)
    // The AutoChild +link{class:NavigationBar, navigationBar} managed by this widget.
    //
    // @visibility external
    //<
    navigationBarDefaults: {
        _constructor: "NavigationBar",
        hieght:44,
        navigationClick : function (direction) {
            this.creator.navigationClick(direction);
        }
    },

    //> @attr splitPane.navigationPane (Canvas : null : IRW)
    // The left-hand of the two panes managed by this widget, used for navigation.
    //
    // @visibility external
    //<

    //> @attr splitPane.listPane (Canvas : null : IRW)
    // An optional list pane displayed in the left-hand of the panes or in a popup
    // according to the pane layout.
    //
    // @visibility external
    //<

    //> @attr splitPane.detailPane (Canvas : null : IRW)
    // The right-hand of the two panes managed by this widget, used for viewing details.
    //
    // @visibility external
    //<

    //> @attr splitPane.detailToolStrip (AutoChild : null : IR)
    // Toolstrip servicing the +link{detailPane}.
    //
    // @visibility external
    //<
    detailToolStripDefaults: {
        _constructor: "NavigationBar",
        hieght:44
    },
    
    //> @attr splitPane.detailToolButtons (Array of Canvas : null : IRW)
    // Tool buttons to display in the detail +link{detailToolStrip}.
    // @visibility external
    //<
    
    //> @method splitPane.setDetailToolButtons()
    // Update the +link{splitPane.detailToolButtons} at runtime
    // @param buttons (array of Canvas) new controls for the toolstrip
    // @visibility external
    //<
    setDetailToolButtons : function (buttons) {
        
        this.detailToolButtons = buttons;
        this.updateDetailToolStrip();
    },

    autoChildren: ["mainLayout", "leftLayout", "rightLayout", "navigationLayout", "navigationBar", 
                   "listLayout", "detailLayout", "detailToolStrip"],

    isHandset : function () {
        return this.layoutMode == "handset" || isc.Browser.isHandset;
    },
    isTablet : function () {
        return this.layoutMode == "tablet" || isc.Browser.isTablet;
    },
    getPageOrientation : function () {
        return this.pageOrientation || isc.Page.getOrientation()
    },
    
    initWidget : function () {
        this.Super("initWidget", arguments);

        this.addAutoChildren(this.autoChildren, "none");

        this.addMember(this.mainLayout);

        if (this.navigationPane != null) this._setNavigationPane(this.navigationPane);
        if (this.detailPane != null) this._setDetailPane(this.detailPane);

        isc.Page.setEvent("orientationChange", this.getID()+".pageOrientationChanged()");

        if (this.initialPane != null) {
            this.currentPane = this.initialPane;
        } else {

            
            if (this.isHandset()) {
                if (this.listPane != null) {
                    this.currentPane = "list";
                } else {
                    this.currentPane = "navigation";
                }
            } else {
                this.currentPane = "detail";
            }
        }
        this.pageOrientationChanged();
    },

    pageOrientationChanged : function () {
        this.updateUI();
    },

    updateUI : function (forceRefresh) {
        
        var prevConfig = this.currentUIConfig,
            prevPane = this._lastPane;
        
        // Possible UI configurations:
        // - handset (one pane at a time)
        // - portrait (detailPane always visible, navigation and list panes shows as a popup)
        // - landscape (two panes are visible as columns)
        var config = this.currentUIConfig = this.getUIConfiguration(),
            pane = this._lastPane = this.currentPane;
     
        if (!forceRefresh && config == prevConfig && pane == prevPane) return;
       
        if (config == "handset") {
            // navigation bar shown in both views
            // (Repurposed for detail view to show detail title etc)
            this.updateNavigationBar();
            
            if (pane == "navigation") {
                
                this.navigationLayout.setMembers([this.navigationBar, this.navigationPane]);
                this.mainLayout.setMembers([this.navigationLayout]);
                
            } else if (pane == "detail") {
                var members = [this.navigationBar, this.detailPane];
                
                if (this.detailToolButtons != null) {
                    this.updateDetailToolStrip();
                    members.add(this.detailToolStrip);
                }
                
                this.detailLayout.setMembers(members);
                this.mainLayout.setMembers([this.detailLayout]);
                
            } else {
                
                var members = [this.navigationBar, this.listPane];
                
                this.listLayout.setMembers(members);
                this.mainLayout.setMembers([this.listLayout]);
                
            }
            
        } else if (config == "portrait") {
            // Detail toolstrip across the top
            //  - first button to show navigation or list view
            //  - detail nav control as 2nd button
            //  - detail title
            //  - detail tool buttons
            // Detail pane shows
            // If currentPane is "list":
            //  - pop up containing
            //      - navigation bar
            //      - list pane
            // If currentPane is "navigation":
            //  - pop up containing
            //      - navigation bar
            //      - navigation pane
            this.updateDetailToolStrip();
            this.detailLayout.setMembers([this.detailToolStrip,this.detailPane]);
            this.mainLayout.setMembers([this.detailLayout]);
            
            if (this.currentPane == "navigation") {
                if (this.listPopUp != null && this.listPopUp.isVisible()) {
                    this.listPopUp.hide();
                }
                
                this.updateNavigationBar();
                
                if (this.navigationPopUp == null) {
                    
                    // We expect to only load the mobile skin where PopupWindow is defined
                    var cs = isc.PopupWindow || isc.Window;
                    
                    this.navigationPopUp = this.createAutoChild(
                        "navigationPopUp",
                        {   _constructor:cs,
                            headerControls:[this.navigationBar],
                            items:[this.navigationPane],
                            width:"50%",
                            height:"80%",
                            isModal:true,
                            showModalMask:true,
                            dismissOnOutsideClick:true,
                            // fired from outside click
                            closeClick:function () {
                                this.creator.showDetailPane();
                            }
                        }
                    );
                } else {                    
                    this.navigationPopUp.setHeaderControls([this.navigationBar]);
                    if (!this.navigationPopUp.items ||
                        !this.navigationPopUp.items.contains(this.navigationPane)) 
                    {
                       this.navigationPopUp.addItem(this.navigationPane);
                    }
                }
                
                // show on a tiny delay so we can check page left/top coords reliably
                this.delayCall("_showNavPopUp");

            } else if (this.currentPane == "list") {
                if (this.navigationPopUp != null && this.navigationPopUp.isVisible()) {
                    this.navigationPopUp.hide();
                }

                if (this.listPopUp == null) {
                    
                    // We expect to only load the mobile skin where PopupWindow is defined
                    var cs = isc.PopupWindow || isc.Window;
                    
                    this.listPopUp = this.createAutoChild(
                        "listPopUp",
                        {   _constructor:cs,
                            headerControls:[this.navigationBar],
                            items:[this.listPane],
                            width:"50%",
                            height:"80%",
                            isModal:true,
                            showModalMask:true,
                            dismissOnOutsideClick:true,
                            // fired from outside click
                            closeClick:function () {
                                this.creator.showDetailPane();
                            }
                        }
                    );
                } else {                    
                    this.listPopUp.setHeaderControls([this.navigationBar]);
                    if (!this.listPopUp.items ||
                        !this.listPopUp.items.contains(this.listPane)) 
                    {
                       this.listPopUp.addItem(this.listPane);
                    }
                }
                
                // show on a tiny delay so we can check page left/top coords reliably
                this.delayCall("_showListPopUp");
            } else {
                if (this.navigationPopUp != null && this.navigationPopUp.isVisible()) {
                    this.navigationPopUp.hide();
                }
                if (this.listPopUp != null && this.listPopUp.isVisible()) {
                    this.listPopUp.hide();
                }
            }
            
            
        } else if (config == "landscape") {
            // Landscape view
            //   This mode is used for landscape tablet views.
            //   Only 2 panes are shown at once.
            //
            // With list:
            //     Left side:
            //       Nav bar with button to show navigation view
            //         List title
            //       List pane
            //     Right side:
            //       Toolstrip with prev/next buttons
            //         No title
            //       Detail pane
            //
            // NO list:
            //     Left side:
            //       Nav bar
            //       Nav title
            //       Nav pane
            //     Right side:
            //       Detail Toolstrip
            //         Detail title
            //         Detail tool buttons
        
            if (this.navigationPopUp != null) {
                if (this.navigationPopUp.isVisible()) this.navigationPopUp.hide();
                // clear up the "items" pointer to the navigation pane so it
                // gets re added properly if we rotate back to portrait, and re-show!
                if (this.navigationPopUp.items &&
                    this.navigationPopUp.items.contains(this.navigationPane)) 
                {
                    this.navigationPopUp.removeItem(this.navigationPane);
                }
            }

            this.updateNavigationBar();
            this.navigationLayout.setMembers([
                this.navigationBar,
                this.navigationPane
            ]);
            this.updateDetailToolStrip();
            this.detailLayout.setMembers([
                this.detailToolStrip,
                this.detailPane
            ]);

            if (this.listPane != null) {
                if (pane != "navigation") {
                    this.listLayout.setMembers([
                        this.navigationBar,
                        this.listPane
                    ]);
                    this.leftLayout.setMembers([this.listLayout]);
                } else {
                    this.leftLayout.setMembers([this.navigationLayout]);
                }
            } else {
                this.leftLayout.setMembers([this.navigationLayout]);
            }
            this.rightLayout.setMembers([this.detailLayout]);
            // This should be managed with styling - but for now use an explicit separator
            if (this.spacer == null) {
                this.spacer = isc.Canvas.create({backgroundColor:"black", 
                                    overflow:"hidden", height:"100%", width:1, autoDraw:false});
            }
            this.mainLayout.setMembers([this.leftLayout, this.spacer, this.rightLayout]);

        } else {
            // Desktop view
            //   This mode is used for the desktop view.
            //   All 3 panes may be shown.
            //
            // With list:
            //     Left side:
            //       Nav bar
            //       Nav title
            //       Nav pane
            //     Right side:
            //       Detail Toolstrip
            //         List title
            //         List tool buttons
            //       Detail pane
            //
            // NO list:
            //     Left side:
            //       Nav bar
            //       Nav title
            //       Nav pane
            //     Right side:
            //       Detail Toolstrip
            //         Detail title
            //         Detail tool buttons
        
            this.updateNavigationBar();
            this.navigationLayout.setMembers([
                this.navigationBar,
                this.navigationPane
            ]);
            // In desktop mode, the detail toolstrip goes with the listPane.
            this.updateDetailToolStrip();
            if (this.listPane != null) {
                this.listLayout.setMembers([
                    this.detailToolStrip,
                    this.listPane
                ]);
                this.detailLayout.setMembers([
                    this.detailPane
                ]);
            } else {
                this.detailLayout.setMembers([
                    this.detailToolStrip,
                    this.detailPane
                ]);
            }

            this.leftLayout.setMembers([this.navigationLayout]);
            var members = (this.listPane != null ? [this.listLayout] : []);
            members.add(this.detailLayout);
            this.rightLayout.setMembers(members);
            this.mainLayout.setMembers([this.leftLayout, this.rightLayout]);
        }
    },
    
    _showNavPopUp : function () {
        if (!this.navigationPopUp || 
            (this.navigationPopUp.isVisible() && this.navigationPopUp.isDrawn())) return;
        this.navigationPopUp.setPageTop(this.navigationPopUpButton.getPageBottom());
        this.navigationPopUp.setPageLeft(this.navigationPopUpButton.getPageLeft());
        
        this.navigationPopUp.show();
    },

    _showListPopUp : function () {
        if (!this.listPopUp || 
            (this.listPopUp.isVisible() && this.listPopUp.isDrawn())) return;
        this.listPopUp.setPageTop(this.listPopUpButton.getPageBottom());
        this.listPopUp.setPageLeft(this.listPopUpButton.getPageLeft());
        
        this.listPopUp.show();
    },

    updateDetailToolStrip : function () {
        
        // handset mode - only shows on detail view and contains just the detailToolButtons,
        // cenetered
        if (this.currentUIConfig == "handset") {
            var members = [isc.LayoutSpacer.create({width:"*"})];
            members.addList(this.detailToolButtons);
            members.add(isc.LayoutSpacer.create({width:"*"}));
            
            // Probably not required - could happen if switching from 'portrait' to 
            // 'handset' - so only possible with an explicit override to the
            // ui config since the device won't change!
            if (this.detailTitleLabel && this.detailTitleLabel.isDrawn()) {
                this.detailTitleLabel.deparent();
            }
            
            this.detailToolStrip.setMembers(members);
            
        // portrait mode - always visible at top
        // Contains 
        // - navigation pop up button
        // - detailNavigationControl (if set)
        // - detail tool buttons on right
        // Float title across center
        } else if (this.currentUIConfig == "portrait") {
            
            if (this.navigationPopUpButton == null) {
                this.navigationPopUpButton = this.createAutoChild(
                    "navigationPopUpButton",
                    {   _constructor:"IButton",
                        title:this.navigationTitle,
                        click : function () {
                            this.creator.showNavigationPane();
                        }
                    }
                );
            } else {
                this.navigationPopUpButton.setTitle(this.navigationTitle);
            }
            
            if (this.listPopUpButton == null) {
                this.listPopUpButton = this.createAutoChild(
                    "listPopUpButton",
                    {   _constructor:"IButton",
                        title:this.listTitle,
                        click : function () {
                            this.creator.showListPane();
                        }
                    }
                );
            } else {
                this.listPopUpButton.setTitle(this.listTitle);
            }
            
            this.updateDetailTitleLabel();
            
            var members = [
                (this.currentPane != "navigation"
                    ? this.listPopUpButton 
                    : this.navigationPopUpButton),
                this.detailNavigationControl,
                this.detailTitleLabel
            ];
            if (this.detailToolButtons != null) {
                members.addList(this.detailToolButtons);
            }
            members.removeEmpty();
            this.detailToolStrip.setMembers(members);
           
            
        } else {
            // Default view (tablet landscape or desktop)
            //      - detail title
            //      - detail tool buttons
            this.updateDetailTitleLabel();
            var members = [
                this.detailTitleLabel
            ];
            if (this.detailToolButtons != null) {
                members.addList(this.detailToolButtons);
            }
            this.detailToolStrip.setMembers(members);
        }
    },
                
    updateDetailTitleLabel : function () {
        if (this.detailTitleLabel == null) {
            this.detailTitleLabel = isc.Label.create({
                    autoDraw:false,
                    align:"center",
                    
                    valign:"center",
                    width:"*",
                    
                    //snapTo:"C",
                    height:this.detailToolStrip.getHeight()
            });
        }
        this.detailTitleLabel.setContents(this.detailTitle);
    },
    
    updateNavigationBar : function () {
        this.logInfo("updateNavigationBar, currentPane: " + this.currentPane +
                     ", currentUI: " + this.currentUIConfig);

        // When showing detail view on a handset we show the navigation bar
        // but repurpose it as a detail navigation bar.
        //      - custom left button to return to navigation pane
        //      - Detail pane title
        //      - custom right button based on 'detail nav control'  
        if ((this.currentUIConfig == "handset" && this.currentPane != "navigation") ||
            (this.currentUIConfig == "portrait" && this.currentPane == "list") ||
            (this.currentUIConfig == "landscape" && this.currentPane != "navigation"))
        {
            // In portrait mode we show the nav or list pane
            // and the detail pane at the same time
            // In this case the title should reflect the current pane visible on the left
            var title;
            if (this.currentUIConfig == "landscape") {
                title = this.listPane != null && this.listPane.isVisible() ? this.listTitle 
                                                                    : this.navigationTitle;
            } else {
                title = (this.currentPane == "detail"
                         ? this.detailTitle 
                         : (this.currentPane == "list"
                            ? this.listTitle
                            : this.navigationTitle));
            }
            if (title == null) title = "&nbsp;";

            this.navigationBar.setTitle(title);
            
            if (this.showNavigationPaneButton == null) {
                this.showNavigationPaneButton = this.createAutoChild(
                    "showNavigationPaneButton",
                    {   _constructor:isc.NavigationButton,
                        direction:"back",
                        
                        
                        title:(this.currentPane == "detail" && this.listPane != null 
                               ? this.listTitle : this.navigationTitle),
                        click : function () {
                            if (this.creator.currentPane == "detail" &&
                                this.creator.listPane != null && 
                                // this is a check for landscape mode only
                                !(this.creator.listPane.isVisible() && 
                                    this.creator.listPane.isDrawn()))
                            {
                                this.creator.showListPane();
                            } else {
                                this.creator.showNavigationPane();
                            }
                        }
                    }
                );
            } else {
                this.showNavigationPaneButton.setTitle(
                    this.currentPane == "detail" && 
                                    this.listPane != null && 
                                    !(this.listPane.isVisible() && this.listPane.isDrawn())
                        ? this.listTitle
                        : this.navigationTitle
                );
            }
            
            var controls = [this.showNavigationPaneButton, "titleLabel"];
            if (this.detailNavigationControl != null) {
                controls.add(this.detailNavigationControl);
            }
            this.navigationBar.setControls(controls);
                
        // default behavior - navigation bar shows navigation title and controls
        // specified by the developer (so update title, icons, visibility)
        } else {
        
            this.navigationBar.setTitle(this.navigationTitle);
            
            this.navigationBar.setLeftButtonTitle(this.leftButtonTitle);
            this.navigationBar.setRightButtonTitle(this.rightButtonTitle);
            
            this.navigationBar.setControls(["leftButton", "titleLabel", "rightButton"]);

            this.navigationBar.setShowLeftButton(this.showLeftButton);
            this.navigationBar.setShowRightButton(this.showRightButton);
        }
    
    },
    
    _getShowNavigationPaneButton : function (title) {
        if (this.showNavigationPaneButton == null) {
            this.showNavigationPaneButton = this.createAutoChild(
                "showNavigationPaneButton",
                {   _constructor:isc.NavigationButton,
                    direction:"back",
                    
                    
                    title:title,
                    click:function () {
                        this.creator.showNavigationPane();
                    }
                }
            );
        } else {
            this.showNavigationPaneButton.setTitle(title);
        }
        return this.showNavigationPaneButton;
    },

    //> @type SplitPaneUIConfiguration
    // @value "handset" Show a single pane at a time - default view for handset devices.
    // @value "portrait" Always show the detail pane and use a pop up to display the 
    //              navigation pane as required. Default view for tablet devices in 
    //              portrait orientation.
    // @value "landscape" Show both panes side by side in columns. Default view for
    //              tablet devices in landscape orientation.
    // @value "desktop" Show both panes side by side in columns. Default view for
    //              desktop devices.
    // @visibility internal
    //<
    
    //> @attr splitPane.uiConfiguration (SplitPaneUIConfiguration : null : IRW)
    // Explicit +link{SplitPaneUIConfiguration} for this splitPane. This overrides the
    // standard behavior of deriving the UI configuration based on the browser / device
    // configuration.
    // @visibility internal
    //<
    
    //> @method splitPane.getUIConfiguration () 
    // Returns the current UI configuration for this device. If +link{this.uiConfiguration} 
    // has been explicitly set it will be respected, otherwise the appropriate configuration
    // is derived based on the browser configuration in which the component is being rendered.
    //
    // @return (SplitPaneUIConfiguration) configuration to show
    // @visibility internal
    //<
    getUIConfiguration : function () {
        if (this.uiConfiguration != null) return this.uiConfiguration;
        if (this.isHandset()) return "handset";
        else if (this.isTablet() && this.getPageOrientation() == "portrait") return "portrait";
        else if (this.isTablet() && this.getPageOrientation() == "landscape") return "landscape";
        else return "desktop";
    },

    //> @attr splitPane.showLeftButton (boolean : true : IRW)
    // Should the +link{navigationBar.leftButton} be shown in our navigation bar?
    //<
    showLeftButton:true,

    //> @method splitPane.setShowLeftButton()
    // Show or hide the +link{navigationBar.leftButton}.  Note that the default behavior is to
    // automatically create and show a "back button" as the left button that allows
    // transitioning back to the navigationPane (tablet and handset mode) or the listPane
    // (handset mode).
    //
    // @param visible (Boolean) if true, the button will be shown, otherwise hidden.
    // @visibility external
    //<
    setShowLeftButton : function (show) {
        this.showLeftButton = show;
        this.updateNavigationBar();
    },
    //> @method splitPane.setLeftButtonTitle()
    // Setter for +link{navigationBar.leftButtonTitle}.  Note that this is normally
    // automatically set to the navigationPaneTitle or listPaneTitle as appropriate.
    // 
    // @param newTitle (String) new title for left button
    // @visibility external
    //<
    setLeftButtonTitle : function (newTitle) {
        this.leftButtonTitle = newTitle;
        this.updateNavigationBar();
    },
    //> @method splitPane.setLeftButtonIcon()
    // Setter for +link{navigationBar.LeftButtonIcon}.
    // @param newIcon (SCImgURL) new icon for Left button
    // @visibility external
    //<
    setLeftButtonIcon : function (newIcon) {
        this.leftButtonIcon = newIcon;
        this.updateNavigationBar();
    },
    
    //> @attr splitPane.showRightButton (boolean : true : IRW)
    // Should the +link{navigationBar.rightButton} be shown in our navigation bar?
    //<
    showRightButton:true,
    
    //> @method splitPane.setShowRightButton()
    // Show or hide the +link{navigationBar.rightButton}.
    // @param visible (Boolean) if true, the button will be shown, otherwise hidden.
    // @visibility external
    //<
    setShowRightButton : function (show) {
        this.showRightButton = show;
        this.updateNavigationBar();
    },
    //> @method splitPane.setRightButtonTitle()
    // Setter for +link{navigationBar.rightButtonTitle}
    // @param newTitle (String) new title for right button
    // @visibility external
    //<
    setRightButtonTitle : function (newTitle) {
        this.rightButtonTitle = newTitle;
        this.updateNavigationBar();
    },
    
    //> @method splitPane.setRightButtonIcon()
    // Setter for +link{navigationBar.rightButtonIcon}.
    // @param newIcon (SCImgURL) new icon for right button
    // @visibility external
    //<
    setRightButtonIcon : function (newIcon) {
        this.rightButtonIcon = newIcon;
        this.updateNavigationBar();
    },
    
    _setNavigationPane : function (pane) {
        this.navigationPane = pane;
        this.navigationPane.setWidth("100%");
        this.navigationPane.setHeight("100%");
        this.navigationPane.splitPane = this;
    },
    
    //> @method splitPane.setNavigationPane()
    // Update the navigation pane at runtime
    // @param pane (Canvas) new navigation pane
    // @visibility external
    //<
    setNavigationPane : function (pane) {
        this._setNavigationPane(pane);
        if (this.currentView == "navigation") {
            this.updateUI(true);
        }
    },

    //> @method splitPane.setNavigationTitle()
    // Sets the title for the Navigation Pane.
    // @param  title (String)  new title for the navigation pane
    // @visibility external
    //< 
    setNavigationTitle : function (title) {
        this.navigationTitle = title;
        this.updateNavigationBar();
    },

    //> @method splitPane.showNavigationPane()
    // Causes a transition to the Navigation Pane
    // @visibility external
    //< 
    showNavigationPane : function () {
        var changed = this.currentPane != null && this.currentPane != "navigation";
        this.currentPane = "navigation";
        this.updateUI();
        // notification method that the pane changed.
        
        if (changed && this.paneChanged != null) this.paneChanged("navigation");
        
    },

    _setListPane : function (pane) {
        this.listPane = pane;
        this.listPane.setWidth("100%");
        this.listPane.setHeight("100%");
        this.listPane.splitPane = this;
    },
    
    //> @method splitPane.setListPane()
    // Set a new listPane at runtime
    // @param pane (Canvas) new list pane for this widget
    // @visibility external
    //<
    setListPane : function (pane) {
    
        this._setListPane(pane);
        this.updateUI(true);
    },

    //> @method splitPane.showListPane()
    // Causes a transition to the List Pane
    // @visibility external
    //< 
    showListPane : function () {
        var newPane = (this.listPane != null ? "list" : "detail");
        var changed = (newPane != this.currentPane);
        this.currentPane = newPane
        this.updateUI();
        
        if (changed && this.paneChanged != null) this.paneChanged(newPane);
    },

    //> @method splitPane.setListTitle()
    // Sets the title for the List Pane.
    // @param  title (String)  new title for the list pane
    // @visibility external
    //< 
    setListTitle : function (title) {
        this.listTitle = title;
        
        
        this.updateNavigationBar();
        this.updateDetailToolStrip();
    },
    
    _setDetailPane : function (pane) {
        this.detailPane = pane;
        this.detailPane.setWidth("100%");
        this.detailPane.setHeight("100%");
        this.detailPane.splitPane = this;
    },
    
    //> @method splitPane.setDetailPane()
    // Set a new detailPane at runtime
    // @param pane (Canvas) new detail pane for this widget
    // @visibility external
    //<
    setDetailPane : function (pane) {
    
        this._setDetailPane(pane);
        this.updateUI(true);
    },

    //> @method splitPane.showDetailPane()
    // Causes a transition to the Detail Pane
    // @visibility external
    //< 
    showDetailPane : function () {
        var changed = (this.currentPane != "detail");
        this.currentPane = "detail";
        this.updateUI();
      
        if (changed && this.paneChanged != null) this.paneChanged("detail");
    },

    //> @method splitPane.setDetailTitle()
    // Sets the title for the Detail Pane.
    // @param  title (String)  new title for the detail pane
    // @visibility external
    //< 
    setDetailTitle : function (title) {
        this.detailTitle = title;
        // In handset mode we need to update the navigation bar
        // otherwise we'll update the detailToolStrip
        if (this.currentUIConfig == "handset") {
            if (this.currentPane == "detail") this.updateNavigationBar();
        } else {
            this.updateDetailToolStrip();
        }
    },
    
    //> @method splitPane.navigationClick()
    // Notification method fired when the user clicks the default back / forward buttons
    // on the navigation bar for this splitPane
    // @param direction (String) "back" or "forward"
    // @visibility external
    //<
    navigationClick : function (direction) {
    },
    
    //> @attr splitPane.detailNavigationControl (Canvas : null : IRWA)
    // Navigation control that appears only when the navigation pane is not showing (showing detail
    // pane on handset, or portrait mode on tablet).
    // @visibility external
    //<

    //> @method splitPane.setDetailNavigationControl()
    // Navigation control that appears only when the navigation pane is not showing (showing detail
    // pane on handset, or portrait mode on tablet).
    // @param control (Canvas) 
    // @visibility external
    //<
    setDetailNavigationControl : function (canvas) {
        this.detailNavigationControl = canvas;
        var updateUI = this.currentUIConfig != "landscape" && this.currentPane == "detail";
        if (updateUI) this.updateUI(true);
    }
});

isc.SplitPane.registerStringMethods({
    // Notification method fired when the currently showing pane changes.
    
    paneChanged:"pane"
});

