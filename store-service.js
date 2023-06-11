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



function addItem(itemData) {
    return new Promise((resolve, reject) => {
      if (itemData.published === undefined) {
        itemData.published = false;
      } else {
        itemData.published = true;
      }
  
      itemData.id = items.length + 1;
  
      items.push(itemData);
      resolve(itemData);
    });
  }



  function getItemsByCategory(category) {
    return new Promise((resolve, reject) => {
      const filteredItems = items.filter((item) => item.category === category);
      if (filteredItems.length > 0) {
        resolve(filteredItems);
      } else {
        reject('No results returned');
      }
    });
  }
  
  
  
  function getItemsByMinDate(minDateStr) {
    return new Promise((resolve, reject) => {
      const filteredItems = items.filter((item) => new Date(item.postDate) >= new Date(minDateStr));
      if (filteredItems.length > 0) {
        resolve(filteredItems);
      } else {
        reject('No results returned');
      }
    });
  }
  



  function getItemById(id) {
    return new Promise((resolve, reject) => {
      const item = items.find((item) => item.id === id);
      if (item) {
        resolve(item);
      } else {
        reject('No result returned');
      }
    });
  }
  
  
  





module.exports = {
    initialize,
    getAllItems,
    getPublishedItems,
    addItem,
    getCategories,
    getItemsByCategory,
    getItemsByMinDate,
    getItemById,
};
