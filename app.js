class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookList(book){
        const list = document.getElementById('book-list');

        //Creating Row
        const row = document.createElement('tr');

        //Insert Columns
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `
        list.appendChild(row);
    }

    showAlert(message, className){
        //Create Div
        let div = document.createElement('div');

        //Add Classes
        div.className = `alert ${className}`;

        //Add Text
        div.appendChild(document.createTextNode(message));

        //Get Parent & Form
        let container = document.querySelector('.main')
        let form = document.querySelector('#book-form');

        //Inserting Alert
        container.insertBefore(div , form);

        //Remove Alert ater 3sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

}

//Storing Locally
class store{
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks(){
        const books = store.getBooks();

        books.forEach(function(book){
            const ui = new UI();
            ui.addBookList(book);
        });
    }

    static addBook(book){
        const books = store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = store.getBooks();

        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//DOM Load Event
document.addEventListener('DOMContentLoaded', store.displayBooks);

//EventListner for Add
document.getElementById('book-form').addEventListener('submit' , function(e){
    //Get Form Values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn =document.getElementById('isbn').value

    //Instantiate Book
    const book = new Book(title, author, isbn);

    //Instantiate UI
    const ui = new UI();

    //Show Error
    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill all Fields', 'error');
    }
    else{
     //Add Book to List
    ui.addBookList(book);

    //Add Book to Local Storage
    store.addBook(book);

    //Show Success
    ui.showAlert('Book Added', 'success');

    //Clear Form Fields
    ui.clearFields();
    }

   e.preventDefault();
});

//EventListener for Delete
document.getElementById('book-list').addEventListener('click',function(e){

    //Instantiate UI
    const ui = new UI();

    //Delete Book
    ui.deleteBook(e.target);

    //Delete from Local Storage
    store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show Alert
    ui.showAlert('Book Deleted', 'success');

    e.preventDefault();
});