# Endless Dungeons
A strategic web-based dungeon crawler played with a standard deck of cards. Survive the endless depths by managing your health and weapon durability.

Complete a merge into main to auto-deploy changes in Netlify.

**To-Do Checklist (AdSense remediation & site improvements)**

- **Audit:** Review pages for low-value or placeholder content (`index.html`, `about.html`, `contact.html`, and pages that primarily serve navigation or UI).
- **Remove placeholders:** Remove any "under construction" or "coming soon" notices and placeholder banners across the site.
- **Add substantial content:** Add original content to primary pages: a clear game description, `How to play` instructions, screenshots/gifs, FAQ, and a short blog or updates feed.
- **Avoid low-value pages:** Do not publish pages whose main purpose is navigation, alerts, or single-button redirects; merge or expand them into contentful pages.
- **Ad placement rules:** Place ads inside primary content areas (articles or between paragraphs). Avoid placing ads in navigation bars, headers/footers, popups, or alert-only pages.
- **Accessibility & access:** Ensure pages are publicly reachable (no login required), not blocked by `robots.txt` or meta `noindex`, and are mobile-friendly and fast-loading.
- **Policy & legal:** Keep `privacy.html` and `terms.html` accurate and visible; maintain `contact.html` with a clear contact method.
- **Technical hygiene:** Add `sitemap.xml`, a permissive `robots.txt`, verify the site in Google Search Console, and ensure pages are crawlable.
- **Request review:** After making the fixes, sign into AdSense → Policy center to clear issues and request a site re-review.


# Backlog

## Needs


## Wants
Add game difficulty. Easy, medium, hard, un-escapable?

Change health to have a symbol (hearts) and health bar.

# Running the Game

Open `index.html` in a web browser or serve the directory with a local server (e.g., `python -m http.server`).
http://localhost:8000

# Completed work
2026-02-14 Replaced browser alerts with an in-game text log for seamless gameplay. Added detailed combat and event feedback messages.
2026-02-14 Add a game over screen and victory screen with score display and play again button.
Add a final score mechanism.
Enable a button for users to start a new game without having to resfresh the page.
Clarify the game instructions and add examples. The shield mechanic can be hard to grasp for new users.
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