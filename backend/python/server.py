# server.py
import requests
import string
import re
import numpy as np
from io import BytesIO
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator, confloat
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict

app = FastAPI(title="Plagiarism Checker API")

class PlagiarismCheckRequest(BaseModel):
    file_urls: List[str]
    threshold: float = 75

    @field_validator("threshold")
    def validate_threshold(cls, value):
        if not (0 <= value <= 100):
            raise ValueError("Threshold must be between 0 and 100.")
        return value

def extract_text_from_pdf(pdf_content: bytes) -> str:
    """Extract text from PDF content with error handling"""
    try:
        text = ""
        with BytesIO(pdf_content) as pdf_file:
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(400, f"PDF processing failed: {str(e)}")

def preprocess_text(text: str) -> str:
    """Enhanced text preprocessing"""
    # Lowercase and remove punctuation
    text = text.lower().translate(str.maketrans('', '', string.punctuation))
    
    # Remove stopwords (basic list - extend as needed)
    stopwords = set(['the', 'and', 'is', 'in', 'it', 'to', 'of', 'for'])
    words = [word for word in text.split() if word not in stopwords]
    
    # Remove numbers and extra spaces
    return re.sub(r'\d+', '', ' '.join(words)).strip()

@app.post("/checkPlagiarism")
async def check_plagiarism_endpoint(request_data: PlagiarismCheckRequest):
    """Improved plagiarism detection endpoint"""
    try:
        # Download and process PDFs
        texts = []
        for url in request_data.file_urls:
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                raw_text = extract_text_from_pdf(response.content)
                processed_text = preprocess_text(raw_text)
                
                if not processed_text:
                    raise HTTPException(400, f"No meaningful text from {url}")
                texts.append(processed_text)
                
            except requests.exceptions.RequestException as e:
                raise HTTPException(400, f"Failed to download {url}: {str(e)}")

        # Calculate TF-IDF vectors
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(texts)
        
        # Compare all pairs
        threshold = request_data.threshold / 100
        results = []
        
        for i in range(len(texts)):
            for j in range(i + 1, len(texts)):
                similarity = cosine_similarity(
                    tfidf_matrix[i:i+1], 
                    tfidf_matrix[j:j+1]
                )[0][0]
                
                results.append({
                    "file1_index": i,
                    "file2_index": j,
                    "similarity_score": round(float(similarity), 4),  # Convert to native float
                    "is_plagiarised": bool(similarity >= threshold)    # Convert to native bool
                })
        
        return {"results": results}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Internal error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)