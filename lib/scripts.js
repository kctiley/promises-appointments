var pg = require('pg');
var conString = process.env.DATABASE_URL || "postgres://@localhost/proms";
console.log(conString);
var bcrypt = require('bcrypt');

// var UsersCustomer = pg.get('usersCustomer');
// var UsersAdmin = pg.get('usersAdmin');
// var Appointments = pg.get('appointments');
// var Zones = require('zones');
 // || 'localhost/galleries-demo'
// mongodb://heroku_4x9wvl5s:rpa80nemv6pbc9sk3fu2jd3j3p@ds049094.mongolab.com:49094/heroku_4x9wvl5s
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
  checkIfUser : function(email){
    var data = {};
    data.errors = [];
    return new Promise(function(resolve, reject){
      pg.connect(conString, function(err, client, done) {
        if (err) {
          data.errors.push("Error connecting to db in checkIfUser");
          return reject(data);
        }
        else{
          client.query('SELECT * from users where email=($1) ', [email], function(err2, result){
            if (result.rows.length > 0){
              console.log(result.rows[0]);
              data.errors.push("Email in use");
              done();
              return reject(data);
            }
            else{
              return resolve();
            } 
          })
        }  
      });
    })  
  },

  createUser: function(email, password){
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

//   findUser : function(email) {
//     var joinUserGallery = function (users, galleries) {
//       var indexed = galleries.reduce(function (result, gallery) {
//         result[gallery._id.toString()] = gallery;
//           return result;
//       }, {});
//       users.forEach(function (user) {
//         user.specificGalleries = user.galleries.map(function (_id) {
//           return indexed[_id.toString()];
//         });
//       });
//       return users;
//     };
//     var data = {};
//     return Users.findOne({email: email.toLowerCase()}).then(function (user) {
//       return user.galleries;
//     }).then(function (galleryIds) {
//       return Galleries.find({_id: {$in: galleryIds}}).then(function (galleries) {
//         data['galleries'] = galleries;
//         data['otherGalleries'] = [];
//         return data;
//       });
//     }).then(function (data) {
//       return Users.find({}).then(function (users) {
//         return users.filter(function (user) {
//           return user.email !== email;
//         })
//       })
//     }).then(function (users) {
//       var galleryIds = users.reduce(function (result, user) {
//         return result.concat(user.galleries);
//       }, []);
//       return Galleries.find({_id: {$in: galleryIds}}).then(function (gallery) {
//         joinUserGallery(users, gallery);
//         data.otherGalleries = users;
//         return data;
//       });

//     });

//   },

//   addGallery : function(title, description, url, email) {
//       return Galleries.insert({img: url, title: title, description: description, photoId: []}).then(function (gallery) {
//         return gallery._id;
//       }).then(function (galleryId) {
//         return Users.findOne({email: email.toLowerCase()}).then(function (user) {
//           user.galleries.push(galleryId);
//           return user.galleries;     
//         }).then(function (updatedGalleries) {
//           return Users.update({email: email}, {$set: {galleries: updatedGalleries}});
//         });
//       });
//   },

//   removeGallery : function(id, email) {
//     return Users.findOne({email: email.toLowerCase()}).then(function (user) {
//       var trashIndex = user.galleries.indexOf(id);
//       user.galleries.splice(trashIndex, 1);
//       return user.galleries;
//     }).then(function (updatedGalleries) {
//         return Users.update({email: email}, {$set: {galleries: updatedGalleries}});
//       });
//   },

//   showPhotos : function(id) {
//     return Galleries.findOne({_id: id}).then(function (gallery) {
//       return gallery;
//     }).then(function (gallery) {
//       return Photos.find({_id: {$in: gallery.photoId} }).then(function (photos) {
//         var result = {};
//         result['gallery'] = gallery;
//         result['photos'] = photos;
//         return result;
//       });
//     });
//   },

//   renderNew : function(id) {
//     return Galleries.findOne({_id: id}).then(function (gallery) {     
//       return gallery;
//     });
//   },

//   addPhoto : function(id, url, name) {
//     return Photos.insert({name: name, img: url}).then(function (photo) {
//       return photo;
//     }).then(function (photo) {   
//       return Galleries.findOne({_id: id}).then(function (gallery) {    
//         gallery.photoId.push(photo._id);
//         return gallery;
//       }).then(function (gallery) {
//         return Galleries.updateById(id, {$set: {photoId: gallery.photoId}});
//       });
//     });
//   },

//   editPhoto : function(galleryId, photoId) {
//     return Galleries.findOne({_id: galleryId}).then(function (gallery) {
//       return gallery;
//     }).then(function (gallery) {
//       return Photos.findOne({_id: photoId}).then(function (photo) {
//         return [gallery, photo];
//       });
//     });    
//   },

//   updatePhoto : function(photoId, name, url) {
//     return Photos.updateById(photoId, {name: name, img: url});
//   },

//   removePhoto : function(photoId) {
//     return Photos.remove({_id: photoId});
//   }
 }

module.exports = Helper;