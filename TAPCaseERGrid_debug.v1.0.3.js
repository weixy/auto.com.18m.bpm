define ([
	"dojo/_base/declare"
], function (
	declare
) {
	var TAPCaseERGrid = {};
	
	TAPCaseERGrid = declare("TAPCaseERGrid", TAPGrid, {
		layout: [
			//{'name': 'id', 'field': 'id', 'width': '80px'},
			{'name': 'Case name', 'field': 'caseName', 'width': '150px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'},
			{'name': 'Status', 'field': 'status', 'width': '120px', 'formatter': _renderStatus},
			{'name': 'Environments', 'field': 'environments', 'width': '250px'},
			{'name': 'Statistics', 'field': '_item', 'width': '220px', 'formatter': _renderStatistics},
			{'name': 'Tags', 'field': 'tags', 'width': '150px', 'formatter': _renderTags},
			{'name': 'Start time', 'field': 'startTime', 'width': '180px', 'formatter': _renderDateTime},
			{'name': 'Duration', 'field': '_item', 'width': '100px', 'formatter': _calculateDuration}
		]
	});
	
	return TAPCaseERGrid;
});