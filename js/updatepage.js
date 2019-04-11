var afterUpdatePage = (function(global) {
  'use strict';

  function enableTagifyInputOutside(domid) {
    let popup = chrome.extension.getViews({type: "popup"})[0];
    var input = popup.$("#display_area").find('#' + domid).tagify();
    var tagify = input.data('tagify');
    tagify.DOM.input.classList.add('tagify__input--outside');
    tagify.DOM.scope.parentNode.insertBefore(tagify.DOM.input, tagify.DOM.scope);
  }

  function enableTagify(domid) {
    let popup = chrome.extension.getViews({type: "popup"})[0];
    var input = popup.$("#display_area").find('#' + domid).tagify();
    var tagify = input.data('tagify');
  }

  function templating(data) {
    var html = '<div id="log_list" class="ui small middle aligned selection list">';
    $.each(data, function(index, log) {
      var purgetime = new Date(log.requested_time).toLocaleTimeString();
      var apikey = encdec.decrypt(log.used_key);
      var success = log.response.server_responded === true ? JSON.parse(log.response.response_text).success : false;
      var purge_result_img = (success === true) ? SuccessImage : FailureImage;
      html += '<div class="item">';
      html += '<img class="ui avatar image" src="'+ purge_result_img +'">';
      html += '<div class="content" id="' + log.logid + '">';
      html += '<a class="header">'+ apikey.zone_domain + '</a>';
      html += apikey.email;
      html += '</div>';
      html += '<div class="ui label mini right floated label_purge_log">' + purgetime + '<br>';
      html += '<div class="center floated">' + purgeTypes[log.purge_type] + '</div></div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function enablePagination(domid) {
    purge.getPurgeLog().then(function(logs) {
      var keys = Object.keys(logs);
      keys.map(x => parseInt(x));
      keys.sort(function(a, b) { return b-a });
      var arr_logs = [];
      for (var i=0; i < keys.length; i++) {
        arr_logs.push(logs[keys[i].toString()]); 
      }
      let popup = chrome.extension.getViews({type: "popup"})[0];
      // enable pagination only when there is a log, otherwise it will generate an error
      if (arr_logs.length > 0) {
        popup.$('#' + domid).pagination({
          dataSource: arr_logs,
          pageSize: NumberOfLogsInSinglePage,
          showPageNumbers: false,
          showNavigator: true,
          callback: function(data, pagination) {
            var html = templating(data);
            popup.$('#data-container').html(html);
          }
        });
      }
    });
  }

  return {
    enableTagifyInputOutside: enableTagifyInputOutside,
    enableTagify: enableTagify,
    enablePagination: enablePagination
  }
})(this);

var updatePage = (function(global) {
  'use strict';

  function update(data) {
    return new Promise(function (resolve, reject) {
      var popup = chrome.extension.getViews({type: "popup"})[0];
      if (data.previous_page === "main_page") {
        popup.$("#main_page").transition('slide right', function() {
          popup.$("#display_page").show();
          popup.$("#display_area").append(data.html);
          popup.$("#display_top_area").append(data.tophtml);
          resolve();
        });
      } else {
        popup.$("#display_top_area").empty();
        popup.$("#display_area").transition('slide ' + data.direction, function() {
          popup.$(this).removeClass('transition').removeClass('hidden').empty();
          popup.$("#display_area").append(data.html);
          popup.$("#display_top_area").append(data.tophtml);
          resolve();
        });
      }
    });
  }

  return {
    update: update
  }

})(this);
