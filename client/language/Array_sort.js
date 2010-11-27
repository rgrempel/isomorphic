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

 






/////////////////////
//
//	Methods for sorting an array easily
//
/////////////////////


isc.addProperties(Array, {
	//>	@type	SortDirection
	// @visibility external
	//			@group	sorting
	ASCENDING:true,			//	@value	"ascending"		Sort in ascending order (eg: A-Z, larger items later in the list)
	DESCENDING:false		//	@value	"descending"	Sort in descending order (eg: Z-A, larger items earlier in the list)
	//<

});

isc.addMethods(Array, {

//>	@method		Array.shouldSortAscending()
//			Returns the passed in sortDirection (string / boolean) as the appropriate boolean
//		@group	sorting
//
//<
shouldSortAscending : function (sortDirection) {

    if (sortDirection == Array.ASCENDING) return true;
    if (sortDirection == Array.DESCENDING) return false;

    if (isc.isA.String(sortDirection)) {
        if (sortDirection.toLowerCase() == "ascending") return true;
        if (sortDirection.toLowerCase() == "descending") return false;        
    }
    
    // Anything else is invalid  - just return null
    return null;
}

});


// add a bunch of methods to the Array prototype so all arrays can use them
isc.addMethods(Array.prototype, {




//>	@method		array.sortByProperty()
// @include list.sortByProperty()
//<
sortByProperty : function (property, direction, normalizer, context) {
    return this.sortByProperties({property:property, direction:direction, 
                                  normalizer:normalizer, context:context});

}, 

//> @method array.setSort()
// Sort this Array by a list of +link{SortSpecifier}s. 
// @param sortSpecifiers (Array of SortSpecifier) the list of +link{SortSpecifier}s to sort by
// @return (array) the array itself
// @visibility external
//<
setSort : function (sortSpecifiers) {
    var properties = [], directions = [], normalizers = [], contexts = [];
    for (var i = 0; i < sortSpecifiers.length; i++) {
        var item = sortSpecifiers[i];
        properties[i] = item.property;
        directions[i] = Array.shouldSortAscending(item.direction);
        normalizers[i] = item.normalizer;
        contexts[i] = item.context;
    }
    return this.sortByProperties(properties, directions, normalizers, contexts);
},

//> @method array.sortByProperties()
// Given an array of objects, sort them by the properties of the member objects.
// Note that the sort will occur by the first property passed in, then for objects
// with matching values for the first property, the second property will be used (and so on).
// Can pass in an arbitary number of parameters.
// @param sortData (object) Each parameter is an object of the following format:<br>
// <code>{property:'propertyName', direction:direction, normalizer:normalizer}</code><br>
// Only the "property" attribute is required.  Pass in multiple arguments to sort by multiple
// properties.
// @return (array) the array itself
//<
// This method also supports being passed a 'context' parameter. If present, this is passed
// into the sort normalizer method as a parameter
// Example use case: ListGrids pass themselves into the 'sortBYProperty' method as the context
// and are then available to the sort normalizer for the field.
// The context, if present, should be passed in as the 'context' attribute of each parameter
// object (so we can support 1 context per field name)
// In addition to the documented parameter format, sortByProperties will take 4 arrays - an
// array of property names, an array of sort directions, an array of normalizers and an array
// of 'context' objects.
// The normalizer / sortDirection / context for each property is then determined by 
// the position in the array (so the last 3 arrays are optional and may be sparse)


sortByProperties : function () {

    var normalizedArray = isc._normalizedValues,
        wrongTypeArray = isc._unexpectedTypeValues;
    
    // Support being called with either the signature 
    //  (["prop1", "prop2", ...], [dir1, dir2, ...], [norm1, norm2, ...])    
    // or
    //  ({property:"prop1", direction:dir1, normalizer:norm1}, {property:"prop2", ...},...)
    
    if (isc.isAn.Array(arguments[0])) {
        this.sortProps = arguments[0];
        this.sortDirections = arguments[1] || [];
        this.normalizers = arguments[2] || [];
        this.contexts = arguments[3] || [];
    } else {
    
        // clear out any sortProps so we don't get additional (old) properties
        
        if (!this.sortProps) {
            this.sortProps = [];
            this.normalizers = [];
            this.sortDirections = [];
            this.contexts = [];
        } else {    
            this.sortProps.clear();
            this.sortDirections.clear();
            this.normalizers.clear();
            this.contexts.clear();
        }
    
        
        for (var i = 0; i < arguments.length; i++) {
            this.sortProps[i] = arguments[i].property;
            
            this.sortDirections[i] = arguments[i].direction;
            this.normalizers[i] = arguments[i].normalizer;
            this.contexts[i] = arguments[i].context;
        }
    }       
    
    // local refs
    var props = this.sortProps, 
        norms = this.normalizers,
        contexts = this.contexts;
    
    var start = isc.timestamp();

    for (var i = 0; i < props.length; i++) {    
    
        // remember the sort directions on the Array object -- retrieved in _compareNormalized
        isc._sortDirections[i] = this.sortDirections[i];
    
        var property = props[i],
            normalizer = norms[i],
            context = contexts[i];
        // if not passed an explicit normalizer, choose the appropriate function to normalize data 
        // (see above)
        var dataType;
        if (normalizer == null) {
            dataType = this._getSortDataType(props[i]);

        // catch the case where we were passed a data type rather than a normalizer function
        } else if (isc.isA.String(normalizer)) {
            dataType = normalizer;
        }
        if (dataType != null) normalizer = Array._getNormalizerFromType(dataType);
        
        //isc.Log.logWarn("For property:"+ property + ", dataType is: " + dataType + 
        //                  ", normalizer is: " + normalizer);

        // In the case where we were unable to determine a custom data-type normalizer for the field
        // fall back on the default object normalizer.
        if (normalizer == null) normalizer = Array._normalizeObj;

        // Update the normalizer to point to the function
        this.normalizers[i] = normalizer;

        // if the list is empty, nothing to do but remember the sort details so methods such
        // as add() can reset the sort.
        if (this.length == 0) continue;

        // now apply the normalizer to each item, storing the normalized values in a property
        // where we will look for them later during the native sort()
        

        // Set up the array to store the normalized values for this prop in
        normalizedArray[i] = [];
        wrongTypeArray[i] = [];
    	    
        if (isc.isA.Function(normalizer)) {
            
            for (var ii = 0, l = this.length, item;ii < l;ii++) {
                item = this[ii];
                if (item == null) {
                    // If any nulls were detected during the sort notify the developer
                    isc._containsNulls = true;
                    continue;
                }
                
                item._tempSortIndex = ii;
                var normalizedValue = normalizer(item, this.sortProps[i], context);                
    		    normalizedArray[i][ii] = normalizedValue;

                // If we're sorting the field according to an explicit data type, store values
                // not of that type for separate comparison
                
                if (dataType != null && !Array._matchesType(item[this.sortProps[i]], dataType)) {
                    wrongTypeArray[i][ii] = item[this.sortProps[i]];
                }

                // a custom normalizer might produce NaN, which is a dangerous because, unlike
                // any other value, both "1 > NaN" and "1 < NaN" are false, which fools the
                // comparator into thinking everything is equal to NaN, so the sort order is
                // scrambled and changes each time, and the reason why isn't obvious to the
                // developer.  Hence normalize NaN to the maximum negative value, like our
                // built-in numeric normalizer does.
                var undef;
                if (isc.isA.SpecialNumber(normalizedValue) && isNaN(normalizedValue)) {
                    normalizedArray[i][ii] = 0-Number.MAX_VALUE;
                }
            }
            //isc.Log.logWarn("function normalizer: normalized values: " + normalizedArray[i] + 
            //                ", unexpected types: " + wrongTypeArray[i]);
        } else {      
            // a non-null, non-dataType, non-function normalizer was passed, assume it's a 
            // propertyValue -> normalizedValue map
            var normalizerMap = this.normalizers[i];
            for (var ii = 0, l = this.length, item; ii < l ;ii++) {
                item = this[ii];

                if (item == null) {
                    isc._containsNulls = true;
                    continue;
                }
                
                var sortPropValue = item[this.sortProps[i]];
                if (sortPropValue == null) sortPropValue = '';
                
                var normalizedValue = normalizerMap[sortPropValue];
                // if the normalizerMap had no normalizedValue for the value of the sortProp,
                // use the value of the sortProp itself as the normalizedValue
                if (normalizedValue == null) normalizedValue = sortPropValue;
                
                // store the normalized value on the item itself
                item._tempSortIndex = ii;
                normalizedArray[i][ii] = normalizedValue;
            }
            //isc.Log.logWarn("string normalizer: normalized values: " + normalizedArray[i] + 
            //                ", unexpected types: " + wrongTypeArray[i]);
            
        }
    }   // END of the for loop

    //isc.logWarn("normalizing took: " + (isc.timestamp() - start) + "ms");

    
    
    // worth pre-computing for the common case that there are no values of unexpected type
    var hasUnexpectedTypeValues = false;
    for (var i = 0; i < isc._unexpectedTypeValues.length; i++) {
        if (isc._unexpectedTypeValues[i].length > 0) {
            hasUnexpectedTypeValues = true;
            break;
        }
    }
    isc._hasUnexpectedTypeValues = hasUnexpectedTypeValues;

    //isc.logWarn("about to sort, hasUnexpectedTypeValues: " + isc._hasUnexpectedTypeValues + 
    //            ", normalizedValues: " + isc.echoFull(isc._normalizedValues) +
    //            ", unexpectedTypes: " + isc.echoFull(isc._unexpectedTypeValues) +
    //            " directions: " + isc._sortDirections);

    
    var normalizedValues = isc._normalizedValues,
        directions = isc._sortDirections,
        hasUnexpectedTypeValues = isc._hasUnexpectedTypeValues;

    var arr = this;
    arr.compareAscending = Array.compareAscending;
    arr.compareDescending = Array.compareDescending;

    // define comparator function for sorting by property - uses already stored out normalized
    // values and sort-directions
    var compareNormalized = 
function (a,b) {

    // For null values we'll always compare 'null' regardless of the field property
    var aIndex = (a != null ? a._tempSortIndex : null),
        bIndex = (b != null ? b._tempSortIndex : null);

    for (var i = 0; i < normalizedValues.length; i++) {
         
        var aFieldValue = normalizedValues[i][aIndex],
            bFieldValue = normalizedValues[i][bIndex];

        // if both values were not the expected type, compare them directly in un-normalized
        // form.  Note if only one value was unexpected type, by comparing normalized values we
        // will sort values of unexpected type to one end, since the standard normalizers all
        // normalize unexpected type values to the lowest values in the type's range.
        if (hasUnexpectedTypeValues && aFieldValue != null && bFieldValue != null) {
            var unexpectedTypes = isc._unexpectedTypeValues,
                aWrongType = unexpectedTypes[i][aIndex],
                bWrongType = unexpectedTypes[i][bIndex];
            if (aWrongType != null && bWrongType != null) {
                aFieldValue = aWrongType;
                bFieldValue = bWrongType;
            }
        }
    
        var returnVal = (directions[i] ? arr.compareAscending(aFieldValue, bFieldValue) 
                                       : arr.compareDescending(aFieldValue, bFieldValue));

        //isc.Log.logWarn("compared: " + isc.Log.echo(aFieldValue) + " to " +
        //             isc.Log.echo(bFieldValue) + ", returning: " + returnVal);

        // If we have a non-equal result, return it, otherwise we'll check the next property
        // in array.sortProps
        if (returnVal != 0) return returnVal;
    }

    // at this point we've gone through every field in the sort, and these 2 items match in
    // each case -- just return 0 to indicate no order pref.
    return 0;                    
};

    var start = isc.timeStamp();

    // perform the actual sort
    this.sort(compareNormalized);

    //isc.logWarn("sorted in: " + (isc.timeStamp() - start) + "ms");

    // if we hit any nulls, warn the developer
    if (isc._containsNulls) {
        isc.Log.logWarn("Attempt to sort array by property hit null entry where a record should be. Array:" + 
                        isc.Log.echo(this));
        isc._containsNulls = null;
    }

    // Clear out the index temporarily stored on each item, and empty the temp arrays of
    // sort values / directions
    
    this.clearProperty("_tempSortIndex");
    normalizedArray.clear();
    wrongTypeArray.clear();
    isc._sortDirections.clear();
    
    // call dataChanged in case anyone is observing it
    this.dataChanged();
    
    return this;
}, 


//>	@method		array.unsort()	(A)
//		Turn sorting off for this array, indicating that the current sort
//		order should be preserved.  Return true if this is supported in this List.
//
//		Some implementations may not support this -- they should return false
//		to indicate to the caller that sort order must be maintained (eg: in
//		the case where sort order is derived from the server, etc).
//
//		@group	sorting
//
//		@return	(boolean)	true == list supports unsorting, false == not supported.
// @visibility external
//<
unsort : function () {
    if (this.sortProps) this.sortProps.clear();
    return true;
},


// _getSortDataType() - given a field to sort this Array's member objects by, this method
// returns the data type to treat these field values as. Used to determine the appropriate
// normalizer function for the values.
// Note that a "normalizer" function renders a variable in a standardized format
// so we can sort by it easily.  For example, dates are converted into msec, etc.
_getSortDataType : function (sortProp, value) {
    var list = (value != null ? (isc.isAn.Array(value) ? value : [value]) : this);
	// determine the type WRT sorting based on the type of the first non null value
	for (var i = 0; i < list.length; i++) {

        if (!isc.isAn.Object(list[i])) continue;
        
		value = list[i][sortProp];

		// skip null entries
		if (value == null) continue;

        var type = Array._getType(value);
        if (type != null) return type;
    }
    return null;
},

// _getNormalizer() - method to give us a normalizer based on the data for the
// appropriate field within this Array's member objects.
_getNormalizer : function (sortProp, value) {

	var type = this._getSortDataType(sortProp, value);
    var normalizer = Array._getNormalizerFromType(type);
    return normalizer || Array._normalizeObj;
}, 


//>	@method		array.normalize()	(A)
//		@group	sorting
// 			Normalize a property of an object based on the normalizer for this array 
//			or the type of the property if that's this.normalizer is not set
//
//		@return	(any)	normalized value	
//<
normalize : function (obj, property) {
	var normalizer = (this.normalizer ? this.normalizer : this._getNormalizer(property, obj));
    return normalizer(obj,property);
} 

}); // END isc.addMethods(Array.prototype)

// add static sort routines and variables to the Array object
isc.addProperties(Array,{
	_SORT_TEMP : "__sort_temp",		// name of the temporary variable to use as sort criteria
	_UNEXPECTED_TYPE : "__unexpected_type" // Used by sortByProperty when a value doesn't match
	                                       // the field's expected data type
});

isc.addMethods(Array, {
//>	@method		array._normalize()
//		@group	sorting
//			Normalize one field into another for sorting
//	obj = object to normalize
//	property = property to normalize
//
//		@param	obj			(object)	object to normalize
//		@param	property	(string)	name of the property of object to normalize
//<
_normalizeObj : function (obj, property) { 
	return obj[property];
},
_normalizeStr : function (obj, property) {
	
	return (isc.isA.String(obj[property]) ? obj[property].toLowerCase() : isc.emptyString); 
},
_normalizeNum : function (obj, property) {
    var val = obj[property];
    // put non-numbers at the beginning of the sort
	return isc.isA.Number(val) ? val : (0-Number.MAX_VALUE);
},

_normalizeBool : function (obj, property) {
    var val = obj[property];
    if (val == true) return 1;
    if (val == false) return 0;
    if (val == null) return -1;
    return -2;
},

_normalizeDate : function (obj, property) {

    var time = (obj[property] && isc.isA.Date(obj[property]) ? 
                obj[property].getTime() : 
                new Date(obj[property]).getTime()) 
	// NOTE: "new Date([bad date])" creates a special invalidate date object for which 
    // getTime() returns NaN in both Moz and IE.
    // Replace with zero to reliably sort at the top of ascending sort (or end of descending 
    // sort). 
    
    // NOTE: return the earliest valid date, not 0, which would be epoch time start (Jan 1
    // 1970), which would sort into the middle of some sets of dates.
    if (isNaN(time)) return -8640000000000000;
    return time;                
},

_normalizeTime : function (obj, property) {
    var val = obj[property];
    if (!isc.isA.Date(val) && val != null) val = isc.Time.parseInput(val);
    
    if (isc.isA.Date(val)) return val.getTime();
    return 0;
},

// Normalizer for sorting data of type string numerically
textToNumericNormalizer : function (obj, property) {
	var value = parseInt(obj[property], 10);
	if (isc.isA.Number(value)) return value;
	else return 0;
},

// Given a known data type - what is the appropriate sort-normalizer?


_$string:"string", _$text:"text", _$number:"number", _$integer:"integer", _$float:"float", 

_$int:"int", _$boolean:"boolean", _$Date_ : "Date",  _$Time:"Time",
_$date : "date", _$time:"time",

_getNormalizerFromType : function (type) {
    if (!type || !isc.isA.String(type)) return null;
    switch (type) {
        case this._$string:     
        case this._$text:
                                return Array._normalizeStr;
        case this._$boolean:    return Array._normalizeBool;
        case this._$Date_:
        case this._$date:
                                return Array._normalizeDate;
        case this._$Time:
        case this._$time:
                                return Array._normalizeTime;
                
        case this._$number:
        case this._$integer:
        case this._$int:
        case this._$float:
                                return Array._normalizeNum;
    }
    return Array._normalizeObj;
},

// _getType() - returns the "type" name of an object for sorting normalization purposes
_$object:"object",
_getType : function (object) {
    var type = typeof object;
    if (type == this._$object) {
        if (isc.isA.Date(object)) type = this._$date;
    }
    return type;
},

// _matchesType() - helper method used by sortByProperty to catch unexpected type values
// Note the 'type' specified for a field (like "float") may not match the value returned by
// this._getType(object) - so we have to detect equivalent types, (like float and number)
_standardTypeMap:{
    "float":"number",
    "int:":"number",
    "integer":"number",
    "text":"string",
    "Date":"date",
    "Time":"date",
    "time":"date"
},
_matchesType : function (object, type) {
    var objectType = this._getType(object);
    if (objectType == type) return true;
    
    return (this._standardTypeMap[type] == objectType);
},




//>	@classMethod		Array.compareAscending()	(A)
// Compare two values for an ascending order sort, using locale-sensitive comparison.
//		@group	sorting
//
// @param	a	(any)	first value to compare
// @param	b	(any)	second value to compare
//
// @return	(number)	negative == second is larger, 0 == same value, positive == first is larger	
// @visibility external
//<
compareAscending : function (first, second) {
    if (first != null && first.localeCompare != null) {
        var lc = first.localeCompare(second);
        return lc;
    }
    if (second != null && second.localeCompare != null) {
        var lc = second.localeCompare(first);
        return lc;
    }
	return (second > first ? -1 : second < first ? 1 : 0);
},

//>	@classMethod		Array.compareDescending()	(A)
// Compare two values for a descending order sort, using locale-sensitive comparison.
//		@group	sorting
//
// @param	first	(any)	first value to compare
// @param	second	(any)	second value to compare
//
// @return	(number)	negative == first is larger, 0 == same value, positive == second is larger	
// @visibility external
//<
compareDescending : function (first, second) {
    if (first != null && first.localeCompare != null) {
        var lc = first.localeCompare(second);
        return -1 * lc
    }
    if (second != null && second.localeCompare != null) {
        var lc = second.localeCompare(first);
        return -1 * lc;
    }
	return (second < first ? -1 : second > first ? 1 : 0);
}

//>Safari3 Safari comparators for broken localeCompare
,
safariCompareAscending : function (first, second) {
    if (first != null && first.localeCompare != null) {
        var lc = first.localeCompare(second);
        return lc - 2;
    }
    if (second != null && second.localeCompare != null) {
        var lc = second.localeCompare(first);
        return lc - 2;
    }
	return (second > first ? -1 : second < first ? 1 : 0);
},
safariCompareDescending : function (first, second) {
    if (first != null && first.localeCompare != null) {
        var lc = first.localeCompare(second);
        return -1 * (lc - 2);
    }
    if (second != null && second.localeCompare != null) {
        var lc = second.localeCompare(first);
        return -1 * (lc - 2);
    }
	return (second < first ? -1 : second > first ? 1 : 0);
}
//<Safari3

});

// Central array for temp storage of normalized values for sorting

isc._normalizedValues = [];
isc._unexpectedTypeValues = [];
isc._sortDirections = [];



//>Safari3
(function () {
    if (isc.Browser.isSafari) {
        var b = "b";
        if (b.localeCompare("a") == 3) {
            Array.compareAscending = Array.safariCompareAscending;
            Array.compareDescending = Array.safariCompareDescending;
        }
    }
})();
//<Safari3

