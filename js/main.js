// This function checks if browser can use webstorage API. Only really old browsers would not work
function storageAvailable(type) {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch(e) {
		return e instanceof DOMException && (
			//everything except firefox
			e.code === 22 ||
			// test name field too, because code might not be present
			//everything except firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length != 0);
	}
}

if (storageAvailable('localStorage')) {
	console.log('Local Storage is usable!');
} else {
	console.log('Local storage is not usable...');
}

class Book {
	constructor(title, author, pages, read) {
		this.title = title;
		this.author = author;
		this.pages = pages;
		this._read = read;
	}

	set read(bool) {
		this._read = eval(bool);
	}

	get read() {
		return this._read;
	}

	toggle() {
		if (eval(this._read)) {
			// book.read = false;
			this._read = false;
		} else {
			// book.read = true;
			this._read = true;
		}
	}
	
	info(book) {
		let readOutput;
		if (_read) {
			readOutput = "have read.";
		} else {
			readOutput = "not read yet.";
		}
		return `${title} by ${author}, ${pages} pages, ${readOutput}`;
	}
}


function addNewBookToLibrary(title, author, pages, read) {
	library.push(new Book(title, author, pages, read));
	populateStorage();
}

function addBookToLibrary(book) {
	library.push(book);
	populateStorage();
}

function capitalize(someStr) {
	let returnStr = someStr[0].toUpperCase();
	returnStr += someStr.slice(1);
	return returnStr;
}
// create just the header for the table

function createTableHead(table, someBook) {
	let tblHead = table.createTHead();
	let tblHeadRow = tblHead.insertRow();

	for (let prop of Object.keys(someBook)) {
		let th = document.createElement('th');
		let text = document.createTextNode(capitalize(prop));
		th.appendChild(text);
		tblHeadRow.appendChild(th);
		// tblHeadRow.appendChild(document.createElement('th').appendChild(document.createTextNode(capitalize(prop)))); // can be done in one line
	}
	// This is hideous, but localStorage was having significant problems with storing 
	// the functions defined in book, so I made them functions outside of the Book
	// object. This part is an ugly fix to add the two columns previously assumed to exist
	// in the book object.
	for (let i = 0; i < 2; i++) {
		let th = document.createElement('th');
		let text;
		if (i === 0) {
			text = document.createTextNode("Remove");
		} else {
			text = document.createTextNode("Toggle Read");
		}
		th.appendChild(text);
		tblHeadRow.appendChild(th);
	}
}

// create all cells
// function createTableRows(body, library) {
function createTableRows(body) {	
	// if (library) {	// This needed in case library is set to null by setStorage
	for (let i = 0; i < library.length; i++){
		//create a table row
		const row = document.createElement("tr");
		row.setAttribute("data-ind", i);
		for (let j in library[i]) {
			// create td element and text node. text node fills the td
			let cell = document.createElement('td');
			let cellCont = document.createTextNode(`${library[i][j]}`);
			cell.appendChild(cellCont);
			row.appendChild(cell);
		}
		// This is hideous, but localStorage was having significant problems with storing 
		// the functions defined in book, so I made them functions outside of the Book
		// object. This part is an ugly fix to add the two columns previously assumed to exist
		// in the book object.
		for (let k = 0; k < 2; k++) {
			let cell = document.createElement('td');
			let cellCont;
			if (k === 0) {
				cellCont = document.createElement('button');
				cellCont.textContent = "Remove";
				cellCont.addEventListener('click', (e) => {
					let parentRow = document.querySelector(`tr[data-ind="${i}"]`);
					parentRow.remove();
					delete library[i];
					populateStorage();	// This to keep stored library perfectly updated
				})
			} else {
				cellCont = document.createElement('button');
				cellCont.textContent = "Toggle Read";
				cellCont.addEventListener('click', (e) => {
					library[i].toggle();
					let parentRow = document.querySelector(`tr[data-ind="${i}"]`);
					let rowCells = parentRow.querySelectorAll('td');

					let propVal = rowCells[3].textContent; // This should always be 3
					if (propVal === "true" || propVal == "false") {
						rowCells[3].textContent = library[i].read;
					}

					// for (let prop in rowCells) {
					// }
					populateStorage();	// This to keep stored library perfectly updated
				});
			}
			cell.appendChild(cellCont);
			row.appendChild(cell);
		}
		body.appendChild(row);
	}
}

function populateStorage() {
	library = library.filter(n => n);
	console.log(`populating storage with this: ${JSON.stringify(library)}`);
	localStorage.setItem('library', JSON.stringify(library));
	setStorage();
}

function setStorage() {
	let storedContainer = JSON.parse(localStorage.getItem('library'));
	if (storedContainer) {	// if storedContainer is not null, then store in library
		let recreatedLibrary = [];
		for (let i = 0; i < storedContainer.length; i++) {
			let obj = storedContainer[i];
			let book = new Book(obj.title, obj.author, obj.pages, obj._read);
			recreatedLibrary.push(book);
		}
		// library = storedContainer;
		library = recreatedLibrary;
	} else {	// else set library to empty array
		library = [];
	}
	// library = [];
	// localStorage.clear();
}

const bookContainer = document.querySelector('#book-container');
const tbl = document.createElement('table');
function displayCatalogue() {
	//clear table before doing anything
	while(tbl.lastChild) {
		tbl.removeChild(tbl.firstChild);
	}	

	// create a table element and a tbody element
	createTableHead(tbl, new Book('Blood Music', 'Greg Bear', 345, true));
	const tblBody = document.createElement('tbody');

	// create all rows
	createTableRows(tblBody, library);

	// add the body full of rows to the table
	tbl.appendChild(tblBody);
	bookContainer.appendChild(tbl);
	// JSON.stringify
	// populateStorage();
}

let library = [];
if (!localStorage.getItem('library')) {
	// populate local storage
	populateStorage();
} else {
	// add the existing stored values to the page where they belong
	setStorage();
}

displayCatalogue();

// button related logic comes next
const buttonNewBook = document.querySelector('#new-book');
const newBookContainer = document.querySelector('#new-book-container');

// buttonNewBook.addEventListener('click', (e) => {
	// buttonNewBook.disabled = true;
	// let form = document.createElement("form");
	// form.setAttribute("method", "post");
	// form.setAttribute("action", "");

	// // Title is a required input for a new book
	// let title = document.createElement('input');
	// title.setAttribute('type', 'text');
	// title.setAttribute('title', 'title');
	// title.setAttribute('placeholder', 'Title');
	// title.required = true;

	// // Author is also a required input for a new book
	// let author = document.createElement('input');
	// author.setAttribute('type', 'text');
	// author.setAttribute('author', 'author');
	// author.setAttribute('placeholder', 'Author');
	// author.required = true;

	// // user can only input numbers. Setting to required for now
	// let pages = document.createElement('input');
	// pages.setAttribute('type', 'number');
	// pages.setAttribute('pages', 'pages');
	// pages.setAttribute('placeholder', 'Pages');
	// pages.required = true;

	// // Only allows for true or false, with false set as default
	// let read = document.createElement('select');
	// // read.setAttribute('type', 'text');
	// read.setAttribute('read', 'read');
	// read.setAttribute('placeholder', 'Read');
	// let t = document.createElement("option");
	// t.text = true;
	// let f = document.createElement("option");
	// f.text = false;
	// read.add(t);
	// read.add(f);
	// f.setAttribute('selected', 'selected');

	// // create a submit button
	// let submitButton = document.createElement("input");
	// submitButton.className = 'btn-sub';
	// submitButton.setAttribute("type", "submit");
	// submitButton.setAttribute("value", "Submit");

	// Adds book to catalog, then removes form elements and reenables the new button
	// submitButton.addEventListener('click', (e) => {
	// 	addNewBookToLibrary(title.value, author.value, pages.value, read.value);
	// 	displayCatalogue();
	// 	buttonNewBook.disabled = false;
	// 	while (form.lastChild) {
	// 		form.removeChild(form.firstChild);
	// 	}
	// 	form.remove();
	// })

	// // append inputs to the form
	// function handleSubmit(e) {
	// 	addNewBookToLibrary(title.value, author.value, pages.value, read.value);
	// 	displayCatalogue();
	// 	buttonNewBook.disabled = false;
	// 	while (form.lastChild) {
	// 		form.removeChild(form.firstChild);
	// 	}
	// 	// The fact that the form is removed inside of its onsubmit function
	// 	// causes a warning to pop up in the console. This isn't getting 
	// 	// in the way of the functionality of this webpage, but it's definitely 
	// 	// not ideal. If form elements were hidden instead of removed, that 
	// 	// would likely fix this.
	// 	// TODO: Replace form removal with form hiding.
	// 	form.remove();
	// }

	// form.append(title, author, pages, read, submitButton);
	// form.onsubmit = handleSubmit;

	// newBookContainer.appendChild(form);
// });


// Make the form once with a function, and call it once
function makeForm() {
	// buttonNewBook.disabled = true;
	let form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "");

	// Title is a required input for a new book
	let title = document.createElement('input');
	title.setAttribute('type', 'text');
	title.setAttribute('title', 'title');
	title.setAttribute('placeholder', 'Title');
	title.required = true;

	// Author is also a required input for a new book
	let author = document.createElement('input');
	author.setAttribute('type', 'text');
	author.setAttribute('author', 'author');
	author.setAttribute('placeholder', 'Author');
	author.required = true;

	// user can only input numbers. Setting to required for now
	let pages = document.createElement('input');
	pages.setAttribute('type', 'number');
	pages.setAttribute('pages', 'pages');
	pages.setAttribute('placeholder', 'Pages');
	pages.required = true;

	// Only allows for true or false, with false set as default
	let read = document.createElement('select');
	// read.setAttribute('type', 'text');
	read.setAttribute('read', 'read');
	read.setAttribute('placeholder', 'Read');
	let t = document.createElement("option");
	t.text = true;
	let f = document.createElement("option");
	f.text = false;
	read.add(t);
	read.add(f);
	f.setAttribute('selected', 'selected');

	// create a submit button
	let submitButton = document.createElement("input");
	submitButton.className = 'btn-sub';
	submitButton.setAttribute("type", "submit");
	submitButton.setAttribute("value", "Submit");

		// append inputs to the form
	function handleSubmit(e) {
		addNewBookToLibrary(title.value, author.value, pages.value, read.value);
		displayCatalogue();
		buttonNewBook.disabled = false;
		form.style.display = 'none';
		e.preventDefault();
	}

	form.append(title, author, pages, read, submitButton);
	form.onsubmit = handleSubmit;

	newBookContainer.appendChild(form);
	form.style.display = 'none';
}

// Called once just to make the form element
makeForm();

// This opens and closes the form for adding new books
buttonNewBook.addEventListener('click', (e) => {
	const form = document.querySelector('form');
	form.style.display = 'grid';
	buttonNewBook.disabled = true;
})

// You would use this if you had multiple pages
// window.addEventListener('storage', function(e) {
// 	document.querySelector('.my-key').textContent = e.key;
// 	document.querySelector('.my-old').textContent = e.oldValue;
// 	document.querySelector('.my-new').textContent = e.newValue;
// 	document.querySelector('.my-url').textContent = e.url;
// 	document.querySelector('.my-storage').textContent = e.storageArea;	
// });