from fastapi import FastAPI
from model import predict

app = FastAPI()

@app.get("/predict")
def get_prediction(day: int, attendance: int):
    result = predict(day, attendance)
    return {"prediction": result}