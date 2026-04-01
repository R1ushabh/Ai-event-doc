# EventForge AI 🚀

**EventForge AI** is a sophisticated AI-powered document generator designed to transform event descriptions into professional, production-ready document suites. Whether you're planning a tech summit, a corporate gala, or a community workshop, EventForge AI crafts everything from proposals and flyers to budget breakdowns and analytics forecasts in seconds.

---

## ✨ Features

- **Quick Paste & Structured Form**: Input event details using natural language or a guided form.
- **AI Document Suite**: Instantly generate 8+ professional documents:
  - 📄 **Proposal**: Formal event pitch.
  - 🎨 **Flyer**: Visually striking poster-style preview.
  - 📝 **Attendance Sheet**: Printable table for check-ins.
  - 💰 **Budget Breakdown**: Detailed cost analysis with ROI tips.
  - ⏳ **Event Schedule**: Minute-by-minute timeline.
  - 📊 **Analytics Dashboard**: Predictive reach and engagement charts.
  - 📰 **Summary**: Polished versions for newsletters, social media, and memos.
  - 📋 **Planning Checklist**: Step-by-step execution guide.
- **Export Options**: Download your documents as **DOCX**, **PDF**, or **CSV**.
- **Premium UI**: Modern, responsive dashboard built with React 19 and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts.
- **Backend**: Node.js, Express, TypeScript.
- **AI**: Google Generative AI SDK (Gemini 2.0 Flash).
- **Document Generation**: `docx`, `pdfkit`, `csv-writer`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- A [Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/eventforge-ai.git
   cd eventforge-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   *(See `.env.example` for reference)*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/       # UI Components (Layout, Workspace, Documents)
│   ├── lib/              # Core logic (Gemini API, Types, Utilities)
│   ├── App.tsx           # Main Application Entry
│   └── index.css         # Global Styles & Tailwind Config
├── backend/              # Backend service logic
├── server.ts             # Express server entry point
├── .env.example          # Environment variable template
├── package.json          # Project dependencies & scripts
└── README.md             # Project documentation
```

---

## 🤝 Contributing

We welcome contributions! To contribute, follow these steps:

1. **Fork the Project**
2. **Create your Feature Branch:**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes:**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch:**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Ensure your code follows the existing style and conventions.
- Run `npm run lint` to check for TypeScript errors.
- Test your changes thoroughly before submitting a PR.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the EventForge AI Team.
