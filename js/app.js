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
        var data = JSON.parse(local).data;
        background.setAttribute('style', 'background-image: url(' + data + ')');
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
    }

    var refresh = function() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            setTimeout(refresh, waittime);
            if (xhr.status !== 200) {
                console.log(xhr.status);
                return;
            }
            var fr = new FileReader();
            fr.onload = function(){
                img.src = this.result;
            };
            fr.readAsDataURL(xhr.response);
        }
        xhr.open('GET', 'https://source.unsplash.com/random/1920x1080', true);
        xhr.responseType = 'blob';
        xhr.send();
    }
    setTimeout(refresh, timeout);
})();
