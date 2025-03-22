from langchain_ollama.llms import OllamaLLM
import streamlit as st 
# from langchain_openai import OpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

import os 
from dotenv import load_dotenv

prompt = ChatPromptTemplate.from_messages(
    [
    ("system","you are very intellegent"),
    ("user","Question:{question}")
    ]
)

st.title("demo")
input_text = st.text_input("type something")

model = OllamaLLM(model="llama3.1:8b")
output_parsers = StrOutputParser()
chain = prompt | model|output_parsers
if input_text:
    st.write(chain.invoke({"question":"enter"}))