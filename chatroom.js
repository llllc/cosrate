const http = require('http');
const EventEmitter = require('events').EventEmitter;
const events = require('events');
const net = require('net');

// Create an instance of the EventEmitter object
const channel = new EventEmitter();

channel.clients = {};
channel.subscriptions = {};

// Register a listener for the join event
channel.on('join', function(id, client) {
	// Setup welcome messages with current guest count
	const welcome = `
	Welcome! Guests online: ${this.listeners('broadcast').length+1}
	`;
	client.write(`${welcome}\n`);
	this.clients[id] = client;
	this.subscriptions[id] = (senderId, message) => {
		if (id != senderId) {
			this.clients[id].write(senderId + ': ' + message);
		}
	};
	this.on('broadcast', this.subscriptions[id]);
});

// Register a listener for the leave event
channel.on('leave', function(id) {
	channel.removeListener('broadcast', this.subscriptions[id]);
	// triggers a broadcast event
	channel.emit('broadcast', id, `${id} has left the chatroom.\n`);
});

// Register a listener for shutdown event
channel.on('shutdown', () => {
	// triggers a broadcast event
	channel.emit('broadcast', '', 'The server has shut down.\n');
	channel.emitter.removeAllListeners('broadcast');
});

const server = net.createServer(client => {
	const id = `${client.remoteAddress}:${client.remotePort}`;
	channel.emit('join', id, client);

	client.on('data', data => {
		data = data.toString();
		if (data === 'shutdown\r\n') {
			channel.emit('shutdown\r\n');
		}
		channel.emit('broadcast', id, data);
	});

	client.on('close', () => {
		channel.emit('leave', id);
	});
})

let color = 'blue';
(color => {
	console.log('the color is', color);
})(color);

server.listen(8888);

