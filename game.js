// Endless Dungeons Game Logic

const GAME_PLAY_TEXT = [
    {
        title: "Introduction",
        html: `
            <p>A strategic web-based dungeon crawler played with a standard deck of cards. Survive the endless depths by managing your health and weapon durability. Every card counts—choose wisely to conquer the dungeon!</p>
        `
    },
    {
        title: "Game Play",
        html: `
            <p>In each room, play three cards to clear the room and advance to the next. The card's effect depends on its suit and value.</p>
            <p>The game defaults to a 'Quick Attack' but it will automatically choose 'Attack + Shield' when a new shield is equipped.</p>
            <p>To attack a monster, choose your preferred attack type and click on the monster you wish to fight.</p>
            <p>Select a shield (Diamonds) or potion (Hearts) to use them right away.</p>
            <p>Shields wear out. When you first equip a shield, you may attack a stronger monster with a newly equipped shield, but you take the difference in damage. The equipped shield becomes the strength of the last monster defeated. Subsequent attacks to monsters can only be done with equal or greater shield strength.</p>
        `
    },
    {
        title: "Card Types",
        html: `
            <ul>
                <li>Spade and Club cards are Monsters you must fight to clear the room. Cards valued at 2-10 hurt you according to their face value, face cards are powerful (J = 11, Q = 12, K = 13), and aces are boss monsters with a strength of 14.</li>
                <li>Diamond cards are items (♦)
                    <ul>
                        <li>Swords (Ace/0) You start with a 0 power sword. Find the Legendary Sword in the dungeon to increase your attack damage by 1.</li>
                        <li>Shields (2-10) Block monster attack damage in the amount of their face value.</li>
                    </ul>
                </li>
                <li>Heart cards are Potions (♥) that restore your health. Aces restore 1 health. Cards 2-10 restore their face value.</li>
            </ul>
        `
    },
    {
        title: "Combat & Actions",
        html: `
            <ul>
                <li>Quick Attack: Strike with your sword. You take damage equal to the Monster's strength minus your Sword's strength.</li>
                <li>Attack + Shield: Attack, but also defend with your shield. If your Sword + Shield is stronger than the Monster, you take no damage. Shields wear out so the Monster strength becomes your new Shield strength.</li>
                <li>Flee: Part of the game's strategy. If the room is full (4 cards), you can flee to shuffle the room back into the deck. You cannot flee two rooms in a row.</li>
            </ul>
        `
    },
    {
        title: "Final Score Calculation",
        html: `
            <ul>
                <li>Health remaining at the end of the game</li>
                <li>Plus any unused health potion points</li>
                <p>Any potion used with full health of 20 does not increase health, but does get counted in the final score.</p>
                <p>For example: If you have 18 health and you get a 10 health potion, your health goes up to the maximum of 20 and the remaining health points (8) from the potion are added to your final score.</p>
            </ul>`
    },
    {
        title: "Examples",
        html: `
            <ul>
                <li>Example: You have a 0 power sword and a newly equipped 5 power shield. You attack a 13 monster (King) using Quick Attack (unused shield). You take 13 damage (13 - 0 = 13). If you use Attack + Shield, you take 8 damage (13 - 5 = 8).</li>
                <li>Example: You have a 1 power sword and a newly equipped 5 power shield. You attack a 13 monster (King) using Quick Attack (unused shield). You take 12 damage (13 - 1 = 12). If you use Attack + Shield, you take 7 damage (13 - 1 - 5 = 7).</li>
                <li>Example: You just defeated an 8 monster. The shield used in the fight is now a strength of 8. That shield can now only be used to fight monsters of equal or lesser strength.</li>
            </ul>`
    }
];

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.value = this.getValue();
        this.type = this.getType();
    }

    getValue() {
        if (this.rank === 'A') {
            return (this.suit === '♠' || this.suit === '♣') ? 14 : 1;
        }
        if (this.rank === 'J') return 11;
        if (this.rank === 'Q') return 12;
        if (this.rank === 'K') return 13;
        return parseInt(this.rank);
    }

    getType() {
        if (this.suit === '♠' || this.suit === '♣') return 'monster';
        if (this.suit === '♦') {
            return (this.rank === 'A' || this.rank === '0') ? 'sword' : 'shield';
        }
        if (this.suit === '♥') return 'potion';
    }

    getHTML() {
        const suitClass = (this.suit === '♥' || this.suit === '♦') ? 'red' : 'black';
        return `
            <div class="card-corner top-left">
                <div>${this.rank}</div>
                <div class="suit ${suitClass}">${this.suit}</div>
            </div>
            <div class="card-center suit ${suitClass}">${this.suit}</div>
            <div class="card-corner bottom-right">
                <div>${this.rank}</div>
                <div class="suit ${suitClass}">${this.suit}</div>
            </div>
        `;
    }

    toString() {
        return `${this.rank}${this.suit}`;
    }
}

class Game {
    constructor() {
        this.deck = this.createDeck();
        this.shuffle(this.deck);
        this.health = 20;
        this.hand = [];
        this.shield = null;
        this.sword = new Card('0', '♦');
        this.selectedAttack = 'quick';
        this.discard = [];
        this.shieldTrained = false;
        this.absorbedMonster = null;
        this.lastFled = false;
        this.unusedPotions = 0;
        this.loadHighScore();
        this.updateDisplay();
        this.drawCard();
        this.snapToGame();
    }

    createDeck() {
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suits = ['♠', '♥', '♦', '♣'];
        const deck = [];
        for (const suit of suits) {
            const suitRanks = (suit === '♥' || suit === '♦') ? ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'] : ranks;
            for (const rank of suitRanks) {
                deck.push(new Card(rank, suit));
            }
        }
        return deck;
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    selectQuickAttack() {
        this.selectedAttack = 'quick';
        this.updateDisplay();
    }

    selectShieldAttack() {
        this.selectedAttack = 'shield';
        this.updateDisplay();
    }

    attack() {
        if (!this.shield) {
            alert('No shield equipped!');
            return;
        }
        const monsterIndex = this.hand.findIndex(c => c && c.type === 'monster');
        if (monsterIndex !== -1) {
            if (this.shield.value >= this.hand[monsterIndex].value) {
                this.hand[monsterIndex] = null;
                this.shield = null;
                if (this.hand.filter(c => c).length === 1) this.drawCard();
            } else {
                alert('Shield too weak!');
            }
        } else {
            alert('No monster to attack!');
        }
        this.updateDisplay();
        this.checkGameOver();
    }

    drawCard() {
        while (this.hand.length < 4) {
            this.hand.push(null);
        }
        for (let i = 0; i < 4; i++) {
            if (this.hand[i] === null && this.deck.length > 0) {
                this.hand[i] = this.deck.pop();
            }
        }
        this.updateDisplay();
    }

    playCard(index) {
        const card = this.hand[index];
        if (!card) return;

        if (card.type === 'monster') {
            if (!this.selectedAttack) {
                alert('Select an attack type first!');
                return;
            }
            const attackBonus = this.sword ? this.sword.value : 0;

            if (this.selectedAttack === 'quick') {
                const damage = Math.max(0, card.value - attackBonus);
                this.health -= damage;
                this.hand[index] = null;
                this.discard.push(card);
                if (this.hand.filter(c => c).length === 1) this.drawCard();
                this.lastFled = false;
                this.consecutiveFlees = 0;
            } else if (this.selectedAttack === 'shield') {
                if (!this.shield) {
                    alert('No shield equipped!');
                    return;
                }
                const effectiveShieldValue = this.shield.value + attackBonus;
                if (effectiveShieldValue >= card.value) {
                    this.hand[index] = null;
                    this.shield.rank = card.rank;
                    this.shield.value = card.value;
                    this.absorbedMonster = card;
                    if (this.hand.filter(c => c).length === 1) this.drawCard();
                    this.lastFled = false;
                } else {
                    if (!this.shieldTrained) {
                        const damage = card.value - effectiveShieldValue;
                        this.health -= damage;
                        this.shield.rank = card.rank;
                        this.shield.value = card.value;
                        this.shieldTrained = true;
                        this.hand[index] = null;
                        this.absorbedMonster = card;
                        if (this.hand.filter(c => c).length === 1) this.drawCard();
                        this.lastFled = false;
                        this.consecutiveFlees = 0;
                    } else {
                        alert('Shield too weak!');
                        return;
                    }
                }
            }
        } else {
            if (card.type === 'shield') {
                if (this.shield) {
                    this.discard.push(this.shield);
                    if (this.absorbedMonster) this.discard.push(this.absorbedMonster);
                }
                this.shield = card;
                this.shieldTrained = false;
                this.absorbedMonster = null;
                this.selectedAttack = 'shield';
                this.hand[index] = null;
            } else if (card.type === 'sword') {
                if (card.rank === 'A') {
                    alert('You found the legendary sword!');
                }
                this.sword = card;
                this.hand[index] = null;
            } else if (card.type === 'potion') {
                const healthBefore = this.health;
                this.health = Math.min(20, this.health + card.value);
                // Track unused potions if health doesn't increase
                if (healthBefore === 20) {
                    this.unusedPotions += card.value;
                }
                this.discard.push(card);
                this.hand[index] = null;
            }
            this.lastFled = false;
            if (this.hand.filter(c => c).length === 1) this.drawCard();
        }
        this.updateDisplay();
        this.checkGameOver();
    }

    flee() {
        if (this.lastFled) {
            alert('Cannot flee consecutively!');
            return;
        }
        if (this.hand.filter(c => c).length !== 4) {
            alert('Can only flee with a full room (4 cards)!');
            return;
        }
        // Move all cards in hand to bottom of deck
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i]) {
                this.deck.unshift(this.hand[i]);
                this.hand[i] = null;
            }
        }
        // Draw 4 new cards
        this.drawCard();
        this.lastFled = true;
        this.updateDisplay();
        this.checkGameOver();
    }

    loadAdScript() {
        try {
            const adContainer = document.getElementById('adContainer');
            const script = document.createElement('script');
            script.dataset.zone = '10579775';
            script.src = 'https://gizokraijaw.net/vignette.min.js';
            script.async = true;
            adContainer.appendChild(script);
        } catch (error) {
            console.error('Error loading ad script:', error);
        }
    }

    showEndgameScreen(isWin, score) {
        // Hide the game interface
        document.getElementById('game').style.display = 'none';
        
        // Show the endgame screen
        const endgameScreen = document.getElementById('endgameScreen');
        endgameScreen.style.display = 'flex';
        
        // Update endgame content
        const title = endgameScreen.querySelector('#endgameTitle');
        title.textContent = isWin ? 'Victory!' : 'Game Over';
        
        document.getElementById('finalScore').textContent = score;
        document.getElementById('endgameHighScore').textContent = this.highScore;
        
        // Load the ad
        this.loadAdScript();
    }

    checkGameOver() {
        if (this.health <= 0) {
            const score = this.calculateScore();
            this.saveHighScore();
            this.showEndgameScreen(false, score);
        } else if (this.deck.length === 0 && this.hand.filter(c => c && c.type === 'monster').length === 0) {
            const score = this.calculateScore();
            this.saveHighScore();
            this.showEndgameScreen(true, score);
        }
    }

    calculateScore() {
        const healthRemaining = Math.max(0, this.health);
        return healthRemaining + this.unusedPotions;
    }

    loadHighScore() {
        this.highScore = parseInt(localStorage.getItem('endlessDungeonsHighScore')) || 0;
    }

    saveHighScore() {
        const currentScore = this.calculateScore();
        if (currentScore > this.highScore) {
            this.highScore = currentScore;
            localStorage.setItem('endlessDungeonsHighScore', this.highScore.toString());
        }
    }

    reset() {
        // Hide endgame screen and show game interface
        document.getElementById('endgameScreen').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        
        this.deck = this.createDeck();
        this.shuffle(this.deck);
        this.health = 20;
        this.hand = [];
        this.shield = null;
        this.sword = new Card('0', '♦');
        this.selectedAttack = 'quick';
        this.discard = [];
        this.shieldTrained = false;
        this.absorbedMonster = null;
        this.lastFled = false;
        this.unusedPotions = 0;
        this.updateDisplay();
        this.drawCard();
    }

    snapToGame() {
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const gameElement = document.getElementById('game');
                if (gameElement) {
                    gameElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }

    updateDisplay() {
        document.getElementById('health').textContent = `Health: ${this.health}`;
        document.getElementById('highScore').textContent = `High Score: ${this.highScore}`;
        document.getElementById('deck').textContent = `Deck: ${this.deck.length} cards`;

        const handDiv = document.getElementById('hand');
        handDiv.innerHTML = '';
        const handTitle = document.createElement('h4');
        handTitle.className = 'zone-title';
        handTitle.textContent = 'Room';
        handDiv.appendChild(handTitle);
        const handCardsContainer = document.createElement('div');
        handCardsContainer.className = 'card-container';
        this.hand.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            if (card) {
                cardDiv.innerHTML = card.getHTML();
                cardDiv.title = card.type.charAt(0).toUpperCase() + card.type.slice(1);
                cardDiv.onclick = () => this.playCard(index);
            } else {
                cardDiv.style.visibility = 'hidden';
                cardDiv.innerHTML = new Card('A', '♠').getHTML();
            }
            handCardsContainer.appendChild(cardDiv);
        });
        handDiv.appendChild(handCardsContainer);

        const shieldDiv = document.getElementById('shield');
        shieldDiv.innerHTML = '';
        const shieldTitle = document.createElement('h4');
        shieldTitle.className = 'zone-title';
        shieldTitle.textContent = 'Equipped Shield';
        shieldDiv.appendChild(shieldTitle);
        const shieldCardsContainer = document.createElement('div');
        shieldCardsContainer.className = 'card-container';
        
        // Shield Slot
        const shieldCard = document.createElement('div');
        shieldCard.className = 'card';
        if (this.shield) {
            shieldCard.innerHTML = this.shield.getHTML();
            shieldCard.title = this.shield.type.charAt(0).toUpperCase() + this.shield.type.slice(1);
        } else {
            shieldCard.style.visibility = 'hidden';
            shieldCard.innerHTML = new Card('A', '♠').getHTML();
        }
        shieldCardsContainer.appendChild(shieldCard);

        // Monster Slot
        const monsterCard = document.createElement('div');
        monsterCard.className = 'card';
        if (this.absorbedMonster) {
            monsterCard.innerHTML = this.absorbedMonster.getHTML();
            monsterCard.title = this.absorbedMonster.type.charAt(0).toUpperCase() + this.absorbedMonster.type.slice(1);
        } else {
            monsterCard.style.visibility = 'hidden';
            monsterCard.innerHTML = new Card('A', '♠').getHTML();
        }
        shieldCardsContainer.appendChild(monsterCard);
        
        shieldDiv.appendChild(shieldCardsContainer);

        const swordDiv = document.getElementById('sword');
        swordDiv.innerHTML = '';
        const swordTitle = document.createElement('h4');
        swordTitle.className = 'zone-title';
        swordTitle.textContent = 'Equipped Sword';
        swordDiv.appendChild(swordTitle);
        const swordCardsContainer = document.createElement('div');
        swordCardsContainer.className = 'card-container';
        
        const swordCard = document.createElement('div');
        swordCard.className = 'card';
        if (this.sword) {
            swordCard.innerHTML = this.sword.getHTML();
            swordCard.title = this.sword.type.charAt(0).toUpperCase() + this.sword.type.slice(1);
        } else {
            swordCard.style.visibility = 'hidden';
            swordCard.innerHTML = new Card('A', '♠').getHTML();
        }
        swordCardsContainer.appendChild(swordCard);
        
        swordDiv.appendChild(swordCardsContainer);

        const discardDiv = document.getElementById('discard');
        discardDiv.innerHTML = '';
        const discardTitle = document.createElement('h4');
        discardTitle.className = 'zone-title';
        discardTitle.textContent = 'Discard Pile';
        discardDiv.appendChild(discardTitle);
        const discardCardsContainer = document.createElement('div');
        discardCardsContainer.className = 'card-container';
        this.discard.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.innerHTML = card.getHTML();
            cardDiv.title = card.type.charAt(0).toUpperCase() + card.type.slice(1);
            discardCardsContainer.appendChild(cardDiv);
        });
        discardDiv.appendChild(discardCardsContainer);

        // Update button highlights
        document.getElementById('quickAttack').classList.toggle('selected', this.selectedAttack === 'quick');
        document.getElementById('attack').classList.toggle('selected', this.selectedAttack === 'shield');

        // Disable flee button if cannot flee
        document.getElementById('flee').disabled = this.lastFled || this.hand.filter(c => c).length !== 4;
    }
}

const game = new Game();

const instructionsElement = document.getElementById('game-play-instructions');
if (instructionsElement) {
    instructionsElement.innerHTML = GAME_PLAY_TEXT.map(section => `
        <h3>${section.title}</h3>
        ${section.html}
    `).join('');
}

document.getElementById('quickAttack').onclick = () => game.selectQuickAttack();
document.getElementById('attack').onclick = () => game.selectShieldAttack();
document.getElementById('flee').onclick = () => game.flee();
document.getElementById('newGame').onclick = () => game.reset();
document.getElementById('endgameNewGame').onclick = () => game.reset();