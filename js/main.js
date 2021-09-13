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

	this.toggle = function() {
		if (this.read) {
			this.read = false;
		} else {
			this.read = true;
		}
	}
}

let library = [];

function addNewBookToLibrary(title, author, pages, read) {
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
	let tblHead = table.createTHead();
	let tblHeadRow = tblHead.insertRow();

	for (let prop of Object.keys(someBook)) {
		let th = document.createElement('th');
		let text;
		if (prop === 'info') {
			// skip for now
			text = document.createTextNode("Remove");
		} else if (prop === 'toggle') {
			text = document.createTextNode("Toggle Read");
		} else {
			text = document.createTextNode(capitalize(prop));
		}
		th.appendChild(text);
		tblHeadRow.appendChild(th);
	}
}

// create all cells
function createTableRows(body, library) {
	for (let i = 0; i < library.length; i++){
		//create a table row
		const row = document.createElement("tr");
		row.setAttribute("data-ind", i);
		for (let j in library[i]) {
			// create td element and text node. text node fills the td
			let cell = document.createElement('td');
			let cellCont;
			if (j === 'info'){
				//skip for now
				cellCont = document.createElement('button');
				cellCont.textContent = "Remove";
				cellCont.addEventListener('click', (e) => {
					let parentRow = document.querySelector(`tr[data-ind="${i}"]`);
					parentRow.remove();
					delete library[i];
				})
			} else if (j === 'toggle') {
				cellCont = document.createElement('button');
				cellCont.textContent = "Toggle Read";
				cellCont.addEventListener('click', (e) => {
					library[i].toggle();
					let parentRow = document.querySelector(`tr[data-ind="${i}"]`);
					let rowCells = parentRow.querySelectorAll('td');
					for (let prop in rowCells) {
						let propVal = rowCells[prop].textContent;
						if (propVal === "true" || propVal == "false") {
							rowCells[prop].textContent = library[i].read;
						}
					}
				});
			} else {
				cellCont = document.createTextNode(`${library[i][j]}`);
			}
			cell.appendChild(cellCont);
			row.appendChild(cell);
		}
		body.appendChild(row);
	}
}

function populateStorage() {	// needs work...
	console.log(`populating storage with this: ${document.querySelector('#book-container')}`)
	localStorage.setItem('book-container', document.querySelector('#book-container'));
	setStorage();
}

function setStorage() {
	var storedContainer = localStorage.getItem('book-container');
	document.querySelector('#book-container').value = storedContainer;
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
	populateStorage();
}

// let bloodMusic = new Book("Blood Music", "Greg Bear", 295, true);
// let travelsWithCharlie = new Book("Travels with Charlie", "John Steinbeck", 274, true);
// let unsocialSocialist = new Book("The Unsocial Socialist", "George Bernard Shaw", 389, true);
// console.log(bloodMusic.info());

// addBookToLibrary(bloodMusic);
// addBookToLibrary(travelsWithCharlie);
// addBookToLibrary(unsocialSocialist);

displayCatalogue();

// button related logic comes next
const buttonNewBook = document.querySelector('#new-book');
const newBookContainer = document.querySelector('#new-book-container');

buttonNewBook.addEventListener('click', (e) => {
	buttonNewBook.disabled = true;
	let form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", "");

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
	read.setAttribute('placeholder', 'Read');

	// create a submit button
	let submitButton = document.createElement("input");
	submitButton.className = 'btn-sub';
	submitButton.setAttribute("type", "submit");
	submitButton.setAttribute("value", "Submit");

	// Adds book to catalog, then removes form elements and reenables the new button
	submitButton.addEventListener('click', (e) => {
		addNewBookToLibrary(title.value, author.value, pages.value, read.value);
		displayCatalogue();
		buttonNewBook.disabled = false;
		while (form.lastChild) {
			form.removeChild(form.firstChild);
		}
		form.remove();
	})

	// append inputs to the form
	form.appendChild(title);
	form.appendChild(author);
	form.appendChild(pages);
	form.appendChild(read);
	form.appendChild(submitButton);

	newBookContainer.appendChild(form);
});

if (!localStorage.getItem('book-container')) {
	// populate local storage
	populateStorage();
} else {
	// add the existing stored values to the page where they belong
	setStorage();
}

window.addEventListener('storage', function(e) {
	document.querySelector('.my-key').textContent = e.key;
	document.querySelector('.my-old').textContent = e.oldValue;
	document.querySelector('.my-new').textContent = e.newValue;
	document.querySelector('.my-url').textContent = e.url;
	document.querySelector('.my-storage').textContent = e.storageArea;	
});