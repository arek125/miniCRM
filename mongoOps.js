const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("./config");

mongoose.connect(config.database,config.db_options)
    .then(() =>  console.log('connection successful'))
    .catch((err) => console.error(err));

var clientSchema = Schema({
    company_name : String,
    contact : {
        name : String,
        phone : String,
        email : String
    },
    account_manager_id : { type: Schema.Types.ObjectId, ref: 'User' },
    notes : String,
    sector_id : { type: Schema.Types.ObjectId, ref: 'Company_sector' }
});

var company_sectorSchema = Schema({
    name: { type: String, require: true, minlength: 1, maxlength: 100}
});

var userSchema = Schema({
    name : { type: String, require: true},
    login : { type: String, require: true, unique: true, minlength: 1, maxlength: 20},
    email : { type: String, lowercase:true, require: true, unique: true, minlength: 3,validate: function(email) {
      return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
    }},
    password : { type: String, require: true, minlength: 59, maxlength: 60},
    admin : { type: Boolean }
});


var timelineSchema = Schema({
    client_id: Schema.Types.ObjectId,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    contact_type: String,
    contact_date: Date,
    event_notes: String

});

userSchema.pre('save', function (next) {
    var self = this;
    User.findOne({ $or: [ { login: self.login }, { email: self.email } ] },"login email", function (err, doc) {
        if (err) next(err);
        else if (doc){
            if(doc.login == self.login){
                self.invalidate("login", self.login+" już istnieje!");
                next(new Error(self.login+" już istnieje!"));
            }
            else {
                self.invalidate("email", self.email+" już istnieje!");
                next(new Error(self.email+" już istnieje!"));
            }
        }else{                
            next();
        }
    });
});
userSchema.pre('findOneAndUpdate', function(next) {
    var self = this;
    //console.log("------------------>", self._conditions._id, self._update.$set.email);
    User.findOne({ $and: [ {_id: {$ne: self._conditions._id}}, { email: self._update.$set.email } ] },"email", function (err, doc) {
        if (err) next(err);
        else if (doc){
            next(new Error(self._update.$set.email+" już istnieje!"));
        }else{                
            next();
        }
    });
});

userSchema.pre('findOneAndRemove', function(next) {
    var self = this;
    User.count({admin: true}, function( err, count){
        if (err)next(err);
        else if(count <= 1)next(new Error("Próbujesz usunąć ostatniego admina!"));
        else next();
    });
});

userSchema.pre('findOneAndRemove', function(next) {
    var self = this;
    Client.count({account_manager_id: self._conditions._id}, function( err, count){
        if (err)next(err);
        else if(count > 0)next(new Error("User jest opiekunem klienta/ów!"));
        else next();
    });
});

var Client = mongoose.model("Client", clientSchema);
var Company_sector = mongoose.model("Company_sector", company_sectorSchema);
var User = mongoose.model("User", userSchema);
var Contact_timeline = mongoose.model("Contact_timeline", timelineSchema);


function listCLients() {
    return Client.find({}).populate('sector_id').populate('account_manager_id').exec();
}
function userClients(userId, search) {
    if (search)
        return Client.find({$and: [{account_manager_id: userId}, {company_name: { "$regex": search, "$options": 'i' }}]}).exec();
    else
        return Client.find({account_manager_id: userId}).exec();
}

function singleClient(id) {
    let Oid = new mongoose.Types.ObjectId(id);
    return Client.findById(Oid).populate('sector_id').populate('account_manager_id').exec();
}

function listSectors() {
    return Company_sector.find({}).exec();
}

function createSector(sector,cb){
    let newSector = new Company_sector(sector);
    newSector.save(err=>{
        if(err){
            cb(null,err)
        }
        else cb(newSector);
    });

}

function updateSector(sector, cb){
    Company_sector.findOneAndUpdate({_id: sector._id}, {$set:{name: sector.name}}, {new: true, runValidators: true}, function(err, uU){
        if (err){ 
            cb(null, err);
            return err;
        }
        uU.password = undefined;
        cb(uU);
    });
}

function deleteSector(id, cb){
    Company_sector.findByIdAndRemove(id, function (err, sector) {  
        cb(sector,err);
    });
}

function listUsers(){
    return User.find({},"_id name login").exec();
}

function updateClient(clientUpdated, cb){
    //let cU = new Client(clientUpdated);
    Client.findById(clientUpdated._id, function (err, client) {
        if(err){
            console.log(err);
            cb(null,err);
            return err;
        }
        client.company_name = clientUpdated.company_name;
        client.contact.name = clientUpdated.contact.name;
        client.contact.phone = clientUpdated.contact.phone;
        client.contact.email = clientUpdated.contact.email;
        client.account_manager_id = clientUpdated.account_manager_id._id;
        client.notes = clientUpdated.notes;
        client.sector_id = clientUpdated.sector_id._id;
        client.save((err, clientSaved)=>{
            if(err){
                console.log(err);
                cb(null,err);
                return err;
            }
            cb(clientSaved);
        });

    });
}

function createClient(clientNew, cb){
    Client.create({ 
        company_name: clientNew.company_name,
        contact:{
            name: clientNew.contact.name,
            phone: clientNew.contact.phone,
            email: clientNew.contact.email
        },
        account_manager_id: clientNew.account_manager_id._id,
        notes: clientNew.notes,
        sector_id: clientNew.sector_id._id
     }, function (err, clientCreated) {
        if (err){ 
            cb(null, err);
            return err;
        }
        cb(clientCreated);
    });
}

function deleteClient(id, cb){
    Client.findByIdAndRemove(id, function (err, client) {  
        cb(client,err);
    });
}

function createTimelineForClient(timeline, cb){
    Contact_timeline.create({ 
        client_id: timeline.client_id,
        user_id: timeline.user_id,
        contact_type: timeline.contact_type,
        contact_date: timeline.contact_date,
        event_notes: timeline.event_notes
     }, function (err, timelineCreated) {
        if (err){ 
            cb(null, err);
            return err;
        }
        timelineCreated.populate('user_id', function(error, timelinePopulated) {
          cb(timelinePopulated);
        });
    });
}

function getTimelinesForClient(clientId){
    return Contact_timeline.find({client_id: new mongoose.Types.ObjectId(clientId)}).sort({contact_date: 'desc'}).populate('user_id').exec();
}

function findUser(Login){
    return User.findOne({login: Login}).exec();
}

function singleUser(id) {
    let Oid = new mongoose.Types.ObjectId(id);
    return User.findById(Oid).exec();
}

function createUser(user, cb){
    var newUser = new User(user);
    newUser.validate(error=>{
        if (error){ 
            cb(null, error);
            return error;
        }
        newUser.save(err=>{
            if (err){ 
                cb(null, err);
                return err;
            }
            newUser.password = undefined;
            cb(newUser);
        });
    });
    // User.create({ 
    //     name: user.name,
    //     login: user.login,
    //     email: user.email,
    //     password: user.password,
    //     admin: user.admin
    //  }, function (err, userCreated) {
    //     if (err){ 
    //         cb(null, err);
    //         return err;
    //     }
    //     cb(userCreated);
    // });
}
function updateUser(user, cb){
    User.findOneAndUpdate({_id: user._id}, {$set:{name: user.name, email: user.email, admin: user.admin}}, {new: true, runValidators: true}, function(err, uU){
        if (err){ 
            cb(null, err);
            return err;
        }
        uU.password = undefined;
        cb(uU);
    });
}

function deleteUser(id, cb){
    User.findOneAndRemove({_id: id}, function (err, user) {  
        cb(user,err);
    });
}

function findUsers(search){
    return User.find({$or:[{name: { "$regex": search, "$options": 'i' }},{login: { "$regex": search, "$options": 'i' }},{email: { "$regex": search, "$options": 'i' }}]},"_id name login").exec();
}

module.exports = {
    createClient: createClient,
    deleteClient: deleteClient,
    updateClient: updateClient,
    singleClient: singleClient,
    listUsers: listUsers,
    listSectors: listSectors,
    createSector: createSector,
    updateSector: updateSector,
    deleteSector: deleteSector,
    listCLients: listCLients,
    userClients: userClients,
    createTimelineForClient: createTimelineForClient,
    getTimelinesForClient: getTimelinesForClient,
    findUser: findUser,
    singleUser: singleUser,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    findUsers: findUsers
};