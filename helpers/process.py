import os

import nltk
import spacy

from nltk.corpus import stopwords

from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

from PyPDF2 import PdfReader
import docx

# Download necessary resources for NLTK
nltk.download('stopwords')
nltk.download('punkt')

# Load spaCy's English model for lemmatization
nlp = spacy.load('en_core_web_sm')

def image_to_description(image_path):
    # Load BLIP model and processor
    processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

    # Open and preprocess the image
    image = Image.open(image_path)

    # Process the image and prepare inputs for the model
    inputs = processor(images=image, return_tensors="pt")

    # Generate the image description
    output = model.generate(**inputs)
    description = processor.decode(output[0], skip_special_tokens=True)

    return description

# Function to extract text from a PDF file
def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

# Function to extract text from a DOCX file
def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = "\n".join([para.text for para in doc.paragraphs])
    return text

# Function to process text: remove stop words, apply stemming, and lemmatization
def process_text(text):
    # Load stopwords from NLTK
    stop_words = set(stopwords.words('english'))

    # Tokenize the text
    words = nltk.word_tokenize(text)

    # Remove stopwords and non-alphabetical words
    filtered_words = [word for word in words if word.isalpha() and word.lower() not in stop_words]

    return filtered_words

# Main function to handle different file types and process the text
def process_file(file_path):
    file_extension = os.path.splitext(file_path)[1].lower()
    
    try:
        # Extract text based on file type
        if file_extension == '.pdf':
            text = extract_text_from_pdf(file_path)
        elif file_extension == '.docx':
            text = extract_text_from_docx(file_path)
        elif file_extension == '.txt':
            with open(file_path, 'r', encoding='utf-8') as file:
                text = file.read()
        elif file_extension == '.png' or file_extension == '.jpg':
            text = image_to_description(file_path)
        else:
            print(f"Unsupported file format: {file_extension}")
            return []

        # Process the extracted text
        cleaned_text = process_text(text)
        cleaned_text = list(filter(lambda x:len(x)>1, cleaned_text))

        return " ".join(cleaned_text)

    except FileNotFoundError:
        print(f"File '{file_path}' not found.")
        return []
