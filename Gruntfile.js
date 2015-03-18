
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-contrib-clean');

  var src = ['lib/**/*.js'];

  grunt.initConfig({
    clean : {
      doc : 'jsdoc',
      coverage : 'covevx'
    },
    eslint: {
      options: {
        config: '.eslintrc'
      },
      target: src
    },
    mocha_istanbul: {
      unit: {
        src: 'test/specs',
        options: {
          mask: '**/*.spec.js',
          root: 'lib',
          reportFormats: ['html'],
          reporter : 'spec',
          coverageFolder : 'covevx/unit'
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['lib/**/*.js'],
        options: {
          destination: 'jsdoc'
        }
      }
    },
    watch : {
      src : {
        files : src,
        tasks : ['test:fast']
      }
    }
  });

  grunt.registerTask('default', ['test', 'build']);
  grunt.registerTask('build', ['clean:doc','jsdoc']);
  grunt.registerTask('test', ['eslint', 'clean:coverage', 'mocha_istanbul']);
  grunt.registerTask('test:fast', ['mocha_istanbul']);
};
