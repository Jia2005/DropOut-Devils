from flask import Flask
import pandas as pd
import pickle

app = Flask(__name__)

loaded_pipe = pickle.load(open('/home/bhavesh/Dropout/DropOut-Devils/api/pipeline2.pkl', 'rb'))

def predict_status(input_data):
    cols = ['Attendance_Rate', 'GPA', 'Behavioral_Incidents', 'Counselor_Visits',
           'Parental_Education', 'Extracurricular_Participation',
           'Salary_Category']
    
    x = pd.DataFrame([input_data], columns = cols)
    y = loaded_pipe.predict(x)
    
    print('Prediction =', y[0])
    return y[0]

@app.route('/api/ml')
def predict():
	test1 = [8.23, 9.8, 2, 3, "PhD", 1, "Low"]
	result = predict_status(test1)
	if (result == 0):
		pred = 'This student will not dropout'
	else :
		pred = 'This student might dropout!!'
	return {"name": pred}