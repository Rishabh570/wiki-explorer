var $input;
var $searchButton;
var $articleWrapper;

function formatData(data) {
    return new Promise(function(resolve) {
        var formatted = [];
        for (var i = 0; i < data[1].length; i++) {
            formatted.push({
                header: data[1][i],
                description: data[2][i],
                URL: data[3][i],
            });
        }
        resolve(formatted);
    });
}

function addCards(data) {
    return new Promise(function(resolve) {
        $articleWrapper.empty();
        data.map(function(article) {
            $articleWrapper.append('<div class="ui card">' +
            '<div class="content">' +
              '<div class="ui center aligned header"><a href="' + article.URL + '" target="_blank" rel="noopener">' + article.header + '</a></div>' +
              '<div class="description">' +
                '<p>' + article.description + '</p>' +
              '</div>' +
            '</div>' +
          '</div>');
        });
    });
}

function getSearchQuery() {
  return $input.val();
}

function search() {
  var query = getSearchQuery();
  if (query.length <= 0) return;

  fetch('https://en.wikipedia.org/w/api.php?origin=*&format=json&action=opensearch&list=search&namespace=0&search=' + query + '&limit=20')
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      return formatData(data);
    })
    .then(function(data) {
      return addCards(data);
    })
    .catch(function(err) {
      console.log(err);
    }
  );
}

function setListeners() {
  $input.keypress(function(ev) {
    if (ev.which === 13) {
      search();
    }
  });

  $searchButton.click(function() {
    search();
  });
}

$(document).ready(function() {
  $input = $('#searchInput');
  $searchButton = $('#searchButton');
  $articleWrapper = $('#articleWrapper');

  setListeners();
});
