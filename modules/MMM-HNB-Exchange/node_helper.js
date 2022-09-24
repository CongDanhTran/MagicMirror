/* Magic Mirror
 * Node Helper: MMM-HNB-Exchange
 *
 * By Lolo
 * MIT Licensed.
 */
const NodeHelper = require('node_helper');
var request = require('request');
const fetch = require('node-fetch');
var parseString = require('xml2js').parseString;
var self;


module.exports = NodeHelper.create({
	
	start: function() {
		self = this;
		console.log("Starting node_helper for: " + this.name);			
	},

	getHNB: function() {
        var self = this;
		var url = self.config.url ;

		var rates = [];
		request({
			url: url,
			method: 'GET',
		}, function (error, response, body) {
		

			// var xmlStr = new DOMParser().parseFromString(body, "text/xml");
			// var xmlObj = new XMLSerializer().serializeToString(xmlStr)
			parseString(body, function (err, result) {
				var rates = result.ExrateList.Exrate.filter( a=>  self.config.currency.includes(a.$.CurrencyCode));
				var vndJson = self.convertToVND(rates);
			   self.sendSocketNotification('HNB_RESULT', vndJson);
			});
		
		})

    },
    
	socketNotificationReceived: function (notification, payload) {
        if (notification === 'GET_HNB') {
			self.config = payload
			this.getHNB();
		}
	},

    convertToVND: function(jsontest) {

        var rates = [];
		for (var i in jsontest) {
			obj1 = new Object();
			var a = jsontest[i].$;
			obj1.valuta = a.CurrencyCode;
			obj1.kupovni_tecaj = a.Buy;
			obj1.srednji_tecaj = a.Transfer;
			obj1.prodajni_tecaj = a.Sell;
			obj1.jedinica = 1;
			rates.push(obj1);
		}
		
		return rates;
    },	



  // receives XML DOM object, returns converted JSON object
	  setJsonObj: function(xml) {
	    var js_obj = {};
	    if (xml.nodeType == 1) {
	      if (xml.attributes.length > 0) {
	        js_obj["attributes"] = {};
	        for (var j = 0; j < xml.attributes.length; j++) {
	          var attribute = xml.attributes.item(j);
	          js_obj["attributes"][attribute.nodeName] = attribute.value;
	        }
	      }
	    } else if (xml.nodeType == 3) {
	      js_obj = xml.nodeValue;
	    }            
	    if (xml.hasChildNodes()) {
	      for (var i = 0; i < xml.childNodes.length; i++) {
	        var item = xml.childNodes.item(i);
	        var nodeName = item.nodeName;
	        if (typeof(js_obj[nodeName]) == "undefined") {
	          js_obj[nodeName] = setJsonObj(item);
	        } else {
	          if (typeof(js_obj[nodeName].push) == "undefined") {
	            var old = js_obj[nodeName];
	            js_obj[nodeName] = [];
	            js_obj[nodeName].push(old);
	          }
	          js_obj[nodeName].push(setJsonObj(item));
	        }
	      }
	    }
	    return js_obj;
	  },




	 // converts JSON object to string (human readablle).
	  // Removes '\t\r\n', rows with multiples '""', multiple empty rows, '  "",', and "  ",; replace empty [] with ""
	jsontoStr: function(js_obj) {
	    var rejsn = JSON.stringify(js_obj, undefined, 2).replace(/(\\t|\\r|\\n)/g, '').replace(/"",[\n\t\r\s]+""[,]*/g, '').replace(/(\n[\t\s\r]*\n)/g, '').replace(/[\s\t]{2,}""[,]{0,1}/g, '').replace(/"[\s\t]{1,}"[,]{0,1}/g, '').replace(/\[[\t\s]*\]/g, '""');
	    return (rejsn.indexOf('"parsererror": {') == -1) ? rejsn : 'Invalid XML format';
	}

});
