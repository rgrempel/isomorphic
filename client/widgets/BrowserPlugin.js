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

 




//>	@class	BrowserPlugin
//  
//  Container for a Browser Plugin.
//
//  @treeLocation Client Reference/Client Bridges
//  @requiresModules PluginBridges
//  @visibility PluginBridges
//<



isc.ClassFactory.defineClass("BrowserPlugin", "Canvas");

isc.BrowserPlugin.addClassProperties({
    instances: [], // all instances of browserPlugin

    // future extension point - called by EH handleDragMove.  
    handleDragMoveNotify : function () { }
});

isc.BrowserPlugin.addProperties({
    // the plugin src
    src: "",
    extraHTML: "",       // arbitrary additional html (added to the embed tag)
    installPlugin: true, // trigger the plugin auto-installer if supported?
    // avoid automatic redrawing, which would recreate the plugin instance.  We don't want to do
    // this for any automatic reason; only if redraw() is explicitly called.
    redrawOnResize:false,
    _redrawWithMaster:false,
    _redrawWithParent:false,

    // This flag controls whether we register the component as a maskable item with the
    // EventHandler (ultimately controls whether _showDragMask()/_hideDragMask() get called on
    // this component on dragStart.
    useDragMask: true,
    
    // A placeholder dragMask means that we hide the plugin and show a "Dragging..." or similar
    // Label placeholder.  This is appropriate for plugins where no masking mechanism exists to
    // allow us to capture events.
    //
    // Moz Plugins cause uncorrectable burnthrough, but events can be captured with a standard
    // dragMask.  This setting is a tradeoff on Moz between hiding the plugin and the ability
    // to see what you're dragging over it
    usePlaceholderDragMask: !isc.Browser.isMoz,

    // Default placeholder message and style
    dragPlaceholderMessage: "Dragging...",
    dragPlaceholderStyle: "normal",

initWidget : function () {
    isc.BrowserPlugin.instances.add(this);
    if (this.useDragMask) isc.EH.registerMaskableItem(this, true);
},

destroy : function () {
    isc.BrowserPlugin.instances.remove(this);
    this.Super("destroy", arguments);
},

draw : function () {
    this.Super("draw", arguments);

    // if the backmask that we typically use via useBackMask will burn through this component,
    // then it we should disable it for any ancestors, otherwise this component won't show up.
    // The correct solution to this is too complex to implement at the moment - need to
    // disable/re-enable the backmask based on this component being cleared, reparented,
    // destroyed, etc and we don't want to impact the critical path code in Canvas.draw() to
    // check any children.
    //
    // For now, we simply solve the typical case of a plugin that gets burned through by a
    // backmask being placed inside a component that sets useBackMask: true by disabling all
    // such masks up the parent chain and making no effort to re-enable them.
    if (this.backMaskCausesBurnThrough) {
        var applet = this;
        this.getParentElements().map(function (ancestor) {
            if (ancestor.useBackMask) {
                applet.logInfo("Suppressing backmask of ancestor: " + ancestor.getID());
                if (ancestor._backMask) {
                    // backmask exists, suppress and hide it
                    ancestor._backMask.suppressed = true;
                    ancestor._backMask.hide();
                } else {
                    // backmask will exist after onload, suppress
                    if (!ancestor._deferredBackMaskProps) ancestor._deferredBackMaskProps={};
                    ancestor._deferredBackMaskProps.suppressed = true;
                }
            }
        });
    }
},

getPluginHandle : function () {
    return document.getElementById(this.getPluginID());
},

getPluginID : function () {
    return this.getID() + "_plugin";
},


_showDragMask : function () {
    if (!this.usePlaceholderDragMask) return this.Super("_showDragMask", arguments);

    var handle = this.getPluginHandle();
    if (handle) {
        handle.style.visibility = "hidden";
        if (!this._dragPlaceholder) this._dragPlaceholder = this.createDragPlaceholder();
        if (this._dragPlaceholder) {
            // make the placeholder into a drag mask, so we can accept events on it on behalf
            // of the plugin
            isc.addProperties(this._dragPlaceholder, {
                _maskTarget: this,
                getTarget : function () { return this._maskTarget; }
            });
            this._dragPlaceholder.setRect(this.getPageRect());
            this._dragPlaceholder.show();
        }
    }
},

_hideDragMask : function () {
    if (!this.usePlaceholderDragMask) return this.Super("_hideDragMask", arguments);

    var handle = this.getPluginHandle();
    if (handle) {
        handle.style.visibility = "inherit";
        if (this._dragPlaceholder) this._dragPlaceholder.hide();
    }
},

createDragPlaceholder : function () {
    return isc.Label.create({
        align: "center",
        contents: this.dragPlaceholderMessage,
        styleName: this.dragPlaceholderStyle
    });
}

});
