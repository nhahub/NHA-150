# Estately

Estately is a full-stack real-estate listing application that lets users create and browse property posts, save favorites, and chat with post owners. The repository contains three main parts:

- `api/` — Node.js + Express backend with Prisma (MongoDB) models and controllers.
- `client/` — React + Vite frontend (UI, map, posts, chat widget).
- `socket/` — Socket server used for realtime messaging (socket.io / nodemon setup).

## Key Features

- User authentication (cookie/JWT based).
- Create, edit, delete property posts with images and detailed info.
- Save / unsave posts to a per-account Saved list.
- In-app messaging (chats + messages) with a chat popup on the profile page.
- Map view with interactive pins for posts.
- Notifications/unread messages counter (Zustand store used for client-side state).

## Tech Stack Used

- Frontend: React, Vite, React Router, Zustand, Axios
- Backend: Node.js, Express, Prisma (MongoDB provider)
- Database: MongoDB Atlas
- Realtime: Socket.io (separate `socket/` server)
- Maps: react-leaflet
- Other: DOMPurify, timeago.js