// Separate subject, catalog number, and title from course string
function parseCourse(courseStr) {
	// Get title
	let title = null;
	let index = courseStr.indexOf('-');
	if (index !== -1) {
		title = courseStr.slice(index + 1).trim();
		courseStr = courseStr.slice(0, index).trim();
	}

	// Remove unnecessary whitespace
	courseStr = courseStr.replace(/\s/g, '');

	// Search for numbers
	index = courseStr.search(/[0-9]/);
	if (index === -1) return {
		subject: courseStr.toUpperCase(),
		catalogNumber: ''
	};

	const subject = courseStr.slice(0, index).toUpperCase();
	const catalogNumber = courseStr.slice(index);

	return {
		subject,
		catalogNumber,
		title
	};
}

// Nests "choose" requisites
function nestReqs(reqArr) {
	if (!reqArr) return null;

	const reqs = reqArr.slice(!isNaN(reqArr[0])).map(req => {
		if (Array.isArray(req)) return nestReqs(req);
		else return utils.parseCourse(req);
	});
	return {
		choose: (!isNaN(reqArr[0])) ? Number(reqArr[0]) : 0,
		reqs
	};
}

// Format requisites into required structure
//  { subject, catalogNumber }
function parseReqs(arr) {
	return arr.reduce((acc, req, index) => {
		if (typeof req === 'string') {
			req = unpick(req);
			// add course subject for those without
			if (index > 0 && !req.subject) {
				let prev = acc[acc.length - 1];
				if (Array.isArray(prev)) prev = prev[prev.length - 1];  // get last elem
				req.subject = prev.subject;
			}
		}
		acc.push(req);
		return acc;
	}, []);
}




module.exports = {
	parseCourse,
	nestReqs,
	parseReqs
};
