# Kiva-Portfolio-Tool
A web application that serves as a self-service document repository and manages document collection from partners between portfolio managers and field partners.

## Setup
In order to setup the repository for use, first clone the repository:

```
https://github.com/hack4impact-uiuc/kiva-portfolio-tool.git
```

Then navigate into the newly cloned repository. Follow the READMEs in both the frontend and backend folders to fully setup the web application.

### Box API Setup

To start using Box, you must create a box account [here](https://account.box.com/login).

After you create your new box account, you must visit the [Console](https://app.box.com/developers/console) to create your project.

After creating your project, click into the project and go to **configuration**.

In *configuration* tab, decide whether or not you want to authenticate using _OAuth_ or _JWT_. You can find more documentation about these two methods [here](https://developer.box.com/docs/quickstart-guides).

Follow each step in the chosen authentication method, and you are all set!

This project uses the _JWT_ method to authenticate one master user and allow anyone with access to the project upload, delete, and more with box. By using the _JWT_ method, you must download the **App Settings** from your **configuration**, which is located all the way down in the page. After you download it, follow the [documentation](https://developer.box.com/docs/construct-jwt-claim-manually), and you will be able to set up the box account similar to this project's.

Our box backend first generates the access token for the authenticated user (information in the document provided above) and lets the user upload a file or delete a file. More on these endpoints can be found [here](https://developer.box.com/reference)

#### Box Api Document
This [Box api document](https://developer.box.com/reference) has all the endpoints described for your own box integration.

## Email Notification Setup

The email notifications are sent using the Gmail SMTP server. If you do not have a G Suite account with a custom domain, you can only send 100 emails/day; otherwise, it is unlimited.

If you want to use your own Gmail account to send emails, follow [this](https://u.expressionengine.com/article/using-gmail-smtp-to-send-emails-from-your-website) (just through **Create an App Password for your Google Account**) to set up your account. Then, create a .env file in `/backend/api/`, containing:
```
GMAIL_NAME={your email}
GMAIL_PASSWORD={app password}
```
with your information instead of {these}.

## Directory Breakdown
### Frontend
The frontend directory contains all of the relevant files for the actual pages that are viewed on the web application. The files in the top-level directory are related to Node, Docker, and Git. When running the application, the entry point of React into the application is through the `frontend/src/index.js` file. This file also contains all of the route definitions as well as top level application structure. The `src` directory also contains other important files:

* `src/components`
    * This directory holds all of the files for the pages and components of the application. Within the `auth` subdirectory, all of the pages related to authentication can be found. The `index.js` file in this directory handles the exports of all of the components so that they can easily be imported in other locations.

* `src/media`
    * This directory holds all of the images and icons used throughout the web application.

* `src/redux`
    * The redux directory has files related to the setup and definitions of the Redux store, actions, and reducers. `configureStore.js` creates the Redux store with additional options, while the files in the `src/redux/modules` subdirectory contains definitions for the reducers and actions.

* `src/styles`
    * This directory houses all of the `.scss` files to add CSS and styling to the pages and components of the web application. The files are separated such that each file mainly contains CSS specific to the corresponding component that they modify. The `index.scss` file houses many of the CSS classes that are generalizeable to be used with any component or element.

* `src/tests`
    * This directory contains all of the snapshot and integration tests for many of the components in the `components` directory.

* `src/utils`
    * This directory holds utility functions for the application. Most notably, the `ApiWrapper.js` file abstracts away functions that need to access the Flask endpoints such that other components or files in the frontend can utilize those functions normally. The directory also has files for authentication, including the `cookie.js` file, as well as helper functions for other features including email notifications.

### Backend
The backend directory contains all of the files required for maintaining the Flask API and database with SQLAlchemy. The files at the top-level of the backend directory include configuration files for requirements, deployment, and setup. One important file in the top-level directory includes the `manage.py` file, which handles creating and running the Flask application from the command line. The other directories and files are structured as follows:

* `backend/api`
    * This directory holds important files relating to creating and running the Flask application along with the connection to the database. The configuration files (`config.py`, `core.py`, `__init__.py`) manage creating the Flask application and defining some of its options, some specifically related to the database. The files in the `models` subdirectory involve setting up the database with the appropriate tables. Each file represents a table in the database as well as the table's fields, constraints, and instantiation of a new entry. The files in the `views` subdirectory define the endpoints as well as its interactions with the database tables.

* `backend/tests`
    * This directory contains all of the unit tests for the views defined in the `backend/api/views` directory.

## Product Resources
[Product Requirements Document](https://docs.google.com/document/d/18AB0JTP9kXW2ywRGYXVPJkWVdHS9fCZ2O18cF_Ws7qI/edit?usp=sharing)
[Revised Product Requirements Document](https://docs.google.com/document/d/1lN7d78bfFMMYT5PvtWIke0O2d7F7zZfobO457U0edvs/edit?usp=sharing)

## Design Resources
[Brand Assets (Courtesy of Kiva)](https://drive.google.com/drive/folders/1oo-Q-B_khVYbN4nrJADlI1S0dr823jQL)

[Product Design Sketches, Models, etc.](https://drive.google.com/drive/folders/1fMjmDtsBPMLHSsE0fctPsorrGj-iIIkp?usp=sharing)

## Backend Resources
[Database Schema](https://docs.google.com/document/d/1KIfpPRFF79QpSVBjARBpSYpPUxpMPimn_KEcjvi9qI8/edit?usp=sharing)

[Authentication Documentation](https://h4i-auth-infra-docs.now.sh/)

[Backend Boilerplate Documentation](https://github.com/tko22/flask-boilerplate/wiki)

## Workarounds
Over the course of the 3 month timeline for building out this tool, we accumulated some technical debt that, with more time and resources, can be re-implemented with better practices:

* Box API Content Preview
    * Box has various libraries that allow for previewing documents from an account. However, the React component was not functioning correctly when we attempted to integrate it with the dashboard.
    * Instead, we retrieve an iframe link from the Box API and use the iframe to display documents.

* Testing
    * Although test cases are included for the backend database and endpoints and frontend components, they are by no means comprehensive. With the given timeframe, our focus was concentrated on developing all of the required features. As a result, the tests mostly cover basic cases and may overlook some edge cases.

* Due Dates
    * Storing due dates in the backend is accomplished by performing calculations with the time since the epoch. On top of this, the first two numbers of the year are omitted to allow for the dates to be accurate for a significant amount of time without needing refactoring.

* Styling/CSS
    * React handles CSS files by making every file globally accessible, meaning that import order will not affect which CSS targets will be overridden. Instead, priority is established by the specificity of the target.
    * Currently, the application is desktop and tablet-friendly, but does not support mobile device viewing.

## Team
Special thanks to the team of developers and product designer that contributed to building the product:

### Product Designer
Chloe Chan (chloegchan)

### Software Developers
Kelley Chau (chyku)

Danielle Yang (dyang5200)

Jeffy Lin (jeffylin)

Daniel Choi (choiboy98)

Navam Awasthi (uawasth2)