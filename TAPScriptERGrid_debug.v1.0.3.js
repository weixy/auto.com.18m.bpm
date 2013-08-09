define ([
	"dojo/_base/declare"
], function (
	declare
) {
	var TAPScriptERGrid = {};
	
	TAPScriptERGrid = declare("TAPScriptERGrid", TAPGrid, {
		layout: [
			//{'name': 'id', 'field': 'id', 'width': '80px'},
			{'name': 'Name', 'field': 'name', 'width': '150px'},
			{'name': 'Status', 'field': 'status', 'width': '130px', 'formatter': _renderStatus},
			{'name': 'Log', 'field': 'logFile', 'width': '200px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'},
			{'name': 'Result', 'field': 'resultFile', 'width': '200px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'}
		]
	});
	
	return TAPScriptERGrid;
});