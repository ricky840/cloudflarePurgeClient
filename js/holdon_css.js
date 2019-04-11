var link = document.createElement('link');
link.href = chrome.extension.getURL("css/HoldOn.css");
link.rel = "stylesheet";
link.type = "text/css";
link.id = "73w5dc0b862mkvvrhuin";

if ($("#73w5dc0b862mkvvrhuin").length == 0) {
  $("body").append(link);
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "open") {
    var options = {
      theme: "sk-fading-circle",
      message: "Please wait.." + "<div id='holdon-message-object'>" + message.target + "</div>",
      textColor: "white"
    };
    HoldOn.open(options);
    sendResponse();
  } else {
    HoldOn.close(); 
    sendResponse();
  }
  return true;
});
