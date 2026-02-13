import boto3
from dotenv import load_dotenv
import os

load_dotenv()

print("Testing AWS credentials...")
print(f"Region: {os.getenv('AWS_DEFAULT_REGION')}")
print(f"Access Key: {os.getenv('AWS_ACCESS_KEY_ID')}")

try:
    # Test with STS to verify credentials
    sts = boto3.client('sts',
        region_name=os.getenv('AWS_DEFAULT_REGION'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    identity = sts.get_caller_identity()
    print("✓ Credentials are valid!")
    print(f"Account: {identity['Account']}")
    print(f"User ARN: {identity['Arn']}")
    
    # Test Bedrock access
    bedrock = boto3.client('bedrock-runtime',
        region_name=os.getenv('AWS_DEFAULT_REGION'),
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    print("✓ Bedrock client initialized successfully!")
    
except Exception as e:
    print(f"✗ Error: {e}")
