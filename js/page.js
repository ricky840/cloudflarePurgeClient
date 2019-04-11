chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type !== "load") return;
  mainPage.loadActiveKey();
  mainPage.loadActiveKeyTop();
  mainPage.loadClientVersion();
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type !== "page") return;

  // see if it is back or forward
  if (message.previous_page === undefined && message.page === "back") {
    var forward_page = backPages.pop();
    debugOutput({text: "Page_location", data: backPages});
    var direction = "left";
  } else {
    var forward_page = message.page;
    backPages.push(message.previous_page);
    debugOutput({text: "Page_location", data: backPages});
    var direction = "right";
  }

  switch(forward_page) {
    case "main_page": // when it goes back to main page
      mainPage.loadMainPage();
      mainPage.loadActiveKey();
      break;
    case "purge_by_url": // when purge by url is clicked
      purgeByUrlPage.loadPage().then(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction}).then(function(result) {
          afterUpdatePage.enableTagifyInputOutside('urls');
        });
      });
      break;
    case "purge_result_page": // when purge button is clicked
      if ($.isEmptyObject(activeApiKeyCache)) {
        sendResponse({result: false, msg: "Please Activate API Key First!"}); 
        backPages.pop();
        break;
      }
      if (direction === 'right') {
        purge.requestPurge(message.purge).then(function(result) {
          purgeResultPage.loadPurgeResultPage(result, function(htmls){
            updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
            sendResponse({result: true}); 
          });
        }).catch(function(err) {
          purgeResultPage.loadPurgeResultPage(err.message, function(htmls){
            updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
            sendResponse({result: false}); 
          });
        });
      } else { // when back button was clicked
        purge.getLastPurgeLog().then(function(log) {
          purgeResultPage.loadPurgeResultPage(JSON.stringify(log), function(htmls){
            updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
          });
        });
      }
      break;
    case "see_purge_log": // purge log detail page
      purgeLogPage.viewRawPurgeLog(message.reqid, function(htmls){
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
      });
      break;
    case "key_list_page": // when manage key clicked
      manageKey.loadApiKeyList(function(htmls){
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
      });
      break;
    case "see_key_info": // key information
      manageKey.loadApiKeyInfo(message.key_id, function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
      });
      break;
    case "add_new_key": // add new key
      manageKey.loadNewKeyPage(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
      });
      break;
    case "log_list_page":
      purgeLogPage.loadPurgeLogListPage(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction}).then(function(result) {
          afterUpdatePage.enablePagination('pagination-container');
        });
      });
      break;
    case "purge_by_host":
      purgeByHost.loadHostPurge().then(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction}).then(function(result) {
          afterUpdatePage.enableTagify('hostname');
        });
      });
      break;
    case "purge_by_tag":
      purgeByTag.loadTagPurge().then(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction}).then(function(result) {
          afterUpdatePage.enableTagify('tag');
        });
      });
      break;
    case "purge_custom_page":
      purgeCacheKey.loadCustomCacheKeyPurge().then(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction}).then(function(result) {
          afterUpdatePage.enableTagifyInputOutside('custom_purge_urls');
        });
      });
      break;
    case "purge_json":
      purgeJsonInput.loadPurgeJsonInputPurge().then(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
      });
      break;
    case "purge_all":
      purgeAll.loadPurgeAllPage().then(function(htmls) {
        updatePage.update({html: htmls.html, tophtml: htmls.tophtml, current_page: message.page, previous_page: message.previous_page, direction: direction});
      });
      break;
  default:
    // code block
  }

  return true;
});
