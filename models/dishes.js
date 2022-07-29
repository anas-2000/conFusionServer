const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose); //will load the currency type into mongoose
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

const dishSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true

    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema] // comments is an array of the type commentSchema 
    //comments documents become  sub-documents in the dish document
    // We are storing all the comments about a dish inside the dish itself as an array of comment documents.
},
{
    timestamps:true
});
//Creating a model from our schema and giving it a name 'Dish'
//Mongoose will automatically create a collection with the plural of the model name. for e.g. the collection will be created with the name 'Dishes' in this case.
//The name for our schema is 'Dish'. So when the documents are created of the type 'Dish', mongoose automatically arranges them in a colllection and the name of that 
// collection will be plural of 'Dish' i.e. 'Dishess'. So we automatically get the collection 'Dishes' and we do not have to explicitly create it.
var Dishes = mongoose.model('Dish', dishSchema); 

module.exports = Dishes;