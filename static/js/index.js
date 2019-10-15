var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('bagdetect', (data) => {
	console.log(data);
	
	// let latitude = data.location.latitude
	// let longitude = data.location.longitude


	
	// console.log('rasik')

	// axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyA5aQ9SIBC6W6iUhSJg1IEQHHunN_sP4ow`)
	// 	.then((data) => {
	// 		console.log(data)
	// }).catch((err) => {
	// 	console.log(err)
	// })
	
		var html = `
		
		<div class="data-container">
			<div class="accident-alert new">
				<h2><img src=${data.screenshot_url} /> </h2>	
				<h2>Camera : ${data.camera_id} </h2>
				<h2>Location : ${data.location}</h2>
				<h2>Time : ${moment(data.time).format('MMMM Do YYYY, h:mm:ss a')} </h2>
				
				<h3>${moment(data.time).startOf('minute').fromNow()}
			</div>
		</div>
			`

		$('#alert-container').prepend(html);

	});
