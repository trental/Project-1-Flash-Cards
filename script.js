const header = document.querySelector('.header');
const decks = document.querySelector('.decks');
const viewer = document.querySelector('.viewer');
const body = document.querySelector('body');

decks.addEventListener('click', handleDecksClick);

function handleDecksClick(event) {
	// here the user can
	// expand or contract menu
	// select a deck to view / practice / edit
	// download a deck
	// upload / link a deck

	body.classList.toggle('minimize');
}
