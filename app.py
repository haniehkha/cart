from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import requests
import os

# ==========================
# تنظیمات برنامه
# ==========================

app = Flask(__name__, static_folder=".")

CORS(app)

UPLOAD_FOLDER = "uploads"

ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "webp"
}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ==========================
# اطلاعات ربات تلگرام
# ==========================

BOT_TOKEN = "YOUR_BOT_TOKEN"

CHAT_ID = "YOUR_CHAT_ID"

# ==========================
# بررسی پسوند فایل
# ==========================

def allowed_file(filename):

    return "." in filename and \
        filename.rsplit(".",1)[1].lower() in ALLOWED_EXTENSIONS

# ==========================
# صفحه اصلی
# ==========================

@app.route("/")

def home():

    return send_from_directory(".", "index.html")

# ==========================
# فایل های استاتیک
# ==========================

@app.route("/<path:path>")

def static_proxy(path):

    return send_from_directory(".", path)
# ==========================
# آپلود عکس
# ==========================

@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify({
            "success": False,
            "message": "هیچ فایلی ارسال نشده است."
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "success": False,
            "message": "فایل انتخاب نشده است."
        }), 400

    if not allowed_file(file.filename):
        return jsonify({
            "success": False,
            "message": "فرمت فایل مجاز نیست."
        }), 400

    filename = secure_filename(file.filename)

    save_path = os.path.join(
        app.config["UPLOAD_FOLDER"],
        filename
    )

    file.save(save_path)

    telegram_result = False
    telegram_error = ""

    try:

        with open(save_path, "rb") as photo:

            response = requests.post(

                f"https://api.telegram.org/bot{BOT_TOKEN}/sendPhoto",

                data={
                    "chat_id": CHAT_ID,
                    "caption": "📷 عکس جدید از دعوت‌نامه"
                },

                files={
                    "photo": photo
                },

                timeout=30

            )

        if response.status_code == 200:

            telegram_result = True

        else:

            telegram_error = response.text

    except Exception as e:

        telegram_error = str(e)

    return jsonify({

        "success": True,

        "saved_file": filename,

        "telegram_sent": telegram_result,

        "telegram_error": telegram_error

    })
# ==========================
# بررسی وضعیت سرور
# ==========================

@app.route("/status")
def status():

    return jsonify({

        "status": "online",

        "telegram_bot": BOT_TOKEN != "YOUR_BOT_TOKEN",

        "chat_id": CHAT_ID != "YOUR_CHAT_ID"

    })


# ==========================
# خطای 404
# ==========================

@app.errorhandler(404)
def page_not_found(e):

    return jsonify({

        "success": False,

        "message": "صفحه مورد نظر پیدا نشد."

    }),404


# ==========================
# خطای داخلی
# ==========================

@app.errorhandler(500)
def server_error(e):

    return jsonify({

        "success": False,

        "message": "خطای داخلی سرور."

    }),500


# ==========================
# اجرای برنامه
# ==========================

if __name__ == "__main__":

    print("="*50)
    print(" Wedding Invitation Server")
    print("="*50)
    print("Server : http://127.0.0.1:5000")
    print("Upload Folder :", UPLOAD_FOLDER)
    print("="*50)

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
