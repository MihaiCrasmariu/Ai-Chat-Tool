import os

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

# încarcă variabilele din .env (inclusiv OPENAI_API_KEY)
load_dotenv()

app = Flask(__name__)
CORS(app)

# client OpenAI – ia cheia automat din variabila de mediu OPENAI_API_KEY
client = OpenAI()

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Backend is running!"})

@app.route("/api/ai", methods=["POST"])
def ai():
    data = request.get_json()
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI assistant inside a hackathon demo app called 'AI Tool'. Answer clearly and concisely."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        response_text = completion.choices[0].message.content

        return jsonify({"response": response_text})

    except Exception as e:
        # în caz de eroare (cheie greșită, net, etc.)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

