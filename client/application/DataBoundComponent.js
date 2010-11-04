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






isc.ClassFactory.defineInterface("DataBoundComponent");

//> @interface DataBoundComponent
// A DataBoundComponent is a widget that can configure itself for viewing or editing objects which
// share a certain schema by "binding" to the schema for that object (called a "DataSource").
// <P>
// A schema (or DataSource) describes an object as consisting of a set of properties (or
// "fields").
// <P>
// DataBoundComponents have a +link{dataBoundComponent.dataSource,common set of APIs} for
// dealing with binding to DataSources, 
// +link{dataBoundComponent.fields,overriding or augmenting} the schema information
// provided by a DataSource, and manipulating objects or sets of object from the DataSource.
// <P>
// The following visual components currently support databinding:<pre>
//   +link{class:DynamicForm}
//   +link{class:DetailViewer}
//   +link{class:ListGrid}
//   +link{class:TreeGrid}
//   +link{class:TileGrid}
//   +link{class:ColumnTree}
//   +link{class:CubeGrid}
// </pre>
// The following non-visual components also support databinding:<pre>
//   +link{class:ValuesManager}
//   +link{class:ResultSet}
//   +link{class:ResultTree}
// </pre>
//
// @treeLocation Client Reference/Data Binding
// @visibility external
//<
// Currently the DataBinding APIs are present on all Canvii.
// Documented as a separate, intervening class, to separate functionality (DataBoundComponent) 

isc.Canvas.addClassProperties({
    //>	@type	DragDataAction
	//			What do we do with data that's been dropped into another list?
	//			@visibility external
	//			@group	drag
    //	@value	"none"   Don't do anything, resulting in the same data being in both lists. 
    //	@value	isc.Canvas.COPY		Copy the data leaving the original in our list.
    COPY:"copy",		
    //	@value	isc.Canvas.MOVE			Remove the data from this list so it can be moved into the other list.
	MOVE:"move",		
	//<
    // Backcompat only: deprecated for 5.5 release in favor of "copy"
	CLONE:"clone"		//	@value	isc.Canvas.CLONE		Clone the data (so there is another copy), leaving the original in our list.
        
});

isc.Canvas.addClassMethods({

getFieldImageDimensions : function (field, record) {
    var width, height;

    // if any of field.imageWidth/Height/Size are set as strings, assume they are property
    // names on the record
    var imageWidthProperty, imageHeightProperty, imageSizeProperty;
    if (isc.isA.String(field.imageWidth)) {
        imageWidthProperty = field.imageWidth;
    } else {
        width = field.imageWidth;
    }
    if (isc.isA.String(field.imageHeight)) {
        imageHeightProperty = field.imageHeight;
    } else {
        height = field.imageHeight;
    }
    if (isc.isA.String(field.imageSize)) {
        imageSizeProperty = field.imageSize;
    } else {
        width = width || field.imageSize;
        height = height || field.imageSize;
    }

    if (record != null) {
        width = width || record[imageWidthProperty] || record[imageSizeProperty];
        height = height || record[imageHeightProperty] || record[imageSizeProperty];
    }

    return { width: width, height: height };
},

// Generic values management for mapping fieldNames or dataPaths to values within a values object.
// Implemented at the DBC level as static methods as this is used across dataBoundComponents,
// and also by ValuesManager

// _clearValue
// Clears the value for some field from a values object
// Handles datapath / nested values
_$slash:"/",
_clearFieldValue : function (fieldName, values) {
    if (!values || fieldName == null || isc.isAn.emptyString(fieldName)) return;
    
    var isDataPath = fieldName.contains(this._$slash);
    if (isDataPath) {
        var segments = fieldName.split(this._$slash),
            nestedVals = [];
        if (isc.isAn.emptyString(segments.last())) segments.length-=1;
        for (var i = 0; i < segments.length; i++) {
            if (isc.isAn.emptyString(segments[i])) continue; 
            // handle the case where we dont have a nested value for this path
            if (values == null) {
                nestedVals.length = 0;
                break;
            }
            nestedVals.add(values);
            if (i == segments.length-1) {
                delete values[segments[i]];
            } else {
                values = values[segments[i]];
            }
        }
        // If we have a nested values object like this:
        //  {foo:{ moo: {zoo:"a"} } }
        // in addition to deleting the zoo attribute from the moo object we may as well clear up
        // the empty object stored under foo.moo
        for (var i = nestedVals.length-1; i > 0; i--) {            
            if (isc.isAn.emptyObject(nestedVals[i])) {
                delete nestedVals[i-1][segments[i-1]];
            }
        }
    } else {
        delete values[fieldName];
    }
    
},

// _saveValue
// Updates some values object with a new field value.
// Handles dataPath in the field ID
_saveFieldValue : function (field, value, values) {
    if (values == null) return;
    var isDataPath = field.contains(this._$slash);
    
    if (isDataPath) {
        
        field.trim(isc.Canvas._$slash);
        var segments = field.split(this._$slash);
        for (var i = 0; i < segments.length; i++) {           
            if (isc.isAn.emptyString(segments[i])) continue;
            if (i == segments.length-1) {
                values[segments[i]] = value;
            } else {
                var segmentValue = values[segments[i]]
                if (!isc.isAn.Object(segmentValue) || 
                     isc.isA.Date(segmentValue))
                {
                    values[segments[i]] = {};
                    
                } else if (isc.isAn.Array(segmentValue)) {
                    var nextIsIndex = (parseInt(segments[i+1]) == segments[i+1])
                    // If the next identifier is not an index, we don't want to set an attribute
                    // on the array object!
                    // Options are to clobber the array with a simple JS object
                    // or reach inside the array and look for the property on the first item
                    // Currently we clobber the array, with a warning
                    if (!nextIsIndex) {
                        this.logInfo("saving a field value in a nested data object: overwriting " +
                        "an array" + this.echo(values[segments[i]]) + 
                        " with an object with nested values.");
                        values[segments[i]] = {};
                    }
                }
                values = values[segments[i]];
            }
        }
    } else {
        values[field] = value;
    }
    return values;
},


// _getValue() retrives a field value from some values object
// handles being passed a datapath to navigate nested values objects
_getFieldValue : function (fieldName, values) {
    if (values == null) return;
    if (fieldName == null) return;

    var isDataPath = fieldName.contains(this._$slash);
    
    if (isDataPath) {
        var segments = fieldName.split(this._$slash);
        if (isc.isAn.emptyString(segments.last())) segments.length -=1;
        for (var i = 0; i < segments.length; i++) {
            if (isc.isAn.emptyString(segments[i])) continue;
            if (i == segments.length-1) {
                return values[segments[i]];
            } else {
                if (values[segments[i]] == null) return;
                values = values[segments[i]];
            }
        }
    } else {
        return values[fieldName]
    }
},

_combineDataPaths : function (baseDP, dp) {
    
    // if either param is empty just typecast the other to a string (may be required for
    // index within an array) and return!
    if (baseDP == null) return "" + dp;
    if (dp == null) return baseDP + "";
    
    // trim slashes off the beginning of both strings, if present.
    // this is required to handle the legitimate case of the developer using dataPath:"/"
    // to edit top level fields in a valuesManager defined in a parent component
    if (isc.isA.String(dp) && dp.startsWith(this._$slash)) dp = dp.substring(1);
    //if (baseDP.startsWith(this._$slash)) baseDP = baseDP.substring(1);
    if (isc.isA.String(baseDP) && baseDP.endsWith(this._$slash)) {
        return baseDP + dp;
    } else {
        return baseDP + this._$slash + dp;
    }
}

});

isc.Canvas.addProperties({


//>	@attr dataBoundComponent.dataSource		(DataSource or ID : null : IRW)
// The DataSource that this component should bind to for default fields and for performing
// +link{DSRequest,DataSource requests}.
// <P>
// Can be specified as either a DataSource instance or the String ID of a DataSource.
//
// @group databinding
// @visibility external
// @example dataSourceFields
//<										

//> @attr dataBoundComponent.dataFetchMode (FetchMode : "paged" : IRW)
// How to fetch and manage records retrieve from the server.  See +link{type:FetchMode}.
// <P>
// This setting only applies to the +link{ResultSet} automatically created by calling
// +link{fetchData()}.  If a pre-existing ResultSet is passed to setData() instead, it's
// existing setting for +link{resultSet.fetchMode} applies.
//
// @group databinding
// @visibility external
//< 

//> @attr dataBoundComponent.dataPageSize (number : 75 : IRW)
// When using data paging, how many records to fetch at a time.  The value of this
// attribute is passed on to the auto-constructed +link{class:ResultSet} object for this
// component.  In effect, this gives you control over the +link{attr:ResultSet.resultSize}
// attribute for this component.
// <P>
// <b>Note</b> that regardless of the <code>dataPageSize</code> setting, a component will always fetch
// all of data that it needs to draw.  Settings such as
// +link{listGrid.showAllRecords,showAllRecords:true},
// +link{listGrid.drawAllMaxCells,drawAllMaxCells} and
// +link{listGrid.drawAheadRatio,drawAheadRatio} can cause more rows than the configured
// <code>dataPageSize</code> to be fetched.
//
// @group databinding
// @see ResultSet.resultSize
// @visibility external
//< 

//>	@attr dataBoundComponent.fields            (Array of Field : null : IRW)
// A DataBoundComponent manipulates records with one or more fields, and
// <code>component.fields</code> tells the DataBoundComponent which fields to present, in what
// order, and how to present each field.
// <p>
// When both <code>component.fields</code> and 
// <code>+link{dataBoundComponent.dataSource,component.dataSource}</code> are set,
// any fields in <code>component.fields</code> with the same name as a DataSource field
// inherit properties of the DataSource field.  This allows you to centralize data model
// information in the DataSource, but customize presentation of DataSource fields on a
// per-component basic.  For example, in a ListGrid, a shorter title or format for a field
// might be chosen to save space.
// <p>
// By default, only fields specified on the component are shown, in the order specified on
// the component.  The +link{useAllDataSourceFields} flag can be set to show all fields
// from the DataSource, with <code>component.fields</code> acting as field-by-field
// overrides and/or additional fields.
// <p>
// If a DataBoundComponent is given a DataSource, but no <code>component.fields</code>, the
// "default binding" is used: fields are shown in DataSource order, according
// to the properties <code>+link{showHiddenFields}</code> and 
// <code>+link{showDetailFields}</code>.
//
// @group databinding
// @visibility external
// @example mergedFields
// @example validationFieldBinding
//<

//>	@attr dataBoundComponent.useAllDataSourceFields		(boolean : false : IRW)
// If true, the set of fields given by the "default binding" (see 
// +link{attr:DataBoundComponent.fields}) is used, with any fields specified in
// <code>component.fields</code> acting as overrides that can suppress or modify the
// display of individual fields, without having to list the entire set of fields that
// should be shown.
// <P>
// If <code>component.fields</code> contains fields that are not found in the DataSource,
// they will be shown after the most recently referred to DataSource field.  If the new
// fields appear first, they will be shown first.
// <P>
// +explorerExample{validationFieldBinding,This example} shows a mixture of component
// fields and DataSource fields, and how they interact for validation.
//
// @group databinding
// @visibility external
// @example validationFieldBinding
//<

//>	@attr dataBoundComponent.showHiddenFields (boolean : false : IRW)
// Whether to show fields marked <code>hidden:true</code> when a DataBoundComponent is given a
// DataSource but no <code>component.fields</code>.
// <p>
// The <code>hidden</code> property is used on DataSource fields to mark fields that are
// never of meaning to an end user.
//  
// @group databinding
// @visibility external
//<

//>	@attr dataBoundComponent.showDetailFields (boolean : false : IRW)
// Whether to show fields marked <code>detail:true</code> when a DataBoundComponent is 
// given a DataSource but no <code>component.fields</code>.
// <p>
// The <code>detail</code> property is used on DataSource fields to mark fields that 
// shouldn't appear by default in a view that tries to show many records in a small space.
// 
// @group databinding
// @visibility external
//<

//>	@attr dataBoundComponent.showComplexFields (boolean : true : IRWA)
// Whether to show fields of non-atomic types when a DataBoundComponent is given a
// DataSource but no <code>component.fields</code>.
// <p>
// If true, the component will show fields that declare a complex type, for example, a
// field 'shippingAddress' that declares type 'Address', where 'Address' is the ID of a
// DataSource that declares the fields of a shipping address (city, street name, etc).
// <P>
// Such fields may need custom formatters or editors in order to create a usable interface,
// for example, an Address field in a ListGrid might use a custom formatter to combine the
// relevant fields of an address into one column, and might use a pop-up dialog for
// editing.
// 
// @group databinding
// @visibility external
//<
showComplexFields:true,

//>	@attr dataBoundComponent.fetchOperation    (String : null : IRW)
// Operation ID this component should use when performing fetch operations.
//
// @see attr:DSRequest.operationId
// @group operations
// @visibility external
//<

//>	@attr dataBoundComponent.updateOperation    (String : null : IRW)
// Operation ID this component should use when performing update operations.
//
// @see attr:DSRequest.operationId
// @group operations
// @visibility external
//<

//>	@attr dataBoundComponent.addOperation    (String : null : IRW)
// Operation ID this component should use when performing add operations.
//
// @see attr:DSRequest.operationId
// @group operations
// @visibility external
//<

//>	@attr dataBoundComponent.removeOperation    (String : null : IRW)
// Operation ID this component should use when performing remove operations.
//
// @see attr:DSRequest.operationId
// @group operations
// @visibility external
//<

//> @attr dataBoundComponent.exportFields (Array of String : null : IRW)
// The list of field-names to export.  If provided, the field-list in the exported output is 
// limited and sorted as per the list.
// <P>
// If exportFields is not provided, the exported output includes all visible fields 
// from this component, sorted as they appear.
//
// @visibility external
//<

//> @attr dataBoundComponent.exportAll (boolean : false : IRW)
// Setting exportAll to true prevents the component from passing it's list of fields to the 
// export call.  The result is the export of all visible fields from +link{dataSource.fields}.
// <P>
// If exportAll is false, an export operation will first consider 
// +link{dataBoundComponent.exportFields}, if it's set, and fall back on all visible fields from
// +link{dataSource.fields} otherwise.
//
// @visibility external
//<

//> @attr dataBoundComponent.exportIncludeSummaries (boolean : true : IRW)
// If Summary rows exist for this component, whether to include them when exporting client data.
//
// @visibility external
//<
exportIncludeSummaries: true,


ignoreEmptyCriteria: true,


dragRecategorize:false,

//> @attr dataBoundComponent.preventDuplicates (boolean : null : IR)
// If set, detect and prevent duplicate records from being transferred to this component, either via
// drag and drop or via +link{transferSelectedData()}.  When a duplicate transfer is detected,
// a dialog will appear showing the +link{duplicateDragMessage}.
// <P>
// If the component either does not have a +link{DataSource} or has a DataSource with no
// +link{dataSourceField.primaryKey,primaryKey} declared, duplicate checking is off by
// default.  If duplicate checking is enabled, it looks for an existing record in the dataset
// that has <b>all</b> of the properties of the dragged record, and considers that a duplicate.
// <P>
// For +link{dragDataAction}:"copy" where the target DataSource is related to the source
// DataSource by foreignKey, a duplicate means that the target list, as filtered by the current
// criteria, already has a record whose value for the foreignKey field matches the
// primaryKey of the record being transferred.
// <P>
// For example, consider dragging "employees" to "teams", where "teams" has a field
// "teams.employeeId" which is a foreignKey pointing to "employees.id", and the target
// grid has search criteria causing it to show all the members of one team.  A duplicate -
// adding an employee to the same team twice - is when the target grid's dataset contains an
// record with "employeeId" matching the "id" field of the dropped employee.
// 
// @visibility external
//<

//> @attr dataBoundComponent.duplicateDragMessage (String : "Duplicates not allowed" : IR)
// Message to show when a user attempts to transfer duplicate records into this component, and
// +link{preventDuplicates} is enabled.
// <P>
// If set to null, duplicates will not be reported and the dragged duplicates will not be
// saved.
//
// @group i18nMessages
// @visibility external
//<
duplicateDragMessage: "Duplicates not allowed",

//>	@attr	dataBoundComponent.addDropValues		(Boolean : true : IRW)
//          Indicates whether to add "drop values" to items dropped on this component, if both 
//          the source and target widgets are databound, either to the same DataSource or 
//          to different DataSources that are related via a foreign key.  "Drop values" are 
//          properties of the dropped item that you wish to change (and persist) as a 
//          result of the item being dropped on this grid.
//          <P>
//          If this value is true and this component is databound, +link{getDropValues()} will 
//          be called for every databound item dropped on this grid, and an update performed
//          on the item
//
//      @group  dragging
//      @visibility external
//      @example listRecategorize
//<
addDropValues: true,

//>	@attr	dataBoundComponent.dropValues		(Object : null : IRWA)
//          When an item is dropped on this component, and +link{addDropValues} is true and both 
//          the source and target widgets are databound, either to the same DataSource or 
//          to different DataSources that are related via a foreign key, this object 
//          provides the "drop values" that SmartClient will apply to the dropped object 
//          before updating it.
//          <P>
//          If this property is not defined, SmartClient defaults to returning the selection
//          criteria currently in place for this component.  Thus, any databound items (for example, 
//          rows from other grids bound to the same DataSource) dropped on the grid will,
//          by default, be subjected to an update that makes them conform to the grid's 
//          current filter criteria.
//
//      @group  dragging
//      @visibility external
//      @example listRecategorize
//<
   


// Property to be used as field identifier on field objects.
// The ID of the field is also the property in each record which holds the value 
// for that field.
fieldIdProperty:"name",


//> @method dataBoundComponent.dragComplete()
// This method is invoked on the source component whenever a drag operation or 
// +link{transferSelectedData()} completes.  This method is called when the entire chain of 
// operations - including, for databound components, server-side updates and subsequent 
// integration of the changes into the client-side cache - has completed.<p>
// There is no default implementation of this method; you are intended to override it if you 
// are interested in being notified when drag operations complete.
//
// @see dropComplete()
// @group  dragging
// @visibility external
//<

//> @method dataBoundComponent.dropComplete()
// This method is invoked whenever a drop operation or +link{transferSelectedData()} 
// targeting this component completes.  A drop is considered to be complete when all the client-
// side transfer operations have finished.  This includes any server turnarounds SmartClient 
// needs to make to check for duplicate records in the target component; it specifically does 
// not include any add or update operations sent to the server for databound components.  If 
// you want to be notified when the entire drag operation - including server updates and cache
// synchronization - has completed, override +link{dataBoundComponent.dragComplete,dragComplete}
// on the source component.<p>
// There is no default implementation of this method; you are intended to override it if you 
// are interested in being notified when drop operations complete.
//
// @param transferredRecords (List of Records) The list of records actually transferred to
//                    this component (note that this is not necessarily the same thing as the
//                    list of records dragged out of the source component because it doesn't
//                    include records that were excluded because of collisions with existing
//                    records)
// @see dragComplete()
// @group  dragging
// @visibility external
//<


//> @type dataPath
// String specifying a nested data field structure.
// <P>
// Each dataPath string is a slash-delimited set of field identifiers, for example
// <code>"id1/id2/id3"</code>. DataPaths may be applied directly to a
// +link{canvas.dataPath,component}, and/or to a databound component field specification.
// A datapath denotes a path to a nested field value in a hierarchical structure, giving
// developers the opportunity to easily view or edit nested data structures.
// Specifically:
// <ul><li>if the component is viewing or editing a record, the value for fields 
//         will be derived from a nested structure of records</li>
//     <li>if the component is bound to a dataSource, field attributes may be picked up by
//         following the dataPath to a field definition on another dataSource</li></ul>
// <b>Examples:</b><br>
// If a dynamicForm is defined with the following fields:
// <pre>
//    [
//      { name:"name" },
//      { name:"street", dataPath:"address/street" }
//    ]
// </pre>
// If the <code>"name"</code> field is set to <i>"Joe Smith"</i> and the <code>"street"</code> field
// is set to <i>"1221 High Street"</i>, when the values for this form are retrieved via a
// <code>getValues()</code> call they will return an object in the following format:
// <pre>
//    {name:"Joe Smith", address:{street:"1221 High Street"}}
// </pre>
// <P>
// For databound components, dataPath also provides a way to pick up field attributes from nested
// dataSources. Given the following dataSource definitions:
// <pre>
//  isc.DataSource.create({
//      ID:"contacts",
//      fields:[
//          {name:"name"},
//          {name:"email"},
//          {name:"organization"},
//          {name:"phone"},
//          {name:"address", type:"Address"}
//      ]
//  });
// 
//  isc.DataSource.create({
//      ID:"Address",
//      fields:[
//          {name:"street"},
//          {name:"city"},
//          {name:"state"},
//          {name:"zip"}
//      ]
//  });
//  </pre>
// and a databound component bound to the 'contacts' dataSource, specifying a field with a dataPath
// of <code>"address/street"</code> would ensure the field attributes were derived from the 
// "street" field of the 'Address' dataSource.
// <P>
// dataPaths are also cumulative. In other words if a component has a specified dataPath, 
// the dataPath of any fields it contains will be appended to that component level path when
// accessing data. For example the following form:
// <pre>
//      isc.DynamicForm.create({
//          dataPath:"contact",
//          fields:[
//              {dataPath:"address/email"}
//          ]
// </pre>
// Might be used to edit a data structure similar to this:
// <pre>{contact:{name:'Ed Jones', address:{state:"CA", email:"ed@ed.jones.com"}}}</pre>
// Nested canvases can also have dataPaths specified, which will similarly be combined. See
// the +link{canvas.dataPath} attribute for more information and examples of this.
// @visibility external
//<

//> @attr   DataBoundComponent.dataArity    (string : "multiple" : IRWA)
// Does this component represent singular or multiple "records" objects?
// Options are "multiple" or "single", or "either"
// @visibility internal
//<
dataArity:"multiple",

//> @attr   DataBoundComponent.autoTrackSelection (boolean : true : IRWA)
// If set, for dataArity:"single" components bound to a multiple:true field in this ValuesManager
// automatically check for the presence of a dataArity:"multiple" component bound to the same path
// and set this up as the +link{dynamicForm.selectionComponent}
// @visibility internal
//<
autoTrackSelection:true,


//> @attr canvas.valuesManager (ValuesManager : null : IRWA)
// +link{ValuesManager} for managing values displayed in this component.
// If specified at initialization time, this component will be added to the valuesManager via
// +link{valuesManager.addMember()}.
// <P>
// ValuesManagers allow different fields of a single object to be displayed or edited
// across multiple UI components. Given a single values object, a valuesManager will handle
// determining the appropriate field values for its member components and displaying them / 
// responding to edits if the components support this.
// <P>
// Data may be derived simply from the specified fieldNames within the member components, or for
// complex nested data structures can be specified by both component and field-level
// +link{dataPath}.
// <P>
// Note that components may be automatically bound to an existing valuesManager attached to a 
// parent component if dataPath is specified. See +link{canvas.dataPath} for more information.
// Also note that if a databound component has a specified dataSource and dataPath but no specified
// valuesManager object one will be automatically generated as part of the databinding process
// @visibility external
//<

// This method is fired as part of setDataPath - it generates an automatic valuesManager if
// necessary based on this.dataSource
initializeValuesManager : function () {
    var vM = this.valuesManager;
    delete this.valuesManager;
    
   if (vM != null) {
        if (isc.ValuesManager == null) {
            this.logWarn("Widget initialized with specified 'valuesManager' proprety but " +
                "ValuesManager class is not loaded. This functionality requires the " +
                "Forms module.");
            return;
        }
        
        if (isc.isA.ValuesManager(vM)) {
            vM.addMember(this);
        } else if (isc.isA.ValuesManager(window[vM])) {
            window[vM].addMember(this);
            
        // If it's a string, create a new VM with that ID;
        } else if (isc.isA.String(vM)) {
            isc.ValuesManager.create({
                ID:vM,
                dataSource:this.dataSource,
                members:[this]
            });
        } else {
            this.logWarn("Widget initialized with invalid 'valuesManager' property:"
                         + isc.Log.echo(vM) + ", clearing this property out");
        }
    }
},


//> @attr canvas.dataPath (dataPath : null : IRWA)
// A dataPath may be specified on any canvas. This provides a straightforward way to display or
// edit complex nested data.
// <P>
// For components which support displaying or editing data values, (such as +link{DynamicForm} or
// +link{ListGrid} components), the dataPath may be set to specify how the components data is
// accessed. In this case the dataPath essentially specifies a nested object to edit - typically
// a path to a field value within a dataSource record. Note that a ValuesManager will be required
// to handle connecting the dataBoundcomponent to the appropriate sub object. This may be explicitly
// specified on the component, or a parent of the component, or automatically generated
// if a DataSource is specified on either the component or a parent thereof.
// <P>
// To provide a simple example - if a complex object existed with the following format:
// <pre>
// { companyName:"Some Company",
//   address:{    street:"123 Main Street", city:"New York", state:"NY"  }
// }
// </pre>
// a developer could specify a DynamicForm instance with 'dataPath' set to "address" to edit
// the nested address object:
// <pre>
// isc.ValuesManager.create({
//      ID:'vm',
//      values: { companyName:"Some Company",
//              address:{    street:"123 Main Street", city:"New York", state:"NY"  }
//      }
// });
//
// isc.DynamicForm.create({
//      valuesManager:"vm",
//      dataPath:"address",
//      items:[{name:"street"}, {name:"city"}, {name:"state"}]
// });
// </pre>
// If a component is specified with a <code>dataPath</code> attribute but does not have an
// explicitly specified valuesManager, it will check its parent element chain for a specified
// valuesManager and automatically bind to that. This simplifies binding multiple components used
// to view or edit a nested data structure as the valuesManager needs only be defined once at a
// reasonably high level component. Here's an example of this approach:
// <pre>
// isc.ValuesManager.create({
//      ID:'vm',
//      values: { companyName:"Some Company",
//              address:{    street:"123 Main Street", city:"New York", state:"NY"  }
//      }
// });
//
// isc.Layout.create({
//      valuesManager:"vm",
//      members:[
//          isc.DynamicForm.create({
//              dataPath:"/",
//              items:[{name:"companyName"}]
//          }),
//          isc.DynamicForm.create({
//              dataPath:"address",
//              items:[{name:"street"}, {name:"city"}, {name:"state"}]
//          })
//      ]
// });
// </pre>
// Note that in this case the valuesManager is specified on a Layout, which has no 'values'
// management behavior of its own, but contains items with a specified dataPath which do. In this
// example you'd see 2 forms allowing editing of the nested data structure.
// <P>
// dataPaths from multiple nested components may also be combined. For example:
// <pre>
// isc.ValuesManager.create({
//      ID:'vm',
//      values: { companyName:"Some Company",
//              address:{    street:"123 Main Street", city:"New York", state:"NY"  }
//              parentCompany:{
//                  companyName:"Some Corporation",
//                  address:{   street:"1 High Street", city:"New York", state:"NY" }
//              }
//      }
// });
//
// isc.Layout.create({
//      valuesManager:"vm",
//      members:[
//          isc.DynamicForm.create({
//              dataPath:"/",
//              items:[{name:"companyName"}]
//          }),
//          isc.DynamicForm.create({
//              dataPath:"address",
//              items:[{name:"street"}, {name:"city"}, {name:"state"}]
//          }),
//          isc.Layout.create({
//              dataPath:"parentCompany",
//              members:[
//                  isc.DynamicForm.create({
//                      dataPath:"/",
//                      items:[{name:"companyName", type:"staticText"}]
//                  }),
//                  isc.DetailViewer.create({
//                      dataPath:"address",
//                      fields:[{name:"street", name:"city", name:"state"}]
//                  })
//              ]
//          })
//      ]
// });
// </pre>
// In this example the detailViewer will display data from the <code>parentCompany.address</code>
// object within the base record.
// <P>
// Note that if a component has a specified  dataSource and shows child components with a
// specified dataPath, there is no need to explicitly declare a valuesManager at all. If a component
// with a dataPath has a dataSource, or an ancestor with a dataSource specified, it will, a
// valuesManager will automatically be generated on the higher level component (and be available as
// <code>component.valuesManager</code>).
// @visibility external
//<

//> @method  canvas.setDataPath()
// Setter for the +link{canvas.dataPath} attribute. This method may be called directly at runtime
// to set the dataPath on a component, and will also be re-run automatically whenever a canvas'
// parentElement changes due to a call to addChild(). This method handles automatically binding
// the component to the appropriate valuesManager if necessary.
// @param dataPath (dataPath) new dataPath
// @visibility external
//<
setDataPath : function (dataPath) {
    this.dataPath = dataPath;
    
    // we run this on every change of widget hierarchy (addChild etc), allowing us to
    // pick up a valuesManager based on a values manager applied at some ancestor widget level.
    // detect true "databound" components by the presence of fields - if we have no fields
    // just bail here
    
    if (this.getFields == null || this.getFields() == null) return;
    
    // clearing dataPath? Disconnect from any dataPath-derived valuesManager, and bail
    if (dataPath == null) {
        delete this._fullDataPath;
        if (this.valuesManager && this._valuesManagerFromDataPath) {
            this.valuesManager.removeMember(this);
            delete this._valuesManagerFromDataPath;
        }
        return;
    }
    
    // If we have a dataSource applied directly to us we don't need to attach ourselves to another
    // valuesManager, etc
    // Note:
    // We support 'cumulative' dataPaths
    // In other words a valuesManager may be defined on a Layout
    // This can contain another layout with a specified dataPath, which in turn contains a form
    // with a specified dataPath.
    // In this case the forms data would be derived from the valuesManager on the top level layout
    // using a full dataPath combined from both the DynamicForm and the Layout's dataPath 
    // Set up this 'fullDataPath' here - retrieved from 'getFullDataPath'
    var fullDataPath;
    var dataPathComponent = this;
    while (dataPathComponent && 
            (!dataPathComponent.valuesManager || dataPathComponent._valuesManagerFromDataPath) &&
            !dataPathComponent.dataSource)
    {
        if (dataPathComponent.dataPath) {
            if (fullDataPath) {
                fullDataPath = isc.Canvas._combineDataPaths(dataPathComponent.dataPath,
                                                            fullDataPath);
            } else {
                fullDataPath = dataPathComponent.dataPath;
            }
        }
        dataPathComponent = dataPathComponent.parentElement;
    }
    this._fullDataPath = fullDataPath;
    // If we have a valuesManager and/or dataSource specified directly on this component
    // no need to attach to another one!
    
    if (dataPathComponent) {
        if (dataPathComponent != this) {
            // assertion - the datapathComponent has a valuesManager already, or a dataSource
            // (in which case we can create a new valuesManager automatically)
            if (dataPathComponent.valuesManager == null) {
                dataPathComponent.createDefaultValuesManager();
            }
            // second param ensures the _valuesManagerFromDataPath attr gets set.
            dataPathComponent.valuesManager.addMember(this, true);
        }
    }
},

//> @method canvas.getFullDataPath()
// Returns a fully qualified +link{type:dataPath} for this canvas. This is calculated by combining
// the canvas' specified +link{canvas.dataPath} with the <code>dataPath</code> of any parent 
// canvases up to whichever canvas has a specified +link{canvas.valuesManager} specified to actually
// manage values from this component.
// @return (dataPath) fully qualified dataPath for this component
// @visibility external
//<
getFullDataPath : function () {
    return this._fullDataPath || this.dataPath;
},

createDefaultValuesManager : function (defaultMembers) {
    if (!defaultMembers) defaultMembers = [];
    defaultMembers.add(this);
    
    isc.ValuesManager.create({
        members:defaultMembers,
        ID:this.getID() + "_valuesManager",
        dataSource:this.dataSource
    });
},

//> @method dataBoundComponent.getDataPathField()
// For a component with a specified +link{DataSource}, find the associated dataSource field object
// from a specified +link{type:dataPath,dataPath}.
// @param dataPath (dataPath) dataPath for which the field definition should be returned.
//<
getDataPathField : function (dataPath) {
    var dataSource = this.getDataSource(),
        segments = dataPath.split(isc.slash),
        field;
    if (!dataSource) return;
    for (var i = 0; i < segments.length; i++) {
        var fieldId = segments[i];
        
        field = dataSource.getField(fieldId);
        dataSource = field ? dataSource.getSchema(field.type) : dataSource;
        
        if (field == null) {
            this.logWarn("Unable to find dataSource field matching specified dataPath: '" +
                         dataPath + "'");
            return;
        }
    }
    return field;
},

registerWithDataView : function (dataView) {
    if (!this.inputDataPath) return;
    
    dataView = this.parentElement;
    while (dataView && !isc.isA.DataView(dataView)) dataView = dataView.parentElement;
    
    if (!dataView) {
        this.logWarn("Component initialized with an inputDataPath property, but no DataView " +
                     "was found in the parent hierarchy. inputDataPath is only applicable to " +
                     "DataBoundComponents and FormItems being managed by a DataView");
        return;
    }
    
    dataView.registerItem(this);
},


//>	@method	dataBoundComponent.bindToDataSource()
// Combine component's fields specifications with the fields specifications from the
// datasource the component works with (specified indirectly by component.operation).
// - check if fields property and dataSource property are specified
// - if just dataSource, then use dataSource fields
// - if just fields property, then default behavior
// - if both, then use fields, with each field using defaults of dataSource<br>
//   calls setFields() when finished
//		@group	data
//<
// Extra parameter 'hideExtraDSFields' used by ListGrid for the case where
// useAllDataSourceFields is false but we want to include fields picked up from the DataSource
// but mark them as not visible in the grid. This is used to achieve the
// +link{listGrid.canPickOmittedFields} behavior.
bindToDataSource : function (fields, hideExtraDSFields) {
    //this.logWarn("bindToDataSource called with fields " + this.echoLeaf(fields));
    // call 'setDataPath' to ensure if we have a dataPath specified we bind to the correct
    // valuesManager
    if (this.dataPath) this.setDataPath(this.dataPath);
	// Most components operate on a datasource, displaying or otherwise manipulating fields from
	// that datasource.  We don't want to duplicate all the information about a field that is
	// specified in the datasource (type, title, etc) in each component that needs to display
	// that field.  So, we allow the component's field specifications to refer to the datasource
	// field by name, and combine the field specification from the component with the field
	// specification from the datasource.

    // pick up the dataSource of our dataset if it has one and we weren't given one
    if (this.dataSource == null && this.data != null) this.dataSource = this.data.dataSource;

    
    var origFields = this.fields || this.items;
    if (isc.isAn.Array(origFields)) this.originalFields = origFields.duplicate();

	// get the datasource versions of the field specifications.  NOTE: this method may be
    // called in a build that does not include DataSource
	var	ds = this.getDataSource();
    if (ds != null && isc.isA.String(ds)) {
        this.logWarn("unable to look up DataSource: " + ds + ", databinding will not be used");
        return fields;
    }

    // Shorthand - treat fields being null or an empty array as the same case - no (meaningful) 
    // fields were passed in
    var noSpecifiedFields = (fields == null || fields.length == 0),
        dsFields;
    // get fields from the DataSource if we have one
    if (ds) {
        // flatten fields if so configured
        var flatten = this.useFlatFields;
        if (flatten == null) flatten = ds.useFlatFields;
        dsFields = flatten ? ds.getFlattenedFields() : ds.getFields();
    }

    // Case 1: no dataSource specified
    // This widget isn't associated with a datasource - all fields are full specifications
    // intended for the underlying widget.  The fields property is thus left untouched.
    if (ds == null || dsFields == null) {
        if (fields != null && isc.SimpleType) {
            // type defaults are auto-applied to DS fields and combined fields, but we need to
            // do it here for any field that doesn't apear in the DataSource
            for (var i = 0; i < fields.length; i++) {
                isc.SimpleType.addTypeDefaults(fields[i]);
            }
        }
        this.addFieldValidators(fields);
        return fields;
    }

    // Case 2: dataSource specified, but no fields specified
    if (this.doNotUseDefaultBinding) return [];
    // The widget will show all DataSource fields, applying reasonable defaults.
    if (ds != null && noSpecifiedFields) {
        // NOTE we generally have to create a copy of the DataSource fields rather than having
        // everyone use the same objects, because widgets tend to scribble things into this.fields,
        // such as widths derived by a sizing policy.
        fields = [];
        for (var fieldName in dsFields) {
            var field = dsFields[fieldName];
            
            if (!this.shouldUseField(field, ds)) continue;
            
            
            fields.add(isc.addProperties({}, field));
        }
        this.addFieldValidators(fields);
        return fields;                                               
    }

	// Case 3: dataSource and fields specified
    // fields provided to this instance act as an overlay on DataSource fields
    if (ds != null && !noSpecifiedFields) {
        if (this.useAllDataSourceFields || hideExtraDSFields) {
            var canvas = this;
            var bothFields = ds.combineFieldOrders(
                        dsFields, fields, 
                        function (field, ds) { return canvas.shouldUseField(field, ds) });
            if (hideExtraDSFields) {
                for (var i = 0; i < bothFields.length; i++) {
                   
                }
            }
            // Loop through the combined fields:
            // - if hideExtraDSFields is true, hide any fields picked up from the
            //   DS that weren't explicitly specified
            // - handle any fields that should pick up defaults from another DS
            //   (where field.includeFrom is set).
            for (var i = 0; i < bothFields.length; i++) {
                var field = bothFields[i];
                if (!fields.containsProperty("name", field.name)) {
                    if (hideExtraDSFields && field.showIf == null) {
                        field.showIf = "return false";
                    }
                
                } else {
                    if (field.includeFrom != null && ds.getField(field.name) == null) {
                        this._combineIncludeFromFieldData(field);
                    }
                }
            }
            
            this.addFieldValidators(bothFields);
            return bothFields;
        } else {
            // only the fields declared on the component will be shown, in the order specified on
            // the component
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                if (!field) continue;

                // this field isn't a datasource field - it's just intended to be passed through
                // to the underlying widget (like a form spacer)
                //
                // always addTypeDefaults b/c local field spec may override field type
                // addTypeDefaults will bail immediately if it's already been applied
                isc.SimpleType.addTypeDefaults(field);

                field = this.combineFieldData(field);
            }
            this.addFieldValidators(fields);
            // return the original fields array, with properties added to the field objects
            return fields;
        }
    }
},

combineFieldData : function (field) {
    var ds = this.getDataSource();


    // specified dataPath -- will pick up defaults from another (nested) ds field 
    if (field.dataPath) {
        isc.DataSource.combineFieldData(
            field, this.getDataPathField(field.dataPath)
        );
        return field;
    // specified ds field -- will pick up defaults from field in this dataSource
    } else if (ds.getField(field.name)) {
                        
        // combine the component field specification with the datasource field
        // specification - component fields override so that you can eg, retitle a field
        // within a summary
        return ds.combineFieldData(field);
        
    // specified 'includeFrom' field -- will pick up defaults from field in another dataSource
    } else if (field.includeFrom != null) {
        return this._combineIncludeFromFieldData(field);
    }
        
    return field;
},

_combineIncludeFromFieldData : function (field) {

    var split = field.includeFrom.split(".");
    if (split == null || split.length != 2) {
        this.logWarn("This component includes a field with includeFrom set to:"
            + field.includeFrom + ". Format not understood.");
    } else {
        var relatedDS = isc.DataSource.get(split[0]),
            fieldName = split[1];
        if (relatedDS == null) {
            this.logWarn("Field specifies includeFrom:" + field.includeFrom +
                ". Unable to find dataSource with ID:" + split[0]);
        } else {
            // default the field name to the includeField's name if not explicitly set.
            if (field.name == null) field.name = fieldName;
            return relatedDS.combineFieldData(field, relatedDS.getField(fieldName));
        }
    }
},

// return whether this component wants to use the field when binding to a DataSource
shouldUseField : function (field, ds) { 
    // hidden means don't show to an end user
    if (field.hidden && !this.showHiddenFields) return false;
    if (field.canFilter == false && this.showFilterFieldsOnly) {
        return false;            
    }
    
    // don't use the field if the field is marked as a detail field and the component is not a
    // detail component 
    
    if (field.detail && !this.showDetailFields) return false;

    if (!this.showComplexFields && ds.fieldIsComplexType(field.name)) return false;

    return true;
},

// Add validators that replace basic field properties (ex. required)
addFieldValidators : function (fields) {
    if (fields == null) return;

    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (field.required) {
            var validator = this.getRequiredValidator(field),
                message = validator.errorMessage;
            
            // Add validator to field
            if (!field.validators) {
                field.validators = [validator];
            } else {
                if (!isc.isAn.Array(field.validators)) {
                    field.validators = [field.validators];
                }
                // See if we already have a required validator.
                // If so, we need to make sure the errorMessage is correct.
                // If not, add a new required validator.
                if (!field.validators.containsProperty("type", validator.type)) {
                    // if the field is using the shared, default validators for the type, 
                    // make a copy before modifying
                    if (field.validators._typeValidators) {
                        field.validators = field.validators.duplicate();
                    }
                    field.validators.add(validator);
                } else if (message != null) {
                    var ds = this.getDataSource(),
                        v = field.validators.find("type", validator.type)
                    ;
                    // See if our error message should override current one
                    // created on the DataSource.
                    if (v.errorMessage == null || (ds && v.errorMessage == ds.requiredMessage)) {
                        v.errorMessage = message;
                    }
                }
            }
        }
    }
},

getRequiredValidator : function (field) {
    var requiredValidator = {
            type: "required"
        },
        message = field.requiredMessage || this.requiredMessage;
        
    if (message != null) requiredValidator.errorMessage = message;
    return requiredValidator;
},

// doc'd at ListGrid level
getAllFields : function () {
    return this.completeFields || this.fields;
},

//>	@method	dataBoundComponent.getField()	
// Return a field by a field index or field name.
//
// @param fieldID (String || Number) field index or field.name
//
// @return (object) Field description
// @visibility external
//<
getField : function (fieldId) {
    if (!this.fields) return null;
    return isc.Class.getArrayItem(fieldId, this.fields, this.fieldIdProperty);
},


//> @method dataBoundComponent.getFieldNum()	
// Find the index of a currently visible field.
//
// @param fieldID (String || Field) field name or field
//
// @return (int) index of field within currently visible fields
// @visibility external
//<
getFieldNum : function (fieldId) {
    if (!this.fields) return -1;
    // handle being passed a field object (or a clone of a field object)
    if (isc.isA.Object(fieldId) && (fieldId[this.fieldIdProperty] != null)) {
        fieldId = fieldId[this.fieldIdProperty];
    }
    return isc.Class.getArrayItemIndex(fieldId, this.fields, this.fieldIdProperty);
},

// Whether a field derived from XML Schema is considered structurally required.
// <P>
// A field is considered required if the field itself must be present within it's complexType
// *and* the complexType and all parent complexTypes are required.
// <P>
// Note that this is relative to how much of a given structure this component edits.  If you
// bind a component to a DataSource representing an entire WSDLMessage, a field may not be
// considered required because it has an optional parent, whereas if you instead bind to a
// particular sub-part of the message the field could be considered required since no optional
// parent elements are in play.  This is the correct behavior but it does mean that to get
// correct "required" behavior you want to coordinate all of your components to use a
// ValuesManager that actually represents the *whole* structure they are meant to be editing.
// <P>
// NOTE that a more complete implementation might dynamically check the current values to check
// whether at least one entry had been added to a structure that is otherwise optional; at that
// point the rest of the values should be considered required as well
isXMLRequired : function (field) {

    if (!field || !this.useXMLRequired || !field.xmlRequired) return false;

    if (!field.dataPath) return true;

    var dataSource = this.getDataSource();
    if (!dataSource) return true;

    //this.logWarn("field: " + this.echoLeaf(field) + " has path: " + field.dataPath);

    var segments = field.dataPath.split(isc.slash),
        field;
    for (var i = 0; i < segments.length; i++) {
        var fieldId = segments[i];

        //this.logWarn("checking segment: " + fieldId + " against DataSource: " + dataSource);

        // invalid dataPath, but will be warned about elsewhere.  The field's individual
        // xmlRequired status should be considered authoritative
        if (!dataSource) return true;

        field = dataSource.getField(fieldId);

        // invalid dataPath again
        if (!field) return true;

        // a parent XML structure is not required, so the field should not be
        if (field.xmlMinOccurs != null && field.xmlMinOccurs < 1) {
            //this.logWarn("optional field found: " + fieldId);
            return false;
        }

        dataSource = dataSource.getSchema(field.type);
        
    }
    return true;
    
},

// Field State management
// ---------------------------------------------------------------------------------------
// Retrieve and restore metadata about fields of a DataBoundComponent such as visibility,
// width or other user-settable display settings.

// Helper method to evaluate the various viewState objects (stored as strings)
evalViewState : function (state, stateName, suppressWarning) {
    //!OBFUSCATEOK    
    if (isc.isA.String(state)) {
        var origState = state;
        try {
            state = isc.eval(state);
        } catch (e) {
            if (!suppressWarning) 
                this.logWarn("Unable to parse " + stateName + " object passed in: " + origState 
                              + " Ignoring.");
            return;
        }
    }
    return state;
    
},

// DBC-level fieldState methods
getFieldState : function (includeTitle) {
    var fieldStates = [];
    var allFields = this.getAllFields();
    if (allFields) {
        for (var i = 0; i < allFields.length; i++) {
            var field = allFields[i],
                fieldName = field[this.fieldIdProperty],
                fieldState = this.getStateForField(fieldName, includeTitle)
            ;
            fieldStates.add(fieldState);
        }
    }

    return isc.Comm.serialize(fieldStates);
},

// get the state for a given field by name
getStateForField : function (fieldName, includeTitle) {
    var field = this.getAllFields().find(this.fieldIdProperty, fieldName),
        fieldState = { name:fieldName };

    if (!this.fieldShouldBeVisible(field)) fieldState.visible = false;
    // store the userFormula if this is a formula field
    if (field.userFormula) fieldState.userFormula = field.userFormula;
    // store the userSummary if one is present
    if (field.userSummary) fieldState.userSummary = field.userSummary;

    // auto-persist title for formula / summary fields, since it's user entered
    if (includeTitle || field.userSummary || field.userFormula) {
    	fieldState.title = field.title;
    }

    if (this.getSpecifiedFieldWidth) fieldState.width = this.getSpecifiedFieldWidth(field);

    if (field.autoFitWidth) fieldState.autoFitWidth = true;
    
    return fieldState;
},

// internal method that modifies this.completeFields according to the fieldState argument
// doesn't redraw the LG; call setFieldState instead.
// -- DetailViewer has no way of removing unwanted fields from the fields array, so add an
// optional param hideExtraDSFields to add the additional fields from the DS with showIf:"false"
_setFieldState : function (fieldState, hideExtraDSFields) {
    if (fieldState == null) return;
    var allFields = this.getAllFields();
    var remainingFields = allFields.getProperty(this.fieldIdProperty),
        completeFields = []
    ;
    
    // set visibility and width according to fieldState    
    for (var i = 0; i < fieldState.length; i++) {
        var state = fieldState[i],
            field = allFields.find(this.fieldIdProperty, state.name)
        ;
        // if a field is specified in fieldState which is not present in the grid, check if its
        // a formula or summary field and add a field-def for it
        if (field == null) {
            if (state.userFormula || state.userSummary) {
                field={};
                field[this.fieldIdProperty] = state.name;
            } else continue;
        }
        remainingFields.remove(state.name);
        if (state.visible == false) {
            field.showIf = this._$false;
        } else {
            field.showIf = null;
            // set field.detail to false if the field is visible. This makes sure that
            // ds.combineFieldData skips setting detail to true on this field if the
            // field has been set to visible by the user.
            field.detail = false;

        }
        if (state.width != null && !isNaN(state.width)) field.width = state.width;

        if (state.title) field.title = state.title;
        // restore state for userFomula and userSummary
        if (state.userFormula != null) field.userFormula = state.userFormula;
        if (state.userSummary != null) field.userSummary = state.userSummary;
        if (state.autoFitWidth) field.autoFitWidth = true;
        completeFields.add(field);
    }
    
    // if a field is specified for the grid for which there is no entry in fieldState
    //   check for a preceding field in the grid's fields which is specified in the fieldState
    //    and put it after that one
    //   otherwise, place it after the last visible field if it's visible, or last field
    //    altogether if not
    for (var i = 0; i < remainingFields.length; i++) {
        var name = remainingFields[i], 
            index = allFields.findIndex(this.fieldIdProperty, name), 
            field = allFields[index], 
            precedingField = allFields[index - 1];

        if (hideExtraDSFields) field.showIf = this._$false;
        
        if (precedingField != null) {
            var precedingIndex = completeFields.indexOf(precedingField);
            if (precedingIndex != -1) {
                completeFields.addAt(field, precedingIndex + 1);
                continue;
            }
        }

        if (this.fieldShouldBeVisible(field, index) && !hideExtraDSFields) {
            completeFields.addAt(field, this._lastVisibleFieldIndex(completeFields) + 1);
        } else {
            completeFields.add(field);
        }
    }
    //this.completeFields = completeFields;
    return completeFields;
},

// observe this method to be notified on column resize or reorder and show/hide field
fieldStateChanged : function () {},

// returns the last visible field in an array of fields
_lastVisibleFieldIndex : function (fields) {
    if (fields == null) fields = this.completeFields;
    var visibleFields = this.getVisibleFields(fields);
    if (visibleFields.length == 0) return -1;
    return fields.lastIndexOf(visibleFields.last());
},

// determine which of the passed fields should be shown, and return them as a new array
getVisibleFields : function (fields) {
    var visibleFields = [];
	for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
    	// make sure we don't have any null fields
		if (field == null) continue;

        if (this.fieldShouldBeVisible(field, i)) visibleFields.add(field);
	}
    return visibleFields;
},

// fieldShouldBeVisible: intended as a possible advanced override point for a field visibility
// policy not easily expressed via showIf()
_$falseSemi:"false;",
_$false:"false",
fieldShouldBeVisible : function (field, fieldNum) {
    // evaluate a showIf expression if present
    if (field.showIf != null) {
        // CALLBACK API:  available variables:  "list,field,fieldNum"
        // Convert a string callback to a function
        
        
        if (field.showIf == this._$false || field.showIf == this._$falseSemi) return false;
        
        isc.Func.replaceWithMethod(field, "showIf", "list,field,fieldNum");
        if (!field.showIf(this, field, fieldNum)) return false;
    }
    return true;
},

// ---------------------------------------------------------------------------------------

//>	@method	dataBoundComponent.setValueMap()	
//		Set the valueMap for a field
//
//		@param	fieldID		(number)	        number of field to update
//      @param  map         (object)            ValueMap for the field
//
//<
setValueMap : function (field, map) {
    
    if (!isc.isAn.Object(field)) field = this.getField(field);
    if (!field) return;

    field.valueMap = map;
},


//> @method dataBoundComponent.setDataSource()
// Bind to a new DataSource.
// <P>
// Like passing the "dataSource" property on creation, binding to a DataSource means that the
// component will use the DataSource to provide default data for its fields.
// <P>
// When binding to a new DataSource, if the component has any existing "fields" or has a dataset,
// these will be discarded by default, since it is assumed the new DataSource may represent a
// completely unrelated set of objects.  If the old "fields" are still relevant, pass them to
// setDataSource().
// 
// @param dataSource  (ID or DataSource)  DataSource to bind to 
// @param fields      (Array of Fields)  optional array of fields to use
// 
// @visibility external
// @example WSDLDataSource
//<
setDataSource : function (dataSource, fields) {
    if (isc._traceMarkers) arguments.__this = this;

	// if passed in value is null then bind() will then work on the declared ds.
	this.dataSource = dataSource || this.dataSource;
	
    // NOTE: actual dataBinding, meaning picking up dataSource field data, is done by
    // "bindToDataSource".  This call *must* be within setFields() because setFields() may be
    // called again after binding, and must pick up DataSource field data at that time too.
	if (this.setFields) this.setFields(fields);

	// since we've (re)bound this widget, clear any data it may have as it may no longer be
    // valid.
    if (this.dataSource) {
        
        if (this.isA("DynamicForm")) this.setData({});
        else this.setData([]);
    }
    this.markForRedraw("bind");
},
// backCompat
bind : function (dataSource, fields) {
	this.setDataSource(dataSource, fields);
},

getDataSource : function () {
    if (isc.isA.String(this.dataSource)) {
        if (this.serviceNamespace || this.serviceName) {
            this.dataSource = this.lookupSchema();
        } else {
            var ds = isc.DS.get(this.dataSource);
            if (ds != null) return ds;
    
            // support "dataSource" being specified as the name of a global, and if so, assign
            // that to this.dataSource
            ds = this.getWindow()[this.dataSource];
            if (ds && isc.isA.DataSource(ds)) return (this.dataSource = ds);
        }
    }
    return this.dataSource;
},

setData : function (data) { this.data = data },

lookupSchema : function () {
    // see if we have a WebService instance with this serviceName / serviceNamespace
    var service;
    if (this.serviceName) service = isc.WebService.getByName(this.serviceName, this.serviceNamespace);
    else service = isc.WebService.get(this.serviceNamespace);

    if ((this.serviceNamespace || this.serviceName) && service == null) {
        this.logWarn("Could not find WebService definition: " +
                     (this.serviceName ? "serviceName: " + this.serviceName : "") +
                     (this.serviceNamespace ? "   serviceNamespace: " + this.serviceNamespace : ""));
    }
    
    // If this.dataSource is not a String, we shouldn't have ended up here
    if (!isc.isA.String(this.dataSource)) {
        this.logWarn("this.dataSource was not a String in lookupSchema");
        return;
    }
 
    var ds; 
    if (service) ds = service.getSchema(this.dataSource);
    // note return this.dataSource if the lookup failed so that this.dataSource is still set to
    // the String value, even if we failed to look up the DataSource, since the service may
    // load later
    return ds || this.dataSource; 
},


//>@method DataBoundComponent.fieldValuesAreEqual()
// Compares two values and returns true if they are equal.  This is used to handle cases
// where edited values are equivalent to saved values, but a simple
// Javascript comparison (a == b) will return false (for example Date fields).
// @param field (object) field to which the values belong
// @param value1 (any) first value to be compared
// @param value2 (any) second value to be compared
// @visibility internal
//<
// Leave visibility internal, but non obfuscated - we may allow developers to override this for
// custom field types

fieldValuesAreEqual : function (field, value1, value2) {
    // no matter what the type if they are '==' always return true;
    if (value1 == value2) return true;
    
    // If we don't have field object for the value passed in - just rely on the "==" comparison
    // This typically occurs when we have editValues in a grid, or values in a DynamicForm
    // that don't have a corresponding field object.
    
    if (field == null) return false;
    
    if (field.type == "date") {
        if (isc.isA.Date(value1) && isc.isA.Date(value2)) {
            return (Date.compareDates(value1, value2) == 0);
        }
    } else if (field.type == "valueMap") {
        if (isc.isAn.Array(value1) && isc.isAn.Array(value2)) {
            return value1.equals(value2)
            
        } else if (isc.isAn.Object(value1) && isc.isAn.Object(value2)) {
            for (var i in value1) {
                if (value2[i] != value1[i]) return false;
            }
            
            for (var j in value2) {
                if (value1[j] != value2[j]) return false;
            }
            
            // everything matched
            return true;
        }
    }
    
    // return false
    return false;
},

//> @attr dataBoundComponent.useFlatFields (boolean : null : IR)
// The <code>useFlatFields</code> flag causes all simple type fields anywhere in a nested
// set of DataSources to be exposed as a flat list for form binding.  
// <P>
// <code>useFlatFields</code> is typically used with imported metadata, such as 
// +link{XMLTools.loadXMLSchema,XML Schema} from a 
// +link{XMLTools.loadWSDL,WSDL-described web service}, as a means of eliminating levels of XML
// nesting that aren't meaningful in a user interface, without the cumbersome and fragile
// process of mapping form fields to XML structures.
// <P>
// For example, having called +link{webService.getInputDS()} to retrieve the input message
// schema for a web service operation whose input message looks like this:
// <pre>
// &lt;FindServices&gt;
//     &lt;searchFor&gt;search text&lt;/searchFor&gt;
//     &lt;Options&gt;
//         &lt;caseSensitive&gt;false&lt;/caseSensitive&gt;
//     &lt;/Options&gt;
//     &lt;IncludeInSearch&gt;
//         &lt;serviceName&gt;true&lt;/serviceName&gt;
//         &lt;documentation&gt;true&lt;/documentation&gt;
//         &lt;keywords&gt;true&lt;/keywords&gt;
//     &lt;/IncludeInSearch&gt;
// &lt;/FindServices&gt;
// </pre>
// Setting <code>useFlatFields</code> on a +link{DynamicForm} that is bound to this input
// message schema would result in 5 +link{FormItem,FormItems} reflecting the 5 simple type
// fields in the message.
// <P>
// For this form, the result of +link{dynamicForm.getValues(),form.getValues()} might look
// like:
// <P>
// <pre>{
//    searchFor: "search text",
//    caseSensitive: false,
//    serviceName: true,
//    documentation : true,
//    keywords : true
// }</pre>
// When contacting a +link{WebService,WSDL web service}, these values can be automatically
// mapped to the structure of the input message for a web service operation by setting
// +link{wsRequest.useFlatFields} (for use with +link{webService.callOperation()}) or by setting
// +link{dsRequest.useFlatFields} (for use with a +link{DataSource} that is
// +link{group:wsdlBinding,bound to a WSDL web service} via
// +link{operationBinding.wsOperation}).  
// <P>
// Using these two facilities in conjunction (component.useFlatFields and
// request.useFlatFields) allows gratuitous nesting to be consistently bypassed in both the user
// presentation and when providing the data for XML messages.
// <P>
// You can also set +link{operationBinding.useFlatFields} to automatically enable 
// "flattened" XML serialization (request.useFlatFields) for all DataSource requests of a
// particular operationType.
// <P>
// Note that <code>useFlatFields</code> is not generally recommended for use with structures
// where multiple simple type fields exist with the same name, however if used with such a
// structure, the first field to use a given name wins.  "first" means the first field
// encountered in a depth first search.  "wins" means only the first field will be present as a
// field when data binding.
// 
// @visibility external
//<

//> @attr dataBoundComponent.showFilterFieldsOnly (boolean : null : IRWA)
// If this attribute is true any +link{dataSourceField.canFilter,canFilter:false} fields
// specified on the dataSource will not be shown unless explicitly included in this component's
// +link{dataBoundComponent.fields,fields array}
//<
// Exposed and defaulted to true on SearchForm 

// minimal implementation of setFields()
setFields : function (fields) {
	// combine specified "fields" with reference declarations in the dataSource
	fields = this.bindToDataSource(fields);

	this.fields = fields;
},

getSerializeableFields : function (removeFields, keepFields) {
	// data may actually be valid in some cases - but removing it is a good default.
	removeFields.addList(["zIndex", "data"]);
		
	// don't save ID if it's auto-generated
	if (this.ID && this.ID.startsWith("isc_")) removeFields.add("ID");

	// if this component is bound to a datasource, don't serialize its fields or items
    
	if (this.dataSource) removeFields.addList(["fields", "items"]);

	// we only want to serialize children created explicitly by a developer - not children
    // auto-created by an ISC component (such as the ListGrid header) 
    
	if (this.getClassName() != "Canvas" && this.getClassName() != "Layout") {
        removeFields.add("children");
    }

	return this.Super("getSerializeableFields", arguments);
},


addField : function (field, index, fields) {
    if (field == null) return;

    if (fields == null) fields = (this.fields || this.items || isc._emptyArray);
    fields = fields.duplicate();
 
    // if this field already exists, replace it
    var existingField = this.getField(field.name);
    if (existingField) fields.remove(existingField);
   
    // If index wasn't passed, add at the end (Array.addAt() defaults to the beginning)
    // Also, if the requested index is greater than the size of the array, just add to
    // the end.  This is a corner case that can happen in VB, where the same index is 
    // being used for two different things (index into the list of a DBC's fields and 
    // index into the list of a DBC's children in the componentTree - sometimes the same 
    // thing, but not necessarily so)
    if (index == null || index > fields.length) index = fields.length;
    fields.addAt(field, index);
    this.setFields(fields);
},

removeField : function (fieldName, fields) {
    if (fields == null) fields = (this.fields || this.items || isc._emptyArray);
    fields = fields.duplicate();
    
    // Cope with being passed an object rather than a name
    var name = fieldName.name ? fieldName.name : fieldName;
    fields.remove(fields.find("name", name));
    this.setFields(fields);
},

// DataBound Component Methods
// --------------------------------------------------------------------------------------------
//> @groupDef dataBoundComponentMethods
// An Action Method initiates an orchestrated client-server flow that stores or retrieves data
// and updates one or more components.
// <P>
// For example, the +link{DynamicForm.saveData(),editor.saveData()} Action Method saves the
// record currently being edited in the form, transparently handling the trip to the server,
// standard error conditions such as validation errors (whether the validation error
// happens on the client or server), and update of client-side caches.
// <P>
// Action Methods are available on DataBoundComponents.
//
// @treeLocation Client Reference/Data Binding
// @see interface:DataBoundComponent
// @title DataBound Component Methods
// @visibility external
//<

// NOTE: the DataBound Component Methods are mostly implemented directly on Canvas, and act
// as a basic framework for building a DataBound widget, however, we document them as existing
// on the specific components where it actually makes sense to call them.

//> @method listGrid.fetchData()
// @include dataBoundComponent.fetchData()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundFetch
//<

//> @method listGrid.exportData()
// @include dataBoundComponent.exportData()
// @group dataBoundComponentMethods
// @visibility external
//<

//>	@attr listGrid.autoFetchData       (boolean : false : IR)
// @include dataBoundComponent.autoFetchData
// @group databinding
// @visibility external
// @example fetchOperation
//<

// Note: listGrid.autoFetchTextMatchStyle overridden and documented in ListGrid.js

//> @attr listGrid.initialCriteria   (Criteria : null :IR)
// @include dataBoundComponent.initialCriteria
// @visibility external
//<

//> @method listGrid.filterData()
// @include dataBoundComponent.filterData()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundFilter
//<

//> @method listGrid.fetchRelatedData()
// @include dataBoundComponent.fetchRelatedData()
// @group dataBoundComponentMethods
// @visibility external
//<

//> @method listGrid.clearCriteria()
// @include dataBoundComponent.clearCriteria()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundFilter
//<

//> @method listGrid.getCriteria()
// @include dataBoundComponent.getCriteria()
// <P>
// Note: if +link{listGrid.showFilterEditor} is true, the criteria returned by this method may not
// match the values currently displayed in the filter editor, since the user may have entered
// values which have not yet been applied to our data. +link{listGrid.getFilterEditorCriteria()}
// may be used to retrieve the current criteria displayed in the filterEditor.
// @group dataBoundComponentMethods
// @visibility external
//<
//> @method listGrid.setCriteria()
// @include dataBoundComponent.setCriteria()
// <P>
// Note: if +link{listGrid.showFilterEditor} is true, the +link{listGrid.setFilterEditorCriteria()}
// method may be used to update the values displayed in the filter editor without effecting the
// data object.
// @group dataBoundComponentMethods
// @visibility external
//<
// Overridden in ListGrid.js to apply the new criteria to the filter editor if it is showing


//> @method listGrid.invalidateCache()
// @include dataBoundComponent.invalidateCache()
// @group dataBoundComponentMethods
// @visibility external
//<

//> @method listGrid.willFetchData()
// @include dataBoundComponent.willFetchData()
// @visibility external
//<


//> @method listGrid.addData()
// @include dataBoundComponent.addData()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundAdd
//<

//> @method listGrid.updateData()
// @include dataBoundComponent.updateData()
// @group dataBoundComponentMethods
// @visibility external
// @example databoundUpdate
//<

//> @method listGrid.removeSelectedData()
// @include dataBoundComponent.removeSelectedData()
// @group dataBoundComponentMethods
// @visibility external
// @example removeOperation
//<

 
//> @method listGrid.getSelection()
// @include dataBoundComponent.getSelection()
//
// @group  selection
// @visibility external
// @example databoundRemove
//<

//> @method listGrid.getSelectedRecord()
// Return the first selected record in this component.<br><br>
// This method is appropriate if <code>+link{attr:listGrid.selectionType}</code> is
// <code>"single"</code>, or if you only care about the first selected record in
// a multiple-record selection. To access all selected records, use
// <code>+link{method:listGrid.getSelection()}</code> instead.
//      @group  selection
//      @return (ListGridRecord) first selected record, or null if nothing selected
// @visibility external
// @example databoundRemove
//<


//> @method treeGrid.fetchData()
// Uses a "fetch" operation on the current +link{DataSource,grid.dataSource} to retrieve data
// that matches the provided criteria, and displays the matching data in this component as a
// tree.
// <P>
// This method will create a +link{ResultTree} to manage tree data, which will
// subsequently be available as <code>treeGrid.data</code>.  DataSource records
// returned by the "fetch" operation are linked into a tree structure according to
// +link{dataSourceField.primaryKey,primaryKey} and
// +link{dataSourceField.foreignKey,foreignKey} declarations on DataSource fields.  See the
// +link{group:treeDataBinding} topic for complete details.
// <P>
// By default, the created ResultTree will use folder-by-folder load on demand, asking the
// server for the children of each folder as the user opens it.
// <P>
// The +link{ResultTree} created by <code>fetchData()</code> can be customized by setting
// +link{listGrid.dataProperties} to an Object containing properties and methods to apply to
// the created ResultTree.  For example, the property that determines whether a node is a
// folder (+link{Tree.isFolderProperty,isFolderProperty}) can be customized, or
// level-by-level loading can be disabled via
// +link{resultTree.loadDataOnDemand,loadDataOnDemand:false}.
// <P>
// The callback passed to <code>fetchData</code> will fire once, the first time that data is
// loaded from the server.  If using folder-by-folder load on demand, use the
// +link{resultTree.dataArrived()} notification to be notified each time new nodes are loaded.
// <P>
// Note that, if criteria are passed to <code>fetchData()</code>, they will be passed every
// time a new "fetch" operation is sent to the server.  This allows you to retrieve multiple
// different tree structures from the same DataSource.  However note that the server is expected
// to always respond with an intact tree - returned nodes which do not have parents are dropped
// from the dataset and not displayed.
//
// @include dataBoundComponent.fetchData()
// @group dataBoundComponentMethods
// @visibility external
//<

//> @method treeGrid.filterData()
// Retrieves data that matches the provided criteria and displays the matching data in this
// component.
// <P>
// This method behaves exactly like +link{treeGrid.fetchData()} except that
// +link{dsRequest.textMatchStyle} is automatically set to "substring" so that String-valued
// fields are matched by case-insensitive substring comparison.
//
// @include dataBoundComponent.filterData()
// @group dataBoundComponentMethods
// @visibility external
//<

//> @method tileGrid.exportData()
// @include dataBoundComponent.exportData()
// @group dataBoundComponentMethods
// @visibility external
//<

//> @method detailViewer.exportData()
// @include dataBoundComponent.exportData()
// @group dataBoundComponentMethods
// @visibility external
//<

//>	@attr dynamicForm.autoFetchData       (boolean : false : IR)
// @include dataBoundComponent.autoFetchData
// @group databinding
// @visibility external
//<

//>	@attr dynamicForm.autoFetchTextMatchStyle       (TextMatchStyle : null : IR)
// @include dataBoundComponent.autoFetchTextMatchStyle
// @group databinding
// @visibility external
//<

//> @attr dynamicForm.initialCriteria   (Criteria : null :IR)
// @include dataBoundComponent.initialCriteria
// @visibility external
//<



// Filtering
// -----------------------------------------------------------------------------

// whether this control should show end-user editing controls (if it is capable of doing so).
setCanEdit : function (newValue) {
    this.canEdit = newValue;
},

//>	@method dataBoundComponent.filterData()
// Retrieves data that matches the provided criteria and displays the matching data in this
// component.
// <P>
// This method behaves exactly like +link{listGrid.fetchData()} except that
// +link{dsRequest.textMatchStyle} is automatically set to "substring" so that String-valued
// fields are matched by case-insensitive substring comparison.
//
// @param [criteria]          (Criteria)	  Search criteria. 
//                      If a +link{DynamicForm} is passed in as this argument
//                      instead of a raw criteria object, will be derived by calling
//                      +link{DynamicForm.getValuesAsCriteria()}
// @param [callback]          (DSCallback)  callback to invoke when a fetch is complete.  Fires
//                                          only if server contact was required; see
//                                          +link{listGrid.fetchData,fetchData()} for details
// @param [requestProperties] (DSRequest)   for databound components only - optional 
//                           additional properties to set on the DSRequest that will be issued
//
// @group dataBoundComponentMethods
// @visibility internal
//<
filterData : function (criteria, callback, requestProperties) {
    this._filter("filter", criteria, callback, requestProperties);
},

//>	@method dataBoundComponent.fetchData()
// Uses a "fetch" operation on the current +link{DataSource,grid.dataSource} to retrieve data
// that matches the provided criteria, and displays the matching data in this component.
// <P>
// If there are a large number of matching records, paging will automatically be enabled, so
// that initially a smaller number of records will be retrieved and further records will
// be fetched as the user navigates the dataset.
// <P>
// When first called, this method will create a +link{class:ResultSet}, which will be
// configured based on component settings such as +link{attr:dataBoundComponent.fetchOperation}
// and +link{attr:dataBoundComponent.dataPageSize}, as well as the general purpose
// +link{listGrid.dataProperties}.  The ResultSet is then available as
// <code>component.data</code>.
// <P>
// Subsequent calls to fetchData() will simply call +link{resultSet.setCriteria,setCriteria()}
// on the created ResultSet with the passed criteria.
// <P>
// In some cases fetchData() will not need to contact the server as the new criteria can be
// satisfied by performing a client-side filter against the currently cached set of data.
// You can determine whether criteria will cause a fetch by calling 
// +link{ResultSet.willFetchData()}.  If you need to force a server fetch, you can call
// +link{ListGrid.invalidateCache,invalidateCache()} to do so.
// <P>
// This method takes an optional callback parameter (set to a +link{DSCallback}) to fire when
// the fetch completes. Note that this callback will not fire if no server fetch is performed.
// In this case the data is updated synchronously, so as soon as this method completes you
// can interact with the new data. If necessary, you can use
// +link{dataBoundComponent.willFetchData,willFetchData()} to determine whether or not a server
// fetch will occur when <code>fetchData()</code> is called with new criteria.
// <P>
// In addition to the callback parameter for this method, developers can use 
// +link{ListGrid.dataArrived(),dataArrived()} to be notified every time data is loaded.
//
// @param [criteria]          (Criteria)	  Search criteria. 
//                      If a +link{DynamicForm} is passed in as this argument
//                      instead of a raw criteria object, will be derived by calling
//                      +link{DynamicForm.getValuesAsCriteria()}
// @param [callback]          (DSCallback)  callback to invoke when a fetch is complete.  Fires
//                                          only if server contact was required
// @param [requestProperties] (DSRequest)   additional properties to set on the DSRequest
//                                            that will be issued
//
// @group dataBoundComponentMethods
// @visibility internal
//<
fetchData : function (criteria, callback, requestProperties) {
    if (!requestProperties) requestProperties = {};
    if (!requestProperties.textMatchStyle) requestProperties.textMatchStyle = "exact";
    this._filter("fetch", criteria, callback, requestProperties);
},

_canExportField : function (field) {
    return (this.canExport != false && field.canExport != false &&
            !field.userFormula && !field.userSummary &&
            !field.hidden)
    ;
},

//>	@method dataBoundComponent.exportData()
// Uses a "fetch" operation on the current +link{dataBoundComponent.dataSource,DataSource} to 
// retrieve data that matches the current filter and sort criteria for this component, then 
// exports the resulting data to a file or window in the requested format.
// <P>
// A variety of DSRequest settings, such as 
// +link{dsRequest.exportAs, exportAs} and +link{dsRequest.exportFilename}, affect the 
// exporting process: see +link{dsRequest.exportResults, exportResults} for further detail.
// <P>
// Note that data exported via this method does not include any client-side formatting and
// relies on both the SmartClient server and server-side DataSources.  To export client-data 
// with formatters applied, 
// see +link{dataBoundComponent.exportClientData, exportClientData}, which still requires the
// SmartClient server but does not rely on server-side DataSources.
// <P>
// For more information on exporting data, see +link{dataSource.exportData()}.
//
// @param [requestProperties] (DSRequest)   additional properties to set on the DSRequest
//                                            that will be issued
//
// @group dataBoundComponentMethods
// @visibility external
//<
exportData : function (requestProperties) {
    if (!requestProperties) requestProperties = {};

    var sort = this.getSort();
    if (sort) requestProperties.sortBy = isc.DS.getSortBy(sort);
    else if (this.sortField) requestProperties.sortBy = (!this.sortDirection ? "-" : "") 
        + this.sortField;

    if (!requestProperties.textMatchStyle) {
        // if not provided, set the textMatchStyle to that already in use in this component
        var context = this.data.context;
        if (context && context.textMatchStyle) requestProperties.textMatchStyle = context.textMatchStyle;
    }

    if (!this.exportAll && !requestProperties.exportFields) {
        // pass up only visible fields
        var vFields = this.exportFields;
        if (!vFields) {
            vFields = [];
            for (var i = 0; i < this.fields.length; i++) {
                var field = this.fields.get(i);
                if (this._canExportField(field)) {
                    vFields.add(field.name);
                    if (field.displayField && !field.optionDataSource) vFields.add(field.displayField);
                }
            }
        }
        if (vFields && vFields.length > 0) requestProperties.exportFields = vFields;
    }
    this.getDataSource().exportData(this.getCriteria(), requestProperties);
},

//> @method dataBoundComponent.setCriteria()
// Sets this component's filter criteria.
// Default implementation calls this.data.setCriteria()
// @param (Criteria or AdvancedCriteria) new criteria to show
//<
setCriteria : function (criteria) {
    if (this.data && this.data.setCriteria) this.data.setCriteria(criteria);
    // if there is no data yet, set initial criteria to parameter criteria
    else this.initialCriteria = criteria;
},

//> @method dataBoundComponent.getCriteria()
// Retrieves a copy of the current criteria for this component (may be null)
// @return (Criteria) current filter criteria
//<
// Overridden for CubeGrids
getCriteria : function () {
    if (!this.isDrawn() && (!this.data || this.data.getLength() == 0)) {
        return isc.shallowClone(this.initialCriteria);
    }
    else if (this.data && this.data.getCriteria) return isc.shallowClone(this.data.getCriteria());
    else return null;
},

//>	@attr dataBoundComponent.autoFetchData       (boolean : false : IR)
// If true, when this component is first drawn, automatically call <code>this.fetchData()</code>.
// Criteria for this fetch may be picked up from +link{initialCriteria}, and textMatchStyle may
// be specified via +link{autoFetchTextMatchStyle}.
// <P>
// <span style='color:red'>NOTE:</span> if <code>autoFetchData</code> is set, calling
// +link{fetchData()} before draw will cause two requests to be issued, one from the manual
// call to fetchData() and one from the autoFetchData setting.  The second request will use
// only +link{initialCriteria} and not any other criteria or settings from the first request.
// Generally, turn off autoFetchData if you are going to manually call fetchData() at any time.
//
// @group dataBoundComponentMethods
// @visibility internal
// @see fetchData()
//<

// Called at draw() - if we are databound, and autoFetchData is true, do a one time fetch on initial draw.
doInitialFetch : function () {
    var fetchQueued = false;
    if (this.autoFetchData && !this._initialFetchFired && this.fetchData) {
 
        if (!this.dataSource) {
            this.logWarn("autoFetchData is set, but no dataSource is specified, can't fetch");
        } else {
            // Queue the fetch - this means we can batch up any requests our children make on draw
            // and send them all off together
            // Specific use case: this means if a ListGrid is autoFetchData:true and has a field
            // with an optionDataSource we can use the same transaction to fetch the valid options
            // as to fetch the LG data
            fetchQueued = !isc.RPCManager.startQueue();
            // getInitialCriteria() picks up this.initialCriteria
            // getInitialFetchContext() picks up this.autoFetchTextMatchStyle            
            this.fetchData(this.getInitialCriteria(), null, this.getInitialFetchContext());
            
            this._initialFetchFired = true;
        }        
    }
    return fetchQueued;
},

// getInitialCriteria() - used to retrieve the initialCriteria when performing auto-fetch of data
getInitialCriteria : function () {
    return this.initialCriteria;
},

getInitialFetchContext : function () {
    var context = {};
    context.textMatchStyle = this.autoFetchTextMatchStyle;
    return context;
},

//> @attr dataBoundComponent.autoFetchTextMatchStyle (TextMatchStyle : null : IR)
// If +link{autoFetchData} is <code>true</code>, this attribute allows the developer to
// specify a textMatchStyle for the initial +link{fetchData()} call.
// @group dataBoundComponentMethods
// @visibility internal
//<

//> @attr dataBoundComponent.initialCriteria   (Criteria : null :IR)
// Criteria to be used when +link{autoFetchData} is set.
// @visibility internal
//<

//> @method dataBoundComponent.fetchRelatedData()
// Based on the relationship between the DataSource this component is bound to and the
// DataSource specified as the "schema" argument, call fetchData() to retrieve records in this
// grid that are related to the passed-in record.
// <P>
// Relationships between DataSources are declared via +link{dataSourceField.foreignKey}.
// <P>
// For example, given two related DataSources "orders" and "orderItems", where we want to fetch
// the "orderItems" that belong to a given "order".  "orderItems" should declare a field that
// is a +link{dataSourceField.foreignKey,foreignKey} to the "orders" table (for example, it
// might be named "orderId" with foreignKey="orders.id").  Then, to load the records related to
// a given "order", call fetchRelatedData() on the component bound to "orderItems", pass the
// "orders" DataSource as the "schema" and pass a record from the "orders" DataSource as the
// "record" argument.
//
// @param record              (ListGridRecord) DataSource record
// @param schema              (Canvas or DataSource or ID) schema of the DataSource record, or
//                            DataBoundComponent already bound to that schema
// @param [callback]          (DSCallback)  callback to invoke on completion
// @param [requestProperties] (DSRequest)   additional properties to set on the DSRequest
//                                            that will be issued
//
// @visibility internal
//<
fetchRelatedData : function (record, schema, callback, requestProperties) {
    var otherDS = isc.isA.DataSource(schema) ? schema : 
            isc.isA.String(schema) ? isc.DS.get(schema) :
            isc.isA.Canvas(schema) ? schema.dataSource : null;
    if (!otherDS) {
        this.logWarn("schema not understood: " + this.echoLeaf(schema));
        return;
    }
    var relationship = this.getDataSource().getTreeRelationship(otherDS);

	// form criteria to find related records
    var criteria = {};
    criteria[relationship.parentIdField] = record[relationship.idField];

    this.fetchData(criteria, callback, requestProperties);
},

//>	@method dataBoundComponent.clearCriteria()
// Clear the current criteria used to filter data.
//
// @param [callback]          (DSCallback)  callback to invoke on completion
// @param [requestProperties] (DSRequest)   additional properties to set on the DSRequest
//                                            that will be issued
//
// @see listGrid.fetchData()
//
// @group dataBoundComponentMethods
// @visibility internal
//<
clearCriteria : function (callback, requestProperties) {
    this._filter("filter", null, callback, requestProperties);
},

_filter : function (type, criteria, callback, requestProperties) {
    if (isc._traceMarkers) arguments.__this = this;
    
    //>!BackCompat 2005.3.21 old signature: criteria, context
    
    if (requestProperties == null && isc.isAn.Object(callback) && 
        callback.methodName == null) 
    {
        // old style call, second param (callback) is really requestParams
        requestProperties = callback;
        callback = null;
    } //<!BackCompat
    
    requestProperties = this.buildRequest(requestProperties, type, callback);
    
    // notification method fired when the user modifies the criteria in the filter editor
    // and hits the filter button / enter key.
    
    if (this.onFetchData != null) {
        this.onFetchData(criteria, requestProperties);
    }


    // support for dataBoundComponentField.includeFrom:<dataSourceID>.<fieldName>
    // for fields that are not in the dataSource but pick up their value from
    // a related dataSource
    // In this case simply update the outputs property of the request -- the
    // server will be responsible for actually getting the value from the other 
    // dataSource
    var completeFields = this.getAllFields();
    if (completeFields != null) {
        for (var i = 0; i < completeFields.length; i++) {
            if (completeFields[i].includeFrom != null && 
                this.getDataSource().getField(completeFields[i].name) == null) 
            {
                if (requestProperties.additionalOutputs == null) requestProperties.additionalOutputs = "";
                else requestProperties.additionalOutputs += ",";
                requestProperties.additionalOutputs += [
                        completeFields[i].name,
                        completeFields[i].includeFrom].join(":")
            
            }
        }
    }

    // handle being passed a criteria object (map of keys to values), or a filter-component
    if (criteria == null) {
        criteria = {};
    } else if (isc.isA.Class(criteria)) {
        // otherwise assume "filter" is something we can ask for filter criteria
        // (DynamicForm or ValuesManager)
        criteria = isc.DynamicForm.getFilterCriteria(criteria);
    }

    this.filterWithCriteria(criteria, requestProperties.operation, requestProperties);
},

filterWithCriteria : function (criteria, operation, context) {
    context.prompt = (context.prompt || isc.RPCManager.fetchDataPrompt);
    
    // get rid of empty criteria that come from raw form values
    var filterCriteria = criteria;
    if ( this.ignoreEmptyCriteria ) {
       filterCriteria = isc.DataSource.filterCriteriaForFormValues(criteria);
    }
    
    var dataModel = this.getData();
	
    // if not already viewing a result set/tree for this operation, create one for it
    if (this.useExistingDataModel(criteria, operation, context)) {
        this.updateDataModel(filterCriteria, operation, context);
    } else {
        dataModel = this.createDataModel(filterCriteria, operation, context);
    }

    // we will ask the result set for the data we currently need to display,
    // which will cause data to be fetched
    this.setData(dataModel);
        
    
    if (!context._suppressFetch && this.requestVisibleRows != null) {
        var data = this.data,
            fetchDelay = data.fetchDelay;
        
        data.fetchDelay = 0;
        this.requestVisibleRows();
        data.fetchDelay = fetchDelay;
    }
},


useExistingDataModel : function (criteria, operation, context) {
    
   var resultSet = this.getData();
   if (!isc.isA.ResultSet(resultSet)) return false;
   
   var resultSetOperation = resultSet.getOperationId("fetch");
   return resultSetOperation == null || resultSetOperation == operation.ID;
}, 

createDataModel : function (filterCriteria, operation, context) {
    //>DEBUG
    if (this.logIsInfoEnabled("ResultSet")) {
        this.logInfo("Creating new isc.ResultSet for operation '" + operation.ID + 
                      "' with filterValues: " + this.echoFull(filterCriteria), "ResultSet");
    }
    //<DEBUG
    var dataSource = this.getDataSource();

    if (!dataSource) {
        this.logWarn("No DataSource or invalid DataSource specified, can't create data model" +
                     this.getStackTrace());
        return null;
    }

    var resultSet = this.dataProperties || {};
    
    // if context is included as part of dataProperties, combine it with any passed context
    // because we'll overwrite it on resultSet below
    if (resultSet.context) context = isc.addProperties({}, resultSet.context, context);

    if (this.dataFetchDelay) resultSet.fetchDelay = this.dataFetchDelay;

    isc.addProperties(resultSet, { operation:operation, filter:filterCriteria, context:context,
        componentId: this.ID});

    if (this.getSort != null) {
        // getSort will normalize specified sortField / initialSort to
        // this._sortSpecifiers
        // We run this as part of setData(), but by also doing this here we initialize the
        // ResultSet with the appropriate sort, meaning it will already be sorted / won't
        // need to re-fetch when setData() runs and sets up the sortSpecifiers on the ListGrid
        var sortSpecifiers = this.getSort();
        if (sortSpecifiers != null && sortSpecifiers.length > 0) {
            resultSet._sortSpecifiers = sortSpecifiers;
            resultSet._serverSortBy = isc.DS.getSortBy(resultSet._sortSpecifiers);
        }
    }

    return dataSource.getResultSet(resultSet);
},

updateDataModel : function (filterCriteria, operation, context) {
    
    // tell the ResultSet the filter changed
    //>DEBUG
    this.logDebug("Setting filter to: " + this.echoFull(filterCriteria));
    //<DEBUG
      
    // update the context - this allows requestProperties like "showPrompt" / textMatchStyle
    // to change
    var resultSet = this.getData();
    
    resultSet.setContext(context);
    // if the ResultSet won't kick off an immediate fetch, kill the afterFlowCallback
    // This is the callback passed into fetchData(...) and would normally be cleared by
    // ResultSet.fetchDataReply()
    // If we don't clear it here, the next time a fetch occurs (EG via 'invalidateCache()') the
    // callback will occur (once) when that fetch completes.
    if (!resultSet.willFetchData(filterCriteria)) delete context.afterFlowCallback;
    resultSet.setCriteria(filterCriteria);
},

// add this here so that all dataBoundComponents have data available by default.
requestVisibleRows : function () {
    return this.data.get(0);
},


//> @method dataBoundComponent.invalidateCache()
// Invalidate the current data cache for this databound component via a call to
// <code>this.data.invalidateCache()</code>. If necessary, this will cause a new fetch to 
// be performed with the current set of criteria for this component.
// <P>
// Only has an effect is this components dataset is a data manager class that manages a cache
// (eg ResultSet or ResultTree).  If data was provided as a simple Array, invalidateCache()
// does nothing.
// 
// @group dataBoundComponentMethods
// @visibility internal
//<
invalidateCache : function () {
    if (this.data && this.data.invalidateCache != null) return this.data.invalidateCache();
    else if (this.isGrouped && isc.isA.ResultSet(this.originalData)) {
        // currently only valid for ListGrid: data is currently a Tree and has no
        // invalidateCache() - in order to preserve criteria, textMatchStyle, sort, etc, we
        // need to have the ResultSet from which this tree refetch.  Calling regroup right
        // after the cache is cleared sets us up to regroup when the data arrives
        this.originalData.invalidateCache();
        this.regroup();
    }
},


//> @method dataBoundComponent.willFetchData()
// Compares the specified criteria with the current criteria applied to this component's
// data object and determines whether the new criteria could be satisfied from the currently cached
// set of data, or if a new filter/fetch operation will be required.
// <P>
// This is equivalent to calling <code>this.data.willFetchData(...)</code>.
// Always returns true if this component is not showing a set of data from the dataSource. 
// 
// @param newCriteria (Criteria) new criteria to test.
// @param [textMatchStyle] (TextMatchStyle) New text match style. If not passed assumes 
//      textMatchStyle will not be modified.
// @return (boolean) true if server fetch would be required to satisfy new criteria.
//
// @group dataBoundComponentMethods
// @visibility internal
//<
willFetchData : function (newCriteria, textMatchStyle) {
    if (this.data && this.data.willFetchData != null) {
        return this.data.willFetchData(newCriteria, textMatchStyle);
    }
    return true;
},

//> @method dataBoundComponent.findByKey()
// @include resultSet.findByKey()
//<
findByKey : function(keyValue) {
    return this.data.findByKey(keyValue);    
},

// Persistence
// -----------------------------------------------------------------------------



//> @method dataBoundComponent.addData()
// Perform a DataSource "add" operation to add new records to this component's DataSource.
//
// @param newRecord (Object)	        new record
// @param [callback] (DSCallback)  method to call on operation completion
// @param  [requestProperties] (DSRequest Properties)   additional properties to set on the DSRequest
//                                          that will be issued
//
// @group dataBoundComponentMethods
// @visibility internal
//<
addData : function (newRecord, callback, requestProperties) {
    return this._performDSOperation("add", newRecord, callback, requestProperties);
},

//> @method dataBoundComponent.updateData()
// Perform a DataSource "update" operation to update existing records in this component's
// DataSource.
//
// @param updatedRecord  (Object)	        updated record
// @param [callback]          (DSCallback)  method to call on operation completion
// @param [requestProperties] (DSRequest Properties)   additional properties to set on the DSRequest
//                                          that will be issued
//
// @group dataBoundComponentMethods
// @visibility internal
//<
updateData : function (updatedRecord, callback, requestProperties) {
    return this._performDSOperation("update", updatedRecord, callback, requestProperties);
},

//> @method dataBoundComponent.removeData()
// Perform a DataSource "remove" operation to remove records from this component's
// DataSource.
//
// @param data (Object)	        primary key values of record to delete, 
//                                          (or complete record)
// @param [callback] (DSCallback)  method to call on operation completion
// @param [requestProperties] (DSRequest Properties)   additional properties to set on the DSRequest
//                                          that will be issued
//
// @group dataBoundComponentMethods
// @visibility internal
//<
removeData : function (recordKeys, callback, requestProperties) {
    
    return this._performDSOperation("remove", recordKeys, callback, requestProperties);
},

_performDSOperation : function (operationType, data, callback, requestProperties) {
    if (isc._traceMarkers) arguments.__this = this;

    //>!BackCompat 2005.3.21 old signature: data, context
    if (requestProperties == null && isc.isAn.Object(callback) && 
        callback.methodName == null) 
    {
        // old style call, second param (callback) is really requestParams
        requestProperties = callback;
        callback = null;
    } //<!BackCompat

    if (this.saveLocally || this.getDataSource() == null) {
        if (operationType == "update") {
            var ds = this.getDataSource();
            if (!ds) {
                isc.logWarn("Update by primary key cannot be performed without a DataSource." +  
                    "Modify the record directly instead");
                return;
            } 
            // look up record by PK
            var record = this.data.get(ds.findByKeys(data, this.data));
            //this.logWarn("record is: " + this.echo(record) + ", data is: " + this.echo(data));
            // update it
            isc.addProperties(record, data);
            // manaully fire dataChanged
            return this.data.dataChanged();
        } else if (operationType == "add") {
            // for listgrid grouping, add record to original data and regroup
            if (this.originalData) { 
                this.originalData.add(data);
                this.dataChanged("add", null, null, data);
            } else {
                // dataChanged fires automatically
                this.data.add(data);       
            }
            return;
        }
    }
    
    // Call buildRequest - this will hang the default operationID (as well as various other
    // properties) onto the request.
    // We're passing the callback into performDSOperation directly so no need to hang it onto
    // the request in buildRequest
    requestProperties = this.buildRequest(requestProperties, operationType);
    
    return this.getDataSource().performDSOperation(operationType, data, 
                                                   callback, requestProperties);
},

//>	@method dataBoundComponent.removeSelectedData()
// Remove the currently selected records from this component.
// If this is a databound grid, the records will be removed directly from the DataSource.
// <P>
// If no records are selected, no action is taken. The grid will automatically be
// updated if the record deletion succeeds.
//
// @param [callback] (DSCallback) callback to fire when the data has been removed
// @param [requestProperties] (DSRequest)   additional properties to set on the DSRequest
//                                          that will be issued
//
// @group dataBoundComponentMethods
// @visibility internal
//<
removeSelectedData : function (callback, requestProperties) {


    //>!BackCompat 2005.3.21 old signature: criteria, context
    if (requestProperties == null && isc.isAn.Object(callback) && 
        callback.methodName == null) 
    {
        // old style call, first param (callback) is really requestParams
        requestProperties = callback;
        callback = null;
    } //<!BackCompat

    
    var selection = this.getSelection();

    // In an editable ListGrid, you can't select unsaved data.  If we are editing and
    // selectOnEdit is set and this is an unsaved row, call discardEdits() as an equivalent to
    // removeSelectedData()
    if (isc.isA.ListGrid(this) && this.canEdit && this.selectOnEdit && 
        (selection == null || selection.length == 0) &&
        this.getEditRow() != null && this.getRecord(this.getEditRow()) == null)
    {
        this.discardEdits(this.getEditRow());
        return;
    }

    // if this is not a databound grid or we are working with local-only data (an Array)
    if (this.dataSource == null || this.saveLocally) {
        if (this.data) {
            this.data.removeList(this.getSelection());
            if (callback) this.fireCallback(callback);
        }
        return;
    }

    var context = this.buildRequest(requestProperties, "remove", callback),
        dataSource = this.getDataSource();

    if (selection.length > 0) this.deleteRecords(selection, context.operation, context, dataSource);
    // notify that they have to select something to delete first... ???
},

// delete a specific list of records from the server
deleteRecords : function (records, deleteOperation, context, dataSource) {
    
    isc.addProperties(context, {
        prompt:(context.prompt || isc.RPCManager.removeDataPrompt)
    });

    // perform the delete as a multi-op, one per record
    var wasAlreadyQueuing = isc.RPCManager.startQueue();
    if (!isc.isAn.Array(records)) records = [records];
    for (var i = 0; i < records.length; i++) {
        if (records[i]._isGroup) continue;
        dataSource.performDSOperation(deleteOperation.type, records[i], null, context);
    }
    
    // don't kickoff the transaction unless this flow initiated queuing, in case caller
    // wants to include other operations
    if (!wasAlreadyQueuing) isc.RPCManager.sendQueue();
},


// Selection
// ---------------------------------------------------------------------------------------

//> @method dataBoundComponent.createSelectionModel()
// Creates the selection object for this +link{DataBoundComponent}
//
// @return null
// @group  selection
// @visibility internal
//<
createSelectionModel : function () {
    // clean up old selection object before creating new selection, if we have one.
    if (this.selection) this.destroySelectionModel();
    
    if (this.canSelectCells) {
    	
        var data = [];
        if (this.numRows != null) {
            for (var i = 0; i < this.numRows; i++) {
                data[i] = {};
            }
        }
    } else {
        var data = this.data;
    }
		
    var selection,
        params = {ID:this.getID()+"_selection", 
                  data:data,
                  
                  target: this,
                  selectionProperty:this.selectionProperty,
                  simpleDeselect : this.simpleDeselect,
                  dragSelection : this.canDragSelect
                };

    
    if (this.canSelectCells && this.fields != null) params.numCols = this.fields.length;
    
    // Copy our "enabled" property across if we have one.
    if (this.recordEnabledProperty != null) params.enabledProperty = this.recordEnabledProperty;
    
    // Copy our selection properties
    if (this.recordCanSelectProperty != null) params.canSelectProperty = this.recordCanSelectProperty;
    if (this.cascadeSelection != null) params.cascadeSelection = this.cascadeSelection;

	// if the data object supports a special selection class, use it
	if (this.data.getNewSelection) {
        selection = this.data.getNewSelection(params);
    }
    if (selection == null) {
    	// otherwise use the default Selection or CellSelection class
        if (this.canSelectCells) {
            selection = isc.CellSelection.create(params);
        } else {
            selection = isc.Selection.create(params);
        }
    }
	
    this.selection = selection;
    
},

// destroySelectionModel: Decouple from selection object and destroy it.  
destroySelectionModel : function () {
    if (!this.selection) return;
    if (this.selection.destroy) this.selection.destroy();
    delete this.selection;
}, 

// undoc'd utility method to remove the selection-property applied to selected-rows
removeSelectionMarkers : function (data) {
    var returnArray = true;
    if (!isc.isAn.Array(data)) {
        data = [data];
        returnArray = false;
    }
    data.clearProperty(this.selectionProperty || this.selection ? this.selection.selectionProperty : null);
    return returnArray ? data : data[0];
},

//> @method dataBoundComponent.getSelection()
// Returns all selected records, as an Array.
//
// @param [excludePartialSelections] When true, partially selected records will not be returned.
//                                   Otherwise, both fully and partially selected records are
//                                   returned.
// @return (Array of ListGridRecord) list of records, empty list if nothing selected
// @group  selection
// @visibility internal
// @example databoundRemove
//<
getSelection : function (excludePartialSelections) {
    if (!this.selection) return null;
	if (this.canSelectCells) {
		var selectedCells = this.selection.getSelectedCells();
		if (selectedCells == null) return null;

		
		var cellRecords = [];
		for (var i = 0; i < selectedCells.length; i++) {
			var selectedCell = selectedCells[i],
				cellRecord = this.getCellRecord(selectedCell[0], selectedCell[1])
			;
			if (cellRecord == null) continue; // record for this cell
			cellRecords.add(cellRecord);
		}
		return cellRecords;
	} else {
		return this.selection.getSelection(excludePartialSelections);
	}
},

//> @method dataBoundComponent.getSelectedRecord()
// Return the first selected record in this component
//      @group  selection
//      @return (ListGridRecord) first selected record, or null if nothing selected
// @visibility internal
// @example databoundRemove
//<
getSelectedRecord : function() {
    if (!this.selection) return null;
    return this.selection.getSelectedRecord();
},

//> @method dataBoundComponent.getSelectionObject()
// Return the dataBoundComponent's underlying +link{Selection} object.  Note that this differs
// from +link{dataBoundComponent.getSelection}, which returns an array containing the actual
// selected objects
//      @group  selection
//      @return (Selection) This dataBoundComponent's underlying +link{Selection} object
// @visibility internal
//<
getSelectionObject : function() {
    return this.selection;
},

//> @method listGrid.isSelected()
// Returns true if the record is selected.
// 
// @param record (ListGridRecord) record to check
// @return (boolean) true if record is selected; false otherwise
// @group selection
// @visibility external
//<
isSelected : function (record) {
    if (!record || !this.selection) return false;
    return this.selection.isSelected(record);
},

//> @method listGrid.isPartiallySelected()
// Returns true if the record is partially selected.
// 
// @param record (ListGridRecord) record to check
// @return (boolean) true if record is partially selected; false otherwise
// @group selection
// @visibility external
//<
isPartiallySelected : function (record) {
    if (!record || !this.selection) return false;
    return this.selection.isPartiallySelected(record);
},

//> @groupDef selection
// APIs for marking +link{Record}s as selected and retrieving the selected record or records.
// <P>
// Only applicable to a +link{DataBoundComponent} that manages a list of Records, or manages a
// data model that can be viewed as a list (for example, the current list of visible nodes
// on a tree can be treated as a list for selection purposes).
// 
// @title Selection
// @visibility external
//<


// Simple helper methods to avoid having to refer directly to this.selection
// Genericized up from ListGrid, July 2008

//> @method dataBoundComponent.selectRecord()
//
// Select/deselect a +link{Record} passed in explicitly, or by index.
//
// @param record (Record | number) record (or row number) to select
// @param [newState] (boolean) new selection state (if null, defaults to true)
//
// @group selection
// @visibility external
//<
selectRecord : function (record, state, colNum) {
    this.selectRecords(record, state, colNum);
    this.fireSelectionUpdated();
},

//> @method dataBoundComponent.selectSingleRecord()
// Select a single +link{Record} passed in explicitly, or by index, and deselect everything else.
// When programmatic selection of records is a requirement and 
// +link{dataBoundComponent.selectionType} is "single", use this method rather than 
// +link{dataBoundComponent.selectRecord(), selectRecord()} to 
// enforce mutually-exclusive record-selection.
//
// @param record (Record | number) record (or row number) to select
// 
// @group selection
// @visibility external
//<
selectSingleRecord : function (record) {
    this.deselectAllRecords();
    this.selectRecord(record);
    this.fireSelectionUpdated();
},

//> @method dataBoundComponent.deselectRecord()
//
// Deselect a +link{Record} passed in explicitly, or by index.
// <P>
// Synonym for <code>selectRecord(record, false)</code>
//
// @param record (Record | number) record (or row number) to deselect
//
// @group selection
// @visibility external
//<
deselectRecord : function (record, colNum) {
    this.selectRecord(record, false, colNum);
    this.fireSelectionUpdated();
},

//> @method dataBoundComponent.selectRecords()
//
// Select/deselect a list of +link{Record}s passed in explicitly, or by index.
//
// @param records (Array of Record | numbers) records (or row numbers) to select
// @param [newState]  (boolean) new selection state (if null, defaults to true)
//
// @group selection
// @visibility external
//<
selectRecords : function (records, state, colNum) {
    if (state == null) state = true;
    if (!isc.isAn.Array(records)) records = [records];

    if (isc.isA.ResultSet(this.data) && !this.data.lengthIsKnown()) {
        this.logWarn("ignoring attempt to select records while data is loading");
        return;
    }
    
    for (var i = 0; i < records.length; i++) {
        
        if (records[i] == null) continue;

        // assume any number passed is a rownum
        if (isc.isA.Number(records[i])) {
            var index = records[i];
            records[i] = this.getRecord(index, colNum);
        }
    }
    
    var selObj = this.getSelectionObject(colNum);
    if (selObj) {
        selObj.selectList(records, state, colNum);
        this.fireSelectionUpdated();
    }
},

//> @method dataBoundComponent.deselectRecords()
//
// Deselect a list of +link{Record}s passed in explicitly, or by index.
// <P>
// Synonym for <code>selectRecords(records, false)</code>
//
// @param records (Array of Record | numbers) records (or row numbers) to deselect
//
// @group selection
// @visibility external
//<
deselectRecords : function (records, colNum) {
    this.selectRecords(records, false);
    this.fireSelectionUpdated();
},

//> @method dataBoundComponent.selectAllRecords()
// Select all records
//
// @group selection
// @visibility external
//<
selectAllRecords : function () {
    this.selection.selectAll();
    this.fireSelectionUpdated();
},

//> @method dataBoundComponent.deselectAllRecords()
//
// Deselect all records
//
// @group selection
// @visibility external
//<
deselectAllRecords : function () {
    this.selection.deselectAll();
    this.fireSelectionUpdated();
},

//> @method dataBoundComponent.anySelected()
// @include selection.anySelected()
//<
anySelected : function () {
    return this.selection && this.selection.anySelected();
},

getRecord : function (index, column) {
    if (this.data) return this.data.get(index);
    return null;
},

fireSelectionUpdated : function () {
    if (this.selectionUpdated) {
        var recordList = this.getSelection(),
            record = (recordList && recordList.length > 0 ? recordList[0] : null)
        ;
        this.selectionUpdated(record, recordList);
    }
},

// Hiliting
// ---------------------------------------------------------------------------------------

//> @groupDef hiliting
// Hiliting means special visual styling which is applied to specific data values that meet
// certain criteria.
// <P>
// A +link{Hilite} definition contains styling information such as +link{hilite.cssText} and
// +link{hilite.htmlBefore} that define what the hilite looks like, as well as properties
// defining where the hilite is applied.  If you create hilites manually, they should ideally
// specify +link{hilite.textColor, textColor} and/or 
// +link{hilite.backgroundColor, backgroundColor} in order to be editable in a 
// +link{class:HiliteEditor}.  If these are not provided, however, note that they will be 
// manufactured automatically from the +link{hilite.cssText, cssText} attribute if it is present.
// <P>
// A hilite can be applied to data <b>either</b> by defining +link{hilite.criteria,criteria}
// or by explicitly including markers on the data itself.  
// <P>
// Hiliting rules such as hiliting different ranges of values with different colors can be
// accomplished entirely client-side by defining +link{AdvancedCriteria} in hilite definitions
// that pick out values to be highlighted.
// <P>
// Hiliting rules that require server-side calculations can be achieved by assigning a
// +link{hilite.id} to a hilite definition, and setting the
// +link{dataBoundComponent.hiliteProperty} on the records that should show that highlight.
// This can be used, for example, to hilite the record with the maximum value for a dataset
// that the application will load incrementally.
//
// @title Hiliting Overview
// @visibility external
//<

// Hilite Declarations
// ---------------------------------------------------------------------------------------

//> @object Hilite
// Definition of a hilite style.
// <P>
// See +link{group:hiliting} for an overview.
//
// @treeLocation Client Reference/Grids
// @visibility external
//< 

//> @attr hilite.id (String : null : IR)
// Unique id for this hilite definition.  
// <P>
// For hilites that include +link{hilite.criteria} this is not required.
// <P>
// If you are explicitly marking records for hiliting, set
// +link{dataBoundComponent.hiliteProperty} on the record to this id.  
//
// @visibility external
//< 

//> @attr hilite.cssText (CSSText : null : IR)
// CSS text to be applied to cells where this hilite is applied, for example,
// "background-color:#FF0000"
//
// @visibility external
//< 

//> @attr hilite.fieldName (identifier : null : IR)
// Name of the field, or array of fieldNames, this hilite should be applied to.  
// <P>
// If unset, hilite is applied to every field of the record.
//
// @visibility external
//< 

//> @attr hilite.criteria (Criteria or AdvancedCriteria : null : IR)
// Criteria defining what records this hilite should apply to.
// 
// @visibility external
//<

//> @attr hilite.htmlBefore (HTML : null : IR)
// HTML to prepend to cell values where this hilite is applied.
//
// @visibility external
//<

//> @attr hilite.htmlAfter (HTML : null : IR)
// HTML to append to the end of cell values where this hilite is applied.
//
// @visibility external
//<

//> @attr hilite.htmlValue (String : null : IR)
// Value to show <b>in place of</b> the actual value from the record, for a record that matches
// this hilite.
// <P>
// This can be used to take ranges of numeric values and simplify them to "Low", "Medium",
// "High" or similar textual values, translate very small or very large values to "Outlier" or
// "Negligible", and similar use cases.
//
// @visibility external
//<

//> @attr hilite.disabled (boolean : false : IRW)
// Whether this hilite is currently disabled.
// <P>
// Hilites can be programmatically enabled and disabled via +link{dataBoundComponent.enableHilite()}.
//
// @visibility external
//<

//> @attr hilite.title (String : null : IRW)
// User-visible title for this hilite.  Used for interfaces such as menus that can enable or
// disable hilites.
//
// @visibility external
//<


//> @attr hilite.textColor (String : null : IRW)
// When edited via a +link{class:HiliteEditor}, the value for the foreground color of this 
// hilite.  If this is omitted, it will be automatically derived from the <i>textColor</i>
// attribute of +link{hilite.cssText}.  When a hilite is saved in a HiliteEditor, both 
// attributes are set automatically.
//
// @visibility external
//<

//> @attr hilite.backgroundColor (String : null : IRW)
// When edited via a +link{class:HiliteEditor}, the value for the background color of this 
// hilite.  If this is omitted, it will be automatically derived from the <i>backgroundColor</i>
// attribute of +link{hilite.cssText}.  When a hilite is saved in a HiliteEditor, both 
// attributes are set automatically.
//
// @visibility external
//<

 
styleOpposite:"cellHiliteOpposite",

// Hilites
// ---------------------------------------------------------------------------------------

//> @attr dataBoundComponent.hilites (Array of Hilite : null : [IRW])
// Hilites to be applied to the data for this component.  See +link{group:hiliting}.
//
// @visibility external
//<

//> @attr dataBoundComponent.hiliteProperty (string : "_hilite" : [IRW])
// Marker that can be set on a record to flag that record as hilited.  Should be set to a value
// that matches +link{hilite.id} for a hilite defined on this component.
//
// @visibility external
//<
// NOTE: not the same as hiliteMarker, which is an internal property used to track generated
// hilites 
hiliteProperty:"_hilite",

    
// Hilite APIs

// user: 
//   component.hilites && setHilites()
//   record[hiliteProperty] (CubeGrid only)
// component/framework: 
//   note: setup is automatic on first call any of the below, or setHilites()
//   applyHilites() (to data)
//   getHiliteCSSText() / addHiliteCSSText()




//>	@method dataBoundComponent.getHilites()
// Return the set of hilite-objects currently applied to this DataBoundComponent.  These
// can be serialized for storage and then restored to a component later via 
// +link{dataBoundComponent.setHilites, setHilites()}.
//
// @visibility external
// @return (Array) Array of hilite objects
// @group  hiliting
//<
getHilites : function () {
    return this.hilites;
},

// property used to store hilite state for generated hilites
hiliteMarker:"_hmarker",
_hiliteCount: 0,

//>	@method dataBoundComponent.setHilites()
// Accepts an array of hilite objects and applies them to this DataBoundComponent.  See also
// +link{dataBoundComponent.getHilites, getHilites()} for a method of retrieving the hilite
// array for storage, including hilites manually added by the user.
//
// @param hilites (Array of Hilite) Array of hilite objects
// @group hiliting
// @visibility external
//<
setHilites : function (hilites) {
    this.hilites = hilites;

    if (hilites == null) return; // no hilites

    this._setupHilites(this.hilites);

}, 

//>	@method dataBoundComponent.getHiliteState()
// Get the current hilites encoded as a String, for saving.
//
// @return (String) hilites state encoded as a String
// @visibility external
//<
getHiliteState : function () {
    var hilites = this.getHilites();
    if (hilites == null) return null;
    return "(" + isc.JSON.encode(hilites, {dateFormat:"dateConstructor"}) + ")";
},

//>	@method dataBoundComponent.setHiliteState()
// Set the current hilites based on a hiliteState String previously returned from
// +link{getHilitesState()}.
// @param hiliteState (String) hilites state encoded as a String
// @visibility external
//<
setHiliteState : function (hilitesState) {
    //!OBFUSCATEOK    
    if (hilitesState == null) return;
    var hilites = eval(hilitesState);
    this.setHilites(hilites);
},

// factored so it can also get called lazily the first time getHilite() is called
_setupHilites : function (hilites, dontApply) {
    // auto-assign ids if unset
    for (var i = 0; i < hilites.length; i++) {
        if (hilites[i].id == null) {
            this._lastHiliteId = this._lastHiliteId || 0;
            hilites[i].id = this._lastHiliteId++;
        }
    }
    
    // for quick hilite lookups
    this._hiliteIndex = hilites.makeIndex("id");
    
    if (!dontApply) this.applyHilites();
},

applyHilites : function () {
    var hilites = this.hilites,
        data = this.data;

    if (!hilites) return;

    if (hilites && !this._hiliteIndex) this._setupHilites(hilites, true);

    // wipe all existing hilite markers  
    if (isc.isA.ResultSet(data)) data = data.getAllLoadedRows();
    if (isc.isA.Tree(data)) data = data.getAllItems();
    data.setProperty(this.hiliteMarker, null);

    var fields = this.getAllFields();
    
    for (var i=0; i<fields.length; i++) {
        var field = fields[i],
            fieldName = field[this.fieldIdProperty]
        ;
        if (field.userFormula || field.userSummary) {
            if (field.userSummary && !field._generatedSummaryFunc)
                this.getSummaryFunction(field);

            for (var j=0; j<data.length; j++) {
                if (field.userFormula) 
                    data[j][fieldName] = this.getFormulaFieldValue(field, data[j]);
                else  
                    data[j][fieldName] = field._generatedSummaryFunc(data[j], fieldName, this);
            }
        }
    }

    // apply each hilite in order
    for (var i = 0; i < hilites.length; i++) {
        this.applyHilite(hilites[i], data);
    }
    this.redrawHilites();
},

getHilite : function (hiliteId) {
    if (isc.isAn.Object(hiliteId)) return hiliteId;

    if (this.hilites == null) return null;
    
    if (!this._hiliteIndex && this.hilites) {
        this._setupHilites(this.hilites);
    }

    var hilite = this._hiliteIndex[hiliteId];

    // try hiliteId as an array index
    if (hilite == null) hilite = this.hilites[hiliteId];

    return hilite;
},


applyHilite : function (hilite, data, fieldName) {
    hilite = this.getHilite(hilite);

    // hilite may be applied in some other way, eg manual calls
    if (!hilite.criteria) return;

    if (hilite.disabled) return;

    var fieldName = fieldName || hilite.fieldName;

    // hilite all fields if no field is specified
    if (fieldName == null) fieldName = this.fields.getProperty("name");

    var matches = [];

    if (this.getDataSource()) {
        matches = this.getDataSource().applyFilter(data, hilite.criteria);
    } else {
        // Call a local DBC version of DS.applyFilter which provides the same facilities but
        // against array data
        matches = this.unboundApplyFilter(data, hilite.criteria);
    }

    var fieldNames = isc.isAn.Array(fieldName) ? fieldName : [fieldName];

    if (this.logIsDebugEnabled("hiliting")) {
        this.logDebug("applying filter: " + this.echoFull(hilite.criteria) + 
                      ", produced matches: " + isc.echoLeaf(matches) +
                      ", on fields: " + fieldNames, "hiliting");
    }

    for (var j = 0; j < fieldNames.length; j++) {
        var field = this.getField(fieldNames[j]);
        for (var i = 0; i < matches.length; i++) {
            var record = matches[i];

            this.hiliteRecord(record, field, hilite);
        }
    }   
},

// Utility method to provide searching by criteria/AdvancedCriteria in the absence of a DS
unboundApplyFilter : function (data, criteria) {
    var matches = [];

    if (data) {
        if (criteria) {
            for (var idx = 0; idx < data.length; idx++) {
                // The AdvancedCriteria system makes this very easy - just call evaluateCriterion
                // on the top-level criterion, and it handles all the recursion and evaluation of
                // sub-criteria that it needs to do automatically.
                if (this.evaluateCriterion(data[idx], criteria)) {
                    matches.add(data[idx]);
                }
            }
        } else {
            matches = data;
        }
    }

    return matches;
},
evaluateCriterion : function (record, criterion) {

    var op = isc.DataSource._operators.find("ID", criterion.operator);
    if (op == null) {
        isc.logWarn("Attempted to use unknown operator " + criterion.operator);
        return false;
    }
    return op.condition(criterion.value, record, criterion.fieldName, criterion, op, this);
},

// TODO: make external version that checks params
hiliteRecord : function (record, field, hilite) {

	if (!field) return;

    var hiliteCount = record[this.hiliteMarker];
    if (hiliteCount == null) hiliteCount = record[this.hiliteMarker] = this._hiliteCount++;

    var fieldHilites = field._hilites = field._hilites || {}, // XXX wipe these in setFields or
                                                              // similar
        existingHilite = fieldHilites[hiliteCount];

    if (existingHilite == null) fieldHilites[hiliteCount] = hilite.id;
    else fieldHilites[hiliteCount] = [existingHilite, hilite.id];
},

getHiliteCSSText : function (hilite) {
    var hilite = this.getHilite(hilite);
    if (!hilite) return;
    // .style is backcompat for old CubeGrid hilites
    return hilite.cssText || hilite.style;
},

_hiliteIterator : [],
addHiliteCSSText : function (record, colNum, cssText) {
    if (!record) return cssText;

    var hiliteCount = record[this.hiliteMarker],
        field = this.getField(colNum);

    if (!field || !field._hilites) return cssText;

    var hiliteIds = field._hilites[hiliteCount];
    if (hiliteIds == null) return cssText;

    //this.logWarn("add hiliteCSS: hiliteCount: " + hiliteCount + 
    //             " on field:" + field.name + ", hiliteIds: " + hiliteIds);

    // convert to Array
    if (!isc.isAn.Array(hiliteIds)) {
        this._hiliteIterator[0] = hiliteIds;
        hiliteIds = this._hiliteIterator;
    }
     
    // multiple hilites apply to cell
    for (var i = 0; i < hiliteIds.length; i++) {
        var hiliteCSSText = this.getHiliteCSSText(hiliteIds[i]);
        if (hiliteCSSText != null) {
            cssText = cssText ? cssText + isc.semi + hiliteCSSText : hiliteCSSText;
        }
    }

    return cssText;
},

addObjectHilites : function (object, cellCSSText, field) {
    if (!this.hilites || !object) return cellCSSText;

    var objArr;
    if (!isc.isAn.Array(object)) {
        this._hiliteIterator[0] = object;
        objArr = this._hiliteIterator;
    }
    
    for (var i = 0; i < objArr.length; i++) {
        var hiliteID, hilite, hiliteCSSText, currObj = objArr[i];
        if (isc.isA.String(currObj)) hiliteID = currObj;
        else hiliteID = (currObj != null ? currObj[this.hiliteProperty] : null);
        // get the hilite object (ENH: could support arrays of multiple hilite objects)
        hilite = this.getHilite(hiliteID);
        if (hilite != null && !hilite.disabled) { // we have a hilite object
            // NOTE: "style" is backcompat
            hiliteCSSText = hilite.cssText || hilite.style;
            // make sure that hilites that spec a fieldName are respected

            var fieldNames = [];
            if (hilite)
                fieldNames = isc.isAn.Array(hilite.fieldName) ? hilite.fieldName : [hilite.fieldName];

            var matchesField = (!hilite.fieldName || !field || fieldNames.contains(field.name));
            if (hiliteCSSText != null && hiliteCSSText != isc.emptyString && matchesField) {
                // we have a hilite style
                if (cellCSSText == null) cellCSSText = hiliteCSSText;
                // NOTE: add a semicolon, even though it may be redundant
                else cellCSSText += isc.semi + hiliteCSSText;
            }
        }
    }
	return cellCSSText;    
},

getFieldHilites : function (record, field) {
    if (!record || !field) return null;

    if (record[this.hiliteProperty] != null) {
        var hilite = this.getHilite(record[this.hiliteProperty]),
            fieldNames;
        if (hilite)
            fieldNames = isc.isAn.Array(hilite.fieldName) ? hilite.fieldName : [hilite.fieldName];
        if (fieldNames && fieldNames.contains(field.name)) return [hilite];
        else return null;
    }
    
    if (record[this.hiliteMarker] != null) {
        var hiliteCount = record[this.hiliteMarker];
        if (!field._hilites) return null;
        else return field._hilites[hiliteCount];
    }
},

applyHiliteHTML : function (hiliteIDs, valueHTML) {
    if (!this.hilites) return valueHTML;
	var hilite, hiliteHTML, hiliteID;
    // convert to Array
    if (!isc.isAn.Array(hiliteIDs)) {
        this._hiliteIterator[0] = hiliteIDs;
        hiliteIDs = this._hiliteIterator;
    }

    for (var i = 0; i< hiliteIDs.length; i++) {
        hiliteID = hiliteIDs[i];
        // get the hilite object
        
        hilite = this.getHilite(hiliteID);
        if (hilite != null) {
            if (hilite.htmlValue != null) valueHTML = hilite.htmlValue;
            if (!hilite.disabled) { // we have a hilite object, not disabled
                hiliteHTML = hilite.htmlBefore;
                if (hiliteHTML != null && hiliteHTML.length > 0) { // we have hilite htmlBefore, so prepend it
                    valueHTML = hiliteHTML + valueHTML;
                }
                hiliteHTML = hilite.htmlAfter;
                if (hiliteHTML != null && hiliteHTML.length > 0) { // we have hilite htmlAfter, so append it
                    valueHTML = valueHTML + hiliteHTML;
                }
        
                // position a special glyph of some sort (eg an image or small text code) opposite the
                // cell value.  NOTE name "htmlOpposite" reflects future support for automatically
                // flipping direction column align and/or RTL.
                var oppositeContent = hilite.htmlOpposite,
                    style = hilite.styleOpposite || this.styleOpposite;
                if (oppositeContent) {
                    if (!isc.Browser.isIE) {
                        // in browsers other than IE, <nobr> works even when surrounding a mixture of
                        // floating and non-floating content
                        valueHTML = "<nobr><div class='" + style + "' style='float:left'>&nbsp;" +
                                 oppositeContent + "&nbsp;</div>" + valueHTML + "</nobr>";
                    } else {
                        
                        valueHTML = "<nobr><table align=left><tr><td class='" + style + "'>" +
                                 oppositeContent + "</td></tr></table>" + valueHTML + "</nobr>";
                    }
                }
            }
        }
    }
	return valueHTML;
},

//>	@method dataBoundComponent.enableHilite()
// Enable / disable a +link{dataBoundComponent.hilites,hilite}
//
// @visibility external
// @group  hiliting
//
// @param  hiliteID    (string)    ID of hilite to enable
// @param  [enable]    (boolean)   new enabled state to apply - if null, defaults to true
//<
enableHilite : function (hiliteID, enable) {
    if (enable == null) enable = true;
    var hilite = this.getHilite(hiliteID);
    if (hilite == null) return;
    hilite.disabled = !enable;
    // redraw to show hilite / lack of hilite
    this.redrawHilites();
},

//>	@method dataBoundComponent.disableHilite()
// Disable a hilite
//
// @visibility external
// @group  hiliting
//
// @param  hiliteID    (string)    ID of hilite to disable
//<
disableHilite : function (hiliteID) { this.enableHilite(hiliteID, false); },

//>	@method dataBoundComponent.enableHiliting()
// Enable all hilites.
//
// @visibility external
// @group  hiliting
//
// @param  [enable]    (boolean)   new enabled state to apply - if null, defaults to true
//<
enableHiliting : function (enable) {
    if (enable == null) enable = true;
    if (this.hilites) this.hilites.setProperty("disabled", !enable);
    this.redrawHilites();
},

//>	@method dataBoundComponent.disableHiliting()
// Disable all hilites.
//
// @visibility external
// @group  hiliting
//<
disableHiliting : function () { this.enableHiliting(false) },

redrawHilites : function () {
    this.markForRedraw();
},


//>	@method dataBoundComponent.editHilites()
// Shows a +link{class:HiliteEditor, HiliteEditor} interface allowing end-users to edit
// the data-hilites currently in use by this DataBoundComponent.
//
// @visibility external
// @group  hiliting
//<
editHilites : function () {
    // needs to be dynamically re-created to account for formula fields
    var ds = isc.DataSource.create({
        fields : this.getAllFields()
    });

    if (this.hiliteWindow) {
        this.hiliteEditor.setDataSource(ds);
        this.hiliteEditor.clearHilites();
        this.hiliteEditor.setHilites(this.getHilites());
        this.hiliteWindow.show();
        return;
    }
    var grid = this,
	    hiliteEditor = this.hiliteEditor = isc.HiliteEditor.create({
            autoDraw:false,
            dataSource:ds,
            hilites:this.getHilites(),
            callback:function (hilites) {
                if (hilites != null) grid.setHilites(hilites);
                grid.hiliteWindow.hide();
            }
        }),
        theWindow = this.hiliteWindow = isc.Window.create({
            autoDraw:true,
            items : [ hiliteEditor ],
            autoSize:true,
            autoCenter:true, isModal:true, showModalMask:true,
            closeClick : function () {
                this.hide();
            },
            title:"Edit Highlights",
            bodyProperties : { layoutMargin:8, membersMargin:8 }
        });
    return theWindow;
},

//
// Drag & Drop
// -----------------------------------------------------------------------------

// These methods are factored up from ListGrid, to make them available to TileGrid.
// They are only applicable to list-type components (as of Oct 2008, ListGrid, TreeGrid 
// and TileGrid).  Although they are here in DataBoundComponent, they also work in the 
// case of non-databound components (as source, target or both).

//> @method dataBoundComponent.transferRecords()
//
// Transfer a list of +link{Record}s from another component (does not have to be a databound
// component) into this component.  This method is only applicable to list-type components,
// such as +link{ListGrid,listGrid}, +link{TreeGrid,treeGrid} or +link{TileGrid,tileGrid}
// <P>
// This method implements the automatic drag-copy and drag-move behaviors of components like
// +link{ListGrid}, and calling it is equivalent to completing a drag and drop of the
// <code>dropRecords</code>.
// <P>
// Note that this method is asynchronous - it may need to perform server turnarounds to prevent
// duplicates in the target component's data.  If you wish to be notified when the transfer 
// process has completed, you can either pass the optional callback to this method or implement
// the +link{dropComplete()} method on this component.
// <P>
// See also +link{transferSelectedData}.
//
// @param dropRecords (Array of Record) Records to transfer to this component
// @param targetRecord (Record) The target record (eg, of a drop interaction), for context
// @param index (integer) Insert point in this component's data for the transferred records
// @param sourceWidget (Canvas) The databound or non-databound component from which the records
//                            are to be transferred. 
// @param [callback] (Callback) optional callback to be fired when the transfer process has completed
//
// @group dragdrop
// @visibility external
//<
transferRecords : function (dropRecords, targetRecord, index, sourceWidget, callback) {

    // storeTransferState returns false if a prior transfer is still running, in which case
    // we just bail out (transferRecords() will be called again when the first transfer 
    // completes, so we aren't abandoning this transfer, just postponing it) 
    if (!this._storeTransferState("transferRecords", dropRecords, targetRecord, index, 
                                  sourceWidget, callback)) {
        return;
    }

    // If this component is databound but has not yet issued a fetchData(), we need to 
    // initialize the ResultSet before adding records, otherwise cache sync will not be in
    // place and it will look to the user like the records haven't been added.  We 
    // initialize the ResultSet with a special call to fetchData() that creates the 
    // ResultSet but suppresses the actual server visit.
    if (isc.isAn.Array(this.data) && this.data.length == 0 && 
        this.dataSource && !this.saveLocally) 
    {
        this.fetchData(null, null, {_suppressFetch:true});
        this.data.setFullLength(0);
    }    

	// if reordering records from this list
    if (sourceWidget == this) {
    	// slide them into their new home, if no grouping is applied
        
        if (index != null && !this.isGrouped) this.data.slideList(dropRecords, index);
        
	} else { 

        var dataSource = this.getDataSource();
        var sourceDS = sourceWidget.getDataSource();
        
        // If we're bound to the same dataSource as the source widget and doing a move, apply
        // an update to the source nodes - by default, changing them to match the current 
        // filter criteria of this grid
        if (dataSource && dataSource == sourceDS && sourceWidget.dragDataAction == isc.Canvas.MOVE) {
            var wasAlreadyQueuing = isc.rpc.startQueue();
            for (var i = 0; i < dropRecords.length; i++) {
                var record = {};
                var pks = dataSource.getPrimaryKeyFieldNames();
                for (var j = 0; j < pks.length; j++) {
                    record[pks[j]] = dropRecords[i][pks[j]];
                }
                isc.addProperties(record, this.getDropValues(record, sourceDS, 
                                          targetRecord, index, sourceWidget));
                this.updateDataViaDataSource(record, sourceDS, null, sourceWidget);                          
            }
            if (!wasAlreadyQueuing) isc.rpc.sendQueue();
        } else {
    		if (!isc.isAn.Array(dropRecords)) dropRecords = [dropRecords];

    		// select the stuff that's being dropped
    		// (note: if selectionType == SINGLE we only select the first record)
            
           
            
            var selectRecords = true;
            // If we're dropping between 2 dataSources and the pkField doesn't exist
            // on the source dataSource, don't attempt to select records immediately as
            // they'll likely have no primary key yet meaning we can't perform
            // a selection immediately (this is likely to occur for 
            // primary keys generated by the server - for example 'sequence' type fields)
            if (sourceDS != null && dataSource != null) {
                var pkField = dataSource.getPrimaryKeyField();
                selectRecords = pkField && (sourceDS.getField(pkField.name) != null);
            }
            if (selectRecords) {
                if (this.selectionType == isc.Selection.MULTIPLE || 
                    this.selectionType == isc.Selection.SIMPLE) 
                {
                    this.selection.deselectAll();
                    this.selection.selectList(dropRecords);
                } else if (this.selectionType == isc.Selection.SINGLE) {
                    this.selection.selectSingle(dropRecords[0]);
                }
            }

            
            if (dataSource) {
                this._wasAlreadyQueuing = isc.rpc.startQueue();
                for (var i = 0; i < dropRecords.length; i++) {
                    // groups contain circular references which will hang at clone - skip
                    if (dropRecords[i]._isGroup) continue;
                    var record = {};
                    isc.addProperties(record, dropRecords[i]);
                    isc.addProperties(record, this.getDropValues(record, sourceDS, 
                                            targetRecord, index, sourceWidget));
                    if (dataSource != sourceDS) {
                        // If there is a foreign key relationship from the target DS to the 
                        // source DS, populate the foreignKey field on the record we're 
                        // dropping with the contents of the field the foreignKey points to.
                        var fks = dataSource.getForeignKeysByRelation(record, sourceDS);
                        var cannotRecat = false;
                        var pkFields = [];
                        if (sourceDS) pkFields = sourceDS.getPrimaryKeyFields();
                        isc.addProperties(record, fks);

                        // If we have explicitly defined titleFields and the target one is not 
                        // going to be populated, populate it with the value in the source one
                        if (dataSource.titleField && sourceDS && sourceDS.titleField && 
                                dataSource.titleField != sourceDS.titleField) {
                            var undef;
                            if (record[dataSource.titleField] === undef) {
                                record[dataSource.titleField] = record[sourceDS.titleField];
                            }
                        }
                    }
                                            
                    this._addIfNotDuplicate(record, sourceDS, sourceWidget, fks);
                }
            } else { // target grid does not have a DataSource
                // handle grouping
                if (this.isGrouped) {
                    // add to tree
                    for (var i = 0; i < dropRecords.length; i++) {
                        var record = {};
                        isc.addProperties(record, dropRecords[i]);
                        isc.addProperties(record, this.getDropValues(record, sourceDS, 
                                            targetRecord, index, sourceWidget));
                        if (!this._isDuplicateOnClient(record)) {
                            this._addRecordToGroup(record, true);
                            
                            // add to originalData
                            // Ignore the index in this case - it will refer to the position within
                            // the tree which doesn't map to a position within the original data
                            // array
                            this.originalData.add(record);
                        }
                    }
                    // add to originalData
                    //if (index != null) this.originalData.addListAt(dropRecords, index);
                    //else this.originalData.addList(dropRecords);
                   
                } else {
                    // If we've been passed an index respect it - this will happen if canReorderRecords
                    // is true
                    
                    for (var i = 0; i < dropRecords.length; i++) {
                        var record = {};
                        isc.addProperties(record, dropRecords[i]);
                        isc.addProperties(record, this.getDropValues(record, sourceDS, 
                                                targetRecord, index, sourceWidget));
                        if (index != null) {
                        
                            // Although _addIfNotDuplicate is an asynchronous method, we know
                            // that this particular invocation of it will be synchronous (because
                            // there's no DataSource and thus no server contact), so if it returns
                            // false, we know authoritatively that no data was added and thus 
                            // index should not be incremented
                            if (this._addIfNotDuplicate(record, null, sourceWidget, 
                                                                null, index)) {
                                // Because we're adding one-at-a-time, increment the index - otherwise,
                                // the effect will be to insert into the grid in reverse order
                                index++;
                            }
                        } else {
                            this._addIfNotDuplicate(record, null, sourceWidget);
                        }
                    }  
                }
        		
            }
        }
	}
	
	// unsort if we were sorted and records were just placed at an explicit position
	if (this.canReorderRecords && this._getSortFieldNum() != null) {
		this.unsort();
	}

    // If this._transferDuplicateQuery is undefined or 0, we didn't need to fire any server 
    // queries, so we can call transferDragData to complete the transfer and send the queue 
    // of updates to the server 
    if (!this._transferDuplicateQuery) {
        isc.Log.logDebug("Invoking transferDragData from inside transferRecords - no server " +
                         "queries needed?", "dragDrop");
        sourceWidget.transferDragData(this._transferExceptionList, this);
        if (dataSource) {
            // send the queue unless we didn't initiate queuing
            if (!this._wasAlreadyQueuing) isc.rpc.sendQueue();
        }
    }
    
    this._transferringRecords = false;
    
},

// Store the details of a transfer in the _dropRecords queue on this component.  We work via
// a queue so that, if we get a transfer request when one is already running (this can happen
// because server-side duplicate checking makes the process asynchronous), we can postpone it
// and run it later as part of the first transfer's cleanup.
_storeTransferState : function (impl, dropRecords, targetRecord, index, sourceWidget, callback) {
    if (!isc.isAn.Array(this._dropRecords)) this._dropRecords = [];

    // If the transfer must wait its turn, add it to the end of the queue.  transferDragData()
    // will re-invoke anything put on the queue when it is its turn
    if (this._transferDuplicateQuery && this._transferDuplicateQuery != 0) {
        isc.logWarn("transferRecords was invoked but the prior transfer is not yet complete - \
                     the transfer will be queued up to run after the current transfer");
        this._dropRecords.add({
            implementation: impl,
            dropRecords: dropRecords,
            targetRecord: targetRecord,
            index: index,
            sourceWidget: sourceWidget,
            callback: callback
        });
        return false;
    }

    // If there's nothing in the way, it's this transfer's turn, so add it to the front of the
    // queue for later reading in transferDragData()
    this._dropRecords.addAt({
        implementation: impl,
        dropRecords: dropRecords,
        targetRecord: targetRecord,
        index: index,
        sourceWidget: sourceWidget,
        callback: callback
    }, 0);

    this._transferringRecords = true;
    this._transferExceptionList = [];
    this._transferDuplicateQuery = 0;
    
    return true;
},


updateDataViaDataSource : function(record, ds, updateProperties, sourceWidget) {

    var _listGrid = this;
    
    // Use updateOperation if applicable
    if (this.updateOperation) {
        if (updateProperties == null) updateProperties = {};
        isc.addProperties(updateProperties, {operationId: this.updateOperation});
    }
    
    if (!this.preventDuplicates) {
        if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
        sourceWidget._updatesSent++;
        ds.updateData(record, function (dsResponse, data, dsRequest) {
            sourceWidget._updateComplete(dsResponse, data, dsRequest);
        }, updateProperties); 
        return;
    }
    
    var criteria = this.getCleanRecordData(record);
    
    if (this.data.find(criteria, null, Array.DATETIME_VALUES)) {
        
        isc.Log.logDebug("Found client-side duplicate, skipping update for '" + 
                     record[isc.firstKey(record)] + "'", "dragDrop"); 
        this._transferExceptionList.add(this.getCleanRecordData(record));
    } else {
        // If we have a full cache, we can go ahead and update now
        if (this.data.allMatchingRowsCached()) {
        if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
            sourceWidget._updatesSent++;
            ds.updateData(record, function (dsResponse, data, dsRequest) {
                sourceWidget._updateComplete(dsResponse, data, dsRequest);
            }, updateProperties); 
        } else { 
            // Cache is incomplete, we'll have to ask the server
            isc.Log.logDebug("Incrementing dup query count: was " + 
                             _listGrid._transferDuplicateQuery, "dragDrop");
            this._transferDuplicateQuery++;
            ds.fetchData(criteria, 
                function (dsResponse, data, dsRequest) {
                    if (data && data.length > 0) {
                        
                        isc.Log.logDebug("Found server-side duplicate, skipping update for '" + 
                                     record[isc.firstKey(record)] + "'", "dragDrop"); 
                        _listGrid._transferExceptionList.add(_listGrid.getCleanRecordData(data[0]));
                    } else {
                        if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
                        sourceWidget._updatesSent++;
                        ds.updateData(record, function (dsResponse, data, dsRequest) {
                            sourceWidget._updateComplete(dsResponse, data, dsRequest);
                        }, updateProperties); 
                    }
                    // If there are no further duplicate queries pending, we can finish up this
                    // transfer and send the queue of updates to the server
                    isc.Log.logDebug("Decrementing dup query count: was " + 
                                     _listGrid._transferDuplicateQuery, "dragDrop");
                    if (--_listGrid._transferDuplicateQuery == 0 && 
                        !_listGrid._transferringRecords) {
                        if (sourceWidget.dragDataAction == isc.Canvas.MOVE) {
                            isc.Log.logDebug("Invoking transferDragData from inside callback", "dragDrop");
                            sourceWidget.transferDragData(_listGrid._transferExceptionList, _listGrid);
                            delete _listGrid._transferExceptionList;
                            // send the queue unless we didn't initiate queuing
                            if (!_listGrid._wasAlreadyQueuing) isc.rpc.sendQueue();
                        }
                    }
                },
                {sendNoQueue: true});
        }
    }

},

//> IDocument
// Helper to add a record if it is not a duplicate, or if duplicates are allowed.
// There are four distinct different types of dup-checking we need to do:
// 1. Source DS is the same as target DS, and it has a primary key
// 2. Source DS is the same as target DS, and it does not have a primary key
// 3. Source and target DS are different, and there is a foreignKey relationship from the
//    target to the source
// 4. Source and target DS are different with no FK relationship, or one or the other of the 
//    grids is not bound to a DS at all
//
// For case (1), if at least one of the PK fields is a sequence, we can allow the update.  If 
// we have no sequence field in the keys, we need to perform a check on PKs and forbid the
// add if there is a duplicate.  On the face of it, this second check is unnecessary - if we 
// have no sequence field, and we're drag/dropping an existing record, it must be a duplicate.
// However, the application code may have overridden drop() and changed the dropped 
// record so that it has unique keys - eg, popped up a dialog asking for a new product code.
//
// For cases (2) and (4), we compare every field in the record (minus properties that ListGrid 
// might have scribbled on, such as _selection_*).  If we get an exact match on every field, 
// that's a duplicate; otherwise, it's OK.  We may have to visit the server for this check.
//
// For case (3), we check if the target list, filtered as it currently is, already contains a 
// record with the same value(s) in its foreignKey field(s) as the record we're proposing to add.
// We may have to visit the server for this check.
//
// Note that this function will work for both ListGrids and TreeGrids; (or indeed for any component
// whose data model is List, Tree, ResultSet or ResultTree); the "folder" parameter
// is only used if the underlying dataset is a Tree or ResultTree.
//< IDocument
_addIfNotDuplicate : function (record, sourceDS, sourceWidget, foreignKeys, index, folder) {
    var ds = this.getDataSource(), 
        pks,
        _listGrid = this,
        addProps = {};
        
    if (this.addOperation) {
        isc.addProperties(addProps, {operationId: this.addOperation});
    }
        
    if (ds) pks = ds.getPrimaryKeyFields();

    // If the source and target datasource are the same, and we have a PK, and at least one of
    // the PK fields is a sequence, we don't need to check for duplicates because we can assume 
    // the server arranges for a unique value as part of the create process.  This is the only 
    // circumstance in which we have a dataSource but don't need to check the server.  Note that
    // this special case code is duplicated in _isDuplicateOnClient() because that method is 
    // called from other places.
    //
    // Note that we do this special check even before the simple check on this.preventDuplicates
    // because we need special key handling in this circumstance, even if the duplicate check 
    // was going to pass anyway because we haven't set preventDuplicates.
    if (ds && ds == sourceDS) {
        var proceed;
        if (pks && isc.firstKey(pks) != null) {
            for (var field in pks) {
                if (pks[field].type == "sequence") {
                    proceed = true;
                    break;
                }
            }
        }
        
        if (proceed) {
            // Clear the primary key field(s) before calling to the server, otherwise the add 
            // works but we get sent back the original keys and it confuses the client-side
            var undef;
            for (var field in pks) {
                record[field] = undef;
            }
            
            if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
            sourceWidget._updatesSent++;
            ds.addData(record, function (dsResponse, data, dsRequest) { 
                sourceWidget._updateComplete(dsResponse, data, dsRequest); 
            }, addProps);
            return true;
        }
    }
    
    if (!this.preventDuplicates) {
        if (ds) {
            if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
            sourceWidget._updatesSent++;
            ds.addData(record, function (dsResponse, data, dsRequest) { 
                sourceWidget._updateComplete(dsResponse, data, dsRequest); 
            }, addProps);
        } else {
            if (isc.Tree && isc.isA.Tree(this.data)) {
                this.data.add(record, folder, index);
            } else {
                if (index != null) this.data.addAt(record, index);
                else this.data.add(record);
            }
        }
        return true;
    }        
 
    if (this._isDuplicateOnClient(record, sourceDS, foreignKeys)) {
        if (this.duplicateDragMessage != null) isc.warn(this.duplicateDragMessage);
        isc.Log.logDebug("Found client-side duplicate, adding '" + 
                         record[isc.firstKey(record)] + 
                         "' to exception list", "dragDrop");
        this._transferExceptionList.add(this.getCleanRecordData(record));
        return false;
    } else {
        if (!ds) {
            // Simplest case - no DS and no dup on client-side, so go ahead and add the record to
            // the underlying data model
            if (isc.Tree && isc.isA.Tree(this.data)) {
                this.data.add(record, folder, index);
                return true;
            } else {
                if (index != null) this.data.addAt(record, index);
                else this.data.add(record);
                return true;
            }
        } else { 
            if (!isc.ResultSet || !isc.isA.ResultSet(this.data)) {
                
                if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
                sourceWidget._updatesSent++;
                ds.addData(record, function (dsResponse, data, dsRequest) { 
                    sourceWidget._updateComplete(dsResponse, data, dsRequest); 
                }, addProps);
                return true
            } else {
                // If we're dropping in a grid bound to a DS different from the source DS
                // and the two are related by foreignKey(s) (ie, the fks object is non-null), this is a 
                // different scenario from a normal copy because it's enough to to know that the dropped 
                // item doesn't exist in the current filtered view of this ListGrid.  So, if we have a 
                // complete cache for the current filter criteria, we don't need to query the server.
                // This is not true for other copying scenarios, where we need a complete, unfiltered
                // cache to avoid the server query.
                if (this.data.allRowsCached() || 
                    (foreignKeys && isc.firstKey(foreignKeys) && this.data.allMatchingRowsCached())) {
                    if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
                    sourceWidget._updatesSent++;
                    ds.addData(record, function (dsResponse, data, dsRequest) { 
                        sourceWidget._updateComplete(dsResponse, data, dsRequest); 
                    }, addProps);
                    return true;
                }
                // We have a dataSource and client-side search failed to find a duplicate.  We need a 
                // server turnaround to know for sure whether we're proposing to add a duplicate
                if (ds && sourceDS == ds) {
                    if (pks && isc.firstKey(pks) != null) {
                        // Source DS and target DS are the same and we have a primary key
                        var criteria = isc.applyMask(record, pks);
                    } else {
                        // Source DS and target DS are the same and we have no primary key
                        criteria = this.getCleanRecordData(record);
                    }
                } else if (foreignKeys && isc.firstKey(foreignKeys)) {
                    // Source DS and target DS are different but related via a foreign key
                    criteria = isc.addProperties({}, this.data.getCriteria());
                    isc.addProperties(criteria, foreignKeys);
                } else {
                    // Source DS and target DS are different and unrelated
                    criteria = this.getCleanRecordData(record);
                }
                isc.Log.logDebug("Incrementing dup query count: was " + 
                                 _listGrid._transferDuplicateQuery, "dragDrop");
                this._transferDuplicateQuery++;
                ds.fetchData(criteria, function (dsResponse, data, dsRequest) {
                    if (data && data.length > 0) {

                        if (_listGrid.duplicateDragMessage != null) isc.warn(_listGrid.duplicateDragMessage);
                        isc.Log.logDebug("Found server-side duplicate, adding '" + 
                                     record[isc.firstKey(record)] + 
                                     "' to exception list", "dragDrop");
                        _listGrid._transferExceptionList.add(_listGrid.getCleanRecordData(record));
                    } else {
                        if (!sourceWidget._updatesSent) sourceWidget._updatesSent = 0;
                        sourceWidget._updatesSent++;
                        ds.addData(record, function (dsResponse, data, dsRequest) { 
                            sourceWidget._updateComplete(dsResponse, data, dsRequest); 
                        }, addProps);
                    }
                    // If there are no further duplicate queries pending, we know exactly which
                    // attempted transfers were duplicates (if any), so we're in a position to 
                    // remove the source records if this was a MOVE, and to send the queue of 
                    // updates to the server
                    isc.Log.logDebug("Decrementing dup query count: was " + 
                                     _listGrid._transferDuplicateQuery, "dragDrop");
                    if (--_listGrid._transferDuplicateQuery == 0 && 
                        !_listGrid._transferringRecords) {
                        if (sourceWidget.dragDataAction == isc.Canvas.MOVE) {
                            isc.Log.logDebug("Invoking transferDragData from inside callback", "dragDrop");
                            sourceWidget.transferDragData(_listGrid._transferExceptionList, _listGrid);
                            delete _listGrid._transferExceptionList;
                            // send the queue unless we didn't initiate queuing
                            if (!_listGrid._wasAlreadyQueuing) isc.rpc.sendQueue();
                        }
                    }
                    
                    },
                    {sendNoQueue: true});
            }
        }
    }
},

// Returns true if the passed-in record is a duplicate - according to the rules described in the 
// discussion above _addIfNotDuplicate() - in the currently-known client data.  Handles both
// dataSource and non-dataSource cases.  Note that this function can return false even if the 
// record is a duplicate - for example, if this.preventDuplicates is false.
_isDuplicateOnClient : function (record, sourceDS, foreignKeys) {
    var ds = this.getDataSource(), 
        pks;
    
    if (!this.preventDuplicates) return false;
        
    if (ds) pks = ds.getPrimaryKeyFields();

    // If the source and target datasource are the same, and we have a PK, and at least one of
    // the PK fields is a sequence, we don't need to check for duplicates because we can assume 
    // the server arranges for a unique value as part of the create process.  Note that
    // this logic is duplicated from _addIfNotDuplicate() because this method is called from 
    // other places.
    if (ds && ds == sourceDS) {
        if (pks && isc.firstKey(pks) != null) {
            for (var field in pks) {
                if (pks[field].type == "sequence") {
                    return false;
                }
            }
        }
    }

    if (!ds) {
        // No DS - a duplicate is one that is identical in every property
        var criteria = this.getCleanRecordData(record);
    } else if (ds && sourceDS == ds) {
        if (pks && isc.firstKey(pks) != null) {
            // Source DS and target DS are the same and we have a primary key - compare PK fields
            criteria = isc.applyMask(record, pks);
        } else {
            // Source DS and target DS are the same and we have no primary key - compare all fields
            criteria = this.getCleanRecordData(record);
        }
        // no foreignKeys is supplied as {} rather than null, hence the firstKey check
    } else if (foreignKeys && isc.firstKey(foreignKeys)) {
        // Source DS and target DS are different but related via a foreign key - check for a record
        // that matches for the combination of the foreign key values and current filter criteria
        criteria = {};
        var tempCrit = this.data.getCriteria();
        if (!ds.isAdvancedCriteria(tempCrit)) {
            var context = this.data.context;
            if (context && (context.textMatchStyle == null || context.textMatchStyle == "exact")) {
                isc.addProperties(criteria, tempCrit);
            }
        }
        isc.addProperties(criteria, foreignKeys);
    } else {
        // Source DS and target DS are different and unrelated
        criteria = this.getCleanRecordData(record);
    }

    if (this.data.find(criteria, null, Array.DATETIME_VALUES)) return true;
    else return false;
},

getCleanRecordData : function (record) {
    if (isc.Tree && isc.isA.Tree(this.data)) {
        return this.data.getCleanNodeData(record, false);
    }
    var clean = {};
    for (var key in record) {
        // These are just the properties that LG scribbles onto its records. If you have others, it's 
        // safe to exclude them in-place below, or just override this method.
        if (key.startsWith("_selection_")) continue;
        
        clean[key] = record[key];
    }
    
    return clean;
},

_updateComplete : function (dsResponse, data, dsRequest) {
    if (this._updatesSent) {
        isc.Log.logDebug("Decrementing update count - was " + this._updatesSent, "dragDrop");
        this._updatesSent -= 1;
    }
    if (!this._updatesSent) {
        isc.Log.logDebug("All updates complete, calling dragComplete()", "dragDrop");
        if (isc.isA.Function(this.dragComplete)) this.dragComplete();
    }
},

//> @method dataBoundComponent.getDropValues()
// Returns the "drop values" to apply to a record dropped on this component prior to update.  Only
// applicable to databound components - see +link{dropValues} for more details.  If multiple records 
// are being dropped, this method is called for each of them in turn.
// <P>
// The default implementation of this method returns the following:
// <UL>
// <LI>Nothing, if +link{addDropValues} is false</LI>
// <LI>dropValues, if that property is set.  If the component's criteria object is applicable (as explained
// in the next item), it is merged into dropValues, with properties in dropValues taking precedence.</LI>
// <LI>The component's criteria object, if the most recent textMatchStyle for the component was "exact" 
//     and it is simple criteria (ie, not an AdvancedCriteria object)</LI>
// <LI>Otherwise nothing</LI>
// </UL>
// <P>
// You can override this method if you need more complex setting of drop values than can be 
// provided by simply supplying a dropValues object.
// 
// @param record (Record) record being dropped
// @param sourceDS (DataSource) dataSource the record being dropped is bound to
// @param targetRecord (Record) record being dropped on
// @param index (int) index of record being dropped on
// @param sourceWidget (Canvas) widget where dragging began
// 
// @visibility external
//<
getDropValues : function (record, sourceDS, targetRecord, index, sourceWidget, droppedRecords) {
    if (!this.addDropValues) return;
    
    var criteria = {},
        recordDS;
    
    // At the moment, only trees can contain records (nodes) that have their own dataSource
    if (this.data && this.data.getNodeDataSource) {
        recordDS = this.data.getNodeDataSource(targetRecord);
    }
    // recordDS may be null at this point:
    // - we may have never been populated with data (no filter)
    // - getNodeDataSource returns null if you pass the root node in - this appears to be
    //    intentional, so we'll cope with it here rather than risk breaking something
    if (!recordDS) {
        recordDS = this.getDataSource();
    }
    
    // Passing the recordDS parameter is only applicable to trees, but does no harm for lists
    if (this.data && this.data.getCriteria) criteria = this.data.getCriteria(recordDS);
   
    var merged;
    // If we have an empty object we know it's not 'advanced' criteria
    if (isc.isAn.emptyObject(criteria) || !recordDS.isAdvancedCriteria(criteria)) {
        var context = this.data.context;
        if (context && (context.textMatchStyle == null || context.textMatchStyle == "exact")) {
            merged = isc.addProperties({}, criteria);
            if (this.dropValues) {
                merged = isc.addProperties(merged, this.dropValues);
            }    
            return merged;
        }
    }
    
    return this.dropValues;   
},

//>	@method	dataBoundComponent.transferDragData()	(A)
//
// During a drag-and-drop interaction, this method is called to transfer a set of records that
// were dropped onto some other component.  This method is called after the set of records has
// been copied to the other component.  Whether or not this component's data is modified is 
// determined by the value of +link{dataBoundComponent.dragDataAction}.
// <P>
// With a <code>dragDataAction</code> of "move", a databound component will issue "remove"
// dsRequests against its DataSource to actually remove the data, via
// +link{dataSource.removeData()}.
//
// @return		(Array)		Array of objects that were dragged out of this ListGrid.
// 
// 
// @see DataBoundComponent.getDragData()
// @see ListGrid.willAcceptDrop();
//
// @visibility external
//<

transferDragData : function (transferExceptionList, targetWidget) {
    var selection = [], 
        workSelection,
        callback,
        data;

    if (targetWidget && targetWidget._dropRecords) {
        data = targetWidget._dropRecords.shift();
        workSelection = data.dropRecords;
        callback = data.callback;
    } else {
        workSelection = this.getDragData();
        data = {};
    }
    
    if (workSelection == null) workSelection = [];
    
    // Filter the entries in the exception list out of the selection - we're not going to do
    // anything with them whatever the circumstances
    for (var i = 0; i < workSelection.length; i++) {
        var clean = this.getCleanRecordData(workSelection[i]);
        if (!transferExceptionList || !transferExceptionList.find(clean, null, Array.DATETIME_VALUES)) {
            // Include the dirty version of the record - it will likely have _selection_
            // scribbles on it that are required for an exact match lookup in the underlying
            // dataset
            selection.add(workSelection[i]);
        }
    }
    
	if (this.dragDataAction == isc.Canvas.MOVE && targetWidget != this && !data.noRemove) {
        
        if (this.dataSource) {
        
            // In the special case of a MOVE between two components bound to the same dataSource,
            // transferRecords() handles the transfer with update operations rather than removing
            // and adding. So in that case, we don't want to remove anything from the source 
            // component (since it's databound, it will be sync'd automatically)
            var targetDS = targetWidget.getDataSource();
            if (targetDS != this.getDataSource()) {
                var wasAlreadyQueuing = isc.rpc.startQueue();
                for (var i = 0; i < selection.length; i++) {
                    this.getDataSource().removeData(selection[i]);
                }
                // send the queue unless we didn't initiate queuing
                if (!wasAlreadyQueuing) isc.rpc.sendQueue();
            }
        } else if (this.data) {
            for (var i = 0; i < selection.length; i++) {
                this.data.remove(selection[i]);
                if (this.isGrouped) {
                    this.originalData.remove(selection[i]);
                }
            }
        }
        // de-select the selection in the context of this list
        // so if it is dragged *back* into the list, it won't already be selected!
        if (this.selection && this.selection.deselectList) {
            this.selection.deselectList(workSelection);
        }
    }
    
    if (targetWidget) {
        // Invoke the user event, if one is implemented
        if (isc.isA.Function(targetWidget.dropComplete)) targetWidget.dropComplete(selection);
        
        // Fire the callback, if one was provided
        if (callback) {
            this.fireCallback(callback, "records", [selection]);
        }
        
        // If the target widget's _dropRecords member still has entries, we've got drag and drop
        // transactions queuing up for it, so schedule the next one before ending.
        if (targetWidget._dropRecords && targetWidget._dropRecords.length > 0) {
            var next = targetWidget._dropRecords.shift();
            isc.Timer.setTimeout(function () {
                if (next.implementation == "transferNodes") {
                    targetWidget.transferNodes(next.dropRecords, next.targetRecord, next.index, 
                                               next.sourceWidget, next.callback);
                } else {
                    targetWidget.transferRecords(next.dropRecords, next.targetRecord, next.index, 
                                                 next.sourceWidget, next.callback);
                }
            }, 0);
        }
    }    
    
    
	return selection;
},

//>	@method	dataBoundComponent.getDragData()	(A)
//
// During a drag-and-drop interaction, this method returns the set of records being dragged out
// of the component.  In the default implementation, this is the list of currently selected
// records.<p>
// 
// This method is consulted by +link{ListGrid.willAcceptDrop()}.

// @param source (DataBoundComponent) source component from which the records will be transferred
// 
// @group	dragging, data
//
// @return	(Array of Record)		Array of +link{Record}s that are currently selected.
// 
// @visibility external
//<
getDragData : function () {
    var selection = (this.selection && this.selection.getSelection) ?
                                        this.selection.getSelection() : null;
    
    return selection;
},

//>	@method	dataBoundComponent.cloneDragData()	(A)
//
// During a drag-and-drop interaction, this method returns the set of records being dragged out
// of the component.  It differs from +link{dataBoundComponent.getDragData()} in that some extra
// preparation is done to the set of records, making them suitable for passing to the method 
// that actually carries out the transfer (+link{dataBoundComponent.transferRecords()}.  Note that,
// despite the name, records are not always cloned - sometimes they new, cleaned versions of the
// selected records and sometimes (if we're doing a move rather than a copy) we return the 
// selected records themselves.
// 
// This method is called by functions that commence the actual record transfer process:  
// +link{dataBoundComponent.transferSelectedData() and the drop() methods of record-based,
// databound classes like +link{class:ListGrid}

// @param source (DataBoundComponent) source component from which the records will be transferred
// 
// @group	dragging, data
//
// @return	(Array of Record)		Array of +link{Record}s that are currently selected.
// 
// @see DataBoundComponent.getDragData
// @visibility internal
//<
cloneDragData : function () {
    var selection = this._selectionAtDragStart;
    if (selection == null) { 
        selection = (this.selection && this.selection.getSelection) ?
                                       this.selection.getSelection() : null;
    }
    this._selectionAtDragStart = null;
    
    var copyData = this.dragDataAction == isc.Canvas.COPY || 
                   this.dragDataAction == isc.Canvas.CLONE;

	if (copyData && selection) {
        // clear any embedded components before cloning
        for (var i = 0; i < selection.length; i++) {
            var record = selection[i];
            if (record._embeddedComponents != null) {
                for (var ii = 0; ii <record._embeddedComponents.length; ii++) {
                    this.removeEmbeddedComponent(record, record._embeddedComponents[ii]);
                } 
            }
            delete record._embeddedComponents;
        }
        
        if (isc.isA.Tree(this.data)) {
            selection = this.data.getCleanNodeData(selection);
        } else {
            if (isc.isAn.Array(selection)) {
                selection = isc.shallowClone(selection);
            } else {
                selection = isc.addProperties({}, selection);
            }
        }
    }
    
    return selection;
},

//>	@attr	dataBoundComponent.dragDataAction		(DragDataAction : isc.Canvas.MOVE : IRW)
//          Indicates what to do with data dragged into another DataBoundComponent. See
//          DragDataAction type for details.
//      @visibility external
//      @group  dragging
//      @example gridsDragMove
//      @example gridsDragCopy
//<

dragDataAction: isc.Canvas.MOVE,

//> @method dataBoundComponent.transferSelectedData()
// Simulates a drag / drop type transfer of the selected records in some other component to this
// component, without requiring any user interaction.  This method acts on the dropped records 
// exactly as if they had been dropped in an actual drag / drop interaction, including any 
// special databound behavior invoked by calling
// +link{DataBoundComponent.getDropValues,getDropValues} for each dropped record.
// <P>
// To transfer <b>all</b> data in, for example, a +link{ListGrid}, call grid.selection.selectAll() first.
// <P>
// Note that drag/drop type transfers of records between components are asynchronous operations:
// SmartClient may need to perform server turnarounds to establish whether dropped records 
// already exist in the target component.  Therefore, it is possible to issue a call to 
// transferSelectedData() and/or the +link{listGrid.drop(),drop()} method of a databound 
// component whilst a transfer is still active.  When this happens, SmartClient adds the 
// second and subsequent transfer requests to a queue and runs them one after the other.  If 
// you want to be notified when a transfer process has actually completed, either provide a 
// callback to this method or implement +link{dataBoundComponent.dropComplete()}.
// <P>
// See the +link{group:dragging} documentation for an overview of list grid drag/drop data
// transfer.
// 
// @param source (DataBoundComponent) source component from which the records will be transferred
// @param [index] (integer) target index (drop position) of the rows within this grid.
// @param [callback] (Callback) optional callback to be fired when the transfer process has 
//                       completed.  The callback will be passed a single parameter "records",
//                       the list of records actually transferred to this component.
// @group dragdrop
// @example dragListMove
// @visibility external
//<
transferSelectedData : function (source, index, callback) {
    
    if (!this.isValidTransferSource(source)) {
        if (callback) this.fireCallback(callback);
        return;
    }
            
    // don't check willAcceptDrop() this is essentially a parallel mechanism, so the developer 
    // shouldn't have to set that property directly.
    if (index != null) index = Math.min(index, this.data.getLength());
        
    // Call cloneDragData to pull the records out of our dataset
    
    
    

    var dropRecords = source.cloneDragData();
    var targetRecord;
    if (index != null) targetRecord = this.data.get(index);
    
    this.transferRecords(dropRecords, targetRecord, index, source, callback);
},

// helper for transferSelectedData()
isValidTransferSource : function (source) {
    if (!source || !source.transferDragData) {
        this.logWarn("transferSelectedData(): " + (source ? "Invalid " : "No ") + 
                     "source widget passed in - " + (source || "") + 
                     " taking no action.");
        return false;
    }
    if (source == this) {
        this.logWarn("transferSelectedData(): target parameter contains a pointer back to this grid - ignoring");
        return false;
    }
    return true;
},

// -----------------------------------------------------------------------------------
// Drag tracker and drag line

//>@method  dataBoundComponent.setDragTracker()
// Sets the custom tracker HTML to display next to the mouse when the user initiates a drag
// operation on this component. Default implementation will examine +link{listGrid.dragTrackerMode}
// and set the custom drag tracker to display the appropriate HTML based on the selected record.
// <br>
// To display custom drag tracker HTML, this method may be overridden - call 
// +link{EventHandler.setDragTracker()} to actually update the drag tracker HTML.
// @return (boolean) returns false by default to suppress 'setDragTracker' on any ancestors
//                   of this component.
// @group dragTracker
// @visibility external
//<
setDragTracker : function () {
    var EH = isc.EH, dragTrackerMode = this.dragTrackerMode;

    if (dragTrackerMode == "none" || EH.dragOperation == EH.DRAG_SCROLL) {
        // we can't just not call setDragTracker(), or the dragTracker will be set to the
        // default canvas tracker image.
        EH.setDragTracker("");
        return false;
    } else if (dragTrackerMode == "icon") {
        var selection = this.getSelection(),
            icon = this.getDragTrackerIcon(selection);
            
            EH.setDragTracker(this.imgHTML(icon), null,null,null,null, this.getDragTrackerProperties());
            return false;
    } else {
        
        var record = this.getSelectedRecord(),
            rowNum = record && this.data ? this.data.indexOf(record) : -1;
        
        if (dragTrackerMode == "title") {
            var title = this.getDragTrackerTitle(record, rowNum);
            EH.setDragTracker(title,  null,null,null,null, this.getDragTrackerProperties());
            return false;   
        } else if (dragTrackerMode == "record") {
            var rowHTML = this.body.getTableHTML([0, this.fields.length-1], rowNum, rowNum+1);
            //this.logWarn("row html:"+ rowHTML);
            EH.setDragTracker(rowHTML,  null,null,null,null, this.getDragTrackerProperties());
            return false;
        }            
    }
    // If dragTrackerMode is unrecognized, let the normal tracker show up.
},	

//> @method dataBoundComponent.getDragTrackerProperties()
// Return properties to apply to the drag tracker when the user drags some record.<br>
// Default implementation returns an object with attribute <code>opacity</code> set 
// to <code>50</code> if +link{listGrid.dragTrackerMode} is set to <code>"record"</code>, 
// otherwise returns null.
// @group dragTracker
// @return (object | null) Properties apply to the drag tracker 
//<
getDragTrackerProperties : function () {
    var props = isc.addProperties({}, this.dragTrackerProperties);
    props.styleName = this.dragTrackerStyle;
    if (this.dragTrackerMode == "record") props.opacity = 50;
    return props;
},

//> @attr dataBoundComponent.dragTrackerStyle (CSSStyleName : "gridDragTracker" : IRW)
// CSS Style to apply to the drag tracker when dragging occurs on this component.
// @visibility external
//<
dragTrackerStyle:"gridDragTracker",

//>	@method	dataBoundComponent.makeDragLine()	(A)
//		@group	dragging, drawing
//			make the dragLine 
//		@return	(boolean)	false if this._dragLine already exists
//<
makeDragLine : function () {
	if (this._dragLine) return false;
	
	// create the dragLine and move it to the front
	
    var dragLine = {
        ID:this.getID()+"_dragLine",
		width:2,
		height:2,
		overflow:isc.Canvas.HIDDEN,
        visibility:isc.Canvas.HIDDEN,
        isMouseTransparent:true, // to prevent dragline occlusion of drop events
        dropTarget:this, // delegate dropTarget
		redrawOnResize:false,
        styleName:"dragLine"
	};
    //>!BackCompat 2005.01.01 XXX old skin files didn't define a drag line style, so ensure the
    // line shows up.
    if (this.ns.Element.getStyleEdges(dragLine.styleName) == null) {
        dragLine.backgroundColor = "black";
    } //<!BackCompat
    isc.addProperties(dragLine, this.dragLineDefaults, this.dragLineProperties);
	this._dragLine = this.ns.Canvas.create(dragLine);
	
	return true;
},

//>	@method	dataBoundComponent.hideDragLine()	(A)
//		@group	dragging, drawing
//			hide the dragLine
//<
hideDragLine : function () {
	if (this._dragLine) this._dragLine.hide();
},

// Properties related to panelHeader Actions
canExport: true,
canPrint: true,

panelControls: ["action:edit", "action:editNew", "action:sort", "action:export", "action:print"],

dbcProperties: ["autoFetchData", "autoFetchTextMatchStyle", "autoFetchAsFilter", "dataSource"],

// Core facility to configure one DBC from another (initially for use in MultiView)
configureFrom : function (existingDBC) {
    var props = this.dbcProperties;

    for (var i=0; i<props.length;i++) {
        this[props[i]] = existingDBC[props[i]];
        if (props[i] == "dataSource") {
            var fetchData = this.autoFetchData;
            this.autoFetchData = false;
            this.setDataSource(isc.DS.getDataSource(this.dataSource));
            this.autoFetchData = fetchData;
        }
    }

    
    this.setCriteria(existingDBC.getCriteria());
    this.setData(existingDBC.getData());
},

// Formula/Summary Builders
// -----------------------------------------------------------------------------------

//>	@attr dataBoundComponent.badFormulaResultValue		(String : "." : IRW)
// If the result of a formula evaluation is invalid (specifically, if isNaN(result)==true),
// badFormulaResultValue is displayed instead.  The default value is ".".
//
// @group formulaFields
// @visibility external
//<
badFormulaResultValue: ".",

//>	@attr dataBoundComponent.missingSummaryFieldValue		(String : "-" : IRW)
// If a summary format string contains an invalid field reference, replace the reference
// with the missingSummaryFieldValue. The default value is "-".
//
// @group summaryFields
// @visibility external
//<
missingSummaryFieldValue: "-",

//> @attr dataBoundComponent.canAddFormulaFields (boolean : false : IRW)
// Adds an item to the header context menu allowing users to launch a dialog to define a new
// field based on values present in other fields, using the +link{FormulaBuilder}.
// <P>
// User-added formula fields can be persisted via +link{listGrid.getFieldState()} and 
// +link{listGrid.setFieldState()}.
// 
// @group formulaFields
// @visibility external
//<
canAddFormulaFields:false,

//> @attr dataBoundComponent.addFormulaFieldText (String : "Add formula column..." : IRW)
// Text for a menu item allowing users to add a formula field
//
// @group i18nMessages
// @visibility external
//<
addFormulaFieldText: "Add formula column...",

//> @method dataBoundComponent.addFormulaField
// Convenience method to display a +link{FormulaBuilder} to create a new Formula Field.  This 
// is equivalent to calling +link{dataBoundComponent.editFormulaField, editFormulaField()} with 
// no parameter.
//
// @group formulaFields
// @visibility external
//<
addFormulaField : function () {
    this.editFormulaField();
},

//> @attr dataBoundComponent.editFormulaFieldText (String : "Edit formula..." : IRW)
// Text for a menu item allowing users to edit a formula field
//
// @group i18nMessages
// @visibility external
//<
editFormulaFieldText: "Edit formula...",

//> @attr dataBoundComponent.removeFormulaFieldText (String: "Remove formula" : IRW)
// Text for a menu item allowing users to remove a formula field
//
// @group i18nMessages
// @visibility external
//<
removeFormulaFieldText: "Remove formula",

//> @method dataBoundComponent.editFormulaField
// Method to display a +link{FormulaBuilder} to edit a formula Field.  If the function is called
// without a parameter, a new field will be created when the formula is saved.
//
// @param	field	   (Field)	Field to edit or null to add a new formula field
// @group formulaFields
// @visibility external
//<
editFormulaField : function (field) {
    // return if FormulaBuilder isn't available
    if (isc.FormulaBuilder == null) return;

    var component = this,
        editMode = !field ? false : true;

    if (!editMode) {
        // new field - gen a unique field-name in the format formulaFieldxxx
        field = { name: component.getUniqueFieldName("formulaField"), title: "New Field",
            width: "50", canFilter: false, canExport: false, canSortClientOnly: true};
    }

    this._formulaEditor = isc.Window.create({ title: "Formula Editor [" + field.title + "]",
        showMinimizeButton: false, showMaximizeButton: false,
        isModal: true, 
        showModalMask:true, 
        autoSize: true,
        autoCenter: true,
        autoDraw: true,
        headerIconProperties: { padding: 1,
            src: "[SKINIMG]ListGrid/formula_menuItem.png"
        },
        
        closeClick: function () {
            this.items.get(0).completeEditing(true);
            return this.Super('closeClick', arguments);
        },

        items: [
            isc.FormulaBuilder.create({ width: 300, 
                component: component, dataSource: component.getDataSource(), 
                editMode: editMode, field: field,
                mathFunctions: isc.MathFunction.getDefaultFunctionNames(),
                fireOnClose: function(){
                    component.userFieldCallback(this);
                }
            }, this.formulaBuilderProperties)
        ]
    }, this.formulaBuilderProperties);
},

//> @method dataBoundComponent.getFormulaFieldValue()
// Get the computed value of a +link{canAddFormulaFields,formula field}.
// @param field (Field) field that has a formula
// @param record (Record) record to use to compute formula value
// @return (Number) formula result
// @visibility external
//<
getFormulaFieldValue : function (field, record) {
    return this.getFormulaFunction(field)(record, this);
},

// for a field with a userFormula, get the function that will generate formula outputs for a
// record
getFormulaFunction : function (field) {
    if (!field.userFormula) return null;
    var func = field._generatedFormulaFunc;
    if (func != null) return func;
    // first use of formula field - generate the formula function and install as sortNormalizer
    // too 
    func = field._generatedFormulaFunc = field.sortNormalizer =
            isc.FormulaBuilder.generateFunction(field.userFormula, this.getAllFields(), this);
    return func;
},

//> @attr dataBoundComponent.canAddSummaryFields (boolean : false : IRW)
// Adds an item to the header context menu allowing users to launch a dialog to define a new
// text field that can contain both user-defined text and the formatted values present in other 
// fields, using the +link{SummaryBuilder}.
// <P>
// User-added summary fields can be persisted via +link{listGrid.getFieldState()} and 
// +link{listGrid.setFieldState()}.
// 
// @group summaryFields
// @visibility external
//<
canAddSummaryFields:false,

//> @attr dataBoundComponent.addSummaryFieldText (String : "Add summary column..." : IRW)
// Text for a menu item allowing users to add a formula field
//
// @group i18nMessages
// @visibility external
//<
addSummaryFieldText: "Add summary column...",

//> @method dataBoundComponent.addSummaryField
// Convenience method to display a +link{SummaryBuilder} to create a new Summary Field.  This 
// is equivalent to calling +link{dataBoundComponent.editSummaryField, editSummaryField()} with 
// no parameter.
//
// @group summaryFields
// @visibility external
//<
addSummaryField : function () {
    this.editSummaryField();
},

//> @attr dataBoundComponent.editSummaryFieldText (String : "Edit summary format..." : IRW)
// Text for a menu item allowing users to edit the formatter for a field
//
// @group i18nMessages
// @visibility external
//<
editSummaryFieldText: "Edit summary format...",

//> @attr dataBoundComponent.removeSummaryFieldText (String: "Remove summary format..." : IRW)
// Text for a menu item allowing users to remove a summary field
//
// @group i18nMessages
// @visibility external
//<
removeSummaryFieldText: "Remove summary column..",

//> @method dataBoundComponent.editSummaryField
// Method to display a +link{SummaryBuilder} to edit a Summary Field.  If the function is called
// without a parameter, a new field will be created when the summary is saved.
//
// @param	field	   (Field)	Field to edit or null to add a new summary column
// @group summaryFields
// @visibility external
//<
editSummaryField : function (field) {
    // return if FormulaBuilder isn't available
    if (isc.FormulaBuilder == null) return;

    var component = this,
        editMode = !field ? false : true;

    if (isc.isA.String(field)) {
        field = this.getField(field);
    }

    if (!editMode) {
        // new field - gen a unique field-name in the format summaryFieldxxx
        field = { name: component.getUniqueFieldName("summaryField"), title: "New Field",
            width: "50", canFilter: false, canExport: false, canSortClientOnly: true};
    }

    this._formulaEditor = isc.Window.create({ title: "Summary Editor [" + field.title + "]",
        showMinimizeButton: false, showMaximizeButton: false,
        isModal: true, 
        showModalMask:true, 
        autoSize: true,
        autoCenter: true,
        autoDraw: true,
        headerIconProperties: { padding: 1,
            src: "[SKINIMG]ListGrid/formula_menuItem.png"
        },

        closeClick: function () {
            this.items.get(0).completeEditing(true);
            return this.Super('closeClick', arguments);
        },

        items: [
            isc.SummaryBuilder.create({ width: 300, 
                component: component, dataSource: component.getDataSource(), 
                editMode: editMode, field: field,
                fireOnClose: function(){
                    component.userFieldCallback(this);
                }
            }, this.summaryBuilderProperties)
        ]
    }, this.summaryEditorProperties);
},

// after a FormulaBuilder or SummaryBuilder completes, add the new field (or update the field) 
userFieldCallback : function (builder) {
    if (!builder) return;
    
    var editorWindow = this._formulaEditor;

    if (builder.cancelled) {
        editorWindow.destroy();
        return;
    }

    var field = builder.getUpdatedFieldObject();
    
    // Fire a notification method here - this will allow the developer to modify the
    // added field 
    if (this.userAddedField && this.userAddedField(field) == false) {
        editorWindow.destroy();
        return;
    }
    
    if (this.hideField && builder.shouldHideUsedFields()) {
        var usedFields = builder.getUsedFields();
        for (var i = 0; i < usedFields.length; i++) {
            var item = usedFields.get(i);
            this.hideField(item.name);
        }
    }
 
    
    var allFields = this.getAllFields();


    // if we edited a pre-existing field object (eg modified a pre-existing formula), find
    // and replace that field
    var fieldNum = isc.Class.getArrayItemIndex(field.name, allFields, this.fieldIdProperty);
    if (fieldNum >= 0) allFields[fieldNum] = field;
    // otherwise add as last visible field
    else allFields.addAt(field, this.getFields().length); 

    this.setFields(allFields);

    if (this.markForRedraw) this.markForRedraw();

    editorWindow.destroy();
},


getUniqueFieldName : function (namePrefix) {
    // assume return values in the format "fieldXXX" if namePrefix isn't passed
    if (!namePrefix || namePrefix == "") namePrefix = "field";
    var fields = this.getFields(),
        maxIncrement = 1,
        keyLength = namePrefix.length;

    // find the next available increment for the namePrefix
    for (var i = 0; i<fields.length; i++) {
        var item = fields.get(i);
        if (item.name.startsWith(namePrefix)) {
            var suffix = item.name.substr(keyLength),
                increment = new Number(suffix);
            if (increment && increment >= maxIncrement) maxIncrement = increment + 1;
        }
    }
    // return the new fieldName
    return namePrefix + maxIncrement;
},

getSummaryFunction : function (field) {
    if (!field.userSummary) return null;
    var func = field._generatedSummaryFunc;
    if (func != null) return func;
    // first use of summary field - generate the summary function and install as sortNormalizer
    // too 
    func = field._generatedSummaryFunc = field.sortNormalizer = 
            isc.SummaryBuilder.generateFunction(field.userSummary, this.getAllFields(), this);
    return func;
},

//> @method dataBoundComponent.getSummaryFieldValue()
// Get the computed value of a +link{canAddSummaryFields,summary field}.
// @param field (Field) field that has a summary format
// @param record (Record) record to use to compute formula value
// @return (Number) formula result
// @visibility external
//<
getSummaryFieldValue : function (field, record) {
    return this.getSummaryFunction(field)(record, field[this.fieldIdProperty], this);
},

//> @method dataBoundComponent.getRecordIndex()
// Get the index of the provided record.
// <P>
// Override in subclasses to provide more specific behavior, for instance, when data holds a
// large number of records
//
// @param record (Record) the record whose index is to be retrieved
// @return index (Number) index of the record, or -1 if not found
// @visibility external
//<
getRecordIndex : function (record) {
    return this.data.indexOf(record);
},

//> @method dataBoundComponent.getTitleFieldValue()
// Get the value of the titleField for the passed record
// <P>
// Override in subclasses 
//
// @param record (Record) the record whose index is to be retrieved
// @return value (String) the value of the titleField for the passed record
// @visibility external
//<
getTitleFieldValue : function (record) {},



//> @attr dataBoundComponent.titleField (string : null : IR)
// Best field to use for a user-visible title for an individual record from this
// component.
// <P>
// This attribute has the same function as +link{DataSource.iconField} but can be
// set for a component with no dataSource, or can be used to override the dataSource setting.
//
// @visibility external
//<

//> @attr dataBoundComponent.iconField (string : null : IR)
// Designates a field of +link{FieldType,type}:"image" as the field to use when rendering a
// record as an image, for example, in a +link{TileGrid}. 
// <P>
// This attribute has the same function as +link{DataSource.iconField} but can be
// set for a component with no dataSource, or can be used to override the dataSource setting.
// 
// @visibility external
//<

//> @attr dataBoundComponent.infoField (String : null : IR)
// Name of the field that has the second most pertinent piece of textual information in the
// record, for use when a +link{DataBoundComponent} needs to show a short summary of a record.
// <P>
// This attribute has the same function as +link{DataSource.infoField} but can be
// set for a component with no dataSource, or can be used to override the dataSource setting.
//
// @visibility external
//<


//> @attr dataBoundComponent.dataField (String : null : IR)
// Name of the field that has the most pertinent numeric, date, or enum value, for use when a
// +link{DataBoundComponent} needs to show a short summary of a record.
// <P>
// This attribute has the same function as +link{DataSource.dataField} but can be
// set for a component with no dataSource, or can be used to override the dataSource setting.
//
// @visibility external
//<

//> @attr dataBoundComponent.descriptionField (String : null : IR)
// Name of the field that has a long description of the record, or has the primary text data
// value for a record that represents an email message, SMS, log or similar.
// <P>
// This attribute has the same function as +link{DataSource.descriptionField} but can be
// set for a component with no dataSource, or can be used to override the dataSource setting.
//
// @visibility external
//<




//> @method dataBoundComponent.getTitleField()
// Method to return the fieldName which represents the "title" for records in this
// Component.<br>
// If this.titleField is explicitly specified it will always be used.
// Otherwise, default implementation will check +link{dataSource.titleField} for databound
// compounds.<br>
// For non databound components returns the first defined field name of <code>"title"</code>, 
// <code>"name"</code>, or <code>"id"</code>. If we dont find any field-names that match these
// titles, the first field in the component will be used instead.
// @return (string) fieldName for title field for this component.
// @visibility external
//<
getTitleField : function () {
    if (this.titleField != null) return this.titleField;
    
    if (this.dataSource != null) {
        var field = this.getDataSource().getTitleField();
        if (!this.getField(field)) field = this.getFields()[0][this.fieldIdProperty];
        
        this.titleField = field;
    } else {
        // if a title field hasn't been explicitly specified, take a guess.
        // Also, remember the guess (this is an inner loop)
        var fieldNames = this.getFields().getProperty(this.fieldIdProperty);
            this.titleField = fieldNames.contains("title") ? "title" :
                          fieldNames.contains("label") ? "label" :
                          fieldNames.contains("name") ? "name" :
                          fieldNames.contains("id") ? "id" :
                          fieldNames.first();
   }
   return this.titleField;
},

//> @method dataBoundComponent.getRecordHiliteCSSText()
// Return all CSS style declarations associated with the hilites of a record's field.
// @param record (Record)
// @param cssText (String) if set, returned CSS will be appended to this text
// @param field (Field) field object identifying whose CSS is to be returned
// @return value (String) CSS style declarations for this record and field
// @visibility external
//<
getRecordHiliteCSSText : function (record, cssText, field) {
    cssText = this.addObjectHilites(record, cssText, field);
    cssText = this.addHiliteCSSText(record, this.getFieldNum(field), cssText);
    return cssText;
},

//> @method dataBoundComponent.convertCSSToProperties()
// Convert a string containing CSS declarations into an object mapping CSS
// camelCaps property names with the declared values.
// @param css (string) Block of CSS style text
// @param allowedProperties (Array) optional array of CSS property names (camelCaps format)
//        constraining the allowed properties to be returned
// @return value (Object) CSS property-value pairs in camelCaps notation,
//         or null if no CSS was found
//<
convertCSSToProperties : function (css, allowedProperties) {
    if (css == null) return null;

    var statementList = css.split(";"),  // split into [name, value] pairs
        propertyList;
        
    statementList.map(function (decl) {
        var pair = decl.split(":");          // [ name, value ]
        if (pair.length != 2) return null;
        
        // Convert name to camelCaps. Trim whitespace from both name and value.
        var trimRe = /^\s*(\S*)\s*$/,
            name  = pair[0].cssToCamelCaps().replace(trimRe, "$1"),
            value = pair[1]                 .replace(trimRe, "$1");
        
        if (!allowedProperties || allowedProperties.contains(name)) {
            if (!propertyList) propertyList = {};
            propertyList[name] = value;
        }
    });
    
    return propertyList;
},
// Overridable method to return the exportable value of a record's field. 
// By default, the display value is returned (via getStandaloneFieldValue),
// stripped of HTML tags.
getExportFieldValue : function (record, fieldName, fieldIndex) {
    return this.htmlUnescapeExportFieldValue(
        this.getStandaloneFieldValue(record, fieldName, false));
},

// Overridable method to store the exportable value of a record's field, including
// its style information, in exportObject[exportProp]. If the field is unstyled then
// exportObject is not modified. The exportable value is in one of two formats, depending
// on if the style information applies to the entire cell, or a part of the cell (eg
// if cell used in a summary has hiliting applied to it):
//
// * Cell-wide style: { backgroundColor: "#f00000" }
//
// * Sub-cell style:
//   [
//     { value: "1",
//       style: { backgroundColor: "#f00000" }
//     },
//     { value: " --- baz" }
//   ]
addDetailedExportFieldValue : function(exportObject, exportProp, record, exportField, 
    exportFieldIndex, allowedProperties, alwaysExportExpandedStyles)
{
    var exportFieldName = exportField.name;
    var exportFieldCSS = this.getRecordHiliteCSSText(record, null, exportField);
    var simpleValue;
    if (exportField.exportRawValues || (this.exportRawValues && exportField.exportRawValues != false))
        simpleValue = record[exportField[this.fieldIdProperty]];
    else
        simpleValue = this.getExportFieldValue(record, exportField.name, exportFieldIndex);

    if (!exportField.userSummary) {
        if (exportFieldCSS) {
            var props = this.convertCSSToProperties(exportFieldCSS, allowedProperties);
            if (props) {
                if (alwaysExportExpandedStyles)
                    exportObject[exportProp] = [{value: simpleValue, style: props }];
                else
                    exportObject[exportProp] = props;
            }
        }
        return;
    }

    if (!exportField.userSummary.text) this.logError("Summary field does not have text format");
    
    // Code below generally adapted from SummaryBuilder.getFieldDetailsFromValue, generateFunction
    var missingFields = [], usedFields = {}, usedFieldsCSS = {};
    var cssFound = (exportFieldCSS && exportFieldCSS != "");
        
    // compile lists of used and missing fields and save off used field CSS for later
    for (var key in exportField.userSummary.summaryVars) {
        var varFieldName = exportField.userSummary.summaryVars[key],
            varField = this.getField(varFieldName);
        if (!varField) missingFields.add(varFieldName);
        else {
            usedFields[key] = varField;
            
            var varCSS = this.getRecordHiliteCSSText(record, null, varField);
            if (varCSS) {
                usedFieldsCSS[key] = varCSS;
                cssFound=true;
            }
        }
    }
    
    // if there's no style info, there's no need for a $style entry.
    if (!cssFound) return;
    
    // missing fields fail the method and probably ought to be styled
    if (missingFields.length != 0 && exportFieldCSS) {
        if (alwaysExportExpandedStyles) {
            exportObject[exportProp] = {
                style: this.convertCSSToProperties(exportFieldCSS, allowedProperties),
                value: simpleValue
            };
        } else {
        exportObject[exportProp] = this.convertCSSToProperties(
            exportFieldCSS, allowedProperties);
        }
        return;
    }
    
    // substrings of summary value are stored in currentFragment along with its associated
    // CSS in currentCSS, before they are combined into a single object and appended to output
    // array detailedValues. Consecutive fragments with equal css strings are merged.
    var currentFragment = null, currentCSS = null, detailedValue = [];
    
    // addToOutput(): helper function for outputting value/css pairs. 
    var _this=this;
    var addToOutput = function (value, css) {
        if (value) {
            value = _this.htmlUnescapeExportFieldValue(value);
            
            if (currentFragment && currentCSS == css) {
                currentFragment.value += value; // merge if styles are equal
            } else {
                // add current fragment to output array and create new fragment
                if (currentFragment) detailedValue.push(currentFragment);

                currentFragment = {value: value};
                currentCSS = css;
                if (css) currentFragment.style = _this.convertCSSToProperties(
                    css, allowedProperties);
            }
        }
    };

    // Split summary format on formula alias prefix "#" and consider each substring a
    // potential formula alias. The "#X" alias form is attempted first then "#{ABC}".
    var splitFmt = exportField.userSummary.text.split("#"),
        braceRegexp = /^\{([A-Z]+)\}/;
    
    // If format started with literal text, add it to output
    if (splitFmt[0]) addToOutput(splitFmt[0], exportFieldCSS);
    for (var i=1; i<splitFmt.length; i++) {
        var fragment = splitFmt[i], braceRegexpMatch, matchField, matchKey, fieldValue, 
            fieldCSS, textAfterField;
            
        matchKey = fragment.charAt(0);
        matchField = usedFields[matchKey];
        
        if (matchField) textAfterField = fragment.substr(1); // #X
        else if (braceRegexpMatch = fragment.match(braceRegexp)) {
            textAfterField = fragment.substr(braceRegexpMatch[0].length); // #{XXX}
            matchKey = braceRegexpMatch[1];
            matchField = usedFields[matchKey];
            
            // always assume #{..} is meant to be an alias, so fail this out
            if (matchField) textAfterField = this.missingSummaryFieldValue + textAfterField;
        } else textAfterField = "#" + fragment; // possibly not an alias
        
        // If a field matched, get its value and style; merge style with summary-wide
        // style as appropriate
        if (matchField) {
            fieldValue = this.getExportFieldValue(record, matchField.name, 
                this.getFieldNum(matchField.name));
            fieldCSS=null;
            if (exportFieldCSS) fieldCSS = (fieldCSS||"") + exportFieldCSS;
            if (usedFieldsCSS[matchKey]) fieldCSS = (fieldCSS||"") + usedFieldsCSS[matchKey];
        }
        // add possible fragments for formula alias and the literal text following it
        addToOutput(fieldValue, fieldCSS);
        addToOutput(textAfterField, exportFieldCSS);
    }
    // Above loop leaves last fragment not added to output: add it now
    if (currentFragment) detailedValue.push(currentFragment);
    
    exportObject[exportProp] = detailedValue;
},


//> @method dataBoundComponent.getClientExportData()
// Export visual description of component data into a JSON form suitable for export.
// @param settings (Object) contains configuration settings for the export, including:<br/>
//        includeHiddenFields (Boolean) - controls if hidden fields should be exported<br/>
//        allowedProperties (Array) optional array of CSS property names (camelCaps format)
//             constraining the allowed properties to be returned
//        includeCollapsedNodes (Boolean) - if true, when exporting a TreeGrid, include tree
//             nodes underneath collapsed folders in the export output
// @param callback (Callback) callback to fire when data is ready
// @return exportData (Object) exported data
//<
// * Data is exported as an array of objects, with one object per record (visual row) 
//   of the grid.
// * The title of each visible field of the component is mapped to a property
//   of a record's object. Correspondingly, the value of each visible field in a record is
//   mapped to each value of a record's object.
// * If CSS hiliting styles are present on a field, style information is stored in property 
//   "<property name>$style". This contains an array of objects. Each object has a
//   'value' property containing a fragment or substring of the field value. If that
//   value fragment is styled, the CSS text is converted into an object mapping CSS
//   properties in camelCaps format to CSS values, and the object is stored in the 'style'
//   property.
// * Null record values are converted to empty strings.
//
// For instance, suppose a record has a field "Foo Fighter" equal to 1 with a
// backgroundColor set through hiliting, a field "bar" set to "baz", a field
// "xyzzy" set to null, and a summary field with the format "#A -- #B", with
// #A referring to "Foo Fighter" and #B referring to "bar". The return value would be:
//
// [
//     { 
//         "Foo Fighter": "1",
//         "Foo Fighter$style": 
//         [
//             { 
//                 value: "1",
//                 style: 
//                 { 
//                     backgroundColor: "#f00000" 
//                 }
//             }
//         ],
//         bar: "baz",
//         xyzzy: "",
//         "Summary Field": "1 --- baz",
//         "Summary Field$style": 
//         [
//             {
//                 value: "1",
//                 style: 
//                 { 
//                     backgroundColor: "#f00000"
//                 }
//             },
//             {
//                 value: " --- baz"
//             }
//         ]
//     }, /* other records... */
// ]
exportDataChunkSize: 50,
getClientExportData : function (settings, callback) {
    var data = this.originalData || this.data,
        exportData = [],
        fields = this.getClientExportFields(settings),
        includeHiddenFields,
        allowedProperties,
        includeCollapsedNodes,
        alwaysExportExpandedStyles
    ;

    if (isc.isA.Object(settings)) {
        
        if (settings.exportData != null) data = settings.exportData;
        
        includeHiddenFields = settings.includeHiddenFields;
        allowedProperties = settings.allowedProperties;
        includeCollapsedNodes = settings.includeCollapsedNodes;
        alwaysExportExpandedStyles = settings.alwaysExportExpandedStyles;
        // support export fields as per server-side export
        if (settings && settings.exportFields) {
            // when exportFields is specified and unless includeHiddenFields is explicitly set to
            // false, assume that the user actually wants to see the fields that he provided via
            // exportFields.
            if (includeHiddenFields !== false) includeHiddenFields = true;
        }
    }

    
    if (isc.isA.ResultSet(data)) data = data.getAllLoadedRows();
    if (isc.isA.Tree(data)) {
        if (includeCollapsedNodes) data = data.getAllNodes();
        else data = data.getOpenList();
    }

    var context = {
        settings: settings,
        callback: callback,
        chunkSize: this.exportDataChunkSize,
        data: data,
        exportData: exportData,
        fields: fields,
        includeHiddenFields: includeHiddenFields,
        allowedProperties: allowedProperties,
        includeCollapsedNodes: includeCollapsedNodes,
        alwaysExportExpandedStyles: alwaysExportExpandedStyles,
        totalRows: data.getLength(),
        startRow: 0,
        endRow: Math.min(this.exportDataChunkSize, data.getLength())
    };

    context.firstTimeStamp = context.thisTimeStamp = isc.timeStamp();

    this.logWarn("starting export chunking process - "+context.firstTimeStamp);
    this.getClientExportDataChunk(context);

    return;
},

getClientExportDataChunk : function (context) {
    var settings = context.settings,
        data = context.data,
        exportData = context.exportData,
        fields = context.fields,
        includeHiddenFields = context.includeHiddenFields,
        allowedProperties = context.allowedProperties,
        includeCollapsedNodes = context.includeCollapsedNodes,
        alwaysExportExpandedStyles = context.alwaysExportExpandedStyles,
        totalRows = context.totalRows,
        startRow = context.startRow,
        endRow = context.endRow
    ;

    // Generate a separate object for each row of data
    for (var dataRow = startRow; dataRow < endRow; dataRow++) {
        var record = data[dataRow],
            exportObject = this.getRecordExportObject(record, fields, allowedProperties, 
                includeHiddenFields, includeCollapsedNodes, alwaysExportExpandedStyles)
        ;

        exportData.push(exportObject);
    }

    if (context.endRow < context.totalRows) {
        context.lastTimeStamp = context.thisTimeStamp;
        context.thisTimeStamp = isc.timeStamp();
        if (this.logIsInfoEnabled("export")) {
            this.logInfo("processed "+context.endRow+" rows - starting next chunk - "+
                ((context.thisTimeStamp-context.lastTimeStamp)/1000));
        }
        // more rows remain - delayCall() this method again to process the next chunk
        context.startRow = context.endRow;
        context.endRow = Math.min(context.startRow + context.chunkSize, context.totalRows);
        return this.delayCall("getClientExportDataChunk", [context], 0);
    }

    if (this.showGridSummary && this.summaryRow && this.exportIncludeSummaries) {
        // append the summaries for this component if it has them
        var summaryRow = this.summaryRow,
            data = [summaryRow._summaryRecord];

        for (var dataRow = 0; dataRow < data.getLength(); dataRow++) {
            var record = data[dataRow],
                exportObject = this.getRecordExportObject(record, fields, allowedProperties, 
                    includeHiddenFields, includeCollapsedNodes, alwaysExportExpandedStyles)
            ;

            exportData.push(exportObject);
        }
    }

    if (context.callback) {
        var data = context.exportData;
        if (this.logIsInfoEnabled("export")) {
            this.logInfo("finished processing "+context.endRow+" rows - about to export - "+isc.timestamp());
        }
        this.fireCallback(context.callback, "data,context", [data,context.settings]);
    }
},


getClientExportFields : function (settings) {
    var fields = this.getAllFields();

    if (isc.isA.Object(settings)) {
        // support export fields as per server-side export
        if (settings && settings.exportFields) {
            var newFields = [];
            for (var i = 0; i < fields.length; i++) {
                if (settings.exportFields.contains(fields[i].name)) newFields.add(fields[i]);
            }
            fields = newFields;
        }
    }

    return fields;
},
getRecordExportObject : function (record, fields, allowedProperties, includeHiddenFields, 
    includeCollapsedNodes, alwaysExportExpandedStyles)
{
    var exportObject = {};

    // Iterate through all fields
    for (var fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
        var field = fields[fieldIndex];

        // Skip field if it's hidden
        if ((!this.fields.contains(field)) && !includeHiddenFields) continue;
        
        var fieldNum = this.getFieldNum(field.name),
            exportProp=this.htmlUnescapeExportFieldTitle(field.exportTitle || field.title || field.name),
            styleProp=exportProp+"$style",
            value;
            
        if (field.exportRawValues || (this.exportRawValues && field.exportRawValues != false)) 
            value = record[field[this.fieldIdProperty]];
        else 
            value = this.getExportFieldValue(record, field.name, fieldNum);

        //var value = this.getExportFieldValue(record, field.name, fieldNum);
        
        if (value == null || value == "&nbsp;") value = "";
        exportObject[exportProp] = value;
        
        this.addDetailedExportFieldValue(exportObject, styleProp, record, field, fieldNum, 
            allowedProperties, alwaysExportExpandedStyles);
    }
    return exportObject;
},
htmlUnescapeExportFieldTitle : function (fieldName) {
    return this.htmlUnescapeExportFieldValue(fieldName);
},
htmlUnescapeExportFieldValue : function (value) {
    // convert basic HTML like &nbsp; and <br> into normal text equivalents and escape all
    // other HTML
    if (isc.isA.String(value)) return value.unescapeHTML().replace(/<.*?>/g, isc.emptyString);
    return value;
},
// Takes a formatted value and, if hilites apply to the value, adds hilite styling via adding
// a surround <span> tag with a STYLE attribute.  Otherwise returns the value unchanged.
addHiliteSpan : function(record, field, value) {
    var fieldCss = this.getRecordHiliteCSSText(record, null, field);
    if (fieldCss) return "<span style=\"" + fieldCss + "\">" + value + "</span>";
    else return value;
},
getRawValue : function (record, fieldName) {
	return this.getCellValue(record, this.getField(fieldName));
},
getFormattedValue : function (record, fieldName, value) {
    return value;
},
fieldIsVisible : function (field) {
    return true;
},
getStandaloneFieldValue : function (record, fieldName, unformatted) {
    var field = this.getSpecifiedField(fieldName),
        value;

    if (!field) return;
    
    if      (field.userFormula) value = this.getFormulaFieldValue(field, record);
    else if (field.userSummary) value = this.getSummaryFieldValue(field, record);
    else {
        value = this.getRawValue(record, fieldName);
        if (!unformatted) value = this.getFormattedValue(record, fieldName, value);
    }
    
    var ret = this.addHiliteSpan(record, field, value);
    return ret;
},
getFormattingProperties : function (field, value) {
    if (field.type != "date" && field.type != "datetime") return;
    
    var dateFormatter;
    
    
    if (field.displayFormat && isc.isA.Function(Date.prototype[field.displayFormat])) {
        dateFormatter = field.displayFormat;
    }
    if (field.dateFormatter && isc.isA.Function(Date.prototype[field.dateFormatter])) {
        dateFormatter = field.dateFormatter;
    }
    
    // Probably no need to check this because it should have been copied onto the LGF, but 
    // it does no harm
    if (!dateFormatter) {
        var dsFormat = this.getDataSource().getField(field.name).displayFormat;
        if (dsFormat && isc.isA.Function(Date.prototype[dsFormat])) {
            dateFormatter = dsFormat;
        }
    }
    
    // Defaults from the DBC
    if (!dateFormatter) {
        var dbcFormat = field.type == "date" ? this.dateFormatter : this.datetimeFormatter;
        if (dbcFormat && isc.isA.Function(Date.prototype[dbcFormat])) {
            dateFormatter = dbcFormat;
        }
    }
    
    
    // ListGrid defaults to the default short date or datetime formatter, not the "normal"
    // format
    if (!dateFormatter) {
        var shortFormat = field.type == "date" ? Date.prototype._shortFormat 
                                               : Date.prototype._shortDatetimeFormat; 
        if (shortFormat && isc.isA.Function(Date.prototype[shortFormat])) {
            dateFormatter = shortFormat;
        }
    }
    
    if (dateFormatter) {
        return {
            dateFormatter: dateFormatter,
            rawValue: value
        }
    }
},

//> @method dataBoundComponent.exportClientData()
// Exports this component's data with client-side formatters applied, so is suitable for direct
// display to users.  This feature requires the SmartClient server, but does not rely on any
// server-side DataSources.
// <P>
// To export unformatted data from this component's dataSource, 
// see +link{dataBoundComponent.exportData, exportData} which does not include client-side 
// formatters, but relies on both the SmartClient server and server-side DataSources.
// @param [requestProperties] (DSRequest Properties) Request properties for the export
//  note that specifying +link{DSRequest.exportData,exportData} on the request properties
//  allows the developer to pass in an explicit data set to export.
// @see dataSource.exportClientData
// @visibility external
//<
exportClientData : function (requestProperties) {
    this.getClientExportData(requestProperties, 
        this.getID()+".exportClientDataReply(data,context)");
    return;
},

exportClientDataReply : function (data, context) {
    var props = context,
        format = props && props.exportAs ? props.exportAs : "csv",
        fileName = props && props.exportFilename ? props.exportFilename : "export",
        exportDisplay = props && props.exportDisplay ? props.exportDisplay : "download"
    ;

    var serverProps = {
        showPrompt:false,
        transport: "hiddenFrame",
        exportResults: true,
        downloadResult: true,
        downloadToNewWindow: (exportDisplay == "window"),
        download_filename: (exportDisplay == "window" ? fileName : null)
    };

    isc.DMI.callBuiltin({
        methodName: "downloadClientExport",
        arguments: [ data, format, fileName, exportDisplay ],
        requestParams: serverProps
    });

},

//> @method dataBoundComponent.getSort()
// Return the +link{SortSpecifier}s representing the current sort configuration of this
// component.
// @return sortSpecifiers (Array of SortSpecifier) The current sort specification for this component
// @visibility external
//<
getSort : function () {
    return this._sortSpecifiers ? isc.shallowClone(this._sortSpecifiers) : null;
},

//> @method dataBoundComponent.setSort()
// Sort this component by a list of +link{SortSpecifier}s.  If the component's data is not a 
// +link{ResultSet}, only the first specifier is applied.
// 
// @param sortSpecifiers (Array of SortSpecifier)  List of +link{SortSpecifier} objects, one 
//   per sort-field and direction
// @visibility external
//<
setSort : function (sortSpecifiers) {
    this._sortSpecifiers = isc.shallowClone(sortSpecifiers);
    if (this.data && this._sortSpecifiers && this._sortSpecifiers.length>0) {
        if (this.data.setSort) this.data.setSort(this._sortSpecifiers);
        else if (this.data.sortByProperty) {
            var item = this._sortSpecifiers[0];
            this.data.sortByProperty(
                item.property, 
                Array.shouldSortAscending(item.direction),
                item.normalizer,
                item.context
            );
        }
    }
},

//> @method dataBoundComponent.askForSort()
// Show a dialog to configure the sorting of multiple fields on this component.  Calls through
// to +link{multiSortDialog.askForSort}, passing this component as the fieldSource and the
// current +link{dataBoundComponent.getSort, sort-specification} if there is one.
//
// @visibility external
//<
askForSort : function () {
    if (isc.MultiSortDialog && this.canMultiSort != false) {
        isc.MultiSortDialog.askForSort(this, this.getSort(), this.getID()+".multiSortReply(sortLevels)");
    }
},

multiSortReply : function (sortLevels) {
    if (sortLevels != null) {
        this.setSort(sortLevels);
    }
},

//> @method dataBoundComponent.addValidationError()  (A)
// Helper method to add a validation error (or array of errors) to a list of existing errors 
// (passed in).
// Avoids duplicating errors.
// @group validation
//
// @param errors       (object)  current set of errors
//                               {itemName:"error", itemName:["error 1", "error 2"]}
// @param itemName     (string)  name of the item that has the error
// @param errorMessage (string)  actual error message
//
// @return (boolean)  returns true if error is not a duplicate
// @visibility internal
//<
// Not intended for public use - this is for directly updating an errors object.
addValidationError : function (errors, itemName, errorMessage) {
    var addedError = false;

    if (isc.isAn.Array(errorMessage)) {
        for (var i = 0; i < errorMessage.length; i++) {
            addedError = this.addValidationError(errors, itemName, errorMessage[i]) || addedError;
        }
        return addedError;
    }
    if (!errors[itemName]) {
    	errors[itemName] = errorMessage;
        addedError = true;
    } else {
        if (!isc.isAn.Array(errors[itemName])) errors[itemName] = [errors[itemName]];
        
        if (!errors[itemName].contains(errorMessage)) {
            errors[itemName].add(errorMessage);
            addedError = true;
        }
    }
    // Let caller know if we saved a new error message
    return addedError;
},

// Is <field> dependent on <fieldName>?
isFieldDependentOnOtherField : function (field, fieldName) {
    if (!field.validators) return false;

    var ds = this.getDataSource();

    for (var i = 0; i < field.validators.length; i++) {
        var validator = field.validators[i];
        if (!validator) continue;

        // Cache derived depedencies, if any.
        // Cannot derive dependencies unless we have a data source.
        if (!validator._derivedDependentFields && validator.applyWhen && ds != null) {
            validator._derivedDependentFields = ds.getCriteriaFields (validator.applyWhen);
        }

        // Explicit dependency?
        if (validator.dependentFields && validator.dependentFields.contains(fieldName)) {
            return true;
        }
        // ApplyWhen dependency?
        if (validator._derivedDependentFields &&
            validator._derivedDependentFields.length > 0 &&
            validator._derivedDependentFields.contains(fieldName))
        {
            return true;
        }
    }
    return false;
},

// Return dependencies for field (i.e. what fields it is dependent on)
getFieldDependencies : function (field) {
    if (!field.validators) return null;

    var ds = this.getDataSource(),
        dependencies = []
    ;

    for (var i = 0; i < field.validators.length; i++) {
        var validator = field.validators[i];
        if (!validator) continue;

        // Cache derived depedencies, if any.
        // Cannot derive dependencies unless we have a data source.
        if (!validator._derivedDependentFields && validator.applyWhen && ds != null) {
            validator._derivedDependentFields = ds.getCriteriaFields (validator.applyWhen);
        }

        // Explicit dependencies
        if (validator.dependentFields) {
            if (!isc.isAn.Array(validator.dependentFields)) {
                validator.dependentFields = [validator.dependentFields];
            }
            for (var i = 0; i < validator.dependentFields.length; i++) {
                dependencies.add(validator.dependentFields[i]);
            }
        }

        // ApplyWhen dependencies
        if (validator._derivedDependentFields &&
            validator._derivedDependentFields.length > 0)
        {
            dependencies.addList (validator._derivedDependentFields);
        }
    }
    return (dependencies.length == 0 ? null : dependencies);
},


//> @method dataBoundComponent.validateFieldAndDependencies() (A)
// Validate the field value against any validators defined on the field
// where validateOnChange is true and validate any fields that are dependent
// on the field.
//
// @param  field      (object)    pointer to the field descriptor object
// @param  validators (array)     Validators to be applied to field
// @param  newValue   (any)       value to be validated
// @param  record     (object)    copy of the record object
// @param  options    (object)    options object to control the validation process
//                  in the format {dontValidatorNullValue: true/false,
//                                 typeValidationsOnly: true/false,
//                                 unknownErrorMessage: value or null,
//                                 changing: true/false,
//                                 serverValidationMode: "full"/"partial"}
// @return (object) null if no validation was performed, or validation result object
//                  in the format {valid: true/false,
//                                 errors: null or {fieldName: ["error", ...], ...}
//                                 resultingValue: value or null,
//                                 stopOnError: true/false}
//                  Note that if a dependent field has no errors an entry in the errors
//                  object will still exist but be null. This lets the caller know the
//                  field was validated and it is valid.
//<

validateFieldAndDependencies : function (field, validators, newValue, record, options) {

    var errors = {},
        validated = false,
        result = {valid: true,
                  errors: null,
                  resultingValue: null}
    ;

    // Apply newValue to record so that dependencies can reference it
    // If a validator changes newValue, the new value will overwrite this one.
    record[field.name] = newValue;

    // Process all validators for this field
    var fieldResult = this.validateField(field, field.validators, newValue, record, options);
    if (fieldResult != null) {
        result.valid = fieldResult.valid;
        result.stopOnError = fieldResult.stopOnError;
        if (fieldResult.errors != null) {
            this.addValidationError (errors, field.name||field.dataPath, fieldResult.errors);
        }
        if (fieldResult.resultingValue != null) {
            result.resultingValue = fieldResult.resultingValue;
            record[field.name] = fieldResult.resultingValue;
        }
        validated = true;
    }

    // Validate other fields that are dependent on this one.
    
    var fieldName = field.name || field.dataPath,
        fields = this.getFields() || []
    ;

    for (var i = 0; i < fields.length; i++) {
        
        var depField = fields[i];
        if (depField.name != fieldName  && depField.dataPath != fieldName &&
            this.isFieldDependentOnOtherField(depField, fieldName)) 
        {
            fieldResult = this.validateField (depField, depField.validators,
                                              record[depField.name], record, options);
            if (fieldResult != null ) {
                if (fieldResult.errors != null) {
                    this.addValidationError (errors, depField.name || depField.dataPath,
                                            fieldResult.errors);
                } else {
                    // Record the field in the errors object even though there is no error.
                    // This lets the caller know the field was validated _and_ it is valid.
                    this.addValidationError (errors, depField.name || depField.dataPath, null);
                }
                if (fieldResult.resultingValue != null) {
                    record[depField.name] = fieldResult.resultingValue;
                }
            }
        }
    }

    result.errors = errors;
    return (validated ? result : null);
},

_$typeValidators: ["isInteger", "isFloat", "isBoolean", "isString"],

//> @method dataBoundComponent.validateField() (A)
// Validate the field value against any validators defined on the field.
//
// @param  field      (object)    pointer to the field descriptor object
// @param  validators (array)     Validators to be applied to field
// @param  value      (any)       Value to be validated
// @param  record     (object)    pointer to the record object
// @param  options    (object)    options object to control the validation process
//                  in the format {dontValidatorNullValue: true/false,
//                                 typeValidationsOnly: true/false,
//                                 unknownErrorMessage: value or null,
//                                 changing: true/false,
//                                 serverValidationMode: "full"/"partial"}
// @return (object) null if no validation was performed, or validation result object
//                  in the format {valid: true/false,
//                                 errors: null or {fieldName: ["error", ..], ...}
//                                 resultingValue: value or null,
//                                 stopOnError: true/false}
//<
_$partial: "partial",
validateField : function (field, validators, value, record, options) {

    // If there are no validators for this field, we are done
    if (!validators) return null;

    var errors = [],
        validated = false,
        stopOnError = null,
        result = {valid: true,
                  errors: null,
                  resultingValue: null},
        needsServerValidation = false,
        forceShowPrompt = false
    ;

    if (!isc.isAn.Array(validators)) {
        validators = [validators];
    }

    // loop through validators
    for (var i = 0; i < validators.length; i++) {
        var validator = validators[i];
        if (!validator) continue;

        // If we're validating type only (eg, for a filter field), ignore other types
        // of validator
        if (options && options.typeValidationsOnly && 
            !this._$typeValidators.contains(validator.type))
        {
            continue;
        }
                
        // Unless we're looking at a 'required' or  'requiredIf' field, don't try to validate
        // null values.
        
        if (options && options.dontValidateNullValue && 
            value == null && validator.type != "required" && validator.type != 'requiredIf')
        {
            continue;
        }

        // If we are processing all validators
        // OR only validateOnChange ones and settings allow
        if (!options || !options.changing || 
            (validator.validateOnChange != false &&
             (validator.validateOnChange || field.validateOnChange || this.validateOnChange)))
        {
            // Postpone server validations until we complete client-side ones
            if (isc.Validator.isServerValidator(validator)) {
                needsServerValidation = true;
                // If any server validator has stopOnError set, force synchronous mode
                if (validator.stopOnError) forceShowPrompt = true;
                continue;
            }

            if (validator.applyWhen) {
                var ds = this.getDataSource(),
                    criteria = validator.applyWhen
                ;
                if (ds == null) {
                    isc.logWarn("Conditional validator criteria ignored because form has no dataSource");
                } else {
                    var matchingRows = ds.applyFilter([record], criteria);
                    // Skip validator if condition does not apply
                    if (matchingRows.length == 0) {
                        // Use result of null to let validator know it was skipped
                        isc.Validator.performAction(null, field, validator, this);
                        continue;
                    }
                }
            }

            // process the validator
            validated = true;
            var isValid = (isc.Validator.processValidator(field, validator, value, null, record) == true);
            isc.Validator.performAction(isValid, field, validator, this);
            if (!isValid) {
                var errorMessage = isc.Validator.getErrorMessage(validator);
                if (errorMessage == null && options && options.unknownErrorMessage) {
                    errorMessage = options.unknownErrorMessage;
                }
                errors.add(errorMessage);

                // Update stopOnError status based on the validator
                if (validator.stopOnError) stopOnError = true;
            }

            // if the validator returned a resultingValue, use that as the new value
            // whether the validator passed or failed.  This lets us transform data
            // (such as with the mask validator).
            if (validator.resultingValue != null) {
                result.resultingValue = validator.resultingValue;

                // Save resulting value for remaining validators
                value = validator.resultingValue;
            }
            // if the validator failed and we're supposed to stop on a false validator, bail!
            if (!isValid && validator.stopIfFalse) break;
        }
    }

    // Process server-side validators
    if (needsServerValidation) {
        // If field or form has stopOnError set, we must show prompt for synchronous operation
        forceShowPrompt = this._resolveStopOnError(forceShowPrompt, field.stopOnError,
                                                   this.stopOnError);

        // Default to partial validation unless overridden by the caller
        var validationMode = ((options && options.serverValidationMode)
                              ? options.serverValidationMode
                              : this._$partial),
            values = isc.addProperties({}, record),
            showPrompt = (forceShowPrompt || field.synchronousValidation ||
                          this.synchronousValidation || false)
        ;
        // Make sure if local validators have converted the value, the converted value is sent
        values[field.name] = value;
        // send validation request to server
        this.fireServerValidation(field, values, validationMode, showPrompt, options.rowNum);
    }

    // If validation failed and focus should be retained in field, let caller know
    result.stopOnError = (errors.length > 0 && 
                          this._resolveStopOnError(stopOnError, field.stopOnError,
                                                   this.stopOnError));

    // Populate remainder of result object
    result.errors = (errors.length == 0 ? null : errors);
    result.valid = (errors.length == 0);
    return (validated ? result : null);
},

// stopOnError is resolved validator value
_resolveStopOnError : function(stopOnError, fieldStopOnError, formStopOnError) {
    if (stopOnError != null) return stopOnError;
    return (fieldStopOnError == null && formStopOnError) || fieldStopOnError || false;
},

fireServerValidation : function (field, record, validationMode, showPrompt, rowNum) {
    var ds = this.getDataSource();
    if (ds == null) return;

    var requestProperties = {showPrompt: showPrompt, 
                             prompt: isc.RPCManager.validateDataPrompt,
                             validationMode: validationMode,
                             clientContext: {component: this,
                                             fieldName: field.name,
                                             rowNum: rowNum}
                             };

    // Drop null values if validating in "partial" mode
    if (validationMode == this._$partial) {
        for (var fieldName in record) {
            if (record[fieldName] === null) delete record[fieldName];
        }
    }

    // If processing asynchronously, we must keep a list of outstanding requests
    // so that the DBC can check for dependencies before editing a field.
    if (!showPrompt) {
        var pendingFields = this._registerAsyncValidation(field);
        requestProperties.clientContext.pendingFields = pendingFields;
    }
    ds.validateData(record, 
                    this._handleServerValidationReply,
                    requestProperties);
},

_handleServerValidationReply : function (dsResponse, data, dsRequest) {
    if (dsResponse.status == isc.DSResponse.STATUS_FAILURE) {
        isc.logWarn("Server-side validation failed: " + dsResponse.data);
        isc.say(dsResponse.data);
    }
    var context = dsResponse.clientContext,
        component = context.component,
        pendingFields = context.pendingFields
    ;
    if (dsResponse.errors) {
        var errors = isc.DynamicForm.getSimpleErrors(dsResponse.errors);

        // Show server errors
        for (var fieldName in errors) {
            var fieldErrors = errors[fieldName],
                field = component.getField(fieldName)
            ;
            if (fieldErrors != null && field != null) {
                // Avoid changing focus by delaying update until redraw
                if (!isc.isAn.Array(fieldErrors)) fieldErrors = [fieldErrors];
                var stopOnError = null;
                for (var i = 0; i < fieldErrors.length; i++) {
                    component.addFieldErrors(fieldName, fieldErrors[i].errorMessage, false, context.rowNum);
                    if (fieldErrors[i].stopOnError) stopOnError = true;
                }
                if (field.redraw) field.redraw();

                stopOnError = component._resolveStopOnError(stopOnError, field.stopOnError,
                                                            component.stopOnError);

                // Restore focus to primary field if stopOnError
                if (fieldName == context.fieldName && stopOnError == true && !field.hasFocus) {
                    if (!field.synchronousValidation && !component.synchronousValidation) {
                        isc.logWarn("Server validation for " + fieldName +
                                    " signaled stopOnError but validation is not set for" +
                                    " synchronousValidation:true - stop ignored.");
                    } else {
                        component.focusInItem (field);
                    }
                }
            }
        }
    }

    // If request marked pending fields, clear them now.
    if (pendingFields) {
        component._clearAsyncValidation(pendingFields);
    }
},

// Pending asynchronous validations
// Format: <field>: <outstandingRequestCount>,
//         ...
_pendingAsyncValidations: {},

// Register async validation request for <field>.
// Returns: array of fields affected by this validation. Includes <field>.
_registerAsyncValidation : function (field) {
    var fields = this.getFields() || [],
        pendingFields = [field.name],
        fieldName = field.name
    ;

    // Register pending on field being validated
    this._pendingAsyncValidations[fieldName] = 
        (this._pendingAsyncValidations[fieldName] == null
            ? 1
            : this._pendingAsyncValidations[fieldName]++);

    // Register pending on fields dependent on field being validated
    for (var i = 0; i < fields.length; i++) {
        var depField = fields[i];
        if (depField.name != fieldName && this.isFieldDependentOnOtherField(depField, fieldName)) {
            var depFieldName = depField.name;
            pendingFields.add(depFieldName);

            this._pendingAsyncValidations[depFieldName] = 
                (this._pendingAsyncValidations[depFieldName] == null
                    ? 1
                    : this._pendingAsyncValidations[depFieldName]++);
        }
    } 
    return pendingFields;
},

// Clear pending validation for <fieldNames> array.
// If a pending UI interaction is blocked by a showPrompt, clear that.
_clearAsyncValidation : function (fieldNames) {
    var clearedAField = false;
    for (var i = 0; i < fieldNames.length; i++) {
        this._pendingAsyncValidations[fieldNames[i]]--;
        if (this._pendingAsyncValidations[fieldNames[i]] == 0) {
            delete this._pendingAsyncValidations[fieldNames[i]];
            clearedAField = true;
        }
    }
    // If any field was cleared see if we have a blocking focus to continue
    if (clearedAField && this._blockingFocus != null) {
        var unblock = true;
        for (var i = 0; i < this._blockingFocus; i++) {
            if (this._pendingAsyncValidations[this._blockingFocus[i]] > 0) {
                unblock = false;
                break;
            }
        }

        if (unblock) {
            this._blockingFocus = null;
            isc.clearPrompt();
        }
    }
},

// Array of field names which must be cleared from pending validations
// before unblocking focus.
_blockingFocus: null,

//> @method dataBoundComponent.blockOnFieldBusy
// Block UI activity by displaying showPrompt if validation is pending for specified field
// or any dependency. If shown the prompt will be removed automatically when responses
// are received.
//
// @param field (FormItem) Field being entered.
// @return (boolean) True if prompt was shown
//
// @visibility internal
//<
blockOnFieldBusy : function (field) {
    // If already blocking, nothing more to do. Let caller know we are blocked.
    if (this._blockingFocus != null) return true;

    // See if any requests are pending to matter
    var havePendingRequest = false;
    for (var fieldName in this._pendingAsyncValidations) {
        havePendingRequest = true;
        break;
    }
    if (!havePendingRequest) return false;

    // Get the list of fields we should check
    var dependentOnFields = this.getFieldDependencies(field) || [];
    dependentOnFields.add(field.name);

    // Determine which fields are still pending, if any
    var waitForFieldNames = [];
    for (var i = 0; i < dependentOnFields.length; i++) {
        var depFieldName = dependentOnFields[i];
        if (this._pendingAsyncValidations[depFieldName] > 0) {
            waitForFieldNames.add(depFieldName);
        }
    }
    if (waitForFieldNames.length > 0) {
        // We have at least one of our dependent fields pending a response - we have to block.
        this._blockingFocus = waitForFieldNames;
        
        
        this.delayCall("showValidationBlockingPrompt");
        return true;
    }
    return false;
},

// Called on a delay so execution occurs outside the "focus" thread.
// Don't show the prompt if this._blockingFocus has already been cleared
showValidationBlockingPrompt : function () {
    if (this._blockingFocus) isc.showPrompt(isc.RPCManager.validateDataPrompt);

},

// The following methods should be overridden by DBC implementations.
// These are used in validatorDefinition.action() methods to set the
// appearance of a field.
enableField : function (fieldName) {
    if (fieldName == null || isc.isAn.emptyString(fieldName)) return;
 
    var field = this.getField(fieldName);
    if (field) {
        field.disabled = false;
        this.redraw();
    }
},

disableField : function (fieldName) {
    if (fieldName == null || isc.isAn.emptyString(fieldName)) return;
 
    var field = this.getField(fieldName);
    if (field) {
        field.disabled = true;
        this.redraw();
    }
},

showField : function (fieldName) {
    if (fieldName == null || isc.isAn.emptyString(fieldName)) return;
 
    var field = this.getField(fieldName);
    if (field) {
        field.hidden = false;
        this.redraw();
    }
},

hideField : function (fieldName) {
    if (fieldName == null || isc.isAn.emptyString(fieldName)) return;
 
    var field = this.getField(fieldName);
    if (field) {
        field.hidden = true;
        this.redraw();
    }
},

setFieldCanEdit : function (fieldName, canEdit) {
    if (fieldName == null || isc.isAn.emptyString(fieldName)) return;
 
    var field = this.getField(fieldName);
    if (field) {
        field.canEdit = canEdit;
        this.redraw();
    }
}


});


// ------------------------------------------------------------------------------------------

//> @class MathFunction
// The definition of a function for use in the +link{FormulaBuilder}.  A function consists of 
// a name (what the user actually types to use the function), a description (shown in help) and 
// an actual JavaScript function that executes the calculation.
// <P>
// The built-in functions cover all static functionality on the JavaScript Math object:
// <ul>
// <li><b>max(val1,val2)</b>: Maximum of two values</li>
// <li><b>min(val1,val2)</b>: Minimum of two values</li>
// <li><b>round(value,decimalDigits)</b>: Round a value up or down, optionally providing 
//     <i>decimalDigits</i> as the maximum number of decimal places to round to.  For fixed 
//     or precision rounding, use <i>toFixed()</i> and <i>toPrecision()</i> respectively.
// </li>
// <li><b>ceil(value)</b>: Round a value up</li>
// <li><b>floor(value)</b>: Round a value down</li>
// <li><b>abs(value)</b>: Absolute value</li>
// <li><b>pow(value1,value2)</b>: value1 to the power of value2</li>
// <li><b>sin(value)</b>: Sine of a value</li>
// <li><b>cos(value)</b>: Cosine of a value</li>
// <li><b>tan(value)</b>: Tangent of a value</li>
// <li><b>ln(value)</b>: natural logarithm of a value</li>
// <li><b>log(base,value)</b>: logarithm of a value with the specified <i>base</i></li>
// <li><b>asin(value)</b>: Arcsine of a value</li>
// <li><b>acos(value)</b>: Arccosine of a value</li>
// <li><b>atan(value)</b>: Arctangent of a value (-PI/2 to PI/2 radians)</li>
// <li><b>atan2(value1,value2)</b>: Angle theta of a point (-PI to PI radians)</li>
// <li><b>exp(value)</b>: The value of E<sup>value</sup></li>
// <li><b>random()</b>: Random number between 0 and 1</li>
// <li><b>sqrt(value)</b>: Square root of a value</li>

// <li><b>toPrecision(value,precision)</b>: Format a number to a length of <i>precision</i> digits, 
//     rounding or adding a decimal point and zero-padding as necessary.  Note that the 
//     values 123, 12.3 and 1.23 have an equal precision of 3.  Returns a formatted string 
//     and should be used as the outermost function call in a formula. For rounding, use 
//     <i>round()</i>.
// </li>
// <li><b>toFixed(value,digits)</b>: Round or zero-pad a number to <i>digits</i> decimal places.  
//     Returns a formatted string and should be used as the outermost function call in a 
//     formula.  To round values or restrict precision, use <i>round()</i> and 
//     <i>toPrecision()</i> respectively.
// </li>
// </ul>
//
// @treeLocation Client Reference/Data Binding/FormulaBuilder
// @group formulaFields
// @visibility external
//<
isc.ClassFactory.defineClass("MathFunction", "Class");

// static properties and methods
isc.MathFunction.addClassProperties({
    

	_functions : {}                 // internal array to hold the list of registered functions
});


isc.MathFunction.addClassMethods({

//> @classMethod MathFunction.registerFunction()
// Registers a new math function for use with FormulaFields.
// @param newFunction (MathFunction)
// 
// @group formulaFields
// @visibility external
//<
registerFunction : function (newFunction) {
    if (!this._functions[newFunction.name]) {
        this._functions[newFunction.name] = newFunction;
    }
},

// Returns a list of all registered function-names
getRegisteredFunctionNames : function () {
    return isc.getKeys(this._functions);
},

// Returns a list of default function-names, sorted by defaultSortPosition
getDefaultFunctionNames : function () {
    var funcs = this.getDefaultFunctions(),
        index = funcs.makeIndex("name", false);
    return isc.getKeys(index);
},

// Returns a list of all registered functions
getRegisteredFunctions : function () {
    return isc.getValues(this._functions);
},

// Returns a list of default functions, order by defaultSortPosition
getDefaultFunctions : function () {
    var allFuncs = this.getRegisteredFunctions(),
        nonDefaults = allFuncs.findAll("defaultSortPosition", -1) || []
    ;

    for (var i=0; i<nonDefaults.length; i++) {
        var item = nonDefaults[i];
        allFuncs.remove(item);
    }

    allFuncs.sortByProperties(["defaultSortPosition"], ["true"]);
    return allFuncs;
},


//> @classMethod MathFunction.getRegisteredFunctionIndex()
// Returns an index of all registered functions by name
// 
// @return (Index)
// @group formulaFields
// @visibility external
//<
getRegisteredFunctionIndex : function () {
    var x = this.getRegisteredFunctions();
    var xIndex = x.makeIndex("name", false);
    return xIndex;
},

//> @classMethod MathFunction.getDefaultFunctionIndex()
// Returns an index of all default registered functions by name, ordered by 
// +link{mathFunction.defaultSortPosition}.
// 
// @return (Index)
// @group formulaFields
// @visibility external
//<
getDefaultFunctionIndex : function () {
    return this.getDefaultFunctions().makeIndex("name", false);
},

// Returns true if the named function is registered, false otherwise
isRegistered : function (name) {
    if (this._functions[name]) return true;
    return false;
}


});

isc.MathFunction.addProperties({
// attributes 
//> @attr mathFunction.name (identifier : null : IR)
// Name of the function (what the user actually types).  For example, a name of "min" would
// indicate that the user types "min(someValue)" to use this function.
// <P>
// Limited to lowercase characters only in this release.
// 
// @group formulaFields
// @visibility external
//<

//> @attr mathFunction.description (String : null : IR)
// A short description of this function
// 
// @group formulaFields
// @visibility external
//<

//> @attr mathFunction.jsFunction (Function : null : IR)
// Javascript method to perform the calculation associated with this function
// 
// @group formulaFields
// @visibility external
//<

//> @attr mathFunction.defaultSortPosition (integer : -1 : IR)
// Indicates the sort-order of this MathFunction in an index returned from static method 
// +link{MathFunction.getDefaultFunctionIndex()}.    Unlike , the result
// is an index of  to return
// a list of 
// 
// @group formulaFields
// @visibility external
//<
defaultSortPosition: -1

});

// register some built in functions
// This first bunch are default ones that appear in the help list in FormulaBuilders
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "max",
        description: "Maximum of two values",
        usage: "max(value1, value2)",
        defaultSortPosition: 1,
        jsFunction: function (value1, value2) {
            return Math.max(value1, value2);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "min",
        description: "Minimum of two values",
        usage: "min(value1, value2)",
        defaultSortPosition: 2,
        jsFunction: function (value1, value2) {
            return Math.min(value1, value2);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "round",
        description: "Round a value up or down, optionally providing <i>decimalDigits</i> " +
            "as the maximum number of decimal places to round to.  For fixed or precision " +
	        "rounding, use <i>toFixed()</i> and <i>toPrecision()</i> respectively.",
        usage: "round(value,decimalDigits)",
        defaultSortPosition: 3,
        jsFunction: function (value, decimalDigits) {
            if (decimalDigits) {
                var multiplier = Math.pow(10, decimalDigits),
                    result = Math.round(value * multiplier) / multiplier;

                return result;
            } 
            return Math.round(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "ceil",
        description: "Round a value up",
        usage: "ceil(value)",
        defaultSortPosition: 4,
        jsFunction: function (value) {
            return Math.ceil(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "floor",
        description: "Round a value down",
        usage: "floor(value)",
        defaultSortPosition: 5,
        jsFunction: function (value) {
            return Math.floor(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "abs",
        description: "Absolute value",
        usage: "abs(value)",
        defaultSortPosition: 6,
        jsFunction: function (value) {
            return Math.abs(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "pow",
        description: "Value1 to the power of Value2",
        usage: "pow(value1, value2)",
        defaultSortPosition: 7,
        jsFunction: function (value1, value2) {
            return Math.pow(value1, value2);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "sin",
        description: "Sine of a value",
        usage: "sin(value)",
        defaultSortPosition: 8,
        jsFunction: function (value) {
            return Math.sin(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "cos",
        description: "Cosine of a value",
        usage: "cos(value)",
        defaultSortPosition: 9,
        jsFunction: function (value) {
            return Math.cos(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "tan",
        description: "Tangent of a value",
        usage: "tan(value)",
        defaultSortPosition: 10,
        jsFunction: function (value) {
            return Math.tan(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "ln",
        description: "Natural logarithm of a value",
        usage: "ln(value)",
        defaultSortPosition: 11,
        jsFunction: function (value) {
            return Math.log(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "log",
        description: "logarithm of a value with the specified <i>base</i>",
        usage: "log(base, value)",
        defaultSortPosition: 12,
        jsFunction: function (base, value) {
            return Math.log(value) / Math.log(base);
        }
    })
);

// non-default functions (don't appear in the help list in FormulaBuilders)
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "asin",
        description: "Arcsine of a value",
        usage: "asin(value)",
        defaultSortPosition: 13,
        jsFunction: function (value) {
            return Math.asin(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "acos",
        description: "Arccosine of a value",
        usage: "acos(value)",
        defaultSortPosition: 14,
        jsFunction: function (value) {
            return Math.acos(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "atan",
        description: "Arctangent of a value (-PI/2 to PI/2 radians)",
        usage: "atan(value)",
        defaultSortPosition: 15,
        jsFunction: function (value) {
            return Math.atan(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "atan2",
        description: "Angle theta of a point (-PI to PI radians)",
        usage: "atan2(value1,value2)",
        defaultSortPosition: 16,
        jsFunction: function (value1, value2) {
            return Math.atan2(value1, value2);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "exp",
        description: "The value of E<sup>value</sup>",
        usage: "exp(value)",
        defaultSortPosition: 17,
        jsFunction: function (value) {
            return Math.exp(value);
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "random",
        description: "Random number between 0 and 1",
        usage: "random()",
        defaultSortPosition: 18,
        jsFunction: function () {
            return Math.random();
        }
    })
);
isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "sqrt",
        description: "Square root of a value",
        usage: "sqrt(value)",
        defaultSortPosition: 19,
        jsFunction: function (value) {
            return Math.sqrt(value);
        }
    })
);

isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "toPrecision",
        description: "Format a number to a length of <i>precision</i> digits, rounding or " +
            "adding a decimal point and zero-padding as necessary.  Note that the values " +
            "123, 12.3 and 1.23 have an equal precision of 3.  Returns a formatted " +
            "string and should be used as the outermost function call in a formula. " +
            "For rounding, use <i>round()</i>.",
        usage: "toPrecision(value,precision)",
        defaultSortPosition: 20,
        jsFunction: function (value, precision) {
            var localValue=value;
            if (isc.isA.String(localValue)) localValue = parseFloat(localValue);
            if (isNaN(localValue)) return value;
            return localValue.toPrecision(precision);
        }
    })
);

isc.MathFunction.registerFunction(
    isc.MathFunction.create({
        name: "toFixed",
        description: "Round or zero-pad a number to <i>digits</i> decimal places.  Returns " +
            "a formatted string and should be used as the outermost function call in a " +
            "formula.  To round values or restrict precision, use <i>round()</i> and " +
            "<i>toPrecision()</i> respectively.",
        usage: "toFixed(value,digits)",
        defaultSortPosition: 21,
        jsFunction: function (value, digits) {
            var localValue=value;
            if (isc.isA.String(localValue)) localValue = parseFloat(localValue);
            if (isNaN(localValue)) return value;
            return localValue.toFixed(digits);
        }
    })
);


//> @object TestFunctionResult
// A TestFunctionResult is an ordinary JavaScript Object with properties that indicate the 
// status of an attempt to generate and execute a function for +link{FormulaBuilder} and 
// it's subclasses.
// <P>
// Because TestFunctionResult is always an ordinary JavaScript Object, it supports the
// normal behaviors of JavaScript Objects, including accessing and assigning to properties
// via dot notation:
// <pre>
//     var propValue = testFunctionResult.<i>propName</i>;
//     testFunctionResult.<i>propName</i> = newValue;
// </pre>
// <P>
// 
// @treeLocation Client Reference/Data Binding/FormulaBuilder
// @group formulaFields
// @visibility external
//<

//> @attr testFunctionResult.failedGeneration (boolean : false : IRW)
// Set to true if there is a syntax error in the formula or summary being checked.
// <P>
// When set to true, +link{testFunctionResult.errorText} contains the exception message.
//
// @group formulaFields
// @visibility external
//<

//> @attr testFunctionResult.failedExecution (boolean : false : IRW)
// Set to true if calling the formula or summary format resulted in a JavaScript Error.
// This would generally indicate a reference to non-existent data values.  See 
// +link{testFunctionResult.failedGeneration} for other types of failure.
// <P>
// When set to true, +link{testFunctionResult.errorText} contains the exception message.
//
// @group formulaFields
// @visibility external
//<

//> @attr testFunctionResult.emptyTestValue (boolean : false : IRW)
// Set to true if the formula or summary definition passed in was empty.
//
// @group formulaFields
// @visibility external
//<

//> @attr testFunctionResult.errorText (string : null : IRW)
// If the formula or summary format caused a JavaScript error, this contains the JavaScript error text.
//
// @group formulaFields
// @visibility external
//<

//> @attr testFunctionResult.result (string : null : IRW)
// When a formula or summary format is valid, <i>result</i> contains the result returned by the
// generated function when it was executed.
//
// @group formulaFields
// @visibility external
//<

//> @attr testFunctionResult.record (Record : null : IRW)
// Set to the record that was used when testing the generated function.  This is the record
// selected by +link{formulaBuilder.getTestRecord()}.
//
// @group formulaFields
// @visibility external
//<

isc.Canvas.registerStringMethods({
    //> @method databoundComponent.userAddedField
    // Notification method fired when a user-generated field is added to this component via
    // +link{editFormulaField()} or +link{editSummaryField()}.
    // <P>
    // Returning false from this method will prevent the field being added at all. Note that
    // this also provides an opportunity to modify the generated field object - any changes
    // made to the field parameter will show up when the field is displayed in the ListGrid.
    //
    // @param	field	   (ListGridField)	User generated summary or formula field
    // @return (boolean) Return false to cancel the addition of the field
    // @group formulaFields
    // @group summaryFields
    // @visibility external
    //<
    
    userAddedField:"field",

    //> @method dataBoundComponent.selectionUpdated()
    // Called when selection changes. Note this method fires exactly once for any given
    // change unlike the +link{ListGrid.selectionChanged,selectionChanged} event.
    // <P>
    // This event is fired once after selection/deselection has completed. The result is
    // one event per mouse-down event. For a drag selection there will be two events fired:
    // one when the first record is selected and once when the range is completed.
    // <P>
    // This event is also fired when selection is updated by a direct call to one of the
    // DataBoundComponent select/deselect methods. Calls on the +link{class:Selection} object
    // <b>do not</b> trigger this event.
    //
    // @param record        (object)                 first selected record, if any
    // @param recordList    (array of object)        List of records that are now selected
    // @group selection
    // @visibility external
    //<    
    selectionUpdated : "record,recordList",
    
    //> @method dataBoundComponent.onFetchData()
    // Optional notification stringMethod fired on fetchData() or filterData()
    // the filter editor criteria.
    // @param criteria (Criteria) criteria passed to fetchData() / filterData()
    // @param requestProperties (DSRequest) request config passed to the filter/fetch request 
    // @visibility sgwt
    //<
    
    onFetchData:"criteria,requestProperties"

});


