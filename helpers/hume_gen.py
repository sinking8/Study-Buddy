from IPython.display import Audio
import json
import scipy.io.wavfile as wavfile
import numpy as np
from pydub import AudioSegment
from pydub.utils import make_chunks
from deepgram import DeepgramClient
import math

import base64

from pydub import AudioSegment
from pydub.utils import make_chunks

from websocket import create_connection

import io
import os

class HumeGen:
    def __init__(self):
            self.audio = None
            self.message = ""
            self.frequencies = {
                "A": 440,  # Example frequencies (in Hz) for tuning
                "B": 494,
                "C": 523,
                "D": 587,
                "E": 659,
                "F": 698,
                "G": 784,
            }
            self.melody_frequencies = [
            261.63, 261.63, 392.00, 392.00, 440.00, 440.00, 392.00,  # C C G G A A G
            349.23, 349.23, 329.63, 329.63, 293.66, 293.66, 261.63   # F F E E D D C
            ]
            self.base_frequency = 440.0  # Base frequency (A4)
            self.modulation_depth = 0.2  # How much the pitch will vary (20% of the base frequency)
            self.modulation_speed = 0.5 
            

    def get_hume_audio(self, text):
        ws = create_connection(f'wss://api.hume.ai/v0/evi/chat?api_key={os.environ["HUME_API_KEY"]}')
        ws.send(json.dumps({"type": "user_input", "text": f'can you say the text marked in double quotes "{text}". Please say just the text only dont say anything else. No intro No unecessary context; Its a song so be expressive'}))

        # Empty Lists
        audio_s = []
        msg_s = []

        while True:
            result = json.loads(ws.recv())

            if result['type'] == "assistant_end":
                break

            if result['type'] == 'audio_output':
                audio_s.append(result['data'])


            if result['type'] == 'assistant_message':
                msg_s.append(result['message']['content'])

        # Close WebSocket
        ws.close()

        # Decode all the audio to base64
        audio_s = [base64.b64decode(audio) for audio in audio_s]

        # Append all the audio files
        self.audio = AudioSegment.from_file(io.BytesIO(b"".join(audio_s)), format="wav")

        # Save the audio file
        self.audio.export("./uploads/hume_audio.wav", format="wav")

        # Cumulative message
        self.message = " ".join(msg_s)

        # Call the function to modify the audio into a song format
        return self.hume_audio_to_song()

    def hume_audio_to_song(self):
        # Split the audio into smaller chunks for smoother pitch modulation
        chunk_length_ms = 500  # 0.5 seconds per chunk for smoother modulation
        chunks = make_chunks(self.audio, chunk_length_ms)

        # Initialize an empty list to store the audio segments
        audio_segments = []

        # Loop through each chunk and append it to the list
        for i, chunk in enumerate(chunks):
            audio_segments.append(chunk)

        # Concatenate the audio segments into a single audio file
        full_audio = AudioSegment.empty()

        # Apply smooth pitch modulation using a sinusoidal function to simulate a melody
        for i, segment in enumerate(audio_segments):
            # Modulate pitch using a sinusoidal wave: base_frequency * (1 + modulation_depth * sin(modulation_speed * time))
            time_in_seconds = i * (chunk_length_ms / 1000.0)
            pitch_factor = 1 + self.modulation_depth * math.sin(2 * math.pi * self.modulation_speed * time_in_seconds)

            # Adjust the pitch of the current chunk based on the modulation
            pitched_segment = segment._spawn(segment.raw_data, overrides={
                "frame_rate": int(segment.frame_rate * pitch_factor)
            }).set_frame_rate(44100)  # Return to standard frame rate

            full_audio += pitched_segment

        # Save the final song-like audio with pitch modulation
        full_audio.export("./uploads/hume_melodic_song.wav", format="wav")

        return full_audio