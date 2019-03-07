/**
 * Checks if a flag exists inside of a argument list.
 * @param {array} args - A list of arguments.
 * @param {string} flag - The flag to check.
 */
function flagExists(args, flag){
	let result = false;

	for(let arg of args){
		if(arg === flag){
			result = true;
		}
	}

	return result;
}

/**
 * Gets the current time in milliseconds.
 */
function now(){
	return new Date().getTime();
}

module.exports = {
	flagExists,
	now
}