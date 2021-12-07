const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String, required: true }, //HD
        ownerName: { type: String, required: true }, //HD
        likes: { type: [String], required: true }, //HD
        dislikes: { type: [String], required: true }, //HD
        comments: { type: [[String,String]], required: false }, //HD
        views: { type: Number, required: true }, //HD
        published: { type: Date, required: true }, //HD
        isListPublished: {type: Boolean, required: true} //HD
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
