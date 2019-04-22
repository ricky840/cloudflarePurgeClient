var backPages = [];

var initStorage = function() {
  debugOutput({text: "initializing Storage"});
  chrome.storage.local.get("api_keys", function(result) {
    if(result['api_keys'] === undefined) {
      chrome.storage.local.set({'api_keys': []}); 
    }
  });
  chrome.storage.local.get("activated_key", function(result2) {
    if(result2['activated_key'] === undefined) {
      chrome.storage.local.set({'activated_key': {}});
    } else {
      var enc_key = result2['activated_key'];
      if (!$.isEmptyObject(enc_key)) {
        updateActiveApiKeyCache(encdec.decrypt(enc_key));
      }
    }
  });
  chrome.storage.local.get("purge_logs", function(result3) {
    if(result3['purge_logs'] === undefined) {
      chrome.storage.local.set({'purge_logs': {}});
    }  
  });
  chrome.storage.local.get("latest_purge_result", function(result) {
    if(result['latest_purge_result'] === undefined) {
      chrome.storage.local.set({'latest_purge_result': {}});
    }  
  });
}

var initBackPage = function() {
  debugOutput({text: "initializing BackPages"});
  backPages = [];
}

var basicNotification = function(notification) {
  switch (notification.type) {
    case "purge_success":
      var title = "Successfully Purged";
      var message = "Please ensure to delete browser caches.";
      var iconImg = LogoImage;
      break;
    case "purge_failed":
      var title = "Purge Failed";
      var message = "Check out logs for more details.";
      var iconImg = LogoImage;
      break;
    default:
      return;
      break;
  }
  var options = {
    type: 'basic',
    iconUrl: iconImg,
    title: title, 
    message: message
  }
  chrome.notifications.create(getCurrentDatetimeUTC(), options);
}

var contextMenuPurge = function(request) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(tabs[0].id, {file: "lib/jquery-3.1.1.min.js"}, function() {
      chrome.tabs.executeScript(tabs[0].id, {file: "lib/HoldOn.js"}, function() {
        chrome.tabs.executeScript(tabs[0].id, {file: "js/holdon_css.js"}, function() {
          chrome.tabs.sendMessage(tabs[0].id, {action: "open", purgetype: request.type, target: request.target}, function() {
            purge.requestPurge({type: request.type, targets: [request.target]}).then(function(result) {
              sleep(HoldOnDelay, function() {
                chrome.tabs.sendMessage(tabs[0].id, {action: "close"});
                basicNotification({type: "purge_success"});
              });
            }).catch(function(err) {
              sleep(HoldOnDelay, function(){
                chrome.tabs.sendMessage(tabs[0].id, {action: "close"});
                basicNotification({type: "purge_failed"});
              });
            });
          });
        });
      });
    });
  });
}

var createContextMenu = function() {
  chrome.contextMenus.create({
    "id": "cfpurgeclient",
    "title": "Cloudflare Purge Client", 
    "contexts":["all"]
  });
  chrome.contextMenus.create({
    "id": "cfpurgeclient_url",
    "title": "Purge this URL", 
    "parentId": "cfpurgeclient",
    "contexts":["all"]
  });
  chrome.contextMenus.create({
    "id": "cfpurgeclient_tag",
    "title": "Purge this Tag", 
    "parentId": "cfpurgeclient",
    "contexts":["all"]
  });
}

// Fire when ext installed
chrome.runtime.onInstalled.addListener(function(event) {
  initStorage();
  initBackPage();
  createContextMenu();
  if (event.reason === 'install') {
    chrome.storage.local.set({notice_installed: true, notice_updated: false}, function() {
      debugOutput({text: "Extension Installed"});
    });
  }
  if (event.reason === 'update') {
    chrome.storage.local.set({notice_updated: true, notice_installed: false}, function() {
      debugOutput({text: "Extension Updated"});
    })
  }
});

// Fires when Chrome starts or when user clicks refresh button in extension page
chrome.runtime.onStartup.addListener(function() {
  initStorage();
  initBackPage();
  createContextMenu();
});

// Fires when user clicks disable / enable button in extension page
window.onload = function() {
  initStorage(); 
  initBackPage();
};

// Reset backpage when open popup page
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type !== "init") return;
  if (message.target === "backpage") initBackPage();
});

chrome.contextMenus.onClicked.addListener(function(event) {
  if ($.isEmptyObject(activeApiKeyCache)) {
    alert('Please activate API key first! Go to "Managed API Keys"');
    return false;
  }
  var selected_text = event.selectionText || false;
  var url = event.srcUrl || false;
  switch (event.menuItemId) {
    case "cfpurgeclient_url":
      if(url) {
        contextMenuPurge({type: 'url', target: url});
      } else {
        alert("URL does not exist");
        return;
      }
      break;
    case "cfpurgeclient_tag":
      if(selected_text) {
        contextMenuPurge({type: 'tag', target: selected_text});
      } else {
        alert("Please select a Tag");
        return;
      }
      break;
    default:
      break;
  }
});
