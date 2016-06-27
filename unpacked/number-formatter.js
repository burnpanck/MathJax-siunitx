/**
 * Created by yves on 27.06.16.
 */

define([],function(){

    function incIntStr(str){
        var m = str.length;
        var k=m-1;
        while(k>=0 && str[k]==='9') k--;
        if(k>=0){
            str = str.slice(0,k)
                + '123456789'[parseInt(str[k])]
                + '0'.repeat(m-k-1);
        } else str = '1' + '0'.repeat(m);
        return str;
    }
    function postproc(options,num,no_rounding,retain_plus){
        if(num===null)return;
        var n;
        // -- explicit signs
        if(num.sign === null)
            num.sign = options['explicit-sign'] || null;
        else if(!retain_plus && num.sign === '+' && !options['retain-explicit-plus'])
            num.sign = null;
        // -- remove leading zeros
        num.int = num.int.replace(/^00*/,'')
        // -- missing zeros
        if(!num.int && options['add-integer-zero'])
            num.int = '0';
        if(num.sep && !num.frac && options['add-decimal-zero'])
            num.frac = '0';
        // -- minimum integer digits
        n = options['minimum-integer-digits'] - num.int.length
        if(n>0)
            num.int = '0'.repeat(n) + num.int;
        // -- rounding
        // TODO: disable rounding when non-digits present in number
        if(!no_rounding && num.uncert===null){ //&& options['round-mode']!=='off'
            if(true){//options['round-mode']==='figures')
                n = num.int.replace(/^00*/,'').length;
                if(n)
                    n += num.frac.length;
                else
                    n = num.frac.replace(/^00*/,'').length;
            } else
                n = num.frac.length;  // round-mode = places
            n -= 3; //options['round-precision'];
            switch(Math.sign(n)){
                case 1:
                    // Too many digits
                    var comb = num.int + num.frac;
                    var dir = Math.sign(parseInt(comb[comb.length-n])-5);
                    if(!dir && n>1 && parseInt(comb.slice(1-n)))
                        dir = 1;
                    comb = comb.slice(0,-n);
                    if(!dir){
                        // exactly half
                        switch(options['round-half']){
                            case 'up': // actually: up in magnitude
                                dir = 1;
                                break;
                            default:
                            case 'even':
                                dir = parseInt(comb[comb.length-1])&1 ? 1 : -1;
                                break;
                        }
                    }
                    if(dir===1) comb = incIntStr(comb);
                    if(n<num.frac.length){
                        // decimal result
                        num.int = comb.slice(0,n-num.frac.length);
                        num.frac = comb.slice(n-num.frac.length);
                    } else {
                        // integer result
                        num.int = comb + '0'.repeat(n-num.frac.length);
                        num.sep = null;
                        num.frac = '';
                    }
                    break
                case -1:
                    // Too few digits
                    if(num.sep || options['round-integer-to-decimal']){
                        num.sep = num.sep || '.';
                        num.frac += '0'.repeat(-n);
                    }
                    break
            };
        };
        if(
            false //options['zero-decimal-to-integer']
            && !(num.frac && parseInt(num.frac))
        ) {num.frac=null;num.sep=null;};
    };
    function fmtDecimal(options,num){
        var integer = num.int;
        var fractional = num.frac;

        var gd = options['group-digits'];
        var md = options['group-minimum-digits'];
        var gs = '{' + options['group-separator'] + '}';
        var dm = '{' + (
                options['copy-decimal-marker'] || true
                    ? num.sep
                    : options['output-decimal-marker']
            ) + '}';

        var sign = (num.sign || '');

//  integer = integer || '0';
        var l = integer.length;
        if(l>=md && (gd==='true' || gd==='integer')){
            l-=3;
            for(;l>0;l-=3){
                integer = integer.slice(0,l) + gs + integer.slice(l);
            }
        }

        if(!num.sep)
            return sign + integer;

        l = fractional.length;
        if(l>=md && (gd==='true' || gd==='decimal')){
            l-=1+(l-1)%3;
            for(;l>0;l-=3){
                fractional = fractional.slice(0,l) + gs + fractional.slice(l);
            }
        }

        return (
            sign
            + integer
            + dm
            + fractional
        );
    };

    function fmtComplExp(options,num){
        var ob='',cb='';
        if(num.exp && options['bracket-numbers']){
            ob = (options['open-bracket'] || '(') + ' ';
            cb = ' ' + (options['close-bracket'] || ')');
        }

        var re = num.re && fmtDecimal(num.re);
        var im = null;
        if(num.im){
            var cr = (
                options['copy-complex-root'] || true
                    ? num.im.root
                    : options['output-complex-root']
            );
            im = fmtDecimal(num.im);
            if(options['complex-root-position'] === 'before-number')
                im = cr+im;
            else
                im = im+cr;
        }
        var ret = num.rel ? num.rel+' ' : '';
        if(re !== null) {
            if(im === null) ret += re;
            else ret += ob + re + ' ' + im + cb;
        } else if(im !== null) ret += im;
        else error('neither re nor im given'); // should never happen

        if(num.exp){
            var exp = fmtDecimal(num.exp);
            var oem = options['output-exponent-marker'];
            if(oem)
                ret += ' ' + oem + ' ' + exp;
            else
                ret += (
                    ' ' + (options['exponent-product'] || '\\times')
                    + ' ' + (options['exponent-base'] || '10')
                    + '^{' + exp + '}'
                );
        }
        return ret;
    };

    return {postproc:postproc, fmtDecimal:fmtDecimal, fmtComplExp:fmtComplExp};
});