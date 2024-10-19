import warnings
import os

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
        

    def audio_gen(self,context):
        # Generate Song Scripts
        prompt_text = self.prompts_json['audio']['prompt'].format(CONTEXT=context)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt_text)

        song_script = response.text

        # Generate Audio using Hume
        # audio = genai.Hume().generate_audio(song_script)
        # return audio
    