from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Will I Donate My Kit? We help you calculate the odds.'
