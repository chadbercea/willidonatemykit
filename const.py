# Define each query as a constant string
QUERY_HELMETS = """
query {
  items(categoryNames: [Headwear], limit: 12) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_PLATES = """
query {
  items(categoryNames: [Armor], limit: 12) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_BACKPACKS = """
query {
  items(categoryNames: [Backpack], limit: 12) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_M4A1 = """
query {
  items(categoryNames: [AssaultRifle], limit: 12) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

QUERY_AMMO = """
query {
  ammo(limit: 15) {
    item {
      shortName
      basePrice
      inspectImageLink
    }
    caliber
    damage
    armorDamage
  }
}
"""

QUERY_MAPS = """
query {
  maps {
    id
    name
    normalizedName
    wiki
    description
    enemies
    raidDuration
    players
    bosses {
      name
      spawnChance
    }
    accessKeys {
        shortName
        wikiLink
    }
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
