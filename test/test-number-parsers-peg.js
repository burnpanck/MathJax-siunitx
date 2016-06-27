/**
 * Created by yves on 26/06/16.
 */

var assert = require('chai').assert;
var requirejs = require('requirejs');

requirejs.config({
  baseUrl: '.',
  nodeRequire: require
});

describe('number-parser-peg',function(){
  var parse,err;
  it('can be imported',function(done){
    requirejs(['unpacked/number-parser-peg'],function(p){
      parse = p.parse;
      err = p.SyntaxError;
      console.log(p);
      done();
    });
  });
  var options;
  beforeEach(function(){options={};});
  it('simple-numbers',function(){
    var inp = '1.23';
    var expected = {num:1.23};
    var outp = parse(inp);
    console.log(inp,outp,expected);
    assert.deepEqual(outp,expected);
  });
});