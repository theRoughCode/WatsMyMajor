export function every(array, predicate) {
	for(var i = 0; i < array.length; i++) {
		if(!predicate(array[i])) {
			return false;
		}
	}
	return true;
}