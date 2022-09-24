# MMM-HNB-Exchange
Module for [MagicMirror](https://github.com/MichMich/MagicMirror).
It uses API from [HNB](http://api.hnb.hr/hr/web/api) (Croatian National Bank) to pull currency exchange rate data for croatian kuna.
## Screenshot 
### mode: carousel
![GitHub Logo](/images/Capture.PNG)
### mode: table
![GitHub Logo](/images/Capture2.PNG)
## Configuration
Clone this repository into the MagicMirror Modules folder:
```
cd ~/MagicMirror/modules
git clone https://github.com/englolo/MMM-HNB-Exchange.git
npm install
```
## Configuration
Add the following data to your config.js file
```
{
    module: "MMM-HNB-Exchange",
    position: "top_right",
    config: {
        decimal: 2, //
        currency: ['GBP', 'USD', 'EUR', 'BAM', 'AUD', 'CAD'],
        mode: "table", //"carousel"   "table"
    }
},          
```
## Config Options
| Option | Default | Description |
|:--:|:-:|:--:|
|```decimal:```| ```6``` | Set number of decimal places  |
| ```currency:```| ```[]```| Define the download currency, if left out or empty <br />all currency will be taken.<br /> option:<br /> ['GBP','USD','EUR','BAM','AUD','CAD','CZK','DKK','HUF','JPY','NOK','SEK','CHF','PLN']|
| ``` mode:```| ```"carousel"```|Define style between ```"carousel"``` or ```"table"```  |
| ```rotateInterval:```|```10 * 1000```|Set rotate interval for  ``` mode:"carousel"```, ```10 * 1000```- 10s|
| ```updateInterval:```|```5 * 60 * 60 * 1000```|Set update interval to fetch new API, ```5 * 60 * 60 * 1000```-5hr |
| ```animationSpeed:```|``` 3000```|Set animation speed for  ``` mode:"carousel"```, ```3000```- 3s|
| ```fade:```|``` true```|Set fade in ```true``` or ```false``` for  ``` mode:"table"```|

## Change log
10.11.2021.  v.1.0.1 
- replaced deprecated "request" with "node-fetch" 
