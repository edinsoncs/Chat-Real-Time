'use strict'

var users = {}  


module.exports.connect = (io) => {


	io.on('connection', (client, username) => {
        
		client.on('set-nickname', (user) => {
			client.handshake.id = user;
			users[user] = user;
			//updateClients();

		});


		client.on('add-message', (message) => {
			console.log(message);
		});

		client.on('disconnect', function () {
			delete users[client.handshake.id];
			console.log('okkk');
			console.log(client.handshake.id);
			console.log('okkk');
	        updateClients(); 
	    });


		
		function updateClients() {	
	        io.sockets.emit('listmap', users);
	        console.log(users);
	    }
		

	});


}