import sys
import json
import os
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# Download necessary NLTK data (quietly)
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))
model = SentenceTransformer("all-MiniLM-L6-v2")

def preprocess(text):
    try:
        tokens = word_tokenize(text.lower())
        words = [lemmatizer.lemmatize(w) for w in tokens if w.isalnum() and w not in stop_words]
        return " ".join(words)
    except Exception as e:
        print(f"⚠️ Preprocessing error: {str(e)}", file=sys.stderr)
        return ""

def evaluate(student_file, answer_key):
    try:
        with open(student_file) as sf, open(answer_key) as ak:
            student_answers = [line.strip() for line in sf if line.strip()]
            reference_answers = [line.strip() for line in ak if line.strip()]

        if len(student_answers) != len(reference_answers):
            raise ValueError("Mismatch in number of answers")

        results = []

        for idx, (stud, ref) in enumerate(zip(student_answers, reference_answers), 1):
            clean_stud = preprocess(stud)
            clean_ref = preprocess(ref)

            if not clean_stud or not clean_ref:
                score = 0.0
                topic = "Error"
            else:
                emb_stud = model.encode(clean_stud)
                emb_ref = model.encode(clean_ref)
                raw_score = cosine_similarity([emb_stud], [emb_ref])[0][0]
                score = float(raw_score)  # 🛠 Convert to native Python float
                keywords = set(clean_ref.split()) - stop_words
                topic = ", ".join(sorted(keywords)[:3]) or "General"

            results.append({
                "question": idx,
                "score": round(min(score * 5, 5.0), 2),
                "similarity": round(score * 100, 2),
                "topic": topic,
                "student_answer": stud,
                "reference_answer": ref
            })

        print(json.dumps(results))

    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

def main():
    try:
        input_data = json.load(sys.stdin)
        student_file = input_data["student_file"]
        answer_key = input_data["answer_key"]
        evaluate(student_file, answer_key)
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()