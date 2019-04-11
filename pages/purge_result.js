var purgeResultPage = (function(global) {
  'use strict';

  function loadPurgeResultPage(purgelogTxt, callback) {
    let purgelog = JSON.parse(purgelogTxt);
    let purge_response = purgelog.response;
    let purge_result = purge_response.server_responded === true ? JSON.parse(purge_response.response_text) : purge_response.response_text;
    var html = '';
    var html2 = '<button id="see_purge_log" class="ui orange button small icon" data-tooltip="Log" data-position="bottom right" reqid="'+ purgelog.logid +'">';
    html2 += '<i class="archive icon"></i></button>';
    
    if (typeof purge_result === "object") {
      switch (purge_result.success) {
        case true: // purge successful
          html += '<div id="purge_result_page" class="ui icon positive message small">';
          html += '<i class="thumbs up icon"></i>';
          html += '<div class="content" style="margin-left: 10px;">';
          html += '<div class="header">Purge Success</div>';
          html += '<p>Successfully purged the objects.</p>';
          html += '</div>';
          html += '</div>';

          html += '<div class="ui message small">';
          html += '<ul class="list">';
          html += '<li>Purge Id<a class="ui basic label inline_label">' + purge_result.result.id + '</a></li>';
          html += '<li>Please make sure to delete the browser cache to confirm the result.</li>';
          html += '<li>Check<a class="ui basic label inline_label">disable cache</a>if you are using a browser developer tools.</li>';
          html += '</ul>';
          html += '</div>';

          break;
        case false: // purge failed
          var error_codes = purge_result.errors;
          var number_of_errors = error_codes.length;
          var itemhtml = '';
          for(var i=0; i < error_codes.length; i++) {
            itemhtml += '<div class="item">';
            itemhtml += '<a class="ui horizontal label" data-tooltip="'+ purgeErrorCodeDesc(error_codes[i].code) +'" data-position="top left">';
            itemhtml += error_codes[i].code +'</a>';
            itemhtml += '<div class="content" style="display:block; word-break: break-all; margin-top: 5px;">';
            itemhtml += '<p>'+ error_codes[i].message +'</p>';
            itemhtml += '</div>';
            itemhtml += '</div>';
            // error_chains
            if(error_codes[i].error_chain !== undefined) {
              var error_chains = error_codes[i].error_chain;   
              number_of_errors += error_chains.length;
              for(var j=0; j < error_chains.length; j++) {
                itemhtml += '<div class="item">';
                itemhtml += '<a class="ui horizontal label" data-tooltip="'+ purgeErrorCodeDesc(error_chains[j].code) +'" data-position="top left">';
                itemhtml += error_chains[j].code +'</a>';
                itemhtml += '<div class="content" style="display:block; word-break: break-all; margin-top: 5px;">';
                itemhtml += '<p>'+ error_chains[j].message +'</p>';
                itemhtml += '</div>';
                itemhtml += '</div>';
              }
            }
          }
          html += '<div id="purge_result_page" class="ui icon negative message small">';
          html += '<i class="exclamation circle icon"></i>';
          html += '<div class="content">';
          html += '<div class="header">Purge Failed <a class="ui label red inline_label">' + number_of_errors + ' errors</a></div>';
          html += '<p>Check error messages and try again!</p>';
          html += '</div>';
          html += '</div>';
          html += '<div class="ui relaxed list small">';
          html += itemhtml;
          html += '</div>';
          break;
        default:
          break;
      }
    } else { // purge failed - didn't get response from api server
      html += '<div id="purge_result_page" class="ui icon negative message">';
      html += '<i class="far fa-thumbs-down fa-4x"></i>'
      html += '<div class="content" style="margin-left: 10px;">';
      html += '<div class="header">Purge Failed</div>';
      html += '</div>';
      html += '</div>';
      if (purge_result == "") {
        html += '<div class="ui message">';
        html += '<div class="header">No response returned</div>';
        html += '<p>Please make sure you are connected to the internet!</p>';
        html += '</div>';
      }
    }
    callback({html: html, tophtml: html2});
  }

  return {
    loadPurgeResultPage: loadPurgeResultPage
  }
})(this);
