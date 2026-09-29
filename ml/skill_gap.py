# skill_gap.py
import pandas as pd

# Define a mock mapping of industry required skills for different careers
INDUSTRY_SKILLS = {
    'Software Engineer': ['Python', 'Java', 'C++', 'Git', 'Agile', 'Sql', 'Data Analysis'],
    'Data Scientist': ['Python', 'R', 'Sql', 'Machine Learning', 'Data Analysis', 'Pandas', 'Numpy'],
    'AI Engineer': ['Python', 'Machine Learning', 'Deep Learning', 'Tensorflow', 'Pytorch', 'Aws', 'Docker'],
    'Full Stack Developer': ['Javascript', 'React', 'Node.Js', 'Express', 'Mongodb', 'Html', 'Css'],
    'Cloud Engineer': ['Aws', 'Docker', 'Kubernetes', 'Linux', 'Python', 'Devops'],
    'Cybersecurity Analyst': ['Cybersecurity', 'Linux', 'Python', 'Networking', 'Security Analysis'],
    'DevOps Engineer': ['Devops', 'Aws', 'Docker', 'Kubernetes', 'Linux', 'Git', 'Python'],
    'UI/UX Designer': ['Ui', 'Ux', 'Figma', 'Html', 'Css', 'Design Thinking'],
    'Business Analyst': ['Business Analysis', 'Sql', 'Excel', 'Data Analysis', 'Agile', 'Communication'],
    'Machine Learning Engineer': ['Python', 'Machine Learning', 'Scikit-Learn', 'Xgboost', 'Docker', 'Sql']
}

def analyze_skill_gap(user_skills, target_career):
    """
    Compares user skills against industry required skills for a target career.
    user_skills: list of string
    target_career: string
    """
    user_skills_lower = [s.lower() for s in user_skills]
    if target_career not in INDUSTRY_SKILLS:
        return {"error": "Career not found in industry database."}
        
    required_skills = INDUSTRY_SKILLS[target_career]
    required_skills_lower = [s.lower() for s in required_skills]
    
    existing_skills = [s.title() for s in required_skills_lower if s in user_skills_lower]
    missing_skills = [s.title() for s in required_skills_lower if s not in user_skills_lower]
    
    match_percentage = round((len(existing_skills) / len(required_skills)) * 100, 2)
    career_readiness = max(10, match_percentage) # Simple readiness score
    
    return {
        "career": target_career,
        "existing_skills": existing_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage,
        "readiness_score": career_readiness,
        "priority_skills_to_learn": missing_skills[:3]
    }

if __name__ == "__main__":
    print(analyze_skill_gap(["Python", "Java", "React"], "Software Engineer"))
