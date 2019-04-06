# Equalizer

## Setting up the project

### 1. Clone the repo
```
git clone https://github.com/shreyasseshadri/Equalizer.git

```
### 2. Install the required dependencies

#### NOTE : The paths specified in the commands are relative paths from the root folder  

Client Dependencies.
```
cd Equalizer
npm install
```
Server dependencies

```
cd Equalizer/EqualizerServer
npm install
```

### 3. Running server and client

Server

```
cd EqualizerServer

npm start
```

Client
```
cd Equalizer
npm start

```

This commands starts the clients at two locations

```
localhost:9966
localhost:9966/#init
```
The client with location # as init is the client to start the exchange of network ID

## Server Usage

Server currently has <i>three</i> routes
- `/exchange` - A web socket connection that connects with the <i>first</i> client  mentioned above, responsible for exchange of network IDs.
-  `/exchange/init` - A web socket that connects with the <i>second</i> client mentioned above, responsible for exchange of network IDs.
- `/translate` - A route for POST requests for translation.

#### Usage of /translate route

Translate route listens for POST requests, and is responsible for translation
It requires two paramaters `<string to be translated>` and `<Language to which it must translate>` <b>in ISO format</b>.

Sample fetch request for translate
```
fetch('http://localhost:3000/translate', {
        method: 'POST',
        mode:'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text:'धन्यवाद',
            to:'en', //ISO format for english
        }),
        })
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            // Response JSON from server
            console.log(json);
            })
            .catch(function (error) {
                throw error;
    });

```
Response from the server contains
- Translated text
- Identified language of the text sent by the client

```
{
    result: "Thank you", 
    language: "hi" //ISO format for hindi
}
```