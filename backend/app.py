from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import base64
from dotenv import load_dotenv

# load .env locally (OPENAI_API_KEY etc.)
load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


@app.route("/api/hello")
def hello():
    return jsonify({"message": "Backend is running!"})


@app.route("/api/ai", methods=["POST"])
def ai():
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": prompt}
            ],
        )

        response_text = completion.choices[0].message.content
        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/vision", methods=["POST"])
def vision():
    """
    Receive an image + optional prompt and ask the AI to describe/analyze it.
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400

    file = request.files["image"]
    prompt = request.form.get("prompt", "Describe this image in detail.")

    # read image and encode as base64
    image_bytes = file.read()
    b64_image = base64.b64encode(image_bytes).decode("utf-8")

    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{b64_image}"
                            },
                        },
                    ],
                }
            ],
        )

        response_text = completion.choices[0].message.content
        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/image", methods=["POST"])
def image_generate():
    """
    Generate an image from a text prompt using OpenAI image model.
    """
    data = request.get_json() or {}
    prompt = data.get("prompt", "").strip()

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        result = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            size="1024x1024",
        )

        b64_image = result.data[0].b64_json
        data_url = f"data:image/png;base64,{b64_image}"

        return jsonify({"image_data_url": data_url})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
