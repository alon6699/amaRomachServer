import * as mongoose from 'mongoose';
import { Product } from '../schemas/product.schema';

const dbConnectionString = "mongodb://localhost:27017/shop";

mongoose.connect(dbConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('yay');
    Product.find().then(products => {
        console.log(products);
    }).catch(e => console.log('error ', e));

    Product.findOne({ 'name': 'Coconut' }).then(product => {
        console.log(product);
    }).catch(e => console.log('error ', e));
});
