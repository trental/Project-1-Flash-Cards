# Flashcards: A Spaced-Repetition Implementation

## Description

Flashcards are a crucial tool in education but can get tedious - both in writing them out and in organizing and reviewing them. This web app is a flashcard program that addresses these two problems electronically by allowing:

- digital entry, edit and storage
- self-scoring and thus adaptive presentation of cards

In addition to being a project of personal interest, this web app fulfills the first project requirement for the [General Assembly Software Immersive Engineer Remote course](https://generalassemb.ly/education/software-engineering-immersive-remote).

## Structure

This web app works by through the use of Decks, which are collections of Cards.

Each Deck has a title and card presentation options.
Each card has a front, back and score.

## Features

### Deck Storage

- Download (json format)
- Upload (json format)
- Persistence in Browser memory using `localStorage`

### Deck Entry / Edit

- Add New Deck
- Add New Cards
- Modify Existing Cards

### Card Presentation and Scoring

- Card scoring tiers from 1 (unknown) to 5 (immediate recall)
- Adaptive presentation based on score, customizable by Deck
- Show card front and recall Back, or reverse

## Technologies Used

Tools used in this project so far are those covered in the first three weeks of the GA SEIR course.

- HTML5
- CSS
- Javascript (front-end only)

## Installation

Use this app by visiting its hosted site [here](github.com) at github or by cloning the [repository](https://github.com/trental/Project-1-Flash-Cards.git) and running it yourself.
