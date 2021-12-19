/* Magic Mirror Config Sample
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information on how you can configure this file
 * see https://docs.magicmirror.builders/getting-started/configuration.html#general
 * and https://docs.magicmirror.builders/modules/configuration.html
 */
let config = {
	address: "0.0.0.0", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: [], 	// Set [] to allow all IP addresses
															// or add a specific IPv4 of 192.168.1.5 :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
															// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
															// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device

	modules: [
		{
			module: "alert",
		},
		{
			module: "updatenotification",
			position: "top_bar"
		},
		{
			module: "clock",
			position: "top_right"
		},
				{
			module: "clock",
			position: "top_left",
			config: {
				timezone: "Asia/Ho_Chi_Minh"
			}
		},
		{
			module: "calendar",
			header: "UK Holidays",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check",
						url: "webcal://www.calendarlabs.com/ical-calendar/ics/75/UK_Holidays.ics"
					}
				]
			}
		},
		{
			module: "calendar",
			header: "VN Holidays",
			position: "top_left",
			config: {
				calendars: [
					{
						symbol: "calendar-check",
						url: "webcal://www.calendarlabs.com/ical-calendar/ics/77/Vietnam_Holidays.ics"
					}
				]
			}
		},

/*		{
			module: "weather",
			position: "top_right",
			config: {
				weatherProvider: "openweathermap",
				type: "current",
				location: "Bristol",
				locationID: "2654675", //ID from http://bulk.openweathermap.org/sample/city.list.json.gz; unzip the gz file and find your city
				apiKey: "b654ffb4b1453a537921cec3da20ed27"
			}
		},*/

		{
		module: 	'MMM-UKLiveBusStopInfo',
		position: 	'top_right',
		header:		'Departures',			//Optional - delete this line to turn OFF the header completely
		config: {
						atcocode: 		'0100BRP90204', 		// ATCO code for specific bus stop
                        limit:                  8,                                      // Optional - Maximum results to display.
						showBearing: true
				}
		}, 
		{
                module:         'MMM-UKLiveBusStopInfo',
                position:       'top_right',
                header:         'Departures',                   //Optional - delete this line to turn OFF the header completely
                config: {
                        atcocode:               '0100BRP90176',                 // ATCO code for specific bus stop
                        limit:                  8,                                      // Optional - Maximum results to display.
						showBearing: true
			   }
		},
		{
disabled: false,
module: 'MMM-PLOW',
position: 'top_center',
config: {
  languages: "en",                          // en, de, es, fr, it, nl, ar, zh, x-pig-latin
  style: "default",                         // See Style list in readMe
  latLong: "51.4816172,-2.5411406",               // Your latitude and longitude seperated by a comma
  title: "Fishponds",                        // Location seems logical
  tempUnits: "C",                           // F or C
  textColor: "ffffff",                      // Hex color codes. No # symbol
  font: "default",                          // See font list in readMe
  htColor: "ffffff",                        // high temp color. Hex color codes. No # symbol
  ltColor: "ffffff",                        // low temp color. Hex color codes. No # symbol
  displaySum: "yes",                        // Display Summary, yes or no
  displayHeader: "yes",                     // yes or no
  timeColor: "ffffff",                      // when style is graph-bar. Hex color codes. No # symbol
  tempColor: "ffffff",                      // when style is graph-bar. Hex color codes. No # symbol
  currentDetails: "true",                   // when style is graph-bar. true or false
  graphType: "precip_graph",                // when style is graph. See readMe
  lineColor: "ffffff",                      // when style is graph. No # symbol
  markerColor: "ffffff",                    // when style is graph. No # symbol
  animationSpeed: 3000,
  updateInterval: 10 * 60 * 1000,
   }
},	
		/*{
		module: 'MMM-SystemStats',
		position: 'top_center', // This can be any of the regions.
		// classes: 'small dimmed', // Add your own styling. OPTIONAL.
		// header: 'System Stats', // Set the header text OPTIONAL
		config: {
			updateInterval: 10000, // every 10 seconds
			align: 'left', // align labels
			//header: 'System Stats', // This is optional
			units: 'metric', // default, metric, imperial
			view: 'textAndIcon',
		},
	},*/
        {
            module: 'MMM-auto-refresh',
            config: {
                refreshInterval: 1 * 60 * 60 * 1000,
            }
        }
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
