// Endless Dungeons Game Logic

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
        return `${this.rank}<span class="suit ${suitClass}">${this.suit}</span>`;
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
        this.updateDisplay();
        this.drawCard();
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
        const monsterIndex = this.hand.findIndex(c => c.type === 'monster');
        if (monsterIndex !== -1) {
            if (this.shield.value >= this.hand[monsterIndex].value) {
                this.hand.splice(monsterIndex, 1);
                this.shield = null;
                if (this.hand.length === 1) this.drawCard();
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
        while (this.hand.length < 4 && this.deck.length > 0) {
            this.hand.push(this.deck.pop());
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
                this.hand.splice(index, 1);
                this.discard.push(card);
                if (this.hand.length === 1) this.drawCard();
                this.lastFled = false;
                this.consecutiveFlees = 0;
            } else if (this.selectedAttack === 'shield') {
                if (!this.shield) {
                    alert('No shield equipped!');
                    return;
                }
                const effectiveShieldValue = this.shield.value + attackBonus;
                if (effectiveShieldValue >= card.value) {
                    this.hand.splice(index, 1);
                    this.shield.rank = card.rank;
                    this.shield.value = card.value;
                    this.absorbedMonster = card;
                    if (this.hand.length === 1) this.drawCard();
                    this.lastFled = false;
                } else {
                    if (!this.shieldTrained) {
                        const damage = card.value - effectiveShieldValue;
                        this.health -= damage;
                        this.shield.rank = card.rank;
                        this.shield.value = card.value;
                        this.shieldTrained = true;
                        this.hand.splice(index, 1);
                        this.absorbedMonster = card;
                        if (this.hand.length === 1) this.drawCard();
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
            } else if (card.type === 'sword') {
                if (card.rank === 'A') {
                    alert('You found the legendary sword!');
                }
                this.sword = card;
                this.hand.splice(index, 1);
                if (this.hand.length === 1) this.drawCard();
            } else if (card.type === 'potion') {
                this.health = Math.min(20, this.health + card.value);
                this.discard.push(card);
            }
            this.lastFled = false;
            this.hand.splice(index, 1);
            if (this.hand.length === 1) this.drawCard();
        }
        this.updateDisplay();
        this.checkGameOver();
    }

    flee() {
        if (this.lastFled) {
            alert('Cannot flee consecutively!');
            return;
        }
        if (this.hand.length !== 4) {
            alert('Can only flee with a full room (4 cards)!');
            return;
        }
        // Move all cards in hand to bottom of deck
        while (this.hand.length > 0) {
            this.deck.unshift(this.hand.pop());
        }
        // Draw 4 new cards
        this.drawCard();
        this.lastFled = true;
        this.updateDisplay();
        this.checkGameOver();
    }

    checkGameOver() {
        if (this.health <= 0) {
            alert('Game Over! You died.');
            location.reload();
        } else if (this.deck.length === 0 && this.hand.filter(c => c.type === 'monster').length === 0) {
            alert('You win!');
            location.reload();
        }
    }

    reset() {
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
        this.updateDisplay();
        this.drawCard();
    }

    updateDisplay() {
        document.getElementById('health').textContent = `Health: ${this.health}`;
        document.getElementById('deck').textContent = `Deck: ${this.deck.length} cards`;

        const handDiv = document.getElementById('hand');
        handDiv.innerHTML = '';
        this.hand.forEach((card, index) => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.innerHTML = card.getHTML();
            cardDiv.onclick = () => this.playCard(index);
            handDiv.appendChild(cardDiv);
        });

        const shieldDiv = document.getElementById('shield');
        shieldDiv.innerHTML = '';
        if (this.shield) {
            const shieldCard = document.createElement('div');
            shieldCard.className = 'card';
            shieldCard.innerHTML = this.shield.getHTML();
            shieldDiv.appendChild(shieldCard);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'card';
            placeholder.style.visibility = 'hidden';
            placeholder.innerHTML = '&nbsp;';
            shieldDiv.appendChild(placeholder);
        }
        if (this.absorbedMonster) {
            const monsterCard = document.createElement('div');
            monsterCard.className = 'card';
            monsterCard.innerHTML = this.absorbedMonster.getHTML();
            shieldDiv.appendChild(monsterCard);
        }

        const swordDiv = document.getElementById('sword');
        swordDiv.innerHTML = '';
        if (this.sword) {
            const swordCard = document.createElement('div');
            swordCard.className = 'card';
            swordCard.innerHTML = this.sword.getHTML();
            swordDiv.appendChild(swordCard);
        } else {
            // Optional: Placeholder for sword if you want it to take up space
            swordDiv.innerHTML = '<div class="card" style="visibility:hidden">&nbsp;</div>';
        }

        const discardDiv = document.getElementById('discard');
        discardDiv.innerHTML = '';
        this.discard.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            cardDiv.innerHTML = card.getHTML();
            discardDiv.appendChild(cardDiv);
        });

        // Update button highlights
        document.getElementById('quickAttack').classList.toggle('selected', this.selectedAttack === 'quick');
        document.getElementById('attack').classList.toggle('selected', this.selectedAttack === 'shield');

        // Disable flee button if cannot flee
        document.getElementById('flee').disabled = this.lastFled || this.hand.length !== 4;
    }
}

const game = new Game();

document.getElementById('quickAttack').onclick = () => game.selectQuickAttack();
document.getElementById('attack').onclick = () => game.selectShieldAttack();
document.getElementById('flee').onclick = () => game.flee();