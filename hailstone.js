// https://www.youtube.com/watch?v=094y1Z2wpJg&t=3s

const fs = require('fs');

const randomBigInt = (numberOfDigits)=>{
	let bigIntString = '';
	for(let n=0;n<numberOfDigits;n++){
		bigIntString += Math.floor(Math.random()*10)
	}
	return BigInt(bigIntString);
}

const hailstone = {
	go: (cur,iterations=1,memo={})=>{
		if(cur == 1){
			return iterations;
		}
		iterations++;
		if(cur.toString() in memo){
			console.log(`${cur} is in a non 1 loop`);
			fs.writeFileSync('./results.json',JSON.stringify({non1Loop: cur.toString()}));
			return;
		}
		memo[cur] = true;
		if(cur%BigInt(2) == 0){
			return hailstone.go(cur/BigInt(2),iterations,memo);
		} else {
			return hailstone.go((cur*BigInt(3))+BigInt(1),iterations,memo);
		}
	},
	mainLoop: (cur,gapDigits=16,updateIterations=10000)=>{
		let now = new Date();
		let iteration = 1;
		while(true){
			let stoppingTime = hailstone.go(cur);
			if(iteration%updateIterations == 0){
				var newNow = new Date();
				console.log(`${cur} returned to 1 in ${stoppingTime} iterations (${(newNow-now)/1000} seconds)`);
				fs.writeFileSync('./state.json',JSON.stringify({iteration: cur.toString()}));
				now = newNow;
			}
			iteration++;
			cur+=randomBigInt(gapDigits);
		}
	}
};

let lastIteration = JSON.parse(fs.readFileSync('./state.json')).iteration;
console.log(hailstone.mainLoop(BigInt(lastIteration)+BigInt(1)));