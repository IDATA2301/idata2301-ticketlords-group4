# Overview 
This is the frontend repository for our ticket booking project. It is a Vite + React + TypeScript application hosted on netlify at https://ticketlords.netlify.app.

To test this project locally, you can clone the repository and run the project as described in the setup section below.

# Setup 
This project requires Node.js and npm (Node Package Manager). npm is used to install the necessary dependencies and run development scripts. For the following instructions to work, you need to make sure you have these installed before proceeding.

You can read more about Node here: https://nodejs.org/

This project connects to the backend project (https://github.com/IDATA2301/idata2306-group4-ticketlords) using environment variables. You can read about environment variables under the environment variables section. 

With nodejs installed, you should now have access to the npm command. Do `npm install` to download all dependencies needed for this project.

Now you should be able to run the project locally by using the following command in the terminal:

`npm run dev`

this should open a port on your pc to http://localhost:5173

Navigate to the page in your browser to see the page.

# !Disclaimer
You can run the project by itself like we just described, although it is not advised, as you wont have access to the backend, which is an important component.

To get access to the backend, you should beforehand go to the backend repository and set it up as defined in its own readme.

When the backend is set up and is running, you should be able to connect to it given you have set up the url environement variable.

# Environment Variables
You need to inject some environment variables for the project to work properly. The variables do not come with this project, so if you do not have access to them, you need to create your own.

It should look something like this:
<img width="1109" height="406" alt="Image" src="https://github.com/user-attachments/assets/c66fe605-6e09-4d38-8f66-115bac3b3ec8" />

After setting the environment variables, you should be good to go.

