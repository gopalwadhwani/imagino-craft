# ImaginoCraft

An AI-powered text-to-image generation platform. Users describe an image in plain text, and ImaginoCraft generates it using AI, stores it in the cloud, and keeps a full history of every creation. Built with a credit-based system and integrated payments for purchasing more credits.

## Features

- **User Authentication** — Register and log in securely with JWT-based auth and bcrypt password hashing.
- **AI Image Generation** — Turn text prompts into images using the ClipDrop text-to-image API.
- **Credit System** — Every image generation costs 1 credit. New users start with free credits.
- **Buy Credits** — Purchase additional credits via Razorpay (Basic / Advanced / Business plans), with secure server-side order creation and payment verification.
- **Cloud Storage** — Generated images are uploaded to Cloudinary and served via permanent URLs (not stored as base64).
- **Generation History** — View, enlarge, browse (previous/next), download, and delete all previously generated images.
- **Responsive UI** — Built with Tailwind CSS and Framer Motion (`motion`) for smooth animations.

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Framer Motion (`motion`)
- Axios
- React Toastify

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- Razorpay for payments
- Cloudinary for image hosting
- ClipDrop API for AI image generation

## Project Structure

```
ImaginoCraft/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── assets/         # Images, icons, static data
│   │   ├── components/     # Navbar, Footer, Login, etc.
│   │   ├── context/        # AppContext (global state)
│   │   ├── pages/           # Home, Result, BuyCredit, History
│   │   └── App.jsx
│   └── .env                # VITE_BACKEND_URL, VITE_RAZORPAY_KEY_ID
│
└── server/                 # Express backend
    ├── config/              # mongodb.js, cloudinary.js
    ├── controllers/         # userController.js, imageController.js
    ├── middlewares/         # auth.js (JWT verification)
    ├── models/              # userModel.js, imageModel.js, transactionModel.js
    ├── routes/               # userRoutes.js, imageRoutes.js
    ├── server.js
    └── .env                 # secrets (never committed)
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB database (e.g., MongoDB Atlas)
- Accounts + API keys for: [ClipDrop](https://clipdrop.co/apis), [Cloudinary](https://cloudinary.com), [Razorpay](https://razorpay.com)

### 1. Clone the repository
```bash
git clone https://github.com/gopalwadhwani/imagino-craft.git
cd ImaginoCraft
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `server/.env` file:
```
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_string
CLIPDROP_API=your_clipdrop_api_key
CURRENCY=INR
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
```

Run the backend:
```bash
npm run server
```

### 3. Frontend setup
```bash
cd client
npm install
```

Create a `client/.env` file:
```
VITE_BACKEND_URL=http://localhost:4000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## How It Works

1. **User registers/logs in** → receives a JWT token stored in `localStorage`.
2. **User submits a prompt** on the Result page → request sent to `/api/image/generate` with the JWT in headers.
3. **Backend middleware** (`userAuth`) verifies the token and attaches `userId` to the request.
4. **Backend checks credit balance** — if sufficient, calls the ClipDrop API to generate the image.
5. **Generated image is uploaded to Cloudinary**, and a record (`userId`, `prompt`, `imageUrl`) is saved to MongoDB.
6. **User's credit balance is decremented**, and the image URL is returned to the frontend.
7. **User can view all past generations** on the History page, fetched via `/api/image/history`.
8. **When credits run low**, the user is redirected to the Buy Credits page, where Razorpay handles secure payment and the backend verifies payment before crediting the account.

## API Routes

| Method | Route                        | Description                                | Auth Required |
|--------|-------------------------------|---------------------------------------------|:---:|
| POST   | `/api/user/register`         | Register a new user                         | No |
| POST   | `/api/user/login`            | Log in an existing user                     | No |
| GET    | `/api/user/credits`          | Get current user's credit balance           | Yes |
| POST   | `/api/user/pay-razorpay`     | Create a Razorpay order for a credit plan   | Yes |
| POST   | `/api/user/verify-razorpay`  | Verify payment and add credits              | No* |
| POST   | `/api/image/generate`        | Generate an image from a text prompt        | Yes |
| GET    | `/api/image/history`         | Get all images generated by the user        | Yes |
| POST   | `/api/image/delete`          | Delete a specific generated image           | Yes |

*Verification is validated against Razorpay's order records rather than the JWT, since Razorpay's checkout callback doesn't carry custom auth headers.

## Security Notes

- Passwords are hashed with bcrypt before storage — plaintext passwords are never saved.
- All sensitive routes are protected by JWT verification middleware.
- Payment amounts and credit plans are defined server-side only — the frontend cannot manipulate pricing.
- Payments are verified against Razorpay's own order records before crediting an account, not just trusted from the frontend response.
- `.env` files are excluded from version control via `.gitignore` and must be configured manually per environment.

## Roadmap

- [ ] Remove Background tool (credit-based, via ClipDrop)
- [ ] Image Compression tool (free, server-side via Sharp)
- [ ] Image to PDF tool (free, server-side via pdf-lib)
- [ ] Full mobile responsiveness pass
- [ ] Live payment mode (requires Razorpay KYC)

## License

This project is for educational/portfolio purposes.