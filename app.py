from flask import Flask, requests
from flask_caching import Cache

app = Flask(__name__)

# Configuring Flask-Caching
cache_config = {
    "CACHE_TYPE": "simple", # Simple in-memory cache
    "CACHE_DEFAULT_TIMEOUT": 300 # Cache timeout: 5 minutes
}
app.config.from_mapping(cache_config)

cache = Cache(app)

@app.route('/')
def hello_world():
    return 'Will I Donate My Kit? We help you calculate the odds. First auto deploy. #LFG'
