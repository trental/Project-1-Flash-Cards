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

cardViewer.presentCards = function (deck) {
	cardTester = cardViewer.querySelector('.cardTester');
	displayFront = cardTester.querySelector('.testCardFront');
	displayBack = cardTester.querySelector('.testCardBack');
	cardTester.classList.remove('hidden');

	let currentCard; // current card shown in tester screen to be scored

	cardTester.showNextCard = function () {
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
		}
		// weight scores 3, 4, 5 and five together
		// default weights are 3 => 3, 4 => 2, 5 => 1, with an option not to show 5s
	};

	cardTester.scoreCurrentCard = function (chosenScore) {
		console.table(currentCard);
		// update card score
		currentCard.score = chosenScore;

		// push card back n deep in its own category
		deck.pushBackCard(currentCard, 2);
		console.table(deck.cards);

		// do another
		// cardTester.showNextCard(deck);
	};

	cardTester.handleClick = function (event) {
		// depending on where you click we will do things
		event.preventDefault();
		const el = event.target;

		// click one of the buttons to grade your card
		if (el.classList.contains('testResponseButton')) {
			cardTester.scoreCurrentCard(parseInt(el.innerText, 10));
		}
	};

	cardTester.addEventListener('click', cardTester.handleClick);
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
	let newDeck = document.createElement('a');
	newDeck.innerText = deckToBeAdded[0].tags[0];
	newDeck.classList.add('deck');

	newDeck.cards = [];

	deckToBeAdded.forEach((card) => newDeck.cards.push(card));

	this.appendChild(newDeck);

	// validates structure

	// and displays the deck in the deck menu as an icon

	newDeck.cardsWithScore = function (searchScore) {
		// function to have deck return cards with score
		// console.log(this.cards);
		return this.cards.filter((card) => card.score === searchScore);
	};

	newDeck.pushBackCard = function (cardToPush, howFarBack) {
		// reorganize cards in deck
		console.log(cardToPush, howFarBack + ' cards back');
		console.log(this.cards.indexOf(cardToPush));
	};
};

deckViewer.addEventListener('click', deckViewer.handleClick);

// load first decks
deckViewer.addDeck(firstDeck);
deckViewer.addDeck(secondDeck);
