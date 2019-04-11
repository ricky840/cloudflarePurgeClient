chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type !== "key") return;

  let key_id = message.key_id;
  let new_key = message.new_key;

  switch(message.action) {
    case "activate":
      apiKey.getApiKeys(key_id).then(function(arr_api_keys) {
        if (activeApiKeyCache.id === key_id) {
          apiKey.deleteActivatedApiKey();
          sendResponse({result: false});
        } else {
          var obj_key = arr_api_keys[0];
          apiKey.activateApiKey(obj_key);
          sendResponse({result: true});
        }
      });
      break;
    case "save":
      apiKey.insertNewApiKey(new_key).then(function() {
        sendResponse({result: true});
      });
      break;
    case "delete":
      apiKey.deleteApiKey(key_id).then(function() {
        sendResponse({result: true});
      });
      break;
    case "update":
      apiKey.updateApiKey(key_id, new_key).then(function() {
        sendResponse({result: true});
      });
      break;
    default:
  }
  return true;
});

var activeApiKeyCache = {};

var updateActiveApiKeyCache = function(key) {
  activeApiKeyCache = key;
  mainPage.loadActiveKeyTop();
  debugOutput({text: "Updating active api key cache", data: key});
}

var apiKey = (function(global) {
  'use strict';

  function getApiKeys(id) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get('api_keys', function(data) {
        var enc_keys = data['api_keys'];
        var arr_api_keys = encdec.decryptKeys(enc_keys); 
        if (id === undefined) {
          resolve(arr_api_keys);
        } else {
          for (var i=0; i < arr_api_keys.length; i++) { 
            if (arr_api_keys[i].id === id) {
              resolve([arr_api_keys[i]]);
            }
          }
        }
      });
    });
  }

  function insertNewApiKey(obj_key) {
    return new Promise(function(resolve, reject) {
      getApiKeys().then(function(arr_api_keys) {
        arr_api_keys.unshift(obj_key);
        if (arr_api_keys.length > APIKeyNumberLimit) {
          arr_api_keys.pop();
          debugOutput({text: "Number of API Key has reached the limit. Removed the oldest key"});
        }
        chrome.storage.local.set({'api_keys': encdec.encryptKeys(arr_api_keys)}, function() {
          debugOutput({text: "New key was inserted", data: obj_key});
          resolve();
        });
      });
    });
  }

  function updateApiKey(id, obj_key) {
    return new Promise(function(resolve, reject) {
      getApiKeys().then(function(arr_api_keys) {
        for (var i=0; i < arr_api_keys.length; i++) {
          if (id === arr_api_keys[i].id) {
            arr_api_keys[i] = obj_key;
            break;
          }
        }
        if (activeApiKeyCache.id === id) {
          chrome.storage.local.set({'activated_key': encdec.encrypt(obj_key), 'api_keys': encdec.encryptKeys(arr_api_keys)}, function() {
            updateActiveApiKeyCache(obj_key);
            resolve(id);
          });
        } else {
          chrome.storage.local.set({'api_keys': encdec.encryptKeys(arr_api_keys)}, function(){
            debugOutput({text: "Updated existing API Key", data: obj_key});
            resolve();
          });
        }
      });
    });
  }

  function deleteApiKey(id) {
    return new Promise(function(resolve, reject) {
      getApiKeys().then(function(arr_api_keys) {
        for (var i=0; i < arr_api_keys.length; i++) {
          if (id === arr_api_keys[i].id) {
            arr_api_keys.splice(i, 1);
            break;
          }
        }
        if (activeApiKeyCache.id === id) {
          chrome.storage.local.set({'activated_key': {}, 'api_keys': encdec.encryptKeys(arr_api_keys)}, function() {
            updateActiveApiKeyCache({});
            resolve(id);
          });
        } else {
          chrome.storage.local.set({'api_keys': encdec.encryptKeys(arr_api_keys)}, function(){
            debugOutput({text: "Deleted API Key", data: id});
            resolve(id);
          });
        }
      });
    });
  }

  // active key operation

  function getActivatedApiKey() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get('activated_key', function(data) {
        var enc_api_key = data['activated_key'];
        if($.isEmptyObject(enc_api_key)) {
          resolve(enc_api_key);
        } else {
          var api_key = encdec.decrypt(enc_api_key);
          resolve(api_key);
        }
      });
    });
  }

  function activateApiKey(key) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.set({'activated_key': encdec.encrypt(key)}, function() {
        updateActiveApiKeyCache(key);
        resolve(key);
      });
    });
  }

  function deleteActivatedApiKey() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.set({'activated_key': {}}, function() {
        updateActiveApiKeyCache({});
        resolve();
      });
    });
  }

  return {
    getApiKeys: getApiKeys,
    updateApiKey: updateApiKey,
    insertNewApiKey: insertNewApiKey,
    deleteApiKey: deleteApiKey,
    getActivatedApiKey: getActivatedApiKey,
    activateApiKey: activateApiKey,
    deleteActivatedApiKey: deleteActivatedApiKey
  }

})(this);
