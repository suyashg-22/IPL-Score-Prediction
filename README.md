# 🏏 IPL First Innings Score Predictor

> A real-time Machine Learning cricket score prediction web application built with **React (JavaScript)** and deployable in 1 click on **Vercel** with zero backend infrastructure needed.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsuyashg-22%2FIPL-Score-Prediction)

---

## 🚀 Overview

Predicting a T20 cricket total requires understanding how pitch conditions, team strength, run rates, and wickets in hand affect momentum. This project uses machine learning on **76,000+ ball-by-ball deliveries** from IPL Seasons 1 to 12.

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, and Tailwind CSS.
- **Machine Learning**: Linear Regression (achieving the lowest MAE of **12.12 runs** on the test set).
- **Deployment**: Ready for **Vercel** deployment (Static SPA + Serverless API at `/api/predict`).
- **Offline / Zero Latency**: The exact Scikit-Learn model weights run directly in the browser and in Vercel serverless functions — meaning zero cold starts, zero server costs, and instant real-time predictions as you slide overs or tweak runs.

---

## 📊 Model Performance & Benchmarks

From model evaluation on the test set (IPL Season 2017):

| Model | MAE (Runs) | MSE | RMSE | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Linear Regression** | **12.12** | **251.01** | **15.84** | **Selected (Best)** |
| AdaBoost Regressor | 12.22 | 249.60 | 15.80 | Baseline match |
| Random Forest Regressor | 13.76 | 330.21 | 18.17 | Overfitting |
| Decision Tree Regressor | 17.09 | 531.06 | 23.04 | High variance |

---

## ⚡ Quick Start (Local Development)

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production
```bash
npm run build
```

---

## 🌐 How to Deploy to Vercel

Since you already use Vercel ([suyashs-projects-8d8c18dc](https://vercel.com/suyashs-projects-8d8c18dc)), deploying this ML project is as simple as deploying any standard React/Next.js app:

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Add React frontend and Vercel serverless ML deployment"
git push origin main
```

### Step 2: Import into Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/suyashs-projects-8d8c18dc).
2. Click **"Add New..."** &rarr; **"Project"**.
3. Select your GitHub repository: `suyashg-22/IPL-Score-Prediction`.
4. Vercel automatically detects the **Vite** preset and sets:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**!

Your app will be live at `https://ipl-score-prediction-xxxx.vercel.app`! Any future `git push` to `main` will automatically trigger a new deployment.

---

## 🔌 Serverless REST API Endpoint

A serverless function is included in [`api/predict.js`](api/predict.js). When deployed to Vercel, you can query it from any client:

### Endpoint
`POST /api/predict`

### Request Body
```json
{
  "battingTeam": "Kolkata Knight Riders",
  "bowlingTeam": "Delhi Daredevils",
  "overs": 9.2,
  "runs": 79,
  "wickets": 2,
  "runsLast5": 60,
  "wicketsLast5": 1
}
```

### Response
```json
{
  "success": true,
  "data": {
    "predictedScore": 169,
    "rangeLow": 161,
    "rangeHigh": 177,
    "currentRunRate": "8.59"
  }
}
```

---

## 📁 Project Structure

```
IPL-Score-Prediction/
├── api/
│   └── predict.js                   # Vercel Serverless Function (REST API)
├── dataset/
│   └── ipl.csv                      # Historical IPL ball-by-ball dataset
├── src/
│   ├── data/
│   │   └── model.js                 # Teams, coefficients, presets, predictor
│   ├── App.jsx                      # Main React cricket dashboard UI
│   ├── index.css                    # Custom styles & stadium glassmorphism
│   └── main.jsx                     # React DOM entry point
├── First Innings Score Prediction - IPL.ipynb  # Original Jupyter Notebook
├── model_weights.json               # Extracted ML model coefficients & metrics
├── predict.py                       # Python CLI predictor runner
├── package.json                     # Node.js dependencies & scripts
├── vite.config.js                   # Vite configuration
├── vercel.json                      # Vercel deployment configuration
└── README.md                        # Project documentation
```

---

## 📝 License
This project is open-source and available under the MIT License.
