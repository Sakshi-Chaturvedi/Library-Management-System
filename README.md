# 📚 Library Management System

A comprehensive, full-stack Library Management System designed to handle digital book inventories, user borrowing, and administrative controls effectively. Built with a modern, responsive user interface and a robust backend API.

---

## 🚀 Short Project Description
This system modernizes library operations by providing discrete platforms for both regular users and administrators. Users can register (with OTP verification), browse available books, view details, borrow, and return books. Administrators have a dedicated dashboard to manage the catalog, oversee users, and track all borrowing activities. The project incorporates advanced features like email/SMS notifications and cloud image storage.

---

## ✨ Key Features

### 👤 User Features
* **Secure Authentication:** User registration and login utilizing JWT, supplemented by OTP verification (via Email/SMS).
* **Book Browsing:** Explore a dynamic catalog of books with rich details and pagination.
* **Borrowing System:** A streamlined process to borrow and return books.
* **Personalized Dashboard:** View currently borrowed books ("My Books") and complete borrow history.
* **Responsive UI:** A fully responsive and accessible design tailored to look great on all devices.

### 🛡️ Admin Features
* **Admin Dashboard:** A centralized overview of library statistics and activities.
* **Inventory Management:** Add new books, update existing details, and remove books from the system.
* **User Management:** Monitor registered users and manage their access.
* **Global Activity Tracking:** View system-wide borrowing history and active borrow requests.

### 🧠 Smart/Advanced Features
* **Cloud Storage Integration:** Book cover images managed reliably via Cloudinary and Multer.
* **Multi-channel Notifications:** Seamless implementation of Nodemailer and Twilio for critical alerts and OTP validations.
* **Automated Schedulers:** Uses `node-cron` for automated recurring backend tasks.
* **Optimized UI/UX:** Features structural enhancements like `SkeletonBookCard` for elegant loading states and dark mode elements.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React 19, React Router DOM
* **Styling:** Tailwind CSS, Radix UI, Lucide React (Icons), `tailwindcss-animate`
* **Data Fetching:** Axios
* **Build Tool:** Vite

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT, bcrypt
* **File Handling:** Multer, Cloudinary
* **Communications:** Nodemailer, Twilio
* **Scheduling:** Node-cron

---

## 📂 Project Architecture / Folder Structure

```text
Library-Management-System/
│
├── Backend/
│   ├── .env               # Environment variable configuration
│   ├── app.js             # Main Express application setup
│   ├── server.js          # Server entry point
│   ├── package.json       # Backend dependencies
│   └── src/
│       ├── controllers/   # Route handler logic (auth, book, borrow, users)
│       ├── db/            # Database connection setup
│       ├── middlewares/   # Custom middlewares (e.g., error handling, auth)
│       ├── models/        # Mongoose schemas (users, book, borrow)
│       ├── routes/        # API endpoint definitions
│       ├── services/      # External integrations (Twilio, Email, Cloudinary)
│       └── utils/         # Helper functions
│
└── Frontend/
    ├── index.html         # Application entry
    ├── package.json       # Frontend dependencies
    ├── postcss.config.js  # PostCSS configuration
    ├── tailwind.config.js # Tailwind CSS parameters
    ├── vite.config.js     # Vite builder setup
    └── src/
        ├── assets/        # Static assets
        ├── components/    # Reusable UI elements (Navbar, Sidebar, BookCard, etc.)
        ├── context/       # React Context (AuthContext)
        ├── layouts/       # Main structured layouts (DashboardLayout)
        ├── lib/           # Utility integrations
        ├── pages/         # Core application views (Login, Books, AdminDashboard, etc.)
        ├── services/      # API communication methods
        └── utils/         # Frontend helper logic
```

---

## ⚙️ Installation Instructions

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB database instance
* Accounts for Cloudinary, Twilio, and an Email provider (for full functionality)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/Library-Management-System.git
cd Library-Management-System
```

### 2. Install dependencies

**Backend:**
```bash
cd Backend
npm install
```

**Frontend:**
```bash
cd ../Frontend
npm install
```

---

## 🔐 Environment Variables Setup

You'll need to create `.env` files in both the `Backend` and `Frontend` directories.

**Backend (`Backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email setup (Nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

# Twilio setup
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

**Frontend (`Frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🚀 Running the Application

Follow these steps to spin up the local development environment:

**1. Start the Backend server:**
```bash
# From the Backend directory
npm run dev
# or
node server.js
```

**2. Start the Frontend client:**
```bash
# From the Frontend directory
npm run dev
```

The frontend will typically be accessible at `http://localhost:5173` and the backend strictly operating out of `http://localhost:5000`.

---

## 🖼️ Screenshots

*(Add placeholders/images of your project here to make it appealing for recruiters and reviewers)*

|<img src="https://via.placeholder.com/400x250?text=Login+Screen" alt="Login"/>|<img src="https://via.placeholder.com/400x250?text=Dashboard" alt="Dashboard"/>|
|:---:|:---:|
| **Authentication Flow** | **User Dashboard** |

|<img src="https://via.placeholder.com/400x250?text=Admin+Panel" alt="Admin Panel"/>|<img src="https://via.placeholder.com/400x250?text=Book+Details" alt="Book Details"/>|
|:---:|:---:|
| **Admin Management Portal** | **Detailed Book View** |

---

## 🔮 Future Improvements
* **Advanced Search & Filtering:** Implement deeper search criteria (e.g., sort by publishing year, genre).
* **Payment Gateway Integration:** For handling late return fees or premium memberships.
* **Ratings & Reviews:** Allow users to leave feedback and ratings on books.
* **E-Book Reader:** Embed a basic document viewer for digital-only assets.
* **Analytics Dashboard:** Graphical charts mapping library utilization trends.

---

## 🤝 Contribution Guide
Contributions are always welcome! 

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License
Distributed under the ISC License. See `LICENSE` for more information.

---

## 👨‍💻 Author
**Sakshi-Chaturvedi**  
* GitHub: [Sakshi-Chaturvedi](https://github.com/Sakshi-Chaturvedi)
