var getUserMedia = require('getusermedia')

getUserMedia({video: true, audio: true}, function (err, stream) {
    if (err) return console.error(err)

    var Peer = require('simple-peer')
    var peer = new Peer({
        initiator: location.hash === '#init',
        trickle: false,
        stream: stream
    });

    var is_init = false;
    if (location.hash === '#init') is_init = true;
    var server_location = null;
    if (is_init) {
        server_location = 'ws://localhost:3000/exchange/init';
    } else server_location = 'ws://localhost:3000/exchange';
    var server = new WebSocket(server_location);

    var spr = new webkitSpeechRecognition();
    spr.continuous = true;
    spr.interimResults = true;


    peer.on('signal', function (data) {
        server.send(JSON.stringify(data));
        document.getElementById('yourId').value = JSON.stringify(data)
    });

    server.onmessage = function (e) {
        document.getElementById('otherId').value = e.data;
        peer.signal(JSON.parse(e.data));
    };

    // if (is_init) {
    //     server.onmessage = function (e) {
    //         document.getElementById('otherId').value = e.data;
    //         peer.signal(JSON.parse(e.data));
    //     };
    // } else {
    //     server.onmessage = function (e) {
    //         document.getElementById('otherId').value=e.data;
    //         perr.signal(JSON.parse(e.data));
    //     };
    // }
    document.getElementById('connect').addEventListener('click', function () {
        var otherId = JSON.parse(document.getElementById('otherId').value);
        peer.signal(otherId);
    });

    document.getElementById('send').addEventListener('click', function () {
        var yourMessage = document.getElementById('yourMessage').value
        peer.send(yourMessage)
        console.log('Message sent !');
    });

    peer.on('data', function (data) {
        document.getElementById('messages').textContent += data + ' ';
        //if(data!== null)
        //normaltext=data;
        // trans(data);
        //console.log(typeof(data) + " ,::" + data)
    });

    peer.on('stream', function (stream) {
        var video = document.createElement('video')
        // var binaryData = [];
        // binaryData.push(stream);
        // video.src =window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))
        video.srcObject = stream;
        document.body.appendChild(video)
        video.play()
        // ------------------------------------------------------

    });
    peer.on('connect', function () {
        console.log("inside connection")
        var r = document.getElementById('result');
        spr.lang = 'en-IN';
        spr.start();
        //console.log("here")
        var ftr = 'hello';
        spr.onresult = function (event) {
            //console.log('i got');
            var interimTranscripts = '';
            for (var i = event.resultIndex; i < event.results.length; i++) {
                var transcript = event.results[i][0].transcript;
                //normaltext=transcript;
                //trans(normaltext)
                //console.log("my voice" + transcript);
                transcript.replace("\n", "<br>");
                if (event.results[i].isFinal) {
                    ftr += transcript;
                    //normaltext=transcript;
                    //trans(normaltext)
                    peer.send(transcript);

                } else {
                    interimTranscripts += transcript;

                }
            }
            //  r.innerHTML='my speech :'+ftr + '<span style="color:#999">'+'</span>';
            console.log(ftr);
            //trans(ftr);

        };
        spr.onerror = function (event) {
        };
    });
    peer.on('close', function () {
        spr.stop();
    })

});


//translating....
function trans(normaltext) {
    //console.log("inside method")
    var LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
    var languageTranslator = new LanguageTranslatorV3({
        version: '2018-05-01',
        username: '349929ad-4b13-4e4d-9727-e4e2562e4bb9',
        password: 'YyDF8VYdudSK',
        url: 'https://gateway.watsonplatform.net/language-translator/api'
    });

    var parameters = {
        text: normaltext,
        model_id: 'hi-en'
    };

    languageTranslator.translate(
        parameters,
        function (error, response) {
            if (error)
                console.log(error)
            else
                console.log(JSON.stringify(response, null, 2));
            var stri = response["translations"][0].translation;
            document.getElementById('translated').innerHTML = stri + ' ';
            console.log(stri + "," + typeof (stri));
            //var tts = require('./speech.js');
            console.log("script changed");
            // do_synthesis(stri);

        }
    );
}

function do_synthesis(texter) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[10]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    msg.pitch = 2; //0 to 2
    msg.text = 'Hello World';
    msg.lang = 'en-US';

    msg.onend = function (e) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };

    speechSynthesis.speak(msg);

}


// function Synthesize(stringprint){
//   var request = require('request'),
//       xmlbuilder = require('xmlbuilder'),
//       wav = require('wav'),
//       Speaker = require('speaker');
//
//     // Note: new unified SpeechService API key and issue token uri is per region
//     // New unified SpeechService key
//     // Free: https://azure.microsoft.com/en-us/try/cognitive-services/?api=speech-services
//     // Paid: https://go.microsoft.com/fwlink/?LinkId=872236
//     var apiKey = "6000b3ba8e674e7890efe8bc8896955d";
//     var ssml_doc = xmlbuilder.create('speak')
//         .att('version', '1.0')
//         .att('xml:lang', 'hi-IN')
//         .ele('voice')
//         .att('xml:lang', 'hi-IN')
//         .att('xml:gender', 'Male')
//         .att('name', 'Microsoft Server Speech Text to Speech Voice (hi-IN, Hemant)')
//         .txt(stringprint)
//         .end();
//     var post_speak_data = ssml_doc.toString();
//     console.log("started to talk");
//
//     request.post({
//         url: 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken',
//         headers: {
//             'Ocp-Apim-Subscription-Key' : apiKey
//         }
//     }, function (err, resp, access_token) {
//         if (err || resp.statusCode != 200) {
//             console.log(err, resp.body);
//         } else {
//             try {
//                 request.post({
//                     url: 'https://westus.tts.speech.microsoft.com/cognitiveservices/v1',
//                     body: post_speak_data,
//                     headers: {
//                         'content-type' : 'application/ssml+xml',
//                         'X-Microsoft-OutputFormat' : 'riff-24khz-16bit-mono-pcm',
//                         'Authorization': 'Bearer ' + access_token,
//                         'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
//                         'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960',
//                         'User-Agent': 'TTSNodeJS'
//                     },
//                     encoding: null
//                 }, function (err, resp, speak_data) {
//                   console.log(speak_data);
//                     if (err || resp.statusCode != 200) {
//                         console.log(err, resp.body);
//                     } else {
//                         try {
//                             var reader = new wav.Reader();
//                             reader.on('format', function (format) {
//                                 reader.pipe(new Speaker(format));
//                             });
//                             var Readable = require('stream').Readable;
//                             var s = new Readable;
//                             s.push(speak_data);
//                             console.log("talk??");
//                             s.push(null);
//                             s.pipe(reader);
//                         } catch (e) {
//                             console.log(e.message);
//                         }
//                     }
//                 });
//             } catch (e) {
//                 console.log(e.message);
//             }
//         }
//     });
// }

// Your Google Cloud Platform project ID
// const projectId = 'equilizer-218915';
//
// // Instantiates a client
// const translate = new Translate({
//   projectId: projectId,
// });
//
// // The text to translate
// 	const text = "hello world";
// 	// The target language
// 	const target = 'ru';
//
// 	// Translates some text into Russian
// 	translate
// 	  .translate(text, target)
// 	  .then(results => {
// 	    const translation = results[0];
//
// 	    console.log(`Text: ${text}`);
// 	    console.log(`Translation: ${translation}`);
// 	document.getElementById('translated').textContent += `${translation}` + ' ';
//
// 	  })
// 	  .catch(err => {
// 	    console.error('ERROR:', err);
// 	  });


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

//   peer1.on('stream', function (