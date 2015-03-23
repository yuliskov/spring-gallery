//The build will inline common dependencies into this file.

//For any third party dependencies, like jQuery, place them in the lib folder.

//Configure loading modules from the lib directory,
//except for 'app' ones, which are in a sibling
//directory.
require.config({
    baseUrl: 'js/lib',
    // apply "baseUrl + paths" rules for finding
    paths: {
        app: '../app',
        backbone: 'backbone/backbone',
        underscore: 'backbone/underscore',
        bootstrap: 'bootstrap3/js/bootstrap',
        jquery: 'jquery/jquery',
        'jquery.ui.core': 'jquery.ui/jquery.ui.core',
        'jquery.ui.widget': 'jquery.ui/jquery.ui.widget',
        'jquery.ui.mouse': 'jquery.ui/jquery.ui.mouse',
        'jquery.ui.sortable': 'jquery.ui/jquery.ui.sortable',
        html5: 'http://html5shim.googlecode.com/svn/trunk/html5',
        'bootstrap.docs': 'docs',
        holder: 'holder.min',
        'ZeroClipboard.Core': 'ZeroClipboard.Core.min',
        ZeroClipboard: 'ZeroClipboard.min',
        data: '../data'
    },
    // non-AMD scripts
    shim: {
        bootstrap: ['jquery'],
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        'jquery.ui.core': ['jquery'],
        'jquery.ui.widget': ['jquery'],
        'jquery.ui.mouse': ['jquery', 'jquery.ui.core', 'jquery.ui.widget'],
        'jquery.ui.sortable': ['jquery', 'jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse'],
        ZeroClipboard: {
            deps: ['ZeroClipboard.Core'],
            exports: 'ZeroClipboard'
        },
        'bootstrap.docs': ['jquery', 'bootstrap']
        // 'bootstrap.docs': ['jquery', 'bootstrap', 'holder', 'ZeroClipboard']
    }
});

// First, checks if it isn't implemented yet.
if (typeof String.prototype.startsWith !== 'function') {
    String.prototype.startsWith = function(needle) {
        return (this.indexOf(needle) == 0);
    };
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return (this.indexOf(suffix, this.length - suffix.length) !== -1);
    };
}

if (typeof String.prototype.contains !== 'function') {
    String.prototype.contains = function(suffix) {
        return (this.indexOf(suffix) !== -1);
    };
}

//first, checks if it isn't implemented yet
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments
        var index = 0
        return this.replace(/{(\d*)}/g, function(match, number) {
            if (!number) {
                number = index
            }
            index++;
            return typeof args[number] != 'undefined' ? args[number] : args[0];
        })
    }
}

require(['underscore'], function() {
    // attempt to find template that best works with jsp/jsf technologies
    _.templateSettings = {
        evaluate: /<<([\s\S]+?)>>/g,
        interpolate: /<<=([\s\S]+?)>>/g,
        escape: /<<-([\s\S]+?)>>/g
    }
});