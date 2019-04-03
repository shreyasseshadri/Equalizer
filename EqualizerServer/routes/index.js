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