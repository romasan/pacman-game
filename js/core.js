var move_map_to_center;
var MIN_POINTS_TO_SAVE = 5
var USE_KEYS = false
var AUTOSAVE = true
// var SOUND = true

/*
Алгоритм поведения привидений в игре Pac-Man
http://habrahabr.ru/post/109406/

The Pac-Man Dossier
http://home.comcast.net/~jpittman2/pacman/pacmandossier.html
http://home.comcast.net/~jpittman2/pacman/BreakAMillionAtPacman.pdf
http://home.comcast.net/~jpittman2/pacman/HowToWinAtPacman.pdf
*/

// canvas - without Kinetic
var _image = function(attrs) {
			
	var x      = attrs.x || 0,
		y      = attrs.y || 0,
		width  = attrs.width || 0,
		height = attrs.height || 0,
		image  = attrs.image
	this.visible = true
	this.getX = function() {
		return x
	}
	this.getY = function() {
		return y
	}
	this.getWidth = function() {
		return width
	}
	this.getHeight = function() {
		return height
	}
	this.getImage = function() {
		return image
	}
	this.setPosition = function(_x, _y) {
		x = _x
		y = _y
	}
	this.hide = function() {
		this.visible = false
	}
	this.show = function() {
		this.visible = true
	}
	this.setImage = function(_image) {
		if(_image == null) throw new (function() {this.name = "Image error";this.message = "Image is null"})()
		image = _image
	}
	this.setWidth = function(_width) {
		width = _width
	}
	this.remove = function() {}
}

var _layer = function(attrs) {

	var container = document.getElementById(attrs.container)
	var canvas = document.createElement("canvas")
    canvas.width = attrs.width
    canvas.height = attrs.height
    canvas.id = "layer-1"
	container.appendChild(canvas)
    var ctx = canvas.getContext("2d")
	var images = []
	var images_id = 1
	this.draw = function() {
		canvas.width = canvas.width
		canvas.height = canvas.height
		for(i in images) {
			if(images[i].visible == true) {
				try{ctx.drawImage(
					images[i].getImage(),
					images[i].getX(),
					images[i].getY(),
					images[i].getWidth(),
					images[i].getHeight()
				)} catch(e) {
				}
			}
		}
	}
	this.add = function(image) {
		image.id = images_id
		images_id += 1
		image.remove = function(id) {
			
			/*var clone = images
			images = []
			for(i in clone) {
				if(clone[i].id != id) images.push(clone[i])
			}
			clone = []*/

			for(i in images) {
				if(images[i].id == id) {
					images.splice(i, 1)
					break;
				}
			}


		}.bind(this, image.id)
		images.push(image)
	}
	this.removeChildren = function() {
		for(i in images) delete images[i]
		images = []
	}
}

Game = function() {

		var configuration = {
				show_hint: false,
				game_type: 1
		}
		
		var default_lives = lives = 3
			canvas_width  = 560 * 1.1,
			canvas_height = 620 * 1.1
		var map_width = 28, map_height = 31,
			block_width = (block_height = canvas_height / map_height)|0
		var canvas_area = "map";
		var points = 0;
		
		var stage, layer;
		var assets

		var _ = EMPTY = 0,
			BODY      = 1,
			W = WALL  = 2,
			BONUS     = 3;

		var codes = {
			'37': 'left',
			'39': 'right',
			'65': 'left',//a
			'68': 'right',//d
			'38': 'up',
			'40': 'down',
			'87': 'up',//w
			'83': 'down',//s
			'32': 'space',
			'78': 'N',
			'80': 'P',
			'71': 'G',
			'13': 'enter'
		}


		var	Q = 'Q' ,
		    W = 'W' ,
		    E = 'E' ,
		    A = 'A' ,
		    s = 's' ,
		    S = '_s',
		    D = 'D' ,
		    Z = 'Z' ,
		    X = 'X' ,
		    C = 'C' ,
		    q = '_q',
		    w = '_w',
		    e = '_e',
		    a = '_a',
		    P = 'P' ,
		    p = '_p',
		    z = '_z',
		    c = '_c',
		    T = 'T' ,
		    Y = 'Y' ,
		    F = 'F' ,
		    V = 'V' ,
		    H = 'H' ,
		    B = 'B' ,
		    G = 'G' ,
		    o = 'o';
			//_ = '22';

		colors = ['',
			'pacman_full',
			'pacman_right_1',
			'pacman_right_2',
			'pacman_left_1',
			'pacman_left_2',
			'pacman_up_1',
			'pacman_up_2',
			'pacman_down_1',
			'pacman_down_2',
			'Q',
			'W',
			'E',
			'A',
			'D',
			'Z',
			'X',
			'C',
			's',
			'_s',
			'_q',
			'_w',
			'_e',
			'_a',
			'_z',
			'_c',
			'P',
			'_p',
			'T',
			'Y',
			'F',
			'V',
			'H',
			'B',
			'G',
			'o',
			//'blinky',
			//'pinky',
			//'inky',
			//'clyde',
			//'ghost',
			//'ghost_1',
			//'ghost_2',
			'ghost_up',
			'ghost_down',
			'ghost_left',
			'ghost_right',
			'ghost_a_1',
			'ghost_a_2',
			'ghost_b_1',
			'ghost_b_2',
			'blinky_right_1',
			'blinky_right_2',
			'blinky_left_1',
			'blinky_left_2',
			'blinky_up_1',
			'blinky_up_2',
			'blinky_down_1',
			'blinky_down_2',
			'pinky_right_1',
			'pinky_right_2',
			'pinky_left_1',
			'pinky_left_2',
			'pinky_up_1',
			'pinky_up_2',
			'pinky_down_1',
			'pinky_down_2',
			'inky_right_1',
			'inky_right_2',
			'inky_left_1',
			'inky_left_2',
			'inky_up_1',
			'inky_up_2',
			'inky_down_1',
			'inky_down_2',
			'clyde_right_1',
			'clyde_right_2',
			'clyde_left_1',
			'clyde_left_2',
			'clyde_up_1',
			'clyde_up_2',
			'clyde_down_1',
			'clyde_down_2',
			'die_1',
			'die_2',
			'die_3',
			'die_4',
			'die_5',
			'die_6',
			'die_7',
			'die_8'
		]

		var UP    = 0,
			LEFT  = 1,
			DOWN  = 2,
			RIGHT = 3;

		var dir = [
			'up',
			'left',
			'down',
			'right'
		]

		var game_id = null

		var level = 0
		var levels = [
			{
				map: [
					[ Q, W, W, W, W, W, W, W, W, W, W, W, W, T, Y, W, W, W, W, W, W, W, W, W, W, W, W, E ],
					[ A, p, p, p, p, p, p, p, p, p, p, p, p, a, a, p, p, p, p, p, p, p, p, p, p, p, p, D ],
					[ A, p, q, w, w, e, p, q, w, w, w, e, p, a, a, p, q, w, w, w, e, p, q, w, w, e, p, D ],
					[ A, P, a, s, s, a, p, a, s, s, s, a, p, a, a, p, a, s, s, s, a, p, a, s, s, a, P, D ],
					[ A, p, z, w, w, c, p, z, w, w, w, c, p, z, c, p, z, w, w, w, c, p, z, w, w, c, p, D ],
					[ A, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, D ],
					[ A, p, q, w, w, e, p, q, e, p, q, w, w, w, w, w, w, e, p, q, e, p, q, w, w, e, p, D ],
					[ A, p, z, w, w, c, p, a, a, p, z, w, w, e, q, w, w, c, p, a, a, p, z, w, w, c, p, D ],
					[ A, p, p, p, p, p, p, a, a, p, p, p, p, a, a, p, p, p, p, a, a, p, p, p, p, p, p, D ],
					[ Z, X, X, X, X, E, p, a, z, w, w, e, s, a, a, s, q, w, w, c, a, p, Q, X, X, X, X, C ],
					[ s, s, s, s, s, A, p, a, q, w, w, c, s, z, c, s, z, w, w, e, a, p, D, s, s, s, s, s ],
					[ s, s, s, s, s, A, p, a, a, s, s, s, s, s, s, s, s, s, s, a, a, p, D, s, s, s, s, s ],
					[ s, s, s, s, s, A, p, a, a, s, Q, W, W, G, G, W, W, E, s, a, a, p, D, s, s, s, s, s ],
					[ W, W, W, W, W, C, p, z, c, s, D, o, o, o, o, o, o, A, s, z, c, p, Z, W, W, W, W, W ],
					[ S, S, S, S, S, s, p, s, s, s, D, o, o, o, o, o, o, A, s, s, s, p, S, S, S, S, S, S ],
					[ X, X, X, X, X, E, p, q, e, s, D, o, o, o, o, o, o, A, s, q, e, p, Q, X, X, X, X, X ],
					[ s, s, s, s, s, A, p, a, a, s, Z, W, W, W, W, W, W, C, s, a, a, p, D, s, s, s, s, s ],
					[ s, s, s, s, s, A, p, a, a, s, S, S, S, S, S, S, S, S, s, a, a, p, D, s, s, s, s, s ],
					[ s, s, s, s, s, A, p, a, a, s, q, w, w, w, w, w, w, e, s, a, a, p, D, s, s, s, s, s ],
					[ Q, W, W, W, W, C, p, z, c, s, z, w, w, e, q, w, w, c, s, z, c, p, Z, W, W, W, W, E ],
					[ A, p, p, p, p, p, p, p, p, p, p, p, p, a, a, p, p, p, p, p, p, p, p, p, p, p, p, D ],
					[ A, p, q, w, w, e, p, q, w, w, w, e, p, a, a, p, q, w, w, w, e, p, q, w, w, e, p, D ],
					[ A, p, z, w, e, a, p, z, w, w, w, c, p, z, c, p, z, w, w, w, c, p, a, q, w, c, p, D ],
					[ A, P, p, p, a, a, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, a, a, p, p, P, D ],
					[ F, w, e, p, a, a, p, q, e, p, q, w, w, w, w, w, w, e, p, q, e, p, a, a, p, q, w, H ],
					[ V, w, c, p, z, c, p, a, a, p, z, w, w, e, q, w, w, c, p, a, a, p, z, c, p, z, w, B ],
					[ A, p, p, p, p, p, p, a, a, p, p, p, p, a, a, p, p, p, p, a, a, p, p, p, p, p, p, D ],
					[ A, p, q, w, w, w, w, c, z, w, w, e, p, a, a, p, q, w, w, c, z, w, w, w, w, e, p, D ],
					[ A, p, z, w, w, w, w, w, w, w, w, c, p, z, c, p, z, w, w, w, w, w, w, w, w, c, p, D ],
					[ A, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, p, D ],
					[ Z, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, X, C ]

				],

				pacman: {
					x: 13,
					y: 23,
					d: LEFT
				},
				door: {
					x: 13,
					y: 11
				},
				ghosts: {

					blinky: {
						x: 13,
						y: 11,
						d: RIGHT,
						home: {
							x: 28,
							y: 0
						}
					},
					pinky: {
						x: 13,
						y: 14,
						d: RIGHT,
						home: {
							x: 0,
							y: 0
						}
					},
					inky: {
						x: 11,
						y: 14,
						d: UP,
						home: {
							x: 28,
							y: 31
						}
					},
					clyde: {
						x: 15,
						y: 14,
						d: UP,
						home: {
							x: 0,
							y: 31
						}
					}

				}
			}
		];
		
		var move_map_to_center = function() {
			
			var _current = $(".in-center")[0];
			var _parent = $(".in-center").parent()[0];
			
			var _top = (_parent.offsetHeight - _current.offsetHeight) / 2;
			if(_top < 0) { _top = 0; }
			
			var _left = (_parent.offsetWidth - _current.offsetWidth) / 2;
			if(_left < 0) { _left = 0; }

			console.log('>>>', _current.offsetWidth, _current.offsetHeight, _parent.offsetWidth, _parent.offsetHeight, _top, _left)
			
			$("#map").css({
				position: 'relative',
				top  : _top  + 'px',
				left : _left + 'px'
			});
		
		}

		var start_time = null
		var time = 0
		var _time = 0

		var reset_timer = function() {
			current_time = 0
			last_action_time = new Date().getTime()
		}

		var last_action_time = 0
		var current_time = 0
		var last_time = 0
		var pause_timer = false

		var _assets_loaded = false

		var _need_points = 0
		var _points_on_level = 0


		var timer = function() {
			var time2 = new Date().getTime()
			if( $("#prompt-window:visible").length == 0)
			if(!pause_timer && !pause) {
				//if(time2 - last_action_time < 15e3)
				current_time += time2 - last_time
				redraw_timer()
			}
			last_time = time2

			if(typeof to_timer == 'function' && !pause) to_timer(current_time)

			setTimeout(function() {
					timer()
			}, 1000)
		}

		var redraw_timer = function() {
			$('#info-time').html(
				// formatGameTimeMS(current_time)
				current_time
			)
		}

		var _show_info = null
		var show_info = function(text) {
				$('#info-text').html(text)
				clearTimeout(_show_info)
				_show_info = setTimeout(function() {$('#info-text').html('')}, 3e3)
		}

		var _send_history = false
		
		var message = function(title, message) {
			$('#message-title').html(title)
			$('#message-text').html(message)
			$('#message-window').show()
			move_map_to_center()
			pause_timer = true
		}

		var pause = false;
		var pause_f = false;
		
		var _prompt_done = null
		var _prompt_cancel = null
		var prompt_done = function() {
			if(typeof _prompt_done == "function") _prompt_done()
			$('.bubblePanel').hide()
		}
		this.prompt_done = prompt_done
		var prompt_cancel = function() {
			if(typeof _prompt_cancel == "function") _prompt_cancel()
			$('.bubblePanel').hide()
		}
		this.prompt_cancel = prompt_cancel
		var prompt = function(title, message, done, cancel) {}
		var _prompt2 = false
		var prompt2 = function(title, message, done) {}



		var loaded = false

		var draw_history = function(e) {}

		var fixing = function() {}

		var _online = false

		var draw_rating = function(z) {}

		var _toggle_history = false
		var _toggle_rating = false

		var history_preload = function() {}
		
		window._toggle_history = function(a) {
			_toggle_history = a
		}
		
		window._toggle_rating = function(a) {
			_toggle_rating = a
		}
		
		var toggle_history = function() {

			$('#history-block:visible').hide()
			if($("#bbHistory").hasClass("yellow")) return;
			//if(_toggle_history) {
			//_toggle_history = false
			//} else {
				$('#history-content .row').remove()
				$('#history-preload').show()
				$('#history-block, #history-title').hide()
				$("#history-content").hide()
				ui.showPanel({id:"history-block"})
				move_map_to_center()
				history_preload()
				var _e = $('#history-content')
				$('.row + .row', _e).remove()
				$('.row:eq(0)', _e).remove()
				get_history()
				if(_toggle_rating) {
					$("#rating-block").hide().find('.rating-table').remove()
					_toggle_rating = !1
				}
				_toggle_history = true
			//}

		}

		var rating_preload = function() {}

		var toggle_rating = function() {}

		this.toggle_rating  = toggle_rating
		this.toggle_history = toggle_history

		var get_history = function(page) {}

		var saved_level = null

		var temp_save = window.temp_save = window.onbeforeunload = function() {


			if(AUTOSAVE) {
				window.getStateAll()
			} else {
				if(points > 300) window.send_save()
			}
		}
		var temp_recover = window.temp_recover = function(g) {
			/*if(g == null) {
				if(localStorage.hasOwnProperty('pacman_save') == false) return
				g = localStorage.pacman_save
			}*/
			lives =        g.lives
			points =       g.points
			current_time = g.current_time
			level =        g.level
			_pacman.clear_body()
			_pacman.head = {
				x: g.pacman.head.x,
				y: g.pacman.head.y,
				d: g.pacman.head.d
			}
			_pacman.trail = []//_pacman.trail
			for(i in g.pacman.trail) {
				_pacman.trail.push({
					x: g.pacman.trail[i].x,
					y: g.pacman.trail[i].y,
					d: g.pacman.trail[i].d
				})
			}
			_pacman.draw()
		}

		var save_level = window.save_level = function() {
			saved_level = {
				//map: JSON.stringify( map ),
				//pacman: JSON.stringify( _pacman ),
				//level: level,
				lives: lives,
				points:points,
				current_time: current_time
			}
			return saved_level
		}
		var recover_saved_level = window.recover_saved_level = function() {
			if(saved_level == null) return;
			points = saved_level.points
			lives = saved_level.lives
			current_time = saved_level.current_time
			new_game()
			redraw_timer()
		}

		var get_rating = function(page, sort_by, order) {}

		var get_rating2 = function(page, sort_by, order, online) {}

		this.get_rating = get_rating

		var get_state = window.get_state = function() {
			var _state = {}
			
			_state.level = level
			_state.points = points
			_state.lives = lives
			_state.current_time = current_time
			_state.pacman = {
				head: _pacman.head,
				trail: _pacman.trail
			}
			_state.bonus = bonus
			return _state
		}

		var show_configuration_window = function() {}

		var save_configuration = function() {}

		this.save_configuration = save_configuration
		this.show_configuration_window = show_configuration_window

		var new_game = function(next) {

			if(_pacman2 && _pacman2.getPoints(true) > 300) {
				window.send_save()
			}
			_new_game(next)
			if(_pacman2) {
				_pacman2.resetLives()//lives = 3
				$("#info-lives").html(_pacman2.getLives())
			}
			current_time = 0
			$('#info-time').html(formatGameTimeMS(current_time))
			//redraw_timer()
			points = 0
			$("#info-points").html(points)
			//$("#tbPause").addClass("yellow")
			//pause = true
			$("#tbPause").removeClass("yellow")
			pause = false
			level = 1
			$("#info-level").html(level)

		}
		
		var _pacman = null
		var _pacman2 = null
		
		_new_game_t = null
		this.dropLevel = function() {

			lives = default_lives
			level = 0
			points = 0
			current_time = 0
			redraw_timer()
		}

		var _map_g = null
		
		var _new_game = function(command) {

			_points_on_level = 0

			localStorage.removeItem('pacman_save')

			saved_level = null;

			eaten = 0
			_need_points = 0

			_pause = false
			debug_stop = false

			//if(_save) level = _save.level

			if(_pacman2 && _pacman2.getLives() < 0) {
				//level = 0
				_pacman2.resetLives()
				points = 0
				$("#info-points").html(points)
				game_id = null
				reset_timer()
				//new_game()
				$("#info-lives").html(_pacman2.getLives())
			}


			//if(level >= levels.length) {level = 0}

			if(!_assets_loaded) {
				_new_game_t = setTimeout(function() {
					_new_game(command)
				}.bind(this), 100);
				return;
			}

			pause_timer = true

			last_action_time = new Date().getTime()

			//pause = true
			//$("#tbPause").addClass("yellow")
			pause_timer = false

			$("#info-level").html(level + 1)
			$("#info-points").html(points)

			/*if(_pacman2 != null) {
				_pacman2.destroy()
				_pacman2 = null 
			}*/

			try{
				for(i in _ghosts) {
					_ghosts[i].destroy()
				}
			} catch(e) {}
			_ghosts = {}

			layer.removeChildren()
			map_init()

			

			//$("#info-length").html( (_pacman.trail.length + 1) + " из " + levels[level].pacman.finish_length )

			var map2 = levels[0].map
			_map_g = []
			for(y in map2) {
				_map_g[y] = []
				for(x in map2[y]) {
					_map_g[y][x] = p2go(levels[0].map[y][x]) || levels[0].map[y][x] == G ? 0 : 1
					if(map2[y][x]) {
						_map[y][x].type = levels[0].map[y][x]
						//_map[y][x].type = WALL

						try {
							if( levels[0].map[y][x] == p 
							 || levels[0].map[y][x] == P
							) _need_points += 1;
							_map[y][x].shape.setImage(assets.getResult( levels[0].map[y][x] ))
							//image = assets.getResult( levels[level].map[y][x] )

						} catch(e) {
							_map[y][x].shape.setImage(assets.getResult('wall'))
							//image = assets.getResult( 'wall' )
						}
						_map[y][x].shape.show()
					}
				}
			}
			
			
			/*for(y in _map_g) {
				var s = []
				for(x in _map_g[y]) {
					s.push(_map_g[y][x])
				}
			}*/
			add_ghosts()

			var _c = block_center( levels[0].pacman.x, levels[0].pacman.y )
			if(_pacman2 == null) {
				_pacman2 = new pacman2(
					_c.x,
					_c.y,
					levels[0].pacman.d
				)
			} else {
				_pacman2.respawn(true)
			}
			$("#info-lives").html(_pacman2.getLives())

			USE_KEYS = true

			//new_bonus()

			$('#info-points').html(0)
			$('#info-points-plus').html('')

			/*if(command != null && command.next_level != null) {
				save_level()
			} else {
				game_id = null
			}*/
			
			moves = 0

			steps = 0
			//points = 0
			$("#info-steps").html(steps)
			$("#info-points").html(points)
			$("#info-points-plus").html('')
			
			$('#tbReplay').addClass('bt-disabled')
			
			store = []
			animation_stack = []

			$("#info-steps").html(steps)
			$("#info-level").html( level + 1 )

			if(command != null && typeof command == 'function') {
				command()
			}

			_save = false
		}

		var _changes_ver = 'chahges-new'
		
		var debug_stop = false
		
		manifest = []
		for(i in colors) if(colors[i]) manifest.push({id: colors[i], src: colors[i] + '.png'})
		

		//var block = null;
		var balls = []
		window.balls = balls
		var el_block = null

		// --------

		this.toggle_pause = function() {
			pause ^= true
			$("#tbPause").toggleClass("yellow")
		}

		this.toggle_pause_f = window.toggle_pause_f = function() {
			pause ^= true
			pause_f = pause
			$("#tbPause").toggleClass("yellow")
			pause_timer = pause_timer
		}
		this._play_f = function() {
			if(!$("#tbPause").hasClass("yellow")) return;
			pause = false
			pause_f = pause
			$("#tbPause").removeClass("yellow")
			pause_timer = pause_timer
		}

		var _left = _right = false

		var top_line = bottom_line = -1

		var _map = []

		var bonus = null
		
		var map_init = function() {

			
			var image = assets.getResult( 'wall' )
			
			for(y = 0; y < map_height; y++) {
				_map[y] = []
				for(x = 0; x < map_width; x++) {

				var _x = x * block_width,
					_y = y * block_height

				try {
					image = assets.getResult( levels[0].map[y][x] )
				} catch(e) {
					image = assets.getResult( 'wall' )
				}
				var test = new _image({//Kinetic.Image({
					x: _x,
					y: _y,
					width: block_width,
					height: block_height,
					image: image
				})
				_map[y][x] = {
					shape: test,
					visible: false,
					type: EMPTY
				}

				layer.add(test);

				//test.hide()
			}}
			/*for(y in levels[level].map) {
				for(x in levels[level].map[y]) {
					if(levels[level].map[y][x] == WALL) {
						_map[y][x].shape.setImage(assets.getResult('wall'))
						_map[y][x].shape.show()
					}
				}

			}*/
			
		//-------------------------------

			layer.draw()		
		}
		var _d = [
			{x : 0, y : -1},// 0 - up
			{x : -1, y : 0},// 1 - left
			{x : 0, y : 1},/// 2 - down
			{x : 1, y : 0},/// 3 - right
		]
		var _d_is = function(d) {
			for(i in _d) {
				if(d.x == _d.x && d.y == _d.y) return i
			}
			return -1
		}
		
		
		var new_bonus = function(_new) {
			var x = (Math.random() * _map.length)|0
				y = (Math.random() * _map.length)|0
			if(_new != null) {
				x = _new.x
				y = _new.y
			}
			if(_map[y][x].type == EMPTY) {
				_map[y][x].type = BONUS
				_map[y][x].shape.setImage(assets.getResult('bonus'))
				_map[y][x].shape.show()
				layer.draw()
				if(bonus != null) {
					_map[bonus.y][bonus.x].shape.setOpacity(1)
				}
				bonus = {x: x, y: y}
			} else {
				new_bonus()
			}

		}
		var repeater2 = null
		var debug_stop = false
		window.debug_get_pacman_speed = function() {
			return _pacman.get_speed()
		}

		// -----------------------------

		var draw_repeater = function(not_first) {
			layer.draw()
			if(typeof requestAnimationFrame == "function") {
		  		requestAnimationFrame(function() {draw_repeater(true)})
		  	} else {
		  		setTimeout(function() {draw_repeater(true)}, 1)
		  	}
		}

		// -------------------------------------

		var _ghosts = {}
		
		window.debuggetAll = function() {
			return {
				ghosts: _ghosts,
				pacman: _pacman2,
				points: points
			}
		}

		var to_timer = null

		var add_ghosts = function() {
			for(i in levels[0].ghosts) {
				ghosts[i].default_block = {
					x : levels[0].ghosts[i].x,
					y : levels[0].ghosts[i].y
				}
				/*var _ghost = i
				var _x = levels[level].ghosts[i].x
				var _y = levels[level].ghosts[i].y
				_map[_y][_x].shape.setImage(assets.getResult(_ghost))*/
			}
			for(i in ghosts) {
				var _p_ghost = block_center(ghosts[i].default_block.x, ghosts[i].default_block.y)
				_ghosts[i] = new ghost(_p_ghost.x, _p_ghost.y, i)
			}

			/*
			1. Разбегание в течении 7 секунд, погоня 20 секунд.
			7
			27
			2. Разбегание в течении 7 секунд, погоня 20 секунд.
			34
			54
			3. Разбегание в течении 5 секунд, погоня 20 секунд.
			59
			79
			4. Разбегание в течении 5 секунд, затем постоянная погоня.
			84
			*/
			to_timer = function(t) {
				if(t > 84 * 1e3) {hunting_all()} else
				if(t > 79 * 1e3) {hidding_all()} else
				if(t > 59 * 1e3) {hunting_all()} else
				if(t > 54 * 1e3) {hidding_all()} else
				if(t > 34 * 1e3) {hunting_all()} else
				if(t > 27 * 1e3) {hidding_all()} else
				if(t > 7 *  1e3) {hunting_all()} else
				if(t > 0 *  1e3) {hidding_all()}
			}
		}

		// ------------------------------------

		var p_block = function(x, y) {
			return {
				x: (x / block_width)  | 0,
				y: (y / block_height) | 0
			}
		}

		var block_center = function(x, y) {
			return {
				x : (block_width  * x + block_width  / 2) | 0,
				y : (block_height * y + block_height / 2) | 0
			}
		}

		var d_180 = function(d) {
			return d < 2 ? d + 2 : d - 2
		}
		var d_left = function(d) {
			return d > 0 ? d - 1 : d + 3
		}
		var d_right = function(d) {
			return d < 3 ? d + 1 : d - 3
		}
		
		var p_is_p = function(a, b) {
			return a.x == b.x
				&& a.y == b.y
		}

		var p_on_map = function(x, y) {
			var _block = p_block(x, y),
			x = _block.x
			y = _block.y
			return x >= 0
				&& x < map_width
				&& y >= 0
				&& y < map_height
		}

		var p_on_map2 = function(x, y) {
			//var _block = p_block(x, y),
			//x = _block.x
			//y = _block.y
			return x >= 0
				&& x < map_width
				&& y >= 0
				&& y < map_height
		}

		var p_next = function(x, y, d) {
			var _p_next = {x: (x|0) + (_d[d].x|0), y: (y|0) + (_d[d].y|0)}
			return p_on_map(_p_next.x, _p_next.y) ? _p_next : false
		}
		var p_in_middle = function(x, y, d) {
			var __middle = p_block(x, y),
				_middle = block_center(__middle.x, __middle.y)
			switch(d) {
				case UP:
					return y <= _middle.y; break;
				case RIGHT:
					return x >= _middle.x; break;
				case DOWN:
					return y >= _middle.y; break;
				case LEFT:
					return x <= _middle.x; break;
			}
		}

		var p2go = function(type) {
			return type == s
				|| type == S
				|| type == p
				|| type == P
		}

		var is_turn = function(x, y, d) {
			
			var _l = _d[d_left(d)]
			var _r = _d[d_right(d)]
			
			var _A = p_on_map( (x|0) + (_l.x|0), (y|0) + (_l.y|0) ) ? 
					 p2go( _map[(y|0) + (_l.y|0)][(x|0) + (_l.x|0)].type ) : false,
				_B = p_on_map( (x|0) + (_r.x|0), (y|0) + (_r.y|0) ) ? 
					 p2go( _map[(y|0) + (_r.y|0)][(x|0) + (_r.x|0)].type ) : false
			return _A || _B

		}

		var v_length = function(vA, vB) {
			try{
				return Math.sqrt( (vA.x - vB.x) * (vA.x - vB.x) + (vA.y - vB.y) * (vA.y - vB.y) )
			} catch(e) {
				return 999999999
			}
		}
		var panic_timer = null
		var ghost_num = 0
		window.ghost_num_reset = function() {
			ghost_num = 0
		}
		var panic_mode = function() {
			clearTimeout(panic_timer)
			for(i in _ghosts) {
				_ghosts[i].PanicOn()
			}
			panic_timer = setTimeout(function() {
				for(i in _ghosts) {
					_ghosts[i].PanicOff(i == _ghosts.length - 1)
				}
				//ghost_num = 0
			}, 6 * 1e3)
		}

		var ghosts = {

			blinky : {
				default_block: {x: map_width - 2, y: 1}
				//default_home_block: {x: map_width - 2, y: 1}
			},
			pinky : {
				default_block: {x: 1, y: 1}
				//default_home_block: {x: 1, y: 1}
			},
			inky: {
				default_block: {x: map_width - 2, y: map_height - 2}
				//default_home_block: {x: map_width - 2, y: map_height - 2}
			},
			clyde : {
				default_block: {x: 1, y: map_height - 2}
				//default_home_block: {x: 1, y: 1}
			}

		}

		var WAIT    = 0,
			HUNTING = 1,
			HIDING  = 2,
			//PANIC   = 3,
			LEAVE   = 3,
			GOHOME  = 4
		var _mode = [
			'WAIT',
			'HUNTING',
			'HIDING',
			//'PANIC',
			'LEAVE',
			'GOHOME',
		]


		var global_speed = 10.0
		/*
					PAC-MAN SPEED								GHOST SPEED		
			LEVEL	NORM	NORM DOTS	FRIGHT	FRIGHT DOTS		NORM	FRIGHT	TUNNEL
			1		80%		~71%		90%		~79%			75%		50%		40%
			2 – 4	90%		~79%		95%		~83%			85%		55%		45%
			5 – 20	100%	~87%		100%	~87%			95%		60%		50%
			21+		90%		~79%		–		–				95%		–		50%
		*/

		// ------------------------------------------
		
		var ghost = function(x, y, name) {

			var livetime = 0
			var shape = null

			this.respawn = function() {
				panic = false
				if(mode != WAIT) {
					_out = false
					d = d_next = UP//levels[0].ghosts[name].d
					var _p = block_center(levels[0].ghosts[name].x, levels[0].ghosts[name].y)
					x = (_p.x|0) + (w/3)|0
					y = _p.y
					shape.setPosition(x - w / 2, y - h / 2)
					livetime = 0
					mode = ghosts_func[name].mode()
					//if( $('#' + name + '_log div').length > 10 ) $('#' + name + '_log div:eq(0)').remove()
					//$('#' + name + '_log').append("<div>" + _mode[mode] + " " + dir[d] + "</div>")
				}
				shape.setImage( assets.getResult(name + '_up_1') )// GHOST DEFAULT
			}
			this.getState = function() {
				return {
					x        : x,
					y        : y,
					d        : d,
					d_next   : d_next,
					panic    : panic,
					mode     : mode,
					_out     : _out,
					livetime : livetime
				}
			}
			this.setState = function(a) {
				x        = a.x
				y        = a.y
				d        = a.d
				panic    = a.panic
				mode     = a.mode
				_out     = a._out
				d_next   = a.d_next
				livetime = a.livetime
				shape.setPosition(x - w / 2, y - h / 2)
			}

			this.getMode = function() {
				return _mode[mode]
			}
			var home_block = ghosts[name].default_home_block
			var out_block = levels[0].door

			this.setHomeBlock = function(b) {
				home_block = b
			}

			var _out = name == 'blinky' ? true : false

			var panic = false

			var ghosts_func = {

				blinky : {
					target: function() {
						return {
							x: p_pacman.x, 
							y: p_pacman.y
						}
					},
					mode : function() {
						return _out ? HUNTING : LEAVE
					}
				},
				pinky : {
					target: function() {
						var _pd = _pacman2 ? _pacman2.getDirection() : RIGHT
						var z = 4
						return {
							x: p_pacman.x + _d[_pd].x * z, 
							y: p_pacman.y + _d[_pd].y * z
						}
					},
					mode : function() {
						return _out ? HUNTING : LEAVE
					}
				},
				inky: {
					target: function() {
						
						var _v = {
							x: p_pacman.x - p_ghost.x,
							y: p_pacman.y - p_ghost.y
						}
						var _vv = {x: _v.x, y: _v.y}
						var _p2 = {
							x: p_pacman.x + _v.x,
							y: p_pacman.y + _v.y
						}

						return {
							x: Math.round(_vv.x), 
							y: Math.round(_vv.y)
						}

					},
					mode : function() {
						return (_pacman2 && _pacman2.getEaten() > 30 && livetime > 40) ? ( _out ? HUNTING : (livetime > 40 ? LEAVE : WAIT) ) : WAIT
					}
				},
				clyde : {
					target: function() {
						
						return {
							x: p_pacman.x, 
							y: p_pacman.y
						}

					},
					mode : function() {
						var ret = (_pacman2 && _pacman2.getEaten() > _need_points / 3 && livetime > 80) 
							?  ( _out ? (v_length(p_pacman, p_ghost) > 8 ? HUNTING : HIDING) : (livetime > 80 ? LEAVE : WAIT) )
							: WAIT
						return ret
	
					}
				}

			}
			
			var frame = 0
			
			var saved_mode = null
			this.HidingOn = function() {
				if(mode == WAIT || saved_mode != null) return
				saved_mode = mode
				mode = HIDING
			}
			this.HidingOff = function() {
				if(mode != HIDING || saved_mode == null) return
				mode = saved_mode
				saved_mode = null
			}
			var _panic_timer = null
			var panic_type = 'a'
			this.PanicOn = function() {
				panic_type = 'a'
				clearTimeout(_panic_timer)
				if(mode == GOHOME) return
				panic = true
				//shape.setImage( assets.getResult('ghost_1') )
			}
			this.PanicOff = function() {
				if(mode == GOHOME) return
				if(!panic) return
				var i = 8
				var _panicOff = function() {
					if(i > 0 && e) {
						if(!pause) {
							panic_type = ((i % 2)|0) == 0 ? 'a' : 'b'
							shape.setImage( assets.getResult('ghost_' + panic_type + '_' + (frame < 2 ? 1 : 2)) )
							i -= 1
						}
						_panic_timer = setTimeout(_panicOff, 250)
					} else {
						//shape.setImage( assets.getResult(name) ) GHOST DEFAULT
						window.ghost_num_reset()
						panic = false
					}
				}
				_panicOff()
			}

			var d = name == 'blinky' ? RIGHT : UP//levels[0].ghosts[name].d//RIGHT//null
			var d_next = d
			var speed = global_speed / 100 * 75

			
			var p_repeater = null

			var w = h = 30
			x = (x|0) + (w / 3)|0

			image = assets.getResult( name + '_up_1' )
			shape = new _image({//Kinetic.Image({
				x: x - w / 2,
				y: y - h / 2,
				width: w,
				height: h,
				image: image
			})
			layer.add(shape)
			this.setShape = function(_shape) {
				shape.setImage(_shape)
			}

			var mode = ghosts_func[name].mode()

			var p_ghost = p_pacman = null
			var p_home = ghosts[name].default_home_block

			var step = 0
			var path = null

			/*
			var next_step_dir = function(from, to) {


				if(from.x > to.x && from.y == to.y) return LEFT///
				if(from.x < to.x && from.y == to.y) return RIGHT//
				if(from.x == to.x && from.y > to.y) return UP/////
				if(from.x == to.x && from.y < to.y) return DOWN///

			}
			*/

			var move2middle = function() {
				var __middle = p_block(x, y),
					_middle = block_center(__middle.x, __middle.y)
				x = _middle.x
				y = _middle.y
				shape.setPosition(x - w / 2, y - h / 2)
			}

			var p_last = p_block(x, y)

			var decision = function() {

				var p_target = null//ghosts_func[name].target()
				

				var _l = _d[d_left(d)],
					_r = _d[d_right(d)]
				
				var _ll = []
				var _dd = []
				
				if( [HUNTING, HIDING].indexOf(mode) >= 0 ) {

					p_target = (mode == HUNTING && panic == false) ? ghosts_func[name].target() : levels[0].ghosts[name].home
					//if(name == 'blinky')
			
					var _A = p_next( p_ghost_next.x, p_ghost_next.y, d_left(d) )
						_B = p_next( p_ghost_next.x, p_ghost_next.y, d )
						_C = p_next( p_ghost_next.x, p_ghost_next.y, d_right(d) )

					var pattern = [s, S, p, P]
					if(name != 'blinky' && mode == GOHOME) pattern.push(o)
					if(_A && pattern.indexOf(_map[_A.y][_A.x].type) >= 0) {
						_ll.push( v_length(_A, p_target) )
						_dd.push( d_left(d) )
					}
					var _forward = 0
					if(_B && pattern.indexOf(_map[_B.y][_B.x].type) >= 0) {
						_forward = v_length(_B, p_target)
						_ll.push( _forward )
						_dd.push( d )
					}
					if(_C && pattern.indexOf(_map[_C.y][_C.x].type) >= 0) {
						_ll.push( v_length(_C, p_target) )
						_dd.push( d_right(d) )
					}
					var _min = Math.min.apply(Math, _ll)
					d_next = _dd[_ll.indexOf(_min)]
					//if(_forward == _min && _min < 999) d_next = d

				}

				if( [LEAVE, GOHOME].indexOf(mode) >= 0 ) {

					p_target = out_block
					p_target = mode == GOHOME ? {x: levels[0].ghosts[name].x, y: levels[0].ghosts[name].y} : p_target

					var _A = p_next( p_ghost.x, p_ghost.y, d_left(d) )
						_B = p_next( p_ghost.x, p_ghost.y, d )
						_C = p_next( p_ghost.x, p_ghost.y, d_right(d) )
					
					var pattern = [o, s, S, p, P]
					if(name != 'blinky') pattern.push(G)
					
					if(_A && pattern.indexOf(_map[_A.y][_A.x].type) >= 0) {
						_ll.push( v_length(_A, p_target) )
						_dd.push( d_left(d) )
					}
					if(_B && pattern.indexOf(_map[_B.y][_B.x].type) >= 0) {
						_ll.push( v_length(_B, p_target) )
						_dd.push( d )
					}
					if(_C && pattern.indexOf(_map[_C.y][_C.x].type) >= 0) {
						_ll.push( v_length(_C, p_target) )
						_dd.push( d_right(d) )
					}
					var _min = Math.min.apply(Math, _ll)
					d_next = _dd[_ll.indexOf(_min)]

					try{
						if( mode == GOHOME && p_is_p(p_ghost, {x: levels[0].ghosts[name].x, y: levels[0].ghosts[name].y}) ) {
							mode = name == 'blinky' ? HUNTING : LEAVE
							_out = name == 'blinky' ? true : false 
							//shape.setImage( assets.getResult(name) ) GHOST DEFAULT
						}
					} catch(e) {
					}


					
				}


			}

			//decision()

			var move = function() {
				
					try {
						p_pacman = p_block(_pacman2.getX(), _pacman2.getY());
					} catch(e) {
						return false;

					}
				
				p_ghost = p_block(x, y)

				//[s, p, P].indexOf(_map[p_ghost.y][p_ghost.x].type) < 0

				if( _out == false && p_is_p(p_ghost, out_block) ) {
					mode = HUNTING
					_out = true
					//decision()
					if(d == UP) d = d_next = RIGHT
				}
				
				if( 
					p_is_p(p_pacman, p_ghost)
				 || ( p_is_p(p_pacman, {x: p_ghost.x - _d[d].x, y: p_ghost.y - _d[d].y}) && d != _pacman2.getDirection() )
				) {
					if(mode != GOHOME) {
						if(panic) {
							var _plus = ghost_num == 0 ? 200 : ghost_num == 1 ? 400 : ghost_num == 2 ? 800 : 1600
							points += _plus
							ghost_num += 1
							splashText('+' + _plus, x, y)
							$('#info-points').html(points)
							//this.respawn()
							mode = GOHOME
							//shape.setImage( assets.getResult('ghost') )
							panic = false
						} else {
							shape.setImage( assets.getResult('die_8') )
							_pacman2.kill()
						}
					}
				}

				if( [GOHOME, LEAVE].indexOf(mode) < 0 && livetime > (name == 'inky' ? 40 : 80) ) mode = ghosts_func[name].mode()
				if( name && mode && name == 'clyde' && mode == HIDING && !panic && livetime > 80 ) mode = ghosts_func[name].mode()

				p_ghost_next = p_next(p_ghost.x, p_ghost.y, d)
				//var __p = p_block(x, y)
				p_ghost = p_block(x, y)


				if(mode != WAIT) {
				
					if( !p_is_p(p_ghost, p_last) ) {

						if( p_in_middle(x, y, d) ) {

							if([LEAVE, GOHOME].indexOf(mode) >= 0) {

								decision()

								d = d_next

								shape.setPosition(x - w / 2, y - h / 2)

							} else {

								if( p_ghost_next && is_turn(p_ghost_next.x, p_ghost_next.y, d) ) {
									decision()
								} else {
									d = d_next
								}

							}
							p_last = {x: p_ghost.x, y: p_ghost.y}

						}

					}
					x += _d[d].x * speed * (1 + level * 0.01) * ( (_map[p_ghost.y][p_ghost.x].type == S || panic) ? (panic ? .5 : .7) : 1 )
					y += _d[d].y * speed * (1 + level * 0.01) * ( (_map[p_ghost.y][p_ghost.x].type == S || panic) ? (panic ? .5 : .7) : 1 )

					if(p_ghost.x <= 0 && d == LEFT) {
						p_ghost.x = map_width - 1
						x = block_center(p_ghost.x, p_ghost.y).x
					}
					if(p_ghost.x >= map_width - 1 && d == RIGHT) {
						p_ghost.x = 0
						x = block_center(p_ghost.x, p_ghost.y).x
					}

					if(_d[d].x == 0) x = block_center(p_ghost.x, p_ghost.y).x
					if(_d[d].y == 0) y = block_center(p_ghost.x, p_ghost.y).y


					shape.setPosition(x - w / 2, y - h / 2)

				}

				frame = frame >= 3 ? 0 : frame + 1
				if( !panic && [WAIT, HUNTING, LEAVE, HIDING].indexOf(mode) >= 0 ) {
					shape.setImage( assets.getResult(name + '_' + dir[d] + '_' + (frame < 2 ? 1 : 2)) )
				}
				if( mode == GOHOME ) {
					shape.setImage( assets.getResult('ghost' + '_' + dir[d]) )
				}
				if( panic ) {
					shape.setImage( assets.getResult('ghost_' + panic_type + '_' + (frame < 2 ? 1 : 2)) )
				}
			}.bind(this)

			var repeater = function() {
				livetime += 1
				p_repeater = setTimeout(repeater, 50)
				if(!pause) move()
			}
			repeater()

			this.destroy = function() {
				clearTimeout(p_repeater)
			}.bind(this)
		}

		// ------------------------------------------------

		var respawn_all = function() {
			_pacman2.respawn()
			for(i in _ghosts) {
				_ghosts[i].respawn()
			}
			this.toggle_pause_f()
		}.bind(this)
		var hidding_all =  window.debug_hiding_all = function() {
			for(i in _ghosts) {
				_ghosts[i].HidingOn()
			}
		}
		var hunting_all = function() {
			for(i in _ghosts) {
				_ghosts[i].HidingOff()
			}
		}

		var eaten = 0

		// ---------------------------------------

		window.getStateAll = function() {
			try {
				var r = {
					pacman: _pacman2.getState(),
					ghosts: {},
					time: current_time,
					_map: [],
					level: level
				}
				for(i in ghosts) {
					r.ghosts[i] = _ghosts[i].getState()
				}
				for(y in _map) {
					r._map[y] = []
					for(x in _map[y]) {
						r._map[y][x] = _map[y][x].type
					}
				}
				localStorage.pacman_state = JSON.stringify(r)
			} catch(e) {
				localStorage.removeItem('pacman_state')
			}
		}

		window.setStateAll = function() {
			if(!localStorage.pacman_state) return;
			//try{
				var a = JSON.parse(localStorage.pacman_state)
				_pacman2.setState(a.pacman),
				current_time = a.time
				for(i in ghosts) {
					_ghosts[i].setState(a.ghosts[i])
				}

				for(y in a._map) {
					for(x in a._map[y]) {
						_map[y][x].type = a._map[y][x]
						if(a._map[y][x] == s) _map[y][x].shape.setImage( assets.getResult(s) )
					}
				}

				redraw_timer()
				if(a.level != null) {
					level = a.level
				} else {
					_new_game()
				}
				$("#info-level").html(level + 1)
			//} catch(e) {
			//}
		}

		var splashText = function(text, x, y) {
			$("canvas").parent().append(
				$("<div>")
				.html(text)
				.css({
					color: 'white',
					fontSize: '10pt',
					fontFamily: 'Arial',
					fontWeight: 'bold', 
					position: 'absolute', 
					top: y + 'px', 
					left: x + 'px', 
					opacity: '0.0'
				})
				.animate({
					top: '-=10px', 
					opacity: '1.0'
				}, function() {
					setTimeout(function() {
						$(this).remove()
					}.bind(this), 500)
				})
			)
		}

		var pacman2 = function(x, y, d) {

			var w = h = 30
			var shape = null
			
			x = (x|0) + (w / 3)|0
			
			var save_x = x,
				save_y = y,
				save_d = d

			this.getState = function() {
				return {
					x: x,
					y: y,
					lives: lives,
					points: points,
					_points: _points,
					eaten: eaten
				}
			}

			this.setState = function(a) {
				x       = a.x
				y       = a.y
				lives   = a.lives
				points  = a.points
				_points = a._points
				eaten   = a.eaten
				shape.setPosition(x - w / 2, y - h / 2)
				$("#info-lives").html(lives)
				$("#info-points").html(points)
			}

			this.respawn = function(redraw) {
				x = save_x
				y = save_y
				d = next_d = levels[0].pacman.d
				if(redraw) initShape()
				shape.setPosition(x - w / 2, y - h / 2)
				shape.setImage( assets.getResult('pacman_full') )
				_points = 0
			}

			var lives = default_lives = 3

			this.getLives = function() {
				return lives
			}
			
			this.resetLives = function() {
				lives = default_lives
			}

			this.kill = function() {
				// if(document.location.hash == "#godmode") return;
				USE_KEYS = false
				lives -= 1
				var s = 0
				var a = function(f) {
					s++;
					shape.setImage( assets.getResult('die_' + s) )
					if(s == 8) {
						pause = false
						USE_KEYS = true
						f()
					} else {
						setTimeout(function() {a(f)}, 200)
					}
				}
				pause = true
				if(lives >= 0) {
					$("#info-lives").html(lives)
					s = 0
					a(function() {
						respawn_all()
					})
				} else {
					s = 0
					window.send_save()
					a(function() {
						message('Игра закончена', '<div>Вы набрали ' + points + ' очков.</div>' + 
							'<center><div class="constantWidthBtnParams" onclick="$(\'#message-window .gpCloseIcon\').click()">Oк</div></center>')
						_new_game()
						window.toggle_pause_f()
					})
					level = 0;
					// TODO send results
				}
			}

			var next_d = d
			this.d = d

			var p_repeater = null
			
			//x -= w / 2
			//y -= h / 2
			var speed = global_speed / 100 * 80
			
			var frame = 0

			this.getX = function() {
				return x
			}
			this.getY = function() {
				return y
			}
			this.getDirection = function() {
				return d
			}

			this.getPoints = function(screen){
				return screen ? points : _points
			}
			this.getEaten = function() {
				return eaten
			}

			var initShape = function() {
				var image = assets.getResult( 'pacman_full' )
				shape = new _image({//Kinetic.Image({
					x: x - w / 2,
					y: y - h / 2,
					width: w,
					height: h,
					image: image
				})
				layer.add(shape)
			}
			initShape()
			var debug_break = false
			var move2middle = function() {
				var __middle = p_block(x, y),
					_middle = block_center(__middle.x, __middle.y)
				x = _middle.x
				y = _middle.y
				shape.setPosition(x - w / 2, y - h / 2)
				debug_break = true
			}

			var last_turn = {X: -1, Y: -1}

			var _points = 0

			var move = function() {
				
				
				var __p = p_block(x, y)

				if( is_turn(__p.x, __p.y, d)
				 && d != next_d
				 && next_d != d_180(d)
				 && p_next(__p.x, __p.y, next_d)
				 && p_in_middle(x, y, d)
				) {
					var __p_next = p_next(__p.x, __p.y, next_d)
					var __p_next_current = p_next(__p.x, __p.y, d)

					if( p2go(_map[__p_next.y][__p_next.x].type) ) {

						d = next_d
					} else {
						if( !p2go(_map[__p_next_current.y][__p_next_current.x].type) ) {
							move2middle()
						}

					}
				} else {

					var _p_next = p_next(__p.x, __p.y, d)
					
					try {

					if(_p_next
					 && !p2go(_map[_p_next.y][_p_next.x].type)
					 && p_in_middle(x, y, d)
					) {
						var __p_next = p_next(__p.x, __p.y, next_d)
						move2middle()
						if( p2go(_map[__p_next.y][__p_next.x].type) ) {
							d = next_d
						}
					}

					} catch(e) {
					}

					if(p_in_middle(x, y, d)
					 && !p_next(__p.x, __p.y, d)
					) {

					 	if(d == next_d) {
							move2middle()
						} else {
							if(d != d_180(next_d)) {
								if(p_in_middle(x, y, d)) {
									var __p_next = p_next(__p.x, __p.y, next_d)
									move2middle()
									if( p2go(_map[__p_next.y][__p_next.x].type) ) {
										d = next_d
									}
								}
							}
						}

					}

				}
				
				if(!debug_break) {
					x += _d[d].x * speed
					y += _d[d].y * speed
					
					
					if(_d[d].x == 0) x = block_center(__p.x, __p.y).x
					if(_d[d].y == 0) y = block_center(__p.x, __p.y).y
					
					shape.setPosition(x - w / 2, y - h / 2)
				} else {
					debug_break = false
				}
				var _dir = dir[d]
				var _name = 'pacman_' + ( frame == 0 ? 'full' : dir[d] + '_' + frame )
				var image = assets.getResult( _name )
				
				shape.setImage( image )
				frame = frame >= 2 ? 0 : frame + 1
				
				var _p = p_block(x, y)

				if(_p.x < 0) {
					_p.x = map_width - 1
					x = block_center(_p.x, _p.y).x
					//y = block_center(_p.x, _p.y).y
					//shape.setPosition(x, y)
				}
				if(_p.x >= map_width) {
					_p.x = 0
					x = block_center(_p.x, _p.y).x
					//y = block_center(_p.x, _p.y).y
					//shape.setPosition(x, y)
				}

				var _type = _map[_p.y][_p.x].type
				//_map[_p.y][_p.x].shape.setImage(assets.getResult('pinky'))
				
				if(_type == p || _type == P) {
					if(_type == P) {
						window.ghost_num_reset()
						panic_mode()
					}
					_map[_p.y][_p.x].type = s
					_map[_p.y][_p.x].shape.setImage(assets.getResult(s))
					points += _type == p ? 10 : 50;
					//splashText('+' + (_type == p ? 10 : 50), x, y)
					_points += 1;
					eaten += 1;
					//$("#eaten_log").html(eaten + ' / ' + _need_points)
					if(eaten >= _need_points) {
						pause = true
						message('Уровень пройден', '<div>Вы набрали ' + points + ' очков.</div>' + 
							'<center><div class="constantWidthBtnParams" onclick="$(\'#message-window .gpCloseIcon\').click()">Oк</div></center>')
						console.log('level++', level);
						level += 1
						//new_game()
						window.toggle_pause_f()
						respawn_all()
						_new_game()
					}
					$('#info-points').html(points)
				}
				

			}.bind(this)

			this.move_up    = function() {
				if(d == DOWN) d = UP
				next_d = UP
			}
			this.move_down  = function() {
				if(d == UP) d = DOWN
				next_d = DOWN
			}
			this.move_left  = function() {
				if(d == RIGHT) d = LEFT
				next_d = LEFT
			}
			this.move_right = function() {
				if(d == LEFT) d = RIGHT
				next_d = RIGHT
			}
			
			var repeater = function() {
				p_repeater = setTimeout(repeater, 50)
				if(!pause) move()
			}
			repeater()

			this.destroy = function() {
				clearTimeout(p_repeater)
			}.bind(this)
		}

		// ---------------------------------------

		//var _pacman = null
		var _save = null
		var init = function() {

			if(!localStorage.hasOwnProperty('pacman_game_user_id') || localStorage.pacman_game_user_id != _userId) {
				localStorage.removeItem('pacman_save');
				localStorage.removeItem('pacman_theme');
				localStorage.removeItem('pacman_state');
				// localStorage.pacman_game_user_id = _userId;
			}

			pause_timer = true
			document.onkeyup = function(e) {if(e.keyCode == 13){$("center>span:visible").click()}}

			// var _l = document.location.hash.split('#')[1]
			// if(_l) level = _l|0
			//if(level >= levels.length) level = 0
			$("#info-level").html(level)
			$("#new_game").html(lives)

			this.toggle_pause()

			var random_seed = 1 + parseInt(Math.random() * 10000)
			RNG.setSeed(random_seed)
			
			current_time = 0
			$("#info-time").html("0:0")
			last_time = start_time = new Date().getTime()
			last_action_time = last_time - 15e3			
			pause_timer = false
			
			// if(typeof $.timer == "undefined" || typeof KOSYNKA_GAME_VARIATION_ID == "undefined") {document.location.reload()}

			/*stage = new Kinetic.Stage({
				container: canvas_area,
				width: canvas_width,
				height: canvas_height
			})*/

			layer = new _layer({
				container: canvas_area,
				width: canvas_width,
				height: canvas_height
			})//Kinetic.Layer()
			
			//stage.add(layer);
			layer.draw()

			var _theme = "theme1"

			//if(localStorage.pacman_theme != null) _theme = localStorage.pacman_theme
			assets = new createjs.LoadQueue(true, "img/" + _theme + "/");
			assets.on("complete", function() {
				_assets_loaded = true
			});
			assets.loadManifest(manifest);
			
			var __left = __right = true
			document.addEventListener('keydown', function(e) {
				if(USE_KEYS == false) return;
				if( ['enter', 'space'].indexOf(codes[e.keyCode]) >= 0 ) $('#message-window:visible .gpCloseIcon').click()
				last_action_time = new Date().getTime()
				debug_stop = false
				if( $("#prompt-done:visible").length && (codes[e.keyCode] == 'space' || codes[e.keyCode] == 'enter')) {
					$("#prompt-done:visible").click()
				}
				if( $("#message-window:visible").length ) return

				if( $(".bubblePanel:visible").length ) return;
				if( $("#prompt-window:visible").length ) return;
				if( $("#guestBookPanel:visible").length ) return;
				if( $("#profilePanel:visible").length ) return;
				$("#splash-message:visible").slideUp()


				switch(codes[e.keyCode]) {
					case 'left':
						if(pause) this.toggle_pause_f()
						this._play_f()
						//_pacman.move_left()
						_pacman2.move_left()
						e.preventDefault()
						//return false
						break;
					case 'right':
						if(pause) this.toggle_pause_f()
						this._play_f()
						//_pacman.move_right()
						_pacman2.move_right()
						e.preventDefault()
						//return false
						break;
					case 'up':
						if(pause) this.toggle_pause_f()
						this._play_f()
						//_pacman.move_up()
						_pacman2.move_up()
						e.preventDefault()
						//return false
						break;
					case 'down':
						if(pause) this.toggle_pause_f()
						this._play_f()
						//_pacman.move_down()
						_pacman2.move_down()
						e.preventDefault()
						//return false
						break;
					case 'space':
						this.toggle_pause_f()
						//$("#prompt-done:visible").click()
						e.preventDefault()
						//return false
						break;
					case 'enter':
						e.preventDefault()
						//return false
						break;
				}
				//e.preventDefault()
				//return false

			}.bind(this))

			$("#map div").addClass('in-center')
			$("#preload-image").remove()

			var f1 = null
			if(AUTOSAVE) {
				f1 = function() {
					window.setStateAll()
				}
			}
			_new_game(f1)

			$("#splash-message").slideDown()
			setTimeout(function() {
				$("#splash-message").slideUp()
			}, 5e3)
			move_map_to_center();
			window.onresize = move_map_to_center;
			
			timer()
			$("#info-level").html( ((level|0) + 1) )

			draw_repeater();		
		}.bind(this)

		var load_rating = function() {}
		
		init();

		function dhm(ms){
	      days = Math.floor(ms / (24*60*60*1000));
	      if(days < 10) days = "0" + days
	      daysms=ms % (24*60*60*1000);
	      hours = Math.floor((daysms)/(60*60*1000));
	      if(hours < 10) hours = "0" + hours
	      hoursms=ms % (60*60*1000);
	      minutes = Math.floor((hoursms)/(60*1000));
	      if(minutes < 10) minutes = "0" + minutes
	      minutesms=ms % (60*1000);
	      sec = Math.floor((minutesms)/(1000));
	      if(sec < 10) sec = "0" + sec
	      var r = days == 0
	      	? hours == 0
	      		? minutes == 0
	      			? [minutes, sec]
	      			: [minutes, sec]
	      		: [hours, minutes, sec]
	      	: [days, hours, minutes, sec]
	      return r.join(':')
    }
    window.debug_get_game_id = function() {
    	return game_id
    }
    	window.get_game_id = function() {
    		return game_id
    	}

		window.send_save = function(end_of_level) {//window.onbeforeunload
			
			if(game_id != null) _data.game_id = game_id
			if(end_of_level != null) _data.end_of_level = true
		}

		this.new_game = new_game
		this.move_map_to_center = move_map_to_center

		this.log = function(_x, _y) {
			
			for (y in _map) {
				var _s = ""
				for (x in _map[y]) {
					_s += map[y][x].shape ? 1 : 0;
					map[y][x].shape.show()
				}
			}

			return {
				shape:          map[_y][_x],
				layer:          layer,
				stage:          stage,
				assets:         assets,
				selected_image: selected_image,
				store:          store,
				next_step:      next_step,
				test: function() {
					roll_back()
				},
				steps: steps,
				points: points
			}

		}
		
		this.test = function() {
			animation_stack.push({
				next: function(data, step) {
				},
				done: function(data) {
				},
				data: {},
				step: 10
			})
		}

		this.redraw_all = redraw_all
		var backsteps = 0;
		this.backstep = function() {
				backsteps += 1;
		}
		this.set_configuration = function(a) {
			for(i in a) {
				configuration[i] = a[i]
			}
		}
}

var log, test, redraw_all;
var set_configuration;
$(document).ready(function() {
		var G = new Game();
		set_configuration = G.set_configuration
		log = G.log
		redraw_all = G.redraw_all
		var get_rating = G.get_rating
		move_map_to_center = G.move_map_to_center;
})
//a.shape.shape.setImage(a.assets.getResult('#0000ff'));a.layer.draw()
