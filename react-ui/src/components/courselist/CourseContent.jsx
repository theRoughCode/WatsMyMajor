import React from 'react';
import PropTypes from 'prop-types';
import CourseHeader from './content/CourseHeader';
import CourseDescription from './content/CourseDescription';
import CourseClassList from './content/CourseClassList';

const styles = {
	courseContent: {
		height: '100%',
	  display: 'flex',
		flexWrap: 'wrap',
	}
}

const CourseContent = ({
	subject,
	catalogNumber,
	selectedClassIndex,
	expandClass,
	taken,
	inCart,
	eligible,
	addToCartHandler,
	removeFromCartHandler,
	course
}) => {
	const {
		title,
		description,
		rating,
		url,
		termsOffered,
		crosslistings,
		antireqs,
		coreqs,
		prereqs,
		postreqs,
		term,
		classes,
	} = course;

	return (
		<div style={ styles.courseContent }>
			<CourseHeader
				subject={ subject }
				catalogNumber={ catalogNumber }
				title={ title }
				rating={ rating }
				url={ url }
				termsOffered={ termsOffered }
				addToCartHandler={ addToCartHandler }
				removeFromCartHandler={ removeFromCartHandler }
				taken={ taken }
				inCart={ inCart }
				eligible={ eligible }
			/>
			<CourseDescription
				subject={ subject }
				catalogNumber={ catalogNumber }
				description={ description }
				crosslistings={ crosslistings }
        antireqs={ antireqs }
				coreqs={ coreqs }
				prereqs={ prereqs }
				postreqs={ postreqs }
			/>
			{
				classes.length > 0 && (
					<CourseClassList
						expandClass={ expandClass }
						selectedClassIndex={ selectedClassIndex }
						term={ term }
						classes={ classes }
					/>
				)
			}
		</div>
	);
};

CourseContent.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	course: PropTypes.object.isRequired,
	selectedClassIndex: PropTypes.number.isRequired,
	expandClass: PropTypes.func.isRequired,
	taken: PropTypes.bool.isRequired,
	inCart: PropTypes.bool.isRequired,
	eligible: PropTypes.bool.isRequired,
	addToCartHandler: PropTypes.func.isRequired,
	removeFromCartHandler: PropTypes.func.isRequired,
}

export default CourseContent;
