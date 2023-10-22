from flask import Flask
from flask_caching import Cache
import requests
import random

app = Flask(__name__)

# Configuring Flask-Caching
cache_config = {
    "CACHE_TYPE": "simple",  # Simple in-memory cache
    "CACHE_DEFAULT_TIMEOUT": 300  # Cache timeout: 5 minutes
}
app.config.from_mapping(cache_config)

cache = Cache(app)

@cache.memoize()
def run_query(query):
    headers = {"Content-Type": "application/json"}
    response = requests.post('https://api.tarkov.dev/graphql', headers=headers, json={'query': query})
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Tell Chad his robot isn't working. Error Code: {} FU Braj.".format(response.status_code)}

@app.route('/random_item')
def get_random_item():
    # Sample query to get names. This will need adjustment based on the exact API schema
    name_query = """
    {
        items(limit: 10) {
            name
        }
    }
    """
    names = run_query(name_query)
    
    if "error" in names:
        return names["error"]

    # Extract names and select a random one
    item_names = [item["name"] for item in names["data"]["items"]]
    random_item_name = random.choice(item_names)
    
    # Query for the selected random item
    item_query = """
    {{
        items(name: "{}") {{
            id
            name
            shortName
        }}
    }}
    """.format(random_item_name)
    
    result = run_query(item_query)
    if "error" in result:
        return result["error"]

    return str(result)

@app.route('/')
def index():
    return """
    <html>
        <head>
            <title>Tarkov Tools</title>
        </head>
        <body>
            <h1>Will I Donate My Kit? We help you calculate the odds.</h1>
            <button id="fetchBtn">Press Me</button>
            <pre id="result"></pre>
            <script>
                const btn = document.getElementById('fetchBtn');
                const resultDiv = document.getElementById('result');
                
                btn.addEventListener('click', async () => {
                    btn.disabled = true;
                    setTimeout(() => btn.disabled = false, 20000);
                    
                    const response = await fetch('/random_item');
                    const data = await response.text();
                    resultDiv.textContent = data;
                });
            </script>
        </body>
    </html>
    """

@app.route('/hello')
def hello_world():
    return 'Will I Donate My Kit? We help you calculate the odds. First auto deploy. #LFG'

if __name__ == "__main__":
    app.run(debug=True)
