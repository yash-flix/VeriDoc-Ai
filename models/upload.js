const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    text:
    {
        type:String,
    },  
    image :
    {
        url:String,
        filename : String , 
    },
    video : 
    {
        url : String,
        filename : String
    }
    
})
const Upload = mongoose.model("Upload" , uploadSchema);