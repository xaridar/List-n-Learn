# List n' Learn

List n' Learn is a web-based flashcard studying tool, built with text-to-speech and speech recognition integration for improved accessibility by blind and visually impaired students.

## Development

To start developing:

-   Ensure npm is installed in the system
-   Use `$ npm install` to install all necessary project dependencies

-   _Set Environment Variables_
    -   In the root directory, copy `.env.example` into a `.env` file
        -   Set MONGODB_PASS to the provided password
-   _Start the Server_
    -   In the root directory, call `$ npm start` to start the server
-   _Start the Client_

    -   Navigate to `list-n-learn-ui/package.json`
    -   Update the `proxy` field to match the URL output by the server
    -   Use `$ npm install` to install all necessary project dependencies for the frontend
    -   Still in the UI directory, use `$ npm start` to start the development client.
        -   The front-end application has been started at http://localhost:3000

-   Both the server and client are built with hot-reload functionality, so neither has to be restarted on file changes; rather, this is done automatically.

## Description

List n' Learn is built with a React.js frontend and a Express.js backend, with connection to a MongoDB database hosted on MongoDB atlas. This connection requires a username and password, hidden from GitHub but pulled from `.env`.

The application features a custom responsive interface, which allows for "normal" flashcard navigation through mouse-and-keyboard controls. Additionally, all application navigation can be achieved using voice commands, using react-speech-recognition and the Web Speech API for text-to-speech. All commands can be accessed at any time using the 'Help' command or the help option in the application menu. These include commands to navigate all pages, as well as editing card sets and studying sets purely through voice controls.

Additionally, animations can be toggled for accessibility, and talkback speed can be adjusted at any time by the user for extended usability.

No talkback is possible in the application until a user interacts with the application through some sort of button press, due to limitations in the Web Speech API.
