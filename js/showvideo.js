alertify.YoutubeDialog||alertify.dialog("YoutubeDialog",function(){var a;return{main:function(a){return this.set({videoId:a})},setup:function(){return{options:{padding:!1,overflow:!1}}},build:function(){a=document.createElement("iframe"),a.frameBorder="no",a.width="100%",a.height="100%",this.elements.content.appendChild(a),this.elements.body.style.minHeight=.5*screen.height+"px"},settings:{videoId:void 0},settingUpdated:function(b,c,d){switch(b){case"videoId":a.src="https://www.youtube-nocookie.com/embed/"+d}},hooks:{onclose:function(){a.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}',"*")},onupdate:function(b,c,d){switch(b){case"resizable":d?(this.elements.content.removeAttribute("style"),a&&a.removeAttribute("style")):(this.elements.content.style.minHeight="inherit",a&&(a.style.minHeight="inherit"))}}}}});