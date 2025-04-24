import sys
import json
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import nltk
import os

# Configure NLTK with more robust download handling
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('tokenizers/punkt_tab')  # Add this line
    nltk.data.find('corpora/stopwords')
except LookupError:
    print("Downloading required NLTK data files...", file=sys.stderr)
    try:
        nltk.download('punkt')
        nltk.download('punkt_tab')  # Add this download
        nltk.download('stopwords')
    except Exception as e:
        print(f"Failed to download NLTK data: {str(e)}", file=sys.stderr)
        sys.exit(1)

# Set NLTK data path explicitly
nltk_data_path = os.path.join(os.path.expanduser('~'), 'nltk_data')
nltk.data.path.append(nltk_data_path)

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def extract_text(pdf_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PdfReader(f)
            text = " ".join([page.extract_text() or "" for page in reader.pages])
            print(f"Raw text from {pdf_path}: {text[:200]}...")
            return clean_text(text)
    except Exception as e:
        print(f"Error processing {pdf_path}: {str(e)}", file=sys.stderr)
        return ""

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def tokenize(text):
    try:
        tokens = word_tokenize(text)
        return [token for token in tokens if len(token) > 2]
    except Exception as e:
        print(f"Tokenization error: {str(e)}", file=sys.stderr)
        # Fallback to simple tokenizer
        return [word for word in text.split() if len(word) > 2]

def calculate_similarity(texts):
    try:
        vectorizer = TfidfVectorizer(
            tokenizer=tokenize,
            stop_words=stopwords.words('english'),
            token_pattern=None  # Explicitly set to None since we're using tokenizer
        )
        tfidf_matrix = vectorizer.fit_transform(texts)
        return cosine_similarity(tfidf_matrix)
    except Exception as e:
        print(f"Similarity calculation error: {str(e)}", file=sys.stderr)
        raise

def main():
    try:
        input_data = json.load(sys.stdin)
        files = input_data['files']
        threshold = input_data.get('threshold', 75)
        
        print(f"Received files: {files}", file=sys.stderr)
        print("NLTK data path:", nltk.data.path, file=sys.stderr)
        
        texts = []
        valid_indices = []
        
        for i, file_path in enumerate(files):
            text = extract_text(file_path)
            if text and len(text) > 100:
                texts.append(text)
                valid_indices.append(i)
        
        if len(texts) < 2:
            print(json.dumps([]))
            return
        
        similarity_matrix = calculate_similarity(texts)
        results = []
        
        for i in range(len(texts)):
            for j in range(i+1, len(texts)):
                similarity = similarity_matrix[i][j] * 100
                if similarity >= threshold:
                    results.append({
                        'index1': valid_indices[i],
                        'index2': valid_indices[j],
                        'similarity': round(similarity, 2)
                    })
        print(json.dumps(results))
        
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()