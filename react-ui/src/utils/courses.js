// Check if course is in user's courses
export const hasTakenCourse = (subject, catalogNumber, myCourses) => {
	if (myCourses[subject] == null) return false;
	const advancedCSCatNum = catalogNumber + 'E';
	return myCourses[subject].hasOwnProperty(catalogNumber) ||
		myCourses[subject].hasOwnProperty(advancedCSCatNum);
}

// Check if taken a course in range
export const getTakenCoursesInRange = (subject, from, to, myCourses) => {
	if (myCourses[subject] == null) return [];
	const fromNum = Number(from.trim());
	const toNum = Number(to.trim());
	if (isNaN(from)) {
		console.error(`From: ${from} is not a number!`);
		return [];
	}
	if (isNaN(to)) {
		console.error(`To: ${to} is not a number!`);
		return [];
	}

	const catNums = Object.keys(myCourses[subject]);
	return catNums.filter((catNum) => {
		const num = Number(catNum.replace(/\D/g,'').trim());
		if (isNaN(num)) {
			console.error(`Catalog number ${num} (${catNum}) is not a number!`);
			return false;
		}
		return (num >= fromNum && num <= toNum);
	});
}

// Check if course is in cart
export const isInCart = (subject, catalogNumber, arr) => {
	for (var i = 0; i < arr.length; i++) {
		if (subject === arr[i].subject && catalogNumber === arr[i].catalogNumber) {
			return true;
		}
	}
	return false;
}

const fulfillPrereqs = (myCourses, prereqs) => {
	if (!Object.keys(prereqs).length) return true;
	// Base case: course
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
