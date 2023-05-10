'use strict'

window.onresize = function() {
  const m = document.getElementById('mmenu');
  if (window.innerWidth > 720 && m) showMobileMenu();
};

(function(){
  const m = document.getElementById('menu');
  if (m) {
    let addr = window.location.pathname;
    let currentItem;
    let arrPages = ['download', 'screens', 'demo', 'contact', 'manual']
    if (addr == "/") {
      currentItem = document.querySelector("#menu a:not(#logo)[href^='/']");
    } else {
      arrPages.forEach((text) => {
        if (addr.includes(text)) {
          currentItem = document.querySelector(`#menu a:not(#logo)[href^='${text}']`);
        }
      })
    }
    if (currentItem) currentItem.parentElement.classList.add("selected");
  }
})();

function showMobileMenu() {
  const m = document.getElementById('mmenu');
  if (m) {
    m.parentNode.removeChild(m);
  } else {
    const mmenu = document.getElementById('menu').cloneNode(true);
    mmenu.id = 'mmenu';
    mmenu.style.display = 'block';
    mmenu.style.marginTop = '50px';
    mmenu.classList.add('fullscreen');
    document.body.insertBefore(mmenu, document.getElementById('navbar'));
  }
}

function appendTempDiv(parentDiv, divClasses, textNodeText) {
  const newDiv =  document.createElement("div");
  newDiv.classList.add(...divClasses);
  newDiv.appendChild(document.createTextNode(textNodeText));
  parentDiv.appendChild(newDiv);
  setTimeout(()=> newDiv.remove(), 8000);
}
function appendDiv(parentDiv, divClasses, textNodeText) {
  const newDiv =  document.createElement("div");
  newDiv.classList.add(...divClasses);
  newDiv.appendChild(document.createTextNode(textNodeText));
  parentDiv.appendChild(newDiv);
}

(function(){
  const sender = document.getElementById('send');
  if (!sender) return;
  document.getElementById('send').addEventListener("click", function() {
    const mainDiv = document.querySelector('.block.main');
    const senderDiv = document.getElementById('sender');
    const processorDiv = document.getElementById('processor');
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const feedback = document.getElementById('feedback');
    let arr = [name, email, feedback];
    for (let elem of arr) {
      if (elem.value == '') {
        elem.style.borderColor = '#f62';
        appendTempDiv(senderDiv, ["red", "disappear"], "Some fields are empty.");
        return;
      }
    }
    if (!/.+@.+/.exec(email.value)) {
      email.style.borderColor = '#f62';
      appendTempDiv(senderDiv, ["red", "disappear"], "Wrong email typed in.");
      return;
    };
    const URL = 'https://feedback.funct.workers.dev'
    const data = {
      "subject": "EDM System Feedback",
      "name": document.getElementById('name').value,
      "email": document.getElementById('email').value,
      "feedback": document.getElementById('feedback').value
      .replace(/\{/g, "&#123;").replace(/\}/g, "&#125;")
    };
    senderDiv.style.display = 'none';
    processorDiv.style.display = 'block';
    arr.map(elem => elem.value = '');
    arr.map(elem => elem.style.borderColor = 'revert-layer');
  
    fetch(URL, {
      method: "POST", body: JSON.stringify(data),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).catch(error => console.log(error))
    .then(res => {
      if (res && res.ok) {return res.json();}
      else {return {status: 601}}
    }).then(json => {
      processorDiv.style.display = 'none';
      //senderDiv.style.display = 'block';
      if (json.status == 0) {
        appendDiv(mainDiv, ["green"], "SUCCESS: The message was sent.");
      } else {
        appendDiv(mainDiv, ["red"], "SORRY: ERROR sending the message.");
      }
    }).catch((error) => {
      processorDiv.style.display = 'none';
      //senderDiv.style.display = 'block';
      appendDiv(mainDiv, ["red"], "SORRY: ERROR sending the message.");
      console.log(error);
    });
  });
})();

