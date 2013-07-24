var _renderStatus = function (data) {
	var tag = "";
	if (data=="COMPLETED" || data=="SUCCESSFUL"){
		tag += "<label style='border-radius:3px;background:#00831E;padding-left:4px;padding-right:5px;color:white;text-align:center;'>&#8730;</label>" +
			"<label style='padding-left:5px;color:#00831E;font-style:italic;font-weight: bold;'>";
	} else if (data=="FAILED"){
		tag += "<label style='border-radius:3px;background:#C20000;padding-left:5px;padding-right:6px;color:white;text-align:center;'>x</label>" +
			"<label style='padding-left:5px;color:#C20000;font-style:italic;font-weight: bold;'>";
	} else if (data=="WORKING"){
		tag += "<label style='border-radius:3px;background:#7CA5E4;padding-left:5px;padding-right:4px;color:white;text-align:center;'>&#62;</label>" +
			"<label style='padding-left:5px;color:#7CA5E4;font-style:italic;font-weight: bold;'>";
	} else if (data=="STOPPED") {
		tag += "<label style='border-radius:3px;background:#7A7A7A;padding-left:6px;padding-right:7px;color:white;text-align:center;'>-</label>" +
			"<label style='padding-left:5px;color:#7A7A7A;font-style:italic;font-weight: bold;'>";
	} else if (data=="BLOCKED") {
		tag += "<label style='border-radius:3px;background:#FF9900;padding-left:6px;padding-right:7px;color:white;text-align:center;'>!</label>" +
			"<label style='padding-left:5px;color:#FF9900;font-style:italic;font-weight: bold;'>";
	} else if (data=="NOTATTEMPTED") {// UNATTEMPTED
		tag += "<label style='border-radius:3px;background:#F3F3F3;padding-left:8px;padding-right:8px;color:white;text-align:center;'></label>" +
			"<label style='padding-left:5px;color:#919191;font-style:italic;font-weight: bold;'>";
	} else {
		tag += "<label style='border-radius:3px;background:#F3F3F3;padding-left:8px;padding-right:8px;color:white;text-align:center;'></label>" +
			"<label style='padding-left:5px;color:#919191;font-style:italic;font-weight: bold;'>Undefined:";
	}
	tag += (data + "</label>");
	return tag;
};

var _renderTags = function (data) {
	var tags = data.split(", ");
	var htmlStr = "<span>";
	for (var i=0; i<tags.length; i++) {
		if (tags[i] == "") {
			htmlStr += "<label style='border-width:1px;border-radius:3px;color:#999999;font-style:italic;margin:4px;padding:2px;'>None</label>";
		}
		else {
			htmlStr += "<label style='border-width:1px;border-radius:3px;border-color:#4682b4;color:#ffffff;font-style:italic;margin:4px;padding:2px;background:#a77fcc;'>" + tags[i] + "</label>";
		}
	}
	htmlStr += "</span>";
	return htmlStr;
};
					
var _renderDateTime = function (data) {
	var fmt = "MMMM dd yyyy";
	return dojo.date.locale.format(data, {datePattern: fmt});
};

var _renderLink = function (data) {
	if (this.field == "logFile") {
		return "<a href='" + data + "' class='tabLink' target='_blank'><b><u>" + "Download" + "</u></b></a>";
	}
	else if (this.field == "resultFile") {
		return "<a href='" + data + "' class='tabLink' target='_blank'><b><u>" + "View Details" + "</u></b></a>";
	}
	else {
		return "<a class='tabLink'><b><u>" + data + "</u></b></a>";
	}
};

var _renderYesOrNo = function (data) {
	var tag = "";
	if (data) {//has failures
		tag += "<label style='border-radius:5px;background:#D46E5A;padding-left:5px;padding-right:5px;color:white;text-align:center;'>Yes</label>";
	}
	else {
		tag += "<label style='border-radius:5px;background:#8692B8;padding-left:8px;padding-right:8px;color:white;text-align:center;'>No</label>";
	}
	return tag;
};



define ([
		"dojo/_base/declare",
		"dojo/data/ObjectStore",
		"dojo/store/Memory",
		"dojox/grid/EnhancedGrid",
		"dojox/grid/enhanced/plugins/Pagination",
		"dojox/grid/enhanced/plugins/IndirectSelection",
		"dojox/grid/enhanced/plugins/Filter",
		"dijit/form/CheckBox",
		"dijit/_WidgetBase", 
		"dijit/_TemplatedMixin",
		"dojo/date/locale",
		"com.ibm.bpm.coach.controls/utilities"
	], function(
		declare,
		ObjectStore,
		Memory,
		EnhancedGrid,
		Pagination,
		IndirectSelection,
		Filter,
		CheckBox,
		_WidgetBase,
		_TemplatedMixin,
		locale,
		utilities
	) {
	return declare ("TAPExecGrid", [_WidgetBase, _TemplatedMixin], {
		
		baseClass: "tapGridDiv",
		bindingData: null,
		dataStore: null,
		grid: null,
		context: null,
		columnIndex: -1,
		showLatest: false,
		filterString: "",
		gridSelectionMode: "single",
		templateString: '\
		<div id="tapGrid">\
		</div>',
		
		layoutExeuctions: [
			{'name': 'id', 'field': 'id', 'width': '70px'},
			{'name': 'Execution Set Name', 'field': 'setName', 'width': '150px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'},
			{'name': 'Release', 'field': 'release', 'width': '80px'},
			{'name': 'Build Level', 'field': 'buildLevel', 'width': '100px'},
			{'name': 'Status', 'field': 'status', 'width': '120px', 'formatter': _renderStatus},
			{'name': 'Has Failure?', 'field': 'isFailed', 'width': '80px', 'styles': 'text-align:center;', 'formatter': _renderYesOrNo},
			{'name': 'Start time', 'field': 'startTime', 'width': '180px', 'formatter': _renderDateTime},
			{'name': 'Submited?', 'field': 'isSubmitted', 'width': '70px', 'styles': 'text-align:center;', 'formatter': _renderYesOrNo}
		],
		
		layoutExecutionResults: [
			//{'name': 'id', 'field': 'id', 'width': '80px'},
			{'name': 'Case name', 'field': 'caseName', 'width': '150px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'},
			{'name': 'Status', 'field': 'status', 'width': '120px', 'formatter': _renderStatus},
			{'name': 'Environments', 'field': 'environments', 'width': '250px'},
			{'name': 'Tags', 'field': 'tags', 'width': '200px', 'formatter': _renderTags},
			{'name': 'Start time', 'field': 'startTime', 'width': '180px', 'formatter': _renderDateTime},
			{'name': 'Duration', 'field': 'Duration', 'width': '100px'}
		],
		
		layoutERDetails: [
			{'name': 'id', 'field': 'id', 'width': '80px'},
			{'name': 'Name', 'field': 'name', 'width': '150px'},
			{'name': 'Status', 'field': 'status', 'width': '130px', 'formatter': _renderStatus},
			{'name': 'Log', 'field': 'logFile', 'width': '200px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'},
			{'name': 'Result', 'field': 'resultFile', 'width': '200px', 'formatter': _renderLink, 'styles': 'cursor:pointer;'}
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
		
		_updateGridDataStore: function updateDataStore_TAPGrid() {
			//console.log("updateGridDataStore");
			//console.log(this.bindingData.items);
			//console.log("=====2.1=====");
			//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
			
			var data = this.bindingData.items.slice(0);
			if (this.bindingData._objectPath == "local.myExecutionOverviews" && this.showLatest) {
				data = this._filterLatestExecutions(data);
			}
			this.dataStore = new ObjectStore ({
				objectStore: new Memory({
					data: data
				})
			});
			this.grid.setStore(this.dataStore);
			//console.log("=====2.2=====");
			//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
		},
		
		_selectGridRow: function selectGridRow_TAPGrid (row) {
			//console.log("=====3.1=====");
			//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
			
			this.grid.selection.select(row);
			var items = this.bindingData.items;
			if (this.showLatest) { // need to find out the real row of bindingData.
				for (var i=0; i<items.length; i++) {
					var record = this.grid.getItem(row);
					if (items[i].id == this.grid.store.getValue(record, "id")) {
						this.bindingData.set("listAllSelectedIndices", [i]);
						break;
					}
				}
			}
			else {
				this.bindingData.set("listAllSelectedIndices", [row]);
			}
			
			//console.log("=====3.2=====");
			//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
		},
		
		_deSelectGridRow: function deSelectGridRow_TAPGrid (row) {
			var selIndices = this.bindingData.get("listAllSelectedIndices");
			//console.log(selIndices + " " + selIndices.length);
			for (var i=0; i<selIndices.length; i++) {
				if (selIndices[i] == row) {
					selIndices.splice(i,1);
					break;
				}
			}
			this.bindingData.set("listAllSelectedIndices", selIndices);
		},
		
		postCreate: function postCreate_TAPGrid () {
			//console.log("---- 1 ----");
			//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
			var objPath = this.bindingData._objectPath;
			
			var data = this.bindingData.items.slice(0);

			var layout;
			switch (objPath) {
				case "local.myExecutionOverviews":
					layout = this.layoutExeuctions;
					break;
				case "local.caseEROverviews":
					layout = this.layoutExecutionResults;
					break;
				case "local.scriptEROverviews":
					layout = this.layoutERDetails;
					break;
			}
			
			//console.log(this.showLatest);
			//console.log(objPath);
			if (objPath == "local.myExecutionOverviews" && this.showLatest) {
				data = this._filterLatestExecutions(data);
			}
			
			this.dataStore = new ObjectStore ({
				objectStore: new Memory({
					data: data
				})
			});
    
			if (this.grid == null || this.grid == undefined) {
				this.grid = new EnhancedGrid ({
					id: "grid",
					store: this.dataStore,
					autoHeight: true,
					autoWidth: true,
					//rowHeight: 35,
					structure: layout,
					selectionMode: this.gridSelectionMode,
					plugins: {
						pagination: true,
						indirectSelection: true,
						filter: true						
					},
					_renderStatus: function (data) {
						var tag = "";
						if (data=="COMPLETED" || data=="SUCCESSFUL"){
							tag += "<label style='border-radius:3px;background:#00831E;padding-left:4px;padding-right:5px;color:white;text-align:center;'>&#8730;</label>" +
								"<label style='padding-left:5px;color:#00831E;font-style:italic;font-weight: bold;'>";
						} else if (data=="FAILED"){
							tag += "<label style='border-radius:3px;background:#C20000;padding-left:5px;padding-right:6px;color:white;text-align:center;'>x</label>" +
								"<label style='padding-left:5px;color:#C20000;font-style:italic;font-weight: bold;'>";
						} else if (data=="WORKING"){
							tag += "<label style='border-radius:3px;background:#7CA5E4;padding-left:5px;padding-right:4px;color:white;text-align:center;'>&#62;</label>" +
								"<label style='padding-left:5px;color:#7CA5E4;font-style:italic;font-weight: bold;'>";
						} else if (data=="STOPPED") {
							tag += "<label style='border-radius:3px;background:#7A7A7A;padding-left:6px;padding-right:7px;color:white;text-align:center;'>-</label>" +
								"<label style='padding-left:5px;color:#7A7A7A;font-style:italic;font-weight: bold;'>";
						} else if (data=="BLOCKED") {
							tag += "<label style='border-radius:3px;background:#FF9900;padding-left:6px;padding-right:7px;color:white;text-align:center;'>!</label>" +
								"<label style='padding-left:5px;color:#FF9900;font-style:italic;font-weight: bold;'>";
						} else if (data=="NOTATTEMPTED") {// UNATTEMPTED
							tag += "<label style='border-radius:3px;background:#F3F3F3;padding-left:8px;padding-right:8px;color:white;text-align:center;'></label>" +
								"<label style='padding-left:5px;color:#919191;font-style:italic;font-weight: bold;'>";
						} else {
							tag += "<label style='border-radius:3px;background:#F3F3F3;padding-left:8px;padding-right:8px;color:white;text-align:center;'></label>" +
								"<label style='padding-left:5px;color:#919191;font-style:italic;font-weight: bold;'>Undefined:";
						}
						tag += (data + "</label>");
						return tag;
					},
					_renderTags: function (data) {
						var tags = data.split(", ");
						var htmlStr = "<span>";
						for (var i=0; i<tags.length; i++) {
							if (tags[i] == "") {
								htmlStr += "<label style='border-width:1px;border-radius:3px;color:#999999;font-style:italic;margin:4px;padding:2px;'>None</label>";
							}
							else {
								htmlStr += "<label style='border-width:1px;border-radius:3px;border-color:#4682b4;color:#ffffff;font-style:italic;margin:4px;padding:2px;background:#a77fcc;'>" + tags[i] + "</label>";
							}
						}
						htmlStr += "</span>";
						return htmlStr;
					},
					_renderDateTime: function (data) {
						var fmt = "MMMM dd yyyy";
						return locale.format(data, {datePattern: fmt});
					},
					_renderLink: function (data) {
						return "<a class='tabLink'><b><u>" + data + "</u></b></a>";
					},
					_renderYesOrNo: function (data) {
						var tag = "";
						if (data) {//has failures
							tag += "<label style='border-radius:5px;background:#D46E5A;padding-left:5px;padding-right:5px;color:white;text-align:center;'>Yes</label>";
						}
						else {
							tag += "<label style='border-radius:5px;background:#8692B8;padding-left:8px;padding-right:8px;color:white;text-align:center;'>No</label>";
						}
						return tag;
					}
				}, "tapGrid");
				//dojo.byId("tapGrid").appendChild(this.grid.domNode);
				this.grid.startup();
			}
			else {
				this.grid.setStore(this.dataStore);
			}
			var row = this.bindingData.get("listSelectedIndex");
			if (!!row) {this.grid.selection.select(row);}
			
			var _this = this;
			dojo.connect(this.grid, 'onCellClick', function(e){
				//console.log("=====1.1=====");
				//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
				if(e.cellIndex == _this.columnIndex) {
					//console.log("=====1.2=====");
					//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
					_this._selectGridRow(e.rowIndex);
					//console.log("=====1.3=====");
					//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
					_this.context.trigger();
					//console.log("=====1.4=====");
					//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
				}
			});
			dojo.connect(this.grid, 'onSelected', function(index){
				_this._selectGridRow(index);
			});
			dojo.connect(this.grid, 'onDeselected', function(index) {
				_this._deSelectGridRow(index);
			});
			//console.log("---- 2 ----");
			//console.log(locale.format(new Date(), {datePattern: "MMMM dd yyyy hh:mm:ss"}));
		}
		
	});

});