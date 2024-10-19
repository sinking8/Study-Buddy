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
    text: str
    agent_address: str
    
class EmptyMessage(Model):
    pass

# Load Prompts
with open('./utils/prompts.json') as f:
    prompts = json.load(f)
gemini_api = GeminiAPI(prompts)

agent = Agent(name="Rest API", port=5000)


@agent.on_rest_post("/rest/post", Request, Response)
async def handle_post(ctx: Context, req:Request):
    ctx.logger.info("Received POST request")
    status, response = gemini_api.get_qna(" ".join(req.response), 5, mode=req.mode)
    return {
        "status": status, 
        "response": response,
        "timestamp":int(time.time()),
    }
    
if __name__ == "__main__":
    agent.run()