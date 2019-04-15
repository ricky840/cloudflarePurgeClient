var purgeLogPage = (function(global) {
  'use strict';

  function viewRawPurgeLog(reqid, callback) {
    var html = '';
    var html2 = ''
    purge.getPurgeLog(reqid).then(function(log) { let purge_response = log.response;
      let purge_result = purge_response.server_responded === true ? JSON.parse(purge_response.response_text) : purge_response.response_text;
      if ($.isEmptyObject(purge_response.response_headers)) {
        var ray_id = "Could not find cf-ray header in response";
        var response_headers = {};
      } else {
        var response_headers = purge_response.response_headers;
        var ray_id = response_headers["cf-ray"];
      }
      var purge_result_txt = typeof purge_result === "object" ? JSON.stringify(purge_result, null, 2) : purge_result;
      let key = encdec.decrypt(log.used_key);

      html += '<div class="ui label small">API Request</div>';
      html += '<div class="ui list small middle aligned selection">';
      html += '  <a class="item">';
      html += '    <i class="right triangle icon"></i>';
      html += '    <div class="content">';
      html += '      <div class="header">Zone</div>';
      html += '      <div class="description">'+ key.zone_domain +'</div>';
      html += '    </div>';
      html += '  </a>';
      html += '  <a class="item">';
      html += '    <i class="right triangle icon"></i>';
      html += '    <div class="content">';
      html += '      <div class="header">Email</div>';
      html += '      <div class="description">'+ key.email +'</div>';
      html += '    </div>';
      html += '  </a>';
      html += '  <a class="item">';
      html += '    <i class="right triangle icon"></i>';
      html += '    <div class="content">';
      html += '      <div class="header">Zone Id</div>';
      html += '      <div class="description">'+ key.zone_id +'</div>';
      html += '    </div>';
      html += '  </a>';
      html += '  <a class="item">';
      html += '    <i class="right triangle icon"></i>';
      html += '    <div class="content">';
      html += '      <div class="header">Purge Type</div>';
      html += '      <div class="description">'+ purgeTypes[log.purge_type] +'</div>';
      html += '    </div>';
      html += '  </a>';
      html += '</div>';

      html += '<div class="ui label small orange">Request URL</div>';
      html += '<div class="ui message msg_code">';
      html += '<pre class="pre_code">' + log.url + '</pre>';
      html += '</div>';

      html += '<div class="ui label small red">Ray ID</div>';
      html += '<div class="ui message msg_code">';
      html += '<pre class="pre_code">' + ray_id + '</pre>';
      html += '</div>';

      html += '<div class="ui label small purple">Response Body</div>';
      html += '<div class="ui message msg_code">';
      html += '<pre class="pre_code">' + purge_result_txt + '</pre>';
      html += '</div>';

      html += '<div class="ui label small teal">Request Body</div>';
      html += '<div class="ui message msg_code">';
      html += '<pre class="pre_code">' + JSON.stringify(JSON.parse(log.requested_body), null, 2) + '</pre>';
      html += '</div>';

      html += '<div class="ui label small brown">Response Headers</div>';
      html += '<div class="ui message msg_code">';
      html += '<pre class="pre_code">' + JSON.stringify(response_headers, null, 2) + '</pre>';
      html += '</div>';

      html += '<div class="ui label small blue">API Key</div>';
      html += '<div class="ui message msg_code">';
      html += '<pre class="pre_code">' + key.api_key + '</pre>';
      html += '</div>';

      callback({html: html, tophtml: html2});
    });
  }

  function loadPurgeLogListPage(callback) {
    purge.getPurgeLog().then(function(logs) {
      var html2 = '<button id="delete_all_purgelog_button" class="ui button icon small orange" data-tooltip="Delete all logs" data-position="bottom right">';
      html2 += '<i class="trash icon"></i></button>';
      var html = '<div id="data-container"></div>';
      if($.isEmptyObject(logs)) {
        html += '<div class="ui message small">';
        html += '<div class="header">No Purge Log</div>';
        html += '<p>Recent '+ PurgeLogSaveLimit + ' logs will be stored.</p>';
        html += '</div>';
      } else {
        html += '<div class="pagi-footer">';
        html += '<div class="ui divider"></div>';
        html += '<div id="pagination-container"></div>';
      }
      html += '</div>';

      callback({html: html, tophtml: html2});
    }); 
  }

  return {
    viewRawPurgeLog: viewRawPurgeLog,
    loadPurgeLogListPage: loadPurgeLogListPage
  }
})(this);
