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

#### box api document
This [Box api document](https://developer.box.com/reference) has all the endpoints described for your own box integration.

## Directory Breakdown


## Product Resources
[Product Requirements Document](https://docs.google.com/document/d/18AB0JTP9kXW2ywRGYXVPJkWVdHS9fCZ2O18cF_Ws7qI/edit?usp=sharing)

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