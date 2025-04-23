import sys
import json
from PyPDF2 import PdfReader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

nltk.download('punkt')
nltk.download('stopwords')

def extract_text(pdf_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PdfReader(f)
            text = " ".join([page.extract_text() or "" for page in reader.pages])
            return clean_text(text)
    except Exception as e:
        print(f"Error processing {pdf_path}: {str(e)}", file=sys.stderr)
        return ""

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def calculate_similarity(texts):
    vectorizer = TfidfVectorizer(tokenizer=tokenize, stop_words=stopwords.words('english'))
    tfidf_matrix = vectorizer.fit_transform(texts)
    return cosine_similarity(tfidf_matrix)

def tokenize(text):
    tokens = word_tokenize(text)
    return [token for token in tokens if len(token) > 2]

def main():
    try:
        input_data = json.load(sys.stdin)
        print(input_data);
        files = input_data['files']
        threshold = input_data.get('threshold', 75)
        
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