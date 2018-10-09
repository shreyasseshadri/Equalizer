//  function startConverting()
//   {
//       console.log('scsc');
//       var r=document.getElementById('result');
//       var spr=new webkitSpeechRecognition();
//       spr.continuous=true;
//       spr.interimResults=true;
//       spr.lang='hi-IN';
//       spr.start();
//       console.log("here")
//       var ftr='';
//       spr.onresult=function(event){
//           var interimTranscripts='';
//           for(var i=event.resultIndex;i<event.results.length;i++)
//           {
//               var transcript=event.results[i][0].transcript;
//               console.log(transcript)
//               transcript.replace("\n","<br>")
//               if(event.results[i].isFinal){
//                   ftr+=transcript;
//               }
//               else
//               {
//                 interimTranscripts+=transcript;
//                 sendinterim(interimTranscripts);
//               }
//           }
//           r.innerHTML=ftr + '<span style="color:#999">'+interimTranscripts+'</span>';
//       };
//       spr.onerror=function(event){};
//   }

var getUserMedia = require('getusermedia')

getUserMedia({ video: true, audio: true }, function (err, stream) {
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

//  document.getElementById('send').addEventListener('click', function () {
 //   var yourMessage = document.getElementById('yourMessage').value
  //  peer.send(yourMessage)
 // })
    
peer.on('data', function (data) {
    document.getElementById('messages').textContent += data + ' ';
  })

  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)
    document.body.appendChild(video)
    video.src = window.URL.createObjectURL(stream)
    video.play()
    // ------------------------------------------------------

    var r=document.getElementById('result');
      var spr=new webkitSpeechRecognition();
      spr.continuous=true;
      spr.interimResults=true;
      spr.lang='hi-IN';
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
                  // sendinterim(ftr);
                  
              }
              else
              {
                interimTranscripts+=transcript;
                peer.send(interimTranscripts);
              }
          }
          r.innerHTML='my speech :'+ftr + '<span style="color:#999">'+interimTranscripts+'</span>';
      };
      spr.onerror=function(event){};

  })
})

