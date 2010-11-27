/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-11-26 (2010-11-26)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */




//>	@class TileGrid
// A TileGrid is a +link{DataBoundComponent} that displays a list of objects as a set
// of "tiles", where each tile represents one object, and the tiles are laid out in a grid with
// multiple tiles per row.  Each tile displays one or more properties of the object it
// represents.
//
// @implements DataBoundComponent
// @treeLocation Client Reference/Grids
// @visibility external
//<
isc.ClassFactory.defineClass("TileGrid", "TileLayout", "DataBoundComponent");

isc.TileGrid.addProperties({

//> @attr tileGrid.fields (Array of DetailViewerField : null : IR)
// Array of field definitions to control the default rendering of tiles.
// <P>
// If not specified, if the DataSource has an +link{dataSource.iconField,iconField}, only the
// <code>iconField</code> and +link{dataSource.titleField,titleField} will be shown.
// Otherwise, all non-+link{dataSourceField.hidden,hidden}
// non-+link{dataSourceField.detail,detail} fields will be shown, similar to the default set of
// fields shown by a +link{ListGrid}.
// <P>
// Only applicable if using the default +link{SimpleTile} class for tiles.
// <P>
// For SimpleTiles, it is possible to use +link{DetailViewerField.getCellStyle()} and 
// +link{StatefulCanvas.getStateSuffix()} to make a single field statefully styled:
// <pre>
// isc.TileGrid.create({
//      fields:[
//          {name:'animalName',
//           getCellStyle : function (value, field, record, viewer) {
//               if (value == "Tiger") return "tigerStyle" + viewer.currentTile.getStateSuffix();
//               else return view.tileGrid.tileValueStyle + viewer.currentTile.getStateSuffix();
//           }
//          }
//      ]
// });
// </pre>
//
// @visibility external
//<

//>	@attr tileGrid.showDetailFields (boolean : false : IR)
// By default, TileGrids will not show fields marked +link{dataSourceField.detail,detail:true}
// in the DataSource.  See also +link{tileGrid.fields}.
// @visibility external
//<

//> @attr tileGrid.tileValueStyle (CSSClassName : "tileValue" : IR)
// When using the default +link{SimpleTile}, CSS style for each value shown within a tile.
// @visibility external
//<
tileValueStyle:"tileValue",

// @attr TileGrid.valuesShowRollOver (boolean : false : IR)
// Should tile values change state when the mouse goes over them?
// @visibility external
valuesShowRollOver: false,

// @attr TileGrid.valuesShowSelected (boolean : true : IR)
// Should tile values change state when they are selected?
// @visibility external
valuesShowSelected: true,

// @attr TileGrid.valuesShowDown (boolean : false : IR)
// Should tile values change state when the mouse goes down on them?
// @visibilty external
valuesShowDown: false,

//> @attr tileGrid.tileValueAlign   (String : "center" : IR)
// Horizontal alignment for tile values: "left", "right" or "center".
// @visibility external
//<
tileValueAlign:"center",

// ability to show labels dubious and not doc'd yet - better approach probably to support
// optionally showing a label on a per-line basis, or suggest using formatters
showLabels:false,
tileLabelStyle:"tileLabel",

//> @attr TileGrid.wrapValues (boolean : false : IR)
// Whether values should be allowed to wrap by default, or should be shown on one line
// regardless of length.
//<
wrapValues: false,

// allows sorting via panelHeader by default
canSortFields: true,

//>	@attr TileGrid.data		(List of TileRecord : null : IRW)
// A List of TileRecord objects, specifying the data to be used to create the
// tiles.  
// <p>
// This property will typically not be explicitly specified for databound TileGrids, where
// the data is returned from the server via databound component methods such as
// +link{fetchData()}. In this case the data objects will be set to a 
// +link{class:ResultSet,resultSet} rather than a simple array.
//
// @group	data
// @see TileRecord
// @setter TileGrid.setData()
// @visibility external
//<

//> @attr TileGrid.printTilesPerLine (number : null : IR)
//  How many tiles should be present in a line when printing?
//
// @visibility external
//<

// ---------------------------inherited from dataBoundComponent--------------------------------
//>	@attr TileGrid.dataSource		(DataSource or ID : null : IRW)
// @include dataBoundComponent.dataSource
//<

//> @method TileGrid.fetchData()
// @include dataBoundComponent.fetchData()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundFetch
//<

//> @method TileGrid.filterData()
// @include dataBoundComponent.filterData()
// @group dataBoundComponentMethods
// @visibility external
//<

//>	@attr TileGrid.autoFetchData       (boolean : false : IR)
// @include dataBoundComponent.autoFetchData
// @group databinding
// @visibility external
// @example fetchOperation
//<

//> @method TileGrid.invalidateCache()
// @include dataBoundComponent.invalidateCache()
// @group dataBoundComponentMethods
// @visibility external
//<

//> @method TileGrid.removeSelectedData()
// @include dataBoundComponent.removeSelectedData()
// @group dataBoundComponentMethods
// @visibility external
// @example removeOperation
//<

//> @method TileGrid.getSelection()
// @include dataBoundComponent.getSelection()
//
// @group  selection
// @visibility external
//<

//> @method TileGrid.getSelectedRecord()
// @include dataBoundComponent.getSelectedRecord()
//
// @group  selection
// @return (TileRecord) first selected record, or null if nothing selected
// @visibility external
//<

//> @method TileGrid.selectRecord()
// @include dataBoundComponent.selectRecord()
//<

//> @method TileGrid.deselectRecord()
// @include dataBoundComponent.deselectRecord()
//<

//> @method TileGrid.selectRecords()
// @include dataBoundComponent.selectRecords()
//<

//> @method TileGrid.deselectRecords()
// @include dataBoundComponent.deselectRecords()
//<

//> @method TileGrid.selectAllRecords()
// @include dataBoundComponent.selectAllRecords()
//<

//> @method TileGrid.deselectAllRecords()
// @include dataBoundComponent.deselectAllRecords()
//<

//> @method TileGrid.anySelected()
// @include dataBoundComponent.anySelected()
//<

//>	@attr TileGrid.autoFetchTextMatchStyle       (TextMatchStyle : "substring" : IR)
// @include dataBoundComponent.autoFetchTextMatchStyle
// @group databinding
// @visibility external
//<
autoFetchTextMatchStyle:"substring",

//> @attr TileGrid.initialCriteria   (Criteria : null :IR)
// @include dataBoundComponent.initialCriteria
// @visibility external
//<

//>	@attr tileGrid.selectionType		(SelectionStyle : isc.Selection.MULTIPLE : [IRW])
// Defines a tileGrid's clickable-selection behavior.
//
// @group	selection, appearance
// @see type:SelectionStyle
// @visibility external
// @example tilingEditing
//<
selectionType: isc.Selection.MULTIPLE,    

//autoChildren 

//> @attr tileGrid.tile (AutoChild : null : IR)
// A TileGrid automatically creates one tile per record in the dataset, via the
// +link{AutoChild} pattern.
// <P>
// By default, the +link{SimpleTile} class will be used, and will contain content as rendered
// by a +link{DetailViewer}, based on the provided +link{TileGrid.fields} (or on the default
// set of fields).
// <P>
// To create a completely different appearance, override +link{tileConstructor} with the name
// of the custom SmartClient class to use for each tile.  For example, subclass
// +link{SimpleTile} and override +link{Canvas.getInnerHTML,getInnerHTML()}, returning custom
// HTML for each tile.
// <pre>
//     isc.defineClass("MyCustomTile", "SimpleTile").addProperties({
//        getInnerHTML : function () {
//           return this.Super("getInnerHTML", arguments) +
//                this.getRecord().width + " x " + this.getRecord().height;
//        }
//     });
//
//     isc.TileGrid.create({
//        tileConstructor:"MyCustomTile"
//     });
// </pre>
// <P>
// Note that you can also override tile behaviors on a per-record basis, via
// +link{tileRecord.tileConstructor} and +link{tileRecord.tileProperties}.
//
// @visibility external
//<

//> @attr tileGrid.tileConstructor (SCClass : "SimpleTile" : IR)
// Classname of a SmartClient component to use for each tile rendered by this TileGrid.  Tiles
// are created by the +link{AutoChild} pattern; see +link{tileGrid.tile}.
// <P> 
// Any subclass of Canvas is allowed, but typically any custom class will derive from
// +link{SimpleTile}.
//
// @visibility external
//<
tileConstructor: "SimpleTile",

detailViewerConstructor: "DetailViewer",

// whether to reuse tiles, may want to doc at some point
recycleTiles: true,

//> @attr tileGrid.showAllRecords (boolean : false : IR)
// Whether tiles are created and drawn for all records, or only for those currently visible.
//
// @group basics
// @visibility external
//<

//> @attr tileGrid.animateTileChange (boolean : true : IRWA) 
// If set, when the dataset changes due to filtering, sorting or other actions, any tiles that
// were showing before and after the change will animate from their old positions to their new
// positions.
//
// @group appearance
// @visibility external
//<
animateTileChange: true,

//> @attr tileGrid.styleName (CSSStyleName : "tileGrid" : IR)
// Style for the overall TileGrid component.
// @group appearance
// @visibility external
//<
styleName:"tileGrid",

// set this flag to false so that databound tiles can't be hidden by an explicit call to 
// hide()
_enableUserHiding: false,

//> @object TileRecord
// A TileRecord is a JavaScript Object whose properties contain values for each
// TileField. A TileRecord may have additional properties which affect the record's
// appearance or behavior, or which hold data for use by custom logic or other, related
// components. 
//
// @treeLocation Client Reference/Grids
// @visibility external
//<

//> @attr TileRecord.tileConstructor (String : null : IRW)
// SmartClient Class to use to construct the tile for this particular record.
//
// @visibility external
//<

//> @attr tileRecord.tileProperties (Canvas Properties : null : IRW)
// Additional properties to be passed when creating a tile for this record.
//
// @visibility external
//<

initWidget : function () {
    this._enforceLegalLayoutPolicy();

    // disable summary and formula fields if the required components aren't present
    if (isc.FormulaBuilder == null) this.canAddFormulaFields = false;
    if (isc.SummaryBuilder == null) this.canAddSummaryFields = false;

    if (this.layoutPolicy == "flow") {
        isc.logWarn("TileGrid does not support layoutPolicy 'flow'; there may by unexpected behavior." + 
                    "Use a TileLayout instead for flow layout.");    
    }

    // skip tileLayout init; we want to completely replace that here
    this.invokeSuper(isc.TileLayout, "initWidget");
    if (!this.tiles) this.tiles = [];
    // make sure we don't try to recycle tiles when we're showing all records
    if (this.showAllRecords) this.recycleTiles = false;

    // set up tile map for record <-> tile mapping when databound
    if (this.getDataSource()) {
        this._tileMap = {};
        if (this.getDataSource().getPrimaryKeyFieldNames().length == 0) {
            // don't animate tiles if there is no primary key because there's no way of knowing
            // that the tiles will be the same
            this.animateTileChange = false;
        }
    }
    // internal detailViewer for creating SimpleTiles
    this.detailViewer = this.createAutoChild("detailViewer", {
            tileGrid: this,
            showLabel: this.showLabels,
            showBorder: false, 
            cellStyle: this.tileValueStyle,
            labelStyle: this.tileLabelStyle,
            blockStyle: "normal",
            wrapValues: this.wrapValues,
            cellPadding: 0,
            valueAlign: this.tileValueAlign,
            // to force detailViewer table width to be 100%
            // NOTE 6/29/09 this needs to be false for the tiles to have their
            // content centered properly. Seems to not break the strict example.
            useInnerWidth: false,
            clipValues: true,
            // width and height should be set in makeTile
            width: 10,
            height: 10,
            data: [],
            dataSource: this.getDataSource(),
            getCellStyle: function (value, field, record, viewer) {
                var base = (field.cellStyle || this.cellStyle);
                if (this.tileGrid.valuesShowRollOver && this.currentTile.state == isc.StatefulCanvas.STATE_OVER) {
                    base += this.currentTile.getStateSuffix();    
                } else if (this.tileGrid.valuesShowDown && this.currentTile.state == isc.StatefulCanvas.STATE_DOWN) {
                    base += this.currentTile.getStateSuffix();    
                } else if (this.tileGrid.valuesShowSelected && this.currentTile.isSelected()) {
                    base += this.currentTile.getStateSuffix();    
                }
                return base;
            }
    });

    // set field state if necessary, call setFields otherwise
    if (this.fieldState != null) this.setFieldState(this.fieldState);
    else this.setFields(this.fields, true);

    this.membersMargin = this.tileMargin;

    this.setData(this.data);
},

setDataSource : function (dataSource, fields) {
    this.Super("setDataSource", arguments);    
    // set up tile map for record <-> tile mapping when databound
    if (this.getDataSource()) {
        this._tileMap = {};
        if (this.getDataSource().getPrimaryKeyFieldNames().length == 0) {
            // don't animate tiles if there is no primary key because there's no way of knowing
            // that the tiles will be the same
            this.animateTileChange = false;
        }
    }
    
},


// return whether this component wants to use the field when binding to a DataSource.  
// TileGrid-specific override of the DBC method to account for the fact that a TileGrid
// always wants the icon field if there is one
shouldUseField : function (field, ds) { 

    if (this.Super("shouldUseField", arguments)) return true;
    
    if (ds) {
        var iconField = isc.DS.get(ds).getIconField();
        if (field == iconField || field.name == iconField || 
            (iconField && field.name == iconField.name)) 
        {
            return true;
        }
    }

    return false;
},


setFields : function (newFields, cancelLayout) {
    if (!newFields && this.getDataSource()) {
        // if the DataSource has an icon field, show just the icon and the title
        var iconField = this.getDataSource().getIconField();
        if (iconField) {
            newFields = [];
            newFields.add({name:iconField, type: iconField.type});
            newFields.add({name:this.getDataSource().getTitleField()});
        }
    }

    if (this.completeFields == null) this.fields = [];

	// bind the passed-in fields to the DataSource and store
    this.completeFields = this.bindToDataSource(newFields);

    if (this.completeFields == null) this.completeFields = [];
    // tilegrid was crashing without this line:
    if (!this.completeFields) return;

	this.deriveVisibleFields();

    this.detailViewer.fields = this.completeFields.duplicate();
    if (!cancelLayout) {
        this.logDebug('calling layoutTiles from setFields', "TileGrid");
        this.layoutTiles();
    }
},

deriveVisibleFields : function () {
	// NOTE: we use setArray() so that this.fields remains the same array instance.
    this.fields.setArray(this.getVisibleFields(this.completeFields));
},

getVisibleFields : function (fields) {
	var returnFields = fields.duplicate();
    for (var i=0; i<fields.length; i++) {
        var item = fields.get(i);
        if (!this.fieldShouldBeVisible(item) || item.visible==false) returnFields.remove(item);
    }
	return returnFields;
},

computeTileDimensions : function (forceCompute) {
    // don't compute tile dimensions if they're already known
    if (((this.tileHeight && this.tileWidth) || (this.tileSize)) && !forceCompute) return;
    // don't compute if we don't have all the data on hand.
    if (!((isc.ResultSet && isc.isA.ResultSet(this.data) 
            && this.data.resultSize >= this.data.getLength())
         || isc.isAn.Array(this.data))) {
         return;
    }
    // only get dimensions when layoutPolicy is 'fit' and we have a tile array
    if (this.layoutPolicy != "fit") return;
    // iterate through tiles collection and find the greatest width and height
    var maxHeight = 0, maxWidth = 0;
    // very important; we don't want clipping
    this.detailViewer.clipValues = false;
    for (var i=0; i < this.data.getLength(); i++) {
        // render the tile so its sized by its own content
        var t = this.getTile(i);
        var currOverflow = t.overflow;
        t.setOverflow("visible");
        t.redraw();
        t.show();
        var tHeight = t.getVisibleHeight();
        var tWidth = t.getVisibleWidth();
        if (tHeight > maxHeight) maxHeight = tHeight;
        if (tWidth > maxWidth) maxWidth = tWidth;
        // reset the tile to its prior state
        t.setOverflow(currOverflow);
        t.hide();
    }
    // set the detailViewer back to its default state
    this.detailViewer.clipValues = true;
    if (!this.tileHeight && maxHeight > 0) this.tileHeight = maxHeight;
    if (!this.tileWidth && maxWidth > 0) this.tileWidth = maxWidth;
    
},

// get/setTileID ensure that tile-to-record mapping remains stable when databound. 
// The expando approach doens't work when databound because the expando gets wiped out
// on update.
getTileID : function (record) {
    if (!record) return null;
    var ds = this.getDataSource();
    if (ds && ds.getPrimaryKeyFieldNames().length > 0) {
        var pks = ds.getPrimaryKeyFields();
        var pk = "";
        for (var pkName in pks) {
            pk += record[pkName];        
        }
        return this._tileMap[pk];
    } else {
        return record._tileID;    
    }
},

setTileID : function (record, tileID) {
    var ds = this.getDataSource();
    if (ds && ds.getPrimaryKeyFieldNames().length > 0) {
        var pks = ds.getPrimaryKeyFields();
        var pk = "";
        for (var pkName in pks) {
            pk += record[pkName];        
        }
        this._tileMap[pk] = tileID;
    } else {
        record._tileID = tileID;    
    }
},

getTileRecord : function (tile) {
    //return tile._record;
    var list = this;
    var data = list.data;
    var start, end;

    // new dataset load in progress, don't try to access data or fetches will be triggered
    if (isc.isA.ResultSet(this.data) && !this.data.lengthIsKnown()) return null;

    // may want to optimize this
    if (this.showAllRecords || !list.getDrawnStartIndex() || !list.getDrawnEndIndex()) {
        start = 0;
        end = data.getLength()
    } else {
        // this approach leads to duplicate entries in the tileMap, which seems to be ok because
        // only a certain range is used when recycling tiles. If problems arise, try converting this
        // to use a record pointer on the tile instead. You'll also need to setTileRecord() in
        // the right places.
        start = list.getDrawnStartIndex();
        end = list.getDrawnEndIndex() + 1;
        if (end > data.getLength()) end = data.getLength();
    }
    for (var i = start; i < end; i++) {
        var rec = data.get(i);
        if (list.getTileID(rec) == tile.ID) return rec;     
    }
    return null;    
},

setTileRecord : function (tile, record) {
    //tile._record = record;
    return null;
},

setData : function (newData) {
    
    // if we're animating prevent new data from arriving. See _layoutAfterDataChange()
    if (this._animating) {
        return false;    
    }
    
    if (! newData) return;

    if (this.data) {
        this.ignore(this.data, "dataChanged"); 
        this.ignore(this.data, "dataArrived");
    }
    // if newData was passed in, remember it
	if (newData) this.data = newData;
    
	// if data is not set, bail
	if (!this.data) return;
    
    //isc.logEchoAll(this.data);
    if (this.data) {
        if (isc.ResultSet && isc.isA.ResultSet(this.data)) {
            this.observe(this.data, "dataArrived",
                            "observer.dataArrived(arguments[0],arguments[1])");
            this.observe(this.data, "dataChanged", 
                 "observer.dataChanged(operationType, originalRecord, rowNum, updateData)");
        } else {
            // dataChanged has no params for an array
            this.observe(this.data, "dataChanged", "observer.dataChanged()");
        }
    }
    
    // create a new selection if we don't have one or if we receive new data
	if (!this.selection || (this.data != this.selection.data)) {
        
        this.createSelectionModel();
	}
    // fire dataChanged here. If the resultset is empty, dataChanged won't do anything
    this.dataChanged();
},

getData : function () {
    return this.data;    
},

// getPrimaryKeys() - Returns unique primary keys for a record.
// Use 'comparePrimaryKeys()' to compare against some record.

getPrimaryKeys : function (record) {
    var data = this.data;
    if (!isc.ResultSet || !isc.isA.ResultSet(data)) return record;
    
    var ds = this.getDataSource(),
        pkArray = ds.getPrimaryKeyFieldNames(),
        keys = {};

    if (!isc.isAn.Array(pkArray)) pkArray = [pkArray];
            
    for (var i = 0; i < pkArray.length; i++) {
        keys[pkArray[i]] = record[pkArray[i]]
    }
    return keys;
},


// setRecordValues()
// Method to update client-side data in place
// This is called directly by DynamicForms when saving valuess if this is acting as the selection
// component for a form.
setRecordValues : function (pks, values) {
   
    if (!this.data) return;
    
    var rowNum = this.data.indexOf(pks);
    if (rowNum == -1) return;
    var record = this.data.get(rowNum);
    isc.combineObjects(record, values);
    
    // if we have a valuesManager, explicitly notify it about the change
    if (this.valuesManager != null) {
        this.valuesManager._updateMultipleMemberValue(rowNum, null, record, this);
    }
    
    // refresh display.
    this.logDebug('calling layoutTiles from setRecordValues', "TileGrid");
    this.layoutTiles();
},



// no-op function to be overridden
dataArrived : function (startRecord, endRecord) {
},

dataChanged : function (operationType, originalRecord, rowNum, updateData) {
    if (!this.data || 
        (isc.ResultSet && isc.isA.ResultSet(this.data) && !this.data.lengthIsKnown())) 
    {
        this.logDebug("dataChanged: returning due to no data yet", "TileGrid");
        return;
    }
    // compute tile dimensions here. We need data to have arrived to do this.
    this.computeTileDimensions();
    // track data to help determine if deleting tiles is needed
    if (!this._oldDataLength) this._oldDataLength = 0;
    
    // the following terms will be used in the subsequent comments:
    // recycle = when recycleTiles is true and tiles are reused
    // incremental = when incremental rendering is occuring, and tiles are drawn on demand, and
    // remain even when scrolled offscreen
    // showall = see tileGrid.showAllRecords
   
    // Add
    // recycle - layoutTiles() should suffice to pickup any changes resulting from the new
    //      tile in the flow.
    // incremental - layoutTiles() will refresh the visible tiles, and subsequent scrolls should
    //      refresh tiles as well.
    // showAll - since a new tile is added, we may need to reflow a significant number of tiles,
    //      so layoutTiles() should be called, even though its expensive in this case
    if (operationType == "add") {
        this.logDebug("add", "TileGrid");
        this.layoutTiles();
    // Remove
    // recycle - delete the tile if it exists i.e. if it were a visible tile, then layoutTiles()      
    // incremental - delete the tile if its been created, then layoutTiles()
    // showall - delete the tile if its been created, then layoutTiles()
    } else if (operationType == "remove") {
        this.logDebug("remove", "TileGrid");
        if ((this.recycleTiles 
            && this.data.getLength() < this.getDrawnEndIndex() - this.getDrawnStartIndex() + 1)
            || !this.recycleTiles) {
            var oldTile = this.tiles.removeAt(this.tiles.getLength() - 1);
            oldTile.destroy();
        }
        
        this.layoutTiles();
    // Update
    // recycle, incremental, showall - tried to be smart about this by only redrawing the updated
    // tile, but we lose tile & selection pointers on update, so its better just to layoutTiles()
    } else if (operationType == "update") {
        this.logDebug("update", "TileGrid");
        this.layoutTiles();
    // Filter, sort, etc., and the new data is as long or longer than the old data
    // recycle, incremental, showall - just layoutTiles() should be neccessary, as calling getTile()
    // will create new tiles as needed, and scrolling should take care of updating out-of-sync offscreen
    // tiles.
    } else if (this.data.getLength() >= this._oldDataLength) {
        this.logDebug("filter or sort, new data same or longer", "TileGrid");
        
        // only trigger animations if we had data before
        if (this._oldDataLength > 0) this._layoutAfterDataChange();
        else this.layoutTiles();
        
    // Filter, sort, etc., and the new data is shorter than the old data
    // recycle - only delete tiles if new data length < visibleTiles.length, then layoutTiles
    // incremental, showall - delete extra tiles, then layoutTiles
    } else {
        this.logDebug("filter or sort, new data shorter", "TileGrid");
        this.selection.deselectAll();
        // doesn't seem like this is necessary, as we call cleanUpExtraTiles() at the end
        // of tileLayout(), but we'll leave this here for now just in case...
        /*
        if (this.recycleTiles && !this.showAllRecords) {
            var start = this.data.getLength();
            if (start < this.getDrawnEndIndex() - this.getDrawnStartIndex() + 1) {
                this.cleanupExtraTiles(start);
            }
        } else {
            var start = this.data.getLength();
            this.cleanupExtraTiles(start);
        }
        */
        
        // here we bank on the fact that getDrawnEndIndex returns a cached value from the previous
        // data, since layoutTiles() hasn't been called yet.
        var prevLastDrawnNum = this.getDrawnEndIndex() + 1;
        var newLastDrawnNum = prevLastDrawnNum > this.data.getLength() ? this.data.getLength() :
            prevLastDrawnNum;
        var tpl = this.getTilesPerLine();
        // at first glance it seems like if data.length is less than prevLastDrawnNum, scrolling 
        // will always be invalid; however there is the case when data length is smaller, but 
        // still produces the same number of lines, in which case the scrollTop is still valid.
        // Also scrollTop == 0 is a special case...always valid
        if (Math.floor(prevLastDrawnNum / tpl) > Math.floor(newLastDrawnNum / tpl)
            && this.getScrollTop() != 0 && this.recycleTiles) {
            this.scrollToTop();
            this.layoutTiles();
        } else {
            this._layoutAfterDataChange();    
        }
       
    }
    // set oldData length now, as next time this method is called, this.data may be new data
    this._oldDataLength = this.data.getLength();
    //isc.logWarn('dataChanged:' + [operationType, originalRecord, rowNum]);
    // need to clean up potential extra tiles when data length is zero (i.e. after a filter that 
    // returns no results), because layoutTiles won't actually run in that case. 
    if (this.data.getLength() == 0) {
        this.cleanupExtraTiles(0);    
    }
},

// helper function to handle tile animations, only called when data operation is not singular
// (not add, update, or remove)
_layoutAfterDataChange : function () {
    if (this.destroying) return;
    if (this.animateTileChange) {
        
        if (this._animating) {
            var arr = this._animationIDs;
            for (var i = 0; i < arr.length; i++) {
                this.finishAnimation(arr[i].ID);
                arr[i].tile.hide();
            }
            // for now just return - seems to work fine, but if problems arise look into
            // setting a flag that will trigger _layoutAfterDataChange again from _finishAnimating
            return;
        }
        this.fireOnPause("tileGridAnimate", this._animateChange);    
    } else {
        this.logDebug('calling layoutTiles from layoutAfterDataChange', "TileGrid");
        this.layoutTiles();    
    }
},

cleanupExtraTiles : function (start) {
    var tileArray = this.tiles;
    for (var i = start;i < tileArray.length; i++) {
        var tile = tileArray[i];
        tile.hide();
        // absolutely essential: without this, the tileGrid thinks its scrollable area is 
        // larger than it really should be.
        tile.moveTo(0, 0);
    }
    
},

destroy : function () {
    if (this.data){
        this.ignore(this.data, "dataChanged"); 
        this.ignore(this.data, "dataArrived");
        // if the data was autoCreated, destroy it to clean up RS<->DS links
        if (this.data._autoCreated && isc.isA.Function(this.data.destroy))
            this.data.destroy();
    }
    
    this.Super("destroy", arguments);
},

_getTileID : function (tileNum) {
    return this.ID + "_tile_" + tileNum;
},

getLength : function () {
    if (!this.data  
        || (isc.ResultSet && isc.isA.ResultSet(this.data) && !this.data.lengthIsKnown())) return 0;
    else return this.data.getLength();
},

makeTile : function (record, tileNum) {
    
    var props = {
        ID: this._getTileID(tileNum),
        tileNum: tileNum,
        canHover: true,
        handleHover : function () {
            if (this.creator.itemHover) this.creator.fireCallback("itemHover", "item", [this]);
        },
        
        mouseDown : function () {
            
            this.creator._tileMouseDown(this);
            this.creator.focus();
        },
        rightMouseDown : function () {
            
            this.creator._tileMouseDown(this);
            this.creator.focus();
        },
        
        mouseUp : function () {
            this.creator._tileMouseUp(this);    
        },
        doubleClick : function () {
            var tileRecord = this.creator.getTileRecord(this);
            return this.creator.recordDoubleClick(this.creator, this, tileRecord);
        }
        
    };
    if (record.tileProperties) isc.addProperties(props, record.tileProperties);
    var theConstructor = record.tileConstructor ? record.tileConstructor : this.tileConstructor;
    // store new tile in a local var for debug purposes
    var newTile = this.createAutoChild("tile", props, theConstructor);
    //newTile.setWidth(this.getTileWidth());
    //newTile.setHeight(this.getTileHeight());
    // HACK this is neccessary to avoid the tile being sized by its content. Otherwise, 
    // the tile will grow past its set width when css borders are used. 
    this.detailViewer.setWidth(newTile.getInnerWidth());
    this.detailViewer.setHeight(newTile.getInnerHeight());
   
    return newTile;
},

//> @method tileGrid.getTileHTML()
// When using the default +link{SimpleTile} class as +link{tileGrid.tileConstructor}, this
// method provides the HTML to be displayed within each tile.  See +link{tileGrid.tile}.
// 
// @param tileRecord (TileRecord) the tile for which HTML should be retrieved
// @return (HTML) HTML contents for the tile, as a String
// @visibility external
//<
getTileHTML : function (tileRecord) {
    return this.detailViewer.getBlockHTML([tileRecord]);
},

//> @method tileGrid.getTile()
// Returns the tile for the passed record or record index.
// <P>
// If +link{showAllRecords} is false, this may return null.
// @param tile (TileRecord or int) record or index of record in this.data
// @return (Canvas) tile for this record
//
// @visibility external
//<
getTile : function (tile) {
    
    var tileID, record, tileIndex;
    
    if (isc.isAn.Object(tile)) { // record is passed in 
        record = tile;
        tileIndex = this.data.indexOf(tile);
        tileID = this.getTileID(tile);
    } else { // index is passed in, get the record
        record = this.data.get(tile);
        if (!record) return null;
        // instead of reusing the tile that the record was pointing to, use the tile that is
        // pointed to by forming an ID from the current index. This creates a smoother reuse of tiles, 
        // e.g. when filtering you won't have disjointed tiles reclaimed, but rather tiles 
        // will be sequentially reclaimed. With the other approach, when filtering a 
        // bottom-scrolled tileGrid we were getting overlapping tiles:
        // tileID = this.getTileID(record);
        tileID = this._getTileID(tile);
        tileIndex = tile;
    }
    // set the tileID here to what it would be if created from scratch, so that it will fall into 
    // the second else if branch below and we can cleanly reclaim it if a tile w/ that ID exists
    // Case which spawned this: adding a record to a sorted list with showAllRecords: false
    // overwrote the new tile because of an ID conflict
    if (!tileID) tileID = this._getTileID(tileIndex);
    
    if (this.canReclaimTile(tileIndex) && !record.tileConstructor) {
        //this._limitLog('recycling tile:' + [tileIndex, record.commonName], "a");
        var recTile = this._reclaimTile(tileIndex);
        
        recTile.redraw();
        // check if the record is selected and sync the tile state with that. Since tiles
        // are reclaimed, selection will be out of sync without this check.
        if (this.selection.isSelected(record)) {
            recTile.setSelected(true);    
        } else {
            recTile.setSelected(false);
        }
        return recTile;
    // if there is a tileID, return the tile. Otherwise, make the new tile
    } else if (tileID && window[tileID]) {
        //this._limitLog('reclaiming existing tile:' + [tileIndex, tileID, record.commonName], "b");
        // pass the actual tile into _reclaimTile, to handle the bookeeping stuff
        var recTile = this._reclaimTile(tileIndex, window[tileID]);
        // same conditions apply as detailed in comments above regarding the need to redraw and
        // setSelected
        recTile.redraw();
        if (this.selection.isSelected(record)) {
            recTile.setSelected(true);    
        } else {
            recTile.setSelected(false);
        }
        
        return recTile;
    } else { // create a new tile
        //this._limitLog('creating new tile:' + [tileIndex,record.commonName], "c");
        var tId = this._getTileID(tileIndex), nTile;
        this.setTileID(record, tId);
        nTile =  this.makeTile(record, tileIndex);
        // add the created tile to tiles[] so it can be reclaimed
        if (!this.tiles) this.tiles = [];
        this.tiles.add(nTile);    
            
        return nTile;
    }
    
},

// debug functions to limit the number of logwarns produced in long loops
_logs: [],
_logLimit: 10,
_clearLogs : function () {this._logs = [];},
_limitLog : function (message, key) {
    if (!this._logs.find("key", key)) {
        this._logs.add({key:key, logs:this._logLimit});    
    }
    if (this._logs.find("key", key).logs > 0) {
        isc.logWarn(message);
        this._logs.find("key", key).logs -= 1;
    }        
},

layoutTiles : function () {   
    this.computeTileDimensions();
    //this._clearLogs();
    this.invokeSuper(isc.TileGrid, "layoutTiles");
    // in the case of scrolling to the end of the list when recycling tiles, its possible that
    // there will be leftover tiles from a previous call to layoutTiles(). These need to be hidden
    // or else they will be superimposed on the newer tiles and interfere with selection.
    // Theres also a case (non specific to recycling tiles) where tiles from before a filter
    // are superimposed on the new tiles, left over from the animation. Clean those up here.
    var tilesLen = this.tiles ? this.tiles.length : 0;
    var visLen = this._numTilesProcessed;
 //isc.logWarn('laying out tiles:' + [visLen, this._animating]);
    if (!this._animating && visLen < tilesLen) this.cleanupExtraTiles(visLen);
    
},

// Tile reclamation 
// whenever a new tile is created, it is added to this.tiles. When a tile is reclaimed, the index 
// of the record it represents is mapped to this.tiles, and that tile is returned.
_reclaimTile : function (tileIndex, tile) {
    var record = this.data.get(tileIndex), reclaimedTile;
    //this._limitLog('_reclaimTile:' + [tileIndex, tile, this.getDrawnStartIndex()], "e");
    if (!tile) {
        // we're guaranteed to have some tiles by the call to canReclaimTile()
        // this.tiles stores only enough tiles to fill the viewport, so we need to map the passed
        // tile index to a reclaimed index by subtracting the drawn start index
        var index = tileIndex - this.getDrawnStartIndex();
       
        reclaimedTile = this.tiles[index];
    } else {
        reclaimedTile = tile;    
    }
    // remove the pointer from the reclaimed tiles' current record to itself, if the record exists.
    // this is important for record<->tile integrity. If we don't do this, its possible to have
    // more than one record pointing to the same tile, which we don't want for obvious reasons
    var oldRec = this.getTileRecord(reclaimedTile);
    if (oldRec) this.setTileID(oldRec, null);
    // set up record -> tile pointer
    this.setTileID(record, reclaimedTile.ID);
    // store tileNum for selection 
    reclaimedTile.tileNum = tileIndex;
     
    return reclaimedTile;
},

canReclaimTile : function (index) {
    var startIndex = this.getDrawnStartIndex() || 0;
    if (this.recycleTiles && this.tiles && this.tiles.length > index - startIndex) {
        //this._limitLog('canReclaimTile:' + [this.tiles.length, index, startIndex], "d");
        return true;
    } else {
        return false;
    }
},

_tileMouseDown : function (tile) {
    var tileRecord = this.getTileRecord(tile);

    if (tileRecord) this.selection.selectOnMouseDown(this, tile.tileNum);   
    
    this.recordClick(this, tile, tileRecord);
    
    // check that the tile is scrolled into view
    // scrolled off the top edge
    var xPos, yPos;
    if (tile.getTop() <  this.getScrollTop()) {
        yPos = "top";
    // scrolled off the bottom edge
    } else if (tile.getTop() + tile.getVisibleHeight() > this.getScrollTop() + this.getInnerHeight()) {
        yPos = "bottom";
    }
    // scrolled off the left edge
    if (tile.getLeft() < this.getScrollLeft()) {
        xPos = "left";
    // scrolled off the right edge
    } else if (tile.getLeft() + tile.getVisibleWidth() > this.getScrollLeft() + this.getInnerWidth()) {
        xPos = "right";
    }
    // if there is some portion of the tile offscreen, scroll it into view
    if (xPos || yPos) {
        this.scrollIntoView(tile.getLeft(), tile.getTop(), tile.getVisibleWidth(),
           tile.getVisibleHeight(), xPos, yPos, true);        
    }
},

_tileMouseUp : function (tile) {
    this.selection.selectOnMouseUp(this, tile.tileNum);        
},

//>	@method	tileGrid.recordClick()    
// Executed when the tileGrid receives a 'click' event on a
// tile. The default implementation does nothing -- override to perform some action
// when any record is clicked.<br>
// A record event handler can be specified either as
// a function to execute, or as a string of script to evaluate. If the handler is defined
// as a string of script, all the parameters below will be available as variables for use
// in the script.<br>
// If you want to cancel the click based on the parameters, return false. Otherwise, return 
// true so that the click event be registered with the tile.
//
// @group	events
//
// @param viewer (TileGrid) the TileGrid itself
// @param tile (Canvas) the tile that was clicked on
// @param record (TileRecord) the record that was clicked on
//
// @example tilingEditing
// @visibility external
//<
recordClick : function () {
    return true;    
},

//>	@method	tileGrid.recordDoubleClick()    
// Executed when the tileGrid receives a 'doubleclick' event on a
// tile. The default implementation does nothing -- override to perform some action
// when any record is doubleclicked.<br>
// A record event handler can be specified either as
// a function to execute, or as a string of script to evaluate. If the handler is defined
// as a string of script, all the parameters below will be available as variables for use
// in the script.<br>
// If you want to cancel the doubleclick based on the parameters, return false. Otherwise, return 
// true so that the doubleclick event be registered with the tile.
//
// @group	events
//
// @param viewer (TileGrid) the TileGrid itself
// @param tile (Canvas) the tile that was doubleclicked on
// @param record (TileRecord) the record that was doubleclicked on
//
// @example tilingEditing
// @visibility external
//<
recordDoubleClick : function () {
    return true;    
},

// Selection
// --------------------------------------------------------------------------------------------

//> @method	tileGrid.selectionChanged() ([A])
// Called when selection changes within this tileGrid. Note this method fires for
// each record for which selection is modified - so when a user clicks inside a tileGrid this
// method will typically fire twice (once for the old record being deselected, and once for
// the new record being selected).
//
// @param	record  (object)	record for which selection changed
// @param	state   (boolean)	New selection state (true for selected, false for unselected)
// @group selection
// @visibility external
//<    
    
// DONE-make sure to change _rowSelectionChanged in GridRenderer, also change _cellSelectionChanged
// called from within the selection object via the target property
selectionChange : function (record, state) {
    //isc.logWarn('selectionChange:' + [record.title, this.getTileID(record), state]);
    // call user-defined handler and bail (don't hilite rows) if it returns false
	if (this.selectionChanged && (this.selectionChanged(record, state) == false)) return false;

    // refresh the affected records to visually indicate selection
    var selection = this.selection,
        lastItem = selection.lastSelectionItem;

    var selTile = window[this.getTileID(lastItem)];
    if (selTile && selTile.setSelected) {
        selTile.setSelected(state);
    }
   
},

_$ArrowUp:"Arrow_Up", _$ArrowDown:"Arrow_Down",
_$ArrowLeft:"Arrow_Left", _$ArrowRight:"Arrow_Right",
keyPress : function (event, eventInfo) {
    // don't let keypresses happen until we're done animating
    if (this.isAnimating("scroll")) return false;
    var lastItem = this.selection.lastSelectionItem;
    if (!lastItem) return;
    var keyName = event.keyName,    
        lastItemIndex = this.selection.data.indexOf(lastItem),
        isHoriz = this.orientation == "horizontal",
        newIndex
    ; 
    if (keyName == this._$ArrowUp) {
        newIndex = isHoriz ? this._adjacentTileIndex(lastItemIndex, "above")
                            : lastItemIndex - 1;
    } else if (keyName == this._$ArrowDown) {
        newIndex = isHoriz ? this._adjacentTileIndex(lastItemIndex, "below")
                            : lastItemIndex + 1; 
        
    } else if (keyName == this._$ArrowLeft) {
        newIndex = isHoriz ? lastItemIndex - 1 :
                   this._adjacentTileIndex(lastItemIndex, "above"); 
    } else if (keyName == this._$ArrowRight) {
        newIndex = isHoriz ? lastItemIndex + 1 :
                   this._adjacentTileIndex(lastItemIndex, "below");
    } else {
        return;    
    }
    
    // need the data length check for when we're at the end and adding 1 to the index above
    if (newIndex == -1 || newIndex > this.data.getLength() - 1) return;
    // prevent errors getting thrown from multiple keypresses + scroll animation that make it 
    // through the cracks (between the isAnimating check and layoutTiles completing)
    if (newIndex == null) return false;
    var newRec = this.selection.data.get(newIndex),
        newTile = window[this.getTileID(newRec)];
    if (newTile) {
        this._tileMouseDown(newTile);
        
    }
    
    return false;
},

// get the tile that is most adjacent to the passed in tile (via startIndex). 
_adjacentTileIndex : function (startIndex, direction) {
    // first find the next line from the currently selected tile, in the passed in direction
    var data = this.selection.data,
        lineIndex = startIndex,
        startTile = window[this.getTileID(data.get(lineIndex))],
        isHoriz = this.orientation == "horizontal",
        startTileLengthPos = isHoriz ? startTile.getTop() : startTile.getLeft(),
        startBreadthPos = isHoriz ? startTile.getLeft() : startTile.getTop(),
        startBreadth = isHoriz ? startTile.getVisibleWidth() : startTile.getVisibleHeight(),
        currTile = startTile
    ;
    //lineIndex = direction == "above" ? lineIndex - 1 : lineIndex + 1;
    //var currTile = window[data.get(lineIndex)._tileID];
    while (startTileLengthPos == (isHoriz ? currTile.getTop() : currTile.getLeft())) {
        lineIndex = direction == "above" ? lineIndex - 1 : lineIndex + 1;
        // last row special cases: if we're at an edge row, return -1 to trigger a cancel 
        // of the selection
        if (lineIndex < 0 || lineIndex > data.getLength() - 1) {
            return -1;
        }
        currTile = window[this.getTileID(data.get(lineIndex))];
        // prevent any errors when an arrow key is pressed right when a scroll animation ends
        // but before layoutTiles has completed
        if (!currTile) return -1;
    }  
    // find the tile that is most adjacent to the start tile
    // this may be tricky for different tile sizes, so we have to iterate the data looking
    // for the most adjacent tile
    var linePos = isHoriz ? currTile.getTop() : currTile.getLeft();
    var bestMatchIndex = -1, bestMatchPixels = 0;
    while ((isHoriz ? currTile.getTop() : currTile.getLeft()) == linePos) {
        // get the number of pixels that the current tile overlaps the start tile by, and keep
        // track of it if its the max so far
        var currBreadthPos = isHoriz ? currTile.getLeft() : currTile.getTop(), 
            currBreadth = isHoriz ? currTile.getVisibleWidth() : currTile.getVisibleHeight(),
            range = this._getCommonRange([startBreadthPos, startBreadthPos + startBreadth],
                                          [currBreadthPos, currBreadthPos + currBreadth])
        ;
        if (range > bestMatchPixels) {
            bestMatchIndex = lineIndex;
            bestMatchPixels = range;
        }
        lineIndex = direction == "above" ? lineIndex - 1 : lineIndex + 1;
        // last row special cases: don't do anything if we're already on an edge row 
        if (lineIndex < 0 || lineIndex > data.getLength() - 1) break;
        currTile = window[this.getTileID(data.get(lineIndex))];
        // special case for recycled tiles: the next row may not exist,  which will cause the
        // while loop check to throw an error.
        if (!currTile) break;
        
    }
    
    return bestMatchIndex;
},
 
// first and second are arrays in the form of: [range start, range end]
// what will be returned is how much of second is within first.
_getCommonRange : function(first, second) {
    // make sure there is a actually an intersection
    if ((second[0] >= first[0] && second[0] <= first[1])
        || (second[1] >= first[0] && second[1] <= first[1])
        || (second[0] <= first[0] && second[1] >= first[1]))
    {
        // get the first range start or second range start, whichever is greater
        var start = second[0] > first[0] ? second[0] : first[0];        
        // get the first range end or second range end, whichever is less
        var end = second[1] > first[1] ? first[1] : second[1];
        // the difference between the start and end is the intersection
        return end - start;
    }
    return 0;
},

//> @method tileGrid.addTile()
// This is not allowed for tileGrid. Instead, use +link{tileGrid.addData}.
//
// @visibility external
//<
addTile : function () {
     return false;
},

//> @method tileGrid.removeTile()
// This is not allowed for tileGrid. Instead, use +link{tileGrid.removeData}.
//
// @visibility external
//<
removeTile : function () {
    return false;
},

//> @method tileGrid.addData()
// @include dataBoundComponent.addData()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundAdd
//<

//> @method tileGrid.removeData()
// @include dataBoundComponent.removeData()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundRemove
//<

getRecordTile : function (recordIndex) {
    if (recordIndex == null) return null;
    // avoid logWarn. 
    // maybe should consider making that logwarn (out of bounds get()) a logDebug.
    if (recordIndex >= this.data.getLength()) return null;
    var tId = this.getTileID(this.data.get(recordIndex));
    if (!tId) return null;
    else return window[tId];
},

childVisibilityChanged : function (child, newVisibility) {
    // skip the tileLayout implementation of this method
    this.invokeSuper(isc.TileLayout, "childVisibilityChanged", child, newVisibility);
},

// @method tileGrid.hasAllVisibleTiles()
// @param range (array) data range to check for
// @param fetch (boolean) should we fetch the range if not present
//<
hasAllVisibleTiles : function (range, fetch) {
    if (isc.isA.ResultSet(this.data)) {

        // new dataset load in progress
        if (!this.data.lengthIsKnown()) return false;

        var rangeEnd = range[1] + 1;
        if (rangeEnd > this.data.getLength()) rangeEnd = this.data.getLength();
        if (this.data.rangeIsLoaded(range[0], rangeEnd)) {
            return true;    
        } else {
            if (fetch) {
                this.logDebug("in hasAllVisibleTiles, fetching range: " + range[0] + 
                              " to " + rangeEnd + ", total length: " + this.data.getLength(), 
                             "TileGrid");
                this.data.getRange(range[0], rangeEnd);
            }
            //isc.logWarn('data loading, returning:' + [range[0], range[1]]);  
            return false;
        }
        
    } else {
        return true;    
    }
},

// --------------------------Drag and Drop-----------------------------------------------------
dragAppearance:isc.EH.TRACKER,
dragTrackerMode: "title",

//>@method  tileGrid.setDragTracker()
// @include dataBoundComponent.setDragTracker()
// @visibility external
//<

//> @method tileGrid.getDragTrackerProperties()
// @include dataBoundComponent.getDragTrackerProperties()  
//<

//> @attr tileGrid.dragTrackerStyle (CSSStyleName : "gridDragTracker" : IRW)
// @include dataBoundComponent.dragTrackerStyle
//<

//> @method tileGrid.getTitleField()
// @include dataBoundComponent.getTitleField() 
//<

//> @method tileGrid.getDragTrackerTitle()
// Return "title" HTML to display as a drag tracker when the user drags some record.<br>
// Default implementation will display the cell value for the title field (see 
// +link{listGrid.getTitleField()}) for the record(s) being dragged (including any
// icons / custom formatting / styling, etc).
// <p>
// Note: Only called if +link{listGrid.dragTrackerMode} is set to <code>"title"</code>.
// @param record (ListGridRecord) First selected record being dragged
// @param rowNum (number) row index of first record being dragged 
// @return (string) Title for the row. Default implementation looks at the value of the
//                  title-field cell for the row.
// @group dragTracker
// @visibility external
//<
getDragTrackerTitle : function (record) {
    var titleField = this.getTitleField(),
        value = record[titleField];
    //if (!value) value = record[0];
    return "<nobr>" + value + "</nobr>";
            
},

//>	@method	tileGrid.drop()	(A)
//			handle a drop event
//		@return	(boolean)	true if the list can't reorder or dragging did not begin from the list body;
//							false if disabled, no selection, or otherwise
//		@group	events, dragging
//<
drop : function () {
    var index = this._lastDropIndex || 0;
    // the check below fixes an issue that occurs when dropping multiple tiles by dragging from 
    // an empty area of the grid. _lastDropIndex would get set to current data length
    // (see tileLayout.showDragLineForRecord()), but when the tiles were dropped and removed, 
    // this index is no longer valid.
    if (index > this.data.getLength()) index = 0;
    var source = this.ns.EH.dragTarget;
    var dragStartIndex = this._dragStartIndex;
    // reset _dragStartIndex so the next drag will start over
    this._dragStartIndex = null;  
    // don't check willAcceptDrop() this is essentially a parallel mechanism, so the developer 
    // shouldn't have to set that property directly.
   
    var sourceDS = source.getDataSource(),
        dropRecords = source.cloneDragData();
            
    var targetRecord = this.data.get(index);
    this.transferRecords(dropRecords, targetRecord, index, source);
    // relayout tiles when dragDataAction of source is copy. Otherwise, the tile
    // will have an invalid selected state.
    //if (source.dragDataAction == "copy") {
        // use a timer, or re-layout may not catch 
        //isc.Timer.setTimeout(source.ID + ".layoutTiles()", 1000);
    //}
},

//>	@method	tileGrid.transferDragData()
// @include dataBoundComponent.transferDragData()
//<

//>	@method	tileGrid.getDragData()
// @include dataBoundComponent.getDragData()
//<

//>	@attr	tileGrid.dragDataAction		
// @include dataBoundComponent.dragDataAction
//<

//> @method tileGrid.transferSelectedData()
// @include dataBoundComponent.transferSelectedData()
//<

// Formula/Summary builder required methods
getCellValue : function (record, field) {
    return this.detailViewer.getStandaloneFieldValue(record, field[this.fieldIdProperty]);
},

// DBC level override to call local getCellValue implementation - Formula/Summary builders
getStandaloneFieldValue : function (record, fieldName) {
    var value = this.getCellValue(record, this.getField(fieldName));
	return value;
},

// Formula/summary -related overrides from DBC
getTitleFieldValue : function (record) {
    var titleField = this.getDataSource().getTitleField(),
        title = this.getCellValue(record, this.getDataSource().getField(titleField));

    return title;
},

// basic show and hide methods
hideField : function (fieldName) {
    this.getField(fieldName).showIf = "false";
    this.getField(fieldName).hidden = true;
    this.fieldStateChanged();
},
showField : function (fieldName) {
    this.getField(fieldName).showIf = "true";
    this.getField(fieldName).hidden = false;
    this.fieldStateChanged();
},

//>	@method	tileGrid.getField()	(A)
//			return a field by fieldName
//
//		@return	(DetailViewerField) requested field or null
//<
getField : function (fieldId) { 
    if (!this.fields) return null;
    return isc.Class.getArrayItem(fieldId, this.fields, this.fieldIdProperty);
},
getFields : function () {
    return this.fields;
},
getAllFields : function () {
    return this.fields;
},

// ---------------------------------------------------------------------------------------
// FieldState
//

//>	@method	tileGrid.setFieldState() 
// Sets some presentation properties (visibility, width, userFormula and userSummary) of the 
// grid fields based on the +link{type:listGridFieldState} object passed in.<br>
// Used to restore previous state retrieved from the grid by a call to +link{tileGrid.getFieldState()}.
//
// @group viewState
// @param fieldState (listGridFieldState) state to apply to the grid's fields.
// @visibility external
// @see tileGrid.getFieldState()
//<
setFieldState : function (fieldState) {
    if (isc.isA.String(fieldState)) fieldState = this.evalViewState(fieldState, "fieldState")
    if (fieldState) {
        this.completeFields = this._setFieldState(fieldState);
        this.setFields(fieldState);
        this.markForRedraw();
        this.fieldStateChanged();
    }
},

//>	@method	tileGrid.getFieldState() 
// Returns a snapshot of the current presentation of this grid's fields as 
// a +link{type:listGridFieldState} object.
// <P>
// This object can be passed to +link{tileGrid.setFieldState()} to reset this grid's fields to
// the current state.
// <P>
// Note that the information stored includes the current width and visibility of each of this 
// grid's fields.
//
// @return (listGridFieldState) current state of this grid's fields.
// @group viewState
// @see tileGrid.setFieldState();
// @visibility external
//<


// ----------------------------------------------------------------------------
// panelHeader related methods
// ----------------------------------------------------------------------------
// panelHeader related methods

showActionInPanel : function (action) {
    // specifically add the "sort" action, which is not added by default
    if (action.name == "sort") return true;
    return this.Super("showActionInPanel", arguments);
},

// ---------------------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// printing
// ---------------------------------------------------------------------------
getPrintHTML : function () {
    // new dataset load in progress
    if (!this.data.lengthIsKnown()) {
        isc.logWarn("Attempt to print TileGrid " + this.ID + " while data is loading will be ignored");
        return "";
    }
    
    var len = this.data.getLength();
    // bail if we are trying to print a partially loaded resultset
    if (!this.data.rangeIsLoaded(0, len)) {
        isc.logWarn("Make sure all data is loaded before attempting to print " +
            "TileGrid: " + this.ID);
        return "";
    }
    var table;
    var tpl = this.printTilesPerLine ? this.printTilesPerLine : this.getTilesPerLine();
    if (this.orientation == "horizontal") {
        var width = this.getInnerWidth();
        table = "<table width='" + width + "'>";
        
        for (var i = 0; i < len; i++) {
            var currTile = this.getTile(i);
            // for every time we lay out <tilesPerLine> tiles, create a new row
            if (i % tpl == 0) {
                // first row
                if (i == 0) table += "<tr>";
                // middle row with tiles left
                else if (i < len - 1) table += "</tr><tr>";
               
            }
            table += "<td>" + currTile.getPrintHTML() + "</td>";
        }
        table += "</tr></table>";
    } else {        
        //var height = this.getInnerHeight();
        table = "<table>";
        // number of rows is determined by tpl
        for (var i = 0; i < tpl; i++) {
            table += "<tr>";
            // for each row, layout tiles by skipping every tpl number of tiles,
            // starting at the current row number
            for (var j = i; j < len; j += tpl ) {
                var currTile = this.getTile(j);
                table += "<td>" + currTile.getPrintHTML() + "</td>"        
            }
            table += "</tr>";
        }
        table += "</table>";
    }
    return table;
}

});

isc.ClassFactory.defineClass("SimpleTile", "StatefulCanvas");

//> @class SimpleTile
// Default class used by a +link{TileGrid} to render each tile.  See +link{tileGrid.tile}.
// <P>
// SimpleTiles should not be created directly, instead, use a TileGrid and provide data and
// SimpleTile instances are created for you.
//
// @treeLocation Client Reference/Grids/TileGrid
// @visibility external
//<
isc.SimpleTile.addProperties({
    //> @attr simpleTile.baseStyle (CSSClassName : "simpleTile" : IR)
    // CSS style for the tile as a whole.  As with +link{StatefulCanvas.baseStyle}, suffixes
    // are appended to this style to represent various states ("Over", "Selected", etc).
    //
    // @visibility external
    //<
    baseStyle: "simpleTile",
    
    overflow:"hidden",

    showRollOver: true,

    redrawOnStateChange: true,
    
    _redrawWithParent: false,
    
    initWidget: function () {
        this.invokeSuper(isc.SimpleTile, "initWidget", arguments);
        this.showDown = this.creator.valuesShowDown;
    },
    //> @method simpleTile.getInnerHTML()
    // The default implementation will call +link{tileGrid.getTileHTML()}.
    // @return (HTML) HTML contents for the tile, as a String
    // @visibility external
    //< 
    getInnerHTML : function () {
        this.creator.detailViewer.currentTile = this;
        var tileRec = this.creator.getTileRecord(this);
        if (!tileRec) return null;
        return this.creator.getTileHTML(tileRec);    
    },

    //> @attr simpleTile.creator (TileGrid : null : IR)
    // The +link{TileGrid} that created this SimpleTile.
    // @visibility external
    //<

    //> @method simpleTile.getRecord()
    // Return the record that this tile should render.
    // <P>
    // NOTE: a TileGrid that is doing data paging may reuse tiles with different records, so a
    // subclass of SimpleTile should not cache the record returned by getRecord().
    // <P>
    // @return (TileRecord) the TileRecord associated with this tile
    // @visibility external
    //<
    getRecord : function () {
        return this.creator.getTileRecord(this);
    }

});

isc.TileGrid.registerStringMethods({

    //> @method tileGrid.dataArrived() (A)
    // Notification method fired when new data arrives from the server to be displayed in this
    // tileGrid, (for example in response to the user scrolling a new set of tiles into view).
    // Only applies to databound tileGrid where the +link{tileGrid.data,data} attribute is a
    // +link{ResultSet}.
    // This method is fired directly in
    // response to +link{ResultSet.dataArrived(),dataArrived()} firing on the data object.
    // @param startRecord (integer) starting index of the newly loaded set of records
    // @param endRecord (integer) ending index of the newly loaded set of records (non inclusive).
    // @visibility external
    //<
    
    dataArrived:"startRecord,endRecord",
    
    selectionChanged:"record,state",
    
    itemHover : "item",
    itemClick : "item",
    recordClick : "viewer,tile,record",
    recordDoubleClick : "viewer,tile,record",
	fieldStateChanged : ""
});

