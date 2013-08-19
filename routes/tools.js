var cheerio = require('cheerio')
  , request = require('request')
  , url = require('url')
  , sleep = require('sleep')
  , async = require('async')
  , Q = require('q')
  , twilio = require('twilio')
  , DB = require('../DB').DB
  ;

// CONFIG
var HOST = 'http://vancouver.en.craigslist.ca'
  , SEARCH_URI = HOST + '/search/?areaID=16&subAreaID=&query=sasquatch&catAbb=sss'
  , twilio_client = new twilio.RestClient('[TWILIO ACCOUNT SID]', '[TWILIO AUTH TOKEN]')
  , TWILIO_NUMBER = '[YOUR TWILIO NUMBER]'
  , RECEIVING_NUMBER = '[YOUR PHONE NUMBER]'
  , FIRST = true
  ;

function fetch(link, callback) {
  request(HOST + link, function(e,r,b) {
    callback(cheerio.load(b));
  });
}

function sendNewTicketMessage(ticket, number) {
  var msg_body = ticket.title.text() + ' - ' + ticket.price + ' - ' + ticket.email
      ;

  twilio_client.sendSms({
    to: '+1' + number,
    from: TWILIO_NUMBER,
    body: msg_body
  }, function(err, msg) {
     if (!err) {
        console.log(msg.sid);
        console.log('Message sent.');
      } else {
        console.log('Oops! There was an error.');
      }
  });
}

exports.sasquatch = function(req, res) {

  request({
    uri: SEARCH_URI
  }, function(err, response, body){

    if(response === undefined || err && response.statusCode !== 200) {
      console.log('Request error.');
    }


    var $ = cheerio.load(body)
      , tix = []
      , numNew = 0
      , q = async.queue(function (task, callback) {
        fetch(task.link, function(a) {

          var email = a('.dateReplyBar > a').text()
            , msecondUTC = a('.dateReplyBar date').attr('title')
            ;

          task.obj.email = email;
          task.obj.date = new Date(parseInt(msecondUTC, 10));

          DB.save(task.obj, function(err, items) {
            if(!FIRST) {
              sendNewTicketMessage(task.obj, RECEIVING_NUMBER);
              numNew++;
            }
            callback();
          });
        });
      }, 2);

    q.drain = function() {
      DB.findAll(function(err, tix) {
        res.render('sasquatch', {tix: tix, numNew: numNew });
        FIRST = false;
      });
    };

    var cnt = 0
      , queueCnt = 0;

    $('.row').each(function() {
      if(cnt > 20)
        return;
      cnt++;

      var title = $(this).find('.pl a')
        , link = title.attr('href')
        , price = $(this).find('.l2 .pnr .pp .price').text()
        , obj = {title: title, price: price, link: link}
        ;

      DB.findByLink(link, function(err, item) {

        if(item === null) {


          if(parseInt(price.substring(1,price.length), 10) < 500 &&
            title.text().toLowerCase().indexOf('wanted') == -1 &&
            title.text().toLowerCase().indexOf('lf') == -1 &&
            title.text().toLowerCase().indexOf('wtb') == -1) {

            queueCnt++;

            q.push({obj: obj, link: link}, function() {
              console.log('DONE ' + link);
            });
          }
        } else {
          tix.push(item);
        }
      });
    });

    if(queueCnt === 0) {
      DB.findAll(function(err, tix) {
        res.render('sasquatch', {tix: tix, numNew: numNew});
        FIRST = false;
      });
    }
  });
};
