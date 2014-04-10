var cloud = require('ti.cloud');
cloud.debug = true;

var map = require('ti.map');

var logIn = (function() { 
	// load the Cloud Module
	var Cloud = require('ti.cloud');
	// set .debug property to 'true' as we are in Development mode
	Cloud.debug = true;
	var loginUser = function(){
		Cloud.Users.login({
			login: 'com.fullsaildatasync.edu',
			password: 'avefenyx19'
		}, function(e){
			// use .info method to view login info in the Console, if successful
			if (e.success){
				var user = e.users[0];
				Ti.API.info('Success!\n' + 
					'ACS User ID: ' + user.id + '\n' + 
					'ACS App sessionId: ' + Cloud.sessionId + '\n' + 
					'ACS App Username: ' + user.username);
			} else {
				alert((e.error && e.message) || JSON.stringify(e));
			}
		});
	}; // loginUser ends
	loginUser();
	// now your app is ready to access ACS network and data services
})();


var db = Titanium.Database.open("users");
db.execute("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, user TEXT)");

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

 var data = getRowData();
 
  var tableView = Ti.UI.createTableView({
	data:data,
	editable: false,
	top: 10
});

//
// create base UI tab and root window
//
var win1 = Titanium.UI.createWindow({  
    title:'Tab 1',
    backgroundColor:"#434A7F",
    layout: "vertical"
});
var tab1 = Titanium.UI.createTab({  
    icon:'KS_nav_views.png',
    title:'Tab 1',
    window:win1
});


var remoteResponse = function() {
    Ti.API.debug(this.responseText);
    var json = JSON.parse(this.responseText);
    
    for(i=0; i < 1; i++){
    	var ups = json.data.children[i].data.ups;
    	var downs = json.data.children[i].data.downs;


    	var dataView = Ti.UI.createView({
			backgroundColor: "#999",
			top: 10,
			width: 250,
			height: 50
			
});

    	var dataView1 = Ti.UI.createView({
			backgroundColor: "#999",
			top: 10,
			width: 250,
			height: 50
			
});

    	var label = Ti.UI.createLabel({
    		text: ups,
    		top: 15,
    		color: "#333"
    	});
    	
    	var label2 = Ti.UI.createLabel({
    		text: downs,
    		top: 5,
    		color: "#333"
    	});
    	
    	dataView.add(label);
    	dataView1.add(label2);
    	
		dataView.addEventListener('click', function(e) {
			var input = ups;
			
		var saveData = escape(JSON.stringify(input));
		
		db.execute("INSERT INTO users (user) VALUES(?)", saveData);
		
		data = getRowData();
		tableView.setData(data);
		
		alert(saveData + " has been saved!");
		
	
});
		dataView1.addEventListener('click', function(e) {
			var input = downs;
			
		var saveData = escape(JSON.stringify(input));
		
		db.execute("INSERT INTO users (user) VALUES(?)", saveData);
		
		data = getRowData();
		tableView.setData(data);
		
		alert(saveData + " has been saved!");
		
	
});
    	
win1.add(dataView);
win1.add(dataView1);

    }
    
};


var remoteError = function(e) {
    Ti.API.debug("Status: " + this.status);
    Ti.API.debug("Text: " + this.responseText);
    Ti.API.debug("Error: " + e.error);
    alert("There's a problem pulling remote data");
};

var xhr = Ti.Network.createHTTPClient({
    onload: remoteResponse,
    onerror: remoteError,
    timeout:3000
});

xhr.open("GET", "http://api.reddit.com/");
xhr.send();
// Delete or Cancel
var editWindow = Ti.UI.createWindow({
	title: "this is a test",
	backgroudColor: "#fff",
	layout: "vertical"
});

var cancelButton = Ti.UI.createButton({
	title: "Cancel",
	height: 100,
	width: 100
});

editWindow.add(cancelButton);

var opts = {
	cancel: 1,
	options: ["Delete", "Cancel"],
	selectedIndex: 1,
	destrcutive: 0,
	title: "Delete or Cancel row?"
};

tableView.addEventListener("click", function(e){
	var id = e.rowData.id;
	var dataView = e.rowData.dataView;
	var dataView1 = e.rowData.dataView1;
	
	
	var dialog = Ti.UI.createOptionDialog(opts);
	
	dialog.addEventListener("click", function(e){
		if(e.index === 0) {
	db.execute("DELETE FROM users WHERE id=?", id);
	
	data = getRowData();
	tableView.setData(data);
	
	alert("Row Deleted!");
}
	});
	dialog.show();

	var cancelMagic = function(){
		cancelButton.removeEventListener("click", cancelMagic);
		editWindow.close();
	};
	cancelButton.addEventListener("click", cancelMagic);
	
	editWindow.open();

});

//
function getRowData(){
	var newData = [];
	var rows = db.execute("SELECT * FROM users");
	while (rows.isValidRow()){
		var parsedData = unescape(rows.fieldByName("user"));
		var displayData = JSON.parse(parsedData);
		
		newData.push({
			title: displayData.dataView + " " + displayData.dataView1,
			dataView: displayData.dataView,
			dataView1: displayData.dataView1,
			id: rows.fieldByName("id")
		});
		rows.next();
	}
	
	return newData;
};
//  add tabs
//

tabGroup.addTab(tab1);  
var reqt = require("data");

// open tab group
tabGroup.open();