var getUserMedia = require('getusermedia')

getUserMedia({ video: true, audio: false }, function (err, stream) {
  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })
   peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value);
    peer.signal(otherId);
  })
    
 document.getElementById('send').addEventListener('click', function () {
   var yourMessage = document.getElementById('yourMessage').value
   peer.send(yourMessage)
 })

peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + ' ';
  })

  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)
    // document.body.appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()
    // ------------------------------------------------------

    var r=document.getElementById('result');
      var spr=new webkitSpeechRecognition();
      spr.continuous=true;
      spr.interimResults=true;
      spr.lang='en-IN';
      spr.start();
      console.log("here")
      var ftr='';
      spr.onresult=function(event){
          console.log('i got');
          var interimTranscripts='';
          for(var i=event.resultIndex;i<event.results.length;i++)
          {
              var transcript=event.results[i][0].transcript;
              console.log(transcript)
              transcript.replace("\n","<br>")
              if(event.results[i].isFinal){
                  ftr+=transcript;
                  if(transcript)
                  peer.send(transcript);
              }
              else
              {
                interimTranscripts+=transcript;
                
              }
          }
          r.innerHTML='my speech :'+ftr + '<span style="color:#999">'+ '</span>';
      };
      spr.onerror=function(event){};

  })
})


// ------------------------------------------------------------------------------------
// var Peer = require('simple-peer');
// var peer=new Peer('1');
// peer.on('open',function(id){
//   console.log('my id: '+id);
// });

// var conn = peer.connect('2');
// conn.on('open',function(){
//     conn.send('hello');
// });

// conn.on('data',function(data){
//    console.log('Recieved data : '+data);
// });

//-------------------------------------------------------------------------------------

// var Peer = require('simple-peer')
 
// // get video/voice stream
// navigator.getUserMedia({ video: true, audio: true }, gotMedia, function () {})
 
// function gotMedia (stream) {
//   var peer1 = new Peer('lxwrt',{ initiator: true, stream: stream})
//   var peer2 = new Peer('we234',{stream:stream ,host:'10.52.106.76',port:9966})
//   console.log('initialised peers')
//   peer1.on('signal', function (data) {
//     console.log('i got signalled')
//     peer2.signal(data)
    
//   })
 
//   peer2.on('signal', function (data) {
//     peer1.signal(data)
//   })
 
//   peer1.on('stream', function (stream) {
//     // got remote video stream, now let's show it in a video tag
//     var video = document.createElement('video')
//     document.body.appendChild(video)
//     document.body.appendChild(video)
//     video.src = window.URL.createObjectURL(stream)
//     video.play()
//   })
//   peer2.on('stream', function (stream) {
//     // got remote video strea m, now let's show it in a video tag
//     var video = document.createElement('video')
//     document.body.appendChild(video)
//     document.body.appendChild(video)
//     video.src = window.URL.createObjectURL(stream)
//     video.play()
//   })
// }