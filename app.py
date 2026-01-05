from flask import Flask, render_template, jsonify, request
import requests
import logging
from const import (
    QUERY_HELMETS, QUERY_PLATES, QUERY_BACKPACKS, QUERY_WEAPONS, QUERY_AMMO,
    QUERY_MAPS, QUERY_PLAYER_LEVELS, QUERY_HEADPHONES, QUERY_MAGAZINES,
    QUERY_FOOD, QUERY_DRINKS, QUERY_MEDS
)

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

def process_weapons(data):
    """Extract caliber from nested preset properties"""
    weapons = []
    for item in data:
        weapon = {
            'shortName': item.get('shortName'),
            'basePrice': item.get('basePrice'),
            'inspectImageLink': item.get('inspectImageLink'),
            'caliber': None
        }
        # Extract caliber from nested properties
        props = item.get('properties', {})
        if props:
            base_item = props.get('baseItem', {})
            if base_item:
                base_props = base_item.get('properties', {})
                if base_props:
                    weapon['caliber'] = base_props.get('caliber')
        weapons.append(weapon)
    return weapons

def process_magazines(data):
    """Extract capacity and allowed ammo from magazine properties"""
    magazines = []
    for item in data:
        mag = {
            'shortName': item.get('shortName'),
            'basePrice': item.get('basePrice'),
            'inspectImageLink': item.get('inspectImageLink'),
            'capacity': 0,
            'allowedAmmo': []
        }
        props = item.get('properties', {})
        if props:
            mag['capacity'] = props.get('capacity', 0)
            allowed = props.get('allowedAmmo', [])
            mag['allowedAmmo'] = [a.get('shortName') for a in allowed if a.get('shortName')]
        magazines.append(mag)
    return magazines

def process_food_drink(data):
    """Extract energy and hydration from food/drink properties"""
    items = []
    for item in data:
        fd = {
            'shortName': item.get('shortName'),
            'basePrice': item.get('basePrice'),
            'inspectImageLink': item.get('inspectImageLink'),
            'energy': 0,
            'hydration': 0
        }
        props = item.get('properties', {})
        if props:
            fd['energy'] = props.get('energy', 0) or 0
            fd['hydration'] = props.get('hydration', 0) or 0
        items.append(fd)
    return items

def process_meds(data):
    """Extract hitpoints from medkit properties"""
    items = []
    for item in data:
        med = {
            'shortName': item.get('shortName'),
            'basePrice': item.get('basePrice'),
            'inspectImageLink': item.get('inspectImageLink'),
            'hitpoints': 0
        }
        props = item.get('properties', {})
        if props:
            med['hitpoints'] = props.get('hitpoints', 0) or 0
        items.append(med)
    return items

@app.route('/')
def index():
    queries = {
        "helmets": QUERY_HELMETS,
        "armored_rigs": QUERY_PLATES,
        "backpack": QUERY_BACKPACKS,
        "weapons": QUERY_WEAPONS,
        "magazines": QUERY_MAGAZINES,
        "ammo": QUERY_AMMO,
        "headphones": QUERY_HEADPHONES,
        "food": QUERY_FOOD,
        "drinks": QUERY_DRINKS,
        "meds": QUERY_MEDS,
        "maps": QUERY_MAPS,
        "player_levels": QUERY_PLAYER_LEVELS
    }

    context = {"successFlags": {}}
    for key, query in queries.items():
        response = run_query(query)
        if response:
            if key == "ammo":
                raw_data = response.get('data', {}).get('ammo', [])
                context[key] = standardize_data(raw_data)
            elif key == "maps":
                raw_data = response.get('data', {}).get('maps', [])
                context["successFlags"]["maps"] = bool(raw_data)
                context[key] = standardize_data(raw_data)
            elif key == "player_levels":
                raw_data = response.get('data', {}).get('playerLevels', [])
                context["successFlags"]["player_levels"] = bool(raw_data)
                context[key] = standardize_data(raw_data)
            elif key == "weapons":
                raw_data = response.get('data', {}).get('items', [])
                context[key] = process_weapons(raw_data)
            elif key == "magazines":
                raw_data = response.get('data', {}).get('items', [])
                context[key] = process_magazines(raw_data)
            elif key in ["food", "drinks"]:
                raw_data = response.get('data', {}).get('items', [])
                context[key] = process_food_drink(raw_data)
            elif key == "meds":
                raw_data = response.get('data', {}).get('items', [])
                context[key] = process_meds(raw_data)
            else:
                raw_data = response.get('data', {}).get('items', [])
                context[key] = standardize_data(raw_data)
        else:
            context[key] = []
            context["successFlags"][key] = False

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
    app.run(host='0.0.0.0', port=5001, debug=True)
