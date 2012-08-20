# yet-another-events.js

## How to Use

Emitting an event triggers not only functions binded to the event, but also ones binded to its superevents.

```javascript
var Event = yae.event().constructor
var Subevent = new Event().sub().constructor
var Subsubevent = new Subevent().sub().constructor

var emitter = new yae.Emitter();
	.on(Event, function(e) {
		console.log('Event', e.data());
	})
	.on(Subevent, function(e) {
		console.log('Subevent', e.data());
	})
	.on(Subsubevent, function(e) {
		console.log('Subsubevent', e.data());
	});

emitter.emit(new Event('one'));
// -> 'Event', 'one'

emitter.emit(new Subevent('two'));
// -> 'Event', 'two'
//    'Subevent', 'two'

emitter.emit(new Subsubevent('three'));
// -> 'Event', 'three'
//    'Subevent', 'three'
//    'Subsubevent', 'three'
```

## APIs

**yae.event** `yae.event(data = null)`

Returns `yae.Event` object. Same as `new yae.Event(data)`.

### yae.Event

**constructor** `new yae.Event(data = null)`

Returns `yae.Event` object. You can pass a custom data.

**data** `event.data()`

Gets data from the event.

**data** `event.data(data)`

Sets data to the event and returns the event itself.

**emitter** `event.emitter()`

Gets emitter from the event.

**emitter** `event.emitter(emitter)`

Sets emitter to the evnet and returns the event itself.

**clone** `event.clone()`

Clones the event. Basically, the method is used internally. But when you manually extend `yae.Event`, you have to override this method to return your own event object.

**sub** `event.sub(data = null)`

Creates a subevent object.

### yae.Emitter

**constructor** `new yae.Emitter()`

Returns `yae.Emitter` object.

**on** `emitter.on(event, callback, [context])`

Binds `callback` to passed `event`. An event constructor and an event object are both accepted.

**off** `emitter.off([event], [callback], [context])`

Removes binded items matching specified arguments. An event constructor and an event object are both accepted.

**emit** `emitter.emit(event)`

Emits event. An event constructor and an event object are both accepted.

**triggers** `emitter.emit(event)`

Returns `true` if any functions will be triggered by `event`. Functions binded to superevents are also counted.

**matches** `emitter.emit(event)`

Returns `true` if any functions are binded to `event`. Only functions binded to the very event are targets.