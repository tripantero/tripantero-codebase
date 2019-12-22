const dbms = require('nedb');
const { Schema, Optional} = require('tschema');

class Model {
    constructor(dbname, schema = new Schema({})) {
        this.dbname = dbname;
        this.database = new dbms({autoload: true, filename: `../database/${dbname}.bin`})
        this.schema = schema;
    }


    save(data = {}, validate = true) {
        if(Array.isArray(data) && validate) {
            data.forEach((value)=> {
                try {
                    this.validate(value);
                    this.save(value, false)
                } catch (error) {
                    console.log("Schema error on database: "+this.dbname);
                }
            });
        } else {
            try {
                if(validate) {
                    this.validate(data);
                }
                this.database.insert(data, (err, _)=> {
                    if(err) return console.log("error insertion on db: "+this.dbname);
                })
                
            } catch (error) {
                console.log("Schema error on database: "+this.dbname);
            }
        }
    }

    validate(singledata = {}){
        this.schema.validate(singledata);
    }

    findOne(query = {}, callback = (err, docs) => {}) {
        this.database.findOne(query, callback);
    }

    find(query = {}, callback = (err, docs) => {}) {
        this.database.find(query, {}, callback);
    }

    remove(query = {}) {
        this.database.remove(query, {multi: true}, (err, count) => {
            if(err) return console.log("error removing on db: "+this.dbname);
            console.log("removing on db: "+this.dbname +" with count: "+count);
        });
    }

    update(query) {
        this.database.update(query, {}, {multi: true}, (err, count) => {
            if(err) return console.log("error updating on db: "+this.dbname);
            console.log("updating on db: "+this.dbname +" with count: "+count);
        })
    }

    isExist(query, callback = (condition = false)=>{}) {
        this.database.find(query, {}, (err, docs)=> {
            if(err) return console.log("error isExist operate on db: "+this.dbname);
            callback(docs.length > 0);
        })
    }

}

module.exports = {
    Model: Model,
    Schema: Schema,
    Optional: Optional
}