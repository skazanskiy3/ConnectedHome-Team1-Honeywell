
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html', { title: 'Connected Home' });
};

exports.sensors = function(req, res){
  res.render('sensors.html', { title: 'Connected Home' });
};

exports.zones = function(req, res){
  console.log("ZONES");
  res.render('zones.ejs', { title: 'Connected Home' });
};
