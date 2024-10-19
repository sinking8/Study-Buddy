import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import env file
from dotenv import load_dotenv
load_dotenv()

# Load Gemini
from modules.gemini import *
app = FastAPI()

# Load Prompts
with open('./utils/prompts.json') as f:
    prompts = json.load(f)
gemini_api = GeminiAPI(prompts)

# Sample Documents
# loading docs
# we will use some artificial data for this example

@app.get("/")
def home_root():
    return {"message": "Hello World"}

@app.get("/prompts")
def get_prompts():
    return prompts

@app.get("/save_content")
def save_content():
   # Langchain code here
   pass

@app.get("/get_mcq_questions")
def get_mcq_questions(context_id: int):
    sample_context = "Apple is a fruit"
    # context = fetch_context(context_id)
    
    status, response = gemini_api.get_mcqs(sample_context, 5)
    return {"status": status, "response": response}