import * as _ from 'lodash';
import * as fss from 'fs-extra';
import * as path from 'path'

const assets = [{ srcDir: path.join(__dirname, './../../src/statics'), destDir: path.join(__dirname, './../../dist/statics') }]

_.forEach(assets, a => {
    try {
        fss.copySync(a.srcDir, a.destDir, { overwrite: true });
    } catch (error) {
        console.log(error);
    }
})