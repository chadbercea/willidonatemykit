# Define each query as a constant string
QUERY_HELMETS = """
query {
  items(name: "Helmet", limit: 5) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_PLATES = """
query {
  items(name: "Plate", limit: 5) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_BACKPACKS = """
query {
  items(name: "backpack", limit: 5) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_M4A1 = """
query {
  items(name: "M4A1", limit: 5) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_AMMO = """
query {
  ammo(limit: 5) {
    item {
      shortName
    }
    damage
    caliber
  }
}
"""

QUERY_MAPS = """
query {
  maps(limit: 5) {
    name
    enemies
    players
  }
}
"""

QUERY_PLAYER_LEVELS = """
query {
  playerLevels {
    level
    exp
  }
}
"""
