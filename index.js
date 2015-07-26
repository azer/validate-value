var newError = require("new-error");

module.exports = validate;

function validate (value, options) {
  options = normalize(options);
  var name = options.name;
  var err;

  if (value === undefined && !options.required) {
    return;
  }

  if (value == undefined) {
    return name ? newError('"{0}" is missing.', name) : new Error('This is a required field.');
  }

  if (err = is(value, options)) {
    return err;
  }

  if (options.email && (err = email(value, options))) {
    return err;
  }

  if ((options.allowed || options.matches) && (err = matches(value, options))) {
    return err;
  }

  if (options.len && (err = len(value, options))) {
    return err;
  }

  if (options.lower != undefined && (err = lower(value, options))) {
    return err;
  }

  if (options.higher != undefined && (err = higher(value, options))) {
    return err;
  }
}

function is (value, options) {
  if (options.is(value) === value) return;
  return newError('{0} is expected to be a {1}.', name(value, options), typeName(options.is));
}

function email (value, options) {
  if (/^[\w\.\+\-_]+@[\w\-_]+\.[\w\.]{2,10}$/.test(value)) return;
  return new Error('A valid e-mail is required.');
}

function len (value, options) {
  if (typeof options.len == 'number' && value.length != options.len) {
    return newError('{0} should be {1} character{2} long.', name(value, options), options.len, options.len > 1 ? 's' : '');
  }

  if (options.len[0] > value.length) {
    return newError('{0} should be at least {1} character{2} long.', name(value, options), options.len[0], options.len[0] > 1 ? 's' : '');
  }

  if (options.len.length > 1 && options.len[1] < value.length) {
    return newError('{0} should be less than {1} character{2}.', name(value, options), options.len[1] + 1, options.len[1] > 1 ? 's' : '');
  }
}

function lower (value, options) {
  if (typeof value != 'number') return;

  if (value >= options.lower) {
    return newError('{0} should be lower than {1}.', name(value, options, true), options.lower);
  }
}

function higher (value, options) {
  if (typeof value != 'number') return;

  if (value <= options.higher) {
    return newError('{0} should be higher than {1}.', name(value, options, true), options.higher);
  }
}

function matches (value, options) {
  options.matches || (options.matches = new RegExp("^[" + options.allowed.join("") + "]*$"));

  if (options.matches.test(value)) return;

  if (options.allowed) {
    return newError('Only following characters are allowed{0}: "{1}".',
                    options.name ? ' for ' + options.name : '',
                    options.allowed.join('", "'));
  }

  return newError('{0} doesn\'t match the pattern "{1}" expected.', name(value, options), options.matches);
}

function name (value, options, useValue) {
  var name = options.name;

  if (useValue && !name) {
    name = value;
  }

  if (name) {
    return '"' + name + '"';
  }

  return 'It';
}

function normalize (options) {
  if (typeof options == 'function') {
    options = { is: options };
  }

  if (options.email) {
    options.is = String;
    options.name || (options.name = 'E-mail');
  }

  if (!options.is && (options.allowed || options.matches || options.len)) {
    options.is = String;
  }

  options.is || (options.is = String);

  return options;
}

function typeName (type) {
  return type.name.toLowerCase();
}
