# Heartify - Cardiovascular Disease Detection Mobile App

This repository contains the **Mobile Application** component of a university capstone project aimed at early detection of cardiovascular disease (CVD). The app allows users to **register**, **log in**, **verify their identity**, and most importantly, **submit personal health metrics** to a backend API, which then uses a machine learning model to predict the likelihood of cardiovascular disease.

## 🛠️ Technologies Used

- **Expo + React Native** — for fast, cross-platform mobile development.
- **NativeWind** — TailwindCSS styling for React Native.
- **NativeCN (shadcn/ui)** — UI component library for clean and accessible designs.
- **Flask Backend API** — receives health data and returns predictions based on a CNN+LSTM model trained on cardiovascular datasets.

## 📱 Features

- 🔐 User authentication:
  - Register a new account
  - Log in securely
  - Identity verification flow
- 📊 Health data input:
  - Users can input various health metrics such as age, blood pressure, cholesterol, etc.
  - Data is submitted to a secure Flask backend
- 🩺 Disease prediction:
  - The backend returns prediction results based on a trained deep learning model
  - Users receive immediate feedback on potential cardiovascular risks

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)

### Running the App Locally

```bash
git clone https://github.com/votranphi/react-native-cardiovascular-disease
cd react-native-cardiovascular-disease
npm install
npx expo start
```

Scan the QR code using the **Expo Go app** on your mobile device or use an Android/iOS emulator.

## 🔗 Backend Integration

This app is designed to interact with a Flask-based REST API server that:
- Receives health metrics in JSON format
- Loads a `.keras` model trained on cardiovascular data
- Returns prediction results

👉 Flask API Repository: [https://github.com/votranphi/flask-cardiovascular-disease](https://github.com/votranphi/heartify-api)

## 📚 Academic Context

This mobile application was developed as part of a university **capstone project** (not a graduation thesis), under the topic:

> **"Deep learning-based AIoT system for cardiovascular disease prediction: A CNN-LSTM approach."**

## ✍️ Author

- [Vo Tran Phi](https://github.com/votranphi)
- [Le Duong Minh Phuc](https://github.com/minhphuc2544)

## 📄 License

This project is for academic purposes and not intended for production or medical use. Licensing may apply depending on institutional policy.
