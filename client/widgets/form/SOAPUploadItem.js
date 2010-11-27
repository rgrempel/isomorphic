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

 

// SOAPUploadItem depends on MultiUploadItem, which requires ListGrid (not part of the forms module)
if (isc.ListGrid) {



//> @class SOAPUploadItem
// @visibility internal
//<
isc.ClassFactory.defineClass("SOAPUploadItem", "DialogUploadItem");
isc.SOAPUploadItem.addProperties({
    dataSource: "sessionFiles"
});

}