## Simple CRUD API

# This app built with Node.js & Typescript

# For run need:

- clone this repository wiht branch `b develop`
- open app `cd nodeJS-crud-api`
- run `npm install` to install
- add `.env` and write the variable `PORT=4000`

# Scripts app:

- `npm run start:dev` to start the server app
- `npm run test` to run tests
- `npm run start:prod` to build the app
- `npm run start:multi` to start the server app with load balancer

# Implemented endpoint

- GET `api/users` is used to get all users
- GET `api/users/${userId}`
- POST `api/users` is used to create record about new user and store it in database
- PUT `api/users/${userId}` is used to update existing user
- DELETE `api/users/${userId}` is used to delete existing user from database

For test app you can use [Postman](https://www.postman.com/). Default URL will be `http://localhost:4000/api/users`
This app was made on the task Simple CRUD API RS-NodeJS2024Q1 of [RS School](https://rs.school/)
