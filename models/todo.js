const mongoose = require('mongoose')
const Schema = mongoose.Schemaconst
const todoSchema = new Schema({
    name: {
        type: String, // 資料型別是字串
        require: true // 這是個必填欄位
    }
})
module.exports = mongoose.model('Todo', todoSchema)