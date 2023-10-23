from flask import Flask, render_template, jsonify, request
import requests
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

def run_query(query):
    headers = {"Content-Type": "application/json"}
    response = requests.post('https://api.tarkov.dev/graphql', headers=headers, json={'query': query})
    
    if response.status_code == 200:
        data = response.json()
        app.logger.debug(data)
        
        if "errors" in data:
            return {"error": data["errors"][0]["message"]}
        
        return data
    else:
        error_message = "Tell Chad his robot isn't working. Error Code: {} FU Braj.".format(response.status_code)
        app.logger.error(error_message)
        return {"error": error_message}

@app.route('/')
def index():
    return render_template("index.html")

# ... (rest of your imports and app initialization)

@app.route('/search', methods=['POST'])
def search():
    data = request.json
    item_name = data.get('searchTerm', '').strip()

    if not item_name:  # check if item name is empty
        return jsonify(error="Item name is required!")

    item_query = f"""
    query {{
        items(name: "{item_name}") {{
            name
            shortName
            basePrice
            avg24hPrice
            changeLast48h
            changeLast48hPercent
            sellFor {{
                price
                currency
                priceRUB
                source
            }}
            buyFor {{
                price
                currency
                priceRUB
                source
            }}
            category {{
                id
            }}
            gridImageLink              
        }}
    }}
    """
    
    app.logger.debug(f"Sending query:\n{item_query}")

    result = run_query(item_query)
    if "error" in result:
        return jsonify(error=result["error"])

    items = result.get("data", {}).get("items", [])
    return jsonify(items=items)

if __name__ == "__main__":
    app.run(debug=True)
