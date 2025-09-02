Notes App
A full-stack web application built with React, TypeScript, Vite, Node.js, Express, and MongoDB.


The Notes App allows users to register, log in, and manage personal notes (create, read, update, delete) with a clean and responsive user interface. 


The application features user authentication using JWT (JSON Web Tokens) and a MongoDB database for persistent storage.




Features

User Authentication: Register and log in with secure JWT-based authentication.


Note Management: Create, view, edit, and delete personal notes.



Search Functionality: Search notes by title or description.


Responsive UI: A modern, responsive interface built with React and Tailwind CSS.


Real-time Updates: Notes are fetched and updated dynamically with REST API calls.


Protected Routes: Only authenticated users can access note-related features.







Create a .env file in the server directory with the following:MONGO_URI=<your-mongodb-connection-string>


JWT_SECRET=<your-jwt-secret>


PORT=port number 


NODE_ENV=development


Replace <your-mongodb-connection-string> with your MongoDB URI and <your-jwt-secret> with a secure secret key.











API Endpoints


The backend provides the following REST API endpoints:


Authentication



POST /api/users/registerRegister a new user.Body: { "username": string, "email": string, "password": string }Response: { "id": string, "username": string, "email": string, "token": string }



POST /api/users/loginLog in a user and return a JWT.Body: { "email": string, "password": string }Response: { "id": string, "username": string, "email": string, "token": string }




GET /api/users/meGet the authenticated user's details (requires JWT in Authorization: Bearer <token>).Response: { "id": string, "username": string, "email": string }




Notes

GET /api/notesFetch all notes for the authenticated user (requires JWT).Response: Array of { "_id": string, "title": string, "description": string, "createdBy": string, "createdAt": Date, "updatedAt": Date }



POST /api/notesCreate a new note (requires JWT).Body: { "title": string, "description": string }Response: { "_id": string, "title": string, "description": string, "createdBy": string, "createdAt": Date, "updatedAt": Date }



GET /api/notes/:idFetch a specific note by ID (requires JWT).Response: { "_id": string, "title": string, "description": string, "createdBy": string, "createdAt": Date, "updatedAt": Date }



PUT /api/notes/:idUpdate a note by ID (requires JWT, user must be the note's creator).Body: { "title": string, "description": string }Response: Updated note object



DELETE /api/notes/:idDelete a note by ID (requires JWT, user must be the note's creator).Response: { "message": "Note was deleted" }

