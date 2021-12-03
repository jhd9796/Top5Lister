const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true }, //HD
        ownerName: { type:String, required: true} //HD
        
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
