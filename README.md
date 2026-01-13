# ScoundrelFree

A simple web-based implementation of the Scoundrel card game.

## How to Play

Scoundrel is a solitaire card game where you battle monsters using a modified 52-card deck.

- **Monsters**: All spades and clubs.
- **Weapons**: All diamonds.
- **Potions**: All hearts.

Note: Hearts and diamonds face cards (J, Q, K) are excluded from the deck.

Start with 20 health. Your hand represents the current room, starting with 4 cards. Cards are drawn automatically to refill the room to 4 cards whenever the room has only 1 card left. Play weapons to equip, potions to heal by their value. Select attack type (Bare Hands or Weapon), then click monster cards to attack. Weapons transform to defeated monsters' strength and display the absorbed monster card; training allows fighting stronger monsters once. Flee the room to send all current cards to bottom of deck and draw 4 new ones (no damage, no monster fights). You cannot flee two rooms in a row; fleeing becomes available again after attacking a monster, equipping a weapon, or consuming a potion. Defeated monsters and used potions go to discard; weapons only when replaced.

Goal: Clear all monsters from the room without your health reaching zero.

## Running the Game

Open `index.html` in a web browser or serve the directory with a local server (e.g., `python -m http.server`).

Navigate to the Game page to play, or Instructions for rules.