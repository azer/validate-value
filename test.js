var test = require('prova');
var validate = require("./");

test('required', function (t) {
  t.plan(3);

  t.error(validate(undefined, { is: String }));
  t.equal(validate(undefined, { required: true }).message, "This is a required field.");
  t.equal(validate(undefined, { required: true, name: "Foo" }).message, '"Foo" is missing.');
});

test('type', function (t) {
  t.plan(4);

  t.error(validate('foo bar', { is: String }));
  t.equal(validate(123, String).message, "It is expected to be a string.");
  t.equal(validate(123, { is: String }).message, "It is expected to be a string.");
  t.equal(validate(123, { is: String, name: "Qux" }).message, '"Qux" is expected to be a string.');
});

test('email', function (t) {
  t.plan(7);

  t.error(validate('yo@azer.bike', { email: true }));
  t.error(validate('yo@azer.photos', { email: true }));
  t.error(validate('yo@azer.co.uk', { email: true }));
  t.equal(validate(undefined, { email: true, required: true }).message, '"E-mail" is missing.');
  t.equal(validate('azer@yo', { email: true }).message, "A valid e-mail is required.");
  t.equal(validate('azer@', { email: true }).message, "A valid e-mail is required.");
  t.equal(validate('@azer@oo.com', { email: true }).message, "A valid e-mail is required.");
});

test('allowed', function (t) {
  t.plan(4);

  t.error(validate('123@@!', { allowed: ['0-9', '@', '!'] }));
  t.error(validate('asd@foo.com', { allowed: ['a-z', '.', '@'] }));
  t.equal(validate('123az@@!', { allowed: ['0-9', '@', '!'] }).message, 'Only following characters are allowed: "0-9", "@", "!".');
  t.equal(validate('a22', { allowed: ['a-z', '@', '.'], name: 'Qux' }).message, 'Only following characters are allowed for Qux: "a-z", "@", ".".');
});

test('matches', function (t) {
  t.plan(4);

  t.error(validate('123@@!', { matches: /^\d+/ }));
  t.error(validate('asdasd', { matches: /^\w+/ }));
  t.equal(validate('123az@@!', { matches: /\w$/ }).message, 'It doesn\'t match the pattern "/\\w$/" expected.');
  t.equal(validate('a123', { matches: /[a-z]$/, name: 'yo' }).message, '"yo" doesn\'t match the pattern "/[a-z]$/" expected.');
});

test('len', function (t) {
  t.plan(9);

  t.error(validate('yo', { len: 2 }));
  t.error(validate('', { len: [0, 4] }));
  t.error(validate('yooo', { len: [0, 4] }));
  t.error(validate('yooo', { len: [2] }));

  t.equal(validate('yo', { len: 3 }).message, 'It should be 3 characters long.');
  t.equal(validate('', { len: [1, 4] }).message, 'It should be at least 1 character long.');
  t.equal(validate('', { len: [2, 4], name: "Foo" }).message, '"Foo" should be at least 2 characters long.');
  t.equal(validate('yoooo', { len: [0, 4], name: "Qux" }).message, '"Qux" should be less than 5 characters.');
  t.equal(validate('o', { len: [2] }).message, 'It should be at least 2 characters long.');
});

test('lower', function (t) {
  t.plan(4);

  t.error(validate(100, { is: Number, lower: 101 }));
  t.error(validate(0, { is: Number, lower: 1 }));

  t.equal(validate(100, { is: Number, lower: 90 }).message, '"100" should be lower than 90.');
  t.equal(validate(3, { is: Number, lower: 0, name: "foo" }).message, '"foo" should be lower than 0.');
});

test('higher', function (t) {
  t.plan(4);

  t.error(validate(100, { is: Number, higher: 99 }));
  t.error(validate(1, { is: Number, higher: 0 }));

  t.equal(validate(100, { is: Number, higher: 101 }).message, '"100" should be higher than 101.');
  t.equal(validate(-100, { is: Number, higher: 0, name: "foo" }).message, '"foo" should be higher than 0.');
});
