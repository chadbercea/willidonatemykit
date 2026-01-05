# Define each query as a constant string

# Actual helmets only (not hats/beanies)
QUERY_HELMETS = """
query {
  items(types: [helmet], limit: 12) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

# Body armor
QUERY_PLATES = """
query {
  items(categoryNames: [Armor], limit: 12) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

# Backpacks
QUERY_BACKPACKS = """
query {
  items(categoryNames: [Backpack], limit: 12) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

# Preset weapons (complete builds with caliber info)
QUERY_WEAPONS = """
query {
  items(types: [preset], categoryNames: [AssaultRifle, SMG, Shotgun, MarksmanRifle, SniperRifle], limit: 15) {
    shortName
    basePrice
    inspectImageLink
    properties {
      ... on ItemPropertiesPreset {
        baseItem {
          shortName
          properties {
            ... on ItemPropertiesWeapon {
              caliber
            }
          }
        }
      }
    }
  }
}
"""

# Ammo with caliber for filtering (high limit to get all calibers)
QUERY_AMMO = """
query {
  ammo(limit: 200) {
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

# Headphones/Ear Protection
QUERY_HEADPHONES = """
query {
  items(categoryNames: [Headphones], limit: 8) {
    shortName
    basePrice
    inspectImageLink
  }
}
"""

# Magazines with capacity
QUERY_MAGAZINES = """
query {
  items(categoryNames: [Magazine], limit: 50) {
    shortName
    basePrice
    inspectImageLink
    properties {
      ... on ItemPropertiesMagazine {
        capacity
        allowedAmmo {
          shortName
        }
      }
    }
  }
}
"""

# Food items
QUERY_FOOD = """
query {
  items(categoryNames: [Food], limit: 8) {
    shortName
    basePrice
    inspectImageLink
    properties {
      ... on ItemPropertiesFoodDrink {
        energy
        hydration
      }
    }
  }
}
"""

# Drink items
QUERY_DRINKS = """
query {
  items(categoryNames: [Drink], limit: 8) {
    shortName
    basePrice
    inspectImageLink
    properties {
      ... on ItemPropertiesFoodDrink {
        energy
        hydration
      }
    }
  }
}
"""

# Medical items (medkits)
QUERY_MEDS = """
query {
  items(categoryNames: [Medikit], limit: 8) {
    shortName
    basePrice
    inspectImageLink
    properties {
      ... on ItemPropertiesMedKit {
        hitpoints
      }
    }
  }
}
"""
