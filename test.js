'use strict';

window.onload = function() {
  const content = document.querySelector('#content');
  const loading = document.querySelector('#loading');
  const url = 'https://node-hnapi.herokuapp.com/news';
  const url2 = 'https://node-hnapi.herokuapp.com/news?page=2';
  const url3 = 'https://node-hnapi.herokuapp.com/news?page=3';
  const url4 = 'https://node-hnapi.herokuapp.com/news?page=4';
  let counter = 0;

  /**
   * @param {string} s - request url
   * @return {string} html content
   */
  function getContent(s) {
    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      let h = '';
      req.open('GET', s);
      req.send(null);
      req.onload = function() {
        if (req.status === 200) {
          let cont = JSON.parse(req.responseText);
          cont.forEach(function(c) {
            h += '<div class="news-item">'
              + '<h2>'
              + '#' + parseInt(++counter)
              + '</h2>'
              + '<a class="hackerUrl" href="' + c.url + '">'
              + '<p>'
              + c.title
              + '</p>'
              + '</a>'
              + '</div>';
          });
          resolve(h);
        } else {
          reject(new Error(req.status));
        }
      };
    });
  }

  let rqs = [
    getContent(url),
    getContent(url2),
    getContent(url3),
    getContent(url4)
  ];

  function openTab(link) {
    chrome.tabs.create({
      url: link
    });
  }

  Promise.all(rqs)
  .then(function() {
    let html = '';
    for (let i = 0, l = arguments.length; i < l; i++) {
      html += arguments[i];
    }
    content.innerHTML = html;
    loading.style.display = 'none';
    content.style.display = 'block';
    document.querySelectorAll('.hackerUrl').forEach(function(tag) {
      let link = tag.href;
      tag.addEventListener('click', function() {
        openTab(link);
      });
      debugger;
    });
  }).catch(function(e) {
    content.innerHTML = e.message;
    loading.style.display = 'none';
    content.style.display = 'block';
  });
};
