/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx/number-parser-regex.js
 *
 *  Parses numbers approximating LaTeX's siunitx number parser
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

define(['./siunitx-options-definition','./number-parser-peg','./number-formatter'],function(SIunitxOptions,PARSER,FORMATTER) {
    'use strict';

    var exports = {};

    var TEX = MathJax.InputJax.TeX;


    var SINumberParser = exports.SINumberParser = MathJax.Object.Subclass({
        Init: function (string, options) {
            this.string = string;
            this.i = 0;
            if (options === undefined)
                options = SIunitxOptions();
            else if (!(options instanceof SIunitxOptions)) {
                console.log(options,SIunitxOptions);
                throw "SINumberParser expects an options object";
            }
            this.options = options;

            this.Parse();
        },
        Parse: function () {
            var str = this.string.replace(/\s+/gi, '');
            var replacements = {
                '+-': '\\pm',
                '-+': '\\mp',
                '<=': '\\leq',
                '>=': '\\geq',
                '<<': '\\ll',
                '>>': '\\gg',
            };
            for (var key in replacements) {
                str = str.replace(key, replacements[key]);
            }
            this.parsed = PARSER.parse(str, this.options);
            this.preformatted = FORMATTER.processAll(this.options, this.parsed);
        },
        mml: function () {
            return this.preformatted.map(function(prod){
                var ret = [prod.num,prod.denom].map(function(num){
                    if(!num) return num;
                    return TEX.Parse(num).mml();
                });
                return {num:ret[0],denom:ret[1]};
            });
        }
    });

    var SINumberListParser = exports.SINumberListParser = SINumberParser.Subclass({
        Parse: function () {
            // TODO: do not process list separators via TeX parsing
            var str = this.string.replace(/\s+/gi, '');
            var numbers = str.split(';');
            var parsed = [];
            for (var idx = 0; idx < numbers.length; ++idx) {
                if (idx == numbers.length - 1) {
                    if (idx == 1) {
                        parsed.push('\\text{' + this.options['list-pair-separator'] + '}');
                    } else if (idx) {
                        parsed.push('\\text{' + this.options['list-final-separator'] + '}');
                    }
                } else if (idx) {
                    parsed.push('\\text{' + this.options['list-separator'] + '}');
                }
                parsed.push(this._parse_multi_part_number(numbers[idx]));
            }
            this.parsed = parsed;
        },
        mml: function () {
            return TEX.Parse(this.parsed.join('')).mml();
        }
    });

    return exports;
});