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

## Building

After cloning the repo, build using
`npm install && sed -i 's/;;/;/' node_modules/semantic-ui-css/semantic.min.css && npm run build`.

Note that the above command removes a duplicate `;` in `node_modules/semantic-ui-css/semantic.min.css` which would cause typescript to  crash.

You can then serve using `serve -s build` after installing `serve` globally using `npm`.


