function flagExists(args, flag){
	let result = false;

	for(let arg of args){
		if(arg === flag){
			result = true;
		}
	}

	return result;
}

module.exports = {
	flagExists
}