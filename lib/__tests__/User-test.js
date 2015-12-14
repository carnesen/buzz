var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

mockgoose(mongoose);

var User = require('../User');

describe('User', function() {

  it('works', function(done){
    var jane = new User({
      email: 'foo@bar.com',
      password: 'asdf'
    });
    jane.save(done);
  });

});
