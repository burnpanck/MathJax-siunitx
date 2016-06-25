/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/siunitx-commands.js
 *
 * This is essentially a namespace for the various functions needed,
 * such that TEX.Parse's namespace is not cluttered too much.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2016 Yves Delley, https://github.com/burnpanck
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

define(
  ['./siunitx-options-definition','./unit-definitions','./unit-parser','./number-parser-regex'],
  function(SIunitxOptions, UNITDEFS, SIUnitParser, NUMBERPARSER)
{
  var TEX = MathJax.InputJax.TeX;
  var MML = MathJax.ElementJax.mml;

  var UNITSMACROS = UNITDEFS.UNITSMACROS;
  var SINumberParser = NUMBERPARSER.SINumberParser;
  var SINumberListParser = NUMBERPARSER.SINumberListParser;

  var SIunitxCommands = MathJax.Extension["TeX/siunitx"].SIunitxCommands = {
    sisetup: function (name) {
      var options = this.GetArgument(name);
    },
    si: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var units = this.GetArgument(name);
//      console.log('>> si(',name,'){',units,'}');
      this.Push(SIUnitParser(units, options, this.stack.env).mml());
    },

    SI: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      var preunits = this.GetBrackets(name, '');
      var units = this.GetArgument(name);
//     console.log('>> SI(',name,'){',num,'}{',units,'}');
      if (preunits) {
        this.Push(SIUnitParser(preunits, options, this.stack.env).mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
      }
      this.Push(SINumberParser(num, options, this.stack.env).mml());
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel: 0
      }));
      this.Push(SIUnitParser(units, options, this.stack.env).mml());
    },

    SIlist: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      var preunits = this.GetBrackets(name, '');
      var units = this.GetArgument(name);
      if (preunits) {
        preunits = SIUnitParser(preunits, options, this.stack.env);
      }
      num = SINumberListParser(num, options, this.stack.env).parsed;
      units = SIUnitParser(units, options, this.stack.env);
      function medspace() {
        return MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        });
      };
      for (var idx = 0; idx < num.length; ++idx) {
        var n = num[idx];
        if (idx & 1) {
          // this is a separator
          this.Push(TEX.Parse(n).mml());
        } else {
          // this is a number
          if (preunits) {
            this.Push(preunits.mml());
            this.Push(medspace());
          }
          this.Push(TEX.Parse(n).mml());
          this.Push(medspace());
          this.Push(units.mml());
        }
      }
    },

    SIrange: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num1 = this.GetArgument(name);
      var num2 = this.GetArgument(name);
      var preunits = this.GetBrackets(name, '');
      var units = this.GetArgument(name);

      units = SIUnitParser(units, options, this.stack.env);
      if (preunits)
        preunits = SIUnitParser(preunits, options, this.stack.env)

      if (preunits) {
        this.Push(preunits.mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
      }
      this.Push(SINumberParser(num1, options, this.stack.env).mml());
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel: 0
      }));
      this.Push(units.mml());
      this.Push(options['range-phrase']);
      if (preunits) {
        this.Push(preunits.mml());
        this.Push(MML.mspace().With({
          width: MML.LENGTH.MEDIUMMATHSPACE,
          mathsize: MML.SIZE.NORMAL,
          scriptlevel: 0
        }));
      }
      this.Push(SINumberParser(num2, options, this.stack.env).mml());
      this.Push(MML.mspace().With({
        width: MML.LENGTH.MEDIUMMATHSPACE,
        mathsize: MML.SIZE.NORMAL,
        scriptlevel: 0
      }));
      this.Push(units.mml());
    },

    num: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      this.Push(SINumberParser(num, options, this.stack.env).mml());
    },

    ang: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      num = SINumberListParser(num, options, this.stack.env).parsed;
      if (num.length > 5)
        TEX.Error("More than three elements in angle specification");
      var units = [
        'degree',
        undefined,
        'arcminute',
        undefined,
        'arcsecond'
      ];
      var def = {mathvariant: MML.VARIANT.NORMAL};
      for (var idx = 0; idx < num.length; ++idx) {
        var n = num[idx];
        if (idx & 1) {
          // this is a separator
          // ignore here
          // TODO: factor out list separators from SINumberListParser
        } else {
          if (!n) continue;
          this.Push(TEX.Parse(n).mml());
          var u = UNITSMACROS[units[idx]][1];
          // assumes that all symbol's we encounter are MML.entity
          var mml = MML.mi.apply(MML.mi, [u.symbol]).With(def);
          this.Push(this.mmlToken(mml));
        }
      }
    },

    numlist: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num = this.GetArgument(name);
      this.Push(SINumberListParser(num, options, this.stack.env).mml());
    },

    numrange: function (name) {
      var options = SIunitxOptions.ParseOptions(this.GetBrackets(name, ''));
      var num1 = this.GetArgument(name);
      var num2 = this.GetArgument(name);
      this.Push(SINumberParser(num1, options, this.stack.env).mml());
      this.Push(options['range-phrase']);
      this.Push(SINumberParser(num2, options, this.stack.env).mml());
    }

  };

  return SIunitxCommands;
});
