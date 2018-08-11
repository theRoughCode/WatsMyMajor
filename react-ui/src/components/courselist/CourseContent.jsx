import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import CourseHeader from './content/CourseHeader';
import CourseDescription from './content/CourseDescription';
import CourseClassList from './content/CourseClassList';
import CourseRequisites from './content/CourseRequisites';

const styles = {
	courseContent: {
		height: '100%',
	  display: 'flex',
		flexWrap: 'wrap',
	  padding: '20px 40px',
	},
	bodyContainer: {
		display: 'flex',
		marginTop: 25,
	},
	rightContainer: {
		display: 'flex',
		flexDirection: 'column',
		marginRight: 20,
	},
	leftContainer: {
		display: 'flex',
		flexDirection: 'column',
		margin: 20,
	},
	treeButton: {
		width: '100%'
	},
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
		<div style={ styles.bodyContainer }>
				<div style={ styles.rightContainer }>
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
				<div style={ styles.leftContainer }>
					<Link to={ `/tree/prereqs/${subject}/${catalogNumber}` }>
						<RaisedButton
							label="View Requisites Tree"
							style={ styles.treeButton }
						/>
					</Link>
					<CourseRequisites
						antireqs={ antireqs }
						coreqs={ coreqs }
						prereqs={ prereqs }
						postreqs={ postreqs }
					/>
				</div>
			</div>
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
