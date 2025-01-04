# Attendance Tracking(Backend)
A web-based attendance tracking system for students in schools and colleges. It helps students manage and monitor attendance without any issues.

- *This repository contains the backend code for the project, the frontend code can be found [here](https://github.com/ash-dodek/attendance-frontend)*


#### [Checkout hosted site](https://ash-attendance-tracking.vercel.app/)

### Tech stack used: 
- **Backend**: NodeJS, Express, MongoDB Atlas
- **Frontend**: ReactJS, React-Router, React-Calendar


## Environment Variables
Create a ```.env``` file in the directory, your ```.env``` should look something like this

```
DB_URL = connection_string
DB_CONNECTION_PASSWORD = db_password
DATABASE_NAME = db_name
BASE = sampleBase

JWT_SECRET_AC = 'some_secret'
JWT_SECRET_RF = 'another_secret'

HOSTNAME = '127.0.0.1'

ORIGIN = http://localhost:5173,https://ash-attendance-tracking.vercel.app
```

You can contribute to this project by forking this repository and creating a pull request, any contribution is welcomed!

This repository is of backend, if you would like to contribute to the frontend, [Checkout Frontend Code](https://github.com/ash-dodek/attendance-frontend)