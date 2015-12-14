'use strict';

//var User = require('../lib/User');

module.exports = [

  {
    path: '/api/login',
    method: 'get',
    handler(req, res) {
      res.sendStatus(200);
    }
  }

];
