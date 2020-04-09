const header = document.querySelector('.header');
const deckViewer = document.querySelector('.deckViewer');
const cardViewer = document.querySelector('.cardViewer');
const body = document.querySelector('body');

let firstDeck = [{
	front: "first front",
	back: "first back",
	tags: ["first deck"],
	score: 1
},{
	front: "second front",
	back: "second back",
	tags: ["first deck"],
	score: 1
}]

let secondDeck = [{
	front: "first front",
	back: "first back",
	tags: ["second deck"],
	score: 1
},{
	front: "second front",
	back: "second back",
	tags: ["second deck"],
	score: 1
}]

cardViewer.presentCards = function (deck) {
	cardTester = cardViewer.querySelector('.cardTester')
	cardTester.classList.remove("hidden")
}

deckViewer.handleClick = function (event) {
	// depending on where you click we will do things
	const el = event.target

	// here the user can
	
	

	
	// select a deck to view / practice / edit / download
	if (el.classList.contains("deck")) {
		console.log(el.cards)
		cardViewer.presentCards(el)
	} else {
	// expand or contract menu	
		body.classList.toggle('minimize');
	}
	
	// upload / link a deck

}

deckViewer.addDeck = function (deckToBeAdded) {
	// this function absorbs a deck of cards of the appropriate format
	let newDeck = document.createElement('a')
	newDeck.innerText = deckToBeAdded[0].tags[0]
	newDeck.classList.add("deck")

	newDeck.cards = [];

	deckToBeAdded.forEach((card) => newDeck.cards.push(card));

	this.appendChild(newDeck)
	
	// validates structure
	// and displays the deck in the deck menu as an icon

}

deckViewer.addEventListener('click', deckViewer.handleClick);

// load first deck
deckViewer.addDeck(firstDeck)
deckViewer.addDeck(secondDeck)