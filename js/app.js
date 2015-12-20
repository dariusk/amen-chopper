var src = 'snd/amen.wav';

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
}

var thing = {
  bpm: 128,
  offset: 545,
  length: 460,
  freq: 20,
  mute: false,
  filter: 'lowshelf'
};

var settings = QuickSettings.create(100,250, 'Amen Chopper');
settings.setGlobalChangeHandler(init);
settings.bindRange("bpm", 10, 200, 128, 1, thing);
settings.bindRange("offset", 0, 850, 545, 1, thing);
settings.bindRange("length", 0, 1000, 460, 1, thing);
settings.bindRange("freq", 0, 2000, 20, 1, thing);
settings.addDropDown("filter", [
  'lowshelf',
  'highshelf',
], function(obj) {
  thing.filter = obj.value;
});
settings.addButton("mute", function() {
  thing.mute = !thing.mute;
});  


function init() {
  T.reset();
  if (!thing.mute) {
    T('audio').load(src, function() {
      function slice(that, start) {
        var length = thing.length;
        return that.slice(start, start+length).set({bang:false});
      }
      
      var P1 = [];
      
      for (var i=0; i<8; i++) P1.push(slice(this, thing.offset*i));
      
      drum = T(thing.filter, {freq: thing.freq, gain:8, mul:0.6}, ...P1).play();
      
      T('interval', {interval:'BPM' + thing.bpm + ' L32'}, function(count) {
        var i = count;
        if (i % 4 === 0) P1.pick().bang();
      }).start();
    });
  }
}

init();
