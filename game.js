// Scoundrel Game Logic

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.value = this.getValue();
        this.type = this.getType();
    }

    getValue() {
        if (this.rank === 'A') return 1;
        if (this.rank === 'J') return 11;
        if (this.rank === 'Q') return 12;
        if (this.rank === 'K') return 13;
        return parseInt(this.rank);
    }

    getType() {
        if (this.suit === '♠' || this.suit === '♣') return 'monster';
        if (this.suit === '♦') return 'weapon';
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
        this.weapons = null;
        this.selectedAttack = null;
        this.discard = [];
        this.weaponTrained = false;
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

    selectBareAttack() {
        this.selectedAttack = 'bare';
        this.updateDisplay();
    }

    selectWeaponAttack() {
        this.selectedAttack = 'weapon';
        this.updateDisplay();
    }

    attack() {
        if (!this.weapons) {
            alert('No weapon equipped!');
            return;
        }
        const monsterIndex = this.hand.findIndex(c => c.type === 'monster');
        if (monsterIndex !== -1) {
            if (this.weapons.value >= this.hand[monsterIndex].value) {
                this.hand.splice(monsterIndex, 1);
                this.weapons = null;
                if (this.hand.length === 1) this.drawCard();
            } else {
                alert('Weapon too weak!');
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
            if (this.selectedAttack === 'bare') {
                this.health -= card.value;
                this.hand.splice(index, 1);
                this.discard.push(card);
                if (this.hand.length === 1) this.drawCard();
                this.lastFled = false;
                this.consecutiveFlees = 0;
            } else if (this.selectedAttack === 'weapon') {
                if (!this.weapons) {
                    alert('No weapon equipped!');
                    return;
                }
                if (this.weapons.value >= card.value) {
                    this.hand.splice(index, 1);
                    this.weapons.rank = card.rank;
                    this.weapons.value = card.value;
                    this.absorbedMonster = card;
                    if (this.hand.length === 1) this.drawCard();
                    this.lastFled = false;
                } else {
                    if (!this.weaponTrained) {
                        const damage = card.value - this.weapons.value;
                        this.health -= damage;
                        this.weapons.rank = card.rank;
                        this.weapons.value = card.value;
                        this.weaponTrained = true;
                        this.hand.splice(index, 1);
                        this.absorbedMonster = card;
                        if (this.hand.length === 1) this.drawCard();
                        this.lastFled = false;
                        this.consecutiveFlees = 0;
                    } else {
                        alert('Weapon too weak!');
                        return;
                    }
                }
            }
            this.selectedAttack = null; // reset after use
        } else {
            if (card.type === 'weapon') {
                if (this.weapons) {
                    this.discard.push(this.weapons);
                    if (this.absorbedMonster) this.discard.push(this.absorbedMonster);
                }
                this.weapons = card;
                this.weaponTrained = false;
                this.absorbedMonster = null;
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
            this.reset();
        } else if (this.deck.length === 0 && this.hand.filter(c => c.type === 'monster').length === 0) {
            alert('You win!');
            this.reset();
        }
    }

    reset() {
        this.deck = this.createDeck();
        this.shuffle(this.deck);
        this.health = 20;
        this.hand = [];
        this.weapons = null;
        this.selectedAttack = null;
        this.discard = [];
        this.weaponTrained = false;
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

        const weaponsDiv = document.getElementById('weapons');
        weaponsDiv.innerHTML = '';
        if (this.weapons) {
            const weaponCard = document.createElement('div');
            weaponCard.className = 'card';
            weaponCard.innerHTML = this.weapons.getHTML();
            weaponsDiv.appendChild(weaponCard);
        } else {
            const placeholder = document.createElement('div');
            placeholder.className = 'card';
            placeholder.style.visibility = 'hidden';
            placeholder.innerHTML = '&nbsp;';
            weaponsDiv.appendChild(placeholder);
        }
        if (this.absorbedMonster) {
            const monsterCard = document.createElement('div');
            monsterCard.className = 'card';
            monsterCard.innerHTML = this.absorbedMonster.getHTML();
            weaponsDiv.appendChild(monsterCard);
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
        document.getElementById('bareAttack').classList.toggle('selected', this.selectedAttack === 'bare');
        document.getElementById('attack').classList.toggle('selected', this.selectedAttack === 'weapon');

        // Disable flee button if cannot flee
        document.getElementById('flee').disabled = this.lastFled || this.hand.length !== 4;
    }
}

const game = new Game();

document.getElementById('bareAttack').onclick = () => game.selectBareAttack();
document.getElementById('attack').onclick = () => game.selectWeaponAttack();
document.getElementById('flee').onclick = () => game.flee();