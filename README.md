
**SmartQuizzer** is a high-performance, AI-driven assessment tool designed to transform static study materials into dynamic, adaptive learning experiences. Utilizing Google's **Gemini 3 Pro** model, the platform extracts key concepts from documents and generates high-fidelity Multiple Choice Questions (MCQs) tailored to specific difficulty levels.

---

## 🚀 Features

### 🔐 Professional Authentication
A dedicated entry system for personalized learning sessions. Users can create accounts and maintain their progress across different modules.

### 📄 Intelligent Document Parsing
- **PDF Uploads:** Native support for parsing complex PDF documents.
- **Raw Text Input:** Paste notes, articles, or transcripts for immediate conversion.
- **Semantic Understanding:** The AI identifies core themes, definitions, and applications rather than just keywords.

### ⚙️ Precision Configuration
Tailor every session to your needs:
- **Quantity Control:** Generate between 5 and 20 questions per session.
- **Difficulty Settings:** Choose from **Easy**, **Medium**, or **Hard** baselines.
- **Strict MCQ Format:** High-quality questions with 4 distinct distractors and a single correct answer.

### ⚡ Real-Time Adaptive Feedback
- **Instant Explanations:** Receive a detailed conceptual breakdown immediately after answering.
- **Progress Tracking:** Interactive progress bars and difficulty badges.
- **One-Click Submission:** Professional flow from question 1 to final results.

### 📊 Advanced Performance Analytics
Powered by responsive charting, the dashboard provides:
- **Topic Mastery:** Identify which subjects you've conquered and where you need more focus.
- **Accuracy Metrics:** Real-time calculation of retention and precision.
- **Learning Trajectory:** Visualize the challenge curve of your session.
- **Weakness Analysis:** AI-generated strategic recommendations for future study.

## 🛠️ Technical Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **AI Engine:** Google Gemini 3 Pro
- **Visualization:** Recharts (Data Visualization)
- **Icons:** FontAwesome 6

## 🛠️ Setup Instructions

Follow these steps to get the project running locally:

### 1. Obtain a Google AI Key
Create a new API key. This key is required to power the assessment generation.

### 2. Clone the Repository
Clone the project to your local machine using the following command:
```bash
git clone https://github.com/your-username/smart-quizzer.git
cd smart-quizzer
```

### 3. Configure Environment Variables
The application requires the `API_KEY` to be available in your environment. Create a `.env` file in the root directory or set it in your terminal:
```bash
# Example for Linux/macOS
export API_KEY='your_actual_api_key_here'

# Example for Windows (Command Prompt)
set API_KEY=your_actual_api_key_here
```

### 4. Install Dependencies
Install all required packages using npm:
```bash
npm install
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```
