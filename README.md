# Endless Dungeons

A strategic web-based dungeon crawler played with a standard deck of cards. Survive the endless depths by managing your health and weapon durability.

## The Rules of the Dungeon

- **Monsters (♣/♠)**: Deal damage equal to their rank. **Aces are 1**, J=11, Q=12, K=13.
- **Weapons (♦)**: Equip to mitigate damage.
- **Potions (♥)**: Heal up to a max of 20 HP.

*Note: Red Face Cards (J, Q, K) are removed from the deck.*

### Combat Mechanics

1.  **The Room**: You face 4 cards. Clear 3 to advance.
2.  **Weapon Memory**: When you kill a monster with a weapon, the weapon's strength becomes equal to that monster's strength. Plan your kill order carefully!
3.  **Overexertion**: You can attack a monster stronger than your weapon **once**. You take the difference in damage, and your weapon upgrades to that monster's strength. After this, the weapon cannot attack stronger monsters again.
4.  **Fleeing**: You can shuffle a full room of 4 cards to the bottom of the deck. You cannot flee consecutive rooms.

**Goal:** Clear the entire deck without your health reaching zero.

## Running the Game

Open `index.html` in a web browser or serve the directory with a local server (e.g., `python -m http.server`).