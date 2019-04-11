var purgeJsonInput = (function(global) {
  'use strict';

  function loadPurgeJsonInputPurge(callback) {
    return new Promise(function(resolve, reject) {
      var tophtml = '<button id="purge_json_button" class="ui button icon small orange" data-tooltip="Purge" data-position="bottom right">';
      tophtml += '<i class="cog icon"></i></button>';
      var html = '';

      html += '<div class="ui message small">'; 
      html += '<p>You can enter your own JSON request body to purge cache objects.</p>';
      html += '</div>';

      html += '<div class="ui form small">';
      html += '<div class="field required">';
      html += '<label>Purge JSON Input';
      html += '<div id="json_status" class="ui small label basic float_label_right red">Invalid JSON</div>';
      html += '</label>';
      html += '<textarea id="json_input" rows="15" placeholder="Paste your request body here."></textarea>';
      html += '</div>';
      html += '</div>';
      resolve({html: html, tophtml: tophtml});
    });
  }

  return {
    loadPurgeJsonInputPurge: loadPurgeJsonInputPurge
  }
})(this);
