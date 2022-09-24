/* global Module */

/* Magic Mirror
 * Module: MMM-HNB-Exchange
 *
 * By
 * MIT Licensed.
 */

Module.register("MMM-HNB-Exchange", {
    defaults: {

        rotateInterval: 10 * 1000,
        initialLoadDelay: 4250,
        animationSpeed: 3000,
        updateInterval: 5  * 60 * 60 * 1000,  //5 * 60 * 60 * 1000   =5h
        url: "https://portal.vietcombank.com.vn/Usercontrols/TVPortal.TyGia/pXML.aspx",
        currency: [],
        fadePoint: 0.2,
        fade: false,
        decimal: 3,
	   mode: "carousel",   
    },

    start: function () {
        Log.info("Starting module: " + this.name);
        requiresVersion: "2.1.0",
        this.HNB = [];
        this.scheduleUpdate();
        this.activeItem = 0;
    },

    getStyles: function () {
        return ["MMM-HNB-Exchange.css"]
    },

    getTranslations: function () {
        return {
            en: "translations/en.json",
            hr: "translations/hr.json"
        };
    },

    setCarousel: function () {
    
          
        var i = Object.keys(this.HNB);
        if (i.length > 0) {
            if (this.activeItem >= i.length) {
                this.activeItem = 0;
            }
            var HNB = this.HNB[i[this.activeItem]];
            
			var tableWrapper = document.createElement("div");
           
            var header = document.createElement("header");
            header.innerHTML = "&nbsp;" + this.translate("HNB_EXCHANGE_RATES");
            tableWrapper.appendChild(header);          

            var table = document.createElement('tr');

            var flagTd = document.createElement('td');
            flagTd.className = "flagTd";
            var flag = document.createElement('i');
            flag.className = HNB.valuta;
            flagTd.appendChild(flag);
            table.appendChild(flagTd);

            var valueTd = document.createElement('td');
            valueTd.className = 'valueTd';
            var value = document.createElement('span');
            value.innerHTML = this.translate("FOR") + HNB.jedinica + " " + HNB.valuta;
            valueTd.appendChild(value);
            table.appendChild(valueTd);

            var buyingTd = document.createElement('td');
            buyingTd.className = 'buyingTd';
            buyingTd.innerHTML = this.translate("BUYING_RATE") + "<br />" + parseFloat(HNB.kupovni_tecaj.replace(",", "."));
            table.appendChild(buyingTd);

            var middleTd = document.createElement('td');
            middleTd.className = 'middleTd';
            middleTd.innerHTML = this.translate("MIDDLE_RATE") + "<br />" + parseFloat(HNB.srednji_tecaj.replace(",", "."));
            table.appendChild(middleTd);

            var sellingTd = document.createElement('td');
            sellingTd.className = 'sellingTd';
            sellingTd.innerHTML = this.translate("SELLING_RATE") + "<br />" + parseFloat(HNB.prodajni_tecaj.replace(",", "."));
            table.appendChild(sellingTd);

            tableWrapper.appendChild(table);
        }
     return tableWrapper;
    },

    setTable: function () {

        var tableWrapper= document.createElement("div")

        var header = document.createElement("header");
        header.innerHTML = "&nbsp;" + this.translate("HNB_EXCHANGE_RATES");
        tableWrapper.appendChild(header);


        var startFade = this.HNB.length * this.config.fadePoint;
        var fadeSteps = this.HNB.length - startFade;
        var currentFadeStep = 0;
        var mainTable = document.createElement('table');

        var headTr = document.createElement('tr');
        headTr.className = 'headTr';

                var icon = document.createElement('td');
                icon.className = 'currency';
                headTr.appendChild(icon);

                var currency = document.createElement('td');
                currency.className = 'currency';
                headTr.appendChild(currency);

                var buyingTh = document.createElement('td');
                buyingTh.className = 'buyingTh';
                buyingTh.innerHTML = this.translate("BUYING_RATE");
                headTr.appendChild(buyingTh);

                var transferTh = document.createElement('td');
                transferTh.className = 'transferTh';
                transferTh.innerHTML = this.translate("MIDDLE_RATE");
                headTr.appendChild(transferTh);

                var sellingTh = document.createElement('td');
                sellingTh.className = 'sellingTh';
                sellingTh.innerHTML = this.translate("SELLING_RATE");
                headTr.appendChild(sellingTh);

        mainTable.appendChild(headTr);
        tableWrapper.appendChild(headTr);

        var i = Object.keys(this.HNB);
        if (i.length > 0) {
            for (i = 0; i < this.HNB.length; i++) {

                var mainTr = document.createElement('tr');
                mainTr.className = 'mainTr';
                if (this.config.fade) {
                    if (i >= startFade) {
                        currentFadeStep = i - startFade;
                    }
                }
                mainTr.style.opacity = 1 - (1 / fadeSteps) * currentFadeStep;

                var flagTd = document.createElement('td');
                flagTd.className = "flagTd";
                var flag = document.createElement('i');
                flag.className = this.HNB[i].valuta;
                flagTd.appendChild(flag);
                mainTr.appendChild(flagTd);

                var valueTd = document.createElement('td');
                valueTd.className = 'valueTd';
                var value = document.createElement('span');
                value.innerHTML = this.translate("FOR") + this.HNB[i].jedinica + " " + this.HNB[i].valuta;
                valueTd.appendChild(value);
                mainTr.appendChild(valueTd);

                var buyingTd = document.createElement('td');
                buyingTd.className = 'buyingTd';
                buyingTd.innerHTML = parseFloat(this.HNB[i].kupovni_tecaj.replace(",", ".")).toFixed(this.config.decimal) + " VND";
                mainTr.appendChild(buyingTd);

                var middleTd = document.createElement('td');
                middleTd.className = 'middleTd';
                middleTd.innerHTML = parseFloat(this.HNB[i].srednji_tecaj.replace(",", ".")).toFixed(this.config.decimal) + " VND";
                mainTr.appendChild(middleTd);

                var sellingTd = document.createElement('td');
                sellingTd.className = 'sellingTd';
                sellingTd.innerHTML = parseFloat(this.HNB[i].prodajni_tecaj.replace(",", ".")).toFixed(this.config.decimal) + " VND";
                mainTr.appendChild(sellingTd);

                mainTable.appendChild(mainTr);
               tableWrapper.appendChild(mainTr);
            }

        }
		return tableWrapper;
    },

    getDom: function () {
        var wrapper = document.createElement("div");
        //wrapper.className = "wrapper";
        wrapper.id = "wrapper";
        if (!this.loaded) {
            wrapper.innerHTML = this.translate("LOADING").toLowerCase();
            return wrapper;
        }
        if (this.loaded){
			if (this.config.mode == "table") {
			
			wrapper.appendChild(this.setTable());
			}
			if (this.config.mode == "carousel") {
			wrapper.appendChild(this.setCarousel());	
			}
		}
        return wrapper;
    },

    processHNB: function (data) {
        this.HNB = data;
        //console.log(this.HNB);
        this.loaded = true;
    },

    scheduleRotate: function () {

        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function () {
        setInterval(() => {
            this.getHNB();
        }, this.config.updateInterval);
        this.getHNB(this.config.initialLoadDelay);
        var self = this;
    },

    getHNB: function () {
        this.sendSocketNotification('GET_HNB', this.config);
		
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "HNB_RESULT") {
            this.processHNB(payload);
            if (this.config.mode == "carousel") {
                if (this.rotateInterval == null) {
                    this.scheduleRotate();
					
                }
            }
			
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
	
	
});
