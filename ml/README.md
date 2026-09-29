# AI Skill Gap Detection & Future Career Predictor

This repository contains a complete machine-learning pipeline that predicts the most suitable career path for a student based on academic performance, skill set, and experience.

## Project Structure
`
ml/
+- dataset/            # (optional) raw / generated data
+- models/             # saved model & preprocessing pipeline
+- outputs/            # plots & visualisations
+- train.py            # data generation, preprocessing, model training & evaluation
+- predict.py          # load saved model & make a single prediction
+- app.py              # Flask API exposing the predictor
+- requirements.txt    # Python dependencies
+- README.md           # you are reading it!
`

## Quick Start
`ash
# 1. Create a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train the models
python train.py

# 4. Run the API
python app.py   # defaults to http://127.0.0.1:5000/predict
`

## API
POST /predict
`json
{
   CGPA: 8.5,
  Technical Skills: [Machine Learning, Data Analysis],
  Programming Languages: [Python, SQL],
  Projects: 3,
  Internships: 1,
  Certifications: 2,
  Aptitude Score: 78,
  Communication Skills: 4,
  Problem Solving: 5,
  Experience Level: Junior,
  Career Interest: [Data Scientist, AI Engineer]
}
`
Response:
`json
{ career: Data Scientist, probabilities: {Data Scientist: 0.62, AI Engineer: 0.18, ...} }
`

## Visualisations
After training, check the outputs/ folder for:
- confusion_matrix.png
- feature_importance.png
- accuracy_comparison.png
- roc_curve.png
- career_distribution.png
- skill_importance.png

## License
MIT
