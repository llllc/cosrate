
function first() {
	const firstVar = "1";
	console.log("this is the function #:", firstVar);
	next(null, firstVar);
}

function second(firstVar) {
	const secondVar = "2";
	console.log("function", firstVar, "has completed. Onto function #:", secondVar);
	const arr = [firstVar, secondVar];
	next(null, arr);
}

function third(arr) {
	const thirdVar = "3";
	console.log("function", thirdVar, "is done running. So is", arr[0], "and", arr[1]);
}

const queue = [
	first,
	second,
	third, 
];

function next(err, result) {
	if (err) throw err;
	// Moves on to the next thing on the queue by shifiting the queue
	const currentQueue = queue.shift();
	// Executes the function listed in the queue using the result passed in
	if (currentQueue) {
		currentQueue(result);
	}
}

next();