import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import CartIcon from 'material-ui/svg-icons/maps/local-grocery-store';
import RemoveCartIcon from 'material-ui/svg-icons/action/remove-shopping-cart';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import CourseRatings from './CourseRatings';
import { lightGreen2, green, red } from '../../../constants/Colours';

const styles = {
  container: {
    borderBottom: '1px solid #dbdbdb',
    textAlign: 'left',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  leftContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
  },
  courseCodeContainer: {
    display: 'flex',
  },
  courseCode: {
    fontSize: 40,
    fontWeight: 400,
    margin: 'auto 0',
    whiteSpace: 'nowrap',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '30%',
    paddingTop: 10,
  },
  terms: {
    margin: '0 auto',
  },
  button: {
    margin: '10px auto',
    fontSize: 13,
  },
  taken: {
    display: 'flex',
    alignItems: 'center',
    margin: '5px 0',
    color: green,
  }
};

const CourseHeader = ({
  subject,
  catalogNumber,
  title,
  rating,
  url,
  terms,
  addToCartHandler,
  removeFromCartHandler,
  taken,
  inCart,
  eligible
}) => {
  const cartButton = (inCart)
    ? (
      <RaisedButton
        onClick={ () => removeFromCartHandler(subject, catalogNumber) }
        label="Remove From Cart"
        backgroundColor={ red }
        style={ styles.button }
        icon={ <RemoveCartIcon /> }
      />
    )
    : (
      <RaisedButton
        onClick={ () => addToCartHandler(subject, catalogNumber) }
        label="Add To Cart"
        backgroundColor={ lightGreen2 }
        style={ styles.button }
        icon={ <CartIcon /> }
      />
    );

  let takeStatus = null;
  if (taken) takeStatus = "You've taken this course";
  else if (eligible) takeStatus = "You are eligible to take this course";

  return (
    <div style={ styles.container }>
      <div style={ styles.leftContainer }>
        <div className="course-code" style={ styles.courseCodeContainer }>
          <h1 style={ styles.courseCode }>{ subject } { catalogNumber }</h1>
          <CourseRatings
            avgRating={ rating.avgRating }
            numRatings={ rating.numRatings }
            subject={ subject }
            catalogNumber={ catalogNumber }
          />
        </div>
        <a href={ url } className="course-header-title">{ title }</a>
        {
          takeStatus && (
            <div style={ styles.taken } >
              <CheckIcon style={{ marginRight: 5 }} />
              <span>{ takeStatus }</span>
            </div>
          )
        }
      </div>
      <div style={ styles.rightContainer }>
        {terms.length > 0 && (
          <span style={ styles.terms }>Offered in: {terms.join(', ')}</span>
        )}
        { cartButton }
      </div>
    </div>
  );
};

CourseHeader.propTypes = {
  subject: PropTypes.string.isRequired,
  catalogNumber: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  rating: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  terms: PropTypes.array.isRequired,
  addToCartHandler: PropTypes.func.isRequired,
  removeFromCartHandler: PropTypes.func.isRequired,
  taken: PropTypes.bool.isRequired,
  inCart: PropTypes.bool.isRequired,
  eligible: PropTypes.bool.isRequired,
};

export default CourseHeader;
