# On Time NEMT Workflows (PWA) — Setup

## What this is
A mobile-friendly web app you can "Install to Home Screen" on iPhone/Android:
- Login (drivers + managers)
- Daily Pre-Trip checklist (required completion)
- Cleaning checklist (required completion)
- Incident report (photo + optional voice note)
- Maintenance note/log (photo)
- Monthly Ops & Safety Review checklist
- Admin dashboard (view + export CSV/JSON)

Defaults: login ✅ offline ✅ (Demo mode uses your computer's local storage; no Firebase setup required.)

---

## 1) Install dependencies
1. Install Node.js (LTS)
2. In a terminal:
   ```bash
   cd on-time-nemt-workflows-app
   npm install
   ```

## 2) Run (demo mode — no setup)
After `npm install`, run:

```bash
npm run dev
```

Open the URL it prints (e.g., http://localhost:5173).

Create an account in the app (Sign up). In demo mode, **Admin** is automatically granted to **bdoerr5005@gmail.com**.

---

## Optional) Switch to Firebase (production)
When you're ready for real multi-user + secure cloud storage, follow these steps.

### 1) Create Firebase project
1. Go to Firebase Console → Create Project
2. Build → Authentication → Sign-in method → enable **Email/Password**
3. Build → Firestore Database → Create (Production mode is fine)
4. Build → Storage → Get started

### 2) Add your Firebase config
1. Firebase Console → Project Settings → Your apps → Add app (Web)
2. Copy config values into a new file named `.env` at project root:

   ```bash
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

### 3) Add security rules
Copy/paste from `firebase-security-rules.txt` into:
- Firestore Rules
- Storage Rules

### 4) Make yourself Admin
1. Create your account in the app (sign up)
2. Firebase Console → Firestore → Create collection `admins`
3. Create document ID = your Firebase Auth UID
4. Refresh app → Admin Dashboard appears

### 5) Deploy (fast)
Recommended: Vercel
1. Push code to GitHub
2. Import repo in Vercel
3. Add the same env vars in Vercel Project Settings
4. Deploy
5. On phone: open URL → Share → "Add to Home Screen"

---

## Next upgrades (if you want)
- Driver roster + vehicle registry
- Trip integration hooks (RouteGenie/Bambi/WelRyde)
- Required signature capture (driver + supervisor)
- PDF export formatted like your Ops Binder
- Push notifications for missed checklists
