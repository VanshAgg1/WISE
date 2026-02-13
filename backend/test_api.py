import requests
import json

# Test the API endpoint
url = "http://127.0.0.1:5000/api/finance-application/analyse"

data = {
    "credit_score": 680,
    "income": 75000,
    "loan_amount": 250000,
    "loan_term": 360,
    "apr": 6.5,
    "down_payment": 50000,
    "address": "123 Main St"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
