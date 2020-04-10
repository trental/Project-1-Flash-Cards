const header = document.querySelector('.header');
const deckViewer = document.querySelector('.deckViewer');
const cardViewer = document.querySelector('.cardViewer');
const body = document.querySelector('body');
const modal = document.querySelector('#modal');

let firstDeck = [
	{
		front: 'Alabama',
		back: 'Montgomery',
		tags: ['State Capitals', 'Alabama'],
		score: 1,
	},
	{
		front: 'Alaska',
		back: 'Juneau',
		tags: ['State Capitals'],
		score: 1,
	},
	{
		front: 'Arizona',
		back: 'Phoenix',
		tags: ['State Capitals'],
		score: 1,
	},
	{
		front: 'Arkansas',
		back: 'Little Rock',
		tags: ['State Capitals'],
		score: 1,
	},
	{
		front: 'California',
		back: 'Sacramento',
		tags: ['State Capitals'],
		score: 1,
	},
	{
		front: 'Colorado',
		back: 'Denver',
		tags: ['State Capitals'],
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
// modal Functions
//
////////////////////////////////////////////////

modal.addEventListener('click', function (event) {
	event.preventDefault();
	console.log(event.target.id);
	if (event.target.id === 'close') {
		modal.classList.add('hidden');
	}
});

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

cardViewer.hideAllCardSummaries = function () {
	let deckSummaries = [...this.querySelectorAll('.deckSummary')]; // convert to node list

	deckSummaries.forEach((deckSummary) => {
		deckSummary.classList.add('hidden');
	});
};

cardViewer.presentCards = function (event) {
	cardViewer.hideAllCardTesters();
	cardViewer.hideAllCardSummaries();
	// event.preventDefault();
	console.log(event.target);

	let deckId = event.target.dataset.deckid;
	const deck = deckViewer.querySelector('#deck' + deckId);

	let cardTesters = cardViewer.querySelectorAll('.cardTester');

	let cardTester = cardViewer.querySelector(
		'#tester' + event.target.dataset.deckid
	);
	cardTester.classList.remove('hidden');
	cardTester.showNextCard(deck);
};

cardViewer.presentSummary = function (deck) {
	cardViewer.hideAllCardTesters();
	cardViewer.hideAllCardSummaries();
	//let cardTesters = cardViewer.querySelectorAll('.cardTester');

	let deckSummary = cardViewer.querySelector('#summary' + deck.dataset.id);

	deckSummary.refreshStats();
	deckSummary.classList.remove('hidden');
};

cardViewer.addSummary = function (deck) {
	// clone the template, add id and event listeners and refresh logic
	let summaryTemplate = document.querySelector('#summaryTemplate');
	let newSummary = summaryTemplate.cloneNode(true); 

	newSummary.id = 'summary' + deck.dataset.id;

	newSummary.querySelector('h1').innerText = deck.innerText;

	// function here that refreshes the data on the stats bc
	// as cards are learned or edited we need updates
	newSummary.refreshStats = function () {
		// counts
		let count = [];
		let countTotal = 0;
		for (let i = 1; i <= 5; i++) {
			let currentCount = deck.cardsWithScore(i).length;
			count.push(currentCount);
			countTotal += currentCount;
		}

		let summaryCounts = newSummary.querySelectorAll('.summaryCounts');

		for (let i = 0; i < summaryCounts.length; i++) {
			summaryCounts[i].innerText = i + 1 + ': ' + count[i];
		}
		summaryCounts[summaryCounts.length - 1].innerText = 'Total: ' + countTotal;
	
		// tags
		let tags = [];
		deck.cards.forEach((card) => {
			card.tags.forEach((tag) => {
				if (!tags.includes(tag)){
					tags.push(tag)
				}
			})
		})

		newSummary.querySelector(".listOfTags").innerText = tags.join(", ")
	};

	// assign the learn button to the correct deck tester
	let newLearnButton = newSummary.querySelector('.learnButton');

	newLearnButton.addEventListener('click', cardViewer.presentCards);
	newLearnButton.dataset.deckid = deck.dataset.id;

	// lastly attach the finaly page to the viewer window
	cardViewer.appendChild(newSummary);
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
		cardViewer.presentSummary(el);
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
	newDeck.id = 'deck' + newId;

	newDeck.cards = [];

	deckToBeAdded.forEach((card) => newDeck.cards.push(card));

	this.appendChild(newDeck);

	// also build a deck summary page that can be rotated through to see
	// details about the deck
	cardViewer.addSummary(newDeck);

	// also build a new cardTester element and store it in the cardViewer
	// this allows the user to switch back and forth between decks

	let testerTemplate = document.querySelector('#testerTemplate');
	let newCardTester = testerTemplate.cloneNode(true); // clone the template, add id and event listeners

	// give matching id to the card tester we are adding
	newCardTester.id = 'tester' + newId;

	newCardTester.handleClick = function (event) {
		// depending on where you click we will do things
		event.preventDefault();
		const el = event.target;

		console.log(event.code)

		// click one of the buttons to grade your card
		if (el.classList.contains('testResponseButton')) {
			newCardTester.scoreCurrentCard(parseInt(el.innerText, 10));
		} else if (el.classList.contains('testRevealButton')) {
			newCardTester.revealCurrentCard(parseInt(el.innerText, 10));
		}
	};

	newCardTester.addEventListener('click', newCardTester.handleClick);
	// newCardTester.addEventListener('keyup', newCardTester.handleClick)

	newCardTester.addEventListener('keyup', (e) => {
		console.log(e.code)
	})	

	cardViewer.appendChild(newCardTester);

	let currentCard; // current card shown in tester screen to be scored
	let displayFront = newCardTester.querySelector('.testCardFront');
	let displayBack = newCardTester.querySelector('.testCardBack');

	newDeck.cardsWithScore = function (searchScore) {
		// function to have deck return cards with score
		// console.log(this.cards);
		return this.cards.filter((card) => card.score === searchScore);
	};

	newCardTester.setTestButtons = function (direction = "reveal") {
		return new Promise((resolve) => {
			// set to reveal or score
			if (direction === "reveal") {
				newCardTester.querySelector(".testResponseGrades").classList.remove("hidden")
				newCardTester.querySelector(".testRevealButton").classList.add("hidden")
				newCardTester.querySelector(".testCardBack").classList.remove("hidden")
				newCardTester.querySelector(".testCardSecret").classList.add("hidden")
		
			} else {
				newCardTester.querySelector(".testResponseGrades").classList.add("hidden")
				newCardTester.querySelector(".testRevealButton").classList.remove("hidden")
				newCardTester.querySelector(".testCardBack").classList.add("hidden")
				newCardTester.querySelector(".testCardSecret").classList.remove("hidden")		
		
			}
			resolve();
		})
	}

	newCardTester.showNextCard = function () {
		// algorithm here to determine which card to show
		// console.table(newDeck.cards);
		// if any score 1, show them all first before moving on to 2
		if (newDeck.cardsWithScore(1).length > 0) {
			currentCard = newDeck.cardsWithScore(1)[0];
		}
		// if any score 2, show all before 3s
		else if (newDeck.cardsWithScore(2).length > 0) {
			currentCard = newDeck.cardsWithScore(2)[0];
		} else {
			// weight scores 3, 4, 5 and five together
			// default weights are 3 => 10, 4 => 3, 5 => 1, with an option not to show 5s

			let include3;
			let include4;
			let include5;

			if (newDeck.cardsWithScore(3).length > 0) {
				include3 = 10;
			} else {
				include3 = 0;
			}

			if (newDeck.cardsWithScore(4).length > 0) {
				include4 = 3;
			} else {
				include4 = 0;
			}

			if (newDeck.cardsWithScore(5).length > 0) {
				include5 = 1;
			} else {
				include5 = 0;
			}

			let score3 = include3 / (include3 + include4 + include5);
			let score4 = include4 / (include3 + include4 + include5);
			let randomDraw = Math.random();
			let drawScore;

			if (randomDraw <= score3 && newDeck.cardsWithScore(3).length > 0) {
				drawScore = 3;
			} else if (
				randomDraw <= score3 + score4 &&
				newDeck.cardsWithScore(4).length > 0
			) {
				drawScore = 4;
			} else {
				drawScore = 5;
			}

			console.log(randomDraw + ' ' + drawScore);

			// show "completed" modal if all cards have score 5
			if (newDeck.cardsWithScore(5).length == newDeck.cards.length) {
				modal.classList.remove('hidden');
			}

			currentCard = newDeck.cardsWithScore(drawScore)[0];

		}	

		displayFront.innerHTML = currentCard.front;
		displayBack.innerHTML = currentCard.back;

		// hide answer and scoring buttons
		newCardTester.setTestButtons("score")
		.then(newCardTester.focus());

	};

	newCardTester.scoreCurrentCard = function (chosenScore) {
		// console.table(currentCard);
		// update card score
		currentCard.score = chosenScore;

		// push card back n deep in its own category
		if (chosenScore == 1) {
			newDeck.pushBackCard(currentCard, 5);
		} else if (chosenScore == 2) {
			newDeck.pushBackCard(currentCard, 5);
		} else if (chosenScore == 3) {
			newDeck.pushBackCard(currentCard, 5);
		} else if (chosenScore == 4) {
			newDeck.pushBackCard(currentCard, 5);
		} else {
			newDeck.pushBackCard(currentCard, newDeck.cards.length);
		}

		// do another
		newCardTester.showNextCard(newDeck);
	};

	// reveal answer and scoring buttons
	newCardTester.revealCurrentCard = function () {
		newCardTester.setTestButtons("reveal")
		.then(newCardTester.focus());		
	}

	// validates structure

	// and displays the deck in the deck menu as an icon

	newDeck.pushBackCard = function (cardToPush, howFarBack) {
		// reorganize cards in deck by pushing back the required amt in cards of the same score
		console.log(cardToPush, howFarBack + ' cards back');

		let deckSize = newDeck.cards.length;
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
