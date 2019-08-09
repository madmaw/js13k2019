module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            dist: {
                tsconfig: './tsconfig.json'
            }
        },
        watch: {
            default: {
                files: ["src/ts/**/*", "index.html", "index.css"], 
                tasks: ['ts:dist'],
                options: {
                    livereload: true
                }                    
            }
        },
        connect: {
            server: {
                options: {
                    livereload: true
                }
            }    
        },
        clean: {
            all: ["build", "dist", "dist.zip", "js13k.zip"],
            dist: ["ts:dist"]
        },
        'closure-compiler': {
            js13k: {
                closurePath: 'libbuild/closure-compiler-v20190729',
                js: 'build/out.js',
                jsOutputFile: 'dist/out.min.js',
                maxBuffer: 500,
                reportFile: 'closure.txt',
                options: {
                    compilation_level: 'ADVANCED_OPTIMIZATIONS',
                    language_in: 'ECMASCRIPT6',
                    language_out: 'ECMASCRIPT6', 
                    externs: 'src/externs/externs.js'
                }
            }
		},
		cssmin: {
			options: {
			},
			target: {
			  	files: {
					'dist/index.css': ['dist/index.css']
			  	}
			}
		},
		htmlmin: {                                     
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {                                   
					'dist/index.html': 'dist/index.html'
				}	
			}
		},
        inline: {
            dist: {
                src: 'dist/index.html',
                dest: 'dist/index.html'
            }
        },
        replace: {
            html: {
                src: ['dist/index.html'],
                overwrite: true,
                replacements: [{
                    from: /build\/bundle\.js/g, 
                    to:"out.min.js"
                }, { // gut the HTML entirely!
                    from: "</canvas>", 
                    to: ""
                }, {
                    from: "</body></html>", 
                    to: ""
                }, {
                    from: "<html>", 
                    to: ""
                }, {
                    from: "<body>", 
                    to: ""
                }]
            }
        },
        copy: {
            html: {
                files: [
                    {expand: true, src: ['index.html'], dest: 'dist/'},
                    {expand: true, src: ['index.css'], dest: 'dist/'}
                ]
            }
        },
        devUpdate: {
            main: {
                options: {
                    //task options go here 
                    updateType: 'force',
                    reportUpdated: true
                }
            }
        }
    });

    // clean
    grunt.loadNpmTasks('grunt-contrib-clean');
    // load the plugin that provides the closure compiler
    grunt.loadNpmTasks('grunt-closure-compiler');
    // Load the plugin that provides the "TS" task.
    grunt.loadNpmTasks('grunt-ts');
    // copy
    grunt.loadNpmTasks('grunt-contrib-copy');
    // replace text in file
    grunt.loadNpmTasks('grunt-text-replace');
    // update version
    grunt.loadNpmTasks('grunt-dev-update');
    // inline js 
    grunt.loadNpmTasks('grunt-inline');
    // live reload
    grunt.loadNpmTasks('grunt-contrib-watch');
    // server for live reload
    grunt.loadNpmTasks('grunt-contrib-connect');
    // copying html
	grunt.loadNpmTasks('grunt-contrib-copy');
	// minifying css
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	// minifying html
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

    // Default task(s).
    grunt.registerTask('reset', ['clean:all']);
    grunt.registerTask('prod', ['ts:dist']);
    grunt.registerTask('dist', ['prod', 'closure-compiler:js13k', 'copy','cssmin','replace:html', 'inline', 'htmlmin']);
    grunt.registerTask('default', ['prod', 'connect', 'watch']);

};