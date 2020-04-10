let testDeck = [
	{
		front: 'Alabama',
		back: 'Montgomery',
		tags: ['State Capitals'],
		score: 1,
	},
	{
		front: 'Alaska',
		back: 'Juneau',
		tags: ['State Capitals'],
		score: 1,
	},
];

class DeckDisplay {
	constructor() {
		this.element = document.querySelector('.deckDisplay');
		this.deckTests = [];
	}

	hideAll() {
		let object = this.element.firstElementChild;

		while (object) {
			object.classList.add('hidden');
			object = object.nextElementSibling;
		}
	}

	addObject(object) {
		this.element.appendChild(object);
		if (object.classList.contains('deckTest')) {
			this.deckTests.push(object);
		}
	}
}

class DeckBar {
	constructor() {
		this.element = document.querySelector('.deckBar');
	}

	addDeck(object) {
		this.element.appendChild(object);
	}

	// onKeyup(event) {
	// 	console.log(event.code);
	// }
}

class Deck {
	constructor(title, id) {
		this.title = title;
		this.cards = [];
		this.showQuestion = true;
		this.currentCard = 0;

		// icon that shows in deckBar
		const iconTemplate = document.querySelector('#iconTemplate');
		this.icon = iconTemplate.cloneNode(true);
		this.icon.classList.remove('hidden');
		this.icon.innerText = title;
		this.icon.dataset.id = id;
		this.icon.id = 'deck' + id;
		this.icon.onclick = this.onClickIcon.bind(this);

		// view div that shows in deckDisplay
		const viewTemplate = document.querySelector('#viewTemplate');
		this.view = viewTemplate.cloneNode(true);
		this.view.onclick = this.onClickView.bind(this);
		this.view.id = 'view' + id;
		this.view.querySelector('h1').innerText = title;
		this.viewToggleFront = this.view.querySelector('.toggleFront');
		this.viewToggleBack = this.view.querySelector('.toggleBack');

		// test div that shows in deckDisplay
		const testTemplate = document.querySelector('#testTemplate');
		this.test = testTemplate.cloneNode(true);
		this.test.onclick = this.onClickTest.bind(this);
		this.test.id = 'test' + id;
		this.testFront = this.test.querySelector('.testCardFront');
		this.testFrontSecret = this.test.querySelector('.testCardSecretFront');
		this.testBack = this.test.querySelector('.testCardBack');
		this.testBackSecret = this.test.querySelector('.testCardSecretBack');
	}

	addCard(front, back, score, tags) {
		const newCard = new Card(front, back, score, tags);
		this.cards.push(newCard);
	}

	onClickIcon(event) {
		const el = event.target;
		deckDisplay.hideAll();
		this.refreshViewStats();
		this.view.classList.remove('hidden');
	}

	onClickView(event) {
		const el = event.target;
		if (el.classList.contains('learnButton')) {
			deckDisplay.hideAll();
			this.test.classList.remove('hidden');
			this.showNextCard();
		} else if (el.classList.contains('toggleFront')) {
			this.viewToggleFront.classList.add('toggleShowSelected');
			this.viewToggleBack.classList.remove('toggleShowSelected');
			this.showQuestion = true;
		} else if (el.classList.contains('toggleBack')) {
			this.viewToggleFront.classList.remove('toggleShowSelected');
			this.viewToggleBack.classList.add('toggleShowSelected');
			this.showQuestion = false;
		}
	}

	onClickTest(event) {
		// depending on where you click we will do things
		event.preventDefault();
		const el = event.target;

		// click one of the buttons to grade your card
		if (el.classList.contains('testResponseButton')) {
			this.scoreCurrentCard(parseInt(el.innerText, 10));
		} else if (el.classList.contains('testRevealButton')) {
			this.revealCurrentCard(parseInt(el.innerText, 10));
		}
	}

	onKeyup(event) {
		if (!this.test.classList.contains('hidden')) {
			let keyPressed = event.code;
			let numPressed = keyPressed.charAt(keyPressed.length - 1);

			if (this.getTestButtons() == 'reveal') {
				this.revealCurrentCard();
			} else if (['1', '2', '3', '4', '5'].includes(numPressed)) {
				// console.log(numPressed);
				this.scoreCurrentCard(parseInt(numPressed, 10));
			}
		}
	}

	cardsWithScore(searchScore) {
		// function to have deck return cards with score
		return this.cards.filter((card) => card.score === searchScore);
	}

	refreshViewStats() {
		// counts
		const count = [];
		let countTotal = 0;
		for (let i = 1; i <= 5; i++) {
			const currentCount = this.cardsWithScore(i).length;
			count.push(currentCount);
			countTotal += currentCount;
		}
		const viewCounts = this.view.querySelectorAll('.viewCounts');
		for (let i = 0; i < viewCounts.length; i++) {
			viewCounts[i].innerText = i + 1 + ': ' + count[i];
		}
		viewCounts[viewCounts.length - 1].innerText = 'Total: ' + countTotal;
		// tags
		let tags = [];
		this.cards.forEach((card) => {
			card.tags.forEach((tag) => {
				if (!tags.includes(tag)) {
					tags.push(tag);
				}
			});
		});
		this.view.querySelector('.listOfTags').innerText = tags.join(', ');
	}

	setTestButtons(direction = 'reveal') {
		// set to reveal or score
		if (direction === 'reveal') {
			this.test.querySelector('.testResponseGrades').classList.remove('hidden');
			this.test.querySelector('.testRevealButton').classList.add('hidden');
		} else {
			this.test.querySelector('.testResponseGrades').classList.add('hidden');
			this.test.querySelector('.testRevealButton').classList.remove('hidden');
		}

		if (direction === 'reveal') {
			if (this.showQuestion) {
				this.testBack.classList.remove('hidden');
				this.testBackSecret.classList.add('hidden');
				this.testFront.classList.remove('hidden');
				this.testFrontSecret.classList.add('hidden');
			} else {
				this.testBack.classList.remove('hidden');
				this.testBackSecret.classList.add('hidden');
				this.testFront.classList.remove('hidden');
				this.testFrontSecret.classList.add('hidden');
			}
		} else {
			if (this.showQuestion) {
				this.testBack.classList.add('hidden');
				this.testBackSecret.classList.remove('hidden');
				this.testFront.classList.remove('hidden');
				this.testFrontSecret.classList.add('hidden');
			} else {
				this.testBack.classList.remove('hidden');
				this.testBackSecret.classList.add('hidden');
				this.testFront.classList.add('hidden');
				this.testFrontSecret.classList.remove('hidden');
			}
		}
	}

	getTestButtons() {
		// return reveal or score

		if (
			this.test.querySelector('.testRevealButton').classList.contains('hidden')
		) {
			return 'score';
		} else {
			return 'reveal';
		}
	}

	showNextCard() {
		// algorithm here to determine which card to show
		// console.table(newDeck.cards);
		// if any score 1, show them all first before moving on to 2
		if (this.cardsWithScore(1).length > 0) {
			this.currentCard = this.cardsWithScore(1)[0];
		}
		// if any score 2, show all before 3s
		else if (this.cardsWithScore(2).length > 0) {
			this.currentCard = this.cardsWithScore(2)[0];
		} else {
			// weight scores 3, 4, 5 and five together
			// default weights are 3 => 10, 4 => 3, 5 => 1, with an option not to show 5s

			let include3;
			let include4;
			let include5;

			if (this.cardsWithScore(3).length > 0) {
				include3 = 10;
			} else {
				include3 = 0;
			}

			if (this.cardsWithScore(4).length > 0) {
				include4 = 3;
			} else {
				include4 = 0;
			}

			if (this.cardsWithScore(5).length > 0) {
				include5 = 1;
			} else {
				include5 = 0;
			}

			let score3 = include3 / (include3 + include4 + include5);
			let score4 = include4 / (include3 + include4 + include5);
			let randomDraw = Math.random();
			let drawScore;

			if (randomDraw <= score3 && this.cardsWithScore(3).length > 0) {
				drawScore = 3;
			} else if (
				randomDraw <= score3 + score4 &&
				this.cardsWithScore(4).length > 0
			) {
				drawScore = 4;
			} else {
				drawScore = 5;
			}

			// show "completed" modal if all cards have score 5
			if (this.cardsWithScore(5).length == this.cards.length) {
				modal.classList.remove('hidden');
				// alert('hi');
			} else {
				currentCard = this.cardsWithScore(drawScore)[0];
			}
		}

		this.testFront.innerHTML = this.currentCard.front;
		this.testBack.innerHTML = this.currentCard.back;

		// hide answer and scoring buttons
		this.setTestButtons('score');
	}

	scoreCurrentCard(chosenScore) {
		// console.table(currentCard);
		// update card score
		this.currentCard.score = chosenScore;

		// push card back n deep in its own category
		if (chosenScore == 1) {
			this.pushBackCard(this.currentCard, 5);
		} else if (chosenScore == 2) {
			this.pushBackCard(this.currentCard, 5);
		} else if (chosenScore == 3) {
			this.pushBackCard(this.currentCard, 5);
		} else if (chosenScore == 4) {
			this.pushBackCard(this.currentCard, 5);
		} else {
			this.pushBackCard(this.currentCard, this.cards.length);
		}

		// do another
		this.showNextCard();
	}

	// reveal answer and scoring buttons
	revealCurrentCard() {
		this.setTestButtons('reveal');
	}

	pushBackCard(cardToPush, howFarBack) {
		// reorganize cards in deck by pushing back the required amt in cards of the same score

		let deckSize = this.cards.length;
		let i = 0; // track how many move backs have happened
		let j = this.cards.indexOf(cardToPush);
		let tempCard;

		while (i < howFarBack && j <= deckSize - 2) {
			tempCard = this.cards[j + 1];
			this.cards[j + 1] = cardToPush;
			this.cards[j] = tempCard;
			i++;
			j = this.cards.indexOf(cardToPush);
		}
	}
}

class Card {
	constructor(front, back, score, tags) {
		this.front = front;
		this.back = back;
		this.score = score;
		this.tags = tags;
	}
}

const modal = document.querySelector('#modal');

////////////////////////////////////////////////
//
// modal Functions
//
////////////////////////////////////////////////

modal.addEventListener('click', function (event) {
	event.preventDefault();
	if (event.target.id === 'close') {
		modal.classList.add('hidden');
	}
});

let decks = [];

decks[0] = new Deck('State Capitals', 0);
decks[1] = new Deck('Test Deck', 1);
decks[2] = new Deck('Test2', 2);

const deckBar = new DeckBar();
const deckDisplay = new DeckDisplay();

document.querySelector('body').addEventListener('keyup', (event) => {
	decks.forEach((deck) => {
		deck.onKeyup(event);
	});
});

uscapitals.forEach((item) =>
	decks[0].addCard(item.front, item.back, item.score, item.tags)
);
uscapitals.forEach((item) =>
	decks[1].addCard(item.front, item.back, item.score, item.tags)
);
testDeck.forEach((item) =>
	decks[2].addCard(item.front, item.back, item.score, item.tags)
);

deckBar.addDeck(decks[0].icon);
deckBar.addDeck(decks[1].icon);
deckBar.addDeck(decks[2].icon);

deckDisplay.addObject(decks[0].view);
deckDisplay.addObject(decks[0].test);
deckDisplay.addObject(decks[1].view);
deckDisplay.addObject(decks[1].test);
deckDisplay.addObject(decks[2].view);
deckDisplay.addObject(decks[2].test);

// deckDisplay.appendChild(deck1.view);
// deckDisplay.appendChild(deck1.test);
