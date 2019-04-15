chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type !== "purge") return;
  switch(message.action) {
    case "delete_all_log":
      purge.deleteAllPurgeLogs().then(function() {
        sendResponse({result: true})
      });
      break;
    default:
  }
  return true;
});

var purge = (function(global) {
  'use strict';

  function didServerRespond(string) {
    try {
      JSON.parse(string);
    } catch (err) {
      return false;
    }
    return true;
  }

  function getPurgeLog(reqid) {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get('purge_logs', function(data) {
        let obj_purge_logs = data['purge_logs'];
        if (typeof reqid === 'undefined') {
          resolve(obj_purge_logs); 
        } else {
          resolve(obj_purge_logs[reqid]);
        }
      });
    });
  }

  function getLastPurgeLog() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.get('latest_purge_result', function(data) {
        resolve(data['latest_purge_result']);
      });
    });
  }

  function savePurgeLog(request, result) {
    return new Promise(function(resolve, reject) {
      let log = {
        logid: + request.reqid,
        requested_time: new Date().toString(),
        url: request.url,
        purge_type: request.purge_type,
        used_key: encdec.encrypt(activeApiKeyCache),
        requested_body: JSON.stringify(request.data),
        response: result
      }
      chrome.storage.local.get('purge_logs', function(data) {
        var obj_logs = data['purge_logs'];
        obj_logs[log.logid] = log;
        var keys = Object.keys(obj_logs);
        keys.map(x => parseInt(x));
        keys.sort(function(a, b) { return b-a });
        if (keys.length > PurgeLogSaveLimit) {
          delete obj_logs[keys.pop()];
          debugOutput({text: "reached purge log limit. Removed the oldest log"}); 
        }
        chrome.storage.local.set({'purge_logs': obj_logs, 'latest_purge_result': log}, function() {
          debugOutput({text: "new purge log was inserted", data: log}); 
          resolve(log);
        });
      });
    });
  }

  function deleteAllPurgeLogs() {
    return new Promise(function(resolve, reject) {
      chrome.storage.local.set({'purge_logs': {}}, function() {
        resolve(); 
      });
    });
  }

  function createReqBody(type, arr_targets) {
    switch(type) {
      case "url":
        return { 'files': arr_targets };
        break;
      case "hostname":
        return { 'hosts': arr_targets };
        break; 
      case "tag": 
        return { 'tags': arr_targets };
        break;
      case "custom":
        var arr_url = arr_targets[0];
        var obj_headers = arr_targets[1];
        var files = [];
        $.each(obj_headers, function(key, value) {
          if (key.trim() == "") {
            delete obj_headers[key];
          }
        });
        for (var i=0; i < arr_url.length; i++) {
          files.push({'url': arr_url[i], 'headers': obj_headers});
        }
        return { 'files': files };
        break;
      case "json":
        return arr_targets[0];
        break;
      case "all":
        return { 'purge_everything': true };
        break;
      default:
        break;
    }
  }

  function requestPurge(purge) {
    return new Promise(function(resolve, reject) {
      var request_body = createReqBody(purge.type, purge.targets);
      let request = {
        reqid: new Date().getTime().toString(),
        url: "https://api.cloudflare.com/client/v4/zones/" + activeApiKeyCache.zone_id + "/purge_cache",
        headers: { 
          "Content-Type": "application/json",
          "X-Auth-Key": activeApiKeyCache.api_key,
          "X-Auth-Email": activeApiKeyCache.email
        },
        purge_type: purge.type,
        data: request_body
      }
      http.postRequest(request).then(function(result) {
        savePurgeLog(request, newResponseObj(request.reqid, result)).then(function(newlog) {
          resolve(JSON.stringify(newlog));
        });
      }).catch(function(err_msg) {
        savePurgeLog(request, newResponseObj(request.reqid, err_msg)).then(function(newlog) {
          reject(new Error(JSON.stringify(newlog)));
        });
      });
    });
  }

  function createResponseHeaderObj(response_headers) {
    let headers = {};
    try {
      var split = response_headers.split(/[\r\n]+/);
      var map_split = split.map(value => value.split(/:/));
      map_split.forEach(each => {
        headers[each[0].trim().toLowerCase()] = each[1].trim();
      });
    } catch (err) {
      return headers;
    }
    debugOutput({text: "response_headers", data: headers});
    return headers;
  }

  function newResponseObj(reqid, result) {
    let raw_response_text = result.responseText;
    let raw_response_headers = result.responseHeaders;
    let response_headers = createResponseHeaderObj(raw_response_headers);
    return {
      reqid: reqid,
      response_text: raw_response_text,
      server_responded: didServerRespond(raw_response_text),
      response_headers: response_headers
    }
  }

  return {
    requestPurge: requestPurge,
    getPurgeLog: getPurgeLog,
    deleteAllPurgeLogs: deleteAllPurgeLogs,
    getLastPurgeLog: getLastPurgeLog
  }
})(this);
