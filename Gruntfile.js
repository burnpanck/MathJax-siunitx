module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
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
    }
  });
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.registerTask('build', ['requirejs:js']);
  grunt.registerTask('default', ['build']);
};