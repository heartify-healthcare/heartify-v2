# Heartify - Cardiovascular Disease Detection Mobile App

This repository contains the **Mobile Application** component of a university capstone project aimed at early detection of cardiovascular disease (CVD). The app allows users to **register**, **log in**, **verify their identity**, and most importantly, **submit personal health metrics** to a backend API, which then uses a machine learning model to predict the likelihood of cardiovascular disease.

## 🛠️ Technologies Used

- **Expo + React Native** — for fast, cross-platform mobile development.
- **Spring Boot Backend API** — receives health data and returns results based on a Deep Learning model trained on ECG datasets and a medical Large Language Model.

## 📱 Features

- 🔐 User authentication:
  - Register a new account
  - Log in securely
  - Identity verification flow
- 📊 Health data input:
  - Users can input various health metrics such as age, blood pressure, cholesterol, ECG signal, etc.
  - Data is submitted to a secure Spring Boot backend
- 🩺 Disease prediction:
  - The backend returns prediction results based on a trained Deep Learning model and a medical Large Language Model
  - Users receive immediate feedback on potential cardiovascular risks

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)

### Running the App Locally

```bash
git clone https://github.com/votranphi/heartify-v2
cd heartify-v2
npm install
```

For Android:
```bash
npx expo prebuild --clean
npx expo run:android
```

For iOS:
```bash
npx expo run:ios
```

Scan the QR code using the **Expo Go app** on your mobile device or use an Android/iOS emulator.

## 🔗 Backend Integration

This app is designed to interact with a Spring Boot-based REST API server that:
- Receives health metrics in JSON format
- Communicate with Deep Learning model for heart disease prediction and Large Languague Model for explanation.
- Returns results

👉 Spring Boot API Repository: [https://github.com/votranphi/heartify-api-v2](https://github.com/votranphi/heartify-api-v2)

## 📚 Academic Context

This mobile application was developed as part of a university **graduation thesis**, under the topic:

> **"Heart disease risk prediction using ECG signals with deep learning and large language models."**

## ✍️ Author

- [Vo Tran Phi](https://github.com/votranphi)
- [Le Duong Minh Phuc](https://github.com/minhphuc2544)

## 📄 License

This project is available under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) license.