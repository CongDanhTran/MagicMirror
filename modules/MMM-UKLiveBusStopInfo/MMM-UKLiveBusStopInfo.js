/* Live Bus Stop Info */

/* Magic Mirror
 * Module: UK Live Bus Stop Info
 *
 * By Nick Wootton
 * based on SwissTransport module by Benjamin Angst http://www.beny.ch
 * MIT Licensed.
 */

Module.register("MMM-UKLiveBusStopInfo", {

    // Define module defaults
    defaults: {
        updateInterval: 1 * 30 * 1000, // Update every 5 minutes.
        animationSpeed: 2000,
        fade: true,
        fadePoint: 0.1, // Start on 1/4th of the list.
        initialLoadDelay: 0, // start delay seconds.
        apiBase: 'https://www.firstbus.co.uk/getNextBus',
        atcocode: '', // atcocode for bus stop
        limit: '', //Maximum number of results to display
        showDelay: false, //expanded info when used with NextBuses
        showBearing: false, //show compass direction bearing on stop name
        debug: false
    },

    // Define required scripts.
    getStyles: function() {
        return ["bus.css", "font-awesome.css"];
    },

    // Define required scripts.
    getScripts: function() {
        return ["moment.js"];
    },

    //Define header for module.
    getHeader: function() {
        return this.config.header;
    },

    // Define start sequence.
    start: function() {
        Log.info("Starting module: " + this.name);

        // Set locale.
        moment.locale(config.language);

        this.buses = {};
        this.loaded = false;
        this.scheduleUpdate(this.config.initialLoadDelay);

        this.updateTimer = null;

        this.url = encodeURI(this.config.apiBase + this.getParams());
        this.updateBusInfo(this);
    },

    // updateBusInfo IF module is visible (allows saving credits when using MMM-ModuleScheduler to hide the module)
    updateBusInfo: function(self) {
        if (this.hidden != true) {
		 Log.info("bus url"  + this.url);
            self.sendSocketNotification('GET_BUSINFO', { 'url': self.url });
        }
    },

    // Override dom generator.
    getDom: function() {
        var wrapper = document.createElement("div");

        if (this.config.atcocode === "") {
            wrapper.innerHTML = "Please set the ATCO Code: " + this.atcocode + ".";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = "Loading bus Info ...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.buses.stopName !== null) {
            this.config.header = this.buses.stopName;
        }

        //Dump bus data
        if (this.config.debug) {
            Log.info(this.buses);
        }

        // *** Start Building Table
        var bustable = document.createElement("table");
        bustable.className = "small";

        //If we have departure info
        if (this.buses.data.length > 0) {


            for (var t in this.buses.data) {
                var bus = this.buses.data[t];

                var row = document.createElement("tr");
                bustable.appendChild(row);
				
				const symbol = document.createElement("span");
				symbol.className = "fa fa-bus";
				symbol.style.paddingRight = "5px";
				row.appendChild(symbol);

                //Route name/Number
                var routeCell = document.createElement("td");
                routeCell.className = "route";
                routeCell.innerHTML = " " + bus.routeName + " ";
                row.appendChild(routeCell);
				


                //Direction Info
                var directionCell = document.createElement("td");
                directionCell.className = "dest";
                directionCell.innerHTML = bus.direction;
                row.appendChild(directionCell);

                //Time Tabled Departure
                var timeTabledCell = document.createElement("td");
                timeTabledCell.innerHTML = bus.timetableDeparture;
                timeTabledCell.className = "timeTabled";
                row.appendChild(timeTabledCell);


                //Live Departure
                var delayCell = document.createElement("td");
				delayCell.innerHTML = bus.isLive;
				delayCell.className = "nonews";
				row.appendChild(delayCell);

     


                if (this.config.fade && this.config.fadePoint < 1) {
                    if (this.config.fadePoint < 0) {
                        this.config.fadePoint = 0;
                    }
                    var startingPoint = this.buses.length * this.config.fadePoint;
                    var steps = this.buses.length - startingPoint;
                    if (t >= startingPoint) {
                        var currentStep = t - startingPoint;
                        row.style.opacity = 1 - (1 / steps * currentStep);
                    }
                }

            }
        } else {
            var row1 = document.createElement("tr");
            bustable.appendChild(row1);

            var messageCell = document.createElement("td");
            messageCell.innerHTML = " " + this.buses.message + " ";
            messageCell.className = "bright";
            row1.appendChild(messageCell);

            var row2 = document.createElement("tr");
            bustable.appendChild(row2);

            var timeCell = document.createElement("td");
            timeCell.innerHTML = " " + this.buses.timestamp + " ";
            timeCell.className = "bright";
            row2.appendChild(timeCell);

        }

        wrapper.appendChild(bustable);
        // *** End building results table

        return wrapper;

    },

    /* processBuses(data)
     * Uses the received data to set the various values into a new array.
     */
    processBuses: function(data) {
        //Define object to hold bus data
        this.buses = {};
        //Define array of departure info
        this.buses.data = [];
        //Define timestamp of current data
        this.buses.timestamp = new Date();
        //Define message holder
        this.buses.message = null;

        //Check we have data back from API
        if (typeof data !== 'undefined' && data !== null) {

            //Figure out Bus Stop Name
            //Define empty stop name
            var stopName = "";

            if (typeof data.name !== 'undefined' && data.name !== null) {
                //Populate with stop name returned by TransportAPI info - Stop name & indicator combined
                stopName = data.name;

                //If requested, append the bearing as well - assuming it is there!
                if((this.config.showBearing) && (typeof data.bearing !== 'undefined' && data.bearing !== null)) {
                    stopName = stopName + " (" + data.bearing + ")";
                }

            } else if (typeof data.stop_name !== 'undefined' && data.stop_name !== null) {
                //Populate with stop name and bearing returned by TransportAPI info
                stopName = data.stop_name + " (" + data.bearing + ")";
            } else {
                //Default
                stopName = "Departures";
            }
            //Set value
            this.buses.stopName = stopName;

            //Check we have route info
            if (typeof data.times !== 'undefined' && data.times !== null) {
	
                //... and some departures
                if (typeof data.times !== 'undefined' && data.times !== null) {
					
                    if (data.times.length > 0) {
                        //Figure out how long the results are
                        var counter = data.times.length;

                        //See if there are more results than requested and limit if necessary
                        if (counter > this.config.limit) {
                            counter = this.config.limit;
                        }

                        //Loop over the results up to the max - either counter of returned
                        for (var i = 0; i < counter; i++) {

                            var bus = data.times[i];
                            var delay = null;
                      

                                this.buses.data.push({
                                    routeName: bus.ServiceNumber,
                                    direction: bus.Destination,
                                    timetableDeparture: bus.Due,
                                    isLive: (bus.IsLive === "Y" ? "Live" : "No"),
                                });
                          
                        }
                    } else {
                        //No departures structure - set error message
                        this.buses.message = "No departure info returned";
                        if (this.config.debug) {
                            console.error("=======LEVEL 4=========");
                            console.error(this.buses);
                            console.error("^^^^^^^^^^^^^^^^^^^^^^^");
                        }
                    }
                } else {
                    //No departures returned - set error message
                    this.buses.message = "No departures scheduled";
                    if (this.config.debug) {
                        Log.error("=======LEVEL 3=========");
                        Log.error(this.buses);
                        Log.error("^^^^^^^^^^^^^^^^^^^^^^^");
                    }
                }
            } else {
                //No info returned - set error message
                this.buses.message = "No info about the stop returned";
                if (this.config.debug) {
                    Log.error("=======LEVEL 2=========");
                    Log.error(this.buses);
                    Log.error("^^^^^^^^^^^^^^^^^^^^^^^");
                }
            }
        } else {
            //No data returned - set error message
            this.buses.message = "No data returned";
            if (this.config.debug) {
                Log.error("=======LEVEL 1=========");
                Log.error(this.buses);
                Log.error("^^^^^^^^^^^^^^^^^^^^^^^");
            }
        }

        this.loaded = true;

        this.updateDom(this.config.animationSpeed);
    },

    /* getParams()
     * Generates an url with api parameters based on the config.
     * return String - URL params.
     */
    getParams: function() {
        var params = "?";
        params += "&stop=" + this.config.atcocode;

        Log.info(params);
        return params;
    },

    /* scheduleUpdate()
     * Schedule next update.
     * argument delay number - Milliseconds before next update. If empty, this.config.updateInterval is used.
     */
    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function() {
            self.updateBusInfo(self);
        }, nextLoad);
    },


    // Process data returned
    socketNotificationReceived: function(notification, payload) {

        if (notification === 'BUS_DATA' && payload.url === this.url) {
			//console.log(JSON.stringify(payload.data));
            this.processBuses(payload.data);
            this.scheduleUpdate(this.config.updateInterval);
        }
    }

});
