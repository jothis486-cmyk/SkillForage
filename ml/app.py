from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
import os
import uvicorn
import io
import fitz  # PyMuPDF for reading PDFs (need to add to requirements)

from resume_parser import analyze_resume_text
from skill_gap import analyze_skill_gap

app = FastAPI(title="AI Skill Gap & Career Predictor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best_model.joblib')
PREPROCESSOR_PATH = os.path.join(os.path.dirname(__file__), 'models', 'preprocess.joblib')

if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH):
    model = joblib.load(MODEL_PATH)
    preprocess_objs = joblib.load(PREPROCESSOR_PATH)
    preprocessor = preprocess_objs['preprocessor']
    mlb_store = preprocess_objs['mlb_store']
else:
    model = None
    preprocessor = None
    mlb_store = None
    print("Warning: Models not found. Please run train.py first.")

class PredictionInput(BaseModel):
    cgpa: float
    technical_skills: List[str]
    programming_languages: List[str]
    projects: int
    internships: int
    certifications: int
    aptitude_score: int
    communication_skills: int
    problem_solving: int
    experience_level: str
    career_interest: List[str]

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Skill Gap & Career Predictor API"}

@app.post("/predict_career")
def predict_career(data: PredictionInput):
    if model is None:
        return {"error": "Model not trained yet."}
        
    input_df = pd.DataFrame([{
        'CGPA': data.cgpa,
        'Technical Skills': data.technical_skills,
        'Programming Languages': data.programming_languages,
        'Projects': data.projects,
        'Internships': data.internships,
        'Certifications': data.certifications,
        'Aptitude Score': data.aptitude_score,
        'Communication Skills': data.communication_skills,
        'Problem Solving': data.problem_solving,
        'Experience Level': data.experience_level,
        'Career Interest': data.career_interest
    }])
    
    try:
        import numpy as np
        # Same preprocessing logic as in train.py
        X_num_cat = preprocessor.transform(input_df)
        
        multi_encodings = []
        for col in ['Technical Skills', 'Programming Languages', 'Career Interest']:
            mlb_classes = mlb_store[col]
            # Create binary vector based on classes
            encoded = np.zeros((1, len(mlb_classes)))
            for i, c in enumerate(mlb_classes):
                if c in input_df[col].iloc[0]:
                    encoded[0, i] = 1
            multi_encodings.append(encoded)
            
        X_multi = np.hstack(multi_encodings)
        X_processed = np.hstack([X_num_cat.toarray() if hasattr(X_num_cat, 'toarray') else X_num_cat, X_multi])
        
        prediction = model.predict(X_processed)[0]
        probabilities = model.predict_proba(X_processed)[0]
        
        # Sort classes by probability
        classes = model.classes_
        prob_dict = {classes[i]: float(probabilities[i]) for i in range(len(classes))}
        sorted_probs = dict(sorted(prob_dict.items(), key=lambda item: item[1], reverse=True))
        
        return {
            "career": prediction,
            "probabilities": sorted_probs,
            "confidence": f"{sorted_probs[prediction]*100:.2f}%"
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/analyze_resume")
async def analyze_resume(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if file.filename.endswith(".pdf"):
            # Ensure PyMuPDF is installed
            doc = fitz.open(stream=contents, filetype="pdf")
            text = ""
            for page in doc:
                text += page.get_text()
        else:
            # Fallback for txt
            text = contents.decode("utf-8")
            
        analysis = analyze_resume_text(text)
        return {"filename": file.filename, "analysis": analysis}
    except Exception as e:
        return {"error": str(e)}

@app.post("/skill_gap")
def skill_gap(data: dict):
    # data: {"user_skills": ["python", ...], "target_career": "Data Scientist"}
    user_skills = data.get("user_skills", [])
    target_career = data.get("target_career", "")
    
    result = analyze_skill_gap(user_skills, target_career)
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
