importScripts('sw-toolbox.js');toolbox.precache(['src/']);toolbox.router.get('src/imgs/*',toolbox.cacheFirst);toolbox.router.get('/*',toolbox.networkFirst,{networkTimeoutSeconds:5});