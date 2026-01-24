# Endless Dungeons
A strategic web-based dungeon crawler played with a standard deck of cards. Survive the endless depths by managing your health and weapon durability.

Complete a merge into main to auto-deploy changes in Netlify. 

# Backlog
## Needs
Clarify the game instructions and add examples. The shield mechanic can be hard to grasp for new users.

Enable a button for users to start a new game without having to resfresh the page.

## Wants
Add a game over screen.

Add a victory screen.

Remove dialog boxes. Do this after a game over screen and a victory screen exist. 

Add game difficulty. Easy, medium, hard, un-escapable?

Change health to have a symbol (hearts) and health bar.

Add spaces for google ads?

Add a final score mechanism? User can go for a high score and share.

# Running the Game

Open `index.html` in a web browser or serve the directory with a local server (e.g., `python -m http.server`).
http://localhost:8000

# Completed work
2026-01-20 Add function when you hover over cards with the mouse it says what they are (monster, shield, sword, potion).
2026-01-20 Move instructions to the main page and remove the instructions page. Add an intro paragraph.
2026-01-19 Beautify the look of the page. When on mobile, 'snap' the screen to the game. Fixed weapon eqippping bug.
2026-01-18 Add a starting equipment: 0 of Diamonds (Basic Sword) with 0 attack bonus.
2026-01-18 Make the ace of diamonds a sword, which increases all attacks by 1 until the game ends.
2026-01-18 Implement change: When you select a shield, the attack type automatically changes to attack with shield.
2026-01-18 Change "weapon" to "shield" in all aspects of the game.
2026-01-18 Make the ace of spades and ace of clubs strength 14 monsters.
2026-01-17 Make the page refresh after each death or successful dungeon crawl (to increase total page views).
2026-01-17 Make the attack type always selected. 