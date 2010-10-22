/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-10-22 (2010-10-22)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 





//>	@class	CellSelection
//
//	Maintains a representation of selection over a 2-dimensional grid of objects.<br>
//  Automatically created to manage cell-selection on +link{class:CubeGrid} widgets.
//
// @visibility Analytics
// @treeLocation Client Reference/System/Selection
//<
//	When you create a CellSelection object, set:
// <ul>
//		<li>cellSelection.data - to an array of records referenced by this selection
//		<li>cellSelection.numCols - to the number of columns/fields covered by this selection
//		<li>cellSelection.selectionProperty - to an alternative name for the selection property,
//			if you need to access this property manually
// </ul>

//	Implementation:
//		A uniquely-named selection property is added to each row/record of the data.
//		This property holds an array of numbers, one for each "chunk" of 32 columns,
//		whose bits (0-31) represent the selection state of the cell in the corresponding
//		column/field.

//	TODO:
//		* special case selectSingleCell/deselectSingleCell when we know only one cell can be selected
//		* convert 'select all' to not actually select all, but rather to set a bit?
//		* maybe also special case row/col selection for performance?
//		* hardcode COL_SELECTION_FLAGS table

//
//	create the CellSelection class
//
isc.ClassFactory.defineClass("CellSelection");



isc.CellSelection.addClassProperties({
	_selectionID : 0,			//>	@classAttr	isc.CellSelection._selectionID		(number : 0 : IRWA)
								//			number to generate a unique ID and selectionProperty for each selection
								//		@group	selection
                                //      @visibility internal
								//<
								
	COL_SELECTION_FLAGS : null	// generate when the first cellSelection is instantiated
});



isc.CellSelection.addClassMethods({

generateFlagTable : function () {
	isc.CellSelection.COL_SELECTION_FLAGS = [];
	for (var i = 0; i < 32; i++)
		isc.CellSelection.COL_SELECTION_FLAGS[i] = Math.pow(2,i);
}

});



isc.CellSelection.addProperties( {
	data:null,
	numCols:0,
	selectionProperty:null,
	_dirty:true,
	_selectedCells:[],
	lastSelectedCell:[],
	changedCells:[]	
});



isc.CellSelection.addMethods({



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~ Setup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//>	@attr	cellSelection.data  (Array | List: null : IRW)
//    Array (or +link{class:List}) of records to be referenced by this cell selection
//  @visibility serverSelection
//  @group selection
//<

//>	@attr	cellSelection.numCols (number : null : IRW)
//      the number of columns/fields covered by this selection
//  @visibility internal
//  @group selection
//<

//>	@attr	cellSelection.selectionProperty (string : null : IRWA)
//      A name for the selection property.  This property will be set on the records in this
//      selection's data, and used to determine whether records are selected or not.
//      Automatically generated if not specified.
//  @visibility serverSelection
//  @group selection
//<

//>	@method	cellSelection.init()    (A)
//  Initialize this selection instance.<br>
//  Note: if the <code>data</code> property is not set at init time, it should be passed to
//  the selection using the <code>selection.setData</code> method
//
//		@group	selection
//
//		@param	[all arguments]	(object)	objects with properties to override from default
// @visibility serverSelection
//<
init : function () {
	if (!isc.CellSelection.COL_SELECTION_FLAGS) isc.CellSelection.generateFlagTable();
	
	// get unique ID and selection properties
	if (!this.selectionProperty) this.selectionProperty = "_cellSelection_"+isc.CellSelection._selectionID++;

	// set the data object so we get notification for add and delete, etc.
	//	NOTE: if the data object wasn't set, use a new arrays
	this.setData((this.data ? this.data : []));
},



//>	@method	cellSelection.setData()     (A)
//			Initialize selection data.<br><br>
//			Call this method to associate the selection with a different data object.<br>
//          <i>Note: No need to call this if the contents of the selection's data is modified</i>
//		@group	selection
//		@param		newData	(array)		new data to maintain selection in
// @visibility serverSelection
//<
setData : function (newData) {		

	// if we are currently pointing to data, stop observing it
	if (this.data != null) this.ignoreData(this.data);	

	// remember the new data
	this.data = newData;

	// observe the new data so we will update automatically when it changes
	if (this.data != null) this.observeData(this.data);
},


	
//>	@method	cellSelection.observeData()	(A)
//			Observe methods on the data so we change our state.
//			Called automatically by cellSelection.setData().
//		@group	selection
//
//	@param	data	(array)		new data to be observed
// @visibility internal
//<
observeData : function (data) {
	this.observe(data, "dataChanged", "observer._dirty = true");
},



//>	@method	cellSelection.ignoreData()	(A)
//			Stop observing methods on data when it goes out of scope.
//			Called automatically by setData
//		@group	selection
//
//		@param	data	(array)		old data to be ignored
// @visibility internal
//<
ignoreData : function (data) {
	this.ignore(data, "dataChanged");
},



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~ Selection Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



//>	@method	cellSelection.cellIsSelected()
//			Return true if a particular item is selected
//		@group	selection
//
//		@param	rowNum	(number)	row index of the cell to check
//      @param  colNum  (number)    column index of the cell to check
//		@return		(boolean)	true == object is selected
//								false == object is not selected
// @group selection
// @visibility Analytics
//<
cellIsSelected : function (rowNum, colNum) {
	var row = this.data[rowNum],
		rowSelection = (row ? row[this.selectionProperty] : null),
		rowChunkSelection = (rowSelection ? rowSelection[Math.floor(colNum/32)] : null),
		colSelectionFlag = isc.CellSelection.COL_SELECTION_FLAGS[colNum%32];
	return (rowChunkSelection != null && ((rowChunkSelection & colSelectionFlag) != 0));
},



rowHasSelection : function (rowNum) {
	var row = this.data[rowNum],
		rowSelection = (row ? row[this.selectionProperty] : null),
		numRowChunks = Math.ceil(this.numCols/32);
		
	// if row doesn't exist or row selection property is null/zero, return false
	if (!row || !row[this.selectionProperty]) return false;
	
	// otherwise check each chunk of the row for a selection (true == nonzero value)
	for (var i = 0; i < numRowChunks; i++) {
		if (rowSelection[i]) return true;
	}
	// made it through all row chunks with no selection, so return false
	return false;
},


colHasSelection : function (colNum) {
	if (colNum > this.numCols - 1) return false;
	
	var colSelectionFlag = isc.CellSelection.COL_SELECTION_FLAGS[colNum%32],
		rowChunkNum = Math.floor(colNum/32);
	
	// iterate through all rows of data	
    var rows = this.data,
        numRows = rows.length;
	for (var i = 0; i < numRows; i++) {
	
		// get selection property for the current row
		var rowSelection = rows[i][this.selectionProperty];
		
		// if selection property exists, selection chunk is nonzero, and the flag for this column is set, return true
		if (rowSelection && rowSelection[rowChunkNum] && ((rowSelection[rowChunkNum] & colSelectionFlag) != 0))
			return true;
	}
	// made it through all rows with no selection, so return false
	return false;
},


//>	@method	cellSelection.anySelected()
//			Is anything in the list selected?
//		@group	selection
//
//		@return		(boolean)	true == at least one item is selected
//								false == nothing at all is selected
// @visibility Analytics
// @group selection
//<
anySelected : function () {
	var	numRowChunks = Math.ceil(this.numCols/32);

	// iterate through all rows of data
    var rows = this.data,
        numRows = rows.length;

	for (var i = 0; i < numRows; i++) {
	
		// get selection property for the current row
		var rowSelection = rows[i][this.selectionProperty];
		if (!rowSelection) continue;
		
		// check each chunk of the row for a selection (true == nonzero value)
		for (var j = 0; j < numRowChunks; j++) {
			if (rowSelection[j]) return true;
		}
	}
	// made it through all rows with no selection, so return false
	return false;
},



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~ Selection Getters ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//>	@method	cellSelection.getSelectedCells()
//  Returns an array of the currently selected cells.  Each cell is returned as a 2 element
//  array in the form <code>[rowNum, colNum]</code>.
// @group  selection
// @return (array)  an array of the selected cells, as 2 element arrays 
// @visibility Analytics
// @group selection
//<
getSelectedCells : function () {
	// first see if we already have a clean list of selected cells
	if (!this._dirty) return this._selectedCells;

	var selectedCells = [],
		colSelectionFlags = isc.CellSelection.COL_SELECTION_FLAGS,
		numRowChunks = Math.ceil(this.numCols/32),
        rows = this.data,
        numRows = rows.length,
        rowSelection;

	// iterate through all rows of data
	for (var i = 0; i < numRows; i++) {
	
		// get selection property for the current row
		rowSelection = rows[i][this.selectionProperty];
		if (!rowSelection) continue;
		
		// iterate through all chunks in this row
		for (var j = 0, rowChunkSelection, numColsInChunk; j < numRowChunks; j++) {
			// get selection flags for this chunk
			rowChunkSelection = rowSelection[j];
			if (!rowChunkSelection) continue;
			
			// how many columns in this chunk (32 for all but the last chunk)
			// NOTE: should use this.numCols%32 for non-chunked CellSelection too
			numColsInChunk = (j == numRowChunks - 1 && this.numCols%32 != 0) ? this.numCols%32 : 32;
			
			// iterate through the flags to find the selected cells in this chunk
			for (var k = 0; k < numColsInChunk; k++) {
				if ((rowChunkSelection & colSelectionFlags[k]) != 0) {
					selectedCells[selectedCells.length] = [i,j*32+k];
				}
			}
		}
	}
		
	// cache and return the list of selected cells
	this._selectedCells = selectedCells;
	this._dirty = false;
	return selectedCells;
},


//	returns an array containing the numbers of all rows that have at least one cell selected
getSelectionRowNums : function () {
	var selectionRowNums = [],
		numRowChunks = Math.ceil(this.numCols/32), 
        rows = this.data, 
        numRows = rows.length, 
        rowSelection;

	// iterate through all rows of data
	for (var i = 0; i < numRows; i++) {
	
		// get selection property for the current row
		rowSelection = rows[i][this.selectionProperty];
		if (!rowSelection) continue;
		
		// iterate through chunks in this row
		for (var j = 0, numColsInChunk; j < numRowChunks; j++) {
			// if any selection flags are set, add the current row's number to the list we'll return
			if (rowSelection[j]) {
				selectionRowNums[selectionRowNums.length] = i;
				break;
			}
		}
	}
	return selectionRowNums;
},


getSelectionColNums : function () {
	var selectionColNums = [],
		allRowSelections = [],
		colSelectionFlags = isc.CellSelection.COL_SELECTION_FLAGS,
		numRowChunks = Math.ceil(this.numCols/32), 
        rows = this.data, 
        numRows = rows.length, 
        rowSelection;
	
	// bitwise-OR the selection flags for every row into allRowSelections
	for (var i = 0; i < numRows; i++) {
	
		// get selection property for the current row
		rowSelection = rows[i][this.selectionProperty];
		if (!rowSelection) continue;
		
		// iterate through chunks in this row
		for (var j = 0, numColsInChunk; j < numRowChunks; j++) {
			// if any selection flags are set, bitwise-OR with selection flags for all previous rows
			if (rowSelection[j]) {
				allRowSelections[j] = allRowSelections[j] | rowSelection[j];
			}
		}
	}

	// if no selections, return now
	if (allRowSelections.length == 0) return selectionColNums;
	
	// compare allRowSelections flags against each constant in colSelectionFlags
	// to determine which columns have a selected cell
	for (var i = 0, numCols = this.numCols; i < numCols; i++) {
		if ((allRowSelections[Math.floor(i/32)] & colSelectionFlags[i%32]) != 0)
			selectionColNums[selectionColNums.length] = i;
	}
	
	return selectionColNums;
},


getSelectionBounds : function () {
	var rows = this.getSelectionRowNums(),
		cols = this.getSelectionColNums();
	return [rows.first(), cols.first(), rows.last(), cols.last()];
},



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~ Selection Setters (internal) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



//>	@method	cellSelection._setCellSelection()
// Select or deselect a particular cell.  All other selection routines call this one.
// <p>
// This method:<pre>
// - Initializes row selection property if none.
// - Saves cell coordinates in this.lastSelectedCell if selection state of
//   this cell changes.
// - Marks selection as dirty if selection state of this cell changes.
// </pre>
//
//		@param	rowNum		(number)	number of row
//		@param	colNum		(number)	number of column
//		@param	newState	(boolean)	desired selection state for this cell	
// 	
//		@return				(boolean)	true if selection state of this cell is changed,
//										false otherwise
// @visibility internal
//<
_setCellSelection : function (rowNum, colNum, newState) {

	var row = this.data[rowNum],
		rowSelection = (row ? row[this.selectionProperty] : null),
		rowChunkNum = Math.floor(colNum/32),
		rowChunkSelection = (rowSelection ? rowSelection[Math.floor(colNum/32)] : 0),
		colSelectionFlag = isc.CellSelection.COL_SELECTION_FLAGS[colNum%32];

	// if the row or column does not exist, return false
	if (!row || colNum > this.numCols - 1) return false;
	
	// if the row is not enabled, return false
	if (row.enabled == false) return false;

	// if the row has no selection property, initialize it now
	if (rowSelection == null) {
		rowSelection = row[this.selectionProperty] = [];
		for (var i = 0, numChunks = Math.ceil(this.numCols/32); i < numChunks; i++) rowSelection[i] = 0;
	}
	// if this chunk in the row has no selection flags yet, initialize them now
	// NOTE: this will only happen if numCols is changed without throwing away this selection...would this ever happen?
	else if (rowChunkSelection == null) {
		rowSelection[rowChunkNum] = 0;
	}

	// if the cell's selection state is already set to the new state, return false
	if (((rowChunkSelection & colSelectionFlag) != 0) == newState) return false;
	
	// cell exists, is enabled, and has a different state; so change the state via bitwise XOR
	rowSelection[rowChunkNum] = rowChunkSelection ^ colSelectionFlag;

	// if selecting, remember that this is the last selected cell
	if (newState) this.lastSelectedCell = [rowNum, colNum];
	
	// mark the cached selection as dirty
	this._dirty = true;

	// return true to indicate that the cell's state was actually changed
	return true;
},

setCellRangeSelection : function (startRowNum, startColNum, endRowNum, endColNum, newState) {
    this.changedCells = 
        this._setCellRangeSelection(startRowNum, startColNum, endRowNum, endColNum, newState); 
	return this._cellSelectionsChanged();
},

// returns array of [rowNum,colNum] arrays representing cells whose selection state was actually
// changed
_setCellRangeSelection : function (startRowNum, startColNum, endRowNum, endColNum, newState) {
	var changedCells = [],
		minRowNum, maxRowNum, minColNum, maxColNum;

	if (startRowNum <= endRowNum) {
		minRowNum = startRowNum;
		maxRowNum = endRowNum;
	} else {
		minRowNum = endRowNum;
		maxRowNum = startRowNum;
	}
	
	if (startColNum <= endColNum) {
		minColNum = startColNum;
		maxColNum = endColNum;
	} else {
		minColNum = endColNum;
		maxColNum = startColNum;
	}

    //>DEBUG
    if (this.logIsDebugEnabled()) {
        this.logDebug((newState ? "selecting " : "deselecting ") + 
                      [minRowNum, minColNum] + " through " + [maxRowNum, maxColNum]);
    }
    //<DEBUG

	for (var rowNum = minRowNum; rowNum <= maxRowNum; rowNum++) {
		for (var colNum = minColNum; colNum <= maxColNum; colNum++) {
			if (this._setCellSelection(rowNum, colNum, newState)) {
				changedCells[changedCells.length] = [rowNum, colNum];
            }
        }
    }

	return changedCells;
},


//	sets this.changedCells
//	calls this.selectionChanged()
setCellListSelection : function (cellList, newState) {
	if (!cellList) return false;
	var changedCells = [];
	
	for (var i = 0, length = cellList.length, rowNum, colNum; i < length; i++) {
		rowNum = cellList[i][0];
		colNum = cellList[i][1];
		if (this._setCellSelection(rowNum, colNum, newState))
			changedCells[changedCells.length] = [rowNum, colNum];
	}

	this.changedCells = changedCells;
	
	return this._cellSelectionsChanged();
},



//	helper called by a bunch of other methods
_cellSelectionsChanged : function () {
	if (this.changedCells.length > 0) {
		this.selectionChanged();
		return true;
	} else
		return false;
},



//>	@method	cellSelection.selectionChanged()
//  Observable handler fired whenever the cell selection is modified
//		@group	selection
//
// @visibility internal
// @group selection
//<
selectionChanged : function () {},



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~ Selection Setters (public) ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


setCellSelection : function (rowNum, colNum, newState) {
	if (this._setCellSelection(rowNum, colNum, newState)) {
		this.changedCells = [[rowNum, colNum]];
		this.selectionChanged();
		return true;
	} else
		return false;
},



//>	@method	cellSelection.selectCell()
//			Select a particular cell
//		@group	selection
//
//		@param		rowNum  (number)	row index of cell to select
//      @param      colNum  (number)    column index of cell to select
//		@return				(boolean)	true == selection actually changed, false == no change
//  @visibility Analytics
//<
selectCell : function (rowNum, colNum) {
	return this.setCellSelection(rowNum, colNum, true);
},



//>	@method	cellSelection.deselectCell()
//			Deselect a particular cell
//		@group	selection
//
//		@param		rowNum	(number)	row index of the cell to select
//      @param      colNum  (number)    column index of the cell to select
//		@return				(boolean)	true == selection actually changed, false == no change
//  @visibility Analytics
//<
deselectCell : function (rowNum, colNum) {
	return this.setCellSelection(rowNum, colNum, false);
},


selectCellRange : function (startRowNum, startColNum, endRowNum, endColNum) {
	this.changedCells = this._setCellRangeSelection(startRowNum, startColNum, endRowNum, endColNum, true);
	return this._cellSelectionsChanged();
},



deselectCellRange : function (startRowNum, startColNum, endRowNum, endColNum) {
	this.changedCells = this._setCellRangeSelection(startRowNum, startColNum, endRowNum, endColNum, false);
	return this._cellSelectionsChanged();
},

//	simply setting the selectionProperty for each row to 0 or ~0 would seem a
//	good shortcut in the following methods, but this wouldn't tell us
//	exactly which cells have changed--and setting the style of a cell unnecessarily
//	is ~really~ expensive

selectRow : function (rowNum) {
	return this.selectCellRange(rowNum, 0, rowNum, this.numCols-1);
},

deselectRow : function (rowNum) {
	return this.deselectCellRange(rowNum, 0, rowNum, this.numCols-1);
},

selectCol : function (colNum) {
	return this.selectCellRange(0, colNum, this.data.length-1, colNum);
},

deselectCol : function (colNum) {
	return this.deselectCellRange(0, colNum, this.data.length-1, colNum);
},

selectAll : function () {
	return this.selectCellRange(0, 0, this.data.length-1, this.numCols-1);
},

deselectAll : function () {
	return this.deselectCellRange(0, 0, this.data.length-1, this.numCols-1);
},


//>	@method	cellSelection.selectCellList()
//			select an array of cells
//		@group	selection
//		@param		list	(array[])	Array of cells to select. Each cell can be specified
//                                      as a 2 element array <code>[rowNum, colNum]</code>
//		@return				(boolean)	true == selection actually changed, false == no change
//  @visibility Analytics
//<
selectCellList : function (cellList) {
	return this.setCellListSelection(cellList, true);
},

//>	@method	cellSelection.deselectCellList()
//			deselect an array of cells
//
//		@group	selection
//		@param		list	(array[])	Array of cells to deselect. Each cell can be specified
//                                      as a 2 element array <code>[rowNum, colNum]</code>
//		@return				(boolean)	true == selection actually changed, false == no change
//  @visibility Analytics
//<
deselectCellList : function (cellList) {
	return this.setCellListSelection(cellList, false);
},



//>	@method	cellSelection.selectSingleCell()
//			select a single cell and deselect everything else
//		@group	selection
//		@param		rowNum (number) row index of cell to select
//      @param      colNum  (number)    column index of cell to select
//		@return				(boolean)	true == selection actually changed, false == no change
//  @visibility Analytics
//<
selectSingleCell : function (rowNum, colNum) {
	//	remember whether this cell was selected before we deselect all cells
	var cellWasSelected = this.cellIsSelected(rowNum, colNum);

	//	deselect all cells, using the helper method so we don't call selectionChanged() yet
	this.changedCells = this._setCellRangeSelection(0, 0, this.data.length-1, this.numCols-1, false);
	
	//	select this cell
	this._setCellSelection(rowNum, colNum, true);
	
	//	if this cell wasn't selected before, add it to changedCells
	if (!cellWasSelected)
		this.changedCells[this.changedCells.length] = [rowNum, colNum];
	// XXX else remove it from changedCells...

	return this._cellSelectionsChanged();
},



selectSingleRow : function (rowNum) {
	var changedCells = [];
	
	// deselect rows before this one
	if (rowNum > 0)
		changedCells = this._setCellRangeSelection(0, 0, rowNum-1, this.numCols-1, false);

	// select this row
	changedCells = changedCells.concat(this._setCellRangeSelection(rowNum, 0, rowNum, this.numCols-1, true));
	
	// deselect rows after this one
	if (rowNum < this.data.length-1)
		changedCells = changedCells.concat(this._setCellRangeSelection(rowNum+1, 0, this.data.length-1, this.numCols-1, false));
	
	this.changedCells = changedCells;
	
	return this._cellSelectionsChanged();
},



selectSingleCol : function (colNum) {
	var changedCells = [];
	
	// deselect columns before this one
	if (colNum > 0)
		changedCells = this._setCellRangeSelection(0, 0, this.data.length-1, colNum-1, false);

	// select this column
	changedCells = changedCells.concat(this._setCellRangeSelection(0, colNum, this.data.length-1, colNum, true));
	
	// deselect columns after this one
	if (colNum < this.numCols-1)
		changedCells = changedCells.concat(this._setCellRangeSelection(0, colNum+1, this.data.length-1, this.numCols-1, false));
	
	this.changedCells = changedCells;
	
	return this._cellSelectionsChanged();
},


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~ Event-based Selection ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//>	@method	cellSelection.selectOnMouseDown()	(A)
//		@group	selection, mouseEvents
//			Update the selection as the result of a mouseDown event.
//			Handles shift, control, etc. key selection as well.
//			Call this from a mouseDown handler.
//		@see	GridRenderer.mouseDown()
//      @see    ListGrid.mouseDown()
//
//		@param	target	(Canvas)	target object
//		@param	recordNum	(number)	record number mouse went down on
//
//		@return			(boolean)	true == selection was changed, false == no change
//<
selectOnMouseDown : function (target, rowNum, colNum) {

	// if the target's selectionType is NONE, just bail
	if (target.selectionType == isc.Selection.NONE)	return false;
	
    // remember mouseDown location in case we start drag selecting
    this.startRow = this.lastRow = rowNum;
    this.startCol = this.lastCol = colNum;
	var cellSelected = this.cellIsSelected(rowNum, colNum),
		selection = this.getSelectedCells(),
		selectionBounds = this.getSelectionBounds();

	// clear flags for deselecting cells on mouseUp
	// these are set in the simple and normal cases below (3 and 5)
	// see selectOnMouseUp() for details
	this.deselectCellOnMouseUp = false;
	this.deselectOthersOnMouseUp = false;
	
	// Case 1: SINGLE selection
	if (target.selectionType == isc.Selection.SINGLE) {
		this.selectSingleCell(rowNum, colNum);
		return true;


	// Case 2: Shift-selection (select contiguous range of cells)
	} else if (isc.EventHandler.shiftKeyDown()) {
		// if nothing was selected,
		if (selection.length == 0) {
			// simply select that cell
			this.selectCell(rowNum, colNum);
			return true;				

		// otherwise since something was selected
		} else {
			// select a range of cells
			var startRow = selectionBounds[0],
				startCol = selectionBounds[1],
				endRow = selectionBounds[2],
				endCol = selectionBounds[3];

			if (rowNum < startRow)
				startRow = rowNum;
			else if (rowNum >= endRow)
				endRow = rowNum;
			else {	// XXX if rowNum=startRow, rowNum+1 isn't correct
				this.deselectCellRange(rowNum+1,startCol,endRow,endCol);
				endRow = rowNum;
			}
			
			if (colNum < startCol)
				startCol = colNum;
			else if (colNum >= endCol)
				endCol = colNum;
			else {
				this.deselectCellRange(startRow,colNum+1,endRow,endCol);
				endCol = colNum;
			}
			
			this.selectCellRange(startRow,startCol,endRow,endCol);
			
			return true;
		}


	// Case 3: SIMPLE selection (toggle selection of this cell, but defer deselection until mouseUp)
	} else if (target.selectionType == isc.Selection.SIMPLE) {
		if (!cellSelected) {
			this.selectCell(rowNum, colNum);
			return true;
		} else {
			this.deselectCellOnMouseUp = true;
			return false;
		}


	// Case 4: meta-key selection (simply toggle selection of this record)
	} else if (isc.Browser.isMac ? isc.EventHandler.metaKeyDown() 
                                 : isc.EventHandler.ctrlKeyDown()) {
		this.setCellSelection(rowNum, colNum, !cellSelected);
		return true;


	// Case 5: normal selection (no modifier keys)
	} else {
        if (!cellSelected) {
            // if you click outside of the selection, select the new cell and deselect everything
            // else
            this.selectSingleCell(rowNum, colNum);
            return true;
        } else if (isc.EventHandler.rightButtonDown()) {
            // never deselect if you right click on the selection, unless you start drag selecting
            this.deselectOnDragMove = true;
            return false;
        } else {
            // simpleDeselect mode: this mode is designed to make it easy to entirely get rid of
            // your selection, so you don't have to know about ctrl-clicking.  In a nutshell, if you
            // click on the existing selection, it will be entirely deselected. 

            if (this.dragSelection) {
                if (this.simpleDeselect) {
                    // if you click on the selection, deselect the entire selection including the
                    // clicked-on cell.  Later, if a drag begins, select the clicked-on cell.
                    this.deselectAll();
                    this.selectOriginOnDragMove = true;
                    return true;
                }
                // for a drag selection, deselect others immediately; otherwise we'll be dragging
                // out a new selection within/overlapping with an existing selection, which we only
                // want to do on a ctrl-click.  This matches Excel.
                this.selectSingleCell(rowNum, colNum);
                return true;
            } else {
                if (this.simpleDeselect) {
                    // deselect everything on mouseUp, including the cell clicked on
                    this.deselectAllOnMouseUp = true;
                } else {
                    // if we click in a multiple selection, deselect everything but the clicked-on
                    // item, but don't do it until mouseUp in order to allow dragging the current
                    // selection.  This matches Windows Explorer.
                    this.deselectOthersOnMouseUp = (selection.length > 1);
                }
                return false;
            }
        }
	}

},

//>	@method	cellSelection.selectOnDragMove()	(A)
//			during drag selection, update the selection as a result of a dragMove event
//		@group	selection, mouseEvents
//<
selectOnDragMove : function (target, currRow, currCol) {
    var startRow = this.startRow,
        startCol = this.startCol,
        lastRow = this.lastRow,
        lastCol = this.lastCol;

    if (currRow < 0 || currCol < 0) {
        //>DEBUG
        this.logWarn("selectOnDragMove: aborting due to negative coordinate: " + 
                     [currRow, currCol]);
        //<DEBUG
        return;
    }

    if (currRow == lastRow && currCol == lastCol) return; // no change
    
    // single selection - just shift to the current target cell!
    if (target.selectionType == isc.Selection.SINGLE) {
        this.selectSingleCell(currRow, currCol);
        return;
    }
    
    //this.logWarn("selectOnDragMove: start: " + [startRow, startCol] +
    //             ", last: " + [lastRow, lastCol] +
    //             " current: " + [currRow, currCol]);

    var changedCells = [];
    if (this.selectOriginOnDragMove) {
        this._setCellSelection(startRow, startCol);
        changedCells.add([startRow, startCol]);
        this.selectOriginOnDragMove = false;

    } else if (this.deselectOnDragMove || this.deselectAllOnMouseUp ||
                this.deselectOthersOnMouseUp) 
    {
        // deselect on dragMove is for right-dragging.  The others flags are failsafes in case you
        // use drag selection without setting the flag.
        this.selectSingleCell(startRow, startCol);
        this.deselectAllOnMouseUp = this.deselectOthersOnMouseUp = this.deselectOnDragMove = false;
    }

    // If the mouse has moved further away from the start position since the last dragMove, select
    // more cells.  If it's moved closer to the start position, deselect cells.

    // There are 6 possible orderings of start, last and current position, thus 6 cases per
    // direction.

    // The two orderings (per direction) of (last, start, current) and (current, start, last)
    // indicate the mouse has moved across the start position.  In this case the old selection area
    // and new selection area are guaranteed non-overlapping, except for the single start cell.
    if (
        // if moved on the "rows" axis and crossed the origin
        (currRow != lastRow &&
         ((lastRow >= startRow && startRow >= currRow) || 
          (currRow >= startRow && startRow >= lastRow)))
        ||
        // or we moved on the "cols" axis and crossed the origin
        (currCol != lastCol &&
         ((lastCol >= startCol && startCol >= currCol) || 
          (currCol >= startCol && startCol >= lastCol)))
        )
    {
        // NOTE: The start cell doesn't change, but it would appear to deselect and reselect if we
        // naively deselected the old rect and selected the new, so we manually deselect and select
        // the start cell, so it isn't listed in the changed cells.

        // deselect the entire range that has been drag selected so far
        this._setCellSelection(startRow, startCol, false);
        changedCells.addList(
            this._setCellRangeSelection(startRow, startCol, lastRow, lastCol, false));

        // then select the new area. 
        this._setCellSelection(startRow, startCol, true);
        changedCells.addList(
            this._setCellRangeSelection(startRow, startCol, currRow, currCol, true));
        
        this.changedCells = changedCells;
        this._cellSelectionsChanged();
        
        this.lastRow = currRow;
        this.lastCol = currCol;
        return;
    }

    // The other four orderings of last, start and current indicate a shrinking or growth of the
    // selection area, with the new selection area overlapping the old.

    // The increase or decrease in selection always consists of two rectangles, one for the
    // increase/decrease of selection in the horizontal direction, one for the increase/decrease of
    // selection in the vertical direction.  These rectangles will potentially overlap at the
    // corner, so the vertical case includes the corner and the horizontal case does not.

    // NOTE: we manually combine the changed cell list from the two selection changes, so that
    // there's only one selectionChanged() event seen by observers.

    if (currRow >= 0 && currRow != lastRow) {
        // moved vertically
        if (startRow >= lastRow && lastRow > currRow) {
            // increasing selection upward (last < start)
            changedCells.addList(
                this._setCellRangeSelection(currRow, startCol, lastRow-1, lastCol, true));
        } else if (startRow >= currRow && currRow > lastRow) {
            // decreasing selection downward (last < start)
            changedCells.addList(
                this._setCellRangeSelection(lastRow, startCol, currRow-1, lastCol, false));
        } else if (startRow <= currRow && currRow < lastRow) {
            // decreasing selection upward (last > start)
            changedCells.addList(
                this._setCellRangeSelection(currRow+1, startCol, lastRow, lastCol, false));
        } else if (startRow <= lastRow && lastRow < currRow) {
            // increasing selection downward (last > start)
            changedCells.addList(
                this._setCellRangeSelection(lastRow+1, startCol, currRow, lastCol, true));
        
        }
        
        // NOTE: we change lastRow because we want the horizontal case to handle the corner area
        // between current and last.
        lastRow = this.lastRow = currRow;
    }
    
    if (currCol >= 0 && currCol != lastCol) {
        // moved horizontally 
        if (startCol >= lastCol && lastCol > currCol) {
            // increasing selection on the left (last < start)
            changedCells.addList(
                this._setCellRangeSelection(startRow, currCol, lastRow, lastCol-1, true));
        } else if (startCol >= currCol && currCol > lastCol) {
            // decreasing selection on the left (last < start)
            changedCells.addList(
                this._setCellRangeSelection(startRow, lastCol, lastRow, currCol-1, false));
        } else if (startCol <= currCol && currCol < lastCol) {
            // decreasing selection on the right (last > start)
            changedCells.addList(
                this._setCellRangeSelection(startRow, currCol+1, lastRow, lastCol, false));
        } else if (startCol <= lastCol && lastCol < currCol) {
            // increasing selection on the right (last > start)
            changedCells.addList(
                this._setCellRangeSelection(startRow, lastCol+1, lastRow, currCol, true));
        
        }
        
        this.lastCol = currCol;
    }

    this.changedCells = changedCells;
    this._cellSelectionsChanged();
},

//>	@method	cellSelection.selectOnMouseUp()	(A)s
//			Update the selection as the result of a mouseUp event.
//			We currently use this to defer deselection for drag-and-drop of multiple records.
//			Call this from a mouseUp handler.
//		@group	selection, mouseEvents
//		@see	ListGrid.mouseUp()
//
//		@param	target	(Canvas)	target object
//		@param	recordNum	(number)	record number mouse went down on
//
//		@return			(boolean)	true == selection was changed, false == no change
//<
selectOnMouseUp : function (target, rowNum, colNum) {
	// if the target's selectionType is NONE, just bail
	if (target.selectionType == isc.Selection.NONE)	return false;

	//		If multiselection is on and no modifier keys are down, we need to
	// deselect any cells other than the one that is clicked. BUT, we can't do this in
	// selectOnMouseDown() because the user might be clicking on a cell in a multiple selection
	// to initiate a drag operation with all of the selected cells. So in selectOnMouseDown()
	// we set a deselectOthersOnMouseUp flag that we can check here and do the deselection
	// if necessary.
	if (this.deselectOthersOnMouseUp) {
		this.selectSingleCell(rowNum, colNum);
        this.deselectOthersOnMouseUp = false;
		return true;
	//		Similarly, if SIMPLE selection is enabled we don't want to deselect the current
	// cell if the user is initiating a drag. We set a deselectRecordOnMouseUp flag in this case.
	} else if (this.deselectRecordOnMouseUp) {
		this.deselectCell(rowNum, colNum);
        this.deselectRecordOnMouseUp = false;
		return true;
    } else if (this.deselectAllOnMouseUp) {
        this.deselectAll();
        this.deselectAllOnMouseUp = false;
	} else
		return false;
}

});	// END isc.CellSelection.addMethods()


