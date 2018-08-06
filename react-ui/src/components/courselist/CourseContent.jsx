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

const CourseContent = (props) => {
	const {
		subject,
		catalogNumber,
		selectedClassIndex,
		expandCourse,
		title,
		rating,
		url,
		termsOffered,
		description,
		antireqs,
    coreqs,
		prereqs,
		postreqs,
		term,
		classes,
		taken,
		inCart,
		eligible,
		addToCartHandler,
		removeFromCartHandler,
	} = props;

	return (
		<div style={ styles.courseContent }>
			<CourseHeader
				subject={subject}
				catalogNumber={catalogNumber}
				title={title}
				rating={rating}
				url={url}
				termsOffered={termsOffered}
				addToCartHandler={addToCartHandler}
				removeFromCartHandler={removeFromCartHandler}
				taken={taken}
				inCart={inCart}
				eligible={eligible}
			/>
			<CourseDescription
				subject={subject}
				catalogNumber={catalogNumber}
				description={description}
        antireqs={antireqs}
				coreqs={coreqs}
				prereqs={prereqs}
				postreqs={postreqs}
			/>
			{
				classes.length > 0 && (
					<CourseClassList
						expandCourse={expandCourse}
						selectedClassIndex={selectedClassIndex}
						term={term}
						classes={classes}
					/>
				)
			}
		</div>
	);
};

CourseContent.propTypes = {
	subject: PropTypes.string.isRequired,
	catalogNumber: PropTypes.string.isRequired,
	selectedClassIndex: PropTypes.number.isRequired,
	expandCourse: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	rating: PropTypes.number.isRequired,
	url: PropTypes.string.isRequired,
	termsOffered: PropTypes.array.isRequired,
	antireqs: PropTypes.array.isRequired,
  coreqs: PropTypes.array.isRequired,
	prereqs: PropTypes.object.isRequired,
	postreqs: PropTypes.array.isRequired,
	term: PropTypes.string.isRequired,
	classes: PropTypes.array.isRequired,
	taken: PropTypes.bool.isRequired,
	inCart: PropTypes.bool.isRequired,
	eligible: PropTypes.bool.isRequired,
	addToCartHandler: PropTypes.func.isRequired,
	removeFromCartHandler: PropTypes.func.isRequired,
}

export default CourseContent;
