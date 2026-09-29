import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                             roc_auc_score, confusion_matrix)
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
import xgboost as xgb
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

def generate_dataset(num_samples: int = 1000) -> pd.DataFrame:
    np.random.seed(42)
    cgpa = np.round(np.random.uniform(5.0, 10.0, num_samples), 2)
    aptitude = np.random.randint(50, 101, num_samples)
    communication = np.random.randint(1, 6, num_samples)
    problem_solving = np.random.randint(1, 6, num_samples)
    tech_skills = [np.random.choice(['Machine Learning','Data Analysis','Web Development','DevOps','Cloud Computing','Cybersecurity'],
                             size=np.random.randint(1,4), replace=False).tolist() for _ in range(num_samples)]
    prog_langs = [np.random.choice(['Python','Java','C++','JavaScript','SQL','R'],
                             size=np.random.randint(1,4), replace=False).tolist() for _ in range(num_samples)]
    projects = np.random.randint(0, 6, num_samples)
    internships = np.random.randint(0, 3, num_samples)
    certifications = np.random.randint(0, 5, num_samples)
    experience_levels = np.random.choice(['Intern','Junior','Mid','Senior'], num_samples)
    career_interest = [np.random.choice(['Software Engineer','Data Scientist','AI Engineer','Full Stack Developer','Cloud Engineer',
                                          'Cybersecurity Analyst','DevOps Engineer','UI/UX Designer','Business Analyst','Machine Learning Engineer'],
                         size=np.random.randint(1,3), replace=False).tolist() for _ in range(num_samples)]
    possible_careers = ['Software Engineer','Data Scientist','AI Engineer','Full Stack Developer','Cloud Engineer',
                        'Cybersecurity Analyst','DevOps Engineer','UI/UX Designer','Business Analyst','Machine Learning Engineer']
    target = [np.random.choice(possible_careers) for _ in range(num_samples)]
    df = pd.DataFrame({
        'CGPA': cgpa,
        'Technical Skills': tech_skills,
        'Programming Languages': prog_langs,
        'Projects': projects,
        'Internships': internships,
        'Certifications': certifications,
        'Aptitude Score': aptitude,
        'Communication Skills': communication,
        'Problem Solving': problem_solving,
        'Experience Level': experience_levels,
        'Career Interest': career_interest,
        'Target': target
    })
    return df

def preprocess(df: pd.DataFrame):
    X = df.drop('Target', axis=1)
    y = df['Target']
    numeric_features = ['CGPA', 'Projects', 'Internships', 'Certifications',
                        'Aptitude Score', 'Communication Skills', 'Problem Solving']
    categorical_features = ['Experience Level']
    multi_label_features = ['Technical Skills', 'Programming Languages', 'Career Interest']
    preprocessor = ColumnTransformer([
        ('num', StandardScaler(), numeric_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])
    X_num_cat = preprocessor.fit_transform(X)
    from sklearn.preprocessing import MultiLabelBinarizer
    multi_encodings = []
    mlb_store = {}
    for col in multi_label_features:
        mlb = MultiLabelBinarizer()
        encoded = mlb.fit_transform(X[col])
        multi_encodings.append(encoded)
        mlb_store[col] = mlb.classes_
    X_multi = np.hstack(multi_encodings) if multi_encodings else np.empty((X.shape[0], 0))
    X_processed = np.hstack([X_num_cat.toarray() if hasattr(X_num_cat, 'toarray') else X_num_cat,
                             X_multi])
    return X_processed, y, {'preprocessor': preprocessor, 'mlb_store': mlb_store}

def train_and_evaluate(X_train, X_test, y_train, y_test):
    models = {
        'RandomForest': RandomForestClassifier(n_estimators=200, random_state=42),
        'DecisionTree': DecisionTreeClassifier(random_state=42),
        'XGBoost': xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }
    results = {}
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        probas = model.predict_proba(X_test) if hasattr(model, 'predict_proba') else None
        acc = accuracy_score(y_test, preds)
        prec = precision_score(y_test, preds, average='macro', zero_division=0)
        rec = recall_score(y_test, preds, average='macro', zero_division=0)
        f1 = f1_score(y_test, preds, average='macro', zero_division=0)
        roc_auc = (roc_auc_score(pd.get_dummies(y_test), probas, average='macro', multi_class='ovr')
                    if probas is not None else np.nan)
        cm = confusion_matrix(y_test, preds, labels=model.classes_)
        results[name] = {
            'model': model,
            'accuracy': acc,
            'precision': prec,
            'recall': rec,
            'f1': f1,
            'roc_auc': roc_auc,
            'confusion_matrix': cm,
            'classes': model.classes_
        }
    return results

def plot_confusion_matrix(cm, classes, name, out_dir='outputs'):
    plt.figure(figsize=(8,6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)
    plt.ylabel('True')
    plt.xlabel('Predicted')
    plt.title(f'Confusion Matrix - {name}')
    os.makedirs(out_dir, exist_ok=True)
    plt.savefig(os.path.join(out_dir, f'confusion_matrix_{name}.png'))
    plt.close()

def plot_feature_importance(model, name, out_dir='outputs'):
    if hasattr(model, 'feature_importances_'):
        importances = model.feature_importances_
        indices = np.argsort(importances)[::-1][:20]
        plt.figure(figsize=(10,6))
        sns.barplot(x=importances[indices], y=np.arange(len(indices)))
        plt.title(f'Feature Importance - {name}')
        os.makedirs(out_dir, exist_ok=True)
        plt.savefig(os.path.join(out_dir, f'feature_importance_{name}.png'))
        plt.close()

def plot_accuracy_comparison(results, out_dir='outputs'):
    metrics = ['accuracy', 'precision', 'recall', 'f1', 'roc_auc']
    data = {m: [results[k][m] for k in results] for m in metrics}
    df = pd.DataFrame(data, index=results.keys())
    ax = df.plot(kind='bar', figsize=(10,6))
    ax.set_title('Model Metric Comparison')
    ax.set_ylabel('Score')
    plt.xticks(rotation=0)
    os.makedirs(out_dir, exist_ok=True)
    plt.savefig(os.path.join(out_dir, 'accuracy_comparison.png'))
    plt.close()

if __name__ == '__main__':
    df = generate_dataset()
    os.makedirs('dataset', exist_ok=True)
    df.to_csv('dataset/sample_dataset.csv', index=False)
    X, y, preprocess_objs = preprocess(df)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    results = train_and_evaluate(X_train, X_test, y_train, y_test)
    os.makedirs('models', exist_ok=True)
    best_name = max(results, key=lambda k: results[k]['f1'])
    joblib.dump(results[best_name]['model'], os.path.join('models', 'best_model.joblib'))
    joblib.dump(preprocess_objs, os.path.join('models', 'preprocess.joblib'))
    for name, info in results.items():
        plot_confusion_matrix(info['confusion_matrix'], info['classes'], name)
        plot_feature_importance(info['model'], name)
    plot_accuracy_comparison(results)
    print('Training complete. Best model:', best_name)
