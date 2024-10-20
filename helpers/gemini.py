import warnings
import os

import json

import numpy as np
import librosa
import scipy.io.wavfile as wavfile

import google.generativeai as genai
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

class GeminiAPI:
    def __init__(self,prompts_json):
        self.prompts_json = prompts_json

    def get_mcqs(self,context,noq):
        try:
            prompt_text = self.prompts_json['mcq']['prompt'].format(CONTEXT=context,TIMES=noq)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt_text)
            return True,response.text
        except Exception as e:
            warnings.warn(f"Error in get_mcqs: {e}")
            return False,str(e)
        
    def get_matches(self,context,noq):
        try:
            prompt_text = self.prompts_json['match']['prompt'].format(CONTEXT=context,TIMES=noq)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt_text)
            return True,response.text
        except Exception as e:
            warnings.warn(f"Error in get_matches: {e}")
            return False,str(e)
        
    def fetch_connections(self,context,times=5):
        try:
            prompt_text = self.prompts_json['connection']['prompt'].format(CONTEXT=context,TIMES=times)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt_text)
            json_str = response.text.strip().split('\n', 1)[1].strip()[:-3]  # Remove the surrounding ```json and ```

            # Convert JSON string to Python object
            data = json.loads(json_str)
            return True,data
        except Exception as e:
            warnings.warn(f"Error in fetch_connections: {e}")
            return False,str(e)

    def audio_transcript_gen(self,context):
        # Generate Song Scripts
        try:
            prompt_text = self.prompts_json['song']['prompt'].format(CONTEXT=context)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt_text)

            song_script = response.text
            return True,song_script
    
        except Exception as e:
            warnings.warn(f"Error in audio_transcript_gen: {e}")
            return False,str(e)