postMessage("I\'m working before postMessage(\'ali\').");

onmessage = function(oEvent) {
    postMessage("Hi " + oEvent.data);
};


setTimeout(function() {
    postMessage("I\'ss");
}, 2000)