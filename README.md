# Favourite Music Dashboard 

## Description

Link to deployed application: https://cedekpoole.github.io/favourite-music-dashboard/ 

Welcome to the repo! The 'Favourite Music Dashboard' is a web application that allows users to effortlessly find their favourite artists and songs. 

This project was a collaborative venture (contributors listed below). We practiced agile development where we first created a MVP (minimum viable product), 

### Technologies Used: 
- HTML, CSS
- Javascript
- [Bootstrap (v5.3)](https://getbootstrap.com/)
- [jQuery (v3.6.3)](https://api.jquery.com/)
- Server-side APIs ([Deezer](https://developers.deezer.com/api) for the artist info and [Some Random API](https://some-random-api.ml/docs/welcome/introduction) for the song lyrics)

### USER STORY: 
As a music lover, I want to be able to search and store my favourite songs and easily access the lyrics for each saved song. 

### General Acceptance Criteria:
- Use Bootstrap.

- Be deployed to GitHub Pages.

- Be interactive (in other words, accept and respond to user input).

- Use at least two server-side APIs Links to an external site..

- Use modals instead of alerts, confirms, or prompts.

- Use client-side storage to store persistent data.

- Be responsive.

- Have a polished UI.

- Have a clean repository that meets quality coding standards (file structure, naming conventions, best practices for class/id naming conventions, indentation, quality comments, and so on).

- Have a quality README (including a unique name, description, technologies used, screenshot, and link to the deployed application).
Provide a short description explaining the what, why, and how of your project. Use the following questions as a guide:


## Installation 

N/A

## Usage 

## Credits 

Project contributors: 
- [bethanyryalls](https://github.com/bethanyryalls)
    - Created the skeleton of the page (HTML + Bootstrap)
    - Dynamically generated the playlist and the search result cards
    - Implemented the 'load more' buttons 
    - Added responsiveness to page and had creative input on page design 
    - General refactoring of code base

- [c4rli](https://github.com/c4rli)
    - Managed the lyrics server-side API
    - Retrieved lyric data and created modals for the lyric buttons 
    - Dealt with ajax request errors 
    - Creative input on page design
    - General refactoring of code base

- [DollyA-bit](https://github.com/DollyA-bit)
    - Input on the README file
    - Picked the colour scheme of the page

- [cedekpoole](https://github.com/cedekpoole)
    - Dynamically generated the 'favourite songs' cards
    - Added functionality to said cards (delete songs individually or collectively + stop duplication)
    - Dealt with local storage
    - Managed the README file
    - General refactoring of code base

## License 

Please refer to the LICENSE in the repo. 

---

## Features

- The user can search for either an artist or a specific song for easy access to lyrics
- All cards on the page are generated dynamically via jQuery 
- Modals have been used for the lyric buttons 
- 'Load more' button has been implemented
- Favourite songs are saved to local storage
- When an error occurs, a modal pop up is returned 
- Delete each favourite song - which is stored in local storage - individually or collectively


## Roadmap 

- Use Youtube Data API to add the music video of that particular song in the modal?
- Add playlist cards to the welcome screen (to give users more choice on the playlists they want to look at) 
- Create a logo for the page