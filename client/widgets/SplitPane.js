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


//> @class SplitPane extends VLayout
// A device- and orientation-sensitive layout that implements the common pattern of rendering 
// two panes side-by-side on desktop devices and tablets (eg iPad) in landscape orientation, 
// while switching to showing a single pane for handset-sized devices or tablets in portrait
// orientation.
// <P>
// The SplitPane's main components are the +link{navigationPane} and the +link{detailPane}.
// Both components will be displayed side by side as columns when viewed on a
// descktop device or a tablet in landscape mode.<br>
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

    navigationLayoutDefaults: {
        _constructor: "VLayout",
        width: "50%",
        height: "100%"
    },

    detailLayoutDefaults: {
        _constructor: "VLayout",
        width: "*",
        height: "100%"
    },

    //> @attr splitPane.navigationBar (NavigationBar : null : IR)
    // The AutoChild +link{class:NavigationBar, navigationBar} managed by this widget.
    //
    // @visibility external
    //<
    navigationBarDefaults: {
        _constructor: "NavigationBar",
        navigationClick : function (direction) {
            this.creator.navigationClick(direction);
        }
    },

    //> @attr splitPane.navigationPane (Canvas : null : IRW)
    // The left-hand of the two panes managed by this widget, used for navigation.
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
        _constructor: "ToolStrip",
        width: "100%",
        height: 30
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

    autoChildren: ["mainLayout", "navigationLayout", "navigationBar", 
                   "detailLayout", "detailToolStrip"],

    isHandset : function () {
        return isc.Browser.isHandset;
    },
    isTablet : function () {
        return isc.Browser.isTablet;
    },
    getPageOrientation : function () {
        return isc.Page.getOrientation()
    },
    
    initWidget : function () {
        this.Super("initWidget", arguments);

        this.addAutoChildren(this.autoChildren, "none");

        this.addMember(this.mainLayout);

        if (this.navigationPane != null) this._setNavigationPane(this.navigationPane);
        if (this.detailPane != null) this._setDetailPane(this.detailPane);

        isc.Page.setEvent("orientationChange", this.getID()+".pageOrientationChanged()");

        // Initialize with navigation view since this is
        // typically required to first populate the detail view
        
        this.currentPane = "navigation";
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
        // - portrait (detailPane always visible, navigation pane shows as a popup)
        // - landscape (both panes are visible as columns)
        var config = this.currentUIConfig = this.getUIConfiguration(),
            pane = this._lastPane = this.currentPane;
     
        if (!forceRefresh && config == prevConfig && 
            (config == "landscape" || pane == prevPane)) return;
       
        if (config == "handset") {
            // navigation bar shown in both views
            // (Repurposed for detail view to show detail title etc)
            this.updateNavigationBar();
            
            if (pane == "navigation") {
                
                this.navigationLayout.setMembers([this.navigationBar, this.navigationPane]);
                this.mainLayout.setMembers([this.navigationLayout]);
                
                
            } else {
                
                var members = [this.navigationBar, this.detailPane];
                
                if (this.detailToolButtons != null) {
                    this.updateDetailToolStrip();
                    members.add(this.detailToolStrip);
                }
                
                this.detailLayout.setMembers(members);
                this.mainLayout.setMembers([this.detailLayout]);
                
            }
            
        } else if (config == "portrait") {
            // Detail toolstrip across the top
            //  - first button to show navigation view
            //  - detail nav control as 2nd button
            //  - detail title
            //  - detail tool buttons
            // Detail pane shows
            // If currentPane is "navigation":
            //  - pop up containing
            //      - navigation bar
            //      - navigation pane
            this.updateDetailToolStrip();
            this.detailLayout.setMembers([this.detailToolStrip,this.detailPane]);
            this.mainLayout.setMembers([this.detailLayout]);
            
            if (this.currentPane == "navigation") {
                
                this.updateNavigationBar();
                
                if (this.navigationPopUp == null) {
                    
                    // We expect to only load the mobile skin where PopupWindow is defined
                    var constructor = isc.PopupWindow || isc.Window;
                    
                    this.navigationPopUp = this.createAutoChild(
                        "navigationPopUp",
                        {   _constructor:constructor,
                            headerControls:[this.navigationBar],
                            items:[this.navigationPane],
                            width:"50%",
                            height:"80%",
                            isModal:true,
                            showModalMask:true,
                            dismissOnOutsideClick:true,
                            // fired from outside click
                            closeClick:function () {
                                this.creator.showDetailPane("detail");
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
            } else {
                if (this.navigationPopUp != null && this.navigationPopUp.isVisible()) {
                    this.navigationPopUp.hide();
                }
            }
            
            
        } else {
            // Landscape view - currentPane is ignored:
            // Nav layout:
            //  Nav bar with user specified back/fwd buttons
            //  Nav title
            //  Nav pane
            // Detail layout:
            //  Detail toolstrip:
            //      - detail title
            //      - detail tool buttons
            //  Detail pane
            
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
            
            this.mainLayout.setMembers([this.navigationLayout, this.detailLayout]);
        }
    },
    
    _showNavPopUp : function () {
        if (!this.navigationPopUp || 
            (this.navigationPopUp.isVisible() && this.navigationPopUp.isDrawn())) return;
        this.navigationPopUp.setPageTop(this.navigationPopUpButton.getPageBottom());
        this.navigationPopUp.setPageLeft(this.navigationPopUpButton.getPageLeft());
        
        this.navigationPopUp.show();
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
                        click:function () {
                            this.creator.showNavigationPane();
                        }
                    }
                );
            } else {
                this.navigationPopUpButton.setTitle(this.navigationTitle);
            }
            
            this.updateDetailTitleLabel();
            
            var members = [
                this.navigationPopUpButton,
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
        
        // When showing detail view on a handset we show the navigation bar
        // but repurpose it as a detail navigation bar.
        //      - custom left button to return to navigation pane
        //      - Detail pane title
        //      - custom right button based on 'detail nav control'  
        if (this.currentUIConfig == "handset" && this.currentPane == "detail") {
            
            this.navigationBar.setTitle(this.detailTitle);
            
            if (this.showNavigationPaneButton == null) {
                this.showNavigationPaneButton = this.createAutoChild(
                    "showNavigationPaneButton",
                    {   _constructor:isc.NavigationButton,
                        direction:"back",
                        
                        
                        title:this.navigationTitle,
                        click:function () {
                            this.creator.showNavigationPane();
                        }
                    }
                );
            } else {
                this.showNavigationPaneButton.setTitle(this.navigationTitle);
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
    
    //> @type SplitPaneUIConfiguration
    // @value "handset" Show a single pane at a time - default view for handset devices.
    // @value "portrait" Always show the detail pane and use a pop up to display the 
    //              navigation pane as required. Default view for tablet devices in 
    //              portrait orientation.
    // @value "landscape" Show both panes side by side in columns. Default view for
    //              desktop devices and tablet devices in landscape orientation.
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
        else return "landscape";
    },

    //> @attr splitPane.showLeftButton (boolean : true : IRW)
    // Should the +link{navigationBar.leftButton} be shown in our navigation bar?
    //<
    showLeftButton:true,

    //> @method splitPane.setShowLeftButton()
    // Show or hide the +link{navigationBar.leftButton}.
    // @param visible (Boolean) if true, the button will be shown, otherwise hidden.
    // @visibility external
    //<
    setShowLeftButton : function (show) {
        this.showLeftButton = show;
        this.updateNavigationBar();
    },
    //> @method splitPane.setLeftButtonTitle()
    // Setter for +link{navigationBar.leftButtonTitle}
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
        this.currentPane = "navigation";
        this.updateUI();
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
        this.currentPane = "detail";
        this.updateUI();
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

