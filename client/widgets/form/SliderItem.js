/*
 * Isomorphic SmartClient
 * Version SC_SNAPSHOT-2010-12-07 (2010-12-07)
 * Copyright(c) 1998 and beyond Isomorphic Software, Inc. All rights reserved.
 * "SmartClient" is a trademark of Isomorphic Software, Inc.
 *
 * licensing@smartclient.com
 *
 * http://smartclient.com/license
 */

 
 


//> @class SliderItem
// FormItem that uses a +link{class:Slider} component to present an interface for picking
// from either a continuous range or a range with a small number of discrete values.
//
// @treeLocation Client Reference/Forms/Form Items
// @visibility external
// @example sliderItem
//<



isc.ClassFactory.defineClass("SliderItem", "CanvasItem");

isc.SliderItem.addProperties({

    // Passthroughs: certain properties are very likely to be set and so we allow setting them
    // right on the SliderItem
    // ---------------------------------------------------------------------------------------

    //> @attr sliderItem.vertical (boolean : false : IR)
    // @include slider.vertical
    //<
    vertical:false,

    //>	@attr sliderItem.minValue (float : 1 : [IR])
    // @include slider.minValue
    // @example sliderItem
    //<
    minValue:1,

    //>	@attr sliderItem.maxValue (float : 100 : [IR])
    // @include slider.maxValue
    // @example sliderItem
    //<
    maxValue:100,

    //>	@attr sliderItem.numValues (integer : null : [IR])
    // @include slider.numValues
    // @example sliderItem
    //<
    
    //> @attr sliderItem.roundValues (boolean : true : IR)
    // @include slider.roundValues
    // @example sliderItem
    //<
    roundValues:true,

    //> @attr sliderItem.roundPrecision (number : 1 : IR)
    // @include slider.roundPrecision
    // @example sliderItem
    //<
    roundPrecision:1,
    
    //>	@attr sliderItem.defaultValue (integer : 1 : [IRW])
    // Default value for this sliderItems is 1.
    // @visibility external
    //<
    defaultValue:1,
    
    // sliderProperties: use for setting any other Slider property
    // ---------------------------------------------------------------------------------------
    
    //> @attr sliderItem.sliderProperties (Slider properties : null : IR)
    // Properties to add to the automatically created +link{class:Slider} used by this
    // FormItem.  See the +link{class:Slider} class for reference.
    //
    // @visibility external
    //<

    // ---------------------------------------------------------------------------------------

    shouldSaveValue:true,
    
    sliderDefaults : {
        autoDraw:false,
        showTitle:false,
        valueChanged : function () {
            if (this.canvasItem) this.canvasItem.sliderChange();
        }
    },
    autoDestroy:true
});

isc.SliderItem.addMethods({
    init : function () {
        this.Super("init", arguments);
        // used for change detection
        this._currentValue = this.getDefaultValue();
    },
    
    // Override _createCanvas to set up a Slider as this item's canvas, and set up appropriate
    // set of properties.
    _createCanvas : function () {
        // create our slider based on our sliderDefaults, and appropriate instance properties.
        var sliderDefaults = this.sliderDefaults;

        var sliderProperties = isc.addProperties(
                                {},
                                sliderDefaults, 
                                {
                                    vertical:this.vertical,
                                    minValue:this.minValue,
                                    maxValue:this.maxValue,
                                    value:this.defaultValue,
                                    numValues:this.numValues,
                                    roundValues:this.roundValues,
                                    roundPrecision:this.roundPrecision,
                                    tabIndex:this.getGlobalTabIndex()
                                },
                                this.sliderProperties
                               );

        this.canvas = isc.Slider.create(sliderProperties);
        
        this.Super("_createCanvas", arguments);        
    },
    
    // Sliders are editable
    isEditable : function () {
        return true;
    },
            
    // Override setValue to update the value on the slider
    setValue : function (value) {
        this._setValueCalled = true;

        var defaultVal;
        if (value == null) {
            defaultVal = this.getDefaultValue();
            // don't apply the default value if it's not set - this allows for the distinction 
            // between setting the value to 'null' vs 'undefined'
            if (defaultVal != null) value = defaultVal;
        }
        // update the previous value so we don't fire a change handler on 'sliderChanged'
        this._currentValue = value;
        this.canvas.setValue(value, (defaultVal != null));
        // No need to save this value - that should be handled by sliderChange
    },
    
    getValue : function () {
        return this.canvas.getValue();
    },
    
    //>@attr sliderItem.changeOnDrag (boolean : true : IRW)
    // Should this sliderItem update its value and fire change handlers while the user is
    // actively dragging the slider.
    // Setting this attribute value to <code>false</code> will suppress any change notifications
    // from the user dragging the slider thumb until the user releases the mouse at the final
    // position.
    // This can be useful to avoid repeatedly firing expensive operations such as server fetches
    // while the user drags through a range of values.
    // @visibility external
    //<
    
    changeOnDrag:true,
    
    // Define a sliderChange function to handle value changes
    sliderChange : function() {
        
        // Note: the slider.valueChanged method doesn't inform us what the old value was, so
        // we need to track this ourselves in order to pass it to any item level change handler.
        var val = this.canvas.getValue();

        if (this._currentValue != val) {
            // if changeOnDrag is false, don't update anything until the user is done dragging
            // the slider around
            if (this.changeOnDrag || !this.canvas.valueIsChanging()) {
                this._updateValue(val);
                this._currentValue = val;
            }
            
        // catch the case where there was an explicit setValue() call, and save out the new
        // value from the slider.
        } else {
            this.saveValue(val);
        }
    },
    
    //>	@method	sliderItem.setMinValue()   ([])
    // @include slider.setMinValue()
    //<
    setMinValue : function (newValue) {
        this.canvas.setMinValue(newValue);
          
    },
    
    //>	@method	sliderItem.setMaxValue()   ([])
    // @include slider.setMaxValue()
    //<
    setMaxValue : function (newValue) {
        this.canvas.setMaxValue(newValue);
    },
    
    //>	@method	sliderItem.setNumValues()   ([])
    // @include slider.setNumValues()
    //<
    setNumValues : function (newNumValues) {
        this.canvas.setNumValues(newNumValues);
    }

    


});
