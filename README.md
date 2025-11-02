Real-Time Chat Application

A fully functional real-time chat application built with React, Node.js, Express, and Socket.io,  file sharing, typing indicators, online users, 

🚀 Features
Core Chat Features

Join a chat using a username

Global chat room for all users

Private messaging between users

Online/offline user list

Advanced Features

File/Image sharing in chat

Message timestamps


Auto-scroll to the latest message

UI/UX

Tailwind CSS styling

Responsive design for desktop and mobile

Clear differentiation for private messages


🛠️ Setup
Prerequisites

Node.js v18+

npm or yarn

Install and Run
1. Clone the repository
git clone https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-EUGEN254.git


2. Server setup
cd server
npm install
npm run server

### create .env file in backend
    MONGODB_URI=""
    PORT=5000
    JWT_SECRET="any name you want"


    CLOUDINARY_CLOUD_NAME=''
    CLOUDINARY_API_KEY=''
    CLOUDINARY_API_SECRET=''


3. Client setup
cd client
npm install

### create .env file in backend
    VITE_BACKEND_URL = 'http://localhost:5000'


    
npm run dev

4. Open in browser

React app runs by default on http://localhost:5173 



⚙️ Usage

Open the chat app in your browser

Enter a email and login or create an account

Send messages and share files/images



🎨 Screenshots 




📝 Technologies Used

Frontend: React, Tailwind CSS, Socket.io-client

Backend: Node.js, Express, Socket.io,mongoose

Real-time Communication: WebSockets via Socket.io