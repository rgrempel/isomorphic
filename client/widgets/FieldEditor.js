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
isc.ClassFactory.defineClass("FieldEditor", "Window");

isc.FieldEditor.addProperties({
        //fields:null, // to be set by the component that uses this
        isModal: true,
        showMinimizeButton: false,
        autoCenter: true,
        autoSize:true,
        defaultWidth:375,
        visibleFieldsConstructor: "ListGrid",
        hiddenFieldsConstructor: "ListGrid",
        showFooter: false,
        title:"Customize Fields",
        showInstructionsPane:true,
        bodyProperties:{ layoutMargin : 5 },
        instructionsPaneDefaults : {
            _constructor:isc.HTMLFlow,
            padding:5,
            height:1
        },
        instructions:"Drag fields between grids to control which fields are visible " +
                     "and the order in which fields are displayed",
        initWidget : function () {
            this.invokeSuper(isc.FieldEditor, "initWidget");

            if (!this.fields) {
                isc.logWarn('FieldEditor can not be created because no fields were provided');
                return;
            }
    
            this.addItem(this.addAutoChild("instructionsPane", {
                contents:this.instructions
            }));

            var gridProps = {
                showHeader: false,
                height:200, width:150,
                leaveScrollbarGap:false,
                fields:[{
                    name:"title",
                    formatCellValue : "value || record.name"
                }],
                canDragRecordsOut: true,
                canAcceptDroppedRecords: true,
                canReorderRecords: true,
                dragDataAction: "move"                
            };
            
            var visFieldsGrid = this.visibleFieldsGrid = this.createAutoChild("visibleFields",gridProps);
            var allFields = this.fields;
            
            var vFields = allFields.findAll("visible", null);
            var hFields = allFields.findAll("visible", false);
            
            visFieldsGrid.setData(vFields);
            gridProps.canReorderRecords = false;
            var hidFieldsGrid = this.hiddenFieldsGrid = this.createAutoChild("hiddenFields", gridProps);
           
            hidFieldsGrid.setData(hFields);
            var container = isc.HStack.create({membersMargin:10,
                height: 1, overflow:"visible",
                members:[
                    isc.VStack.create({
                        layoutMargin:5, membersMargin:5,
                        members:[
                            isc.Label.create({autoFit:true,contents:"<nobr><b>Visible Fields</b></nobr>"}),
                            visFieldsGrid
                        ]
                    }),
                    isc.VStack.create({width:32, height:74, layoutAlign:"center", membersMargin:10, 
                      members:[
                        isc.Img.create({src:"[SKINIMG]actions/back.png", width:16, height:16,
                                visFieldsGrid: visFieldsGrid, hidFieldsGrid: hidFieldsGrid,
                                layoutAlign:"center",
                                click:"this.visFieldsGrid.transferSelectedData(this.hidFieldsGrid)"
                        }),
                        isc.Img.create({src:"[SKINIMG]actions/forward.png", width:16, height:16,
                                layoutAlign:"center",
                                visFieldsGrid: visFieldsGrid, hidFieldsGrid: hidFieldsGrid,
                                click:"this.hidFieldsGrid.transferSelectedData(this.visFieldsGrid)"
                        })
                    ]}),
                    isc.VStack.create({
                        layoutMargin:5, membersMargin:5, 
                        members:[
                            isc.Label.create({autoFit:true,contents:"<nobr><b>Hidden Fields</b></nobr>"}),
                            hidFieldsGrid
                        ]
                    })
                
                ]});
           
            this.addItem(container);
            
            var okButton = this.createAutoChild("okButton", {
                    autoDraw: false,
                    title: "Done",
                    fieldEditor: this,
                    click: function () { this.creator.okClick(); },
                    layoutAlign:"center"
            }, isc.IButton);
            this.addItem(okButton);
        },
        okClick : function () {
            var vFields = isc.clone(this.visibleFieldsGrid.data);
            var hFields = isc.clone(this.hiddenFieldsGrid.data);
                        
            vFields.setProperty("visible", null);
            hFields.setProperty("visible", false);
                       
            vFields.addList(hFields);

            var fieldState = vFields.getProperties(["name", "visible"]);

            this.done(vFields, fieldState);

            this.hide();
            this.destroy();
        },
        done : function (vFields, fieldState) {
        }
        
});
