# PULSeBS - Team 9

**This project is part of a teaching course.**  
PULSeBS, a.k.a. Pandemic University Lecture Seat Booking System, is an application to let students, teachers and managers to organize, schedule, monitor and overall support the typical university lectures lifecycle during the COVID-19 pandemic.

## Installation

- *Docker* : The best way to deploy backend and frontend together is using Docker-Compose. To do that just clone the project, open a shell in project directory and run ```docker-compose -f ./docker-compose.yml up```, then you can reach the web application from ```http://localhost:3000```;

- *Development mode*: clone the repository from the main branch in local and:
    1. Install the dependencies on server side through a shell on folder ./pulsebs-server/ through the command: ```npm install```;
    2. Install the dependencies on client side through a shell on folder ./pulsebs-client/ through the command: ```npm install```;
    3. Run the server from folder ./pulsebs-server/ through the command: ```node ./server.js```;
    4. Run the client from folder ./pulsebs-client/ through the command: ```npm start```.

## Important documents

- [Backlog with notes](<https://docs.google.com/document/d/1AifxbhVeeMtsyYsEbVNopr66S-grZAHy/edit>)
- [Backlog with questions and answers](<https://docs.google.com/document/d/1ELJbPE27IaUL6TSb6JUdjA4l5-gVSvVsMUWpgQc8V7Q/edit#heading=h.wa25ir5z6t83>)

## License

[MIT](<https://choosealicense.com/licenses/mit/>)
