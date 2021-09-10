function Book(title, author, pages, read) {
	this.title = title;
	this.author = author;
	this.pages = pages;
	this.read = read;

	this.info = function() {
		let readOutput;
		if (read) {
			readOutput = "have read.";
		} else {
			readOutput = "not read yet.";
		}
		return `${title} by ${author}, ${pages} pages, ${readOutput}`;
	}
}

let library = [];
function addBookToLibrary(title, author, pages, read) {
	//take users input and store new book objects into an array that holds all book objects
	// let title = prompt("Book title: ");
	// let author = prompt("Book author: ");
	// let pages = prompt("Book number of pages: ");
	// let read = prompt("Have you read this book?: ");

	library.push(new Book(title, author, pages, read));
}

const bookContainer = document.querySelector('#book-container');
function displayCatalogue() {
	for (let i = 0; i < library.length; i++){
		// create cards with book details and add them to the book container
	}
}



let bloodMusic = new Book("Blood Music", "Greg Bear", 295, true);
console.log(bloodMusic.info());