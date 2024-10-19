import json
from fastapi import FastAPI
from typing import List
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

from helpers.gemini import *
from helpers.db_handler import *

app = FastAPI()

# Load Prompts
with open('./utils/prompts.json') as f:
    prompts = json.load(f)

gemini_api = GeminiAPI(prompts)
DB = DB()

@app.get("/")
def home_root():
    return {"message": "Hello World"}

@app.get("/prompts")
def get_prompts():
    return prompts

@app.get("/get_mcq_questions")
def get_mcq_questions(session_id: str,search_string:str):
    status,response = DB.retrieve_docs_based_on_chosen_topics(session_id,search_string)
    if(status == False):
        return {"status":status,"response":response}
    
    status, response = gemini_api.get_mcqs(" ".join(response), 5)
    return {"status": status, "response": response}

@app.get("/get_match_questions")
def get_match_questions(context_id: int):
    sample_context = "Apple is a fruit"
    # context = fetch_context(context_id)
    
    status, response = gemini_api.get_matches(sample_context, 5)
    return {"status": status, "response": response}

@app.get("/get_keywords")
def get_key_words(session_id :str):
    status,response = DB.retrieve_top_k_topics(session_id)
    return {"status":status,"response":response}

@app.get("/get_docs")
def get_docs(session_id :str,search_string:str):
    status,response = DB.retrieve_docs_based_on_chosen_topics(session_id,search_string)
    return {"status":status,"response":response}