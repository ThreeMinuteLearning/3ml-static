(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bw.aG === region.bT.aG)
	{
		return 'on line ' + region.bw.aG;
	}
	return 'on lines ' + region.bw.aG + ' through ' + region.bT.aG;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.$7,
		impl.ex,
		impl.en,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		Z: func(record.Z),
		bx: record.bx,
		bq: record.bq
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.Z;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bx;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bq) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.$7,
		impl.ex,
		impl.en,
		function(sendToApp, initialModel) {
			var view = impl.ey;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.$7,
		impl.ex,
		impl.en,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bu && impl.bu(sendToApp)
			var view = impl.ey;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.a);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.cE) && (_VirtualDom_doc.title = title = doc.cE);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.d3;
	var onUrlRequest = impl.d4;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bu: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.ce === next.ce
							&& curr.bZ === next.bZ
							&& curr.ca.a === next.ca.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		$7: function(flags)
		{
			return A3(impl.$7, flags, _Browser_getUrl(), key);
		},
		ey: impl.ey,
		ex: impl.ex,
		en: impl.en
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { a_: 'hidden', cX: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { a_: 'mozHidden', cX: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { a_: 'msHidden', cX: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { a_: 'webkitHidden', cX: 'webkitvisibilitychange' }
		: { a_: 'hidden', cX: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		co: _Browser_getScene(),
		eA: {
			cM: _Browser_window.pageXOffset,
			cN: _Browser_window.pageYOffset,
			eB: _Browser_doc.documentElement.clientWidth,
			di: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		eB: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		di: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			co: {
				eB: node.scrollWidth,
				di: node.scrollHeight
			},
			eA: {
				cM: node.scrollLeft,
				cN: node.scrollTop,
				eB: node.clientWidth,
				di: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			co: _Browser_getScene(),
			eA: {
				cM: x,
				cN: y,
				eB: _Browser_doc.documentElement.clientWidth,
				di: _Browser_doc.documentElement.clientHeight
			},
			c7: {
				cM: x + rect.left,
				cN: y + rect.top,
				eB: rect.width,
				di: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});



// SEND REQUEST

var _Http_toTask = F2(function(request, maybeProgress)
{
	return _Scheduler_binding(function(callback)
	{
		var xhr = new XMLHttpRequest();

		_Http_configureProgress(xhr, maybeProgress);

		xhr.addEventListener('error', function() {
			callback(_Scheduler_fail($elm$http$Http$NetworkError));
		});
		xhr.addEventListener('timeout', function() {
			callback(_Scheduler_fail($elm$http$Http$Timeout));
		});
		xhr.addEventListener('load', function() {
			callback(_Http_handleResponse(xhr, request.b.a));
		});

		try
		{
			xhr.open(request.d, request.f, true);
		}
		catch (e)
		{
			return callback(_Scheduler_fail($elm$http$Http$BadUrl(request.f)));
		}

		_Http_configureRequest(xhr, request);

		var body = request.a;
		xhr.send($elm$http$Http$Internal$isStringBody(body)
			? (xhr.setRequestHeader('Content-Type', body.a), body.b)
			: body.a
		);

		return function() { xhr.abort(); };
	});
});

function _Http_configureProgress(xhr, maybeProgress)
{
	if (!$elm$core$Maybe$isJust(maybeProgress))
	{
		return;
	}

	xhr.addEventListener('progress', function(event) {
		if (!event.lengthComputable)
		{
			return;
		}
		_Scheduler_rawSpawn(maybeProgress.a({
			cU: event.loaded,
			cV: event.total
		}));
	});
}

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.c; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}

	xhr.responseType = request.b.b;
	xhr.withCredentials = request.g;

	$elm$core$Maybe$isJust(request.e) && (xhr.timeout = request.e.a);
}


// RESPONSES

function _Http_handleResponse(xhr, responseToResult)
{
	var response = _Http_toResponse(xhr);

	if (xhr.status < 200 || 300 <= xhr.status)
	{
		response.body = xhr.responseText;
		return _Scheduler_fail($elm$http$Http$BadStatus(response));
	}

	var result = responseToResult(response);

	if ($elm$core$Result$isOk(result))
	{
		return _Scheduler_succeed(result.a);
	}
	else
	{
		response.body = xhr.responseText;
		return _Scheduler_fail(A2($elm$http$Http$BadPayload, result.a, response));
	}
}

function _Http_toResponse(xhr)
{
	return {
		f: xhr.responseURL,
		ek: { c1: xhr.status, Z: xhr.statusText },
		c: _Http_parseHeaders(xhr.getAllResponseHeaders()),
		a: xhr.response
	};
}

function _Http_parseHeaders(rawHeaders)
{
	var headers = $elm$core$Dict$empty;

	if (!rawHeaders)
	{
		return headers;
	}

	var headerPairs = rawHeaders.split('\u000d\u000a');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf('\u003a\u0020');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}

	return headers;
}


// EXPECTORS

function _Http_expectStringResponse(responseToResult)
{
	return {
		$: 0,
		b: 'text',
		a: responseToResult
	};
}

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		b: expect.b,
		a: function(response) {
			var convertedResponse = expect.a(response);
			return A2($elm$core$Result$map, func, convertedResponse);
		}
	};
});


// BODY

function _Http_multipart(parts)
{


	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}

	return $elm$http$Http$Internal$FormDataBody(formData);
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.dK) { flags += 'm'; }
	if (options.cW) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;


// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });




// VIRTUAL-DOM WIDGETS


var _Markdown_toHtml = F3(function(options, factList, rawMarkdown)
{
	return _VirtualDom_custom(
		factList,
		{
			a: options,
			b: rawMarkdown
		},
		_Markdown_render,
		_Markdown_diff
	);
});



// WIDGET IMPLEMENTATION


function _Markdown_render(model)
{
	return A2(_Markdown_replace, model, _VirtualDom_doc.createElement('div'));
}


function _Markdown_diff(x, y)
{
	return x.b === y.b && x.a === y.a
		? false
		: _Markdown_replace(y);
}


var _Markdown_replace = F2(function(model, div)
{
	div.innerHTML = _Markdown_marked(model.b, _Markdown_formatOptions(model.a));
	return div;
});



// ACTUAL MARKDOWN PARSER


var _Markdown_marked = function() {
	// catch the `marked` object regardless of the outer environment.
	// (ex. a CommonJS module compatible environment.)
	// note that this depends on marked's implementation of environment detection.
	var module = {};
	var exports = module.exports = {};

	/**
	 * marked - a markdown parser
	 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
	 * https://github.com/chjj/marked
	 * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
	 */
	(function(){var block={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:noop,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:noop,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:noop,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};block.bullet=/(?:[*+-]|\d+\.)/;block.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item=replace(block.item,"gm")(/bull/g,block.bullet)();block.list=replace(block.list)(/bull/g,block.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+block.def.source+")")();block.blockquote=replace(block.blockquote)("def",block.def)();block._tag="(?!(?:"+"a|em|strong|small|s|cite|q|dfn|abbr|data|time|code"+"|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo"+"|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html=replace(block.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,block._tag)();block.paragraph=replace(block.paragraph)("hr",block.hr)("heading",block.heading)("lheading",block.lheading)("blockquote",block.blockquote)("tag","<"+block._tag)("def",block.def)();block.normal=merge({},block);block.gfm=merge({},block.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/});block.gfm.paragraph=replace(block.paragraph)("(?!","(?!"+block.gfm.fences.source.replace("\\1","\\2")+"|"+block.list.source.replace("\\1","\\3")+"|")();block.tables=merge({},block.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/});function Lexer(options){this.tokens=[];this.tokens.links={};this.options=options||marked.defaults;this.rules=block.normal;if(this.options.gfm){if(this.options.tables){this.rules=block.tables}else{this.rules=block.gfm}}}Lexer.rules=block;Lexer.lex=function(src,options){var lexer=new Lexer(options);return lexer.lex(src)};Lexer.prototype.lex=function(src){src=src.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n");return this.token(src,true)};Lexer.prototype.token=function(src,top,bq){var src=src.replace(/^ +$/gm,""),next,loose,cap,bull,b,item,space,i,l;while(src){if(cap=this.rules.newline.exec(src)){src=src.substring(cap[0].length);if(cap[0].length>1){this.tokens.push({type:"space"})}}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);cap=cap[0].replace(/^ {4}/gm,"");this.tokens.push({type:"code",text:!this.options.pedantic?cap.replace(/\n+$/,""):cap});continue}if(cap=this.rules.fences.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"code",lang:cap[2],text:cap[3]||""});continue}if(cap=this.rules.heading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[1].length,text:cap[2]});continue}if(top&&(cap=this.rules.nptable.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].split(/ *\| */)}this.tokens.push(item);continue}if(cap=this.rules.lheading.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"heading",depth:cap[2]==="="?1:2,text:cap[1]});continue}if(cap=this.rules.hr.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"hr"});continue}if(cap=this.rules.blockquote.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"blockquote_start"});cap=cap[0].replace(/^ *> ?/gm,"");this.token(cap,top,true);this.tokens.push({type:"blockquote_end"});continue}if(cap=this.rules.list.exec(src)){src=src.substring(cap[0].length);bull=cap[2];this.tokens.push({type:"list_start",ordered:bull.length>1});cap=cap[0].match(this.rules.item);next=false;l=cap.length;i=0;for(;i<l;i++){item=cap[i];space=item.length;item=item.replace(/^ *([*+-]|\d+\.) +/,"");if(~item.indexOf("\n ")){space-=item.length;item=!this.options.pedantic?item.replace(new RegExp("^ {1,"+space+"}","gm"),""):item.replace(/^ {1,4}/gm,"")}if(this.options.smartLists&&i!==l-1){b=block.bullet.exec(cap[i+1])[0];if(bull!==b&&!(bull.length>1&&b.length>1)){src=cap.slice(i+1).join("\n")+src;i=l-1}}loose=next||/\n\n(?!\s*$)/.test(item);if(i!==l-1){next=item.charAt(item.length-1)==="\n";if(!loose)loose=next}this.tokens.push({type:loose?"loose_item_start":"list_item_start"});this.token(item,false,bq);this.tokens.push({type:"list_item_end"})}this.tokens.push({type:"list_end"});continue}if(cap=this.rules.html.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&(cap[1]==="pre"||cap[1]==="script"||cap[1]==="style"),text:cap[0]});continue}if(!bq&&top&&(cap=this.rules.def.exec(src))){src=src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()]={href:cap[2],title:cap[3]};continue}if(top&&(cap=this.rules.table.exec(src))){src=src.substring(cap[0].length);item={type:"table",header:cap[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:cap[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:cap[3].replace(/(?: *\| *)?\n$/,"").split("\n")};for(i=0;i<item.align.length;i++){if(/^ *-+: *$/.test(item.align[i])){item.align[i]="right"}else if(/^ *:-+: *$/.test(item.align[i])){item.align[i]="center"}else if(/^ *:-+ *$/.test(item.align[i])){item.align[i]="left"}else{item.align[i]=null}}for(i=0;i<item.cells.length;i++){item.cells[i]=item.cells[i].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */)}this.tokens.push(item);continue}if(top&&(cap=this.rules.paragraph.exec(src))){src=src.substring(cap[0].length);this.tokens.push({type:"paragraph",text:cap[1].charAt(cap[1].length-1)==="\n"?cap[1].slice(0,-1):cap[1]});continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);this.tokens.push({type:"text",text:cap[0]});continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return this.tokens};var inline={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:noop,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^_\_([\s\S]+?)_\_(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|_\_)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:noop,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};inline._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link=replace(inline.link)("inside",inline._inside)("href",inline._href)();inline.reflink=replace(inline.reflink)("inside",inline._inside)();inline.normal=merge({},inline);inline.pedantic=merge({},inline.normal,{strong:/^_\_(?=\S)([\s\S]*?\S)_\_(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/});inline.gfm=merge({},inline.normal,{escape:replace(inline.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:replace(inline.text)("]|","~]|")("|","|https?://|")()});inline.breaks=merge({},inline.gfm,{br:replace(inline.br)("{2,}","*")(),text:replace(inline.gfm.text)("{2,}","*")()});function InlineLexer(links,options){this.options=options||marked.defaults;this.links=links;this.rules=inline.normal;this.renderer=this.options.renderer||new Renderer;this.renderer.options=this.options;if(!this.links){throw new Error("Tokens array requires a `links` property.")}if(this.options.gfm){if(this.options.breaks){this.rules=inline.breaks}else{this.rules=inline.gfm}}else if(this.options.pedantic){this.rules=inline.pedantic}}InlineLexer.rules=inline;InlineLexer.output=function(src,links,options){var inline=new InlineLexer(links,options);return inline.output(src)};InlineLexer.prototype.output=function(src){var out="",link,text,href,cap;while(src){if(cap=this.rules.escape.exec(src)){src=src.substring(cap[0].length);out+=cap[1];continue}if(cap=this.rules.autolink.exec(src)){src=src.substring(cap[0].length);if(cap[2]==="@"){text=cap[1].charAt(6)===":"?this.mangle(cap[1].substring(7)):this.mangle(cap[1]);href=this.mangle("mailto:")+text}else{text=escape(cap[1]);href=text}out+=this.renderer.link(href,null,text);continue}if(!this.inLink&&(cap=this.rules.url.exec(src))){src=src.substring(cap[0].length);text=escape(cap[1]);href=text;out+=this.renderer.link(href,null,text);continue}if(cap=this.rules.tag.exec(src)){if(!this.inLink&&/^<a /i.test(cap[0])){this.inLink=true}else if(this.inLink&&/^<\/a>/i.test(cap[0])){this.inLink=false}src=src.substring(cap[0].length);out+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(cap[0]):escape(cap[0]):cap[0];continue}if(cap=this.rules.link.exec(src)){src=src.substring(cap[0].length);this.inLink=true;out+=this.outputLink(cap,{href:cap[2],title:cap[3]});this.inLink=false;continue}if((cap=this.rules.reflink.exec(src))||(cap=this.rules.nolink.exec(src))){src=src.substring(cap[0].length);link=(cap[2]||cap[1]).replace(/\s+/g," ");link=this.links[link.toLowerCase()];if(!link||!link.href){out+=cap[0].charAt(0);src=cap[0].substring(1)+src;continue}this.inLink=true;out+=this.outputLink(cap,link);this.inLink=false;continue}if(cap=this.rules.strong.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.strong(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.em.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.em(this.output(cap[2]||cap[1]));continue}if(cap=this.rules.code.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.codespan(escape(cap[2],true));continue}if(cap=this.rules.br.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.br();continue}if(cap=this.rules.del.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.del(this.output(cap[1]));continue}if(cap=this.rules.text.exec(src)){src=src.substring(cap[0].length);out+=this.renderer.text(escape(this.smartypants(cap[0])));continue}if(src){throw new Error("Infinite loop on byte: "+src.charCodeAt(0))}}return out};InlineLexer.prototype.outputLink=function(cap,link){var href=escape(link.href),title=link.title?escape(link.title):null;return cap[0].charAt(0)!=="!"?this.renderer.link(href,title,this.output(cap[1])):this.renderer.image(href,title,escape(cap[1]))};InlineLexer.prototype.smartypants=function(text){if(!this.options.smartypants)return text;return text.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014\/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…")};InlineLexer.prototype.mangle=function(text){if(!this.options.mangle)return text;var out="",l=text.length,i=0,ch;for(;i<l;i++){ch=text.charCodeAt(i);if(Math.random()>.5){ch="x"+ch.toString(16)}out+="&#"+ch+";"}return out};function Renderer(options){this.options=options||{}}Renderer.prototype.code=function(code,lang,escaped){if(this.options.highlight){var out=this.options.highlight(code,lang);if(out!=null&&out!==code){escaped=true;code=out}}if(!lang){return"<pre><code>"+(escaped?code:escape(code,true))+"\n</code></pre>"}return'<pre><code class="'+this.options.langPrefix+escape(lang,true)+'">'+(escaped?code:escape(code,true))+"\n</code></pre>\n"};Renderer.prototype.blockquote=function(quote){return"<blockquote>\n"+quote+"</blockquote>\n"};Renderer.prototype.html=function(html){return html};Renderer.prototype.heading=function(text,level,raw){return"<h"+level+' id="'+this.options.headerPrefix+raw.toLowerCase().replace(/[^\w]+/g,"-")+'">'+text+"</h"+level+">\n"};Renderer.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"};Renderer.prototype.list=function(body,ordered){var type=ordered?"ol":"ul";return"<"+type+">\n"+body+"</"+type+">\n"};Renderer.prototype.listitem=function(text){return"<li>"+text+"</li>\n"};Renderer.prototype.paragraph=function(text){return"<p>"+text+"</p>\n"};Renderer.prototype.table=function(header,body){return"<table>\n"+"<thead>\n"+header+"</thead>\n"+"<tbody>\n"+body+"</tbody>\n"+"</table>\n"};Renderer.prototype.tablerow=function(content){return"<tr>\n"+content+"</tr>\n"};Renderer.prototype.tablecell=function(content,flags){var type=flags.header?"th":"td";var tag=flags.align?"<"+type+' style="text-align:'+flags.align+'">':"<"+type+">";return tag+content+"</"+type+">\n"};Renderer.prototype.strong=function(text){return"<strong>"+text+"</strong>"};Renderer.prototype.em=function(text){return"<em>"+text+"</em>"};Renderer.prototype.codespan=function(text){return"<code>"+text+"</code>"};Renderer.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"};Renderer.prototype.del=function(text){return"<del>"+text+"</del>"};Renderer.prototype.link=function(href,title,text){if(this.options.sanitize){try{var prot=decodeURIComponent(unescape(href)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(prot.indexOf("javascript:")===0||prot.indexOf("vbscript:")===0||prot.indexOf("data:")===0){return""}}var out='<a href="'+href+'"';if(title){out+=' title="'+title+'"'}out+=">"+text+"</a>";return out};Renderer.prototype.image=function(href,title,text){var out='<img src="'+href+'" alt="'+text+'"';if(title){out+=' title="'+title+'"'}out+=this.options.xhtml?"/>":">";return out};Renderer.prototype.text=function(text){return text};function Parser(options){this.tokens=[];this.token=null;this.options=options||marked.defaults;this.options.renderer=this.options.renderer||new Renderer;this.renderer=this.options.renderer;this.renderer.options=this.options}Parser.parse=function(src,options,renderer){var parser=new Parser(options,renderer);return parser.parse(src)};Parser.prototype.parse=function(src){this.inline=new InlineLexer(src.links,this.options,this.renderer);this.tokens=src.reverse();var out="";while(this.next()){out+=this.tok()}return out};Parser.prototype.next=function(){return this.token=this.tokens.pop()};Parser.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0};Parser.prototype.parseText=function(){var body=this.token.text;while(this.peek().type==="text"){body+="\n"+this.next().text}return this.inline.output(body)};Parser.prototype.tok=function(){switch(this.token.type){case"space":{return""}case"hr":{return this.renderer.hr()}case"heading":{return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text)}case"code":{return this.renderer.code(this.token.text,this.token.lang,this.token.escaped)}case"table":{var header="",body="",i,row,cell,flags,j;cell="";for(i=0;i<this.token.header.length;i++){flags={header:true,align:this.token.align[i]};cell+=this.renderer.tablecell(this.inline.output(this.token.header[i]),{header:true,align:this.token.align[i]})}header+=this.renderer.tablerow(cell);for(i=0;i<this.token.cells.length;i++){row=this.token.cells[i];cell="";for(j=0;j<row.length;j++){cell+=this.renderer.tablecell(this.inline.output(row[j]),{header:false,align:this.token.align[j]})}body+=this.renderer.tablerow(cell)}return this.renderer.table(header,body)}case"blockquote_start":{var body="";while(this.next().type!=="blockquote_end"){body+=this.tok()}return this.renderer.blockquote(body)}case"list_start":{var body="",ordered=this.token.ordered;while(this.next().type!=="list_end"){body+=this.tok()}return this.renderer.list(body,ordered)}case"list_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.token.type==="text"?this.parseText():this.tok()}return this.renderer.listitem(body)}case"loose_item_start":{var body="";while(this.next().type!=="list_item_end"){body+=this.tok()}return this.renderer.listitem(body)}case"html":{var html=!this.token.pre&&!this.options.pedantic?this.inline.output(this.token.text):this.token.text;return this.renderer.html(html)}case"paragraph":{return this.renderer.paragraph(this.inline.output(this.token.text))}case"text":{return this.renderer.paragraph(this.parseText())}}};function escape(html,encode){return html.replace(!encode?/&(?!#?\w+;)/g:/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function unescape(html){return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(_,n){n=n.toLowerCase();if(n==="colon")return":";if(n.charAt(0)==="#"){return n.charAt(1)==="x"?String.fromCharCode(parseInt(n.substring(2),16)):String.fromCharCode(+n.substring(1))}return""})}function replace(regex,opt){regex=regex.source;opt=opt||"";return function self(name,val){if(!name)return new RegExp(regex,opt);val=val.source||val;val=val.replace(/(^|[^\[])\^/g,"$1");regex=regex.replace(name,val);return self}}function noop(){}noop.exec=noop;function merge(obj){var i=1,target,key;for(;i<arguments.length;i++){target=arguments[i];for(key in target){if(Object.prototype.hasOwnProperty.call(target,key)){obj[key]=target[key]}}}return obj}function marked(src,opt,callback){if(callback||typeof opt==="function"){if(!callback){callback=opt;opt=null}opt=merge({},marked.defaults,opt||{});var highlight=opt.highlight,tokens,pending,i=0;try{tokens=Lexer.lex(src,opt)}catch(e){return callback(e)}pending=tokens.length;var done=function(err){if(err){opt.highlight=highlight;return callback(err)}var out;try{out=Parser.parse(tokens,opt)}catch(e){err=e}opt.highlight=highlight;return err?callback(err):callback(null,out)};if(!highlight||highlight.length<3){return done()}delete opt.highlight;if(!pending)return done();for(;i<tokens.length;i++){(function(token){if(token.type!=="code"){return--pending||done()}return highlight(token.text,token.lang,function(err,code){if(err)return done(err);if(code==null||code===token.text){return--pending||done()}token.text=code;token.escaped=true;--pending||done()})})(tokens[i])}return}try{if(opt)opt=merge({},marked.defaults,opt);return Parser.parse(Lexer.lex(src,opt),opt)}catch(e){e.message+="\nPlease report this to https://github.com/chjj/marked.";if((opt||marked.defaults).silent){return"<p>An error occured:</p><pre>"+escape(e.message+"",true)+"</pre>"}throw e}}marked.options=marked.setOptions=function(opt){merge(marked.defaults,opt);return marked};marked.defaults={gfm:true,tables:true,breaks:false,pedantic:false,sanitize:false,sanitizer:null,mangle:true,smartLists:false,silent:false,highlight:null,langPrefix:"lang-",smartypants:false,headerPrefix:"",renderer:new Renderer,xhtml:false};marked.Parser=Parser;marked.parser=Parser.parse;marked.Renderer=Renderer;marked.Lexer=Lexer;marked.lexer=Lexer.lex;marked.InlineLexer=InlineLexer;marked.inlineLexer=InlineLexer.output;marked.parse=marked;if(typeof module!=="undefined"&&typeof exports==="object"){module.exports=marked}else if(typeof define==="function"&&define.amd){define(function(){return marked})}else{this.marked=marked}}).call(function(){return this||(typeof window!=="undefined"?window:global)}());

	return module.exports;
}();


// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

function _Markdown_formatOptions(options)
{
	function toHighlight(code, lang)
	{
		if (!lang && $elm$core$Maybe$isJust(options.bO))
		{
			lang = options.bO.a;
		}

		if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0)
		{
			return hljs.highlight(lang, code, true).value;
		}

		return code;
	}

	var gfm = options.dg.a;

	return {
		highlight: toHighlight,
		gfm: gfm,
		tables: gfm && gfm.ep,
		breaks: gfm && gfm.cT,
		sanitize: options.ee,
		smartypants: options.ei
	};
}
var $author$project$Main$ChangedUrl = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$ClickedLink = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.n) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.o),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.o);
		} else {
			var treeLen = builder.n * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.p) : builder.p;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.n);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.o) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.o);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{p: nodeList, n: (len / $elm$core$Array$branchFactor) | 0, o: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {df: fragment, bZ: host, d8: path, ca: port_, ce: protocol, cg: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$Blank = {$: 0};
var $author$project$Main$Loaded = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$AccountLoaded = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$ClassLoaded = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$ClassesLoaded = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$EditorLoaded = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$FindStoryLoaded = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$HomeLoaded = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$LeaderBoardLoaded = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$Login = function (a) {
	return {$: 4, a: a};
};
var $author$project$Route$Login = {$: 1};
var $author$project$Main$NotFound = {$: 1};
var $author$project$Main$PageLoaded = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$Register = function (a) {
	return {$: 14, a: a};
};
var $author$project$Main$StoryLoaded = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$StudentLoaded = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$StudentsLoaded = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$TeachersLoaded = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$TransitioningFrom = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Main$getPage = function (pageState) {
	if (!pageState.$) {
		var page = pageState.a;
		return page;
	} else {
		var page = pageState.a;
		return page;
	}
};
var $author$project$Page$Account$Model = F2(
	function (settings, answers) {
		return {cQ: answers, cs: settings};
	});
var $author$project$Util$defaultHttpErrorMsg = function (err) {
	switch (err.$) {
		case 1:
			return 'The server took too long to respond. Please try again later';
		case 2:
			return 'Unable to contact the server. Please check that your network is OK';
		case 3:
			var status = err.a.ek;
			var _v1 = status.c1;
			switch (_v1) {
				case 409:
					return 'The server detected some conflict. Please report an error';
				case 403:
					return 'The server prevented access to a resource';
				default:
					return 'Sorry, there was an error processing the request';
			}
		case 4:
			var e = err.a;
			return 'Oops. Looks like there might be a bug in the app. Couldn\'t decode the server response: ' + e;
		default:
			return 'Couldn\'t send the request because the URL was wrong (shouldn\'t happen :-/)';
	}
};
var $author$project$Data$Settings$Settings = F5(
	function (background, colour, font, size, workQueue) {
		return {bd: background, bg: colour, bk: font, bv: size, w: workQueue};
	});
var $author$project$Data$Settings$defaultSettings = A5($author$project$Data$Settings$Settings, '#ffffff', '#000000', '\"Helvetica Neue\",Helvetica,Arial,sans-serif', '1.25rem', _List_Nil);
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $author$project$Data$Session$findStoryById = F2(
	function (cache, storyId) {
		return A2(
			$elm_community$list_extra$List$Extra$find,
			function (s) {
				return _Utils_eq(s.dl, storyId);
			},
			cache.a6);
	});
var $author$project$Data$Session$getCache = function (_v0) {
	var s = _v0;
	return s.s;
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Data$Session$getSettings = function (_v0) {
	var session = _v0;
	return A2(
		$elm$core$Maybe$andThen,
		function ($) {
			return $.cs;
		},
		session.r);
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm_community$graph$Graph$Edge = F3(
	function (from, to, label) {
		return {bV: from, dA: label, cF: to};
	});
var $elm_community$graph$Graph$Node = F2(
	function (id, label) {
		return {dl: id, dA: label};
	});
var $author$project$StoryGraph$StoryGraph = $elm$core$Basics$identity;
var $elm_community$graph$Graph$Graph = $elm$core$Basics$identity;
var $elm_community$graph$Graph$NodeContext = F3(
	function (node, incoming, outgoing) {
		return {dn: incoming, dO: node, d7: outgoing};
	});
var $elm_community$intdict$IntDict$Empty = {$: 0};
var $elm_community$intdict$IntDict$empty = $elm_community$intdict$IntDict$Empty;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm_community$intdict$IntDict$Inner = function (a) {
	return {$: 2, a: a};
};
var $elm_community$intdict$IntDict$size = function (dict) {
	switch (dict.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		default:
			var i = dict.a;
			return i.bv;
	}
};
var $elm_community$intdict$IntDict$inner = F3(
	function (p, l, r) {
		var _v0 = _Utils_Tuple2(l, r);
		if (!_v0.a.$) {
			var _v1 = _v0.a;
			return r;
		} else {
			if (!_v0.b.$) {
				var _v2 = _v0.b;
				return l;
			} else {
				return $elm_community$intdict$IntDict$Inner(
					{
						h: l,
						j: p,
						i: r,
						bv: $elm_community$intdict$IntDict$size(l) + $elm_community$intdict$IntDict$size(r)
					});
			}
		}
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm_community$intdict$IntDict$highestBitSet = function (n) {
	var shiftOr = F2(
		function (i, shift) {
			return i | (i >>> shift);
		});
	var n1 = A2(shiftOr, n, 1);
	var n2 = A2(shiftOr, n1, 2);
	var n3 = A2(shiftOr, n2, 4);
	var n4 = A2(shiftOr, n3, 8);
	var n5 = A2(shiftOr, n4, 16);
	return n5 & (~(n5 >>> 1));
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm_community$intdict$IntDict$signBit = $elm_community$intdict$IntDict$highestBitSet(-1);
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm_community$intdict$IntDict$isBranchingBitSet = function (p) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Bitwise$xor($elm_community$intdict$IntDict$signBit),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$Bitwise$and(p.ar),
			$elm$core$Basics$neq(0)));
};
var $elm_community$intdict$IntDict$higherBitMask = function (branchingBit) {
	return branchingBit ^ (~(branchingBit - 1));
};
var $elm_community$intdict$IntDict$lcp = F2(
	function (x, y) {
		var branchingBit = $elm_community$intdict$IntDict$highestBitSet(x ^ y);
		var mask = $elm_community$intdict$IntDict$higherBitMask(branchingBit);
		var prefixBits = x & mask;
		return {ar: branchingBit, P: prefixBits};
	});
var $elm_community$intdict$IntDict$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm_community$intdict$IntDict$leaf = F2(
	function (k, v) {
		return $elm_community$intdict$IntDict$Leaf(
			{b0: k, W: v});
	});
var $elm_community$intdict$IntDict$prefixMatches = F2(
	function (p, n) {
		return _Utils_eq(
			n & $elm_community$intdict$IntDict$higherBitMask(p.ar),
			p.P);
	});
var $elm_community$intdict$IntDict$update = F3(
	function (key, alter, dict) {
		var join = F2(
			function (_v2, _v3) {
				var k1 = _v2.a;
				var l = _v2.b;
				var k2 = _v3.a;
				var r = _v3.b;
				var prefix = A2($elm_community$intdict$IntDict$lcp, k1, k2);
				return A2($elm_community$intdict$IntDict$isBranchingBitSet, prefix, k2) ? A3($elm_community$intdict$IntDict$inner, prefix, l, r) : A3($elm_community$intdict$IntDict$inner, prefix, r, l);
			});
		var alteredNode = function (mv) {
			var _v1 = alter(mv);
			if (!_v1.$) {
				var v = _v1.a;
				return A2($elm_community$intdict$IntDict$leaf, key, v);
			} else {
				return $elm_community$intdict$IntDict$empty;
			}
		};
		switch (dict.$) {
			case 0:
				return alteredNode($elm$core$Maybe$Nothing);
			case 1:
				var l = dict.a;
				return _Utils_eq(l.b0, key) ? alteredNode(
					$elm$core$Maybe$Just(l.W)) : A2(
					join,
					_Utils_Tuple2(
						key,
						alteredNode($elm$core$Maybe$Nothing)),
					_Utils_Tuple2(l.b0, dict));
			default:
				var i = dict.a;
				return A2($elm_community$intdict$IntDict$prefixMatches, i.j, key) ? (A2($elm_community$intdict$IntDict$isBranchingBitSet, i.j, key) ? A3(
					$elm_community$intdict$IntDict$inner,
					i.j,
					i.h,
					A3($elm_community$intdict$IntDict$update, key, alter, i.i)) : A3(
					$elm_community$intdict$IntDict$inner,
					i.j,
					A3($elm_community$intdict$IntDict$update, key, alter, i.h),
					i.i)) : A2(
					join,
					_Utils_Tuple2(
						key,
						alteredNode($elm$core$Maybe$Nothing)),
					_Utils_Tuple2(i.j.P, dict));
		}
	});
var $elm_community$intdict$IntDict$insert = F3(
	function (key, value, dict) {
		return A3(
			$elm_community$intdict$IntDict$update,
			key,
			$elm$core$Basics$always(
				$elm$core$Maybe$Just(value)),
			dict);
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm_community$intdict$IntDict$get = F2(
	function (key, dict) {
		get:
		while (true) {
			switch (dict.$) {
				case 0:
					return $elm$core$Maybe$Nothing;
				case 1:
					var l = dict.a;
					return _Utils_eq(l.b0, key) ? $elm$core$Maybe$Just(l.W) : $elm$core$Maybe$Nothing;
				default:
					var i = dict.a;
					if (!A2($elm_community$intdict$IntDict$prefixMatches, i.j, key)) {
						return $elm$core$Maybe$Nothing;
					} else {
						if (A2($elm_community$intdict$IntDict$isBranchingBitSet, i.j, key)) {
							var $temp$key = key,
								$temp$dict = i.i;
							key = $temp$key;
							dict = $temp$dict;
							continue get;
						} else {
							var $temp$key = key,
								$temp$dict = i.h;
							key = $temp$key;
							dict = $temp$dict;
							continue get;
						}
					}
			}
		}
	});
var $elm_community$intdict$IntDict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm_community$intdict$IntDict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm_community$graph$Graph$fromNodesAndEdges = F2(
	function (nodes_, edges_) {
		var nodeRep = A3(
			$elm$core$List$foldl,
			function (n) {
				return A2(
					$elm_community$intdict$IntDict$insert,
					n.dl,
					A3($elm_community$graph$Graph$NodeContext, n, $elm_community$intdict$IntDict$empty, $elm_community$intdict$IntDict$empty));
			},
			$elm_community$intdict$IntDict$empty,
			nodes_);
		var addEdge = F2(
			function (edge, rep) {
				var updateOutgoing = function (ctx) {
					return _Utils_update(
						ctx,
						{
							d7: A3($elm_community$intdict$IntDict$insert, edge.cF, edge.dA, ctx.d7)
						});
				};
				var updateIncoming = function (ctx) {
					return _Utils_update(
						ctx,
						{
							dn: A3($elm_community$intdict$IntDict$insert, edge.bV, edge.dA, ctx.dn)
						});
				};
				return A3(
					$elm_community$intdict$IntDict$update,
					edge.cF,
					$elm$core$Maybe$map(updateIncoming),
					A3(
						$elm_community$intdict$IntDict$update,
						edge.bV,
						$elm$core$Maybe$map(updateOutgoing),
						rep));
			});
		var addEdgeIfValid = F2(
			function (edge, rep) {
				return (A2($elm_community$intdict$IntDict$member, edge.bV, rep) && A2($elm_community$intdict$IntDict$member, edge.cF, rep)) ? A2(addEdge, edge, rep) : rep;
			});
		return A3($elm$core$List$foldl, addEdgeIfValid, nodeRep, edges_);
	});
var $author$project$StoryGraph$fromStoriesAndConnections = F2(
	function (stories, edges) {
		return A2(
			$elm_community$graph$Graph$fromNodesAndEdges,
			A2(
				$elm$core$List$map,
				function (s) {
					return A2($elm_community$graph$Graph$Node, s.dl, s);
				},
				stories),
			A2(
				$elm$core$List$map,
				function (e) {
					return A3($elm_community$graph$Graph$Edge, e.bV, e.cF, e.aY);
				},
				edges));
	});
var $author$project$Api$apiUrl = 'https://api.3ml.org.uk/api';
var $author$project$Api$StoryData = F2(
	function (stories, graph) {
		return {bX: graph, a6: stories};
	});
var $author$project$Api$GraphEdge = F3(
	function (from, to, description) {
		return {aY: description, bV: from, cF: to};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$field = _Json_decodeField;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Api$decodeGraphEdge = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'description',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'to',
		$elm$json$Json$Decode$int,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'from',
			$elm$json$Json$Decode$int,
			$elm$json$Json$Decode$succeed($author$project$Api$GraphEdge))));
var $author$project$Api$Story = function (id) {
	return function (title) {
		return function (img) {
			return function (level) {
				return function (qualification) {
					return function (curriculum) {
						return function (tags) {
							return function (content) {
								return function (words) {
									return function (clarifyWord) {
										return function (nn) {
											return function (enabled) {
												return function (createdAt) {
													return {cY: clarifyWord, bL: content, as: createdAt, bM: curriculum, bS: enabled, dl: id, b_: img, aF: level, b6: nn, cf: qualification, cC: tags, cE: title, cL: words};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Api$DictEntry = F2(
	function (word, index) {
		return {b$: index, cK: word};
	});
var $author$project$Api$decodeDictEntry = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'index',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'word',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$Api$DictEntry)));
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $author$project$Api$decodeStory = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'created_at',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'enabled',
		$elm$json$Json$Decode$bool,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'nn',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'clarify_word',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'words',
					$elm$json$Json$Decode$list($author$project$Api$decodeDictEntry),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'content',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'tags',
							$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'curriculum',
								$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'qualification',
									$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'level',
										$elm$json$Json$Decode$int,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'img',
											$elm$json$Json$Decode$string,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'title',
												$elm$json$Json$Decode$string,
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'id',
													$elm$json$Json$Decode$int,
													$elm$json$Json$Decode$succeed($author$project$Api$Story))))))))))))));
var $author$project$Api$decodeStoryData = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'graph',
	$elm$json$Json$Decode$list($author$project$Api$decodeGraphEdge),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'stories',
		$elm$json$Json$Decode$list($author$project$Api$decodeStory),
		$elm$json$Json$Decode$succeed($author$project$Api$StoryData)));
var $elm$http$Http$Internal$EmptyBody = {$: 0};
var $elm$http$Http$emptyBody = $elm$http$Http$Internal$EmptyBody;
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$http$Http$BadPayload = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Internal$FormDataBody = function (a) {
	return {$: 2, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$http$Http$Internal$isStringBody = function (body) {
	if (body.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectStringResponse = _Http_expectStringResponse;
var $elm$http$Http$expectJson = function (decoder) {
	return $elm$http$Http$expectStringResponse(
		function (response) {
			var _v0 = A2($elm$json$Json$Decode$decodeString, decoder, response.a);
			if (_v0.$ === 1) {
				var decodeError = _v0.a;
				return $elm$core$Result$Err(
					$elm$json$Json$Decode$errorToString(decodeError));
			} else {
				var value = _v0.a;
				return $elm$core$Result$Ok(value);
			}
		});
};
var $elm$http$Http$Internal$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Internal$Header;
var $elm$http$Http$Internal$Request = $elm$core$Basics$identity;
var $elm$http$Http$request = $elm$core$Basics$identity;
var $author$project$Api$getStories = function (header_Authorization) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$emptyBody,
			b: $elm$http$Http$expectJson($author$project$Api$decodeStoryData),
			c: A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						$elm$http$Http$header('Authorization'),
						$elm$core$Maybe$Just(header_Authorization))
					])),
			d: 'GET',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/stories',
			g: true
		});
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Data$Session$Session = $elm$core$Basics$identity;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Data$Session$authorization = function (_v0) {
	var session = _v0;
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (_v1) {
				var s = _v1;
				return s;
			},
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.cG;
				},
				session.r)));
};
var $elm$http$Http$toTask = function (_v0) {
	var request_ = _v0;
	return A2(_Http_toTask, request_, $elm$core$Maybe$Nothing);
};
var $author$project$Data$Session$loadToCache = F4(
	function (isDirty, mkAuthorizedRequest, mkCache, sesh) {
		var session = sesh;
		var cache = session.s;
		return isDirty(cache) ? A2(
			$elm$core$Task$map,
			function (a) {
				return _Utils_update(
					session,
					{
						s: A2(mkCache, a, cache)
					});
			},
			$elm$http$Http$toTask(
				mkAuthorizedRequest(
					$author$project$Data$Session$authorization(sesh)))) : $elm$core$Task$succeed(session);
	});
var $elm$core$List$sortBy = _List_sortBy;
var $author$project$Data$Session$loadStories = function (session) {
	return A4(
		$author$project$Data$Session$loadToCache,
		A2(
			$elm$core$Basics$composeR,
			function ($) {
				return $.a6;
			},
			$elm$core$List$isEmpty),
		$author$project$Api$getStories,
		F2(
			function (newStories, cache) {
				return _Utils_update(
					cache,
					{
						a6: $elm$core$List$reverse(
							A2(
								$elm$core$List$sortBy,
								function ($) {
									return $.dl;
								},
								newStories.a6)),
						el: A2($author$project$StoryGraph$fromStoriesAndConnections, newStories.a6, newStories.bX)
					});
			}),
		session);
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Data$Session$answersToDict = A2(
	$elm$core$Basics$composeL,
	$elm$core$Dict$fromList,
	$elm$core$List$map(
		function (a) {
			return _Utils_Tuple2(a.ct, a);
		}));
var $author$project$Api$Answer = F7(
	function (storyId, studentId, connect, question, summarise, clarify, createdAt) {
		return {bJ: clarify, bK: connect, as: createdAt, Q: question, ct: storyId, a9: studentId, cA: summarise};
	});
var $author$project$Api$decodeAnswer = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'created_at',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'clarify',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'summarise',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'question',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'connect',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'student_id',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'story_id',
							$elm$json$Json$Decode$int,
							$elm$json$Json$Decode$succeed($author$project$Api$Answer))))))));
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $author$project$Api$getSchoolAnswers = F3(
	function (header_Authorization, query_story, query_student) {
		var params = A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$String$fromInt,
							A2(
								$elm$core$Basics$composeR,
								$elm$url$Url$percentEncode,
								$elm$core$Basics$append('story='))),
						query_story)),
					A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Basics$identity,
							A2(
								$elm$core$Basics$composeR,
								$elm$url$Url$percentEncode,
								$elm$core$Basics$append('student='))),
						query_student))
				]));
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectJson(
					$elm$json$Json$Decode$list($author$project$Api$decodeAnswer)),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'GET',
				e: $elm$core$Maybe$Nothing,
				f: $author$project$Api$apiUrl + ('/school/answers' + ($elm$core$List$isEmpty(params) ? '' : ('?' + A2($elm$core$String$join, '&', params)))),
				g: true
			});
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $author$project$Data$Session$populateWorkQueue = function (_v0) {
	var sesh = _v0;
	var answers = sesh.s.cQ;
	var workQueue = A2(
		$elm$core$List$filterMap,
		$author$project$Data$Session$findStoryById(sesh.s),
		A2(
			$elm$core$List$filter,
			function (id) {
				return !A2($elm$core$Dict$member, id, answers);
			},
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.w;
					},
					A2(
						$elm$core$Maybe$andThen,
						function ($) {
							return $.cs;
						},
						sesh.r)))));
	return $elm$core$Task$succeed(
		_Utils_update(
			sesh,
			{w: workQueue}));
};
var $author$project$Data$Session$loadUserAnswers = function (sesh) {
	var session = sesh;
	var _v0 = A2(
		$elm$core$Maybe$map,
		function ($) {
			return $.cm;
		},
		session.r);
	if ((!_v0.$) && (!_v0.a.$)) {
		var _v1 = _v0.a;
		return A2(
			$elm$core$Task$andThen,
			function (newSession) {
				var s = newSession;
				return $elm$core$List$isEmpty(s.w) ? $author$project$Data$Session$populateWorkQueue(newSession) : $elm$core$Task$succeed(newSession);
			},
			A4(
				$author$project$Data$Session$loadToCache,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.cQ;
					},
					$elm$core$Dict$isEmpty),
				function (token) {
					return A3($author$project$Api$getSchoolAnswers, token, $elm$core$Maybe$Nothing, $elm$core$Maybe$Nothing);
				},
				F2(
					function (newAnswers, cache) {
						return _Utils_update(
							cache,
							{
								cQ: $author$project$Data$Session$answersToDict(newAnswers)
							});
					}),
				sesh));
	} else {
		return $elm$core$Task$succeed(sesh);
	}
};
var $elm$core$Task$fail = _Scheduler_fail;
var $elm$core$Task$mapError = F2(
	function (convert, task) {
		return A2(
			$elm$core$Task$onError,
			A2($elm$core$Basics$composeL, $elm$core$Task$fail, convert),
			task);
	});
var $author$project$Page$Errored$AuthenticationRequired = {$: 1};
var $author$project$Page$Errored$PageLoadError = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Errored$pageLoadError = F2(
	function (err, msg) {
		if (err.$ === 3) {
			var r = err.a;
			var _v1 = function ($) {
				return $.c1;
			}(r.ek);
			if (_v1 === 401) {
				return $author$project$Page$Errored$AuthenticationRequired;
			} else {
				return $author$project$Page$Errored$PageLoadError(msg);
			}
		} else {
			return $author$project$Page$Errored$PageLoadError(msg);
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Page$Account$init = function (origSession) {
	var zipWithStory = F2(
		function (cache, a) {
			return A2(
				$elm$core$Maybe$map,
				$elm$core$Tuple$pair(a),
				A2($author$project$Data$Session$findStoryById, cache, a.ct));
		});
	var settings = A2(
		$elm$core$Maybe$withDefault,
		$author$project$Data$Settings$defaultSettings,
		$author$project$Data$Session$getSettings(origSession));
	var mkModel = function (cache) {
		return A2(
			$author$project$Page$Account$Model,
			settings,
			A2(
				$elm$core$List$filterMap,
				zipWithStory(cache),
				$elm$core$Dict$values(cache.cQ)));
	};
	var handleLoadError = function (e) {
		return A2(
			$author$project$Page$Errored$pageLoadError,
			e,
			$author$project$Util$defaultHttpErrorMsg(e));
	};
	return A2(
		$elm$core$Task$mapError,
		handleLoadError,
		A2(
			$elm$core$Task$map,
			function (newSession) {
				return _Utils_Tuple2(
					mkModel(
						$author$project$Data$Session$getCache(newSession)),
					newSession);
			},
			A2(
				$elm$core$Task$andThen,
				$author$project$Data$Session$loadStories,
				$author$project$Data$Session$loadUserAnswers(origSession))));
};
var $author$project$Page$Class$Model = F5(
	function (errors, _class, membersTable, selectedStudents, showConfirmDelete) {
		return {bf: _class, ai: errors, bm: membersTable, an: selectedStudents, aM: showConfirmDelete};
	});
var $author$project$Api$Class = F6(
	function (id, name, description, schoolId, createdBy, students) {
		return {aX: createdBy, aY: description, dl: id, a0: name, ab: schoolId, cv: students};
	});
var $author$project$Api$decodeClass = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'students',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$string),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'created_by',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'school_id',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'description',
				$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'name',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'id',
						$elm$json$Json$Decode$string,
						$elm$json$Json$Decode$succeed($author$project$Api$Class)))))));
var $author$project$Api$getSchoolClassesByClassId = F2(
	function (header_Authorization, capture_classId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectJson($author$project$Api$decodeClass),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'GET',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/classes',
							$elm$url$Url$percentEncode(capture_classId)
						])),
				g: true
			});
	});
var $billstclair$elm_sortable_table$Table$State = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $billstclair$elm_sortable_table$Table$initialSort = function (header) {
	return A2($billstclair$elm_sortable_table$Table$State, header, false);
};
var $author$project$Views$StudentTable$init = $billstclair$elm_sortable_table$Table$initialSort('Name');
var $author$project$Api$Student = F8(
	function (id, name, description, level, schoolId, hidden, deleted, createdAt) {
		return {as: createdAt, bP: deleted, aY: description, a_: hidden, dl: id, aF: level, a0: name, ab: schoolId};
	});
var $author$project$Api$decodeStudent = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'created_at',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'deleted',
		$elm$json$Json$Decode$bool,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'hidden',
			$elm$json$Json$Decode$bool,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'school_id',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'level',
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'description',
						$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'name',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'id',
								$elm$json$Json$Decode$string,
								$elm$json$Json$Decode$succeed($author$project$Api$Student)))))))));
var $author$project$Api$getSchoolStudents = function (header_Authorization) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$emptyBody,
			b: $elm$http$Http$expectJson(
				$elm$json$Json$Decode$list($author$project$Api$decodeStudent)),
			c: A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						$elm$http$Http$header('Authorization'),
						$elm$core$Maybe$Just(header_Authorization))
					])),
			d: 'GET',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/school/students',
			g: true
		});
};
var $author$project$Data$Session$loadStudents = A3(
	$author$project$Data$Session$loadToCache,
	A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.cv;
		},
		$elm$core$List$isEmpty),
	$author$project$Api$getSchoolStudents,
	F2(
		function (newStudents, cache) {
			return _Utils_update(
				cache,
				{cv: newStudents});
		}));
var $author$project$Page$Class$init = F2(
	function (session_, slug) {
		var mkModel = F2(
			function (newSession, _class) {
				return _Utils_Tuple2(
					A5($author$project$Page$Class$Model, _List_Nil, _class, $author$project$Views$StudentTable$init, $elm$core$Dict$empty, false),
					newSession);
			});
		var loadClass = $elm$http$Http$toTask(
			A2(
				$author$project$Api$getSchoolClassesByClassId,
				$author$project$Data$Session$authorization(session_),
				slug));
		var handleLoadError = function (e) {
			return A2(
				$author$project$Page$Errored$pageLoadError,
				e,
				'Unable to load class data. ' + ($author$project$Util$defaultHttpErrorMsg(e) + '.'));
		};
		return A2(
			$elm$core$Task$mapError,
			handleLoadError,
			A3(
				$elm$core$Task$map2,
				mkModel,
				$author$project$Data$Session$loadStudents(session_),
				loadClass));
	});
var $author$project$Page$Classes$Model = F2(
	function (tableState, addClassForm) {
		return {ae: addClassForm, by: tableState};
	});
var $author$project$Api$getSchoolClasses = function (header_Authorization) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$emptyBody,
			b: $elm$http$Http$expectJson(
				$elm$json$Json$Decode$list($author$project$Api$decodeClass)),
			c: A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						$elm$http$Http$header('Authorization'),
						$elm$core$Maybe$Just(header_Authorization))
					])),
			d: 'GET',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/school/classes',
			g: true
		});
};
var $author$project$Data$Session$loadClasses = A3(
	$author$project$Data$Session$loadToCache,
	A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.cZ;
		},
		$elm$core$List$isEmpty),
	$author$project$Api$getSchoolClasses,
	F2(
		function (newClasses, cache) {
			return _Utils_update(
				cache,
				{cZ: newClasses});
		}));
var $author$project$Page$Classes$init = function (session) {
	var handleLoadError = function (e) {
		return A2(
			$author$project$Page$Errored$pageLoadError,
			e,
			'Unable to load classes. ' + ($author$project$Util$defaultHttpErrorMsg(e) + '.'));
	};
	var createModel = function (sesh) {
		return _Utils_Tuple2(
			A2(
				$author$project$Page$Classes$Model,
				$billstclair$elm_sortable_table$Table$initialSort('Class Name'),
				$elm$core$Maybe$Nothing),
			sesh);
	};
	return A2(
		$elm$core$Task$map,
		createModel,
		A2(
			$elm$core$Task$mapError,
			handleLoadError,
			$author$project$Data$Session$loadClasses(session)));
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $wernerdegroot$listzipper$List$Zipper$current = function (_v0) {
	var x = _v0.b;
	return x;
};
var $author$project$List$Zipper$Infinite$current = $wernerdegroot$listzipper$List$Zipper$current;
var $elm$browser$Browser$Dom$getViewport = _Browser_withWindow(_Browser_getViewport);
var $author$project$Views$Story$init = function (width) {
	return _Utils_Tuple2(0, width);
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $author$project$Api$getDictionary = $elm$http$Http$request(
	{
		a: $elm$http$Http$emptyBody,
		b: $elm$http$Http$expectJson(
			$elm$json$Json$Decode$dict(
				$elm$json$Json$Decode$list(
					A3(
						$elm$json$Json$Decode$map2,
						$elm$core$Tuple$pair,
						A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string),
						A2(
							$elm$json$Json$Decode$index,
							1,
							$elm$json$Json$Decode$list($author$project$Api$decodeDictEntry)))))),
		c: _List_Nil,
		d: 'GET',
		e: $elm$core$Maybe$Nothing,
		f: $author$project$Api$apiUrl + '/dictionary',
		g: true
	});
var $author$project$Data$Session$loadDictionary = A3(
	$author$project$Data$Session$loadToCache,
	A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.bj;
		},
		$elm$core$Dict$isEmpty),
	function (_v0) {
		return $author$project$Api$getDictionary;
	},
	F2(
		function (newDict, cache) {
			return _Utils_update(
				cache,
				{bj: newDict});
		}));
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Page$Editor$makeTags = A2($elm$core$Basics$composeR, $elm$core$Set$fromList, $elm$core$Set$toList);
var $wernerdegroot$listzipper$List$Zipper$Zipper = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $wernerdegroot$listzipper$List$Zipper$next = function (_v0) {
	var ls = _v0.a;
	var x = _v0.b;
	var rs = _v0.c;
	if (!rs.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var y = rs.a;
		var ys = rs.b;
		return $elm$core$Maybe$Just(
			A3(
				$wernerdegroot$listzipper$List$Zipper$Zipper,
				A2($elm$core$List$cons, x, ls),
				y,
				ys));
	}
};
var $wernerdegroot$listzipper$List$Zipper$find = F2(
	function (predicate, zipper) {
		find:
		while (true) {
			var ls = zipper.a;
			var x = zipper.b;
			var rs = zipper.c;
			if (predicate(x)) {
				return $elm$core$Maybe$Just(zipper);
			} else {
				var _v0 = $wernerdegroot$listzipper$List$Zipper$next(zipper);
				if (!_v0.$) {
					var nextZipper = _v0.a;
					var $temp$predicate = predicate,
						$temp$zipper = nextZipper;
					predicate = $temp$predicate;
					zipper = $temp$zipper;
					continue find;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $wernerdegroot$listzipper$List$Zipper$first = function (zipper) {
	var ls = zipper.a;
	var x = zipper.b;
	var rs = zipper.c;
	var _v0 = $elm$core$List$reverse(ls);
	if (!_v0.b) {
		return zipper;
	} else {
		var y = _v0.a;
		var ys = _v0.b;
		return A3(
			$wernerdegroot$listzipper$List$Zipper$Zipper,
			_List_Nil,
			y,
			_Utils_ap(
				ys,
				_Utils_ap(
					_List_fromArray(
						[x]),
					rs)));
	}
};
var $wernerdegroot$listzipper$List$Zipper$findFirst = function (predicate) {
	return A2(
		$elm$core$Basics$composeL,
		$wernerdegroot$listzipper$List$Zipper$find(predicate),
		$wernerdegroot$listzipper$List$Zipper$first);
};
var $author$project$List$Zipper$Infinite$findFirst = $wernerdegroot$listzipper$List$Zipper$findFirst;
var $wernerdegroot$listzipper$List$Zipper$fromList = function (xs) {
	if (!xs.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var y = xs.a;
		var ys = xs.b;
		return $elm$core$Maybe$Just(
			A3($wernerdegroot$listzipper$List$Zipper$Zipper, _List_Nil, y, ys));
	}
};
var $author$project$List$Zipper$Infinite$fromList = $wernerdegroot$listzipper$List$Zipper$fromList;
var $author$project$Page$Editor$makeZipper = F2(
	function (stories, storyId) {
		return A2(
			$elm$core$Maybe$andThen,
			$author$project$List$Zipper$Infinite$findFirst(
				function (s) {
					return _Utils_eq(s.dl, storyId);
				}),
			$author$project$List$Zipper$Infinite$fromList(stories));
	});
var $sporto$elm_select$Select$PrivateState = $elm$core$Basics$identity;
var $sporto$elm_select$Select$Models$newState = function (id) {
	return {bY: $elm$core$Maybe$Nothing, dl: id, cg: $elm$core$Maybe$Nothing};
};
var $sporto$elm_select$Select$newState = function (id) {
	return $sporto$elm_select$Select$Models$newState(id);
};
var $elm$core$Basics$round = _Basics_round;
var $author$project$Page$Editor$init = F2(
	function (originalSession, slug) {
		var lookupStoryAndCreateModel = function (cache) {
			var _v0 = A2($author$project$Page$Editor$makeZipper, cache.a6, slug);
			if (!_v0.$) {
				var zipper = _v0.a;
				return A2(
					$elm$core$Task$map,
					function (_v1) {
						var viewport = _v1.eA;
						return {
							bc: $author$project$Page$Editor$makeTags(
								A2(
									$elm$core$List$concatMap,
									function ($) {
										return $.cC;
									},
									cache.a6)),
							aE: $sporto$elm_select$Select$newState('Curriculum'),
							bh: $author$project$Page$Editor$makeTags(
								A2(
									$elm$core$List$filterMap,
									function ($) {
										return $.bM;
									},
									cache.a6)),
							ai: _List_Nil,
							aL: $sporto$elm_select$Select$newState('Qualification'),
							br: $author$project$Page$Editor$makeTags(
								A2(
									$elm$core$List$filterMap,
									function ($) {
										return $.cf;
									},
									cache.a6)),
							a6: zipper,
							a7: $author$project$List$Zipper$Infinite$current(zipper),
							el: cache.el,
							aO: $author$project$Views$Story$init(
								$elm$core$Basics$round(viewport.eB)),
							aP: $sporto$elm_select$Select$newState('Tags')
						};
					},
					$elm$browser$Browser$Dom$getViewport);
			} else {
				return $elm$core$Task$fail(
					$author$project$Page$Errored$PageLoadError('Sorry. That story couldn\'t be found.'));
			}
		};
		var handleLoadError = function (e) {
			return A2(
				$author$project$Page$Errored$pageLoadError,
				e,
				'Story is currently unavailable. ' + $author$project$Util$defaultHttpErrorMsg(e));
		};
		return A2(
			$elm$core$Task$andThen,
			function (newSession) {
				return A2(
					$elm$core$Task$map,
					function (m) {
						return _Utils_Tuple2(m, newSession);
					},
					lookupStoryAndCreateModel(
						$author$project$Data$Session$getCache(newSession)));
			},
			A2(
				$elm$core$Task$mapError,
				handleLoadError,
				A2(
					$elm$core$Task$andThen,
					$author$project$Data$Session$loadStories,
					$author$project$Data$Session$loadDictionary(originalSession))));
	});
var $author$project$Page$FindStory$AllStories = {$: 0};
var $author$project$Page$FindStory$Table = {$: 1};
var $author$project$Page$FindStory$Tiles = function (a) {
	return {$: 0, a: a};
};
var $author$project$Tailwinds$breakpoints = {dB: 1024, dC: 768, eh: 640, eD: 1280};
var $billstclair$elm_sortable_table$Table$applySorter = F3(
	function (isReversed, sorter, data) {
		switch (sorter.$) {
			case 0:
				return data;
			case 1:
				var srt = sorter.a;
				return srt(data);
			case 2:
				var srt = sorter.a;
				return $elm$core$List$reverse(
					srt(data));
			case 3:
				var srt = sorter.a;
				return isReversed ? $elm$core$List$reverse(
					srt(data)) : srt(data);
			default:
				var srt = sorter.a;
				return isReversed ? srt(data) : $elm$core$List$reverse(
					srt(data));
		}
	});
var $billstclair$elm_sortable_table$Table$findSorter = F2(
	function (selectedColumn, columnData) {
		findSorter:
		while (true) {
			if (!columnData.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var name = columnData.a.a0;
				var sorter = columnData.a.ej;
				var remainingColumnData = columnData.b;
				if (_Utils_eq(name, selectedColumn)) {
					return $elm$core$Maybe$Just(sorter);
				} else {
					var $temp$selectedColumn = selectedColumn,
						$temp$columnData = remainingColumnData;
					selectedColumn = $temp$selectedColumn;
					columnData = $temp$columnData;
					continue findSorter;
				}
			}
		}
	});
var $billstclair$elm_sortable_table$Table$sort = F3(
	function (_v0, columnData, data) {
		var selectedColumn = _v0.a;
		var isReversed = _v0.b;
		var _v1 = A2($billstclair$elm_sortable_table$Table$findSorter, selectedColumn, columnData);
		if (_v1.$ === 1) {
			return data;
		} else {
			var sorter = _v1.a;
			return A3($billstclair$elm_sortable_table$Table$applySorter, isReversed, sorter, data);
		}
	});
var $billstclair$elm_sortable_table$Table$getSortedData = F3(
	function (_v0, state, data) {
		var toId = _v0.er;
		var toMsg = _v0.et;
		var columns = _v0.c2;
		var customizations = _v0.c3;
		return A3($billstclair$elm_sortable_table$Table$sort, state, columns, data);
	});
var $author$project$Data$Session$Student = {$: 0};
var $author$project$Data$Session$hasRole = F2(
	function (r, _v0) {
		var session = _v0;
		return A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				$elm$core$Basics$eq(r),
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.cm;
					},
					session.r)));
	});
var $author$project$Data$Session$isStudent = $author$project$Data$Session$hasRole($author$project$Data$Session$Student);
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $billstclair$elm_sortable_table$Table$HtmlDetails = F2(
	function (attributes, children) {
		return {aB: attributes, aC: children};
	});
var $author$project$Page$FindStory$SetTableState = function (a) {
	return {$: 3, a: a};
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $billstclair$elm_sortable_table$Table$Config = $elm$core$Basics$identity;
var $billstclair$elm_sortable_table$Table$customConfig = function (_v0) {
	var toId = _v0.er;
	var toMsg = _v0.et;
	var columns = _v0.c2;
	var customizations = _v0.c3;
	return {
		c2: A2(
			$elm$core$List$map,
			function (_v1) {
				var cData = _v1;
				return cData;
			},
			columns),
		c3: customizations,
		er: toId,
		et: toMsg
	};
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $billstclair$elm_sortable_table$Table$IncOrDec = function (a) {
	return {$: 3, a: a};
};
var $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy = function (toComparable) {
	return $billstclair$elm_sortable_table$Table$IncOrDec(
		$elm$core$List$sortBy(toComparable));
};
var $billstclair$elm_sortable_table$Table$Column = $elm$core$Basics$identity;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $billstclair$elm_sortable_table$Table$textDetails = function (str) {
	return A2(
		$billstclair$elm_sortable_table$Table$HtmlDetails,
		_List_Nil,
		_List_fromArray(
			[
				$elm$html$Html$text(str)
			]));
};
var $billstclair$elm_sortable_table$Table$stringColumn = F2(
	function (name, toStr) {
		return {
			a0: name,
			ej: $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy(toStr),
			ez: A2($elm$core$Basics$composeL, $billstclair$elm_sortable_table$Table$textDetails, toStr)
		};
	});
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $billstclair$elm_sortable_table$Table$simpleRowAttrs = function (_v0) {
	return _List_Nil;
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$String$fromList = _String_fromList;
var $billstclair$elm_sortable_table$Table$nbsp = $elm$core$String$fromList(
	_List_fromArray(
		[
			$elm$core$Char$fromCode(160)
		]));
var $elm$html$Html$span = _VirtualDom_node('span');
var $billstclair$elm_sortable_table$Table$darkGrey = function (symbol) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'color', '#555')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(
				_Utils_ap($billstclair$elm_sortable_table$Table$nbsp, symbol))
			]));
};
var $billstclair$elm_sortable_table$Table$lightGrey = function (symbol) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'color', '#ccc')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(
				_Utils_ap($billstclair$elm_sortable_table$Table$nbsp, symbol))
			]));
};
var $elm$html$Html$th = _VirtualDom_node('th');
var $billstclair$elm_sortable_table$Table$simpleTheadHelp = function (_v0) {
	var name = _v0.a;
	var status = _v0.b;
	var click = _v0.c;
	var content = function () {
		switch (status.$) {
			case 0:
				return _List_fromArray(
					[
						$elm$html$Html$text(name)
					]);
			case 1:
				var selected = status.a;
				return _List_fromArray(
					[
						$elm$html$Html$text(name),
						selected ? $billstclair$elm_sortable_table$Table$darkGrey('↓') : $billstclair$elm_sortable_table$Table$lightGrey('↓')
					]);
			default:
				if (status.a.$ === 1) {
					var _v2 = status.a;
					return _List_fromArray(
						[
							$elm$html$Html$text(name),
							$billstclair$elm_sortable_table$Table$lightGrey('↕')
						]);
				} else {
					var isReversed = status.a.a;
					return _List_fromArray(
						[
							$elm$html$Html$text(name),
							$billstclair$elm_sortable_table$Table$darkGrey(
							isReversed ? '↑' : '↓')
						]);
				}
		}
	}();
	return A2(
		$elm$html$Html$th,
		_List_fromArray(
			[click]),
		content);
};
var $billstclair$elm_sortable_table$Table$simpleThead = function (headers) {
	return A2(
		$billstclair$elm_sortable_table$Table$HtmlDetails,
		_List_Nil,
		A2($elm$core$List$map, $billstclair$elm_sortable_table$Table$simpleTheadHelp, headers));
};
var $billstclair$elm_sortable_table$Table$defaultCustomizations = {be: $elm$core$Maybe$Nothing, bt: $billstclair$elm_sortable_table$Table$simpleRowAttrs, eo: _List_Nil, bA: _List_Nil, bC: $elm$core$Maybe$Nothing, bD: $billstclair$elm_sortable_table$Table$simpleThead};
var $author$project$Bootstrap$c = $billstclair$elm_sortable_table$Table$defaultCustomizations;
var $author$project$Bootstrap$tableCustomizations = _Utils_update(
	$author$project$Bootstrap$c,
	{
		eo: _List_fromArray(
			[
				$elm$html$Html$Attributes$class('sortable-table')
			])
	});
var $billstclair$elm_sortable_table$Table$veryCustomColumn = $elm$core$Basics$identity;
var $author$project$Page$FindStory$BrowseFrom = function (a) {
	return {$: 4, a: a};
};
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $author$project$Components$link = F2(
	function (attrs, txt) {
		return A2(
			$elm$html$Html$a,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('text-blue-500 hover:text-blue-600 no-underline'),
				attrs),
			_List_fromArray(
				[
					$elm$html$Html$text(txt)
				]));
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Page$FindStory$viewStoryLink = function (s) {
	return A2(
		$author$project$Components$link,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$href('#'),
				$elm$html$Html$Events$onClick(
				$author$project$Page$FindStory$BrowseFrom(s.dl))
			]),
		s.cE);
};
var $author$project$Page$FindStory$tableConfig = function () {
	var titleColumnData = function (s) {
		return A2(
			$billstclair$elm_sortable_table$Table$HtmlDetails,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$Page$FindStory$viewStoryLink(s)
				]));
	};
	var tag = F2(
		function (i, s) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				$elm$core$List$head(
					A2($elm$core$List$drop, i - 1, s.cC)));
		});
	var storyTitleColumn = $billstclair$elm_sortable_table$Table$veryCustomColumn(
		{
			a0: 'Title',
			ej: $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy(
				function ($) {
					return $.cE;
				}),
			ez: titleColumnData
		});
	var levelColumn = $billstclair$elm_sortable_table$Table$veryCustomColumn(
		{
			a0: 'Level',
			ej: $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy(
				function ($) {
					return $.aF;
				}),
			ez: function (s) {
				return A2(
					$billstclair$elm_sortable_table$Table$HtmlDetails,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-center'),
							A2($elm$html$Html$Attributes$style, 'width', '5em')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(s.aF))
						]));
			}
		});
	return $billstclair$elm_sortable_table$Table$customConfig(
		{
			c2: _List_fromArray(
				[
					storyTitleColumn,
					A2(
					$billstclair$elm_sortable_table$Table$stringColumn,
					'General',
					tag(1)),
					A2(
					$billstclair$elm_sortable_table$Table$stringColumn,
					'BGE',
					A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$withDefault(''),
						function ($) {
							return $.bM;
						})),
					A2(
					$billstclair$elm_sortable_table$Table$stringColumn,
					'SQA',
					A2(
						$elm$core$Basics$composeL,
						$elm$core$Maybe$withDefault(''),
						function ($) {
							return $.cf;
						})),
					levelColumn
				]),
			c3: $author$project$Bootstrap$tableCustomizations,
			er: A2(
				$elm$core$Basics$composeL,
				$elm$core$String$fromInt,
				function ($) {
					return $.dl;
				}),
			et: $author$project$Page$FindStory$SetTableState
		});
}();
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Views$StoryTiles$tilesPerRow = function (width) {
	return (_Utils_cmp(width, $author$project$Tailwinds$breakpoints.dB) > -1) ? 5 : ((_Utils_cmp(width, $author$project$Tailwinds$breakpoints.dC) > -1) ? 4 : ((_Utils_cmp(width, $author$project$Tailwinds$breakpoints.eh) > -1) ? 3 : 2));
};
var $author$project$Views$StoryTiles$tilesPerPage = function (_v0) {
	var width = _v0.a;
	var height = _v0.b;
	var tileHeightIncMarginPx = (_Utils_cmp(width, $author$project$Tailwinds$breakpoints.dB) > -1) ? ((16 * 8) + 8) : ((16 * 10) + 8);
	return $author$project$Views$StoryTiles$tilesPerRow(width) * (((height / tileHeightIncMarginPx) | 0) + 1);
};
var $author$project$Page$FindStory$initialModel = F2(
	function (session, _v0) {
		var viewport = _v0.eA;
		var maxWidth = $author$project$Tailwinds$breakpoints.dB;
		var size = _Utils_Tuple2(
			A2(
				$elm$core$Basics$min,
				maxWidth,
				$elm$core$Basics$round(viewport.eB)),
			$elm$core$Basics$round(viewport.di));
		var _v1 = $author$project$Data$Session$isStudent(session) ? _Utils_Tuple2(
			$billstclair$elm_sortable_table$Table$initialSort(''),
			$author$project$Page$FindStory$Tiles(
				$author$project$Views$StoryTiles$tilesPerPage(size))) : _Utils_Tuple2(
			$billstclair$elm_sortable_table$Table$initialSort('Title'),
			$author$project$Page$FindStory$Table);
		var tableState = _v1.a;
		var viewType = _v1.b;
		var stories = A3(
			$billstclair$elm_sortable_table$Table$getSortedData,
			$author$project$Page$FindStory$tableConfig,
			tableState,
			$author$project$Data$Session$getCache(session).a6);
		return _Utils_Tuple2(
			{
				J: $elm$core$Maybe$Nothing,
				E: $elm$core$Maybe$Nothing,
				at: $author$project$Page$FindStory$AllStories,
				ai: _List_Nil,
				aN: false,
				a6: stories,
				ao: '',
				aO: $author$project$Views$Story$init(size.a),
				by: tableState,
				X: viewType,
				aV: size
			},
			session);
	});
var $author$project$Api$Anthology = F7(
	function (id, name, description, createdBy, schoolId, stories, hidden) {
		return {aX: createdBy, aY: description, a_: hidden, dl: id, a0: name, ab: schoolId, a6: stories};
	});
var $author$project$Api$decodeAnthology = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'hidden',
	$elm$json$Json$Decode$bool,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'stories',
		$elm$json$Json$Decode$list($elm$json$Json$Decode$int),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'school_id',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'created_by',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'description',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'name',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'id',
							$elm$json$Json$Decode$string,
							$elm$json$Json$Decode$succeed($author$project$Api$Anthology))))))));
var $author$project$Api$getAnthologies = function (header_Authorization) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$emptyBody,
			b: $elm$http$Http$expectJson(
				$elm$json$Json$Decode$list($author$project$Api$decodeAnthology)),
			c: A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						$elm$http$Http$header('Authorization'),
						$elm$core$Maybe$Just(header_Authorization))
					])),
			d: 'GET',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/anthologies',
			g: true
		});
};
var $author$project$Data$Session$loadAnthologies = A3(
	$author$project$Data$Session$loadToCache,
	A2(
		$elm$core$Basics$composeR,
		function ($) {
			return $.cR;
		},
		$elm$core$List$isEmpty),
	$author$project$Api$getAnthologies,
	F2(
		function (newAnthologies, cache) {
			return _Utils_update(
				cache,
				{cR: newAnthologies});
		}));
var $author$project$Page$FindStory$init = function (session) {
	var handleLoadError = function (e) {
		return A2(
			$author$project$Page$Errored$pageLoadError,
			e,
			'There was a problem loading the stories: ' + ($author$project$Util$defaultHttpErrorMsg(e) + '.'));
	};
	var loadData = A2(
		$elm$core$Task$mapError,
		handleLoadError,
		A2(
			$elm$core$Task$andThen,
			$author$project$Data$Session$loadAnthologies,
			A2(
				$elm$core$Task$andThen,
				$author$project$Data$Session$loadUserAnswers,
				$author$project$Data$Session$loadStories(session))));
	return A3($elm$core$Task$map2, $author$project$Page$FindStory$initialModel, loadData, $elm$browser$Browser$Dom$getViewport);
};
var $author$project$Page$Home$Model = F2(
	function (stories, myStories) {
		return {dL: myStories, a6: stories};
	});
var $author$project$Data$Session$currentTime = function (_v0) {
	var s = _v0;
	return s.ap;
};
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm_community$list_extra$List$Extra$groupWhile = F2(
	function (isSameGroup, items) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					if (!acc.b) {
						return _List_fromArray(
							[
								_Utils_Tuple2(x, _List_Nil)
							]);
					} else {
						var _v1 = acc.a;
						var y = _v1.a;
						var restOfGroup = _v1.b;
						var groups = acc.b;
						return A2(isSameGroup, x, y) ? A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								x,
								A2($elm$core$List$cons, y, restOfGroup)),
							groups) : A2(
							$elm$core$List$cons,
							_Utils_Tuple2(x, _List_Nil),
							acc);
					}
				}),
			_List_Nil,
			items);
	});
var $elm_community$list_extra$List$Extra$group = $elm_community$list_extra$List$Extra$groupWhile($elm$core$Basics$eq);
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Page$Home$answerLevels = F2(
	function (cache, answers) {
		var answersCompletedForLevel = function (_v0) {
			var l = _v0.b;
			return 1 + $elm$core$List$length(l);
		};
		var answerLevel = function (a) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.aF;
					},
					A2($author$project$Data$Session$findStoryById, cache, a.ct)));
		};
		return function (l) {
			return $elm$core$Dict$fromList(
				A3(
					$elm$core$List$map2,
					$elm$core$Tuple$pair,
					A2($elm$core$List$map, $elm$core$Tuple$first, l),
					A2($elm$core$List$map, answersCompletedForLevel, l)));
		}(
			$elm_community$list_extra$List$Extra$group(
				$elm$core$List$sort(
					A2(
						$elm$core$List$map,
						answerLevel,
						$elm$core$Dict$values(answers)))));
	});
var $author$project$Page$Home$bumpLevels = F2(
	function (answers, nPerLevel) {
		var nAnswers = function (l) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Dict$get, l, answers));
		};
		var bumpLevel = function (_v0) {
			var l = _v0.a;
			var n = _v0.b;
			return _Utils_Tuple2(
				l,
				A2(
					$elm$core$Basics$max,
					0,
					(n - nAnswers(l)) + nAnswers(l - 1)));
		};
		return A2($elm$core$List$map, bumpLevel, nPerLevel);
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $author$project$Page$Home$isBeginner = A2(
	$elm$core$Basics$composeL,
	A2(
		$elm$core$Basics$composeL,
		$elm$core$Basics$gt(20),
		$elm$core$Dict$size),
	function ($) {
		return $.cQ;
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $author$project$Page$Home$sortForLevel = F2(
	function (l, stories) {
		return A2(
			$elm$core$List$sortBy,
			function (s) {
				return $elm$core$Basics$abs(s.aF - l);
			},
			stories);
	});
var $author$project$Page$Home$pickStories = F3(
	function (cache, level, mixUp) {
		var takeLevel = F4(
			function (l, n, acc, ss) {
				takeLevel:
				while (true) {
					var _v0 = _Utils_Tuple2(n, ss);
					_v0$0:
					while (true) {
						if (!_v0.b.b) {
							if (!_v0.a) {
								break _v0$0;
							} else {
								return acc;
							}
						} else {
							if (!_v0.a) {
								break _v0$0;
							} else {
								var _v1 = _v0.b;
								var s = _v1.a;
								var rem = _v1.b;
								if (_Utils_eq(s.aF, l)) {
									var $temp$l = l,
										$temp$n = n - 1,
										$temp$acc = A2($elm$core$List$cons, s, acc),
										$temp$ss = rem;
									l = $temp$l;
									n = $temp$n;
									acc = $temp$acc;
									ss = $temp$ss;
									continue takeLevel;
								} else {
									var $temp$l = l,
										$temp$n = n,
										$temp$acc = acc,
										$temp$ss = rem;
									l = $temp$l;
									n = $temp$n;
									acc = $temp$acc;
									ss = $temp$ss;
									continue takeLevel;
								}
							}
						}
					}
					return acc;
				}
			});
		var storiesPerLevel = A2(
			$elm$core$List$indexedMap,
			$elm$core$Tuple$pair,
			function () {
				switch (level) {
					case 0:
						return _List_fromArray(
							[25, 5, 0, 0, 0, 0]);
					case 1:
						return _List_fromArray(
							[10, 15, 5, 0, 0, 0]);
					case 2:
						return _List_fromArray(
							[5, 10, 10, 5, 0, 0]);
					case 3:
						return _List_fromArray(
							[3, 3, 5, 10, 5, 0, 0]);
					case 4:
						return _List_fromArray(
							[2, 3, 3, 3, 10, 5, 0, 0]);
					case 5:
						return _List_fromArray(
							[2, 2, 2, 2, 5, 10, 5, 0]);
					case 6:
						return _List_fromArray(
							[2, 2, 2, 2, 5, 5, 10, 5, 0]);
					case 7:
						return _List_fromArray(
							[0, 2, 2, 2, 5, 5, 5, 10, 5, 0]);
					default:
						return _List_fromArray(
							[0, 0, 0, 2, 2, 5, 5, 5, 10, 5, 0]);
				}
			}());
		var stories = A2(
			$elm$core$List$filter,
			function (s) {
				return _Utils_cmp(s.aF, level + 2) < 0;
			},
			mixUp(cache.a6));
		var answers = cache.cQ;
		var unansweredStories = A2(
			$elm$core$List$filter,
			function (s) {
				return !A2($elm$core$Dict$member, s.dl, answers);
			},
			stories);
		return $author$project$Page$Home$isBeginner(cache) ? A2(
			$elm$core$List$concatMap,
			function (_v2) {
				var l = _v2.a;
				var n = _v2.b;
				return A4(takeLevel, l, n, _List_Nil, unansweredStories);
			},
			A2(
				$author$project$Page$Home$bumpLevels,
				A2($author$project$Page$Home$answerLevels, cache, answers),
				storiesPerLevel)) : A2($author$project$Page$Home$sortForLevel, level, unansweredStories);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Data$Session$userLevel = function (_v0) {
	var session = _v0;
	return A2(
		$elm$core$Maybe$map,
		function ($) {
			return $.aF;
		},
		session.r);
};
var $author$project$Page$Home$initModel = function (session) {
	var randomStart = function (stories) {
		return function (i) {
			return A2(
				$elm$core$List$append,
				A2($elm$core$List$drop, i, stories),
				A2($elm$core$List$take, i, stories));
		}(
			A2(
				$elm$core$Basics$modBy,
				$elm$core$List$length(stories),
				$elm$time$Time$posixToMillis(
					$author$project$Data$Session$currentTime(session))));
	};
	var cache = $author$project$Data$Session$getCache(session);
	var model = function () {
		var _v0 = $author$project$Data$Session$userLevel(session);
		if (!_v0.$) {
			var level = _v0.a;
			return A2(
				$author$project$Page$Home$Model,
				A3($author$project$Page$Home$pickStories, cache, level, randomStart),
				_List_Nil);
		} else {
			return A2($author$project$Page$Home$Model, cache.a6, _List_Nil);
		}
	}();
	return _Utils_Tuple2(model, session);
};
var $author$project$Page$Home$init = function (session) {
	var handleLoadError = function (e) {
		return A2(
			$author$project$Page$Errored$pageLoadError,
			e,
			'Couldn\'t load stories for the home page: ' + ($author$project$Util$defaultHttpErrorMsg(e) + '.'));
	};
	return A2(
		$elm$core$Task$mapError,
		handleLoadError,
		A2(
			$elm$core$Task$map,
			$author$project$Page$Home$initModel,
			A2(
				$elm$core$Task$andThen,
				$author$project$Data$Session$loadUserAnswers,
				$author$project$Data$Session$loadStories(session))));
};
var $author$project$Api$LeaderBoardEntry = F4(
	function (position, name, studentId, score) {
		return {a0: name, cb: position, cq: score, a9: studentId};
	});
var $author$project$Api$decodeLeaderBoardEntry = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'score',
	$elm$json$Json$Decode$int,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'student_id',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'position',
				$elm$json$Json$Decode$int,
				$elm$json$Json$Decode$succeed($author$project$Api$LeaderBoardEntry)))));
var $author$project$Api$getSchoolLeaderboard = function (header_Authorization) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$emptyBody,
			b: $elm$http$Http$expectJson(
				$elm$json$Json$Decode$list($author$project$Api$decodeLeaderBoardEntry)),
			c: A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						$elm$http$Http$header('Authorization'),
						$elm$core$Maybe$Just(header_Authorization))
					])),
			d: 'GET',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/school/leaderboard',
			g: true
		});
};
var $author$project$Page$LeaderBoard$init = function (session) {
	var handleLoadError = function (e) {
		return A2(
			$author$project$Page$Errored$pageLoadError,
			e,
			$author$project$Util$defaultHttpErrorMsg(e));
	};
	return A2(
		$elm$core$Task$mapError,
		handleLoadError,
		$elm$http$Http$toTask(
			$author$project$Api$getSchoolLeaderboard(
				$author$project$Data$Session$authorization(session))));
};
var $author$project$Page$Register$NotSent = 0;
var $author$project$Page$Register$init = {c1: $elm$core$Maybe$Nothing, aW: '', bR: '', ai: _List_Nil, a3: '', aa: $elm$core$Maybe$Nothing, cp: '', ek: 0, cD: ''};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $author$project$AnswersForm$init = function (s) {
	return {U: '', aD: $elm$core$Maybe$Nothing, M: '', ai: _List_Nil, aj: false, Q: '', aw: $elm$core$Maybe$Nothing, a7: s, S: ''};
};
var $author$project$Data$Session$Teacher = function (a) {
	return {$: 2, a: a};
};
var $author$project$Data$Session$isTeacher = function (session) {
	return A2(
		$author$project$Data$Session$hasRole,
		$author$project$Data$Session$Teacher(true),
		session) || A2(
		$author$project$Data$Session$hasRole,
		$author$project$Data$Session$Teacher(false),
		session);
};
var $author$project$Data$Session$subjectId = function (_v0) {
	var session = _v0;
	return A2(
		$elm$core$Maybe$map,
		function ($) {
			return $.cx;
		},
		session.r);
};
var $author$project$Page$Story$init = F2(
	function (originalSession, slug) {
		var user = $author$project$Data$Session$subjectId(originalSession);
		var handleLoadError = function (e) {
			return A2(
				$author$project$Page$Errored$pageLoadError,
				e,
				'Story is currently unavailable. ' + $author$project$Util$defaultHttpErrorMsg(e));
		};
		var lookupAnswers = F2(
			function (session, story) {
				return ($author$project$Data$Session$isStudent(session) || $author$project$Data$Session$isTeacher(session)) ? A2(
					$elm$core$Task$mapError,
					handleLoadError,
					$elm$http$Http$toTask(
						A3(
							$author$project$Api$getSchoolAnswers,
							$author$project$Data$Session$authorization(session),
							$elm$core$Maybe$Just(story.dl),
							$elm$core$Maybe$Nothing))) : $elm$core$Task$succeed(_List_Nil);
			});
		var createFormIfUnanswered = F3(
			function (story, answers, subId) {
				return ($author$project$Data$Session$isTeacher(originalSession) || A2(
					$elm$core$List$any,
					function (a) {
						return _Utils_eq(a.a9, subId);
					},
					answers)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
					$author$project$AnswersForm$init(story));
			});
		var mkAnswersForm = F2(
			function (story, answers) {
				return A2(
					$elm$core$Maybe$andThen,
					A2(createFormIfUnanswered, story, answers),
					user);
			});
		var lookupStoryAndCreateModel = function (session) {
			var _v0 = A2(
				$author$project$Data$Session$findStoryById,
				$author$project$Data$Session$getCache(session),
				slug);
			if (!_v0.$) {
				var story = _v0.a;
				return A3(
					$elm$core$Task$map2,
					F2(
						function (answers, _v1) {
							var viewport = _v1.eA;
							return _Utils_Tuple2(
								{
									cQ: answers,
									L: A2(mkAnswersForm, story, answers),
									aZ: $elm$core$Maybe$Nothing,
									a7: story,
									aO: $author$project$Views$Story$init(
										$elm$core$Basics$round(viewport.eB))
								},
								session);
						}),
					A2(lookupAnswers, session, story),
					$elm$browser$Browser$Dom$getViewport);
			} else {
				return A3(
					$elm$core$Basics$composeL,
					$elm$core$Task$fail,
					$author$project$Page$Errored$PageLoadError,
					'Sorry. That story couldn\'t be found.' + function () {
						if (!user.$) {
							return '';
						} else {
							return ' You probably need to sign in to see it.';
						}
					}());
			}
		};
		return A2(
			$elm$core$Task$andThen,
			lookupStoryAndCreateModel,
			A2(
				$elm$core$Task$mapError,
				handleLoadError,
				A2(
					$elm$core$Task$andThen,
					$author$project$Data$Session$loadStories,
					$author$project$Data$Session$loadDictionary(originalSession))));
	});
var $author$project$Page$Student$Model = F8(
	function (errors, student, answers, changePasswordForm, changeUsernameForm, showConfirmDelete, showTimer, userIsAdmin) {
		return {cQ: answers, ag: changePasswordForm, ah: changeUsernameForm, ai: errors, aM: showConfirmDelete, eg: showTimer, v: student, cI: userIsAdmin};
	});
var $author$project$Api$getSchoolStudentsByStudentId = F2(
	function (header_Authorization, capture_studentId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectJson($author$project$Api$decodeStudent),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'GET',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/students',
							$elm$url$Url$percentEncode(capture_studentId)
						])),
				g: true
			});
	});
var $author$project$Data$Session$isSchoolAdmin = $author$project$Data$Session$hasRole(
	$author$project$Data$Session$Teacher(true));
var $elm$core$Task$map3 = F4(
	function (func, taskA, taskB, taskC) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return A2(
							$elm$core$Task$andThen,
							function (c) {
								return $elm$core$Task$succeed(
									A3(func, a, b, c));
							},
							taskC);
					},
					taskB);
			},
			taskA);
	});
var $author$project$Page$Student$init = F2(
	function (session_, slug) {
		var zipWithStory = F2(
			function (cache, a) {
				return A2(
					$elm$core$Maybe$map,
					$elm$core$Tuple$pair(a),
					A2($author$project$Data$Session$findStoryById, cache, a.ct));
			});
		var mkModel = F3(
			function (newSession, student, answers) {
				return _Utils_Tuple2(
					A8(
						$author$project$Page$Student$Model,
						_List_Nil,
						student,
						A2(
							$elm$core$List$filterMap,
							zipWithStory(
								$author$project$Data$Session$getCache(newSession)),
							answers),
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Nothing,
						false,
						false,
						$author$project$Data$Session$isSchoolAdmin(newSession)),
					newSession);
			});
		var loadStudent = $elm$http$Http$toTask(
			A2(
				$author$project$Api$getSchoolStudentsByStudentId,
				$author$project$Data$Session$authorization(session_),
				slug));
		var loadAnswers = $elm$http$Http$toTask(
			A3(
				$author$project$Api$getSchoolAnswers,
				$author$project$Data$Session$authorization(session_),
				$elm$core$Maybe$Nothing,
				$elm$core$Maybe$Just(slug)));
		var handleLoadError = function (e) {
			return A2(
				$author$project$Page$Errored$pageLoadError,
				e,
				$author$project$Util$defaultHttpErrorMsg(e));
		};
		return A2(
			$elm$core$Task$mapError,
			handleLoadError,
			A4(
				$elm$core$Task$map3,
				mkModel,
				$author$project$Data$Session$loadStories(session_),
				loadStudent,
				loadAnswers));
	});
var $author$project$Page$Students$Model = F5(
	function (notification, tableState, selectedStudents, addStudentsForm, studentFilter) {
		return {af: addStudentsForm, aI: notification, an: selectedStudents, ac: studentFilter, by: tableState};
	});
var $author$project$Page$Students$NoMsg = {$: 2};
var $author$project$Page$Students$init = function (session) {
	var handleLoadError = function (e) {
		return A2(
			$author$project$Page$Errored$pageLoadError,
			e,
			'Unable to load student data. ' + ($author$project$Util$defaultHttpErrorMsg(e) + '.'));
	};
	var createModel = function (sesh) {
		return _Utils_Tuple2(
			A5(
				$author$project$Page$Students$Model,
				$author$project$Page$Students$NoMsg,
				$author$project$Views$StudentTable$init,
				$elm$core$Dict$empty,
				$elm$core$Maybe$Nothing,
				_Utils_Tuple2('', $elm$core$Maybe$Nothing)),
			sesh);
	};
	return A2(
		$elm$core$Task$map,
		createModel,
		A2(
			$elm$core$Task$mapError,
			handleLoadError,
			A2(
				$elm$core$Task$andThen,
				function (newSession) {
					return $author$project$Data$Session$loadClasses(newSession);
				},
				$author$project$Data$Session$loadStudents(session))));
};
var $author$project$Page$Teachers$Model = F3(
	function (tableState, registrationCode, teachers) {
		return {bs: registrationCode, by: tableState, ba: teachers};
	});
var $author$project$Api$Teacher = F4(
	function (id, name, bio, schoolId) {
		return {bG: bio, dl: id, a0: name, ab: schoolId};
	});
var $author$project$Api$decodeTeacher = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'school_id',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'bio',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$string),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'name',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				$elm$json$Json$Decode$string,
				$elm$json$Json$Decode$succeed($author$project$Api$Teacher)))));
var $author$project$Api$getSchoolTeachers = function (header_Authorization) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$emptyBody,
			b: $elm$http$Http$expectJson(
				$elm$json$Json$Decode$list(
					A3(
						$elm$json$Json$Decode$map2,
						$elm$core$Tuple$pair,
						A2($elm$json$Json$Decode$index, 0, $author$project$Api$decodeTeacher),
						A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$bool)))),
			c: A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						$elm$http$Http$header('Authorization'),
						$elm$core$Maybe$Just(header_Authorization))
					])),
			d: 'GET',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/school/teachers',
			g: true
		});
};
var $author$project$Page$Teachers$init = function (session) {
	var handleLoadError = function (e) {
		return A2(
			$author$project$Page$Errored$pageLoadError,
			e,
			'Unable to load teacher data. ' + ($author$project$Util$defaultHttpErrorMsg(e) + '.'));
	};
	var createModel = A2(
		$author$project$Page$Teachers$Model,
		$billstclair$elm_sortable_table$Table$initialSort('Name'),
		$elm$core$Maybe$Nothing);
	return A2(
		$elm$core$Task$map,
		createModel,
		A2(
			$elm$core$Task$mapError,
			handleLoadError,
			$elm$http$Http$toTask(
				$author$project$Api$getSchoolTeachers(
					$author$project$Data$Session$authorization(session)))));
};
var $author$project$Page$Login$Init = 0;
var $author$project$Page$Login$initialModel = {ai: _List_Nil, b8: $elm$core$Maybe$Nothing, av: false, a3: '', R: 0, bb: ''};
var $author$project$Data$Session$Editor = {$: 1};
var $author$project$Data$Session$isEditor = $author$project$Data$Session$hasRole($author$project$Data$Session$Editor);
var $author$project$Cache$Cache = F9(
	function (dict, stories, storyGraph, answers, students, classes, anthologies, newAccounts, selectedStories) {
		return {cQ: answers, cR: anthologies, cZ: classes, bj: dict, dN: newAccounts, ef: selectedStories, a6: stories, el: storyGraph, cv: students};
	});
var $elm_community$graph$Graph$empty = $elm_community$intdict$IntDict$empty;
var $author$project$StoryGraph$empty = $elm_community$graph$Graph$empty;
var $author$project$Cache$emptyCache = A9($author$project$Cache$Cache, $elm$core$Dict$empty, _List_Nil, $author$project$StoryGraph$empty, $elm$core$Dict$empty, _List_Nil, _List_Nil, _List_Nil, _List_Nil, _List_Nil);
var $author$project$Cache$clearCache = function (oldCache) {
	return function (c) {
		return _Utils_update(
			c,
			{bj: oldCache.bj});
	}($author$project$Cache$emptyCache);
};
var $author$project$Data$Session$logout = function (_v0) {
	var session = _v0;
	return _Utils_update(
		session,
		{
			s: $author$project$Cache$clearCache(session.s),
			r: $elm$core$Maybe$Nothing,
			w: _List_Nil
		});
};
var $elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
var $author$project$Route$routeToString = function (page) {
	var pieces = function () {
		switch (page.$) {
			case 0:
				return _List_Nil;
			case 1:
				return _List_fromArray(
					['login']);
			case 2:
				return _List_fromArray(
					['register']);
			case 3:
				return _List_fromArray(
					['logout']);
			case 4:
				return _List_fromArray(
					['account']);
			case 6:
				var slug = page.a;
				return _List_fromArray(
					[
						'stories',
						$elm$core$String$fromInt(slug)
					]);
			case 5:
				return _List_fromArray(
					['stories']);
			case 7:
				return _List_fromArray(
					['leaderboard']);
			case 9:
				switch (page.a.$) {
					case 0:
						var _v1 = page.a;
						return _List_fromArray(
							['teacher', 'students']);
					case 1:
						var _v2 = page.a;
						return _List_fromArray(
							['teacher', 'classes']);
					case 2:
						var _v3 = page.a;
						return _List_fromArray(
							['teacher', 'teachers']);
					case 3:
						var slug = page.a.a;
						return _List_fromArray(
							['teacher', 'students', slug]);
					default:
						var slug = page.a.a;
						return _List_fromArray(
							['teacher', 'classes', slug]);
				}
			case 8:
				return _List_fromArray(
					['trails']);
			default:
				var slug = page.a;
				return _List_fromArray(
					[
						'editor',
						$elm$core$String$fromInt(slug)
					]);
		}
	}();
	return '#/' + A2($elm$core$String$join, '/', pieces);
};
var $author$project$Route$modifyUrl = F2(
	function (key, route) {
		return A2(
			$elm$browser$Browser$Navigation$replaceUrl,
			key,
			$author$project$Route$routeToString(route));
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$Errored = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$pageErrored = F2(
	function (model, errorMessage) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					m: $author$project$Main$Loaded(
						$author$project$Main$Errored(
							$author$project$Page$Errored$PageLoadError(errorMessage)))
				}),
			$elm$core$Platform$Cmd$none);
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Data$Settings$encode = function (s) {
	var displaySettings = _List_fromArray(
		[
			_Utils_Tuple2(
			'background',
			$elm$json$Json$Encode$string(s.bd)),
			_Utils_Tuple2(
			'colour',
			$elm$json$Json$Encode$string(s.bg)),
			_Utils_Tuple2(
			'font',
			$elm$json$Json$Encode$string(s.bk)),
			_Utils_Tuple2(
			'size',
			$elm$json$Json$Encode$string(s.bv))
		]);
	return $elm$json$Json$Encode$object(
		$elm$core$List$isEmpty(s.w) ? displaySettings : A2(
			$elm$core$List$cons,
			_Utils_Tuple2(
				'workQueue',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, s.w)),
			displaySettings));
};
var $author$project$Data$Session$encodeAccessToken = function (_v0) {
	var t = _v0;
	return $elm$json$Json$Encode$string(t);
};
var $author$project$Data$Session$encodeRole = function (r) {
	return $elm$json$Json$Encode$string(
		function () {
			switch (r.$) {
				case 0:
					return 'Student';
				case 2:
					if (!r.a) {
						return 'Teacher';
					} else {
						return 'SchoolAdmin';
					}
				default:
					return 'Editor';
			}
		}());
};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Data$Session$encodeUser = function (user) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(user.a0)),
				_Utils_Tuple2(
				'sub',
				$elm$json$Json$Encode$string(user.cx)),
				_Utils_Tuple2(
				'role',
				$author$project$Data$Session$encodeRole(user.cm)),
				_Utils_Tuple2(
				'level',
				$elm$json$Json$Encode$int(user.aF)),
				_Utils_Tuple2(
				'token',
				$author$project$Data$Session$encodeAccessToken(user.cG)),
				_Utils_Tuple2(
				'settings',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $author$project$Data$Settings$encode, user.cs)))
			]));
};
var $elm$core$Maybe$destruct = F3(
	function (_default, func, maybe) {
		if (!maybe.$) {
			var a = maybe.a;
			return func(a);
		} else {
			return _default;
		}
	});
var $author$project$Ports$storeSession = _Platform_outgoingPort(
	'storeSession',
	function ($) {
		return A3($elm$core$Maybe$destruct, $elm$json$Json$Encode$null, $elm$json$Json$Encode$string, $);
	});
var $author$project$Data$Session$storeSession = function (_v0) {
	var session = _v0;
	return $author$project$Ports$storeSession(
		$elm$core$Maybe$Just(
			A2(
				$elm$json$Json$Encode$encode,
				0,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$string(''),
					A2($elm$core$Maybe$map, $author$project$Data$Session$encodeUser, session.r)))));
};
var $author$project$Main$changeRouteTo = F2(
	function (maybeRoute, model) {
		var transition = F2(
			function (toMsg, task) {
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: $author$project$Main$TransitioningFrom(
								$author$project$Main$getPage(model.m))
						}),
					A2(
						$elm$core$Task$attempt,
						A2($elm$core$Basics$composeL, $author$project$Main$PageLoaded, toMsg),
						task));
			});
		var session = model.k;
		var teacherRoute = function (subRoute) {
			switch (subRoute.$) {
				case 0:
					return A2(
						transition,
						$author$project$Main$StudentsLoaded,
						$author$project$Page$Students$init(session));
				case 1:
					return A2(
						transition,
						$author$project$Main$ClassesLoaded,
						$author$project$Page$Classes$init(session));
				case 2:
					return A2(
						transition,
						$author$project$Main$TeachersLoaded,
						$author$project$Page$Teachers$init(session));
				case 3:
					var slug = subRoute.a;
					return A2(
						transition,
						$author$project$Main$StudentLoaded,
						A2($author$project$Page$Student$init, session, slug));
				default:
					var slug = subRoute.a;
					return A2(
						transition,
						$author$project$Main$ClassLoaded,
						A2($author$project$Page$Class$init, session, slug));
			}
		};
		var errored = $author$project$Main$pageErrored(model);
		var requireRole = F2(
			function (hasRole, transition_) {
				var _v9 = $author$project$Data$Session$subjectId(session);
				if (_v9.$ === 1) {
					return errored('You are signed out. You need to sign-in to view this page.');
				} else {
					return hasRole(session) ? transition_ : errored('You can\'t view this page as the current user. Perhaps you need to log in as a teacher?');
				}
			});
		if (maybeRoute.$ === 1) {
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{
						m: $author$project$Main$Loaded($author$project$Main$NotFound)
					}),
				$elm$core$Platform$Cmd$none);
		} else {
			switch (maybeRoute.a.$) {
				case 0:
					var _v1 = maybeRoute.a;
					return A2(
						transition,
						$author$project$Main$HomeLoaded,
						$author$project$Page$Home$init(session));
				case 6:
					var slug = maybeRoute.a.a;
					return A2(
						transition,
						$author$project$Main$StoryLoaded,
						A2($author$project$Page$Story$init, session, slug));
				case 10:
					var slug = maybeRoute.a.a;
					return A2(
						requireRole,
						$author$project$Data$Session$isEditor,
						A2(
							transition,
							$author$project$Main$EditorLoaded,
							A2($author$project$Page$Editor$init, session, slug)));
				case 1:
					var _v2 = maybeRoute.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								m: $author$project$Main$Loaded(
									$author$project$Main$Login($author$project$Page$Login$initialModel))
							}),
						$elm$core$Platform$Cmd$none);
				case 3:
					var _v3 = maybeRoute.a;
					var s = $author$project$Data$Session$logout(session);
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{k: s}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Data$Session$storeSession(s),
									A2($author$project$Route$modifyUrl, model.aH, $author$project$Route$Login)
								])));
				case 5:
					var _v4 = maybeRoute.a;
					return A2(
						transition,
						$author$project$Main$FindStoryLoaded,
						$author$project$Page$FindStory$init(session));
				case 9:
					var subRoute = maybeRoute.a.a;
					return A2(
						requireRole,
						$author$project$Data$Session$isTeacher,
						teacherRoute(subRoute));
				case 7:
					var _v5 = maybeRoute.a;
					return A2(
						transition,
						$author$project$Main$LeaderBoardLoaded,
						$author$project$Page$LeaderBoard$init(session));
				case 4:
					var _v6 = maybeRoute.a;
					return A2(
						transition,
						$author$project$Main$AccountLoaded,
						$author$project$Page$Account$init(session));
				case 2:
					var _v7 = maybeRoute.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								m: $author$project$Main$Loaded(
									$author$project$Main$Register($author$project$Page$Register$init))
							}),
						$elm$core$Platform$Cmd$none);
				default:
					var _v8 = maybeRoute.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}
		}
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (pathDecoder, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2($elm$json$Json$Decode$decodeValue, pathDecoder, input);
			if (!_v0.$) {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_v1.$) {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					var finalErr = _v1.a;
					return $elm$json$Json$Decode$fail(
						$elm$json$Json$Decode$errorToString(finalErr));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$value),
				valDecoder,
				fallback),
			decoder);
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Data$Session$User = F6(
	function (name, sub, role, level, token, settings) {
		return {aF: level, a0: name, cm: role, cs: settings, cx: sub, cG: token};
	});
var $author$project$Data$Session$AccessToken = $elm$core$Basics$identity;
var $author$project$Data$Session$accessTokenDecoder = A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $elm$json$Json$Decode$string);
var $author$project$Data$Settings$decoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'workQueue',
	$elm$json$Json$Decode$list($elm$json$Json$Decode$int),
	_List_Nil,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'size',
		$elm$json$Json$Decode$string,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'font',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'colour',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'background',
					$elm$json$Json$Decode$string,
					$elm$json$Json$Decode$succeed($author$project$Data$Settings$Settings))))));
var $author$project$Data$Session$stringToRole = function (s) {
	switch (s) {
		case 'Teacher':
			return $author$project$Data$Session$Teacher(false);
		case 'SchoolAdmin':
			return $author$project$Data$Session$Teacher(true);
		case 'Editor':
			return $author$project$Data$Session$Editor;
		default:
			return $author$project$Data$Session$Student;
	}
};
var $author$project$Data$Session$roleDecoder = A2($elm$json$Json$Decode$map, $author$project$Data$Session$stringToRole, $elm$json$Json$Decode$string);
var $author$project$Data$Session$userDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'settings',
	$elm$json$Json$Decode$nullable($author$project$Data$Settings$decoder),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'token',
		$author$project$Data$Session$accessTokenDecoder,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'level',
			$elm$json$Json$Decode$int,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'role',
				$author$project$Data$Session$roleDecoder,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'sub',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'name',
						$elm$json$Json$Decode$string,
						$elm$json$Json$Decode$succeed($author$project$Data$Session$User)))))));
var $author$project$Data$Session$decodeSession = function (json) {
	var mkSession = F2(
		function (ua, session) {
			var user = $elm$core$Result$toMaybe(
				A2($elm$json$Json$Decode$decodeString, $author$project$Data$Session$userDecoder, session));
			return {
				T: _List_Nil,
				s: $author$project$Cache$emptyCache,
				ap: $elm$time$Time$millisToPosix(0),
				cH: ua,
				r: user,
				w: _List_Nil
			};
		});
	var decoder = A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'session',
		$elm$json$Json$Decode$string,
		'',
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'ua',
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$succeed(mkSession)));
	return A2(
		$elm$core$Maybe$withDefault,
		A2(mkSession, '', ''),
		$elm$core$Result$toMaybe(
			A2($elm$json$Json$Decode$decodeValue, decoder, json)));
};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {ak: frag, al: params, ad: unvisited, W: value, aq: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.ad;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.W);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.W);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.d8),
					$elm$url$Url$Parser$prepareQuery(url.cg),
					url.df,
					$elm$core$Basics$identity)));
	});
var $author$project$Route$Account = {$: 4};
var $author$project$Route$Editor = function (a) {
	return {$: 10, a: a};
};
var $author$project$Route$FindStory = {$: 5};
var $author$project$Route$Home = {$: 0};
var $author$project$Route$LeaderBoard = {$: 7};
var $author$project$Route$Logout = {$: 3};
var $author$project$Route$Register = {$: 2};
var $author$project$Route$Story = function (a) {
	return {$: 6, a: a};
};
var $author$project$Route$Teacher = function (a) {
	return {$: 9, a: a};
};
var $author$project$Route$Trails = {$: 8};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_v0) {
			var visited = _v0.aq;
			var unvisited = _v0.ad;
			var params = _v0.al;
			var frag = _v0.ak;
			var value = _v0.W;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _v2 = stringToSomething(next);
				if (!_v2.$) {
					var nextValue = _v2.a;
					return _List_fromArray(
						[
							A5(
							$elm$url$Url$Parser$State,
							A2($elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var $elm$url$Url$Parser$int = A2($elm$url$Url$Parser$custom, 'NUMBER', $elm$core$String$toInt);
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.aq;
		var unvisited = _v0.ad;
		var params = _v0.al;
		var frag = _v0.ak;
		var value = _v0.W;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.aq;
			var unvisited = _v1.ad;
			var params = _v1.al;
			var frag = _v1.ak;
			var value = _v1.W;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.aq;
		var unvisited = _v0.ad;
		var params = _v0.al;
		var frag = _v0.ak;
		var value = _v0.W;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $author$project$Route$Class = function (a) {
	return {$: 4, a: a};
};
var $author$project$Route$Classes = {$: 1};
var $author$project$Route$Student = function (a) {
	return {$: 3, a: a};
};
var $author$project$Route$Students = {$: 0};
var $author$project$Route$Teachers = {$: 2};
var $elm$url$Url$Parser$string = A2($elm$url$Url$Parser$custom, 'STRING', $elm$core$Maybe$Just);
var $author$project$Route$teacherSubRoute = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Student,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('students'),
				$elm$url$Url$Parser$string)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Students,
			$elm$url$Url$Parser$s('students')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Class,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('classes'),
				$elm$url$Url$Parser$string)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Classes,
			$elm$url$Url$Parser$s('classes')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Teachers,
			$elm$url$Url$Parser$s('teachers'))
		]));
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Route$parser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, $author$project$Route$Home, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Login,
			$elm$url$Url$Parser$s('login')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Register,
			$elm$url$Url$Parser$s('register')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Logout,
			$elm$url$Url$Parser$s('logout')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Account,
			$elm$url$Url$Parser$s('account')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Story,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('stories'),
				$elm$url$Url$Parser$int)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$FindStory,
			$elm$url$Url$Parser$s('stories')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Trails,
			$elm$url$Url$Parser$s('trails')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Teacher,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('teacher'),
				$author$project$Route$teacherSubRoute)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$LeaderBoard,
			$elm$url$Url$Parser$s('leaderboard')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$Route$Editor,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('editor'),
				$elm$url$Url$Parser$int))
		]));
var $author$project$Route$fromUrl = function (url) {
	return A2(
		$elm$url$Url$Parser$parse,
		$author$project$Route$parser,
		_Utils_update(
			url,
			{
				df: $elm$core$Maybe$Nothing,
				d8: A2($elm$core$Maybe$withDefault, '', url.df)
			}));
};
var $author$project$Main$init = F3(
	function (value, url, navKey) {
		return A2(
			$author$project$Main$changeRouteTo,
			$author$project$Route$fromUrl(url),
			{
				aH: navKey,
				m: $author$project$Main$Loaded($author$project$Main$Blank),
				k: $author$project$Data$Session$decodeSession(value)
			});
	});
var $author$project$Main$PageMsg = function (a) {
	return {$: 4, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Main$EditorMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$FindStoryMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$StoryMsg = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Page$Editor$StoryViewMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Views$Story$ImageWidth = function (a) {
	return {$: 1, a: a};
};
var $author$project$Views$Story$Resize = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $author$project$Ports$imgWidth = _Platform_incomingPort('imgWidth', $elm$json$Json$Decode$float);
var $elm$browser$Browser$Events$Window = 1;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {b9: pids, cz: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {bU: event, b0: key};
	});
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.b9,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.b0;
		var event = _v0.bU;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.cz);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$onResize = function (func) {
	return A3(
		$elm$browser$Browser$Events$on,
		1,
		'resize',
		A2(
			$elm$json$Json$Decode$field,
			'target',
			A3(
				$elm$json$Json$Decode$map2,
				func,
				A2($elm$json$Json$Decode$field, 'innerWidth', $elm$json$Json$Decode$int),
				A2($elm$json$Json$Decode$field, 'innerHeight', $elm$json$Json$Decode$int))));
};
var $author$project$Views$Story$subscriptions = $elm$core$Platform$Sub$batch(
	_List_fromArray(
		[
			$author$project$Ports$imgWidth($author$project$Views$Story$ImageWidth),
			$elm$browser$Browser$Events$onResize($author$project$Views$Story$Resize)
		]));
var $author$project$Page$Editor$subscriptions = function (model) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$core$Platform$Sub$map, $author$project$Page$Editor$StoryViewMsg, $author$project$Views$Story$subscriptions)
			]));
};
var $author$project$Page$FindStory$Resize = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $author$project$Page$FindStory$Scroll = function (a) {
	return {$: 9, a: a};
};
var $author$project$Page$FindStory$StoryViewMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Ports$lastEltVisible = _Platform_incomingPort('lastEltVisible', $elm$json$Json$Decode$bool);
var $author$project$Ports$scroll = _Platform_incomingPort('scroll', $elm$json$Json$Decode$bool);
var $author$project$Page$FindStory$subscriptions = function (m) {
	var _v0 = m.E;
	if (_v0.$ === 1) {
		var _v1 = m.X;
		if (!_v1.$) {
			return $elm$core$Platform$Sub$batch(
				_List_fromArray(
					[
						$elm$browser$Browser$Events$onResize($author$project$Page$FindStory$Resize),
						$author$project$Ports$scroll($author$project$Page$FindStory$Scroll),
						$author$project$Ports$lastEltVisible($author$project$Page$FindStory$Scroll)
					]));
		} else {
			return $elm$core$Platform$Sub$none;
		}
	} else {
		return A2($elm$core$Platform$Sub$map, $author$project$Page$FindStory$StoryViewMsg, $author$project$Views$Story$subscriptions);
	}
};
var $author$project$Page$Story$DictLookup = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Story$StoryViewMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Ports$dictLookup = _Platform_incomingPort(
	'dictLookup',
	A2(
		$elm$json$Json$Decode$andThen,
		function (_v0) {
			return A2(
				$elm$json$Json$Decode$andThen,
				function (_v1) {
					return $elm$json$Json$Decode$succeed(
						_Utils_Tuple2(_v0, _v1));
				},
				A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$int));
		},
		A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string)));
var $author$project$Page$Story$subscriptions = $elm$core$Platform$Sub$batch(
	_List_fromArray(
		[
			A2($elm$core$Platform$Sub$map, $author$project$Page$Story$StoryViewMsg, $author$project$Views$Story$subscriptions),
			$author$project$Ports$dictLookup($author$project$Page$Story$DictLookup)
		]));
var $author$project$Main$pageSubscriptions = function (page) {
	switch (page.$) {
		case 5:
			return A2($elm$core$Platform$Sub$map, $author$project$Main$StoryMsg, $author$project$Page$Story$subscriptions);
		case 11:
			var subModel = page.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$EditorMsg,
				$author$project$Page$Editor$subscriptions(subModel));
		case 6:
			var subModel = page.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$FindStoryMsg,
				$author$project$Page$FindStory$subscriptions(subModel));
		default:
			return $elm$core$Platform$Sub$none;
	}
};
var $author$project$Main$Tick = function (a) {
	return {$: 8, a: a};
};
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {cd: processes, cB: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.cd;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.cB);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $author$project$Data$Session$getAlerts = function (_v0) {
	var session = _v0;
	return session.T;
};
var $author$project$Main$sessionSubscriptions = function (s) {
	var _v0 = $author$project$Data$Session$getAlerts(s);
	if (!_v0.b) {
		return $elm$core$Platform$Sub$none;
	} else {
		return A2($elm$time$Time$every, 1000, $author$project$Main$Tick);
	}
};
var $author$project$Main$subscriptions = function (m) {
	return function (s) {
		return $elm$core$Platform$Sub$batch(
			_List_fromArray(
				[
					s,
					$author$project$Main$sessionSubscriptions(m.k)
				]));
	}(
		A2(
			$elm$core$Platform$Sub$map,
			$author$project$Main$PageMsg,
			$author$project$Main$pageSubscriptions(
				$author$project$Main$getPage(m.m))));
};
var $author$project$Main$SaveWorkQueueResponse = function (a) {
	return {$: 7, a: a};
};
var $author$project$Data$Session$clearWorkQueue = function (_v0) {
	var session = _v0;
	return _Utils_update(
		session,
		{w: _List_Nil});
};
var $author$project$Data$Session$closeAlert = F2(
	function (a, _v0) {
		var session = _v0;
		return _Utils_update(
			session,
			{
				T: A2(
					$elm$core$List$map,
					function (_v1) {
						var a_ = _v1.a;
						var closed = _v1.b;
						return _Utils_eq(a_, a) ? _Utils_Tuple2(a_, true) : _Utils_Tuple2(a_, closed);
					},
					session.T)
			});
	});
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $author$project$Main$Account = function (a) {
	return {$: 13, a: a};
};
var $author$project$Main$Class = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$Classes = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$Editor = function (a) {
	return {$: 11, a: a};
};
var $author$project$Main$FindStory = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$Home = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$LeaderBoard = function (a) {
	return {$: 12, a: a};
};
var $author$project$Main$Story = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$Student = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$Students = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$Teachers = function (a) {
	return {$: 15, a: a};
};
var $author$project$Ports$postProcessStory = _Platform_outgoingPort(
	'postProcessStory',
	$elm$json$Json$Encode$list(
		function ($) {
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'index',
						$elm$json$Json$Encode$int($.b$)),
						_Utils_Tuple2(
						'word',
						$elm$json$Json$Encode$string($.cK))
					]));
		}));
var $author$project$Main$pageLoaded = F2(
	function (msg, model) {
		var handlePageLoadError = F2(
			function (result, f) {
				if (!result.$) {
					var a = result.a;
					return f(a);
				} else {
					if (result.a.$ === 1) {
						var _v4 = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									m: $author$project$Main$Loaded(
										$author$project$Main$Errored($author$project$Page$Errored$AuthenticationRequired)),
									k: $author$project$Data$Session$logout(model.k)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var error = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									m: $author$project$Main$Loaded(
										$author$project$Main$Errored(error))
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			});
		var pageLoadedWithNewSession = F2(
			function (r, toModel) {
				return A2(
					handlePageLoadError,
					r,
					function (_v2) {
						var subModel = _v2.a;
						var newSession = _v2.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									m: $author$project$Main$Loaded(
										toModel(subModel)),
									k: newSession
								}),
							A2($elm$core$Task$perform, $author$project$Main$Tick, $elm$time$Time$now));
					});
			});
		switch (msg.$) {
			case 1:
				var r = msg.a;
				return A2(
					handlePageLoadError,
					r,
					function (_v1) {
						var subModel = _v1.a;
						var newSession = _v1.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									m: $author$project$Main$Loaded(
										$author$project$Main$Story(subModel)),
									k: newSession
								}),
							$author$project$Ports$postProcessStory(
								function ($) {
									return $.cL;
								}(subModel.a7)));
					});
			case 0:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$Home);
			case 8:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$Editor);
			case 2:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$FindStory);
			case 3:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$Students);
			case 5:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$Student);
			case 6:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$Classes);
			case 7:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$Class);
			case 10:
				var r = msg.a;
				return A2(
					handlePageLoadError,
					r,
					function (subModel) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									m: $author$project$Main$Loaded(
										$author$project$Main$LeaderBoard(subModel))
								}),
							$elm$core$Platform$Cmd$none);
					});
			case 9:
				var r = msg.a;
				return A2(pageLoadedWithNewSession, r, $author$project$Main$Account);
			default:
				var r = msg.a;
				return A2(
					handlePageLoadError,
					r,
					function (subModel) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									m: $author$project$Main$Loaded(
										$author$project$Main$Teachers(subModel))
								}),
							$elm$core$Platform$Cmd$none);
					});
		}
	});
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Api$NoContent = 0;
var $elm$http$Http$Internal$StringBody = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		$elm$http$Http$Internal$StringBody,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $author$project$Api$postAccountSettings = F2(
	function (header_Authorization, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$elm$core$Basics$identity(body)),
				b: $elm$http$Http$expectStringResponse(
					function (res) {
						return $elm$core$String$isEmpty(res.a) ? $elm$core$Result$Ok(0) : $elm$core$Result$Err('Expected the response body to be empty');
					}),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: $author$project$Api$apiUrl + '/account/settings',
				g: true
			});
	});
var $elm$http$Http$send = F2(
	function (resultToMessage, request_) {
		return A2(
			$elm$core$Task$attempt,
			resultToMessage,
			$elm$http$Http$toTask(request_));
	});
var $author$project$Data$Session$saveWorkQueue = F2(
	function (toMsg, sesh) {
		var session = sesh;
		var newSettings = function (s) {
			return _Utils_update(
				s,
				{
					w: A2(
						$elm$core$List$map,
						function ($) {
							return $.dl;
						},
						session.w)
				});
		}(
			A2(
				$elm$core$Maybe$withDefault,
				$author$project$Data$Settings$defaultSettings,
				A2(
					$elm$core$Maybe$andThen,
					function ($) {
						return $.cs;
					},
					session.r)));
		var newUser = A2(
			$elm$core$Maybe$map,
			function (u) {
				return _Utils_update(
					u,
					{
						cs: $elm$core$Maybe$Just(newSettings)
					});
			},
			session.r);
		var newSession = _Utils_update(
			session,
			{r: newUser});
		var save = $elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					$author$project$Data$Session$storeSession(newSession),
					A2(
					$elm$http$Http$send,
					toMsg,
					A2(
						$author$project$Api$postAccountSettings,
						$author$project$Data$Session$authorization(sesh),
						$author$project$Data$Settings$encode(newSettings)))
				]));
		return _Utils_Tuple2(save, newSession);
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Data$Session$tick = F2(
	function (_v0, t) {
		var session = _v0;
		var interval = $elm$time$Time$posixToMillis(t) - $elm$time$Time$posixToMillis(session.ap);
		var closeUnlessError = function (_v3) {
			var a = _v3.a;
			var c = _v3.b;
			if (!a.$) {
				return _Utils_Tuple2(a, true);
			} else {
				return _Utils_Tuple2(a, c);
			}
		};
		var alerts = A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$Tuple$second),
			session.T);
		var _v1 = (interval < 3000) ? _Utils_Tuple2(alerts, session.ap) : _Utils_Tuple2(
			A2($elm$core$List$map, closeUnlessError, alerts),
			t);
		var newAlerts = _v1.a;
		var newTick = _v1.b;
		return _Utils_update(
			session,
			{T: newAlerts, ap: newTick});
	});
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.ce;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.df,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.cg,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.ca,
					_Utils_ap(http, url.bZ)),
				url.d8)));
};
var $author$project$Main$AccountMsg = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$ClassMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$ClassesMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$LoginMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Api$LoginRequest = F4(
	function (username, password, otp, ua) {
		return {b8: otp, a3: password, cH: ua, bb: username};
	});
var $author$project$Main$RegisterMsg = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$StudentMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$StudentsMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$TeachersMsg = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$chooseStartPage = F2(
	function (navKey, session) {
		return A2(
			$author$project$Route$modifyUrl,
			navKey,
			$author$project$Data$Session$isTeacher(session) ? $author$project$Route$Teacher($author$project$Route$Students) : $author$project$Route$Home);
	});
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Data$Session$newLogin = F2(
	function (_v0, _v1) {
		var s = _v0;
		var sub = _v1.cx;
		var name = _v1.a0;
		var level = _v1.aF;
		var token = _v1.cG;
		var role = _v1.cm;
		var settings = _v1.cs;
		var userSettings = A2(
			$elm$core$Maybe$andThen,
			A2(
				$elm$core$Basics$composeL,
				$elm$core$Result$toMaybe,
				$elm$json$Json$Decode$decodeValue($author$project$Data$Settings$decoder)),
			settings);
		var userRole = $author$project$Data$Session$stringToRole(role.cJ);
		var user = A6($author$project$Data$Session$User, name, sub, userRole, level, token, userSettings);
		return {
			T: _List_Nil,
			s: $author$project$Cache$clearCache(s.s),
			ap: s.ap,
			cH: s.cH,
			r: $elm$core$Maybe$Just(user),
			w: _List_Nil
		};
	});
var $author$project$Api$Login = F7(
	function (sub, username, name, role, level, settings, token) {
		return {aF: level, a0: name, cm: role, cs: settings, cx: sub, cG: token, bb: username};
	});
var $author$project$Api$UserType = function (userType) {
	return {cJ: userType};
};
var $author$project$Api$decodeUserType = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'user_type',
	$elm$json$Json$Decode$string,
	$elm$json$Json$Decode$succeed($author$project$Api$UserType));
var $author$project$Api$decodeLogin = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'token',
	$elm$json$Json$Decode$string,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'settings',
		$elm$json$Json$Decode$nullable($elm$json$Json$Decode$value),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'level',
			$elm$json$Json$Decode$int,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'role',
				$author$project$Api$decodeUserType,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'name',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'username',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'sub',
							$elm$json$Json$Decode$string,
							$elm$json$Json$Decode$succeed($author$project$Api$Login))))))));
var $author$project$Api$encodeLoginRequest = function (x) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'username',
				$elm$json$Json$Encode$string(x.bb)),
				_Utils_Tuple2(
				'password',
				$elm$json$Json$Encode$string(x.a3)),
				_Utils_Tuple2(
				'otp',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$withDefault($elm$json$Json$Encode$null),
					$elm$core$Maybe$map($elm$json$Json$Encode$string))(x.b8)),
				_Utils_Tuple2(
				'ua',
				$elm$json$Json$Encode$string(x.cH))
			]));
};
var $author$project$Api$postAuthenticate = function (body) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$jsonBody(
				$author$project$Api$encodeLoginRequest(body)),
			b: $elm$http$Http$expectJson($author$project$Api$decodeLogin),
			c: _List_Nil,
			d: 'POST',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/authenticate',
			g: true
		});
};
var $author$project$Page$Account$SaveSettingsResponse = function (a) {
	return {$: 5, a: a};
};
var $author$project$Data$Session$updateSettings = F2(
	function (sesh, newSettings) {
		var session = sesh;
		return A2(
			$elm$core$Maybe$withDefault,
			sesh,
			A2(
				$elm$core$Maybe$map,
				function (u) {
					return _Utils_update(
						session,
						{
							r: $elm$core$Maybe$Just(u)
						});
				},
				A2(
					$elm$core$Maybe$map,
					function (u) {
						return _Utils_update(
							u,
							{
								cs: $elm$core$Maybe$Just(newSettings)
							});
					},
					session.r)));
	});
var $author$project$Page$Account$update = F3(
	function (session, msg, model) {
		var settings = model.cs;
		switch (msg.$) {
			case 1:
				var bg = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								cs: _Utils_update(
									settings,
									{bd: bg})
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 0:
				var c = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								cs: _Utils_update(
									settings,
									{bg: c})
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 2:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								cs: _Utils_update(
									settings,
									{bk: f})
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 3:
				var sz = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								cs: _Utils_update(
									settings,
									{bv: sz})
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 4:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						A2(
							$elm$http$Http$send,
							$author$project$Page$Account$SaveSettingsResponse,
							A2(
								$author$project$Api$postAccountSettings,
								$author$project$Data$Session$authorization(session),
								$author$project$Data$Settings$encode(model.cs)))),
					session);
			default:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2($author$project$Data$Session$updateSettings, session, model.cs));
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				}
		}
	});
var $author$project$Page$Class$ClassMembersResponse = function (a) {
	return {$: 8, a: a};
};
var $author$project$Page$Class$DeleteResponse = function (a) {
	return {$: 4, a: a};
};
var $author$project$Page$Class$Deleted = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Class$NoOp = {$: 0};
var $author$project$Page$Class$Updated = function (a) {
	return {$: 2, a: a};
};
var $author$project$Data$Session$updateCache = F2(
	function (f, _v0) {
		var session = _v0;
		return _Utils_update(
			session,
			{
				s: f(session.s)
			});
	});
var $author$project$Page$Class$deleteFromCache = F2(
	function (_v0, session) {
		return A2(
			$author$project$Data$Session$updateCache,
			function (c) {
				return _Utils_update(
					c,
					{cZ: _List_Nil});
			},
			session);
	});
var $author$project$Api$deleteSchoolClassesByClassId = F2(
	function (header_Authorization, capture_classId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectStringResponse(
					function (res) {
						return $elm$core$String$isEmpty(res.a) ? $elm$core$Result$Ok(0) : $elm$core$Result$Err('Expected the response body to be empty');
					}),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'DELETE',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/classes',
							$elm$url$Url$percentEncode(capture_classId)
						])),
				g: true
			});
	});
var $author$project$Api$postSchoolClassesByClassIdMembers = F4(
	function (header_Authorization, capture_classId, query_delete, body) {
		var params = A2(
			$elm$core$List$filter,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
			_List_fromArray(
				[
					A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							function (v) {
								return v ? 'true' : 'false';
							},
							A2(
								$elm$core$Basics$composeR,
								$elm$url$Url$percentEncode,
								$elm$core$Basics$append('delete='))),
						query_delete))
				]));
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$list($elm$json$Json$Encode$string)(body)),
				b: $elm$http$Http$expectJson($author$project$Api$decodeClass),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: _Utils_ap(
					A2(
						$elm$core$String$join,
						'/',
						_List_fromArray(
							[
								$author$project$Api$apiUrl,
								'school/classes',
								$elm$url$Url$percentEncode(capture_classId),
								'members'
							])),
					$elm$core$List$isEmpty(params) ? '' : ('?' + A2($elm$core$String$join, '&', params))),
				g: true
			});
	});
var $author$project$Page$Class$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aM: true}),
						$elm$core$Platform$Cmd$none),
					$author$project$Page$Class$NoOp);
			case 3:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aM: false}),
						$elm$core$Platform$Cmd$none),
					$author$project$Page$Class$NoOp);
			case 2:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						A2(
							$elm$http$Http$send,
							$author$project$Page$Class$DeleteResponse,
							A2(
								$author$project$Api$deleteSchoolClassesByClassId,
								$author$project$Data$Session$authorization(session),
								function ($) {
									return $.dl;
								}(model.bf)))),
					$author$project$Page$Class$NoOp);
			case 4:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{aM: false}),
							$elm$core$Platform$Cmd$none),
						$author$project$Page$Class$Deleted(
							A2($author$project$Page$Class$deleteFromCache, model.bf, session)));
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						$author$project$Page$Class$NoOp);
				}
			case 1:
				return _Utils_Tuple2(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					$author$project$Page$Class$NoOp);
			case 5:
				var state = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{bm: state}),
						$elm$core$Platform$Cmd$none),
					$author$project$Page$Class$NoOp);
			case 6:
				var student = msg.a;
				var checked = msg.b;
				var f = checked ? A2($elm$core$Dict$insert, student.dl, student) : $elm$core$Dict$remove(student.dl);
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								an: f(model.an)
							}),
						$elm$core$Platform$Cmd$none),
					$author$project$Page$Class$NoOp);
			case 7:
				var studentsToDelete = A2(
					$elm$core$List$map,
					function ($) {
						return $.dl;
					},
					$elm$core$Dict$values(model.an));
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{an: $elm$core$Dict$empty}),
						A2(
							$elm$http$Http$send,
							$author$project$Page$Class$ClassMembersResponse,
							A4(
								$author$project$Api$postSchoolClassesByClassIdMembers,
								$author$project$Data$Session$authorization(session),
								function ($) {
									return $.dl;
								}(model.bf),
								$elm$core$Maybe$Just(true),
								studentsToDelete))),
					$author$project$Page$Class$NoOp);
			default:
				if (!msg.a.$) {
					var updatedClass = msg.a.a;
					var updateClasses = function (cs) {
						return A2(
							$elm$core$List$cons,
							updatedClass,
							A2(
								$elm$core$List$filter,
								function (c) {
									return !_Utils_eq(c.dl, updatedClass.dl);
								},
								cs));
					};
					var newSession = A2(
						$author$project$Data$Session$updateCache,
						function (c) {
							return _Utils_update(
								c,
								{
									cZ: updateClasses(c.cZ)
								});
						},
						session);
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{bf: updatedClass, ai: _List_Nil}),
							$elm$core$Platform$Cmd$none),
						$author$project$Page$Class$Updated(newSession));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _List_fromArray(
										[
											$author$project$Util$defaultHttpErrorMsg(e)
										])
								}),
							$elm$core$Platform$Cmd$none),
						$author$project$Page$Class$NoOp);
				}
		}
	});
var $author$project$Page$Classes$AddClassFormMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$AddClassForm$Model = F3(
	function (errors, name, description) {
		return {aY: description, ai: errors, a0: name};
	});
var $author$project$AddClassForm$init = A3($author$project$AddClassForm$Model, _List_Nil, '', '');
var $author$project$AddClassForm$Form = 0;
var $author$project$AddClassForm$AddClassResponse = function (a) {
	return {$: 3, a: a};
};
var $author$project$Api$postSchoolClasses = F2(
	function (header_Authorization, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					function (_v0) {
						var x = _v0.a;
						var y = _v0.b;
						return A2(
							$elm$json$Json$Encode$list,
							$elm$core$Basics$identity,
							_List_fromArray(
								[
									$elm$json$Json$Encode$string(x),
									$elm$json$Json$Encode$string(y)
								]));
					}(body)),
				b: $elm$http$Http$expectJson($author$project$Api$decodeClass),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[$author$project$Api$apiUrl, 'school/classes'])),
				g: true
			});
	});
var $author$project$AddClassForm$sendNewClassRequest = F2(
	function (session, model) {
		return A2(
			$elm$http$Http$send,
			$author$project$AddClassForm$AddClassResponse,
			A2(
				$author$project$Api$postSchoolClasses,
				$author$project$Data$Session$authorization(session),
				_Utils_Tuple2(model.a0, model.aY)));
	});
var $rtfeldman$elm_validate$Validate$Valid = $elm$core$Basics$identity;
var $rtfeldman$elm_validate$Validate$validate = F2(
	function (_v0, subject) {
		var getErrors = _v0;
		var _v1 = getErrors(subject);
		if (!_v1.b) {
			return $elm$core$Result$Ok(subject);
		} else {
			var errors = _v1;
			return $elm$core$Result$Err(errors);
		}
	});
var $author$project$AddClassForm$Description = 2;
var $author$project$AddClassForm$Name = 1;
var $rtfeldman$elm_validate$Validate$Validator = $elm$core$Basics$identity;
var $rtfeldman$elm_validate$Validate$all = function (validators) {
	var newGetErrors = function (subject) {
		var accumulateErrors = F2(
			function (_v0, totalErrors) {
				var getErrors = _v0;
				return _Utils_ap(
					totalErrors,
					getErrors(subject));
			});
		return A3($elm$core$List$foldl, accumulateErrors, _List_Nil, validators);
	};
	return newGetErrors;
};
var $rtfeldman$elm_validate$Validate$ifTrue = F2(
	function (test, error) {
		var getErrors = function (subject) {
			return test(subject) ? _List_fromArray(
				[error]) : _List_Nil;
		};
		return getErrors;
	});
var $rtfeldman$elm_validate$Validate$isWhitespaceChar = function (_char) {
	return (_char === ' ') || ((_char === '\n') || ((_char === '\t') || (_char === '\u000D')));
};
var $rtfeldman$elm_validate$Validate$isBlank = function (str) {
	isBlank:
	while (true) {
		var _v0 = $elm$core$String$uncons(str);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var _char = _v1.a;
			var rest = _v1.b;
			if ($rtfeldman$elm_validate$Validate$isWhitespaceChar(_char)) {
				var $temp$str = rest;
				str = $temp$str;
				continue isBlank;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
};
var $rtfeldman$elm_validate$Validate$ifBlank = F2(
	function (subjectToString, error) {
		return A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return $rtfeldman$elm_validate$Validate$isBlank(
					subjectToString(subject));
			},
			error);
	});
var $rtfeldman$elm_validate$Validate$ifFalse = F2(
	function (test, error) {
		var getErrors = function (subject) {
			return test(subject) ? _List_Nil : _List_fromArray(
				[error]);
		};
		return getErrors;
	});
var $elm$core$String$trim = _String_trim;
var $author$project$AddClassForm$validName = function (name) {
	return function (l) {
		return (l > 1) && (l < 50);
	}(
		$elm$core$String$length(
			$elm$core$String$trim(name)));
};
var $author$project$AddClassForm$validator = $rtfeldman$elm_validate$Validate$all(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_validate$Validate$ifFalse,
			A2(
				$elm$core$Basics$composeL,
				$author$project$AddClassForm$validName,
				function ($) {
					return $.a0;
				}),
			_Utils_Tuple2(1, 'You must enter a valid name for the class')),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.aY;
			},
			_Utils_Tuple2(2, 'A description for the class is required'))
		]));
var $author$project$AddClassForm$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = A2($rtfeldman$elm_validate$Validate$validate, $author$project$AddClassForm$validator, model);
				if (_v1.$ === 1) {
					var errors = _v1.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: errors}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: _List_Nil}),
							A2($author$project$AddClassForm$sendNewClassRequest, session, model)),
						$elm$core$Maybe$Nothing);
				}
			case 1:
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{a0: name}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 2:
				var d = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aY: d}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			default:
				if (!msg.a.$) {
					var newClass = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Just(newClass));
				} else {
					var e = msg.a.a;
					var errorMessage = function () {
						if (e.$ === 3) {
							var status = e.a.ek;
							var _v3 = status.c1;
							if (_v3 === 409) {
								return 'A class with that name already exists';
							} else {
								return $author$project$Util$defaultHttpErrorMsg(e);
							}
						} else {
							return $author$project$Util$defaultHttpErrorMsg(e);
						}
					}();
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _List_fromArray(
										[
											_Utils_Tuple2(0, errorMessage)
										])
								}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				}
		}
	});
var $author$project$Page$Classes$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 3:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								ae: $elm$core$Maybe$Just($author$project$AddClassForm$init)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 2:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{ae: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none),
					session);
			case 0:
				var state = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{by: state}),
						$elm$core$Platform$Cmd$none),
					session);
			default:
				var subMsg = msg.a;
				var _v1 = A2(
					$elm$core$Maybe$map,
					A2($author$project$AddClassForm$update, session, subMsg),
					model.ae);
				if (_v1.$ === 1) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					if (_v1.a.b.$ === 1) {
						var _v2 = _v1.a;
						var _v3 = _v2.a;
						var subModel = _v3.a;
						var subSubMsg = _v3.b;
						var _v4 = _v2.b;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{
										ae: $elm$core$Maybe$Just(subModel)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Page$Classes$AddClassFormMsg, subSubMsg)),
							session);
					} else {
						var _v5 = _v1.a;
						var newClass = _v5.b.a;
						var cache = $author$project$Data$Session$getCache(session);
						var newClasses = A2($elm$core$List$cons, newClass, cache.cZ);
						var newSession = A2(
							$author$project$Data$Session$updateCache,
							function (c) {
								return _Utils_update(
									c,
									{cZ: newClasses});
							},
							session);
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{ae: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none),
							newSession);
					}
				}
		}
	});
var $author$project$Page$Editor$SaveResponse = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Editor$OnCurriculumSelect = function (a) {
	return {$: 9, a: a};
};
var $sporto$elm_select$Select$PrivateConfig = $elm$core$Basics$identity;
var $sporto$elm_select$Select$Styles$inputId = 'elm-select-input';
var $sporto$elm_select$Select$Config$newConfig = function (requiredConfig) {
	return {c_: '', c$: _List_Nil, c0: '', c4: $elm$core$Maybe$Nothing, c8: false, de: requiredConfig.de, dh: true, dj: '', dk: _List_Nil, dp: '', dq: '', dr: _List_Nil, ds: $sporto$elm_select$Select$Styles$inputId, dt: _List_Nil, du: '', dv: _List_Nil, dw: false, dx: '', dy: $elm$core$Maybe$Nothing, dz: _List_Nil, dD: '', dE: _List_Nil, dG: '', dH: '', dI: _List_Nil, dJ: _List_Nil, dW: 'No results found', dX: '', dY: true, dZ: _List_Nil, d$: $elm$core$Maybe$Nothing, d0: $elm$core$Maybe$Nothing, d1: $elm$core$Maybe$Nothing, d2: requiredConfig.d2, d9: '', ea: '', eb: _List_Nil, ci: '', cj: _List_Nil, cr: 2000, es: requiredConfig.es, eu: $elm$core$Basics$identity, ev: '', ew: _List_Nil};
};
var $sporto$elm_select$Select$newConfig = function (requiredConfig) {
	return $sporto$elm_select$Select$Config$newConfig(requiredConfig);
};
var $elm$core$String$toLower = _String_toLower;
var $sporto$elm_select$Select$unwrapConfig = function (config) {
	var c = config;
	return c;
};
var $sporto$elm_select$Select$mapConfig = F2(
	function (fn, config) {
		var config_ = $sporto$elm_select$Select$unwrapConfig(config);
		return fn(config_);
	});
var $sporto$elm_select$Select$withCutoff = F2(
	function (n, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{
					c4: $elm$core$Maybe$Just(n)
				});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $sporto$elm_select$Select$withHighlightedItemStyles = F2(
	function (styles, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{dk: styles});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $sporto$elm_select$Select$withInputWrapperStyles = F2(
	function (styles, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{dv: styles});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $sporto$elm_select$Select$withItemStyles = F2(
	function (styles, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{dz: styles});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $sporto$elm_select$Select$withMenuStyles = F2(
	function (styles, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{dE: styles});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $sporto$elm_select$Select$withNotFound = F2(
	function (text, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{dW: text});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $sporto$elm_select$Select$withNotFoundStyles = F2(
	function (styles, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{dZ: styles});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $author$project$Page$Editor$selectConfig = function (msg) {
	var strContainsFilter = F2(
		function (query, items) {
			return ($elm$core$String$length(query) < 2) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2(
					$elm$core$List$filter,
					function (item) {
						return A2(
							$elm$core$String$contains,
							$elm$core$String$toLower(query),
							$elm$core$String$toLower(item));
					},
					items));
		});
	return A2(
		$sporto$elm_select$Select$withHighlightedItemStyles,
		_List_Nil,
		A2(
			$sporto$elm_select$Select$withNotFoundStyles,
			_List_fromArray(
				[
					_Utils_Tuple2('padding', '0 2rem')
				]),
			A2(
				$sporto$elm_select$Select$withNotFound,
				'No matches',
				A2(
					$sporto$elm_select$Select$withMenuStyles,
					_List_fromArray(
						[
							_Utils_Tuple2('background', 'white')
						]),
					A2(
						$sporto$elm_select$Select$withItemStyles,
						_List_fromArray(
							[
								_Utils_Tuple2('font-size', '1rem')
							]),
						A2(
							$sporto$elm_select$Select$withInputWrapperStyles,
							_List_fromArray(
								[
									_Utils_Tuple2('padding', '0.4rem')
								]),
							A2(
								$sporto$elm_select$Select$withCutoff,
								12,
								$sporto$elm_select$Select$newConfig(
									{de: strContainsFilter, d2: msg, es: $elm$core$Basics$identity}))))))));
};
var $sporto$elm_select$Select$withInputId = F2(
	function (id, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{ds: id});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $sporto$elm_select$Select$withPrompt = F2(
	function (prompt, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{d9: prompt});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $author$project$Page$Editor$curriculumSelectConfig = A2(
	$sporto$elm_select$Select$withPrompt,
	'Select a curriculum',
	A2(
		$sporto$elm_select$Select$withInputId,
		'story_curriculum',
		$author$project$Page$Editor$selectConfig($author$project$Page$Editor$OnCurriculumSelect)));
var $wernerdegroot$listzipper$List$Zipper$mapCurrent = F2(
	function (f, _v0) {
		var ls = _v0.a;
		var x = _v0.b;
		var rs = _v0.c;
		return A3(
			$wernerdegroot$listzipper$List$Zipper$Zipper,
			ls,
			f(x),
			rs);
	});
var $author$project$List$Zipper$Infinite$mapCurrent = $wernerdegroot$listzipper$List$Zipper$mapCurrent;
var $author$project$List$Zipper$Infinite$next = function (z) {
	return A2(
		$elm$core$Maybe$withDefault,
		$wernerdegroot$listzipper$List$Zipper$first(z),
		$wernerdegroot$listzipper$List$Zipper$next(z));
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Api$encodeDictEntry = function (x) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'word',
				$elm$json$Json$Encode$string(x.cK)),
				_Utils_Tuple2(
				'index',
				$elm$json$Json$Encode$int(x.b$))
			]));
};
var $author$project$Api$encodeStory = function (x) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(x.dl)),
				_Utils_Tuple2(
				'title',
				$elm$json$Json$Encode$string(x.cE)),
				_Utils_Tuple2(
				'img',
				$elm$json$Json$Encode$string(x.b_)),
				_Utils_Tuple2(
				'level',
				$elm$json$Json$Encode$int(x.aF)),
				_Utils_Tuple2(
				'qualification',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$withDefault($elm$json$Json$Encode$null),
					$elm$core$Maybe$map($elm$json$Json$Encode$string))(x.cf)),
				_Utils_Tuple2(
				'curriculum',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$withDefault($elm$json$Json$Encode$null),
					$elm$core$Maybe$map($elm$json$Json$Encode$string))(x.bM)),
				_Utils_Tuple2(
				'tags',
				$elm$json$Json$Encode$list($elm$json$Json$Encode$string)(x.cC)),
				_Utils_Tuple2(
				'content',
				$elm$json$Json$Encode$string(x.bL)),
				_Utils_Tuple2(
				'words',
				$elm$json$Json$Encode$list($author$project$Api$encodeDictEntry)(x.cL)),
				_Utils_Tuple2(
				'clarify_word',
				$elm$json$Json$Encode$string(x.cY)),
				_Utils_Tuple2(
				'nn',
				$elm$json$Json$Encode$list($elm$json$Json$Encode$int)(x.b6)),
				_Utils_Tuple2(
				'enabled',
				$elm$json$Json$Encode$bool(x.bS)),
				_Utils_Tuple2(
				'created_at',
				$elm$json$Json$Encode$int(x.as))
			]));
};
var $author$project$Api$postStoriesByStoryId = F3(
	function (header_Authorization, capture_storyId, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$author$project$Api$encodeStory(body)),
				b: $elm$http$Http$expectJson($author$project$Api$decodeStory),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'stories',
							$elm$url$Url$percentEncode(
							$elm$core$String$fromInt(capture_storyId))
						])),
				g: true
			});
	});
var $wernerdegroot$listzipper$List$Zipper$last = function (zipper) {
	var ls = zipper.a;
	var x = zipper.b;
	var rs = zipper.c;
	var _v0 = $elm$core$List$reverse(rs);
	if (!_v0.b) {
		return zipper;
	} else {
		var y = _v0.a;
		var ys = _v0.b;
		return A3(
			$wernerdegroot$listzipper$List$Zipper$Zipper,
			_Utils_ap(
				ys,
				_Utils_ap(
					_List_fromArray(
						[x]),
					ls)),
			y,
			_List_Nil);
	}
};
var $wernerdegroot$listzipper$List$Zipper$previous = function (_v0) {
	var ls = _v0.a;
	var x = _v0.b;
	var rs = _v0.c;
	if (!ls.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		var y = ls.a;
		var ys = ls.b;
		return $elm$core$Maybe$Just(
			A3(
				$wernerdegroot$listzipper$List$Zipper$Zipper,
				ys,
				y,
				A2($elm$core$List$cons, x, rs)));
	}
};
var $author$project$List$Zipper$Infinite$previous = function (z) {
	return A2(
		$elm$core$Maybe$withDefault,
		$wernerdegroot$listzipper$List$Zipper$last(z),
		$wernerdegroot$listzipper$List$Zipper$previous(z));
};
var $author$project$Page$Editor$OnQualificationSelect = function (a) {
	return {$: 10, a: a};
};
var $author$project$Page$Editor$qualificationSelectConfig = A2(
	$sporto$elm_select$Select$withPrompt,
	'Select a qualification',
	A2(
		$sporto$elm_select$Select$withInputId,
		'story_qualification',
		$author$project$Page$Editor$selectConfig($author$project$Page$Editor$OnQualificationSelect)));
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Page$Editor$OnRemoveTag = function (a) {
	return {$: 11, a: a};
};
var $author$project$Page$Editor$OnTagSelect = function (a) {
	return {$: 8, a: a};
};
var $sporto$elm_select$Select$withMultiSelection = F2(
	function (value, config) {
		return A2(
			$sporto$elm_select$Select$mapConfig,
			function (c) {
				return _Utils_update(
					c,
					{dw: value});
			},
			config);
	});
var $sporto$elm_select$Select$withOnRemoveItem = F2(
	function (onRemoveItemMsg, config) {
		var fn = function (c) {
			return _Utils_update(
				c,
				{
					d1: $elm$core$Maybe$Just(onRemoveItemMsg)
				});
		};
		return A2($sporto$elm_select$Select$mapConfig, fn, config);
	});
var $author$project$Page$Editor$tagSelectConfig = A2(
	$sporto$elm_select$Select$withMultiSelection,
	true,
	A2(
		$sporto$elm_select$Select$withPrompt,
		'Select a tag',
		A2(
			$sporto$elm_select$Select$withOnRemoveItem,
			$author$project$Page$Editor$OnRemoveTag,
			A2(
				$sporto$elm_select$Select$withInputId,
				'story_tags',
				$author$project$Page$Editor$selectConfig($author$project$Page$Editor$OnTagSelect)))));
var $sporto$elm_select$Select$unwrapModel = function (model) {
	var m = model;
	return m;
};
var $sporto$elm_select$Select$unwrapMsg = function (msg) {
	var m = msg;
	return m;
};
var $sporto$elm_select$Select$Update$update = F3(
	function (config, msg, model) {
		var queryChangeCmd = function (value) {
			var _v7 = config.d0;
			if (_v7.$ === 1) {
				return $elm$core$Platform$Cmd$none;
			} else {
				var constructor = _v7.a;
				return A2(
					$elm$core$Task$perform,
					constructor,
					$elm$core$Task$succeed(value));
			}
		};
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 5:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cg: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var newHightlightedItem = function () {
					var _v1 = model.bY;
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Just(0);
					} else {
						var n = _v1.a;
						return $elm$core$Maybe$Just(n + 1);
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bY: newHightlightedItem}),
					$elm$core$Platform$Cmd$none);
			case 7:
				var newHightlightedItem = function () {
					var _v2 = model.bY;
					if (_v2.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						if (!_v2.a) {
							return $elm$core$Maybe$Nothing;
						} else {
							var n = _v2.a;
							return $elm$core$Maybe$Just(n - 1);
						}
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bY: newHightlightedItem}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var cmd = function () {
					var _v4 = config.d$;
					if (_v4.$ === 1) {
						return $elm$core$Platform$Cmd$none;
					} else {
						var focusMessage = _v4.a;
						return A2(
							$elm$core$Task$perform,
							function (x) {
								return focusMessage;
							},
							$elm$core$Task$succeed($elm$core$Maybe$Nothing));
					}
				}();
				var _v3 = config.c8;
				if (_v3) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								cg: $elm$core$Maybe$Just('')
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									cmd,
									config.c8 ? queryChangeCmd('') : $elm$core$Platform$Cmd$none
								])));
				} else {
					return _Utils_Tuple2(model, cmd);
				}
			case 2:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cg: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var cmd = A2(
					$elm$core$Task$perform,
					config.d2,
					$elm$core$Task$succeed($elm$core$Maybe$Nothing));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cg: $elm$core$Maybe$Nothing}),
					cmd);
			case 4:
				var item = msg.a;
				var cmd = function () {
					var _v5 = config.d1;
					if (!_v5.$) {
						var onRemoveItem = _v5.a;
						return A2(
							$elm$core$Task$perform,
							onRemoveItem,
							$elm$core$Task$succeed(item));
					} else {
						return $elm$core$Platform$Cmd$none;
					}
				}();
				return _Utils_Tuple2(model, cmd);
			case 8:
				var value = msg.a;
				var newQuery = config.eu(value);
				var cmd = function () {
					if (newQuery === '') {
						return $elm$core$Platform$Cmd$none;
					} else {
						return queryChangeCmd(newQuery);
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bY: $elm$core$Maybe$Nothing,
							cg: $elm$core$Maybe$Just(value)
						}),
					cmd);
			default:
				var item = msg.a;
				var cmd = A2(
					$elm$core$Task$perform,
					config.d2,
					$elm$core$Task$succeed(
						$elm$core$Maybe$Just(item)));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cg: $elm$core$Maybe$Nothing}),
					cmd);
		}
	});
var $sporto$elm_select$Select$update = F3(
	function (config, msg, model) {
		var msg_ = $sporto$elm_select$Select$unwrapMsg(msg);
		var model_ = $sporto$elm_select$Select$unwrapModel(model);
		var config_ = $sporto$elm_select$Select$unwrapConfig(config);
		var _v0 = A3($sporto$elm_select$Select$Update$update, config_, msg_, model_);
		var mdl = _v0.a;
		var cmd = _v0.b;
		return _Utils_Tuple2(mdl, cmd);
	});
var $author$project$Ports$getImgWidth = _Platform_outgoingPort('getImgWidth', $elm$json$Json$Encode$string);
var $author$project$Views$Story$update = F2(
	function (msg, _v0) {
		var picWidth = _v0.a;
		var windowWidth = _v0.b;
		switch (msg.$) {
			case 0:
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(picWidth, windowWidth),
					$author$project$Ports$getImgWidth(s));
			case 1:
				var w = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						$elm$core$Basics$round(w),
						windowWidth),
					$elm$core$Platform$Cmd$none);
			default:
				var width = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(picWidth, width),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Editor$updateStory = F2(
	function (f, model) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					a7: f(model.a7)
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Editor$updateZipper = F2(
	function (f, model) {
		var newStories = f(model.a6);
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					ai: _List_Nil,
					a6: newStories,
					a7: $author$project$List$Zipper$Infinite$current(newStories)
				}),
			$elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Editor$clarifyWordExists = function (s) {
	var cw = $elm$core$String$toLower(s.cY);
	var inContent = A2(
		$elm$core$String$contains,
		cw,
		$elm$core$String$toLower(s.bL));
	var inTitle = A2(
		$elm$core$String$contains,
		cw,
		$elm$core$String$toLower(s.cE));
	var isPhrase = A2($elm$core$String$contains, ' ', cw);
	return isPhrase || (inContent || inTitle);
};
var $author$project$Page$Editor$validator = $rtfeldman$elm_validate$Validate$all(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.bL;
			},
			'You must enter some content for the story'),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.cY;
			},
			'You must enter a clarify word for the story'),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.cE;
			},
			'You must enter a title for the story'),
			A2($rtfeldman$elm_validate$Validate$ifFalse, $author$project$Page$Editor$clarifyWordExists, 'The story doesn\'t contain the clarify word')
		]));
var $author$project$Page$Editor$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 1:
				var svm = msg.a;
				var _v1 = A2($author$project$Views$Story$update, svm, model.aO);
				var newStoryView = _v1.a;
				var cmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aO: newStoryView}),
					A2($elm$core$Platform$Cmd$map, $author$project$Page$Editor$StoryViewMsg, cmd));
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ai: _List_Nil,
							a7: $author$project$List$Zipper$Infinite$current(model.a6)
						}),
					$elm$core$Platform$Cmd$none);
			case 13:
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{bS: !s.bS});
					},
					model);
			case 0:
				var newContent = msg.a;
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{bL: newContent});
					},
					model);
			case 12:
				var newTitle = msg.a;
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{cE: newTitle});
					},
					model);
			case 14:
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{
								aF: (model.a7.aF < 9) ? (model.a7.aF + 1) : 9
							});
					},
					model);
			case 15:
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{
								aF: (model.a7.aF > 0) ? (model.a7.aF - 1) : 0
							});
					},
					model);
			case 16:
				var newClarifyWord = msg.a;
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{cY: newClarifyWord});
					},
					model);
			case 2:
				var _v2 = A2($rtfeldman$elm_validate$Validate$validate, $author$project$Page$Editor$validator, model.a7);
				if (_v2.$ === 1) {
					var errors = _v2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ai: errors}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ai: _List_Nil}),
						A2(
							$elm$http$Http$send,
							$author$project$Page$Editor$SaveResponse,
							A3(
								$author$project$Api$postStoriesByStoryId,
								$author$project$Data$Session$authorization(session),
								model.a7.dl,
								model.a7)));
				}
			case 3:
				if (!msg.a.$) {
					var story = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ai: _List_Nil,
								a6: A2(
									$author$project$List$Zipper$Infinite$mapCurrent,
									function (_v3) {
										return story;
									},
									model.a6),
								a7: story
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ai: _List_fromArray(
									[
										$author$project$Util$defaultHttpErrorMsg(e)
									])
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 8:
				var maybeTag = msg.a;
				var selectedTags = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$List$singleton,
							$elm$core$List$append(model.a7.cC)),
						maybeTag));
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{cC: selectedTags});
					},
					model);
			case 9:
				var newCurriculum = msg.a;
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{bM: newCurriculum});
					},
					model);
			case 10:
				var newQualification = msg.a;
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{cf: newQualification});
					},
					model);
			case 11:
				var tagToRemove = msg.a;
				var selectedTags = A2(
					$elm$core$List$filter,
					function (curTag) {
						return !_Utils_eq(curTag, tagToRemove);
					},
					model.a7.cC);
				return A2(
					$author$project$Page$Editor$updateStory,
					function (s) {
						return _Utils_update(
							s,
							{cC: selectedTags});
					},
					model);
			case 5:
				var sub = msg.a;
				var _v4 = A3($sporto$elm_select$Select$update, $author$project$Page$Editor$tagSelectConfig, sub, model.aP);
				var updated = _v4.a;
				var cmd = _v4.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aP: updated}),
					cmd);
			case 6:
				var sub = msg.a;
				var _v5 = A3($sporto$elm_select$Select$update, $author$project$Page$Editor$curriculumSelectConfig, sub, model.aE);
				var updated = _v5.a;
				var cmd = _v5.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aE: updated}),
					cmd);
			case 7:
				var sub = msg.a;
				var _v6 = A3($sporto$elm_select$Select$update, $author$project$Page$Editor$qualificationSelectConfig, sub, model.aL);
				var updated = _v6.a;
				var cmd = _v6.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aL: updated}),
					cmd);
			case 17:
				return A2($author$project$Page$Editor$updateZipper, $author$project$List$Zipper$Infinite$next, model);
			default:
				return A2($author$project$Page$Editor$updateZipper, $author$project$List$Zipper$Infinite$previous, model);
		}
	});
var $author$project$Page$FindStory$Anthologies = {$: 2};
var $author$project$Page$FindStory$AnthologyForm = F2(
	function (name, description) {
		return {aY: description, a0: name};
	});
var $author$project$Page$FindStory$CreateAnthologyResponse = function (a) {
	return {$: 20, a: a};
};
var $author$project$Page$FindStory$DeleteAnthologyResponse = function (a) {
	return {$: 22, a: a};
};
var $author$project$Page$FindStory$SetStarterStoriesResponse = function (a) {
	return {$: 24, a: a};
};
var $author$project$Page$FindStory$UpdateAnthologyResponse = function (a) {
	return {$: 26, a: a};
};
var $author$project$Api$deleteAnthologiesByAnthologyId = F2(
	function (header_Authorization, capture_anthologyId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectJson($elm$json$Json$Decode$string),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'DELETE',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'anthologies',
							$elm$url$Url$percentEncode(capture_anthologyId)
						])),
				g: true
			});
	});
var $author$project$Data$Session$Error = function (a) {
	return {$: 1, a: a};
};
var $author$project$Data$Session$alert = F2(
	function (a, _v0) {
		var session = _v0;
		return _Utils_update(
			session,
			{
				T: A2(
					$elm$core$List$cons,
					_Utils_Tuple2(a, false),
					session.T)
			});
	});
var $author$project$Data$Session$error = A2($elm$core$Basics$composeR, $author$project$Data$Session$Error, $author$project$Data$Session$alert);
var $author$project$Page$FindStory$filterByDate = F2(
	function (df, stories) {
		if (!df.$) {
			return stories;
		} else {
			var t = df.a;
			return A2(
				$elm$core$List$filter,
				function (s) {
					return _Utils_cmp(s.as, t) > 0;
				},
				stories);
		}
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {b$: index, b3: match, d_: number, em: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$never = _Regex_never;
var $author$project$Page$FindStory$matchingStories = F2(
	function (storyFilter, stories) {
		if ($elm$core$String$length(storyFilter) < 3) {
			return stories;
		} else {
			var r = A2(
				$elm$core$Maybe$withDefault,
				$elm$regex$Regex$never,
				A2(
					$elm$regex$Regex$fromStringWith,
					{cW: true, dK: false},
					storyFilter));
			var tagMatch = function (tags) {
				return !_Utils_eq(
					A2(
						$elm_community$list_extra$List$Extra$find,
						$elm$regex$Regex$contains(r),
						tags),
					$elm$core$Maybe$Nothing);
			};
			var matchMaybe = function (q) {
				return _Utils_eq(
					A2(
						$elm$core$Maybe$map,
						$elm$regex$Regex$contains(r),
						q),
					$elm$core$Maybe$Just(true));
			};
			var match = function (story) {
				return A2($elm$regex$Regex$contains, r, story.cE) || (matchMaybe(story.cf) || (matchMaybe(story.bM) || (tagMatch(story.cC) || A2($elm$regex$Regex$contains, r, story.bL))));
			};
			return A2($elm$core$List$filter, match, stories);
		}
	});
var $author$project$Page$FindStory$filterStories = F3(
	function (storyFilter, dateFilter, stories) {
		return A2(
			$author$project$Page$FindStory$matchingStories,
			storyFilter,
			A2($author$project$Page$FindStory$filterByDate, dateFilter, stories));
	});
var $author$project$Views$StoryTiles$divId = 'storytiles';
var $author$project$Ports$isLastEltVisible = _Platform_outgoingPort('isLastEltVisible', $elm$json$Json$Encode$string);
var $author$project$Page$FindStory$loadMore = function (m) {
	var _v0 = m.X;
	if (!_v0.$) {
		var n = _v0.a;
		return (_Utils_cmp(
			n,
			$elm$core$List$length(m.a6)) > -1) ? _Utils_Tuple2(m, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			_Utils_update(
				m,
				{
					X: $author$project$Page$FindStory$Tiles(
						n + $author$project$Views$StoryTiles$tilesPerPage(m.aV))
				}),
			$author$project$Ports$isLastEltVisible($author$project$Views$StoryTiles$divId));
	} else {
		return _Utils_Tuple2(m, $elm$core$Platform$Cmd$none);
	}
};
var $author$project$Api$encodeAnthology = function (x) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(x.dl)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(x.a0)),
				_Utils_Tuple2(
				'description',
				$elm$json$Json$Encode$string(x.aY)),
				_Utils_Tuple2(
				'created_by',
				$elm$json$Json$Encode$string(x.aX)),
				_Utils_Tuple2(
				'school_id',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$withDefault($elm$json$Json$Encode$null),
					$elm$core$Maybe$map($elm$json$Json$Encode$string))(x.ab)),
				_Utils_Tuple2(
				'stories',
				$elm$json$Json$Encode$list($elm$json$Json$Encode$int)(x.a6)),
				_Utils_Tuple2(
				'hidden',
				$elm$json$Json$Encode$bool(x.a_))
			]));
};
var $author$project$Api$postAnthologies = F2(
	function (header_Authorization, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$author$project$Api$encodeAnthology(body)),
				b: $elm$http$Http$expectJson($author$project$Api$decodeAnthology),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: $author$project$Api$apiUrl + '/anthologies',
				g: true
			});
	});
var $author$project$Api$postAnthologiesByAnthologyId = F3(
	function (header_Authorization, capture_anthologyId, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$author$project$Api$encodeAnthology(body)),
				b: $elm$http$Http$expectJson($author$project$Api$decodeAnthology),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'anthologies',
							$elm$url$Url$percentEncode(capture_anthologyId)
						])),
				g: true
			});
	});
var $author$project$Api$postAnthologiesByAnthologyIdStarter_stories = F2(
	function (header_Authorization, capture_anthologyId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectStringResponse(
					function (res) {
						return $elm$core$String$isEmpty(res.a) ? $elm$core$Result$Ok(0) : $elm$core$Result$Err('Expected the response body to be empty');
					}),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'anthologies',
							$elm$url$Url$percentEncode(capture_anthologyId),
							'starter_stories'
						])),
				g: true
			});
	});
var $author$project$Page$FindStory$SaveWorkQueueResponse = function (a) {
	return {$: 28, a: a};
};
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$Set$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$Set$insert, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$uniqueBy = F2(
	function (f, list) {
		return A4($elm_community$list_extra$List$Extra$uniqueHelp, f, $elm$core$Set$empty, list, _List_Nil);
	});
var $author$project$Data$Session$addToWorkQueue = F2(
	function (stories, _v0) {
		var session = _v0;
		var newQueue = A2(
			$elm_community$list_extra$List$Extra$uniqueBy,
			function ($) {
				return $.dl;
			},
			A2($elm$core$List$append, session.w, stories));
		return _Utils_update(
			session,
			{w: newQueue});
	});
var $author$project$Page$FindStory$saveWorkQueue = F3(
	function (model, session, stories) {
		return function (_v0) {
			var cmd = _v0.a;
			var newSession = _v0.b;
			return _Utils_Tuple2(
				_Utils_Tuple2(model, cmd),
				newSession);
		}(
			A2(
				$author$project$Data$Session$saveWorkQueue,
				$author$project$Page$FindStory$SaveWorkQueueResponse,
				A2($author$project$Data$Session$addToWorkQueue, stories, session)));
	});
var $author$project$Data$Session$Success = function (a) {
	return {$: 0, a: a};
};
var $author$project$Data$Session$success = A2($elm$core$Basics$composeR, $author$project$Data$Session$Success, $author$project$Data$Session$alert);
var $author$project$Page$FindStory$updateAnthologies = function (f) {
	return $author$project$Data$Session$updateCache(
		function (c) {
			return _Utils_update(
				c,
				{
					cR: f(c.cR)
				});
		});
};
var $author$project$Page$FindStory$validateAnthologyForm = function (f) {
	return ($elm$core$String$length(f.a0) <= 3) ? _List_fromArray(
		['The anthology name must be more than 3 characters long']) : _List_Nil;
};
var $author$project$Page$FindStory$zipperFrom = F2(
	function (storyId, stories) {
		return A2(
			$elm$core$Maybe$andThen,
			$author$project$List$Zipper$Infinite$findFirst(
				function (s) {
					return _Utils_eq(s.dl, storyId);
				}),
			$author$project$List$Zipper$Infinite$fromList(stories));
	});
var $author$project$Page$FindStory$update = F3(
	function (session, msg, model) {
		var cache = $author$project$Data$Session$getCache(session);
		switch (msg.$) {
			case 0:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								a6: A3($author$project$Page$FindStory$filterStories, f, model.at, cache.a6),
								ao: f
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 1:
				var df = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								at: df,
								a6: A3($author$project$Page$FindStory$filterStories, model.ao, df, cache.a6)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 3:
				var t = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								a6: A3($billstclair$elm_sortable_table$Table$getSortedData, $author$project$Page$FindStory$tableConfig, t, model.a6),
								by: t
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 4:
				var storyId = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								E: A2($author$project$Page$FindStory$zipperFrom, storyId, model.a6)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 5:
				var storyId = msg.a;
				var stories = cache.a6;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								E: A2($author$project$Page$FindStory$zipperFrom, storyId, stories),
								at: $author$project$Page$FindStory$AllStories,
								a6: stories,
								ao: ''
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 6:
				var stories = msg.a;
				var storyId = msg.b;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								E: A2($author$project$Page$FindStory$zipperFrom, storyId, stories)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 2:
				var svm = msg.a;
				var _v1 = A2($author$project$Views$Story$update, svm, model.aO);
				var newStoryView = _v1.a;
				var cmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aO: newStoryView}),
						A2($elm$core$Platform$Cmd$map, $author$project$Page$FindStory$StoryViewMsg, cmd)),
					session);
			case 7:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								E: A2($elm$core$Maybe$map, $author$project$List$Zipper$Infinite$next, model.E)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 8:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								E: A2($elm$core$Maybe$map, $author$project$List$Zipper$Infinite$previous, model.E)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 9:
				var atBottom = msg.a;
				return atBottom ? _Utils_Tuple2(
					$author$project$Page$FindStory$loadMore(model),
					session) : _Utils_Tuple2(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					session);
			case 10:
				var w = msg.a;
				var h = msg.b;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								aV: _Utils_Tuple2(w, h)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 11:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{E: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none),
					session);
			case 12:
				var flag = !model.aN;
				var newStories = flag ? A2(
					$elm$core$List$filter,
					function (s) {
						return !s.bS;
					},
					model.a6) : A3($author$project$Page$FindStory$filterStories, model.ao, model.at, cache.a6);
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aN: flag, a6: newStories}),
						$elm$core$Platform$Cmd$none),
					session);
			case 14:
				var s = msg.a;
				return $author$project$Data$Session$isStudent(session) ? A3(
					$author$project$Page$FindStory$saveWorkQueue,
					model,
					session,
					_List_fromArray(
						[s])) : _Utils_Tuple2(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					A2(
						$author$project$Data$Session$updateCache,
						function (c) {
							return _Utils_update(
								c,
								{
									ef: A2($elm$core$List$cons, s, c.ef)
								});
						},
						session));
			case 13:
				return _Utils_Tuple2(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					A2(
						$author$project$Data$Session$updateCache,
						function (c) {
							return _Utils_update(
								c,
								{ef: _List_Nil});
						},
						session));
			case 15:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								J: $elm$core$Maybe$Just(
									A2($author$project$Page$FindStory$AnthologyForm, '', ''))
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 16:
				var n = msg.a;
				var _v2 = model.J;
				if (!_v2.$) {
					var f = _v2.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									J: $elm$core$Maybe$Just(
										{aY: f.aY, a0: n})
								}),
							$elm$core$Platform$Cmd$none),
						session);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				}
			case 17:
				var d = msg.a;
				var _v3 = model.J;
				if (!_v3.$) {
					var f = _v3.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									J: $elm$core$Maybe$Just(
										{aY: d, a0: f.a0})
								}),
							$elm$core$Platform$Cmd$none),
						session);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				}
			case 19:
				var _v4 = model.J;
				if (!_v4.$) {
					var f = _v4.a;
					var _v5 = $author$project$Page$FindStory$validateAnthologyForm(f);
					if (!_v5.b) {
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{J: $elm$core$Maybe$Nothing, ai: _List_Nil}),
								A2(
									$elm$http$Http$send,
									$author$project$Page$FindStory$CreateAnthologyResponse,
									A2(
										$author$project$Api$postAnthologies,
										$author$project$Data$Session$authorization(session),
										A7(
											$author$project$Api$Anthology,
											'',
											f.a0,
											f.aY,
											'',
											$elm$core$Maybe$Just(''),
											A2(
												$elm$core$List$map,
												function ($) {
													return $.dl;
												},
												cache.ef),
											false)))),
							session);
					} else {
						var errors = _v5;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{ai: errors}),
								$elm$core$Platform$Cmd$none),
							session);
					}
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				}
			case 20:
				if (!msg.a.$) {
					var newAnthology = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{J: $elm$core$Maybe$Nothing, X: $author$project$Page$FindStory$Anthologies}),
							$elm$core$Platform$Cmd$none),
						A2(
							$author$project$Data$Session$success,
							'New anthology created.',
							A2(
								$author$project$Data$Session$updateCache,
								function (c) {
									return _Utils_update(
										c,
										{ef: _List_Nil});
								},
								A2(
									$author$project$Page$FindStory$updateAnthologies,
									function (anthologies) {
										return A2($elm$core$List$cons, newAnthology, anthologies);
									},
									session))));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2(
							$author$project$Data$Session$error,
							'Couldn\'t create the anthology: ' + $author$project$Util$defaultHttpErrorMsg(e),
							session));
				}
			case 18:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{X: v}),
						$elm$core$Platform$Cmd$none),
					session);
			case 21:
				var aid = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						A2(
							$elm$http$Http$send,
							$author$project$Page$FindStory$DeleteAnthologyResponse,
							A2(
								$author$project$Api$deleteAnthologiesByAnthologyId,
								$author$project$Data$Session$authorization(session),
								aid))),
					session);
			case 22:
				if (!msg.a.$) {
					var aid = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2(
							$author$project$Data$Session$success,
							'Anthology deleted.',
							A2(
								$author$project$Page$FindStory$updateAnthologies,
								$elm$core$List$filter(
									function (a) {
										return !_Utils_eq(a.dl, aid);
									}),
								session)));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2(
							$author$project$Data$Session$error,
							'Couldn\'t delete the anthology: ' + $author$project$Util$defaultHttpErrorMsg(e),
							session));
				}
			case 23:
				var aid = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						A2(
							$elm$http$Http$send,
							$author$project$Page$FindStory$SetStarterStoriesResponse,
							A2(
								$author$project$Api$postAnthologiesByAnthologyIdStarter_stories,
								$author$project$Data$Session$authorization(session),
								aid))),
					session);
			case 24:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2(
							$author$project$Data$Session$error,
							'Couldn\'t set the starter stories: ' + $author$project$Util$defaultHttpErrorMsg(e),
							session));
				}
			case 25:
				var a = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						A2(
							$elm$http$Http$send,
							$author$project$Page$FindStory$UpdateAnthologyResponse,
							A3(
								$author$project$Api$postAnthologiesByAnthologyId,
								$author$project$Data$Session$authorization(session),
								a.dl,
								a))),
					session);
			case 26:
				if (!msg.a.$) {
					var newA = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2(
							$author$project$Page$FindStory$updateAnthologies,
							$elm$core$List$map(
								function (a) {
									return _Utils_eq(a.dl, newA.dl) ? newA : a;
								}),
							session));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _List_fromArray(
										[
											'Couldn\'t update the anthology: ' + $author$project$Util$defaultHttpErrorMsg(e)
										])
								}),
							$elm$core$Platform$Cmd$none),
						session);
				}
			case 27:
				var stories = msg.a;
				return A3($author$project$Page$FindStory$saveWorkQueue, model, session, stories);
			default:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2($author$project$Data$Session$success, 'Updated work queue', session));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						A2(
							$author$project$Data$Session$error,
							'Couldn\'t save work queue: ' + $author$project$Util$defaultHttpErrorMsg(e),
							session));
				}
		}
	});
var $author$project$Page$Login$Loading = 1;
var $author$project$Page$Login$LoginCompleted = function (a) {
	return {$: 4, a: a};
};
var $author$project$Page$Login$Success = 2;
var $author$project$Page$Login$Form = 0;
var $author$project$Page$Login$loginError = F2(
	function (errorMsg, model) {
		return _Utils_Tuple2(
			_Utils_Tuple2(
				_Utils_update(
					model,
					{
						ai: _List_fromArray(
							[
								_Utils_Tuple2(0, errorMsg)
							]),
						b8: $elm$core$Maybe$Nothing,
						av: false,
						R: 0
					}),
				$elm$core$Platform$Cmd$none),
			$elm$core$Maybe$Nothing);
	});
var $author$project$Page$Login$Email = 1;
var $author$project$Page$Login$OTP = 3;
var $author$project$Page$Login$Password = 2;
var $author$project$Page$Login$validator = $rtfeldman$elm_validate$Validate$all(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.bb;
			},
			_Utils_Tuple2(1, 'You must enter a username')),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.a3;
			},
			_Utils_Tuple2(2, 'You must enter a password')),
			A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			function (m) {
				return m.av && _Utils_eq(
					A2($elm$core$Maybe$andThen, $elm$core$String$toInt, m.b8),
					$elm$core$Maybe$Nothing);
			},
			_Utils_Tuple2(3, 'You must enter a number for the one-time password'))
		]));
var $author$project$Page$Login$update = F3(
	function (msg, model, loginRequest) {
		switch (msg.$) {
			case 0:
				var _v1 = A2($rtfeldman$elm_validate$Validate$validate, $author$project$Page$Login$validator, model);
				if (_v1.$ === 1) {
					var errors = _v1.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: errors}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				} else {
					return (!model.R) ? _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: _List_Nil, R: 1}),
							A2(
								$elm$http$Http$send,
								$author$project$Page$Login$LoginCompleted,
								A3(
									loginRequest,
									$elm$core$String$trim(model.bb),
									model.a3,
									A2($elm$core$Maybe$map, $elm$core$String$trim, model.b8)))),
						$elm$core$Maybe$Nothing) : _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				}
			case 1:
				var username = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{bb: username}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 2:
				var password = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{a3: password}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 3:
				var otp = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								b8: $elm$core$Maybe$Just(otp)
							}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			default:
				if (msg.a.$ === 1) {
					if (msg.a.a.$ === 3) {
						var error = msg.a.a;
						var response = error.a;
						var _v2 = response.ek.c1;
						switch (_v2) {
							case 401:
								return A2($author$project$Page$Login$loginError, 'Login failed. Check your username and password', model);
							case 403:
								return A2($author$project$Page$Login$loginError, 'Please wait till your account is enabled before signing in', model);
							case 429:
								return A2($author$project$Page$Login$loginError, 'The login server is a bit busy. Please try again', model);
							case 461:
								return _Utils_Tuple2(
									_Utils_Tuple2(
										_Utils_update(
											model,
											{av: true, R: 0}),
										$elm$core$Platform$Cmd$none),
									$elm$core$Maybe$Nothing);
							default:
								return A2(
									$author$project$Page$Login$loginError,
									$author$project$Util$defaultHttpErrorMsg(error),
									model);
						}
					} else {
						var error = msg.a.a;
						return A2(
							$author$project$Page$Login$loginError,
							$author$project$Util$defaultHttpErrorMsg(error),
							model);
					}
				} else {
					var user = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{R: 2}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Just(user));
				}
		}
	});
var $author$project$Page$Register$AwaitingPwnedResponse = 1;
var $author$project$Page$Register$Completed = 3;
var $author$project$Page$Register$Form = 0;
var $author$project$Page$Register$PwnedResults = function (a) {
	return {$: 9, a: a};
};
var $elm$http$Http$expectString = $elm$http$Http$expectStringResponse(
	function (response) {
		return $elm$core$Result$Ok(response.a);
	});
var $elm$http$Http$getString = function (url) {
	return $elm$http$Http$request(
		{a: $elm$http$Http$emptyBody, b: $elm$http$Http$expectString, c: _List_Nil, d: 'GET', e: $elm$core$Maybe$Nothing, f: url, g: false});
};
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = 0;
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Decode$Decoder = $elm$core$Basics$identity;
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (!step.$) {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return A2($elm$bytes$Bytes$Decode$loopHelp, state, callback);
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0;
		return F2(
			function (bites, offset) {
				var _v1 = A2(decodeA, bites, offset);
				var aOffset = _v1.a;
				var a = _v1.b;
				return _Utils_Tuple2(
					aOffset,
					func(a));
			});
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return F2(
		function (_v0, offset) {
			return _Utils_Tuple2(offset, a);
		});
};
var $TSFoster$elm_sha1$SHA1$loopHelp = F2(
	function (step, _v0) {
		var n = _v0.a;
		var state = _v0.b;
		return (n > 0) ? A2(
			$elm$bytes$Bytes$Decode$map,
			function (_new) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(n - 1, _new));
			},
			step(state)) : $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(state));
	});
var $TSFoster$elm_sha1$SHA1$iterate = F3(
	function (n, step, initial) {
		return A2(
			$elm$bytes$Bytes$Decode$loop,
			_Utils_Tuple2(n, initial),
			$TSFoster$elm_sha1$SHA1$loopHelp(step));
	});
var $elm$bytes$Bytes$BE = 1;
var $elm$bytes$Bytes$Encode$Bytes = function (a) {
	return {$: 10, a: a};
};
var $elm$bytes$Bytes$Encode$bytes = $elm$bytes$Bytes$Encode$Bytes;
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 3, a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $elm$bytes$Bytes$width = _Bytes_width;
var $TSFoster$elm_sha1$SHA1$padBuffer = function (bytes) {
	var byteCount = $elm$bytes$Bytes$width(bytes);
	var paddingSize = 4 + A2(
		$elm$core$Basics$modBy,
		64,
		56 - A2($elm$core$Basics$modBy, 64, byteCount + 1));
	var message = $elm$bytes$Bytes$Encode$encode(
		$elm$bytes$Bytes$Encode$sequence(
			_List_fromArray(
				[
					$elm$bytes$Bytes$Encode$bytes(bytes),
					$elm$bytes$Bytes$Encode$unsignedInt8(128),
					$elm$bytes$Bytes$Encode$sequence(
					A2(
						$elm$core$List$repeat,
						paddingSize,
						$elm$bytes$Bytes$Encode$unsignedInt8(0))),
					A2($elm$bytes$Bytes$Encode$unsignedInt32, 1, byteCount << 3)
				])));
	return message;
};
var $elm$bytes$Bytes$Decode$map4 = F5(
	function (func, _v0, _v1, _v2, _v3) {
		var decodeA = _v0;
		var decodeB = _v1;
		var decodeC = _v2;
		var decodeD = _v3;
		return F2(
			function (bites, offset) {
				var _v4 = A2(decodeA, bites, offset);
				var aOffset = _v4.a;
				var a = _v4.b;
				var _v5 = A2(decodeB, bites, aOffset);
				var bOffset = _v5.a;
				var b = _v5.b;
				var _v6 = A2(decodeC, bites, bOffset);
				var cOffset = _v6.a;
				var c = _v6.b;
				var _v7 = A2(decodeD, bites, cOffset);
				var dOffset = _v7.a;
				var d = _v7.b;
				return _Utils_Tuple2(
					dOffset,
					A4(func, a, b, c, d));
			});
	});
var $elm$bytes$Bytes$Decode$map5 = F6(
	function (func, _v0, _v1, _v2, _v3, _v4) {
		var decodeA = _v0;
		var decodeB = _v1;
		var decodeC = _v2;
		var decodeD = _v3;
		var decodeE = _v4;
		return F2(
			function (bites, offset) {
				var _v5 = A2(decodeA, bites, offset);
				var aOffset = _v5.a;
				var a = _v5.b;
				var _v6 = A2(decodeB, bites, aOffset);
				var bOffset = _v6.a;
				var b = _v6.b;
				var _v7 = A2(decodeC, bites, bOffset);
				var cOffset = _v7.a;
				var c = _v7.b;
				var _v8 = A2(decodeD, bites, cOffset);
				var dOffset = _v8.a;
				var d = _v8.b;
				var _v9 = A2(decodeE, bites, dOffset);
				var eOffset = _v9.a;
				var e = _v9.b;
				return _Utils_Tuple2(
					eOffset,
					A5(func, a, b, c, d, e));
			});
	});
var $TSFoster$elm_sha1$SHA1$map16 = function (f) {
	return function (b1) {
		return function (b2) {
			return function (b3) {
				return function (b4) {
					return function (b5) {
						return function (b6) {
							return function (b7) {
								return function (b8) {
									return function (b9) {
										return function (b10) {
											return function (b11) {
												return function (b12) {
													return function (b13) {
														return function (b14) {
															return function (b15) {
																return function (b16) {
																	var d1 = A5(
																		$elm$bytes$Bytes$Decode$map4,
																		F4(
																			function (a, b, c, d) {
																				return A4(f, a, b, c, d);
																			}),
																		b1,
																		b2,
																		b3,
																		b4);
																	var d2 = A6(
																		$elm$bytes$Bytes$Decode$map5,
																		F5(
																			function (h, a, b, c, d) {
																				return A4(h, a, b, c, d);
																			}),
																		d1,
																		b5,
																		b6,
																		b7,
																		b8);
																	var d3 = A6(
																		$elm$bytes$Bytes$Decode$map5,
																		F5(
																			function (h, a, b, c, d) {
																				return A4(h, a, b, c, d);
																			}),
																		d2,
																		b9,
																		b10,
																		b11,
																		b12);
																	var d4 = A6(
																		$elm$bytes$Bytes$Decode$map5,
																		F5(
																			function (h, a, b, c, d) {
																				return A4(h, a, b, c, d);
																			}),
																		d3,
																		b13,
																		b14,
																		b15,
																		b16);
																	return d4;
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $TSFoster$elm_sha1$SHA1$DeltaState = $elm$core$Basics$identity;
var $TSFoster$elm_sha1$SHA1$State = $elm$core$Basics$identity;
var $TSFoster$elm_sha1$SHA1$rotateLeftBy = F2(
	function (amount, i) {
		return ((i >>> (32 - amount)) | (i << amount)) >>> 0;
	});
var $TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk = F3(
	function (index, _int, _v0) {
		var a = _v0.x;
		var b = _v0.y;
		var c = _v0.z;
		var d = _v0.A;
		var e = _v0.B;
		var shiftedA = (a >>> (32 - 5)) | (a << 5);
		var f = function () {
			var _v1 = (index / 20) | 0;
			switch (_v1) {
				case 0:
					return ((b & c) | ((~b) & d)) + 1518500249;
				case 1:
					return (b ^ (c ^ d)) + 1859775393;
				case 2:
					return ((b & (c | d)) | (c & d)) + 2400959708;
				default:
					return (b ^ (c ^ d)) + 3395469782;
			}
		}();
		var newA = (((shiftedA + f) + e) + _int) >>> 0;
		return {
			x: newA,
			y: a,
			z: A2($TSFoster$elm_sha1$SHA1$rotateLeftBy, 30, b),
			A: c,
			B: d
		};
	});
var $TSFoster$elm_sha1$SHA1$calculateDigestDeltas = function (remaining) {
	return function (index) {
		return function (a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (v1) {
								return function (v2) {
									return function (v3) {
										return function (v4) {
											return function (v5) {
												return function (v6) {
													return function (v7) {
														return function (v8) {
															calculateDigestDeltas:
															while (true) {
																if (!remaining) {
																	return {x: a, y: b, z: c, A: d, B: e};
																} else {
																	var shiftedA = (a >>> (32 - 5)) | (a << 5);
																	var _int = v1;
																	var f = function () {
																		var _v0 = (index / 20) | 0;
																		switch (_v0) {
																			case 0:
																				return ((b & c) | ((~b) & d)) + 1518500249;
																			case 1:
																				return (b ^ (c ^ d)) + 1859775393;
																			case 2:
																				return ((b & (c | d)) | (c & d)) + 2400959708;
																			default:
																				return (b ^ (c ^ d)) + 3395469782;
																		}
																	}();
																	var newA = (((shiftedA + f) + e) + _int) >>> 0;
																	var $temp$remaining = remaining - 1,
																		$temp$index = index + 1,
																		$temp$a = newA,
																		$temp$b = a,
																		$temp$c = A2($TSFoster$elm_sha1$SHA1$rotateLeftBy, 30, b),
																		$temp$d = c,
																		$temp$e = d,
																		$temp$v1 = v2,
																		$temp$v2 = v3,
																		$temp$v3 = v4,
																		$temp$v4 = v5,
																		$temp$v5 = v6,
																		$temp$v6 = v7,
																		$temp$v7 = v8,
																		$temp$v8 = 0;
																	remaining = $temp$remaining;
																	index = $temp$index;
																	a = $temp$a;
																	b = $temp$b;
																	c = $temp$c;
																	d = $temp$d;
																	e = $temp$e;
																	v1 = $temp$v1;
																	v2 = $temp$v2;
																	v3 = $temp$v3;
																	v4 = $temp$v4;
																	v5 = $temp$v5;
																	v6 = $temp$v6;
																	v7 = $temp$v7;
																	v8 = $temp$v8;
																	continue calculateDigestDeltas;
																}
															}
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $TSFoster$elm_sha1$SHA1$rotateLeftBy1 = function (i) {
	return (i >>> 31) | (i << 1);
};
var $TSFoster$elm_sha1$SHA1$reduceWords = function (i) {
	return function (deltaState) {
		return function (b16) {
			return function (b15) {
				return function (b14) {
					return function (b13) {
						return function (b12) {
							return function (b11) {
								return function (b10) {
									return function (b9) {
										return function (b8) {
											return function (b7) {
												return function (b6) {
													return function (b5) {
														return function (b4) {
															return function (b3) {
																return function (b2) {
																	return function (b1) {
																		reduceWords:
																		while (true) {
																			var a = deltaState.x;
																			var b = deltaState.y;
																			var c = deltaState.z;
																			var d = deltaState.A;
																			var e = deltaState.B;
																			if (i !== 64) {
																				var value3 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b14 ^ (b12 ^ (b6 ^ b1)));
																				var value6 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b11 ^ (b9 ^ (b3 ^ value3)));
																				var value2 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b15 ^ (b13 ^ (b7 ^ b2)));
																				var value5 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b12 ^ (b10 ^ (b4 ^ value2)));
																				var value8 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b9 ^ (b7 ^ (b1 ^ value5)));
																				var value1 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b16 ^ (b14 ^ (b8 ^ b3)));
																				var value4 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b13 ^ (b11 ^ (b5 ^ value1)));
																				var value7 = $TSFoster$elm_sha1$SHA1$rotateLeftBy1(b10 ^ (b8 ^ (b2 ^ value4)));
																				var newState = $TSFoster$elm_sha1$SHA1$calculateDigestDeltas(8)(i + 16)(a)(b)(c)(d)(e)(value1)(value2)(value3)(value4)(value5)(value6)(value7)(value8);
																				var $temp$i = i + 8,
																					$temp$deltaState = newState,
																					$temp$b16 = b8,
																					$temp$b15 = b7,
																					$temp$b14 = b6,
																					$temp$b13 = b5,
																					$temp$b12 = b4,
																					$temp$b11 = b3,
																					$temp$b10 = b2,
																					$temp$b9 = b1,
																					$temp$b8 = value1,
																					$temp$b7 = value2,
																					$temp$b6 = value3,
																					$temp$b5 = value4,
																					$temp$b4 = value5,
																					$temp$b3 = value6,
																					$temp$b2 = value7,
																					$temp$b1 = value8;
																				i = $temp$i;
																				deltaState = $temp$deltaState;
																				b16 = $temp$b16;
																				b15 = $temp$b15;
																				b14 = $temp$b14;
																				b13 = $temp$b13;
																				b12 = $temp$b12;
																				b11 = $temp$b11;
																				b10 = $temp$b10;
																				b9 = $temp$b9;
																				b8 = $temp$b8;
																				b7 = $temp$b7;
																				b6 = $temp$b6;
																				b5 = $temp$b5;
																				b4 = $temp$b4;
																				b3 = $temp$b3;
																				b2 = $temp$b2;
																				b1 = $temp$b1;
																				continue reduceWords;
																			} else {
																				return deltaState;
																			}
																		}
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $TSFoster$elm_sha1$SHA1$reduceChunkHelp = function (_v0) {
	return function (b1) {
		return function (b2) {
			return function (b3) {
				return function (b4) {
					return function (b5) {
						return function (b6) {
							return function (b7) {
								return function (b8) {
									return function (b9) {
										return function (b10) {
											return function (b11) {
												return function (b12) {
													return function (b13) {
														return function (b14) {
															return function (b15) {
																return function (b16) {
																	var initial = _v0;
																	var initialDeltaState = A3(
																		$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																		15,
																		b16,
																		A3(
																			$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																			14,
																			b15,
																			A3(
																				$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																				13,
																				b14,
																				A3(
																					$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																					12,
																					b13,
																					A3(
																						$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																						11,
																						b12,
																						A3(
																							$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																							10,
																							b11,
																							A3(
																								$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																								9,
																								b10,
																								A3(
																									$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																									8,
																									b9,
																									A3(
																										$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																										7,
																										b8,
																										A3(
																											$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																											6,
																											b7,
																											A3(
																												$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																												5,
																												b6,
																												A3(
																													$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																													4,
																													b5,
																													A3(
																														$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																														3,
																														b4,
																														A3(
																															$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																															2,
																															b3,
																															A3(
																																$TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk,
																																1,
																																b2,
																																A3($TSFoster$elm_sha1$SHA1$calculateDigestDeltasChunk, 0, b1, initial))))))))))))))));
																	var _v1 = $TSFoster$elm_sha1$SHA1$reduceWords(0)(initialDeltaState)(b1)(b2)(b3)(b4)(b5)(b6)(b7)(b8)(b9)(b10)(b11)(b12)(b13)(b14)(b15)(b16);
																	var a = _v1.x;
																	var b = _v1.y;
																	var c = _v1.z;
																	var d = _v1.A;
																	var e = _v1.B;
																	return {x: initial.x + a, y: initial.y + b, z: initial.z + c, A: initial.A + d, B: initial.B + e};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $elm$bytes$Bytes$Decode$unsignedInt32 = function (endianness) {
	return _Bytes_read_u32(!endianness);
};
var $TSFoster$elm_sha1$SHA1$u32 = $elm$bytes$Bytes$Decode$unsignedInt32(1);
var $TSFoster$elm_sha1$SHA1$reduceChunk = function (state) {
	return $TSFoster$elm_sha1$SHA1$map16(
		$TSFoster$elm_sha1$SHA1$reduceChunkHelp(state))($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32)($TSFoster$elm_sha1$SHA1$u32);
};
var $TSFoster$elm_sha1$SHA1$Digest = $elm$core$Basics$identity;
var $TSFoster$elm_sha1$SHA1$stateToDigest = function (_v0) {
	var a = _v0.x;
	var b = _v0.y;
	var c = _v0.z;
	var d = _v0.A;
	var e = _v0.B;
	return {x: a >>> 0, y: b >>> 0, z: c >>> 0, A: d >>> 0, B: e >>> 0};
};
var $TSFoster$elm_sha1$SHA1$hashBytes = F2(
	function (state, bytes) {
		var message = $TSFoster$elm_sha1$SHA1$padBuffer(bytes);
		var numberOfChunks = ($elm$bytes$Bytes$width(message) / 64) | 0;
		var hashState = A3($TSFoster$elm_sha1$SHA1$iterate, numberOfChunks, $TSFoster$elm_sha1$SHA1$reduceChunk, state);
		return $TSFoster$elm_sha1$SHA1$stateToDigest(
			A2(
				$elm$core$Maybe$withDefault,
				state,
				A2($elm$bytes$Bytes$Decode$decode, hashState, message)));
	});
var $TSFoster$elm_sha1$SHA1$Tuple5 = F5(
	function (a, b, c, d, e) {
		return {x: a, y: b, z: c, A: d, B: e};
	});
var $TSFoster$elm_sha1$SHA1$initialState = A5($TSFoster$elm_sha1$SHA1$Tuple5, 1732584193, 4023233417, 2562383102, 271733878, 3285377520);
var $elm$bytes$Bytes$Encode$Utf8 = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$string = function (str) {
	return A2(
		$elm$bytes$Bytes$Encode$Utf8,
		_Bytes_getStringWidth(str),
		str);
};
var $TSFoster$elm_sha1$SHA1$fromString = A2(
	$elm$core$Basics$composeL,
	A2(
		$elm$core$Basics$composeL,
		$TSFoster$elm_sha1$SHA1$hashBytes($TSFoster$elm_sha1$SHA1$initialState),
		$elm$bytes$Bytes$Encode$encode),
	$elm$bytes$Bytes$Encode$string);
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $TSFoster$elm_sha1$SHA1$wordToHex = function (_byte) {
	return A3(
		$elm$core$String$padLeft,
		8,
		'0',
		$rtfeldman$elm_hex$Hex$toString(_byte));
};
var $TSFoster$elm_sha1$SHA1$toHex = function (_v0) {
	var a = _v0.x;
	var b = _v0.y;
	var c = _v0.z;
	var d = _v0.A;
	var e = _v0.B;
	return _Utils_ap(
		$TSFoster$elm_sha1$SHA1$wordToHex(a),
		_Utils_ap(
			$TSFoster$elm_sha1$SHA1$wordToHex(b),
			_Utils_ap(
				$TSFoster$elm_sha1$SHA1$wordToHex(c),
				_Utils_ap(
					$TSFoster$elm_sha1$SHA1$wordToHex(d),
					$TSFoster$elm_sha1$SHA1$wordToHex(e)))));
};
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$Page$Register$sha1 = function (s) {
	return $elm$core$String$toUpper(
		$TSFoster$elm_sha1$SHA1$toHex(
			$TSFoster$elm_sha1$SHA1$fromString(s)));
};
var $author$project$Page$Register$getPwnedMatches = function (password) {
	return A2(
		$elm$http$Http$send,
		$author$project$Page$Register$PwnedResults,
		$elm$http$Http$getString(
			'https://api.pwnedpasswords.com/range/' + A2(
				$elm$core$String$left,
				5,
				$author$project$Page$Register$sha1(password))));
};
var $author$project$Page$Register$One = {$: 1};
var $author$project$Page$Register$Pwned = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Register$Zero = {$: 0};
var $elm$core$String$lines = _String_lines;
var $author$project$Page$Register$pwnedCountFromResponse = F2(
	function (password, response) {
		var suffix = A2(
			$elm$core$String$dropLeft,
			5,
			$author$project$Page$Register$sha1(password));
		var match = A2(
			$elm$core$Maybe$andThen,
			$elm$core$String$toInt,
			A2(
				$elm$core$Maybe$map,
				$elm$core$String$dropLeft(36),
				$elm$core$List$head(
					A2(
						$elm$core$List$filter,
						$elm$core$String$startsWith(suffix),
						$elm$core$String$lines(response)))));
		if (match.$ === 1) {
			return $author$project$Page$Register$Zero;
		} else {
			if (match.a === 1) {
				return $author$project$Page$Register$One;
			} else {
				var count = match.a;
				return $author$project$Page$Register$Pwned(count);
			}
		}
	});
var $author$project$Page$Register$AwaitingResponse = 2;
var $author$project$Page$Register$RegisterResponse = function (a) {
	return {$: 8, a: a};
};
var $author$project$Api$Registration = F5(
	function (email, code, schoolName, teacherName, password) {
		return {c1: code, bR: email, a3: password, cp: schoolName, cD: teacherName};
	});
var $author$project$Api$encodeRegistration = function (x) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'email',
				$elm$json$Json$Encode$string(x.bR)),
				_Utils_Tuple2(
				'code',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$withDefault($elm$json$Json$Encode$null),
					$elm$core$Maybe$map($elm$json$Json$Encode$string))(x.c1)),
				_Utils_Tuple2(
				'tenant_name',
				$elm$json$Json$Encode$string(x.cp)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(x.cD)),
				_Utils_Tuple2(
				'password',
				$elm$json$Json$Encode$string(x.a3))
			]));
};
var $author$project$Api$postAccountRegister = F2(
	function (header_Authorization, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$author$project$Api$encodeRegistration(body)),
				b: $elm$http$Http$expectStringResponse(
					function (res) {
						return $elm$core$String$isEmpty(res.a) ? $elm$core$Result$Ok(0) : $elm$core$Result$Err('Expected the response body to be empty');
					}),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: $author$project$Api$apiUrl + '/account/register',
				g: true
			});
	});
var $author$project$Page$Register$sendForm = F2(
	function (model, session) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{ai: _List_Nil, ek: 2}),
			A2(
				$elm$http$Http$send,
				$author$project$Page$Register$RegisterResponse,
				A2(
					$author$project$Api$postAccountRegister,
					$author$project$Data$Session$authorization(session),
					A5($author$project$Api$Registration, model.bR, model.c1, model.cp, model.cD, model.a3))));
	});
var $author$project$Page$Register$Password = 4;
var $author$project$Page$Register$validatePwned = function (pwned) {
	switch (pwned.$) {
		case 0:
			return _List_Nil;
		case 1:
			return _List_fromArray(
				[
					_Utils_Tuple2(4, 'Insecure password (found in a compromised database)!')
				]);
		case 2:
			var n = pwned.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					4,
					'Insecure password (found ' + ($elm$core$String$fromInt(n) + ' times in compromised databases)!'))
				]);
		default:
			return _List_Nil;
	}
};
var $author$project$Page$Register$Email = 3;
var $author$project$Page$Register$SchoolName = 1;
var $author$project$Page$Register$TeacherName = 2;
var $rtfeldman$elm_validate$Validate$fromErrors = function (toErrors) {
	return toErrors;
};
var $rtfeldman$elm_validate$Validate$validEmail = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	A2(
		$elm$regex$Regex$fromStringWith,
		{cW: true, dK: false},
		'^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'));
var $rtfeldman$elm_validate$Validate$isValidEmail = function (email) {
	return A2($elm$regex$Regex$contains, $rtfeldman$elm_validate$Validate$validEmail, email);
};
var $rtfeldman$elm_validate$Validate$ifInvalidEmail = F2(
	function (subjectToEmail, errorFromEmail) {
		var getErrors = function (subject) {
			var email = subjectToEmail(subject);
			return $rtfeldman$elm_validate$Validate$isValidEmail(email) ? _List_Nil : _List_fromArray(
				[
					errorFromEmail(email)
				]);
		};
		return getErrors;
	});
var $author$project$Page$Register$validatePassword = function (_v0) {
	var password = _v0.a3;
	var confirmPassword = _v0.aW;
	if (password === '') {
		return _List_fromArray(
			[
				_Utils_Tuple2(4, 'password can\'t be blank')
			]);
	} else {
		return (!_Utils_eq(password, confirmPassword)) ? _List_fromArray(
			[
				_Utils_Tuple2(0, 'the passwords must be the same')
			]) : (($elm$core$String$length(password) < 8) ? _List_fromArray(
			[
				_Utils_Tuple2(4, 'password must be at least 8 characters')
			]) : _List_Nil);
	}
};
var $author$project$Page$Register$validator = $rtfeldman$elm_validate$Validate$all(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.cp;
			},
			_Utils_Tuple2(1, 'school name can\'t be blank.')),
			A2(
			$rtfeldman$elm_validate$Validate$ifInvalidEmail,
			function ($) {
				return $.bR;
			},
			function (_v0) {
				return _Utils_Tuple2(3, 'please enter a valid email.');
			}),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.cD;
			},
			_Utils_Tuple2(2, 'name can\'t be blank.')),
			$rtfeldman$elm_validate$Validate$fromErrors($author$project$Page$Register$validatePassword)
		]));
var $author$project$Page$Register$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = A2($rtfeldman$elm_validate$Validate$validate, $author$project$Page$Register$validator, model);
				if (_v1.$ === 1) {
					var errors = _v1.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ai: errors}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ai: _List_Nil, ek: 1}),
						$author$project$Page$Register$getPwnedMatches(model.a3));
				}
			case 1:
				var email = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bR: email}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var code = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							c1: $elm$core$Maybe$Just(code),
							cp: code
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cp: name}),
					$elm$core$Platform$Cmd$none);
			case 5:
				var name = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{cD: name}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var password = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a3: password}),
					$elm$core$Platform$Cmd$none);
			case 7:
				var password = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aW: password}),
					$elm$core$Platform$Cmd$none);
			case 4:
				var t = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aa: $elm$core$Maybe$Just(t)
						}),
					$elm$core$Platform$Cmd$none);
			case 8:
				if (msg.a.$ === 1) {
					var error = msg.a.a;
					var errorMessages = function () {
						if (error.$ === 3) {
							var status = error.a.ek;
							var _v3 = status.c1;
							switch (_v3) {
								case 409:
									return _List_fromArray(
										['Account already registered']);
								case 403:
									return _List_fromArray(
										['The registration code was not found or may have expired']);
								default:
									return _List_fromArray(
										['There was an error during registration']);
							}
						} else {
							return _List_fromArray(
								[
									$author$project$Util$defaultHttpErrorMsg(error)
								]);
						}
					}();
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ai: A2(
									$elm$core$List$map,
									function (errorMessage) {
										return _Utils_Tuple2(0, errorMessage);
									},
									errorMessages),
								ek: 0
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ek: 3}),
						$elm$core$Platform$Cmd$none);
				}
			default:
				if (msg.a.$ === 1) {
					return A2($author$project$Page$Register$sendForm, model, session);
				} else {
					var matches = msg.a.a;
					var pwnedCount = A2($author$project$Page$Register$pwnedCountFromResponse, model.a3, matches);
					var errors = $author$project$Page$Register$validatePwned(pwnedCount);
					return _Utils_eq(errors, _List_Nil) ? A2($author$project$Page$Register$sendForm, model, session) : _Utils_Tuple2(
						_Utils_update(
							model,
							{ai: errors, ek: 0}),
						$elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Page$Story$AnswersFormMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Ports$printWindow = _Platform_outgoingPort(
	'printWindow',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Page$Story$resetAnswersForm = function (m) {
	var _v0 = m.L;
	if (_v0.$ === 1) {
		return m;
	} else {
		var f = _v0.a;
		return _Utils_update(
			m,
			{
				L: $elm$core$Maybe$Just(
					$author$project$AnswersForm$init(
						function ($) {
							return $.a7;
						}(f)))
			});
	}
};
var $author$project$Data$Session$storyCompleted = F2(
	function (_v0, answer) {
		var session = _v0;
		var newWorkQueue = A2(
			$elm$core$List$filter,
			function (s) {
				return !_Utils_eq(s.dl, answer.ct);
			},
			session.w);
		var cache = session.s;
		var newCache = _Utils_update(
			cache,
			{
				cQ: A3($elm$core$Dict$insert, answer.ct, answer, cache.cQ)
			});
		return _Utils_update(
			session,
			{s: newCache, w: newWorkQueue});
	});
var $author$project$Page$Story$storyCompleted = F4(
	function (session, cmd, answer, model) {
		var newModel = _Utils_update(
			model,
			{
				cQ: A2($elm$core$List$cons, answer, model.cQ),
				L: $elm$core$Maybe$Nothing
			});
		return _Utils_Tuple2(
			_Utils_Tuple2(
				newModel,
				A2($elm$core$Platform$Cmd$map, $author$project$Page$Story$AnswersFormMsg, cmd)),
			A2($author$project$Data$Session$storyCompleted, session, answer));
	});
var $author$project$AnswersForm$Form = 0;
var $author$project$AnswersForm$BreakDown = 1;
var $author$project$AnswersForm$ReadAround = 0;
var $author$project$AnswersForm$Substitution = 2;
var $author$project$AnswersForm$toString = function (c) {
	switch (c) {
		case 0:
			return 'ReadAround';
		case 1:
			return 'BreakDown';
		default:
			return ' Substitution';
	}
};
var $author$project$AnswersForm$clarificationOptions = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(
			$author$project$AnswersForm$toString(0),
			0),
			_Utils_Tuple2(
			$author$project$AnswersForm$toString(1),
			1),
			_Utils_Tuple2(
			$author$project$AnswersForm$toString(2),
			2)
		]));
var $author$project$AnswersForm$SubmitAnswersResponse = function (a) {
	return {$: 7, a: a};
};
var $author$project$Api$encodeAnswer = function (x) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'story_id',
				$elm$json$Json$Encode$int(x.ct)),
				_Utils_Tuple2(
				'student_id',
				$elm$json$Json$Encode$string(x.a9)),
				_Utils_Tuple2(
				'connect',
				$elm$json$Json$Encode$string(x.bK)),
				_Utils_Tuple2(
				'question',
				$elm$json$Json$Encode$string(x.Q)),
				_Utils_Tuple2(
				'summarise',
				$elm$json$Json$Encode$string(x.cA)),
				_Utils_Tuple2(
				'clarify',
				$elm$json$Json$Encode$string(x.bJ)),
				_Utils_Tuple2(
				'created_at',
				$elm$json$Json$Encode$int(x.as))
			]));
};
var $author$project$Api$postSchoolAnswers = F2(
	function (header_Authorization, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$author$project$Api$encodeAnswer(body)),
				b: $elm$http$Http$expectJson($author$project$Api$decodeAnswer),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: $author$project$Api$apiUrl + '/school/answers',
				g: true
			});
	});
var $author$project$AnswersForm$submitAnswers = F2(
	function (session, model) {
		var studentId = A2(
			$elm$core$Maybe$withDefault,
			'',
			$author$project$Data$Session$subjectId(session));
		var answer = A7(
			$author$project$Api$Answer,
			function ($) {
				return $.dl;
			}(model.a7),
			studentId,
			model.M,
			model.Q,
			model.S,
			model.U,
			1);
		return A2(
			$elm$http$Http$send,
			$author$project$AnswersForm$SubmitAnswersResponse,
			A2(
				$author$project$Api$postSchoolAnswers,
				$author$project$Data$Session$authorization(session),
				answer));
	});
var $author$project$AnswersForm$trim = function (m) {
	return _Utils_update(
		m,
		{
			U: $elm$core$String$trim(m.U),
			M: $elm$core$String$trim(m.M),
			Q: $elm$core$String$trim(m.Q),
			S: $elm$core$String$trim(m.S)
		});
};
var $author$project$AnswersForm$Clarification = 4;
var $author$project$AnswersForm$ClarificationMethod = 5;
var $author$project$AnswersForm$Connection = 1;
var $author$project$AnswersForm$Question = 2;
var $author$project$AnswersForm$Summary = 3;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{cW: false, dK: false},
		string);
};
var $author$project$AnswersForm$ifNotSentence = function (f) {
	var notSentence = A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		$elm$regex$Regex$fromString('^\\s*\\S+\\s*$'));
	return $rtfeldman$elm_validate$Validate$ifTrue(
		function (m) {
			return A2(
				$elm$regex$Regex$contains,
				notSentence,
				f(m));
		});
};
var $rtfeldman$elm_validate$Validate$ifNothing = F2(
	function (subjectToMaybe, error) {
		return A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			function (subject) {
				return _Utils_eq(
					subjectToMaybe(subject),
					$elm$core$Maybe$Nothing);
			},
			error);
	});
var $author$project$AnswersForm$ifTooLong = F2(
	function (f, field) {
		return A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			function (m) {
				return $elm$core$String$length(
					f(m)) > 250;
			},
			_Utils_Tuple2(field, 'The answer can\'t be longer than 250 characters'));
	});
var $author$project$AnswersForm$naughtyWordsCheck = function (m) {
	var naughtyWord = A2(
		$elm$core$Maybe$withDefault,
		$elm$regex$Regex$never,
		A2(
			$elm$regex$Regex$fromStringWith,
			{cW: true, dK: false},
			'fuc*k+|bastard|bugger\\b|\\bshite*\\b'));
	var hasNaughtyWord = A3(
		$elm$core$List$foldl,
		$elm$core$Basics$or,
		false,
		A2(
			$elm$core$List$map,
			$elm$regex$Regex$contains(naughtyWord),
			_List_fromArray(
				[m.M, m.Q, m.S, m.U])));
	return hasNaughtyWord ? _List_fromArray(
		[
			_Utils_Tuple2(0, 'Sorry, that\'s not allowed')
		]) : _List_Nil;
};
var $author$project$AnswersForm$validator = $rtfeldman$elm_validate$Validate$all(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.M;
			},
			_Utils_Tuple2(1, 'Please fill in your connection with the story')),
			A2(
			$author$project$AnswersForm$ifNotSentence,
			function ($) {
				return $.M;
			},
			_Utils_Tuple2(1, 'Please write a sentence for your connection with the story')),
			A2(
			$author$project$AnswersForm$ifTooLong,
			function ($) {
				return $.M;
			},
			1),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.Q;
			},
			_Utils_Tuple2(2, 'Please enter a question about the story')),
			A2(
			$author$project$AnswersForm$ifNotSentence,
			function ($) {
				return $.Q;
			},
			_Utils_Tuple2(2, 'Please write a sentence for your question')),
			A2(
			$author$project$AnswersForm$ifTooLong,
			function ($) {
				return $.Q;
			},
			2),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.S;
			},
			_Utils_Tuple2(3, 'Please write your summary sentence for the story')),
			A2(
			$author$project$AnswersForm$ifNotSentence,
			function ($) {
				return $.S;
			},
			_Utils_Tuple2(3, 'Please the summary as a sentence')),
			A2(
			$author$project$AnswersForm$ifTooLong,
			function ($) {
				return $.S;
			},
			3),
			A2(
			$rtfeldman$elm_validate$Validate$ifBlank,
			function ($) {
				return $.U;
			},
			_Utils_Tuple2(4, 'Please fill in the meaning of the word')),
			A2(
			$author$project$AnswersForm$ifNotSentence,
			function ($) {
				return $.U;
			},
			_Utils_Tuple2(4, 'Please write a sentence for the meaning of the word')),
			A2(
			$rtfeldman$elm_validate$Validate$ifNothing,
			function ($) {
				return $.aD;
			},
			_Utils_Tuple2(5, 'Please select the clarification method you used')),
			$rtfeldman$elm_validate$Validate$fromErrors($author$project$AnswersForm$naughtyWordsCheck)
		]));
var $author$project$AnswersForm$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 1:
				var _v1 = A2(
					$rtfeldman$elm_validate$Validate$validate,
					$author$project$AnswersForm$validator,
					$author$project$AnswersForm$trim(model));
				if (_v1.$ === 1) {
					var errors = _v1.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: errors}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: _List_Nil, aj: true}),
							A2(
								$author$project$AnswersForm$submitAnswers,
								session,
								$author$project$AnswersForm$trim(model))),
						$elm$core$Maybe$Nothing);
				}
			case 2:
				var connection = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{M: connection}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 3:
				var question = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{Q: question}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 4:
				var summary = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{S: summary}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 5:
				var clarification = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{U: clarification}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 6:
				var cm = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								aD: A2($elm$core$Dict$get, cm, $author$project$AnswersForm$clarificationOptions)
							}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 0:
				var d = msg.a;
				return _Utils_eq(
					model.aw,
					$elm$core$Maybe$Just(d)) ? _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aw: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing) : _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								aw: $elm$core$Maybe$Just(d)
							}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			default:
				if (!msg.a.$) {
					var answer = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Just(answer));
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _Utils_ap(
										model.ai,
										_List_fromArray(
											[
												_Utils_Tuple2(0, 'Server error while trying to submit answers')
											])),
									aj: false
								}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				}
		}
	});
var $author$project$Page$Story$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				var svm = msg.a;
				var _v1 = A2($author$project$Views$Story$update, svm, model.aO);
				var newStoryView = _v1.a;
				var cmd = _v1.b;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aO: newStoryView}),
						A2($elm$core$Platform$Cmd$map, $author$project$Page$Story$StoryViewMsg, cmd)),
					session);
			case 2:
				var _v2 = msg.a;
				var w = _v2.a;
				var i = _v2.b;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								aZ: $elm$core$Maybe$Just(
									A2($author$project$Api$DictEntry, w, i))
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 1:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						$author$project$Ports$printWindow(0)),
					session);
			case 3:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						$author$project$Page$Story$resetAnswersForm(model),
						$elm$core$Platform$Cmd$none),
					session);
			default:
				var subMsg = msg.a;
				var _v3 = A2(
					$elm$core$Maybe$map,
					A2($author$project$AnswersForm$update, session, subMsg),
					model.L);
				if (_v3.$ === 1) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					if (_v3.a.b.$ === 1) {
						var _v4 = _v3.a;
						var _v5 = _v4.a;
						var subModel = _v5.a;
						var cmd = _v5.b;
						var _v6 = _v4.b;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{
										L: $elm$core$Maybe$Just(subModel)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Page$Story$AnswersFormMsg, cmd)),
							session);
					} else {
						var _v7 = _v3.a;
						var _v8 = _v7.a;
						var cmd = _v8.b;
						var submittedAnswer = _v7.b.a;
						return A4($author$project$Page$Story$storyCompleted, session, cmd, submittedAnswer, model);
					}
				}
		}
	});
var $author$project$Page$Student$ChangePasswordMsg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Student$ChangeUsernameMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Student$UndeleteResponse = function (a) {
	return {$: 8, a: a};
};
var $author$project$Page$Student$UpdateStudentResponse = function (a) {
	return {$: 7, a: a};
};
var $author$project$Api$deleteSchoolStudentsByStudentId = F2(
	function (header_Authorization, capture_studentId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectJson($author$project$Api$decodeStudent),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'DELETE',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/students',
							$elm$url$Url$percentEncode(capture_studentId)
						])),
				g: true
			});
	});
var $author$project$Views$ChangePasswordForm$Model = F5(
	function (errors, subject, minLength, password, confirmPassword) {
		return {aW: confirmPassword, ai: errors, b4: minLength, a3: password, cy: subject};
	});
var $author$project$Views$ChangePasswordForm$init = F2(
	function (subjectId, l) {
		return A5($author$project$Views$ChangePasswordForm$Model, _List_Nil, subjectId, l, '', '');
	});
var $author$project$Views$ChangeUsernameForm$Model = F3(
	function (errors, subject, username) {
		return {ai: errors, cy: subject, bb: username};
	});
var $author$project$Views$ChangeUsernameForm$init = function (subjectId) {
	return A3($author$project$Views$ChangeUsernameForm$Model, _List_Nil, subjectId, '');
};
var $author$project$Api$postSchoolStudentsByStudentIdUndelete = F2(
	function (header_Authorization, capture_studentId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectStringResponse(
					function (res) {
						return $elm$core$String$isEmpty(res.a) ? $elm$core$Result$Ok(0) : $elm$core$Result$Err('Expected the response body to be empty');
					}),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/students',
							$elm$url$Url$percentEncode(capture_studentId),
							'undelete'
						])),
				g: true
			});
	});
var $author$project$Api$encodeStudent = function (x) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$string(x.dl)),
				_Utils_Tuple2(
				'name',
				$elm$json$Json$Encode$string(x.a0)),
				_Utils_Tuple2(
				'description',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$withDefault($elm$json$Json$Encode$null),
					$elm$core$Maybe$map($elm$json$Json$Encode$string))(x.aY)),
				_Utils_Tuple2(
				'level',
				$elm$json$Json$Encode$int(x.aF)),
				_Utils_Tuple2(
				'school_id',
				$elm$json$Json$Encode$string(x.ab)),
				_Utils_Tuple2(
				'hidden',
				$elm$json$Json$Encode$bool(x.a_)),
				_Utils_Tuple2(
				'deleted',
				$elm$json$Json$Encode$bool(x.bP)),
				_Utils_Tuple2(
				'created_at',
				$elm$json$Json$Encode$int(x.as))
			]));
};
var $author$project$Api$postSchoolStudentsByStudentId = F3(
	function (header_Authorization, capture_studentId, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$author$project$Api$encodeStudent(body)),
				b: $elm$http$Http$expectJson($author$project$Api$decodeStudent),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/students',
							$elm$url$Url$percentEncode(capture_studentId)
						])),
				g: true
			});
	});
var $author$project$Page$Student$sendUpdateStudent = F2(
	function (session, student) {
		return A2(
			$elm$http$Http$send,
			$author$project$Page$Student$UpdateStudentResponse,
			A3(
				$author$project$Api$postSchoolStudentsByStudentId,
				$author$project$Data$Session$authorization(session),
				student.dl,
				student));
	});
var $author$project$Views$ChangePasswordForm$Completed = 1;
var $author$project$Views$ChangePasswordForm$NoOp = 0;
var $author$project$Views$ChangePasswordForm$PasswordUpdateResponse = function (a) {
	return {$: 3, a: a};
};
var $author$project$Api$postSchoolStudentsByStudentIdPassword = F3(
	function (header_Authorization, capture_studentId, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$string(body)),
				b: $elm$http$Http$expectStringResponse(
					function (res) {
						return $elm$core$String$isEmpty(res.a) ? $elm$core$Result$Ok(0) : $elm$core$Result$Err('Expected the response body to be empty');
					}),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/students',
							$elm$url$Url$percentEncode(capture_studentId),
							'password'
						])),
				g: true
			});
	});
var $author$project$Views$ChangePasswordForm$sendPasswordChangeRequest = F2(
	function (session, model) {
		return A2(
			$elm$http$Http$send,
			$author$project$Views$ChangePasswordForm$PasswordUpdateResponse,
			A3(
				$author$project$Api$postSchoolStudentsByStudentIdPassword,
				$author$project$Data$Session$authorization(session),
				model.cy,
				model.a3));
	});
var $rtfeldman$elm_validate$Validate$firstErrorHelp = F2(
	function (validators, subject) {
		firstErrorHelp:
		while (true) {
			if (!validators.b) {
				return _List_Nil;
			} else {
				var getErrors = validators.a;
				var rest = validators.b;
				var _v1 = getErrors(subject);
				if (!_v1.b) {
					var $temp$validators = rest,
						$temp$subject = subject;
					validators = $temp$validators;
					subject = $temp$subject;
					continue firstErrorHelp;
				} else {
					var errors = _v1;
					return errors;
				}
			}
		}
	});
var $rtfeldman$elm_validate$Validate$firstError = function (validators) {
	var getErrors = function (subject) {
		return A2($rtfeldman$elm_validate$Validate$firstErrorHelp, validators, subject);
	};
	return getErrors;
};
var $author$project$Views$ChangePasswordForm$validator = function (min) {
	return $rtfeldman$elm_validate$Validate$firstError(
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_validate$Validate$ifTrue,
				function (m) {
					return _Utils_cmp(
						$elm$core$String$length(m.a3),
						min) < 0;
				},
				'Password must be at least ' + ($elm$core$String$fromInt(min) + ' characters')),
				A2(
				$rtfeldman$elm_validate$Validate$ifTrue,
				function (m) {
					return !_Utils_eq(m.a3, m.aW);
				},
				'Passwords don\'t match')
			]));
};
var $author$project$Views$ChangePasswordForm$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = A2(
					$rtfeldman$elm_validate$Validate$validate,
					$author$project$Views$ChangePasswordForm$validator(model.b4),
					model);
				if (_v1.$ === 1) {
					var errors = _v1.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: errors}),
							$elm$core$Platform$Cmd$none),
						0);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: _List_Nil}),
							A2($author$project$Views$ChangePasswordForm$sendPasswordChangeRequest, session, model)),
						0);
				}
			case 1:
				var password = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{a3: password}),
						$elm$core$Platform$Cmd$none),
					0);
			case 2:
				var password = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aW: password}),
						$elm$core$Platform$Cmd$none),
					0);
			default:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						1);
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: A2(
										$elm$core$List$cons,
										'Password update failed: ' + $author$project$Util$defaultHttpErrorMsg(e),
										model.ai)
								}),
							$elm$core$Platform$Cmd$none),
						0);
				}
		}
	});
var $author$project$Views$ChangeUsernameForm$Completed = 1;
var $author$project$Views$ChangeUsernameForm$NoOp = 0;
var $author$project$Views$ChangeUsernameForm$addError = F2(
	function (model, e) {
		return _Utils_update(
			model,
			{
				ai: A2($elm$core$List$cons, e, model.ai)
			});
	});
var $author$project$Views$ChangeUsernameForm$UsernameUpdateResponse = function (a) {
	return {$: 2, a: a};
};
var $author$project$Api$postSchoolStudentsByStudentIdUsername = F3(
	function (header_Authorization, capture_studentId, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					$elm$json$Json$Encode$string(body)),
				b: $elm$http$Http$expectStringResponse(
					function (res) {
						return $elm$core$String$isEmpty(res.a) ? $elm$core$Result$Ok(0) : $elm$core$Result$Err('Expected the response body to be empty');
					}),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/students',
							$elm$url$Url$percentEncode(capture_studentId),
							'username'
						])),
				g: true
			});
	});
var $author$project$Views$ChangeUsernameForm$sendUsernameChangeRequest = F2(
	function (session, model) {
		return A2(
			$elm$http$Http$send,
			$author$project$Views$ChangeUsernameForm$UsernameUpdateResponse,
			A3(
				$author$project$Api$postSchoolStudentsByStudentIdUsername,
				$author$project$Data$Session$authorization(session),
				model.cy,
				model.bb));
	});
var $author$project$Views$ChangeUsernameForm$minLength = 3;
var $author$project$Views$ChangeUsernameForm$spaceChars = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('\\s+'));
var $author$project$Views$ChangeUsernameForm$validator = $rtfeldman$elm_validate$Validate$all(
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			function (m) {
				return _Utils_cmp(
					$elm$core$String$length(m.bb),
					$author$project$Views$ChangeUsernameForm$minLength) < 0;
			},
			'Username must be at least ' + ($elm$core$String$fromInt($author$project$Views$ChangeUsernameForm$minLength) + ' characters')),
			A2(
			$rtfeldman$elm_validate$Validate$ifTrue,
			A2(
				$elm$core$Basics$composeL,
				$elm$regex$Regex$contains($author$project$Views$ChangeUsernameForm$spaceChars),
				function ($) {
					return $.bb;
				}),
			'Username can\'t contain spaces')
		]));
var $author$project$Views$ChangeUsernameForm$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = A2($rtfeldman$elm_validate$Validate$validate, $author$project$Views$ChangeUsernameForm$validator, model);
				if (_v1.$ === 1) {
					var errors = _v1.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: errors}),
							$elm$core$Platform$Cmd$none),
						0);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: _List_Nil}),
							A2($author$project$Views$ChangeUsernameForm$sendUsernameChangeRequest, session, model)),
						0);
				}
			case 1:
				var username = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{bb: username}),
						$elm$core$Platform$Cmd$none),
					0);
			default:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						1);
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							function () {
								if (e.$ === 3) {
									var status = e.a.ek;
									var _v3 = status.c1;
									if (_v3 === 409) {
										return A2($author$project$Views$ChangeUsernameForm$addError, model, 'This user name is already taken');
									} else {
										return A2(
											$author$project$Views$ChangeUsernameForm$addError,
											model,
											$author$project$Util$defaultHttpErrorMsg(e));
									}
								} else {
									return A2(
										$author$project$Views$ChangeUsernameForm$addError,
										model,
										$author$project$Util$defaultHttpErrorMsg(e));
								}
							}(),
							$elm$core$Platform$Cmd$none),
						0);
				}
		}
	});
var $author$project$Page$Student$updateSession = F2(
	function (session, student) {
		var cache = $author$project$Data$Session$getCache(session);
		var newStudents = A2(
			$elm$core$List$cons,
			student,
			A2(
				$elm$core$List$filter,
				function (s) {
					return !_Utils_eq(s.dl, student.dl);
				},
				cache.cv));
		return A2(
			$author$project$Data$Session$updateCache,
			function (c) {
				return _Utils_update(
					c,
					{cv: newStudents});
			},
			session);
	});
var $author$project$Page$Student$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								ag: $elm$core$Maybe$Just(
									A2(
										$author$project$Views$ChangePasswordForm$init,
										function ($) {
											return $.dl;
										}(model.v),
										8))
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 1:
				var subMsg = msg.a;
				var _v1 = A2(
					$elm$core$Maybe$map,
					A2($author$project$Views$ChangePasswordForm$update, session, subMsg),
					model.ag);
				if (_v1.$ === 1) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					if (!_v1.a.b) {
						var _v2 = _v1.a;
						var _v3 = _v2.a;
						var subModel = _v3.a;
						var subSubMsg = _v3.b;
						var _v4 = _v2.b;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{
										ag: $elm$core$Maybe$Just(subModel)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Page$Student$ChangePasswordMsg, subSubMsg)),
							session);
					} else {
						var _v5 = _v1.a;
						var _v6 = _v5.b;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{ag: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none),
							session);
					}
				}
			case 2:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								ah: $elm$core$Maybe$Just(
									$author$project$Views$ChangeUsernameForm$init(
										function ($) {
											return $.dl;
										}(model.v)))
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 3:
				var subMsg = msg.a;
				var _v7 = A2(
					$elm$core$Maybe$map,
					A2($author$project$Views$ChangeUsernameForm$update, session, subMsg),
					model.ah);
				if (_v7.$ === 1) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					if (!_v7.a.b) {
						var _v8 = _v7.a;
						var _v9 = _v8.a;
						var subModel = _v9.a;
						var subSubMsg = _v9.b;
						var _v10 = _v8.b;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{
										ah: $elm$core$Maybe$Just(subModel)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Page$Student$ChangeUsernameMsg, subSubMsg)),
							session);
					} else {
						var _v11 = _v7.a;
						var _v12 = _v11.b;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{ah: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none),
							session);
					}
				}
			case 4:
				var s = model.v;
				var newStudent = _Utils_update(
					s,
					{a_: !s.a_});
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						A2($author$project$Page$Student$sendUpdateStudent, session, newStudent)),
					session);
			case 5:
				if (function ($) {
					return $.bP;
				}(model.v)) {
					var s = model.v;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							model,
							A2(
								$elm$http$Http$send,
								$author$project$Page$Student$UndeleteResponse,
								A2(
									$author$project$Api$postSchoolStudentsByStudentIdUndelete,
									$author$project$Data$Session$authorization(session),
									function ($) {
										return $.dl;
									}(model.v)))),
						session);
				} else {
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{aM: true}),
							$elm$core$Platform$Cmd$none),
						session);
				}
			case 6:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						A2(
							$elm$http$Http$send,
							$author$project$Page$Student$UpdateStudentResponse,
							A2(
								$author$project$Api$deleteSchoolStudentsByStudentId,
								$author$project$Data$Session$authorization(session),
								function ($) {
									return $.dl;
								}(model.v)))),
					session);
			case 8:
				if (!msg.a.$) {
					var student = model.v;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _List_Nil,
									v: _Utils_update(
										student,
										{bP: false})
								}),
							$elm$core$Platform$Cmd$none),
						A2($author$project$Page$Student$updateSession, session, student));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _List_fromArray(
										[
											$author$project$Util$defaultHttpErrorMsg(e)
										])
								}),
							$elm$core$Platform$Cmd$none),
						session);
				}
			case 7:
				if (!msg.a.$) {
					var student = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: _List_Nil, aM: false, v: student}),
							$elm$core$Platform$Cmd$none),
						A2($author$project$Page$Student$updateSession, session, student));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _List_fromArray(
										[
											$author$project$Util$defaultHttpErrorMsg(e)
										])
								}),
							$elm$core$Platform$Cmd$none),
						session);
				}
			case 9:
				var newLevel = msg.a;
				if (_Utils_eq(
					newLevel,
					function ($) {
						return $.aF;
					}(model.v))) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					var s = model.v;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							model,
							A2(
								$author$project$Page$Student$sendUpdateStudent,
								session,
								_Utils_update(
									s,
									{aF: newLevel}))),
						session);
				}
			default:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{ag: $elm$core$Maybe$Nothing, ah: $elm$core$Maybe$Nothing, aM: false}),
						$elm$core$Platform$Cmd$none),
					session);
		}
	});
var $author$project$Page$Students$AddStudentsFormMsg = function (a) {
	return {$: 9, a: a};
};
var $author$project$Page$Students$ClassMembersResponse = function (a) {
	return {$: 11, a: a};
};
var $author$project$Page$Students$Error = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Students$Msg = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Students$clearNotification = function (m) {
	return _Utils_update(
		m,
		{aI: $author$project$Page$Students$NoMsg});
};
var $author$project$AddStudentsForm$init = {bf: $elm$core$Maybe$Nothing, ai: _List_Nil, aF: 3, a1: '', az: false};
var $author$project$AddStudentsForm$AddStudentsResponse = function (a) {
	return {$: 4, a: a};
};
var $author$project$Api$postSchoolStudents = F2(
	function (header_Authorization, body) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$jsonBody(
					function (_v0) {
						var x = _v0.a;
						var y = _v0.b;
						return A2(
							$elm$json$Json$Encode$list,
							$elm$core$Basics$identity,
							_List_fromArray(
								[
									$elm$json$Json$Encode$int(x),
									$elm$json$Json$Encode$list($elm$json$Json$Encode$string)(y)
								]));
					}(body)),
				b: $elm$http$Http$expectJson(
					$elm$json$Json$Decode$list(
						A3(
							$elm$json$Json$Decode$map2,
							$elm$core$Tuple$pair,
							A2($elm$json$Json$Decode$index, 0, $author$project$Api$decodeStudent),
							A2(
								$elm$json$Json$Decode$index,
								1,
								A3(
									$elm$json$Json$Decode$map2,
									$elm$core$Tuple$pair,
									A2($elm$json$Json$Decode$index, 0, $elm$json$Json$Decode$string),
									A2($elm$json$Json$Decode$index, 1, $elm$json$Json$Decode$string)))))),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: $author$project$Api$apiUrl + '/school/students',
				g: true
			});
	});
var $author$project$AddStudentsForm$sendNewAccountsRequest = F3(
	function (session, level, names) {
		return A2(
			$elm$http$Http$send,
			$author$project$AddStudentsForm$AddStudentsResponse,
			A2(
				$author$project$Api$postSchoolStudents,
				$author$project$Data$Session$authorization(session),
				_Utils_Tuple2(level, names)));
	});
var $elm$regex$Regex$split = _Regex_splitAtMost(_Regex_infinity);
var $author$project$AddStudentsForm$validName = function (name) {
	return function (l) {
		return (l >= 2) && (l < 50);
	}(
		$elm$core$String$length(
			$elm$core$String$trim(name)));
};
var $author$project$AddStudentsForm$validate = function (model) {
	var validateName = function (n) {
		return (!$author$project$AddStudentsForm$validName(n)) ? _List_fromArray(
			[n + ' is not a valid name']) : _List_Nil;
	};
	var parsedNames = A2(
		$elm$core$List$filter,
		A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
		A2(
			$elm$core$List$map,
			$elm$core$String$trim,
			A2(
				$elm$regex$Regex$split,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$regex$Regex$never,
					$elm$regex$Regex$fromString('[,\\r\\n]+')),
				model.a1)));
	var lengthCheck = function () {
		var _v1 = $elm$core$List$length(parsedNames);
		if (!_v1) {
			return _List_fromArray(
				['Please enter at least one name']);
		} else {
			var n = _v1;
			return (n < 101) ? _List_Nil : _List_fromArray(
				['You can only create 100 accounts at a atime']);
		}
	}();
	var errors = A2(
		$elm$core$List$append,
		lengthCheck,
		$elm$core$List$concat(
			A2($elm$core$List$map, validateName, parsedNames)));
	if (!errors.b) {
		return $elm$core$Result$Ok(parsedNames);
	} else {
		return $elm$core$Result$Err(errors);
	}
};
var $author$project$AddStudentsForm$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				var _v1 = $author$project$AddStudentsForm$validate(model);
				if (!_v1.$) {
					var names = _v1.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: _List_Nil, az: true}),
							A3($author$project$AddStudentsForm$sendNewAccountsRequest, session, model.aF, names)),
						$elm$core$Maybe$Nothing);
				} else {
					var errors = _v1.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{ai: errors}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				}
			case 1:
				var _class = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{bf: _class}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 2:
				var level = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{aF: level}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			case 3:
				var names = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{a1: names}),
						$elm$core$Platform$Cmd$none),
					$elm$core$Maybe$Nothing);
			default:
				if (!msg.a.$) {
					var newAccounts = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{az: false}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Just(newAccounts));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									ai: _Utils_ap(
										model.ai,
										_List_fromArray(
											[
												'Couldn\'t save the new accounts: ' + $author$project$Util$defaultHttpErrorMsg(e)
											])),
									az: false
								}),
							$elm$core$Platform$Cmd$none),
						$elm$core$Maybe$Nothing);
				}
		}
	});
var $author$project$Page$Students$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{an: $elm$core$Dict$empty}),
						$elm$core$Platform$Cmd$none),
					session);
			case 1:
				return _Utils_Tuple2(
					_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
					A2(
						$author$project$Data$Session$updateCache,
						function (c) {
							return _Utils_update(
								c,
								{dN: _List_Nil});
						},
						session));
			case 5:
				var txt = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								ac: _Utils_Tuple2(txt, model.ac.b)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 2:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						model,
						$author$project$Ports$printWindow(0)),
					session);
			case 6:
				var c = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								ac: _Utils_Tuple2(model.ac.a, c)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 8:
				var student = msg.a;
				var checked = msg.b;
				var f = checked ? A2($elm$core$Dict$insert, student.dl, student) : $elm$core$Dict$remove(student.dl);
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								an: f(model.an)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 9:
				var subMsg = msg.a;
				var _v1 = A2(
					$elm$core$Maybe$map,
					A2($author$project$AddStudentsForm$update, session, subMsg),
					model.af);
				if (_v1.$ === 1) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					if (_v1.a.b.$ === 1) {
						var _v2 = _v1.a;
						var _v3 = _v2.a;
						var subModel = _v3.a;
						var subSubMsg = _v3.b;
						var _v4 = _v2.b;
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{
										af: $elm$core$Maybe$Just(subModel)
									}),
								A2($elm$core$Platform$Cmd$map, $author$project$Page$Students$AddStudentsFormMsg, subSubMsg)),
							session);
					} else {
						var _v5 = _v1.a;
						var newAccounts = _v5.b.a;
						var f = function (c) {
							return _Utils_update(
								c,
								{
									dN: _Utils_ap(newAccounts, c.dN),
									cv: _Utils_ap(
										A2($elm$core$List$map, $elm$core$Tuple$first, newAccounts),
										c.cv)
								});
						};
						return _Utils_Tuple2(
							_Utils_Tuple2(
								_Utils_update(
									model,
									{af: $elm$core$Maybe$Nothing}),
								$elm$core$Platform$Cmd$none),
							A2($author$project$Data$Session$updateCache, f, session));
					}
				}
			case 7:
				var state = msg.a;
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{by: state}),
						$elm$core$Platform$Cmd$none),
					session);
			case 3:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{
								af: $elm$core$Maybe$Just($author$project$AddStudentsForm$init)
							}),
						$elm$core$Platform$Cmd$none),
					session);
			case 4:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						_Utils_update(
							model,
							{af: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$none),
					session);
			case 10:
				var classId = msg.a;
				if (classId.$ === 1) {
					return _Utils_Tuple2(
						_Utils_Tuple2(model, $elm$core$Platform$Cmd$none),
						session);
				} else {
					var cid = classId.a;
					var studentsToAdd = A2(
						$elm$core$List$map,
						function ($) {
							return $.dl;
						},
						$elm$core$Dict$values(model.an));
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{an: $elm$core$Dict$empty}),
							A2(
								$elm$http$Http$send,
								$author$project$Page$Students$ClassMembersResponse,
								A4(
									$author$project$Api$postSchoolClassesByClassIdMembers,
									$author$project$Data$Session$authorization(session),
									cid,
									$elm$core$Maybe$Nothing,
									studentsToAdd))),
						session);
				}
			case 11:
				if (!msg.a.$) {
					var updatedClass = msg.a.a;
					var updateClasses = function (cs) {
						return A2(
							$elm$core$List$cons,
							updatedClass,
							A2(
								$elm$core$List$filter,
								function (c) {
									return !_Utils_eq(c.dl, updatedClass.dl);
								},
								cs));
					};
					var newSession = A2(
						$author$project$Data$Session$updateCache,
						function (c) {
							return _Utils_update(
								c,
								{
									cZ: updateClasses(c.cZ)
								});
						},
						session);
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									aI: $author$project$Page$Students$Msg('Class members updated')
								}),
							$elm$core$Platform$Cmd$none),
						newSession);
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_Tuple2(
							_Utils_update(
								model,
								{
									aI: $author$project$Page$Students$Error(
										'Could\'t update add class members: ' + $author$project$Util$defaultHttpErrorMsg(e))
								}),
							$elm$core$Platform$Cmd$none),
						session);
				}
			default:
				return _Utils_Tuple2(
					_Utils_Tuple2(
						$author$project$Page$Students$clearNotification(model),
						$elm$core$Platform$Cmd$none),
					session);
		}
	});
var $author$project$Page$Teachers$ActivateAccountResponse = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Teachers$GenerateRegistrationCodeResponse = function (a) {
	return {$: 4, a: a};
};
var $author$project$Api$getAccountRegisterCode = function (header_Authorization) {
	return $elm$http$Http$request(
		{
			a: $elm$http$Http$emptyBody,
			b: $elm$http$Http$expectJson($elm$json$Json$Decode$string),
			c: A2(
				$elm$core$List$filterMap,
				$elm$core$Basics$identity,
				_List_fromArray(
					[
						A2(
						$elm$core$Maybe$map,
						$elm$http$Http$header('Authorization'),
						$elm$core$Maybe$Just(header_Authorization))
					])),
			d: 'GET',
			e: $elm$core$Maybe$Nothing,
			f: $author$project$Api$apiUrl + '/account/register/code',
			g: true
		});
};
var $author$project$Page$Teachers$markActivated = F2(
	function (accId, teacher) {
		return _Utils_eq(
			function ($) {
				return $.dl;
			}(teacher.a),
			accId) ? _Utils_Tuple2(teacher.a, true) : teacher;
	});
var $author$project$Api$postSchoolTeachersByTeacherIdActivate = F2(
	function (header_Authorization, capture_teacherId) {
		return $elm$http$Http$request(
			{
				a: $elm$http$Http$emptyBody,
				b: $elm$http$Http$expectJson($elm$json$Json$Decode$string),
				c: A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							A2(
							$elm$core$Maybe$map,
							$elm$http$Http$header('Authorization'),
							$elm$core$Maybe$Just(header_Authorization))
						])),
				d: 'POST',
				e: $elm$core$Maybe$Nothing,
				f: A2(
					$elm$core$String$join,
					'/',
					_List_fromArray(
						[
							$author$project$Api$apiUrl,
							'school/teachers',
							$elm$url$Url$percentEncode(capture_teacherId),
							'activate'
						])),
				g: true
			});
	});
var $author$project$Page$Teachers$update = F3(
	function (session, msg, model) {
		switch (msg.$) {
			case 0:
				var state = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{by: state}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var accId = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$http$Http$send,
						$author$project$Page$Teachers$ActivateAccountResponse,
						A2(
							$author$project$Api$postSchoolTeachersByTeacherIdActivate,
							$author$project$Data$Session$authorization(session),
							accId)));
			case 2:
				if (!msg.a.$) {
					var accId = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								ba: A2(
									$elm$core$List$map,
									$author$project$Page$Teachers$markActivated(accId),
									model.ba)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				return _Utils_Tuple2(
					model,
					A2(
						$elm$http$Http$send,
						$author$project$Page$Teachers$GenerateRegistrationCodeResponse,
						$author$project$Api$getAccountRegisterCode(
							$author$project$Data$Session$authorization(session))));
			default:
				if (!msg.a.$) {
					var code = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								bs: $elm$core$Maybe$Just(code)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $author$project$Data$Session$userAgent = function (_v0) {
	var s = _v0;
	return s.cH;
};
var $author$project$Main$updatePage = F3(
	function (page, msg, model) {
		var mapMsg = function (m) {
			return $elm$core$Platform$Cmd$map(
				A2($elm$core$Basics$composeL, $author$project$Main$PageMsg, m));
		};
		var toPage = F5(
			function (toModel, toMsg, subUpdate, subMsg, subModel) {
				var _v9 = A2(subUpdate, subMsg, subModel);
				var newModel = _v9.a;
				var newCmd = _v9.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: $author$project$Main$Loaded(
								toModel(newModel))
						}),
					A2(mapMsg, toMsg, newCmd));
			});
		var toPageUpdateSession = F5(
			function (toModel, toMsg, subUpdate, subMsg, subModel) {
				var _v7 = A3(subUpdate, model.k, subMsg, subModel);
				var _v8 = _v7.a;
				var newModel = _v8.a;
				var newCmd = _v8.b;
				var newSession = _v7.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							m: $author$project$Main$Loaded(
								toModel(newModel)),
							k: newSession
						}),
					A2(mapMsg, toMsg, newCmd));
			});
		var _v0 = _Utils_Tuple2(msg, page);
		_v0$11:
		while (true) {
			switch (_v0.a.$) {
				case 0:
					if (_v0.b.$ === 5) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(toPageUpdateSession, $author$project$Main$Story, $author$project$Main$StoryMsg, $author$project$Page$Story$update, subMsg, subModel);
					} else {
						break _v0$11;
					}
				case 2:
					if (_v0.b.$ === 6) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(toPageUpdateSession, $author$project$Main$FindStory, $author$project$Main$FindStoryMsg, $author$project$Page$FindStory$update, subMsg, subModel);
					} else {
						break _v0$11;
					}
				case 3:
					if (_v0.b.$ === 7) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(toPageUpdateSession, $author$project$Main$Students, $author$project$Main$StudentsMsg, $author$project$Page$Students$update, subMsg, subModel);
					} else {
						break _v0$11;
					}
				case 4:
					if (_v0.b.$ === 8) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(toPageUpdateSession, $author$project$Main$Student, $author$project$Main$StudentMsg, $author$project$Page$Student$update, subMsg, subModel);
					} else {
						break _v0$11;
					}
				case 5:
					if (_v0.b.$ === 9) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(toPageUpdateSession, $author$project$Main$Classes, $author$project$Main$ClassesMsg, $author$project$Page$Classes$update, subMsg, subModel);
					} else {
						break _v0$11;
					}
				case 6:
					if (_v0.b.$ === 10) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						var _v1 = A3($author$project$Page$Class$update, model.k, subMsg, subModel);
						var _v2 = _v1.a;
						var pageModel = _v2.a;
						var cmd = _v2.b;
						var externalMsg = _v1.b;
						switch (externalMsg.$) {
							case 0:
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											m: $author$project$Main$Loaded(
												$author$project$Main$Class(pageModel))
										}),
									A2(mapMsg, $author$project$Main$ClassMsg, cmd));
							case 1:
								var newSession = externalMsg.a;
								return A2(
									$author$project$Main$changeRouteTo,
									$elm$core$Maybe$Just(
										$author$project$Route$Teacher($author$project$Route$Classes)),
									_Utils_update(
										model,
										{k: newSession}));
							default:
								var newSession = externalMsg.a;
								return _Utils_Tuple2(
									_Utils_update(
										model,
										{
											m: $author$project$Main$Loaded(
												$author$project$Main$Class(pageModel)),
											k: newSession
										}),
									A2(mapMsg, $author$project$Main$ClassMsg, cmd));
						}
					} else {
						break _v0$11;
					}
				case 1:
					if (_v0.b.$ === 4) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						var loginRequest = F3(
							function (username, password, otp) {
								return $author$project$Api$postAuthenticate(
									A4(
										$author$project$Api$LoginRequest,
										username,
										password,
										otp,
										$author$project$Data$Session$userAgent(model.k)));
							});
						var _v4 = A3($author$project$Page$Login$update, subMsg, subModel, loginRequest);
						var _v5 = _v4.a;
						var pageModel = _v5.a;
						var loginCmd = _v5.b;
						var maybeLoggedIn = _v4.b;
						var _v6 = A2(
							$elm$core$Maybe$withDefault,
							_Utils_Tuple2(model.k, $elm$core$Platform$Cmd$none),
							A2(
								$elm$core$Maybe$map,
								function (s) {
									return _Utils_Tuple2(
										s,
										$elm$core$Platform$Cmd$batch(
											_List_fromArray(
												[
													$author$project$Data$Session$storeSession(s),
													A2($author$project$Main$chooseStartPage, model.aH, s)
												])));
								},
								A2(
									$elm$core$Maybe$map,
									$author$project$Data$Session$newLogin(model.k),
									maybeLoggedIn)));
						var newSession = _v6.a;
						var cmd = _v6.b;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									m: $author$project$Main$Loaded(
										$author$project$Main$Login(pageModel)),
									k: newSession
								}),
							$elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A2(mapMsg, $author$project$Main$LoginMsg, loginCmd),
										cmd
									])));
					} else {
						break _v0$11;
					}
				case 7:
					if (_v0.b.$ === 11) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(
							toPage,
							$author$project$Main$Editor,
							$author$project$Main$EditorMsg,
							$author$project$Page$Editor$update(model.k),
							subMsg,
							subModel);
					} else {
						break _v0$11;
					}
				case 8:
					if (_v0.b.$ === 13) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(toPageUpdateSession, $author$project$Main$Account, $author$project$Main$AccountMsg, $author$project$Page$Account$update, subMsg, subModel);
					} else {
						break _v0$11;
					}
				case 9:
					if (_v0.b.$ === 14) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(
							toPage,
							$author$project$Main$Register,
							$author$project$Main$RegisterMsg,
							$author$project$Page$Register$update(model.k),
							subMsg,
							subModel);
					} else {
						break _v0$11;
					}
				default:
					if (_v0.b.$ === 15) {
						var subMsg = _v0.a.a;
						var subModel = _v0.b.a;
						return A5(
							toPage,
							$author$project$Main$Teachers,
							$author$project$Main$TeachersMsg,
							$author$project$Page$Teachers$update(model.k),
							subMsg,
							subModel);
					} else {
						break _v0$11;
					}
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var route = msg.a;
				return A2($author$project$Main$changeRouteTo, route, model);
			case 1:
				var url = msg.a;
				return A2(
					$author$project$Main$changeRouteTo,
					$author$project$Route$fromUrl(url),
					model);
			case 2:
				var urlReq = msg.a;
				if (!urlReq.$) {
					var url = urlReq.a;
					var _v2 = url.df;
					if (_v2.$ === 1) {
						return (url.d8 === '/') ? _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load('/')) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
					} else {
						if (_v2.a === '') {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$browser$Browser$Navigation$pushUrl,
									model.aH,
									$elm$url$Url$toString(url)));
						}
					}
				} else {
					var url = urlReq.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(url));
				}
			case 3:
				var p = msg.a;
				return A2($author$project$Main$pageLoaded, p, model);
			case 4:
				var p = msg.a;
				return A3(
					$author$project$Main$updatePage,
					$author$project$Main$getPage(model.m),
					p,
					model);
			case 5:
				var a = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: A2($author$project$Data$Session$closeAlert, a, model.k)
						}),
					$elm$core$Platform$Cmd$none);
			case 8:
				var t = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: A2($author$project$Data$Session$tick, model.k, t)
						}),
					$elm$core$Platform$Cmd$none);
			case 6:
				var _v3 = A2(
					$author$project$Data$Session$saveWorkQueue,
					$author$project$Main$SaveWorkQueueResponse,
					$author$project$Data$Session$clearWorkQueue(model.k));
				var cmd = _v3.a;
				var newSession = _v3.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{k: newSession}),
					cmd);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Views$Page$Account = 5;
var $author$project$Main$ClearWorkQueue = {$: 6};
var $author$project$Main$CloseAlert = function (a) {
	return {$: 5, a: a};
};
var $author$project$Views$Page$FindStory = 3;
var $author$project$Views$Page$Home = 1;
var $author$project$Views$Page$LeaderBoard = 6;
var $author$project$Views$Page$Login = 2;
var $author$project$Views$Page$Other = 0;
var $author$project$Views$Page$Register = 4;
var $author$project$Views$Page$Teacher = 7;
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$Bootstrap$Danger = 1;
var $author$project$Bootstrap$Success = 0;
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$Bootstrap$ariaLabel = $elm$html$Html$Attributes$attribute('aria-label');
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $author$project$Bootstrap$role = $elm$html$Html$Attributes$attribute('role');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$title = $elm$svg$Svg$trustedNode('title');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $author$project$Bootstrap$closeIcon = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('fill-current h-6 w-6'),
			$author$project$Bootstrap$role('button'),
			$elm$svg$Svg$Attributes$viewBox('0 0 20 20')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$title,
			_List_Nil,
			_List_fromArray(
				[
					$elm$svg$Svg$text('Close')
				])),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z')
				]),
			_List_Nil)
		]));
var $author$project$Bootstrap$closeBtn = function (msg) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('absolute top-0 right-0 px-4 py-3'),
				$author$project$Bootstrap$ariaLabel('close'),
				$elm$html$Html$Events$onClick(msg)
			]),
		_List_fromArray(
			[$author$project$Bootstrap$closeIcon]));
};
var $author$project$Bootstrap$alert = F3(
	function (a, txt, onClose) {
		var alertClass = function () {
			if (!a) {
				return 'bg-green-lightest border border-green-light text-green-600 px-4 py-3 rounded relative';
			} else {
				return 'bg-red-lightest border border-red-light text-red-600 px-4 py-3 rounded relative';
			}
		}();
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(alertClass),
					$author$project$Bootstrap$role('alert')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('block')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(txt)
						])),
					$author$project$Bootstrap$closeBtn(onClose)
				]));
	});
var $author$project$Views$Page$viewAlert = F2(
	function (onAlertClose, _v0) {
		var a = _v0.a;
		var _v1 = function () {
			switch (a.$) {
				case 0:
					var m = a.a;
					return _Utils_Tuple2(0, m);
				case 1:
					var m = a.a;
					return _Utils_Tuple2(1, m);
				default:
					var m = a.a;
					return _Utils_Tuple2(1, m);
			}
		}();
		var bAlert = _v1.a;
		var txt = _v1.b;
		return A3(
			$author$project$Bootstrap$alert,
			bAlert,
			txt,
			onAlertClose(a));
	});
var $author$project$Util$viewIf = F2(
	function (condition, content) {
		return condition ? content : $elm$html$Html$text('');
	});
var $author$project$Util$viewUnless = F2(
	function (condition, content) {
		return A2($author$project$Util$viewIf, !condition, content);
	});
var $author$project$Views$Page$viewAlerts = F2(
	function (alerts, onAlertClose) {
		return A2(
			$author$project$Util$viewUnless,
			$elm$core$List$isEmpty(alerts),
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('alerts'),
						$elm$html$Html$Attributes$class('mb-2')
					]),
				A2(
					$elm$core$List$map,
					$author$project$Views$Page$viewAlert(onAlertClose),
					alerts)));
	});
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $elm$html$Html$Lazy$lazy2 = $elm$virtual_dom$VirtualDom$lazy2;
var $author$project$Views$Page$navLinkClass = $elm$html$Html$Attributes$class('block mt-4 md:inline-block md:mt-0 text-lg text-gray-100 hover:text-white mr-4 md:border-b-2');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$Route$href = function (route) {
	return $elm$html$Html$Attributes$href(
		$author$project$Route$routeToString(route));
};
var $author$project$Views$Page$navbarLink = F4(
	function (isActive, route, id_, linkContent) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(id_),
					$author$project$Views$Page$navLinkClass,
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('border-white text-white', isActive),
							_Utils_Tuple2('border-transparent hover:border-gray-100', !isActive)
						])),
					$author$project$Route$href(route)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(linkContent)
				]));
	});
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $author$project$Views$Page$menuItems = F2(
	function (page, session) {
		var my3ml = A4($author$project$Views$Page$navbarLink, page === 5, $author$project$Route$Account, 'nav-account', 'My3ml');
		var logout = A4($author$project$Views$Page$navbarLink, false, $author$project$Route$Logout, 'nav-logout', 'Sign out');
		var leaderboard = A4($author$project$Views$Page$navbarLink, page === 6, $author$project$Route$LeaderBoard, 'nav-leaderboard', 'Leaderboard');
		var home = function (txt) {
			return A4($author$project$Views$Page$navbarLink, page === 1, $author$project$Route$Home, 'nav-home', txt);
		};
		var findStory = A4($author$project$Views$Page$navbarLink, page === 3, $author$project$Route$FindStory, 'nav-find-story', 'Find a story');
		return $author$project$Data$Session$isStudent(session) ? _List_fromArray(
			[
				home('My dashboard'),
				findStory,
				my3ml,
				leaderboard,
				logout
			]) : ($author$project$Data$Session$isEditor(session) ? _List_fromArray(
			[
				home('Home'),
				findStory,
				my3ml,
				logout
			]) : ($author$project$Data$Session$isTeacher(session) ? _List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('nav-home'),
						$elm$html$Html$Attributes$href('/'),
						$elm$html$Html$Attributes$target('_blank'),
						$author$project$Views$Page$navLinkClass
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Home')
					])),
				A4(
				$author$project$Views$Page$navbarLink,
				page === 7,
				$author$project$Route$Teacher($author$project$Route$Students),
				'nav-teacher-admin',
				'Admin'),
				findStory,
				my3ml,
				leaderboard,
				logout
			]) : _List_fromArray(
			[
				A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('nav-home'),
						$elm$html$Html$Attributes$href('/'),
						$author$project$Views$Page$navLinkClass,
						$elm$html$Html$Attributes$class('border-transparent')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Home')
					])),
				A4($author$project$Views$Page$navbarLink, page === 2, $author$project$Route$Login, 'nav-login', 'Sign in'),
				A4($author$project$Views$Page$navbarLink, page === 4, $author$project$Route$Register, 'nav-register', 'Sign up')
			])));
	});
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$Views$Page$menuToggleButton = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('block md:hidden')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$label,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$for('menu-toggle'),
					$elm$html$Html$Attributes$class('flex items-center px-3 py-2 border rounded')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$svg,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('fill-current text-white h-3 w-3'),
							$elm$svg$Svg$Attributes$viewBox('0 0 20 20')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$title,
							_List_Nil,
							_List_fromArray(
								[
									$elm$svg$Svg$text('Menu')
								])),
							A2(
							$elm$svg$Svg$path,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$d('M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z')
								]),
							_List_Nil)
						]))
				]))
		]));
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Views$Page$viewHeader = F3(
	function (page, session, isLoading) {
		return A2(
			$elm$html$Html$nav,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('print:none bg-tml-blue mb-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container px-2 py-2 mx-auto flex items-center justify-between flex-wrap')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center flex-shrink-0 mr-8')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('fill-current'),
											$elm$html$Html$Attributes$src('/images/logo.webp'),
											$elm$html$Html$Attributes$alt('The Three Minute Learning logo (3ml)')
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('menu-toggle'),
									$elm$html$Html$Attributes$type_('checkbox'),
									$elm$html$Html$Attributes$class('hidden')
								]),
							_List_Nil),
							$author$project$Views$Page$menuToggleButton,
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('menu w-full flex-grow md:flex md:items-center md:w-auto')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-base md:flex-grow')
										]),
									A2($author$project$Views$Page$menuItems, page, session)),
									A3(
									$elm$html$Html$Lazy$lazy2,
									$author$project$Util$viewIf,
									isLoading,
									A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('spinner bg-white')
											]),
										_List_Nil))
								]))
						]))
				]));
	});
var $author$project$Views$Page$frame = F5(
	function (isLoading, session, onAlertClose, page, _v0) {
		var title = _v0.cE;
		var content = _v0.bL;
		return {
			a: _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('app')
						]),
					_List_fromArray(
						[
							A3($author$project$Views$Page$viewHeader, page, session, isLoading),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('bg-gray-100 container mx-auto p-6')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Page$viewAlerts,
									$author$project$Data$Session$getAlerts(session),
									onAlertClose),
									content
								]))
						]))
				]),
			cE: title
		};
	});
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Page$Account$SaveSettings = {$: 4};
var $author$project$Page$Account$SetBackground = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Account$SetColour = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Components$btnBase = function (attrs) {
	return $elm$html$Html$button(
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class('text-white font-bold rounded focus:outline-none focus:shadow-outline'),
			attrs));
};
var $author$project$Components$btn = function (attrs) {
	return $author$project$Components$btnBase(
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class('bg-blue-500 hover:bg-blue-600 py-2 px-3'),
			attrs));
};
var $author$project$Page$Account$SetFont = function (a) {
	return {$: 2, a: a};
};
var $author$project$Data$Settings$fontOptions = _List_fromArray(
	[
		_Utils_Tuple2('Standard font', '\"Helvetica Neue\",Helvetica,Arial,sans-serif'),
		_Utils_Tuple2('Helvetica (Serif)', '\"Helvetica Neue\",Helvetica,Arial,serif'),
		_Utils_Tuple2('Comic Sans', '\"Comic Sans\",cursive')
	]);
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $author$project$Views$Form$fcStyle = $elm$html$Html$Attributes$class('border shadow border-gray-light bg-white rounded text-gray-800 focus:border-blue');
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$Views$Form$select = function (attrs) {
	return $elm$html$Html$select(
		A2($elm$core$List$cons, $author$project$Views$Form$fcStyle, attrs));
};
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Page$Account$fontSelect = function (current) {
	var mkOption = function (_v0) {
		var font = _v0.a;
		var fontFamily = _v0.b;
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$selected(
					_Utils_eq(current, fontFamily)),
					$elm$html$Html$Attributes$value(fontFamily)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(font)
				]));
	};
	return A2(
		$author$project$Views$Form$select,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('font'),
				$elm$html$Html$Events$onInput($author$project$Page$Account$SetFont)
			]),
		A2($elm$core$List$map, mkOption, $author$project$Data$Settings$fontOptions));
};
var $author$project$Page$Account$SetFontSize = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Account$fontSizeSelect = function (current) {
	var mkOption = function (_v0) {
		var sz = _v0.a;
		var nm = _v0.b;
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$selected(
					_Utils_eq(current, sz)),
					$elm$html$Html$Attributes$value(sz)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(nm)
				]));
	};
	return A2(
		$author$project$Views$Form$select,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('sz'),
				$elm$html$Html$Events$onInput($author$project$Page$Account$SetFontSize)
			]),
		A2(
			$elm$core$List$map,
			mkOption,
			_List_fromArray(
				[
					_Utils_Tuple2('0.875rem', 'Small'),
					_Utils_Tuple2('1rem', 'Normal'),
					_Utils_Tuple2('1.25rem', 'Large'),
					_Utils_Tuple2('1.875rem', 'Huge'),
					_Utils_Tuple2('2.25rem', 'Gigantic')
				])));
};
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$Events$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm$html$Html$Events$onSubmit = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'submit',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysPreventDefault,
			$elm$json$Json$Decode$succeed(msg)));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Data$Settings$toStyle = function (_v0) {
	var background = _v0.bd;
	var colour = _v0.bg;
	var size = _v0.bv;
	var font = _v0.bk;
	return _List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'background', background),
			A2($elm$html$Html$Attributes$style, 'color', colour),
			A2($elm$html$Html$Attributes$style, 'font-size', size),
			A2($elm$html$Html$Attributes$style, 'font-family', font)
		]);
};
var $author$project$Page$Account$viewSettings = function (settings) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mb-4')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-2xl font-light mb-2')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Story display settings')
					])),
				A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class('p-4 border rounded mb-2'),
					$author$project$Data$Settings$toStyle(settings)),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('You may wish to change the way your stories are displayed.')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Use the controls below to make changes and then save the settings.')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('You can change the background and text colour.')
							])),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('You can also choose the font and the size of the text.')
							]))
					])),
				A2(
				$elm$html$Html$form,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-col'),
						$elm$html$Html$Events$onSubmit($author$project$Page$Account$SaveSettings)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex mb-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex items-center mr-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$for('bg'),
												$elm$html$Html$Attributes$class('mr-2')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Background colour:')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('color'),
												$elm$html$Html$Attributes$id('bg'),
												$elm$html$Html$Attributes$value(settings.bd),
												$elm$html$Html$Events$onInput($author$project$Page$Account$SetBackground)
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex items-center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$for('fg'),
												$elm$html$Html$Attributes$class('mr-2')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Text colour:')
											])),
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('color'),
												$elm$html$Html$Attributes$id('fg'),
												$elm$html$Html$Attributes$value(settings.bg),
												$elm$html$Html$Events$onInput($author$project$Page$Account$SetColour)
											]),
										_List_Nil)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex mb-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex items-center mr-4')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$for('font'),
												$elm$html$Html$Attributes$class('mr-2')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Font:')
											])),
										$author$project$Page$Account$fontSelect(settings.bk)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex items-center')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$label,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$for('sz'),
												$elm$html$Html$Attributes$class('mr-2')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Font size:')
											])),
										$author$project$Page$Account$fontSizeSelect(settings.bv)
									]))
							])),
						A2(
						$author$project$Components$btn,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('submit'),
								$elm$html$Html$Attributes$class('max-w-xs')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Save settings')
							]))
					]))
			]));
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.bw, posixMinutes) < 0) {
					return posixMinutes + era.b7;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		bN: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		b5: month,
		cO: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).bN;
	});
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).b5;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).cO;
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Util$posixToString = function (t) {
	var year = $elm$core$String$fromInt(
		A2($elm$time$Time$toYear, $elm$time$Time$utc, t));
	var month = function () {
		var _v0 = A2($elm$time$Time$toMonth, $elm$time$Time$utc, t);
		switch (_v0) {
			case 0:
				return 'Jan';
			case 1:
				return 'Feb';
			case 2:
				return 'Mar';
			case 3:
				return 'Apr';
			case 4:
				return 'May';
			case 5:
				return 'Jun';
			case 6:
				return 'Jul';
			case 7:
				return 'Aug';
			case 8:
				return 'Sep';
			case 9:
				return 'Oct';
			case 10:
				return 'Nov';
			default:
				return 'Dec';
		}
	}();
	var day = $elm$core$String$fromInt(
		A2($elm$time$Time$toDay, $elm$time$Time$utc, t));
	return day + (' ' + (month + (' ' + year)));
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $author$project$Views$Answers$cqsc = F2(
	function (answerType, content) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('px-6 py-2')
				]),
			A2(
				$elm$core$List$cons,
				A2(
					$elm$html$Html$h3,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-base font-bold text-gray-600')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(answerType)
						])),
				content));
	});
var $elm$html$Html$em = _VirtualDom_node('em');
var $author$project$Views$Answers$viewDetails = F2(
	function (story, answer) {
		return _List_fromArray(
			[
				A2(
				$author$project$Views$Answers$cqsc,
				'Connect',
				_List_fromArray(
					[
						$elm$html$Html$text(answer.bK)
					])),
				A2(
				$author$project$Views$Answers$cqsc,
				'Question',
				_List_fromArray(
					[
						$elm$html$Html$text(answer.Q)
					])),
				A2(
				$author$project$Views$Answers$cqsc,
				'Summarise',
				_List_fromArray(
					[
						$elm$html$Html$text(answer.cA)
					])),
				A2(
				$author$project$Views$Answers$cqsc,
				'Clarify',
				_List_fromArray(
					[
						A2(
						$elm$html$Html$em,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(story.cY)
							])),
						$elm$html$Html$text(':\u00A0'),
						$elm$html$Html$text(answer.bJ)
					]))
			]);
	});
var $author$project$Views$Answers$viewStoryAnswer = function (_v0) {
	var answer = _v0.a;
	var story = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('rounded shadow-md mt-2 px-4 py-3')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex justify-between')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-xl font-light')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(story.cE)
							])),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Util$posixToString(
									$elm$time$Time$millisToPosix(1000 * answer.as)))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				A2($author$project$Views$Answers$viewDetails, story, answer))
			]));
};
var $author$project$Views$Answers$viewWithStories = function (answers) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		A2($elm$core$List$map, $author$project$Views$Answers$viewStoryAnswer, answers));
};
var $author$project$Page$Account$view = function (_v0) {
	var settings = _v0.cs;
	var answers = _v0.cQ;
	return {
		bL: A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$Page$Account$viewSettings(settings),
					A2(
					$author$project$Util$viewUnless,
					$elm$core$List$isEmpty(answers),
					A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-2xl font-light mb-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('My story answers')
							]))),
					$author$project$Views$Answers$viewWithStories(answers)
				])),
		cE: 'My 3ml'
	};
};
var $author$project$Page$Class$ConfirmDelete = {$: 2};
var $author$project$Page$Class$DismissDialog = {$: 3};
var $author$project$Bootstrap$closeIcon2 = A2(
	$elm$svg$Svg$svg,
	_List_fromArray(
		[
			$elm$svg$Svg$Attributes$class('h-12 w-12 text-gray-600 hover:text-gray-700 fill-current'),
			$author$project$Bootstrap$role('button'),
			$elm$svg$Svg$Attributes$viewBox('0 0 20 20')
		]),
	_List_fromArray(
		[
			A2(
			$elm$svg$Svg$title,
			_List_Nil,
			_List_fromArray(
				[
					$elm$svg$Svg$text('Close')
				])),
			A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$d('M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z')
				]),
			_List_Nil)
		]));
var $author$project$Bootstrap$closeBtn2 = function (msg) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('absolute top-0 right-0 p-4'),
				$elm$html$Html$Events$onClick(msg)
			]),
		_List_fromArray(
			[$author$project$Bootstrap$closeIcon2]));
};
var $author$project$Modal$view = F3(
	function (title, onClose, content) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('fixed inset-0 bg-gray-100')
				]),
			_List_fromArray(
				[
					$author$project$Bootstrap$closeBtn2(onClose),
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-xl text-gray-700 text-center border-b shadow py-4 mb-4')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('h-full flex justify-center mt-8')
						]),
					_List_fromArray(
						[content]))
				]));
	});
var $author$project$Page$Class$confirmDeleteDialog = function (isOwner) {
	return A3(
		$author$project$Modal$view,
		'Delete class',
		$author$project$Page$Class$DismissDialog,
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full max-w-xl p-4 flex flex-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-lg mb-4')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Are you sure you want to delete this class?')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-lg mb-4')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Only the class information will be removed (none of the student accounts will be affected).')
						])),
					A2(
					$author$project$Util$viewIf,
					!isOwner,
					A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-lg font-bold')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('WARNING: Another teacher created this class. Perhaps you shouldn\'t delete it (they might be annoyed!)?')
							]))),
					A2(
					$author$project$Components$btn,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mt-4'),
							$elm$html$Html$Events$onClick($author$project$Page$Class$ConfirmDelete)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Delete class')
						]))
				])));
};
var $author$project$Page$Class$userIsOwner = F2(
	function (session, _class) {
		var _v0 = $author$project$Data$Session$subjectId(session);
		if (_v0.$ === 1) {
			return false;
		} else {
			var subId = _v0.a;
			return _Utils_eq(subId, _class.aX);
		}
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Views$Form$viewErrorMsgs = function (errors) {
	return $elm$core$List$isEmpty(errors) ? $elm$html$Html$text('') : A2(
		$elm$html$Html$ul,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('error-messages'),
				$elm$html$Html$Attributes$class('text-red-600 font-bold py-2 mb-1')
			]),
		A2(
			$elm$core$List$map,
			function (error) {
				return A2(
					$elm$html$Html$li,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('ml-2 mb-1')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(error)
						]));
			},
			errors));
};
var $author$project$Page$Class$SelectStudent = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Page$Class$SetTableState = function (a) {
	return {$: 5, a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $billstclair$elm_sortable_table$Table$ColumnData = F3(
	function (name, viewData, sorter) {
		return {a0: name, ej: sorter, ez: viewData};
	});
var $billstclair$elm_sortable_table$Table$customColumn = function (_v0) {
	var name = _v0.a0;
	var viewData = _v0.ez;
	var sorter = _v0.ej;
	return A3(
		$billstclair$elm_sortable_table$Table$ColumnData,
		name,
		A2($elm$core$Basics$composeL, $billstclair$elm_sortable_table$Table$textDetails, viewData),
		sorter);
};
var $billstclair$elm_sortable_table$Table$intColumn = F2(
	function (name, toInt) {
		return {
			a0: name,
			ej: $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy(toInt),
			ez: A2(
				$elm$core$Basics$composeL,
				A2($elm$core$Basics$composeL, $billstclair$elm_sortable_table$Table$textDetails, $elm$core$String$fromInt),
				toInt)
		};
	});
var $author$project$Bootstrap$link = F2(
	function (href_, txt) {
		return A2(
			$author$project$Components$link,
			_List_fromArray(
				[href_]),
			txt);
	});
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Views$StudentTable$posixToDate = function (t) {
	var year = $elm$core$String$fromInt(
		A2($elm$time$Time$toYear, $elm$time$Time$utc, t));
	var month = function () {
		var _v0 = A2($elm$time$Time$toMonth, $elm$time$Time$utc, t);
		switch (_v0) {
			case 0:
				return '01';
			case 1:
				return '02';
			case 2:
				return '03';
			case 3:
				return '04';
			case 4:
				return '05';
			case 5:
				return '06';
			case 6:
				return '07';
			case 7:
				return '08';
			case 8:
				return '09';
			case 9:
				return '10';
			case 10:
				return '11';
			default:
				return '12';
		}
	}();
	var day = $elm$core$String$fromInt(
		A2($elm$time$Time$toDay, $elm$time$Time$utc, t));
	return year + ('-' + (month + ('-' + day)));
};
var $billstclair$elm_sortable_table$Table$None = {$: 0};
var $billstclair$elm_sortable_table$Table$unsortable = $billstclair$elm_sortable_table$Table$None;
var $author$project$Views$StudentTable$config = F2(
	function (setState, onSelectStudent) {
		var viewStudentLink = function (_v5) {
			var student = _v5.b;
			return A2(
				$billstclair$elm_sortable_table$Table$HtmlDetails,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Bootstrap$link,
						$author$project$Route$href(
							$author$project$Route$Teacher(
								$author$project$Route$Student(student.dl))),
						student.a0)
					]));
		};
		var viewCheckbox = function (_v4) {
			var selected = _v4.a;
			var s = _v4.b;
			return A2(
				$billstclair$elm_sortable_table$Table$HtmlDetails,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('checkbox'),
								$elm$html$Html$Events$onCheck(
								onSelectStudent(s)),
								$elm$html$Html$Attributes$checked(selected)
							]),
						_List_Nil)
					]));
		};
		var nameColumn = $billstclair$elm_sortable_table$Table$veryCustomColumn(
			{
				a0: 'Name',
				ej: $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy(
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						function ($) {
							return $.a0;
						})),
				ez: viewStudentLink
			});
		var createdAtColumn = $billstclair$elm_sortable_table$Table$customColumn(
			{
				a0: 'Created On',
				ej: $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy(
					function (_v2) {
						var s = _v2.b;
						return s.as;
					}),
				ez: function (_v3) {
					var student = _v3.b;
					return $author$project$Views$StudentTable$posixToDate(
						$elm$time$Time$millisToPosix(student.as * 1000));
				}
			});
		var checkboxColumn = $billstclair$elm_sortable_table$Table$veryCustomColumn(
			{a0: '', ej: $billstclair$elm_sortable_table$Table$unsortable, ez: viewCheckbox});
		return $billstclair$elm_sortable_table$Table$customConfig(
			{
				c2: _List_fromArray(
					[
						checkboxColumn,
						nameColumn,
						A2(
						$billstclair$elm_sortable_table$Table$intColumn,
						'Level',
						A2(
							$elm$core$Basics$composeL,
							function ($) {
								return $.aF;
							},
							$elm$core$Tuple$second)),
						createdAtColumn,
						A2(
						$billstclair$elm_sortable_table$Table$stringColumn,
						'Hidden',
						function (_v0) {
							var s = _v0.b;
							return s.a_ ? 'x' : '';
						}),
						A2(
						$billstclair$elm_sortable_table$Table$stringColumn,
						'Deleted',
						function (_v1) {
							var s = _v1.b;
							return s.bP ? 'x' : '';
						})
					]),
				c3: $author$project$Bootstrap$tableCustomizations,
				er: A2(
					$elm$core$Basics$composeL,
					function ($) {
						return $.dl;
					},
					$elm$core$Tuple$second),
				et: setState
			});
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$html$Html$caption = _VirtualDom_node('caption');
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tfoot = _VirtualDom_node('tfoot');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $billstclair$elm_sortable_table$Table$Reversible = function (a) {
	return {$: 2, a: a};
};
var $billstclair$elm_sortable_table$Table$Sortable = function (a) {
	return {$: 1, a: a};
};
var $billstclair$elm_sortable_table$Table$Unsortable = {$: 0};
var $billstclair$elm_sortable_table$Table$onClick = F3(
	function (name, isReversed, toMsg) {
		return A2(
			$elm$html$Html$Events$on,
			'click',
			A2(
				$elm$json$Json$Decode$map,
				toMsg,
				A3(
					$elm$json$Json$Decode$map2,
					$billstclair$elm_sortable_table$Table$State,
					$elm$json$Json$Decode$succeed(name),
					$elm$json$Json$Decode$succeed(isReversed))));
	});
var $billstclair$elm_sortable_table$Table$toHeaderInfo = F3(
	function (_v0, toMsg, _v1) {
		var sortName = _v0.a;
		var isReversed = _v0.b;
		var name = _v1.a0;
		var sorter = _v1.ej;
		switch (sorter.$) {
			case 0:
				return _Utils_Tuple3(
					name,
					$billstclair$elm_sortable_table$Table$Unsortable,
					A3($billstclair$elm_sortable_table$Table$onClick, sortName, isReversed, toMsg));
			case 1:
				return _Utils_Tuple3(
					name,
					$billstclair$elm_sortable_table$Table$Sortable(
						!_Utils_eq(name, sortName)),
					A3($billstclair$elm_sortable_table$Table$onClick, name, false, toMsg));
			case 2:
				return _Utils_Tuple3(
					name,
					$billstclair$elm_sortable_table$Table$Sortable(
						_Utils_eq(name, sortName)),
					A3($billstclair$elm_sortable_table$Table$onClick, name, false, toMsg));
			case 3:
				return _Utils_eq(name, sortName) ? _Utils_Tuple3(
					name,
					$billstclair$elm_sortable_table$Table$Reversible(
						$elm$core$Maybe$Just(!isReversed)),
					A3($billstclair$elm_sortable_table$Table$onClick, name, !isReversed, toMsg)) : _Utils_Tuple3(
					name,
					$billstclair$elm_sortable_table$Table$Reversible($elm$core$Maybe$Nothing),
					A3($billstclair$elm_sortable_table$Table$onClick, name, false, toMsg));
			default:
				return _Utils_eq(name, sortName) ? _Utils_Tuple3(
					name,
					$billstclair$elm_sortable_table$Table$Reversible(
						$elm$core$Maybe$Just(isReversed)),
					A3($billstclair$elm_sortable_table$Table$onClick, name, !isReversed, toMsg)) : _Utils_Tuple3(
					name,
					$billstclair$elm_sortable_table$Table$Reversible($elm$core$Maybe$Nothing),
					A3($billstclair$elm_sortable_table$Table$onClick, name, false, toMsg));
		}
	});
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $elm$virtual_dom$VirtualDom$lazy3 = _VirtualDom_lazy3;
var $elm$html$Html$Lazy$lazy3 = $elm$virtual_dom$VirtualDom$lazy3;
var $elm$html$Html$td = _VirtualDom_node('td');
var $billstclair$elm_sortable_table$Table$viewCell = F2(
	function (data, _v0) {
		var viewData = _v0.ez;
		var details = viewData(data);
		return A2($elm$html$Html$td, details.aB, details.aC);
	});
var $billstclair$elm_sortable_table$Table$viewRowHelp = F3(
	function (columns, toRowAttrs, data) {
		return A2(
			$elm$html$Html$tr,
			toRowAttrs(data),
			A2(
				$elm$core$List$map,
				$billstclair$elm_sortable_table$Table$viewCell(data),
				columns));
	});
var $billstclair$elm_sortable_table$Table$viewRow = F4(
	function (toId, columns, toRowAttrs, data) {
		return _Utils_Tuple2(
			toId(data),
			A4($elm$html$Html$Lazy$lazy3, $billstclair$elm_sortable_table$Table$viewRowHelp, columns, toRowAttrs, data));
	});
var $billstclair$elm_sortable_table$Table$view = F3(
	function (conf, state, data) {
		var toId = conf.er;
		var toMsg = conf.et;
		var columns = conf.c2;
		var customizations = conf.c3;
		var theadDetails = customizations.bD(
			A2(
				$elm$core$List$map,
				A2($billstclair$elm_sortable_table$Table$toHeaderInfo, state, toMsg),
				columns));
		var thead = A2(
			$elm$html$Html$thead,
			theadDetails.aB,
			_List_fromArray(
				[
					A2($elm$html$Html$tr, _List_Nil, theadDetails.aC)
				]));
		var sortedData = A3($billstclair$elm_sortable_table$Table$getSortedData, conf, state, data);
		var tbody = A3(
			$elm$html$Html$Keyed$node,
			'tbody',
			customizations.bA,
			A2(
				$elm$core$List$map,
				A3($billstclair$elm_sortable_table$Table$viewRow, toId, columns, customizations.bt),
				sortedData));
		var withFoot = function () {
			var _v1 = customizations.bC;
			if (_v1.$ === 1) {
				return A2($elm$core$List$cons, tbody, _List_Nil);
			} else {
				var attributes = _v1.a.aB;
				var children = _v1.a.aC;
				return A2(
					$elm$core$List$cons,
					A2($elm$html$Html$tfoot, attributes, children),
					A2($elm$core$List$cons, tbody, _List_Nil));
			}
		}();
		return A2(
			$elm$html$Html$table,
			customizations.eo,
			function () {
				var _v0 = customizations.be;
				if (_v0.$ === 1) {
					return A2($elm$core$List$cons, thead, withFoot);
				} else {
					var attributes = _v0.a.aB;
					var children = _v0.a.aC;
					return A2(
						$elm$core$List$cons,
						A2($elm$html$Html$caption, attributes, children),
						A2($elm$core$List$cons, thead, withFoot));
				}
			}());
	});
var $author$project$Views$StudentTable$view = F4(
	function (cfg, state, students, isChecked) {
		return A3(
			$billstclair$elm_sortable_table$Table$view,
			cfg,
			state,
			A2(
				$elm$core$List$map,
				function (s) {
					return _Utils_Tuple2(
						isChecked(s),
						s);
				},
				students));
	});
var $author$project$Page$Class$viewTable = F2(
	function (cache, model) {
		var tableConfig = A2($author$project$Views$StudentTable$config, $author$project$Page$Class$SetTableState, $author$project$Page$Class$SelectStudent);
		var isChecked = function (s) {
			return A2($elm$core$Dict$member, s.dl, model.an);
		};
		var classMembers = function ($) {
			return $.cv;
		}(model.bf);
		var students = A2(
			$elm$core$List$filter,
			function (s) {
				return A2($elm$core$List$member, s.dl, classMembers);
			},
			cache.cv);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('print:none')
				]),
			_List_fromArray(
				[
					A4($author$project$Views$StudentTable$view, tableConfig, model.bm, students, isChecked)
				]));
	});
var $author$project$Page$Class$Delete = {$: 0};
var $author$project$Page$Class$RemoveSelectedStudents = {$: 7};
var $author$project$Components$btnSmall = function (attrs) {
	return $author$project$Components$btnBase(
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class('bg-blue-500 hover:bg-blue-600 text-sm px-2 py-1'),
			attrs));
};
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $author$project$Components$toolbar = F2(
	function (buttons, elts) {
		var mkBtn = function (_v0) {
			var msg = _v0.a;
			var disable = _v0.b;
			var txt = _v0.c;
			return A2(
				$author$project$Components$btnSmall,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('hover:bg-blue-600', !disable),
								_Utils_Tuple2('opacity-50 cursor-not-allowed', disable)
							])),
						$elm$html$Html$Attributes$class('mr-1'),
						$elm$html$Html$Events$onClick(msg),
						$elm$html$Html$Attributes$disabled(disable),
						$elm$html$Html$Attributes$type_('button')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(txt)
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex flex-wrap items-center mt-2 py-1')
				]),
			_Utils_ap(
				A2($elm$core$List$map, mkBtn, buttons),
				elts));
	});
var $author$project$Page$Class$viewToolbar = function (model) {
	var buttons = A2(
		$elm$core$List$cons,
		_Utils_Tuple3($author$project$Page$Class$Delete, false, 'Delete'),
		(!$elm$core$Dict$isEmpty(model.an)) ? _List_fromArray(
			[
				_Utils_Tuple3($author$project$Page$Class$RemoveSelectedStudents, false, 'Remove students from class')
			]) : _List_Nil);
	return A2($author$project$Components$toolbar, buttons, _List_Nil);
};
var $author$project$Page$Class$view = F2(
	function (session, model) {
		return {
			bL: A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('font-normal text-lg mb-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								function ($) {
									return $.a0;
								}(model.bf))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-sm text-gray-600 font-semi-bold mb-1')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(
									$elm$core$Maybe$withDefault,
									'',
									function ($) {
										return $.aY;
									}(model.bf)))
							])),
						$author$project$Page$Class$viewToolbar(model),
						$author$project$Views$Form$viewErrorMsgs(model.ai),
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-lg font-light mt-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Class members')
							])),
						$elm$core$List$isEmpty(model.bf.cv) ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mt-2 text-base')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mb-1')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('This class is empty.')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('You can select students in the table on the '),
										A2(
										$author$project$Components$link,
										_List_fromArray(
											[
												$author$project$Route$href(
												$author$project$Route$Teacher($author$project$Route$Students))
											]),
										'students page'),
										$elm$html$Html$text(' to add new members.')
									]))
							])) : A2(
						$author$project$Page$Class$viewTable,
						$author$project$Data$Session$getCache(session),
						model),
						A2(
						$author$project$Util$viewIf,
						model.aM,
						$author$project$Page$Class$confirmDeleteDialog(
							A2($author$project$Page$Class$userIsOwner, session, model.bf)))
					])),
			cE: 'Class ' + model.bf.a0
		};
	});
var $author$project$Page$Classes$DismissAddClass = {$: 2};
var $author$project$AddClassForm$SetDescription = function (a) {
	return {$: 2, a: a};
};
var $author$project$AddClassForm$SetName = function (a) {
	return {$: 1, a: a};
};
var $author$project$AddClassForm$SubmitForm = {$: 0};
var $author$project$Bootstrap$errorClass = function (maybeError) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (_v0) {
				return 'has-error';
			},
			maybeError));
};
var $author$project$AddClassForm$fieldError = F2(
	function (field, errors) {
		return A2(
			$elm_community$list_extra$List$Extra$find,
			function (e) {
				return _Utils_eq(e.a, field);
			},
			errors);
	});
var $author$project$Views$Form$fcHeightPadding = $elm$html$Html$Attributes$class('h-8 px-3 py-1 ');
var $author$project$Views$Form$input = function (attrs) {
	return $elm$html$Html$input(
		_Utils_ap(
			_List_fromArray(
				[
					$author$project$Views$Form$fcStyle,
					$author$project$Views$Form$fcHeightPadding,
					$elm$html$Html$Attributes$type_('text')
				]),
			attrs));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Views$Form$viewErrors = function (errors) {
	return $author$project$Views$Form$viewErrorMsgs(
		A2($elm$core$List$map, $elm$core$Tuple$second, errors));
};
var $author$project$AddClassForm$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Views$Form$viewErrors(model.ai),
				A2(
				$elm$html$Html$form,
				_List_fromArray(
					[
						$elm$html$Html$Events$onSubmit($author$project$AddClassForm$SubmitForm)
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Views$Form$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('w-full mb-2'),
								$elm$html$Html$Attributes$class(
								$author$project$Bootstrap$errorClass(
									A2($author$project$AddClassForm$fieldError, 1, model.ai))),
								$elm$html$Html$Events$onInput($author$project$AddClassForm$SetName),
								$elm$html$Html$Attributes$placeholder('Class name'),
								$elm$html$Html$Attributes$tabindex(1)
							]),
						_List_Nil),
						A2(
						$author$project$Views$Form$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('w-full mb-2'),
								$elm$html$Html$Attributes$class(
								$author$project$Bootstrap$errorClass(
									A2($author$project$AddClassForm$fieldError, 2, model.ai))),
								$elm$html$Html$Events$onInput($author$project$AddClassForm$SetDescription),
								$elm$html$Html$Attributes$placeholder('Class description'),
								$elm$html$Html$Attributes$tabindex(2)
							]),
						_List_Nil),
						A2(
						$author$project$Components$btn,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('submit'),
								$elm$html$Html$Attributes$tabindex(3)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Create class')
							]))
					]))
			]));
};
var $author$project$Page$Classes$addClassesDialog = function (form) {
	return A3(
		$author$project$Modal$view,
		'Add Class',
		$author$project$Page$Classes$DismissAddClass,
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full max-w-xl p-4 flex flex-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-2 text-lg')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Please enter a name and a description for the new class')
						])),
					A2(
					$elm$html$Html$map,
					$author$project$Page$Classes$AddClassFormMsg,
					$author$project$AddClassForm$view(form))
				])));
};
var $author$project$Util$maybeView = F2(
	function (f, a_) {
		if (!a_.$) {
			var a = a_.a;
			return f(a);
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Page$Classes$ShowAddClass = {$: 3};
var $author$project$Bootstrap$btn = F3(
	function (id_, action, txt) {
		return A2(
			$author$project$Components$btn,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(id_),
					$elm$html$Html$Events$onClick(action),
					$elm$html$Html$Attributes$type_('button')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(txt)
				]));
	});
var $author$project$Page$Classes$subtools = _List_fromArray(
	[
		A3($author$project$Bootstrap$btn, 'add-class-button', $author$project$Page$Classes$ShowAddClass, 'Add Class')
	]);
var $author$project$Views$TeacherToolbar$routeTo = function (r) {
	return $author$project$Route$routeToString(
		$author$project$Route$Teacher(r));
};
var $author$project$Views$TeacherToolbar$btn = F4(
	function (id_, page, link, txt) {
		return _Utils_eq(page, link) ? A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('-mb-px mr-1')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(id_),
							$elm$html$Html$Attributes$class('bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-600  font-semibold'),
							$elm$html$Html$Attributes$href(
							$author$project$Views$TeacherToolbar$routeTo(link))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(txt)
						]))
				])) : A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('mr-1')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(id_),
							$elm$html$Html$Attributes$class('bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-600 font-semibold'),
							$elm$html$Html$Attributes$href(
							$author$project$Views$TeacherToolbar$routeTo(link))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(txt)
						]))
				]));
	});
var $author$project$Views$TeacherToolbar$view = F3(
	function (session, page, subtools) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('teacher-toolbar'),
					$elm$html$Html$Attributes$class('print:none flex justify-between flex-wrap')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex-1 flex border-b mr-4')
						]),
					_List_fromArray(
						[
							A4($author$project$Views$TeacherToolbar$btn, 'students-button', page, $author$project$Route$Students, 'Students'),
							A4($author$project$Views$TeacherToolbar$btn, 'classes-button', page, $author$project$Route$Classes, 'Classes'),
							A2(
							$author$project$Util$viewIf,
							$author$project$Data$Session$isSchoolAdmin(session),
							A4($author$project$Views$TeacherToolbar$btn, 'teachers-button', page, $author$project$Route$Teachers, 'Teachers'))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex')
						]),
					subtools)
				]));
	});
var $author$project$Page$Classes$SetTableState = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Classes$viewClassLink = function (_class) {
	return A2(
		$billstclair$elm_sortable_table$Table$HtmlDetails,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$author$project$Bootstrap$link,
				$author$project$Route$href(
					$author$project$Route$Teacher(
						$author$project$Route$Class(_class.dl))),
				_class.a0)
			]));
};
var $author$project$Page$Classes$nameColumn = $billstclair$elm_sortable_table$Table$veryCustomColumn(
	{
		a0: 'Class name',
		ej: $billstclair$elm_sortable_table$Table$increasingOrDecreasingBy(
			function ($) {
				return $.a0;
			}),
		ez: $author$project$Page$Classes$viewClassLink
	});
var $author$project$Page$Classes$classesTableConfig = $billstclair$elm_sortable_table$Table$customConfig(
	{
		c2: _List_fromArray(
			[
				$author$project$Page$Classes$nameColumn,
				A2(
				$billstclair$elm_sortable_table$Table$stringColumn,
				'Description',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$Maybe$withDefault(''),
					function ($) {
						return $.aY;
					})),
				A2(
				$billstclair$elm_sortable_table$Table$intColumn,
				'Number of Students',
				A2(
					$elm$core$Basics$composeL,
					$elm$core$List$length,
					function ($) {
						return $.cv;
					}))
			]),
		c3: $author$project$Bootstrap$tableCustomizations,
		er: function ($) {
			return $.dl;
		},
		et: $author$project$Page$Classes$SetTableState
	});
var $author$project$Page$Classes$viewTable = F2(
	function (cache, model) {
		return A3($billstclair$elm_sortable_table$Table$view, $author$project$Page$Classes$classesTableConfig, model.by, cache.cZ);
	});
var $author$project$Page$Classes$view = F2(
	function (session, model) {
		return {
			bL: A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-col')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-16')
							]),
						_List_fromArray(
							[
								A3($author$project$Views$TeacherToolbar$view, session, $author$project$Route$Classes, $author$project$Page$Classes$subtools)
							])),
						A2(
						$author$project$Page$Classes$viewTable,
						$author$project$Data$Session$getCache(session),
						model),
						A2($author$project$Util$maybeView, $author$project$Page$Classes$addClassesDialog, model.ae)
					])),
			cE: 'Classes'
		};
	});
var $author$project$Page$Editor$CancelChanges = {$: 4};
var $author$project$Page$Editor$ContentInput = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Editor$CurriculumSelectMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Page$Editor$DecrementLevel = {$: 15};
var $author$project$Page$Editor$IncrementLevel = {$: 14};
var $author$project$Page$Editor$Next = {$: 17};
var $author$project$Page$Editor$Previous = {$: 18};
var $author$project$Page$Editor$QualificationSelectMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Page$Editor$Save = {$: 2};
var $author$project$Page$Editor$SetClarifyWord = function (a) {
	return {$: 16, a: a};
};
var $author$project$Page$Editor$SetTitle = function (a) {
	return {$: 12, a: a};
};
var $author$project$Page$Editor$TagSelectMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Page$Editor$ToggleEnabled = {$: 13};
var $author$project$Views$Form$label = function (attrs) {
	return $elm$html$Html$label(
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class('block text-gray-800 text-sm font-bold'),
			attrs));
};
var $author$project$Views$Form$checkbox = F3(
	function (msg, checked_, lbl) {
		return A2(
			$author$project$Views$Form$label,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex items-center')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(lbl),
					A2(
					$author$project$Views$Form$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mx-2'),
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Attributes$checked(checked_),
							$elm$html$Html$Events$onClick(msg)
						]),
					_List_Nil)
				]));
	});
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Views$Form$textarea = function (attrs) {
	return $elm$html$Html$textarea(
		A2(
			$elm$core$List$cons,
			$author$project$Views$Form$fcStyle,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class('p-2'),
				attrs)));
};
var $sporto$elm_select$Select$PrivateMsg = $elm$core$Basics$identity;
var $sporto$elm_select$Select$Messages$OnClear = {$: 3};
var $sporto$elm_select$Select$Styles$clearClass = 'elm-select-clear ';
var $sporto$elm_select$Select$Styles$clearStyles = _List_fromArray(
	[
		_Utils_Tuple2('cursor', 'pointer'),
		_Utils_Tuple2('height', '1rem'),
		_Utils_Tuple2('line-height', '0rem'),
		_Utils_Tuple2('margin-top', '-0.5rem'),
		_Utils_Tuple2('position', 'absolute'),
		_Utils_Tuple2('right', '0.25rem'),
		_Utils_Tuple2('top', '50%')
	]);
var $sporto$elm_select$Select$Styles$inputControlClass = 'elm-select-input-control ';
var $sporto$elm_select$Select$Styles$inputControlStyles = _List_fromArray(
	[
		_Utils_Tuple2('position', 'relative'),
		_Utils_Tuple2('background', 'white')
	]);
var $sporto$elm_select$Select$Styles$inputWrapperClass = 'elm-select-input-wrapper ';
var $sporto$elm_select$Select$Styles$inputWrapperStyles = _List_fromArray(
	[
		_Utils_Tuple2('display', 'flex'),
		_Utils_Tuple2('flex', '1'),
		_Utils_Tuple2('flex-direction', 'row'),
		_Utils_Tuple2('flex-wrap', 'wrap'),
		_Utils_Tuple2('overflow', 'hidden')
	]);
var $sporto$elm_select$Select$Utils$difference = F2(
	function (listA, listB) {
		return A2(
			$elm$core$List$filter,
			function (x) {
				return !A2(
					$elm$core$List$any,
					function (y) {
						return _Utils_eq(x, y);
					},
					listB);
			},
			listA);
	});
var $sporto$elm_select$Select$Search$filterItems = F3(
	function (config, availableItems, selectedItems) {
		return config.dw ? A2($sporto$elm_select$Select$Utils$difference, availableItems, selectedItems) : availableItems;
	});
var $sporto$elm_select$Select$Search$maybeCuttoff = F2(
	function (config, items) {
		var _v0 = config.c4;
		if (!_v0.$) {
			var cutoff = _v0.a;
			return A2($elm$core$List$take, cutoff, items);
		} else {
			return items;
		}
	});
var $sporto$elm_select$Select$Search$matchedItemsWithCutoff = F4(
	function (config, maybeQuery, availableItems, selectedItems) {
		if (maybeQuery.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (maybeQuery.a === '') {
				return config.c8 ? $elm$core$Maybe$Just(
					A2(
						$sporto$elm_select$Select$Search$maybeCuttoff,
						config,
						A3($sporto$elm_select$Select$Search$filterItems, config, availableItems, selectedItems))) : $elm$core$Maybe$Nothing;
			} else {
				var query = maybeQuery.a;
				return A2(
					$elm$core$Maybe$map,
					$sporto$elm_select$Select$Search$maybeCuttoff(config),
					A2(
						config.de,
						query,
						A3($sporto$elm_select$Select$Search$filterItems, config, availableItems, selectedItems)));
			}
		}
	});
var $sporto$elm_select$Select$Messages$OnRemoveItem = function (a) {
	return {$: 4, a: a};
};
var $sporto$elm_select$Select$Messages$OnFocus = {$: 1};
var $sporto$elm_select$Select$Messages$OnQueryChange = function (a) {
	return {$: 8, a: a};
};
var $elm$html$Html$Attributes$autocomplete = function (bool) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{p: nodeList, n: nodeListSize, o: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $sporto$elm_select$Select$Styles$inputClass = 'elm-select-input';
var $sporto$elm_select$Select$Styles$inputStyles = _List_fromArray(
	[
		_Utils_Tuple2('flex', '1'),
		_Utils_Tuple2('border', 'none'),
		_Utils_Tuple2('outline', 'none'),
		_Utils_Tuple2('min-height', '1.3rem'),
		_Utils_Tuple2('font-size', '.75rem')
	]);
var $sporto$elm_select$Select$Messages$NoOp = {$: 0};
var $sporto$elm_select$Select$Messages$OnBlur = {$: 2};
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $sporto$elm_select$Select$Utils$referenceDataName = 'data-select-id';
var $sporto$elm_select$Select$Events$onBlurAttribute = F2(
	function (config, state) {
		var dataDecoder = A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['relatedTarget', 'attributes', $sporto$elm_select$Select$Utils$referenceDataName, 'value']),
			$elm$json$Json$Decode$string);
		var attrToMsg = function (attr) {
			return _Utils_eq(attr, state.dl) ? $sporto$elm_select$Select$Messages$NoOp : $sporto$elm_select$Select$Messages$OnBlur;
		};
		var blur = A2(
			$elm$json$Json$Decode$map,
			$elm$core$Maybe$withDefault($sporto$elm_select$Select$Messages$OnBlur),
			A2(
				$elm$json$Json$Decode$map,
				$elm$core$Maybe$map(attrToMsg),
				$elm$json$Json$Decode$maybe(dataDecoder)));
		return A2($elm$html$Html$Events$on, 'focusout', blur);
	});
var $elm$html$Html$Events$onFocus = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'focus',
		$elm$json$Json$Decode$succeed(msg));
};
var $sporto$elm_select$Select$Messages$OnSelect = function (a) {
	return {$: 9, a: a};
};
var $elm$html$Html$Events$keyCode = A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int);
var $sporto$elm_select$Select$Select$Input$onKeyPressAttribute = function (maybeItem) {
	var fn = function (code) {
		switch (code) {
			case 9:
				return A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Decode$fail('nothing selected'),
					A2(
						$elm$core$Maybe$map,
						A2($elm$core$Basics$composeL, $elm$json$Json$Decode$succeed, $sporto$elm_select$Select$Messages$OnSelect),
						maybeItem));
			case 13:
				return A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Decode$fail('nothing selected'),
					A2(
						$elm$core$Maybe$map,
						A2($elm$core$Basics$composeL, $elm$json$Json$Decode$succeed, $sporto$elm_select$Select$Messages$OnSelect),
						maybeItem));
			default:
				return $elm$json$Json$Decode$fail('not TAB or ENTER');
		}
	};
	return A2(
		$elm$html$Html$Events$on,
		'keypress',
		A2($elm$json$Json$Decode$andThen, fn, $elm$html$Html$Events$keyCode));
};
var $sporto$elm_select$Select$Messages$OnDownArrow = {$: 6};
var $sporto$elm_select$Select$Messages$OnEsc = {$: 5};
var $sporto$elm_select$Select$Messages$OnUpArrow = {$: 7};
var $sporto$elm_select$Select$Select$Input$onKeyUpAttribute = function (maybeItem) {
	var selectItem = function () {
		if (maybeItem.$ === 1) {
			return $elm$json$Json$Decode$fail('not Enter');
		} else {
			var item = maybeItem.a;
			return $elm$json$Json$Decode$succeed(
				$sporto$elm_select$Select$Messages$OnSelect(item));
		}
	}();
	var fn = function (code) {
		switch (code) {
			case 13:
				return selectItem;
			case 38:
				return $elm$json$Json$Decode$succeed($sporto$elm_select$Select$Messages$OnUpArrow);
			case 40:
				return $elm$json$Json$Decode$succeed($sporto$elm_select$Select$Messages$OnDownArrow);
			case 27:
				return $elm$json$Json$Decode$succeed($sporto$elm_select$Select$Messages$OnEsc);
			default:
				return $elm$json$Json$Decode$fail('not ENTER');
		}
	};
	return A2(
		$elm$html$Html$Events$on,
		'keyup',
		A2($elm$json$Json$Decode$andThen, fn, $elm$html$Html$Events$keyCode));
};
var $sporto$elm_select$Select$Utils$referenceAttr = F2(
	function (config, model) {
		return A2($elm$html$Html$Attributes$attribute, $sporto$elm_select$Select$Utils$referenceDataName, model.dl);
	});
var $sporto$elm_select$Select$Utils$stylesToAttrs = function (styles) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var k = _v0.a;
			var v = _v0.b;
			return A2($elm$html$Html$Attributes$style, k, v);
		},
		styles);
};
var $sporto$elm_select$Select$Select$Input$inputAttributes = F5(
	function (config, model, availableItems, selectedItems, maybeMatchedItems) {
		var preselectedItem = function () {
			if (maybeMatchedItems.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var matchedItems = maybeMatchedItems.a;
				if (config.dw) {
					var _v2 = model.bY;
					if (_v2.$ === 1) {
						return $elm$core$List$head(matchedItems);
					} else {
						var n = _v2.a;
						return A2(
							$elm$core$Array$get,
							n % $elm$core$List$length(matchedItems),
							$elm$core$Array$fromList(matchedItems));
					}
				} else {
					return $elm$core$List$head(matchedItems);
				}
			}
		}();
		var _v0 = $elm$core$List$isEmpty(selectedItems) ? _Utils_Tuple2(config.ea, config.eb) : _Utils_Tuple2('', _List_Nil);
		var promptClass = _v0.a;
		var promptStyles = _v0.b;
		var inputClasses = A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[$sporto$elm_select$Select$Styles$inputClass, config.dp, promptClass]));
		var inputStyles = $elm$core$List$concat(
			_List_fromArray(
				[$sporto$elm_select$Select$Styles$inputStyles, config.dt, promptStyles]));
		var inputStylesAttrs = $sporto$elm_select$Select$Utils$stylesToAttrs(inputStyles);
		return _Utils_ap(
			_List_fromArray(
				[
					$elm$html$Html$Attributes$autocomplete(false),
					A2($elm$html$Html$Attributes$attribute, 'autocorrect', 'off'),
					$elm$html$Html$Attributes$id(config.ds),
					A2($sporto$elm_select$Select$Events$onBlurAttribute, config, model),
					$sporto$elm_select$Select$Select$Input$onKeyUpAttribute(preselectedItem),
					$sporto$elm_select$Select$Select$Input$onKeyPressAttribute(preselectedItem),
					$elm$html$Html$Events$onInput($sporto$elm_select$Select$Messages$OnQueryChange),
					$elm$html$Html$Events$onFocus($sporto$elm_select$Select$Messages$OnFocus),
					A2($sporto$elm_select$Select$Utils$referenceAttr, config, model),
					$elm$html$Html$Attributes$class(inputClasses)
				]),
			inputStylesAttrs);
	});
var $sporto$elm_select$Select$Styles$multiInputItemClass = 'elm-select-multi-input-item ';
var $sporto$elm_select$Select$Styles$multiInputItemContainerClass = 'elm-select-multi-input-item-container ';
var $sporto$elm_select$Select$Styles$multiInputItemContainerStyles = _List_fromArray(
	[
		_Utils_Tuple2('display', 'flex'),
		_Utils_Tuple2('flex-direction', 'row'),
		_Utils_Tuple2('align-items', 'center'),
		_Utils_Tuple2('justify-content', 'center')
	]);
var $sporto$elm_select$Select$Styles$multiInputItemStyles = _List_fromArray(
	[
		_Utils_Tuple2('display', 'flex'),
		_Utils_Tuple2('border-width', '0.1rem'),
		_Utils_Tuple2('border-radius', '0.2em'),
		_Utils_Tuple2('border-color', '#E3E5E8'),
		_Utils_Tuple2('background-color', '#E3E5E8'),
		_Utils_Tuple2('font-size', '.75rem'),
		_Utils_Tuple2('margin-right', '.2rem')
	]);
var $sporto$elm_select$Select$Styles$multiInputItemText = _List_fromArray(
	[
		_Utils_Tuple2('text-overflow', 'ellipsis'),
		_Utils_Tuple2('padding-left', '.5rem'),
		_Utils_Tuple2('padding-right', '.3rem'),
		_Utils_Tuple2('padding-top', '.05rem'),
		_Utils_Tuple2('padding-bottom', '.05rem')
	]);
var $sporto$elm_select$Select$Styles$multiInputRemoveItem = _List_fromArray(
	[
		_Utils_Tuple2('display', 'flex'),
		_Utils_Tuple2('alignItems', 'center'),
		_Utils_Tuple2('justifyContent', 'center'),
		_Utils_Tuple2('padding-right', '.1rem')
	]);
var $sporto$elm_select$Select$Select$Input$onClickWithoutPropagation = function (msg) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'click',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(msg, false)));
};
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $sporto$elm_select$Select$Styles$removeItemSvgClass = 'elm-select-remove-item ';
var $sporto$elm_select$Select$Styles$removeItemSvgStyles = _List_fromArray(
	[
		_Utils_Tuple2('cursor', 'pointer')
	]);
var $sporto$elm_select$Select$Select$RemoveItem$svgPath = 'M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z';
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $sporto$elm_select$Select$Select$RemoveItem$view = function (config) {
	return A2(
		$elm$svg$Svg$svg,
		_Utils_ap(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class(
					_Utils_ap(config.ci, $sporto$elm_select$Select$Styles$removeItemSvgClass)),
					$elm$svg$Svg$Attributes$width('14'),
					$elm$svg$Svg$Attributes$height('14'),
					$elm$svg$Svg$Attributes$viewBox('0 0 20 20')
				]),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var f = _v0.a;
					var s = _v0.b;
					return A2($elm$html$Html$Attributes$style, f, s);
				},
				_Utils_ap(config.cj, $sporto$elm_select$Select$Styles$removeItemSvgStyles))),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$path,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d($sporto$elm_select$Select$Select$RemoveItem$svgPath)
					]),
				_List_Nil)
			]));
};
var $sporto$elm_select$Select$Select$Input$multiInput = F5(
	function (config, model, availableItems, selected, maybeMatchedItems) {
		var val = A2($elm$core$Maybe$withDefault, '', model.cg);
		var multiInputItemStyles = A2($elm$core$List$append, $sporto$elm_select$Select$Styles$multiInputItemStyles, config.dJ);
		var multiInputItemStylesAttrs = $sporto$elm_select$Select$Utils$stylesToAttrs(multiInputItemStyles);
		var multiInputItemContainerStyles = A2($elm$core$List$append, $sporto$elm_select$Select$Styles$multiInputItemContainerStyles, config.dI);
		var multiInputItemContainerStylesAttrs = $sporto$elm_select$Select$Utils$stylesToAttrs(multiInputItemContainerStyles);
		var multiInputItemContainerClasses = _Utils_ap($sporto$elm_select$Select$Styles$multiInputItemContainerClass, config.dH);
		var multiInputItemClasses = _Utils_ap($sporto$elm_select$Select$Styles$multiInputItemClass, config.dG);
		var viewMultiItems = function (subItems) {
			return A2(
				$elm$html$Html$div,
				A2(
					$elm$core$List$cons,
					$elm$html$Html$Attributes$class(multiInputItemContainerClasses),
					multiInputItemContainerStylesAttrs),
				A2(
					$elm$core$List$map,
					function (item) {
						return A2(
							$elm$html$Html$div,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class(multiInputItemClasses),
								multiInputItemStylesAttrs),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									A2(
										$elm$core$List$map,
										function (_v0) {
											var f = _v0.a;
											var s = _v0.b;
											return A2($elm$html$Html$Attributes$style, f, s);
										},
										$sporto$elm_select$Select$Styles$multiInputItemText),
									_List_fromArray(
										[
											$elm$html$Html$text(
											config.es(item))
										])),
									A2(
									$elm$core$Maybe$withDefault,
									A2($elm$html$Html$span, _List_Nil, _List_Nil),
									A2(
										$elm$core$Maybe$map,
										function (_v1) {
											return A2(
												$elm$html$Html$div,
												A2(
													$elm$core$List$cons,
													$sporto$elm_select$Select$Select$Input$onClickWithoutPropagation(
														$sporto$elm_select$Select$Messages$OnRemoveItem(item)),
													A2(
														$elm$core$List$map,
														function (_v2) {
															var f = _v2.a;
															var s = _v2.b;
															return A2($elm$html$Html$Attributes$style, f, s);
														},
														$sporto$elm_select$Select$Styles$multiInputRemoveItem)),
												_List_fromArray(
													[
														$sporto$elm_select$Select$Select$RemoveItem$view(config)
													]));
										},
										config.d1))
								]));
					},
					subItems));
		};
		return _List_fromArray(
			[
				viewMultiItems(selected),
				A2(
				$elm$html$Html$input,
				_Utils_ap(
					A5($sporto$elm_select$Select$Select$Input$inputAttributes, config, model, availableItems, selected, maybeMatchedItems),
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(val)
							]),
						$elm$core$List$isEmpty(selected) ? _List_fromArray(
							[
								$elm$html$Html$Attributes$placeholder(config.d9)
							]) : _List_Nil)),
				_List_Nil)
			]);
	});
var $sporto$elm_select$Select$Select$Input$singleInput = F5(
	function (config, model, availableItems, selectedItems, maybeMatchedItems) {
		var val = function () {
			var _v0 = model.cg;
			if (_v0.$ === 1) {
				return A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Maybe$map,
						config.es,
						$elm$core$List$head(selectedItems)));
			} else {
				var query = _v0.a;
				return query;
			}
		}();
		return _List_fromArray(
			[
				A2($elm$html$Html$div, _List_Nil, _List_Nil),
				A2(
				$elm$html$Html$input,
				_Utils_ap(
					A5($sporto$elm_select$Select$Select$Input$inputAttributes, config, model, availableItems, selectedItems, maybeMatchedItems),
					_List_fromArray(
						[
							$elm$html$Html$Attributes$value(val),
							$elm$html$Html$Attributes$placeholder(config.d9)
						])),
				_List_Nil)
			]);
	});
var $sporto$elm_select$Select$Styles$underlineClass = 'elm-select-underline ';
var $sporto$elm_select$Select$Styles$underlineStyles = _List_Nil;
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $sporto$elm_select$Select$Select$Clear$svgPath = 'M5,-2.5575245e-15 C3.66990575,-0.0132303807 2.39043461,0.509304222 1.44986941,1.44986941 C0.509304222,2.39043461 -0.0132303807,3.66990575 1.22125617e-14,5 C-0.0132303807,6.33009425 0.509304222,7.60956539 1.44986941,8.55013059 C2.39043461,9.49069578 3.66990575,10.0132304 5,10 C6.33009425,10.0132304 7.60956539,9.49069578 8.55013059,8.55013059 C9.49069578,7.60956539 10.0132304,6.33009425 10,5 C10.0132304,3.66990575 9.49069578,2.39043461 8.55013059,1.44986941 C7.60956539,0.509304222 6.33009425,-0.0132303807 5,-2.5575245e-15 Z M7,6.2 C7.20014558,6.42911206 7.20014558,6.77088794 7,7 C6.77088794,7.20014558 6.42911206,7.20014558 6.2,7 L5,5.8 L3.7,7 C3.60882286,7.09587507 3.48230759,7.15015018 3.35,7.15015018 C3.21769241,7.15015018 3.09117714,7.09587507 3,7 C2.90412493,6.90882286 2.84984982,6.78230759 2.84984982,6.65 C2.84984982,6.51769241 2.90412493,6.39117714 3,6.3 L4.2,5 L3,3.8 C2.79985442,3.57088794 2.79985442,3.22911206 3,3 C3.22776052,2.79628479 3.57223948,2.79628479 3.8,3 L5,4.2 L6.3,3 C6.39117714,2.90412493 6.51769241,2.84984982 6.65,2.84984982 C6.78230759,2.84984982 6.90882286,2.90412493 7,3 C7.09587507,3.09117714 7.15015018,3.21769241 7.15015018,3.35 C7.15015018,3.48230759 7.09587507,3.60882286 7,3.7 L5.8,5 L7,6.2 Z';
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $sporto$elm_select$Select$Select$Clear$view = function (config) {
	return A2(
		$elm$svg$Svg$svg,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$class(config.c0),
				$elm$svg$Svg$Attributes$width('16'),
				$elm$svg$Svg$Attributes$height('16'),
				$elm$svg$Svg$Attributes$viewBox('0 0 16 16')
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$transform('translate(3, 3)')
					]),
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$path,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$d($sporto$elm_select$Select$Select$Clear$svgPath)
							]),
						_List_Nil)
					]))
			]));
};
var $sporto$elm_select$Select$Select$Input$view = F4(
	function (config, model, availableItems, selectedItems) {
		var underlineStyles = A2($elm$core$List$append, $sporto$elm_select$Select$Styles$underlineStyles, config.ew);
		var underlineClasses = _Utils_ap($sporto$elm_select$Select$Styles$underlineClass, config.ev);
		var underline = A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$elm$html$Html$Attributes$class(underlineClasses),
				A2(
					$elm$core$List$map,
					function (_v1) {
						var f = _v1.a;
						var s = _v1.b;
						return A2($elm$html$Html$Attributes$style, f, s);
					},
					underlineStyles)),
			_List_Nil);
		var maybeMatchedItems = A4($sporto$elm_select$Select$Search$matchedItemsWithCutoff, config, model.cg, availableItems, selectedItems);
		var inputWrapperStyles = A2($elm$core$List$append, $sporto$elm_select$Select$Styles$inputWrapperStyles, config.dv);
		var inputWrapperStylesAttrs = $sporto$elm_select$Select$Utils$stylesToAttrs(inputWrapperStyles);
		var inputWrapperClass = _Utils_ap($sporto$elm_select$Select$Styles$inputWrapperClass, config.du);
		var inputControlStyles = A2($elm$core$List$append, $sporto$elm_select$Select$Styles$inputControlStyles, config.dr);
		var inputControlStylesAttrs = $sporto$elm_select$Select$Utils$stylesToAttrs(inputControlStyles);
		var inputControlClass = _Utils_ap($sporto$elm_select$Select$Styles$inputControlClass, config.dq);
		var input = config.dw ? A5($sporto$elm_select$Select$Select$Input$multiInput, config, model, availableItems, selectedItems, maybeMatchedItems) : A5($sporto$elm_select$Select$Select$Input$singleInput, config, model, availableItems, selectedItems, maybeMatchedItems);
		var clearStyles = A2($elm$core$List$append, $sporto$elm_select$Select$Styles$clearStyles, config.c$);
		var clearClasses = _Utils_ap($sporto$elm_select$Select$Styles$clearClass, config.c_);
		var clear = ($elm$core$List$isEmpty(selectedItems) || (!config.dh)) ? $elm$html$Html$text('') : A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(clearClasses),
						$sporto$elm_select$Select$Select$Input$onClickWithoutPropagation($sporto$elm_select$Select$Messages$OnClear)
					]),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var f = _v0.a;
						var s = _v0.b;
						return A2($elm$html$Html$Attributes$style, f, s);
					},
					clearStyles)),
			_List_fromArray(
				[
					$sporto$elm_select$Select$Select$Clear$view(config)
				]));
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(inputControlClass)
					]),
				inputControlStylesAttrs),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(inputWrapperClass)
							]),
						inputWrapperStylesAttrs),
					input),
					underline,
					clear
				]));
	});
var $sporto$elm_select$Select$Styles$hiddenMenuStyles = _List_fromArray(
	[
		_Utils_Tuple2('display', 'none')
	]);
var $sporto$elm_select$Select$Styles$menuItemClass = 'elm-select-item ';
var $sporto$elm_select$Select$Select$Item$baseItemClasses = function (config) {
	return _Utils_ap($sporto$elm_select$Select$Styles$menuItemClass, config.dx);
};
var $sporto$elm_select$Select$Select$Item$baseItemStyles = function (config) {
	return config.dz;
};
var $sporto$elm_select$Select$Styles$menuItemStyles = _List_fromArray(
	[
		_Utils_Tuple2('cursor', 'pointer')
	]);
var $elm$html$Html$Events$onMouseDown = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'mousedown',
		$elm$json$Json$Decode$succeed(msg));
};
var $sporto$elm_select$Select$Select$Item$view = F5(
	function (config, state, itemCount, index, item) {
		var itemHtml = function () {
			var _v3 = config.dy;
			if (_v3.$ === 1) {
				return $elm$html$Html$text(
					config.es(item));
			} else {
				var fn = _v3.a;
				return A2(
					$elm$html$Html$map,
					function (_v4) {
						return $sporto$elm_select$Select$Messages$NoOp;
					},
					fn(item));
			}
		}();
		var _v0 = function () {
			var _v1 = state.bY;
			if (_v1.$ === 1) {
				return _Utils_Tuple2('', _List_Nil);
			} else {
				var highlighted = _v1.a;
				return _Utils_eq(highlighted % itemCount, index) ? _Utils_Tuple2(config.dj, config.dk) : _Utils_Tuple2('', _List_Nil);
			}
		}();
		var highlightedItemClass = _v0.a;
		var highlightedItemStyles = _v0.b;
		var classes = A2(
			$elm$core$String$join,
			' ',
			_List_fromArray(
				[
					$sporto$elm_select$Select$Select$Item$baseItemClasses(config),
					highlightedItemClass
				]));
		var styles = $elm$core$List$concat(
			_List_fromArray(
				[
					$sporto$elm_select$Select$Styles$menuItemStyles,
					$sporto$elm_select$Select$Select$Item$baseItemStyles(config),
					highlightedItemStyles
				]));
		return A2(
			$elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(classes),
						$elm$html$Html$Events$onMouseDown(
						$sporto$elm_select$Select$Messages$OnSelect(item)),
						A2($sporto$elm_select$Select$Utils$referenceAttr, config, state)
					]),
				A2(
					$elm$core$List$map,
					function (_v2) {
						var f = _v2.a;
						var s = _v2.b;
						return A2($elm$html$Html$Attributes$style, f, s);
					},
					styles)),
			_List_fromArray(
				[itemHtml]));
	});
var $sporto$elm_select$Select$Styles$menuClass = 'elm-select-menu ';
var $sporto$elm_select$Select$Select$Menu$viewClassAttr = function (config) {
	return $elm$html$Html$Attributes$class(
		_Utils_ap($sporto$elm_select$Select$Styles$menuClass, config.dD));
};
var $sporto$elm_select$Select$Select$Item$viewNotFound = function (config) {
	var styles = A2(
		$elm$core$List$append,
		$sporto$elm_select$Select$Select$Item$baseItemStyles(config),
		config.dZ);
	var classes = A2(
		$elm$core$String$join,
		' ',
		_List_fromArray(
			[
				$sporto$elm_select$Select$Select$Item$baseItemClasses(config),
				config.dX
			]));
	return (config.dW === '') ? $elm$html$Html$text('') : A2(
		$elm$html$Html$div,
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class(classes),
			A2(
				$elm$core$List$map,
				function (_v0) {
					var f = _v0.a;
					var s = _v0.b;
					return A2($elm$html$Html$Attributes$style, f, s);
				},
				styles)),
		_List_fromArray(
			[
				$elm$html$Html$text(config.dW)
			]));
};
var $sporto$elm_select$Select$Styles$visibleMenuStyles = _List_fromArray(
	[
		_Utils_Tuple2('position', 'absolute'),
		_Utils_Tuple2('z-index', '1')
	]);
var $sporto$elm_select$Select$Select$Menu$viewStyles = function (config) {
	return A2($elm$core$List$append, $sporto$elm_select$Select$Styles$visibleMenuStyles, config.dE);
};
var $sporto$elm_select$Select$Select$Menu$menu = F3(
	function (config, model, matchedItems) {
		var noResultElement = _Utils_eq(matchedItems, _List_Nil) ? $sporto$elm_select$Select$Select$Item$viewNotFound(config) : $elm$html$Html$text('');
		var itemCount = $elm$core$List$length(matchedItems);
		var hideWhenNotFound = (!config.dY) && _Utils_eq(matchedItems, _List_Nil);
		var menuStyle = hideWhenNotFound ? A2(
			$elm$core$List$map,
			function (_v0) {
				var f = _v0.a;
				var s = _v0.b;
				return A2($elm$html$Html$Attributes$style, f, s);
			},
			$sporto$elm_select$Select$Styles$hiddenMenuStyles) : A2(
			$elm$core$List$map,
			function (_v1) {
				var f = _v1.a;
				var s = _v1.b;
				return A2($elm$html$Html$Attributes$style, f, s);
			},
			$sporto$elm_select$Select$Select$Menu$viewStyles(config));
		var elements = A2(
			$elm$core$List$indexedMap,
			A3($sporto$elm_select$Select$Select$Item$view, config, model, itemCount),
			matchedItems);
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$cons,
				$sporto$elm_select$Select$Select$Menu$viewClassAttr(config),
				menuStyle),
			A2($elm$core$List$cons, noResultElement, elements));
	});
var $sporto$elm_select$Select$Select$Menu$view = F4(
	function (config, model, availableItems, selectedItems) {
		var searchResult = A4($sporto$elm_select$Select$Search$matchedItemsWithCutoff, config, model.cg, availableItems, selectedItems);
		if (searchResult.$ === 1) {
			return $elm$html$Html$text('');
		} else {
			var matchedItems = searchResult.a;
			return A3($sporto$elm_select$Select$Select$Menu$menu, config, model, matchedItems);
		}
	});
var $sporto$elm_select$Select$Select$view = F4(
	function (config, model, availableItems, selectedItems) {
		var classes = 'elm-select';
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(model.dl),
					$elm$html$Html$Attributes$class(classes),
					A2($elm$html$Html$Attributes$style, 'position', 'relative')
				]),
			_List_fromArray(
				[
					A4($sporto$elm_select$Select$Select$Input$view, config, model, availableItems, selectedItems),
					A4($sporto$elm_select$Select$Select$Menu$view, config, model, availableItems, selectedItems)
				]));
	});
var $sporto$elm_select$Select$view = F4(
	function (config, model, items, selected) {
		return A2(
			$elm$html$Html$map,
			$elm$core$Basics$identity,
			A4(
				$sporto$elm_select$Select$Select$view,
				$sporto$elm_select$Select$unwrapConfig(config),
				$sporto$elm_select$Select$unwrapModel(model),
				items,
				selected));
	});
var $author$project$Views$Story$GetImgWidth = function (a) {
	return {$: 0, a: a};
};
var $author$project$Views$Story$divWidth = function (windowWidth) {
	var responsiveWidth = (_Utils_cmp(windowWidth, $author$project$Tailwinds$breakpoints.dB) > -1) ? $author$project$Tailwinds$breakpoints.dB : ((windowWidth >= 768) ? $author$project$Tailwinds$breakpoints.dC : ((_Utils_cmp(windowWidth, $author$project$Tailwinds$breakpoints.eh) > -1) ? $author$project$Tailwinds$breakpoints.eh : windowWidth));
	return responsiveWidth - 16;
};
var $author$project$Util$cdnUrl = 'https://d30n0bo2016gbt.cloudfront.net';
var $author$project$Util$fromCdn = function (img) {
	return A2(
		$elm$core$Maybe$withDefault,
		img,
		A2(
			$elm$core$Maybe$map,
			function (s) {
				return $author$project$Util$cdnUrl + (s + '.webp');
			},
			$elm$core$List$head(
				A2($elm$core$String$split, '.', img))));
};
var $author$project$Views$Story$onLoadGetWidth = function (onLoad) {
	return A2(
		$elm$html$Html$Events$on,
		'load',
		$elm$json$Json$Decode$succeed(
			onLoad('#storypic img')));
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $author$project$Views$Story$storyContent = function (s) {
	var replace = function (m) {
		return '*' + (A2($elm$core$String$dropRight, 1, m.b3) + ('*' + A2($elm$core$String$right, 1, m.b3)));
	};
	var re = function (w) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$regex$Regex$never,
			$elm$regex$Regex$fromString(w.cK + '[^a-zA-z\\-]'));
	};
	var replaceWord = F2(
		function (w, content) {
			return A3(
				$elm$regex$Regex$replace,
				re(w),
				replace,
				content);
		});
	return A3($elm$core$List$foldl, replaceWord, s.bL, s.cL);
};
var $elm_community$graph$Graph$unGraph = function (graph) {
	var rep = graph;
	return rep;
};
var $elm_community$graph$Graph$get = function (nodeId) {
	return A2(
		$elm$core$Basics$composeR,
		$elm_community$graph$Graph$unGraph,
		$elm_community$intdict$IntDict$get(nodeId));
};
var $elm_community$intdict$IntDict$foldr = F3(
	function (f, acc, dict) {
		foldr:
		while (true) {
			switch (dict.$) {
				case 0:
					return acc;
				case 1:
					var l = dict.a;
					return A3(f, l.b0, l.W, acc);
				default:
					var i = dict.a;
					var $temp$f = f,
						$temp$acc = A3($elm_community$intdict$IntDict$foldr, f, acc, i.i),
						$temp$dict = i.h;
					f = $temp$f;
					acc = $temp$acc;
					dict = $temp$dict;
					continue foldr;
			}
		}
	});
var $elm_community$intdict$IntDict$toList = function (dict) {
	return A3(
		$elm_community$intdict$IntDict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $author$project$StoryGraph$storyContext = F2(
	function (story, _v0) {
		var graph = _v0;
		var idToStory = function (_v1) {
			var id = _v1.a;
			var label = _v1.b;
			return A2(
				$elm$core$Maybe$map,
				function (ctx) {
					return _Utils_Tuple2(ctx.dO.dA, label);
				},
				A2($elm_community$graph$Graph$get, id, graph));
		};
		var context = A2($elm_community$graph$Graph$get, story.dl, graph);
		var incoming = A2(
			$elm$core$List$filterMap,
			idToStory,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					$elm_community$intdict$IntDict$toList,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.dn;
						},
						context))));
		var outgoing = A2(
			$elm$core$List$filterMap,
			idToStory,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					$elm_community$intdict$IntDict$toList,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.d7;
						},
						context))));
		return _Utils_Tuple2(incoming, outgoing);
	});
var $author$project$Views$Story$tagList = function (story) {
	return _Utils_ap(
		story.cC,
		_Utils_ap(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2($elm$core$Maybe$map, $elm$core$List$singleton, story.bM)),
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2($elm$core$Maybe$map, $elm$core$List$singleton, story.cf))));
};
var $elm_explorations$markdown$Markdown$defaultOptions = {
	bO: $elm$core$Maybe$Nothing,
	dg: $elm$core$Maybe$Just(
		{cT: false, ep: false}),
	ee: true,
	ei: false
};
var $elm_explorations$markdown$Markdown$toHtmlWith = _Markdown_toHtml;
var $elm_explorations$markdown$Markdown$toHtml = $elm_explorations$markdown$Markdown$toHtmlWith($elm_explorations$markdown$Markdown$defaultOptions);
var $author$project$Views$Story$view = F4(
	function (mSettings, story, graph, _v0) {
		var picWidth = _v0.a;
		var windowWidth = _v0.b;
		var viewOutgoingStory = function (_v4) {
			var relatedStory = _v4.a;
			var relation = _v4.b;
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$Route$routeToString(
							$author$project$Route$Story(relatedStory.dl)))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(relation)
					]));
		};
		var viewIncomingStory = function (_v3) {
			var relatedStory = _v3.a;
			var relation = _v3.b;
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$Route$routeToString(
							$author$project$Route$Story(relatedStory.dl)))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(relatedStory.cE)
					]));
		};
		var style_ = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2($elm$core$Maybe$map, $author$project$Data$Settings$toStyle, mSettings));
		var _v1 = A2($author$project$StoryGraph$storyContext, story, graph);
		var incoming = _v1.a;
		var outgoing = _v1.b;
		var hasRelatedStories = ($elm$core$List$length(incoming) > 0) || ($elm$core$List$length(outgoing) > 0);
		var _v2 = ((picWidth / $author$project$Views$Story$divWidth(windowWidth)) > 0.67) ? _Utils_Tuple2('w-full', 'w-full') : _Utils_Tuple2('float-right pl-3 pb-2', '');
		var imgDivClass = _v2.a;
		var imgClass = _v2.b;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('u-fade-in')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-center text-white bg-green-600 py-2 mb-3')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(story.cE)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('storypic'),
							$elm$html$Html$Attributes$class(imgDivClass)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$img,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class(imgClass),
									$author$project$Views$Story$onLoadGetWidth($author$project$Views$Story$GetImgWidth),
									$elm$html$Html$Attributes$src(
									$author$project$Util$fromCdn('/pix/' + story.b_))
								]),
							_List_Nil)
						])),
					A2(
					$elm_explorations$markdown$Markdown$toHtml,
					A2(
						$elm$core$List$cons,
						$elm$html$Html$Attributes$id('storycontent'),
						A2(
							$elm$core$List$cons,
							$elm$html$Html$Attributes$class('print:text-sm text-lg leading-normal'),
							style_)),
					$author$project$Views$Story$storyContent(story)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('hidden-print text-sm')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-1')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2(
										$elm$core$String$join,
										', ',
										$author$project$Views$Story$tagList(story)))
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Level: ' + $elm$core$String$fromInt(story.aF))
								]))
						])),
					A2(
					$author$project$Util$viewIf,
					hasRelatedStories,
					A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('hidden-print mt-2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-gray-900 font-semibold')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Related Stories')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex flex-col')
											]),
										A2($elm$core$List$map, viewIncomingStory, incoming)),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex flex-col')
											]),
										A2($elm$core$List$map, viewOutgoingStory, outgoing))
									]))
							])))
				]));
	});
var $author$project$Page$Editor$view = function (model) {
	return {
		bL: A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('editor'),
					$elm$html$Html$Attributes$class('max-w-2xl mx-auto')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-wrap justify-between mb-3')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Components$link,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('#'),
									$elm$html$Html$Events$onClick($author$project$Page$Editor$Previous)
								]),
							'Prev'),
							A2(
							$author$project$Components$toolbar,
							_List_fromArray(
								[
									_Utils_Tuple3(
									$author$project$Page$Editor$Save,
									_Utils_eq(
										model.a7,
										$author$project$List$Zipper$Infinite$current(model.a6)),
									'Save Changes'),
									_Utils_Tuple3(
									$author$project$Page$Editor$CancelChanges,
									_Utils_eq(
										model.a7,
										$author$project$List$Zipper$Infinite$current(model.a6)),
									'Cancel Changes')
								]),
							_List_Nil),
							A2(
							$author$project$Components$link,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('#'),
									$elm$html$Html$Events$onClick($author$project$Page$Editor$Next)
								]),
							'Next')
						])),
					$author$project$Views$Form$viewErrorMsgs(model.ai),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-wrap items-center justify-between my-2')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center pr-1')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Form$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mr-2'),
											$elm$html$Html$Attributes$for('story_title')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Title')
										])),
									A2(
									$author$project$Views$Form$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('story_title'),
											$elm$html$Html$Attributes$placeholder('Title'),
											$elm$html$Html$Attributes$value(model.a7.cE),
											$elm$html$Html$Events$onInput($author$project$Page$Editor$SetTitle)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center pr-1')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Form$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mr-2'),
											$elm$html$Html$Attributes$for('clarify_word')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Clarify word')
										])),
									A2(
									$author$project$Views$Form$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('clarify_word'),
											$elm$html$Html$Attributes$placeholder('Clarify word'),
											$elm$html$Html$Attributes$value(model.a7.cY),
											$elm$html$Html$Events$onInput($author$project$Page$Editor$SetClarifyWord)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center my-2 pr-1')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Form$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mr-2'),
											$elm$html$Html$Attributes$for('story_level')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Level')
										])),
									A2(
									$author$project$Components$btnSmall,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Page$Editor$DecrementLevel)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('-')
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('story_level'),
											$elm$html$Html$Attributes$class('px-1')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(model.a7.aF))
										])),
									A2(
									$author$project$Components$btnSmall,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Page$Editor$IncrementLevel)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('+')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center my-2 pr-1')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Form$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mr-2'),
											$elm$html$Html$Attributes$for('story_tags')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Tags')
										])),
									A2(
									$elm$html$Html$map,
									$author$project$Page$Editor$TagSelectMsg,
									A4($sporto$elm_select$Select$view, $author$project$Page$Editor$tagSelectConfig, model.aP, model.bc, model.a7.cC))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center my-2 pr-1')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Form$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mr-2'),
											$elm$html$Html$Attributes$for('story_curriculum')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Curriculum')
										])),
									A2(
									$elm$html$Html$map,
									$author$project$Page$Editor$CurriculumSelectMsg,
									A4(
										$sporto$elm_select$Select$view,
										$author$project$Page$Editor$curriculumSelectConfig,
										model.aE,
										model.bh,
										A2(
											$elm$core$Maybe$withDefault,
											_List_Nil,
											A2($elm$core$Maybe$map, $elm$core$List$singleton, model.a7.bM))))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex items-center my-2 pr-1')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Form$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('mr-2'),
											$elm$html$Html$Attributes$for('story_qualification')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Qualification')
										])),
									A2(
									$elm$html$Html$map,
									$author$project$Page$Editor$QualificationSelectMsg,
									A4(
										$sporto$elm_select$Select$view,
										$author$project$Page$Editor$qualificationSelectConfig,
										model.aL,
										model.br,
										A2(
											$elm$core$Maybe$withDefault,
											_List_Nil,
											A2($elm$core$Maybe$map, $elm$core$List$singleton, model.a7.cf))))
								])),
							A3($author$project$Views$Form$checkbox, $author$project$Page$Editor$ToggleEnabled, model.a7.bS, 'Enabled')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex mt-2')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex-1 px-2 mr-2')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Views$Form$textarea,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value(model.a7.bL),
											$elm$html$Html$Events$onInput($author$project$Page$Editor$ContentInput),
											$elm$html$Html$Attributes$class('w-full'),
											$elm$html$Html$Attributes$rows(30)
										]),
									_List_Nil)
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex-1 mx-2')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$map,
									$author$project$Page$Editor$StoryViewMsg,
									A4($author$project$Views$Story$view, $elm$core$Maybe$Nothing, model.a7, model.el, model.aO))
								]))
						]))
				])),
		cE: 'Story editor'
	};
};
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $author$project$Page$Errored$view = function (error) {
	return {
		bL: A2(
			$elm$html$Html$main_,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('content'),
					$elm$html$Html$Attributes$class('container'),
					$elm$html$Html$Attributes$tabindex(-1)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h1,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('text-lg font-light')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Error Loading Page')
								])),
							function () {
							if (!error.$) {
								var msg = error.a;
								return A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(msg)
										]));
							} else {
								return A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('It looks like your session may have expired. Please '),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$author$project$Route$href($author$project$Route$Login)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('log back in.')
												]))
										]));
							}
						}()
						]))
				])),
		cE: 'Error loading page'
	};
};
var $author$project$Page$FindStory$BrowseAllFrom = function (a) {
	return {$: 5, a: a};
};
var $author$project$Data$Session$getSimilarStories = F2(
	function (_v0, story) {
		var sesh = _v0;
		return A2(
			$elm$core$List$filterMap,
			$author$project$Data$Session$findStoryById(sesh.s),
			story.b6);
	});
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Views$StoryTiles$view = F3(
	function (useSmallTiles, action, stories) {
		var tileClass = useSmallTiles ? 'w-20 h-16 mb-2 px-1' : 'w-1/2 sm:w-1/3 md:w-1/4 mb-2 h-32 lg:h-40 px-1';
		var styleAttrs = function (s) {
			return _List_fromArray(
				[
					$elm$html$Html$Attributes$class('block shadow w-full h-full p-1'),
					A2(
					$elm$html$Html$Attributes$style,
					'background-image',
					'url(' + ($author$project$Util$fromCdn('/thumbs/' + s.b_) + ')')),
					A2($elm$html$Html$Attributes$style, 'background-size', 'cover'),
					A2($elm$html$Html$Attributes$style, 'background-position', 'center'),
					A2($elm$html$Html$Attributes$style, 'box-shadow', '1px 1px 3px rgba(0,0,0,0.3)'),
					$elm$html$Html$Attributes$title(s.cE)
				]);
		};
		var actionAttrs = function (s) {
			if (action.$ === 1) {
				return _List_fromArray(
					[
						$elm$html$Html$Attributes$href(
						$author$project$Route$routeToString(
							$author$project$Route$Story(s.dl)))
					]);
			} else {
				var doThis = action.a;
				return _List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						doThis(s.dl)),
						$elm$html$Html$Attributes$href('#')
					]);
			}
		};
		var storyTile = function (s) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(tileClass)
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_Utils_ap(
							actionAttrs(s),
							styleAttrs(s)),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm text-bold text-white'),
										$elm$html$Html$Attributes$classList(
										_List_fromArray(
											[
												_Utils_Tuple2('hidden', useSmallTiles)
											]))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(s.cE)
									]))
							]))
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id($author$project$Views$StoryTiles$divId),
					$elm$html$Html$Attributes$class('flex flex-wrap -mx-1')
				]),
			A2($elm$core$List$map, storyTile, stories));
	});
var $author$project$Page$FindStory$AddAnthologyToWorkQueue = function (a) {
	return {$: 27, a: a};
};
var $author$project$Page$FindStory$BrowseAnthologyFrom = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $author$project$Page$FindStory$DeleteAnthology = function (a) {
	return {$: 21, a: a};
};
var $author$project$Page$FindStory$SetStarterStories = function (a) {
	return {$: 23, a: a};
};
var $author$project$Page$FindStory$UpdateAnthology = function (a) {
	return {$: 25, a: a};
};
var $author$project$Components$panel = function (attrs) {
	return $elm$html$Html$div(
		A2(
			$elm$core$List$cons,
			$elm$html$Html$Attributes$class('border rounded shadow-md'),
			attrs));
};
var $author$project$Data$Session$workQueueHasSpace = function (_v0) {
	var s = _v0;
	return $elm$core$List$length(s.w) < 30;
};
var $author$project$Page$FindStory$viewAnthologies = function (session) {
	var canDelete = function (a) {
		return ((!_Utils_eq(a.ab, $elm$core$Maybe$Nothing)) && $author$project$Data$Session$isTeacher(session)) || $author$project$Data$Session$isEditor(session);
	};
	var cache = $author$project$Data$Session$getCache(session);
	var pickStories = function (a) {
		return _Utils_Tuple2(
			a,
			A2(
				$elm$core$List$filterMap,
				$author$project$Data$Session$findStoryById(cache),
				a.a6));
	};
	var btn = F3(
		function (msg, disable, txt) {
			return A2(
				$author$project$Components$btnBase,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-xs bg-blue-500 py-1 px-2 mr-1'),
						$elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('hover:bg-blue-600', !disable),
								_Utils_Tuple2('opacity-50 cursor-not-allowed', disable)
							])),
						$elm$html$Html$Attributes$disabled(disable),
						$elm$html$Html$Events$onClick(msg)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(txt)
					]));
		});
	var render = function (_v0) {
		var a = _v0.a;
		var astories = _v0.b;
		return A2(
			$author$project$Components$panel,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('p-4 mb-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-xl font-light mb-1')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(a.a0)
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-sm text-gray-600 mb-1')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(a.aY)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-2')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Util$viewIf,
							canDelete(a),
							A3(
								btn,
								$author$project$Page$FindStory$DeleteAnthology(a.dl),
								false,
								'Delete')),
							A2(
							$author$project$Util$viewIf,
							$author$project$Data$Session$isEditor(session),
							A3(
								btn,
								$author$project$Page$FindStory$UpdateAnthology(
									_Utils_update(
										a,
										{a_: !a.a_})),
								false,
								a.a_ ? 'Un-hide' : 'Hide')),
							A2(
							$author$project$Util$viewIf,
							$author$project$Data$Session$isEditor(session),
							A3(
								btn,
								$author$project$Page$FindStory$SetStarterStories(a.dl),
								$elm$core$List$length(a.a6) < 24,
								'Set Starter Stories')),
							A2(
							$author$project$Util$viewIf,
							$author$project$Data$Session$isStudent(session) && $author$project$Data$Session$workQueueHasSpace(session),
							A3(
								btn,
								$author$project$Page$FindStory$AddAnthologyToWorkQueue(astories),
								false,
								'Add to my work queue'))
						])),
					A3(
					$author$project$Views$StoryTiles$view,
					true,
					$elm$core$Maybe$Just(
						$author$project$Page$FindStory$BrowseAnthologyFrom(astories)),
					astories)
				]));
	};
	var anthologiesWithStories = A2($elm$core$List$map, pickStories, cache.cR);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('anthologies')
			]),
		A2($elm$core$List$map, render, anthologiesWithStories));
};
var $author$project$Page$FindStory$CloseBrowser = {$: 11};
var $author$project$Page$FindStory$Next = {$: 7};
var $author$project$Page$FindStory$Previous = {$: 8};
var $author$project$Page$FindStory$SelectStory = function (a) {
	return {$: 14, a: a};
};
var $author$project$Data$Session$getWorkQueue = function (_v0) {
	var session = _v0;
	return session.w;
};
var $author$project$Page$FindStory$viewBrowserToolbar = F3(
	function (session, s, selected) {
		var mkBtn = F2(
			function (attrs, txt) {
				return A2(
					$elm$html$Html$li,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							A2(
								$elm$core$List$cons,
								$elm$html$Html$Attributes$class('block bg-transparent hover:bg-blue-500 text-sm md:text-base text-center text-blue-600 font-semibold hover:text-white py-1 px-4 border border-blue hover:border-transparent rounded-full cursor-pointer'),
								attrs),
							_List_fromArray(
								[
									$elm$html$Html$text(txt)
								]))
						]));
			});
		var cache = $author$project$Data$Session$getCache(session);
		return A2(
			$elm$html$Html$nav,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full mb-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-wrap justify-between')
						]),
					_List_fromArray(
						[
							A2(
							mkBtn,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('#'),
									$elm$html$Html$Events$onClick($author$project$Page$FindStory$Previous)
								]),
							'Prev'),
							A2(
							$elm$html$Html$ul,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex justify-between')
								]),
							_List_fromArray(
								[
									A2(
									$author$project$Util$viewIf,
									$author$project$Data$Session$isEditor(session),
									A2(
										mkBtn,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href(
												$author$project$Route$routeToString(
													$author$project$Route$Editor(s.dl)))
											]),
										'Edit')),
									A2(
									mkBtn,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href('#'),
											$elm$html$Html$Events$onClick($author$project$Page$FindStory$CloseBrowser)
										]),
									'Back to stories'),
									A2(
									mkBtn,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$href(
											$author$project$Route$routeToString(
												$author$project$Route$Story(s.dl)))
										]),
									'View'),
									A2(
									$author$project$Util$viewUnless,
									$author$project$Data$Session$isStudent(session) || A2($elm$core$List$member, s, selected),
									A2(
										mkBtn,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href('#'),
												$elm$html$Html$Events$onClick(
												$author$project$Page$FindStory$SelectStory(s))
											]),
										'Add to basket')),
									A2(
									$author$project$Util$viewIf,
									$author$project$Data$Session$isStudent(session) && ((!A2(
										$elm$core$List$member,
										s,
										$author$project$Data$Session$getWorkQueue(session))) && ((!A2($elm$core$Dict$member, s.dl, cache.cQ)) && $author$project$Data$Session$workQueueHasSpace(session))),
									A2(
										mkBtn,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$href('#'),
												$elm$html$Html$Events$onClick(
												$author$project$Page$FindStory$SelectStory(s))
											]),
										'Add to work queue'))
								])),
							A2(
							mkBtn,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('#'),
									$elm$html$Html$Events$onClick($author$project$Page$FindStory$Next)
								]),
							'Next')
						]))
				]));
	});
var $author$project$Page$FindStory$After = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$FindStory$SetDateFilter = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$FindStory$StoryFilterInput = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$FindStory$SetViewType = function (a) {
	return {$: 18, a: a};
};
var $author$project$Page$FindStory$cycleDisplay = F2(
	function (cache, m) {
		var viewTiles = _Utils_Tuple2(
			$author$project$Page$FindStory$SetViewType(
				$author$project$Page$FindStory$Tiles(
					$author$project$Views$StoryTiles$tilesPerPage(m.aV))),
			'Switch view (tiles)');
		var viewTable = _Utils_Tuple2(
			$author$project$Page$FindStory$SetViewType($author$project$Page$FindStory$Table),
			'Switch view (table)');
		var _v0 = m.X;
		switch (_v0.$) {
			case 0:
				return $elm$core$List$isEmpty(cache.cR) ? viewTable : _Utils_Tuple2(
					$author$project$Page$FindStory$SetViewType($author$project$Page$FindStory$Anthologies),
					'Switch view (anthologies)');
			case 2:
				return viewTable;
			default:
				return viewTiles;
		}
	});
var $author$project$Page$FindStory$ToggleShowDisabledOnly = {$: 12};
var $author$project$Page$FindStory$toggleDisabledStoriesOnly = function (m) {
	return m.aN ? _Utils_Tuple2($author$project$Page$FindStory$ToggleShowDisabledOnly, 'Show all stories') : _Utils_Tuple2($author$project$Page$FindStory$ToggleShowDisabledOnly, 'Hide enabled stories');
};
var $author$project$Page$FindStory$viewStoriesFilter = F2(
	function (session, m) {
		var oneDay = 24 * 3600;
		var oneMonth = 30 * oneDay;
		var epochSeconds = ($elm$time$Time$posixToMillis(
			$author$project$Data$Session$currentTime(session)) / 1000) | 0;
		var onDateSelect = function (value) {
			return $author$project$Page$FindStory$SetDateFilter(
				function () {
					switch (value) {
						case 'month':
							return $author$project$Page$FindStory$After(epochSeconds - oneMonth);
						case 'threeMonths':
							return $author$project$Page$FindStory$After(epochSeconds - (3 * oneMonth));
						case 'sixMonths':
							return $author$project$Page$FindStory$After(epochSeconds - (6 * oneMonth));
						case 'year':
							return $author$project$Page$FindStory$After(epochSeconds - (365 * oneDay));
						default:
							return $author$project$Page$FindStory$AllStories;
					}
				}());
		};
		var btn = function (_v0) {
			var msg = _v0.a;
			var txt = _v0.b;
			return A2(
				$author$project$Components$btnSmall,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mr-1'),
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Events$onClick(msg)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(txt)
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('flex items-center justify-between flex-wrap')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-wrap items-center')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Views$Form$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(m.ao),
									$elm$html$Html$Events$onInput($author$project$Page$FindStory$StoryFilterInput),
									$elm$html$Html$Attributes$placeholder('Search text'),
									$elm$html$Html$Attributes$id('storyfilter'),
									$elm$html$Html$Attributes$class('mr-2 mb-2')
								]),
							_List_Nil),
							A2(
							$author$project$Views$Form$select,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mr-2 mb-2'),
									A2(
									$elm$html$Html$Events$on,
									'change',
									A2($elm$json$Json$Decode$map, onDateSelect, $elm$html$Html$Events$targetValue))
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('all')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('All stories')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('month')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Stories this month')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('threeMonths')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Stories from the last 3 months')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('sixMonths')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Stories from the last 6 months')
										])),
									A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('year')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Stories from the past year')
										]))
								])),
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mr-2 mb-2'),
									$elm$html$Html$Attributes$for('storyfilter')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(
										$elm$core$List$length(m.a6)) + ' stories ')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center mb-2')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Util$viewIf,
							$author$project$Data$Session$isEditor(session),
							btn(
								$author$project$Page$FindStory$toggleDisabledStoriesOnly(m))),
							btn(
							A2(
								$author$project$Page$FindStory$cycleDisplay,
								$author$project$Data$Session$getCache(session),
								m))
						]))
				]));
	});
var $author$project$Page$FindStory$viewStoriesTable = function (m) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A3($billstclair$elm_sortable_table$Table$view, $author$project$Page$FindStory$tableConfig, m.by, m.a6)
			]));
};
var $author$project$Page$FindStory$ClearSelectedStories = {$: 13};
var $author$project$Page$FindStory$CreateAnthology = {$: 15};
var $author$project$Page$FindStory$SetAnthologyDescription = function (a) {
	return {$: 17, a: a};
};
var $author$project$Page$FindStory$SetAnthologyName = function (a) {
	return {$: 16, a: a};
};
var $author$project$Page$FindStory$SubmitAnthologyForm = {$: 19};
var $author$project$Page$FindStory$viewStoryBasket = F2(
	function (m, stories) {
		var isEmpty = $elm$core$List$isEmpty(stories);
		var createAnthology = function () {
			var _v0 = m.J;
			if (_v0.$ === 1) {
				return A2(
					$author$project$Components$btn,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-sm'),
							$elm$html$Html$Events$onClick($author$project$Page$FindStory$CreateAnthology)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Create Anthology')
						]));
			} else {
				return A2(
					$elm$html$Html$form,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex flex-col md:flex-row'),
							$elm$html$Html$Events$onSubmit($author$project$Page$FindStory$SubmitAnthologyForm)
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Views$Form$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 md:mb-0 md:mr-2'),
									$elm$html$Html$Attributes$placeholder('Anthology name'),
									$elm$html$Html$Attributes$tabindex(1),
									$elm$html$Html$Events$onInput($author$project$Page$FindStory$SetAnthologyName)
								]),
							_List_Nil),
							A2(
							$author$project$Views$Form$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2 md:mb-0 md:mr-2'),
									$elm$html$Html$Attributes$placeholder('Anthology description'),
									$elm$html$Html$Attributes$tabindex(2),
									$elm$html$Html$Events$onInput($author$project$Page$FindStory$SetAnthologyDescription)
								]),
							_List_Nil),
							A2(
							$author$project$Components$btn,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$tabindex(3)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Save anthology')
								]))
						]));
			}
		}();
		return A2(
			$author$project$Components$panel,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('p-4 mb-4 relative')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Util$viewUnless,
					isEmpty,
					A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-gray-600')
							]),
						_List_fromArray(
							[
								$author$project$Bootstrap$closeBtn($author$project$Page$FindStory$ClearSelectedStories)
							]))),
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-xl font-light mb-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Story basket')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('storybasket')
						]),
					isEmpty ? _List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$title('Click on a story in the table to open the story browser')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Your story basket is empty. You can browse the search results by clicking on a story title in the table, add stories to the basket, then use them to create an anthology.')
								]))
						]) : _List_fromArray(
						[
							A3($author$project$Views$StoryTiles$view, true, $elm$core$Maybe$Nothing, stories),
							createAnthology
						]))
				]));
	});
var $author$project$Page$FindStory$view = F2(
	function (session, m) {
		var cache = $author$project$Data$Session$getCache(session);
		return {
			bL: function () {
				var _v0 = m.E;
				if (_v0.$ === 1) {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-2')
							]),
						_List_fromArray(
							[
								A2($author$project$Page$FindStory$viewStoriesFilter, session, m),
								$author$project$Views$Form$viewErrorMsgs(m.ai),
								A2(
								$author$project$Util$viewUnless,
								$author$project$Data$Session$isStudent(session),
								A2($author$project$Page$FindStory$viewStoryBasket, m, cache.ef)),
								A2(
								$author$project$Util$viewUnless,
								$author$project$Data$Session$workQueueHasSpace(session),
								A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('my-3')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Your work queue is full. Perhaps you should '),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$href(
													$author$project$Route$routeToString($author$project$Route$Home))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('complete some of the stories in it.')
												]))
										]))),
								function () {
								var _v1 = m.X;
								switch (_v1.$) {
									case 0:
										var n = _v1.a;
										return A3(
											$author$project$Views$StoryTiles$view,
											false,
											$elm$core$Maybe$Just($author$project$Page$FindStory$BrowseFrom),
											A2($elm$core$List$take, n, m.a6));
									case 1:
										return $author$project$Page$FindStory$viewStoriesTable(m);
									default:
										return $author$project$Page$FindStory$viewAnthologies(session);
								}
							}()
							]));
				} else {
					var b = _v0.a;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-12')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Page$FindStory$viewBrowserToolbar,
								session,
								$author$project$List$Zipper$Infinite$current(b),
								cache.ef),
								A2(
								$elm$html$Html$map,
								$author$project$Page$FindStory$StoryViewMsg,
								A4(
									$author$project$Views$Story$view,
									$author$project$Data$Session$getSettings(session),
									$author$project$List$Zipper$Infinite$current(b),
									cache.el,
									m.aO)),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mt-8')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h1,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-lg font-light mb-2')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Similar Stories')
											])),
										A3(
										$author$project$Views$StoryTiles$view,
										true,
										$elm$core$Maybe$Just($author$project$Page$FindStory$BrowseAllFrom),
										A2(
											$author$project$Data$Session$getSimilarStories,
											session,
											$author$project$List$Zipper$Infinite$current(b)))
									]))
							]));
				}
			}(),
			cE: 'Find a Story'
		};
	});
var $author$project$Page$Home$storiesTitle = function (session) {
	return $author$project$Data$Session$isStudent(session) ? ($author$project$Page$Home$isBeginner(
		$author$project$Data$Session$getCache(session)) ? 'Starter Stories' : 'My Stories') : 'Sample Stories';
};
var $author$project$Views$WorkQueue$view = F2(
	function (stories, clear) {
		return A2(
			$author$project$Components$panel,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('p-4 mb-4 relative')
				]),
			_List_fromArray(
				[
					A2(
					$author$project$Util$viewUnless,
					$elm$core$List$isEmpty(stories),
					A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-gray-600')
							]),
						_List_fromArray(
							[
								$author$project$Bootstrap$closeBtn(clear)
							]))),
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-lg font-light mb-1')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('My Work Queue')
						])),
					$elm$core$List$isEmpty(stories) ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('my-2 text-gray-800')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('It looks like your work queue is empty. You can add some stories to it from the '),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href(
									$author$project$Route$routeToString($author$project$Route$FindStory))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('find a story page.')
								]))
						])) : A3($author$project$Views$StoryTiles$view, true, $elm$core$Maybe$Nothing, stories)
				]));
	});
var $author$project$Page$Home$view = F3(
	function (session, clearWorkQueue, model) {
		return {
			bL: A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Util$viewIf,
						$author$project$Data$Session$isStudent(session),
						A2(
							$author$project$Views$WorkQueue$view,
							$author$project$Data$Session$getWorkQueue(session),
							clearWorkQueue)),
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-xl font-light my-4')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Page$Home$storiesTitle(session))
							])),
						A3(
						$author$project$Views$StoryTiles$view,
						false,
						$elm$core$Maybe$Nothing,
						A2($elm$core$List$take, 24, model.a6))
					])),
			cE: 'Home'
		};
	});
var $author$project$Page$LeaderBoard$tableRow = function (_v0) {
	var pos = _v0.a;
	var entry = _v0.b;
	return A2(
		$elm$html$Html$tr,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$classList(
				_List_fromArray(
					[
						_Utils_Tuple2('bg-yellow-500', !pos),
						_Utils_Tuple2('bg-gray-400', pos === 1),
						_Utils_Tuple2('bg-yellow-800 text-white', pos === 2)
					]))
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$td,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-center p-2')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(pos + 1))
					])),
				A2(
				$elm$html$Html$td,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-center p-2')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(entry.a0)
					])),
				A2(
				$elm$html$Html$td,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-center p-2')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(entry.cq))
					])),
				A2(
				$elm$html$Html$td,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-center p-2')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(entry.cb))
					]))
			]));
};
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $author$project$Page$LeaderBoard$view = function (model) {
	return {
		bL: A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-2xl font-light mb-2')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Leaderboard')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-6')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Scores are re-calculated periodically so it may be a while before you see changes.')
						])),
					A2(
					$elm$html$Html$table,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-full')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$thead,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$tr,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$th,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Position')
												])),
											A2(
											$elm$html$Html$th,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Name')
												])),
											A2(
											$elm$html$Html$th,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Score')
												])),
											A2(
											$elm$html$Html$th,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text('Overall 3ml Position')
												]))
										]))
								])),
							A2(
							$elm$html$Html$tbody,
							_List_Nil,
							A2(
								$elm$core$List$map,
								$author$project$Page$LeaderBoard$tableRow,
								A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, model)))
						]))
				])),
		cE: 'Leaderboard'
	};
};
var $author$project$Page$Login$SetPassword = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Login$SetUsername = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Login$SubmitForm = {$: 0};
var $author$project$Page$Login$form_ = function (formId) {
	return $elm$html$Html$form(
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id(formId),
				$elm$html$Html$Attributes$class('bg-white shadow-md rounded px-8 pt-6 pb-8 sm:p-16 mb-4'),
				$elm$html$Html$Events$onSubmit($author$project$Page$Login$SubmitForm)
			]));
};
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $author$project$Views$Form$password = function (attrs) {
	return $elm$html$Html$input(
		_Utils_ap(
			_List_fromArray(
				[
					$author$project$Views$Form$fcStyle,
					$author$project$Views$Form$fcHeightPadding,
					$elm$html$Html$Attributes$type_('password')
				]),
			attrs));
};
var $author$project$Page$Login$submitButton = function (isDisabled) {
	return A2(
		$author$project$Components$btn,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$type_('submit'),
				$elm$html$Html$Attributes$tabindex(3),
				$elm$html$Html$Attributes$disabled(isDisabled)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Sign in')
			]));
};
var $author$project$Page$Login$viewForm = F2(
	function (isDisabled, regLink) {
		return A2(
			$author$project$Page$Login$form_,
			'login-form',
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-4')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Views$Form$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2'),
									$elm$html$Html$Attributes$for('username')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Username')
								])),
							A2(
							$author$project$Views$Form$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('username'),
									$elm$html$Html$Attributes$class('w-full'),
									$elm$html$Html$Attributes$name('username'),
									$elm$html$Html$Attributes$disabled(isDisabled),
									$elm$html$Html$Attributes$placeholder('Username or email'),
									$elm$html$Html$Attributes$tabindex(1),
									$elm$html$Html$Events$onInput($author$project$Page$Login$SetUsername)
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-6')
						]),
					_List_fromArray(
						[
							A2(
							$author$project$Views$Form$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('mb-2'),
									$elm$html$Html$Attributes$for('password')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Password')
								])),
							A2(
							$author$project$Views$Form$password,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('password'),
									$elm$html$Html$Attributes$class('w-full'),
									$elm$html$Html$Attributes$name('password'),
									$elm$html$Html$Attributes$disabled(isDisabled),
									$elm$html$Html$Attributes$placeholder('Password'),
									$elm$html$Html$Attributes$tabindex(2),
									$elm$html$Html$Events$onInput($author$project$Page$Login$SetPassword)
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex items-center justify-between')
						]),
					_List_fromArray(
						[
							$author$project$Page$Login$submitButton(isDisabled),
							function () {
							if (!regLink.$) {
								var ref = regLink.a;
								return A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('font-bold text-sm text-blue-500 hover:text-blue-700'),
											ref
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Need an account?')
										]));
							} else {
								return $elm$html$Html$text('');
							}
						}()
						]))
				]));
	});
var $author$project$Page$Login$SetOTP = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Login$viewOtpForm = function (model) {
	return A2(
		$author$project$Page$Login$form_,
		'otp-form',
		_List_fromArray(
			[
				A2(
				$author$project$Views$Form$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('otp-code'),
						$elm$html$Html$Attributes$name('otp-code'),
						$elm$html$Html$Attributes$disabled(model.R === 1),
						$elm$html$Html$Attributes$value(
						A2($elm$core$Maybe$withDefault, '', model.b8)),
						$elm$html$Html$Attributes$placeholder('One-time password code'),
						$elm$html$Html$Attributes$tabindex(1),
						$elm$html$Html$Events$onInput($author$project$Page$Login$SetOTP)
					]),
				_List_Nil),
				$author$project$Page$Login$submitButton(model.R === 1)
			]));
};
var $author$project$Page$Login$view = F2(
	function (model, regLink) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('py-10 px-4 flex justify-center')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('w-full max-w-md')
						]),
					_List_fromArray(
						[
							$author$project$Views$Form$viewErrors(model.ai),
							model.av ? $author$project$Page$Login$viewOtpForm(model) : A2($author$project$Page$Login$viewForm, model.R === 1, regLink)
						]))
				]));
	});
var $author$project$Page$NotFound$view = function (session) {
	return {
		bL: A2(
			$elm$html$Html$main_,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('content'),
					$elm$html$Html$Attributes$class('container'),
					$elm$html$Html$Attributes$tabindex(-1)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-xl font-light')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Not Found')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('not found')
						]))
				])),
		cE: 'Page Not Found'
	};
};
var $author$project$Page$Register$blurb = function (rt) {
	if (rt.$ === 1) {
		return '\nYou can either register a new school or, if your school is already using 3ml, as a teacher in an existing school.\n';
	} else {
		if (!rt.a) {
			var _v1 = rt.a;
			return 'To register for an existing school, a 3ml admin at your school should have given\nyou a registration code. Please enter it in the form below. If you don\'t have a code, please\nask the teacher who registered your school for one. The code is only valid for a short time, so you\nshould complete your registration right away.\n';
		} else {
			var _v2 = rt.a;
			return '\nRegistering will create a new school in the 3ml system for which you will be the administrator.\nYou will be able to create accounts for the children in your school to use 3ml and also\naccounts for other teachers. You will be responsible for obtaining consent for your students\nto use the system, for controlling the data that they enter and for maintaining the accounts\nfor your school.\n';
		}
	}
};
var $author$project$Page$Register$heading = function (rt) {
	if (rt.$ === 1) {
		return 'Sign up';
	} else {
		if (rt.a === 1) {
			var _v1 = rt.a;
			return 'Register a new school';
		} else {
			var _v2 = rt.a;
			return 'Register as a teacher in an existing school';
		}
	}
};
var $author$project$Page$Register$SetCode = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$Register$SetConfirmPassword = function (a) {
	return {$: 7, a: a};
};
var $author$project$Page$Register$SetEmail = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Register$SetPassword = function (a) {
	return {$: 6, a: a};
};
var $author$project$Page$Register$SetSchoolName = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Register$SetTeacherName = function (a) {
	return {$: 5, a: a};
};
var $author$project$Page$Register$SubmitForm = {$: 0};
var $elm$html$Html$Attributes$maxlength = function (n) {
	return A2(
		_VirtualDom_attribute,
		'maxlength',
		$elm$core$String$fromInt(n));
};
var $author$project$Page$Register$viewForm = function (model) {
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col'),
				$elm$html$Html$Events$onSubmit($author$project$Page$Register$SubmitForm)
			]),
		_List_fromArray(
			[
				function () {
				var _v0 = model.aa;
				if ((!_v0.$) && (!_v0.a)) {
					var _v1 = _v0.a;
					return A2(
						$author$project$Views$Form$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(''),
								$elm$html$Html$Attributes$placeholder('Registration code'),
								$elm$html$Html$Events$onInput($author$project$Page$Register$SetCode),
								$elm$html$Html$Attributes$maxlength(100)
							]),
						_List_Nil);
				} else {
					return A2(
						$author$project$Views$Form$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(''),
								$elm$html$Html$Attributes$placeholder('School name'),
								$elm$html$Html$Events$onInput($author$project$Page$Register$SetSchoolName),
								$elm$html$Html$Attributes$maxlength(100)
							]),
						_List_Nil);
				}
			}(),
				A2(
				$author$project$Views$Form$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('my-2'),
						$elm$html$Html$Attributes$placeholder('Your name'),
						$elm$html$Html$Events$onInput($author$project$Page$Register$SetTeacherName),
						$elm$html$Html$Attributes$maxlength(100)
					]),
				_List_Nil),
				A2(
				$author$project$Views$Form$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mb-2'),
						$elm$html$Html$Attributes$placeholder('Email'),
						$elm$html$Html$Events$onInput($author$project$Page$Register$SetEmail),
						$elm$html$Html$Attributes$maxlength(50)
					]),
				_List_Nil),
				A2(
				$author$project$Views$Form$password,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(''),
						$elm$html$Html$Attributes$placeholder('Choose a password'),
						$elm$html$Html$Events$onInput($author$project$Page$Register$SetPassword),
						$elm$html$Html$Attributes$maxlength(100),
						$elm$html$Html$Attributes$type_('password')
					]),
				_List_Nil),
				A2(
				$author$project$Views$Form$password,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('my-2'),
						$elm$html$Html$Attributes$placeholder('Confirm Password'),
						$elm$html$Html$Events$onInput($author$project$Page$Register$SetConfirmPassword),
						$elm$html$Html$Attributes$maxlength(100)
					]),
				_List_Nil),
				A2(
				$author$project$Components$btn,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-1'),
						$elm$html$Html$Attributes$disabled(!(!model.ek))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Sign up')
					]))
			]));
};
var $author$project$Page$Register$NewSchool = 1;
var $author$project$Page$Register$SetRegistrationType = function (a) {
	return {$: 4, a: a};
};
var $author$project$Page$Register$WithCode = 0;
var $author$project$Page$Register$viewRegistrationOptions = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('flex justify-around')
		]),
	_List_fromArray(
		[
			A2(
			$author$project$Components$btn,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('register-school'),
					$elm$html$Html$Attributes$class('mr-2'),
					$elm$html$Html$Attributes$type_('button'),
					$elm$html$Html$Events$onClick(
					$author$project$Page$Register$SetRegistrationType(1))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Register a new school')
				])),
			A2(
			$author$project$Components$btn,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('register-teacher'),
					$elm$html$Html$Attributes$type_('button'),
					$elm$html$Html$Events$onClick(
					$author$project$Page$Register$SetRegistrationType(0))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Register as a teacher in an existing school')
				]))
		]));
var $author$project$Page$Register$view = function (model) {
	return {
		bL: A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('max-w-xl mx-auto flex flex-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-xs-center text-gray-600')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Page$Register$heading(model.aa))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('my-2 text-lg leading-normal')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Page$Register$blurb(model.aa))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-4')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$author$project$Route$href($author$project$Route$Login),
									$elm$html$Html$Attributes$class('text-blue-500 hover:text-blue-700')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Have an account already?')
								]))
						])),
					$author$project$Views$Form$viewErrors(model.ai),
					_Utils_eq(model.aa, $elm$core$Maybe$Nothing) ? $author$project$Page$Register$viewRegistrationOptions : ((model.ek === 3) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-lg')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Registration complete.')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									function () {
									var _v0 = model.aa;
									if ((!_v0.$) && (!_v0.a)) {
										var _v1 = _v0.a;
										return $elm$html$Html$text('Your school admin should let you know when they have activated your account.');
									} else {
										return $elm$html$Html$text('Your account should be activated within an hour.');
									}
								}()
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('You can then sign in using your email and password.')
								]))
						])) : $author$project$Page$Register$viewForm(model))
				])),
		cE: 'Register with 3ml'
	};
};
var $author$project$Page$Story$PrintWindow = {$: 1};
var $author$project$Util$printButton = F2(
	function (print, caption) {
		return A2(
			$author$project$Components$btnSmall,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('print:none'),
					$elm$html$Html$Attributes$type_('button'),
					$elm$html$Html$Events$onClick(print)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(caption)
				]));
	});
var $author$project$Views$Answers$viewAnswer = F2(
	function (story, answer) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('rounded shadow-md mt-2 py-2')
				]),
			A2($author$project$Views$Answers$viewDetails, story, answer));
	});
var $author$project$Views$Answers$view = F2(
	function (story, answers) {
		return A2(
			$elm$core$List$map,
			$author$project$Views$Answers$viewAnswer(story),
			answers);
	});
var $elm$core$List$partition = F2(
	function (pred, list) {
		var step = F2(
			function (x, _v0) {
				var trues = _v0.a;
				var falses = _v0.b;
				return pred(x) ? _Utils_Tuple2(
					A2($elm$core$List$cons, x, trues),
					falses) : _Utils_Tuple2(
					trues,
					A2($elm$core$List$cons, x, falses));
			});
		return A3(
			$elm$core$List$foldr,
			step,
			_Utils_Tuple2(_List_Nil, _List_Nil),
			list);
	});
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$Views$Words$view = F2(
	function (dict, words) {
		var render = function (_v3) {
			var w = _v3.a;
			var d = _v3.b;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dict-definition py-1')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$strong,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(w)
									])),
								$elm$html$Html$text(': ' + d)
							]))
					]));
		};
		var originalWords = A2(
			$elm$core$List$map,
			function ($) {
				return $.cK;
			},
			words);
		var collectDefinitions = F2(
			function (entry, defs) {
				return A2($elm$core$Dict$member, entry.cK, defs) ? defs : A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Dict$empty,
					A2(
						$elm$core$Maybe$map,
						function (_v0) {
							var defn = _v0.a;
							var subwords = _v0.b;
							return A3(
								$elm$core$List$foldl,
								collectDefinitions,
								A3($elm$core$Dict$insert, entry.cK, defn, defs),
								subwords);
						},
						A2(
							$elm$core$Maybe$andThen,
							A2(
								$elm$core$Basics$composeL,
								$elm$core$List$head,
								$elm$core$List$drop(entry.b$)),
							A2($elm$core$Dict$get, entry.cK, dict))));
			});
		var uniqueDefinitions = $elm$core$Dict$toList(
			A3($elm$core$List$foldl, collectDefinitions, $elm$core$Dict$empty, words));
		var sortedDefinitions = function (_v2) {
			var defs = _v2.a;
			var subdefs = _v2.b;
			return A2($elm$core$List$append, defs, subdefs);
		}(
			A2(
				$elm$core$List$partition,
				function (_v1) {
					var w = _v1.a;
					return A2($elm$core$List$member, w, originalWords);
				},
				uniqueDefinitions));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('p-4')
				]),
			A2($elm$core$List$map, render, sortedDefinitions));
	});
var $author$project$AnswersForm$ToggleDrawer = function (a) {
	return {$: 0, a: a};
};
var $author$project$Drawer$Connect = 0;
var $author$project$Drawer$drawerToString = function (dt) {
	switch (dt) {
		case 0:
			return 'Connect';
		case 1:
			return 'Question';
		case 2:
			return 'Summarise';
		default:
			return ' Clarify';
	}
};
var $author$project$Drawer$view = F2(
	function (showDrawer, toggleDrawer) {
		var listItem = function (s) {
			return A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('py-1')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(s)
					]));
		};
		var mkList = function (is) {
			return A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('px-2 mt-4')
					]),
				A2($elm$core$List$map, listItem, is));
		};
		var currentDrawer = A2($elm$core$Maybe$withDefault, 0, showDrawer);
		var drawerHeader = A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pl-5 py-2 bg-white')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-normal text-2xl text-gray-800')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Drawer$drawerToString(currentDrawer))
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('print:none text-gray-600')
						]),
					_List_fromArray(
						[
							$author$project$Bootstrap$closeBtn(
							toggleDrawer(currentDrawer))
						]))
				]));
		var _v0 = function () {
			switch (currentDrawer) {
				case 0:
					return _Utils_Tuple3(
						_List_fromArray(
							[
								mkList(
								_List_fromArray(
									['Do I know something about this already?', 'Has something like this ever happened to me?', 'Have I read about something like this?', 'What does this remind me of in the real world?']))
							]),
						'connectblack.png',
						'bg-teal-700');
				case 2:
					return _Utils_Tuple3(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mb-2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('We want one sentence on what this story is all about.')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('It doesn\'t have to be your own words. If there\'s a sentence in the story that does the job, copy and paste it. Here\'s what to do if there isn\'t:')
									])),
								mkList(
								_List_fromArray(
									['Skim the story fast, looking for good words or phrases.', 'Write them down.', 'Make a sentence by putting the words together with words of your own.', 'Read your sentence aloud. If it doesn\'t make sense, change it to make it better.', 'Take a last look at the story to see if you\'ve missed any important point.']))
							]),
						'summariseblack.png',
						'bg-green-700');
				case 1:
					return _Utils_Tuple3(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Here are a few questions you could ask when you\'re reading. Feel free to think up more of your own.')
									])),
								mkList(
								_List_fromArray(
									['What does that sentence mean?', 'Does this part make sense to me?', 'How does the writer know that?', 'Is that fact or opinion?', 'How did they do that?', 'Why did they do that?', 'What if they had done it this way instead?', 'What question is this person trying to answer?', 'What happens next?']))
							]),
						'questionblack.png',
						'bg-red-700');
				default:
					return _Utils_Tuple3(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Try to figure out what the word means using these methods:')
									])),
								mkList(
								_List_fromArray(
									['Read a line or two around the word, looking for clues.', 'Look for parts of words or whole words in the unknown word.', 'Imagine the word isn\'t there and try another word or words in its place.']))
							]),
						'clarifyblack.png',
						'bg-pink-700');
			}
		}();
		var content = _v0.a;
		var hdrImage = _v0.b;
		var panelStyle = _v0.c;
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('checkbox'),
							$elm$html$Html$Attributes$id('toggle-drawer'),
							$elm$html$Html$Events$onCheck(
							function (_v2) {
								return toggleDrawer(currentDrawer);
							}),
							$elm$html$Html$Attributes$checked(
							!_Utils_eq(showDrawer, $elm$core$Maybe$Nothing))
						]),
					_List_Nil),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('drawer'),
							$elm$html$Html$Attributes$class(panelStyle)
						]),
					_List_fromArray(
						[
							drawerHeader,
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('p-2 leading-normal')
								]),
							content)
						]))
				]));
	});
var $author$project$Drawer$Clarify = 3;
var $author$project$Drawer$Question = 1;
var $author$project$AnswersForm$SetClarification = function (a) {
	return {$: 5, a: a};
};
var $author$project$AnswersForm$SetClarifyMethod = function (a) {
	return {$: 6, a: a};
};
var $author$project$AnswersForm$SetConnection = function (a) {
	return {$: 2, a: a};
};
var $author$project$AnswersForm$SetQuestion = function (a) {
	return {$: 3, a: a};
};
var $author$project$AnswersForm$SetSummary = function (a) {
	return {$: 4, a: a};
};
var $author$project$AnswersForm$SubmitForm = {$: 1};
var $author$project$Drawer$Summarise = 2;
var $author$project$AnswersForm$fieldError = F2(
	function (field, errors) {
		return A2(
			$elm_community$list_extra$List$Extra$find,
			function (e) {
				return _Utils_eq(e.a, field);
			},
			errors);
	});
var $author$project$AnswersForm$fieldToString = function (f) {
	switch (f) {
		case 0:
			return 'Form';
		case 1:
			return 'Connection';
		case 2:
			return 'Question';
		case 3:
			return 'Summary';
		case 4:
			return 'Clarification';
		default:
			return 'ClarificationMethod';
	}
};
var $author$project$AnswersForm$viewForm = function (model) {
	var submitButton = A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-2 rounded'),
				$elm$html$Html$Attributes$tabindex(6),
				$elm$html$Html$Attributes$disabled(model.aj)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Submit your answers')
			]));
	var onSelect = function (msg) {
		return A2(
			$elm$html$Html$Events$on,
			'change',
			A2($elm$json$Json$Decode$map, msg, $elm$html$Html$Events$targetValue));
	};
	var mkOption = function (_v1) {
		var v = _v1.a;
		var txt = _v1.b;
		return A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$selected(
					_Utils_eq(
						A2($elm$core$Maybe$map, $author$project$AnswersForm$toString, model.aD),
						$elm$core$Maybe$Just(v))),
					$elm$html$Html$Attributes$value(v)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(txt)
				]));
	};
	var errorClass = function (field) {
		return $elm$html$Html$Attributes$classList(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'border-red',
					!_Utils_eq(
						A2($author$project$AnswersForm$fieldError, field, model.ai),
						$elm$core$Maybe$Nothing))
				]));
	};
	var drwrBtn = F2(
		function (s, evt) {
			var activityColour = function () {
				switch (evt) {
					case 0:
						return 'bg-blue-500 hover:bg-blue-600';
					case 1:
						return 'bg-red-500 hover:bg-red-600';
					case 2:
						return 'bg-green-600 hover:bg-green-600';
					default:
						return 'bg-pink-500 hover:bg-pink-600';
				}
			}();
			return A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-white text-sm py-1 px-2 mr-2 rounded'),
						$elm$html$Html$Attributes$tabindex(-1),
						$elm$html$Html$Attributes$class(activityColour),
						$elm$html$Html$Events$onClick(
						$author$project$AnswersForm$ToggleDrawer(evt)),
						$elm$html$Html$Attributes$type_('button')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(s)
					]));
		});
	var clarifyMethodOptions = A2(
		$elm$core$List$map,
		mkOption,
		_List_fromArray(
			[
				_Utils_Tuple2('', 'Please choose one'),
				_Utils_Tuple2(
				$author$project$AnswersForm$toString(0),
				'Read a line or two around the word, looking for clues.'),
				_Utils_Tuple2(
				$author$project$AnswersForm$toString(1),
				'Look for parts of words or whole words in the unknown word.'),
				_Utils_Tuple2(
				$author$project$AnswersForm$toString(2),
				'Imagine the word isn\'t there and try another word or words in its place.')
			]));
	var answerField = F5(
		function (field, msg, btn, lbl, tx) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full mt-3')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex justify-between items-center')
							]),
						_List_fromArray(
							[
								btn,
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('font-bold text-sm'),
										$elm$html$Html$Attributes$for(
										$author$project$AnswersForm$fieldToString(field) + 'Input')
									]),
								lbl)
							])),
						A2(
						$author$project$Views$Form$textarea,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('h-12 border rounded w-full text-sm mt-1'),
								errorClass(field),
								$elm$html$Html$Attributes$id(
								$author$project$AnswersForm$fieldToString(field) + 'Input'),
								$elm$html$Html$Events$onInput(msg),
								$elm$html$Html$Attributes$tabindex(tx),
								$elm$html$Html$Attributes$disabled(model.aj)
							]),
						_List_Nil)
					]));
		});
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w-full'),
				$elm$html$Html$Events$onSubmit($author$project$AnswersForm$SubmitForm)
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-wrap mb-6')
					]),
				_List_fromArray(
					[
						A5(
						answerField,
						1,
						$author$project$AnswersForm$SetConnection,
						A2(drwrBtn, 'Connect', 0),
						_List_fromArray(
							[
								$elm$html$Html$text('Connect this story with yourself or something you know about.')
							]),
						1),
						A5(
						answerField,
						2,
						$author$project$AnswersForm$SetQuestion,
						A2(drwrBtn, 'Question', 1),
						_List_fromArray(
							[
								$elm$html$Html$text('Think of a question the story makes you want to ask and type it here.')
							]),
						2),
						A5(
						answerField,
						3,
						$author$project$AnswersForm$SetSummary,
						A2(drwrBtn, 'Summarise', 2),
						_List_fromArray(
							[
								$elm$html$Html$text('Write one sentence that captures the main idea.')
							]),
						3),
						A5(
						answerField,
						4,
						$author$project$AnswersForm$SetClarification,
						A2(drwrBtn, 'Clarify', 3),
						_List_fromArray(
							[
								$elm$html$Html$text('Work through the clarify methods then type what you think this word means: '),
								A2(
								$elm$html$Html$em,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('clarify-word')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										function ($) {
											return $.cY;
										}(model.a7))
									]))
							]),
						4),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mt-3'),
								errorClass(5)
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-sm font-bold'),
										$elm$html$Html$Attributes$for('clarifyMethod')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Which clarify method worked best for you?')
									])),
								A2(
								$author$project$Views$Form$select,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('clarifyMethod'),
										$elm$html$Html$Attributes$class('border rounded mt-1'),
										onSelect($author$project$AnswersForm$SetClarifyMethod),
										$elm$html$Html$Attributes$tabindex(5)
									]),
								clarifyMethodOptions)
							])),
						submitButton
					]))
			]));
};
var $author$project$AnswersForm$view = function (m) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Views$Form$viewErrors(m.ai),
				A2(
				$author$project$Util$viewIf,
				m.aj,
				A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Submitting answers ...')
						]))),
				$author$project$AnswersForm$viewForm(m),
				A2($author$project$Drawer$view, m.aw, $author$project$AnswersForm$ToggleDrawer)
			]));
};
var $author$project$Page$Story$viewAnswersForm = function (m) {
	var _v0 = m.L;
	if (_v0.$ === 1) {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	} else {
		var f = _v0.a;
		return A2(
			$elm$html$Html$map,
			$author$project$Page$Story$AnswersFormMsg,
			A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('activities'),
						$elm$html$Html$Attributes$class('mt-8')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('text-lg text-gray-700')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Answers')
							])),
						$author$project$AnswersForm$view(f)
					])));
	}
};
var $author$project$Page$Story$viewPrintAnswerSections = function (story) {
	var cls = $elm$html$Html$Attributes$class('text-base font-bold mb-24');
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('printactivities'),
				$elm$html$Html$Attributes$class('mt-2')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[cls]),
				_List_fromArray(
					[
						$elm$html$Html$text('Connect this story with yourself or something you know about.')
					])),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[cls]),
				_List_fromArray(
					[
						$elm$html$Html$text('Think of a question the story makes you want to ask.')
					])),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[cls]),
				_List_fromArray(
					[
						$elm$html$Html$text('Write one sentence that captures the main idea.')
					])),
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[cls]),
				_List_fromArray(
					[
						$elm$html$Html$text('What do you think the word \"' + (story.cY + '\" means?'))
					]))
			]));
};
var $author$project$Page$Story$view = F2(
	function (session, m) {
		var cache = $author$project$Data$Session$getCache(session);
		return {
			bL: A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$author$project$Util$viewIf,
						$author$project$Data$Session$isTeacher(session),
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('print:none mb-2')
								]),
							_List_fromArray(
								[
									A2($author$project$Util$printButton, $author$project$Page$Story$PrintWindow, 'Print this story')
								]))),
						A2(
						$elm$html$Html$map,
						$author$project$Page$Story$StoryViewMsg,
						A4(
							$author$project$Views$Story$view,
							$author$project$Data$Session$getSettings(session),
							m.a7,
							cache.el,
							m.aO)),
						A2(
						$author$project$Views$Words$view,
						cache.bj,
						A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2($elm$core$Maybe$map, $elm$core$List$singleton, m.aZ))),
						A2(
						$author$project$Util$viewIf,
						$author$project$Data$Session$isStudent(session),
						$author$project$Page$Story$viewAnswersForm(m)),
						A2(
						$author$project$Util$viewIf,
						$author$project$Data$Session$isTeacher(session),
						$author$project$Page$Story$viewPrintAnswerSections(m.a7)),
						A2(
						$author$project$Util$viewIf,
						_Utils_eq(m.L, $elm$core$Maybe$Nothing),
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('hidden-print mt-2')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-lg font-light mb-2')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Other stories like this one')
										])),
									A3(
									$author$project$Views$StoryTiles$view,
									true,
									$elm$core$Maybe$Nothing,
									A2($author$project$Data$Session$getSimilarStories, session, m.a7))
								]))),
						A2(
						$author$project$Util$viewIf,
						_Utils_eq(m.L, $elm$core$Maybe$Nothing) && (!$elm$core$List$isEmpty(m.cQ)),
						A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('hidden-print mt-8')
								]),
							A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$h1,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-lg mb-2')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Story answers')
										])),
								A2($author$project$Views$Answers$view, m.a7, m.cQ))))
					])),
			cE: m.a7.cE
		};
	});
var $author$project$Page$Student$DismissDialog = {$: 10};
var $author$project$Views$ChangePasswordForm$SetConfirm = function (a) {
	return {$: 2, a: a};
};
var $author$project$Views$ChangePasswordForm$SetPassword = function (a) {
	return {$: 1, a: a};
};
var $author$project$Views$ChangePasswordForm$SubmitForm = {$: 0};
var $author$project$Views$ChangePasswordForm$view = function (model) {
	var submitButton = A2(
		$author$project$Components$btn,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mt-2'),
				$elm$html$Html$Attributes$tabindex(2)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Save new password')
			]));
	var viewForm = A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col'),
				$elm$html$Html$Events$onSubmit($author$project$Views$ChangePasswordForm$SubmitForm)
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Views$Form$password,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full'),
						$elm$html$Html$Attributes$placeholder('Password'),
						$elm$html$Html$Attributes$tabindex(1),
						$elm$html$Html$Events$onInput($author$project$Views$ChangePasswordForm$SetPassword)
					]),
				_List_Nil),
				A2(
				$author$project$Views$Form$password,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full mt-2'),
						$elm$html$Html$Attributes$placeholder('Confirm password'),
						$elm$html$Html$Attributes$tabindex(2),
						$elm$html$Html$Events$onInput($author$project$Views$ChangePasswordForm$SetConfirm)
					]),
				_List_Nil),
				submitButton
			]));
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Views$Form$viewErrorMsgs(model.ai),
				viewForm
			]));
};
var $author$project$Page$Student$changePasswordDialog = function (form) {
	return A3(
		$author$project$Modal$view,
		'Change password',
		$author$project$Page$Student$DismissDialog,
		A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$map,
					$author$project$Page$Student$ChangePasswordMsg,
					$author$project$Views$ChangePasswordForm$view(form))
				])));
};
var $author$project$Views$ChangeUsernameForm$SetUsername = function (a) {
	return {$: 1, a: a};
};
var $author$project$Views$ChangeUsernameForm$SubmitForm = {$: 0};
var $author$project$Views$ChangeUsernameForm$view = function (model) {
	var submitButton = A2(
		$author$project$Components$btn,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mt-4'),
				$elm$html$Html$Attributes$tabindex(2)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Save new username')
			]));
	var viewForm = A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col'),
				$elm$html$Html$Events$onSubmit($author$project$Views$ChangeUsernameForm$SubmitForm)
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Views$Form$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full'),
						$elm$html$Html$Attributes$placeholder('New username'),
						$elm$html$Html$Attributes$tabindex(1),
						$elm$html$Html$Events$onInput($author$project$Views$ChangeUsernameForm$SetUsername)
					]),
				_List_Nil),
				submitButton
			]));
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-lg mb-3')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Please avoid using personal names (or variations of them) as usernames.')
					])),
				$author$project$Views$Form$viewErrorMsgs(model.ai),
				viewForm
			]));
};
var $author$project$Page$Student$changeUsernameDialog = function (form) {
	return A3(
		$author$project$Modal$view,
		'Change username',
		$author$project$Page$Student$DismissDialog,
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full max-w-sm p-4 flex flex-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$map,
					$author$project$Page$Student$ChangeUsernameMsg,
					$author$project$Views$ChangeUsernameForm$view(form))
				])));
};
var $author$project$Page$Student$ConfirmDelete = {$: 6};
var $author$project$Page$Student$confirmDeleteDialog = A3(
	$author$project$Modal$view,
	'Delete Student',
	$author$project$Page$Student$DismissDialog,
	A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('w-full max-w-xl p-4 flex flex-col')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-lg mb-4')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Are you sure you want to delete this student account?')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('text-lg')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('It will be marked for deletion and removed automatically at a later date (you can un-delete it if you change your mind).')
					])),
				A2(
				$author$project$Components$btn,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('mt-6'),
						$elm$html$Html$Events$onClick($author$project$Page$Student$ConfirmDelete)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Delete student')
					]))
			])));
var $author$project$Page$Student$SetLevel = function (a) {
	return {$: 9, a: a};
};
var $author$project$Page$Student$ShowChangePassword = {$: 0};
var $author$project$Page$Student$ShowChangeUsername = {$: 2};
var $author$project$Page$Student$ToggleDeletedStatus = {$: 5};
var $author$project$Page$Student$ToggleHiddenStatus = {$: 4};
var $author$project$Views$SelectLevel$view = F2(
	function (toMsg, current) {
		var toInt = function (s) {
			var _v0 = $elm$core$String$toInt(s);
			if (!_v0.$) {
				var i = _v0.a;
				return $elm$json$Json$Decode$succeed(i);
			} else {
				return $elm$json$Json$Decode$fail('Failed to convert selected level to Int');
			}
		};
		var mkOption = function (l) {
			return A2(
				$elm$html$Html$option,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$selected(
						_Utils_eq(current, l)),
						$elm$html$Html$Attributes$value(
						$elm$core$String$fromInt(l))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						'Level ' + $elm$core$String$fromInt(l))
					]));
		};
		var intMsg = A2(
			$elm$json$Json$Decode$map,
			toMsg,
			A2(
				$elm$json$Json$Decode$andThen,
				toInt,
				A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['target', 'value']),
					$elm$json$Json$Decode$string)));
		return A2(
			$author$project$Views$Form$select,
			_List_fromArray(
				[
					A2($elm$html$Html$Events$on, 'input', intMsg)
				]),
			A2(
				$elm$core$List$map,
				mkOption,
				A2($elm$core$List$range, 0, 9)));
	});
var $author$project$Page$Student$viewToolbar = F2(
	function (isAdmin, student) {
		var buttons = A2(
			$elm$core$List$cons,
			_Utils_Tuple3($author$project$Page$Student$ShowChangePassword, false, 'Change password'),
			A2(
				$elm$core$List$cons,
				_Utils_Tuple3($author$project$Page$Student$ShowChangeUsername, false, 'Change username'),
				isAdmin ? _List_fromArray(
					[
						_Utils_Tuple3(
						$author$project$Page$Student$ToggleDeletedStatus,
						false,
						student.bP ? 'Un-delete' : 'Delete'),
						_Utils_Tuple3(
						$author$project$Page$Student$ToggleHiddenStatus,
						student.bP,
						student.a_ ? 'Un-hide' : 'Hide')
					]) : _List_Nil));
		return A2(
			$author$project$Components$toolbar,
			buttons,
			_List_fromArray(
				[
					A2($author$project$Views$SelectLevel$view, $author$project$Page$Student$SetLevel, student.aF)
				]));
	});
var $author$project$Page$Student$view = function (model) {
	return {
		bL: A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-normal text-lg text-gray-700')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							function ($) {
								return $.a0;
							}(model.v))
						])),
					A2($author$project$Page$Student$viewToolbar, model.cI, model.v),
					$author$project$Views$Form$viewErrorMsgs(model.ai),
					A2(
					$elm$html$Html$h2,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('font-light text-lg text-gray-600 mt-4')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Completed Stories')
						])),
					$author$project$Views$Answers$viewWithStories(model.cQ),
					A2($author$project$Util$maybeView, $author$project$Page$Student$changePasswordDialog, model.ag),
					A2($author$project$Util$maybeView, $author$project$Page$Student$changeUsernameDialog, model.ah),
					A2($author$project$Util$viewIf, model.aM, $author$project$Page$Student$confirmDeleteDialog)
				])),
		cE: 'Student'
	};
};
var $author$project$Page$Students$AddStudentsToClass = function (a) {
	return {$: 10, a: a};
};
var $author$project$Page$Students$ClearNewAccounts = {$: 1};
var $author$project$Page$Students$ClearSelectedStudents = {$: 0};
var $author$project$Page$Students$PrintWindow = {$: 2};
var $author$project$Page$Students$SetClassFilter = function (a) {
	return {$: 6, a: a};
};
var $author$project$Page$Students$StudentFilterInput = function (a) {
	return {$: 5, a: a};
};
var $author$project$Page$Students$DismissAddStudents = {$: 4};
var $author$project$AddStudentsForm$SetLevel = function (a) {
	return {$: 2, a: a};
};
var $author$project$AddStudentsForm$SetNames = function (a) {
	return {$: 3, a: a};
};
var $author$project$AddStudentsForm$SubmitForm = {$: 0};
var $author$project$AddStudentsForm$view = function (model) {
	var submitButton = A2(
		$author$project$Components$btn,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('sm:w-1/2 mt-2'),
				$elm$html$Html$Attributes$disabled(model.az),
				$elm$html$Html$Attributes$type_('submit')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('Create Accounts')
			]));
	var namesInput = A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$elm$core$List$isEmpty(model.ai) ? '' : 'has-error')
			]),
		_List_fromArray(
			[
				A2(
				$author$project$Views$Form$textarea,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('w-full h-48 mb-2'),
						$elm$html$Html$Events$onInput($author$project$AddStudentsForm$SetNames)
					]),
				_List_Nil)
			]));
	var viewForm = A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('flex flex-col'),
				$elm$html$Html$Events$onSubmit($author$project$AddStudentsForm$SubmitForm)
			]),
		_List_fromArray(
			[
				namesInput,
				A2($author$project$Views$SelectLevel$view, $author$project$AddStudentsForm$SetLevel, model.aF),
				submitButton
			]));
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				$author$project$Views$Form$viewErrorMsgs(model.ai),
				viewForm
			]));
};
var $author$project$Page$Students$addStudentsDialog = function (form) {
	return A3(
		$author$project$Modal$view,
		'Add Students',
		$author$project$Page$Students$DismissAddStudents,
		A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full max-w-xl p-4 flex flex-col')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-2 text-lg')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Enter the names of the students you want to add accounts for, separated by commas or on separate lines.')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-2 text-lg')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('You can enter up to 100 names.')
						])),
					A2(
					$elm$html$Html$map,
					$author$project$Page$Students$AddStudentsFormMsg,
					$author$project$AddStudentsForm$view(form))
				])));
};
var $author$project$Page$Students$ShowAddStudents = {$: 3};
var $author$project$Page$Students$subtools = function (session) {
	return $author$project$Data$Session$isSchoolAdmin(session) ? _List_fromArray(
		[
			A2(
			$author$project$Components$btn,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id('add-students-button'),
					$elm$html$Html$Events$onClick($author$project$Page$Students$ShowAddStudents)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Add Students')
				]))
		]) : _List_Nil;
};
var $author$project$Views$ClassSelect$view = F4(
	function (classes, selection, name, mkMsg) {
		var selectedClass = A2($elm$core$Maybe$withDefault, '', selection);
		var onSelect = function (classId) {
			return mkMsg(
				(classId === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(classId));
		};
		var format = function (description) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					function (d) {
						return ' (' + (d + ')');
					},
					description));
		};
		var emptyOption = A2(
			$elm$html$Html$option,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$value('')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(name)
				]));
		var classOption = function (c) {
			return A2(
				$elm$html$Html$option,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$selected(
						_Utils_eq(selectedClass, c.dl)),
						$elm$html$Html$Attributes$value(c.dl)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						_Utils_ap(
							c.a0,
							format(c.aY)))
					]));
		};
		return A2(
			$author$project$Views$Form$select,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$Events$on,
					'change',
					A2($elm$json$Json$Decode$map, onSelect, $elm$html$Html$Events$targetValue))
				]),
			A2(
				$elm$core$List$cons,
				emptyOption,
				A2($elm$core$List$map, classOption, classes)));
	});
var $author$project$Views$NewAccounts$view = F3(
	function (print, dismiss, accounts) {
		var accountRow = function (_v1) {
			var student = _v1.a;
			var _v2 = _v1.b;
			var username = _v2.a;
			var password = _v2.b;
			return A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(student.a0)
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(username)
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(password)
							]))
					]));
		};
		var accountsTable = A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('w-full')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$thead,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$tr,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$th,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-left')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Name')
										])),
									A2(
									$elm$html$Html$th,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-left')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Username')
										])),
									A2(
									$elm$html$Html$th,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('text-left')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Password')
										]))
								]))
						])),
					A2(
					$elm$html$Html$tbody,
					_List_Nil,
					A2($elm$core$List$map, accountRow, accounts))
				]));
		if (!accounts.b) {
			return $elm$html$Html$text('');
		} else {
			return A2(
				$author$project$Components$panel,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('p-4 mb-4 relative')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('print:none text-gray-600')
							]),
						_List_fromArray(
							[
								$author$project$Bootstrap$closeBtn(dismiss)
							])),
						A2(
						$elm$html$Html$h1,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('print:none text-xl font-light mb-2')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('New Accounts Created in this Session')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('p-2')
							]),
						_List_fromArray(
							[
								A2($author$project$Util$printButton, print, 'Print list of new accounts'),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('print:none my-2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Please make sure you save this list or print it off before logging out, or the information will be lost.')
									])),
								A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('print:none mb-2')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Passwords and usernames are automatically generated. You can change them later. Please don\'t use real names or other personal information for usernames.')
									])),
								accountsTable
							]))
					]));
		}
	});
var $author$project$Page$Students$DismissNotification = {$: 12};
var $author$project$Page$Students$viewNotification = function (n) {
	switch (n.$) {
		case 2:
			return $elm$html$Html$text('');
		case 0:
			var msg = n.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('my-4')
					]),
				_List_fromArray(
					[
						A3($author$project$Bootstrap$alert, 1, msg, $author$project$Page$Students$DismissNotification)
					]));
		default:
			var msg = n.a;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('my-4')
					]),
				_List_fromArray(
					[
						A3($author$project$Bootstrap$alert, 0, msg, $author$project$Page$Students$DismissNotification)
					]));
	}
};
var $author$project$Page$Students$SelectStudent = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $author$project$Page$Students$SetTableState = function (a) {
	return {$: 7, a: a};
};
var $author$project$Page$Students$filterByStudentIds = F2(
	function (students, ids) {
		return A2(
			$elm$core$List$filter,
			function (s) {
				return A2($elm$core$List$member, s.dl, ids);
			},
			students);
	});
var $author$project$Page$Students$filterStudentsByName = F2(
	function (nameFilter, students) {
		return function (r) {
			return A2(
				$elm$core$List$filter,
				function (s) {
					return A2($elm$regex$Regex$contains, r, s.a0);
				},
				students);
		}(
			A2(
				$elm$core$Maybe$withDefault,
				$elm$regex$Regex$never,
				A2(
					$elm$regex$Regex$fromStringWith,
					{cW: true, dK: false},
					nameFilter)));
	});
var $author$project$Page$Students$findStudentsInClass = F2(
	function (cache, classId) {
		return A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.cv;
			},
			A2(
				$elm_community$list_extra$List$Extra$find,
				function (c) {
					return _Utils_eq(c.dl, classId);
				},
				cache.cZ));
	});
var $author$project$Page$Students$filterStudents = F2(
	function (cache, model) {
		var _v0 = model.ac;
		if (!_v0.b.$) {
			var classId = _v0.b.a;
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$elm$core$Maybe$map,
					$author$project$Page$Students$filterByStudentIds(cache.cv),
					A2($author$project$Page$Students$findStudentsInClass, cache, classId)));
		} else {
			var nameFilter = _v0.a;
			var _v1 = _v0.b;
			return ($elm$core$String$length(nameFilter) < 3) ? cache.cv : A2($author$project$Page$Students$filterStudentsByName, nameFilter, cache.cv);
		}
	});
var $author$project$Page$Students$viewTable = F2(
	function (cache, model) {
		var tableConfig = A2($author$project$Views$StudentTable$config, $author$project$Page$Students$SetTableState, $author$project$Page$Students$SelectStudent);
		var isChecked = function (s) {
			return A2($elm$core$Dict$member, s.dl, model.an);
		};
		var elements = A2($author$project$Page$Students$filterStudents, cache, model);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('print:none')
				]),
			_List_fromArray(
				[
					A4($author$project$Views$StudentTable$view, tableConfig, model.by, elements, isChecked)
				]));
	});
var $author$project$Page$Students$view = F2(
	function (session, model) {
		var cache = $author$project$Data$Session$getCache(session);
		return {
			bL: A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-col')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-4')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Views$TeacherToolbar$view,
								session,
								$author$project$Route$Students,
								$author$project$Page$Students$subtools(session))
							])),
						$author$project$Page$Students$viewNotification(model.aI),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-4')
							]),
						_List_fromArray(
							[
								A3($author$project$Views$NewAccounts$view, $author$project$Page$Students$PrintWindow, $author$project$Page$Students$ClearNewAccounts, cache.dN)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('print:none flex flex-col')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex mb-4')
									]),
								_List_fromArray(
									[
										A2(
										$author$project$Views$Form$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('mr-1'),
												$elm$html$Html$Attributes$type_('text'),
												$elm$html$Html$Attributes$value(model.ac.a),
												$elm$html$Html$Events$onInput($author$project$Page$Students$StudentFilterInput),
												$elm$html$Html$Attributes$placeholder('Name search'),
												$elm$html$Html$Attributes$id('studentNameFilter')
											]),
										_List_Nil),
										A4($author$project$Views$ClassSelect$view, cache.cZ, model.ac.b, 'Filter by class', $author$project$Page$Students$SetClassFilter)
									])),
								A2(
								$author$project$Util$viewUnless,
								$elm$core$Dict$isEmpty(model.an),
								A2(
									$author$project$Components$toolbar,
									_List_fromArray(
										[
											_Utils_Tuple3($author$project$Page$Students$ClearSelectedStudents, false, 'Clear selection')
										]),
									_List_fromArray(
										[
											A4($author$project$Views$ClassSelect$view, cache.cZ, $elm$core$Maybe$Nothing, 'Add selected students to class', $author$project$Page$Students$AddStudentsToClass)
										])))
							])),
						A2($author$project$Page$Students$viewTable, cache, model),
						A2($author$project$Util$maybeView, $author$project$Page$Students$addStudentsDialog, model.af)
					])),
			cE: 'Students'
		};
	});
var $author$project$Page$Teachers$GenerateRegistrationCode = {$: 3};
var $author$project$Page$Teachers$newRegistrationCodeButton = A3($author$project$Bootstrap$btn, 'new-registration-code-button', $author$project$Page$Teachers$GenerateRegistrationCode, 'New Teacher Account');
var $author$project$Page$Teachers$viewCode = function (code) {
	if (code.$ === 1) {
		return A2($elm$html$Html$div, _List_Nil, _List_Nil);
	} else {
		var c = code.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('leading-normal mb-4')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('mb-4')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Copy the code below and give it to the person you want to create an account for. They should then register for an account and enter the code to become a member of your school. The code is valid for 20 minutes.')
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Once they have completed their registration, they should tell you and you can activate their account from this page (reload the page if necessary).')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('text-center font-bold text-xl mt-3')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('registration-code')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(c)
								]))
						]))
				]));
	}
};
var $author$project$Page$Teachers$SetTableState = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Teachers$ActivateAccount = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Teachers$viewActivationButton = function (_v0) {
	var teacher = _v0.a;
	var isActive = _v0.b;
	return isActive ? A2($billstclair$elm_sortable_table$Table$HtmlDetails, _List_Nil, _List_Nil) : A2(
		$billstclair$elm_sortable_table$Table$HtmlDetails,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('btn btn-default'),
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Events$onClick(
						$author$project$Page$Teachers$ActivateAccount(teacher.dl))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Activate account')
					]))
			]));
};
var $author$project$Page$Teachers$tableConfig = $billstclair$elm_sortable_table$Table$customConfig(
	{
		c2: _List_fromArray(
			[
				A2(
				$billstclair$elm_sortable_table$Table$stringColumn,
				'Name',
				A2(
					$elm$core$Basics$composeL,
					function ($) {
						return $.a0;
					},
					$elm$core$Tuple$first)),
				$billstclair$elm_sortable_table$Table$veryCustomColumn(
				{a0: '', ej: $billstclair$elm_sortable_table$Table$unsortable, ez: $author$project$Page$Teachers$viewActivationButton})
			]),
		c3: $author$project$Bootstrap$tableCustomizations,
		er: A2(
			$elm$core$Basics$composeL,
			function ($) {
				return $.dl;
			},
			$elm$core$Tuple$first),
		et: $author$project$Page$Teachers$SetTableState
	});
var $author$project$Page$Teachers$viewTable = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('row hidden-print')
			]),
		_List_fromArray(
			[
				A3($billstclair$elm_sortable_table$Table$view, $author$project$Page$Teachers$tableConfig, model.by, model.ba)
			]));
};
var $author$project$Page$Teachers$view = F2(
	function (session, model) {
		return {
			bL: A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('flex flex-col')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mb-16')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Views$TeacherToolbar$view,
								session,
								$author$project$Route$Teachers,
								_List_fromArray(
									[$author$project$Page$Teachers$newRegistrationCodeButton]))
							])),
						$author$project$Page$Teachers$viewCode(model.bs),
						$author$project$Page$Teachers$viewTable(model)
					])),
			cE: 'Teachers'
		};
	});
var $author$project$Main$viewPage = F3(
	function (session, isLoading, page) {
		var mapMsg = F2(
			function (m, _v1) {
				var title = _v1.cE;
				var content = _v1.bL;
				return {
					bL: A2(
						$elm$html$Html$map,
						A2($elm$core$Basics$composeL, $author$project$Main$PageMsg, m),
						content),
					cE: title
				};
			});
		var frame = A3($author$project$Views$Page$frame, isLoading, session, $author$project$Main$CloseAlert);
		switch (page.$) {
			case 1:
				return A2(
					frame,
					0,
					$author$project$Page$NotFound$view(session));
			case 0:
				return A2(
					frame,
					0,
					{
						bL: $elm$html$Html$text(''),
						cE: ''
					});
			case 2:
				var subModel = page.a;
				return A2(
					frame,
					1,
					A3($author$project$Page$Home$view, session, $author$project$Main$ClearWorkQueue, subModel));
			case 3:
				var subModel = page.a;
				return A2(
					frame,
					0,
					$author$project$Page$Errored$view(subModel));
			case 5:
				var subModel = page.a;
				return A2(
					frame,
					1,
					A2(
						mapMsg,
						$author$project$Main$StoryMsg,
						A2($author$project$Page$Story$view, session, subModel)));
			case 6:
				var subModel = page.a;
				return A2(
					frame,
					3,
					A2(
						mapMsg,
						$author$project$Main$FindStoryMsg,
						A2($author$project$Page$FindStory$view, session, subModel)));
			case 4:
				var subModel = page.a;
				return A2(
					frame,
					2,
					{
						bL: A2(
							$elm$html$Html$map,
							A2($elm$core$Basics$composeL, $author$project$Main$PageMsg, $author$project$Main$LoginMsg),
							A2(
								$author$project$Page$Login$view,
								subModel,
								$elm$core$Maybe$Just(
									$author$project$Route$href($author$project$Route$Register)))),
						cE: 'Login to 3ml'
					});
			case 7:
				var subModel = page.a;
				return A2(
					frame,
					7,
					A2(
						mapMsg,
						$author$project$Main$StudentsMsg,
						A2($author$project$Page$Students$view, session, subModel)));
			case 8:
				var subModel = page.a;
				return A2(
					frame,
					7,
					A2(
						mapMsg,
						$author$project$Main$StudentMsg,
						$author$project$Page$Student$view(subModel)));
			case 9:
				var subModel = page.a;
				return A2(
					frame,
					7,
					A2(
						mapMsg,
						$author$project$Main$ClassesMsg,
						A2($author$project$Page$Classes$view, session, subModel)));
			case 10:
				var subModel = page.a;
				return A2(
					frame,
					7,
					A2(
						mapMsg,
						$author$project$Main$ClassMsg,
						A2($author$project$Page$Class$view, session, subModel)));
			case 11:
				var subModel = page.a;
				return A2(
					frame,
					0,
					A2(
						mapMsg,
						$author$project$Main$EditorMsg,
						$author$project$Page$Editor$view(subModel)));
			case 12:
				var subModel = page.a;
				return A2(
					frame,
					6,
					$author$project$Page$LeaderBoard$view(subModel));
			case 13:
				var subModel = page.a;
				return A2(
					frame,
					5,
					A2(
						mapMsg,
						$author$project$Main$AccountMsg,
						$author$project$Page$Account$view(subModel)));
			case 14:
				var subModel = page.a;
				return A2(
					frame,
					4,
					A2(
						mapMsg,
						$author$project$Main$RegisterMsg,
						$author$project$Page$Register$view(subModel)));
			default:
				var subModel = page.a;
				return A2(
					frame,
					7,
					A2(
						mapMsg,
						$author$project$Main$TeachersMsg,
						A2($author$project$Page$Teachers$view, session, subModel)));
		}
	});
var $author$project$Main$view = function (model) {
	var _v0 = model.m;
	if (!_v0.$) {
		var page = _v0.a;
		return A3($author$project$Main$viewPage, model.k, false, page);
	} else {
		var page = _v0.a;
		return A3($author$project$Main$viewPage, model.k, true, page);
	}
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{$7: $author$project$Main$init, d3: $author$project$Main$ChangedUrl, d4: $author$project$Main$ClickedLink, en: $author$project$Main$subscriptions, ex: $author$project$Main$update, ey: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));