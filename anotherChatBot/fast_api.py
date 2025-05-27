from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

@app.post('/queryendpoint')
def query_function(request: QueryRequest):
    user_query = request.query
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3.1:8b", "prompt": user_query, "stream": False}
        )
        return {"answer": response.json()["response"]}
    except Exception as e:
        print(e)
        return {"error": "Failed to get response from Ollama"}