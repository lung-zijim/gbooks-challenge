// variables
var click = false;
var term = '';
var content_get = null;
var bookList = [];
var result = [];

function init() {
  document.getElementById('search-btn').addEventListener('click', function(){
      click = true;
      term = document.getElementById('search-bar').value;
      searchForBooks(term);
      result = bookList.concat(result);
      bookList = [];
      clear();
      render();
  });
}


// Renders an error message
function showError(msg) {
  const html = `<li><p class="error">${msg}</p></li>`;
  document.querySelector('#results').innerHTML = html;
}

function clear() {
  var el = document.getElementsByClassName('oneBook');
  for (let i = 0; el.length; i++) {
  el[0].parentNode.removeChild(el[0]);
  }
}

// Searches for books and returns a promise that resolves a JSON list
function searchForBooks(term) {
  get_url = 'https://www.googleapis.com/books/v1/volumes?q='
            +encodeURIComponent(term);
  content_get = JSON.parse(httpGet(get_url));

  // each book : { title:, subtitle:, author:, link:, image:}
  let items = content_get.items;
  for (let i = 0; i < items.length; i++) {
    let oneBook = {};
    
    oneBook.title = items[i].volumeInfo.title;
    if (items[i].volumeInfo.subtitle == undefined) {
      oneBook.subtitle = 'None';
    } else {
      oneBook.subtitle = items[i].volumeInfo.subtitle;
    }
    if (items[i].volumeInfo.author == undefined) {
      oneBook.author = 'None';
    } else {
      oneBook.author = items[i].volumeInfo.author;
    }
    oneBook.image = items[i].volumeInfo.imageLinks.thumbnail;

    if (items[i].volumeInfo.industryIdentifiers[1] == undefined) {
      var id = 'None';
    } else {
      var id = items[i].volumeInfo.industryIdentifiers[1].identifier;
    }
    oneBook.link = 'https://books.google.com/books?id=' + 
                   items[i].id + '&printsec=frontcover&dq=isbn:' +
                   id;
    bookList.push(oneBook);
  }
}

// Generate HTML and sets #results's contents to it
function render() {
  for (let i = 0; i < result.length; i++) {
      let href = result[i].link;
      var box = document.createElement('div');
      box.className = 'oneBook';

      var img = document.createElement('img')
      img.className = 'cover';
      img.src = result[i].image;
      img.onclick = function() { window.location.href = href }
      
      var textBox = document.createElement('div');
      textBox.className = 'text';
      textBox.innerHTML = 'Title: ' + result[i].title + '<br>' +
                          'SubTitle: ' + result[i].subtitle + '<br>' +
                          'Author: ' + result[i].author + '<br>' +
                          '<a href=' + href + '>Link</a>';
      
      box.appendChild(img);
      box.appendChild(textBox);

      
      document.body.appendChild(box);
  }
}

function httpGet(url)
{
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

init();