import { Ollama } from "@langchain/ollama";
import express from 'express'
import cors from 'cors';
import bodyParser from 'body-parser';

let app = express()
app.use(cors())
app.use(bodyParser.json())
let port =  8000
async function invokeModel(query){
    
    const llm = new Ollama({
      model: "llama3.1:8b", // Default value
      // other params...
    });
    const inputText = query;
    
    const completion = await llm.invoke(inputText);
    return completion;

}

app.post('/queryendpoint',async (req,res)=>{
    let query = req.body.query
    let answer = await invokeModel(query)
    res.json({answer: answer})
})



app.listen(port,()=>{
    console.log("port is "+ port)
})
