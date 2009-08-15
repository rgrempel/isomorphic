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

 




//> @class NestedListEditorItem
// Form item which renders a list of complex sub-objects in an embedded component.  By default,
// the embedded component is a +link{class:ListEditor}
// @treeLocation Client Reference/Forms/Form Items
// @visibility external
//<
isc.ClassFactory.defineClass("NestedListEditorItem", "CanvasItem");
isc.NestedListEditorItem.addProperties({
    
    shouldSaveValue: true,
    
  	//> @attr	nestedListEditorItem.editor		(AutoChild : null : [IRW])
    //
    // The editor that will be rendered inside this item.  Unless overridden, the editor will be
    // an instance of the type named in +link{DynamicForm.nestedListEditorType}. It will be created
    // using the overrideable defaults standard to the +link{group:autoChildren,AutoChild}
    // subsystem - editorConstructor and editorProperties.
    //
    //  @visibility external
	//<
    
    editorDefaults: {
        
        inlineEdit: false,
        
        saveRecord : function () {
            if (!this.form.validate()) return false;
            var values = this.form.getValues();  
        
            this.showList(); 
            
            if (this.inlineEdit) {
                // User clicked "Save" in "More" mode
                this.list.setEditValues(this.list.getEditRow(), values);
            } else {
                if (this.form.saveOperationType == "add") { // new record
                    this.list.addData(values);
                } else {
                    // Avoid updating via updateData, it requires primary keys
                    isc.addProperties(this.currentRecord, values);
                    this.list.markForRedraw();
                }
                 
                if (!this.inlineEdit) {
                    this.form.clearValues();
                }
                    
                this.creator.updateValue(this.list.data);
            }
            
            return true;
        }
            
    }
    
});

isc.NestedListEditorItem.addMethods({
    init : function () {
        this._createEditor();
        this.Super("init", arguments);
    },
    
    isEditable : function () {
        return true;
    },

    _createEditor : function() {
        
        var _constructor = this.editorConstructor || isc.DynamicForm.nestedListEditorType;
        var ds;
        var dynProps = {};
        
        if (this.form.dataSource) { // Should be, otherwise how have we ended up with a complex field?
            ds = isc.DataSource.getDataSource(this.form.dataSource);
            var field = ds.getField(this.name);
            if (field) {
                dynProps.dataSource = field.type;
            }
        }
        
        if (this.form && this.form.showComplexFieldsRecursively) {
            dynProps.formProperties = {
                showComplexFields: true,
                showComplexFieldsRecursively: true
            };
            dynProps.listProperties = {
                showComplexFields: true,
                showComplexFieldsRecursively: true,
                canRemoveRecords: true,
                saveLocally: true
            };
        } else {
            dynProps.formProperties = {
                showComplexFields: false
            };
            dynProps.listProperties = {
                showComplexFields: false,
                canRemoveRecords: true,
                saveLocally: true
            };
        }
        
        this.addAutoChild("editor", dynProps, _constructor);
        this.canvas = this.editor;        
    
    },
    
    updateValue : function(data) {
        this.editor.setData(data);
        this._updateValue(data);
    },
    
    setValue : function(data) {
        this.editor.setData(data);
        this.Super("setValue", arguments);
    }
});

