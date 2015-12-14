'use strict';

var pkg = require('../package');

var context = { title: pkg.name };

module.exports = [

  {
    path: '/',
    method: 'get',
    handler(req, res) {
      res.render('index', context);
    }
  },

  {
    path: '/jq',
    method: 'get',
    handler(req, res) {
      res.render('jq', context);
    }
  },

  {
    path: '/ng',
    method: 'get',
    handler(req, res) {
      res.render('ng', context);
    }
  }



];
