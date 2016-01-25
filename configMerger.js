'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var json2yaml = require('./json2yaml.js');

module.exports = function (data) {

    return through.obj(function (file, enc, cb) {
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit(
                'error',
                new gutil.PluginError('configMerger', 'Streaming not supported')
            );
        }

        try {
            var yamlData = '';

            Object.keys(data.config).forEach(function (k) {
                yamlData += k.toString() + ": " + json2yaml.stringify(data.config[k]);
            });

            var contents = file.contents.toString() + "\n\n" + yamlData;

            file.contents = new Buffer(contents);
            file.path = gutil.replaceExtension(file.path, ".yml");
        } catch (err) {
            this.emit('error', new gutil.PluginError('configMerger', err.toString()));
        }

        this.push(file);
        cb();
    });
};
