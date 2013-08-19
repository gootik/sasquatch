var itmCnt = 1;

DB = function(){};

DB.prototype = {
  dummyData : [],

  findAll : function(callback) {
    var cpy = this.dummyData;

    cpy.sort(function(a, b) {
      if(a._id == b._id)
        return 0;

      if(a._id < b._id)
        return -1;
      else
        return 1;
    });

    callback(null, cpy);
  },

  findById : function(id, callback) {
    var result = null;
    for(var i=0; i < this.dummyData.length; i++) {
      if(this.dummyData[i]._id == id) {
        result = this.dummyData[i];
        break;
      }
    }

    callback(null, result);
  },


  findByLink : function(link, callback) {
    var result = null;

    for(var i=0; i< this.dummyData.length; i++) {
      if(this.dummyData[i].link == link) {
        result = this.dummyData[i];
        break;
      }
    }

    callback(null, result);
  },

  save : function(articles, callback) {
    var article = null;

    if( typeof(articles.length) == "undefined" )
      articles = [articles];

    for(var i=0; i<articles.length; i++) {
      article = articles[i];
      article._id = itmCnt++;
      article.created_at = new Date();

      if( article.comments === undefined ) {
        article.comments = [];
      }

      for(var j=0; j<article.comments.length; j++) {
        article.comments[j].created_at = new Date();
      }

      this.dummyData[this.dummyData.length] = article;
    }

    callback(null, articles);
  }
};

// new ArticleProvider().save([
//   {title: 'test1', body: 'body1', comments:[{author:'a', comment: 'ac'}, {author:'b', comment:'bc'}]},
//   {title: 'test2', body: 'body2'}
//   ], function(err, articles){});

exports.DB = new DB();