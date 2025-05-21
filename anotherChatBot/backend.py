from fastapi import FastAPI
from pydantic import BaseModel
from langchain_ollama.llms import OllamaLLM
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
origins = [
    "http://localhost:3001",  # your React app origin
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query:str

def invoke_model(query):
   llm = OllamaLLM(model="llama3.1:8b")
   answer =llm.invoke(query)
   print(answer)
   return answer


@app.post('/queryendpoint')
def queryFunction(request: QueryRequest):
    query = request.query
    print(query)
    answer = invoke_model(query)
    return {"answer":answer}
