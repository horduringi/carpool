var drivers = {};
var passengers = {};
var from = "Anywhere...";
var to = "Anywhere...";

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
	return element.from == from || from == "Anywhere...";
}

var isTo = function(element) {
	return element.to == to || to == "Anywhere...";
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
	if(list.children().length == 0) {
		list.append("<a class=\"list-group-item disabled\">" + emptyText() + "</a>");
	}
}

var emptyText = function() {
	if($('#rides-button').hasClass('btn-primary'))
	{
		return 'Nobody offering a ride.';
	}
	else
	{
		return 'No passengers looking for a ride.';
	}
}

var populateLocationSelects = function() {
	var fromLocations = getUniqueValues(drivers.concat(passengers), "from");
	var toLocations = getUniqueValues(drivers.concat(passengers), "to");
	// locations contains all locations to and from whether you are a passenger or a driver
	var locations = fromLocations.concat(toLocations).filter(function(elem, index, self) {
		return index == self.indexOf(elem);
	}).sort()
	
	populateLocationSelect('#selectFromLocation', locations);
	populateLocationSelect('#selectToLocation', locations);
}

var populateLocationSelect = function(selectId, locations) {
	var selectLocationObj = $(selectId);
	selectLocationObj.empty();
	selectLocationObj.append('<option selected>Anywhere...</option>');
	for(var i in locations) {
		selectLocationObj.append('<option>' + locations[i] + '</option>')
	}
}

var displayDrivers = function() {
	$("#list-heading").text("Kind people offering a ride")
	displayArray(drivers.filter(isFrom).filter(isTo));
}

var displayPassengers = function() {
	$("#list-heading").text("Fun people who need a ride")
	displayArray(passengers.filter(isFrom).filter(isTo));
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
	asyncDrivers = $.ajax({
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

	asyncPassengers = $.ajax({
		url: "http://apis.is/rides/samferda-passengers",
		dataType: "json",
		type: "GET",
		})

	.done(function(response){
		passengers = response.results;
	})
	.fail(function(jqXHR, error, errorThrown){
		
	});

	$.when(asyncDrivers, asyncPassengers).done(function(){
		populateLocationSelects();
	})

	$('#rides-button').on('click', function(){
		if($(this).hasClass('btn-default'))
		{
			toggleBtnClasses();
			displayDrivers();
		}
	})
	$('#passengers-button').on('click', function(){
		if($(this).hasClass('btn-default'))
		{
			toggleBtnClasses();
			displayPassengers();	
		}
	})

	$('select#selectFromLocation').change( function() {
	    from = $(this).val();
	    if($('#rides-button').hasClass('btn-primary'))
	    {
	    	displayDrivers();
	    }
	    else
	    {
	    	displayPassengers();
	    }
	});

	$('select#selectToLocation').change( function() {
	    to = $(this).val();
	    if($('#rides-button').hasClass('btn-primary'))
	    {
	    	displayDrivers();
	    }
	    else
	    {
	    	displayPassengers();
	    }
	});
})