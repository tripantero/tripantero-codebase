const dbms = require('mongodb');
const { Schema, Optional} = require('tschema');
const url = process.env.MONGODB_URI

class Model {
    constructor(collectionName, schema = new Schema({})) {
        this.collectionName = collectionName;
        this.schema = schema;
        this.connect().then((result) => {
            this.collection = result.collection;
            this.database = result.database;
        })
    }
    
    connect() {
        return new Promise((resolve, reject)=> {
            dbms.MongoClient.connect(url, {useUnifiedTopology: true}, (err, result) => {
                if(err) return reject(err);
                console.log("Connected to collection: "+this.collectionName);
                resolve({
                    // collection: result.db("heroku_gmk4fgjw").collection(this.collectionName),
                    collection: result.db("tripanterodb").collection(this.collectionName),
                    database: result
                });
            })
        })
    }

    save(data = {}, validate = true) {
        if(Array.isArray(data) && validate) {
            data.forEach((value)=> {
                try {
                    this.validate(value);
                    this.save(value, false)
                } catch (error) {
                    console.log("Schema error on collection: "+this.collectionName);
                }
            });
        } else {
            try {
                if(validate) {
                    this.validate(data);
                }
                this.collection.insert(data, (err, _)=> {
                    if(err) return console.log("error insertion on collection: "+this.collectionName);
                })

            } catch (error) {
                console.log("Schema error on database: "+this.collectionName);
            }
        }
    }

    validate(singledata = {}){
        this.schema.validate(singledata);
    }

    findOne(query = {}, callback = (err, docs) => {}) {
        this.collection.findOne(query, callback);
    }

    find(query = {}, callback = (err, docs) => {}) {
        this.collection.find(query).toArray(callback);
    }

    remove(query = {}) {
        this.collection.deleteMany(query, (err, count) => {
            if(err) return console.log("error removing on collection: "+this.collectionName);
            console.log("removing on collection: "+this.collectionName +" with count: "+count);
        });
    }

    update(query, records, callback = (count)=>{}) {
        this.collection.update(query, records, (err, result) => {
            if(err) return console.log("error updating on collection: "+this.collectionName);
            console.log("updating on collection: "+this.collectionName);
            callback(result);
        })
    }


    close() {
        this.database.close();
    }
}

module.exports = {
    Model: Model,
    Schema: Schema,
    Optional: Optional
}