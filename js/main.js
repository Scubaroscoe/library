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
function addNewBookToLibrary(title, author, pages, read) {
	//take users input and store new book objects into an array that holds all book objects
	// let title = prompt("Book title: ");
	// let author = prompt("Book author: ");
	// let pages = prompt("Book number of pages: ");
	// let read = prompt("Have you read this book?: ");

	library.push(new Book(title, author, pages, read));
}

function addBookToLibrary(book) {
	library.push(book);
}

function capitalize(someStr) {
	let returnStr = someStr[0].toUpperCase();
	returnStr += someStr.slice(1);
	return returnStr;
}

// create just the header for the table
function createTableHead(table, someBook) {
	// const tblHead = document.createElement('thead');
	let tblHead = table.createTHead();
	let tblHeadRow = tblHead.insertRow();

	for (let prop of Object.keys(someBook)) {
		if (prop === 'info') {
			// skip for now
		} else {
			let th = document.createElement('th');
			let text = document.createTextNode(capitalize(prop));
			th.appendChild(text);
			tblHeadRow.appendChild(th);
		}
	}
}

// create all cells
function createTableRows(body, library) {
	for (let i = 0; i < library.length; i++){
		//create a table row
		const row = document.createElement("tr");

		for (let j in library[i]) {
			// create td element and text node. text node fills the td
			if (j === 'info'){
				//skip for now
			} else {
				let cell = document.createElement('td');
				let cellText = document.createTextNode(`${library[i][j]}`);
				cell.appendChild(cellText);
				row.appendChild(cell);
			}
		}
		body.appendChild(row);
	}
}

const bookContainer = document.querySelector('#book-container');
function displayCatalogue() {
	
	// create a table element and a tbody element
	const tbl = document.createElement('table');

	createTableHead(tbl, bloodMusic);

	const tblBody = document.createElement('tbody');

	createTableRows(tblBody, library);

	tbl.appendChild(tblBody);
	bookContainer.appendChild(tbl);
}



let bloodMusic = new Book("Blood Music", "Greg Bear", 295, true);
let travelsWithCharlie = new Book("Travels with Charlie", "John Steinbeck", 274, true);
let unsocialSocialist = new Book("The Unsocial Socialist", "George Bernard Shaw", 389, true);
// console.log(bloodMusic.info());

addBookToLibrary(bloodMusic);
addBookToLibrary(travelsWithCharlie);
addBookToLibrary(unsocialSocialist);

displayCatalogue();

// button related logic comes next
const buttonNewBook = document.querySelector('#new-book');

buttonNewBook.addEventListener('click', (e) => {
	let form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "submit.php");

	let title = document.createElement('input');
	title.setAttribute('type', 'text');
	title.setAttribute('title', 'title');
	title.setAttribute('placeholder', 'Title');

	let author = document.createElement('input');
	author.setAttribute('type', 'text');
	author.setAttribute('author', 'author');
	author.setAttribute('placeholder', 'Author');

	let pages = document.createElement('input');
	pages.setAttribute('type', 'text');
	pages.setAttribute('pages', 'pages');
	pages.setAttribute('placeholder', 'Pages');

	let read = document.createElement('input');
	read.setAttribute('type', 'text');
	read.setAttribute('read', 'read');
	read.setAttribute('placeholder', 'read');

	// create a submit button
	let submitButton = document.createElement("input");
	submitButton.setAttribute("type", "submit");
	submitButton.setAttribute("value", "Submit");

	// append inputs to the form
	form.appendChild(title);
	form.appendChild(author);
	form.appendChild(pages);
	form.appendChild(read);
	form.appendChild(submitButton);

	
});