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
	constructor(book) {
		this.element = document.querySelector('.deckDisplay');

		book.decks.forEach((deck) => this.addObject(deck.test));
		book.decks.forEach((deck) => this.addObject(deck.view));
		book.decks.forEach((deck) => this.addObject(deck.edit));

		// deckDisplay.addObject(deck.test);
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
	}
}

class DeckBar {
	constructor(book) {
		this.element = document.querySelector('.deckBar');

		book.decks.forEach((deck) => {
			this.addDeck(deck.icon);
		});
	}

	addDeck(object) {
		this.element.appendChild(object);
	}
}

class Deck {
	// constructor(id, title, shuffle, showQuestion, cards) {
	constructor(id, newDeck) {
		console.log(newDeck);
		this.title = newDeck.detail.title;
		this.shuffle = newDeck.detail.shuffle;
		this.showQuestion = newDeck.detail.showQuestion;
		this.cards = newDeck.cards;
		this.currentCard = 0;

		// icon that shows in deckBar
		const iconTemplate = document.querySelector('#iconTemplate');
		this.icon = iconTemplate.cloneNode(true);
		this.icon.classList.remove('hidden');
		this.icon.innerText = this.title;
		this.icon.dataset.id = id;
		this.icon.id = 'deck' + id;
		this.icon.onclick = this.onClickIcon.bind(this);

		// view div that shows in deckDisplay
		const viewTemplate = document.querySelector('#viewTemplate');
		this.view = viewTemplate.cloneNode(true);
		this.view.onclick = this.onClickView.bind(this);
		this.view.id = 'view' + id;
		this.view.querySelector('h1').innerText = this.title;
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

		// edit div that lets you reset scores or adjusting scoring preferences
		const editTemplate = document.querySelector('#editTemplate');
		this.edit = editTemplate.cloneNode(true);
		this.edit.onclick = this.onClickEdit.bind(this);
		this.edit.id = 'edit' + id;
		this.edit.querySelector('h1').innerText = this.title;
		this.editShuffleButtons = [];
		for (let i = 1; i <= 5; i++) {
			this.editShuffleButtons.push([]);
			this.editShuffleButtons[i - 1].push(
				this.edit.querySelector(`.shuffle-1${i}`)
			);
			this.editShuffleButtons[i - 1].push(
				this.edit.querySelector(`.shuffleN${i}`)
			);
			this.editShuffleButtons[i - 1].push(
				this.edit.querySelector(`.shuffle0${i}`)
			);
		}
		this.refreshViewStats();
		this.refreshEdit();
	}

	addCard(front, back, score) {
		const newCard = new Card(front, back, score);
		this.cards.push(newCard);
	}

	dumpCards() {
		// let dumpDeck = [];
		// this.cards.forEach((card) =>
		// 	dumpDeck.push({
		// 		front: card.front,
		// 		back: card.back,
		// 		tags: card.tags,
		// 		score: card.score,
		// 	})
		// );

		// return dumpDeck;

		return this.cards;
	}

	dumpDeck() {
		let deck = {
			detail: {
				title: this.title,
				shuffle: this.shuffle,
				showQuestion: this.showQuestion,
			},
			cards: this.cards,
		};

		// let dumpDeck = [];
		// this.cards.forEach((card) =>
		// 	dumpDeck.push({
		// 		front: card.front,
		// 		back: card.back,
		// 		tags: card.tags,
		// 		score: card.score,
		// 	})
		// );

		// return dumpDeck;

		return deck;
	}

	resetCards() {
		this.cards.forEach((card) => (card.score = 1));
		storedDecks.storeDeck(this.title, this.dumpCards());
		this.refreshViewStats();
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
			storedDecks.storeDeck(this.title, this.dumpDeck());
		} else if (el.classList.contains('toggleBack')) {
			this.viewToggleFront.classList.remove('toggleShowSelected');
			this.viewToggleBack.classList.add('toggleShowSelected');
			this.showQuestion = false;
			console.log(this.dumpDeck());
			storedDecks.storeDeck(this.title, this.dumpDeck());
		} else if (el.classList.contains('editButton')) {
			// this.resetCards();
			deckDisplay.hideAll();
			this.edit.classList.remove('hidden');
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

	onClickEdit(event) {
		if (event.target.classList.contains('toggleShuffle')) {
			if (event.target.dataset.id == 'edit11') this.shuffle[0] = -1;
			if (event.target.dataset.id == 'edit12')
				this.shuffle[0] = event.target.innerText;
			if (event.target.dataset.id == 'edit13') this.shuffle[0] = 0;

			if (event.target.dataset.id == 'edit21') this.shuffle[1] = -1;
			if (event.target.dataset.id == 'edit22')
				this.shuffle[1] = event.target.innerText;
			if (event.target.dataset.id == 'edit23') this.shuffle[1] = 0;

			if (event.target.dataset.id == 'edit31') this.shuffle[2] = -1;
			if (event.target.dataset.id == 'edit32')
				this.shuffle[2] = event.target.innerText;
			if (event.target.dataset.id == 'edit33') this.shuffle[2] = 0;

			if (event.target.dataset.id == 'edit41') this.shuffle[3] = -1;
			if (event.target.dataset.id == 'edit42')
				this.shuffle[3] = event.target.innerText;
			if (event.target.dataset.id == 'edit43') this.shuffle[3] = 0;

			if (event.target.dataset.id == 'edit51') this.shuffle[4] = -1;
			if (event.target.dataset.id == 'edit52')
				this.shuffle[4] = event.target.innerText;
			if (event.target.dataset.id == 'edit53') this.shuffle[4] = 0;
		} else if (event.target.classList.contains('resetButton')) {
			this.resetCards();
		}
		this.refreshEdit();
	}

	onKeyup(event) {
		if (!this.test.classList.contains('hidden')) {
			let keyPressed = event.code;
			let numPressed = keyPressed.charAt(keyPressed.length - 1);

			if (this.getTestButtons() == 'reveal') {
				this.revealCurrentCard();
			} else if (['1', '2', '3', '4', '5'].includes(numPressed)) {
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

		if (this.showQuestion) {
			this.viewToggleFront.classList.add('toggleShowSelected');
			this.viewToggleBack.classList.remove('toggleShowSelected');
		} else {
			this.viewToggleFront.classList.remove('toggleShowSelected');
			this.viewToggleBack.classList.add('toggleShowSelected');
		}

		// tags
		// let tags = [];
		// this.cards.forEach((card) => {
		// 	card.tags.forEach((tag) => {
		// 		if (!tags.includes(tag)) {
		// 			tags.push(tag);
		// 		}
		// 	});
		// });
		// this.view.querySelector('.listOfTags').innerText = tags.join(', ');
	}

	refreshEdit() {
		for (let i = 0; i <= 4; i++) {
			for (let j = 0; j <= 2; j++) {
				this.editShuffleButtons[i][j].classList.remove('toggleShowSelected');
			}
			if (this.shuffle[i] == -1) {
				this.editShuffleButtons[i][0].classList.add('toggleShowSelected');
			} else if (this.shuffle[i] == 0) {
				this.editShuffleButtons[i][2].classList.add('toggleShowSelected');
			} else {
				this.editShuffleButtons[i][1].classList.add('toggleShowSelected');
			}
		}
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

		storedDecks.storeDeck(this.title, this.dumpDeck());

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
	constructor(front, back, score) {
		this.front = front;
		this.back = back;
		this.score = score;
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

class Storage {
	constructor(initialDeck) {
		this.directory = [];

		if (localStorage.getItem('directory') === null) {
			// console.log(initialDeck);
			this.storeDeck(initialDeck.detail.title, initialDeck);
		} else {
			this.directory = this.getDeck('directory');
		}
	}

	getDirectory() {
		return this.directory;
	}

	storeDeck(key, value) {
		if (!this.directory.includes(key)) {
			this.directory.push(key);
		}

		if (localStorage) {
			localStorage.setItem('directory', JSON.stringify(this.directory));
		} else {
			$.cookies.set('directory', JSON.stringify(this.directory));
		}

		if (localStorage) {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			$.cookies.set(key, JSON.stringify(value));
		}

		return key;
	}

	getDeck(key) {
		if (localStorage) {
			return JSON.parse(localStorage.getItem(key));
		} else {
			return JSON.parse($.cookies.get(key));
		}
	}
}

class Book {
	constructor(initialDecks) {
		this.decks = [];
		this.counter = 0;

		initialDecks.getDirectory().forEach((dir) => {
			this.addDeck(storedDecks.getDeck(dir));
		});
	}

	addDeck(newDeck) {
		this.counter += 1;
		let tempDeck = new Deck(this.counter, newDeck);
		this.decks.push(tempDeck);

		// storedDecks.getDeck(newDeck).forEach((card) => {
		// 	tempDeck.addCard(card.front, card.back, card.score);
		// });
	}

	getDecks() {
		return this.decks;
	}
}

// localStorage.clear();

const storedDecks = new Storage(uscapitals); // pass default deck in case that this is a new run or cleared mem
console.log(storedDecks);
const book = new Book(storedDecks);
const deckBar = new DeckBar(book);
const deckDisplay = new DeckDisplay(book);

document.querySelector('body').addEventListener('keyup', (event) => {
	book.getDecks().forEach((deck) => {
		deck.onKeyup(event);
	});
});
