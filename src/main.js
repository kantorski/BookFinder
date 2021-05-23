'use strict'

let searchInput // input where user write book name
let searchIcon // button to find books
let searchResults // show find results
let btnAdd // button add book to favourite
let bookCover // currently book cover
let bookAuthor // currently book author
let bookTitle // currently book title
let bookDescription // currently book description
let favouriteContainer // box with favourite books
let btnBuy // button buy book
let alertFavourite // alert -  adding the same book second time
let alertResults // alert no results
let btnCloseBF // button closed popup in section BOOK-FIND
let btnCloseNav // button closed popup in navigation
const url = 'https://www.googleapis.com/books/v1/volumes?q=' // url to google api book
const favouriteArray = [] // array including id favourite books



const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
}

const prepareDOMElements = () =>{
    searchInput = document.querySelector('#input-area')
    searchIcon = document.querySelector('#search-icon')
    searchResults = document.querySelector('#find-results')
    btnAdd = document.querySelector('#btn-add')
    bookCover = document.querySelector('#book-cover')
    bookAuthor = document.querySelector('#book-author')
    bookTitle = document.querySelector('#book-title')
    bookDescription = document.querySelector('#book-description')
    favouriteContainer  = document.querySelector('#fav-items')
    btnBuy = document.querySelector('#btn-buy') 
    alertFavourite = document.querySelector('#alert-favourite')
    alertResults = document.querySelector('#alert-navigation') 
    btnCloseBF = document.querySelector('#close-popup-bookfind')
    btnCloseNav = document.querySelector('#close-popup-navigation')
}

const prepareDOMEvents = () => {
    searchIcon.addEventListener('click', finder)
    searchInput.addEventListener('keyup', checkKeyEnter)
    searchResults.addEventListener('click', finderDetails)
    btnAdd.addEventListener('click', addNewFavourite)
    favouriteContainer.addEventListener('click', removeFavourite)
    favouriteContainer.addEventListener('click', finderDetails)
    btnBuy.addEventListener('click', buyBook)
    btnCloseBF.addEventListener('click', closePopupFav)
    btnCloseNav.addEventListener('click', closePopupNav)
}


// open new card in browser with buy option
const buyBook = (event) => {
    if(event.target.closest('button').classList.contains('btn-buy-book')){
        window.open(`${sessionStorage.getItem('buyLink')}`, '_blank')
    }
}

// run finder after click "enter"
const checkKeyEnter = (event) => {
    if (event.key === 'Enter'){
        finder()
    }
}

// remove book from favourite
const removeFavourite = (event) => {
    const book = event.target.closest('div')
    if(event.target.closest('button')){
        book.remove()
    }
}

// showing popup
const showAlert = (element) => {
    element.classList.remove('alert-hidden')
    element.classList.add('alert-visibilty')
}

// hiding popup
const hideAlert = (element) => {
    element.classList.add('alert-hidden')
    element.classList.remove('alert-visibilty')
}

// close popup in book-find section
const closePopupFav = (event) => {
    if(event.target.closest('button').classList.contains('btn-close')){
        hideAlert(alertFavourite)
    }
}

// close popup in navgation
const closePopupNav = (event) => {
    if(event.target.closest('button').classList.contains('btn-close')){
        hideAlert(alertResults)
    }
}

// find books and display results
const finder = () =>{
    while (searchResults.firstChild) {
        searchResults.firstChild.remove()
    }
    fetch(url+searchInput.value)
        .then(res => res.json())
        .then(data => {
            // loop check and show only books witch cover image
            for (const element of data.items){
                if(element.volumeInfo.imageLinks !== undefined){
                    let temp = document.createElement('a')
                    temp.setAttribute('id', element.id)
                    temp.innerHTML= `
                        <div class="find-item-bgc">
                            <img class="find-item-book" src="${element.volumeInfo.imageLinks?.thumbnail}"></img>
                        </div>
                        `
                    searchResults.appendChild(temp)
                }
                else{
                    continue
                }
            }
            searchResults.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        })
        .catch(error => {
            console.log(error)
            showAlert(alertResults)
        })
}

// find clicked book, and display details
const finderDetails = (event) =>{
    const temp = event.target.closest('a').id
    fetch(url+temp)
    .then(res => res.json())
    .then(data => {
        sessionStorage.setItem('id', temp)
        bookAuthor.innerText = data.items[0].volumeInfo.authors
        bookTitle.innerText = data.items[0].volumeInfo.title
        if (data.items[0].volumeInfo.description !== undefined){
            bookDescription.innerText = data.items[0].volumeInfo.description
        }
        else{
            bookDescription.innerText = "This book havn't desrciption"
        }
        bookCover.style.backgroundImage = `url(${data.items[0].volumeInfo.imageLinks.thumbnail})`
        sessionStorage.setItem('bookCover', `${data.items[0].volumeInfo.imageLinks.thumbnail}`)
        sessionStorage.setItem('buyLink', `${data.items[0].saleInfo.buyLink}`)
        bookAuthor.scrollIntoView({behavior: "smooth", block: "start"})
    })  
    .catch(error => console.log(error))
}

// adding book to favourite
const addNewFavourite = () => {
    if (favouriteArray.includes(`${sessionStorage.getItem('id')}`) === false){
        let temp = document.createElement('div')
        temp.innerHTML= `
                    <a class="fav-item" id=${sessionStorage.getItem('id')}>
                        <div class="fav-item-bgc">
                            <img class="fav-item-book" src='${sessionStorage.getItem('bookCover')}'></img>
                        </div>
                    </a>
                    <button class="btn-remove">remove</button>
        `
        favouriteContainer.appendChild(temp)
        console.log(favouriteArray)
        favouriteArray.push(`${sessionStorage.getItem('id')}`)
    }
    else{
        console.log('This book is already add')
        showAlert(alertFavourite)
    }
}

document.addEventListener('DOMContentLoaded', main)