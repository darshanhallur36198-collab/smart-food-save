from fastapi import FastAPI
from model import predict, predict_week

app = FastAPI()

@app.get("/predict")
def get_prediction(day: int, attendance: int):
    result = predict(day, attendance)
    return {"prediction": result}

@app.get("/forecast_week")
def get_weekly_forecast(attendance: int = 100):
    predictions = predict_week(attendance)
    return {"forecast": predictions}