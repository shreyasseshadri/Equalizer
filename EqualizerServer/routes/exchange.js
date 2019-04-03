const express = require("express");
const translate = require('@vitalets/google-translate-api');

const router = express.Router();

var clients = {};

var init_id = "default";
router.ws("/", function (ws, req) {
    clients["non_init"] = ws;
    console.log('Non init client connected');


    //Wait till non init client gives back id and give back to init
    ws.on("message", function (msg) {
        // console.log("non init msg:",msg);

        if (clients.hasOwnProperty("init"))
            clients["init"].send(msg);
        else console.log("init client not connected");
    });
});

router.ws("/init", function (ws, req) {
    clients["init"] = ws;

    console.log("init client connected");
    ws.on("message", function (msg) {
        // init_id = msg;
        if (clients.hasOwnProperty("non_init"))
            clients["non_init"].send(msg);
    });
});
module.exports = router;