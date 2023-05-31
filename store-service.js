const fs = require('fs').promises; 

let items = [];
let categories = [];

function initialize() {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/items.json', 'utf8')
            .then(data => {
                items = JSON.parse(data);
                return fs.readFile('./data/categories.json', 'utf8');
            })
            .then(data => {
                categories = JSON.parse(data);
                resolve();
            })
            .catch(err => {
                reject("Unable to read file");
            });
    });
}

function getAllItems() {
    return new Promise((resolve, reject) => {
        if(items.length === 0) {
            reject("No results returned");
        } else {
            resolve(items);
        }
    });
}

function getPublishedItems() {
    return new Promise((resolve, reject) => {
        const publishedItems = items.filter(item => item.published);
        if(publishedItems.length === 0) {
            reject("No results returned");
        } else {
            resolve(publishedItems);
        }
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        if(categories.length === 0) {
            reject("No results returned");
        } else {
            resolve(categories);
        }
    });
}

module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    getCategories
};
