const header = document.querySelector('.header');
const deckViewer = document.querySelector('.deckViewer');
const cardviewer = document.querySelector('.cardViewer');
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

deckViewer.decks = {}

deckViewer.handleClick = function (event) {
	// depending on where you click we will do things
	const el = event.target

	console.log(el)

	// here the user can
	
	// expand or contract menu	
	
	body.classList.toggle('minimize');
	
	// select a deck to view / practice / edit / download
	
	// upload / link a deck

}

deckViewer.addDeck = function (deckToBeAdded) {
	// this function absorbs a deck of cards of the appropriate format
	let newDeck = document.createElement('a')
	newDeck.innerText = deckToBeAdded[0].tags[0]
	newDeck.classList.add("deck")

	this.appendChild(newDeck)
	
	// validates structure
	// adds to the decks object
	// and displays the deck in the deck menu as an icon





}

deckViewer.addEventListener('click', deckViewer.handleClick);

// load first deck
deckViewer.addDeck(firstDeck)
deckViewer.addDeck(secondDeck)