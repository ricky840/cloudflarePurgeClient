var loadScripts = function(urls) {
  let eventjs_base_url = 'popupevent/';
  for(var i=0; i < urls.length; i++) {
    var script = document.createElement("script");
    script.type = 'text/javascript';
    script.src = eventjs_base_url + urls[i];
    document.body.appendChild(script);
  }
}
