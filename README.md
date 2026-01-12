# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace platform where clients can post jobs (Gigs) and freelancers can apply with competitive bids.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with HttpOnly cookies
- **Gig Management**: Full CRUD operations for job postings
- **Bidding System**: Freelancers can submit bids with custom pricing
- **Hiring Logic**: Atomic transactions ensure race-condition-free hiring
- **Real-time Notifications**: Socket.IO integration for instant updates
- **Search & Filter**: Find gigs by title and status
- **Dashboard**: Manage your gigs and bids from one place

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **React Query** for server state management
- **Axios** for API calls
- **Socket.IO Client** for real-time features
- **Shadcn UI** components

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.IO** for real-time notifications
- **Cookie-parser** for cookie management

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Gigs
- `GET /api/gigs` - Get all open gigs (with search query)
- `POST /api/gigs` - Create new gig (Private)
- `GET /api/gigs/:id` - Get single gig
- `PUT /api/gigs/:id` - Update gig (Private, Owner only)
- `DELETE /api/gigs/:id` - Delete gig (Private, Owner only)
- `GET /api/gigs/my-gigs` - Get user's own gigs (Private)

### Bids
- `POST /api/bids` - Submit a bid (Private)
- `GET /api/bids/:gigId` - Get all bids for a gig (Private, Owner only)
- `GET /api/bids/my-bids` - Get user's own bids (Private)
- `PATCH /api/bids/:bidId/hire` - Hire a freelancer (Private, Owner only)

## 🔒 Security Features

- JWT tokens stored in HttpOnly cookies
- Password hashing with bcrypt
- Protected API routes with authentication middleware
- MongoDB transactions for atomic operations
- CORS configuration for secure cross-origin requests

## 💡 Core Hiring Logic

When a client hires a freelancer:
1. The system uses MongoDB transactions for atomicity
2. Gig status changes from "open" to "assigned"
3. Selected bid status becomes "hired"
4. All other pending bids are marked as "rejected"
5. Real-time notification sent to the hired freelancer

## 🎯 Bonus Features Implemented

### 1. Transactional Integrity
- MongoDB transactions prevent race conditions
- Ensures only one freelancer can be hired per gig
- Atomic updates prevent data inconsistencies

### 2. Real-time Notifications
- Socket.IO integration for instant updates
- Freelancers receive immediate notification when hired
- No page refresh required

## 📱 Pages

- **Landing** (`/`) - Marketing homepage
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Browse Gigs** (`/gigs`) - View all open gigs
- **Gig Detail** (`/gigs/:id`) - View gig details and submit bids
- **Create Gig** (`/gigs/create`) - Post a new job
- **Dashboard** (`/dashboard`) - Manage your gigs and bids

## 🚦 Getting Started

1. Start MongoDB locally or use MongoDB Atlas
2. Start the backend server (port 5000)
3. Start the frontend development server (port 5173)
4. Register a new account or login
5. Post a gig or browse existing gigs
6. Submit bids and experience the hiring flow

## 📝 Project Structure

```
GigFlow/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Application pages
│   │   └── types/         # TypeScript types (converted to JSDoc)
│   └── package.json
├── server/                # Backend Node.js application
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── server.js          # Server entry point
│   └── package.json
└── README.md
```

## 🤝 Contributing

This is an internship assignment project. For any questions or improvements, please reach out.

## 📄 License

MIT

---

Built with ❤️ for the Full Stack Development Internship Assignment
