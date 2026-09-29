import re
import spacy

try:
    nlp = spacy.load('en_core_web_sm')
except OSError:
    import spacy.cli
    spacy.cli.download('en_core_web_sm')
    nlp = spacy.load('en_core_web_sm')

# A comprehensive list of skills to look for
SKILLS_DB = [
    'machine learning', 'data analysis', 'python', 'java', 'c++', 'javascript', 'sql', 'r',
    'react', 'node.js', 'express', 'mongodb', 'fastapi', 'html', 'css', 'aws', 'docker', 'kubernetes',
    'tensorflow', 'pytorch', 'scikit-learn', 'xgboost', 'pandas', 'numpy', 'devops', 'cloud computing',
    'cybersecurity', 'agile', 'git', 'linux', 'ui', 'ux', 'business analysis'
]

def extract_skills(text):
    text = text.lower()
    found_skills = set()
    for skill in SKILLS_DB:
        if re.search(r'\b' + re.escape(skill) + r'\b', text):
            found_skills.add(skill.title())
    return list(found_skills)

def analyze_resume_text(text):
    """
    Analyzes the resume text to extract skills and compute an ATS score.
    """
    doc = nlp(text)
    skills = extract_skills(text)
    
    # Calculate a mock ATS score based on word count and skill presence
    ats_score = min(100, max(30, len(skills) * 5 + len(doc) // 50))
    
    return {
        "skills": skills,
        "ats_score": ats_score,
        "missing_skills": list(set([s.title() for s in SKILLS_DB]) - set(skills))[:5],
        "suggestions": [
            "Quantify your achievements with metrics.",
            "Add more relevant keywords based on the job description."
        ] if ats_score < 70 else ["Your resume looks well-optimized for ATS systems."]
    }

if __name__ == "__main__":
    sample_text = "I am a software engineer with 5 years of experience in Python, Java, and Machine Learning. I have built scalable applications using React and Node.js."
    print(analyze_resume_text(sample_text))
