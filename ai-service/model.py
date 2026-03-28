import pandas as pd
from sklearn.linear_model import LinearRegression

def train_model():
    data = pd.read_csv("data.csv")
    
    X = data[["day", "attendance"]]
    y = data["meals"]

    model = LinearRegression()
    model.fit(X, y)

    return model

def predict(day, attendance):
    model = train_model()
    # Provide the feature names via a DataFrame to satisfy Scikit-Learn's fitted model expectations
    input_data = pd.DataFrame({"day": [day], "attendance": [attendance]})
    return model.predict(input_data)[0]