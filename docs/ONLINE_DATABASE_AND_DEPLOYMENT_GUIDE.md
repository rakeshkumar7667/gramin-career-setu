# 🌾 Gramin Career Setu — Online Real-Time Database, Vercel & APK Guide

This guide explains how your application connects to a **100% free online real-time database** (Google Cloud Firestore) and operates seamlessly across **all three platforms simultaneously**:
1. 💻 **Your Local Computer** (`http://localhost:5000`)
2. ☁️ **Vercel Cloud Hosting** (`https://your-app.vercel.app`)
3. 📱 **Android Mobile APK** (Installed on real Android smartphones)

All three environments connect to the **same real-time database**. Any job application, workshop registration, or account created on the APK or Vercel will instantly appear on your local dashboard in real time!

---

## ⚡ Part 1: How to Get Your Free Online Database Keys (3 Minutes)

Google Firebase provides a generous **Forever-Free Spark Plan** (50,000 reads/day, 20,000 writes/day, 1 GB storage — no credit card needed).

### Step 1: Create a Free Project
1. Open [console.firebase.google.com](https://console.firebase.google.com/) in your browser.
2. Sign in with your regular Google account.
3. Click **"Add project"** (or "Create a project").
4. Enter project name: `gramin-career-setu` (or any name you like) and click **Continue**.
5. You can disable Google Analytics (optional) and click **Create project**.

### Step 2: Create the Firestore Database
1. In your Firebase project sidebar, click **Build** &rarr; **Firestore Database**.
2. Click **Create database**.
3. Choose a database location close to your users (e.g., `asia-south1 (Mumbai)` or `us-central`).
4. Select **Start in test mode** (allows rapid reading and writing) and click **Create**.
   *(Note: For production, copy the hardened rules from `firestore.rules` into the Firebase Rules tab!)*

### Step 3: Get Your Web App Keys
1. In the project overview page, click the **Web icon (`</>`)** to add a web app.
2. Enter app nickname: `Gramin Career Setu Web`.
3. Uncheck "Firebase Hosting" and click **Register app**.
4. You will see a `firebaseConfig` code block that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "gramin-career-setu.firebaseapp.com",
     projectId: "gramin-career-setu",
     storageBucket: "gramin-career-setu.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:abcdef..."
   };
   ```

### Step 4: Connect the Database to Your App

You have **two easy ways** to connect:

* **Way A — Instant Connect in Browser (No Code Editing):**
  1. Open your app in the browser (`http://localhost:5000` or your Vercel URL).
  2. Notice the badge at the bottom right: `Cloud DB: Offline (Click to Connect)`.
  3. Click it to open the **Database Setup Modal**.
  4. Paste your `firebaseConfig` block directly into the text box and click **Connect & Sync**.
  5. The badge will instantly turn green: `🟢 Cloud DB: Real-Time Active`!

* **Way B — Permanent Connect in Code:**
  1. Open `assets/firebase-config.js`.
  2. Replace `window.GCS_FIREBASE_CONFIG` with your actual keys from Firebase.
  3. Save the file.

> **Automatic Initial Data Seeding:** As soon as you connect your empty database, the app automatically uploads all **35 verified rural job roles** and scheduled **workshops** into your Firestore database! You don't have to enter them manually.

---

## 🚀 Part 2: Deploying to Vercel (1-Click Global Hosting)

Your repository already includes a pre-configured `vercel.json` with strict security headers, clean URLs, and offline PWA caching.

### Option 1: Deploy with Vercel CLI (Fastest)
Run this command from your terminal inside `C:\Users\rakes\csp`:
```powershell
npx vercel
```
* Follow the prompts (login with GitHub/Email, select project name, press Enter for defaults).
* For production deploy, run:
```powershell
npx vercel --prod
```
* Your app will be live at `https://gramin-career-setu.vercel.app` (or your custom assigned URL)!

### Option 2: Deploy via GitHub (Automatic Updates)
1. Push your `csp` folder to a GitHub repository:
   ```powershell
   git add .
   git commit -m "feat: real-time cloud database and vercel configuration"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com), click **Add New** &rarr; **Project**.
3. Import your GitHub repository and click **Deploy**.
4. Any future changes you push will automatically redeploy within seconds!

---

## 📱 Part 3: Generating the Android APK

You can build an Android `.apk` file using either **Capacitor** or **PWABuilder**.

### Method 1: Capacitor (Standard Android Studio Build)
The project is pre-configured with `capacitor.config.json`.

1. **Install Capacitor Android platform:**
   ```powershell
   cd C:\Users\rakes\csp
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   npx cap sync
   ```

2. **Open the native project in Android Studio:**
   ```powershell
   npx cap open android
   ```

3. **Build the APK:**
   * In Android Studio, wait for Gradle sync to complete.
   * Click the top menu: **Build** &rarr; **Build Bundle(s) / APK(s)** &rarr; **Build APK(s)**.
   * Once built, click **locate** to find `app-debug.apk`.
   * Transfer this APK to your phone or share via WhatsApp/Google Drive to install!

---

### Method 2: PWABuilder (Zero Android Studio Installation Needed)
If you do not have Android Studio installed on your computer:
1. Deploy your app to Vercel (as explained in Part 2).
2. Go to [https://www.pwabuilder.com/](https://www.pwabuilder.com/).
3. Paste your Vercel URL (e.g., `https://your-project.vercel.app`) and click **Start**.
4. PWABuilder will audit your PWA (manifest, service worker, icons are all pre-configured).
5. Click **Package for Stores** &rarr; Select **Android** &rarr; Click **Generate Package**.
6. Download the ready-to-install Android `.apk` directly to your phone!

---

## 🔒 Part 4: Security Rules (Protecting Your Database)

When you are ready to publish, go to the **Rules** tab in the Firebase Firestore Console and paste the hardened rules provided in [firestore.rules](../firestore.rules).

These rules ensure:
- 📖 **Jobs, Workshops, Schemes, & Scholarships**: Anyone can view, only authorized admins can edit.
- 📝 **Applications & Registrations**: Students can submit applications and cancel their own bookings.
- 📄 **Resumes & Profiles**: Each student can only read and update their own resume and account.
