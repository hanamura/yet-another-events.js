(function() {
  var Emitter, Event, oldYae, yae,
    _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  yae = {};

  if ((typeof module !== "undefined" && module !== null ? module.exports : void 0) != null) {
    module.exports = yae;
  } else {
    oldYae = this.yae;
    this.yae = yae;
    yae.noConflict = function() {
      _this.yae = oldYae;
      return yae;
    };
  }

  yae.Event = Event = (function() {

    function Event(data) {
      if (data == null) {
        data = null;
      }
      this._data = data;
      this._emitter = null;
    }

    Event.prototype.data = function(data) {
      if (data !== void 0) {
        this._data = data;
        return this;
      } else {
        return this._data;
      }
    };

    Event.prototype.emitter = function(emitter) {
      if (emitter !== void 0) {
        this._emitter = emitter;
        return this;
      } else {
        return this._emitter;
      }
    };

    Event.prototype.clone = function() {
      return new Event(this.data());
    };

    Event.prototype.sub = function(data) {
      var Subevent;
      if (data == null) {
        data = null;
      }
      Subevent = (function(_super) {

        __extends(Subevent, _super);

        function Subevent(data) {
          if (data == null) {
            data = null;
          }
          Subevent.__super__.constructor.call(this, data);
        }

        Subevent.prototype.clone = function() {
          return new Subevent(this.data());
        };

        return Subevent;

      })(this.constructor);
      return new Subevent(data);
    };

    return Event;

  })();

  yae.event = function(data) {
    if (data == null) {
      data = null;
    }
    return new Event(data);
  };

  yae.Emitter = Emitter = (function() {

    function Emitter() {
      this._items = [];
    }

    Emitter.prototype.on = function(e, f, c) {
      var E, has, item, _i, _len, _ref;
      if (c == null) {
        c = void 0;
      }
      if (!(e instanceof Event) && !(e instanceof Function)) {
        throw new Error('e must be Event or Function');
      }
      if (!(f instanceof Function)) {
        throw new Error('f must be Function');
      }
      E = e instanceof Event ? e.constructor : e;
      c = c ? c : void 0;
      has = false;
      _ref = this._items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item[0] === E && item[1] === f && item[2] === c) {
          has = true;
          break;
        }
      }
      if (!has) {
        this._items.push([E, f, c]);
      }
      return this;
    };

    Emitter.prototype.off = function(e, f, c) {
      var E, Ev, ct, fn, i, indices, _i, _ref, _ref1;
      if (e == null) {
        e = void 0;
      }
      if (f == null) {
        f = void 0;
      }
      if (c == null) {
        c = void 0;
      }
      E = e instanceof Event ? e.constructor : e;
      indices = [];
      for (i = _i = 0, _ref = this._items.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        _ref1 = this._items[i], Ev = _ref1[0], fn = _ref1[1], ct = _ref1[2];
        if ((!E || E === Ev) && (!f || f === fn) && (!c || c === ct)) {
          indices.push(i);
        }
      }
      while (indices.length) {
        this._items.splice(indices.pop(), 1);
      }
      return this;
    };

    Emitter.prototype.emit = function(e) {
      var ct, fn, has, item, target, targets, _i, _j, _len, _len1, _ref, _ref1;
      e = e instanceof Function ? new e() : e;
      e = e.clone().emitter(this);
      targets = (function() {
        var _i, _len, _ref, _results;
        _ref = this._items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (e instanceof item[0]) {
            _results.push(item);
          }
        }
        return _results;
      }).call(this);
      for (_i = 0, _len = targets.length; _i < _len; _i++) {
        target = targets[_i];
        has = false;
        _ref = this._items;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          item = _ref[_j];
          if (item[0] === target[0] && item[1] === target[1] && item[2] === target[2]) {
            has = true;
            break;
          }
        }
        if (has) {
          _ref1 = target.slice(1), fn = _ref1[0], ct = _ref1[1];
          fn.call(ct, e);
        }
      }
      return this;
    };

    Emitter.prototype.triggers = function(e) {
      var item, _i, _len, _ref;
      e = e instanceof Function ? new e() : e;
      _ref = this._items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (e instanceof item[0]) {
          return true;
        }
      }
      return false;
    };

    Emitter.prototype.matches = function(e) {
      var E, item, _i, _len, _ref;
      E = e instanceof Event ? e.constructor : e;
      _ref = this._items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item[0] === E) {
          return true;
        }
      }
      return false;
    };

    return Emitter;

  })();

}).call(this);
