import pandas as pd
from sklearn.linear_model import LinearRegression
import os

# Train model once on module load for production performance
data_path = os.path.join(os.path.dirname(__file__), "data.csv")
data = pd.read_csv(data_path)
X = data[["day", "attendance"]]
y = data["meals"]

model = LinearRegression()
model.fit(X, y)

def predict(day, attendance):
    # Provide the feature names via a DataFrame to satisfy Scikit-Learn's fitted model expectations
    input_data = pd.DataFrame({"day": [day], "attendance": [attendance]})
    return round(model.predict(input_data)[0])

def predict_week(avg_attendance):
    # Generate predictions for all 7 days based on a baseline attendance
    predictions = []
    # Weekdays have higher attendance (+/- 10%), weekends have lower (-30%)
    multipliers = [1.0, 1.05, 1.0, 1.1, 0.9, 0.6, 0.5] 
    for i in range(7):
        day = i + 1
        adj_attendance = avg_attendance * multipliers[i]
        predictions.append(predict(day, adj_attendance))
    return predictions