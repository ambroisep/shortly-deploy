var util = require('../lib/utility');

var db = require('../appMongo/config');
var User = require('../appMongo/users');
var Link = require('../appMongo/urls');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find(function (err, links) {
    if (err) return res.send(500, err);
    res.send(200, links);
  });
};

///////////////////////////////////////////////////

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.findOne({ url: uri }, function(err, link) {
    if (err) return res.send(500, err);
    if (link) {
      res.send(200, link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });
        newLink.save(function(err, newLinkStored) {
          if (err) return res.send(500, err);
          res.send(200, newLinkStored);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
      if (err) return res.send(500, err);
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
      if (err) return res.send(500, err);
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function(err, newUser) {
            if (err) return res.send(500, err);
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  var shortCode = req.params[0];
  Link.findOne({ code: shortCode }, function(err, link) {
    console.log(link);
    if (err) return res.send(500, err);
    if (!link) {
      res.redirect('/');
    } else {
      link.visits += 1;
      link.save(function(err) {
        if (err) return res.send(500, err);
        return res.redirect(link.url);
      });
    }
  });
};