from flask import Flask, render_template, jsonify, request
import requests
import logging
from const import QUERY_HELMETS, QUERY_PLATES, QUERY_BACKPACKS, QUERY_M4A1, QUERY_AMMO, QUERY_MAPS, QUERY_PLAYER_LEVELS

app = Flask(__name__)

# Setting up logging
logging.basicConfig(level=logging.DEBUG)
app.logger.setLevel(logging.DEBUG)

# API endpoint
API_URL = "https://api.tarkov.dev/graphql"

# Define the custom filter
@app.template_filter('number_format')
def number_format(value, format='%0.2f'):
    """Format a number with commas as thousands separators."""
    try:
        number = float(value)
        return f"{number:,.2f}"
    except (ValueError, TypeError):
        return value  # or return an error or a default value

def run_query(query):
    headers = {"Content-Type": "application/json"}
    response = requests.post(API_URL, headers=headers, json={'query': query})
    app.logger.debug("API response: %s", response.text)  # Log the response text
    if response.status_code == 200:
        return response.json()
    else:
        app.logger.error(f"API query failed with status code {response.status_code}: {response.text}")
        return None
def process_data(item):
    if isinstance(item, dict):
        return {k: process_data(v) for k, v in item.items()}
    elif isinstance(item, list):
        return [process_data(v) for v in item]
    else:
        return item
def standardize_data(data):
    standardized = []
    for item in data:
        item_data = {}
        for key, value in item.items():
            item_data[key] = value
        standardized.append(item_data)
    return standardized
@app.route('/')

def index():
    queries = {
        "helmets": QUERY_HELMETS,
        "armored_rigs": QUERY_PLATES,
        "backpack": QUERY_BACKPACKS,
        "M4A1": QUERY_M4A1,
        "ammo": QUERY_AMMO,  
        "maps": QUERY_MAPS,
        "player_levels": QUERY_PLAYER_LEVELS
    }

    context = {"successFlags": {}}
    for key, query in queries.items():
        response = run_query(query)
        if response:
            if key == "ammo":
                raw_data = response.get('data', {}).get('ammo', [])
            elif key == "maps":
                raw_data = response.get('data', {}).get('maps', [])
                context["successFlags"]["maps"] = bool(raw_data)
            elif key == "player_levels":
                # Refactored to correctly access 'playerLevels' from the response
                raw_data = response.get('data', {}).get('playerLevels', [])
                context["successFlags"]["player_levels"] = bool(raw_data)
            else:
                raw_data = response.get('data', {}).get('items', [])
            context[key] = standardize_data(raw_data)
        else:
            context[key] = []
            context["successFlags"][key] = False  # Set success flag as False when no data is returned

    app.logger.debug("Full Context Data: %s", context)
    return render_template("index.html", context=context)

@app.route('/calculate_score', methods=['POST'])
def calculate_score():
    try:
        total_price = sum([
            int(request.form.get('helmet', 0)),
            int(request.form.get('armored_rig', 0)),
            int(request.form.get('backpack', 0))
        ])
        ammo_damage = int(request.form.get('ammo', 0))
        map_knowledge = int(request.form.get('map', 0))
        player_level = int(request.form.get('player_level', 0))

        normalized_gear_score = (total_price / 100000) * 10  # Assuming 100000 as max price
        normalized_ammo_score = (ammo_damage / 100) * 10  # Assuming 100 as max ammo damage
        normalized_map_score = (map_knowledge / 10) * 10  # Assuming 10 as max map knowledge
        normalized_player_score = (player_level / 70) * 10  # Assuming 70 as max player level

        final_score = (
            normalized_gear_score * 0.3 +
            normalized_ammo_score * 0.2 +
            normalized_map_score * 0.1 +
            normalized_player_score * 0.1
        ) * 10

        return jsonify(score=min(final_score, 100))
    except ValueError:
        app.logger.error("Error in calculating score: Invalid input.")
        return jsonify(score=0)

if __name__ == "__main__":
    app.run(debug=True)
