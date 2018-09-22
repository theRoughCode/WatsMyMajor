# Contributing to WatsMyMajor

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to WatsMyMajor, which is hosted on https://www.watsmymajor.com. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## How Can I Contribute?
### Reporting Bugs
If you've found a bug, follow these steps:
1) Check the [current list of issues](https://github.com/theRoughCode/WatsMyMajorBeta/issues) to see if a similar issue has already been posted.
2) If it has already been posted, verify if it describes the same problem as you encountered.  If it's not exactly the same, you can add details of your bug report as a comment to that issue.
3) If a similar issue has not yet been logged, [create a new issue](https://github.com/theRoughCode/WatsMyMajorBeta/issues/new?template=bug_report.md).
4) Check out our [bug reporting template](https://github.com/theRoughCode/WatsMyMajorBeta/blob/master/.github/ISSUE_TEMPLATE/bug_report.md) for tips on making a good bug report!
### Suggesting New Features
If you would like to see a feature being implemented, you can also create an issue for that!
1) Check the [list of issues](https://github.com/theRoughCode/WatsMyMajorBeta/issues?q=is%3Aissue+is%3Aopen+label%3A%22Feature+Request%22) to see if your feature request has already been filed.
2) If it has, you can add a comment to expound on what you think this feature should include!
3) If your feature request has not yet been thought of, create a new issue [here](https://github.com/theRoughCode/WatsMyMajorBeta/issues/new?template=feature_request.md).
4) Check out our [feature request template](https://github.com/theRoughCode/WatsMyMajorBeta/blob/master/.github/ISSUE_TEMPLATE/feature_request.md) for more details.
### Code Contribution
Unsure where to begin contributing to WatsMyMajor? You can start by looking through `good first issue` issues [here](https://github.com/theRoughCode/WatsMyMajorBeta/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22).
WatsMyMajor's code base is divided up into 2 directories:
- server: Node.js backend that contains the logic for the app
- react-ui: React frontend that serves the web app
#### Run the API Server

In a terminal:

```bash
# Initial setup
npm install

# Start the server
npm start
```


#### Run the React UI

The React app is configured to proxy backend requests to the local Node server. (See [`"proxy"` config](react-ui/package.json))

In a separate terminal from the API server, start the UI:

```bash
# Always change directory, first
cd react-ui/

# Initial setup
npm install

# Start the server
npm start
```
#### Styleguide
We currently don't have documentation for style guide, but we have eslint.  Before submitting your PR, run `npm run lint` to ensure that your code follows our eslint style guide.

### Pull Requests
Please follow these steps to have your contribution considered by the maintainers:
1. Follow all instructions in [the template](https://github.com/theRoughCode/WatsMyMajorBeta/blob/master/.github/pull_request_template.md)
3. After you submit your pull request, verify that all [status checks](https://help.github.com/articles/about-status-checks/) are passing <details><summary>What if the status checks are failing?</summary>If a status check is failing, and you believe that the failure is unrelated to your change, please leave a comment on the pull request explaining why you believe the failure is unrelated. A maintainer will re-run the status check for you. If we conclude that the failure was a false positive, then we will open an issue to track that problem.</details>

While the prerequisites above must be satisfied prior to having your pull request reviewed, the reviewer(s) may ask you to complete additional design work, tests, or other changes before your pull request can be ultimately accepted.
