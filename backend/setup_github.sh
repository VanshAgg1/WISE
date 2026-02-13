#!/bin/bash

# WISE GitHub Repository Setup Script

echo "Setting up WISE repository..."

# Create main project directory
mkdir -p ~/WISE
cd ~/WISE

# Copy backend
echo "Copying backend files..."
cp -r /Users/aggvansh/Downloads/hackathon/* ./backend/
mkdir -p backend
mv app.py backend/ 2>/dev/null
mv requirements.txt backend/ 2>/dev/null
mv README.md backend/ 2>/dev/null
mv .gitignore backend/ 2>/dev/null
mv test_api.py backend/ 2>/dev/null
mv test_credentials.py backend/ 2>/dev/null

# Copy frontend
echo "Copying frontend files..."
cp -r /Users/aggvansh/Downloads/Archive/WISE/WISE/* ./frontend/

# Remove .env from backend (security)
rm -f backend/.env

# Create root README
cat > README.md << 'EOF'
# WISE - AI-Powered Loan Application Analyzer

AI-driven loan approval analysis platform using AWS Bedrock Claude AI. Get instant approval probability, personalized recommendations, and financial advice through an intelligent chatbot.

## Quick Start

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# Configure .env with AWS credentials
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

See individual README files in `backend/` and `frontend/` for detailed setup.

## Tech Stack
- Frontend: React + Vite
- Backend: Flask + AWS Bedrock (Claude 3.5 Sonnet)
- AI: Claude 3.5 Sonnet via AWS Bedrock

## Features
✅ AI-powered loan analysis
✅ Approval probability prediction
✅ Smart recommendations
✅ Interactive financial advisor chatbot
EOF

# Initialize git
git init
git add .
git commit -m "Initial commit: WISE loan analyzer with AI chatbot"

echo ""
echo "✅ Repository prepared!"
echo ""
echo "Next steps:"
echo "1. Create repository on GitHub: https://github.com/new"
echo "   - Name: WISE"
echo "   - Description: AI-powered loan application analyzer using AWS Bedrock Claude AI for instant approval predictions and financial advice"
echo ""
echo "2. Run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/WISE.git"
echo "   git branch -M main"
echo "   git push -u origin main"
