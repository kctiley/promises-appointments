var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://@localhost/proms";
console.log(conString);
var bcrypt = require('bcrypt');

// var UsersCustomer = pg.get('usersCustomer');
// var UsersAdmin = pg.get('usersAdmin');
// var Appointments = pg.get('appointments');
// var Zones = require('zones');
var Helper = {
  // signin : function(email, password) {
  //   var errors = [];
  //   var result = {};
  //   return Users.findOne({email: email.toLowerCase()}).then(function (data) {
  //     if (data) {
  //       if (bcrypt.compareSync(password, data.passwordDigest)) {
  //         return result;
  //       }
  //       else {
  //         errors.push("Invalid email / password");
  //         result['errors'] = errors;
  //         return result;
  //       }
  //     }
  //     else {
  //       errors.push('Invalid email / password');
  //       result['errors'] = errors;
  //       return result;
  //     }
  //   });
  // },

  // SAVE THIS******************
  // addUser : function(email, password, res){
  //   var data = {};
  //   data.errors = [];
  //   return new Promise(function(resolve, reject){
  //     pg.connect(conString, function(err, client, done) {
  //       if (err) {
  //         return console.error('error fetching client from pool', err);
  //       }

  //       client.query('SELECT * from users where email=($1) ', [email], function(err3, result){
  //         console.log("Data inside existing? query", data);
  //         if (result.rows.length > 0){
  //           data.errors.push("Email in use");
  //           console.error('Email in use!');
  //           done();
  //           return resolve(data);
  //         }
  //         else{
  //           client.query('INSERT into users(email, password) VALUES($1,$2) ', [email, password], function(err2, result) {
  //             done();
  //             if (err) {
  //               return console.error('error running query', err2);
  //             }
  //             else {
  //             resolve(result);
  //             console.log("Inside AddUser", result);
  //             }
  //           });
  //         }
  //       })  
  //     });
  //   })  
  // },

  // END SAVE THIS********************

  query: function(sql, binds){
    return new Promise(function(resolve, reject){
      pg.connect(conString, function(err, client, done) {
        if (err) {
          return reject(err);
        }
        else{
          client.query(sql, binds, function(err2, result){
            done();
            if (err2) return reject(err2);
            return resolve(result.rows);
          })
        }  
      });
    });
  },

  checkIfUser : function(email, password, passConf){
    var data = {};
    data.errors = [];

    if(!email) {
      data.errors.push('Email is required');
    }
    if(!password) {
      data.errors.push('Password is required');
    }
    if(password !== passConf) {
      data.errors.push('Password and Password Confirmation must match');
    }
    if(data.errors.length) {
      return Promise.reject(data)
    }

    return this.query('SELECT * from users where lower(email) = $1', [email.toLowerCase()]).then(function(rows){
      if (rows.length > 0){
        data.errors.push("Email in use");
        return Promise.reject(data);
      } else {
        return Promise.resolve();
      }
    })
  },

  createUser: function(email, password, passConf){
    return this.checkIfUser(email, password, passConf).then(function(){
      var data = {};
      data.errors = [];
      return new Promise(function(resolve, reject){
        pg.connect(conString, function(err,client, done){
          if (err){
            data.errors.push("Error connecting to db in createUser");
            return reject(data);
          }
          else{
            client.query('INSERT into users(email, password) VALUES($1,$2) ', [email, password], function(err2, result) {
              done();
              if(err){
                data.errors.push("Error inserting in createUser");
                return reject(data);
              }
              else{
                // req.session.email = req.body.email;
                // data.user.email = req.body.email;
                return resolve();
              }
            })
          }
        })
      })    
    }, function(err) {
      return Promise.reject(err);
    })
  },

  logInUser: function(email, password){
    var data = {};
    data.errors = [];
    return new Promise(function(resolve, reject){
      pg.connect(conString, function(err, client, done) {
        if (err) {
          data.errors.push("Error connecting to db in logInUser");
          return reject(data);
        }
        else{
          client.query('SELECT * from users where email=($1) ', [email], function(err2, result){
            if (result.rows.length == 0){
              data.errors.push("No record for that email");
              done();
              return reject(data);
            }
            else{
              if (result.rows[0].password !== password){
                console.log("Result.rows[0].password", result.rows[0].password);
                data.errors.push("Incorrect password for that email");
                return reject(data);
              }
              else{
                // req.session.email = req.body.email;
                return resolve();
              }
            } 
          })
        }  
      });
    })    
  },



 }

module.exports = Helper;