import os
import json

from fastapi import FastAPI, File, Form, UploadFile,HTTPException
from typing import List


from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse


import random

# Import env file
from dotenv import load_dotenv
load_dotenv()

from helpers.gemini import *
from helpers.db_handler import *
from helpers.process import *
from helpers.hume_gen import *

import json

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Prompts
with open('./utils/prompts.json') as f:
    prompts = json.load(f)

gemini_api = GeminiAPI(prompts)
DB = DB()

hume_gen = HumeGen()

@app.get("/")
def home_root():
    hume_gen.get_hume_audio("A for apples, B for bananas, J for jaykay I am the king I am the queen")
    return {"message": "Hello World"}

@app.get("/prompts")
def get_prompts():
    return prompts

@app.get("/get_summarized_audio")
def get_summarized_audio(session_id: str):
    status, response = DB.retrieve_docs(session_id)
    if(status == False):
        return {"status":status,"response":response}
    
    status, response = gemini_api.audio_transcript_gen(" ".join(response))

    if(status == False):
        return {"status":status,"response":response}
    
    # Export Audio
    audio = hume_gen.get_hume_audio(response)
    audio = audio.export(format="wav")

    # return audio as base64
    return {"status": status, "response": audio,"response_text":response}

@app.get("/get_mcq_questions")
def get_mcq_questions(session_id: str,search_string:str):
    status,response = DB.retrieve_docs_based_on_chosen_topics(session_id,search_string)
    if(status == False):
        return {"status":status,"response":response}
    
    status, response = gemini_api.get_mcqs(" ".join(response), 5)
    return {"status": status, "response": response}

@app.get("/get_match_questions")
def get_match_questions(session_id:str):
    status,response = DB.retrieve_docs(session_id)
    if(status == False):
        return {"status":status,"response":response}
    status, response = gemini_api.get_matches(" ".join(response), 8)
    return {"status": status, "response": response}

@app.get("/get_connections")
def get_connections(session_id:str):
    print(session_id)
    status,response = DB.retrieve_docs(session_id)
    if(status == False):
        return {"status":status,"response":response}
    status, response = gemini_api.fetch_connections(" ".join(response), 5)

    return {"status": status, "response": response}

@app.get("/get_keywords")
def get_key_words(session_id :str):
    status,response = DB.retrieve_top_k_topics(session_id)
    return {"status":status,"response":response}

@app.get("/get_docs")
def get_docs(session_id :str,search_string:str):
    status,response = DB.retrieve_docs_based_on_chosen_topics(session_id,search_string)
    return {"status":status,"response":response}

@app.post("/create_session")
async def create_session(
    session_name: str = Form(...), 
    files: List[UploadFile] = File(...)
):
    upload_directory = "./uploads"
    
    # Create upload directory if it does not exist
    if not os.path.exists(upload_directory):
        os.makedirs(upload_directory)

    file_paths = []
    
    # Process each uploaded file
    for file in files:
        try:
            # Use a more descriptive naming convention
            file_ext = file.filename.split('.')[-1]  # Get the file extension
            file_name = f"{file.filename}.{file_ext}"
            file_path = os.path.join(upload_directory, file_name)

            # Save the uploaded file
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)  # Write the binary data to the file
            
            file_paths.append(file_path)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving file {file.filename}: {str(e)}")

    # Assuming you want to store this session information in DB
    session_id = random.randint(100000, 999999)
    
    cleaned_texts = [ ]
    for file_path in file_paths:
        try:
            processed = process_file(file_path)

            # Split processed to chunks of size 100
            chunks = [processed[i:i+100] for i in range(0,len(processed),100)]
            cleaned_texts+=chunks
            
        except Exception as e:
            print(f'Skipping {file}')
        
        finally:
            os.remove(file_path)

    ## Add Record to SingleStore
    for doc in cleaned_texts:
        DB.add_record("1",str(session_id),doc)

    return JSONResponse(content={
        "status": True,
        "message": "Files uploaded successfully",
        "session_id": session_id,
        "uploaded_files": file_paths  # Return the paths of the uploaded files
    })
