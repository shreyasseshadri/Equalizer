const express = require("express");
const router = express.Router();

var clients = {};

var init_id = "default";
router.ws("/", function (ws, req) {
    clients["non_init"] = ws;
    console.log('Non init client connected');
    // console.log("clients: ",clients)
    //Send init id to non init client
    console.log(init_id);
    if (init_id !== "default")
    {
        ws.send(init_id);

    }
    else console.log("init client not connected");

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
            init_id = msg;
    });
});
module.exports = router;