var drivers = {};
var passengers = {};
var from = "Anywhere";
var to = "Anywhere";

var emptyList = function() {
	var list = $('.list-group');
	list.empty();
	return list;
}

var getUniqueValues = function(arr, key) {
	return arr.map(function(element){ return element[key]; } ).filter(function(elem, index, self) {
    	return index == self.indexOf(elem);
		}).sort()
}

var isFrom = function(element) {
	return element.from == from || from == "Anywhere";
}

var displayArray = function(arr) {
	var list = emptyList();
	var tempDate = "";

	for(var i in arr){
		if(tempDate != arr[i].date) {
			tempDate = arr[i].date;
			list.append("<a class=\"list-group-item disabled\">" + tempDate + "</a>");
		}
		list.append("<a href=\"" + arr[i]["link"] + "\" class=\"list-group-item\"><span>" + arr[i].from + " - " + arr[i].to + "</span><span class=\"pull-right\">" + arr[i]["time"] + "</span></a>")		
	}
}

var populateLocationSelects() {
	var fromLocations = getUniqueValues(drivers.concat(passengers), "from");
	var toLocations = getUniqueValues(drivers.concat(passengers), "to");
	populateLocationSelect('#')
}

var populateLocationSelect(selectId, locations) {
	var selectLocationObj = $(selectId);
	selectLocationObj.empty();
	selectLocationObj.append('<option selected>Anywhere...</option>');
	for(var i in locations) {
		selectLocationObj.append('<option>' + locations[i] + '</option>')
	}
}

var displayDrivers = function() {
	$("#list-heading").text("Kind people offering a ride")
	displayArray(drivers);
	

	//fromLocations = getUniqueValues(drivers, "from");
	
	//selectFromLocation = $('#selectFromLocation');
	//selectFromLocation.empty();
	//selectFromLocation.append('<option selected>Anywhere...</option>');
	//for(var i in fromLocations) {
	//	selectFromLocation.append('<option>' + fromLocations[i] + '</option>')
	//}
}

var displayPassengers = function() {
	$("#list-heading").text("Fun people who need a ride")
	displayArray(passengers);
}

var toggleBtnClass = function(button) {
	if(button.hasClass('btn-primary')) {
		button.removeClass('btn-primary');
		button.addClass('btn-default');	
	}	
	else {
		button.removeClass('btn-default');
		button.addClass('btn-primary');	
	}
}

var toggleBtnClasses = function() {
	toggleBtnClass($('#rides-button'));
	toggleBtnClass($('#passengers-button'));
}

$(document).ready(function() {
	
	$.ajax({
		url: "http://apis.is/rides/samferda-drivers",
		dataType: "json",
		type: "GET",
		})

	.done(function(response){
		drivers = response.results;
		displayDrivers();
	})
	.fail(function(jqXHR, error, errorThrown){
		
	});

	$.ajax({
		url: "http://apis.is/rides/samferda-passengers",
		dataType: "json",
		type: "GET",
		})

	.done(function(response){
		passengers = response.results;
	})
	.fail(function(jqXHR, error, errorThrown){
		
	});

	$('#rides-button').on('click', function(){
		displayDrivers();
		toggleBtnClasses();
	})
	$('#passengers-button').on('click', function(){
		displayPassengers();
		toggleBtnClasses();
	})

})