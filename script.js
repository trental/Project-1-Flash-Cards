const header = document.querySelector('.header');
const deckViewer = document.querySelector('.deckViewer');
const cardViewer = document.querySelector('.cardViewer');
const body = document.querySelector('body');

let firstDeck = [
	{
		front: 'Q1',
		back: 'A1',
		tags: ['first deck'],
		score: 1,
	},
	{
		front: 'Q2',
		back: 'A2',
		tags: ['first deck'],
		score: 1,
	},
	{
		front: 'Q3',
		back: 'A3',
		tags: ['first deck'],
		score: 1,
	},
	{
		front: 'Q4',
		back: 'A4',
		tags: ['first deck'],
		score: 1,
	},
	{
		front: 'Q5',
		back: 'A5',
		tags: ['first deck'],
		score: 1,
	},
];

let secondDeck = [
	{
		front: 'first front',
		back: 'first back',
		tags: ['second deck'],
		score: 1,
	},
	{
		front: 'second front',
		back: 'second back',
		tags: ['second deck'],
		score: 2,
	},
];

////////////////////////////////////////////////
//
// cardViewer Functions
//
////////////////////////////////////////////////

cardViewer.hideAllCardTesters = function () {
	let cardTesters = [...this.querySelectorAll('.cardTester')]; // convert to node list

	cardTesters.forEach((cardTester) => {
		cardTester.classList.add('hidden');
	});
};

cardViewer.presentCards = function (deck) {
	this.hideAllCardTesters();
	//let cardTesters = cardViewer.querySelectorAll('.cardTester');
	let cardTester = cardViewer.querySelector('#tester' + deck.dataset.id);
	cardTester.classList.remove('hidden');

	cardTester.showNextCard(deck);
};

////////////////////////////////////////////////
//
// deckViewer Functions
//
////////////////////////////////////////////////

deckViewer.handleClick = function (event) {
	// depending on where you click we will do things
	event.preventDefault();
	const el = event.target;

	// here the user can

	// select a deck to view / practice / edit / download
	if (el.classList.contains('deck')) {
		// console.log(el.cards);
		cardViewer.presentCards(el);
	} else {
		// expand or contract menu
		body.classList.toggle('minimize');
	}

	// upload / link a deck
};

deckViewer.addDeck = function (deckToBeAdded) {
	// this function absorbs a deck of cards of the appropriate format
	// and creates a new anchor element with all of the deck functions attached

	let newId = deckViewer.querySelectorAll('.deck').length;

	let newDeck = document.createElement('a');
	newDeck.innerText = deckToBeAdded[0].tags[0];
	newDeck.classList.add('deck');

	// give id to the deck in the deck viewer
	newDeck.dataset.id = newId;

	newDeck.cards = [];

	deckToBeAdded.forEach((card) => newDeck.cards.push(card));

	this.appendChild(newDeck);

	// also build a new cardTester element and store it in the cardViewer
	// this allows the user to switch back and forth between decks
	let newCardTester = document.createElement('div');
	newCardTester.classList.add('cardTester');
	newCardTester.classList.add('hidden');
	// give matching id to the card tester we are adding
	newCardTester.id = 'tester' + newId;

	let newTestCardFront = document.createElement('div');
	newTestCardFront.classList.add('testCardFront');
	newCardTester.appendChild(newTestCardFront);

	let newTestCardBack = document.createElement('div');
	newTestCardBack.classList.add('testCardBack');
	newCardTester.appendChild(newTestCardBack);

	let newTestResponseContainer = document.createElement('div');
	newTestResponseContainer.classList.add('testResponseContainer');

	for (let i = 1; i <= 5; i++) {
		let newTestResponseButton = document.createElement('a');
		newTestResponseButton.classList.add('testResponseButton');
		newTestResponseButton.innerText = i;
		newTestResponseContainer.appendChild(newTestResponseButton);
	}

	newCardTester.handleClick = function (event) {
		// depending on where you click we will do things
		event.preventDefault();
		console.log(event);
		const el = event.target;

		// click one of the buttons to grade your card
		if (el.classList.contains('testResponseButton')) {
			newCardTester.scoreCurrentCard(parseInt(el.innerText, 10));
		}
	};

	newCardTester.appendChild(newTestResponseContainer);
	newCardTester.addEventListener('click', newCardTester.handleClick);
	cardViewer.appendChild(newCardTester);

	let currentCard; // current card shown in tester screen to be scored
	let displayFront = newCardTester.querySelector('.testCardFront');
	let displayBack = newCardTester.querySelector('.testCardBack');

	newCardTester.showNextCard = function (deck) {
		// algorithm here to determine which card to show
		console.table(deck.cards);
		// if any score 1, show them all first before moving on to 2
		if (deck.cardsWithScore(1).length > 0) {
			currentCard = deck.cardsWithScore(1)[0];
			displayFront.innerHTML = currentCard.front;
			displayBack.innerHTML = currentCard.back;
		}
		// if any score 2, show all before 3s
		else if (deck.cardsWithScore(2).length > 0) {
			currentCard = deck.cardsWithScore(2)[0];
			displayFront.innerHTML = currentCard.front;
			displayBack.innerHTML = currentCard.back;
		} else {
			// weight scores 3, 4, 5 and five together
			// default weights are 3 => 3, 4 => 2, 5 => 1, with an option not to show 5s
			let score3 = 3 / 6;
			let score4 = 2 / 6;
			let score5 = 1 / 6;
			let randomDraw = Math.random();
			let drawScore;

			if (randomDraw <= score3 && deck.cardsWithScore(3).length > 0) {
				drawScore = 3;
			} else if (
				randomDraw <= score3 + score4 &&
				deck.cardsWithScore(4).length > 0
			) {
				drawScore = 4;
			} else {
				drawScore = 5;
			}

			console.log(randomDraw + ' ' + drawScore);

			currentCard = deck.cardsWithScore(drawScore)[0];
			displayFront.innerHTML = currentCard.front;
			displayBack.innerHTML = currentCard.back;
		}
	};

	newCardTester.scoreCurrentCard = function (chosenScore) {
		// console.table(currentCard);
		// update card score
		currentCard.score = chosenScore;

		// push card back n deep in its own category
		newDeck.pushBackCard(currentCard, 2);

		// do another
		newCardTester.showNextCard(newDeck);
	};

	// validates structure

	// and displays the deck in the deck menu as an icon

	newDeck.cardsWithScore = function (searchScore) {
		// function to have deck return cards with score
		// console.log(this.cards);
		return this.cards.filter((card) => card.score === searchScore);
	};

	newDeck.pushBackCard = function (cardToPush, howFarBack) {
		// reorganize cards in deck by pushing back the required amt in cards of the same score
		console.log(cardToPush, howFarBack + ' cards back');

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
	};
};

deckViewer.addEventListener('click', deckViewer.handleClick);

// load first decks
deckViewer.addDeck(firstDeck);
deckViewer.addDeck(secondDeck);
