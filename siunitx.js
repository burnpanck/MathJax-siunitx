/*************************************************************
 *
 *  MathJax/extensions/TeX/siunitx.js
 *
 *  Implements some of the features provided by the siunitx LaTeX package.
 *
 *  ---------------------------------------------------------------------
 *
 *  Copyright (c) 2015 Yves Delley, https://github.com/burnpanck
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
MathJax.Extension["TeX/siunitx"]={version:"0.1.0"},MathJax.Hub.Register.StartupHook("TeX Jax Ready",function(){function t(t,e){var i=[]
for(var r in e){var n=e[r]
i.push({name:r,category:t,symbol:n[0],abbrev:n[1]})}return i}function e(t){var e=I[t],i=""
if(void 0===e){if(e=I[t.slice(1)],void 0===e)return void console.log("cannot parse abbreviation",t)
if(i=M[t[0]],void 0===i)return void console.log("cannot parse prefix ",t[0]," on unit ",e," (",t,")")
i="\\"+i}return i+="\\"+e}function i(t,e){var i=t.indexOf("{",e),r=t.indexOf("}",e)
return r>=0&&(i>r||-1==i)?r:i}function r(t){var e={}
if(t=t.trim(),!t)return e
for(var r=t.split(","),s=0,a=r.length;a>s;++s){var o=r[s].split("="),u=o[0].trim()
if(u||n.Error('Empty key in "'+t+'"'),o.length<2)e[u]=void 0
else{for(var h=o.slice(1).join("="),c=0,l=-1;;){for(;;){if(l=i(h,l+1),0>l)break
l>0&&"\\"==h[l-1]||("}"==h[l]?(c--,0>c&&n.Error('Too many closing braces in "'+t+'"')):c++)}if(!c)break
l=h.length,s++,s>=a&&n.Error('Not enough closing braces in "'+t+'"'),h+=","+r[s]}h=h.trim(),"{"==h[0]&&"}"==h[h.length-1]&&(h=h.slice(1,-1)),e[u]=h}}return e}var n=MathJax.InputJax.TeX,s=(n.Definitions,n.Stack),a=s.Item,o=MathJax.ElementJax.mml,u=MathJax.Object.Subclass({Init:function(t,e,i,r){this._errormsg='ValidationError: Error validating "'+e+'" of "'+t.constructor+'" (a "'+i+'") to "'+r+'": '
for(var n=4;n<arguments.length;++n)this._errormsg+=arguments[n].toString()
console.log(this._errormsg)},toString:function(){return this._errormsg}}),h=MathJax.Object.Subclass({PropertyDescriptor:function(t,e){var i=this
return{get:function(){return i.Get(this,e)},set:function(t){i.Set(this,e,t)}}},Get:function(t,e){var i=t._values[e]
return void 0!==i?i:this._default},Set:function(t,e,i){t._values[e]=this.Validate(t,e,i)},Validate:function(t,e,i){return i}}),c=h.Subclass({Init:function(){this._default=arguments[0]
for(var t={},e=0;e<arguments.length;e++)t[arguments[e]]=!0
this._choices=t},Validate:function(t,e,i){if(!this._choices.hasOwnProperty(i))throw u(t,e,this,i,'must be one of ["'+Object.getOwnPropertyNames(this._choices).join('", "')+'"]')
return i}}),l=c.Subclass({Init:function(){this._switchchoice=arguments[1],c.Init.apply(this,arguments)},Validate:function(t,e,i){return void 0===i&&(i=this._switchchoice),c.Validate.call(this,t,e,i)}}),m=h.Subclass({Init:function(t){void 0===t&&(t=0),this._default=t},Validate:function(t,e,i){if(i=parseInt(i),!Number.isInteger(i))throw u(t,e,this,i,"must be an integer")
return i}}),p=h.Subclass({Init:function(t){this._default=t},Validate:function(t,e,i){return i}}),f=p.Subclass({Init:function(t){this._default=t},Get:function(t,e){return val=arguments.callee.SUPER.Get.call(this,t,e),n.Parse("\\text{"+val+"}").mml()}}),d=p.Subclass({}),g=(h.Subclass({Init:function(t){this._default=t},Validate:function(t,e,i){return i}}),h.Subclass({Init:function(t){this._default=t},Validate:function(t,e,i){return i}})),v=h.Subclass({Init:function(t){void 0===t&&(t=!1),this._default=t},Validate:function(t,e,i){if(void 0===i&&(i=!0),("string"==typeof i||i instanceof String)&&(i=i.toLowerCase(),"true"==i?i=!0:"false"==i&&(i=!1)),i!==!0&&i!==!1)throw u(t,e,this,i,"must be a boolean")
return i}}),x=MathJax.Object.Subclass({Init:function(t){this._values={},void 0!=t&&this.SetMany(t)},Set:function(t,e){if(void 0===this._options[t])throw u(this,t,void 0,e,"does not exist")
this[t]=e},SetMany:function(t){for(var e in t)this.Set(e,t[e])},Derived:function(t){var e=this.constructor()
return e._values.__proto__=this._values.__proto__,void 0!=t&&e.SetMany(t),e},listSettings:function(t,e){void 0===e&&(e=",\n")
var i=[]
for(var r in this._options)t&&!this._values.hasOwnProperty(r)||i.push(r+" = "+this[r])
return i.join(e)}},{Define:function(t){var e=this.Subclass({_options:t})
for(var i in t)Object.defineProperty(e.prototype,i,t[i].PropertyDescriptor(e,i))
return e}}),b=x.Define({"detect-display-math":v(),"detect-family":v(),"detect-inline-family":c("text","math"),"detect-inline-weight":c("text","math"),"detect-mode":v(),"detect-shape":v(),"detect-weight":v(),color:p(""),"math-rm":g("\\mathrm"),"math-sf":g("\\mathsf"),"math-tt":g("\\mathtt"),mode:c("math","text"),"text-rm":g("\\rmfamily"),"text-sf":g("\\sffamily"),"text-tt":g("\\ttfamily"),"unit-color":p(""),"unit-math-rm":g("\\mathrm"),"unit-math-sf":g("\\mathsf"),"unit-math-tt":g("\\mathtt"),"unit-mode":c("math","text"),"unit-text-rm":g("\\rmfamily"),"unit-text-sf":g("\\sffamily"),"unit-text-tt":g("\\ttfamily"),"number-color":p(""),"number-math-rm":g("\\mathrm"),"number-math-sf":g("\\mathsf"),"number-math-tt":g("\\mathtt"),"number-mode":c("math","text"),"number-text-rm":g("\\rmfamily"),"number-text-sf":g("\\sffamily"),"number-text-tt":g("\\ttfamily"),"input-close-uncertainty":p(")"),"input-comparators":p("<=>\\approx\\ge\\geq\\gg\\le\\leq\\ll\\sim"),"input-complex-roots":p("ij"),"input-decimal-markers":p(",."),"input-digits":p("0123456789"),"input-exponent-markers":p("dDeE"),"input-ignore":p(""),"input-open-uncertainty":p("("),"input-protect-tokens":p("\\approx\\dots\\ge\\geq\\gg\\le\\leq\\ll\\mp\\pi\\pm\\sim"),"input-signs":p("+-\\pm\\mp"),"input-uncertainty-signs":p("\\pm"),"input-symbols":p("\\pi\\dots"),"parse-numbers":v(!0),"add-decimal-zero":v(!0),"add-integer-zero":v(!0),"explicit-sign":p(""),"fixed-exponent":m(),"minimum-integer-digits":m(),"omit-uncertainty":v(),"retain-explicit-plus":v(),"retain-unit-mantissa":v(!0),"retain-zero-exponent":v(),"round-half":c("up","even"),"round-integer-to-decimal":v(),"round-minimum":p("0"),"round-mode":c("off","figures","places"),"round-precision":m(2),"scientific-notation":l("false","true","fixed","engineering"),"zero-decimal-to-integer":v(),"bracket-negative-numbers":v(),"bracket-numbers":v(!0),"close-bracket":p(")"),"complex-root-position":c("after-number","before-number"),"copy-complex-root":v(!1),"copy-decimal-marker":v(!1),"exponent-base":p("10"),"exponent-product":d("\\times"),"group-digits":c("true","false","decimal","integer"),"group-minimum-digits":m(5),"group-separator":p("\\,"),"negative-color":p(""),"open-bracket":p("("),"output-close-uncertainty":p(")"),"output-complex-root":p("\\mathrm{i}"),"output-decimal-marker":p("."),"output-exponent-marker":p(""),"output-open-uncertainty":p("("),"separate-uncertainty":v(!1),"tight-spacing":v(!1),"uncertainty-separator":p(""),"fraction-function":g("\\frac"),"input-product":p("x"),"input-quotient":p("/"),"output-product":d("\\times"),"output-quotient":p("/"),"quotient-mode":c("symbol","fraction"),"list-final-separator":p(" and "),"list-pair-separator":p(" and "),"list-separator":p(", "),"range-phrase":f(" to "),"add-arc-degree-zero":v(!1),"add-arc-minute-zero":v(!1),"add-arc-second-zero":v(!1),"angle-symbol-over-decimal":v(!1),"arc-separator":p(!1),"number-angle-product":p(""),"free-standing-units":v(!1),"overwrite-functions":v(!1),"space-before-unit":v(!1),"unit-optional-argument":v(!1),"use-xspace":v(!1),abbreviations:v(!0),"binary-units":v(),"bracket-unit-denominator":v(!0),"forbid-literal-units":v(!1),"literal-superscript-as-power":v(!0),"inter-unit-product":p("\\,"),"parse-units":v(!0),"per-mode":c("reciprocal","reciprocal-positive-first","symbol","repeated-symbol","fraction","symbol-or-fraction"),"per-symbol":p("/"),"power-font":c("number","unit"),"prefixes-as-symbols":v(!0),"qualifier-mode":c("subscript","brackets","phrase","space","text"),"sticky-per":v(!1),"allow-number-unit-breaks":v(!1),"exponent-to-prefix":v(!1),"list-units":c("repeat","brackets","single"),"multi-part-units":c("brackets","repeat","single"),"number-unit-product":p("\\,"),"product-units":c("repeat","brackets","brackets-power","power","single"),"range-units":c("repeat","brackets","single")}),P={percent:{name:"percent",symbol:"%",category:"non-unit"},per:["Per",-1],square:["PowerPfx",2],cubic:["PowerPfx",3],raiseto:["PowerPfx",void 0],squared:["PowerSfx",2],cubed:["PowerSfx",3],tothe:["PowerSfx",void 0],meter:["Macro","\\metre"],deka:["Macro","\\deca"],celsius:["Macro","\\degreeCelsius"],kg:["Macro","\\kilogram"],amu:["Macro","\\atomicmassunit"],kWh:["Macro","\\kilo\\watt\\hour"],of:"Of",cancel:"Unsupported",highlight:"Highlight"},S=function(t){var e={}
for(var i in t){var r=t[i]
e[i]={name:i,power:r[0],abbrev:r[1],pfx:r.length>=3?r[2]:r[1]}}return e}({yocto:[-24,"y"],zepto:[-21,"z"],atto:[-18,"a"],femto:[-15,"f"],pico:[-12,"p"],nano:[-9,"n"],micro:[-6,"u",o.entity("#x03bc")],milli:[-3,"m"],centi:[-2,"c"],deci:[-1,"d"],deca:[1,"da"],hecto:[2,"h"],kilo:[3,"k"],mega:[6,"M"],giga:[9,"G"],tera:[12,"T"],peta:[15,"P"],exa:[18,"E"],zetta:[21,"Z"],yotta:[24,"Y"]})
MathJax.Extension["TeX/siunitx"].SIPrefixes=S
for(var k in S)k=S[k],P[k.name]=["SIPrefix",k]
var y=function(t){return ret={},t.forEach(function(t){ret[t.name]=t}),ret}([].concat(t("SI base",{ampere:["A","A"],candela:["cd"],kelvin:["K","K"],kilogram:["kg"],gram:["g","g"],metre:["m","m"],mole:["mol","mol"],second:["s","s"]}),t("coherent derived",{becquerel:["Bq"],degreeCelsius:[o.entity("#x2103")],coulomb:["C"],farad:["F","F"],gray:["Gy"],hertz:["Hz","Hz"],henry:["H"],joule:["J","J"],katal:["kat"],lumen:["lm"],lux:["lx"],newton:["N","N"],ohm:[o.entity("#x03a9"),"ohm"],pascal:["Pa","Pa"],radian:["rad"],siemens:["S"],sievert:["Sv"],steradian:["sr"],tesla:["T"],volt:["V","V"],watt:["W","W"],weber:["Wb"]}),t("accepted non-SI",{day:["d"],degree:[o.entity("#x00b0")],hectare:["ha"],hour:["h"],litre:["l","l"],liter:["L","L"],arcminute:[o.entity("#x2032")],minute:["min"],arcsecond:[o.entity("#x2033")],tonne:["t"]}),t("experimental non-SI",{astronomicalunit:["ua"],atomicmassunit:["u"],bohr:[o.msub(o.mi(o.chars("a")).With({mathvariant:o.VARIANT.NORMAL}),o.mn(0))],clight:["c0"],dalton:["Da"],electronmass:["me"],electronvolt:["eV","eV"],elementarycharge:["e"],hartree:["Eh"],planckbar:[o.entity("#x0127")]}),t("other non-SI",{angstrom:[o.entity("#x212b")],bar:["bar"],barn:["b"],bel:["B"],decibel:["dB","dB"],knot:["kn"],mmHg:["mmHg"],nauticmile:[";"],neper:["Np"]})))
MathJax.Extension["TeX/siunitx"].SIUnits=y
for(var _ in y)_=y[_],P[_.name]=["SIUnit",_]
var M={}
for(var k in S)k=S[k],k.abbrev&&(M[k.abbrev]=k.name)
var I={}
for(var _ in y)_=y[_],_.abbrev&&(I[_.abbrev]=_.name);["fg pg ng ug mg g","pm nm um mm cm dm m km","as fs ps ns us ms s","fmol pmol nmol umol mmol mol kmol","pA nA uA mA A kA","ul ml l hl uL mL L hL","mHz Hz kHz MHz GHz THz","mN N kN MN","Pa kPa MPa GPa","mohm kohm Mohm","pV nV uV mV V kV","uW mW W kW MW GW","J kJ","meV eV keV MeV GeV TeV","fF pF F","K","dB"].forEach(function(t){t.split(" ").forEach(function(t){P[t]=["Macro",e(t)]})})
var E=n.Parse.Subclass({Init:function(t,e,i){this.cur_prefix=void 0,this.cur_pfxpow=void 0,this.per_active=!1,this.has_literal=!1,this.literal_chars="",this.units=[],this.options=e,arguments.callee.SUPER.Init.call(this,t,i)},mml:function(){if(!this.has_literal){var t=n.Stack({},!0),e=this.options["per-mode"],i=this,r=[],s=[],u=[]
if(this.units.forEach(function(t){var e=void 0===t.power?1:t.power
t.inverse&&(e=-e),e>0?s.push(t):u.push(t),r.push(t)}),"reciprocal"!==e&&u.length)if("symbol"===e)if(s.forEach(function(e){t.Push(i.UnitMML(e))}),t.Push(this.mmlToken(o.mo(o.chars(this.options["per-symbol"]).With({fence:!1,stretchy:!1})))),1===u.length){var h=u[0]
h.inverse=!1,t.Push(this.UnitMML(h))}else t.Push(this.mmlToken(o.mo(o.chars("(").With({fence:!1,stretchy:!1})))),u.forEach(function(e){e.inverse=!1,t.Push(i.UnitMML(e))}),t.Push(this.mmlToken(o.mo(o.chars(")").With({fence:!1,stretchy:!1}))))
else if("fraction"===e){var c=n.Stack({},!0),l=n.Stack({},!0)
s.forEach(function(t){c.Push(i.UnitMML(t))}),u.forEach(function(t){t.inverse=!1,l.Push(i.UnitMML(t))}),c.Push(a.stop()),l.Push(a.stop()),t.Push(o.mfrac(c.Top().data[0],l.Top().data[0]))}else n.Error("Unimplemented per-mode "+e)
else r.forEach(function(e){t.Push(i.UnitMML(e))})
return t.Push(a.stop()),"mml"!==t.Top().type?null:t.Top().data[0]}return"mml"!==this.stack.Top().type?null:this.stack.Top().data[0]},Push:function(){this.finishLiteralUnit()
for(var t=0;t<arguments.length;t++){var e=arguments[t]
e instanceof a.stop||(this.has_literal=!0),this.stack.Push.call(this.stack,e)}},PushUnitFallBack:function(){this.stack.Push.apply(this.stack,arguments)},csFindMacro:function(t){this.finishLiteralUnit()
var e=P[t]
return e?e:arguments.callee.SUPER.csFindMacro.call(this,t)},Variable:function(t){this.literal_chars+=t},Number:function(t){return"."==t?this.finishLiteralUnit():void arguments.callee.SUPER.Number.call(this,t)},Tilde:function(t){this.finishLiteralUnit()},Superscript:function(t){this.finishLiteralUnit(),arguments.callee.SUPER.Superscript.call(this,t)},Subscript:function(t){this.finishLiteralUnit(),arguments.callee.SUPER.Subscript.call(this,t)},Unsupported:function(){},Of:function(t){var e=this.GetArgument(t)
this.has_literal&&n.Error(["SIunitx","NotImplementedYet"]),this.units.length||n.Error(["SIunitx","Qualification suffix with no unit"])
var i=this.units[this.units.length-1]
void 0!==i.power&&n.Error(["SIunitx","double qualification",i.qual,e]),i.qual=e},Highlight:function(t){var e=this.GetArgument(t)
this.cur_highlight=e},Per:function(t){return this.per_active?void n.Error(["SIunitx","double \\per"]):void(this.per_active=!0)},PowerPfx:function(t,e){void 0===e&&(e=this.GetArgument(t)),this.cur_pfxpow&&n.Error(["SIunitx","double power prefix",this.cur_pfxpow,e]),this.cur_pfxpow=e},PowerSfx:function(t,e){void 0===e&&(e=this.GetArgument(t)),this.has_literal&&n.Error(["SIunitx","NotImplementedYet"]),this.units.length||n.Error(["SIunitx","Power suffix with no unit"])
var i=this.units[this.units.length-1]
void 0!==i.power&&n.Error(["SIunitx","double power",i.power,e]),i.power=e},SIPrefix:function(t,e){this.cur_prefix&&n.Error(["SIunitx","double SI prefix",this.cur_prefix,e]),this.cur_prefix=e},UnitMML:function(t){var e=[]
t.prefix&&(e=e.concat(t.prefix.pfx)),e=e.concat(t.unit.symbol)
var i="",r=[]
e.forEach(function(t){"string"==typeof t||t instanceof String?i+=t:(i&&(r.push(o.chars(i)),i=""),r.push(t))}),i&&r.push(o.chars(i))
var n={mathvariant:o.VARIANT.NORMAL},s=o.mi.apply(o.mi,r).With(n),a=void 0===t.power?1:t.power
return t.inverse&&(a=-a),1!=a?s=void 0===t.qual?o.msup(s,o.mn(a)):o.msubsup(s,o.mtext(t.qual),o.mn(a)):void 0!==t.qual&&(s=o.msub(s,o.mtext(t.qual))),this.mmlToken(s)},SIUnit:function(t,e){this.pushUnit(e)},finishLiteralUnit:function(){this.literal_chars&&(this.pushUnit({symbol:this.literal_chars,name:void 0,category:"literal",abbrev:this.literal_chars}),this.literal_chars="")},pushUnit:function(t){this.units.push({unit:t,prefix:this.cur_prefix,power:this.cur_pfxpow,inverse:this.per_active,qual:void 0})
var e=[]
this.cur_prefix&&(e=e.concat(this.cur_prefix.pfx)),e=e.concat(t.symbol)
var i="",r=[]
e.forEach(function(t){"string"==typeof t||t instanceof String?i+=t:(i&&(r.push(o.chars(i)),i=""),r.push(t))}),i&&r.push(o.chars(i))
var n={mathvariant:o.VARIANT.NORMAL}
this.PushUnitFallBack(this.mmlToken(o.mi.apply(o.mi,r).With(n))),this.cur_prefix=void 0,this.cur_pfxpow=void 0,this.options["sticky-per"]||(this.per_active=!1)}})
MathJax.Extension["TeX/siunitx"].SIUnitParser=E
var A=MathJax.Object.Subclass({Init:function(t,e,i){if(this.string=t,this.i=0,void 0===e)e=b()
else if(!(e instanceof b))throw"SINumberParser expects an options object"
this.options=e,this.regex=this.GenerateRegex(e),this.Parse()},GenerateRegex:function(t){function e(t){return t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")}var i="(?:\\.|,)",r="(\\+|-|\\\\pm|\\\\mp|\\\\le|\\\\leq|\\\\ll|\\\\ge|\\\\geq|\\\\gg|\\\\sim)",n="[0-9]",s="(?:i|j)",a="(?:[eEdD](-?\\d+))",o=e(this.options["input-product"]),u=e(this.options["input-quotient"]),h="("+n+"*)(?:"+i+"("+n+"*))?",c="(?:"+h+s+"|"+s+h+")",l=r+"?"+h+"(?:"+r+c+")?",m=l+a+"?",p="("+o+"|"+u+")",f=m+"(?:"+p+"("+m+"(?:"+p+m+")*))?",d=new RegExp("^"+f+"$")
return d},Parse:function(){var t=this.string.replace(/\s+/gi,""),e={"+-":"\\pm","-+":"\\mp","<=":"\\leq",">=":"\\geq","<<":"\\ll",">>":"\\gg"}
for(key in e)t=t.replace(key,e[key])
this.parsed=this._parse_multi_part_number(t)},_parse_multi_part_number:function(t){var e=this.regex.exec(t)
if(!e)return t
for(var i=this._parse_full_number(e);e[10];){var r=!1
e[10]==this.options["input-quotient"]?(i+=this.options["output-quotient"],r=!0):i+=this.options["output-product"],e=this.regex.exec(e[11]),i+=this._parse_full_number(e,r)}return i},_parse_full_number:function(t,e){function i(t){return t}function r(t,e){var i=n["group-digits"],r=n["group-minimum-digits"],s="{"+n["group-separator"]+"}"
t=t||"0"
var a=t.length
if(a>=r&&("true"==i||"integer"==i))for(a-=3;a>0;a-=3)t=t.slice(0,a)+s+t.slice(a)
if(!e)return t
if(a=e.length,a>=r&&("true"==i||"decimal"==i))for(a-=1+(a-1)%3;a>0;a-=3)e=e.slice(0,a)+s+e.slice(a)
return t+"{"+n["output-decimal-marker"]+"}"+e}var n=this.options,s=!!t[9]
if(!(t[2]||t[3]||t[4])&&s)return(t[1]?i(t[1]):"")+"10^{"+t[9]+"}"
var a=(t[1]?i(t[1]):"")+r(t[2],t[3]),o=!!t[4]
return o&&(a+=i(t[4]),a+="before-number"===n["complex-root-position"]?n["output-complex-root"]+r(t[5]||t[7],t[6]||t[8]):r(t[5]||t[7],t[6]||t[8])+n["output-complex-root"]),s&&(o&&(a="\\left("+a+"\\right)"),a+=n["exponent-product"]+" "+n["exponent-base"]+"^{"+t[9]+"}",e&&(a="\\left("+a+"\\right)")),a},mml:function(){return n.Parse(this.parsed).mml()}}),w=A.Subclass({Parse:function(){for(var t=this.string.replace(/\s+/gi,""),e=t.split(";"),i=[],r=0;r<e.length;++r)r==e.length-1?1==r?i.push("\\text{"+this.options["list-pair-separator"]+"}"):r&&i.push("\\text{"+this.options["list-final-separator"]+"}"):r&&i.push("\\text{"+this.options["list-separator"]+"}"),i.push(this._parse_multi_part_number(e[r]))
this.parsed=i},mml:function(){return n.Parse(this.parsed.join("")).mml()}}),G={sisetup:function(t){this.GetArgument(t)},si:function(t){var e=b(r(this.GetBrackets(t,""))),i=this.GetArgument(t)
this.Push(E(i,e,this.stack.env).mml())},SI:function(t){var e=b(r(this.GetBrackets(t,""))),i=this.GetArgument(t),n=this.GetBrackets(t,""),s=this.GetArgument(t)
n&&(this.Push(E(n,e,this.stack.env).mml()),this.Push(o.mspace().With({width:o.LENGTH.MEDIUMMATHSPACE,mathsize:o.SIZE.NORMAL,scriptlevel:0}))),this.Push(A(i,e,this.stack.env).mml()),this.Push(o.mspace().With({width:o.LENGTH.MEDIUMMATHSPACE,mathsize:o.SIZE.NORMAL,scriptlevel:0})),this.Push(E(s,e,this.stack.env).mml())},SIlist:function(t){function e(){return o.mspace().With({width:o.LENGTH.MEDIUMMATHSPACE,mathsize:o.SIZE.NORMAL,scriptlevel:0})}var i=b(r(this.GetBrackets(t,""))),s=this.GetArgument(t),a=this.GetBrackets(t,""),u=this.GetArgument(t)
a&&(a=E(a,i,this.stack.env)),s=w(s,i,this.stack.env).parsed,u=E(u,i,this.stack.env)
for(var h=0;h<s.length;++h){var c=s[h]
1&h?this.Push(n.Parse(c).mml()):(a&&(this.Push(a.mml()),this.Push(e())),this.Push(n.Parse(c).mml()),this.Push(e()),this.Push(u.mml()))}},SIrange:function(t){var e=b(r(this.GetBrackets(t,""))),i=this.GetArgument(t),n=this.GetArgument(t),s=this.GetBrackets(t,""),a=this.GetArgument(t)
a=E(a,e,this.stack.env),s&&(s=E(s,e,this.stack.env)),s&&(this.Push(s.mml()),this.Push(o.mspace().With({width:o.LENGTH.MEDIUMMATHSPACE,mathsize:o.SIZE.NORMAL,scriptlevel:0}))),this.Push(A(i,e,this.stack.env).mml()),this.Push(o.mspace().With({width:o.LENGTH.MEDIUMMATHSPACE,mathsize:o.SIZE.NORMAL,scriptlevel:0})),this.Push(a.mml()),this.Push(e["range-phrase"]),s&&(this.Push(s.mml()),this.Push(o.mspace().With({width:o.LENGTH.MEDIUMMATHSPACE,mathsize:o.SIZE.NORMAL,scriptlevel:0}))),this.Push(A(n,e,this.stack.env).mml()),this.Push(o.mspace().With({width:o.LENGTH.MEDIUMMATHSPACE,mathsize:o.SIZE.NORMAL,scriptlevel:0})),this.Push(a.mml())},num:function(t){var e=b(r(this.GetBrackets(t,""))),i=this.GetArgument(t)
this.Push(A(i,e,this.stack.env).mml())},ang:function(t){var e=b(r(this.GetBrackets(t,""))),i=this.GetArgument(t)
i=w(i,e,this.stack.env).parsed,i.length>5&&n.Error("More than three elements in angle specification"),units=["degree",void 0,"arcminute",void 0,"arcsecond"]
for(var s={mathvariant:o.VARIANT.NORMAL},a=0;a<i.length;++a){var u=i[a]
if(1&a);else{if(!u)continue
this.Push(n.Parse(u).mml())
var h=P[units[a]][1],c=o.mi.apply(o.mi,[h.symbol]).With(s)
this.Push(this.mmlToken(c))}}},numlist:function(t){var e=b(r(this.GetBrackets(t,""))),i=this.GetArgument(t)
this.Push(w(i,e,this.stack.env).mml())},numrange:function(t){var e=b(r(this.GetBrackets(t,""))),i=this.GetArgument(t),n=this.GetArgument(t)
this.Push(A(i,e,this.stack.env).mml()),this.Push(e["range-phrase"]),this.Push(A(n,e,this.stack.env).mml())}}
MathJax.Extension["TeX/siunitx"].SIunitxCommands=G,n.Definitions.Add({macros:{sisetup:"SIunitx",si:"SIunitx",SI:"SIunitx",SIlist:"SIunitx",SIrange:"SIunitx",num:"SIunitx",ang:"SIunitx",numlist:"SIunitx",numrange:"SIunitx"}},null,!0),n.Parse.Augment({SIunitx:function(t){G[t.slice(1)].call(this,t)}}),MathJax.Hub.Startup.signal.Post("TeX siunitx Ready")}),MathJax.Ajax.loadComplete("[Contrib]/siunitx/unpacked/siunitx.js")
