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

 



//> @groupDef viewFile
//<

//>	@class ViewFileItem
//
// Item for displaying the contents of "imageFile" fields in DynamicForms. 
// <P>
// Displays one of two UIs, according to the value of 
// +link{viewFileItem.showFileInline, showFileInline}.  If showFileInline is false, this Item
// displays the View and Download icons and the filename.  Otherwise, it streams the image-file 
// and displays it inline.
//
// @group upload
// @treeLocation Client Reference/Forms/Form Items
// @visibility external
//<
isc.ClassFactory.defineClass("ViewFileItem", "CanvasItem");

isc.ViewFileItem.addProperties({

    shouldSaveValue: false,
    colSpan: "*",
    height: 20,
    width: "*",
    overflow: "visible",

    //> @attr viewFileItem.showFileInline    (boolean : null : [IR])
    // Indicates whether to stream the image and display it
    // inline or to display the View and Download icons.
    // 
    // @visibility external
    //<

    canvasDefaults: {
        _constructor: "Canvas",
        height: 10, width: "100%"
    },

    isEditable : function () {
        return false;
    },
    
    init : function () {
        this.addAutoChild("canvas");
        this.Super('init', arguments);
    },

    setValue : function(data) {
        var form = this.form,
            record = form.getValues();

        if (this.type == "imageFile" && this.showFileInline != false) {
            this.canvas.setHeight("*");
            this.canvas.setWidth("*");
            this.canvas.setContents(this.getImageHTML() || "&nbsp;");
        } else {
            if (this.showFileInline == true) { // non-imageFile field
	            this.logWarn("setValue(): Unsupported field-type for showFileInline: " +this.type);
            }
            this.canvas.setHeight(20);
            this.canvas.setWidth("*");
            this.canvas.setContents(this.getViewDownloadHTML(data, record) || "&nbsp;");
        }
        this.Super("setValue", arguments);
    },

    getViewDownloadHTML : function (value, record) {

        if (isc.isA.String(value)) return value;
        if (record == null) return null;

        var name = record[this.name + "_filename"];

        
        if (name == null || isc.isA.emptyString(name)) return this.emptyCellValue;
        var viewIconHTML = isc.Canvas.imgHTML("[SKIN]actions/view.png", 16, 16, null,
                        "style='cursor:"+isc.Canvas.HAND+"' onclick='"+this.getID()+".viewFile()'");
        var downloadIconHTML = isc.Canvas.imgHTML("[SKIN]actions/download.png", 16, 16, null,
                        "style='cursor:"+isc.Canvas.HAND+"' onclick='"+this.getID()+".downloadFile()'");

        return "<nobr>" + viewIconHTML + "&nbsp;" + downloadIconHTML + "&nbsp;" + name + "</nobr>";
    },

    getImageHTML : function () {
        var record = this.form.getValues(),
            field = this.form.getField(this.name),
            urlProperty = this.name + "_imgURL",
            value;

        if (!record[this.name]) return " ";

        if (!record[urlProperty]) {
            var dimensions = isc.Canvas.getFieldImageDimensions(field, record);
            
            value = record[urlProperty] = 
                isc.Canvas.imgHTML(this.form.getDataSource().streamFile(record, field.name),
                    dimensions.width, dimensions.height);
        } else 
            value = record[urlProperty];

        return value;
    },

    viewFile : function () {
        isc.DS.get(this.form.dataSource).viewFile(this.form.getValues(), this.name);
    },

    downloadFile : function () {
        isc.DS.get(this.form.dataSource).downloadFile(this.form.getValues(), this.name);
    }

});
