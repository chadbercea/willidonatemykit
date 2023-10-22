from flask import Flask, render_template, jsonify
import requests
import random
import logging

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

def run_query(query):
    headers = {"Content-Type": "application/json"}
    response = requests.post('https://api.tarkov.dev/graphql', headers=headers, json={'query': query})
    
    if response.status_code == 200:
        data = response.json()
        # Log the response data for debugging purposes
        app.logger.debug(data)
        
        # Check if the response contains any errors
        if "errors" in data:
            return {"error": data["errors"][0]["message"]}
        
        return data
    else:
        error_message = "Tell Chad his robot isn't working. Error Code: {} FU Braj.".format(response.status_code)
        app.logger.error(error_message)
        return {"error": error_message}

@app.route('/')
def index():
    item_query = """
    query {
        items(name: "Multitool") {
            name
            shortName
            basePrice
            avg24hPrice
            changeLast48h
            changeLast48hPercent
            sellFor {
                price
                currency
                priceRUB
                source
            }
            buyFor {
                price
                currency
                priceRUB
                source
            }
            category {
                id
            }
            gridImageLink              
        }
    }
    """
  
    result = run_query(item_query)
    if "error" in result:
        return render_template("index.html", error=result["error"])
    
    item = result["data"]["items"][0] if "data" in result and "items" in result["data"] and result["data"]["items"] else None
    return render_template("index.html", item=item)

@app.route('/search', methods=['POST'])
def search():
    item_name = request.form.get('item_name', '')  # Retrieving the item name from the POST request.
    
    item_query = f"""
    query {{
        items(name: "{item_name}") {{
            # rest of the fields
        }}
    }}
    """
  
    result = run_query(item_query)
    if "error" in result:
        return jsonify(error=result["error"])
    
    item = result["data"]["items"][0] if result["data"]["items"] else None
    return jsonify(item)

if __name__ == "__main__":
    app.run(debug=True)
