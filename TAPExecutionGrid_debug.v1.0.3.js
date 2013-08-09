define ([
	"dojo/_base/declare"
], function (
	declare
) {
	var TAPExecutionGrid = {};
	
	TAPExecutionGrid = declare("TAPExecutionGrid", TAPGrid, {
		layout: [
			//{'name': 'id', 'field': 'id', 'width': '70px'},
			{'name': 'Execution Set Name', 'field': 'setName', 'width': '150px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'},
			{'name': 'Release', 'field': 'release', 'width': '80px'},
			{'name': 'Build Level', 'field': 'buildLevel', 'width': '100px'},
			{'name': 'Status', 'field': 'status', 'width': '120px', 'formatter': _renderStatus},
			{'name': 'Has Failure?', 'field': 'isFailed', 'width': '80px', 'styles': 'text-align:center;', 'formatter': _renderYesOrNo},
			{'name': 'Start time', 'field': 'startTime', 'width': '180px', 'formatter': _renderDateTime},
			{'name': 'Submited?', 'field': 'isSubmitted', 'width': '70px', 'styles': 'text-align:center;', 'formatter': _renderYesOrNo}
		],
		
		_filterLatestExecutions: function filterLatestExecution_TAPGrid(items) {
			
			for (var i=0; i<items.length; i++) {
				//console.log("---- filter obj " + i + " ----");
				//console.log(items[i]);
				for (var j=i+1; j<items.length; j++) {
					//console.log("---- navigate obj " + j + " ----");
					//console.log(items[j]);
					if (items[i].executionSetId == items[j].executionSetId &&
						items[i].release == items[j].release &&
						items[i].buildLevel == items[j].buildLevel) {
							//console.log("---- found matched ----");
							//console.log(items[i]);
							//console.log(items[j]);
							if (items[i].startTime < items[j].startTime) {
								items.splice(i, 1, items[j]);
							}
							items.splice(j, 1);
							j--;
						}
				}
			}
			return items;
		},
		
		_selectGridRow: function selectGridRow_TAPGrid (row) {
			//console.log("=====3.1=====");
			//console.log(row);
			this.grid.selection.select(row);
			var items = this.bindingData.items;
			//console.log(items[row]);
			for (var i=0; i<items.length; i++) {
				var record = this.grid.getItem(row);
				if (items[i].id == this.grid.store.getValue(record, "id")) {
					this.bindingData.set("listAllSelectedIndices", [i]);
					break;
				}
			}
			
			//console.log("=====3.1=====");
			//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
		}
	});
	
	return TAPExecutionGrid;
});