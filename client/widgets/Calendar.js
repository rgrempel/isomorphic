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




//>	@class	Calendar
// The Calendar component provides several different ways for a user to view and
// edit a set of events. Note that the <b>ISC_Calendar.js</b> module must be 
// loaded to make use of the Calendar class.
// <P>
// <b>CalendarEvents</b>
// <P>
// Events are represented as ordinary JavaScript Objects (see +link{CalendarEvent}).  
// The Calendar expects to be able to read and write a basic set of properties 
// on events: name, startDate, endDate, description, etc, which can be stored 
// under configurable property names (see eg +link{calendar.startDateField}.
// <P>
// Much like a +link{ListGrid} manages it's ListGridRecords, the Calendar can 
// either be passed an ordinary Array of CalendarEvents or can fetch data from a 
// DataSource.
// <P>
// If the calendar is bound to a DataSource, event changes by user action or by 
// calling methods will be saved to the DataSource.
// <P>
// <b>Navigation</b>
// <P>
// The calendar supports a +link{calendar.weekView,WeekView}, 
// +link{calendar.dayView,DayView} and +link{calendar.monthView,MonthView} by 
// default.  The user can navigate using back and forward buttons or via an 
// attached +link{calendar.dateChooser,DateChooser}.
// <P>
// <b>Event Manipulation</b>
// <P>
// Events can be created via clicking on the day, week or month views, or via the 
// "Add Event" button.  In the day and week views, the user may click and drag 
// to create an event of a specific duration.
// <P>
// Creating an event via click or click and drag pops up the
// +link{calendar.eventDialog,EventDialog}, which provides a simple form for 
// quick event entry (only one field, the description, is required by default).  
// <P>
// A separate editor called the +link{calendar.eventEditor,EventEditor} provides 
// an interface for editing all possible properties of an event, including custom 
// properties.  The EventEditor is used whenever a pre-existing event is being 
// edited, and can also be invoked
// by the user wherever the simpler EventDialog appears.
// <P>
// Events can also be programmatically +link{calendar.addEvent,added},
// +link{calendar.removeEvent,removed}, or +link{calendar.updateEvent,updated}.  
//  
// @implements DataBoundComponent
// @treeLocation  Client Reference/Calendar
// @example simpleCalendar
// @visibility calendar
//<
isc.ClassFactory.defineClass("Calendar", "Canvas", "DataBoundComponent");

isc.Calendar.addProperties({

defaultWidth: "100%",
defaultHeight: "100%",

year:new Date().getFullYear(),		// full year number
month:new Date().getMonth(),		// 0-11

//> @attr calendar.chosenDate  (Date : 'Today' : IRW)
// The date for which events are displayed in the day, week, and month tabs of 
// the calendar.  Default is today.
//
// @group date
// @visibility calendar
//<
chosenDate:new Date(),	

//> @attr calendar.firstDayOfWeek  (Number : 0 : IRW)
// The numeric day (0-6) which the calendar should consider as the first day of the week
//
// @group date
// @visibility calendar
//<
firstDayOfWeek:0,

// Styling
// ---------------------------------------------------------------------------------------

//> @attr calendar.baseStyle  (CSSStyleName : "calendar" : IRW)
// The base name for the CSS class applied to the grid cells of the day and week views
// of the calendar. This style will have "Dark", "Over", "Selected", or "Disabled"
// appended to it according to the state of the cell.
//
// @group appearance
// @visibility calendar
//<
baseStyle: "calendar",

//> @attr calendar.dayHeaderBaseStyle  (CSSStyleName : "calMonthDayHeader" : IRW)
// The base name for the CSS class applied to the day headers of the month view.
// This style will have "Dark", "Over", "Selected", or "Disabled"
// appended to it according to the state of the cell.
//
// @group appearance
// @visibility calendar
//<
dayHeaderBaseStyle: "calMonthDayHeader",

//> @attr calendar.dayBodyBaseStyle  (CSSStyleName : "calMonthDayBody" : IRW)
// The base name for the CSS class applied to the day body of the month view
// of the calendar. This style will have "Dark", "Over", "Selected", or "Disabled"
// appended to it according to the state of the cell.
//
// @group appearance
// @visibility calendar
//<
dayBodyBaseStyle: "calMonthDayBody",

//> @attr calendar.otherDayHeaderBaseStyle  (CSSStyleName : "calMonthDayHeader" : IRW)
// The base name for the CSS class applied to the day headers of the month view.
// This style will have "Dark", "Over", "Selected", or "Disabled"
// appended to it according to the state of the cell.
//
// @group appearance
// @visibility calendar
//<
otherDayHeaderBaseStyle: "calMonthOtherDayHeader",

//> @attr calendar.otherDayBodyBaseStyle  (CSSStyleName : "calMonthDayBody" : IRW)
// The base name for the CSS class applied to the day body of the month view
// of the calendar. This style will have "Dark", "Over", "Selected", or "Disabled"
// appended to it according to the state of the cell.
//
// @group appearance
// @visibility calendar
//<
otherDayBodyBaseStyle: "calMonthOtherDayBody",

//> @attr calendar.otherDayBlankStyle (CSSStyleName : "calMonthOtherDayBlank" : IR)
// In the month CSS style applied to both the header and body of days from other months when
// +link{showOtherDays} is false.
//
// @group appearance
// @visibility calendar
//<
otherDayBlankStyle: "calMonthOtherDayBlank",

//> @attr calendar.selectedCellStyle  (CSSStyleName : "calendarCellSelected" : IRW)
// The base name for the CSS class applied to a cell that is selected via a mouse drag.
//
// @group appearance
// @visibility calendar
//<
selectedCellStyle: "calendarCellSelected",

//> @attr calendar.eventWindowStyle  (CSSStyleName : "eventWindow" : IRW)
// The base name for the CSS class applied to event windows within calendars.
// This style will have "Header", "HeaderLabel", and "Body" appended to it, according to 
// which part of the event window is being styled. For example, to style the header, define
// a css class called 'eventWindowHeader'.
//  
// @group appearance
// @visibility calendar
//<
eventWindowStyle: "eventWindow",

calMonthEventLinkStyle: "calMonthEventLink",

// Workday properties
//---------------------------------------------------------------------------------------------

//> @attr calendar.workdayBaseStyle (CSSStyleName : "calendarWorkday" : IR)
// If +link{showWorkday} is set, style used for cells that are within the workday, as defined by
// +link{workdayStart} and +link{workdayEnd}.
//
// @group workday, appearance
// @visibility calendar
//<
workdayBaseStyle: "calendarWorkday",

//> @attr calendar.workdayStart (Time : "9:00am" : IR)
// When using +link{showWorkday}:true, <code>workdayStart</code> and <code>workdayEnd</code>
// specify the time of day when the workday starts and ends, specified as a
// String acceptable to +link{Time.parseInput()}.
// <P>
// Both start and end time must fall on a 30 minute increment (eg 9:30, but not 9:45).
//
// @group workday, date
// @visibility calendar
//<
workdayStart: "9:00am",

//> @attr calendar.workdayEnd (Time : "5:00pm" : IR)
// @include calendar.workdayStart
//
// @group workday, date
// @visibility calendar
//<
workdayEnd: "5:00pm",

//> @attr calendar.showWorkday (boolean : false : IR)
// If set, causes the calendar to use +link{workdayBaseStyle}
// for cells falling within the workday as defined by +link{workdayStart} and +link{workdayEnd},
// in both the +link{weekView} and +link{dayView}.
//
// @group workday
// @visibility calendar
//<
showWorkday: false,

//> @attr calendar.workdays (Array : [1,2,3,4,5] : IR)
// Array of days that are considered workdays when +link{showWorkday} is true
//
// @group workday
// @visibility calendar
//<
workdays: [1, 2, 3, 4, 5],

//> @attr calendar.scrollToWorkday (boolean : false : IR)
// If set, causes the +link{workdayStart,workday hours} to be sized to fill the available space
// in the day view and week view, and automatically scrolls these views to the start of the
// workday when the calendar is first displayed and whenever the user switches to a new day or
// week.
//
// @group workday
// @visibility calendar
//<
scrollToWorkday: false,

// Fields on Event Records
// ---------------------------------------------------------------------------------------

//> @attr calendar.nameField  (String : "name" : IR)
// The name of the name field in a +link{CalendarEvent}.
// 
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
nameField: "name",

//> @attr calendar.descriptionField  (String : "description" : IR)
// The name of the description field in a +link{CalendarEvent}.
//
// @group calendarEvent
// @visibility calendar
//<
descriptionField: "description",

//> @attr calendar.startDateField  (String : "startDate" : IR)
// The name of the start date field in a +link{CalendarEvent}.
//
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
startDateField: "startDate",

//> @attr calendar.endDateField  (String : "endDate" : IR)
// The name of the end date field in a +link{CalendarEvent}.
//
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
endDateField: "endDate",

//> @attr calendar.leadingDateField  (String : "leadingDate" : IR)
// The name of the end date field in a +link{CalendarEvent}.
//
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
leadingDateField: "leadingDate",

//> @attr calendar.trailingDateField  (String : "trailingDate" : IR)
// The name of the end date field in a +link{CalendarEvent}.
//
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
trailingDateField: "trailingDate",

//> @attr calendar.eventTypeField  (String : "eventType" : IR)
// The name of the field which will determine the row in which this event will be displayed
// for the +link{Calendar.timelineView}
//
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
eventTypeField: "type",

//> @attr calendar.eventWindowStyleField (String : "eventWindowStyle" : IR)
// The name of the field used to override +link{calendar.eventWindowStyle} for an individual
// +link{CalendarEvent}.  See +link{calendarEvent.eventWindowStyle}.
//
// @group calendarEvent, appearance
// @visibility calendar
//<
eventWindowStyleField: "eventWindowStyle",

//> @attr calendar.canEditField  (String : "canEdit" : IR)
// Name of the field on each +link{CalendarEvent} that determines editability.
//
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
canEditField: "canEdit",

//> @attr calendar.canDragEventField  (String : "canEdit" : IR)
// Name of the field on each +link{CalendarEvent} that determines dragability.
//
// @group calendarEvent
// @visibility calendar
// @see CalendarEvent
//<
canDragEventField: "canDrag",

//> @attr calendar.weekEventBorderOverlap (Boolean : false : IR)
// Augments the width of week event windows slightly to avoid duplicate adjacent borders
// between events.
//
// @group appearance
// @visibility calendar
//<
weekEventBorderOverlap: false,

// Event Editing
// ---------------------------------------------------------------------------------------

//> @attr calendar.eventSnapGap (Integer : 30 : IR)
// Determines how many minutes an event can be moved or resized by.
//
// @group editing
// @visibility calendar
//<
eventSnapGap: 30,

//> @attr calendar.showQuickEventDialog (Boolean : true : IR)
// Determines whether the quick event dialog is displayed when a time is clicked. If this is
// false, the full event editor is displayed.
//
// @group editing
// @visibility calendar
//<
showQuickEventDialog: true,

//> @attr calendar.eventEditorFields (Array of FormItem : see below : IR)
// The set of fields for the +link{calendar.eventEditor, event editor}.
// <p>
// The default set of fields are: 
// <pre>
//    {name: "startHours", title: "From", type: "select", width: 60},
//    {name: "startMinutes", showTitle: false, type: "select", width: 60},
//    {name: "startAMPM", showTitle: false, type: "select", width: 60},
//    {name: "invalidDate", type: "blurb", colSpan: 4, visible: false}
//    {name: "endHours", title: "To", type: "select", width: 60},
//    {name: "endMinutes", showTitle: false, type: "select", width: 60},
//    {name: "endAMPM", showTitle: false, type: "select", width: 60},
//    {name: "name", title: "Name", type: "text", colSpan: 4},
//    {name: "description", title: "Description", type: "textArea", colSpan: 4, height: 50}
// </pre>
// See the Customized Binding example below for more information on altering default datasource 
// fields within forms.
// 
// @group editing
// @example customCalendar
// @example validationFieldBinding
// @visibility calendar
//<

//> @attr calendar.eventDialogFields (Array of FormItem : see below : IR)
// The set of fields for the +link{calendar.eventDialog, event dialog}. 
// <p>
// The default set of fields are: 
// <pre>
//    {name: "name", title: "Event Name", type: nameType, width: 250 },
//    {name: "save", title: "Save Event", type: "SubmitItem", endRow: false},
//    {name: "details", title: "Edit Details", type: "button", startRow: false}
// </pre>
// See the Customized Binding example below for more information on altering default datasource 
// fields within forms.
//
// @group editing
// @example customCalendar
// @example validationFieldBinding
// @visibility calendar
//<

// Allowed operations
// ---------------------------------------------------------------------------------------

//> @groupDef allowedOperations
// 
// @title Allowed Operations
// @visibility external
//<

//> @attr calendar.canCreateEvents (Boolean : true : IR)
// If true, users can create new events
//
// @group allowedOperations
// @visibility calendar
//<
canCreateEvents: true,

//> @attr calendar.canEditEvents (Boolean : true : IR)
// If true, users can edit existing events
//
// @group allowedOperations
// @visibility calendar
//<
canEditEvents: true, 

//> @attr calendar.canDeleteEvents (Boolean : true : IR)
// If true, users can delete existing events. Defaults to +link{calendar.canEditEvents}
//
// @group allowedOperations
// @visibility calendar
//<
canDeleteEvents: true,

//> @attr calendar.canDragEvents (Boolean : true : IR)
// If true, users can drag-reposition existing events. 
//
// @group allowedOperations
// @visibility calendar
//<
canDragEvents: true,

// Show / Hide parts of the interface
// ---------------------------------------------------------------------------------------

//> @attr calendar.showDateChooser (Boolean : true : IR)
// Determines whether the +link{calendar.dateChooser,dateChooser} is displayed.
//
// @group visibility
// @visibility calendar
//<
showDateChooser: false, 

//> @attr calendar.disableWeekends (boolean : true : IR)
// If set, weekend days appear in disabled style and events cannot be created on weekends.
// Which days are considered weekends is controlled by +link{Date.weekendDays}.
//
// @group visibility 
// @visibility calendar
//<
disableWeekends: true,

//> @attr calendar.showWeekends (boolean : true : IR)
// Suppresses the display of weekend days in the week and month views, and disallows the
// creation of events on weekends.  Which days are considered weekends is controlled by
// +link{Date.weekendDays}.
//
// @group visibility
// @visibility calendar
//<
showWeekends: true,

//> @attr calendar.showDayHeaders (boolean : true : IR)
// If false, the month view does not show day headers
//
// @group visibility
// @visibility calendar
//<
showDayHeaders: true,

//> @attr calendar.showOtherDays (boolean : true : IR)
// If set to true, in the month view, days that fall in an adjacent month are still shown with
// a header and body area, and are interactive.  Otherwise days from other months are rendered
// in the +link{otherDayBlankStyle} and are non-interactive.
//
// @group visibility
// @visibility calendar
//<
showOtherDays: true,

//> @attr calendar.showControlsBar (boolean : true : IR)
// If false the controls bar at the top of the calendar will not be displayed. This consists 
// of the autoChildren: +link{previousButton}, +link{nextButton}, +link{addEventButton},
// +link{datePickerButton}
// @visibility calendar
//<
showControlsBar: true,

// Overlapping event placement
// ---------------------------------------------------------------------------------------

//> @attr calendar.eventAutoArrange (boolean : true : IR)
// If set to true, enables the auto-arrangement of events that share time in the calendar.  The
// default is true.
//
// @group calendarEvent
// @visibility calendar
//<
eventAutoArrange: true,

//> @attr calendar.eventOverlap (boolean : true : IR)
// When +link{eventAutoArrange} is true, setting eventOverlap to true causes events that 
// share timeslots to overlap each other by a percentage of their width, specified by 
// +link{eventOverlapPercent}.  The default is true.
//
// @group calendarEvent
// @visibility calendar
//<
eventOverlap: true,

//> @attr calendar.eventOverlapPercent (number : 10 : IR)
// The size of the overlap, presented as a percentage of the width of events sharing timeslots
//
// @group calendarEvent
// @visibility calendar
//<
eventOverlapPercent: 10,

//> @attr calendar.eventOverlapIdenticalStartTimes (boolean : false : IR)
// When set to true, events that start at the same time will not overlap each other to prevent 
// events having their close button hidden
//
// @group calendarEvent
// @visibility calendar
//<

// AutoChildren
// ---------------------------------------------------------------------------------------

//> @attr calendar.dayView (AutoChild : null : R)
// Listgrid used to display events that pertain to a given day.
//
// @visibility calendar
//<

//> @attr calendar.weekView (AutoChild : null : R)
// Listgrid used to display events that pertain to a given week.
//
// @visibility calendar
//<

//> @attr calendar.monthView (AutoChild : null : R)
// Listgrid used to display events that pertain to a given month.
//
// @visibility calendar
//<

//> @attr calendar.dateChooser (AutoChild : null : R)
// +link{DateChooser} used to select the date for which events will be displayed.
//
// @visibility calendar
//<

//> @attr calendar.eventDialog (AutoChild : null : R)
// An autochild of type +link{Window} that displays a quick event entry form within a 
// popup window.
//
// @visibility calendar
//<

//> @attr calendar.eventEditorLayout (AutoChild : null : R)
// An autochild of type +link{Window} that displays the full 
// +link{calendar.eventEditor, event editor}
//
// @visibility calendar
//<

//> @attr calendar.eventEditor (AutoChild : null : R)
// An autochild of type +link{DynamicForm} which displays +link{CalendarEvent, event data}. 
// This form is created within the +link{calendar.eventEditorLayout,event editor layout}
//
// @visibility calendar
//<

//> @attr calendar.datePickerButton (AutoChild : null : IR) 
// The datePickerIcon is an ImgButton that appears above the week/day/month views of the
// calendar and offers alternative access to a +link{DateChooser} to pick the current day.
//
// @visibility calendar
//<  

//> @attr calendar.addEventButton (AutoChild : null : IR) 
// The addEventButton is an ImgButton that appears above the week/day/month views of the
// calendar and offers an alternative way to create a new event.
//
// @visibility calendar
//<  

//> @attr calendar.previousButton (AutoChild : null : IR) 
// The previousButton is an ImgButton that appears above the week/day/month views of the
// calendar and allows the user to move the calendar backwards in time.
//
// @visibility calendar
//<  

//> @attr calendar.nextButton (AutoChild : null : IR) 
// The nextButton is an ImgButton that appears above the week/day/month views of the
// calendar and allows the user to move the calendar forwards in time.
//
// @visibility calendar
//<  

// CalendarEvent
// ---------------------------------------------------------------------------------------

//> @object CalendarEvent
// An object which represents an event to occur at a specific time, displayed within the
// calendar.
//
// @group data
// @treeLocation Client Reference/Calendar
// @visibility calendar
//<

//> @attr calendarEvent.startDate (Date : null : IRW)
// Date object which represents the start date of a +link{CalendarEvent}.
// The name of this field within the CalendarEvent can be changed via 
// +link{Calendar.startDateField}
//
// @visibility calendar
//<

//> @attr calendarEvent.endDate (Date : null : IRW)
// Date object which represents the end date of a +link{CalendarEvent}
// The name of this field within the CalendarEvent can be changed via 
// +link{Calendar.endDateField}
//
// @visibility calendar
//<

//> @attr calendarEvent.name (String : null : IRW)
// String which represents the name of a +link{CalendarEvent}
// The name of this field within the CalendarEvent can be changed via 
// +link{Calendar.nameField}
//
// @visibility calendar
//<

//> @attr calendarEvent.description (String : null : IRW)
// String which represents the description of a +link{CalendarEvent}
// The name of this field within the CalendarEvent can be changed via 
// +link{Calendar.descriptionField}
//
// @visibility calendar
//<

//> @attr calendarEvent.canEdit (String : null : IRW)
// Optional boolean value controlling the editability of this particular calendarEvent.
//  The name of this field within the CalendarEvent can be changed via 
//  +link{calendar.canEditField}.
//
// @visibility calendar
//<

//> @attr calendarEvent.eventWindowStyle (CSSStyleName : null : IR)
// CSS style series to use for the draggable event window that represents this event.  If
// specified, overrides +link{calendar.eventWindowStyle} for this specific event.
// <P>
// The name of this field within the CalendarEvent can be changed via 
// +link{Calendar.eventWindowStyleField}
//
// @visibility calendar
//<

// Data & Fetching
// ---------------------------------------------------------------------------------------

//>	@attr calendar.data		(List of CalendarEvent : null : IRW)
// A List of CalendarEvent objects, specifying the data to be used to populate the
// calendar.  
// <p>
// This property will typically not be explicitly specified for databound Calendars, where
// the data is returned from the server via databound component methods such as
// +link{fetchData()}. In this case the data objects will be set to a 
// +link{class:ResultSet,resultSet} rather than a simple array.
//
// @group	data
// @see CalendarEvent
// @setter Calendar.setData()
// @visibility calendar
//<

//> @method calendar.fetchData()
// @include dataBoundComponent.fetchData()
// @group dataBoundComponentMethods
// @visibility calendar
// @example databoundFetch
//<

//>	@attr calendar.autoFetchData       (boolean : false : IR)
// @include dataBoundComponent.autoFetchData
// @group databinding
// @visibility calendar
// @example fetchOperation
//<

//>	@attr calendar.autoFetchTextMatchStyle       (TextMatchStyle : null : IR)
// @include dataBoundComponent.autoFetchTextMatchStyle
// @group databinding
// @visibility external
//<

//> @method calendar.filterData()
// @include dataBoundComponent.filterData()
// @group dataBoundComponentMethods
// @visibility external
//<

//> @attr Calendar.initialCriteria   (Criteria : null :IR)
// @include dataBoundComponent.initialCriteria
// @visibility calendar
//<

//> @type CalendarFetchMode 
// Granularity at which CalendarEvents are fetched from the server.
//
// @value "all" no criteria is sent to the server, so all events will be fetched
// @value "month" events are fetched one month at a time
// @value "week" events are fetch on week at a time.  Month view may not be used
// @value "day" events are fetched one day at a time.  Only day view may be used
// @visibility internal
//<

//> @attr calendar.fetchMode (CalendarFetchMode : "month" : IR)
// The granularity at which events are fetched.
// <P>
// With any setting other than "all", whenever +link{fetchData} is called the calendar will add
// criteria requesting a range of either one month, one week or one day of events depending on
// this setting.  Subsequently additional fetch requests will be sent automatically as the user
// navigates the calendar.
// <P>
// If +link{calendar.criteriaFormat} is "simple", the criteria will be added as two fields
// "firstVisibleDay" and "lastVisibleDay" with values of type Date.  Note that the these
// fieldNames intentionally differ from +link{calendarEvent.startDate} and
// +link{calendarEvent.endDate} because adding values for <code>startDate</code> and
// <code>endDate</code> to simple criteria would match only events on those exact dates.
// <P>
// If the <code>criteriaFormat</code> is "advanced", the criteria passed to
// <code>fetchData</code> will be converted to +link{AdvancedCriteria} if needed, then criteria
// will be added that would select the appropriate records from any DataSource that supports
// searching with AdvancedCriteria.  That is, the criteria will express:
// <pre>
//   calendarEvent.endDate => firstVisibleDay AND
//   calendarEvent.startDate <= lastVisibleDay
// </pre>
// 
// @visibility internal
//<

//> @type CriteriaFormat
// @value "simple" criteria represents as simple key-value pairs - see +link{Criteria}
// @value "advanced" criteria represents as type-operator-value triplets, potentially nested to
//                   form complex queries.  See +link{AdvancedCriteria}.
// @visibility internal
//<

//> @method calendar.criteriaFormat (CriteriaFormat : "advanced" : IR)
// When adding criteria to select events for the currently visible date range, should we use
// simple +link{Criteria} or +link{AdvancedCriteria}?  See +link{fetchMode}.
// @visibility internal
//<

// TimelineView
// ---------------------------------------------------------------------------------------

//> @attr calendar.timelineView (autoChild)
// A timeline for displaying events of various types.
// @visibility internal
//<

//> @attr calendar.showTimelineView (boolean : false : IRW)
// If set to true, show the Timeline view.
// @visibility internal
//<
showTimelineView: false,

// only works for timeline view for now
renderEventsOnDemand: true,

//> @attr calendar.timelineGranularity (string : "day" : IR)
// The granularity with which the timelineView will display events. Possible values are
// "day", "hour" or "minute".
// @visibility internal
//<
timelineGranularity: "day",

//> @attr calendar.timelineUnitsPerColumn (number: 1: IR)
// How many units of +link{timelineGranularity} each cell represents.
// @visibility internal
//<
timelineUnitsPerColumn: 1,

// @attr calendar.canResizeTimelineEvents (boolean : false : IR)
// Can timeline events be stretched by their left and right edges?
// @visibility internal
//<
canResizeTimelineEvents: false,

// @attr calendar.canEditEventType (boolean : null : IR)
// Can we edit the event type of the event, specified by the +link{eventTypeField}?
// If so, the event can be dragged to a different row and the +link{eventTypeField} will
// be updated automatically.
// @visiblity internal
//<

// @attr calendar.timelineStartDate (Date : null : IR)
// The start date of the timeline view.
// @visibility internal
//<

// @attr calendar.timelineEndDate (Date : null : IR)
// The end date of the timeline view.
// @visibility internal
//<

// @attr calendar.eventTypeData (Array of Object : null : IR)
// The data that determines the rows of the timeline view. 
// @visiblity internal
//<

// @attr calendar.timelineLabelFields (Array of ListgridField : null : IR)
// An array of fields that will be displayed to the left of the timeline. These fields
// reference the +link{eventTypeData}. 
// @visibility internal
//<

// @attr calendar.todayBackgroundColor (String : null : IR)
// The background color for today when +{timelineGranularity} is "day"
// @visibility internal
//<

// @attr calendar.timelineSnapGap (Number : null : IR)
// The snapGap of the timelineView
// @visibility internal
//<

// @attr calendar.showTimelineEventBody (boolean : null : IR)
// If false, the event header will take up the entire space of the event. This is usefull
// when you want to be able to drag reposition by the entire event and not just the header.
// @visibility internal
//<

// @attr calendar.allowEventOverlap (boolean : true : IR)
// If false, events are not allowed to overlap when they are drag repositioned.
// They will automatically be placed either before or after the event 
//
// @visibility internal
//<
allowEventOverlap: true,

// @attr calendar.equalDatesOverlap (boolean : null : IR) 
// If true, when events or date ranges share a border on exactly the same date,
// they will be treated as overlapping. By default, they will not be treated
// as overlapping.
//
// @visibility internal
//<

// @attr calendar.sizeEventsToGrid (boolean : true : IR)
// If true, events will be sized to the grid, even if they start and/or end at times
// between grid cells.
// @visiblity internal
//<
sizeEventsToGrid: true,

// i18n
// ---------------------------------------------------------------------------------------

//> @attr calendar.dayViewTitle (string : "Day" : IR)
// The title for the day view
// 
// @group i18nMessages
// @visibility calendar
//<
dayViewTitle: "Day",

//> @attr calendar.weekViewTitle (string : "Week" : IR)
// The title for the week view
// 
// @group i18nMessages
// @visibility calendar
//<
weekViewTitle: "Week",

//> @attr calendar.monthViewTitle (string : "Month" : IR)
// The title for the month view
// 
// @group i18nMessages
// @visibility calendar
//<
monthViewTitle: "Month", 

//> @attr calendar.timelineViewTitle (string : "Timeline" : IR)
// The title for the timeline view
// 
// @group i18nMessages
// @visibility calendar
//<
timelineViewTitle: "Timeline",

//> @attr calendar.eventNameFieldTitle (string : "Event Name" : IR)
// The title for the event name field in the quick event dialog
// 
// @group i18nMessages
// @visibility calendar
//<
eventNameFieldTitle: "Event Name",

//> @attr calendar.saveButtonTitle (string : "Save Event" : IR)
// The title for the save button in the quick event dialog and the event editor
// 
// @group i18nMessages
// @visibility calendar
//<
saveButtonTitle: "Save Event",

//> @attr calendar.detailsButtonTitle (string : "Edit Details" : IR)
// The title for the edit button in the quick event dialog
// 
// @group i18nMessages
// @visibility calendar
//<
detailsButtonTitle: "Edit Details",

//> @attr calendar.cancelButtonTitle (string : "Cancel" : IR)
// The title for the cancel button in the event editor
// 
// @group i18nMessages
// @visibility calendar
//<
cancelButtonTitle: "Cancel", 

//> @attr calendar.previousButtonHoverText (string : "Previous" : IR)
// The text to be displayed when a user hovers over the +link{calendar.previousButton, previous}
// toolbar button
// 
// @group i18nMessages
// @visibility calendar
//<
previousButtonHoverText: "Previous",

//> @attr calendar.nextButtonHoverText (string : "Next" : IR)
// The text to be displayed when a user hovers over the +link{calendar.nextButton, next} 
// toolbar button
// 
// @group i18nMessages
// @visibility calendar
//<
nextButtonHoverText: "Next",

//> @attr calendar.addEventButtonHoverText (string : "Add an event" : IR)
// The text to be displayed when a user hovers over the +link{calendar.addEventButton, add event}
// toolbar button
// 
// @group i18nMessages
// @visibility calendar
//<
addEventButtonHoverText: "Add an event",

//> @attr calendar.datePickerHoverText (string : "Choose a date" : IR)
// The text to be displayed when a user hovers over the +link{calendar.datePickerButton, date picker}
// toolbar button
// 
// @group i18nMessages
// @visibility calendar
//<
datePickerHoverText: "Choose a date",

//> @attr calendar.invalidDateMessage (boolean : "From must be before To" : IR)
// The message to display in the +link{eventEditor} when the 'To' date is greater than
// the 'From' date and a save is attempted.
//
// @group i18nMessages
// @visibility calendar
//<
invalidDateMessage: "From must be before To",

// autochild constructors and defaults
// ----------------------------------------------------------------------------------------
dayViewConstructor: "DaySchedule",

weekViewConstructor: "WeekSchedule",

monthViewConstructor: "MonthSchedule",

timelineViewConstructor: "TimelineView", 

mainViewDefaults : {
    _constructor:isc.TabSet,
    defaultWidth: "80%",
    defaultHeight: "100%",
    tabBarAlign: "right",
    selectedTab: 1    
},

dateChooserConstructor: "DateChooser",

eventDialogDefaults : {
    _constructor:isc.Window,
    showHeaderIcon: false,
    showMinimizeButton: false,
    showMaximumButton: false,
    canDragReposition: true,
    // so that extra fields are visible without the end user having to tweek bodyProperties
    overflow: "visible",
    bodyProperties: {overflow: "visible"},
    width: 400,
    height: 100
    
},

eventEditorDefaults : {
    _constructor:isc.DynamicForm,
    padding:4,
    numCols: 4,
    showInlineErrors: false,
    width: 200  
},

eventEditorLayoutDefaults : {
    _constructor:isc.Window,
    showHeaderIcon: false,
    showShadow: false,
    showMinimizeButton: false,
    showMaximumButton: false,
    canDragReposition: false    
},

addEventButtonDefaults : {
    _constructor: isc.ImgButton,
    title: "",
    src:"[SKINIMG]actions/add.png",    
    showRollOver: false, 
    showDown: false,
    showFocused:false,
    width: 16, 
    height: 16
},

datePickerButtonDefaults : {
    _constructor: isc.ImgButton,
    title: "",
    src:"[SKIN]/controls/date_control.gif",
    width: 16, 
    height: 16,
    showRollOver: false,
    showFocused: false
},

controlsBarDefaults : {
    _constructor:isc.HLayout,
    defaultLayoutAlign:"center",
    height: 25,
    membersMargin: 5
},

previousButtonDefaults : {
    _constructor:isc.ImgButton,
    title: "", 
    src:"[SKINIMG]actions/back.png",
    showFocused:false,
    width: 16, 
    height: 16,
    click: "this.creator.previous()",
    showRollOver: false, 
    showDown: false
},

nextButtonDefaults : {
    _constructor:isc.ImgButton,
    title: "", 
    src:"[SKINIMG]actions/forward.png", 
    showFocused:false,
    width: 16, 
    height: 16,
    click: "this.creator.next()",
    showRollOver: false, 
    showDown: false        
}, 

dateDisplayDefaults : {
    _constructor:isc.Label,
    wrap: false,
    //autoFit: true,
    width: 5,
    contents: "-"    
},

// initial setup of the calendar
initWidget : function () {
    if (this.chosenDate) {
        this.year = this.chosenDate.getFullYear();
        this.month = this.chosenDate.getMonth();
    }
    if (!this.data) this.data = this.getDefaultData();
    // set hover text strings for toolbar buttons
    // can't set dynamically in defaults block, so have to do it here.
    this.previousButtonDefaults.prompt = this.previousButtonHoverText;
    this.nextButtonDefaults.prompt = this.nextButtonHoverText;
    this.datePickerButtonDefaults.prompt = this.datePickerHoverText;
    this.addEventButtonDefaults.prompt  = this.addEventButtonHoverText;
    
    this._setChosenWeek();
    this.createChildren();
    this._setWeekTitles();
 
    //if (this.dataSource) this.autoDetectFieldNames();
 
    if (!this.initialCriteria && this.autoFetchData) this.initialCriteria = this.getNewCriteria();
   // initialize the data object, setting it to an empty array if it hasn't been defined
	this.setData(null);
    
    this.invokeSuper(isc.Calendar, "initWidget");
},

autoDetectFieldNames : function () {
    this.dataSource = isc.DS.getDataSource(this.dataSource);

    // pick some likely looking fields if no sensible ones are provided - wants 
    // for some future cleverness, perhaps, pretty basic selection here
    
    var ds = this.dataSource,
        fields = isc.getValues(ds.getFields()),
        maxSize = 1024000,
        bestField;

    if (this.fieldIsMissing(this.nameField, ds)) {
        // assume the titleField from the DS if the 
        this.nameField = ds.getTitleField();
    }
    if (this.fieldIsMissing(this.descriptionField, ds)) {
        // loop and find a string field > 255 chars and < 100k (otherwise 
        // choose the largest under 100k)
        fields.sortByProperties(["length"], [false]);

        bestField = {length:0};
        for (var i=0; i<fields.length; i++) {
            var field = fields.get(i);
            if (!field.type || field.type == "text" || field.type == "string") {
                if (field.length > 255 && field.length < maxSize) {
                    this.descriptionField = field.name;
                    break;
                } else if (field.length && field.length < maxSize && 
                    field.length > bestField.length) {
                    bestField = field;
                } else if (!field.length) {
                    if (!bestField) bestField = field;
                } 
            }
        }
        if (this.fieldIsMissing(this.descriptionField, ds) && bestField)
            this.descriptionField = bestField.name;
    }
    if (this.fieldIsMissing(this.startDateField, ds)) {
        // any date field, preferring one with "start" or "begin" in it's name        
        bestField=null;
        for (var i=0; i<fields.length; i++) {
            var field = fields.get(i);
            if ((field.type == "date" || field.type == "datetime")) {
                if (field.name.toLowerCase().indexOf("start") >= 0 ||
                    field.name.toLowerCase().indexOf("begin") >= 0) 
                {
                    this.startDateField = field.name;
                    break;
                } else bestField = field;
            }
        }
        if (this.fieldIsMissing(this.startDateField, ds) && bestField)
            this.startDateField = bestField.name;
    }
    if (this.fieldIsMissing(this.endDateField, ds)) {
        // any date field, preferring one with "end" or "stop" in it's name
        bestField=null;
        for (var i=0; i<fields.length; i++) {
            var field = fields.get(i);
            if ((field.type == "date" || field.type == "datetime")) {
                if (field.name.toLowerCase().indexOf("end") >= 0 ||
                    field.name.toLowerCase().indexOf("stop") >= 0) 
                {
                    this.endDateField = field.name;
                    break;
                } else if (field.name != this.startDateField) 
                    bestField = field;
            }
        }
        if (this.fieldIsMissing(this.endDateField, ds) && bestField)
            this.endDateField = bestField.name;
    }
},

fieldIsMissing : function (fieldName, ds) {
    // is a field unset or absent from the ds
    return (!fieldName || fieldName == "" || (ds && !ds.getField(fieldName)));
},

getDefaultData : function () { return []; },

//>	@method	calendar.setData()    ([])
// Initialize the data object with the given array. Observes methods of the data object
// so that when the data changes, the calendar will redraw automatically.
// 
// @param	newData		(List of CalendarEvent)	data to show in the list
//
// @group	data
// @visibility calendar
//<
setData : function (newData) {
    // if the current data and the newData are the same, bail
	//	(this also handles the case that both are null)
	if (this.data == newData) return;

    
	// if we are currently pointing to data, stop observing it
	if (this.data) {
        this.ignore(this.data, "dataChanged");
        // if the data was autoCreated, destroy it to clean up RS<->DS links
        if (this.data._autoCreated && isc.isA.Function(this.data.destroy))
            this.data.destroy();
    }

	// if newData was passed in, remember it
	if (newData) this.data = newData;

	// if data is not set, bail
	if (!this.data) return;

	// observe the data so we will update automatically when it changes
	this.observe(this.data, "dataChanged", "observer.dataChanged()");
    if (this.hasData()) {
        // invoke dataChanged so calendar refreshes when passed new data
        this.dataChanged();
    }
},

//>	@method	calendar.getData()
// Get the data that is being displayed and observed
//
// @return	(object)	The data that is being displayed and observed
//<
getData : function () {
	return this.data;
},

hasData : function () {
    if (!this.data || 
        (isc.ResultSet && isc.isA.ResultSet(this.data) && !this.data.lengthIsKnown())) 
    {
        return false;
    } else {
        return true;
    }
},


dataChanged : function () {
    // see addEvent, updateEvent, deleteEvent, and comment above about _ignoreDataChanged
    if (this._ignoreDataChanged) {
        this.logDebug('dataChanged, ignoring','calendar');
        this._ignoreDataChanged = false;    
    } else {
        this.logDebug('dataChanged, refreshing', 'calendar');
        this.refreshSelectedView();
    }
   
},

refreshSelectedView : function () {
   if (this.dayViewSelected()) {
        this.dayView.refreshEvents();
        if (this.monthView) this.monthView.refreshEvents();
    } else if (this.weekViewSelected()) {
        this.weekView.refreshEvents(); 
        if (this.monthView) this.monthView.refreshEvents();
    } else if (this.monthViewSelected()) {
        this.monthView.refreshEvents();
    } else if (this.timelineViewSelected()) {
        this.timelineView.refreshEvents();    
    }
    
},

getSelectedView : function () {
    if (this.dayViewSelected()) {
       return this.dayView;
    } else if (this.weekViewSelected()) {
       return this.weekView;
    } else if (this.monthViewSelected()) {
       return this.monthView;
    } else if (this.timelineViewSelected()) {
       return this.timelineView;    
    }   
},

//>	@type	ViewName
// The names of the Calendar views.
//	@value	"day"   day view
DAY: "day",
//	@value	"week" week view
WEEK: "week",	
//	@value	"month"  month view
MONTH: "month",	
// @visibility external
//<

//> @attr calendar.currentViewName (ViewName : null: IRW)
// The name of the view that should be visible initially by default.
// @visibility external
//<

//>	@method	calendar.getCurrentViewName()
// Get the name of the visible view. Either 'day', 'week', or 'month'.
//
// @return	(ViewName)	The name of the visible view.
// @visibility external
//<
getCurrentViewName : function () {
    return this.getSelectedView().viewName;    
},

//>	@method	calendar.setCurrentViewName()
// Sets the currently visible view
//
// @param viewName (ViewName) The name of the view that should be made visible.
// @return	(ViewName)	The name of the visible view.
// @visibility external
//<
setCurrentViewName : function (viewName) {
    var tabToSelect = this.mainView.tabs.find("viewName", viewName);
    if (tabToSelect) this.mainView.selectTab(tabToSelect);    
    return viewName;
},

// get/setEventWindowID ensure that eventWindow-to-record mapping remains stable when databound. 
// The expando approach doens't work when databound because the expando gets wiped out
// on update.
getEventWindowID : function (record) {
    if (!record) return null;
    var ds = this.getDataSource();
    if (ds && ds.getPrimaryKeyFieldNames().length > 0) {
        var pks = ds.getPrimaryKeyFields();
        var pk = "";
        for (var pkName in pks) {
            pk += record[pkName];        
        }
        return this._eventWinMap[pk];
    } else {
        return record._eventWindowID;    
    }
},

setEventWindowID : function (record, eventWindowID) {
    if (!this._eventWinMap) this._eventWinMap = [];
    var ds = this.getDataSource();
    if (ds && ds.getPrimaryKeyFieldNames().length > 0) {
        var pks = ds.getPrimaryKeyFields();
        var pk = "";
        for (var pkName in pks) {
            pk += record[pkName];        
        }
        this._eventWinMap[pk] = eventWindowID;
    } else {
        record._eventWindowID = eventWindowID;    
    }
},

// TODO consider moving to date
// includes start date but not end date
getDayDiff : function (date1, date2, weekdaysOnly) {
     
   // if date2 is greater, reverse dates
    var start, end;
    if (Date.compareDates(date1, date2) > 0) {
        start = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
        end = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    } else {
        start = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
        end = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    }
    // convert dates to UTC to avoid incorrect calculations due to daylight savings or other
    // timezone differences between start and end. Using date.getTimezoneOffset() should have
    // worked as well, but didn't. 
    // This issue is described in detail: http://www.xmission.com/~goodhill/dates/deltaDates.html
    var endMill = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate(), 0, 0, 0);
    var startMill = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0);
    var milliDiff = endMill - startMill;
    //isc.logWarn("getDayDiff:" + [start, end]);
    if (weekdaysOnly) {
        // using Math.ceil() was causing off-by-one-day bugs, switching to floor()
        // seems to have fixed that
        var daysBetween = Math.floor(milliDiff / (1000 * 60 * 60 * 24));
        //isc.logWarn("starting days between:" + daysBetween);
        var wkEnds = Math.floor(daysBetween / 7); // # of full weekends within date range
        var weDays = Date.getWeekendDays();
        var remainder = daysBetween % 7, remainderWeekends = 0; // # of leftover days
        var dateCursor = end.duplicate();
        // iterate through the remainder days and note how many weekends there are.
        dateCursor.setDate(dateCursor.getDate() - remainder);
        //isc.logWarn('datecursor start:' + dateCursor.toShortDate());
        for (var i = 0; i < remainder; i++) {            
            if (weDays.contains(dateCursor.getDay())) {
                remainderWeekends++;
                //isc.logWarn("here:" + [remainderWeekends, i, remainder, dateCursor.toShortDate()]);
            }
            dateCursor.setDate(dateCursor.getDate() + 1);
        }
        
        daysBetween -= ((wkEnds * 2) + remainderWeekends);
        return daysBetween;
    } else {
        var daysBetween = Math.floor(milliDiff / (1000 * 60 * 60 * 24));
        //isc.logWarn('getDayDiff:' + [start, end, milliDiff, daysBetween, minDiff, start.getTimezoneOffset(), end.getTimezoneOffset()]);
        return daysBetween;    
    }
    
},


// helper method for getting the left coord of an event
getEventLeft : function (event, isWeek) {
   
    var grid = (isWeek ? this.weekView : this.dayView);
    var accountForLabelCol = (grid.showLabelColumn && 
            grid.labelColumnPosition == "left");
    var eLeft = accountForLabelCol ? grid.labelColumnWidth : 0;
    var colSize = grid.getColumnWidth(grid.isLabelCol(0) ? 1 : 0);
    if (grid._isWeek) {
        
        var dayDiff = this.getDayDiff(event[this.startDateField], this.chosenWeekStart, 
            (this.showWeekends == false));
        //isc.logWarn('getEventLeft:' + [event.name, event.startDate.toShortDate(), 
        //                   this.chosenWeekStart.toShortDate(),dayDiff ]);
        eLeft = (dayDiff * colSize) + (accountForLabelCol ? grid.labelColumnWidth : 0);
    }
    if (this.logIsDebugEnabled("calendar")) {
        this.logDebug('calendar.getEventLeft() = ' + eLeft + ' for:' + isc.Log.echoFull(event), 'calendar');
    }
    return eLeft;
},

//> @method calendar.setShowWeekends()
//  Setter for +link{calendar.showWeekends} to change this property at runtime.
//
// @visibility calendar
//<
setShowWeekends : function (showWeekends) {
    this.showWeekends = showWeekends;
    if (isc.isA.TabSet(this.mainView)) {
        var tabNum = this.mainView.getSelectedTabNumber();
        this.mainView.removeTabs(this.mainView.tabs);
      
        if (this.dayView) this.dayView.destroy();
       
        if (this.weekView) this.weekView.destroy();
        
        if (this.monthView) this.monthView.destroy();
        
        var newTabs = this._getTabs();
        
        this.mainView.addTabs(newTabs);
        this.mainView.selectTab(tabNum);
        
    } else {
        var memLayout = this.children[0].members[1];
        
        var oldMem = memLayout.members[1];
        var newMem = this._getTabs()[0].pane;
        
        memLayout.removeMember(oldMem);
        oldMem.destroy();
        memLayout.addMember(newMem);
        //memLayout.redraw();
        //newMem.show();
    }
    this._setWeekTitles();
    this.setDateLabel();
},

//> @method calendar.canEditEvent()
// Method called whenever the calendar needs to determine whether a particular event should be
// editable.
// <P>
// By default, checks the +link{canEditField} on the provided +link{CalendarEvent}, and if null,
// returns +link{canEditEvents}.
//
// @param event (CalendarEvent) 
// @return (boolean) whether the user should be allowed to edit the provided CalendarEvent
//<
canEditEvent : function (event) {
    if (!event) return false;
    else if (event[this.canEditField] != null) return event[this.canEditField];
    else return this.canEditEvents;
},

//>	@method	calendar.addEvent()
// Create a new event in this calendar instance.
//
// @param	startDate		(Date or Object)	start date of event, or CalendarEvent Object 
// @param  endDate         (Date)  end date of event
// @param  name            (String) name of event
// @param description      (String) description of event
// @param otherFields      (Object) new values of additional fields to be updated
//
// @visibility calendar
//<
addEvent : function (startDate, endDate, name, description, otherFields, ignoreDataChanged) {
    if (!isc.isAn.Object(otherFields)) otherFields = {};
    var evt;
    if (isc.isA.Date(startDate)) {
        evt = {};
        evt[this.startDateField] = startDate;
        evt[this.endDateField] = endDate;
        evt[this.nameField] = name;
        evt[this.descriptionField] = description;
        isc.addProperties(evt, otherFields);
    } else if (isc.isAn.Object(startDate)) {
        evt = startDate;
    } else {
        isc.logWarn('addEvent error: startDate parameter must be either a Date or an event record (Object)');
        return;
    }

    // setup a callback closure for when theres a DS
    var self = this;
    var _finish = function (dsResponse, data, dsRequest) {
        var newEvt;
        // check for possible return of an array
        if (isc.isAn.Array(data)) newEvt = data[0];    
        else newEvt = data;
        if (!newEvt) newEvt = evt;

        if (self.logIsDebugEnabled("calendar")) {
            self.logDebug('event added:' + this.echo(newEvt), 'calendar');
        }
        // check all views to see if the event should be added
        if (self._shouldRefreshDay(newEvt[self.startDateField], newEvt[self.endDateField])) {
            self.dayView.addEvent(newEvt);
        }
        if (self._shouldRefreshWeek(newEvt[self.startDateField], newEvt[self.endDateField])) {
            self.weekView.addEvent(newEvt);
        }
        if (self._shouldRefreshMonth(newEvt[self.startDateField], newEvt[self.endDateField])) {
            self.monthView.refreshEvents();
        }
        // fire eventAdded if present
        if (self.eventAdded) self.eventAdded(newEvt);
    }
    
    // add event to data
    // see commment above dataChanged about _ignoreDataChanged
    if (ignoreDataChanged) this._ignoreDataChanged = true;
    if (this.dataSource) {
        isc.DataSource.get(this.dataSource).addData(evt, _finish, {componentId: this.ID});
        return;
    } else {
        // set the one-time flag to ignore data changed since we manually refresh in _finish()
        this._ignoreDataChanged = true;
        this.data.add(evt);
        _finish();
    }
    
},

//>	@method	calendar.removeEvent()
// Remove an event from this calendar.
//
// @param	event		(Object)	The event object to remove from the calendar
//
// @visibility calendar
//<
removeEvent : function (event, ignoreDataChanged) {
    var startDate = event[this.startDateField],
        endDate = event[this.endDateField];
    
     // set up a callback closure for when theres a DS
    var self = this;
    var _finish = function () {
        if (self._shouldRefreshDay(startDate, endDate)) {
            self.dayView.removeEvent(event);
        }
        if (self._shouldRefreshWeek(startDate, endDate)) {
            self.weekView.removeEvent(event);
        }
        if (self._shouldRefreshMonth(startDate, endDate)) {
            self.monthView.refreshEvents();
        }
        // when eventAutoArrange is true, refresh the day and week views to reflow the events
        // so that they fill any space made available by the removed event
        if (self.eventAutoArrange) {
            self.dayView.refreshEvents();
            self.weekView.refreshEvents();    
        }
        // fire eventRemoved if present
        if (self.eventRemoved) self.eventRemoved(event);
    }
    // remove the data
    // see commment above dataChanged about _ignoreDataChanged
    if (ignoreDataChanged) this._ignoreDataChanged = true;
    if (this.dataSource) {
        isc.DataSource.get(this.dataSource).removeData(event, _finish, {
            componentId: this.ID,
            oldValues : event
        }); 
        return;
    } else {
        this.data.remove(event);
        _finish();
    }
             
},

//>	@method	calendar.updateEvent()
// Update an event in this calendar.
//
// @param event		(CalendarEvent)	The event object to remove from the calendar
// @param startDate (Date)	start date of event
// @param endDate   (Date)  end date of event
// @param name        (String) name of event
// @param description (String) description of event
// @param otherFields (Object) new values of additional fields to be updated
//     
// @visibility calendar
//<
updateEvent : function (event, startDate, endDate, name, description, otherFields, ignoreDataChanged) {
    if (!isc.isAn.Object(otherFields)) otherFields = {};
     // set up a callback closure for when theres a DS
    var self = this;
    // must call _shouldRefreshDay twice, both with old and new dates. see _shouldRefreshDay.
    var oldStart = event[this.startDateField];
    var oldEnd = event[this.endDateField];
    var _finish = function (dsResponse, data, dsRequest) {
        var newEvt;
        // check for possible return of an array
        if (isc.isAn.Array(data)) newEvt = data[0];    
        else newEvt = data;
        if (!newEvt) newEvt = event;
        if (self._shouldRefreshDay(oldStart, oldEnd) || self._shouldRefreshDay(startDate, endDate)) {
            // call self.refreshEvents instead of self.updateEventWindow(newEvt), 
            // to handle all 3 cases described above _shouldRefreshDay
            self.dayView.refreshEvents();
        }
        if (self._shouldRefreshWeek(startDate, endDate)) {
            self.weekView.updateEventWindow(newEvt);
        }
        if (self._shouldRefreshMonth(startDate, endDate)) {
            //self.monthView.refreshDay(newEvt[self.startDateField]);
            self.monthView.refreshEvents();
        }
        if (self._shouldRefreshTimelineView(startDate, endDate)) {
            self.timelineView.updateEventWindow(newEvt);   
        }
       
        // fire eventChanged if present
        if (self.eventChanged) self.eventChanged(newEvt);
    }
    
    // see commment above dataChanged about _ignoreDataChanged
    if (ignoreDataChanged) this._ignoreDataChanged = true;
    if (this.dataSource) {
        var updateRecord, ds = isc.DataSource.get(this.dataSource);
        
        var changes = {};
        changes[this.startDateField] = startDate;
        changes[this.endDateField] = endDate;
        changes[this.descriptionField] = description;
        changes[this.nameField] = name;
        var updatedRecord = isc.addProperties({}, event, changes, otherFields);
        ds.updateData(updatedRecord, _finish, {oldValues: event, componentId: this.ID});
        return;
    } else {
        event[this.startDateField] = startDate;
        event[this.endDateField] = endDate;
        event[this.descriptionField] = description;
        event[this.nameField] = name;
        isc.addProperties(event, otherFields);
        _finish();
    }
   
},

eventsAreSame : function (first, second) {
    if (this.dataSource) {
        var ds = isc.DataSource.get(this.dataSource), 
            pks = ds.getPrimaryKeyFieldNames(), 
            areEqual = true;
        for (var i=0; i < pks.length; i++) {
            var pkName = pks[i];
            if (first[pkName]!= second[pkName]) {
                areEqual = false;
                break;
            }
        }
        return areEqual;
    } else {
        return (first === second);    
    }
},
    
getEventTitle : function (event) {
    return event[this.nameField];    
},

//>	@method	calendar.getEventHoverHTML()
// gets the hover html for an event being hovered over. Override here to return custom 
// html based upon the parameter event object.
//
// @param	event		(Object)	The event being hovered
// @param   eventWindow  (EventWindow) the event window being hovered
//     
// @visibility calendar
//<
getEventHoverHTML : function (event, eventWindow) {
    var cal = this;
    // start time
    var sHrs = event[cal.startDateField].getHours();
    var sMins = event[cal.startDateField].getMinutes();
    var sTime = cal._to12HrNotation(sHrs) + (sMins < 10 ? ":0" + sMins : ":" + sMins)
        + (sHrs > 11 ? "PM" : "AM");  
    
    // end time
    var eHrs = event[cal.endDateField].getHours();
    var eMins = event[cal.endDateField].getMinutes();
    var eTime = cal._to12HrNotation(eHrs) + (eMins < 10 ? ":0" + eMins : ":" + eMins)
        + (eHrs > 11 ? "PM" : "AM");
        
    return event[cal.startDateField].toShortDate() + " "
        + sTime + " - " + eTime
        + "</br></br>"
        + event[cal.nameField] + "</br></br>" 
        + event[cal.descriptionField];       
},

// trickiest case. 3 separate cases to handle:
// 1. event changed within chosen day
// 2. event moved into chosen day
// 3. event moved out of chosen day
// to handle all of these:
// - for adding, just pass start and end date
// - for deleting, just pass start and end date
// - for updating, must call this twice, both with old dates and new dates. see updateEvent.
_shouldRefreshDay : function (startDate, endDate) {
    if (!this.dayView) return false;
    var dayStart = new Date(this.year, this.month, this.chosenDate.getDate(),0, 0);
    var dayEnd = new Date(this.year, this.month, this.chosenDate.getDate(),23, 59);
    // subtle change: use only startDate instead of startDate and endDate to determine if
    // parameter range is in range so that events with end date on the next day are included. 
    if (this.dayView.body && dayStart.getTime() <= startDate.getTime() 
        && dayEnd.getTime() >= startDate.getTime()) {
        return true;
    } else return false;
    
},

_shouldRefreshWeek : function (startDate, endDate) {
    if (!this.weekView) return false;
    // advance end of week date by 1 minute so it falls on the first minute of the next day...
    // this allows events to end on 12:00am of the day following the the last day of the week
    // and fixes a bug where events created at that time weren't showing up
    var weekEnd = this.chosenWeekEnd.duplicate();
    weekEnd.setMinutes(weekEnd.getMinutes() + 1);
    //isc.logWarn('_shouldRefreshWeek:' + [weekEnd, endDate]);
    if (this.weekView.body && this.chosenWeekStart.getTime() <= startDate.getTime()
        && weekEnd.getTime() >= endDate.getTime()) {
        return true;
    } else return false;
},

_shouldRefreshMonth : function (startDate, endDate) {
    if (!this.monthView) return false;
    // provide a nice broad range to detect a month refresh should be done
    var mStart = new Date(this.year, this.month, -7);
    var mEnd = new Date(this.year, this.month, 37);
    if (mStart.getTime() <= startDate.getTime() && mEnd.getTime() >= endDate.getTime()) {
        return true;
    } else return false;
},

_shouldRefreshTimelineView : function (startDate, endDate) {
    // for now just return true if we're showing timeline view
    if (this.showTimelineView) return true;
    else return false;    
},

//> @attr calendar.eventWindow (AutoChild EventWindow : null : A)
// To display events in day and week views, the Calendar creates instance of +link{EventWindow}
// for each event.  Use the +link{AutoChild} system to customize these windows.
// @visibility external
//<

_getNewEventWindow : function (event) {
    var canEdit = this.canEditEvent(event);
    var canDelete = this.canDeleteEvents == null ? canEdit : this.canDeleteEvents;
    var styleName = event[this.eventWindowStyleField] || this.eventWindowStyle;
    // create eventWindow as an autoChild so it can be customized.
    return this.createAutoChild("eventWindow", {
        calendar: this,
        className: styleName,
        baseStyle: styleName,
        canDragReposition: canEdit,
        canDragResize: canEdit,
        _redrawWithParent:false,
        showCloseButton: canDelete,
        event: event,
        descriptionText: event[this.descriptionField]    
    }, isc.EventWindow);
    
},
 
_getEventsInRange : function (start, end) {
        
        var results = [];
        var wends = Date.getWeekendDays();
       
        for (var i = 0; i < this.data.getLength(); i++) { 
            
            var curr = this.data.get(i);
            
            if (!curr || !curr[this.startDateField]) return [];
            // add the event if we're showing weekends or the date is not a weekend
            // The event won't get added only when !this.showWeekends and it is a weekend
            // subtle change: use only startDate instead of startDate and endDate to determine if
            // parameter range is in range so that events with end date on the next day are included.
            if (curr[this.startDateField].getTime() >= start.getTime() 
                && curr[this.startDateField].getTime() <= end.getTime()
                && (this.showWeekends || !wends.contains(curr[this.startDateField].getDay()))) {
                results.add(curr);
            }
        }
        
        return results;
},

_getEventsTouchingRange : function (start, end, recalcRange) {
// Return all events with any overlap on the supplied range - _getEventsInRange
// only returns fully encapsulated events
// If recalcRange = true, make multiple passes of the events to include ones that do not 
// overlap the specified range but that overlap other events that do!  Those events will also 
// need redrawing when their overlapped events redraw.

    var results = [],
        wends = Date.getWeekendDays(),
        startTime = start.getTime(), 
        maxEndDate = this.getDayEnd(start),
        endTime = end.getHours() != 0 ? end.getTime() : maxEndDate.getTime(),
        tempStart = startTime, 
        tempEnd = endTime,
        finished = false;

    var endDate = (end.getHours() == 0 || Date.compareDates(start, end) < 0) ? maxEndDate : end;

    while (!finished) {
        for (var i = 0; i < this.data.getLength(); i++) { 

            var curr = this.data.get(i);

            var currStartDate = curr[this.startDateField],
                currEndDate = curr[this.endDateField];

            if (currEndDate.getHours() == 0 || currEndDate < currStartDate) {
                currEndDate = maxEndDate;
            }
            
            if (!currStartDate) return [];

            // add the event if we're showing weekends or the date is not a weekend
            if ((currStartDate.getTime() >= startTime
                && currStartDate.getTime() < endTime 
                && currStartDate.getDay() == start.getDay()) 
                || 
                (currEndDate.getTime() > startTime
                && currEndDate.getTime() <= endTime
                && currEndDate.getDay() == end.getDay())
                ||
                (currStartDate.getTime() < startTime
                && currEndDate.getTime() > endTime
                && (currStartDate.getDay() == start.getDay()
                    || currEndDate.getDay() == end.getDay()))
                && 
                (this.showWeekends || !wends.contains(currStartDate.getDay()))) 
            {
                results.add(curr);
                if (recalcRange) {
                    // store min and max times for a second pass
                    if (currStartDate.getTime() < tempStart) {
                        tempStart = currStartDate.getTime();
                    }
                    if (currEndDate.getTime() > tempEnd) {
                        tempEnd = currEndDate.getTime();
                    }
                }
            }
        }
        if (!recalcRange || (tempStart == startTime && tempEnd == endTime)) { 
            finished = true;
        } else {
            startTime = tempStart;
            endTime = tempEnd;
            results.clear();
        }
    }
    
    return results;
},

_findEventWindow : function (event, isWeek) {
    // return the eventWindow object containing the passed event
    var grid = (isWeek ? this.weekView : this.dayView);

    if (!grid.body || !grid.body.children) return;
    var arr = grid.body.children;
    if (this.dataSource) this._pks = isc.DataSource.get(this.dataSource).getLocalPrimaryKeyFields();
    for (var i = 0; i < arr.length ; i++) {
        if (isc.isAn.EventWindow(arr[i]) 
            && grid.areSame(arr[i].event, event)
            && arr[i]._isWeek == isWeek) {
            // return the event-window
            return arr[i];
        }
    }
    return false;
},

_prepareAutoArrangeOffsets : function (events, grid) {
// work out the size and position of events

    var details = [],
        columnCount=0,
        yOffset = 60 / this.eventSnapGap,
        timeslotCount = 24 * yOffset;

    for (var i = 0; i < timeslotCount; i++) {
        // assignedCol    next start offset for an event in this timeslot
        // usedCol        timeslot is used in another event, but the event does not START here
        //                this is the end offset of the next event starting in this slot
        // exactTime      allow configurable overlap for exact start-times
        details.add({ usedCol: 0, assignedCol: 0, exactTime: 0 });
    }

    for (var i = 0; i < events.getLength(); i++) {
        var curr = events.get(i);

        // normalize the time-slice to fixed intervals according to this.eventSnapGap
        var startHours = curr[this.startDateField].getHours(),
            startMinutes = curr[this.startDateField].getMinutes(),
            startOffset = startMinutes % this.eventSnapGap;
        if (startOffset) {
            // remove rounding logic, as this causes errors in certain boundary cases:
            // http://forums.smartclient.com/showthread.php?t=13750
            startMinutes = startMinutes - startOffset;           
        }
	    if (startHours == 24) startHours = 0;

        var endHours = curr[this.endDateField].getHours(),
            endMinutes = curr[this.endDateField].getMinutes(),
            endOffset = endMinutes % this.eventSnapGap;
        if (endOffset) {
            // remove rounding logic, as this causes errors in certain boundary cases:
            // http://forums.smartclient.com/showthread.php?t=13750
            endMinutes = endMinutes + (this.eventSnapGap - endOffset);
            if (endMinutes == 60) {
                endMinutes = 0;
                endHours++;
            }
            
        }

        curr._eventOffset = 0;
        curr._eventEndOffset = 0;

        var startIndex = (startHours * yOffset) + (startMinutes / this.eventSnapGap),
            endIndex = (endHours * yOffset) + (endMinutes / this.eventSnapGap);

        for (var currIndex = startIndex; currIndex < endIndex; currIndex++) {
            var used = details[currIndex].usedCol;
            var assigned = details[currIndex].assignedCol;
            var exactTime = details[currIndex].exactTime;

            if (currIndex == startIndex) {
                // if the start-time is not already used, assign all time-slots (left align 
                // the event)
                var startTimeInUse = assigned != 0;
                // set the event's left-offset 
                curr._eventOffset = assigned;

                if (this.eventOverlap) {
                    if (!this.eventOverlapIdenticalStartTimes) {
                        curr._drawOverlap = exactTime == 0;
                    } else {
                        curr._drawOverlap = true;
                    }
                    exactTime = 1;
                }

                assigned++;

                if (assigned > columnCount) {
                    // summarise the max columns required
                    columnCount = assigned;
                }

                // set the event's right-offset - if this is zero, it will be updated to 
                // column-count later
                if (!startTimeInUse && used != 0 ) {
                	curr._eventEndOffset = used;
                    assigned = used + 1;
                } else {
                    if (assigned <= used) {
                        curr._eventEndOffset = used;
                        assigned = used + 1;
                    } else {
                        curr._eventEndOffset = columnCount;
                    }
                }
            } else {
            
                if (startTimeInUse) {
                    if (assigned == 0) {
                        // current time-slot not in use - mark its "used" offset
                        if (used == 0) {
                            used = curr._eventOffset;
                        }
                    } else {
                        // shift the time-slot's left-offset to
                        if (used == 0){
                            if (curr._eventOffset > assigned) {
                                used = curr._eventOffset;
                            } else {
                                // the column after this one
                                assigned = curr._eventOffset + 1;
                            }
                        } else if (assigned < used) {
                            // the column after the overlapping event's column
                            assigned = used + 1;
                        }
                    }
                } else {
                    if (assigned + 1 < used) {
                        assigned++;
                    } else {
                        assigned = used + 1;
                    }
                }
            }
            details[currIndex].usedCol = used;
            details[currIndex].assignedCol = assigned;
            details[currIndex].exactTime = exactTime;
        }
        
    }
   
    for (var i = 0; i < events.getLength(); i++) {
        var curr = events.get(i);
        if (!curr._eventEndOffset || curr._eventEndOffset == 0) { 
            curr._eventEndOffset == columnCount;
        }
    }

    return columnCount;
},

getDayEnd : function (startDate) {
    return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(),23,59,59);
},

_renderEventRange : function (isWeek, start, end) {

    var grid = (isWeek ? this.weekView : this.dayView);
    if (!grid.isDrawn()) return;

    var rowSize = grid.getRowHeight(1),
        colSize = grid.getColumnWidth(grid.isLabelCol(0) ? 1 : 0);

    var startDate = start, endDate = end;

    if (Date.compareDates(startDate, endDate) < 0 || (endDate.getHours() == 0)) {
        endDate = this.getDayEnd(startDate);
    }

    // get the events that overlap
    var localEvents = this._getEventsTouchingRange(startDate, endDate, true);

    // sort the array by start-time and end-time
    localEvents.sortByProperties([this.startDateField, this.endDateField], 
        [true, false]);

    // work out the drawing offsets for the events
    var columnCount = this._prepareAutoArrangeOffsets(localEvents, grid);
    // potentially invalid column count when adding a new event of short duration
    if (columnCount == 0) columnCount = 1;
    // re-sort the events by left-offset to keep the zorder in check
    localEvents.unsort();
    localEvents.sortByProperties(["_eventOffset"], [true]);

    // get the width of each display-column
    var periodWidth = colSize / columnCount;
    
    // loop over the overlapped windows and shift them all accordingly
    for (var i = 0; i < localEvents.getLength(); i++) {
        var curr = localEvents.get(i);
        // potentially invalid eventEndOffset when adding a new event of short duration
        if (curr._eventEndOffset == 0) curr._eventEndOffset = 1;
        
        var eLeft = this.getEventLeft(curr, isWeek);
        
        // and shift the x-offset
        eLeft += (curr._eventOffset * periodWidth);
        
        var eWidth = (curr._eventEndOffset - curr._eventOffset) * periodWidth;
        
        if (this.eventOverlap && curr._drawOverlap) {
            if (curr._eventOffset > 0) {
                eLeft -= periodWidth * (this.eventOverlapPercent / 100);
                eWidth += periodWidth * (this.eventOverlapPercent / 100);
            }
        }
        
        // catch the case where the end of the event is on 12am, which happens when an
        // event is dragged or resized to the bottom of the screen
        var eHrs = curr[this.endDateField].getHours();
        if (eHrs == 0 && curr[this.endDateField].getMinutes() == 0) eHrs = 24;

        // if the event ends on the next day, render it as ending on the last hour of the 
        // current day
        var spansDays = false;

        if (start.getDate() > end.getDate()) {
            spansDays = true;
            eHrs = 24;
        }

        var eHeight = (eHrs - curr[this.startDateField].getHours()) * (rowSize * 2)

        // for border overlap
        if (this.weekEventBorderOverlap && grid._isWeek) eWidth += 1;
        
        if (curr[this.startDateField].getMinutes() > 0) {
            eHeight -= this._getMinutePixels(curr[this.startDateField].getMinutes(), rowSize);
        }
        if (curr[this.endDateField].getMinutes() > 0 && !spansDays) {
            eHeight += this._getMinutePixels(curr[this.endDateField].getMinutes(), rowSize);
        }
        
        var eTop = curr[this.startDateField].getHours() * (rowSize * 2);
        if (curr[this.startDateField].getMinutes() > 0) {
            eTop += this._getMinutePixels(curr[this.startDateField].getMinutes(), rowSize);
        }
                
        var win = this._findEventWindow(curr, isWeek);
        
        if (win) {
            //isc.logWarn('event:' + [eTop, eLeft, eWidth, eHeight]);
            win.renderEvent(eTop, eLeft, eWidth, eHeight);
        }
    }
},

_setChosenWeek : function () {
    
    var startDate = 
        this.chosenWeekStart = new Date(this.year, this.month, this.chosenDate.getDate()
        - this.chosenDate.getDay() + this.firstDayOfWeek);
     
    // make sure the current week surrounds the current date.
    // if chosen date is less than startDate, shift week window back one week.
    if (Date.compareDates(this.chosenDate,startDate) == 1) { 
        this.chosenWeekStart.setDate(this.chosenWeekStart.getDate() - 7);    
    }
    this.chosenWeekEnd = new Date(startDate.getFullYear(), startDate.getMonth(), 
       startDate.getDate() + 6, 23, 59);
   
    // similary, if chosen date is greater than chosenWeekEnd, shift week window up one week.
    if (Date.compareDates(this.chosenDate, this.chosenWeekEnd) == -1) {
        this.chosenWeekStart.setDate(this.chosenWeekStart.getDate() + 7);
        this.chosenWeekEnd.setDate(this.chosenWeekEnd.getDate() + 7);
    }
},

//>	@method	calendar.setChosenDate()
// Set the current date for which the calendar will display events.
//
// @param	newDate		(Date)	the new date to set as the current date
//
// @visibility calendar
//<
setChosenDate : function (newDate) {
    this.year = newDate.getFullYear();
    this.month = newDate.getMonth();
    this._oldDate = this.chosenDate;
    this.chosenDate = newDate;
    this._setChosenWeek();
    
    // redraw monthview if need be
    if (this._oldDate.getFullYear() != this.year || this._oldDate.getMonth() != this.month) { 
        if (this.monthView) this.monthView.refreshEvents();
    } 
    
    // check if the week needs redrawn
    var startDate = new Date(this._oldDate.getFullYear(), this._oldDate.getMonth(), 
        this._oldDate.getDate() - this._oldDate.getDay());
    var endDate = new Date(startDate.getFullYear(), startDate.getMonth(), 
            startDate.getDate() + 6);
    var chosenTime = this.chosenDate.getTime();
    if (chosenTime < startDate.getTime() || chosenTime > endDate.getTime()) {
        if (this.weekView) {
            this.weekView.refreshEvents();
            this._setWeekTitles();
        }
    }
    // check for day redraw
    if (chosenTime != this._oldDate.getTime()) {
        if (this.dayView) {
            this.dayView.refreshStyle();
            this.dayView.refreshEvents();
        }
    }    
    
    // reset date label
    this.setDateLabel();
    // call dateChanged
    this.dateChanged();
    
},

//> @method calendar.dateIsWorkday()
// Should the parameter date be considered a workday? By default this method tries to find the
// parameter date day in +link{workdays}, and returns true if found. Override this method to 
// provide custom logic for determining workday, for example returning false on holidays.
//
// @param   date    (Date) date to check for being a workday
// @return  (Boolean) true if date is a workday, false otherwise
// @visibility Calendar
//<
dateIsWorkday : function (date) {
    return this.workdays.contains(date.getDay());
},

//>	@method	calendar.adjustCriteria()
// Gets the criteria to use when the calendar date ranges shift and the +link{calendar.fetchMode}
// is not "all". This would be called, for example, when the next button is clicked and new 
// events possibly need to be fetched. Override this function to add any custom criteria to the
// default criteria constructed by the calendar.
//
// @param	defaultCriteria		(Criterion)	default criteria generated by the calendar
// @return (Criterion) modified criteria
//
// @visibility internal
//<
adjustCriteria : function (defaultCriteria) {
        
        return defaultCriteria;
},

getNewCriteria : function () {
    var criteria = {}, view;
    if (this.fetchMode == "timeline") {
        view = this.timelineView;
        var criter = {
            _constructor:"AdvancedCriteria",
            operator:"and",
            criteria: [
                { fieldName: this.startDateField, operator: "greaterThan", value: view.startDate},
                { fieldName: this.endDateField, operator: "lessThan", value: view.endDate}
            ]
        };
        // allow users to manipulate the criteria by overriding getNewCriteria()
        criteria = this.adjustCriteria(criter);
    }
    return criteria;
},

_setWeekTitles : function () {
    if (!this.weekView) return;
    var nDate = this.chosenWeekStart.duplicate();      
    // set day titles
    var sdNames = Date.getShortDayNames();
    var weekends = Date.getWeekendDays();
    
    for (var i = 1; i < 8; i++) {
        // for hidden columns, getFieldNum will return -1. without this check, a logWarn is
        // produced when weekends are hidden
        if (this.weekView.getFieldNum("day" + i) >= 0) {
            var ntitle = sdNames[nDate.getDay()] + " " + (nDate.getMonth() + 1) + "/" + nDate.getDate();
            // _dayNum is used in colDisabled()
            // _dateNum, monthNum, yearNum are used in headerClick
            var fieldProps = {
                title: ntitle, align: "right", 
                _dayNum: nDate.getDay(),
                _dateNum: nDate.getDate(),
                _monthNum: nDate.getMonth(),
                _yearNum: nDate.getFullYear()
            }
            this.weekView.setFieldProperties("day" + i, fieldProps);
            if (this.weekView.header) this.weekView.header.markForRedraw();
            //isc.logWarn('here:' + [nDate.toShortDate(), "day" + i]);
        }
        
        nDate.setDate(nDate.getDate() + 1);
    }
},

//>	@method	calendar.next()
// Move to the next day, week, or month, depending on which tab is selected.
//
// @visibility calendar
//<
next : function () {
   // var tab = this.mainView.selectedTab;
    var newDate;
    if (this.dayViewSelected()) {
        newDate = new Date(this.year, this.month, this.chosenDate.getDate() + 1);
        // if hiding weekends, find next non-weekend day
        if (!this.showWeekends) {
            var wends = Date.getWeekendDays();
            for (var i = 0; i < wends.length; i++) {
                if (wends.contains(newDate.getDay())) newDate.setDate(newDate.getDate() + 1);
            }
        }
    } else if (this.weekViewSelected()) {
        newDate = new Date(this.year, this.month, this.chosenDate.getDate() + 7);   
    } else if (this.monthViewSelected()) {
        newDate = new Date(this.year, this.month + 1, 1);
    } else if (this.timelineViewSelected()) {
        newDate = this.chosenDate.duplicate();
        this.timelineView.nextOrPrev(true);
    }
    this.dateChooser.setData(newDate);
    this.setChosenDate(newDate);
   
},

//>	@method	calendar.previous()
// Move to the previous day, week, or month, depending on which tab is selected.
//
// @visibility calendar
//<
previous : function () {
    //var tab = this.mainView.selectedTab;
    if (this.dayViewSelected()) {
        var newDate = new Date(this.year, this.month, this.chosenDate.getDate() - 1);
        // if hiding weekends, find next non-weekend day
        if (!this.showWeekends) {
            var wends = Date.getWeekendDays();
            for (var i = 0; i < wends.length; i++) {
                if (wends.contains(newDate.getDay())) newDate.setDate(newDate.getDate() - 1);
            }
        }
    } else if (this.weekViewSelected()) {
        var newDate = new Date(this.year, this.month, this.chosenDate.getDate() - 7);   
    } else if (this.monthViewSelected()) {
        var newDate = new Date(this.year, this.month - 1, 1);
    } else if (this.timelineViewSelected()) {
        newDate = this.chosenDate.duplicate();
        this.timelineView.nextOrPrev(false);      
    }
    this.dateChooser.setData(newDate);
    this.setChosenDate(newDate);
    
},

dataArrived : function () { 
    return true;   
},

// override draw to add the calendar navigation bar floating above the mainView tabbar
draw : function (a, b, c, d) {
    
    this.invokeSuper(isc.Calendar, "draw", a, b, c, d);
    
    if (isc.ResultSet && isc.isA.ResultSet(this.data) && this.dataSource) {
        this.observe(this.data, "dataArrived", "observer.dataArrived(arguments[0], arguments[1])");    
    }
    if (this.mainView.isA("TabSet")) {
        this.mainView.addChild(this.controlsBar);
        this.controlsBar.moveAbove(this.mainView.tabBar);
    }
    
   
},  

/*
getSnapGapPixels : function (snapGap, grid) {
    if (!snapGap) return snapGap;
    // get percentage of snapGap in relation to 30 minutes, the length in minutes of a row, and 
    // multiply by row height to get pixels
    return Math.floor((snapGap / 30) * grid.getRowHeight(null, 0));
},
*/
_getTabs : function () {
    var nTabs = [];
    // viewName used by calendar internals, so don't put into defaults
    if (this.showDayView != false) {
        this.dayView = this.createAutoChild("dayView", 
            { baseStyle: this.baseStyle, viewName: "day"} );
        nTabs.add({title: this.dayViewTitle, pane: this.dayView, viewName: "day" });
    }
    if (this.showWeekView != false) {
        this.weekView = this.createAutoChild("weekView", 
            {_isWeek: true, baseStyle: this.baseStyle, viewName: "week" } );
        nTabs.add({title: this.weekViewTitle, pane: this.weekView, viewName: "week" });
    }
    if (this.showMonthView != false) {
        this.monthView = this.createAutoChild("monthView", 
            {baseStyle: this.baseStyle, viewName: "month",
             bodyConstructor:"MonthScheduleBody"} );
        nTabs.add({title: this.monthViewTitle, pane: this.monthView, viewName: "month" });
    }
    if (this.showTimelineView != false) {
        this.timelineView = this.createAutoChild("timelineView",
            {baseStyle: this.baseStyle, viewName: "timeline" } );
        nTabs.add({title: this.timelineViewTitle, pane: this.timelineView, viewName: "timeline" });
    }
    return nTabs;
},

_createTabSet : function (tabsArray) {
    // if there is only one view displayed, don't use tabs
    if (tabsArray.length > 1) {
        this.mainView = this.createAutoChild("mainView", {           
            tabs: tabsArray,
            tabSelected : function (tabNum, tabPane, ID, tab) {
                // store selected view name for later use, in day/week/monthViewSelected functions
                this.creator._selectedViewName = tabPane.viewName;
                this.creator.setDateLabel();
            }
            
        } );
        // set the default tab according to currentViewName if defined
        if (this.currentViewName) {
            var tabToSelect = tabsArray.find("viewName", this.currentViewName);
            if (tabToSelect) this.mainView.selectTab(tabToSelect);
        }
    } else {
        this.mainView = tabsArray[0].pane;     
    }   
},
// create the content of the calendar
createChildren : function () {
    
    
    // main tabbed view
    var mvTabs = this._getTabs();
 
    this._createTabSet(mvTabs);
    var tbButtonDim = 20;
    if (this.showControlsBar != false) {
        // dateDisplay
        this.dateDisplay = this.createAutoChild("dateDisplay" );
        // addEventButton
        this.addEventButton = this.createAutoChild("addEventButton", {
            click: function () {
                var cal = this.creator;
                var currView = cal.getCurrentViewName();
                
                cal.eventDialog.event = null;
                cal.eventDialog.items[0].createFields(false);
      
                var sDate = new Date(), 
                    pickedDate = cal.chosenDate.duplicate();
                // if dayView is chosen, set dialog date to chosen date
                if (currView == "day") {
                    sDate = pickedDate;
                // if weekview, set dialog to first day of chosen week unless
                // today is greater
                } else if (currView == "week") {
                    if (cal.chosenWeekStart.getTime() > sDate.getTime()) {
                        sDate = cal.chosenWeekStart.duplicate();    
                    }
                    // if hiding weekends, find next non-weekend day
                    if (!this.showWeekends) {
                        var wends = Date.getWeekendDays();
                        for (var i = 0; i < wends.length; i++) {
                            if (wends.contains(sDate.getDay())) sDate.setDate(sDate.getDate() + 1);
                        }
                    }
                    sDate.setMinutes(0);
                    // move event to next day if now is end of day
                    if (sDate.getHours() > 22) {
                        sDate.setDate(sDate.getDate() + 1);
                        sDate.setHours(0);
                    } // otherwise move to next hour
                    else sDate.setHours(sDate.getHours() + 1);
                // if monthView, set dialog to first day of chosen month unless
                // today is greater
                } else if (currView == "month") {
                    pickedDate.setDate(1);
                    if (pickedDate.getTime() > sDate.getTime()) sDate = pickedDate; 
                }
                cal.eventDialog.setDate(sDate);
                // place the dialog at the left edge of the calendar, right below the button itself
                cal.eventDialog.setPageLeft(cal.getPageLeft());
                cal.eventDialog.setPageTop(this.getPageTop() + this.getVisibleHeight());
               
                cal.eventDialog.show();
            }
        } );
        
        // datePickerButton
        this.datePickerButton = this.createAutoChild("datePickerButton", {
            click: function () {
                var cal = this.creator;
                if (this._datePicker) {
                    // redraw the datePicker, positioning is already taken care of   
                    this._datePicker.setData(cal.chosenDate);
                    this._datePicker.draw();
                } else {
                     this._datePicker = isc.DateChooser.create({
                        calendar: this.creator, autoDraw: false,
                        showCancelButton: true, autoClose: true,
                        disableWeekends: this.creator.disableWeekends,
                        firstDayOfWeek: this.creator.firstDayOfWeek,
                        showWeekends: this.creator.showWeekends,
                        // override dateClick to change the selected day
                        dateClick : function (year, month, day) {
                            var nDate = new Date(year, month, day);
                            this.setData(nDate);
                            // change the chosen date via the dateChooser
                            this.calendar.dateChooser.dateClick(year, month, day);
                            this.close();
                        }
                     });
                     this._datePicker.setData(cal.chosenDate);
                     cal.addChild(this._datePicker);
                     
                     this._datePicker.placeNextTo(this, "bottom", true);         
                }
                
                
            }
        } );
        
        this.previousButton = this.createAutoChild("previousButton", {});
        
        this.nextButton = this.createAutoChild("nextButton", {});
    }
    var cbMems = [];
    if (this.showPreviousButton != false) cbMems.add(this.previousButton);
    if (this.showDateDisplay != false) cbMems.add(this.dateDisplay);
    if (this.showDatePickerButton != false) cbMems.add(this.datePickerButton);
    if (this.canCreateEvents && this.showAddEventButton != false) cbMems.add(this.addEventButton);
    if (this.showNextButton != false) cbMems.add(this.nextButton);
    // set up calendar navigation controls
    if (this.showControlsBar != false) {
        this.controlsBar = this.createAutoChild("controlsBar", { 
            members: cbMems
        });
    }
    //if (mvTabs.length == 1) this.controlsBar.layoutAlign = "center";
    
    // date chooser
    this.dateChooser = this.createAutoChild("dateChooser", {
            disableWeekends: this.disableWeekends,
            showWeekends: this.showWeekends,
            chosenDate: this.chosenDate, 
            month: this.month,
            year: this.year,
            // override dateClick to change the selected day
            dateClick : function (year, month, day) {
                var nDate = new Date(year, month, day);
                this.setData(nDate);
               
                // recalculate displayed events
                this.creator.setChosenDate(nDate);    
            },
            
            showPrevYear : function () {
                this.year--;
                this.dateClick(this.year, this.month, this.chosenDate.getDate());
            },
        
            showNextYear : function () {
                this.year++;
                this.dateClick(this.year, this.month, this.chosenDate.getDate());
            },
            
            showPrevMonth : function () {
                if (--this.month == -1) {
                    this.month = 11;
                    this.year--;
                }
                this.dateClick(this.year, this.month, 1);
            },
        
            showNextMonth : function () {
                if (++this.month == 12) {
                    this.month = 0;
                    this.year++;
                }
                this.dateClick(this.year, this.month, 1);
            }
    } );
    
    // quick event dialog
    this.eventDialog = this.createAutoChild("eventDialog", {
 
        items: [
            isc.DynamicForm.create({
                autoDraw: false,
                padding:4,
                calendar: this,
                saveOnEnter: true,
                useAllDataSourceFields: true,
                _internalFields : ["name"],
                 getCustomValues : function () {
                    if (!this.calendar.eventDialogFields) return;
                    var internalValues = this._internalFields;
                    var fields = this.calendar.eventDialogFields;
                    var cFields = {}
                    for (var i = 0; i < fields.length; i++) {
                        var fld = fields[i];
                        if (fld.name && !internalValues.contains(fld.name)) {
                            cFields[fld.name] = this.getValue(fld.name);        
                        }
                    }
                    return cFields;    
                },
                setCustomValues : function (values) {
                    if (!this.calendar.eventDialogFields) return;
                    var internalValues = this._internalFields;
                    var fields = this.calendar.eventDialogFields;
                    for (var i = 0; i < fields.length; i++) {
                        var fld = fields[i];
                        if (fld.name && !internalValues.contains(fld.name)) {
                            this.setValue(fld.name, values[fld.name]);        
                        }
                    }
                          
                },
                createFields : function (isEvent) {
                    var nameType = isEvent ? "staticText" : "text";
                    var cal = this.calendar;
                    // set up default fields
                    var fieldList = [
                        {name: cal.nameField, title: cal.eventNameFieldTitle, type: nameType, width: 250 },
                        {name: "save", title: cal.saveButtonTitle, type: "SubmitItem", endRow: false},
                        {name: "details", title: cal.detailsButtonTitle, type: "button", startRow: false,
                            click : function (form, item) {
                                form.calendar._showEventEditor(form.calendar.eventDialog.event);    
                            }
                        }   
                    ];
                    if (isEvent) fieldList.removeAt(1);
                    // create internal datasource
                    var dialogDS = isc.DataSource.create({
                        addGlobalId: false,
                        fields: fieldList
                    });
                    // set datasource then fields...other way around doesn't work
                    this.setDataSource(dialogDS);
                    this.setFields(isc.shallowClone(this.calendar.eventDialogFields));
                },

                submit : function () {
                    var cal = this.calendar,
                        evt = cal.eventDialog.event, 
                        sdate = cal.eventDialog.currentStart,
                        edate = cal.eventDialog.currentEnd;
                        
                    if (!this.validate()) return;
                    if (evt) { // event window clicked, so update 
                        cal.updateEvent(evt, sdate, edate, 
                            this.getItem(this.calendar.nameField).getValue() ,evt[cal.descriptionField]
                            , this.getCustomValues(), true);

                        cal.eventDialog.hide();
                        
                    } else { // create new event
                        cal.addEvent(sdate, edate, this.getItem(this.calendar.nameField).getValue(),
                            "", this.getCustomValues(),  true);
                        cal.eventDialog.hide();
                    }
                }
            })
        ],
            
        setDate : function (startDate, endDate) {
            if (!endDate) {
                // handle the case where where the startDate is 11:30 pm...in this case only 
                // do a 1/2 hour long event
                if (startDate.getHours() == 23 && startDate.getMinutes() == 30) {
                    endDate = new Date(startDate.getFullYear(), startDate.getMonth(),
                    startDate.getDate() + 1); 
                } else {
                    endDate = new Date(startDate.getFullYear(), startDate.getMonth(),
                        startDate.getDate(), startDate.getHours() + 1, startDate.getMinutes());
                }
            }
            this.setTitle(this.creator._getEventDialogTitle(startDate, endDate));
            this.currentStart = startDate;
            this.currentEnd = endDate;
            this.items[0].getItem(this.creator.nameField).setValue("");
        },
        
        setEvent : function (event) {
            this.event = event;
    
            var theForm = this.items[0];
            
            // if we have custom fields, clear errors and set those custom fields
            if (this.creator.eventDialogFields) {
                theForm.clearErrors(true);
                theForm.setCustomValues(event);
            }
            this.setDate(event[this.creator.startDateField], 
                event[this.creator.endDateField]);
            
            theForm.getItem(this.creator.nameField).setValue(event[this.creator.nameField]);
        },
        
        closeClick : function () {
            this.Super('closeClick');
            // clear selections on close of dialog
            this.creator.dayView.clearSelection();
            this.creator.weekView.clearSelection();
           
        },
        
        show : function () {
            if (this.creator.showQuickEventDialog) {
                
                if (!this.isDrawn()) this.draw();
                this.Super('show');
                this.items[0].getItem(this.creator.nameField).focusInItem();
            } else {
                this.creator._showEventEditor(this.event);    
            }
        },
        
        hide : function () {
            this.Super('hide');
            this.moveTo(0, 0);
        }
        
    } );
    
    // event editor form
    this.eventEditor = this.createAutoChild("eventEditor", {   
        useAllDataSourceFields: true,
        initWidget : function () {
            // invoke initWidget here rather than at the end of the function, or else we multiple
            // log warnings of form fields being clobbered
            this.invokeSuper(isc.DynamicForm, "initWidget", arguments);
   
            this.timeFormat = this.creator.timeFormat;
            var fieldList = [
                {name: "startHours", title: "From", type: "select", width: 60},
                {name: "startMinutes", showTitle: false, type: "select", width: 60},
                {name: "startAMPM", showTitle: false, type: "select", width: 60},
                {name: "invalidDate", type: "blurb", colSpan: 4, visible: false,
                    defaultValue: this.creator.invalidDateMessage},
                {name: "endHours", title: "To", type: "select", width: 60},
                {name: "endMinutes", showTitle: false, type: "select", width: 60},
                {name: "endAMPM", showTitle: false, type: "select", width: 60},
                {name: "name", title: "Name", type: "text", colSpan: 4},
                {name: "description", title: "Description", type: "textArea", colSpan: 4, height: 50}
            ];
            fieldList[0].valueMap = this.getTimeValues("hours");
            fieldList[1].valueMap = this.getTimeValues("minutes");
            fieldList[2].valueMap = this.getTimeValues();
            fieldList[3].cellStyle = this.errorStyle || "formCellError";
            fieldList[4].valueMap = this.getTimeValues("hours");
            fieldList[5].valueMap = this.getTimeValues("minutes");
            fieldList[6].valueMap = this.getTimeValues();
            // create an internal ds and bind to it so that the default fields can be 
            // overridden. See forms->validation->customized binding in the feature explorer
            var editorDS = isc.DataSource.create({
                addGlobalId: false,
                fields: fieldList
            });
            // only datasource then fields seems to work
            this.setDataSource(editorDS);
            this.setFields(isc.clone(this.creator.eventEditorFields));
        },
        getTimeValues : function (type, startTime) {
            if (!startTime) startTime = 0;
            var obj = {};
            if (type == "hours") {
                for (var i = startTime; i < 12; i++) {
                    obj[(i + 1) + ""] = (i + 1);                     
                }
            } else if (type == "minutes") {
                for (var i = 0; i < 60; i++) {
                    // stringify the minutes
                    var stringMin = i < 10 ? "0" + i : "" + i;
                    obj[i + ""] = stringMin;
                }
            } else {
                obj["am"] = "am";
                obj["pm"] = "pm";
            }
            
            return obj;
        },
        _internalFields : ["startHours", "startMinutes", "startAMPM", "endHours", 
                "endMinutes", "endAMPM", "name", "description"],
        getCustomValues : function () {
            if (!this.creator.eventEditorFields) return;
            var internalValues = this._internalFields;
            var fields = this.creator.eventEditorFields;
            var cFields = {}
            for (var i = 0; i < fields.length; i++) {
                var fld = fields[i];
                if (fld.name && !internalValues.contains(fld.name)) {
                    cFields[fld.name] = this.getValue(fld.name);        
                }
            }
            return cFields;    
        },
        setCustomValues : function (values) {
            if (!this.creator.eventEditorFields) return;
            var internalValues = this._internalFields;
            var fields = this.creator.eventEditorFields;
            for (var i = 0; i < fields.length; i++) {
                var fld = fields[i];
                if (fld.name && !internalValues.contains(fld.name)) {
                    this.setValue(fld.name, values[fld.name]);        
                }
            }
                  
        }
    } );
    
    // event editor layout
    this.eventEditorLayout = this.createAutoChild("eventEditorLayout", { 
        items: [
            this.eventEditor,
            isc.HLayout.create({
                membersMargin: 10, 
                layoutMargin: 10,
                autoDraw:false, 
                members: [
                isc.IButton.create({autoDraw: false, title: this.saveButtonTitle, calendar: this,
                        click : function () {
                            var cal = this.calendar,
                                evt = cal.eventEditorLayout.event,
                                form = cal.eventEditor,
                                sHrs = form.getItem("startHours").getValue(),
                                eHrs = form.getItem("endHours").getValue(),
                                sMins = form.getItem("startMinutes").getValue(), 
                                eMins = form.getItem("endMinutes").getValue()
                            ; 
                            var sAMPM, eAMPM;
                               
                            if (!cal.twentyFourHourTime) {
                                sAMPM = form.getItem("startAMPM").getValue();
                                eAMPM = form.getItem("endAMPM").getValue();
                                sHrs = cal._to24HourNotation(sHrs, sAMPM);
                                eHrs = cal._to24HourNotation(eHrs, eAMPM);
                                // handle the case where end date is 12am, which is valid, as this
                                // is considered the end of the current day
                                if (eHrs == 0) eHrs = 24;
                            }
                            // check for invalid times
                            if (!(sHrs < eHrs || (sHrs == eHrs && sMins < eMins))) {
                                form.showItem("invalidDate");
                                return;
                            }

                            // run validation so rules for custom fields added by the
                            // developer are enforced
                            if (!form.validate()) return;

                            var sdate = cal.eventEditorLayout.currentStart,
                                edate = cal.eventEditorLayout.currentEnd;
                            
                            // Differing calendar dates:
                            // For an end date of midnight we end up with the start date
                            // and the end date being on different days.
                            // Cases we need to handle:
                            // - stored start/end date are the same day, and user has
                            //   moved end time forward to midnight.
                            //   * call 'setHour(24)' - will auto increment date value
                            // - stored start/end date are different days (so end is midnight)
                            //   and user has moved end date back to a time before midnight.
                            //   * call 'setDate()' to decrease the end date to the same day,
                            //     then apply the new time via setHour()
                            // - stored start end date are different (end date is midnight)
                            //   and user has left it selected
                            //   * no need to actually setHours on end date but if we do,
                            //     convert the '24' set up above to zero so we don't
                            //     increment the date an additional day.
                            if (edate.getDate() > sdate.getDate()) {
                                if (eHrs == 24) eHrs = 0;
                                else {
                                    edate.setDate(sdate.getDate());
                                }
                            }
                            sdate.setHours(sHrs);
                            sdate.setMinutes(sMins);
                            edate.setHours(eHrs);
                            edate.setMinutes(eMins);
                            if (evt) { // event window clicked, so update 
	                            var sStartDate=cal.eventEditorLayout.originalStart,
                        	        sEndDate=cal.eventEditorLayout.originalEnd;

                                cal.updateEvent(evt, sdate, edate
                                    ,form.getItem("name").getValue() 
                                    ,form.getItem("description").getValue(), form.getCustomValues(), true);

                                if (cal.eventAutoArrange) {
                                    cal._renderEventRange(cal.weekViewSelected(), sStartDate, sEndDate);
                                }
                                cal.eventEditorLayout.hide();
                                
                            } else { // create new event
                                cal.addEvent(sdate, edate
                                    ,form.getItem("name").getValue() 
                                    ,form.getItem("description").getValue(), 
                                    form.getCustomValues(), true);
                                cal.eventEditorLayout.hide();
                            }
                        }
                    }),
                    isc.IButton.create({autoDraw: false, title: this.cancelButtonTitle, calendar:this,
                        click: function () {
                            this.calendar.eventEditorLayout.hide();    
                        }
                    })
                ]
            })
        ],

        setDate : function (startDate, endDate, eventName) {
            if (!eventName) eventName = "";
            if (!endDate) {
                endDate = new Date(startDate.getFullYear(), startDate.getMonth(),
                    startDate.getDate(), startDate.getHours() + 1, startDate.getMinutes());
            }
            var cal = this.creator;
            this.setTitle(cal._getEventDialogTitle(startDate, endDate));
            this.currentStart = startDate;
            this.currentEnd = endDate;
         
            this.items[0].getItem("startHours").setValue(this.getHours(startDate.getHours())); 
            this.items[0].getItem("endHours").setValue(this.getHours(endDate.getHours()));
            this.items[0].getItem("startMinutes").setValue(startDate.getMinutes());
            this.items[0].getItem("endMinutes").setValue(endDate.getMinutes());
            if (!cal.twentyFourHourTime) {
                this.items[0].getItem("startAMPM").setValue(this.getAMPM(startDate.getHours()));
                this.items[0].getItem("endAMPM").setValue(this.getAMPM(endDate.getHours()));
            }
            this.items[0].getItem("name").setValue(eventName);
            this.items[0].getItem("description").setValue("");
        },
        
        getHours : function (hour) {
            if (this.creator.twentyFourHourTime) return hour;
            else return this.creator._to12HrNotation(hour);
        },
        
        getAMPM : function (hour) {
            if (hour < 12) return "am";
            else return "pm";
        },
    
        setEvent : function (event) {
            this.event = event;
            // if we have custom fields, clear errors and set those custom fields
            if (this.creator.eventEditorFields) {
                this.items[0].clearErrors(true);
                this.items[0].setCustomValues(event);
            }
            this.setDate(event[this.creator.startDateField], 
                event[this.creator.endDateField]);
            this.items[0].getItem("name").setValue(event[this.creator.nameField]);
            this.items[0].getItem("description").setValue(
                    event[this.creator.descriptionField]);
            this.originalStart = isc.clone(this.currentStart);
            this.originalEnd = isc.clone(this.currentEnd);
            
        },

        hide : function () {
            this.Super('hide');
            // clear any selection that's been made
            if (this.creator.dayView) this.creator.dayView.clearSelection();
            if (this.creator.weekView) this.creator.weekView.clearSelection();
            // clear any errors
            this.creator.eventEditor.hideItem("invalidDate");
        },
       
        sizeMe : function () {
            this.setWidth(this.creator.mainView.getVisibleWidth());
            this.setHeight(this.creator.mainView.getVisibleHeight()); 
            this.setLeft(this.creator.mainView.getLeft());
        }
    });
    
    
    
    // layout for date chooser and main calendar view
    if (!this.children) this.children = [];
    var mainMembers = [];
    var subMembers = [];
    //if (this.canCreateEvents) subMembers.add(this.addEventButton);
    subMembers.add(this.dateChooser);
    if (this.showDateChooser) {
        mainMembers.add(isc.VLayout.create({
                        autoDraw:false,
                    width: "20%",
                    membersMargin: 10,
                    layoutTopMargin: 10,
                    members: subMembers
                }));
    }
    
    if (this.mainView.isA("TabSet")) {
        mainMembers.add(this.mainView);   
    // center align controlsBar
    } else {
        if (this.showControlsBar != false) {
             
            var controlsBarContainer = isc.HLayout.create({
                    autoDraw: false,
                    height: this.controlsBar.getVisibleHeight(),
                    width: "100%"
            });
            
            controlsBarContainer.addMember(isc.LayoutSpacer.create({autoDraw:false, width:"*"}));
            controlsBarContainer.addMember(this.controlsBar);
            controlsBarContainer.addMember(isc.LayoutSpacer.create({autoDraw:false, width:"*"}));
            mainMembers.add(isc.VLayout.create({
                    autoDraw:false,
                    members: [controlsBarContainer, this.mainView]
                }));
        } else {
             mainMembers.add(this.mainView);
        }
    }
    
    this.children.add(
        isc.HLayout.create({ 
                autoDraw:false,
            width: "100%",
            height: "100%",
            members:mainMembers
           
        })
    );
    
    this.eventEditorLayout.hide();
    
    this.setDateLabel();    
}, // end createChildren

// sets the date label of the calendar. Called whenever the chosenDate or selected tab
// changes
setDateLabel : function () {
    if (!this.dateDisplay) return;
    if (this.dayViewSelected()) { // day tab
        this.dateDisplay.setContents("<b>" + 
            Date.getFormattedDateRangeString(this.chosenDate) + "</b>");
    } else if (this.weekViewSelected()) { // week tab
        var dateRange = this._getWeekRange();
        var startDate = dateRange[0];
        var endDate = dateRange[1];

        this.dateDisplay.setContents("<b>" + 
            Date.getFormattedDateRangeString(startDate, endDate) + "</b>");
    } else if (this.monthViewSelected()) { // month tab
        this.dateDisplay.setContents("<b>" + this.chosenDate.getShortMonthName()
            + " " + this.chosenDate.getFullYear() + "</b>");
    } else if (this.timelineViewSelected()) {
        var ebtView = this.timelineView, sDate = ebtView.startDate, eDate = ebtView.endDate;
        var contents = "<b>" + ebtView.formatDateForDisplay(sDate) + "</b> through <b>" + 
            ebtView.formatDateForDisplay(eDate) + "</b>";
        this.dateDisplay.setContents(contents);
    }
},

_getWeekRange : function () {
    var start = this.chosenWeekStart.duplicate();
    var end = this.chosenWeekEnd.duplicate();
    if (!this.showWeekends) {
        var wEnds = Date.getWeekendDays();
        var numDays = 7 - wEnds.length;
        // first augment start so its not sitting on a weekend
        while (wEnds.contains(start.getDay())) {
            start.setDate(start.getDate() + 1);    
        }
        // number of days to add to numDays when calculating end day
        // The idea is to add weekdays length to start date to arrive at end date. If there are 
        // weekends in between, however, we need to add those days to the end date as well
        var addDays = 0, cursorDate = start.duplicate(); 
        for (var i = 0; i < numDays; i++) {
            if (wEnds.contains(cursorDate.getDay())) addDays++;
            cursorDate.setDate(cursorDate.getDate() + 1);
        }
        end = start.duplicate();
        //isc.logWarn('here:' + [numDays, addDays]);
        end.setDate(end.getDate() + (numDays - 1) + addDays);
    }
    return [start, end];
},

dayViewSelected : function () {
    if (!this.mainView.isA("TabSet")) return this.mainView.viewName == "day";
    else return this._selectedViewName == "day";  
},

weekViewSelected : function () {
    if (!this.mainView.isA("TabSet")) return this.mainView.viewName == "week";
    else return this._selectedViewName == "week";
},

monthViewSelected : function () {
    if (!this.mainView.isA("TabSet")) return this.mainView.viewName == "month";
    else return this._selectedViewName == "month";
},

timelineViewSelected : function () {
    if (!this.mainView.isA("TabSet")) return this.mainView.viewName == "timeline";
    else return this._selectedViewName == "timeline";    
},

// Displays the event entry/edit dialog at the given row and column position
_showEventDialog : function (rowNum, colNum, numRows, eventWindow) {
    // no event window means that an empty slot was clicked, so show dialog for creating a 
    // new event
    if (!eventWindow) {
        // clear the stored events (components check this to figure out whether to use add vs
        // update operationType for saving)
        this.eventDialog.event = null;
        if (this.eventEditorLayout) this.eventEditorLayout.event = null;

        this.eventDialog.items[0].createFields(false);
        var sDate, eDate;
        
        sDate = this._getDateFromPoint(rowNum, colNum);
        if (this.monthViewSelected()) { // get date for clicked month day cell
           var sHrs = new Date();
           sHrs = sHrs.getHours();
           // take an hour off so the event stays within the day
           if (sHrs > 22) sHrs -= 1;
           sDate.setHours(sHrs);
        }
        if (numRows && numRows > 1) {
            eDate = this._getDateFromPoint(rowNum + numRows, colNum);
        }
        
        this.eventDialog.setDate(sDate, eDate);
    } else { // otherwise show dialog for clicked event
        this.eventDialog.eventWindow = eventWindow;
        this.eventDialog.items[0].createFields(true);
        this.eventDialog.setEvent(eventWindow.event);    
    }

    // ensure the dialog is drawn before placing it
    
    this.eventDialog.moveTo(0, -10000);
    this.eventDialog.show(); 
    
    var coords = this.getSelectedView().getCellPageRect(rowNum, colNum);
    this.eventDialog.placeNear(coords[0], coords[1]);
    // bringToFront() needs to be put on a timer, else it fails to actually bring the
    // eventDialog to the front
    isc.Timer.setTimeout(this.ID + ".eventDialog.bringToFront()");
},

_showEventEditor : function (event) {
    
    if (!this.eventEditorLayout.isDrawn()) this.eventEditorLayout.draw();
    this.eventEditorLayout.setWidth(this.mainView.getVisibleWidth());
    this.eventEditorLayout.setHeight(this.mainView.getVisibleHeight());
    // move the eventEditor to cover the mainView only
    
    this.eventEditorLayout.setPageLeft(this.mainView.getPageLeft());
    this.eventEditorLayout.setPageTop(this.getPageTop());
   
    //if (this.eventEditorFields) this.eventEditor.reset();
    if (event) {
        this.eventEditorLayout.setEvent(event);
    } else {
        this.eventEditor.clearValues();
        // pass any custom field values through to the event editor
        if (this.eventEditorFields) {
            this.eventEditorLayout.items[0].setCustomValues(this.eventDialog.items[0].getCustomValues());
        }
        this.eventEditorLayout.setDate(this.eventDialog.currentStart, 
            this.eventDialog.currentEnd, this.eventDialog.items[0].getItem("name").getValue());
    }
    
    this.eventDialog.hide();
    
    this.eventEditorLayout.show();
    
},

_getEventDialogTitle : function (startDate, endDate) {
    var dayNames = Date.getShortDayNames();
    var monthNames = Date.getShortMonthNames();
   
    var sHrs = startDate.getHours(), eHrs = endDate.getHours(), 
        sMins = startDate.getMinutes(), eMins = endDate.getMinutes(), sStr, eStr;
    sStr = this._to12HrNotation(sHrs) + (sMins < 10 ? ":0" + sMins : ":" + sMins);
    eStr = this._to12HrNotation(eHrs) + (eMins < 10 ? ":0" + eMins : ":" + eMins)
        + (eHrs > 11 ? "pm" : "am");
    if (!((sHrs < 12 && eHrs < 12) || (sHrs > 11 && eHrs > 11))) sStr += (sHrs > 11 ? "pm" : "am");
    
    var timeStr = sStr + " - " + eStr;
    return dayNames[startDate.getDay()] + ", " + monthNames[startDate.getMonth()]
        + " " + startDate.getDate() + ", " + timeStr ;
}, 

_to12HrNotation : function (hour) {
    if (hour == 0) return 12;
    else if (hour < 13) return hour;
    else return hour - 12;
},

_to24HourNotation : function (hour, ampmString) {
    // make sure we're dealing with an int
    hour = parseInt(hour);
    if (ampmString.toLowerCase() == "am" && hour == 12) { 
        return 0;
    } else if (ampmString.toLowerCase() == "pm" && hour < 12) {
        return hour + 12;    
    } else {
        return hour;    
    }
},

_getDateFromPoint : function (rowNum, colNum) {
    
    var retDate;
    if (this.dayViewSelected()) {
        retDate = this.chosenDate.duplicate();    
    } else if (this.weekViewSelected()) {
        var fld = this.weekView.getField(colNum);
        if (!fld._yearNum) return;
        // for weekview, date props are stored on the field objects
        retDate = new Date(fld._yearNum, fld._monthNum, fld._dateNum);
    } else if (this.monthViewSelected()) {
        var rec = this.monthView.data.get(rowNum);
        // get the index into the record from the field at colNum. 
        var dIndex = this.monthView.getField(colNum)._dayIndex;
        retDate = rec["date" + dIndex].duplicate();
        // return midnight of the given day
        retDate.setHours(0); retDate.setMinutes(0); retDate.setSeconds(0);
    } else if (this.timelineViewSelected()) {
        var tlv = this.timelineView;
        retDate = this.timelineStartDate.duplicate();
        if (tlv.timelineGranularity == "day") {
            retDate.setDate(retDate.getDate() + colNum);   
        } else {
            retDate.setHours(retDate.getHours() + colNum);   
        }
    } else {
        return;    
    }
    // consolidate logic for dealing with minutes here
    if (this.dayViewSelected() || this.weekViewSelected()) {
        var hour, baseRowNum = rowNum, mins = 0;
        // each row represents 1/2 hour
        if (rowNum % 2 == 1) {
            baseRowNum = rowNum - 1;
            mins = 30;
        }
        
        retDate.setHours(baseRowNum / 2, mins);
    }
    return retDate;
    
},

// rowHeight == 30 minutes. return the number of pixels that the parameter minutes will occupy
_getMinutePixels : function (minutes, rowHeight, viewName) {
    if (viewName == "timeline") {
        // for now, this will only be called when timeline granularity is set to 'hour'
        // rowHeight is actually rowWidth in this case.
        var rowWidth = rowHeight;
        // divide rowWidth by 60 to get the width of each minute
        return Math.round(rowWidth / 60) * minutes;
    } else {
        return Math.round((rowHeight / 30) * minutes);
    }        
},

monthViewEventClick : function (rowNum, colNum, eventIndex) {
    var events = this.monthView.getEvents(rowNum, colNum);
    var evt = events[eventIndex];
    if (this.eventClick(evt, "month")) this._showEventEditor(evt);   
},

//> @method calendar.getDayBodyHTML()
// Return the HTML to be shown in the body of a day in the month view.
// <P>
// Default is to render a series of links that call +link{eventClick} to provide details
// and/or an editing interface for the events.
// <P>
// <code>getDayBodyHTML()</code> is not called for days outside of the current month if
// +link{showOtherDays} is false.
//
// @param date (Date) JavaScript Date object representing this day
// @param events (Array of CalendarEvent) events that fall on this day
// @param calendar (Calendar) the calendar itself
// @param rowNum (Integer) the row number to which the parameter date belongs
// @param colNum (Integer) the column number to which the parameter date belongs
// @return (HTML) HTML to display
// 
// @group monthViewFormatting
// @visibility calendar
//<
getDayBodyHTML : function (date, events, calendar, rowNum, colNum) {
    
    var day = date.getDay();
    
    var evtArr = events, lineHeight = 15,
        record = this.monthView.data ? this.monthView.data[1] : null,
        rHeight = this.monthView.getRowHeight(record, 1);
    var retVal = "";
    for (var i = 0; i < evtArr.length; i++) {
        var eTime = evtArr[i][this.startDateField].getHours();
        eTime = this._to12HrNotation(eTime) + (eTime > 11 ? "P " : " ");
        if (this.canEditEvent(evtArr[i])) {
            // when clicked, call the the editEvent method of this calendar, passing the
            // row, column, and position of the event in this cell's event array
            var template  = "<a href='javascript:" + this.ID + ".monthViewEventClick(" + 
                rowNum + "," + colNum + "," + i + ");' class='" 
                + this.calMonthEventLinkStyle + "'>";
                
            retVal += template + eTime + evtArr[i][this.nameField] + "</a><br/>";
        } else {
            retVal += eTime + evtArr[i][this.nameField] + "<br/>";      
        }
        if ((i + 3) * lineHeight > rHeight) break; 
    }
    if (i < evtArr.length - 1) {
        retVal += "+ " + (evtArr.length - 1 - i) + " more...";
    }
    return retVal;
},

// @method calendar.getDayHeaderHTML()
// Return the HTML to be shown in the header of a day in the month view.
// <P>
// Default is to render just the day of the month, as a number.
//
// @param date (Date) JavaScript Date object representing this day
// @param events (Array of CalendarEvent) events that fall on this day
// @param calendar (Calendar) the calendar itself
// @return (HTML) HTML to show in the header of a day in the month view
// 
// @group monthViewFormatting
// @visibility calendar
//<
getDayHeaderHTML : function (date, events, calendar, rowNum, colNum) {
    //isc.logWarn('here:' + [date.getDate(), rowNum, colNum]);
    return date.getDate();
},

//> @method calendar.dayBodyClick()
// Called when the body area of a day in the month view is clicked on, outside of any links
// to a particular event.
// <P>
// By default, if the user can add events, shows a dialog for adding a new event for that
// day.  Return false to cancel this action.
// <P>
// Not called if the day falls outside the current month and +link{showOtherDays} is false.
//
// @param date (Date) JavaScript Date object representing this day
// @param events (Array of CalendarEvent) events that fall on this day
// @param calendar (Calendar) the calendar itself
// @param rowNum (Integer) the row number to which the parameter date belongs
// @param colNum (Integer) the column number to which the parameter date belongs
// @return (boolean) false to cancel the default action
//
// @group monthViewEvents
// @visibility calendar
//<
dayBodyClick : function (date, events, calendar, rowNum, colNum) {
   return true;
},

//> @method calendar.dayHeaderClick()
// Called when the header area of a day in the month view is clicked on.
// <P>
// By default, moves to the day tab and shows the clicked days events.
// Return false to cancel this action.
// <P>
// Not called if the day falls outside the current month and +link{showOtherDays} is false.
//
// @param date (Date) JavaScript Date object representing this day
// @param events (Array of CalendarEvent) events that fall on this day
// @param calendar (Calendar) the calendar itself
// @param rowNum (Integer) the row number to which the parameter date belongs
// @param colNum (Integer) the column number to which the parameter date belongs
// @return (boolean) return false to cancel the action
//
// @group monthViewEvents
// @visibility calendar
//<
dayHeaderClick : function (date, events, calendar, rowNum, colNum) {
    return true;    
},

//> @method calendar.eventChanged()
// Notification fired whenever a user changes an event, whether by dragging the event or by
// editing it in a dialog.
// <P>
// In a calendar with a DataSource, eventChanged() fires <b>after</b> the updated event has
// been successfully saved to the server
//
// @param event (CalendarEvent) the event that changed
// @group monthViewEvents
// @visibility calendar
//<

//> @method calendar.eventRemoved()
// Notification fired whenever a user removes an event
// <P>
// In a calendar with a DataSource, eventRemoved() fires <b>after</b> the event has
// been successfully removed from the server
//
// @param event (CalendarEvent) the event that was removed
// @group monthViewEvents
// @visibility calendar
//<

//> @method calendar.eventAdded()
// Notification fired whenever a user adds an event.
// <P>
// In a calendar with a DataSource, eventAdded() fires <b>after</b> the event has
// been successfully added to the server
//
// @param event (CalendarEvent) the event that was added
// @group monthViewEvents
// @visibility calendar
//<

//> @method calendar.eventClick()
// Called whenever an event is clicked on in the day, week or month views.
// <P>
// By default a dialog appears showing details for the event, and offering the ability to
// edit events which are editable.  Return false to cancel the default action. This is a good
// place to, for example, show a completely customized event dialog instead of the default one.
//
// @param event (CalendarEvent) event that was clicked on
// @param viewName (String) view where the event was clicked on: "day", "week" or "month"
// @return (boolean) false to cancel the default action
//
// @group monthViewEvents
// @visibility calendar
//<
eventClick : function () {
    return true;
},

//> @method calendar.eventRemoveClick()
// Called whenever the close icon of an event is clicked within the day or week view. Return
// false to cancel the removal, or true to allow it.
// <P>
// Implement this method to do something like, for example, showing a confirmation dialog 
// before an event is removed.
//
// @param event (CalendarEvent) event that was clicked on
// @param viewName (String) view where the event was clicked on: "day", "week" or "month"
// @return (boolean) false to cancel the removal
//
// @group monthViewEvents
// @visibility calendar
//<
eventRemoveClick : function () {
    return true;    
},

//> @method calendar.eventMoved()
// Called when an event is moved via dragging by a user.  Return false to disallow the move.
// @param newDate (Date) new date and time that event is being moved to
// @param event (CalendarEvent)
// @return (boolean) return false to disallow the move.
//
// @group monthViewEvents
// @visibility calendar
//<
eventMoved : function () {
    return true;    
},

//> @method calendar.eventResized()
// Called when an event is resized via dragging by a user.  Return false to disallow the
// resize.
// @param newDate (Date) new end date and time that event is being resized to
// @param event (CalendarEvent)
// @return (boolean) return false to disallow the resize
//
// @group monthViewEvents
// @visibility calendar
//<
eventResized : function () {
    return true;    
},

timelineEventMoved : function () {
    return true;    
},

timelineEventResized : function () {
    return true;
},

// helper method, gets a valid date with respect to the eventSnapGap and starting point of 
// referenceDate. Used in eventWindow dragRepositionStop and dragResizeStop to ensure a valid
// date every time.
getValidSnapDate : function (referenceDate, snapDate) {
    // the formula for getting the snapDate is: 
    // round((snapDate as minutes - offset) / snapGap) * snapGap + offset
    // where offset = reference date as minutes mod snapGap
    var snapGap = this.eventSnapGap;
    
    var offset = ((referenceDate.getHours() * 60) + referenceDate.getMinutes()) % snapGap;
    
    var dateMinutes = (snapDate.getHours() * 60) + snapDate.getMinutes();
    var gapsInDate = Math.round((dateMinutes - offset) / snapGap);
    
    var totMins = (gapsInDate * snapGap) + offset;
   
    var hrs = Math.floor(totMins / 60), mins = totMins % 60;
    snapDate.setHours(hrs);
    snapDate.setMinutes(mins);
    return snapDate;    
},

//> @method calendar.selectTab()
// Fires whenever the user changes the current date, including picking a specific date or
// navigating to a new week or month.
//
// @param tabnum (number) the index of the tab to select
// @visibility calendar
//<
selectTab : function (tabnum) {
    if (this.mainView && this.mainView.isA("TabSet") && this.mainView.tabs.getLength() > tabnum) {
        this.mainView.selectTab(tabnum);
        this.refreshSelectedView();
        return true;        
    } else {
        return false;    
    }
},

// override parentResized to resize the eventEditorLayout as well
parentResized : function () {
    //isc.logWarn('calendar parentResized');
     this.Super('parentResized', arguments);
     // only resize the eventEditorLayout if its shown
     if (this.eventEditorLayout.isVisible()) this.eventEditorLayout.sizeMe();
},

//> @method calendar.dateChanged()
// Fires whenever the user changes the current date, including picking a specific date or
// navigating to a new week or month.
// @visibility external
//<
dateChanged : function () {
    return true;
},

//> @method calendar.getActiveDay()
// Gets the day of the week (0-6) that the mouse is currently over.
//
// @return (integer) the day that the mouse is currently over
// @see calendar.getActiveTime()
// @visibility external
//<
getActiveDay : function () {
    var activeTime = this.getActiveTime();
    if (activeTime) return activeTime.getDay();
},

//> @method calendar.getActiveTime()
// Gets a date object representing the date over which the mouse is hovering for the current
// selected view. For month view, the time will be set to midnight of the active day. For dayview
// and week view, the time will be the rounded to the closest half hour relative to the mouse
// position.
// @return	(Date) the date that the mouse is over
// @visibility external
//<
getActiveTime : function () {
    var EH = this.ns.EH,
    currView = this.getSelectedView();
    var colNum = currView.getEventColumn();
    var rowNum = currView.getEventRow();
    return this._getDateFromPoint(rowNum, colNum);
             
},

//> @method calendar.setTimelineRange()
// Sets the range over which the timeline will display events
// @param start (date) start of range
// @param end (date) end of range
// @visibility external
//<
setTimelineRange : function (start, end, gran, units, callback) {
    if (this.timelineView) this.timelineView.setTimelineRange(start, end, gran, units);        
    if (callback) this.fireCallback(callback);
}
 


});

// DaySchedule
// --------------------------------------------------------------------------------------------
isc.ClassFactory.defineClass("DaySchedule", "ListGrid");

isc.DaySchedule.changeDefaults("bodyProperties", {
    childrenSnapToGrid: true,
    snapToCells: true,
    redrawOnResize:true
});

isc.DaySchedule.addProperties({
    //defaultWidth: 300,
    //defaultHeight: 300,
    autoDraw: false,
    canSort: false,
    canResizeFields: false,
    canReorderFields: false,
    showHeader: false,
    showHeaderContextMenu: false,
    showAllRecords: true,
    fixedRecordHeights: true,
    labelColumnWidth: 40,
    labelColumnAlign: "right",
    showLabelColumn: true,
    labelColumnPosition: "left",
    labelColumnBaseStyle: "labelColumn",
    
    // show cell-level rollover
    showRollOver:true,
    useCellRollOvers:true,
    
    canSelectCells:true,
    
    initWidget : function () {
        this.fields = [];
        var labelCol = {
            width: this.labelColumnWidth,
            name: "label", 
            title: " ",
            cellAlign: "right",
            formatCellValue : function (value, record, rowNum, colNum, grid) {
                var ampm = (rowNum > 23 ? " PM" : " AM"); 
                if (rowNum % 2 == 0) {
                    if (rowNum == 0 || rowNum == 48) return "12 " + ampm;
                    else if (rowNum > 24) return ((rowNum / 2) - 12) + ampm; 
                    else return (rowNum / 2) + ampm;
                }
                else {
                    return "";
                }
            }
        }
        if (this.showLabelColumn && this.labelColumnPosition == "left") {
            this.fields.add(labelCol);
        }

        this.fields.add({name: "day1", align: "center"});
        if (this._isWeek) {
            var numDays = 8; 
            for (var i = 2; i < numDays; i++) {
                this.fields.add({name: "day" + i, align: "center" } );   
            }
            this.showHeader = true;
        }
        // hide weekends 
        if (this._isWeek && !this.creator.showWeekends) {
            
            var start = this.showLabelColumn && this.labelColumnPosition == "left" ? 1 : 0;
            
            var weekendDays = Date.getWeekendDays();
            for (var i = start; i < this.fields.length; i++) {
                
                var adjDay = ((i - start) + this.creator.firstDayOfWeek) % 7;
                //isc.logWarn('here:' + [i, adjDay]);
                if (weekendDays.contains(adjDay)) {
                    this.fields[i].showIf = "return false;";
                }
            }
            
            /*
            for (var i = 0; i < weekendDays.length; i++) {
                this.fields[((weekendDays[i] + this.creator.firstDayOfWeek) % 7) + start].showIf 
                    = "return false;";      
            } 
            */
        }
        if (this.showLabelColumn && this.labelColumnPosition == "right") {
            this.fields.add(labelCol);
        }
        this.data = isc.DaySchedule._eventScaffolding;
        this.Super("initWidget");
        
    },
    
    draw : function (a, b, c, d) {
        this.invokeSuper(isc.DaySchedule, "draw", a, b, c, d);
         
        this.logDebug('draw', 'calendar');
        // call refreshEvents() whenever we're drawn
        // see commment above dataChanged for the logic behind this
        
        this.refreshEvents();
        
        // set the snapGap after were drawn, so that we can pick up a dynamic row height.
        // this is mostly so that scrollToWorkday code works properly.
        this.setSnapGap();
        // if scrollToWorkday is set, do that here
        if (this.creator.scrollToWorkday) this.scrollToWorkdayStart();
    },
    
    setSnapGap : function () {
        // get percentage of snapGap in relation to 30 minutes, the length in minutes of a row, and 
        // multiply by row height to get pixels
        var snapGap = this.creator.eventSnapGap;
        this.body.snapVGap = Math.round((snapGap / 30) * this.body.getRowSize(0));
        this.body.snapHGap = null;
    },
    
    // To be used with calendar.scrollToWorkday 
    scrollToWorkdayStart : function () {
        var sDate = isc.Time.parseInput(this.creator.workdayStart);
        var sRow = sDate.getUTCHours() * 2;
        if (sDate.getUTCMinutes() > 0) sRow++;
       
        var sRowTop = this.getRowHeight(null, 0) * sRow;
        //this.scrollRecordIntoView(sRow, false);
        this.body.scrollTo(0, sRowTop);
    },
    
    getRowHeight : function (record, rowNum) {
        // when scrollToWorkday is true, rows should be sized so that the entire workday fits
        // inside of the viewport
        if (this.creator.scrollToWorkday) {
            var workdayLen = isc.Time.parseInput(this.creator.workdayEnd).getUTCHours() 
                - isc.Time.parseInput(this.creator.workdayStart).getUTCHours();
            // if workdayStart > workdayEnd, just return default cellHeight
            if (workdayLen <= 0) return this.cellHeight;
            var rHeight = Math.floor(this.body.getViewportHeight() / (workdayLen * 2));
            return rHeight < this.cellHeight ? this.cellHeight : rHeight;
        } else { 
            return this.cellHeight;
        }
    },
    
    getDayFromCol : function (colNum) {
        var dayNum = this.fields.get(colNum)._dayNum;
        return dayNum;
       
    },
    
    getDateFromCol : function (colNum) {
        var fld = this.fields.get(colNum);
        var newDate = new Date(fld._yearNum, fld._monthNum, fld._dateNum);
        return newDate;
    },
    
    isLabelCol : function (colNum) {
        if (colNum == 0 && this.showLabelColumn && this.labelColumnPosition == "left") {
            return true;
        } else if (colNum == this.fields.length - 1 && this.showLabelColumn && 
            this.labelColumnPosition == "right") {
             return true;
        } else {
            return false;   
        }
    },
    
    // helper function for detecting when a weekend is clicked, and weekends are disabled
    colDisabled : function (colNum) {
        var dayNum = this._isWeek ? this.getDayFromCol(colNum) : this.creator.chosenDate.getDay();
        //isc.logWarn('colDisabled:' + [colNum, dayNum]);
        if (this.creator.disableWeekends 
            && Date.getWeekendDays().contains(dayNum)) {
            return true;        
        } else {
            return false;   
        }
    },
    
    // helper function to refresh dayView cell styles for weekend disabling
    refreshStyle : function () {
        if (!this.body) return;
        for (var i = 0; i < this.data.length; i++) {
            this.body.refreshCellStyle(i, 1);    
        }
    },
    
    // use the chosen week start to figure out the base date, then add the headerFieldNum
    // to that to get the appropriate date. Use dateChooser.dateClick() to simplify code.
    headerClick : function (headerFieldNum, header) {
        if (this.isLabelCol(headerFieldNum)) return true;
        
        var fld = this.getField(headerFieldNum);
        var cal = this.creator;
        cal.dateChooser.dateClick(fld._yearNum, fld._monthNum, fld._dateNum);
        cal.selectTab(0);
        return true;
    },
    
    
    getCellAlign : function (record, rowNum, colNum) {
       return this.labelColumnAlign;
    },
    
    cellMouseDown : function (record, rowNum, colNum) {
        if (this.isLabelCol(colNum) || this.colDisabled(colNum)) return true; 
        // don't set up selection tracking if canCreateEvents is disabled
        if (!this.creator.canCreateEvents) return true;
        // first clear any previous selection   
        this.clearSelection();
        this._selectionTracker = {};
        this._selectionTracker.colNum = colNum;
        this._selectionTracker.startRowNum = rowNum;
        this._selectionTracker.endRowNum = rowNum;
        this._mouseDown = true;
        this.refreshCellStyle(rowNum, colNum);
    },
    
    cellOver : function (record, rowNum, colNum) {
        if (this._mouseDown && this._selectionTracker) {
            var refreshRowNum;
            // selecting southbound
            if (this._selectionTracker.startRowNum < this._selectionTracker.endRowNum) {
                // should select this cell
                if (rowNum > this._selectionTracker.endRowNum) {
                    refreshRowNum = rowNum;             
                } else { // should deselect the previous end row number
                    refreshRowNum = this._selectionTracker.endRowNum;
                }
                // trigger cell style update from getCellStyle
                this._selectionTracker.endRowNum = rowNum;
            // selecting northbound
            } else {
                // should select this cell
                if (rowNum < this._selectionTracker.endRowNum) {
                    refreshRowNum = rowNum;    
                } else { // should deselect the previous end row number
                    refreshRowNum = this._selectionTracker.endRowNum;
                }
                this._selectionTracker.endRowNum = rowNum;
            }
            var refreshGap = 6;
            var colNum = this._selectionTracker.colNum;
            for (var i = refreshRowNum - refreshGap; i < refreshRowNum + refreshGap; i++) {
                // 48 1/2 hours in a day, don't refresh non-existent cells
                if (i >= 0 && i <= 47) this.refreshCellStyle(i, colNum);        
            }                 
        }
    },
    
    cellMouseUp : function (record, rowNum, colNum) {
        if (!this._selectionTracker) return true;
        
        this._mouseDown = false;
        var sRow, eRow, diff;
        // cells selected upwards
        if (this._selectionTracker.startRowNum > this._selectionTracker.endRowNum) {
            sRow = this._selectionTracker.endRowNum;
            eRow = this._selectionTracker.startRowNum;
        // cells selected downwards
        } else {
            eRow = this._selectionTracker.endRowNum;
            sRow = this._selectionTracker.startRowNum;
        }
        diff = eRow - sRow + 1;
        this.creator._showEventDialog(sRow, this._selectionTracker.colNum, diff);
    },
    
    getCellStyle : function (record, rowNum, colNum) {
        var bStyle = this.getBaseStyle(record, rowNum, colNum);
        
        if (this.isLabelCol(colNum)) return bStyle;
        if (this.colDisabled(colNum)) return this.baseStyle + "Disabled";
        if (this._selectionTracker && this._selectionTracker.colNum == colNum) {
            var sRow = this._selectionTracker.startRowNum,
                eRow = this._selectionTracker.endRowNum;
            // if rowNum is within start and end of selection, return selected style
            if (rowNum >= sRow && rowNum <= eRow || rowNum >= eRow && rowNum <= sRow) {
                return this.creator.selectedCellStyle;    
            } else {
                return bStyle;
            }
        } else {
            
            return bStyle;
        }
    },
    
    getBaseStyle : function (record, rowNum, colNum) {
        if (this.isLabelCol(colNum)) return this.labelColumnBaseStyle;
        
        var dayNum = this._isWeek ? this.getDayFromCol(colNum) : this.creator.chosenDate.getDay();
        
        // workdayStart/end need to be based on current date and not just parsed workdayStart.
        // this fixes an issue where parsed date could have the wrong day.
        var wStart = this._isWeek ? this.getDateFromCol(colNum) : this.creator.chosenDate.duplicate(),//isc.Time.parseInput(this.creator.workdayStart),
            wEnd = wStart.duplicate(),//isc.Time.parseInput(this.creator.workdayEnd),
            currRowTime = wStart.duplicate(),
            // TODO consider moving this into initWidget() to not parse the date for every cell
            parsedStart = isc.Time.parseInput(this.creator.workdayStart),
            parsedEnd = isc.Time.parseInput(this.creator.workdayEnd);
        // need to set hours and minutes of start and end to the same as workdayStart and 
        // workdayEnd
        wStart.setHours(parsedStart.getHours());
        wStart.setMinutes(parsedStart.getMinutes());
        wEnd.setHours(parsedEnd.getHours());
        wEnd.setMinutes(parsedEnd.getMinutes());
        // setUTCHours() and setUTCMinutes were causing problems, so use setHours/Minutes instead
        currRowTime.setHours(Math.floor(rowNum / 2));
        if (rowNum % 2 == 1) currRowTime.setMinutes(30);
        else currRowTime.setMinutes(0);
        
        var dayIsWorkday = this.creator.dateIsWorkday(currRowTime);
        currRowTime = currRowTime.getTime();
        if (this.creator.showWorkday && wStart.getTime() <= currRowTime && currRowTime < wEnd.getTime() 
            && dayIsWorkday) {
            
            return this.creator.workdayBaseStyle;        
        } else {
            return this.baseStyle;    
        }
    },
    
    clearSelection : function () {
        if (this._selectionTracker) {
            var sRow, eRow, colNum = this._selectionTracker.colNum;
            // establish order of cell refresh
            if (this._selectionTracker.startRowNum < this._selectionTracker.endRowNum) {
                sRow = this._selectionTracker.startRowNum;
                eRow = this._selectionTracker.endRowNum;
            } else {
                sRow = this._selectionTracker.endRowNum;
                eRow = this._selectionTracker.startRowNum;
            }
            // remove selection tracker so cells get reset to baseStyle
            this._selectionTracker = null;
            for (var i = sRow; i < eRow + 1; i++) {
                this.refreshCellStyle(i, colNum);    
            }
        }
    },

    refreshEvents : function () {
        // bail if the grid hasn't been drawn yet, or hasn't gotten data yet
        if (!this.body || !this.creator.hasData()) return;
      
        this.logDebug('refreshEvents:' + this.viewName, "calendar");
        this.clearEvents();
        var startDate, endDate, cal = this.creator;
        if (this._isWeek) {
            startDate = cal.chosenWeekStart;
            endDate = cal.chosenWeekEnd;
        } else {
            startDate = new Date(cal.year, cal.month, cal.chosenDate.getDate(),0, 0);
            endDate = new Date(cal.year, cal.month, cal.chosenDate.getDate(),23, 59);
        }

        var events = cal._getEventsInRange(startDate, endDate);

        for (var i = 0; i < events.length; i++) {
            this.addEvent(events[i]);
        }
        

    },
 
    sizeEventWindow : function (eventWin) {
        var cal = this.creator, event = eventWin.event;
         // don't resize when we're dragRepositioned
        
        if (!eventWin._skipResize) {
            if (cal.eventAutoArrange) {
                // resize, move and render all events touching the range of this event
                cal._renderEventRange(eventWin._isWeek, event[cal.startDateField], event[cal.endDateField]);
            } else {
                var grid = (eventWin._isWeek ? cal.weekView : cal.dayView);
                
                var rowSize = grid.getRowHeight(1),
                    colSize = grid.getColumnWidth(grid.isLabelCol(0) ? 1 : 0);
                // catch the case where the end of the event is on 12am, which happens when an
                // event is dragged or resized to the bottom of the screen
                var eHrs = event[cal.endDateField].getHours() == 0 ? 24 
                         : event[cal.endDateField].getHours();
                // if the event ends on the next day, render it as ending on the last hour of the 
                // current day
                var spansDays = false;
                if (event[cal.endDateField].getDate() > event[cal.startDateField].getDate()) {
                    spansDays = true;
                    eHrs = 24;
                }
               
                // each (rowSize * 2) represents one hour, so we're doing (hour diff) * (1 hour height)
                var eHeight = (eHrs - event[cal.startDateField].getHours()) * (rowSize * 2),
                    eWidth = colSize;
                    
                //isc.logWarn('sizeEventWindow:' + [eventWin.ID, eHrs, eHrs - event[cal.startDateField].getHours()]);
                // for border overlap
                if (cal.weekEventBorderOverlap && eventWin._isWeek) eWidth += 1; 
                if (event[cal.startDateField].getMinutes() > 0) {
                    eHeight -= cal._getMinutePixels(event[cal.startDateField].getMinutes(), rowSize);
                }
                if (event[cal.endDateField].getMinutes() > 0 && !spansDays) {
                    eHeight += cal._getMinutePixels(event[cal.endDateField].getMinutes(), rowSize);
                }
               
                var eTop = event[cal.startDateField].getHours() * (rowSize * 2);
               
                if (event[cal.startDateField].getMinutes() > 0) {
                    eTop += cal._getMinutePixels(event[cal.startDateField].getMinutes(), rowSize);
                }
                var eLeft = cal.getEventLeft(event, eventWin._isWeek);
                
                eventWin.renderEvent(eTop, eLeft, eWidth, eHeight)
            }    
        } else {
            eventWin._skipResize = false;
        }
    },
    
    clearEvents : function () {
        if (!this.body || !this.body.children) return;
        var arr = this.body.children;
        for (var i = arr.length - 1; i >= 0 ; i--) {
            if (isc.isAn.EventWindow(arr[i])) this.body.removeChild(arr[i]);
        }
    },
    
    addEvent : function (event) {
        // clear any cell selection that has been made
        this.clearSelection();
        var win = this.creator._getNewEventWindow(event);
        win._parentView = this;
        if (this._isWeek) win._isWeek = true;
        if (this.body) this.body.addChild(win);
        this.sizeEventWindow(win);
        //win.sizeToEvent();
    },
    
    removeEvent : function (event) {
        var arr = this.body.children;
        for (var i = 0; i < arr.length ; i++) {
            if (isc.isAn.EventWindow(arr[i]) && arr[i].event === event) {
                var win = arr[i];
                win.parentElement.removeChild(win);
                win.destroy();
                return true;
            }
        }
        return false;
    },
    
    // DaySchedule updateEventWindow
    updateEventWindow : function (event) {
        if (!this.body || !this.body.children) return;
        var arr = this.body.children, cal = this.creator;
        if (cal.dataSource) cal._pks = cal.getDataSource().getLocalPrimaryKeyFields();
        for (var i = 0; i < arr.length ; i++) {
            if (isc.isAn.EventWindow(arr[i]) && this.areSame(arr[i].event, event)) {
                // reassign event for databound update, because databound update creates
                // a new object
                arr[i].event = event;
                this.sizeEventWindow(arr[i]);
                //arr[i].sizeToEvent();
                arr[i].setDescriptionText(event[cal.descriptionField]);
                return true;
            }
        }
        return false;
    },
    
    areSame : function (first, second) {
        var cal = this.creator;
        if (cal.dataSource) {
            var pks = cal._pks, areEqual = true;
            for (var pkName in pks) {
                if (first[pkName]!= second[pkName]) {
                    areEqual = false;
                    break;
                }
            }
            return areEqual;
        } else {
            return (first === second);    
        }
    }
   
});

// WeekSchedule
// --------------------------------------------------------------------------------------------
isc.ClassFactory.defineClass("WeekSchedule", "DaySchedule");


// MonthSchedule
// --------------------------------------------------------------------------------------------
isc.ClassFactory.defineClass("MonthSchedule", "ListGrid");

// Create a separate subclass for month schedule body

isc.ClassFactory.defineClass("MonthScheduleBody", "GridBody");

isc.MonthSchedule.changeDefaults("headerButtonProperties", {
    showRollOver: false, 
    showDown: false, 
    cursor: "default"  
});

isc.MonthSchedule.changeDefaults("bodyProperties", {
    redrawOnResize:true
});

isc.MonthSchedule.addProperties({
    autoDraw: false,
    leaveScrollbarGap: false,

    showAllRecords: true,
    fixedRecordHeights: true,

    // show header but disable all header interactivity
    showHeader: true,
    showHeaderContextMenu: false,
    canSort: false,
    canResizeFields: false,
    canReorderFields: false,

    canHover: true,
    showHover: true,
    hoverWrap: false,
    // show cell-level rollover
    showRollOver:true,
    useCellRollOvers:true,

    // set up cell-level drag selection
    //canDrag:true,
    // dragAppearance:"none",
    //canDragSelect:true,
    canSelectCells:true,
    
    firstDayOfWeek: 0,
    dayHeaderHeight: 20,
    mimimumDayHeight: 80,
    
    initWidget : function () {
        // create month UI scaffolding
        if (this.creator.data) this.data = this.getDayArray();
        this.fields = [
            {name: "day1", align: "center"},
            {name: "day2", align: "center"},
            {name: "day3", align: "center"},
            {name: "day4", align: "center"},
            {name: "day5", align: "center"},
            {name: "day6", align: "center"},
            {name: "day7", align: "center"}
        ];
        // set day titles
        this.firstDayOfWeek = this.creator.firstDayOfWeek;
        var sdNames = Date.getShortDayNames();
        var weekendDays = Date.getWeekendDays();
        for (var i = 0; i < 7; i++) {
            var dayNum = (i + this.firstDayOfWeek) % 7;
            this.fields[i].title = sdNames[dayNum];
            this.fields[i]._dayNum = dayNum;
            // store day index to easily get to the right day properties stored on the month
            // records from methods like formatCellValue
            this.fields[i]._dayIndex = i + 1;
            // hide weekends 
            if (!this.creator.showWeekends && weekendDays.contains(dayNum)) {
                this.fields[i].showIf = "return false;";  
            }
            
        }
       
        this.Super("initWidget");
    },
    
    getDayArray : function () {
        var dayArr = [], eventArr, endDate,
            displayDate = new Date(this.creator.year, this.creator.month, 1);
        
        // go back to the first day of the week
        while (displayDate.getDay() != this.creator.firstDayOfWeek) {
            displayDate.setDate(displayDate.getDate() - 1);    
        }
        
        // special case when hiding weekends, can have the first row be entirely from the previous
        // month. In this case, hide the first row by adding 7 days back to the displayDate
         if (!this.creator.showWeekends) {
            var wEnds = Date.getWeekendDays();
            var checkDate = displayDate.duplicate();
            var hideFirstRow = true;
            for (var i = 0; i < 7 - wEnds.length; i++) {
                if (checkDate.getMonth() == this.creator.month) {
                    hideFirstRow = false;
                    break;
                }
                checkDate.setDate(checkDate.getDate() + 1);
            }
            if (hideFirstRow) displayDate.setDate(displayDate.getDate() + 7); 
           
        }
        
        // 40 days from start date seems like a nice round number for getting 
        // all the relevant events in a month, with extra days for adjacent months
        endDate = new Date(this.creator.year, this.creator.month, 
            displayDate.getDate() + 40);
        eventArr = this.creator._getEventsInRange(displayDate, endDate);
        // sort events by date
        eventArr.sortByProperty("name", true, 
            function (item, propertyName, context) {
                return item[context.startDateField].getTime();
            }, this.creator);
        this._eventIndex = 0;
        for (var i=0; i<6; i++) { // the most we need to iterate is 6, sometimes less
            // add rows of data to designate days and day headers. Each row is either a header
            // or a day body.
            if (this.creator.showDayHeaders) dayArr.add(this.getHeaderRowObject(displayDate));
            dayArr.add(this.getEventRowObject(displayDate, eventArr));
            displayDate.setDate(displayDate.getDate() + 7);
            // if we hit the next month, don't keep adding rows, we're done.
            if (displayDate.getMonth() != this.creator.month) break;
        }
        return dayArr;
    },
    
    getHeaderRowObject : function (theDate) {
        var obj = {};
        var nDate = theDate.duplicate();
        for (var i=0; i<7; i++) {
            obj["day" + (i + 1)] = nDate.getDate();
            // store the complete date
            obj["date" + (i + 1)] = nDate.duplicate();
            nDate.setDate(nDate.getDate() + 1);
        }
        return obj;
    },
    
    getEventRowObject : function (theDate, events) {
        var obj = {};
        var nDate = new Date(theDate.getFullYear(), theDate.getMonth(), theDate.getDate());
        for (var i=0; i<7; i++) {
            var evArr = [];
            while (this._eventIndex < events.length) {
                var evnt = events[this._eventIndex];
                if (evnt[this.creator.startDateField].getMonth() != nDate.getMonth() 
                    || evnt[this.creator.startDateField].getDate() != nDate.getDate()) {
                    break;    
                } else {
                    evArr.add(evnt);
                    this._eventIndex += 1;
                }
                
            }
            // store the day number here too
            obj["day" + (i + 1)] = nDate.getDate();
            // store the complete date
            obj["date" + (i + 1)] = new Date(nDate.getFullYear(), nDate.getMonth(), nDate.getDate());
            // store the events
            obj["event" + (i + 1)] = evArr;
            nDate.setDate(nDate.getDate() + 1);
        }
        return obj;
    },
    
    // utility method used for retrieving events from a given row and column number.
    // used by calendar.monthViewEventCick
    getEvents : function (rowNum, colNum) {
        var day = this.getDayFromCol(colNum);
        var dayIndex = this.fields.get(colNum)._dayIndex
        var events = this.data[rowNum]["event" + dayIndex];
        return events;
    },
    
    getEventCell : function (event) {
        var data = this.data;
        for (var colNum = 0; colNum < this.fields.length; colNum++) {
            var dayIndex = this.fields[colNum]._dayIndex,
                eventTitle = "event" + dayIndex;
            for (var rowNum = 0; rowNum < data.length; rowNum++) {
                var events = data.get(rowNum)[eventTitle];
                if (events != null && events.contains(event)) {
                    return [rowNum,colNum];
                }
            }
        }
    },
    
    getDayFromCol : function (colNum) {
        var dayNum = this.fields.get(colNum)._dayNum;
        return dayNum;
        
    },
    
    // helper function for detecting when a weekend is clicked, and weekends are disabled
    colDisabled : function (colNum) {
        if (this.creator.disableWeekends 
            && Date.getWeekendDays().contains(this.getDayFromCol(colNum))) {
            return true;        
        } else {
            return false;   
        }
    },
    
    refreshEvents : function () {
        // bail if no data yet
        if (!this.creator.hasData()) return;
        this.logDebug('refreshEvents: month', 'calendar');
        this.setData(this.getDayArray());    
    },
    
    rowIsHeader : function (rowNum) {
        var cal = this.creator;
        if (!cal.showDayHeaders || (cal.showDayHeaders && rowNum % 2 == 1)) return false;
        else return true;
    },
    
    formatCellValue : function (value, record, rowNum, colNum) {
        var cal = this.creator,
            fieldIndex = this.fields.get(colNum)._dayIndex,
            evtArr = record["event" + fieldIndex],
            currDate = record["date" + fieldIndex],
            isOtherDay = currDate.getMonth() != cal.chosenDate.getMonth();
       
        if (this.rowIsHeader(rowNum)) {
            if (!cal.showOtherDays && isOtherDay) {
                return "";  
            } else {
                //isc.logWarn('here:' + [value, currDate.getDate(), rowNum, colNum]);
  
                return cal.getDayHeaderHTML(currDate, evtArr, cal, rowNum, colNum); 
            }
        } else {
            if (!cal.showOtherDays && isOtherDay) {
                return "";  
            } else {
                return cal.getDayBodyHTML(currDate, evtArr, cal, rowNum, colNum); 
            }
        }
    },
    
    getRowHeight : function (record, rowNum) {
        var dayHeaders = this.creator.showDayHeaders;
        if (this.rowIsHeader(rowNum)) { // header part
            return this.dayHeaderHeight;
        } else { // event part, should use fixedRecordHeights:false
            var rows = dayHeaders ? this.data.length / 2 : this.data.length,
                viewHeight = dayHeaders ? this.body.getViewportHeight() 
                    - (this.dayHeaderHeight * rows) : this.body.getViewportHeight(),
                minHeight = dayHeaders ? this.mimimumDayHeight - this.dayHeaderHeight : 
                    this.minimumDayHeight;
            
            if (viewHeight / rows <= minHeight) { 
                return minHeight;
            } else {   
                // calculate the remainder and add 1 to the current row height if need be.
                // this eliminates a gap at the bottom of the month view
                var remainder = viewHeight % rows,
                    offset = 0,
                    currRow = dayHeaders ? (rowNum - 1) / 2 : rowNum
                ;
                if (currRow < remainder) offset = 1; 
                return (Math.floor(viewHeight / rows) + offset);   
            } 
        }
    },
    
    getCellAlign : function (record, rowNum, colNum) {
        if (this.rowIsHeader(rowNum)) return "right"
        else return "left";
    },
    
    getCellVAlign : function (record, rowNum, colNum) {
        if (!this.rowIsHeader(rowNum)) return "top";
        else return "center"
        
    },
    
    cellHoverHTML : function (record, rowNum, colNum) {
        var fieldIndex = this.fields.get(colNum)._dayIndex;
        if (!this.rowIsHeader(rowNum) && record["event" + fieldIndex] != null) {
            var evtArr = record["event" + fieldIndex];
            var retVal = "";
            for (var i = 0; i < evtArr.length; i++) {
                var eTime = evtArr[i][this.creator.startDateField].getHours();
                eTime = this.creator._to12HrNotation(eTime) + (eTime > 11 ? "P " : " "); 
                retVal += eTime + evtArr[i][this.creator.nameField] + "<br/>";
            }
          
            return retVal;
        }
    },
    
    getBaseStyle : function (record, rowNum, colNum) {
        var cal = this.creator, fieldIndex = this.fields.get(colNum)._dayIndex;
        
        if (this.rowIsHeader(rowNum)) { // header
            if ((rowNum == 0 && record["day" + fieldIndex] > 7)
                || (rowNum == this.data.length - 2 && record["day" + fieldIndex] < 7)) {
                if (!cal.showOtherDays) return cal.otherDayBlankStyle;
                else return cal.otherDayHeaderBaseStyle;
            } else return cal.dayHeaderBaseStyle;
        } else { // body
            var dis = this.colDisabled(colNum), 
                startRow = cal.showDayHeaders ? 1 : 0, endRow = this.data.length - 1;
                
            if ((rowNum == startRow && this.data[startRow]["day" + fieldIndex] > 7)
                || (rowNum == endRow && this.data[endRow]["day" + fieldIndex] < 7)) {
                if (!cal.showOtherDays) return cal.otherDayBlankStyle;
                else return dis ? cal.otherDayBodyBaseStyle + "Disabled" : cal.otherDayBodyBaseStyle;
            } else return dis ? cal.dayBodyBaseStyle + "Disabled" : cal.dayBodyBaseStyle;      
        }
    },
    
    // monthView cellClick
    // if a header is clicked, go to that day. Otherwise, open the event dialog for that day.    
    cellClick : function (record, rowNum, colNum) {
        var cal = this.creator, year, month, fieldIndex = this.fields.get(colNum)._dayIndex,
            currDate = record["date" + fieldIndex],
            evtArr = record["event" + fieldIndex],
            isOtherDay = cal.chosenDate.getMonth() != currDate.getMonth(),
            doDefault = false;
        if (this.rowIsHeader(rowNum)) { // header clicked
            if (!(!this.creator.showOtherDays && isOtherDay)) {
                doDefault = cal.dayHeaderClick(currDate, evtArr, cal, rowNum, colNum);        
            }
            if (doDefault) {
                // previous month day clicked
                if (rowNum == 0 && record["day" + fieldIndex] > 7) {
                    // check for previous year boundaries
                    if (cal.month == 0) {
                        year = cal.year - 1;
                        month = 11;
                    } else {
                        year = cal.year;
                        month = cal.month - 1;
                    }
                } else if (rowNum == this.data.length - 2 && record["day" + fieldIndex] < 7) {
                    // check for next year boundaries
                    if (cal.month == 11) {
                        year = cal.year + 1;
                        month = 0;
                    } else {
                        year = cal.year;
                        month = cal.month + 1;
                    }
                } else {
                    year = cal.year;
                    month = cal.month;
                }
                
                cal.dateChooser.dateClick(year, month, record["day" + fieldIndex]);
                cal.selectTab(0);
            }
        } else { // day body clicked 
            if (!this.colDisabled(colNum) && !(!cal.showOtherDays && isOtherDay)) {   
                 doDefault = cal.dayBodyClick(currDate, evtArr, cal, rowNum, colNum);
                 if (doDefault && cal.canCreateEvents) {
                     cal._showEventDialog(rowNum, colNum);
                 }     
            }
           
        }
    }
    
    
    
    
});

// EventWindow
//---------------------------------------------------------------------------------------------
//> @class EventWindow
// Subclass of Window used to display events within a +link{Calendar}.  Customize via
// +link{calendar.eventWindow}.
//
// @visibility external
//<
isc.ClassFactory.defineClass("EventWindow", "Window");

isc.EventWindow.changeDefaults("resizerDefaults", {
    overflow:"hidden", height: 3,
    snapTo: "B", 
    canDragResize:true//, getEventEdge:function () {return "B"} 
})

isc.EventWindow.changeDefaults("headerDefaults", {
    layoutMargin:0, layoutLeftMargin:3, layoutRightMargin:3
})

isc.EventWindow.addProperties({
    autoDraw: false,
    minHeight: 5,
    // for timelineEvents, so they can be resized to be very small
    minWidth: 5, 
    showHover: true, 
    canHover: true,
    hoverWidth: 200,
    
    showHeaderIcon: false,
    showMinimizeButton: false,
    showMaximimumButton: false,
    canDragResize: true,
    canDragReposition: true,
    resizeFrom: ["B"],
    showShadow: false,
    showEdges: false,
    showHeaderBackground: false,
    useBackMask: false,
    keepInParentRect: true,
    headerProperties: {height:14},
    
    closeButtonProperties: {height: 10, width: 10},
    bodyColor: null,
    
    showFooter: true,
    
    //showBody:false,
    //showTitle:false,
    
    footerProperties: {overflow:"hidden", defaultLayoutAlign:"center", height: 7},
    bodyConstructor: isc.HTMLFlow,
    
    initWidget : function () {
        this.bodyStyle = this.baseStyle + "Body";
        this.headerStyle = this.baseStyle + "Header";
        if (this.calendar.showDescription != false) {
            this.bodyProperties = {contents: this.descriptionText, valign:"top", 
            overflow: "hidden"};
        }
        if (this.calendar.showEventBody == false) {
            this.showBody = false;
            // need to set showTitle to false so that drag reposition works
            this.showTitle = false;
        }
        this.headerLabelProperties = {styleName: this.className + "Header"};
        
        this.Super("initWidget", arguments);
        
    },
    
    makeFooter : function () {
        // if not showing a footer, bail
        if (!this.showFooter || this.canDragResize == false) return;
        
        var rsizer = this.createAutoChild("resizer", {
            dragTarget:this,
            styleName: this.baseStyle + "Resizer"
        });
        this.addChild(rsizer);
        
        // needs to be above the statusBar
        if (this.resizer) this.resizer.bringToFront();
    },
    
    setDescriptionText : function (descriptionText) {
        if (this.calendar.getDescriptionText) {
            descriptionText = this.calendar.getDescriptionText(this.event);
        } 
        if (descriptionText) {
            if (this.body) {
                this.descriptionText = descriptionText;
                this.body.setContents(descriptionText);
            } else {
                this.descriptionText = descriptionText;
                if (this._eventLabel) {
                    
                    this._eventLabel.setWidth("100%");
                    this._eventLabel.setContents(descriptionText);    
                }
               
            }
        }
    },
    
    click : function () {
        if (this._closed) return;
        if (this._hitCloseButton) {
            // one-time flag set when the close button is clicked but eventRemoveClick() has
            // been implemented and cancels the removal.
            this._hitCloseButton = null;
            return;
        }
        var cal = this.calendar;
        var doDefault = cal.eventClick(this.event, this._isWeek ? "week" : "day");
        if (doDefault) {
            if (!cal.canEditEvent(this.event)) return;
            // handle the case when a selection is made, then an event is clicked
            if (this._isWeek) cal.weekView.clearSelection();
            else cal.dayView.clearSelection();
            var offset = cal.weekView.isLabelCol(0) ? 1 : 0;
            var col = this._isWeek ? this.event[cal.startDateField].getDay() - 
                cal.firstDayOfWeek + offset : offset;
            // account for no weekends shown
            if (this._isWeek && cal.showWeekends == false) col--;
            var row =  this.event[cal.startDateField].getHours() * 2;
            cal._showEventDialog(row, col, null, this);
        }
    },
   
    mouseDown : function () {
        this.calendar.eventDialog.hide();
        return isc.EH.STOP_BUBBLING;
    },
    
    renderEvent : function (eTop, eLeft, eWidth, eHeight) {
        var cal = this.calendar, event = this.event;

        if (isc.isA.Number(eWidth) && isc.isA.Number(eHeight)) {
            this.resizeTo(Math.round(eWidth), Math.round(eHeight));
        }
        if (isc.isA.Number(eTop) && isc.isA.Number(eLeft)) {
            this.moveTo(Math.round(eLeft), Math.round(eTop));
        }
        var sHrs = event[cal.startDateField].getHours();
        var sMins = event[cal.startDateField].getMinutes();
        var eTitle = cal._to12HrNotation(sHrs) + (sMins < 10 ? ":0" + sMins : ":" + sMins)
                + (sHrs > 11 ? "PM" : "AM") + " " + event[cal.nameField];  

        this.setTitle(eTitle);
        this.bringToFront();
    },
    
    getHoverHTML : function () {
        return this.calendar.getEventHoverHTML(this.event, this);
    },
    
    closeClick : function () {
        var cal = this.calendar;
        if (cal.eventRemoveClick(this.event) == false) {
            // one-time flag to avoid general click() handler firing and triggering event
            // editing
            this._hitCloseButton = true; 
            return;
        }
        this.Super("closeClick", arguments);
        this.calendar.removeEvent(this.event, true);
        this._closed = true;         
    },
 
    parentResized : function () {
        this.Super('parentResized', arguments);
        
        this._parentView.sizeEventWindow(this);
        //this.sizeToEvent();
    },
    
    // get event length in minutes
    getEventLength : function (startDate, endDate) {
        var start = startDate || this.event[this.calendar.startDateField];
        var end = endDate || this.event[this.calendar.endDateField];
        
        var minDiff = (end.getTime() - start.getTime()) / (1000 * 60);
        return minDiff;
        /*
        var tot = ((end.getHours() != 0 ? end.getHours() : 24) - start.getHours()) * 60;
        isc.logWarn("getEventLength:" + end  );
        tot = tot - start.getMinutes() + end.getMinutes();
        
        return tot;
        */
    },
    
    dragRepositionStart : function () {
        // for drag repositioning, calculate the offset (vsnaporigin) by calculating how much is left
        // over when you divide the events top y coordinate by the snapVGap. This is added 
        // to the y coordinate calculated in GR.getVSnapPosition 
        var snapOrigin = this.getTop() % this.parentElement.snapVGap;
        this.parentElement.VSnapOrigin = snapOrigin;
    },
    
    
    dragRepositionStop : function () {
        var cal = this.calendar;

        // store these so we can auto-arrange both source and target locations after the move
        var sStartDate = this.event[cal.startDateField],
            sEndDate = this.event[cal.endDateField];
        
        this.Super('dragRepositionStop', arguments);
        var EH = this.ns.EH,
            colNum = this.parentElement.getEventColumn(),
            dragTop = (EH.dragMoveTarget.getTop() - this.parentElement.getPageTop()) 
                + this.parentElement.getScrollTop(),
            rowHeight = this.parentElement.getRowSize(1),
            
            rowNum = Math.floor(dragTop / rowHeight), //this.parentElement.getEventRow(),
            grid = (this._isWeek ? cal.weekView : cal.dayView);
        
        if (grid.isLabelCol(colNum) || grid.colDisabled(colNum)) return false;
        
        var sDate = cal._getDateFromPoint(rowNum, colNum);
        // for cases where the event is dropped between row bounds, get the minutes we need
        // to add to the drop start time. The formula for these minutes:
        // drop position pixels from drop row top * minutes per pixel
        var leftOverMins = Math.floor((dragTop - (rowHeight * rowNum)) * (30 / rowHeight));        
        sDate.setMinutes(sDate.getMinutes() + leftOverMins);
        // bulletproof the startDate by calling getValidSnapDate(), which ensures that the start
        // date will be an exact multiple of the eventSnapGap
        sDate = cal.getValidSnapDate(this.event[cal.startDateField], sDate);

        if (!cal.eventMoved(sDate, this.event)) return false;

        var eDate = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), sDate.getHours(), sDate.getMinutes());
        eDate.setMinutes(eDate.getMinutes() + this.getEventLength());
        
        
        //this._skipResize = true;
        cal.updateEvent(this.event, sDate, eDate, this.event[cal.nameField], 
            this.event[cal.descriptionField], null, true);

        if (cal.eventAutoArrange) {
            // resize, move and render all events touching the START range of this drag-operation
            cal._renderEventRange(this._isWeek, sStartDate, sEndDate);
            // shift the dragMoveTarget prior to it being redrawn (for eventAutoArrange)
            EH.dragMoveTarget.setPageRect(this.getPageLeft(), this.getPageTop());
        }

        return true;
           
    },
    
    dragResizeStart : function () {   
        // for drag resizing, calculate the offset (vsnaporigin) by calculating how much is left
        // over when you divide the events bottom y coordinate by the snapVGap. This is added 
        // to the y coordinate calculated in GR.getVSnapPosition
        var snapOrigin = (this.getTop() + this.getVisibleHeight()) % this.parentElement.snapVGap;
        this.parentElement.VSnapOrigin = snapOrigin; 
       
          
    },
    
    dragResizeStop : function () {
        var cal = this.calendar;

        // store these so we can auto-arrange both source and target locations after the move
        var sStartDate = this.event[cal.startDateField],
            sEndDate = this.event[cal.endDateField];
        
        this.Super('dragResizeStop', arguments);

        var EH = this.ns.EH,
            colNum = this.parentElement.getEventColumn(),
            dragBottom = (EH.dragMoveTarget.getTop() - this.parentElement.getPageTop()) 
                + this.parentElement.getScrollTop() + EH.dragMoveTarget.getVisibleHeight(),
            rowHeight = this.parentElement.getRowSize(1),
            rowNum = Math.floor(dragBottom / rowHeight);

        var eDate = cal._getDateFromPoint(rowNum, colNum);

        // for cases where the event is dropped between row bounds, get the minutes we need
        // to add to the drop start time. The formula for these minutes:
        // drop position pixels from drop row top * minutes per pixel
        var leftOverMins = Math.floor((dragBottom - (rowHeight * rowNum)) * (30 / rowHeight));
        eDate.setMinutes(eDate.getMinutes() + leftOverMins);
        // bulletproof the endDate by calling getValidSnapDate(), which ensures that the end
        // date will be an exact multiple of the eventSnapGap
        eDate = cal.getValidSnapDate(this.event[cal.endDateField], eDate);
        // don't allow smaller than rowHeight events
        if (EH.dragMoveTarget.getVisibleHeight() < rowHeight) return false;
        
        if (!cal.eventResized(eDate, this.event)) return false;
        //this._skipResize = true;
        cal.updateEvent(this.event, this.event[cal.startDateField], eDate,
         this.event[cal.nameField], this.event[cal.descriptionField], null, true);

        if (cal.eventAutoArrange) {
            // resize, move and render all events touching the START range of this drag-operation
            cal._renderEventRange(this._isWeek, sStartDate, sEndDate);
            // shift the dragMoveTarget prior to it being redrawn (for eventAutoArrange)
            EH.dragMoveTarget.setPageRect(this.getPageLeft(), this.getPageTop());
        }

        // let getVSnapOrigin know that dragResize is over
        this._dragResizing = false;
    }
    
             
}); // end eventWindow

// TimelineWindow
isc.ClassFactory.defineClass("TimelineWindow", "EventWindow");

isc.TimelineWindow.addProperties({
        
    showFooter: false,
    // not sure why minimized:true was set, but it was preventing L,R resize handles from 
    // working (as expected), so get rid of it.
    //minimized: true,
    resizeFrom: ["L", "R"],
    
    initWidget : function () {
        if (this.calendar.showEventWindowHeader == false) {
            this.showBody = false;
            // need to set showTitle to false so that drag reposition works
            this.showTitle = false;
            
        }
        //this.showBody = false;
        this.Super("initWidget");    
        
    },
    
    draw : function (a, b, c, d) {
        this.invokeSuper(isc.TimelineWindow, "draw", a, b, c, d);
        if (this.calendar.showEventWindowHeader == false) {
            
             var lbl = isc.Canvas.create({
                    // border: "1px solid red",
                    autoDraw:false,
                    width: "100%",
                    height: 0,
                    top:0,
                    contents: (this.descriptionText ? this.descriptionText : " ")
            });
            this.addMember(lbl);
            lbl.setHeight(0);
            lbl.setTop(0);
            this._eventLabel = lbl;
        }
    },
    
    click : function () {
        var cal = this.calendar;
        var doDefault = cal.eventClick(this.event, this._isWeek ? "week" : "day");
        if (doDefault) {
            if (!cal.canEditEvent(this.event)) return;
            // handle the case when a selection is made, then an event is clicked
            if (this._isWeek) cal.weekView.clearSelection();
            else cal.dayView.clearSelection();
            var offset = cal.weekView.isLabelCol(0) ? 1 : 0;
            var col = this._isWeek ? this.event[cal.startDateField].getDay() - 
                cal.firstDayOfWeek + offset : offset;
            // account for no weekends shown
            if (this._isWeek && cal.showWeekends == false) col--;
            var row =  this.event[cal.startDateField].getHours() * 2;
            cal._showEventDialog(row, col, null, this);
        }
    },
    
    dragRepositionStart : function () {
        this._startRow = this.parentElement.getEventRow();
        this._startCol = this.parentElement.getEventColumn();
        var  vOffset = 0, event = this.event;
        if (event._overlapProps && event._overlapProps.slotNum > 0)  {
            vOffset = (event._overlapProps.slotNum - 1) * this.getVisibleHeight();
        }
        this.parentElement.VSnapOrigin = vOffset;
        // hmmmm shouldn't have to do this, but without this the dragMoveTarget is off.
        // Something elsewhere could be causing that...
        // var offsetAmmount = this.getPageLeft() - this.ns.EH.getX();
        this.parentElement.HSnapOrigin = 0;//offsetAmmount;
        
        this.hideLines();
        return true;    
    },
    /*
    dragRepositionMove : function () {
         isc.logWarn('reposMove:' + this.ns.EH.dragMoveTarget);
        //isc.logWarn("move: " + [this.parentElement.getEventRow(), this._startRow]);
        //if (this.parentElement.getEventRow() != this._startRow) return false;
        //else return true;
    },
    */
    // reposition steps:
    // 1. get start and end date equivalent to dragTracker position
    // 2. call adjustEventDates (if impl) to do any other event adjustments, e.g. make sure
    //    event falls withing a certain range
    // 3. if allowEventOverlap is false, adjust event further to either put event where its 
    //    not overlapping or cancel the drop 
    // 4. call eventMoved as a second override point to potentially cancel the drop. For example,
    //    to make sure that date ranges enforced in adjustEventDates are still enforced after
    //    an event has been changed so that it won't overlap another event.
    dragRepositionStop : function () {
        // need to do this here, else previous setting of HSnapOrigin destroys dragResize
        // correct functionality. (see dragRepositionStart())
        this.parentElement.HSnapOrigin = 0;
        var currRow = this.parentElement.getEventRow(), newType;
       
        if (currRow != this._startRow) {
            if (this.calendar.canEditEventType) {
               var currTypeRec = this.calendar.eventTypeData.get(currRow);
               newType = currTypeRec[this.calendar.eventTypeField];
               
            } else {
                //this.calendar.timelineView.addLeadingAndTrailingLines(this)
                this.showLines();
                return false;
            }
        }
        
        var cal = this.calendar, event = this.event;
        cal = this.calendar, event = this.event;
        var dates = [ event[cal.startDateField].duplicate(), event[cal.endDateField].duplicate()];
        if (event[cal.leadingDateField] && event[cal.trailingDateField]) {
            dates.add(event[cal.leadingDateField].duplicate());
            dates.add(event[cal.trailingDateField].duplicate());
        }
        
        // step 1 find initial drop dates
        // augment (or decrement if diff is negative) each date by the difference between the drag
        // start date and the drag end date
        var EH = this.ns.EH;
        // convert dragLeft into local coords by calculating an offset based on eventWindow
        // pageLeft - left.
        var leftOffset = this.getPageLeft() - this.getLeft();
        var dragLeft = EH.dragMoveTarget.getLeft() - leftOffset;
        // convert dragTracker left to a date
        var sDate = cal.timelineView.getDateFromPoint(dragLeft);
        var eDate = sDate.duplicate();
        // get enddate
        eDate.setMinutes(eDate.getMinutes() + this.getEventLength());
        dates[0] = sDate;
        dates[1] = eDate;
        // minsDiff = difference in minutes between new start date and old start date
        var minsDiff = Math.floor((sDate.getTime() - event[cal.startDateField].getTime()) / (1000 * 60));
        // adjust leading and trailing dates by minsDiff amount of minutes. 
        // if event dragged behind itself, minsDiff will be negative.
        if (event[cal.leadingDateField]) dates[2].setMinutes(dates[2].getMinutes() + minsDiff);
        if (event[cal.trailingDateField]) dates[3].setMinutes(dates[3].getMinutes() + minsDiff);
        
        var otherFields = {}
        if (newType) otherFields[cal.eventTypeField] = newType;
        if (event[cal.leadingDateField] && event[cal.trailingDateField]) {
            otherFields[cal.leadingDateField] = dates[2];
            otherFields[cal.trailingDateField] = dates[3];
        }
        if (newType == null) newType = event[cal.eventTypeField];
        // step 2 adjust initial drop dates, via overridden method 
        if (cal.adjustEventTimes) {
            var adjustedTimes = cal.adjustEventTimes(event, this, dates[0], dates[1], newType);
            if (adjustedTimes) {
                dates[0] = adjustedTimes[0].duplicate();
                dates[1] = adjustedTimes[1].duplicate();
            }
        }
        // step 3 adjust modified drop dates so no overlapping occurs
        if (cal.allowEventOverlap == false) {
            var repositionedDates = this.checkForOverlap(event, dates[0], dates[1], newType); 
            if (repositionedDates == true) {
                // event overlaps in such a way that dropping anywhere near this location would
                // be impossible
                if (cal.timelineEventOverlap) {
                    cal.timelineEventOverlap(false, event, this, dates[0], dates[1], newType);
                }
                return false;   
            } else if (isc.isAn.Array(repositionedDates)){
               dates[0] = repositionedDates[0].duplicate();
               dates[1] = repositionedDates[1].duplicate();
               if (cal.timelineEventOverlap) { 
                   cal.timelineEventOverlap(true, event, this, dates[0], dates[1], newType);
               }
               
            }
            // otherwise don't do anything, as no overlap occurred
        }
        // step 4 fire eventMoved notification to allow drop cancellation
        if (!cal.timelineEventMoved(event, this, dates[0], dates[1], newType)) return false;
        
        // finally update event
        //isc.logWarn('updating event:' + [dates[0], dates[1]]);
        this.calendar.updateEvent(event, dates[0], dates[1], event[cal.nameField], 
            event[cal.descriptionField], otherFields, true);
        // no need to showLines() here...the callback in updateEvent will call 
        // this.updateEventWindow() which will take care of that
        //this.calendar.timelineView.addLeadingAndTrailingLines(this);
        
        return true;
    },
    
    checkForOverlap : function (event, startDate, endDate, type) {
        var  overlapTest = {}, cal = this.calendar;
        
        overlapTest[cal.startDateField] = startDate.duplicate();
        overlapTest[cal.endDateField] = endDate.duplicate();
        overlapTest[cal.eventTypeField] = type;
        
        var overlappingEvents = cal.timelineView.findOverlappingEvents(event, overlapTest);
        if (overlappingEvents.length == 0) {
            // return false, meaning no overlap detected
            return false;
        // for now just return if overlapping more than one event
        } else if (overlappingEvents.length > 1) {
            isc.logWarn("overlap detected:" + overlappingEvents.length);
            
            return true;
        } else {
            var overlapped = overlappingEvents[0];
           
            var startField = cal.startDateField, endField = cal.endDateField;
            // case 1: drop event partially overlaps existing event to the left, so try to
            // drop event to the left
            if (Date.compareDates(startDate, overlapped[startField]) == 1 
                && Date.compareDates(endDate, overlapped[startField]) == -1 ) {
                // set end date to be overlapped event start date, less one minute
                endDate = overlapped[startField].duplicate();
                
                //endDate.setMinutes(endDate.getMinutes() - 1);
                // put the start date back by however many minutes the event is long
                startDate = endDate.duplicate();
                startDate.setMinutes(startDate.getMinutes() - this.getEventLength());
                isc.logWarn('left overlap:' + [startDate]);
                return [startDate, endDate];
            // case 2: drop event partially overlaps existing event to the right, so try to
            // drop event to the right
            } else if (Date.compareDates(startDate, overlapped[endField]) == 1 
                && Date.compareDates(endDate, overlapped[endField]) == -1) {
                // set start date to be overlapped event end date, plus one minute
                startDate = overlapped[endField].duplicate();
                //startDate.setMinutes(startDate.getMinutes() + 1);
                // put the start date back by however many minutes the event is long
                endDate = startDate.duplicate();
                endDate.setMinutes(endDate.getMinutes() + this.getEventLength());
                isc.logWarn('rigth overlap:' + [overlapped.id, overlapped.end, startDate, endDate]);
                return [startDate, endDate];
            // other cases: for now don't allow drops where drop event completely encopasses 
            // or is encompassed by another event
            } else {
                return true;
            }
           
        }
    },
    
     dragResizeStart : function () {   
        // for drag resizing, calculate the offset (vsnaporigin) by calculating how much is left
        // over when you divide the events bottom y coordinate by the snapVGap. This is added 
        // to the y coordinate calculated in GR.getVSnapPosition
        var snapOrigin = (this.getTop() + this.getVisibleHeight()) % this.parentElement.snapVGap;
        this.parentElement.VSnapOrigin = snapOrigin; 
       
          
    },
    
    dragResizeStop : function () {
        var cal = this.calendar,
        // store these so we can auto-arrange both source and target locations after the move
        startDate,
        endDate, 
        EH = this.ns.EH,
        colNum,
        // convert dragLeft into local coords by calculating an offset based on eventWindow
        // pageLeft - left.
        leftOffset = this.getPageLeft() - this.getLeft(),
        dragLeft = EH.dragMoveTarget.getLeft() - leftOffset;
           
        if (dragLeft == this.getLeft()) { // right side dragged
            startDate = this.event[cal.startDateField].duplicate();
            var dragRight = (dragLeft + EH.dragMoveTarget.getVisibleWidth());
            endDate = cal.timelineView.getDateFromPoint(dragRight);
            // special case: when sizing to grid on a right drag, take a columns length off the 
            // end date, as getDateFromPoint() handles the border case as being on the next 
            // day, which is fine for the start date but not for the end date
            if (this.calendar.sizeEventsToGrid) {
                var minsInACol = this.calendar.timelineView._getMinsInACell();
                endDate.setMinutes(endDate.getMinutes() - minsInACol);
            }
            
             
        } else { // left side dragged
            startDate = cal.timelineView.getDateFromPoint(dragLeft);
            endDate = this.event[cal.endDateField].duplicate();
        }
        
        // Added undoc'd endDate param - is necessary for Timeline items because they can be 
        // stretched or shrunk from either end
        if (!cal.timelineEventResized(this.event, this, startDate, endDate)) return false;
        //this._skipResize = true;
        //isc.logWarn('dragResizeStop:' + [startDate, endDate]);
        cal.updateEvent(this.event, startDate, endDate,
         this.event[cal.nameField], this.event[cal.descriptionField], null, true);

    },
    destroyLines : function () {
        if (this._lines) {
            if (this._lines[0]) this._lines[0].destroy();
            if (this._lines[1]) this._lines[1].destroy();
            if (this._lines[2]) this._lines[2].destroy();
            if (this._lines[3]) this._lines[3].destroy();
        }
    },
    
    hideLines : function () {
        if (this._lines) {
            if (this._lines[0]) this._lines[0].hide();
            if (this._lines[1]) this._lines[1].hide();
            if (this._lines[2]) this._lines[2].hide();
            if (this._lines[3]) this._lines[3].hide();
        }
    },
    
    showLines : function () {
        if (this._lines) {
            if (this._lines[0]) this._lines[0].show();
            if (this._lines[1]) this._lines[1].show();
            if (this._lines[2]) this._lines[2].show();
            if (this._lines[3]) this._lines[3].show();
        }
    },
    
    hide : function () {
        this.invokeSuper(isc.TimelineWindow, "hide");
        this.hideLines();
    },
    
    show : function () {
        this.invokeSuper(isc.TimelineWindow, "show");
        this.showLines();    
    },
    
    parentResized : function () {
        // skip EventWindow implementation of parentResized. We shouldn't need to resize
        // all eventWindows for this view.
        this.invokeSuper(isc.EventWindow, "parentResized");
        //this.Super('parentResized', arguments);
        //this._parentView.sizeEventWindow(this);
        
    }
    
        
}); // end TimelineWindow

// TimelineView
//---------------------------------------------------------------------------------------------
isc.ClassFactory.defineClass("TimelineView", "ListGrid");

isc.TimelineView.changeDefaults("bodyProperties", {
    childrenSnapToGrid: true,
    
    snapToCells: false,
    suppressVSnapOffset: true
});

isc.TimelineView.addProperties({
    canSort: false,
    canResizeFields: false,
    canReorderFields: false,
    showHeaderContextMenu: false,
    showAllRecords: true,
    fixedRecordHeights: true,
    alternateRecordStyles: true,
    showRollOver:true,
    useCellRollOvers:true,
    canSelectCells:true,
    
    eventTypeField: "eventType",
    eventWidth: 60,
    eventHeight: 60,
    labelColumnWidth: 75,
    labelColumnBaseStyle: "labelColumn",
    
    eventPageSize: 30,
    trailIconSize: 16,
    leadIconSize: 16,
    scrollToToday: false,//5,
    
    lineImage: "[SKINIMG]Stretchbar/hsplit_over_stretch.gif",
    trailingEndPointImage: "[SKINIMG]actions/prev.png",
    leadingEndPointImage: "[SKINIMG]actions/next.png",
    
    initWidget : function () {
         this.fields = [];
         if (this.creator.eventTypeField) this.eventTypeField = this.creator.eventTypeField;
         if (this.creator.timelineStartDate) this.startDate = this.creator.timelineStartDate;
         if (this.creator.timelineEndDate) this.endDate = this.creator.timelineEndDate;
         if (this.creator.renderEventsOnDemand) this.renderEventsOnDemand = this.creator.renderEventsOnDemand;
         this.cellHeight = this.eventHeight;
         this.fields = this.calcFields();
         this.data = this.creator.eventTypeData;
         this._scrubDateRange();
         this.Super("initWidget");    
    },
    
    _scrubDateRange : function () {
       var gran = this.creator.timelineGranularity;
       if (gran == "day") {
            this.startDate.setHours(0);
            this.startDate.setMinutes(0);
            this.startDate.setSeconds(0);
            this.startDate.setMilliseconds(0);
       } else if (gran == "hour") {
            this.startDate.setMinutes(0);
            this.startDate.setSeconds(0);
            this.startDate.setMilliseconds(0);
       } else if (gran == "minute") {
            this.startDate.setSeconds(0);
            this.startDate.setMilliseconds(0);
       }
    },
    
    // make sure link between eventTypeData and this.data is maintained
    //setData : function (newData) {
    //     this.creator.eventTypeData = newData;
    //     this.invokeSuper(isc.TimelineView, "setData", newData);
    //},
    scrollTimelineTo : function (pos) {
        this.bodies[1].scrollTo(pos);
    },
    
    setEventHeight : function (newHeight) {
        this.eventHeight = newHeight;
        this.setCellHeight(newHeight);
        this.refreshEvents();
    },
    
    setEventWidth : function (newWidth) {
        this.eventWidth = newWidth;
        this.setFields(this.calcFields());
        this.refreshEvents();
    },
    
    setTimelineRange : function (start, end, timelineGranularity, timelineUnitsPerColumn) {
        this.startDate = start.duplicate();
        this.creator.timelineStartDate = start.duplicate();
        this.endDate = end.duplicate();
        this.creator.timelineEndDate = end.duplicate();
        
        if (timelineGranularity) this.creator.timelineGranularity = timelineGranularity;
        if (timelineUnitsPerColumn) this.creator.timelineUnitsPerColumn = timelineUnitsPerColumn;
        
        isc.logWarn('setTimelineRange:' + [timelineGranularity, timelineUnitsPerColumn, this.creator.timelineGranularity, this.creator.timelineUnitsPerColumn]);
        var flds = this.calcFields();
        this.setFields(flds);
        this._scrubDateRange();
        this.refreshVisibleEvents();
    },
    
    addUnits : function (date, units) {
        if (this.creator.timelineGranularity == "day") {
            date.setDate(date.getDate() + units);
        } else if (this.creator.timelineGranularity == "hour") {
            date.setHours(date.getHours() + units);    
        } else if (this.creator.timelineGranularity == "minute") {
            date.setMinutes(date.getMinutes() + units);    
        }
        return date;
    },
    calcFields : function () {
        var newFields = [];
        if (this.creator.timelineLabelFields) {
            var fldArray = this.creator.timelineLabelFields;
            for (var i = 0; i < fldArray.length; i++) {
                newFields.add(fldArray[i]);    
            }
        } else {
            var labelCol = {
                 width: this.labelColumnWidth,
                 name: this.eventTypeField,
                 title: " ",
                 frozen: true
             }
             newFields.add(labelCol);    
        }
         // add date columns to fields
         var sDate = this.startDate.duplicate();
         var eDate = this.endDate;
         var count = 0;
         var units = this.creator.timelineUnitsPerColumn;
         while (sDate.getTime() <= eDate.getTime()) {
             
             var newField = isc.addProperties({
                 name: "f" + count,
                 title: this.getDayFieldTitle(sDate),
                 width: this.eventWidth
             }, this.getFieldProperties(sDate));
             newFields.add(newField);
             sDate = this.addUnits(sDate, units);
             /*
             if (this.creator.timelineGranularity == "day") {
                 sDate.setDate(sDate.getDate() + 1);
             } else {
                sDate.setHours(sDate.getHours() + 1);    
             }
             */
             count++;
         }
         return newFields;
    },

    getFieldProperties : function (date) {
        return null;
    },
    getDayFieldTitle : function (date) {
        if (this.creator.timelineGranularity == "day") {
            return (date.getMonth() + 1) + "/" + date.getDate();
        } else {
            var mins = date.getMinutes().toString();
            if (mins.length == 1) mins = "0" + mins;
            return date.getHours() + ":" + mins;    
        }
    },
    
    draw : function (a, b, c, d) {
        this.invokeSuper(isc.TimelineView, "draw", a, b, c, d);
        var snapGap = this.creator.timelineSnapGap;
        if (snapGap) {
            this.body.snapHGap = Math.round((snapGap / 60) * this.eventWidth);
            //this.body.snapHGap = 5;
        } else {
            this.body.snapHGap = this.eventWidth;    
        }
        
        this.body.snapVGap = this.eventHeight;
        // scroll to today if defined
        if (this.scrollToToday != false) {
            var today = new Date();
            today.setDate(today.getDate() - this.scrollToToday);
            var diff = this.creator.getDayDiff(this.startDate, today);            
            var sLeft = diff * this.eventWidth;
            this.bodies[1].scrollTo(sLeft, 0);
        }
        this.logDebug('draw', 'calendar');
        // call refreshEvents() whenever we're drawn
        // see commment above dataChanged for the logic behind this
        
        this.refreshEvents();
          
    },
    
    getCellCSSText : function (record, rowNum, colNum) {
         var currDate = this.startDate.duplicate();
         currDate.setDate(currDate.getDate() + colNum - this.getLabelColCount());
         var today = new Date();
         
         if (currDate.toShortDate() == today.toShortDate() && this.creator.todayBackgroundColor) {
             return "background-color:" + this.creator.todayBackgroundColor;
         } else return null;
    },
    
    formatDateForDisplay : function (date) {
        return  date.getShortMonthName() + " " + date.getDate() + ", " + date.getFullYear(); 
    },
    
    getLabelColCount : function () {
        if (this.creator.timelineLabelFields) {
            return this.creator.timelineLabelFields.length;
        } else {
            return 1;
        }
    },
    
    isLabelCol : function (colNum) {
        if (colNum < this.getLabelColCount()) return true;
        else return false;
    },
    
    getCellStyle : function (record, rowNum, colNum) {
        var bStyle = this.getBaseStyle(record, rowNum, colNum);
        
        if (this.isLabelCol(colNum)) return bStyle;
        else {
            return bStyle;
        }
    },
    
    getBaseStyle : function (record, rowNum, colNum) {
        if (this.isLabelCol(colNum)) return this.labelColumnBaseStyle;        
        else {
            return this.baseStyle;    
        }
    },
    
    nextOrPrev : function (next) {
        var pageSize = next ? this.eventPageSize : 0 - this.eventPageSize;
        this.startDate.setDate(this.startDate.getDate() + pageSize);
        this.endDate.setDate(this.endDate.getDate() + pageSize);
        this.setFields(this.calcFields());
        //isc.logWarn("nextOrPrev:" + this.creator.data.willFetchData(this.creator.getNewCriteria()));
        if (this.creator.dataSource && isc.ResultSet && isc.isA.ResultSet(this.creator.data)) {
            this.creator.data.invalidateCache();
            this.creator.filterData(this.creator.getNewCriteria());
        } else {
            // force dataChanged hooks to fire so event positions are correctly updated
            this.creator.dataChanged();
        }
      
    },
    
    refreshEvents : function () {
        
        // bail if the grid hasn't been drawn yet, or hasn't gotten data yet
        if (!this.body || !this.creator.hasData()) return;
        //this.clearEvents();
        var startDate = this.startDate, endDate = this.endDate, cal = this.creator;
        
        
        //var events = cal._getEventsInRange(startDate, endDate);
        var events = cal.data.getRange(0, cal.data.getLength());
        this.logDebug('refreshing events','calendar');
     //isc.logWarn('ebtView refreshEvents:' + events.getLength());
        // first figure out who's overlapping who. Could play with moving this logic to
        // refreshVisibleEvents and tagging only visible events on scroll.
        this.tagDataForOverlap(events);
        
        this.refreshVisibleEvents();
    },
    
    getVisibleEvents : function () {               
        var dateRange = this.getVisibleDateRange();
        var rowRange = this.getVisibleRowRange();
        var cal = this.creator;
        
        //if (!this.renderEventsOnDemand) return cal.data;
        var events = cal.data;
        var results = [];
        for (var i = 0; i < events.getLength(); i++) {
            var event = events.get(i);
            if (!event) {
                isc.logWarn('getVisibleEvents: potentially invalid index: ' + i);  
                break;
            }
            var rangeObj = {};
            // if we're not showing lead-trail lines use start-endDate fields instead to 
            // determine overlap
           if (event[cal.leadingDateField] && event[cal.trailingDateField]) {
                rangeObj[cal.leadingDateField] = dateRange[0];
                rangeObj[cal.trailingDateField] = dateRange[1];
           } else {
                rangeObj[cal.startDateField] = dateRange[0];
                rangeObj[cal.endDateField] = dateRange[1];    
           }
            
            var eventRowIndex = this.data.findIndex(cal.eventTypeField, event[cal.eventTypeField]);
           // isc.logWarn('eventRowIndex:' + eventRowIndex);
            if (eventRowIndex == -1) {
                //isc.logWarn("null eventRowIndex:" + this.echoFull(event));    
            }
            if (this.eventsOverlap(rangeObj, event) && rowRange[0] <= eventRowIndex 
                && eventRowIndex <= rowRange[1]) {
                results.add(event);    
            } /*else {                
                isc.logWarn('event not added to vis events:' + event.id);
                isc.logWarn('dates:' + [rangeObj.start, rangeObj.end, event.start, event.end]);                     
               
            }*/
        }
        
        return results;
    },
    
    // realEvent is the actual event object, passed in so that we can exclude
    // it from the overlap tests. paramEvent is an object with date fields 
    findOverlappingEvents : function (realEvent, paramEvent) {
        var cal = this.creator;
        //if (!this.renderEventsOnDemand) return cal.data;
        var events = cal.data;
        var results = [];
        for (var i = 0; i < events.getLength(); i++) {
            var event = events.get(i);
            if (!event) {
                isc.logWarn('getVisibleEvents: potentially invalid index: ' + i);  
                break;
            }
            if (cal.eventsAreSame(event, realEvent)) {
                continue;
            }
            var rangeObj = {};
            // if we're not showing lead-trail lines use start-endDate fields instead to 
            // determine overlap
           if (event[cal.leadingDateField] && event[cal.trailingDateField]) {
                rangeObj[cal.leadingDateField] = paramEvent[cal.leadingDateField];
                rangeObj[cal.trailingDateField] = paramEvent[cal.trailingDateField];
           } else {
                rangeObj[cal.startDateField] = paramEvent[cal.startDateField];
                rangeObj[cal.endDateField] = paramEvent[cal.endDateField];    
           }
            
            if (paramEvent[cal.eventTypeField] ==  event[cal.eventTypeField]
                && this.eventsOverlap(rangeObj, event)) { 
                //isc.logWarn('findOverlappingEvents:' + event.id); 
                results.add(event);    
            }
        }
        
        return results;
    },
    
    // refreshEvents is only called when data changes, etc. 
    // refreshVisibleEvents is called whenever the view is scrolled and only draws visible events.
    // see scrolled()
    refreshVisibleEvents : function () {
        // get visible events and add them. addEvent takes care of reclaiming and positioning
        var events = this.getVisibleEvents();
        var eventsLen = events.getLength();
        this.logDebug('refreshing visible events','calendar');  
        for (var i = 0; i < eventsLen; i++) {
            //if (i > 20) break;
            var event = events.get(i);
            //isc.logWarn('refreshing event:' + event.id);
            // reset the visited flag on each event so that tagDataForOverlap code knows it can 
            // tag this event if it needs to be retagged (any time an event in the same row is 
            // changed).
            if (event._overlapProps) event._overlapProps.visited = false;           
            this.addEvent(event, i);
        }   
        // hide events after repositiong visible events, starting right after the number of the 
        // last positioned events. This prevents stale (not in view) events from hanging around.
        this.clearEvents(eventsLen);
    },
    
    tagDataForOverlap : function (data, eventType) {
        if (data.getLength() == 0) return;
        var cal = this.creator,    
            priorOverlaps = [], // moving window of overlaping events
            overlapMembers = 0, // number of events in the current overlap group 
            currentOverlapTot = 0, // max number of events that overlap eachother in the current overlap group
            maxTotalOverlaps = 0, // max number of events that overlap eachother in current event type row
            currType =  data.get(0)[cal.eventTypeField];// current event type we're dealing with
       
        data.sort(function (a, b) {
            var sDateField;
            if (a[cal.leadingDateField] && b[cal.leadingDateField]) sDateField = cal.leadingDateField;
            else sDateField = cal.startDateField;
            if (a[cal.eventTypeField] < b[cal.eventTypeField]) return -1;
            else if (a[cal.eventTypeField] > b[cal.eventTypeField]) return 1;
            else {
                // allow user to cusomize the secondary sort, usefull when allEventsOverlap
                // is true so that certain events always appear in a particular slot
                if (cal.timelineView.secondarySort) {
                    return cal.timelineView.secondarySort(a, b);    
                } else {
                    if (a[sDateField] < b[sDateField]) return -1;
                    else if (a[sDateField] > b[sDateField]) return 1;
                    else return 0;
                }
            }
        } );
        var start = 0, processedEvents = [];
        // iterate through the sorted event list to get to the event type row indicated in the
        // eventType parameter. Used when updating events to re-tag only that row.
        if (eventType) {
            while (data.get(start)[cal.eventTypeField] != eventType && start < data.getLength()) {
                start++;
            }
        }
        //cal.data.sort(comparator); // sort by event type, start date
        for (var i = start; i < data.getLength(); i++) {
            var event = data.get(i);
            //isc.logWarn("tagDataForOverlap, processing:" + event.EVENT_ID);
            // stop processing if we've already processed all events w/ parameter eventType 
            if (eventType && event[cal.eventTypeField] != eventType) {
                break;
            } else if (eventType) processedEvents.add(event);
            // reset overlap vars when a new type is encountered
            if (event[cal.eventTypeField] != currType) {
            //    isc.logWarn('resetting');
                overlapMembers = currentOverlapTot = maxTotalOverlaps = 0;
                priorOverlaps = [];
                currType = event[cal.eventTypeField];
            }
           
            var overlapsAll = true;
            var keepers = [];
            //if(eventType)isc.logWarn('start processing:' + [event.assayEventId, currentOverlapTot, event.startDate]);
            for (var j = 0; j < priorOverlaps.length; j++) {
                var overlapper = priorOverlaps[j];
                if (this.allEventsOverlap || this.eventsOverlap(event, overlapper)) {           
                    keepers.add(overlapper);
                    //isc.logWarn('keeping:' + overlapper.assayEventId);
                } else {
                    // currentOverlapTot represents slots which
                    // overlapping events can fit in, and we want to keep track of that total and only reset it
                    // when we reach the end of an overlap region. We know we've reached that end when
                    // overlapMembers hits 0. (debateable actually...)
                    overlapMembers--;
                    if (overlapMembers == 0) currentOverlapTot = 1;
                    overlapsAll = false;
                    //isc.logWarn('removing:' + [overlapper.assayEventId, overlapMembers, currentOverlapTot]);
                }
            }
            priorOverlaps = keepers;
            priorOverlaps.add(event);
            overlapMembers++;
            // if an event overlaps all previoulsy overlapping events, then the current overlap total
            // needs to be augmented if the number of currently overlapping events being stored in 
            // priorOverlaps is greater that the current total. 
            if (overlapsAll && priorOverlaps.length > currentOverlapTot) {
                currentOverlapTot++;
                
            }
            
            for (var j = 0; j < priorOverlaps.length; j++) {
                var overlapper = priorOverlaps[j];
     
                if (!overlapper._overlapProps) overlapper._overlapProps = {};
                if (!overlapper._overlapProps.visited) {
                    // set slotNum to null for the case when an event had a prior slotNum
                    overlapper._overlapProps.slotNum = null;
                    var slotNum = this.nextAvailSlot(priorOverlaps, currentOverlapTot);
                    // sanity check - we should be guaranteed a valid slotnum based upon the 
                    // overlap calculations above
                    if (slotNum < 1) {
                        isc.logWarn("Calendar.timelineView.tagDataForOverlap, no slot for event:" 
                            + isc.Log.echoFull(overlapper));
                    }
                    overlapper._overlapProps.slotNum = slotNum;
                    overlapper._overlapProps.visited = true;
                }
                overlapper._overlapProps.totalSlots = currentOverlapTot;
                
                //isc.logWarn('tagging:' + [overlapper.EVENT_ID, 
                //    overlapper._overlapProps.slotNum, overlapper._overlapProps.totalSlots]);
            }
            
            if (currentOverlapTot > maxTotalOverlaps) maxTotalOverlaps++;
            //isc.logWarn('tagDataforOverlap, processed:' + event.EVENT_ID + ", " + this.echoFull(event._overlapProps));  
        }
        return processedEvents;
    },

      
    nextAvailSlot : function (priorOverlaps, totSlots) {
        var slotMap = [];
        // create an array that will that will contain 'true' if that slot index is occupied
        // and 'false' otherwise
        for (var i=0; i < totSlots; i++) {
            slotMap.add(false);
        }
        // go through overlapping events and record the slot they occupy. 
        // slotNum is 1-based, array is 0-based
        for (var i = 0; i < priorOverlaps.length; i++) {
            var event = priorOverlaps[i];
            if (!event._overlapProps) continue;  
            if (event._overlapProps.slotNum) slotMap[event._overlapProps.slotNum - 1] = true;
        }
        // find the first unocuppied slot
        var slotNum = slotMap.indexOf(false) + 1;
        return slotNum;
        /* // keep this around for now for future reference
        for (var i = 0; i < priorOverlaps.length; i++) {
            var event = priorOverlaps[i];
            if (!event._overlapProps) continue;
            isc.logWarn("in loop: " + [event.EVENT_ID, event._overlapProps.slotNum, start, priorOverlaps.length]);    
            if (event._overlapProps.slotNum == start) {
               
                start++;
            }
            else return start;
        }
        return start;
        */
    },
    
    eventsOverlap : function (a, b) {
        var startField, endField, cal = this.creator;
        if (a[cal.leadingDateField] && b[cal.leadingDateField]) startField = cal.leadingDateField;
        else startField = cal.startDateField;
         
        if (a[cal.trailingDateField] && b[cal.trailingDateField]) endField = cal.trailingDateField;
        else endField = cal.endDateField;
        
        
        // simple overlap detection logic: there can only be an overlap if 
        // neither region A end <= region B start nor region A start >= region b end.
        // No need to check other boundary conditions, this should satisfy all
        // cases: 1. A doesn't overlap B, A partially overlaps B, A is completely
        // contained by B, A completely contains B.
        // NOTE: using the equals operator makes the case where 
        // two dates are exactly equal be treated as not overlapping.
        if (cal.equalDatesOverlap) {
             if (a[endField] < b[startField] || a[startField] > b[endField]) return false;
             else return true;   
        } else {
             if (a[endField] <= b[startField] || a[startField] >= b[endField]) return false;
             else return true;
        }
       
    },
    
    compareDates : function (date1, date2, d) {
        // year
        if (date1.getFullYear() < date2.getFullYear()) {
            return 1;       
        } else if (date1.getFullYear() > date2.getFullYear()) {
            return -1;
        }
        // month
        if (date1.getMonth() < date2.getMonth()) {
            return 1;       
        } else if (date1.getMonth() > date2.getMonth()) {
            return -1;
        }
        // day
        if (date1.getDate() < date2.getDate()) {
            return 1;       
        } else if (date1.getDate() > date2.getDate()) {
            return -1;
        }
        // equal
        return 0;
        
    },
    
    getDateFromPoint : function (point, round) {
        var retDate = this.startDate.duplicate();
        var colWidth = this.eventWidth;
        var minsInACol = this._getMinsInACell();
        var minsToAdd = 0;
        // convert point to minutes via how many column lengths are in the point
        minsToAdd += Math.floor(point / colWidth) * minsInACol;
        // account for the remainder, only if not rounding (see getVisibleDateRange)
        if (!round) minsToAdd += ((point % colWidth) / colWidth) * minsInACol;
        
        retDate.setMinutes(retDate.getMinutes() + minsToAdd);
        
        return retDate;
    },
    
    _getMinsInACell : function () {
        var colUnits = this.creator.timelineUnitsPerColumn;
        var granularity = this.creator.timelineGranularity;
        var minsInACol;
        var breadth = 0;
        if (granularity == "day") {
            var minsInADay = 24 * 60;
            minsInACol = colUnits * minsInADay;   
        } else if (granularity == "hour") {
            minsInACol = colUnits * 60;    
        } else if (granularity == "minute") {
            minsInACol = colUnits;    
        } 
        return minsInACol;
    },
    
    // gets the width that the event should be sized to in pixels
    _getEventBreadth : function (eventWin) {
        var minsInACol = this._getMinsInACell();
        // account for events that overlap the end range of the timeline. Event breadth will
        // be truncated to end where the timeline ends.
        var start, end;
        if (eventWin.event[this.creator.startDateField].getTime() < this.startDate.getTime()) {
            start = this.startDate.duplicate();
        } else {
            start = eventWin.event[this.creator.startDateField];    
        }
        if (eventWin.event[this.creator.endDateField].getTime() > this.endDate.getTime()) {
            end = this.endDate.duplicate();
            // timeline actually renders one column past the specified end date, so take that
            // into account
            end.setMinutes(end.getMinutes() + minsInACol);
        } else {
            end = eventWin.event[this.creator.endDateField].duplicate();
        }
        var minsLen = eventWin.getEventLength(start, end);
        var colWidth = this.eventWidth;
        var breadth = 0;
        var grossCols = Math.floor(minsLen / minsInACol);
        //isc.logWarn('getEventBreadth:' + [minsLen, minsLen / 60, minsInACol, minsInACol/60, grossCols, eventWin.event.start, eventWin.event.end]);
        // when sizing events to grid, always augment the column count by 1.
        if (this.creator.sizeEventsToGrid) {
            grossCols += 1;
            
        }
        // first get how many columns the event spans
        breadth += grossCols * colWidth;
        if (this.creator.sizeEventsToGrid == false) {
            // then add the remainder
            breadth += Math.floor(((minsLen % minsInACol) / minsInACol) * colWidth);
        }
        return breadth;
           
    },
    
    getEventLeft : function (event) {
       
        // minDiff = difference between range start and event start in minutes
        var minDiff = (event[this.creator.startDateField].getTime() - this.startDate.getTime()) / (1000 * 60);
        var colWidth = this.eventWidth;
        var minsInACol = this._getMinsInACell();
        var eLeft = 0;
        
        // first get how many columns from range start the event is
        eLeft += Math.floor(minDiff / minsInACol) * colWidth;     
        if (this.creator.sizeEventsToGrid == false) {
            // then add the remainder: percentage of leftover mins to minsInACol * colWidth
            eLeft += Math.floor(((minDiff % minsInACol) / minsInACol) * colWidth);      
        }
        // don't let event left be < 0. Breadth will compensate for the overflow as well in 
        // getEventBreadth
        if (eLeft < 0) eLeft = 0;
               
        return eLeft;
        
    }, 
    
    // sizeEventWindow() timelineView
    sizeEventWindow : function (eventWin, forceRedraw) {        
        //var doDebug = (eventWin.event.assayEventId == 29);
        var cal = this.creator, event = eventWin.event, eWidth = this.eventWidth, 
            eHeight = this.eventHeight;
        
        // reset style name to new event as the window may have a stylename from the event
        // it was previously representing (recycled window)
        var styleName = event[cal.eventWindowStyleField] || cal.eventWindowStyle;
        if (styleName) eventWin.setStyleName(styleName);
        // set eventWindowBackgroundColor if present on event, otherwise null it out if it
        // was there from a previous event
        if (event.eventWindowBackgroundColor) {
            eventWin.setBackgroundColor(event.eventWindowBackgroundColor);
        } else {
            // calling canvas.setBackgroundColor(null) won't work because that method exits
            // if the param is null, so just manually set backgroundColor properties to null.
            eventWin.backgroundColor = null;
            if (eventWin.isDrawn()) {
                eventWin.getStyleHandle().backgroundColor = null;
            }
        }
        
        // calculate event width
        eWidth = this._getEventBreadth(eventWin);
        // calculate event left
        var eLeft = this.getEventLeft(event);
        //isc.logWarn("sizeEventWindow:" + [eWidth, eLeft]);
        eventWin.setTitle(cal.getEventTitle(event));
       
        // force redraw to avoid having the title be stale when the event win is moved...
        // otherwise you have the old title flashing briefly when the ebtView is scrolled
        // see ebtview.addEvent
        if (forceRedraw) eventWin.redraw();
        //if (eventWin.headerLabel) eventWin.headerLabel.setContents(cal.getEventTitle(event));
        //else eventWin.setTitle(cal.getEventTitle(event));
        
        var typeIndex = this.data.findIndex(this.eventTypeField, event[this.eventTypeField]);        
        var eTop = typeIndex * eHeight;
        
        //if (doDebug) isc.logWarn('sizeEventWindow:' + [daysFromStart, cal.timelineStartDate]);
        this.adjustDimensionsForOverlap(eventWin, eLeft, eTop, eWidth, eHeight);
      
        // set description after resize so percentage widths can be respected in html that may
        // be in the description
        if (cal.showDescription != false) {
            eventWin.setDescriptionText(event[cal.descriptionField]);    
        }
        
        // draw leading and trailing lines
        if (event[cal.leadingDateField] && event[cal.trailingDateField]) {
            if (eventWin._lines) this.addLeadingAndTrailingLines(eventWin);
            // split this onto another thread so that ie doesn't pop the 
            // slow script warning. Applies to first draw only.
            else this.delayCall("addLeadingAndTrailingLines", [eventWin]);
          
        }
        
    },
    
    adjustDimensionsForOverlap : function (eventWin, left, top, width, height) {
        
        var overlapProps = eventWin.event._overlapProps;
        //isc.logWarn('adjustDimForOverlap:' + eventWin.event.EVENT_ID + this.echoFull(overlapProps));
        //overlapProps = false;
        if (overlapProps && overlapProps.totalSlots > 0) {
            
            height = Math.floor(height / overlapProps.totalSlots);
            top = top + Math.floor((height * (overlapProps.slotNum - 1)));
        }
        eventWin.resizeTo(width, height);
         // continuation of ugly hack from getNewEventWindow:
        // for some reason the header lable doesn't respect the sizing of its
        // parent, so make sure we resize it here.
        if (eventWin._customHeader) eventWin.header.resizeTo(width, height);
        eventWin.moveTo(left, top);
    },
    
    addLeadingAndTrailingLines : function (eventWin) {
        // destroy previous lines and icons before creating new ones
        //eventWin.destroyLines();
        var leadLine, leadIcon, trailLine, trailIcon;
        if (eventWin._lines) {
            leadLine = eventWin._lines[0];
            leadIcon = eventWin._lines[1];
            trailLine = eventWin._lines[2];
            trailIcon = eventWin._lines[3];
        } else {
            leadLine = this._makeLine();
            leadIcon = this._makeIcon(eventWin, "lead");
            trailLine = this._makeLine();
            trailIcon = this._makeIcon(eventWin, "trail");     
        }
       
        
        var showLead = this._positionIcon(leadIcon, leadLine);
        var showTrail = this._positionIcon(trailIcon, trailLine);
        
       
        if (!eventWin._lines) {
            this.body.addChild(leadLine);
            this.body.addChild(leadIcon);
            
            this.body.addChild(trailLine);
            this.body.addChild(trailIcon);
            eventWin._lines = [
               leadLine, leadIcon, trailLine, trailIcon 
            ];
        }
        
       
    },
    
    _positionIcon : function (icon, line) {
        var cal = this.creator, eventWin = icon._eventWin, event = eventWin.event, 
            type = icon.type, eWidth = this.eventWidth, 
            eHeight = eventWin.getVisibleHeight(), eTop = eventWin.getTop(), 
            eLeft = eventWin.getLeft();
            
        // size/reposition line first
        var dayDiff, lineWidth, drawIcon = true;    
        if (type == "trail") {
            // if trailing date is past our date range, draw the line up to the end of the grid
            // and don't draw the trailing icon
            if (this.compareDates(event[cal.trailingDateField],this.endDate) < 0) {
                dayDiff = cal.getDayDiff(this.endDate, event[cal.startDateField]);
                // don't allow invalid lead day. Set to 1 if invalid.
                if (dayDiff < 1) dayDiff = 1;
                lineWidth = dayDiff * eWidth;
                drawIcon = false;
                //icon.hide();
            } else {
                dayDiff = cal.getDayDiff(event[cal.trailingDateField], event[cal.startDateField]);
                lineWidth = (dayDiff * eWidth) - (Math.round(eWidth / 2));
                //if (icon.isDrawn()) icon.show();
            }                
        } else {
            // if leading date is past our date range, draw the line up to the end of the grid
            // and don't draw the leading icon
            if (this.compareDates(this.startDate, event[cal.leadingDateField]) < 0) {
                dayDiff = cal.getDayDiff(this.startDate, event[cal.startDateField]);
                // don't allow invalid lead day. Set to 1 if invalid.
                if (dayDiff < 1) dayDiff = 1;
                lineWidth = dayDiff * eWidth;
                drawIcon = false;
                //icon.hide();
            } else {
                dayDiff = cal.getDayDiff(event[cal.leadingDateField], event[cal.startDateField]);    
                lineWidth = ( dayDiff * eWidth) - (Math.round(eWidth / 2));
                //if (icon.isDrawn()) icon.show();
            }
        }
      
        //isc.logWarn(event[cal.trailingDateField].toShortDate());
        var lLeft = (type == "trail" ? eLeft + eWidth : eLeft - lineWidth);
        line.moveTo(lLeft, eTop + (Math.round(eHeight / 2)));
        line.setWidth(lineWidth);
        
        // position icon
        // calculate a vertical offset to add to the event arrows so that if they are overlapping,
        // drag moving will keep them in the same vertical axis. Just try commenting out the code
        // below and setting vOffset to 0, and drag moving arrows to see the issue.
        var  vOffset = 0;
        if (event._overlapProps && event._overlapProps.slotNum > 0)  {
            vOffset = (event._overlapProps.slotNum - 1) * eHeight;
        } 
        var iconSize = (type == "trail" ? this.trailIconSize : this.leadIconSize);
        var iLeft;
        if (drawIcon == false) iLeft = -50;
        else if (type == "trail") iLeft = eLeft + eWidth + lineWidth - Math.round(iconSize / 2);
        else iLeft = eLeft - lineWidth - Math.round(iconSize / 2);
        icon.moveTo(iLeft, eTop + Math.round(eHeight / 2) - Math.round(iconSize / 2));
        icon._vSnapOrigin = Math.round(eHeight / 2) - Math.round(iconSize / 2) + vOffset;
        icon._hSnapOrigin = Math.round(eWidth / 2) - Math.round(iconSize / 2),
        icon._eventStartCol = cal.getDayDiff(event[cal.startDateField], this.startDate);
        
        return drawIcon;
    },
    
    _makeIcon : function (eventWin, type) {
        var iconSize = (type == "trail" ? this.trailIconSize : this.leadIconSize);
        var icon = isc.Img.create({
            _eventWin: eventWin,
            type: type,
           
            //prompt:eventWin.event.EVENT_ID,
            autoDraw:false,
            _redrawWithParent: false,
            src: (type == "trail" ? this.trailingEndPointImage : this.leadingEndPointImage),
            width: iconSize,
            height: iconSize,
            canDragReposition: (this.creator.canEditEvents == true),
            dragRepositionStart : function () {
                this._startRow = this.parentElement.getEventRow();
                this._startCol = this.parentElement.getEventColumn();
                //isc.logWarn('icon drag start:');
                this.parentElement.VSnapOrigin = this._vSnapOrigin;
                this.parentElement.HSnapOrigin = this._hSnapOrigin;
            },
            dragRepositionStop : function () {
               var eventStartCol = this._eventStartCol, startCol = this._startCol, 
                    endCol = this.parentElement.getEventColumn(), delta = endCol - startCol,   
                    event = this._eventWin.event, cal = this._eventWin.calendar,
                    eventDelta = this.type == "trail" ? endCol - eventStartCol : eventStartCol - endCol;
               //isc.logWarn('icon drag stop:' + eventDelta);
               if (eventDelta < 1) return false;
               var otherFields = {};
               var dateField = this.type == "trail" ? cal.trailingDateField : cal.leadingDateField;
               var newDate = event[dateField].duplicate();
               newDate.setDate(newDate.getDate() + delta);
               otherFields[dateField] = newDate;
               cal.updateEvent(event, event[cal.startDateField], event[cal.endDateField], 
                   event[cal.nameField], event[cal.descriptionField], otherFields, true);
               return true;
              
            }       
        });
        return icon;
    },
    
    _makeLine : function () {
        //var line = isc.Img.create({
        var line = isc.Canvas.create({
            autoDraw:false,
            _redrawWithParent: false,
            //src: this.lineImage,
            height: 2,
            
            overflow: "hidden",
            styleName: "eventLine"
        });
        
        return line;
    },
    
    clearEvents : function (start) {
        if (!this.body || !this.body.children || !this._eventBin) return;
        if (!start) start = 0;
        //isc.logWarn('clearing events');
        /*
        var arr = this.body.children;
        for (var i = arr.length - 1; i >= 0 ; i--) {
            if (isc.isAn.EventWindow(arr[i])) {
                var eWin = arr[i];
                this.body.removeChild(eWin);
                eWin.destroyLines();
                eWin.destroy();
            }
        }
        */
        for (var i = start; i < this._eventBin.length; i++) {
            //isc.logWarn('hiding event:' + i);
            this._eventBin[i].hide();    
        }
    },
    
    addEvent : function (event, eventIndex) {
        if (!this._eventBin) this._eventBin = [];
        
        var win, reclaimed = false;
        // if we are recycling event windows and we have one available...
        if (this.renderEventsOnDemand && this._eventBin[eventIndex]) {
            // ...reclaim the event from the event bin
            win = this._eventBin[eventIndex];
            this.creator.setEventWindowID(event, win.ID);
            win.event = event;
            reclaimed = true;                    
        } else {
            // otherwise make a new window and put it in the bin for future reclamation
            var win = this.getNewEventWindow(event);
            win._parentView = this;        
            this._eventBin.add(win);
        }
        
        
        this.sizeEventWindow(win, reclaimed);
        // Adding a check on parentElement here to ensure that we can't end up with a window
        // in the event bin that is not a child of this.body.  This is related to the change 
        // made a few lines further down, to ensure that an undrawn window is drawn.  I suspect
        // the root of this is event windows being created before the Timeline itself has 
        // been drawn
        if (this.body && (!reclaimed || win.parentElement != this.body)) {         
            this.body.addChild(win);  
        }
        if (!win.isDrawn()) win.draw();
        if (win.body) win.body.show();
        win.show(); 
        
    },
   
    removeEvent : function (event) {
        var arr = this.body.children;
        for (var i = 0; i < arr.length ; i++) {
            if (isc.isAn.EventWindow(arr[i]) && arr[i].event === event) {
                var win = arr[i];
                win.parentElement.removeChild(win);
                win.destroy();
                return true;
            }
        }
        return false;
    },
    
    getNewEventWindow : function (event) {
        var styleName = event[this.creator.eventWindowStyleField] || this.creator.eventWindowStyle;
        var bodyProps, headerProps, showMembers = true;
        if (this.creator.showDescription == false) {
            //bodyProps = {height: 0, overflow:"hidden" };
            //headerProps = {height: "*"};
            showMembers = false;
        }
        var canDrag = (this.creator.canDragEvents == true && event[this.creator.canDragEventField] != false);
      
        var eventWinProps = {
            calendar: this.creator,
            _redrawWithParent: false,
            styleName: styleName,
            //baseStyle: styleName,
            canDragReposition: canDrag,
            canDragResize: this.creator.canResizeTimelineEvents,
            edgeMarginSize:10,
            //showEdges:false,
            //edgeOpacity:0,
            showCloseButton: false,
            event: event,
            descriptionText: event[this.creator.descriptionField] || "",
            showHeader: showMembers,
            showBody: showMembers
            //,headerProperties: headerProps,
            //bodyProperties: bodyProps
            
            
        }
        if (event.eventWindowBackgroundColor) {
            eventWinProps.backgroundColor = event.eventWindowBackgroundColor;    
        }
        var eventWin =  isc.TimelineWindow.create(eventWinProps); 
        // somewhat ugly hack, probably due to performance optimization by 
        // _redrawWithParent = false above: 
        // if showDescription is false, we completely eliminate the header and 
        // body of the window, and simply make our own header. We add this to
        // the event window as a child (if added as a member it won't be drawn).
        // The regular header won't be drawn if showBody:false, probably having
        // to do with _redrawWithParent on the window.
        
        if (!showMembers) {
            var eventWin =  isc.TimelineWindow.create(eventWinProps); 
            var lbl = isc.Label.create({
                    autoDraw:false,
                    styleName: styleName,
                    border: "0px",
                    height: "*"
            });
            eventWin.addChild(lbl);
            eventWin.header = lbl;
            eventWin._customHeader = true;
        }
        
        this.creator.setEventWindowID(event, eventWin.ID);
        //isc.logWarn('getNewEventWindow:' + [eventWin.ID, eventWin.canDragResize]);
        return eventWin;
    },
    
    updateEventWindow : function (event) {
        if (!this.body || !this.body.children) return;
        var cal = this.creator,
            // if one event is updated, all events in the same row may need to be updated as
            // well due to overlapping. By passing a type into tagDataForOverlap, only
            // events in the same row as event will be processed
            events = this.tagDataForOverlap(cal.data.getRange(0, cal.data.getLength()), 
                event[cal.eventTypeField]);
            
        if (this.renderEventsOnDemand) {
            // just refresh events
            this.refreshVisibleEvents();
        } else {
            
            for (var i = 0; i < events.length; i++) {
                var event = events.get(i), winId = cal.getEventWindowID(event), eWin = window[winId];
                // reset visited so tagDataForOverlap knows it can process this event if an 
                // update occurs later
                if (event._overlapProps) event._overlapProps.visited = false;
                // make sure to re-initialize the object that the eventWindow is pointing to, which
                // gets out of sync on update
                eWin.event = event;
                this.sizeEventWindow(eWin);
            }    
        }
        
        
    },
    
    areSame : function (first, second) {
        var cal = this.creator;
        if (cal.dataSource) {
            var pks = cal._pks, areEqual = true;
            for (var pkName in pks) {
                if (first[pkName]!= second[pkName]) {
                    areEqual = false;
                    break;
                }
            }
            return areEqual;
        } else {
            return (first === second);    
        }
    },
    
    resized : function () {
        this.Super('resized', arguments);
        //isc.logWarn('ebtView resized:' + [this.isDrawn(), this.creator.hasData()]);
        if (this.isDrawn() && this.creator.hasData() && this.renderEventsOnDemand) {
            this.refreshVisibleEvents();    
        }
    },
    
    //-------------------------rendering events on demand-----------------------------
    scrolled : function () {
        if (this.renderEventsOnDemand) {
            if (this._layoutEventId) isc.Timer.clear(this._layoutEventId);
            this._layoutEventId = isc.Timer.setTimeout(this.ID + ".refreshVisibleEvents()");
            
        }       
    },
    
    getVisibleDateRange : function () {
        if (!this.renderEventsOnDemand) {
            return [this.startDate.duplicate(), this.endDate.duplicate()];    
        }
        
        var startPos = this.body.getScrollLeft();
        var endPos = startPos + this.body.getVisibleWidth();
        // round rangeStart to the nearest column start, otherwise events that are on the left
        // edge may not get rendered when sizeEventsToGrid is true
        var rangeStart = this.getDateFromPoint(startPos, true);
        var rangeEnd = this.getDateFromPoint(endPos);
        
        return [rangeStart, rangeEnd];
    },
    
    getVisibleRowRange : function () {
        if (!this.renderEventsOnDemand) {
            return [0, this.data.getLength()];    
        }
        var sTop = this.bodies[1].getScrollTop();
        var eHeight = this.eventHeight;
        var viewPortHeight = this.bodies[1].getVisibleHeight();
        var startRow = Math.floor(sTop / eHeight);
        var endRow = Math.floor((sTop + viewPortHeight) / eHeight);
        return [startRow, endRow];
    }
}); // end timelineView addProperties()

isc.Calendar.registerStringMethods({
        getDayBodyHTML : "date,events,calendar,rowNum,colNum",
        getDayHeaderHTML : "date,events,calendar,rowNum,colNum",
        dayBodyClick : "date,events,calendar,rowNum,colNum",
        dayHeaderClick : "date,events,calendar,rowNum,colNum",
        eventClick : "event,viewName",
        eventChanged : "event",
        eventMoved : "newDate,event",
        eventResized : "newDate,event"        
});

isc.DaySchedule.addClassProperties({

_eventScaffolding: [
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 5
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 10
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 15
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 20
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, 
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 24
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 5
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 10
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 15
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, // 20
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""}, 
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""},
    {label:"", day1:"", day2:"", day3:"", day4:"", day5:"", day6:"", day7:""} // 24
]

});


// Call the AutoTest method to apply Calendar-specific methods now we've loaded
isc.AutoTest.customizeCalendar();



