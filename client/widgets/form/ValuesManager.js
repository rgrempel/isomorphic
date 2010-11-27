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

 


//>	@class	ValuesManager
//
// The ValuesManager manages data from multiple member forms.
// <P>
// If a single logical form needs to be separated into multiple DynamicForm instances for
// Layout purposes (for example, spanning one logical form across multiple Tabs), a
// ValuesManager can be used to make the forms act as one logical form, supporting all
// value-related APIs otherwise called on DynamicForm directly.
// <P>
// A ValuesManager has no visual representation - it is strictly a logical entity, and the
// member forms provide the user interface.  You can initialize a ValuesManager with a set of
// member forms (by setting +link{ValuesManager.members} at init) or add and remove member
// forms dynamically.
// <P>
// Calling +link{ValuesManager.setValues()} on a ValuesManager will automatically route new
// field values to whichever member form is showing an editor for that field.  Likewise,
// calling +link{ValuesManager.validate()} will validate all member forms, and
// +link{ValuesManager.saveData()} will initiate a save operation which aggregates values from
// all member forms.
// <P>
// Like a DynamicForm, a ValuesManager can be databound by setting
// +link{valuesManager.dataSource}.  In this case all member forms must also be bound to the
// same DataSource.
// <P>
// In general, when working with a ValuesManager and its member forms, call APIs on the
// ValuesManager whenever you are dealing with values that span multiple forms, and only call
// APIs on member forms that are specific to that form or its fields.
// <P>
// Note that, just as a DynamicForm can track values that are not shown in any FormItem, a
// ValuesManager may track values for which there is no FormItem in any member form.  However,
// when using a ValuesManager these extra values are only allowed on the ValuesManager itself.
// Member forms will not track values for which they do not have FormItems.
//
// @treeLocation Client Reference/Forms
// @visibility external
// @example formSplitting
//<
isc.ClassFactory.defineClass("ValuesManager");

isc.ValuesManager.addProperties({

    //>@attr  valuesManager.dataSource  (DataSource | string : null : [IRWA])
    // Specifies a dataSource for this valuesManager.  This dataSource will then be used for
    // validation and client-server flow methods.  Can be specified as a dataSource object or
    // an identifier for the dataSource.<br>
    // Note that member forms should have the same dataSource applied to them to allow their
    // items to inherit properties from the DataSource fields.
    // @visibility external
    // @see valuesManager.setDataSource()
    // @see valuesManager.getDataSource()
    //<
    //dataSource : null,
    
    //>@attr  valuesManager.members (Array : null : [IRW])
    // The set of member forms for this valuesManager.  These can be specified at init time via
    // the <code>members</code> property, or updated at runtime via <code>addMember()</code> and
    // <code>removeMember()</code>.<br>
    // Note: Alternatively a form can be initialized as a member of a valuesManager by setting
    // the <code>valuesManager</code> property of the form to a pre-defined valuesManager
    // instance.
    // @visibility external
    // @see valuesManager.addMember()
    // @see valuesManager.removeMember()
    //<
    //members : null,    
    
    //>	@attr	valuesManager.unknownErrorMessage	(string : null : [IRW])
    // The error message for a failed validator that does not specify its own errorMessage.
    // <P>
    // If unset this value will be derived from the default 
    // +link{dataBoundComponent.unknownErrorMessage} when the valuesManager is initialized.
    //<
	unknownErrorMessage : null
    
    //> @attr valuesManager.disableValidation   (boolean : null : [IRWA])
    // @include DynamicForm.disableValidation
    //<

});

//!>Deferred
isc.ValuesManager.addMethods({
    // Allow a V.M to be initialized with member form(s)
    init : function () {
        // get a global ID so we can be called in the global scope
        this.ns.ClassFactory.addGlobalID(this);
        
        if (this.unknownErrorMessage == null) {
            this.unknownErrorMessage = isc.Canvas.getPrototype().unknownErrorMessage;
        }
        
        if (this.dataSource) this.bindToDataSource(this.dataSource);

        // Initialize this.values [and ensure it's a new object, so it can't be manipulated
        // externally]
        this.values = isc.addProperties({}, this.values);

        // Set up values based on members / init values.
        if (this.members != null) {
            
            var members = this.members;
            this.members = null;
            if (!isc.isAn.Array(members)) members = [members];
            for (var i = 0; i < members.length; i++) {
                this.addMember(members[i]);
            }
        }
        // remember the current values for resetting
        this.rememberValues();
    },
    
    // on destroy
    // - disconnect from member forms (Don't destroy - they may want to be re-used in a 
    //   different VM)
    // - clear global ID
    destroy : function () {
        var members = this.members;
        if (members) {
            // iterate backwards so the changing length of the members array doesn't mess up
            // our loop
            for (var i = members.length-1; i >= 0; i--) {
                this.removeMember(members[i]);
            }
        }
        // clear the global ID
        window[this.getID()] = null;

    },
    
    // given a member with dataArity:"multiple", 
    _updateMultipleMemberValue : function (index, field, value, member) {
        field = (field != null) ? this._combineDataPaths(index,field) : index;
        return this._updateValue(field, value, member);
    },
    
    // _updateValue and _clearValue() -- called by member forms to notify us of field value 
    // changes
    _updateValue : function (field, value, member) {
           
        // warn on value with no associated items in dynamicForms
        if (isc.isA.DynamicForm(member) && member.getItem(field) == null) {
            this._itemlessValueWarning(member, field);
            return;
        }
        
        var isDataPath;
        // if the form has a dataPath, prepend it to the fieldName/dataPath passed in so we
        // store values hierarchically
        var dataPath = member.getFullDataPath();
        if (dataPath) {
            field = (field != null) ? this._combineDataPaths(dataPath, field) : dataPath;
            isDataPath = true;
        } else isDataPath = field.contains(isc.Canvas._$slash);
        
        if (!isDataPath) {
            this.values[field] = value;
        } else {
            isc.DynamicForm._saveFieldValue(field, value, this.values);
        }        
    },
    _combineDataPaths : function (baseDP, fieldDP) {
        return isc.DynamicForm._combineDataPaths(baseDP, fieldDP);
    },
    // fieldName may be an array of field IDs
    _itemlessValueWarning : function (member, fieldName) {
        this.logWarn("Member Form: " + member +
                 " has explicitly specified value for field[s] '" + fieldName + "', but has" +
                 " no item associated with this fieldName. Ignoring this value. " +
                 "Values may be set for fields with no associated form item directly " + 
                 "on the valuesManager via valuesManager.setValues(), but not on " +
                 "member forms. See ValuesManager documentation for more info.");
    },

    _clearValue : function (field, form) {
        
        var dataPath = form.getFullDataPath();
        if (dataPath) field = this._combineDataPaths(dataPath, field);
        return isc.DynamicForm._clearFieldValue(field, this.values);
    },
    
    // ----------------------------------------------------------------------------------------
    // Databound functionality
    // ----------------------------------------------------------------------------------------
    
    //> @method ValuesManager.bindToDataSource() ([A])
    //   Associate this ValuesManager with a DataSource.  Allows the developer to inherit 
    //   properties from the DataSource fields to be applied to these values, such as validators,
    //   and to call data flow methods using this ValuesManager's data.
    // @param (dataSource)  Datasource object, or identifier
    // @visibility internal
    //<
    // For the public version of this method use 'setDataSource'
    bindToDataSource : function (ds) {

        
        if (!isc.isA.DataSource(ds)) ds = isc.DataSource.getDataSource(ds);
        if (ds != null) this.dataSource = ds;
    },
  
    //>@method  valuesManager.setDataSource() (A)
    // Specifies a dataSource for this valuesManager.  This dataSource will then be used for
    // validation and client-server flow methods.
    // @visibility external
    // @param dataSource (string | DataSource)  Datasource object or identifier to bind to.
    //<
    setDataSource : function (dataSource, fields) {
        // we don't use 'fields'
        this.bindToDataSource(dataSource);
    },
    
    //>@method  valuesManager.getDataSource() (A)
    // Returns the dataSource for this valuesManager.  Will return null if this is not a 
    // data-bound valuesManager instance.
    // @visibility external
    // @return (DataSource)  Datasource object for this valuesManager.
    //<
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
    
    lookupSchema : function () {
        // see if we have a WebService instance with this serviceName / serviceNamespace
        var service;
        if (this.serviceName) service = isc.WebService.getByName(this.serviceName, this.serviceNamespace);
        else service = isc.WebService.get(this.serviceNamespace);
    
        if ((this.serviceNamespace || this.serviceName) && service == null) {
            this.logWarn("Could not find WebService definition: " +
                         (this.serviceName ? "serviceName: " + this.serviceName : "") +
                         (this.serviceNamespace ? "   serviceNamespace: " + this.serviceNamespace : "")
                         + this.getStackTrace());
        }
        
        // If this.dataSource is not a String, we shouldn't have ended up here
        if (!isc.isA.String(this.dataSource)) {
            this.logWarn("this.dataSource was not a String in lookupSchema");
            return;
        }
        
        if (service) return service.getSchema(this.dataSource);
    },
    
    // support retrieving a pointer to a field object defined in a dataSource by fieldID / dataPath
    
    getDataSourceField : function (fieldID) {
        var ds = this.getDataSource();
        if (!ds || !fieldID) return null;
        
        fieldID = fieldID.trim("/");
        var dataSource = this.getDataSource(),
            segments = fieldID.split("/"),
            field;
        for (var i = 0; i < segments.length; i++) {
            if (isc.isAn.emptyString(segments[i])) continue;
            var fieldId = segments[i];
            field = dataSource.getField(fieldId);
            dataSource = field ? isc.DataSource.getDataSource(field.type) : dataSource;
        }
        return field;
    },
    
    
    //>@method valuesManager.getItems()
    // Retrieves all form items contained within this valuesManager's member forms
    // @return (array of FormItems) form items present in this valuesManager
    //<
    getItems : function () {
        if (!this.members) return;
        var items = [];
        for (var i = 0; i < this.members.length; i++) {
            var form = this.members[i];
            if (!form.getItems) continue;
            items.addList(form.getItems());
        }
        return items;
    },
    // getFields() synonym of getItems
    getFields : function () {
        return this.getItems();
    },
    
    // Getting pointers to actual items
    //>@method ValuesManager.getItem()
    // Retrieve a +link{FormItem} from this ValuesManager.
    // <P>
    // Takes a field +link{formItem.name,name} or +link{type:dataPath}, and searches through the
    // members of this valuesManager for an editor for that field. If found the appropriate
    // formItem will be returned. Note that if a dataPath is passed in, it should be the full
    // data path for the item, including any canvas level +link{canvas.dataPath,dataPath} specified
    // on the member form containing this form item.
    // <br>Note: Unlike the <code>DynamicForm</code> class, this method will not return an 
    // item by index
    // @param itemID (fieldName | dataPath) item fieldName or dataPath identifier
    // @return (formItem) form item for editing/displaying the appropriate field, or null if 
    //  no formItem can be found for the field.
    // @visibility external
    //<
    getItem : function (name) {
        return this._findMemberByField(name, true);
    },
    
    getField : function (id) {
        return this.getItem(id);
    },
        
    //>@method  ValuesManager.getMembers()   
    //  Retrieves an array of pointers to all the members for this valuesManager.
    // @return (array)   array of member forms
    // @visibility external
    // @group members
    //<    
    getMembers : function () {
        return this.members;
    },
    
    //>@method  ValuesManager.getMember()
    //  Returns a pointer to a specific member.
    // @param   ID  (string)    ID of the member component to retrieve
    // @return (Canvas)   member (or null if unable to find a member with the 
    // specified ID).
    // @visibility external
    // @group members
    //<
    
    getMember : function (ID) {
        // Since the members are all DynamicForm instances, their IDs are global
        var member = window[ID];
        // sanity check
        if (this.members && this.members.contains(member)) return member;
        return null;
    },
    
    //>@method  ValuesManager.getMemberForField()
    // Given a fieldName or dataPath, this method will find the member responsible for
    // interacting with that field's value.
    // If no form is found, returns null.
    // @param fieldName (string || dataPath) fieldName or dataPath to check
    // @return (Canvas) member responsible for displaying this field (may be null).
    // @group members
    // @visibility external
    //<
    getMemberForField : function (fieldName, retrieveAll) {
        return this._findMemberByField(fieldName, false, retrieveAll);
    },
    
    // helper for getItem() / getMemberForField()
    // Determines which member manages a fieldName or dataPath and returns the appropriate member
    // or item from within a member form
    // Handles cases where a dataPath is partially specified on an item and partially on 
    // a member form
    
    _findMemberByField : function (fieldName, getItem, retrieveAll) {
        
        if (!this.members || fieldName == null || isc.isAn.emptyString(fieldName)) return null;
        
        fieldName = fieldName.trim("/");
        
        // determine whether the fieldName passed in was a dataPath once before
        // looping through members
        var dataPathSegments = fieldName.split(isc.Canvas._$slash);
        
        // retrieveAll parameter - implies we should return an array of components that match
        // the specified fieldName
        // We only really expect to see multiple components pointing at the same field if we have
        // a 'multiple:true' field with a dataArity:"multiple" component such as a listGrid and
        // a / some dataArity:"single" components such as forms for editing details of it.
        var results = retrieveAll ? [] : null;
        for (var i = 0; i < this.members.length; i++) {
            var member = this.members[i],
                memberDataPath = member.getFullDataPath();
            
            // if a member has dataPath set to "/" work with the fieldName directly
            if (memberDataPath == isc.Canvas._$slash || isc.isAn.emptyString(memberDataPath))
                memberDataPath = null;
            
            if (dataPathSegments && dataPathSegments.length > 0 && memberDataPath != null) {
                
                var soFar = null;
                for (var ii = 0; ii < dataPathSegments.length; ii++) {
                    // we've split the dataPath into segments
                    // generate a string showing the partial dataPath up to this depth                    
                    soFar = !soFar ? dataPathSegments[ii] 
                                   : (soFar + isc.Canvas._$slash + dataPathSegments[ii]);
                    if (memberDataPath.endsWith(isc.Canvas._$slash)) {
                        memberDataPath = memberDataPath.substring(0,memberDataPath.length-1);
                    }
                    
                    // if we have a match, we still may need to check fields within the 
                    // member to ensure the fields match
                    // Example - a member may have dataPath "contacts"
                    // and an item in that member may have dataPath "address/email"
                    if (memberDataPath == soFar) {
                        // If the member has an explicit dataPath matching the
                        // dataPath passed in, just return it
                        
                        if (!getItem && (ii == dataPathSegments.length-1)) {
                            if (!retrieveAll) return member;
                            
                            results.add(member);
                            // break out of the inner loop and check the next member!
                            break;
                        }
                        if (member.getField) {
                            var remainingPath = dataPathSegments.slice(ii+1).join(isc.Canvas._$slash);
                            
                            // this'll catch the case where the item has a partial datapath
                            // or the last level of nesting is handled by fieldName
                            var item = member.getField(remainingPath);
                            if (item) {
                                if (getItem) {
                                    if (!isc.isA.FormItem(item)) item = null;
                                    if (retrieveAll) {
                                        if (item) results.add(item);
                                    } else {
                                        return item
                                    } 
                                } else {
                                    if (retrieveAll) results.add(member);
                                    else return member;
                                }
                            }
                        }
                    }
                }
            } else {
                // handle being passed (EG) "/someField" - this can happen if
                // a dataPath is specified on a component as explicit "/"
                if (fieldName.startsWith(isc.Canvas._$slash)) fieldName = fieldName.substring(1);
                // If the form had no expicit dataPath we can just use getItem() whether the
                // value passed in is a datapath or a fieldName
                if (this.members[i].getItem) {
                    var field = this.members[i].getField(fieldName);
                    if (field) {
                         if (getItem) {
                            if (!isc.isA.FormItem(field)) field = null;
                            if (retrieveAll) {
                                if (field) results.add(field);
                            } else {
                                return field;
                            }
                         } else {
                             if (retrieveAll) results.add(member);
                             else return member;
                         }
                    }
                }
            }
        }
        return retrieveAll ? results : null;
    },
    
    
    // How to handle fileItems?
    // Assume onely one fileItem per member form - on saveData(), we'll grab the fileItemForm
    // from our member form and use it to submit all our values.
    
    getFileItemForm : function () {
        if (!this.members) return;
        var hasFileItemForm = false, fileItemForm;
        for (var i = 0; i < this.members.length; i++) {
            if (this.members[i].getFileItemForm == null) continue;
            var form = this.members[i].getFileItemForm();
            if (form) {
                if (hasFileItemForm) {
                    this.logWarn("ValuesManager defined with more than one member form " +
                            " containing a FileItem. This is not supported - binary data may " +
                            "only be uploaded from one FileItem when saving ValuesManager data");                              
                } else {
                    fileItemForm = form;
                    hasFileItemForm = true;
                }
            }
        }
        return fileItemForm;
    },
    
    // Validation:
    
    //> @method valuesManager.validate()
    // Validate the current set of values for this values manager against validators defined
    // in the member forms. For databound valuesManagers, also perform validation against any
    // validators defined on datasource fields.
    // <P>
    // Note that if validation errors occur for a value that is not shown in any member forms,
    // those errors will cause a warning and +link{handleHiddenValidationErrors()} will be
    // called.  This can occur if:<br>
    // - A datasource field has no corresponding item in any member form<br>
    // - The item in question is hidden<br>
    // - The member form containing the item is hidden.
    //
    // @return  (boolean)   true if all validation passed
    // @visibility external
    // @example formSplitting
    //<
    
    validate : function () {
        // Just bail if client-side validation is disabled.
        // Note that we'll still show the errors returned from a failed server save due to
        // 'setErrors' behavior
        if (this.disableValidation) return true;

        // skip validation if we're databound and our datasource has validation disabled
        if (this.dataSource && this.dataSource.useLocalValidators != null &&
            this.useLocalValidators == false) return true;
    
        // clear hidden errors before starting any validation run
        this.clearHiddenErrors();
    
        // For databound valuesManagers, each member form will be responsible for validating
        // the fields it shows, and the valueManager will validate the rest.
        var returnVal = true,
            // fields are returned from ds in {fieldName:fieldObject} format
            dsFields = this.dataSource ? isc.addProperties({}, this.getDataSource().getFields()) 
                                       : null,
            validators = {};

        // First go through all the member forms and perform validation.            
        if (this.members) {
            for (var i = 0; i < this.members.length; i++) {
                if (!isc.isA.DynamicForm(this.members[i])) continue;
                var form = this.members[i],
                    disableValidation = form.disableValidation,
                    items = this.members[i].getItems();                    
                    
                if (!disableValidation) {
                    // we don't want any user-defined handleHiddenValidationErrors to fire on the 
                    // form - instead well fire this method at the valuesManager level only.
                    // Implement this by applying our own 'handleHiddenValidationErrors' method to
                    // the form that notifies us what the errors were.
                    if (form.handleHiddenValidationErrors != null) {
                        this.logInfo("form level 'handleHiddenValidationErrors' method suppressed " +
                                     "in favor of valuesManager level handler", "validation");
                        form._prevHHVE = form.handleHiddenValidationErrors;
                    }
                    form.handleHiddenValidationErrors = this._handleHiddenFormErrors;
                }
                
                for (var j = 0; j < items.length; j++) {
                    var fieldName = items[j].dataPath || items[j].getFieldName();
                    // IF the form shares a dataSource with this VM instance, 
                    // remove the appropriate field from our copy of the dataSource fields - 
                    // we have already validated this value.
                    
                    if (dsFields && this.members[i].getDataSource() == this.getDataSource()) 
                        delete dsFields[fieldName];
                }
                // Allow the form to perform its own validation.
                // Validate hidden fields (makes sense since we validate hidden forms!)
                // Pass the additional param to suppress validating DS fields for which there
                // are no items though, since we handle these at the VM level.
                // This will also display validation errors, or fire the method to handle
                // validation errors while hidden.
                var formSuccess = disableValidation ? true : form.validate(true, true)
                returnVal = (returnVal && formSuccess);
                
                if (!disableValidation) {
                    if (form._preHHVE) form.handleHiddenValidationErrors = form._preHHVE;
                    else delete form.handleHiddenValidationErrors;
                }
                // If the form is hidden, add its full set of errors to our hidden form 
                // validation errors object.
                // Note that if there were fields marked as hidden within the form, we already
                // stored those -- this will override that object with the entire set of
                // errors for the form.
                if (!formSuccess && !(form.isDrawn() && form.isVisible())) {
                    this.addHiddenErrors(form.errors, form)
                }
            }
        }


        // we now have to perform validation on the DS fields not present in any member form
        var values = this.getValues(),
            errors = {};
        for (var fieldName in dsFields) {
        
            var fieldObject = dsFields[fieldName],
                validators = fieldObject.validators,
                value = values[fieldName]
            ;

            if (validators != null) {
                var value = values[fieldName];

                // iterate through the validators again, this time actually checking each one
                for (var i = 0; i < validators.length; i++) {
                    // validators is an array of validator objects, each of which has the form
                    //    {type:"validatorType", errorMessage:"message", optionalParam:"", ...}
                    var validator = validators[i];
                    if (!validator) continue;
                    // Unless we're looking at a 'required' or 'requiredIf' field,
                    // don't try to validate null values.
                    
                    if (value == null
                        && validator.type != 'required' && validator.type != "requiredIf")
                    {
                        continue;
                    }
                    // we have no item, so pass the field object to processValidator()
                    // This roughly matches what we do in ListGrid validation
                    if (!this.processValidator(fieldObject, validator, value, null, values)) {
                        if (errors[fieldName] == null) errors[fieldName] = [];
                        var errorMessage = validator.errorMessage || this.unknownErrorMessage;
                        errors[fieldName].add(errorMessage);
                    }
                }
            }
            
            // for consistency with forms - if we got a single error, store as a string, not
            // a single element array
            if (errors[fieldName] && errors[fieldName].length == 1) errors[fieldName] = errors[fieldName][0];
            
        }       

        // add hidden errors from fields that are not associated with any form.        
        this.addHiddenErrors(errors);

        // This method will show hidden errors from member forms or from the VM fields.        
        this._handleHiddenValidationErrors(true);

        if (isc.getKeys(errors).length > 0)  returnVal = false;

        return returnVal;
    },
    
    //> @method valuesManager.getValidatedValues()
    // Call +link{valuesManager.validate()} to check for validation errors. If no errors are found,
    // return the current values for this valuesManager, otherwise return null.
    // @return (object|null) current values or null if validation failed.
    // @group errors
    // @visibility external
    //< 
    getValidatedValues : function () {
        if (!this.validate()) return null;
        return this.getValues();
    },     
    
    // Handler for hidden form validation errors. This method is applied directly to the 
    // member form
    _handleHiddenFormErrors : function (errors) {
        var vm = this.valuesManager;
        vm.addHiddenErrors(errors, this);
        return false;   // suppress the standard warning
    },
    
    
    clearHiddenErrors : function () {
        delete this.hiddenErrors;
    },

    // addHiddenErrors()
    // For a valuesManager, hidden validation errors may come from:
    // - a field in the dataSource not associated with any member form item
    // - a hidden item in a member form
    // - a hidden or undrawn member form.
    
    addHiddenErrors : function (errors, form) {
        if (errors == null || isc.isAn.emptyObject(errors)) return;
        
        if (!this.hiddenErrors) this.hiddenErrors = {};
        if (form) {
            if (isc.isA.Canvas(form)) form = form.getID();
        } else form = this.getID();
        
        if (!this.hiddenErrors[form]) this.hiddenErrors[form] = {};
            
        for (var fieldName in errors) {
            this.hiddenErrors[form][fieldName] = 
                this._addFieldErrors(this.hiddenErrors[form][fieldName], errors[fieldName]);
        }
    },
    
    // Returns the current snapshot of hidden errors in a flat list
    getHiddenErrors : function (suppressSynch) {

        if (!suppressSynch) {
            this.synchHiddenErrors();
        }
        
        if (!this.hiddenErrors) return null;
        var flatErrors = {};
        for (var form in this.hiddenErrors) {
            isc.addProperties(flatErrors, this.hiddenErrors[form]);
        }
        return flatErrors;
    },
    
    
    // synchHiddenErrors()
    // This is a method to ensure that our 'hiddenErrors' object returned by getHiddenErrors()
    // and passed to handleHiddenValidationErrors is in synch with the current set of 
    // visible forms / items.
    // Required in the case where 
    // - setErrors() was called, 
    // - form/item visibility was changed, 
    // - showErrors() called.
    
    synchHiddenErrors : function () {
        
        var hiddenErrors = this.hiddenErrors,
            vmID = this.getID();
                    
        // Logic for errors that occurred on fields with no associated member form item 
        // (when errors were stored)
        if (hiddenErrors && hiddenErrors[vmID]) {
            for (var field in hiddenErrors[vmID]) {
                var errors = hiddenErrors[vmID][field],
                    item = this.getItem(field),
                    memberForm = item ? item.form : null;
                    
                // If there is now an associated member form item, we need to add the
                // field error to the form, and update this.hiddenErrors
                if (item) {
                    memberForm.addFieldErrors(field, errors);
                    // clear out the hidden error under the valuesManager's ID - the error
                    // is now associated with a form.
                    delete hiddenErrors[vmID][field];
                }
            }
        }
        
        // Update hidden errors for each form.
        // Quickest to just re-generate hidden errors per form rather than trying to synch with 
        // existing stored hiddenErrors object.
        var vmErrors = hiddenErrors[vmID];
        hiddenErrors = this.hiddenErrors = {};
        if (vmErrors) hiddenErrors[vmID] = vmErrors;
        // Now iterate through every member's errors and add to hidden members arrays if 
        // necessary
        if (this.members) {
            for (var i = 0; i< this.members.length; i++) {
                if (!isc.isA.DynamicForm(this.members[i])) continue;
                var member = this.members[i],
                    memberID = member.getID(),
                    memberErrors = member.errors;
                if (!memberErrors || isc.isAn.emptyObject(memberErrors)) continue;
                
                // shortcut - if the form is hidden always store all its errors. This may
                // overwrite an already up to date this.hiddenErrors[formID] but is quicker
                // than iterating through the errors doing comparisons.
                if (!member.isVisible() || !member.isDrawn()) {
                    memberErrors = isc.addProperties({}, memberErrors);
                    hiddenErrors[memberID] = memberErrors;
                } else {
                    // catch items that have been hidden or removed
                    for (var field in memberErrors) {
                        var item = member.getItem(field);
                        if (!item) {
                            if (!hiddenErrors[vmID]) hiddenErrors[vmID] = {};
                            hiddenErrors[vmID][field] = memberErrors[field];
                            // just delete the field from the form's errors object
                            delete memberErrors[field];
                            
                        } else if (!item.visible) {
                            if (!hiddenErrors[memberID]) hiddenErrors[memberID] = {};
                            hiddenErrors[memberID][field] = memberErrors[field];
                        }
                    }
                }
            }
        }
        
    },
    
    //>	@method	valuesManager.processValidator()	(A)
    //			process a single validator for a field.
    //
    //		@param	[item]		(object)	Form item displaying the value. May be null if no
    //                                      form item exists for the field.
    //		@param	validator	(object)	validation object
    //		@param	value		(string)	value for this field.
    //      @param  [type]      (string)    validator type. if not passed this is derived from
    //                                      the <code>type</code> property on the validation parameter
    // @param record (object) Field values for record being validated.
    //
    //		@return	(boolean)	true == passed validation, false == validation failed
    //		@group	validation
    //<
    processValidator : function (item, validator, value, type, record) {
        
        return isc.Validator.processValidator(item, validator, value, type, record);
    },

    // _handleHiddenValidationErrors()
    // Internal method to display validation errors when we can't show them in a form.
    // This is used to handle 
    // - errors coming from an undrawn or hidden member form
    // - errors coming from hidden items in a member form
    // - errors coming from a dataSource field for which we have no member form item.
    // Note these errors are all combined into a single object retrieved via this.getHiddenErrors()
    // if a developer needs to determine which form an error came from, they can use
    // getMemberForField()
    // Additional suppressSynch parameter - if we know the hidden errors are in synch with
    // the currently visible set of members / fields (IE this has been called directly from
    // setErrors() or validate()) we can skip the logic to ensure that this.hiddenErrors
    // is up to date.
    _handleHiddenValidationErrors : function (suppressSynch) {
        var errors = this.getHiddenErrors(suppressSynch);
        
        // bail if there were no errors on hidden fields
        if (errors == null || isc.getKeys(errors).length == 0) return;
        
        // If we have an implementation to handle the hidden validation errors, call it now.
        var returnVal;
        if (this.handleHiddenValidationErrors) {
            returnVal = this.handleHiddenValidationErrors(errors);
        }
        
        if (returnVal == false) return;
        
        // Log a warning unless this was suppressed by the handleHiddenValidationErrors method.
        var errorString = "Validation failed with the following errors:";
        for (var fieldName in errors) {
            var fieldErrors = errors[fieldName];
            if (!isc.isAn.Array(fieldErrors)) fieldErrors = [fieldErrors];
            if (fieldErrors.length == 0) continue;

            errorString += "\n" + fieldName + ":";
            for (var i = 0; i < fieldErrors.length; i++) {
                errorString += (i == 0 ? "- " : "\n - ") + fieldErrors[i];
            }
        }
        this.logWarn(errorString, "validation");
    },
    
    // Validation errors APIs
    
    //>	@method	valuesManager.setErrors() [A]
    // Sets validation errors for this valuesManager to the specified set of errors.
    // Errors should be of the format:<br>
    // <code>{field1:errors, field2:errors}</code><br>
    // where each <code>errors</code> object is either a single error message string or an
    // array of error messages.<br>
    // If <code>showErrors</code> is passed in, error messages will be displayed in the 
    // appropriate member form items. For fields with no visible form item, 
    // +link{valuesManager.handleHiddenValidationErrors()} will be fired instead.<br>
    // Note that if <code>showErrors</code> is false, errors may be shown at any time via
    // a call to +link{ValuesManager.showErrors()}.
    //
    // @param   errors  (object) list of errors as an object with the field names as keys
    // @param   showErrors (boolean) If true display errors now.
    // @group errors
    // @visibility external
    //<
    setErrors : function (errors, showErrors) {
        this.clearHiddenErrors();
        
        errors = isc.DynamicForm.formatValidationErrors(errors);
        
        var memberForms = (this.members ? this.members.duplicate() : []);

        for (var i = 0; i < memberForms.length; i++) {
            if (!isc.isA.DynamicForm(memberForms[i])) continue;
            var form = memberForms[i],
                hiddenForm = !form.isVisible() || !form.isDrawn(),
                items = form.getItems(),
                formErrors = {},
                hiddenFormErrors = {};
            for (var j = 0;j < items.getLength(); j++) {
                var item = items[j],
                    itemName = item.getFieldName();
                if (errors[itemName] != null) {
                    formErrors[itemName] = errors[itemName];

                    if (hiddenForm || !item.visible) {
                        hiddenFormErrors[itemName] = errors[itemName];
                    }
                    delete errors[itemName];
                        
                }
            }
            // suppress redraw and suppress form-level hiddenValidationError handling
            form.setErrors(formErrors, false);

            // hang onto the hidden form errors so we can fire the hiddenValidationErrors
            // handler.
            // Note: track hidden errors by form - see comments near
            // addHiddenErrors() / _getHiddenErrors() for more on this
            if (!isc.isAn.emptyObject(hiddenFormErrors)) 
                this.addHiddenErrors(hiddenFormErrors, form);
        }
        
        this.addHiddenErrors(errors);
        // We know stored hidden errors object is up to date
        if (showErrors) this.showErrors(true);
    },
    
    // little helper to combine errors into arrays
    // Returns the errors object to use
    _addFieldErrors : function (oldErrors, newErrors) { 
        if (!oldErrors) return newErrors;
        if (!newErrors) return oldErrors;
        if (!isc.isAn.Array(oldErrors)) oldErrors = [oldErrors];
        if (isc.isA.String(newErrors)) oldErrors.add(newErrors);
        else oldErrors.addList(newErrors);

        return oldErrors;
        
    },
    
    //> @method valuesManager.addFieldErrors()
    // Adds validation errors to the existing set of errors for the field in question.
    // Errors passed in should be a string (for a single error message) or an array of strings.
    // Pass in the showErrors parameter to immediately display the errors to the user by 
    // redrawing the appropriate member form item (or if no visible item is found for the field
    // firing +link{valuesManager.handleHiddenValidationErrors()}.
    // @param fieldName (string) name of field to apply errors to
    // @param errors (string | array of strings) error messages for the field
    // @param showErrors (boolean) should the error(s) be immediately displayed to the user?
    // @group errors
    // @visibility external
    //<
    addFieldErrors : function (fieldName, errors, showErrors) {
        var hidden = true;
        var form = this.getMemberForField(fieldName);
        if (form != null && isc.isA.DynamicForm(form)) {
            form.addFieldErrors(fieldName, errors, false);
            var item = form.getItem();
            if (form.isVisible() && form.isDrawn() && item && item.visible) {
                hidden = false;
            }
        }
        
        if (hidden) {    
            if (!this.hiddenErrors) this.hiddenErrors = {};
            var formName = form ? form.getID() : this.getID();
            if (!this.hiddenErrors[formName]) this.hiddenErrors[formName] = {};

            this.hiddenErrors[formName][fieldName] = 
                this._addFieldErrors(this.hiddenErrors[formName][fieldName], errors);

        }
        
        if (showErrors) this.showFieldErrors(fieldName);
    },
    
    //> @method valuesManager.setFieldErrors()
    // Sets validation errors for some field in the valuesManager.<br>
    // Errors passed in should be a string (for a single error message) or an array of strings.
    // Pass in the showErrors parameter to immediately display the errors to the user by 
    // redrawing the appropriate member form item (or if no visible item is found for the field
    // firing +link{valuesManager.handleHiddenValidationErrors()}.
    // @param fieldName (string) name of field to apply errors to
    // @param errors (string | array of strings) error messages for the field
    // @param showErrors (boolean) should the error(s) be immediately displayed to the user?
    // @group errors
    // @visibility external
    //<    
    setFieldErrors : function (fieldName, errors, showErrors) {
        var hidden = true;
        var form = this.getMemberForField(fieldName);
        if (form != null && isc.isA.DynamicForm(form)) {
            form.setFieldErrors(fieldName, errors, false);
            var item = form.getItem();
            if (form.isVisible() && form.isDrawn() && item && item.visible) {
                hidden = false;
            }
        }
        
        if (hidden) {
            if (!this.hiddenErrors) this.hiddenErrors = {};
            this.hiddenErrors[fieldName] = errors;
        }
        
        if (showErrors) this.showFieldErrors(fieldName);    
    },
    
    //>	@method	valuesManager.clearErrors()
    //			Clears all errors from member forms.
    //      @param  showErrors (boolean)    If true, clear any visible error messages.
    //		@group	errors
    //      @visibility external
    //<
    clearErrors : function (showErrors) {
        this.setErrors({}, showErrors);
    },
    
    //> @method valuesManager.clearFieldErrors()
    // Clear all validation errors associated with some field in this form
    // @param fieldName (string) field for which errors should be cleared
    // @param show (boolean) if true, and the field is present in one of our member forms, 
    //                       redraw it to clear any currently visible validation errors
    // @group errors
    // @visibility external
    //<
    clearFieldErrors : function (fieldName, show) {
        var form = this.getMemberForField(fieldName);
        if (form && isc.isA.DynamicForm(form)) form.clearFieldErrors(fieldName, show);
        
        if (this.hiddenErrors) delete this.hiddenErrors[fieldName];
    },

    //> @method valuesManager.getErrors()
    // Returns the set of errors for this valuesManager.
    // Errors will be returned as an object of the format <br>
    // <code>{field1:errors, field2:errors}</code><br>
    // Where each errors object is either a single error message or an array of error message
    // strings.
    // @return (object) Object containing mapping from field names to error strings. Returns null
    //                  if there are no errors for this valuesManager.
    // @group errors
    // @visibility external
    //<
    // Stored errors include those stored as "hiddenErrors", with no associated form (came from
    // a datasource field definition only, presumably), and errors from member forms
    getErrors : function () {
        // pick up stored hidden errors.
        // [don't bother to synch - we're not interested in whether they're truly hidden or not now]
        var errors = isc.addProperties({}, this.getHiddenErrors(true));
        // add errors from each member form                              
        
        if (this.members) {
            for (var i = 0; i < this.members.length; i++) {
                if (!isc.isA.DynamicForm(this.members[i])) continue;
                isc.addProperties(errors, this.members[i].getErrors());
            }
        }
        if (!isc.isA.emptyObject(errors)) return errors
        return null
    },
    
    //> @method valuesManager.getFieldErrors()
    // Returns any validation errors for some field in this valuesManager.
    // Errors will be returned as either a string (a single error message), or an array 
    // of strings. If no errors are present, will return null.
    // @param fieldName (string) fieldName to check for errors
    // @return (string | array of strings) error messages for the field passed in
    // @group errors
    // @visibility external
    //<
    getFieldErrors : function (fieldName) {
        var form = this.getMemberForField(fieldName)
        if (form && isc.isA.DynamicForm(form)) return form.getFieldErrors(fieldName);
        if (this.hiddenErrors && this.hiddenErrors[this.getID()]) 
            return this.hiddenErrors[this.getID()][fieldName];
    },
    
    //> @method valuesManager.hasErrors()
    // Are there any errors associated with any fields in this valuesManager?
    // @return (boolean) returns true if there are any outstanding validation errors, false 
    //                  otherwise.
    // @group errors
    // @visibility external
    //<
    hasErrors : function () {
        if (this.hiddenErrors && !isc.isA.emptyObject(this.hiddenErrors)) {
            for (var form in this.hiddenErrors) {
                if (this.hiddenErrors[form] && !isc.isAn.emptyObject(this.hiddenErrors[form]))
                    return true;
            }
        }
        if (this.members == null) return false;
        for (var i = 0; i < this.members.length; i++) {
            if (isc.isA.DynamicForm(this.members[i]) && this.members[i].hasErrors()) return true;
        }
        return false;
    },
    
    //> @method valuesManager.hasFieldErrors()
    // Are there any errors associated with a field in this valuesManager?
    // @param fieldName (string) field to check for errors
    // @return (boolean) returns true if there are any outstanding validation errors, false 
    //                  otherwise.
    // @group errors
    // @visibility external
    //<        
    hasFieldErrors : function (fieldName) {
        var form = this.getMemberForField(fieldName);
        if (form && isc.isA.DynamicForm(form) && form.hasFieldErrors(fieldName)) return true;
        var hiddenErrors = this.getHiddenErrors(true);
        if (hiddenErrors && hiddenErrors[fieldName] != null) return true;
        return false;
    },
    
    //> @method valuesManager.showErrors()
    // Method to explicitly show the latest set of validation errors present on this 
    // ValuesManager.<br>
    // Will redraw all member forms to display (or clear) currently visible errors, and
    // fire +link{valuesManager.handleHiddenValidationErrors()} to allow custom handling of
    // hidden errors.
    // @group errors
    // @visibility external
    //<
    // suppressHiddenErrorSynch parameter: indicates we know our stored hidden errors match the 
    // currently visible set of fields [so we just ran validate() or setErrors()].
    // passed through to _handleHiddenValidationErrors()
    showErrors : function (suppressHiddenErrorSynch) {
    
        if (this.members) {
            for (var i= 0; i < this.members.length; i++) {
                if (!isc.isA.DynamicForm(this.members[i])) continue;
                if (!this.members[i].isDrawn() || !this.members[i].isVisible()) continue;
                this.members[i].markForRedraw("ValuesManager validation errors");
            }
        }
        
        if (this.hiddenErrors != null) {
            this._handleHiddenValidationErrors(suppressHiddenErrorSynch);
        }
    },
    
    //> @method valuesManager.showFieldErrors()
    // Method to explicitly show the latest set of validation errors present on some field 
    // within this ValuesManager.<br>
    // If the field in question is present as a visible item in a member form, the form item
    // will be redrawn to display the error message(s).
    // Otherwise +link{valuesManager.handleHiddenValidationErrors()} will be fired to allow 
    // custom handling of hidden errors.
    // @group errors
    // @visibility external
    //<
    showFieldErrors : function (fieldName) {
        var form = this.getMemberForField(fieldName);
        if (form && isc.isA.DynamicForm(form) && form.isVisible() && form.isDrawn()) {
            var item = form.getItem(fieldName);
            if (item && item.visible) {
                item.redraw("Validation errors modified");
                return;
            }
        }
        
        // At this point we know we have a hidden error for the field - fire the 
        // handleHiddenValidationErrors method. Of course that actually 'shows' the
        // errors for all hidden fields, not just this one.
        this._handleHiddenValidationErrors();
    },
    
    // Flow Methods:
    
    //> @method getFilterCriteria()
    // Return the set of filter criteria for this valuesManager based on its current set of 
    // values
    // @return (object) set of name:values pairs to be used as filter criteria
    //<
    getFilterCriteria : function () {
        // get filter criteria from all my members
        
        var crit = {};
        if (this.members) {
            for (var i =0; i < this.members.length; i++) {
                isc.addProperties(crit, this.members[i].getFilterCriteria());
            }
        }
        
        // Mix in any values we have that didn't come from member forms
        var values = this.getValues(),
            undef;
        for (var field in values) {
            if (crit[field] !== undef) delete values[field];
        }
        // filterCriteriaForFormValues will clear out null values, and handle arrays with an
        // empty entry (Implies a null criterion)
        isc.addProperties(crit, isc.DataSource.filterCriteriaForFormValues(values));
        
        return crit;
    },

    
    // ========================================================================================
    //  Values Management APIs
    // ========================================================================================
    
    //> @method valuesManager.getValues()   
    // Returns the current set of values for the values manager instance.  This includes the
    // values from any form managed by this manager, as well as any values explicitly applied
    // via +link{valuesManager.setValues()}.
    // @return (object) a map of the values for this manager
    // @group formValues
    // @visibility external
    //<
    getValues : function () {

        // if one of our member forms has focus, ensure its focus-item's value has been saved
        // out [which will update this.values]
        if (this.members != null) {
            var fc = isc.EH.getFocusCanvas();
            if (this.members.contains(fc) && fc.updateFocusItemValue) fc.updateFocusItemValue();
        }
        // Never let this.values be externally accessible.
        return isc.addProperties({}, this.values);
    },
    
    //> @method valuesManager.setValues()   
    // Replaces the current values of the ValuesManager and all member forms with the values
    // passed in.
    // <P>
    // Values should be provided as an Object containing the new values as properties, where
    // each propertyName is the name of a +link{items,form item} in one of the member forms,
    // and each property value is the value to apply to that form item via
    // +link{FormItem.setValue()}.
    // <P>
    // Values with no corresponding form item may also be passed, will be tracked by the
    // valuesManager and returned by subsequent calls to +link{getValues()}.
    // <P>
    // Any +link{FormItem} for which a value is not provided will revert to its
    // +link{formItem.defaultValue,defaultValue}.  To cause all FormItems to revert to default
    // values, pass null.
    // <P>
    // This method also calls +link{rememberValues()} so that a subsequent later call to
    // +link{resetValues()} will revert to the passed values.
    // 
    // @param   values  (object)    new set of values for this values manager.
    // @group formValues
    // @visibility external
    //<    
    setValues : function (values) {
        if (isc.isAn.Array(values)) {
            var useFirst = isc.isA.Object(values[0]);
            this.logWarn("values specified as an array." + 
                        (useFirst ? " Treating the first item in the array as intended values."
                                  : " Ignoring specified values."));
            if (useFirst) values = values[0];
            else values = null;                                  
        }
    
        
    
        // Duplicate the values object so we can manipulate it and apply it directly to 
        // this.values without interfering with external code.
        
        values = isc.addProperties({}, values);
        
        this.values = values;
        if (this.members) {
            for (var i = 0; i < this.members.length; i++) {
                // setMemberValues will update the members' items to display the values passed in
                // Note that for DynamicForms, it also explicitly calls 'clearValue()' on items
                // for which we have no member - this re-evaluates default values
                this._setMemberValues(this.members[i]);
            }
        }
        // remember values for resetting
        this.rememberValues();
        
    },
    
    //> @method valuesManager.setData()
    // Set the data (values) on this valuesManager [synonym for <code>setValues()</code>].
    //<
    // setData() is used in dataBinding rather than setValues.
    setData : function (values) {
        return this.setValues(values);
    },

    //> @method valuesManager.clearValues()   
    // Clear out all the values managed by this values manager.
    // @visibility external
    // @group formValues
    //<
    clearValues : function () {
        this.setValues({});
    },

    //> @method valuesManager.getMemberValues()   
    // Returns the subset of this valuesManager's values associated with some member form.
    //  
    // @param   ID  (string)    ID of the member form for which we want to retrieve the values.
    // @return (object) a map of the values for the appropriate member form.
    // @visibility external
    // @group formValues
    //<    
    getMemberValues : function (ID) {
        var member = this.getMember(ID);
        if (member != null) return member.getValues();
    },
    
    //> @method valuesManager.setMemberValues()   
    // Set the values for some member form.
    // @param   ID  (string)    ID of the member form to update
    // @param   values  (object)    new values for the form
    // @visibility external
    // @group formValues
    //<    
    setMemberValues : function (ID, values) {
        var member = this.getMember(ID);
        if (member != null) return member.setValues(values);
    },
    
    
    //> @method valuesManager.rememberValues()
    // @include dynamicForm.rememberValues()
    //<
    // Values may change as a result of 
    // - adding a new member and picking up values for fields for which we previously had no 
    //   value
    // - the user modifying values in a field
    // - calls to 'setValue()' [not setValues as that will re-remember the values after setting]
    rememberValues : function () {
        
    	var values = this.getValues();
		
        // create a new object to hold the values
		this._oldValues = {}
        this._rememberedDefault = []
        
        // We support arbitrary levels of nesting within this.values represented by various
        // member components and member items within those components.
        // To remember values we need to essentially clone the values object, and for each
        // layer catch the case where the value comes from an item default so resetValues will
        // re-evaluate the default
        this._cloneValues(this._oldValues, values);
        
    	return this._oldValues;
    },
    
    //> @method valuesManager.getOldValues()
    // @include dynamicForm.getOldValues()
    //<
    getOldValues : function () {
        var oldValues = {};
        isc.addProperties(oldValues, this._oldValues);
        return oldValues;
    },
    
    
    //> @method valuesManager.getChangedValues()
    // @include dynamicForm.getChangedValues()
    // @see getOldValues()
    // @visibility external
    //<
    
    getChangedValues : function () {
        var values = this.getValues(),
            oldValues = this._oldValues, 
            changed = false,
            changedVals = {};
        
        if (!isc.isAn.Object(oldValues)) oldValues = {};
        
        for (var prop in values) {
            // ignore functions
            if (isc.isA.Function(values[prop])) continue;
            
            // Use compareValues to compare old and new values
            // This will catch cases such as Dates where an '==' comparison is
            // not sufficient.
            // Note: If we have a form item use item.compareValues() in case it has been overridden
            var item = this.getItem(prop);
            if (item != null) {
                changed = !item.compareValues(values[prop], oldValues[prop]);
            } else {
                changed = !isc.DynamicForm.compareValues(values[prop], oldValues[prop]);
            }
            // no need to keep going once we've found a difference
            // unless we've been asked to return the changed values
            if (changed) {
                changedVals[prop] = values[prop];
            }
        }
        
        return changedVals
    },

    _cloneValues : function (storedValues, values, dataPath) {
 
        var refPropName = "__ref";   
    
        for (var prop in values) {
    		if (isc.isA.Function(values[prop])) continue;

            
            if (prop == refPropName) continue;

            var fullDataPath = prop;
            if (dataPath) {
                fullDataPath = dataPath + prop;
            } else {
                fullDataPath = prop;
            }
            var item = this.getItem(fullDataPath);
            // if the item value is set to the default, on resetValues we want
            // to set to null (so defaultValue gets re-eval'd) rather than the stored val
            // [still store the current val for valuesHaveChanged() checks]
            
            if (item && item.isSetToDefaultValue()) {
                this._rememberedDefault.add(fullDataPath);
            }
                
            // Special case for dates - duplicate them rather than copying the object 
            // across
            var propValue = values[prop];
            if (isc.isA.Date(propValue)) {
                storedValues[prop] = propValue.duplicate();
                
            } else if (isc.isAn.Object(propValue) && !isc.isAn.Array(propValue)) {
                storedValues[prop] = {};
                this._cloneValues(storedValues[prop], propValue, (fullDataPath + isc.Canvas._$slash));
                
            } else {
                storedValues[prop] = values[prop];
            }
    	}
    },
    
    //> @method valuesManager.resetValues()
    // @include dynamicForm.resetValues()
    //<
    resetValues : function () {
        
    	// pull the values from form._oldValues into ValuesManager.values
        var values = {};

    	for (var prop in this._oldValues) {
            if (this._rememberedDefault.contains(prop)) continue;
            // special case for dates - we want to reset the value of the date, but not actually 
            // replace the object
            if (isc.isA.Date(this._oldValues[prop])) {
                var currentVal = this.getValue(prop);
                if (isc.isA.Date(currentVal)) {
                    currentVal.setTime(this._oldValues[prop].getTime())
                    values[prop] = currentVal;
                } else {
                    values[prop] = this._oldValues[prop].duplicate();
                }
            } else {
                values[prop] = this._oldValues[prop];
            }
    	}
        this.setValues(values);
    },
    
    //> @method valuesManager.valuesHaveChanged()
    // @include dynamicForm.valuesHaveChanged()
    //<
    valuesHaveChanged : function () {
        // use objectsAreEqual() to handle nested comparison
        return !isc.objectsAreEqual(this.getValues(), this._oldValues);
    },

    //> @method valuesManager.getValue()
    // Returns the value for some field.
    // @param   fieldName   (string)    Which value to be returned
    // @return  (any)   current value of the appropriate field
    // @visibility external
    // @group formValues
    //<
    getValue : function (fieldName) {
        return isc.DynamicForm._getFieldValue(fieldName, this.values);
    },
    
    //> @method valuesManager.setValue()
    // Set the value for some field.
    // @param   fieldName   (string)    Which field to set the value for
    // @param   newValue    (any)       New value for the field.
    // @visibility external
    // @group formValues
    //< 
    setValue : function (fieldName, newValue) {
        
        var valueSet = false,
            member,
            undef;
        if (this.members) {    
            var item = this.getItem(fieldName);
            member = item && item.form ? item.form : this.getMemberForField(fieldName);
            if (item && item.setValue) {
                if (newValue === undef) item.clearValue();
                else item.setValue(newValue);
                valueSet = true;
            }
        }
        if (!valueSet) {
            if (newValue === undef) isc.DynamicForm._clearFieldValue(fieldName);
            else isc.DynamicForm._saveFieldValue(fieldName, newValue, this.values);
            
            if (member && member.setData) {
                var dataObjPath = fieldName;
                if (fieldName.indexOf(isc.Canvas._$slash) != -1) {
                    dataObjPath = fieldName.substring(0, fieldName.lastIndexOf(isc.Canvas._$slash));
                    member.setData(isc.DynamicForm._getFieldValue(dataObjPath, this.values));
                }
            }
        }
    },
    
    //> @method valuesManager.clearValue()
    // Clear the value for some field.
    // @param   fieldName   (string)    Which field to set the value for
    // @visibility external
    // @group formValues
    //< 
    clearValue : function (fieldName) {
        this.setValue(fieldName);
    },
    
    // ========================================================================================
    //  Member Management
    // ========================================================================================
    
    //> @method valuesManager.addMember()   
    //
    // Add a new member form to this valuesManager.
    // This form's values will subsequently be available through this valuesManager.  <br>
    // Note on pre-existent values:
    // If the valuesManager has a value specified for some field, for which the member form has
    // an item, this value will be applied to the member form.  This is true whether the item
    // has a value or not.<br>
    // However if the member form has a value for some field, and the ValuesManager does not
    // have a specified value for the same field, we allow the valuesManager to pick up the 
    // value from the member form.    
    //
    // @param   member  (DynamicForm | String) form (or ID of form) to add to 
    //                                          this valuesManager as a member.
    // @visibility external
    // @group members
    // @see method:ValuesManager.addMembers
    //<    
    addMember : function (member, fromDataPath) {
        // If passed an ID, assume it's a pointer to the form.
        if (isc.isA.String(member)) member = window[member];
        
        if (!isc.isA.Canvas(member)) {
            this.logWarn("addMember() passed invalid object: " + this.echo(member) + 
                         " - this should be a DynamicForm instance");
            return;
        }
        
        if (member.valuesManager != null) member.valuesManager.removeMember(member);
        
        // If the member has an explicit, different dataSource specified, log a warning.
        // Different dataSources are a problem, as datasource field properties (including
        // specified validators) will not be reflected in the form.
        // Don't catch the case where the member dataSource is unset, it may be using
        // datapath to pick up the appropriate dataSource field attributes.
        var memberDS = member.getDataSource();
        if (memberDS != null && !fromDataPath && memberDS != this.getDataSource()) {
            this.logWarn("addMember(): mismatched DataSources; new member form " + member + 
                         " has dataSource: '" + memberDS.ID + 
                         "', valuesManager has DataSource " + 
                         (this.getDataSource() != null ? "'"+this.getDataSource().ID+"'" : "[NONE]"));
        }
        
        // If any member forms are multipart, warn the developer - this implies that
        // they need direct submission.        
        if (this.getDataSource() != null && member.isMultipart && 
            member.isMultipart() && member.isMultipart()) 
        {
            this.logWarn("addMember(): new member form " + member +
                " is flagged as using multipart encoding. Multipart forms require direct form " +
                "submission to transfer uploaded files to the server - any uploaded files from " +
                "this member form will be dropped when saving values from this ValuesManager to " +
                "the server."
            );
        }
        
        // catch the case where the member is a dataArity singular component but is editing
        // a multiple:true field - in this case we auto attach a selectionComponent if possible
        if (member.dataArity == "single" && member.autoTrackSelection) {
            var dataPath = member.getFullDataPath(),
                field = dataPath ? this.getDataSourceField(dataPath) : null,
                newValues = isc.DynamicForm._getFieldValue(dataPath, this.values),
                multiple = isc.isAn.Array(newValues) || (field && field.multiple);            
            if (multiple) {                
                var selectionComponents = this.getMemberForField(dataPath, true);
                if (selectionComponents && selectionComponents.length > 0) {
                    for (var i = 0; i < selectionComponents.length; i++) {
                        var selectionComponent = selectionComponents[i];
                        if (selectionComponent.dataArity == "multiple") {
                            member.setSelectionComponent(selectionComponent);
                            break;
                        }
                    }
                }
            }
        // also catch the case where a singular item was already added for a multiple:true field
        // and the selection component is added after the fact
        } else {
            var dataPath = member.getFullDataPath(),
                singularComponents = this.getMemberForField(dataPath, true);
            if (singularComponents && singularComponents.length > 0) {
                for (var i = 0; i < singularComponents.length; i++) {
                    if (singularComponents[i].dataArity == "single" &&
                        singularComponents[i].autoTrackSelection) 
                    {
                        singularComponents[i].setSelectionComponent(member);
                    }
                }
            }
        }
        
        if (this.members == null) this.members = [];
        this.members.add(member);
        
        // call _setMemberValues() to update the member data with values defined on this
        // VM.
        // Pass in the 'pickupValues' parameter - on initial add, we want to pick up any 
        // values present in the form for which we don't already have values
        // (and warn / replace where there are collisions)
        this._setMemberValues(member, true);

        member.valuesManager = this;
        // set a flag so we know if this was auto-attached as part of setDataPath()
        // This allows us to respect explicitly specified valuesManager if the dataPath changes
        // later, but recalculate derived ones.
        member._valuesManagerFromDataPath = fromDataPath;
        
        // We have directly manipulated the values object, so we should re remember it.
        this.rememberValues();
    },
    
    // _setMemberValues - updates the values of a member (form or other dataBoundComponent) based
    // on the valuesManager values.
    // if 'pickupMemberValues' is passed - for cases where the member has existing values 
    // (and the valuesManager doesn't) we pick up the field values from the member.
    // [if there are values specified on the vm and the member, the vm values will replace the
    //  members' values]
    // Called
    // - when a member is first added to this valuesManager
    // - from valuesManager.setValues()
    _setMemberValues : function (member, pickupMemberValues) {
        // Ignore inert members. Use the presence of 'getFields' as a rapid check for
        // data-aware components.
        if (member.getFields == null) return;
        
        // if a field is multiple, the values are expected to be an array.
        // Look at the dataArity of the databound member component to determine
        // whether we should display this array of values in the member
        var memberDataPath = member.getFullDataPath(),
            field = this.getField(memberDataPath),
            newValues = isc.DynamicForm._getFieldValue(memberDataPath, this.values),
            multiple = isc.isAn.Array(newValues) || (field && field.multiple);
        
        if (multiple) {
            if (member.dataArity == "single") {
                // Something that edits singular values is being assigned a multiple value.
                // - if a selectionComponent is set this means that this singular component is
                //   coordinating with a dataArity:multiple selectionComponent.  Ignore the
                //   update since the singular component is already observing the multiple
                //   component.
                if (member.selectionComponent != null) return;
                // - if no selectionComponent is present it's tricky to know what the right behavior is
                //   but default to editing the first record in the array of values.
                else if (isc.isAn.Array(newValues)) newValues = newValues[0];
            } 
            // else: multiple component editing multiple values, as expected
        } else {
            // singular value for a multiple component: upconvert to an Array
            if (newValues != null && member.dataArity == "multiple") newValues = [newValues]
        }
        
        // if the member is not a dynamicForm, we'll just use 'setData()' to apply the appropriate
        // values to the member
        // This will apply values for all fields that match the dataPath of the object
        // (or possibly our top level values object) - differs from logic for forms where
        // we selectively apply values only to fields present in the form
        
        if (!isc.isA.DynamicForm(member)) {
            if (!member.setData) return;
            
            var dataPath = member.getFullDataPath(),
                // if pickupMemberValues is unset we don't care what the old values were
                oldValues = pickupMemberValues ? member.getData() : null;

            if (newValues == null) {
                if (pickupMemberValues) isc.DynamicForm._saveFieldValue(dataPath,oldValues);
            } else {
                // if oldValues is anything other than
                // null, {} or [], it "has meaning" - log a warning that we're clobbering it rather
                // than picking it up.
                if (pickupMemberValues && 
                    oldValues != null && !isc.isAn.emptyObject(oldValues) &&
                    !isc.isAn.emptyArray(oldValues))
                {
                    this.logInfo("ValuesManager member:" + member.getID() +
                        " has existing values:" + this.echo(oldValues) +
                        ", replacing with values from this valuesManager:" + this.echo(newValues)); 
                }
                member.setData(newValues);
            }
            
        } else {
            // for dynamicForms only apply values for which the form is actually displaying
            // items, since we can split the values for a record across multiple forms and we
            // don't want to be maintaining multiple values objects
            var items = member.getItems(),
                undef;
                
            for (var i = 0; i < items.getLength(); i++) {
                var item = items[i];
                if (!item.shouldSaveValue) continue;
                
                var fieldName = item.getDataPath() || item.getFieldName();
                if (!fieldName) continue;
                var fullFieldPath = fieldName,
                    memberDataPath = member.getFullDataPath();
                
                if (memberDataPath) {
                    fullFieldPath = this._combineDataPaths(memberDataPath, fullFieldPath);
                }
                var currentFieldValue = isc.DynamicForm._getFieldValue(fullFieldPath, this.values);
                
                if (currentFieldValue !== undef) {
                    this.logInfo("Member form " + member +
                            " has specified value for field '" + fieldName +  
                            "' which collides with an already specified value in this " +
                            "ValuesManager. Resetting the value on the member form.");
                    member.setValue(fieldName, currentFieldValue);
                } else {
                    // explicitly calling 'clearValues()' will cause dynamic defaults to be
                    // re-evaluated
                    if (!pickupMemberValues) member.clearValue(fieldName);
                }
                
                // This will re-evaluate defaults on items, and potentially peform other
                // modification such as type-casting, so store the item's value again here 
                var newFieldVal = member.getValue(fieldName);
                if (newFieldVal === undef) {
                    isc.DynamicForm._clearFieldValue(fullFieldPath, this.values);
                } else {
                    isc.DynamicForm._saveFieldValue(fullFieldPath, 
                                                    member.getValue(fieldName), this.values);
                }
            }
            
           
            if (pickupMemberValues) {
                //>DEBUG
                this._findItemlessFormValues(member);
                //<DEBUG
            }
        }
    },
    
    //>DEBUG
    // findItemlessFormValues
    // When we first add a DynamicForm to a ValuesManager it may have values for fields
    // with no associated items
    // This is a helper method to find any values from form.getValues() with no associated
    // items.
    // We don't currently add them to this.values - just log a warning and clear them on the form
    // to avoid future confusion
    _findItemlessFormValues : function (form, values, dataPath, itemlessValues, dontWarn) {
        if (values == null) values = form.getValues();
        if (itemlessValues == null) itemlessValues = [];
        for (var prop in values) {
            var fieldID = dataPath ? this._combineDataPaths(dataPath, prop) : prop;
            if (!form.getItem(fieldID)) {
                var value = values[prop];
                if (!isc.isAn.Object(value) || isc.isA.Date(value) || isc.isAn.Array(value)) {
                    itemlessValues.add(fieldID);
                    // clear the value from the form so we avoid future confusion
                    form.clearValue(fieldID);
                    
                    // if we wanted to pick up these values and store them we could do so here
                    /*
                    var fullDataPath = form.dataPath 
                                            ? this._combineDataPaths(form.dataPath, fieldID) 
                                            : fieldID,
                        currentValue = isc.DynamicForm._getFieldValue(prop, this.values),
                        undef;
                    if (currentValue === undef) {
                        isc.DynamicForm._saveFieldValue(fullDataPath, value, this.values);
                    }
                    */
                } else {
                    
                    // this will recursively iterate into objects until it reaches a dataPath with
                    // an associated item, or an atomic value which we can store directly
                    this._findItemlessFormValues(form, value, dataPath, itemlessValues, true);
                }
            }
        }
        
        if (!dontWarn && itemlessValues.length > 0) {
            this._itemlessValueWarning(form, itemlessValues);
        }
    },
    //<DEBUG
    
    //>@method  ValuesManager.addMembers()   
    //  Add multiple new member forms to this valuesManager.
    // @param   members  (array) array of forms to add to this valuesManager as members.
    // @visibility external
    // @group members
    // @see method:ValuesManager.addMember
    //<        
    addMembers : function (members) {
        if (!isc.isAn.Array(members)) this.addMember(members);
        else {
            for (var i = 0; i< members.length; i++) {
                this.addMember(members[i]);
            }
        }
    },
    
    //>@method  ValuesManager.removeMember()   
    //  Remove a member form from this valuesManager, so its values are no longer managed
    //  by this instance.
    //  This does not clear the values associated with the form from the valuesManager - they
    //  will still be available via <code>valuesManager.getValues()</code>, but will not be
    //  updated as the form is manipulated.
    // @param   member  (DynamicForm | string)   
    //      form (or ID of form) to remove from this valuesManager
    // @visibility external
    // @group members
    // @see method:ValuesManager.removeMembers()
    //<    
    removeMember : function (member) {
        
        if (isc.isA.String(member)) {
            member = isc.Class.getArrayItem(member, this.members);
            if (member == null) return;
        } else if (!this.members.contains(member)) return;
        
        this.members.remove(member);
        delete member.valuesManager;
    },
    
    //>@method  ValuesManager.removeMembers()   
    //  Remove multiple member forms from this valuesManager.
    // @param   members  (array)   array of forms to remove
    // @visibility external
    // @group members
    // @see method:ValuesManager.removeMember()
    //<    
    removeMembers : function (members) {
        if (!isc.isAn.Array(members)) this.removeMember(members);
        else {
            for (var i = 0; i< members.length; i++) {
                this.removeMember(members[i]);
            }
        }    
    },


    // ----------------------------------------------------------------------------------------
    // Display
    // ----------------------------------------------------------------------------------------
    // valuesManagers don't usually display their values directly - but support
    // getPrintHTML() so we can build reports from them.
    getPrintHTML : function () {
        var values = this.getValues(),
            printHTML = isc.StringBuffer.create();

        printHTML.append("<TABLE border=1><TR><TD align='center' style='font-weight:bold;'>Field</TD>",
                         "<TD align='center' style='font-weight:bold;'>Value</TD>");
        for (var fieldName in values) {
            printHTML.append("<TR><TD>",fieldName,"</TD><TD>", values[fieldName], "</TD></TR>");
        }
        printHTML.append("</TABLE>");
        return printHTML.toString();
    }
    
        
});



isc.ValuesManager.registerStringMethods ({

     //> @method valuesManager.handleHiddenValidationErrors (A)
    // Method to display validation error messages for a valuesManager when there is not
    // currently visible form item displaying the errors.
    // This will be called when validation fails for<br>
    // - a field in a hidden or undrawn member form<br>
    // - a hidden field in a visible member form<br>
    // - for databound ValuesManagers, a datasource field with specified validators, but not
    //   associated item in any member.<br>
    // Implement this to provide custom validation error handling for these fields.<br>
    // By default hidden validation errors will be logged as warnings in the developerConsole.
    // Return false from this method to suppress that behavior.
    // @param   errors (object) The set of errors returned - this is an object of the form<br>
    //                      &nbsp;&nbsp;<code>{fieldName:errors}</code><br>
    //                      Where the 'errors' object is either a single string or an array
    //                      of strings containing the error messages for the field.
    // @visibility external
    //<
    handleHiddenValidationErrors:"errors",
    
    //>	@method valuesManager.submitValues()
    // Optional +link{stringMethod} to fire when +link{valuesManager.submit()} is called
    // on this valuesManager (or any form included in this valuesManager).
    // 
    // @param	values    (object)        the valuesManager values
    // @param	valuesManager      (ValuesManager)   the valuesManager being submitted
    // @group submitting
    // @see method:valuesManager.submit()
    // @visibility external
	//<
    submitValues : "values,valuesManager"
});

//!<Deferred
