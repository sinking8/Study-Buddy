import time
import json
from typing import Any, Dict
from helpers.gemini import *
from helpers.db_handler import *
from uagents import Agent, Context, Model


class Request(Model):
    response: str
    mode: str

class Response(Model):
    timestamp: int
    status: str
    response: list
    
class EmptyMessage(Model):
    pass

# Load Prompts
with open('./utils/prompts.json') as f:
    prompts = json.load(f)
gemini_api = GeminiAPI(prompts)

agent = Agent(name="Rest API", port=5000)

@agent.on_rest_post("/agent/mcqs", Request, Response)
async def handle_mcqs(ctx: Context, req:Request):
    ctx.logger.info("Received POST request")
    status, response = gemini_api.get_mcqs(req.response, 5, mode=req.mode)
    return {
        "status": status, 
        "response": response,
        "timestamp":int(time.time()),
    }

@agent.on_rest_post("/agent/matches", Request, Response)
async def handle_matches(ctx: Context, req:Request):
    ctx.logger.info("Received POST request")
    status, response = gemini_api.get_matches(req.response, 5, mode=req.mode)
    return {
        "status": status, 
        "response": response,
        "timestamp":int(time.time()),
    }

@agent.on_rest_post("/agent/connections", Request, Response)
async def handle_connectiions(ctx: Context, req:Request):
    ctx.logger.info("Received POST request")
    status, response = gemini_api.get_connections(req.response, 5, mode=req.mode)
    return {
        "status": status, 
        "response": response,
        "timestamp":int(time.time()),
    }

@agent.on_rest_post("/agent/sequence", Request, Response)
async def handle_sequence(ctx: Context, req:Request):
    ctx.logger.info("Received POST request")
    status, response = gemini_api.get_sequence(req.response, 5, mode=req.mode)
    return {
        "status": status, 
        "response": response,
        "timestamp":int(time.time()),
    }
    
if __name__ == "__main__":
    agent.run() 