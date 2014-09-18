/* -*- Mode: Javascript; indent-tabs-mode:nil; js-indent-level: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */

/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx.js
 *  
 *  Implements some of the features provided by the siunitx LaTeX package.
 *  
 *  ---------------------------------------------------------------------
 *  
 *  Copyright (c) 2011-2014 The MathJax Consortium
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

MathJax.Extension["TeX/siunitx"] = {
  version: "0.1.0"
};

MathJax.Hub.Register.StartupHook("TeX Jax Ready", function () {
  
  var TEX = MathJax.InputJax.TeX;
  var TEXDEF = TEX.Definitions;
  var STACK = TEX.Stack;
  var STACKITEM = STACK.Item;
  var MML = MathJax.ElementJax.mml;

  var ValidationError = MathJax.Object.Subclass({
    Init: function(obj,name,validator,val){
      this._errormsg = 'ValidationError: Error validating '+name+' of '+obj+' (a '+validator+') to '+val+': '
      for(var idx=4;idx<arguments.length;++idx)
        this._errormsg += arguments[idx].toString();
      console.log(this._errormsg);
    },
    toString: function(){
      return this._errormsg;
    }
  });

  var ValidationBase = MathJax.Object.Subclass({
    PropertyDescriptor: function(cls,propname){
      var descriptor = this;
      console.log('create property ',propname,' of ',cls,' (type ',descriptor,')');
      return {
        get: function(){
          var ret = this._values[propname];
          console.log('get property ',propname,' of ',this,cls,' (type ',descriptor,'): ',ret,descriptor._default);
          if(ret !== undefined)
            return ret;
          return descriptor._default;
        },
        set: function(val){
          console.log('set property ',propname,' of ',this,cls,' (type ',descriptor,') to ',val);
          this._values[propname] = descriptor.Validate(val,propname,this);
        }
      };
    }
  });
  
  var Choice = ValidationBase.Subclass({
    Init: function(){
      this._default = arguments[0];
      var choices = {};
      for(var idx=0;idx<arguments.length;idx++)
        choices[arguments[idx]] = true;
      this._choices = choices;
    },
    Validate: function(val,name,obj){
      if(!this._choices.hasOwnProperty(val))
        throw ValidationError(
          obj,name,this,val,
          'must be one of ["'
          +Object.getOwnPropertyNames(this._choices).join('", "')
          +'"]'
        );
      return val;
    }
  });
  var Integer = ValidationBase.Subclass({
    Init: function(def){this._default = def;},
    Validate: function(val,name,obj){
      if(!Number.isInteger(val))
        throw ValidationError(obj,name,this,val,"must be an integer");
      return +val;
    }
  });
  var Literal = ValidationBase.Subclass({
    Init: function(def){this._default = def;},
    Validate: function(val,name,obj){
      return val;
    }
  });
  var Switch = ValidationBase.Subclass({
    Init: function(def){
      if(def === undefined)
        def = false;
      this._default = def;
    },
    Validate: function(val,name,obj){
      if(val === undefined) val=true;
      if(val !== true && val !== false)
        throw ValidationError(obj,name,this,val,"must be a boolean");
      return val;
    }
  });
  
  var ConfigData = MathJax.Object.Subclass({
    Init: function(values){
      this._values = {}
      if(values != undefined)
        SetMany(values);
    },
    Set: function(prop,value){
      if(this._options[prop] === undefined)
        throw ValidationError(this,name,undefined,values[prop],"does not exist");
      this[prop] = value;
    }
    SetMany: function(values){
      for(var prop in values)
        this.Set(prop,values[prop]);
    },
    Derived: function(values){
      var ret = this.constructor();
      ret._values.__proto__ = this._values.__proto__;
      if(values != undefined){
        ret.SetMany(values);
      }
      return ret;
    },
    toString: function(){
      var ret = []
      for(var prop in this._options)
        ret.push(prop + ' = ' + this[prop]);
      return ret.join(',\n');
    }
  },{
    Define: function(definition){
      var ret = this.Subclass({_options:definition});
      for(var prop in definition){
        Object.defineProperty(ret.prototype,prop,definition[prop].PropertyDescriptor(ret,prop));
      }
      return ret;
    }
  });
  
  var SIunitxOptions = ConfigData.Define({
    'detect-family': Switch(),
    'detect-inline-family': Choice('text','math'),
    'detect-inline-weight': Choice('text','math'),
  });
      
  var UNITSMACROS = {
    // special units
    percent: {name:'percent',symbol:'%',category:'non-unit'},
      
    // powers
    per: ['Per',-1],
    square: ['PowerPfx',2],
    cubic: ['PowerPfx',3],
    raiseto: ['PowerPfx',undefined],
    squared: ['PowerSfx',2],
    cubed: ['PowerSfx',3],
    tothe: ['PowerSfx',undefined],
      
    // aliases
    meter: ['Macro','\\metre'],
    deka: ['Macro','\\deca'],
    
    // abbreviations
    celsius: ['Macro','\\degreeCelsius'],
    kg: ['Macro','\\kilogram'],
    amu: ['Macro','\\atomicmassunit'],
    kWh: ['Macro','\\kilo\\watt\\hour'],
      
    // not yet supported:
    of: 'Unsupported',
    cancel: 'Unsupported',
    highlight: 'Unsupported'
  };

  // ******* SI prefixes *******************
    
  var SIPrefixes = (function (def){
    var ret = {};
    for(var pfx in def){
      var data = def[pfx];
      ret[pfx] = {
		name: pfx,
		power: data[0],
		abbrev: data[1],
        pfx: data.length>=3 ? data[2] : data[1]
	  };
    };
    return ret;
  })({
    yocto: [-24,'y'],
	zepto: [-21,'z'],
    atto:  [-18,'a'],
    femto: [-15,'f'],
    pico:  [-12,'p'],
    nano:  [ -9,'n'],
    micro: [ -6,'u', MML.entity("#x03bc")],
    milli: [ -3,'m'],
    centi: [ -2,'c'],
    deci:  [ -1,'d'],

    deca:  [  1,'da'],
    hecto: [  2,'h'],
    kilo:  [  3,'k'],
    mega:  [  6,'M'],
    giga:  [  9,'G'],
    tera:  [ 12,'T'],
    peta:  [ 15,'P'],
    exa:   [ 18,'E'],
    zetta: [ 21,'Z'],
    yotta: [ 24,'Y']
  });
  MathJax.Extension["TeX/siunitx"].SIPrefixes = SIPrefixes;

  for(var pfx in SIPrefixes){
    pfx = SIPrefixes[pfx];
    UNITSMACROS[pfx.name] = ['SIPrefix',pfx];
  }

  // ******* SI units *******************
    
  function _BuildUnits(category,defs){
    var units = [];
    for(var unit in defs){
      var def = defs[unit];
      units.push({
          name: unit,
          category: category,
          symbol: def[0],
          abbrev: def[1]
      });
    }
    return units;
  }
    
  var SIUnits = (function (arr){
    ret = {};
    arr.forEach(function (unit){
      ret[unit.name] = unit;
    });
    return ret;
  })([].concat(_BuildUnits('SI base',{
    ampere:   ['A','A'],
    candela:  ['cd'],
    kelvin:   ['K','K'],
    kilogram: ['kg'],
    gram:     ['g','g'],
    metre:    ['m','m'],
    mole:     ['mol','mol'],
    second:   ['s','s']
  }),_BuildUnits('coherent derived',{
    becquerel: ['Bq'],
    degreeCelsius: [MML.entity("#x2103")],
    coulomb: ['C'],
    farad: ['F','F'],
    gray: ['Gy'],
    hertz: ['Hz','Hz'],
    henry: ['H'],
    joule: ['J','J'],
    katal: ['kat'],
    lumen: ['lm'],
    lux: ['lx'],
    newton: ['N','N'],
    ohm: [MML.entity("#x03a9"),'ohm'],
    pascal: ['pa','Pa'],
    radian: ['rad'],
    siemens: ['S'],
    sievert: ['Sv'],
    steradian: ['sr'],
    tesla: ['T'],
    volt: ['V','V'],
    watt: ['W','W'],
    weber: ['Wb'],
  }),_BuildUnits('accepted non-SI',{
    day: ['d'],
    degree: [MML.entity("#x00b0")],
    hectare: ['ha'],
    hour: ['h'],
    litre: ['l','l'],
    liter: ['L','L'],
    arcminute: [MML.entity("#x2032")], // plane angle;
    minute: ['min'],
    arcsecond: [MML.entity("#x2033")], // plane angle;
    tonne: ['t'],
  }),_BuildUnits('experimental non-SI',{
    astronomicalunit: ['ua'],
    atomicmassunit: ['u'],
    bohr: ['a_0'],
    clight: ['c_0'],
    dalton: ['Da'],
    electronmass: ['m_e'],
    electronvolt: ['eV','eV'],
    elementarycharge: ['e'],
    hartree: ['E_h'],
    planckbar: ['\\hbar '],
  }),_BuildUnits('other non-SI',{
    angstrom: [MML.entity("#x212b")],
    bar: ['bar'],
    barn: ['b'],
    bel: ['B'],
    decibel: ['dB','dB'],
    knot: ['kn'],
    mmHg: ['mmHg'],
    nauticmile: [';'],
    neper: ['Np'],
  })));
  MathJax.Extension["TeX/siunitx"].SIUnits = SIUnits;
    
  for(var unit in SIUnits){
    unit = SIUnits[unit];
    UNITSMACROS[unit.name] = ['SIUnit',unit];
  }

  // ******* unit abbreviations *******************
      
  /*
   * I'm too lazy to write all of the abbreviations by hand now, so here it is
   * programmatically.
   */
  var AbbrevPfx = {};
  for(var pfx in SIPrefixes){
    pfx = SIPrefixes[pfx];
    if(pfx.abbrev){
      AbbrevPfx[pfx.abbrev] = pfx.name;
    }
  }
  var AbbrevUnits = {};
  for(var unit in SIUnits){
    unit = SIUnits[unit];
    if(unit.abbrev){
      AbbrevUnits[unit.abbrev] = unit.name;
    }
  }

  function _ParseAbbrev(abbrev) {
    var unit = AbbrevUnits[abbrev];
    var repl = '';
    if( unit === undefined ){
      unit = AbbrevUnits[abbrev.slice(1)];
      if( unit === undefined ){
        // should never happen!
        console.log('cannot parse abbreviation',abbrev);
        return
      }
      repl = AbbrevPfx[abbrev[0]];
      if( repl === undefined ){
        // should never happen!
        console.log('cannot parse prefix ',abbrev[0],' on unit ',unit,' (',abbrev,')');
        return
      }
      repl = '\\' + repl
    }
    repl += '\\' + unit
    return repl;
  }
   
  // install a number of abbrevs as macros, the same as siunitx does.
  [
    "fg pg ng ug mg g",
    "pm nm um mm cm dm m km",
    "as fs ps ns us ms s",
    "fmol pmol nmol umol mmol mol kmol",
    "pA nA uA mA A kA",
    "ul ml l hl uL mL L hL",
    "mHz Hz kHz MHz GHz THz",
    "mN N kN MN",
    "Pa kPa MPa GPa",
    "mohm kohm Mohm",
    "pV nV uV mV V kV",
    "uW mW W kW MW GW",
    "J kJ",
    "meV eV keV MeV GeV TeV",
    "fF pF F",
    "K",
    "dB"    
  ].forEach(function(abbrset){abbrset.split(' ').forEach(function (abbrev){
      UNITSMACROS[abbrev] = ['Macro',_ParseAbbrev(abbrev)];
  })});
  
  /*
   * This is the TeX parser for unit fields
   */
  var SIUnitParser = TEX.Parse.Subclass({
    Init: function (string,env) {
      this.cur_prefix = undefined;
      this.cur_pfxpow = undefined;
      this.per_active = false;
	  this.has_literal = false; // Set to true if non-siunitx LaTeX is encountered in input
	  this.units = [];
      arguments.callee.SUPER.Init.call(this,string,env);
/*	  if(this.has_literal){
		console.log('Unit "',string,'" was parsed literally ',this.units);
	  } else {
		console.log('Unit "',string,'" was parsed as these units: ',this.units);
	  }*/
    },

    mml: function () {
      if(!this.has_literal){
        // no literal, all information in this.units
        // => generate fresh MML here
        var stack = TEX.Stack({},true);
		var mythis = this;
        this.units.forEach(function(u){
            stack.Push(mythis.UnitMML(u));
        });          
        stack.Push(STACKITEM.stop());
        if (stack.Top().type !== "mml") {return null}
        return stack.Top().data[0];
      }
      if (this.stack.Top().type !== "mml") {return null}
      return this.stack.Top().data[0];
    },      
      
	// This is used to identify non-siunitx LaTeX in the input
    Push: function () {
        for(var idx=0;idx<arguments.length;idx++){
            var arg = arguments[idx];
            if(!(arg instanceof STACKITEM.stop)){
                console.log('litera linput ',arg);
                this.has_literal=true;
            }
            this.stack.Push.call(this.stack,arg);
        }
    },
	// While literal fall-back output from proper unit macros use this path
	PushUnitFallBack: function() {this.stack.Push.apply(this.stack,arguments);},
	
    csFindMacro: function (name) {
      var macro = UNITSMACROS[name];
      if( macro ) return macro;
      
      return arguments.callee.SUPER.csFindMacro.call(this,name);
    },
    
    Per: function(name){
      if(this.per_active){
        TEX.Error(["SIunitx","double \\per"]);
        return;
      }
      this.per_active = true;
    },
      
    PowerPfx: function(name, pow) {
      if(pow === undefined){
        pow = this.GetArgument(name);
      }
      if(this.cur_pfxpow){
        TEX.Error(["SIunitx","double power prefix",this.cur_pfxpow,pow]);
      }
      this.cur_pfxpow = pow;
    },
    
    PowerSfx: function(name, pow) {
      if(pow === undefined){
        pow = this.GetArgument(name);
      }
      if(this.has_literal){
        // unit is already gone, best we can do is add a superscript
        TEX.Error(["SIunitx","NotImplementedYet"]);
      }
      if(!this.units.length){
        TEX.Error(["SIunitx","Power suffix with no unit"]);
      }
      var unit = this.units[this.units.length-1];
      if(unit.power !== undefined){
        TEX.Error(["SIunitx","double power",unit.power,pow]);
      }
      unit.power = pow;
    },
      
    SIPrefix: function (name, pfx) {
      if(this.cur_prefix){
        TEX.Error(["SIunitx","double SI prefix",this.cur_prefix,pfx]);
      }
      this.cur_prefix = pfx;
    },
    
    UnitMML: function(unit) {
      var parts = [];
      if(unit.prefix)
        parts = parts.concat(unit.prefix.pfx);
      parts = parts.concat(unit.unit.symbol);
      var curstring = '';
      var content = [];
      parts.forEach(function (p){
        if(typeof p == 'string' || p instanceof String){
          curstring += p;
        } else {
          if(curstring){
            content.push(MML.chars(curstring));
            curstring = '';
          }
          content.push(p);
        }
      });
      if(curstring)
        content.push(MML.chars(curstring));
      var def = {mathvariant: MML.VARIANT.NORMAL};
      var mml = MML.mi.apply(MML.mi,content).With(def)
      var power = unit.power === undefined ? 1 : unit.power;
      if(unit.inverse) power = -power;
      if(power != 1)
          mml = MML.msup(mml,MML.mn(power));
      return this.mmlToken(mml);
    },
      
    SIUnit: function (name, unit) {
	  // Add to units
	  this.units.push({
		unit: unit,
		prefix: this.cur_prefix,
        power: this.cur_pfxpow,
        inverse: this.per_active
	  });
	
	  // And process fall-back
      var parts = [];
      if(this.cur_prefix)
        parts = parts.concat(this.cur_prefix.pfx);
      parts = parts.concat(unit.symbol);
      var curstring = '';
      var content = [];
      parts.forEach(function (p){
        if(typeof p == 'string' || p instanceof String){
          curstring += p;
        } else {
          if(curstring){
            content.push(MML.chars(curstring));
            curstring = '';
          }
          content.push(p);
        }
      });
      if(curstring)
        content.push(MML.chars(curstring));
      var def = {mathvariant: MML.VARIANT.NORMAL};
      this.PushUnitFallBack(this.mmlToken(MML.mi.apply(MML.mi,content).With(def)));
        
      this.cur_prefix = undefined;
      this.cur_pfxpow = undefined;
      this.per_active = false; // TODO: implement sticky per
    }
  });
  MathJax.Extension["TeX/siunitx"].SIUnitParser = SIUnitParser;
  
  /*
   * This is essentially a namespace for the various functions needed,
   * such that TEX.Parse's namespace is not cluttered too much.
   */
  var SIunitxParsers = {
    si: function (name) {
      var options = this.GetBrackets(name,'');
      var units = this.GetArgument(name);
//      console.log('>> si(',name,'){',units,'}');
      this.Push(SIUnitParser(units,this.stack.env).mml());
    },

    SI: function (name) {
      var options = this.GetBrackets(name,'');
      var num = this.GetArgument(name);
      var preunits = this.GetBrackets(name,'');
      var units = this.GetArgument(name);
 //     console.log('>> SI(',name,'){',num,'}{',units,'}');
      if(preunits){
        this.Push(SIUnitParser(preunits,this.stack.env).mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel:0
        }));
      }
      this.Push(TEX.Parse(num,this.stack.env).mml());
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel:0
      }));
      this.Push(SIUnitParser(units,this.stack.env).mml());
    }
  };
  MathJax.Extension["TeX/siunitx"].SIunitxParsers = SIunitxParsers;
  
  
  /***************************************************************************/

  TEX.Definitions.Add({
    macros: {
      //
      //  Set up the macros for SI units
      //
      SI:   'SIunitx',
      si:   'SIunitx',
    }
  },null,true);
    
  TEX.Parse.Augment({

    //
    //  Implements \SI and friends
    //
    SIunitx: function (name) {
      SIunitxParsers[name.slice(1)].call(this,name)
    }
    
  });
  
  //
  //  Indicate that the extension is ready
  //
  MathJax.Hub.Startup.signal.Post("TeX siunitx Ready");

});

MathJax.Ajax.loadComplete("[MathJax]/extensions/TeX/siunitx.js");
