from flask import Flask, request, Response
import requests

app = Flask(__name__)

@app.route('/queryendpoint', methods=['POST'])
def query():
    user_query = request.json.get('query')

    def generate():
        try:
            # Stream to Ollama API
            with requests.post(
                'http://localhost:11434/api/generate',
                json={
                    'model': 'llama3.1:8b',
                    'prompt': user_query,
                    'stream': False
                },
                stream=True  # Enable streaming
            ) as r:
                for line in r.iter_lines():
                    if line:
                        yield line.decode() + '\n'
        except Exception as e:
            print("Error during streaming:", str(e))
            yield '{"error": "Streaming failed"}'

    return Response(generate(), mimetype='application/json')

if __name__ == '__main__':
    app.run(port=8003, threaded=True)