const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('Hi world')
})

app.listen(3000, () => {
    console.log('App is running on localhost: 3000')
})