const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose); //will load the currency type into mongoose
const Currency = mongoose.Types.Currency;


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
    }
},
{
    timestamps:true
});
//Creating a model from our schema and giving it a name 'Dish'
//Mongoose will automatically create a collection with the plural of the model name. for e.g. the collection will be created with the name 'Dishes' in this case.
//The name for our schema is 'Dish'. So when the documents are created of the type 'Dish', mongoose automatically arranges them in a colllection and the name of that 
// collection will be plural of 'Dish' i.e. 'Dishes'. So we automatically get the collection 'Dishes' and we do not have to explicitly create it.
var Dishes = mongoose.model('Dish', dishSchema); 

module.exports = Dishes;