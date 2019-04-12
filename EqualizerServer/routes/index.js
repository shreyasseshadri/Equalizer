// const express = require("express");
// // const translate = require('@vitalets/google-translate-api');
//
// const router = express.Router();
//
//
//
//
// router.post("/translate",function (req,res) {
//
//   console.log(req.body.text);
//   const translate = require('extended-google-translate-api');
//
//   translate(req.body.text, "en", "hi").then( (results) => {
//       console.log(JSON.stringify(results, undefined, 2));
//         translate_res = JSON.stringify(results, undefined, 2);
//         // console.log(results.translation, "jiojoi uh kk");
//         console.log({'result':results.translation,'transcript':results.translationTranscription});
//         res.send(JSON.stringify({'result':results.translation,'transcript':results.translationTranscription}));
//   }).catch(console.log);
//
//   // translate(req.body.text, {to:req.body.to}).then(result => {
//   //   console.log(result.text);
//   //   //=> I speak English
//   //   res.send(JSON.stringify({'result':result.text,'language':result.from.language.iso}));
//   //   console.log(result.from.language.iso);
//   //   //=> nl
//   // }).catch(err => {
//   //   console.error(err);
//   // });
//
// });
//
// module.exports = router;
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


const express = require("express");
const translate = require('@vitalets/google-translate-api');

const router = express.Router();

router.post("/translate",function (req,res) {

  console.log(req.body);
  translate(req.body.text, {to:req.body.to}).then(result => {
    console.log(result.text);
    //=> I speak English
    res.send(JSON.stringify({'result':result.text,'language':result.from.language.iso}));
    console.log(result.from.language.iso);
    //=> nl
  }).catch(err => {
    console.error(err);
  });

});

module.exports = router;
