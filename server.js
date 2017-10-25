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

channel.on('join', function(id, client) {
	this.clients[id] = client;
	this.subscriptions[id] = (senderId, message) => {
		if (id != senderId) {
			this.clients[id].write(message);
		}
	};
	this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function(id) {

});

const server = net.createServer(client => {
	const id = `${client.remoteAddress}:${client.remotePort}`;
	channel.emit('join', id, client);
	client.on('data', data => {
		data = data.toString();
		channel.emit('broadcast', id, data);
	})
})

server.listen(8888);
// function print(res) {
// 	console.log("test");
// }