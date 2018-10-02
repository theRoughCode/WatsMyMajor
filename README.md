# WatsMyMajor <img src="https://raw.githubusercontent.com/theRoughCode/WatsMyMajor/master/react-ui/src/images/logo.png" alt="logo" width="100">
This project was inspired when I was considering doing a double major in Mathematical Physics and Computer Science at the University of Waterloo.  To plan it out, I had to create a giant spreadsheet in Google Sheets and see if I could fulfill the requirements for both majors while still graduating on time.  Here's a screenshot of a part of it:
<p align="center">
  <img src="https://user-images.githubusercontent.com/19257435/42981890-7a2312c4-8b93-11e8-9896-ed00712e4ee7.png" alt="logo" width="750" height="auto">
 </p>

After all the effort, it turned out that it was definitely not possible, even if I took 6 courses every term till I graduate. This is an issue that almost every student faces (unless you have all your courses planned out for you  *cough* Engineering kids *cough*).  I've even met a TA who had to stay back one term because he did not meet a requirement to graduate!  I find it crazy that students who are already paying tuition fees have such a difficult time planning out their courses and majors.

After this feat, I realized that a lot of what I was doing in Google Sheets was repetitive and automatable.  That meant that I could write a program to do it for me. And thus, WatsMyMajor was born.

## What It Does
WatsMyMajor is a web app that assists University of Waterloo students in planning their courses.

### Viewing Courses
<p align="center">
  <img src="https://user-images.githubusercontent.com/19257435/42982274-75652db0-8b95-11e8-8471-a1b185ba4532.png" alt="logo" width="750" height="auto">
 </p>
The most accessible feature is viewing courses.  This is done by typing a course in the search bar. This page provides a summary of the course, including:
- subject & catalog number
- title of course
- terms offered
- description of course
- whether you're eligible for the course
- ability to add the course to your cart
- current term's class list
  - Clicking on a row in the class list will open up an expanded view where more information about the availability of the class is shown, together with any stats about the instructor teaching that class.
- requisites.  This includes:
  - Prerequisites: courses you need to take before you can take this course
  - Corequisites: courses you need to take before or at the same time as this course
  - Antirequisites: courses that you cannot have already taken
  - Postrequisites: courses that require this course as a prerequisite
- requisite tree
  - This provides a tree view of the course and its prerequisites, recursively.  This will be explained below at [Requisite Tree](#requisite-tree).

### Requisite Tree
<p align="center">
  <img src="https://user-images.githubusercontent.com/19257435/42982669-3b1a569c-8b97-11e8-9e99-d15c3de11cf8.png" alt="logo" width="750" height="auto">
 </p>
The requisite tree provides a neat and cool way to visualize which courses are required to take a certain course.  If the user has their courses filled out, it will highlight taken courses in green.  The user can also toggle "Simplified View" on, which parses the tree via depth-first traversal and figure out which nodes can be taken out of three depending on courses the user has already taken.  In effect, it "simplifies" the tree down to just the information *you* need to know.

### My Courses
<p align="center">
  <img src="https://user-images.githubusercontent.com/19257435/42982866-47f78e2e-8b98-11e8-869a-00b850d8464c.png" alt="logo" width="750" height="auto">
 </p>
This is the main sauce that binds the app together.  This is the feature that brings the other features to their full potential.  This page manages your courses and allows you to plan out your entire university career.  It functions by drag-and-drop, which makes sense because I drew my inspiration from exactly how I was doing it in Google Sheets: dragging and dropping while I rearranged and planned my schedule.  It has the following features:
- Add term: Adds a term board which you can fill out with courses
- Cart: Contains miscellaneous courses that you haven't decided where to put in yet
- Adding courses to a term: there are 3 ways to do this
  1. Drag from cart
  2. Add a course by clicking on the "Plus button"
  3. Import courses from Quest by clicking on the 3 dots on the top right of the term board.  This allows you to copy and paste your courses straight from your Quest account and fill up your term with minimal effort
- Delete term: Removes a term board
- Clear term: Clears all terms from a term board
- Edit name: Edits the name of a term board
- Dragging courses: courses can be dragged across multiple terms, into the cart, and into the trash bin for deletion
- Dragging terms: terms can be dragged around and rearranged
- Clicking on a course card brings you to the course's respective page

Filling out your courses allows you to fully utilize the other features, such as the Requisites Tree and Majors.

### My Schedule (Early Stages)
<p align="center">
  <img src="https://user-images.githubusercontent.com/19257435/42983092-95e00368-8b99-11e8-8158-a2f347d3e9ad.png" alt="logo" width="750" height="auto">
 </p>
This feature allows you to copy and paste your Quest schedule directly into WatsMyMajor and formats into a nice Google calendar-like view.  *Note: this feature hasn't been fully fleshed out, but my hope is that it will allow users to share schedules and combine schedules*

### View Majors
<p align="center">
  <img src="https://user-images.githubusercontent.com/19257435/42983169-1bf5210e-8b9a-11e8-993e-6079f500ceeb.png" alt="logo" width="750" height="auto">
 </p>
This allows users to check out different majors and track their progress towards their majors.  if a user's courses have already been filled out, this page would auto-populate with courses that fulfill the requirements.  If a requirements board is green, this means that you have fulfilled all the requirements for the current board.

## Technologies
This project was structured with the help from https://github.com/mars/heroku-cra-node via the MIT license.
It is a combination of 2 npm projects, the backend server and the frontend UI. So there are two `package.json` configs.
  1. [`package.json`](package.json) for [Node server](server/) & [Heroku deploy](https://devcenter.heroku.com/categories/deployment)
      * `heroku-postbuild` script compiles the webpack bundle during deploy
      * `cacheDirectories` includes `react-ui/node_modules/` to optimize build time
  2. [`react-ui/package.json`](react-ui/package.json) for [React web UI](react-ui/)
      * generated by [create-react-app](https://github.com/facebookincubator/create-react-app)


## Contributing
Want to work on WatsMyMajor?  Check out our [contributing guidelines](CONTRIBUTING.md)!


## Find a bug?
Create an issue [here](https://github.com/theRoughCode/WatsMyMajor/issues/new) and I'll get back to you!
