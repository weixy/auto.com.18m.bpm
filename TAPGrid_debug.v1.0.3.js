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
		"dijit/Tooltip",
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
		Tooltip,
		locale,
		utilities
	) {
	return declare ("TAPGrid", [_WidgetBase, _TemplatedMixin], {
		
		baseClass: "tapGridDiv",
		bindingData: null,
		dataStore: null,
		grid: null,
		context: null,
		layout: null,
		columnIndex: -1,
		showLatest: false,
		filterString: "",
		gridSelectionMode: "single",
		templateString: '\
		<div id="tapGrid">\
		</div>',
		
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
			//console.log("=====3=====");
			//console.log(row);
			
			this.grid.selection.select(row);
			this.bindingData.set("listAllSelectedIndices", [row]);
			//console.log("=====3=====");
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
					structure: this.layout,
					selectionMode: this.gridSelectionMode,
					plugins: {
						pagination: true,
						indirectSelection: true,
						filter: true						
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