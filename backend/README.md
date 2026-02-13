# WISE - AI-Powered Loan Application Analyzer

WISE (Wealth Intelligence & Smart Evaluation) is an intelligent loan application analysis platform powered by AWS Bedrock and Claude AI. It provides instant loan approval probability assessments, personalized recommendations, and an interactive financial advisor chatbot.

## Features

- **AI-Powered Analysis**: Leverages Claude 3.5 Sonnet via AWS Bedrock for intelligent loan evaluation
- **Approval Probability**: Get instant approval chances based on credit score, income, and loan details
- **Smart Recommendations**: Receive actionable suggestions to improve loan approval odds
- **Interactive Chatbot**: Ask questions and get personalized financial advice
- **Modern UI**: Clean, responsive React interface with real-time data visualization

## Tech Stack

**Frontend:**
- React 19 + Vite
- Axios for API calls
- React Markdown for chat formatting
- CSS3 for styling

**Backend:**
- Python Flask
- AWS Bedrock (Claude 3.5 Sonnet)
- boto3 for AWS integration
- Flask-CORS for cross-origin support

## Project Structure

```
WISE/
├── frontend/          # React application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── FinancingReview.jsx
│   │   ├── Chatbot.jsx
│   │   └── ApprovalDonutChart.jsx
│   └── package.json
│
└── backend/           # Flask API
    ├── app.py
    ├── requirements.txt
    └── .env
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- AWS Account with Bedrock access
- AWS IAM credentials with `bedrock:InvokeModel` permission

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
```

4. Enable AWS Bedrock model access:
   - Go to AWS Console → Bedrock → Model access
   - Enable Claude 3.5 Sonnet

5. Add IAM permissions to your user:
   - Attach `AmazonBedrockFullAccess` policy or create custom policy with `bedrock:InvokeModel`

6. Run the server:
```bash
python app.py
```

Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### POST `/api/finance-application/analyse`
Analyzes loan application and returns approval probability.

**Request Body:**
```json
{
  "credit_score": "700-749",
  "income": "100000",
  "loan_amount": "20000",
  "loan_term": "48",
  "apr": "7",
  "down_payment": "20000",
  "address": "123 Main St, City, State, ZIP"
}
```

**Response:**
```json
{
  "status": 200,
  "response": {
    "approval_chance": 85,
    "reasons": ["Strong credit score", "Adequate income"],
    "suggestions": ["Consider shorter loan term"]
  }
}
```

### POST `/api/finance-application/chat`
Interactive chatbot for financial advice.

**Request Body:**
```json
{
  "message": "How can I improve my approval chances?",
  "history": [],
  "credit_score": "700-749",
  "income": "100000",
  ...
}
```

## Usage

1. Fill in loan application details (credit score, income, loan amount, etc.)
2. Click "Analyze Application" to get AI-powered assessment
3. Review approval probability and recommendations
4. Use the chatbot to ask follow-up questions

## Security Notes

- Never commit `.env` file to version control
- Keep AWS credentials secure
- Use IAM roles with minimal required permissions
- Rotate access keys regularly

## License

MIT

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
