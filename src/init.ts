import * as  nconf from 'nconf';

nconf.env().file({file: 'src/../config/env/config.json'});