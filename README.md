# List n' Learn

List n' Learn is a web-based flashcard studying tool, built with text-to-speech and speech recognition integration for improved accessibility by blind and visually impaired students.

To start developing:
- Ensure npm is installed in the system
- Use `$ npm install` to install all necessary project dependencies

- *Set Environment Variables*
  - In the root directory, copy `.env.example` into a `.env` file
    - After each key name, paste the value associated (found in MongoDB Atlas) in this file
- *Start the Server*
  - In the root directory, call `$ npm start` to start the server
- *Start the Client*
  - Navigate to `list-n-learn-ui/package.json`
  - Update the `proxy` field to match the URL output by the server
  - Still in the UI directory, use `$ npm start` to start the development client.

- Both the server and client are built with hot-reload functionality, so neither has to be restarted on file changes; rather, this is done automatically.