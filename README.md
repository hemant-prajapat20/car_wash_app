# AquaWash Pro - Enterprise Car Wash SaaS Platform

A professional, scalable, and responsive car wash management platform built with React Native, Expo, and the MERN stack.

## Architecture Highlights
- **Mobile & Web**: Single shared codebase for Android, iOS, and Web.
- **Routing**: File-based routing with Expo Router.
- **Styling**: Utility-first styling with NativeWind (Tailwind CSS for React Native).
- **State Management**: Redux Toolkit for global state.
- **Forms**: React Hook Form with Zod validation.
- **Backend**: Scalable MERN stack (MongoDB, Express, React, Node.js).

## Folder Structure
- `app/`: Expo Router routes and layouts.
- `components/`: Atomic UI components and dashboard elements.
- `services/`: API integration and business logic.
- `store/`: Redux slices and store configuration.
- `hooks/`: Reusable custom hooks.
- `constants/`: Configuration, colors, and dummy data.
- `backend/`: Express server and database logic.

## Getting Started

### Prerequisites
- Node.js & npm
- Expo CLI
- MongoDB

### Installation
1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

### Running the Project
**Frontend (Expo):**
```bash
npx expo start
```

**Backend:**
```bash
cd backend
npm run dev
```

## Features
- Multi-role support (Customer, Vendor, Admin)
- Real-time booking management
- Revenue analytics and reporting
- Slot and staff management for vendors
- Reward points and promotional systems
- Responsive SaaS dashboard
