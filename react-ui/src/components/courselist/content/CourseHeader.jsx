import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import RaisedButton from 'material-ui/RaisedButton';
import CartIcon from 'material-ui/svg-icons/maps/local-grocery-store';
import RemoveCartIcon from 'material-ui/svg-icons/action/remove-shopping-cart';
import CheckIcon from 'material-ui/svg-icons/action/check-circle';
import CourseRatings from './CourseRatings';
import { lightGreen2, green, red } from 'constants/Colours';

const styles = {
  container: {
    borderBottom: '1px solid #dbdbdb',
    textAlign: 'left',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
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
    flexWrap: 'wrap-reverse',
  },
  courseCode: {
    fontSize: 40,
    fontWeight: 400,
    margin: 'auto 0',
    marginRight: 15,
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
    textAlign: 'center',
    display: 'flex',
    flexWrap: 'wrap',
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
  const cartButton = (isMobile) => (inCart)
    ? (
      <RaisedButton
        onClick={ () => removeFromCartHandler(subject, catalogNumber) }
        label={ (isMobile) ? "" : "Remove From Cart" }
        backgroundColor={ red }
        style={ styles.button }
        icon={ <RemoveCartIcon /> }
      />
    )
    : (
      <RaisedButton
        onClick={ () => addToCartHandler(subject, catalogNumber) }
        label={ (isMobile) ? "" : "Add To Cart" }
        backgroundColor={ lightGreen2 }
        style={ styles.button }
        icon={ <CartIcon /> }
      />
    );

  let takeStatus = null;
  if (taken) takeStatus = "You've taken this course";
  else if (eligible) takeStatus = "You are eligible to take this course";

  return (
    <MediaQuery minWidth={ 600 }>
      { matches => (
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
              <div style={ styles.terms }>
                <span style={{ margin: 'auto' }}>Offered in: &nbsp;</span>
                <span style={{ margin: 'auto' }}>{ terms.join(', ') }</span>
              </div>
            )}
            { cartButton(!matches) }
          </div>
        </div>
      ) }
    </MediaQuery>
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
