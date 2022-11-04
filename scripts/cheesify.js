// Listen for messages on the content page
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.action === 'refresh') refresh(sendResponse);
    if (request.action === 'getBios') getBios(sendResponse, request?.ages);
    if (request.action === 'checkHost') checkHost(sendResponse);

  }
);

// Check if the current page is the one we want to run the script on
function checkHost(sendResponse) {
  const host = window.location.host;
  const allowedHosts = ['www.ordhekdeen.com', 'ordhekdeen.com'];
  if (allowedHosts.includes(host)) {
    sendResponse({ status: 'ok', host });
  } else {
    sendResponse({ status: 'error', host });
  }
}

// Our image replacement script
function refresh(sendResponse) {
  const bios = localStorage.getItem('@bios') || JSON.stringify([]);
  sendResponse(JSON.parse(bios))
}

// Get bios
function getBios(sendResponse, ages = []) {
  const columns = document.querySelectorAll('.search-list .four.columns');
  let paginations = document.querySelector('.pagination-links');

  let allBios = [];
  columns.forEach(each => {
    const birth = each.children[0].children[1].children[3].innerText;
    if (ages.includes(birth)) {
      const bioLink = each.children[0].children[2].children[0].href;
      allBios.push(bioLink);
    }
  });


  const oldBios = paginations.querySelector('.page-numbers.current').innerText == '1'
    ? JSON.stringify([]) : (localStorage.getItem('@bios') || JSON.stringify([]));
  const newBios = [...JSON.parse(oldBios), ...allBios];
  localStorage.setItem('@bios', JSON.stringify(newBios));

  const next = paginations.querySelector('.page-numbers.current')?.nextElementSibling;

  if (next) {
    sendResponse(newBios);
    next.click();
  }
  else {
    sendResponse('end');
    console.log(newBios);
  }
}
// Send messages to the content page
chrome.runtime.sendMessage({
  action: 'cheesify'
});