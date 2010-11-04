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

 





//>	@class	SearchForm
//
// A SearchForm is a DynamicForm specialized for a user to enter search criteria.
// <P>
// All DynamicForm properties and methods work on SearchForm.  SearchForm extends and
// specializes DynamicForm for searching, for example, SearchForm sets
// <code>hiliteRequiredFields</code> false by default because fields are typically required in
// a search.
// 
// @see class:DynamicForm
//
// @treeLocation Client Reference/Forms
// @visibility external
//<


// create the form as a descendant of the DynamicForm
isc.ClassFactory.defineClass("SearchForm", "DynamicForm");

// add constants
isc.SearchForm.addProperties({
    // hiliteRequiredFields - false
    // Don't hilight required fields in bold by default.
    hiliteRequiredFields:false,

    // if there are operation-specific schema on a DataSource we're binding to, use the fetch
    // schema
    operationType:"fetch",
    
    // This flag allows editing of canSave:false fields
    _canEditUnsaveableFields:true
});    

isc.SearchForm.addMethods({
    // When creating DateItems, show the text field by default (unless the definition block
    // explicitly says otherwise)
    
    _$DateItem:"DateItem",
    createItem : function (item, type, a,b,c) {
        var ds = this.getDataSource(),
            isDSField = ds ? ds.getField(item[this.fieldIdProperty]) != null : false;
        
        // If we're looking at a dataSource field, ensure the user can always enter a null value
        // (Allows searching for all entries in boolean / date / valueMapped fields)
        if (isDSField) {
            // convert from a simple object into a FormItem
            var className = isc.FormItemFactory.getItemClassName(item, type, this),
                classObject = isc.FormItemFactory.getItemClass(className);
            
            if (classObject == isc.DateItem && item && (item.useTextField == null)) 
                item.useTextField = true;
            
            // Default to allowing empty values, unless explicitly set on the item
            if (item.allowEmptyValue == null) item.allowEmptyValue = true;
        }
        
        return this.invokeSuper(isc.SearchForm, "createItem", item, type, a,b,c);
    },
    
    submitValues : function (values, form) {
        if (this.search != null) {
            return this.search(this.getValuesAsCriteria(), this);
        }
    },

    validate : function (a, b, c) {
        if (this.validateTypeOnly) {
            return this.invokeSuper(isc.SearchForm, "validate", a, b, true);
        } else {
            return this.invokeSuper(isc.SearchForm, "validate", a, b, c);
        }
    },
    
    // override getEditorType() so we can default date fields to using the DateRangeItem
    getEditorType : function (field) {
        var type = field.type;
        
        if (type == "date") return "DateRangeItem";
        return this.Super("getEditorType", arguments);
    }

    
});

isc.SearchForm.addProperties({
    //> @attr searchForm.showFilterFieldsOnly (boolean : true : IRWA)
    // @include dataBoundComponent.showFilterFieldsOnly
    // @visibility external
    //<
    showFilterFieldsOnly:true,
    
    //> @attr searchForm.validateTypeOnly (boolean : true : IRWA)
    // If true (the default), calls to the <code>SearchForm</code>'s <code>validate()</code> 
    // method will validate only field types (ie, is the value a valid string, a valid number,
    // or whatever); any other validations are skipped.
    //
    // @visibility internal
    //<
    //> IDocument Leaving unexposed for now //< IDocument
    validateTypeOnly:true
});

isc.SearchForm.registerStringMethods ({
	//>	@method SearchForm.search()
    // Triggered when a SubmitItem is included in the form is submitted and gets pressed.
    // 
    // @param	criteria  (Criteria)      the search criteria from the form
    // @param	form      (SearchForm)    the form being submitted
    // @group submitting
    // @see method:dynamicForm.submit()
    // @see method:dynamicForm.submitValues()
    // @visibility external
	//<
    search : "criteria,form"
});

