'use strict';

function getBackgroundDataURL(image) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/webp', false);
}

(function() {
    var background = document.getElementsByClassName('background')[0];
    var local = localStorage.getItem("background_ex");
    var timeout = 0;
    var waittime = 300000;
    if (local) {
        var obj = JSON.parse(local);
        background.setAttribute('style', 'background-image: url(' + obj.data + ')');
        timeout = waittime;
    }

    var img = new Image();
    img.onload = function() {
        var data = getBackgroundDataURL(img);
        background.setAttribute('style', 'background-image: url(' + data + ')');
        localStorage.setItem('background_ex', JSON.stringify({
            data: data,
            timestamp: new Date().getTime(),
        }));
        setTimeout(refresh, waittime);
    }

    var refresh = function() {
        var xml = new XMLHttpRequest();
        xml.onload = function(event) {
            var fr = new FileReader();
            fr.onload = function(){
                img.src = this.result;
            };
            fr.readAsDataURL(xml.response);
        }
        xml.open('GET', 'https://source.unsplash.com/random/1920x1080', true);
        xml.responseType = 'blob';
        xml.send();
    }
    setTimeout(refresh, timeout);
})();
