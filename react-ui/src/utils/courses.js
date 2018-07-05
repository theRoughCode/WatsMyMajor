// Check if course is in user's courses
export const hasTakenCourse = (subject, catalogNumber, myCourses) => {
	if (!myCourses || !subject || ! catalogNumber) return false;
	for (var i = 0; i < myCourses.length; i++) {
		if (myCourses[i].subject === subject &&
			myCourses[i].catalogNumber === catalogNumber) {
			return true;
		}
	}
	return false;
}

// Check if course is in cart
export const isInCart = (subject, catalogNumber, cart) => {
	for (var i = 0; i < cart.length; i++) {
		if (subject === cart[i].subject && catalogNumber === cart[i].catalogNumber) {
			return true;
		}
	}
	return false;
}
