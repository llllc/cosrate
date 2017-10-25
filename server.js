const http = require('http');
const EventEmitter = require('events').EventEmitter;
const events = require('events');
const net = require('net');

const channel = new EventEmitter();

// http.createServer((req, res) => {
// 	print(res);
// }).listen(8000, '127.0.0.1');

channel.clients = {};
channel.subscriptions = {};

// Add a listener for the join event
channel.on('join', function(id, client) {
	this.clients[id] = client;
	this.subscriptions[id] = (senderId, message) => {
		if (id != senderId) {
			this.clients[id].write(message);
		}
	};
	this.on('broadcast', this.subscriptions[id]);
});

// Add a listener to emit the leave event
channel.on('leave', function(id) {
	channel.removeListener('broadcast', this.subscriptions[id]);
	channel.emit('broadcast', id, `${id} has left the chatroom.\n`);
});

// Remove all listeners of the broadcast type
channel.on('shutdown', () => {
	channel.emit('broadcast', '', 'The server has shut down.\n');
	channel.emitter.removeAllListeners('broadcast');
});

const server = net.createServer(client => {
	const id = `${client.remoteAddress}:${client.remotePort}`;
	channel.emit('join', id, client);
	client.on('data', data => {
		data = data.toString();
		channel.emit('broadcast', id, data);
	});
	client.on('close', () => {
		channel.emit('leave', id);
	});
})

server.listen(8888);