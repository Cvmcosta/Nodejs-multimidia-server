var P2P = require('socket.io-p2p');
var io = require('socket.io-client');

var socket = io()

var p2p = new P2P(socket)

p2p.on('start-stream', function () {
        p2p.usePeerConnection = true
})

p2p.on('stream', function (stream) {
        console.log("Stream")
        var vid = document.getElementById('camera-view');
        try {
                vid.srcObject = stream;
        } catch (error) {
                vid.src = window.URL.createObjectURL(stream);
        }
})


socket.on('enter_room', (user, room) => {
    _user = user
    $(document).attr("title", "NMS - " + _user)
    $("#username").attr("placeholder", _user)
    if(room == "video") setup_stream() 
})


$(".btn-floating").click( function(){
    var user = $("#username").val() ||  $("#username").attr("placeholder")
    socket.emit($(this).attr("id"), user)  
})


function setup_stream() {
        
        // Normalize the various vendor prefixed versions of getUserMedia.
        navigator.mediaDevices.getUserMedia = (navigator.mediaDevices.getUserMedia ||
                                navigator.mediaDevices.webkitGetUserMedia ||
                                navigator.mediaDevices.mozGetUserMedia || 
                                navigator.mediaDevices.msGetUserMedia);

        // Check that the browser supports getUserMedia.
        // If it doesn't show an alert, otherwise continue.
        if (navigator.mediaDevices.getUserMedia) {
                // Request the camera.
                navigator.mediaDevices.getUserMedia(
                // Constraints
                {
                        video: true
                }).then(
                        // Success Callback
                        function(localMediaStream) {
                                var socket = io()
                                var p2p = new P2P(socket, {peerOpts: {stream: localMediaStream}})

                                p2p.on('ready', function () {
                                        console.log(p2p.peerOpts.stream)
                                        p2p.usePeerConnection = true
                                        
                                        // p2p.emit('start-stream')
                                        
                                })
                                p2p.emit('ready', { peerId: p2p.peerId })
                                //p2p.emit('ready-client')
                                
                }).catch(
                        // Error Callback
                        function(err) {
                                alert(err)
                        }
                );
        } else {
                alert('Sorry, your browser does not support getUserMedia');
                
        }
}

