# 🍲 NGO Food Donation App

A comprehensive food donation management system built with **Angular 20** and **Ionic 8**, designed to connect food donors with volunteers and streamline the donation process through an intuitive admin dashboard.

![Angular](https://img.shields.io/badge/Angular-20.0.0-red?style=flat&logo=angular)
![Ionic](https://img.shields.io/badge/Ionic-8.0.0-blue?style=flat&logo=ionic)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

The **NGO Food Donation App** is a full-stack solution that helps NGOs manage food donations efficiently. It connects three types of users:

- **👨‍💼 Admins** - Monitor and manage all donations, users, and system operations
- **🤝 Donors** - Submit food donation requests and track their history
- **🚗 Volunteers** - Pick up and deliver food donations to those in need

The application features a beautiful, consistent UI with gradient backgrounds, smooth animations, and a responsive design that works seamlessly across all devices.

---

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token storage
- **Role-based routing** (Admin, Donor, Volunteer)
- Beautiful login and registration pages with animated gradients
- Password visibility toggle and "Remember Me" functionality

### 👨‍💼 Admin Dashboard
- **Donation Management** - View all donations with status filtering (Pending, Picked Up, Delivered)
- **User Management** - Monitor all registered users with role-based statistics
- **Stats Dashboard** - Real-time statistics with color-coded cards
- **Responsive Tables** - Expandable donation details with volunteer assignment tracking

### 🤝 Donor Features
- **Donation Form** - Submit food donations with details (food type, quantity, address, pickup time)
- **Donation History** - Track donation status with visual timeline
- **Status Tracking** - See real-time updates (Pending → Picked Up → Delivered)
- **Volunteer Information** - View assigned volunteer contact details

### 🚗 Volunteer Features
- **Active Pickups** - View assigned pickup tasks with donor information
- **Action Buttons** - Mark donations as "Picked Up" or "Delivered"
- **Contact Donors** - Direct phone call links for quick communication
- **Delivery History** - Track completed deliveries with timestamps
- **Instructions Display** - Clear pickup and delivery instructions

### 🎨 UI/UX Highlights
- **Gradient Backgrounds** - Purple/blue themed gradients throughout
- **Smooth Animations** - Pulse effects, floating circles, slide-ins
- **Icon-Enhanced Inputs** - Ionicons integrated with all form fields
- **Status Badges** - Color-coded badges (Yellow=Pending, Blue=Picked, Green=Delivered)
- **Responsive Design** - Mobile-first approach with tablet and desktop optimization
- **Consistent Design Language** - Unified card layouts, buttons, and typography

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Angular 20.0.0
- **UI Library**: Ionic 8.0.0
- **Icons**: Ionicons 7.0.0
- **Styling**: SCSS with custom gradients and animations
- **State Management**: RxJS 7.8.0
- **Routing**: Angular Router with guards
- **Mobile**: Capacitor 7.4.3

### Backend (Django REST API)
- **Framework**: Django & Django REST Framework
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: SQLite/PostgreSQL
- **API Base URL**: `http://127.0.0.1:8000/authapi/`

### Development Tools
- **Build Tool**: Angular CLI 20.0.0
- **Linting**: ESLint 9.16.0
- **Testing**: Karma & Jasmine
- **Package Manager**: npm

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Django Backend** - Running on `http://127.0.0.1:8000`

### Optional Global Installations
```bash
npm install -g @ionic/cli
npm install -g @angular/cli
```

---

## 🚀 Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/mohammedmustafa47/ngoangular.git
cd ngoangular
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all dependencies listed in `requirements.txt` including:
- Angular 20 packages
- Ionic 8 framework
- Capacitor plugins
- Development tools

### Step 3: Configure Environment
Update the API base URL in your environment files if needed:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/authapi/'
};
```

### Step 4: Ensure Backend is Running
Make sure your Django backend server is running:
```bash
# In your Django project directory
python manage.py runserver
```

---

## 🎯 Running the Application

### Development Server
```bash
npm start
# or
ionic serve
```

The app will open at `http://localhost:8100`

### Build for Production
```bash
npm run build
# or
ionic build --prod
```

Output will be in the `www/` directory.

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

---

## 📁 Project Structure

```
ngoangular/
├── src/
│   ├── app/
│   │   ├── admindonation/        # Admin donation management page
│   │   ├── adminsuser/           # Admin user management page
│   │   ├── donateform/           # Donor donation submission form
│   │   ├── donatehistory/        # Donor donation history
│   │   ├── login/                # Authentication login page
│   │   ├── register/             # User registration page
│   │   ├── vpickup/              # Volunteer active pickups
│   │   ├── vhistory/             # Volunteer delivery history
│   │   ├── tab-admin/            # Admin tab navigation
│   │   ├── tab-donor/            # Donor tab navigation
│   │   ├── tab-volunteer/        # Volunteer tab navigation
│   │   └── services/             # API services & auth guards
│   ├── assets/                   # Images, icons, fonts
│   ├── environments/             # Environment configurations
│   ├── theme/                    # Global SCSS variables & themes
│   └── global.scss               # Global styles
├── www/                          # Production build output
├── angular.json                  # Angular CLI configuration
├── capacitor.config.ts           # Capacitor configuration
├── ionic.config.json             # Ionic configuration
├── package.json                  # npm dependencies
├── requirements.txt              # Detailed dependency list
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

---

## 👥 User Roles

### 🔴 Admin
**Access**: `/tab-admin`

**Capabilities**:
- View all donations with filtering options
- Monitor all registered users
- See real-time statistics
- Track donation status changes
- View volunteer assignments

**Pages**:
- Admin Donations (`/admindonation`)
- Admin Users (`/adminsuser`)

---

### 🟢 Donor
**Access**: `/tab-donor`

**Capabilities**:
- Submit new food donations
- Track donation history
- View assigned volunteers
- See donation status updates

**Pages**:
- Donation Form (`/donateform`)
- Donation History (`/donatehistory`)

---

### 🔵 Volunteer
**Access**: `/tab-volunteer`

**Capabilities**:
- View assigned pickup tasks
- Mark donations as "Picked Up"
- Mark donations as "Delivered"
- Contact donors via phone
- View delivery history

**Pages**:
- Active Pickups (`/vpickup`)
- Delivery History (`/vhistory`)

---

## 📸 Screenshots

### Authentication Pages
- **Login**: Gradient background with animated circles, role badges display
- **Register**: Role selection with dynamic info boxes, terms acceptance

### Admin Dashboard
- **Donations**: Stats grid with color-coded cards, status filtering
- **Users**: Role-based statistics, avatar containers, activity tracking

### Donor Interface
- **Donation Form**: Animated header with heart icon, floating labels
- **History**: Timeline visualization, status badges, volunteer information

### Volunteer Interface
- **Pickups**: Dynamic headers (yellow/blue), action buttons with confirmations
- **History**: Color-coded completion cards (green/red), timestamps

---

## 🔌 API Integration

### Authentication Endpoints
```typescript
POST /authapi/auth_register/
POST /authapi/auth_login/
POST /authapi/auth_refresh/
```

### Donation Endpoints
```typescript
GET    /authapi/donations/          // Get all donations (Admin)
GET    /authapi/user-donations/     // Get user's donations (Donor)
POST   /authapi/donations/          // Create donation
PUT    /authapi/donations/{id}/     // Update donation status
```

### User Endpoints
```typescript
GET    /authapi/users/              // Get all users (Admin)
GET    /authapi/profile/            // Get current user profile
```

### Volunteer Endpoints
```typescript
GET    /authapi/volunteer-pickups/  // Get assigned pickups
PUT    /authapi/pickups/{id}/       // Update pickup status
```

---

## 🎨 Design System

### Color Palette
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Success**: `#2dd36f` (Delivered, Donor role)
- **Warning**: `#ffc409` (Pending status)
- **Primary**: `#3880ff` (Picked Up, Volunteer role)
- **Danger**: `#eb445a` (Admin role, Cancelled)

### Typography
- **Headers**: Bold 700-800 weight
- **Body**: Medium 500-600 weight
- **Font Family**: System fonts (Roboto, Helvetica, sans-serif)

### Spacing
- **Card Padding**: 20-32px
- **Border Radius**: 12-20px
- **Shadows**: `0 4px 16px rgba(0,0,0,0.1)`

---

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run E2E Tests (if configured)
```bash
npm run e2e
```

### Test Coverage
```bash
npm run test:coverage
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style Guidelines
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add comments for complex logic
- Maintain consistent SCSS formatting

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
ionic serve --port=8200
```

### Node Modules Issues
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Backend Connection Issues
- Ensure Django server is running on `http://127.0.0.1:8000`
- Check CORS settings in Django backend
- Verify API endpoints are accessible

### Build Errors
```bash
npm run clean
npm install
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mohammed Mustafa**
- GitHub: [@mohammedmustafa47](https://github.com/mohammedmustafa47)

---

## 🙏 Acknowledgments

- **Ionic Team** - For the amazing mobile framework
- **Angular Team** - For the powerful frontend framework
- **Django Team** - For the robust backend framework
- **Community Contributors** - For continuous support and improvements

---

## 📞 Support

For support, email support@ngodonation.com or open an issue on GitHub.

---

## 🚀 Future Enhancements

- [ ] Real-time notifications using WebSockets
- [ ] Google Maps integration for delivery tracking
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme
- [ ] Progressive Web App (PWA) features
- [ ] Email notifications for status updates
- [ ] Analytics dashboard for admins
- [ ] Mobile apps for iOS and Android using Capacitor
- [ ] Image upload for food donations
- [ ] Rating system for volunteers

---

<div align="center">
  <p>Made with ❤️ for making a difference in the community</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
