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

var _calculateDuration = function (data) {
	var dur = Math.round((data.lastUpdateTime.getTime() - data.startTime.getTime())/1000);
	var days = Math.floor(dur/(24*60*60));
    var hours = Math.floor((dur%(24*60*60))/(60*60));
    var mins = Math.floor((dur%(60*60))/(60));
    var secs = Math.floor(dur%(60));
	var duration = (days!=0? days + " days " : "") + 
                   (hours!=0? hours + " hours " : "") + 
                   (mins!=0? mins + " mins " : "") + 
                   (secs!=0? secs + " secs" : "");
	if (duration == "") {
		if (data.lastUpdateTime.getTime() == data.startTime.getTime()) {
			duration = "Not started";
		}
		else {
			duration = " < 1 mins";
		}
	}
	return duration;
};

var _renderStatistics = function (data, index) {
	
	var connectId = "tapExecStatistics_" + index;
	var sumPts = data.sumTotalPoint;
	var maxWidth = 220;
	
	var sucPts = data.sumSuccessfulPoint;
	var sucWidth = Math.floor(maxWidth*(sucPts/sumPts));
	var falPts = data.sumFailedPoint;
	var falWidth = Math.floor(maxWidth*(falPts/sumPts));
	var blkPts = data.sumBlockedPoint;
	var blkWidth = Math.floor(maxWidth*(blkPts/sumPts));
	var wrkPts = data.sumWorkingPoint;
	var wrkWidth = Math.floor(maxWidth*(wrkPts/sumPts));
	var stpPts = data.sumStoppedPoint;
	var stpWidth = Math.floor(maxWidth*(stpPts/sumPts));
	var uatPts = data.sumUnattemptedPoint;
	var uatWidth = Math.floor(maxWidth*(uatPts/sumPts));
	
	var leftPts = stpPts + uatPts;
	
	var tags = "<div id='" + connectId + "'>";
	if (sumPts != 0 || (sucPts+falPts+blkPts+wrkPts) != 0) {
		tags += (sucPts != 0) ? ("<div style='float:left;display:block;text-align:center;background:#65C56D;border-width:1px;border-color:#65C56D;color:#ffffff;font-style:italic;width:"
			+ sucWidth + "px;'>" 
			+ sucPts + "</div>") : "";
			
		tags += (falPts != 0) ? ("<div style='float:left;display:block;text-align:center;background:#F04444;border-width:1px;border-color:#F04444;color:#ffffff;font-style:italic;width:"
			+ falWidth +"px;'>" 	
			+ falPts + "</div>") : "";
			
		tags += (blkPts != 0) ? ("<div style='float:left;display:block;text-align:center;background:#F5EE52;border-width:1px;border-color:#F5EE52;color:#ffffff;font-style:italic;width:"
			+ blkWidth +"px;'>"
			+ blkPts + "</div>") : "";
			
		tags += (wrkPts != 0) ? ("<div style='float:left;display:block;text-align:center;background:#71A0E7;border-width:1px;border-color:#71A0E7;color:#ffffff;font-style:italic;width:"
			+ wrkWidth +"px;'>"
			+ wrkPts + "</div>") : "";
		
		tags += (stpPts != 0) ? ("<div style='float:left;display:block;text-align:center;background:#CACACA;border-width:1px;border-color:#CACACA;color:#ffffff;font-style:italic;width:"
			+ stpWidth +"px;'>" 
			+ stpPts + "</div>") : "";
		
		tags += (uatPts != 0) ? ("<div style='float:left;display:block;text-align:center;background:#73DEEC;border-width:1px;border-color:#73DEEC;color:#ffffff;font-style:italic;width:"
			+ uatWidth +"px;'>" 
			+ uatPts + "</div>") : "";
		
		tags += "</div>";
	}
	else {
		
		tags += "<div style='float:left;display:block;text-align:center;color:#999999;font-style:italic;width:"
			+ maxWidth 
			+"px;'>Executed steps have no points claimed.</div>";
	}
	
	var toolTip = "<b><font color='#65C56D'>Successful:</font>&nbsp;" + sucPts 
				+ ",&nbsp;&nbsp;<font color='#F04444'>Failed:</font>&nbsp;" + falPts 
				+ ",&nbsp;&nbsp;<font color='#D5CD2A'>Blocked:</font>&nbsp;" + blkPts 
				+ ",&nbsp;&nbsp;<font color='#71A0E7'>Working:</font>&nbsp;" + wrkPts 
				+ ",&nbsp;&nbsp;<font color='#CACACA'>Stopped:</font>&nbsp;" + stpPts 
				+ ",&nbsp;&nbsp;<font color='#73DEEC'>Unattempted:</font>&nbsp;" + uatPts 
				+ "</b>";
	
	require(["dojo/ready", "dijit/Tooltip"], function(ready, Tooltip){
		ready(function(){
			new Tooltip({
				connectId: [connectId],
				position: ["above-centered", "below-centered"],
				label: toolTip
			});
		});
	});
	
	return tags;
};


