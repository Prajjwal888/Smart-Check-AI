from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import subprocess
import tempfile
import os
import requests
import json

app = FastAPI()

class PlagiarismRequest(BaseModel):
    file_urls: List[str]
    threshold: float = 75.0

@app.post("/checkPlagiarism")
async def check_plagiarism(request: PlagiarismRequest):
    try:
        # Download files to temp directory
        print("In python code");
        temp_files = []
        for url in request.file_urls:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_file:
            for chunk in response.iter_content(chunk_size=8192):
                temp_file.write(chunk)
            temp_files.append(temp_file.name)
        
        # Run plagiarism check
        result = subprocess.run(
        ["python", "check_plagiarism.py"],
        input=json.dumps({
            "files": temp_files,
            "threshold": request.threshold
        }),
        capture_output=True,
        text=True
        )
        
        # Cleanup
        for file in temp_files:
            os.unlink(file)
        
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=result.stderr)
        
        return {"results": json.loads(result.stdout)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)