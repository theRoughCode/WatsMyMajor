import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    margin: 10,
    marginTop: 30,
  },
  header: {
    fontSize: 30,
    fontWeight: 500,
  },
  bodyContainer: {
    width: '60%',
    padding: 20,
    paddingTop: 0,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    whiteSpace: 'pre-line',
    lineHeight: 1.5,
  },
  h1: {
    fontSize: 18,
    fontWeight: 500,
    marginTop: 20,
  },
  h2: {
    marginTop: 20,
  },
  paragraph: {
    marginTop: 10,
  },
  footer: {
    margin: 10,
    marginTop: 50,
    fontSize: 12,
    color: '#888e99',
  },
};

const PrivacyPolicy = () => (
  <div style={styles.container}>
    <div style={styles.headerContainer}>
      <span style={styles.header}>Privacy Policy</span>
    </div>
    <Paper style={styles.bodyContainer}>
      <span style={styles.h1}>How We Collect and Use Information</span>
      <span style={styles.paragraph}>We collect the following types of information about you:</span>
      <i style={styles.h2}>Information you provide us directly:</i>
      <span style={styles.paragraph}>
        We ask for information such as your name and UWaterloo email address when you register for a
        WatsMyMajor account. We use this information to verify the user and provide to you the
        functionality of the Service.
      </span>
      <span style={styles.paragraph}>
        We also store the courses you have added to your course list, cart, and calendar in our
        database to provide you with the features that the Service provides. We use this data to
        compile statistics of all our user's courses to provide additional features like 'Most
        Popular Courses'.
      </span>
      <i style={styles.h2}>Information we may receive from third parties:</i>
      <span style={styles.paragraph}>
        We may receive information about you from third parties, such as Facebook, should you choose
        to link your WatsMyMajor account to a Facebook account. We collect your Facebook ID to be
        used to link to your WatsMyMajor account and your profile picture to be used in the Service.
        You may opt out of this at anytime by unlinking your Facebook account in the Settings page.
      </span>
      <i style={styles.h2}>Analytics Information:</i>
      <span style={styles.paragraph}>
        We may collect analytics data using Facebook Analytics to help us measure traffic and how
        users interact with the Service to improve your experience.
      </span>
      <i style={styles.h2}>Cookies Information:</i>
      <span style={styles.paragraph}>
        When you log in on the Service, we may send one or more cookies (a small text file of
        alphanumeric characters) to your browser that uniquely identifies your account. This helps
        us persist your logged in account across sessions. The cookie is removed upon logging out of
        the account.
      </span>
      <span style={styles.h1}>Sharing of Your Information</span>
      <span style={styles.paragraph}>
        We do not share your information to any third party source or to any of our users, except as
        noted below:
      </span>
      <ul>
        <li>
          Developers on the app have access to the database and your information in order to provide
          the Service.
        </li>
        <li>
          Our third party database service (Firebase) is used for storage of all our Service's and
          it's user's data.
        </li>
      </ul>
      <span style={styles.h1}>How We Store and Protect Your Information</span>
      <i style={styles.h2}>Storage and Processing:</i>
      <span style={styles.paragraph}>
        Your information collected through the Service may be stored and processed in the United
        States or any country in which Firebase maintains its facilities. WatsMyMajor may transfer
        information that we collect about you, including personal information, to affiliated
        entities, or to other third parties across borders and from your country or jurisdiction to
        other countries or jurisdictions around the world. If you are located in the European Union
        or other regions with laws governing data collection and use that may differ from U.S. law,
        please note that we may transfer information, including personal information, to a country
        and jurisdiction that does not have the same data protection laws as your jurisdiction, and
        you consent to the transfer of information to the U.S. or any other country in which
        WatsMyMajor or its service providers maintain facilities and the use and disclosure of
        information about you as described in this Privacy Policy.
      </span>
      <i style={styles.h2}>Keeping Your Information Safe:</i>
      <span style={styles.paragraph}>
        We care about the security of our user's data. We use commercially reasonable safeguards to
        preserve the integrity and security of all information collected through our Service. To
        protect your privacy, we take reasonable steps (such as encrypting your password before
        storing it in our database) when storing your information. However, WatsMyMajor cannot
        ensure or warrant the security of any information you transmit to WatsMyMajor or guarantee
        that information on the Service may not be accessed, disclosed, altered, or destroyed.
        WatsMyMajor is not responsible for the functionality or security measures of any third party
        that you have linked to your WatsMyMajor account.
      </span>
      <i style={styles.h2}>Compromise of Information:</i>
      <span style={styles.paragraph}>
        In the event of a security breach where our user's information is compromised, WatsMyMajor
        will take reasonable steps to investigate the situation and notify any individuals whose
        information may have been compromised.
      </span>
      <span style={styles.h1}>Links to Other Websites and Services</span>
      <span style={styles.paragraph}>
        WatsMyMajor is not responsible for the practices employed by websites linked from or to the
        Service. When you navigate away from our website, our Privacy Policy does not apply. This
        Privacy Policy does not apply to information we collect by other means or sources other than
        the Service.
      </span>
    </Paper>
    <div style={styles.footer}>
      <span>
        This Privacy Policy was created with the help of WikiHow's sample Privacy Policy which can
        be found <a href="https://www.wikihow.com/Sample/WikiHow-Privacy-Policy">here</a>.
      </span>
    </div>
  </div>
);

export default PrivacyPolicy;
