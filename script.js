const header = document.querySelector('.header');
const deckViewer = document.querySelector('.deckViewer');
const cardViewer = document.querySelector('.cardViewer');
const body = document.querySelector('body');

let firstDeck = [
	{
		front: 'first front',
		back: 'first back',
		tags: ['first deck'],
		score: 1,
	},
	{
		front: 'second front',
		back: 'second back',
		tags: ['first deck'],
		score: 2,
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

	cardTester.showNextCard = function (deck) {
		// algorithm here to determine which card to show
		let selectedCard;

		// if any score 1, show them all first before moving on to 2
		if (deck.cardsWithScore(1)) {
			selectedCard = deck.cardsWithScore(1)[0];
			displayFront.innerHTML = selectedCard.front;
			displayBack.innerHTML = selectedCard.back;
		}

		// if any score 2, show all before 3s
		if (deck.cardsWithScore(2)) {
			selectedCard = deck.cardsWithScore(2)[0];
			displayFront.innerHTML = selectedCard.front;
			displayBack.innerHTML = selectedCard.back;
		}
		// weight scores 3, 4, 5 and five together
		// default weights are 3 => 3, 4 => 2, 5 => 1, with an option not to show 5s
	};

	cardTester.handleClick = function (event) {
		// depending on where you click we will do things
		event.preventDefault();
		const el = event.target;

		// click one of the buttons to grade your card
		if (el.classList.contains('testResponseButton')) {
			console.log(el.innerText);
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
	let newDeck = document.createElement('a');
	newDeck.innerText = deckToBeAdded[0].tags[0];
	newDeck.classList.add('deck');

	newDeck.cards = [];

	deckToBeAdded.forEach((card) => newDeck.cards.push(card));

	this.appendChild(newDeck);

	// validates structure

	// and displays the deck in the deck menu as an icon

	// function to have deck return cards with score

	newDeck.cardsWithScore = function (searchScore) {
		console.log(this.cards);
		return this.cards.filter((card) => card.score === searchScore);
	};
};

deckViewer.addEventListener('click', deckViewer.handleClick);

// load first decks
deckViewer.addDeck(firstDeck);
deckViewer.addDeck(secondDeck);
