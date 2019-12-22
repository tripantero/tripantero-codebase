const dbms = require('nedb');
const { Schema, Optional} = require('tschema');

class Model {
    constructor(dbname, schema = new Schema({})) {
        this.dbname = dbname;
        this.database = new dbms({autoload: true, filename: `../database/${dbname}.bin`})
        this.schema;
    }


    save(data = this.schema) {
        if(Array.isArray(data)) {
            data.forEach((value)=> {
                try {
                    this.validate(value);
                } catch (error) {
                    console.log("Schema error on database: "+this.dbname);
                    console.log("cannot insert data: "+value);
                }
            });
        } else {
            try {
                this.validate(value);
            } catch (error) {
                console.log("Schema error on database: "+this.dbname);
                console.log("cannot insert data: "+value);
            }
        }
    }

    validate(singledata = this.Schema){
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
    Optional: Optional
}