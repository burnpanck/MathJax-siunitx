module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    peg: {
      numberparser : {
        src: "unpacked/number-parser.peg",
        dest: "unpacked/number-parser-peg.js",
        options: {
          optimize: 'size',
          wrapper: function (src, parser) {
            return 'define([], function () { return ' + parser + '; });';
          }
        }
      }
    },
    requirejs: {
      js: {
        options: {
          'findNestedDependencies': true,
          'baseUrl': 'src/js/app/modules',
          'optimize': 'none',
          'mainConfigFile': 'src/js/app/config/config.js',
          'include': ['first'],
          'out': 'unpacked/siunitx.js',
          'onModuleBundleComplete': function (data) {
            var fs = require('fs'),
              amdclean = require('amdclean'),
              outputFile = data.path;

            fs.writeFileSync(outputFile, amdclean.clean({
              'filePath': outputFile
            }));
          }
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    }
  });
  grunt.loadNpmTasks('grunt-peg');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('build', ['peg','requirejs:js']);
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('default', ['build','test']);
};