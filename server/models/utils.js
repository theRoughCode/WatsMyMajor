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
	if (!Array.isArray(reqArr)) return {};

	const reqs = reqArr.slice(!isNaN(reqArr[0])).map(req => {
		if (Array.isArray(req)) {
			// [1, 'CS136']
			if (!isNaN(req[0]) && req.slice(1).length === 1) return parseCourse(req[1]);
			else return nestReqs(req);
		} else return parseCourse(req);
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

// Converts weird data formatting to pick format
function unpick(str) {
	str = str.replace(/\s*and\s*/g,',');

	if (str.includes('of')) {
		var choose = str.slice(0, 3);
		switch(choose) {
			case 'One':
				choose = 1;
				break;
			case 'Two':
				choose = 2;
				break;
			case 'All':
				choose = null;
				break;
			default:
				return str;
		}
		const arr = str.slice(6,-1).replace(/\s+/g,'').replace('/', ',').split(',');
		return { choose, reqs: arr };
	} else if (str.includes(' or')) { // ASSUMING ONLY ONE GROUP OF 'or'
		var open = str.indexOf('(');
		var close = str.indexOf(')');
		// replace 'or' with comma and split into array
		var arr = str.slice(open + 1, close).replace(/or/g,', ').replace(/\s/g, '').split(',');
		arr.unshift(1); // add 1 to front
		// Remove special chars
		var checkSpecial = new RegExp('[^A-z0-9,]|\s', 'g');
		arr = [arr];
		// remove 'arr' from original string and exclude commas before and after
		str = str.slice(0, (open !== -1) ? open - 1 : open).concat(str.slice(close + 2));
		arr.push(...str.replace(checkSpecial, '').split(','));
		return arr;
	} else return parseCourse(str);
}




module.exports = {
	parseCourse,
	nestReqs,
	parseReqs,
	unpick
};
