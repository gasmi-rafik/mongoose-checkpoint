const express = require("express");
const app = express()
const mongoose = require("mongoose");
// Install and setup mongoose:
const port = 3000

require("dotenv").config({ path: ".env" });
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Database connection successful");
    })
    .catch((err) => {
        console.log(err)
        console.error("Database connection error");
    });

app.listen(port, () => {
    console.log(` is runing .....
    Example app listening at http://localhost:${port}`)
})

// Create a person having this prototype:

var Schema = mongoose.Schema;

var personSchema = new Schema({
    name: String,
    age: Number,
    favouriteFoods: [String]

})
//   Create and Save a Record of a Model:
const Model = mongoose.Model;


const Person = mongoose.model('person', personSchema)

var person = new Person({
    name: 'rafik',
    age: 27,
    favoriteFoods: ['orange']

})
person.save((err, data) => {
    if (err) { console.log(err) }
})

//   Create Many Records with model.create()
var createManyPeople = function (arrayOfPeople, done) {

    Model.create(arrayOfPeople, (err, data) => err ? done(err) : done(null, data));

};

//   Use model.find() to Search Your Database
var findPeopleByName = function (personName, done) {

    var query = Person.find({ name: personName })
    query.exec(function (err, data) {
        if (err) return done(err)
        return done(null, data);
    });
}

//  Use model.findOne() to Return a Single Matching Document from Your Database
var findOneByFood = function (food, done) {
    Person.findOne({ favoriteFoods: `orange` }, function (err, data) {
        if (err) {
            return done(err);
        }
        return done(null, data);

    });

};

// Use model.findById() to Search Your Database By _id
var findPersonById = (Id, done) => {
    Person.findById(Id, (err, data) => err ? done(err) : done(null, data));
};

// Perform Classic Updates by Running Find, Edit, then Save

var findEditThenSave = function (Id, done) {
    var foodToAdd = 'Pizza';
    var Person = Person.findById(Id, function (err, person) {
        if (err) return console.log(err);
        person.favoriteFoods.push(foodToAdd);
        person.save(function (err, data) {
            if (err) console.log(err);
            done(null, data)
        });
    })
}

//   Perform New Updates on a Document Using model.findOneAndUpdate()


var findAndUpdate = function (personName, done) {
    var ageToSet = 20;

    Person.findOneAndUpdate(
        { name: personName },
        { age: ageToSet },
        { new: true },
        (err, data) => {
            if (err) {
                done(err);
            }
            done(null, data);
        }
    )
};


// Delete One Document Using model.findByIdAndRemove

var removeById = function (personId, done) {
    Model.findByIdAndRemove(personId, (err, data) => err ? done(err) : done(null, data));
};


// MongoDB and Mongoose - Delete Many Documents with model.remove()

var removeManyPeople = function (done) {
    var nameToRemove = "Radhouani";
    Person.deleteMany({ name: nameToRemove }, function (err, data) {
        if (err) {
            done(err);
        } else {
            done(null, data);
        }
    });
};


// Chain Search Query Helpers to Narrow Search Results

var queryChain = function (done) {
    var foodToSearch = "burrito";
    var jsonObject = { favoriteFoods: foodToSearch };
    Person.find(jsonObject).sort({ name: 1 }).limit(2).select({ age: 0 }).exec((err, data) => {
        (err) ? done(err) : done(null, data);
    })
};