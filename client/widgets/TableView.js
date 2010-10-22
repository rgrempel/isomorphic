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




//> @class TableView
// Shows a listing of records with one or more fields from each record shown, with
// built-in support for navigation and editing of lists of records.
// <p/>
// The TableView provides built-in controls such as +link{showNavigation,navigation arrows} and
// shows fields from the provided records in one of several built-in +link{type:RecordLayout}s.
// 
// @treeLocation Client Reference/Grids
// @visibility tableView
//<

isc.ClassFactory.defineClass("TableView", "ListGrid");

isc.TableView.addClassProperties({

    //> @type TableStyle
    // Controls the style of TableView record display
    // @value  TableView.PLAIN    The default style which displays a list of rows
    PLAIN:"plain",
    // @value  TableView.GROUPED  Grouped table is a set of rows embedded in a rounded rectangle
    GROUPED:"grouped",
    // @visibility tableView
    //<
     
    //> @type RecordLayout
    // Controls the style of TableView record display
    // @value  TableView.TITLE_ONLY  Show +link{titleField, title field} only
    TITLE_ONLY:"titleOnly",
    // @value  TableView.TITLE_DESCRIPTION  Show +link{titleField, title} and 
    //                                      +link{descriptionField, description} fields only
    TITLE_DESCRIPTION:"titleAndDescription",
    // @value  TableView.SUMMARY_INFO  Show +link{titleField, title}, 
    //                                      +link{descriptionField, description} and
    //                                      +link{infoField, info} fields only
    SUMMARY_INFO:"summaryInfo",
    // @value  TableView.SUMMARY_DATA  Show +link{titleField, title}, 
    //                                      +link{descriptionField, description} and
    //                                      +link{dataField, data} fields only
    SUMMARY_DATA:"summaryData",
    // @value  TableView.SUMMARY_DATA  Show +link{titleField, title}, 
    //                                      +link{descriptionField, description},
    //                                      +link{infoField, info} and
    //                                      +link{dataField, data} fields similar to the
    //                                      iPhoneOS Mail application
    SUMMARY_FULL:"summaryData",
    // @visibility tableView
    //<
     
    //> @type NavigationStyle
    // Controls the navigation style of records.
    // @value  TableView.WHOLE_RECORD Clicking anywhere on the record navigates
    WHOLE_RECORD: "wholeRecord",
    // @value  TableView.NAVICON_ONLY Only clicking directly on the navigation icon
    //                                triggers navigation
    NAVICON_ONLY: "navIconOnly"
    // @visibility tableView
    //<

});

isc.TableView.addProperties({

    //> @attr tableView.iconField  (String : "icon" : IRW)
    // This property allows the developer to specify the icon displayed next to a record.
    // Set <code>record[tableView.iconField]</code> to the URL of the desired icon to display.
    //
    // @visibility tableView
    //<
    iconField: "icon",

    //>	@attr tableView.showIconfield  (boolean : true : IRW)
    // Should an icon field be shown for each record? Only applies if +link{iconField}
    // is specified and the record has an icon specified in the corresponding field.
    //
    // @visibility tableView
    //<	
    showIconField: true,
    
    //> @attr tableView.titleField  (String : "title" : IRW)
    // Field to display for an individual record as the main title.
    //
    // @visibility tableView
    //<
    titleField: "title",

    //>	@attr tableView.recordNavigationProperty  (String : "_navigate" : IRW)
    // Boolean property on each record that controls whether navigation controls are shown for
    // that record.
    //
    // @visibility tableView
    //<	
    recordNavigationProperty: "_navigate",

    //> @attr tableView.tableStyle  (TableStyle : "plain" : IRW)
    // The style of the table.
    //
    // @visibility tableView
    //<	
    tableStyle: isc.TableView.PLAIN,

    //> @attr tableView.recordLayout (RecordLayout : "titleOnly" : IRW)
    // Sets the arrangement of data fields from the record.
    // <p/>
    // Note that controls supported by the TableView itself, such as navigation icons, are
    // implicitly added to the data fields described in the RecordLayout.  If an
    // +link{iconField} has been configured, it too is an implicitly shown field, to the left
    // of the area controlled by RecordLayout.
    //
    // @visibility tableView
    //<
    recordLayout: isc.TableView.TITLE_ONLY,

    //> @attr tableView.navIcon (SCImgURL : "[SKINIMG]/iOS/listArrow_button.png" : IRW)
    // The navigation icon shown next to records when
    // +link{showNavigation} is true and +link{navigationStyle} is set to
    // "navIconOny".
    //
    // @visibility tableView
    //<
    navIcon: "[SKINIMG]/iOS/listArrow_button.png",
    
    //> @attr tableView.wholeRecordNavIcon (SCImgURL : "[SKINIMG]/iOS/listArrow.png" : IRW)
    // The navigation icon shown next to records when +link{showNavigation}
    // is true and +link{navigationStyle} is set to "wholeRecord".
    //
    // @visibility tableView
    //<
    wholeRecordNavIcon: "[SKINIMG]/iOS/listArrow.png",

    //> @attr tableView.showNavigation (boolean : null : IRW)
    // Whether to show navigation controls by default on all records.  Can also be configured
    // per-record with +link{recordNavigationProperty}.
    //
    // @visibility tableView
    //<
    

    //> @attr tableView.navigationStyle (NavigationStyle : "wholeRecord" : IRW)
    // Set navigation style for this TableView.
    //
    // @visibility tableView
    //<
    navigationStyle: isc.TableView.WHOLE_RECORD,

    // DEFAULT GRID STYLING --------------------------------------------------

    // disable canAddFormulaField / canAddSummaryField
    canAddFormulaFields:false,
    canAddSummaryFields:false,
        
    showHeader: false,

    // Selection management done by tableView.recordClick handler
    selectionType: "none",
    
    skinImgDir: "images/iOS/",
    baseStyle: "tableCell",
    border: "0px",

    // don't wrap, as that will mess up the look of the trees
    wrapCells: false,
    cellHeight: 44,
    alternateRecordStyles: false,

    
    ignoreEmptyCriteria: false
});

isc.TableView.addMethods({    
    
    initWidget : function () {
        this.Super("initWidget", arguments);

        this.columns = [];

        // Icon column
        if (this.showIconField) {
            this._iconCell = this.columns.length;
            this.columns[this.columns.length] = {
                name: this.iconField,
                width: 50,
                imageSize: 30,
                align: "center",
                type: "image"
            };
        }

        // Title column
        this.columns[this.columns.length] = {
            name: this.titleField,
            width: "*",
            type: "text"
        };

        // Navigation icon column
        this._navigateCell = this.columns.length;
        this.columns[this.columns.length] = {
            name: "navigateField",
            width: 54,
            align: "right",
            formatCellValue : function (value, record, rowNum, colNum, grid) {
                if (grid.getShowNavigation(record)) {
                    var icon = isc.Img.create({
                        autoDraw: false,
                        autoFit: true,
                        imageType: "normal",
                        src: grid.getNavigationIcon(record)
                    });
                    return icon.getInnerHTML();
                }
                return "&nbsp;";
            } 
        };

        if (this.recordLayout == isc.TableView.TITLE_ONLY) {
        }

        this.setFields(this.columns);
    },

    //> @method tableView.getNavigationIcon
    // Icon to display as a NavigationIcon per record. Default behavior returns
    // +link{navIcon} or +link{wholeRecordNavIcon} depending on
    // +link{navigationStyle} but could be overridden to customize this
    // icon on a per-record basis.
    //
    // @param record (Record) the record
    // @return (Image) the image
    //<
    getNavigationIcon : function (record) {
        return (this.navigationStyle == isc.TableView.NAVICON_ONLY 
            ? this.navIcon 
            : this.wholeRecordNavIcon);
    },

    //> @method tableView.getShowNavigation
    // Whether to show navigation controls for some specific record. If the
    // +link{recordNavigationProperty, record navigation property} is set
    // on the record in question, this will be respected, otherwise will return the
    // result of the value set via +link{showNavigation}.
    //
    // @param record (Record) record to be checked for navigation state
    // @return (boolean) true if navigation controls should be shown for this record
    //<
    getShowNavigation : function (record) {
        if (record) return record[this.recordNavigationProperty];
        return this.showNavigation;
    },

    canSelectRecord : function (record) {
        return this.body.canSelectRecord(record);
    },

    recordClick : function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
        if (fieldNum != this._iconCell &&
            fieldNum != this._nagivateCell &&
            this.canSelectRecord(record))
        {
            this.selectSingleRecord(record);
        }

        if (fieldNum == this._navigateCell || this.navigationStyle == isc.TableView.WHOLE_RECORD) {
	    if (this.recordNavigationClick) {
		// CALLBACK API:  available variables:  "record"
		// Convert a string callback to a function
		isc.Func.replaceWithMethod(this, "recordNavigationClick", "record");
                this.recordNavigationClick(record);
            }
        } else if (fieldNum == this._iconCell) {
	    if (this.imageClick) {
		// CALLBACK API:  available variables:  "record"
		// Convert a string callback to a function
		isc.Func.replaceWithMethod(this, "imageClick", "record");
                this.imageClick(record);
            }
        }

    }
});

isc.TableView.registerStringMethods({
    //> @method tableView.recordNavigationClick
    // Executed when the user clicks on a record, or on the navigate icon for a
    // record depending on +link{navigationStyle}.
    //
    // @param  record (ListGridRecord)  record clicked
    // @visibility tableView
    //<
    recordNavigationClick : "record",

    //> @method tableView.imageClick
    // Executed when the user clicks on the image displayed in a record if
    // +link{iconField} has been specified.
    //
    // @param  record (ListGridRecord)  record clicked
    // @visibility tableView
    //<
    imageClick : "record"
});
