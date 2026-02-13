from flask import Flask, request, jsonify
import boto3
import json
from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize Bedrock client
bedrock = boto3.client(
    service_name='bedrock-runtime',
    region_name=os.getenv('AWS_DEFAULT_REGION'),
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

sample_response = {
    "approval_chance": "Low",
    "reasons": [
      "Credit score is below 650",
      "High loan amount compared to income",
      "Self-employment adds risk without verified income history"
    ],
    "suggestions": [
      "Improve credit score to 700+",
      "Reduce loan amount or increase down payment",
      "Add a salaried co-applicant"
    ]
}
@app.route('/')
def home():
    return jsonify({
        'status': 'running',
        'message': 'Finance Application API is running. Use /api/finance-application/analyse endpoint for loan analysis.'
    })

def create_prompt(credit_score, income, loan_amount, loan_term, apr, down_payment, address):
    prompt = f"""
    Analyze the following loan application data:
    - Credit Score: {credit_score}
    - Finance Term: {loan_term} months
    - Down Payment: ${down_payment}
    - Address: {address}
    - Annual Income: {income}
    - Loan Amount: {loan_amount}
    - APR: {apr}


    Please assess the loan approval probability and provide suggestions for improvement.

    Please provide the response in valid JSON format only, without any additional text or explanation.
    Format the response as follows:
    {{
      "approval_chance": "<value in percentage ranging from 0 to 100, type number>",
      "reasons": [<array of reasons>],
      "suggestions": [<array of suggestions>]
    }}
    """
    return prompt

@app.route('/api/finance-application/analyse', methods=['POST'])
def analyseFinanceApplication():
    try:
        print("Received request:", request.json)
        
        address = request.json.get('address')
        credit_score = request.json.get('credit_score')
        income = request.json.get('income')
        loan_amount = request.json.get('loan_amount')
        loan_term = request.json.get('loan_term')
        apr = request.json.get('apr')
        down_payment = request.json.get('down_payment')

        prompt = create_prompt(credit_score, income, loan_amount, loan_term, apr, down_payment, address)
        print("Calling Bedrock...")

        # Get Advise from Bedrock
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-5-sonnet-20240620-v1:0',
            body=json.dumps({
                 'anthropic_version': 'bedrock-2023-05-31',
                 'max_tokens': 4096,
                 'messages': [
                     {
                         'role': 'user',
                         'content': prompt
                     }
                 ]
            })
        )
        response_body = json.loads(response['body'].read())
        content = response_body['content'][0]['text']
        content = content.replace("`", "")
        content = content.replace("json", "")
        content = content.replace("\n", "")
        print("Bedrock response:", content)
        return jsonify({'status': 200, 'response': json.loads(content)})

    except Exception as e:
        print(f"Error in analyse endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/finance-application/chat', methods=['POST'])
def chat():
    try:
        message = request.json.get('message')
        history = request.json.get('history', [])
        address = request.json.get('address')
        credit_score = request.json.get('credit_score')
        income = request.json.get('income')
        loan_amount = request.json.get('loan_amount')
        loan_term = request.json.get('loan_term')
        apr = request.json.get('apr')
        down_payment = request.json.get('down_payment')

        context = f"""
You are a helpful financial advisor assistant. Here is the user's loan application context:
- Credit Score: {credit_score}
- Annual Income: ${income}
- Loan Amount: ${loan_amount}
- Loan Term: {loan_term} months
- APR: {apr}%
- Down Payment: ${down_payment}
- Address: {address}

Answer the user's question based on this context.
"""

        messages = [{'role': 'user', 'content': context}]
        for msg in history:
            messages.append({
                'role': 'assistant' if msg['sender'] == 'bot' else 'user',
                'content': msg['content']
            })
        messages.append({'role': 'user', 'content': message})

        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-5-sonnet-20240620-v1:0',
            body=json.dumps({
                'anthropic_version': 'bedrock-2023-05-31',
                'max_tokens': 2048,
                'messages': messages
            })
        )
        response_body = json.loads(response['body'].read())
        content = response_body['content'][0]['text']
        return jsonify({'response': content})

    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
