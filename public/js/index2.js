var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('bagdetect', (data) => {
	console.log(data);
	
	let latitude = data.location.latitude
	let longitude = data.location.longitude


	// axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA5aQ9SIBC6W6iUhSJg1IEQHHunN_sP4ow`)
	// 	.then((data) => {
	// 		console.log(data)
	// 	})
	
	let template = $('#alert-template').html();
		var html = Mustache.render(template, {
			camera_id : data.camera_id,
			time: moment(data.time).format('MMMM Do YYYY, h:mm:ss a'),
			screenshot_url : data.screenshot_url,
			number_of_bags : data.number_of_bags,
		});

		$('#alert-container').prepend(html);

	});
