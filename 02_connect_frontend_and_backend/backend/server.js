// this is common js.
// const express = require('express')
//same as above.
//this below import syntax is in module js so when we use module js then in that case we need to add a "type":"module" in package.json
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send("server is ready");
});

//get a list of 5 jokes.

app.get('/api/jokes', (req, res) => {
  //array of objects.These jokes will be displayed in the frontend.
  const jokes = [
    {
      id: 1,
      title: 'first joke',
      content:'This is first joke'
    },
    {
      id: 2,
      title: 'second joke',
      content:'This is second joke'
    },
    {
      id: 3,
      title: 'third joke',
      content:'This is third joke'
    },
    {
      id: 4,
      title: 'fourth joke',
      content:'This is fourth joke'
    },
  ];
  res.send(jokes);
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`listening to the port ${port}`);
});


//from here move to 02_my_notes inside frontend.

