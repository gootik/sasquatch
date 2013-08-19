/**
 * MOCK FUNCTIONS
 */
exports.mock_craigslist = function(req, res) {
  res.send(
    '<p data-pid="3812516753" class="row">' +
      '<a class="i" href="/mock_post"></a>' +
      '<span class="pl">' +
        '<span class="star v" title="save this post in your favorites list"></span>' +
        '<small>' +
          '<span class="date">May 17</span>' +
        '</small>' +
        '<a href="/nvn/tix/3812516753.html">Sasquatch 2013 Ticket</a>' +
      '</span>' +
      '<span class="l2">' +
        '<span class="pnr">' +
          '<span class="pp">' +
            '<span class="price">$350</span>' +
          '</span>' +
          '<small> (Lynn Valley)</small>' +
          '<span class="px">' +
            '<span class="p"></span>' +
          '</span>' +
        '</span>' +
        '<a data-cat="tix" href="/tix/" class="gc">tickets - by owner</a>' +
      '</span>' +
    '</p>'
    );
};