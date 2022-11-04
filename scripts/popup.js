let active_ages = ['২০০৩', '২০০৪', '২০০৫', '২০০৬'];

const extensionInit = () => {

  // Send a message to the active tab to 'getBios' it
  function sendGetBiosMsg() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { // Finds tabs that are active in the current window
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getBios', ages: active_ages }, function (response) { showBios(response); }); // Sends a message (object) to the first tab (tabs[0])
    });
  }

  // Trigger the function above when clicking the 'Cheesify' button
  document.querySelector('#find').addEventListener('click', () => {
    sendGetBiosMsg()
  });

  // show bios
  function showBios(bios = [], refresh = false) {
    
    if (bios == 'end') {
      alert(`At the end, I hope you found your love? 🙂💞`)
      onRefresh()
      console.log('end');
      return
    }

    const html = `<ol>
  ${bios.map(bio => `
    <li><a class="bio" href="${bio}" target="_blank">${bio}</a><span class="copy_link">copy</span></li>`).join('')}
  </ol>
  `
    document.querySelector('.bios').innerHTML = html
    copyLinksInit()
    if (refresh) return
    const timer = setTimeout(() => {
      sendGetBiosMsg()
      clearTimeout(timer)
    }, 5000)
  }

  // ContentLoaded event listener
  function onContentLoaded() {
    onRefresh();
  }

  // on Refresh
  function onRefresh() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { // Finds tabs that are active in the current window
      chrome.tabs.sendMessage(tabs[0].id, { action: 'refresh' }, function (response) { showBios(response, true); }); // Sends a message (object) to the first tab (tabs[0])
    });
  }

  // Refresh the bios list when the popup is opened
  document.addEventListener('DOMContentLoaded', onContentLoaded);
  const refresh = document.querySelector('.refresh');
  refresh.addEventListener('click', onRefresh);


  // ages
  const ages = document.querySelectorAll('.ages span');
  ages.forEach(age => {
    age.addEventListener('click', () => {
      const ageValue = age.innerText;
      age.classList.toggle('active_age')
      if (active_ages.includes(ageValue)) {
        active_ages = active_ages.filter(a => a != ageValue)
      }
      else {
        active_ages.push(ageValue)
      }
    })
  });

  // Copy to clipboard
  const copy = document.querySelector('.copy');
  copy.addEventListener('click', () => {
    const bios = document.querySelectorAll('.bio');
    const bioLinks = [];
    bios.forEach(bio => {
      bioLinks.push(bio.href)
    })
    navigator.clipboard.writeText(bioLinks.join(', '))
      .then(() => {
        alert('Copied to clipboard')
      })
      .catch(err => {
        alert('Error copying to clipboard')
      })
  })

  // Copy link
  const copyLinksInit = () => {
    const copyLinks = document.querySelectorAll('.copy_link');
    copyLinks.forEach(copyLink => {
      copyLink.addEventListener('click', () => {
        navigator.clipboard.writeText(copyLink.previousElementSibling.href)
          .then(() => {
            copyLink.innerHTML = 'copied'
            const timer = setTimeout(() => {
              copyLink.innerHTML = 'copy'
              clearTimeout(timer)
            }, 500)
          })
          .catch(err => {
            alert('Error copying to clipboard')
          })
      })
    })
  }
}

// check if the domain is ordhekdeen.com or not, if not don't do anything. show open ordhekdeen.com button
function checkDomain() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) { // Finds tabs that are active in the current window
    chrome.tabs.sendMessage(tabs[0].id, { action: 'checkHost' }, function (response) {
      console.log(response);
      if (response?.status == 'ok') {
        extensionInit()
      } else {
        document.body.innerHTML = `
          <h1>Find your life partner
            <span>💞</span>
          </h1>
          <div class="open-ordhekdeen">
              <h3>This extension only works on ordhekdeen.com</h3>
              <p>Click the button below to open ordhekdeen.com</p>
              <a class="open-ordhekdeen-btn" href="https://ordhekdeen.com" target="_blank">Open ordhekdeen.com</a>
          </div>
        `
      }
    }); // Sends a message (object) to the first tab (tabs[0])
  });
}
checkDomain()
