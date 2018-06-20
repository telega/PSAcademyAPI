# PS Academy API

Server for Academy by PatSnap.
An online e-learning / [MOOC](https://en.wikipedia.org/wiki/Massive_open_online_course) platform. 
Built with Node, Express & MongoDB.

## Check it out!

Learn about IP, patents, and innovation.
[Academy by PatSnap](https://academy.patsnap.com)

## Quickstart

#### Get files
Copy this repo and install the dependencies witn `npm install`. 

#### Configure environment

The server expects a `.env` file to load various config vars. You must create this file or export the vars yourself (or configure them in your cloud service). 

* DB_URL  - the url of your mongodb instance
* SESSION_SECRET - a secret word
* HS_FORM_ID - used to submit new users to [HubSpot](https://www.hubspot.com/)
* HS_PORTAL_ID - a HubSpot account
* EMAIL_HOST - address of email provider, used to send registration notices and password recovery messages
* EMAIL_USERNAME 
* EMAIL_PASSWORD
* EMAIL_PORT

#### Build the admin functions
Admin functions are built with WebPack. This is to facilitate transitioning the app to React. Files are stored in /src. 
Compile the admin.js functions by running
`npm run build-prod`
This will copy assets from /assets, and admin.js 

When working on the admin functions, use: 
`npm run build-dev`

#### Start MongoDB
If testing locally, run: 
`mongod --dbpath DIRECTORY`
Replacing DIRECTORY with the location of your database files. Just create a new one if none is available. 

#### Start the Server
Start the express server with: 
`npm start`

or in development: 
`npm run dev`

## Technical Details

### Overview
This application implements a Node, Mongo, Express stack. Frontend interaction is handled by jQuery, with an option for React. The frontend is buil with [WebPack](https://webpack.js.org/) There are integration tests which test whole routes which can be run with `npm test`. Please check the configuration in `package.json`. 

### Express Server
The Express server implements a REST API and handles rendering of pages. It generally sticks to an [MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) pattern. 

#### Models
Models use mongoose schema. The main one is the 'Course' schema with subschema for 'Units' and 'Modules'
The User schema handles user's progression through the courses. Everything is in an object called 'local' as a consequence of how auth was setup (see below). 

#### Views
Views use [EJS](http://ejs.co/) as the templating engine.

#### Controllers
Controllers are basically middleware for the express router. Express-validator is used to check post/put requests. 

#### REST API
The application has 3 routes:
* / - main user-facing routes and pages
* /admin - admin facing routes and pages
* /api - for querying and updating the database

In some cases the distinction between /admin and /api is not clear. 

#### Authentication
The server uses [Passport](http://www.passportjs.org/) for authentication. Only local strategy is implemented. These can be applied to routes using the auth-controller. 

#### Search
Limited search of glossary and courses is provided by FuseJS (http://fusejs.io/). A JSON file is created on server launch which is sent to the front end this purpose. 

### Frontend
#### CSS/SASS

The frontend uses [Bootstrap 4](https://getbootstrap.com/), which is customised with [SASS](https://sass-lang.com/). 

SASS components are sotored in `/bootstrap/scss`. Because the front end uses webpack, when working on the stylesheets, it is easiest to copy the compiled CSS into the `/assets` directory, then have webpack copy them to `/public` eg: 
`sass --watch /bootstrap/scss/:assets`
when 
`npm run build-dev` is running.

#### Interaction
Interaction is mostly jQuery with the [SlickQuiz](https://github.com/jewlofthelotus/SlickQuiz) plugin being used for course Quizzes. 

#### React
A [React](https://reactjs.org/) frontend is a work in progress. React components are available in the `/src` directory.  To use the react frontend:

* Swap the view templates with the react version (`*.ejs.react`) by renaming them to `*.ejs`. 
* Edit the `admin.js` file in `/src/admin.js` to include the react files and comment out the jQuery lines *within the switch statement*.
* Rebuild the admin.js files as described above. 

Because it is a work in progress, the admin.js file is not optimized well and will be quite large. It is *not* recommended for production. 