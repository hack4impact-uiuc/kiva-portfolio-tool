# Kiva-Portfolio-Tool
A web application that serves as a self-service document repository and manages document collection from partners between portfolio managers and field partners.

## Setup
In order to setup the repository for use, first clone the repository:

```
https://github.com/hack4impact-uiuc/kiva-portfolio-tool.git
```

Then navigate into the newly cloned repository. Follow the READMEs in both the frontend and backend folders to fully setup the web application.

### Box Setup


## Directory Breakdown


## Product Resources
[Product Requirements Document](https://docs.google.com/document/d/18AB0JTP9kXW2ywRGYXVPJkWVdHS9fCZ2O18cF_Ws7qI/edit?usp=sharing)

## Design Resources


## Backend Resources
[Database Schema](https://docs.google.com/document/d/1KIfpPRFF79QpSVBjARBpSYpPUxpMPimn_KEcjvi9qI8/edit?usp=sharing)
Authentication documentation coming soon
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

Chloe Chan (chloegchan@gmail.com)
Kelley Chau (kelleyc2@illinois.edu)
Danielle Yang (dy6@illinois.edu)
Jeffy Lin (jlin79@illinois.edu)
Daniel Choi (dschoi3@illinois.edu)
Navam Awasthi (uawasth2@illinois.edu)