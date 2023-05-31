
/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: S M Shamayel Asim
Student ID: 140863218
Date: 5/29/2023
Cyclic Web App URL: _______________________________________________________
GitHub Repository URL: git@github.com:smsasim/web322.git

********************************************************************************/ 





const express = require('express');
const app = express();
const store_service = require('./store-service.js');

app.use(express.static('public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Route to redirect from "/" to "/about"
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Route to serve the about.html file
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.get('/shop', (req, res) => {
    store_service.getPublishedItems()
        .then(items => {
            let itemsString = items.map(item => JSON.stringify(item)).join(', ');
            res.send(itemsString);
        })
        .catch(err => res.status(500).send(err));
});

app.get('/items', (req, res) => {
    store_service.getAllItems()
        .then(items => {
            let itemsString = items.map(item => JSON.stringify(item)).join(', ');
            res.send(itemsString);
        })
        .catch(err => res.status(500).send(err));
});

app.get('/categories', (req, res) => {
    store_service.getCategories()
        .then(categories => {
            let categoriesString = categories.map(category => JSON.stringify(category)).join(', ');
            res.send(categoriesString);
        })
        .catch(err => res.status(500).send(err));
});

app.use('*', (req, res) => {
    res.status(404).send('Page not found');
});

// Setting up the port for the server to listen on
const PORT = process.env.PORT || 8080;

store_service.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize store service:", err);
    });
