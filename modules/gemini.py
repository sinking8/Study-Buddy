import os
import numpy as np

import google.generativeai as genai
import os

import warnings
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

class GeminiAPI:
    def __init__(self,prompts_json):
        self.prompts_json = prompts_json
        print(self.prompts_json)

    def get_mcqs(self,context,noq):
        try:
            prompt_text = self.prompts_json['mcq']['prompt'].format(CONTEXT=context,TIMES=noq)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt_text)
            print(response.text)
            return True,response.text
        except Exception as e:
            warnings.warn(f"Error in get_mcqs: {e}")
            return False,str(e)
            
        




    


        