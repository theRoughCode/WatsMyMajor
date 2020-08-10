import React from 'react';
import PropTypes from 'prop-types';
import UnitsIcon from 'material-ui/svg-icons/communication/import-contacts';
import EnrolledIcon from 'material-ui/svg-icons/action/account-circle';
import WaitingIcon from 'material-ui/svg-icons/social/people';
import BlockIcon from 'material-ui/svg-icons/content/block';
import TopicIcon from 'material-ui/svg-icons/av/web';

const styles = {
  icon: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  info: {
    display: 'flex',
    marginTop: 10,
  },
  container: {
    textAlign: 'left',
    fontSize: 15,
    padding: '10px 20px',
    paddingBottom: 0,
  },
};

const Info = ({ icon, info }) => (
  <div style={styles.info}>
    {icon}
    {info}
  </div>
);

Info.propTypes = {
  icon: PropTypes.object.isRequired,
  info: PropTypes.string.isRequired,
};

const ClassInfo = ({
  units,
  topic,
  attending,
  enrollmentCap,
  waiting,
  waitingCap,
  reserved,
  reserveCap,
  reserveGroup,
}) => (
  <div style={styles.container}>
    <Info icon={<UnitsIcon style={styles.icon} />} info={`Units: ${units}`} />
    {topic.length > 0 && <Info icon={<TopicIcon style={styles.icon} />} info={`Topic: ${topic}`} />}
    <Info icon={<EnrolledIcon style={styles.icon} />} info={`Attending: ${attending}`} />
    <Info icon={<div style={styles.icon} />} info={`Enrollment cap: ${enrollmentCap}`} />
    <Info icon={<WaitingIcon style={styles.icon} />} info={`Waiting: ${waiting}`} />
    <Info icon={<div style={styles.icon} />} info={`Waiting cap: ${waitingCap}`} />
    <Info icon={<BlockIcon style={styles.icon} />} info={`Reserved: ${reserved}`} />
    <Info icon={<div style={styles.icon} />} info={`Reserved cap: ${reserveCap}`} />
    {reserveGroup.length > 0 && (
      <Info icon={<div style={styles.icon} />} info={`Reserve group: ${reserveGroup}`} />
    )}
  </div>
);

ClassInfo.propTypes = {
  units: PropTypes.number.isRequired,
  topic: PropTypes.string.isRequired,
  attending: PropTypes.number.isRequired,
  enrollmentCap: PropTypes.number.isRequired,
  waiting: PropTypes.number.isRequired,
  waitingCap: PropTypes.number.isRequired,
  reserved: PropTypes.number.isRequired,
  reserveCap: PropTypes.number.isRequired,
  reserveGroup: PropTypes.string.isRequired,
};

export default ClassInfo;
