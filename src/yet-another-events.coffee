yae = {}

if module?.exports?
	module.exports = yae
else
	oldYae = @yae
	@yae = yae
	yae.noConflict = =>
		@yae = oldYae
		yae



yae.Event = class Event
	constructor: (data = null) ->
		@_data = data
		@_emitter = null

	data: (data) ->
		if data != undefined
			@_data = data
			@
		else
			@_data

	emitter: (emitter) ->
		if emitter != undefined
			@_emitter = emitter
			@
		else
			@_emitter

	clone: ->
		new Event(@data())

	sub: (data = null) ->
		class Subevent extends @constructor
			constructor: (data = null) ->
				super data
			clone: ->
				new Subevent(@data())
		new Subevent(data)



yae.event = (data = null) ->
	new Event(data)



yae.Emitter = class Emitter
	constructor: ->
		@_items = []

	on: (e, f, c = undefined) ->
		if !(e instanceof Event) and !(e instanceof Function)
			throw new Error 'e must be Event or Function'

		if !(f instanceof Function)
			throw new Error 'f must be Function'

		E = if e instanceof Event then e.constructor else e
		c = if c then c else undefined

		has = false

		for item in @_items
			if item[0] == E and item[1] == f and item[2] == c
				has = true
				break

		if !has
			@_items.push [E, f, c]

		@

	off: (e = undefined, f = undefined, c = undefined) ->
		E = if e instanceof Event then e.constructor else e

		indices = []

		for i in [0...@_items.length]
			[Ev, fn, ct] = @_items[i]
			if (!E or E == Ev) and (!f or f == fn) and (!c or c == ct)
				indices.push i

		while indices.length
			@_items.splice indices.pop(), 1

		@

	emit: (e) ->
		e = if e instanceof Function then new e() else e
		e = e.clone().emitter @

		targets = (item for item in @_items when e instanceof item[0])

		for target in targets
			has = false

			for item in @_items
				if item[0] == target[0] and item[1] == target[1] and item[2] == target[2]
					has = true
					break

			if has
				[fn, ct] = target[1..]
				fn.call ct, e

		@

	triggers: (e) ->
		e = if e instanceof Function then new e() else e
		for item in @_items
			if e instanceof item[0]
				return true
		false

	matches: (e) ->
		E = if e instanceof Event then e.constructor else e
		for item in @_items
			if item[0] == E
				return true
		false