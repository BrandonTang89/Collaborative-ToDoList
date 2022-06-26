# Collaborative-ToDoList

<img src="./public/logo.svg" style="width:100px;" alt="collaborative todolist icon"/>

This project is an extension of my previous [MERN ToDoList](https://github.com/BrandonTang89/MERN-ToDoList). 

Features include:

- Google and Local Authentication with Firebase Authentication

- Multiple lists per user

- Sharing lists with other users

- Tasks with tagging and status to faciliate filtered searches.

## Technologies

The webapp is built using the Firebase Framework with a React.js front-end. Within Firebase, the following are used:

- Firebase Authentication

- Firestore Database

- Hosting

## Setting up Firebase

The Firestore Architecture is as such

<img src="./public/database_archi.svg" alt="database architecture diagram" />

The security rules for database access are provided in `./src/firestorerules.txt`.

In Firebase Authentication, you need to set-up both Google and local (email and password) sign-in options.

## Building

After cloning the repo, build using
`npm install && sed -i 's/;;/;/' node_modules/semantic-ui-css/semantic.min.css && npm run build`.

Note that the above command removes a duplicate `;` in `node_modules/semantic-ui-css/semantic.min.css` from `semantic-ui-css:2.4.1` which would cause typescript to  crash.

You can then serve using `serve -s build` after installing `serve` globally using `npm`.

## Deployment

This app was hosted on Firebase Hosting, serving from the `./build` directory. 