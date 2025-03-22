# ##data ingestion
# from langchain_community.document_loaders import TextLoader
# loader = TextLoader("speech.txt")
# text_documents = loader.load()    #converts thing to text documents 
# print(text_documents)


#pdf loader
from langchain_community.document_loaders import PyPDFLoader
loader = PyPDFLoader("Resume latest(7 march).pdf")
text_documents = loader.load()
# print(text_documents)

#data transformation
from langchain.text_splitter import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
documents = text_splitter.split_documents(text_documents)
print(documents)


#embedding
from langchain_community.embeddings import OllamaEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain_ollama import OllamaLLM
from langchain_community.vectorstores import Chroma
from langchain.chains.combine_documents import create_stuff_documents_chain
db = Chroma.from_documents(documents,OllamaEmbeddings(model="llama3.1:8b"))

query= "What are the skills that he has?"
# result = db.similarity_search(query)
# print(result[0].page_content)
retriever = db.as_retriever(k=1)
llm = OllamaLLM(model ="llama3.1:8b") 
prompt = ChatPromptTemplate.from_template("""
   You are an excellent reviewer of documents who gives exactly what is asked for based on the context given, for and nothing else,
    <context>
    {context}
    </context>
    Question: {input}
""")
document_chain = create_stuff_documents_chain(llm,prompt)
# retriever chain
from langchain.chains.retrieval import create_retrieval_chain
retrieval_chain = create_retrieval_chain(retriever,document_chain)
# context = query
context = retriever
response = retrieval_chain.invoke({"input":query})
print(response["answer"])
