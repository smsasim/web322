

/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: S M Shamayel Asim
Student ID: 140863218
Date: 5/29/2023
Cyclic Web App URL: https://strange-pear-dungarees.cyclic.app/about
GitHub Repository URL: git@github.com:smsasim/web322.git

********************************************************************************/ 





const express = require('express');
const app = express();
const store_service = require('./store-service.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();
const upload = multer();



app.use(express.static('public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));


//cinfiguration for cloudinary

cloudinary.config({ 
    cloud_name: 'dbive2awg', 
    api_key: '931147177796676', 
    api_secret: 'bs45j9ryOD7bTCOUky1SU0t1Sb4' 
  });


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





app.get('/item/:id', (req, res) => {
    const itemId = req.params.id;
    store_service.getItemById(itemId)
      .then((item) => {
        res.json(item);
      })
      .catch((error) => {
        console.error(error);
        res.status(404).json({ error: 'Item not found' });
      });
  });


app.get('/items', (req, res) => {
    const { category, minDate } = req.query;
  
    if (category) {
      store_service.getItemsByCategory(category)
        .then((filteredItems) => {
          res.json(filteredItems);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Failed to fetch items' });
        });
    } else if (minDate) {
      store_service.getItemsByMinDate(minDate)
        .then((filteredItems) => {
          res.json(filteredItems);
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Failed to fetch items' });
        });
    } else {
        store_service.getAllItems()
        .then(items => {
            let itemsString = items.map(item => JSON.stringify(item)).join(', ');
            res.send(itemsString);
        })
        .catch(err => res.status(500).send(err));
    }
  });


  
app.get('/items/add', (req, res) => {
    res.sendFile(__dirname + '/views/add_item.html');
    });


//add items

app.post('/items/add', upload.single('featureImage'), async (req, res) => {

    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
    
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
    
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
    
        upload(req).then((uploaded)=>{
            processItem(uploaded.url);
        });
    }else{
        processItem("");
    }
     
    function processItem(imageUrl){
        req.body.featureImage = imageUrl;
    
        const newItem = {
        
        title: req.body.title,
        description: req.body.body,
        featureImage: req.body.featureImage,
        category : req.body.category,
        visibility : req.body.published,
        
        };

        store_service.addItem(newItem)
        .then((addedItem) => {
            res.redirect('/items');
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to add item' });
        });
    } 
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
const PORT = process.env.PORT;

store_service.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to initialize store service:", err);
    });
