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

 





//-------------------------------
// Field Validation functions
//-------------------------------

// Define Validators class for docs
//> @class Validator
// A validator describes a check that should be performed on a value the user is trying to
// save.
// <p>
// Validators are specified for DataSource fields via the +link{attr:DataSourceField.validators}
// property.  Validators that need not be run on the server can also be specified for a
// specific +link{class:FormItem} or +link{class:ListGridField}.
// <p>
// SmartClient supports a powerful library of +link{type:ValidatorType,ValidatorTypes} which
// have identical behavior on both the client and the server.  
// <p> 
// Beyond this, custom validators can be defined on the client and custom validation logic
// added on the server.  Note that the <code>regexp</code> and <code>mask</code> validator
// types are very flexible and can be used to perform virtually any kind of formatting check
// that doesn't involve some large external dataset.
// <p>
// Custom validators can be reused on the client by adding them to the global validator list,
// via the +link{classMethod:Validator.addValidator()} method.
//
// @serverDS allowed
// @visibility external
// @see ValidatorType
// @treeLocation Client Reference/Forms
//<
 
//> @attr validator.type (ValidatorType : null : IR)
// Type of the validator.
// <p>
// This can be one of the built-in +link{type:ValidatorType}, the string "custom" to define
// a custom validator, or the string "serverCustom" to define a server-only custom validator.
//
// @serverDS allowed
// @visibility external
//<

//> @attr validator.applyWhen (AdvancedCriteria : null : IRA)
// Used to create a conditional validator based on +link{AdvancedCriteria,criteria}.
// The criteria defines when the validator applies. The form current values or ListGrid record
// is used as reference for the criteria. If the criteria matches the validator will be
// processed. Otherwise the validator is skipped and assumed valid.
// <p>
// To use an <code>applyWhen</code> criteria the form or grid must use a +link{DataSource}.
// @serverDS allowed
// @visibility external
//<

//> @attr validator.dependentFields (Array of String : null : IRA)
// User-defined list of fields on which this validator depends. Primarily used for validators
// of type "custom" but can also be used to supplement +link{validator.applyWhen} criteria.
// @serverDS allow
// @visibility external
// @see validator.applyWhen
//<

//> @method validator.condition() 
// For a validator that is not a built-in +link{type:ValidatorType}, a function or
// String expression to evaluate to see if this validator passes or fails.
// <p>
// Because the validator declaration itself is passed as a parameter to
// <code>condition()</code>, you can effectively parameterize the validator.  For example, to
// create a validator that checks that the value is after a certain date:<pre> 
//     { type:"custom", afterDate:new Date(), 
//       condition:"value.getTime() > validator.afterDate.getTime()" }
// </pre>
// Reusable validators, like the above, can be registered as a standard validatorType by
// calling +link{Validator.addValidator()}.
// <P>
// Note that, if a field is declared with a builtin +link{type:FieldType}, the value passed in
// will already have been converted to the specified type, if possible.
//
// @param item (DataSourceField or FormItem) FormItem or DataSourceField on which this
//                                           validator was declared.  NOTE: FormItem will not
//                                           be available during a save performed without a
//                                           form (eg programmatic save) or if the field 
//                                           is not available in the form.
// @param validator (Validator) Validator declaration from eg
//                              +link{DataSourceField.validators}.
// @param value     (any)       value to validate
// @param record (object) Field values for record being validated.
// @return (boolean) whether the value passed validation.  True for passed, false for fail.
//                              
//
// @serverDS allowed
// @visibility external
//<


//> @attr validator.serverCondition (VelocityExpression : null : IR)
// For validators of type "serverCustom" only: an expression in the Velocity Template Language
// that will run on the server.  see +link{group:velocitySupport} for an overview of Velocity
// support within SmartClient.
// <P>
// The expression should evaluate to either boolean true or boolean false.  Note that this can 
// be a normal boolean expression, a reference to a variable containing a boolean value, or a 
// call to some logic that returns a boolean value (note that the strings "true" and "false"
// are considered by Velocity to be the boolean values represented by those words).  All of 
// the following are valid forms:
// <p><code>
// &nbsp;&nbsp;$value &lt; 100<br>
// &nbsp;&nbsp;$util.contains($value, "some string")<br>
// &nbsp;&nbsp;$record.someVariable </code>(assuming that "someVariable" contains a boolean value)<code><br>
// &nbsp;&nbsp;false </code>(not terribly useful as a validation - this would fail in every case)
// <P>
// If your expression does not return a boolean value, we assume false (and you will see a log
// entry on the server indicating that this has happened).  If your expression is syntactically
// invalid, an exception is thrown and the error message is displayed in the client.
// <P>
// Server-side custom validators have the following variables available:
// <ul>
// <li><b>dataSources</b> - The list of all DataSources, accessible by name (so, for example, 
//     <code>$dataSources.supplyItem</code> refers to the <code>supplyItem</code> DataSource
//     object).</li>
// <li><b>dataSource</b> - The current DataSource</li>
// <li><b>record</b> - The DataSource record being validated, if available</li>
// <li><b>value</b> - The value of the field</li>
// <li><b>validator</b> - The config of this validator, presented as a <code>Map</code></li>
// <li><b>field</b> - The field (as a <code>DSField</code> object)</li>
// <li><b>util</b> - A <code>com.isomorphic.util.DataTools</code> object, giving you access to
//               all of that class's useful helper functions</li>
// </ul>
// Server-side custom validators also have access to the standard set of context variables that
// come from the Servlet API.  However, be aware that if you write conditions that depend upon 
// these variables, you preclude your Validator from being used in the widest possible variety 
// of circumstances; for example, in a command-line process.  Rather, it will be tied to 
// operating in the context of, say, an <code>HttpSession</code>.  
// <P>
// Given the above caveat, the following context variables are also available:
// <ul>
// <li><b>servletRequest</b> - The associated <code>HttpServletRequest</code></li>
// <li><b>session</b> - The associated <code>HttpSession</code></li>
// <li><b>httpParameters</b> - This variable gives you access to the parameters <code>Map</code>
//         of the associated <code>HttpServletRequest</code>; it is an alternate form of 
//         <code>$servletRequest.getParameter</code></li>
// <li><b>requestAttributes</b> - This variable gives you access to the attributes <code>Map</code> 
//         of the associated <code>HttpServletRequest</code>; it is an alternate form of 
//         <code>$servletRequest.getAttribute</code></li>
// <li><b>sessionAttributes</b> - This variable gives you access to the attributes <code>Map</code> 
//         of the associated <code>HttpSession</code>; it is an alternate form of 
//         <code>$session.getAttribute</code></li>
// </ul>
//
// @serverDS only
// @visibility external
// @example velocityValidation
//<

//> @attr validator.serverObject (ServerObject : null : IR)
// For validators of type "serverCustom" only, a +link{ServerObject} declaration that allows
// the SmartClient Server to find a Java class via a variety of possible approaches, and call a
// method on it to perform validation.
// <P>
// The target object must implement a method whose first 4 arguments are:
// <code>
//    Object value, Validator validator, String fieldName, Map record
// </code><p>
// (<code>com.isomorphic.datasource.Validator</code> is a subclass of <code>Map</code> that 
// represents a validator's configuration, and also provides APIs for implementing templated
// error messages).<p>
// You provide the name of the method to call by specifying 
// +link{serverObject.methodName,methodName}
// as part of the serverObject declaration.  If you do not specify a methodName, SmartClient 
// expects to find a compliant method called "condition".
// <P>
// Additional arguments may be declared and are automatically supplied based on the declared
// argument type, via +link{dmiOverview,DMI}.  Available objects include:
// <ul>
// <li><b>DataSource</b> - the DataSource where this validator is declared, an instance of
//                         com.isomorphic.datasource.DataSource or a subclass</li>
// <li><b>HttpServletRequest</b> - from standard Java servlets API</li>
// <li><b>HttpServletResponse</b> - from standard Java servlets API</li>
// <li><b>ServletContext</b> - from standard Java servlets API</li>
// <li><b>HttpSession</b> - from standard Java servlets API</li>
// <li><b>RequestContext</b> - an instance of com.isomorphic.servlet.RequestContext</li>
// <li><b>RPCManager</b> - the RPCManager associated with the transaction this validation is 
//                         part of; an instance of com.isomorphic.rpc.RPCManager</li>
// </ul>
// Note that any servlet-related objects will not be available if your validator is run outside
// of the scope of an HTTP servlet request, such as a command-line process.
//
// @serverDS only
// @visibility external
// @example dmiValidation
//<

//> @attr validator.resultingValue (Object : null : IR)
// To transform the incoming value that is validated into a different value or format set this
// property from +link{validator.condition()} to the desired value.
// @serverDS allowed
// @visibility external
//<

//> @attr validator.errorMessage (String : null : IR)
// Text to display if the value does not pass this validation check.
// <P>
// If unspecified, default error messages exist for all built-in validators, and a generic
// message will be used for a custom validator that is not passed.
// @serverDS allowed
// @visibility external
// @example conditionallyRequired
//<

//> @attr validator.stopIfFalse (boolean : false : IR)
// Normally, all validators defined for a field will be run even if one of the validators has
// already failed.  However, if <code>stopIfFalse</code> is set, validation will not proceed
// beyond this validator if the check fails.
// <P>
// This is useful to prevent expensive validators from being run unnecessarily, or to allow
// custom validators that don't need to be robust about handling every conceivable type of
// value.
// 
// @serverDS allowed
// @visibility external
//<

//> @attr validator.stopOnError (boolean : null : IR)
// Indicates that if this validator is not passed, the user should not be allowed to exit
// the field - focus will be forced back into the field until the error is corrected.
// <p>
// This property defaults to +link{FormItem.stopOnError} if unset.
// <p>
// Enabling this property also implies +link{FormItem.validateOnExit} is automatically
// enabled. If this is a server-based validator, setting this property also implies that
// +link{FormItem.synchronousValidation} is forced on.
// 
// @serverDS allowed
// @visibility external
//<

//> @attr validator.clientOnly (boolean : false : IR)
// Indicates this validator runs on the client only.
// <p>
// Normally, if the server is trying to run validators and finds a validator that it can't
// execute, for safety reasons validation is considered to have failed.  Use this flag to
// explicitly mark a validator that only needs to run on the client.  
// 
// @serverDS allowed
// @visibility external
//<

//> @attr validator.validateOnChange (boolean : null : IRW)
// If true, validator will be validated when each item's "change" handler is fired
// as well as when the entire form is submitted or validated. If false, this validator
// will not fire on the item's "change" handler.
// <p>
// Note that this property can also be set at the form/grid or field level;
// If true at any level and not explicitly false on the validator, the validator will be
// fired on change - displaying errors and rejecting the change on validation failure.
// 
// @serverDS allowed
// @visibility external
//<




//> @object validatorDefinition
// Validator definition for a built-in +link{Validator.type}. 
//
// @treeLocation Client Reference/Forms/Validator
// @visibility external
//<

//> @attr validatorDefinition.type (string : null : IR)
// Type of the validator unique in +link{type:ValidatorType}.
//
// @visibility external
//<
//> @attr validatorDefinition.title (string : null : IR)
// Descriptive name of the validator.
//
// @visibility external
//<
//> @attr validatorDefinition.requiresServer (boolean : false : IR)
// Does this validator only run server-side?
//
// @visibility external
//<

//> @attr validatorDefinition.defaultErrorMessage (string : null : IR)
// Default error message to be shown when validator fails validation. Can be overridden
// for an individual validator by setting +link{validator.errorMessage}.
//
// @visibility external
//<

//> @method validatorDefinition.condition() 
// Method invoked to perform the actual validation of a value.
// <p>
// Because the validator itself is passed as a parameter to
// <code>condition()</code>, you can effectively parameterize the validator.  For example, to
// create a validator that checks that the value is after a certain date:<pre> 
//     { type:"custom", afterDate:new Date(), 
//       condition:"value.getTime() > validator.afterDate.getTime()" }
// </pre>
// Note that, if a field is declared with a builtin +link{type:FieldType}, the value passed in
// will already have been converted to the specified type, if possible.
//
// @param item (DataSourceField or FormItem) FormItem or DataSourceField on which this
//                                           validator was declared.  NOTE: FormItem will not
//                                           be available during a save performed without a
//                                           form (eg programmatic save) or if the field 
//                                           is not available in the form.
// @param validator (Validator) Validator declaration from eg
//                              +link{DataSourceField.validators}.
// @param value     (any)       value to validate
// @param record    (object)    Field values for record being validated.
// @return (boolean) whether the value passed validation.  True for passed, false for fail.
//
// @serverDS allowed
// @visibility external
//<

//> @method validatorDefinition.action
// This method is called after every validation (i.e. call to
// +link{validatorDefinition.condition}) whether it passed or failed. This allows the
// validator perform an operation on the field based on the validation outcome.
// <p>
// An <code>action()</code> method is not needed to report an error message only.
//
// @param result    (boolean)   The result of the validator. The value will be null if
//                              the validator was skipped because of conditional criteria.
// @param item (DataSourceField or FormItem) FormItem or DataSourceField on which this
//                                           validator was declared.  NOTE: FormItem will not
//                                           be available during a save performed without a
//                                           form (eg programmatic save) or if the field 
//                                           is not available in the form.
// @param validator (Validator) Validator declaration from eg
//                              +link{DataSourceField.validators}.
// @param component (DataBoundComponent) The DataBoundComponent holding the item such
//                                       DynamicForm or ListGrid.
//
// @visibility external
//<

//> @type ValidatorType
// Used to name a validator or reference a standard, built-in +link{validator} - see list below.
// <p>
// To make use of a standard validator type for a field in a DataSource, or 
// DynamicForm instance, specify the <code>validators</code> property to an array 
// containing a validator definition where the <code>type</code> property is set to 
// the appropriate type.  
// <p>
// A custom error message can be specified for any validator type by setting the
// <code>errorMessage</code> property on the validator definition object, and some
// validator types make use of additional properties on the validator definition 
// object such as <code>max</code> or <code>min</code>.
// <p>
// For example, to use the <code>integerRange</code> validator type:<br><br><code>
// &nbsp;&nbsp;field:{<br>
// &nbsp;&nbsp;&nbsp;&nbsp;validators:[<br>
// &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{type:"integerRange", min:1, max:100}<br>
// &nbsp;&nbsp;&nbsp;&nbsp;]<br>
// &nbsp;&nbsp;}
// </code>
// <p>
// Custom validators can be reused on the client by adding them to the global validator list,
// via the +link{classMethod:Validator.addValidatorDefinition()} method.
//  
// @value isBoolean
// Validation will fail if this field is non-empty and has a non-boolean value.
// @value isString
// Validation will fail if the value is not a string value.
// @value isInteger
// Tests whether the value for this field is a whole number.  If 
// <code>validator.convertToInteger</code> is true, float values will be converted 
// into integers and validation will succeed.
// @value isFloat
// Tests whether the value for this field is a valid floating point number.
// @value isFunction
// Tests whether the value for this field is a valid expression or function; if it is
// valid, creates a +link{group:stringMethods,stringMethod} object with the value
// and set the resultingValue to the StringMethod.
// @value requiredIf
// RequiredIf type validators should be specified with an <code>expression</code>
// property set to a +link{group:stringMethods,stringMethod}, which takes three
// parameters:<ul>
// <li>item - the DynamicForm item on which the error occurred (may be null)
// <li>validator - a pointer to the validator object
// <li>value - the value of the field in question</ul>
// When validation is performed, the expression will be evaluated (or executed) - if it
// returns <code>true</code>, the field will be treated as a required field, so validation
// will fail if the field has no value.
// <p>To allow server-side enforcement, a <code>required</code> validator can be used instead.
// Conditional criteria can be specified with the <code>applyWhen</code> property. 
// <p>See +explorerExample{conditionallyRequired}.
// @value matchesField
// Tests whether the value for this field matches the value of some other field.
// The field to compare against is specified via the <code>otherField</code> property
// on the validator object (should be set to a field name).
// <p>See +explorerExample{matchValue}.
// @value isOneOf
// Tests whether the value for this field matches any value from an arbitrary
// list of acceptable values.  The set of acceptable values is specified via
// the <code>list</code> property on the validator, which should be set to an array of
// values. If validator.list is not supplied, the valueMap for the field will be used.
// If there is no valueMap, not providing validator.list is an error.
// @value integerRange
// Tests whether the value for this field is a whole number within the range 
// specified.  The <code>max</code> and <code>min</code> properties on the validator
// are used to determine the acceptable range, inclusive. To specify the range as
// exclusive of the min/mix values, set <code>exclusive</code> to <code>true</code>.
// <p>See +explorerExample{validationBuiltins}.
// @value lengthRange
// This validator type applies to string values only.  If the value is a string value
// validation will fail if the string's length falls outside the range specified by 
// <code>validator.max</code> and <code>validator.min</code>.
// <p>
// Note that non-string values will always pass validation by this validator type.
// <p>
// Note that the <code>errorMessage</code> for this validator will be evaluated as
// a dynamicString - text within <code>\${...}</code> will be evaluated as JS code
// when the message is displayed, with <code>max</code> and <code>min</code> available as
// variables mapped to <code>validator.max</code> and <code>validator.min</code>.
// @value contains
// Determine whether a string value contains some substring specified via 
// <code>validator.substring</code>.
// @value doesntContain
// Determine whether a string value does <b>not</b> contain some substring specified via 
// <code>validator.substring</code>.
// @value substringCount
// Determine whether a string value contains some substring multiple times.
// The substring to check for is specified via <code>validator.substring</code>.
// The <code>validator.operator</code> property allows you to specify how to test
// the number of substring occurrences. Valid values for this property are
// <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&lt;=</code>,
// <code>&gt;</code>, <code>&gt;=</code>.
// <p>
// The number of matches to check for is specified via <code>validator.count</code>.
// @value regexp
// <code>regexp</code> type validators will determine whether the value specified 
// matches a given regular expression.  The expression should be specified on the
// <code>validator</code> object as the <code>expression</code> property.
// <p>See +explorerExample{regularExpression}.
// @value mask
// Validate against a regular expression mask, specified as <code>validator.mask</code>.
// If validation is successful a transformation can also be specified via the
// <code>validator.transformTo</code> property. This should be set to a string in the
// standard format for string replacement via the native JavaScript <code>replace()</code>
// method.
// <p>See +explorerExample{valueTransform}.
// @value dateRange
// Tests whether the value for a date field is within the range specified.
// Range is inclusive, and is specified via <code>validator.min</code> and
// <code>validator.max</code>, which should be specified in
// <a target=_blank href="http://www.w3.org/TR/xmlschema-2/#dateTime">XML Schema
// date format</a> or as a live JavaScript Date object (for client-only validators only).
// To specify the range as exclusive of the min/mix values, set <code>exclusive</code>
// to <code>true</code>.
// <p>
// Note that the <code>errorMessage</code> for this validator will be evaluated as
// a dynamicString - text within <code>\${...}</code> will be evaluated as JS code
// when the message is displayed, with <code>max</code> and <code>min</code> available as
// variables mapped to <code>validator.max</code> and <code>validator.min</code>.
// @value floatLimit
// Validate a field as a valid floating point value within a value range.
// Range is specified via <code>validator.min</code> and <code>validator.max</code>.
// Also checks precision, specified as number of decimal places in 
// <code>validator.precision</code>. If <code>validator.roundToPrecision</code> is set 
// a value that doesn't match the specified number of decimal places will be rounded
// to the nearest value that does.        
// <p>
// For backwards compatibility only. Use "floatRange" and/or "floatPrecision" instead.
// @value floatRange
// Tests whether the value for this field is a floating point number within the range 
// specified.  The <code>max</code> and <code>min</code> properties on the validator
// are used to determine the acceptable range, inclusive. To specify the range as
// exclusive of the min/mix values, set <code>exclusive</code> to <code>true</code>.
// <p>
// Note that the <code>errorMessage</code> for this validator will be evaluated as
// a dynamicString - text within <code>\${...}</code> will be evaluated as JS code
// when the message is displayed, with <code>max</code> and <code>min</code> available as
// variables mapped to <code>validator.max</code> and <code>validator.min</code>.
// @value floatPrecision
// Tests whether the value for this field is a floating point number with the 
// appropriate number of decimal places - specified in <code>validator.precision</code>
// If the value is of higher precision and <code>validator.roundToPrecision</code> 
// is specified, the value will be rounded to the specified number of decimal places
// and validation will pass, otherwise validation will fail.
// @value required
// A non-empty value is required for this field to pass validation.
// @value readOnly
// Change the state/appearance of this field. Desired appearance is specified via
// the <code>fieldAppearance</code> property on the validator object. See
// +link{type:FieldAppearance} type for choices.
// <p>
// If <code>fieldAppearance</code> is not specified, the default is "readOnly".
// @value isUnique
// Returns true if the value for this field is unique across the whole DataSource.
// <p>
// Validators of this type have +link{attr:ValidatorDefinition.requiresServer,requiresServer} 
// set to <code>true</code> and do not run on the client.
// <p>See +explorerExample{uniqueCheckValidation}.
// @value hasRelatedRecord
// Returns true if the record implied by a relation exists.  The relation can be 
// derived automatically from the +link{attr:DataSourceField.foreignKey} attribute of 
// the field being validated, or you can specify it manually via 
// <code>validator.relatedDataSource</code> and <code>validator.relatedField</code>.
// <p>
// You can specify at DataSource level that this validator should be automatically 
// applied to all fields that specify a +link{attr:DataSourceField.foreignKey,foreignKey} -
// see +link{attr:DataSource.validateRelatedRecords}.
// <p>
// Validators of this type have +link{attr:ValidatorDefinition.requiresServer,requiresServer} 
// set to <code>true</code> and do not run on the client.
// <p>
// Note that this validation is generally unnecessary for data coming from a UI.  The 
// typical UI uses a +link{class:SelectItem} or +link{class:ComboBoxItem} with an 
// +link{FormItem.optionDataSource,optionDataSource} for user entry, such that the user 
// can't accidentally enter a related record if that doesn't exist, and a typical SQL 
// schema will include constraints that prevent a bad insert if the user attempts to 
// circumvent the UI.  The primary purpose of declaring this validation explicitly is 
// to provide clear, friendly error messages for use cases such as +link{class:BatchUploader}, 
// where values aren't individually chosen by the user. See also the example
// +explorerExample{hasRelatedValidation,Related Records}.
// @value serverCustom
// Custom server-side validator that either evaluates the Velocity expression provided in 
// +link{Validator.serverCondition,serverCondition} (see +explorerExample{velocityValidation})
// or makes DMI call to +link{Validator.serverObject,serverObject} to evaluate condition
// (see +explorerExample{dmiValidation}).
// <p>
// Validators of this type have +link{attr:ValidatorDefinition.requiresServer,requiresServer} 
// set to <code>true</code> and do not run on the client.
//
// @visibility external
//<
        
// NOTE ON DEFAULT ERROR MESSAGES:
// If the validator doesn't have an error message, set the defaultErrorMessage property on the
// object to distinguish it from an error message set by the user (errorMessage property).
// It's unnecessary to do this on the server because the error message is returned as part of
// the validation result, and the validator parameters aren't modified.

isc.ClassFactory.defineClass("Validator");

isc.Validator.addProperties({

//> @attr validator.serverOnly (boolean : null : IR)
// Indicates this validator runs on the server only.
// 
// @serverDS only
// @visibility external
//<

});

// These need to be constants to allow the built-in validators to be i18n'd.  NOTE: it would be
// nice to move these definitions closer to the relevant validator, but note that some
// validators have more than one error message, so we can't adopt a simple convention of naming
// the errors after the validator.
isc.Validator.addClassProperties({
    //>@classAttr   Validator.notABoolean (string : "Must be a true/false value" : [IRA])
    //  Default error message to display when standard <code>isBoolean</code> type validator
    //  returns false.
    // @visibility external
    // @group i18nMessages
    //<
    notABoolean:"Must be a true/false value",
    //>@classAttr   Validator.notAString (string : "Must be a string." : [IRA])
    //  Default error message to display when standard <code>isString</code> type validator
    //  returns false.
    // @visibility external
    // @group i18nMessages
    //<
    notAString:"Must be a string.",
    //>@classAttr   Validator.notAnInteger (string : "Must be a whole number." : [IRA])
    //  Default error message to display when standard <code>isInteger</code> type validator
    //  returns false.
    // @visibility external
    // @group i18nMessages    
    //<    
    notAnInteger:"Must be a whole number.",
    //>@classAttr   Validator.notADecimal (string : "Must be a valid decimal." : [IRA])
    //  Default error message to display when standard <code>isFloat</code> type validator
    //  returns false.
    // @visibility external
    // @group i18nMessages
    //<    
    notADecimal:"Must be a valid decimal.",
    //>@classAttr   Validator.notADate (string : "Must be a date." : [IRA])
    //  Default error message to display when standard <code>isDate</code> type validator
    //  returns false.
    // @visibility external
    // @group i18nMessages    
    //<    
    notADate:"Must be a date.",

    
    //>@classAttr   Validator.notATime (string : "Must be a time." : [IRA])
    //  Default error message to display when standard <code>isTime</code> type validator
    //  returns false.
    // @group i18nMessages
    //<    
    notATime: "Must be a time.",
    
    //>@classAttr   Validator.notAnIdentifier (string : "Identifiers must start with a letter, underscore or $ character, and may contain only letters, numbers, underscores or $ characters." : [IRA])
    //  Default error message to display when standard <code>isIdentifier</code> type validator
    //  returns false.
    // @group i18nMessages    
    //<    
    notAnIdentifier: "Identifiers must start with a letter, underscore or $ character, " +
                    "and may contain only letters, numbers, underscores or $ characters.",
                    
    //>@classAttr   Validator.notARegex (string : "Must be a valid regular expression." : [IRA])
    //  Default error message to display when standard <code>isRegex</code> type validator
    //  returns false.
    // @group i18nMessages    
    //<    
    notARegex:"Must be a valid regular expression.",
    
    //>@classAttr   Validator.notAColor (string : "Must be a CSS color identifier." : [IRA])
    //  Default error message to display when standard <code>isColor</code> type validator
    //  returns false.
    // @group i18nMessages    
    //<    
    notAColor:"Must be a CSS color identifier.",

    //>@classAttr   Validator.mustBeLessThan (string : "Must be no more than \${max}" : [IRA])
    //  Default error message to display when standard <code>integerRange</code> type validator
    //  returns false because the value passed in is greater than the specified maximum.
    // This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
    // when the message is displayed, with <code>max</code> and <code>min</code> available as
    // variables mapped to <code>validator.max</code> and <code>validator.min</code>.
    // @visibility external
    // @group i18nMessages    
    //<
    mustBeLessThan:"Must be no more than ${max}", 

    //>@classAttr   Validator.mustBeGreaterThan (string : "Must be at least \${min}" : [IRA])
    //  Default error message to display when standard <code>integerRange</code> type validator
    //  returns false because the value passed in is less than the specified minimum.
    // This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
    // when the message is displayed, with <code>max</code> and <code>min</code> available as
    // variables mapped to <code>validator.max</code> and <code>validator.min</code>.
    // @visibility external
    // @group i18nMessages    
    //<        
    mustBeGreaterThan:"Must be at least ${min}", 
    
    //>@classAttr   Validator.mustBeLaterThan (string : "Must be later than \${min}" : [IRA])
    //  Default error message to display when standard <code>dateRange</code> type validator
    //  returns false because the value passed in is greater than the specified minimum date.
    // This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
    // when the message is displayed, with <code>max</code> and <code>min</code> available as
    // variables mapped to <code>validator.max</code> and <code>validator.min</code>.
    // @visibility external
    // @group i18nMessages    
    //<        
    mustBeLaterThan:"Must be later than ${min.toShortDate()}", 

    //>@classAttr   Validator.mustBeEarlierThan (string : "Must be earlier than \${max}" : [IRA])
    //  Default error message to display when standard <code>dateRange</code> type validator
    //  returns false because the value passed in is less than the specified maximum date.
    // This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
    // when the message is displayed, with <code>max</code> and <code>min</code> available as
    // variables mapped to <code>validator.max</code> and <code>validator.min</code>.
    // @visibility external
    // @group i18nMessages    
    //<        
    mustBeEarlierThan:"Must be earlier than ${max.toShortDate()}", 
    
    //> @classAttr Validator.mustBeShorterThan (string : "Must be no more than \${max} characters" : IRA)
    // Default error message to display when standard <code>lengthRange</code> type validator
    // returns false because the value passed in has more than <code>validator.max</code> characters.
    // This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
    // when the message is displayed, with <code>max</code> and <code>min</code> available as
    // variables mapped to <code>validator.max</code> and <code>validator.min</code>.
    // @visibility external
    // @group i18nMessages    
    //<
    mustBeShorterThan:"Must be no more than ${max} characters",

    //> @classAttr Validator.mustBeLongerThan (string : "Must be at least \${min} characters" : IRA)
    // Default error message to display when standard <code>lengthRange</code> type validator
    // returns false because the value passed in has fewer than <code>validator.min</code> characters.
    // This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
    // when the message is displayed, with <code>max</code> and <code>min</code> available as
    // variables mapped to <code>validator.max</code> and <code>validator.min</code>.
    // @visibility external
    // @group i18nMessages    
    //<    
    mustBeLongerThan:"Must be at least ${min} characters",
    
    //>@classAttr   Validator.mustBeExactLength (string : "Must be exactly \${max} characters" : [IRA])
    // Default error message to display when standard <code>lengthRange</code> type validator
    // has <code>validator.max</code> and <code>validator.min</code> set to the same value,
    // and returns false because the value passed is not the same length as these limits.<br>
    // This is a dynamic string - text within <code>\${...}</code> will be evaluated as JS code
    // when the message is displayed, with <code>max</code> and <code>min</code> available as
    // variables mapped to <code>validator.max</code> and <code>validator.min</code>.
    // @visibility external
    // @group i18nMessages    
    //<
    mustBeExactLength:"Must be exactly ${max} characters",

    
    //>@classAttr   Validator.notAMeasure (string : 'Must be a whole number, percentage, "*" or "auto"' : [IRA])
    //  Default error message to display when standard <code>isMeasure</code> type validator
    //  returns false.
    // @group i18nMessages    
    //<    
    notAMeasure:'Must be a whole number, percentage, "*" or "auto"',
    
    //>@classAttr   Validator.requiredField (string : 'Field is required' : [IRA])
    // Default error message to display when validation fails for a field marked as required
    // or with a standard <code>required</code> type validator.
    // The message is also displayed for a field with a standard <code>requiredIf</code> type
    // validator whose condition evaluates to true, because the field has no value.
    // @visibility external
    // @group i18nMessages    
    //<    
    requiredField:"Field is required",

    //>@classAttr   Validator.notOneOf (string : 'Not a valid option' : [IRA])
    // Default error message to display when standard <code>isOneOf</code> type validator
    // is not passed.
    // @visibility external
    // @group i18nMessages    
    //<    
    notOneOf:"Not a valid option",
    
    //>@classAttr   Validator.notAFunction (string : 'Must be a function.' : [IRA])
    //  Default error message to display when standard <code>isFunction</code> type validator
    //  returns false.
    // @group i18nMessages    
    //<    
    notAFunction:'Must be a function.',
    

    _$true : "true",
    _$false : "false",
    _$dot:".",

    //> @type FieldAppearance
    READONLY:"readOnly",   // @value isc.Validator.READONLY Show in read-only appearance
    HIDDEN:"hidden",       // @value isc.Validator.HIDDEN   Hide field
    DISABLED:"disabled",   // @value isc.Validator.DISABLED Disable field
    // @visibility external
    //<

    // Actually store the standard validators on Validator._validatorFunctions
	_validatorFunctions : {

        // isType validators
        // ------------------------------------------------------------------------------------

        // Validation will fail if this field is non-empty and has a non-boolean value.
        isBoolean : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
            if (isc.isA.Boolean(value)) return true;

        	if (!validator.errorMessage) {
                validator.defaultErrorMessage = isc.Validator.notABoolean;
            }

            if (isc.isA.String(value)) {
                var Validator = isc.Validator;
                validator.resultingValue = (value == Validator._$true);
                // "true" and "false" is the valid String representation of a boolean
                return (value == Validator._$true || value == Validator._$false);
            } else if (isc.isA.Number(value)) {
                validator.resultingValue = (value != 0);
                // 0 and 1 is the valid numeric representation of a boolean
                return (value == 0 || value == 1);
            }
            // anything else is a failure, but we still tell you it's boolean value
            validator.resultingValue = !!value;
            return false;
        },
        
        // Validation will fail if the value is not a string value.
        
        isString : function (item, validator, value) {
        	if (value == null || isc.isA.String(value)) return true;
            if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notAString;
        	validator.resultingValue = isc.iscToLocaleString(value);
        	return true;
        },
        
        // Tests whether the value for this field is a whole number.  If 
        // validator.convertToInteger is true, float values will be converted 
        // into integers and validation will succeed.
        isInteger : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
        	if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notAnInteger;
        	
        	// if the value can't be resolved to a number, return false
        	if (isNaN(value)) return false;	//Not a number or a string that resolves to a number.

        	// Note: this routine will be subject to JavaScript's rounding errors for extremely
            // large numbers (16+ digits)
            var intValue = parseInt(value,10),
                isInteger = (value == intValue);
            
            if (validator.convertToInteger) {

                // Parse as float and round instead of parseInt() because parseInt() is
                // basically Math.floor().  We want 1.5 to become 2, etc.
            	var floatValue = parseFloat(value),
                    intValue = Math.round(floatValue); 
            
            	// reset suggested value (no change if already an integer)
            	validator.resultingValue = intValue;
                
                // return true - if we're doing the conversion allow validation to succeed
                return true;
            } else {
                // If we were passed an integer, still update the resulting value - this
                // will ensure that 1.0 is stored as just 1.
                if (isInteger) {
                    validator.resultingValue = intValue;
                    return true;
                } else return false;
            }
        },
        
        // Tests whether the value for this field is a valid floating point number.
        isFloat : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value)) return true;
        	if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notADecimal;
        	
        	// is the value a valid float?
            var floatValue;
            // treat "." as zero - this ensures that if the user is typing ".3", and we're
            // validating on change, the '.' doesn't kill editing
            if (value == isc.Validator._$dot) {
                floatValue = "0.";
            } else {
                floatValue = parseFloat(value);            
                if (isNaN(floatValue) || floatValue != value) return false;
            }
        	validator.resultingValue = floatValue;
        
        	return true;
        },
        
        
        isDate : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value) || isc.isA.Date(value)) return true;
        	if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notADate;
        
            var dateValue = Date.parseSchemaDate(value);

            if (dateValue == null) return false;

        	validator.resultingValue = dateValue;
        	return true;
        },
        
        
        isTime : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value) || isc.isA.Date(value)) return true;
            if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notATime;
            
            // Third parameter notifies the input parser that the string is in UTC time by default
            // If an explicit timezone is included in the timeString this will be respected by
            // parseInput
            var dateValue = isc.Time.parseInput(value, true, true);
            // support being passed a full datetime string as well
            if (dateValue == null) {
                dateValue = Date.parseSchemaDate(dateValue);
            }
            if (dateValue != null) {
                validator.resultingValue = dateValue;
                return true;
            }
            return false;
        },
        
        // This is used for validating ISC components defined in XML
        // Leave as un-exposed for now.
        isIdentifier : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value)) return true;
            if (!validator.errorMessage) {
                validator.defaultErrorMessage = isc.Validator.notAnIdentifier;
            }
        	return value.match(/^[a-zA-Z_\$][\w\$]*$/) != null;
        },
        
        // This is used for validating ISC components defined in XML
        // Leave as un-exposed for now.
        isRegexp : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value)) return true;
            if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notARegex;
            
            if (typeof value == 'object' && value.constructor == RegExp) return true;
        
            
            if (isc.Browser.isDOM) {
                if (!isc.Validator._isRegexp) {
                    isc.Validator._isRegexp = new Function("value",
                        "try{var regex=new RegExp(value)}catch(e){return false}return true");
                }
                return isc.Validator._isRegexp(value);
            } else {
                var regex = new RegExp(value);
                return true;
            }
        },
        
        // Tests whether the value for this field is a valid expression or function; if it is
        // valid, creates a StringMethod object with the value, and set the resultingValue to
        // the StringMethod
        isFunction :  function (item, validator, value) {
            if (value == null || isc.is.emptyString(value) || value == isc.Class.NO_OP ||
                isc.isA.StringMethod(value))
            {
                return true;
            }
            if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notAFunction;

            try {
                isc.Func.expressionToFunction("", value);
            } catch (e) {
                return false;
            }

            // catch the case where we have a function derived from an Action
            // in this case pick up the original action again.
            if (value.iscAction) value = value.iscAction;
            validator.resultingValue = isc.StringMethod.create({value:value});
            return true;
        },

        // isColor() - used for validating ISC components defined in XML
        // Leave as un-exposed for now.
        isColor : function (item, validator, value) {
            
            if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notAColor;
            
            // empty string/undefined/null is generally treated as the transparent color, so allow
            // that.  If an actual entry is required, you can specify the 'required' validator
            if (!value) return true;

            return isc.isA.color(value);
        },
                
        // This is used for validating ISC components defined in XML
        // Leave as un-exposed for now.
        isMeasure : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value) || value == "*") return true;
        	if (!validator.errorMessage) validator.defaultErrorMessage = isc.Validator.notAMeasure;
 

            // if it ends in percent, check if it's all digits       
        	if (isc.isA.String(value) && value.charAt(value.length - 1) == '%') {
        		value = value.slice(0, -1);
        		// Not using parseInt here because parseInt returns a valid number if the
                // string is prefixed with a valid number
        		return value.match(/\d+\.?\d*/) != null;
        	}
        	return isc.Validator.processValidator(item, validator, value, "integerOrAuto");
        },

        // This is used for validating ISC components defined in XML
        // Leave as un-exposed for now.
        integerOrAuto : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value) || 
                (isc.isA.String(value) && value.toLowerCase() == "auto")) return true;
        	return isc.Validator.processValidator(item, validator, value, "isInteger");
        },

        // Generic (typeless) validators
        // ---------------------------------------------------------------------------------------
        
        
        // Integer validators
        // ------------------------------------------------------------------------------------

        // Tests whether the value for this field is a whole number within the range 
        // specified.  The max and min properties on the validator
        // are used to determine the acceptable range.
        integerRange : function (item, validator, value) {
            // If we're passed a non numeric value, just return without adding an error.
            // This is appropriate since the type of the field will probably be specified as 
            // "integer" meaning that the built in integer validator will also be present on the
            // field.
            var passedVal = value;
            if (!isc.isA.String(value)) value = parseInt(value,10);
            if (isNaN(value) || value != passedVal) return true;
            
            // Allow dynamic error messages to be eval'd, with pointers to min and max values
            validator.dynamicErrorMessageArguments = {validator:validator, 
                                                      max:validator.max, 
                                                      min:validator.min}

        
        	// if a maximum was specified, return false if we're greater than the max
        	if (isc.isA.Number(validator.max) && 
                // exclusive means it's an error is value is exactly max
                ((!validator.exclusive && value > validator.max) ||
                 (validator.exclusive && value >= validator.max)))
            {
        		if (!validator.errorMessage) {
        			validator.defaultErrorMessage = isc.Validator.mustBeLessThan
        		}
        		return false;
        	}
        	// if a minumum was specified, return false if we're less than the min
        	if (isc.isA.Number(validator.min) && 
                // exclusive means it's an error is value is exactly min
                ((!validator.exclusive && value < validator.min) ||
                 (validator.exclusive && value <= validator.min)))
            {
        		if (!validator.errorMessage) {
        			validator.defaultErrorMessage = isc.Validator.mustBeGreaterThan;
        		}
        		return false;
        	}
        	return true;
        },
        
        // String validators
        // ------------------------------------------------------------------------------------
        
        // This validator type applies to string values only.  If the value is a string value
        // validation will fail if the strings length falls outside the range specified by 
        // validator.max and validator.min.
        // Note that non-string values will always pass validation by this validator type.<br>
        // Note that the errorMessage for this validator will be evaluated as
        // a dynamicString - text within ${...} will be evaluated as JS code
        // when the message is displayed, with max and min available as
        // variables mapped to validator.max and validator.min.
        lengthRange : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
        	
        	// if value null/undefined, or isn't a string, return true
        	if (!isc.isA.String(value)) return true;
            
            // Allow dynamic error messages to be eval'd, with pointers to min and max values
            validator.dynamicErrorMessageArguments = {validator:validator, 
                                                      max:validator.max, 
                                                      min:validator.min}
        
        	// get the length of the value
        	var length = value.length,
                maxNumber = validator.max != null ? parseInt(validator.max,10) : null,
                minNumber = validator.min != null ? parseInt(validator.min,10) : null;
                
            if (!isc.isA.Number(maxNumber)) maxNumber = null;
            if (!isc.isA.Number(minNumber)) minNumber = null;
            
        	// if a maximum was specified, return false if length is greater than the max
        	if (maxNumber != null && length > maxNumber) {
        		validator.defaultErrorMessage = 
                    (maxNumber == minNumber ? isc.Validator.mustBeExactLength 
                                            : isc.Validator.mustBeShorterThan);
                return false;
            }

        	// if a minumum was specified, return false if length is less than the min
        	if (minNumber != null && length < minNumber) {
        		validator.defaultErrorMessage = 
                    (maxNumber == minNumber ? isc.Validator.mustBeExactLength
                                            : isc.Validator.mustBeLongerThan);
                return false;
            }
        	return true;
        },
        
        // Determine whether a string value contains some substring specified via 
        // validator.substring.
        contains : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
        	if (!isc.isA.String(value)) value = isc.iscToLocaleString(value);
        	return value.indexOf(validator.substring) > -1;
        },
        
        // Determine whether a string value does not contain some substring specified via 
        // validator.substring.
        doesntContain : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
        	if (!isc.isA.String(value)) value = isc.iscToLocaleString(value);
        	return value.indexOf(validator.substring) == -1;
        },
        
        // Determine whether a string value contains some substring multiple times.
        // The substring to check for is specified via validator.substring.
        // The <code>validator.operator</code> property allows you to specify how to test
        // the number of substring occurrences. Valid values for this property are
        // ==, !=, <, <=, >, >=.
        // The number of matches to check for is specified via validator.count.
        substringCount : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
        	var substring = validator.substring;
        	// get the number of times the value contains the substring and put it into "matchCount"
        	for (var index = 0,	matchCount = 0; index < value.length; index++) {
        		index = value.indexOf(substring,index);
        		if (index > -1) matchCount++;
        		else break;
        	}
        	
        	var operator = validator.operator, 
        		count = validator.count
        	;
        	if (!operator) operator = "==";
        	if (!count) count = 0;
        	
        	switch (operator) {
        		case "==" : return matchCount == count;
        		case "!=" : return matchCount != count;
        		case "<" : return matchCount < count;
        		case "<=" : return matchCount <= count;
        		case ">" : return matchCount > count;
        		case ">=" : return matchCount >= count;
        	}
        	
        	// otherwise return false
        	return false;
        },
        
        // regexp type validators will determine whether the value specified 
        // matches a given regular expression.  The expression should be specified on the
        // validator object as the expression property.
        regexp : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
        	
        	// get the expression to validate and normalize it to a regExp value
        	var expression = validator.expression;
        	if (isc.isA.String(expression)) {
                expression = new RegExp(expression);
            }
        	
        	// return whether or not the expression matches the value
        	return expression.test(value);
        },

        // Validate against a regular expression mask, specified as validator.mask.
        // If validation is successful a transformation can also be specified via the
        // validator.transformTo property. This should be set to a string in the
        // standard format for string replacement via the native JavaScript replace()
        // method.
        mask : function (item, validator, value) {
        	// skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
        	var mask = validator.mask;
        	
        	// and convert to a regular expression if it's a string
        	if (isc.isA.String(mask)) mask = validator.mask = new RegExp(mask);
        	
        	// check the value against the mask
        	if (!mask.test(value)) {
        		return false;
        	} else {
        		// if it passes the test
        
        		// if they specify a transformTo, transform the item and set the 
        		//	resultingValue to the transformed value
        		if (validator.transformTo) {
        			validator.resultingValue = value.replace(mask, validator.transformTo);
        		}
        	}
        
        	// return that the mask was validated successfully
        	return true;
        },

        // Dates
        // ---------------------------------------------------------------------------------------
        // Tests whether the value for a date field is within the range specified.
        // Range is inclusive, and is specified via validator.min and
        // validator.max, which should be specified in "http://www.w3.org/TR/xmlschema-2/#dateTime".
        // date format or as a live JavaScript Date object (for client-only validators only).
        // 
        // Note that the errorMessage for this validator will be evaluated as
        // a dynamicString - text within ${...} will be evaluated as JS code
        // when the message is displayed, with max and min available as
        // variables mapped to validator.max and validator.min.
        dateRange : function (item, validator, value) {
        	if (value == null || isc.is.emptyString(value)) return true;

            if (!isc.isA.Date(value)) return false;

            var min = validator.min, max = validator.max;

            // make a one-time attempt to parse min and max to dates.  Handy when specifying
            // min and max dates in XML.
            if (min != null && !isc.isA.Date(min)) min = validator.min = Date.parseSchemaDate(min);
            if (max != null && !isc.isA.Date(max)) max = validator.max = Date.parseSchemaDate(max);

            // Allow dynamic error messages to be eval'd, with pointers to min and max values
            validator.dynamicErrorMessageArguments = {validator:validator, 
                                                      max:max, 
                                                      min:min}
            if (isc.isA.Date(min) && 
                // exclusive means it's an error is value is exactly min
                ((!validator.exclusive && value.getTime() < min.getTime()) ||
                 (validator.exclusive && value.getTime() <= min.getTime())))
            {
        		if (!validator.errorMessage) {
        			validator.defaultErrorMessage = isc.Validator.mustBeLaterThan
        		}
        		return false;
            }
            if (isc.isA.Date(max) &&
                // exclusive means it's an error is value is exactly max
                ((!validator.exclusive && value.getTime() > max.getTime()) ||
                 (validator.exclusive && value.getTime() >= max.getTime())))
            {
        		if (!validator.errorMessage) {
        			validator.defaultErrorMessage = isc.Validator.mustBeEarlierThan;
        		}
        		return false;
            }
            return true;
        },

        // Floats
        // ---------------------------------------------------------------------------------------
        // Validate a variable as a valid floating point value, within a value range.
        // Range is specified via validator.min and validator.max.
        // Also checks precision, specified as number of decimal places in 
        // validator.precision. If validator.roundToPrecision is set, 
        // a value that doesn't match the specified number of decimal places will be rounded
        // to the nearest value that does.        
        //
        // backcompat only, replaced by floatRange and floatPrecision
        floatLimit : function (item, validator, value) {
            var roundedValue;

            // Check precision before max/min as rounding may push it over the edge.        
            if (validator.precision != null) {
                //>!BackCompat 2005.02.03
                // Old functionality always had no 'roundToPrecision' param, but always
                // rounded and passed.
                if (validator.roundToPrecision == null) validator.roundToPrecision = true;
                //<!BackCompat
                if (!isc.Validator.processValidator(item, validator, value, "floatPrecision"))
                    return false;
                // from now on test with the rounded version.
                if (validator.resultingValue != null) 
                    value = roundedValue = validator.resultingValue;
            }
            if (validator.min != null || validator.max != null) {
                if (!isc.Validator.processValidator(item, validator, value, "floatRange")) {
                    return false
                } else {
                    // the second processValidator call will have cleared out resultingValue
                    // which may have come from the precision validator.
                    if (roundedValue != null && validator.resultingValue == null && 
                        validator.roundToPrecision) 
                        validator.resultingValue = roundedValue;
                } 
            }            
            return true;
        },
        
        // Tests whether the value for this field is a floating point number within the range 
        // specified.  The max and min properties on the validator
        // are used to determine the acceptable range.
        // Note that the errorMessage for this validator will be evaluated as
        // a dynamicString - text within ${...} will be evaluated as JS code
        // when the message is displayed, with max and min available as
        // variables mapped to validator.max and validator.min.
        floatRange : function (item, validator, value) {
            // skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;
            // If we're passed a non numeric value, just return without adding an error.
            // This is appropriate since the type of the field will probably be specified as 
            // "float" meaning that the built in float validator will also be present on the
            // field.
            
            var floatValue = value;
            if (!isc.isA.String(value)) floatValue = parseFloat(floatValue);
            if (isNaN(floatValue) || floatValue != value) return true;
            
        	
            // Allow dynamic error messages to be eval'd, with pointers to min and max values
            validator.dynamicErrorMessageArguments = {validator:validator, 
                                                      max:validator.max, 
                                                      min:validator.min}
        
        	// is the value less than the max allowable? (if specified)
        	if (isc.isA.Number(validator.max) &&
                // exclusive means it's an error is value is exactly max
                ((!validator.exclusive && floatValue > validator.max) ||
                 (validator.exclusive && floatValue >= validator.max)))
            {
        		if (!validator.errorMessage) {
        			validator.defaultErrorMessage = isc.Validator.mustBeLessThan;
        		}
        		return false;
        	}
        	
        	// is the value greater than the min allowable? (if specified)
        	if (isc.isA.Number(validator.min) &&
                // exclusive means it's an error is value is exactly min
                ((!validator.exclusive && floatValue < validator.min) ||
                 (validator.exclusive && floatValue <= validator.min)))
            {
                if (!validator.errorMessage) {
        			validator.defaultErrorMessage = isc.Validator.mustBeGreaterThan;
        		}
                return false;
            }
            return true;
        },
        
        // Tests whether the value for this field is a floating point number with the 
        // appropriate number of decimal places - specified in validator.precision
        // If the value is of higher precision, if validator.roundToPrecision 
        // is specified, the value will be rounded to the specified number of decimal places
        // and validation will pass, otherwise validation will fail.
        floatPrecision : function (item, validator, value) {
   
            // skip empty fields
        	if (value == null || isc.is.emptyString(value)) return true;

        	var floatValue = parseFloat(value);
        	if (isNaN(floatValue) || floatValue != value) return false;
            
        	// if validator.precision is defined, round to that precision.
        	if (isc.isA.Number(validator.precision)) {
        		var multiplier = Math.pow(10, validator.precision);
                var roundedValue = (Math.round(floatValue * multiplier))/multiplier;
                if (validator.roundToPrecision) {
                    validator.resultingValue = roundedValue;
                    return true;
                } else {
                    return (floatValue == roundedValue);
                }
                
        		return true;
            }
            
        }
        
        // ------------------------------------------------------------------------------------    
        // END of Valiator._validatorFunctions
        // ------------------------------------------------------------------------------------    
    },

    _validatorDefinitions : {

        // Generic (typeless) validators
        // ---------------------------------------------------------------------------------------

        // RequiredIf type validators should be specified with an expression
        // property set to a stringMethod which takes three parameters:
        //   item - the DynamicForm item on which the error occurred (may be null)
        //   validator - a pointer to the validator object
        //   value - the value of the field in question
        // When validation is performed, the expression will be evaluated (or executed) - if it
        // returns true, the field will be treated as a required field, so validation
        // will fail if the field has no value.
        requiredIf: {
            type: "requiredIf",
            title: "Conditionally required field",
            condition : function (item, validator, value, record) {
                // CALLBACK API:  available variables:  "item,validator,value"
                // Convert a string callback to a function
                if (validator.expression != null && !isc.isA.Function(validator.expression)) {
                    isc.Func.replaceWithMethod(validator, "expression", "item,validator,value");
                }
    
                var required = validator.expression(item,validator,value);
    
                // Default to displaying the 'requiredField' error message.
                if (validator.errorMessage == null) 
                    validator.errorMessage = isc.Validator.requiredField;
            
            	// if the item is not required, or isn't empty, return true
            	return  !required || (value != null && !isc.is.emptyString(value));
            }
        },
        
        // Tests whether the value for this field matches any value from an arbitrary
        // list of acceptable values.  The set of acceptable values is specified via
        // the list property on the validator, which should be set to an array of
        // values. If validator.list is not supplied, the valueMap for the field will be used.
        // If there is no valueMap, not providing validator.list is an error.
        isOneOf: {
            type: "isOneOf",
            title: "Is one of list",
            condition : function (item, validator, value, record) {
                // skip empty fields
                if (value == null || isc.is.emptyString(value)) return true;

                // get the list of items to match against, either declared on this validator
                // or automatically derived from the field's valueMap (item.valueMap)
                
                var valueMap = validator.list || (item ? (item.getValueMap ? item.getValueMap() 
                                                                           : item.valueMap) 
                                                       : null),
                valueList = valueMap;
                if (!isc.isAn.Array(valueMap) && isc.isAn.Object(valueMap)) {
                    valueList = isc.getKeys(valueMap);
                }
            
                if (valueList != null) {
                    // if any item == the value, return true
                    for (var i = 0, length = valueList.length; i < length; i++) {
                        if (valueList[i] == value) return true;
                    }
                //>DEBUG
                } else {
                    isc.Log.logWarn("isOneOf validator specified with no specified list of options " +
                                "or valueMap - validator will always fail. " +
                                "Field definition:" + isc.Log.echo(item), "validation");
                //<DEBUG
                }
                // otherwise, failure return false
                if (!validator.errorMessage) {
                    validator.defaultErrorMessage = isc.Validator.notOneOf;
                }
                return false;
            }
        },
        // A non-empty value is required for this field to pass validation.
        required: {
            type: "required",
            title: "Required field",
            condition : function (item, validator, value, record) {
                // Default to displaying the 'requiredField' error message.
                if (validator.errorMessage == null) 
                    validator.errorMessage = isc.Validator.requiredField;
            
                return (value != null && !isc.is.emptyString(value));
            },
            action : function (result, item, validator, component) {
                // For a conditional required validator we need to set the
                // item._required flag so field will be drawn with the correct style.
                if (!item.required) {
                    item._required = (result != null);
                }
            }
        },

        // Change the state/appearance of this field. Desired appearance is specified via
        // the fieldAppearance property on the validator object.
        //
        // If fieldAppearance is not specified, the default is "readOnly".
        readOnly: {
            type: "readOnly",
            title: "Set field read-only state/appearance",
            condition : function (item, validator, value, record) {
                return true;
            },
            action : function (result, item, validator, component) {
                var fieldName = item.name;
                if (validator.fieldAppearance == isc.Validator.HIDDEN) {
                    if (result == true) component.hideField(fieldName);
                    else component.showField(fieldName);
                } else if (validator.fieldAppearance == isc.Validator.DISABLED) {
                    if (result == true) component.disableField(fieldName);
                    else component.enableField(fieldName);
                } else {
                    if (result == true) component.setFieldCanEdit(fieldName, false);
                    else component.setFieldCanEdit(fieldName, true);
                }
            }
        },

        // Tests whether the value for this field matches the value of some other field.
        // The field to compare against is specified via the otherField property
        // on the validator object (should be set to a field name).
        matchesField: {
            type: "matchesField",
            title: "Matches another field value",
            condition : function (item, validator, value, record) {
                if (validator.otherField == null) {
                    isc.logWarn("matchesField validator is missing 'otherField' definition. " +
                                "Validator forced false.");
                    return false;
                }
                // do the values match?
                return (value == record[validator.otherField]);
            }
        },
        
        // Returns true if the value for this field is unique across the whole DataSource.
        isUnique: {
            type: "isUnique",
            title: "Validate field value is unique on DataSource",
            requiresServer: true
        },

        // Returns true if the record implied by a relation exists.  The relation can be 
        // derived automatically from the DataSourceField.foreignKey attribute of 
        // the field being validated, or you can specify it manually via 
        // validator.relatedDataSource and validator.relatedField.
        //
        // You can specify at DataSource level that this validator should be automatically 
        // applied to all fields that specify a DataSourceField.foreignKey -
        // see DataSource.validateRelatedRecords.
        hasRelatedRecord: {
            type: "hasRelatedRecord",
            title: "Validate field value exists on a related DataSource",
            requiresServer: true
        },

        // Evaluates the Velocity expression provided in 
        // Validator.serverCondition on the server side.
        serverCustom: {
            type: "serverCustom",
            title: "Validate field value using a custom server expression",
            requiresServer: true
        }
    }

});


isc.Validator.addClassMethods({

    // Is the validator server-only?
    
    isServerValidator : function (validator) {
    	if (validator.serverOnly) return true;

        // Check whether we have a build-in validator definition of the appropriate type.
        var validatorDefinition = this._validatorDefinitions[validator.type];
        if (validatorDefinition != null && validatorDefinition.requiresServer) return true;

        return false;
    },

    // Process validator is an internal method called by
    // DynamicForm, valuesManagers, and editable ListGrids
    // to perform validation.
    
    processValidator : function (item, validator, value, type, record) {
    	// if the validator is server-side only, return true
    	if (validator.serverOnly) return true;

    	// if no type was specified, get it from the validator.type property
    	if (!type) 	type = validator.type;
    	var result = true;
        
        // Check whether we have a build-in validator definition of the appropriate type.
        var validatorDefinition;
        if (type != null)  validatorDefinition = this._validatorDefinitions[type];
    	
        // If a validator definition was not found, check whether we have a
        // standard validator in the old format of the appropriate type.
        var validationFunction;
        if (validatorDefinition == null) {
            if (type != null)  validationFunction = this._validatorFunctions[type];
    	
            // if we didn't find a validatorFunction, use the validator.condition
            // if one was specified
            if (validationFunction == null && validator.condition) {
                // CALLBACK API:  available variables:  "item,validator,value,record"
                // Convert a string callback to a function
                if (!isc.isA.Function(validator.condition)) {
                    //>DEBUG
                    this.logDebug("Creating function for validation condition:\r" +
                                  validator.condition);
                    //<DEBUG
                    isc.Func.replaceWithMethod(validator, "condition",
                                               "item,validator,value,record");
                }
                validationFunction = validator.condition;
            }
        } else {
            // If validator is server-only, return successful validation for client
            if (validatorDefinition.requiresServer == true) {
                return true;
            }
            // Pull validation function from definition
            validationFunction = validatorDefinition.condition;

            // Push default error message to validator if not already set
            if (!validator.errorMessage) {
                validator.defaultErrorMessage = validatorDefinition.defaultErrorMessage;
            }
        }
    
        // if we found a validating function, call it 
        if (validationFunction != null) {
            // NOTE: first clear the "resultingValue" field and suggested value of the
            // validator, in case the validation rule decides to set it

            // for Array-valued fields (field.multiple=true), validate each value in the Array
            if (item && item.multiple && item.validateEachItem && isc.isAn.Array(value)) {
                var resultingValue = [];
                for (var i = 0; i < value.length; i++) {
                    // Each call to validationFunction could set the resultingValue
                    delete validator.resultingValue;
                    // NOTE: don't stop on failure
                    result = result && validationFunction(item, validator, value[i], record);
                    // capture each resulting value
                    resultingValue[i] = (validator.resultingValue != null ?
                                         validator.resultingValue : value[i]);
                }
                // return the array value as the overall resulting value
                validator.resultingValue = resultingValue;
            } else {
                delete validator.resultingValue;
                result = validationFunction(item, validator, value, record);
            }
        //>DEBUG
        } else {
            this.logWarn("validator not understood on item: " + this.echo(item) + ":\r" + 
                         isc.echoFull(validator));
        //<DEBUG
        }
    	return result;
    },
    
    performAction : function (result, item, validator, component) {
        var type = validator.type;

        // Check whether we have a build-in validator definition of the appropriate type.
        var validatorDefinition;
        if (type != null)  validatorDefinition = this._validatorDefinitions[type];

        var actionFunction;
        if (validatorDefinition != null) {
            actionFunction = validatorDefinition.action;
        }
        // if we didn't find an actionFunction, use the validator.action if one was specified
        
        if (actionFunction == null && validator.action) {
            // CALLBACK API:  available variables:  "result,item,validator,component"
            // Convert a string callback to a function
            if (!isc.isA.Function(validator.action)) {
                //>DEBUG
                this.logDebug("Creating function for validation action:\r" +
                              validator.action);
                //<DEBUG
                isc.Func.replaceWithMethod(validator, "action",
                                           "result,item,validator,component");
            }
            actionFunction = validator.action;
        }
        // call the action method
        if (actionFunction != null) {
            actionFunction(result, item, validator, component);
        }
    },

    getErrorMessage : function (validator) {
        
        var errorMessage = validator.errorMessage;
        
        if (errorMessage == null) errorMessage = validator.defaultErrorMessage;
        
        // Convert (potentially) dynamic error message strings to straight
        // strings
        if (errorMessage && validator.dynamicErrorMessageArguments) {
            errorMessage = errorMessage.evalDynamicString(
                                null, validator.dynamicErrorMessageArguments);
        }
        return errorMessage;
    },
    
    
    //>	@classMethod	Validator.addValidator()	(A)
    // Add a new validator type that can be specified as +link{Validator.type} anywhere
    // validators are declared, such as +link{DataSourceField.validators} or
    // +link{FormItem.validators}.
    // <br>
    // The <code>condition</code> argument should be a method of the same signature as
    // +link{Validator.condition()}.
    //
    // @param type (String) type name for the new validator
    // @param condition (StringMethod) function or expression to evaluate to determine whether
    //                                 validation was successful
    //
    // @group validation
    // @visibility external
    // @see Validator.addValidators()
    //<
    addValidator : function (type, condition) {
        if (isc.isA.String(type)) {
            var valsObject = {};
            valsObject[type] = condition;
            return this.addValidators(valsObject);
        }
    },

    //>	@classMethod	Validator.addValidators()	(A)
    //  Add several new validator types at once, as though +link{addValidator()} were called
    //  several times.
    // 
    //   @group	validation
    //   @param	newValidators	(object)	Set of validators to add.  This parameter should
    //      be a JavaScript object where the property names are validator type names, and the
    //      property values are condition functions or expressions, for example:<br>
    //      &nbsp;&nbsp;&nbsp;<code>{type1:condition1, type2:condition2}</code><br>.
    //
    // @visibility external
    // @see Validator.addValidator()
    //<
    addValidators : function (newValidators) {
        for (var type in newValidators) {
            if (!isc.isA.Function(newValidators[type])) {
                isc.Func.replaceWithMethod(newValidators, type, "item,validator,value");
            }
        }
    	isc.addMethods(this._validatorFunctions, newValidators);
    },
    
    //>@classMethod  Validator.addValidatorDefinition() (A)
    // Add a new validator type that can be specified as +link{Validator.type} anywhere
    // validators are declared, such as +link{DataSourceField.validators} or
    // +link{FormItem.validators}.
    //
    // @param type (String) type name for the new validator
    // @param definition (ValidatorDefinition) the validator definition
    //
    // @group validation
    // @visibility external
    // @see Validator.addValidatorDefinitions()
    //<
    addValidatorDefinition : function (type, definition) {
        if (!isc.isAn.Object(definition)) {
            isc.logWarn("Invalid validator in call to addValidatorDefinition. Ignored.");
        }
        var valsObject = {};
        valsObject[type] = definition;
        return this.addValidatorDefinitions(valsObject);
    },

    //>@classMethod  Validator.addValidatorDefinitions() (A)
    // Add several new validator types at once, as though +link{addValidatorDefinition()}
    // were called several times.
    // 
    // @group validation
    // @param newDefinitions (object) Set of validators to add.  This parameter should
    //      be a JavaScript object where the property names are validator type names, and the
    //      property values are +link{validatorDefinition}s.
    //
    // @visibility external
    // @see Validator.addValidatorDefinition()
    //<
    addValidatorDefinitions : function (newDefinitions) {
        if (!newDefinitions || !isc.isAn.Object(newDefinitions)) return;

        // Check for redefinition of validators and log warning
        for (var type in newDefinitions) {
            if (this._validatorDefinitions[type]) {
                isc.logWarn("addValidatorDefinitions: Validator definition already exists " +
                            "for type " + type + ". Replacing.");
            }
        }
    	isc.addProperties(this._validatorDefinitions, newDefinitions);
    }
    
});
