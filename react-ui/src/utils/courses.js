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

const fulfillPrereqs = (myCourses, prereqs) => {
	if (!Object.keys(prereqs).length) return true;
	// Base case: list of courses
	if (prereqs.hasOwnProperty('subject')) {
		return hasTakenCourse(prereqs.subject, prereqs.catalogNumber, myCourses);
	}

	// Inductive case: list of courses with choose
	switch (prereqs.choose) {
		case 0:
			return prereqs.reqs.reduce((acc, req) => acc && fulfillPrereqs(myCourses, req), true)
		default:
			let numRequired = prereqs.choose;
			for (var i = 0; i < prereqs.reqs.length; i++) {
				if (numRequired === 0) return true;
				if (fulfillPrereqs(myCourses, prereqs.reqs[i])) numRequired--;
			}
			return (numRequired === 0);
	}
};

const fulfillCoreqs = (myCourses, coreqs) => {
	for (let i = 0; i < coreqs.length; i++) {
		const { subject, catalogNumber } = coreqs[i];
		if (!hasTakenCourse(subject, catalogNumber, myCourses)) return false;
	}
	return true;
}

const fulfillAntireqs = (myCourses, antireqs) => {
	for (var i = 0; i < antireqs.length; i++) {
		const { subject, catalogNumber } = antireqs[i];
		if (hasTakenCourse(subject, catalogNumber, myCourses)) return false;
	}
	return true;
}

// Returns true if course can be taken by user
export const canTakeCourse = (myCourses, prereqs, coreqs, antireqs) => {
	return fulfillAntireqs(myCourses, antireqs)
		&& fulfillCoreqs(myCourses, coreqs)
		&& fulfillPrereqs(myCourses, prereqs);
}
