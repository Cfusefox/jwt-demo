const mongoose = require("mongoose");
/**通过mongodb://username:password@host1:port/database_name?authSource指定验证前面身份信息的数据库来源 */
const db = mongoose.connect('mongodb://localhost/DBTest', (err) => {
    if(err) {
        console.log(err)
        return;
    }
    console.log("connect success")
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
})
mongoose.model('User', UserSchema)
module.exports = db;
