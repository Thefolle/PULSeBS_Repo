# PULSeBS - Team 9

**This project is part of a teaching course.**  
PULSeBS, a.k.a. Pandemic University Lecture Seat Booking System, is an application to let students, teachers and managers to organize, schedule, monitor and overall support the typical university lectures lifecycle during the COVID-19 pandemic.

## Installation

- *Docker in local* : clone the repository from the main branch in local; open Docker Desktop; open a shell in ./pulsebs-client/ and run ```docker build --tag client .```; now change directory to ./pulsebs-server/ and run ```docker build --tag server .```; change directory again in the root folder of the project; the command to run the whole application is: ```docker-compose -f ./docker-compose.yml up```, then you can reach the web application from ```http://localhost:3000```;

- *Docker from DockerHub* : open Docker Desktop; open a shell in an arbitrary folder and run ```docker pull gallofrancesco/pulsebs-frontend:<tag>``` and replace the tag with a valid value, like *sprint4*; now run ```docker pull gallofrancesco/pulsebs-backend:<tag>``` with the same tag as before; now change directory of the shell inside the project root folder and run ```docker-compose -f ./docker-compose.yml up```, then you can reach the web application from ```http://localhost:3000```;

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
