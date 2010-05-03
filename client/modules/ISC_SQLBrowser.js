/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-05-02 (2010-05-02)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 



//
// This script will load Reference Viewer of the Isomorhic SmartClient Application Framework
// libraries
//
var libs = 
	[
        "tools/SQLEditor.js",
        "tools/SQLTableBrowser.js",
        "tools/DBPane.js",
        "schema/DBSchema.ds.xml",
        "tools/DBSchemaTree.js",
        "schema/DataSourceStore.ds.xml",
        "schema/DBListDS.ds.xml",
        "tools/DBCompactList.js",
        "tools/DBList.js",
        "tools/SQLBrowser.js"
	];

//<STOP PARSING 

// The following code only executes if the script is being dynamically loaded.

// the following statement allows a page that is not in the standard location to take advantage of
// dynamically loaded scripts by explicitly setting the window.isomorphiDir variable itself.
if (! window.isomorphicDir) window.isomorphicDir = "../isomorphicSDK/smartclient/";

// dynamic loading
function iscLoadLibs() {
	for(var i=0,l=libs.length;i<l;i++) {
		if (!libs[i]) continue;
		if (window.UNSUPPORTED_BROWSER_DETECTED == true) break;
		document.write("<"+"SCRIPT SRC=" + window.isomorphicDir + "client/" + libs[i]+".js><"+"/SCRIPT>");
	}
	window.defaultStatus = "";
}
iscLoadLibs();
