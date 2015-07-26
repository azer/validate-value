## validate-value

Validate a value with specified options

## Install

```bash
$ npm install validate-value
```

## Usage

```js
var validate = require('validate-value')

validate('foo', { email: true });
// => [Error "foo" is not a valid e-mail]

validate('a', { is: String, len: [2, 7], name: "Title" });
// => [Error "Title" has to be at least 2 characthers length.]

validate(123, { is: Number, lower: 150, higher: 100 });
// => undefined
```

See [the reference](#reference) and tests for all options.

## Reference

### is

Defines the expected type. `String`, `Number` and `Boolean` supported. Objects and Arrays aren't implemented.

### required

Validation fails if the content doesn't have the expected field. It's `false` by default.

### allowed

Specifies allowed Regex character groups for a string:

```js
{ is: String, allowed: ['a-z', '0-9', '-', '_'] }
```

### matches

Fails if the input doesn't match the defined regex pattern:

```js
{ is: String, matches: /^[a-z]+$/ }
```

### email

Fails if the input is not a valid e-mail:

```js
{ is: String, email: true }
```

### len

Fails if the input is not longer/shorter than expected:

```js
{ is: String, len: [3, 24] }
```

### lower

Fails if the input is higher than expected:

```js
{ is: Number, lower: 100 }
```

* 99 will pass.
* 100+ will fail.

### higher

Fails if the input is lower than expected:

```js
{ is: Number, higher: 0 }
```

* 1 will pass.
* 0 and lower numbers will fail.

### name

Name of the value for better error messages. Example;


```js
validate('a', { is: String, len: [2, 7] });
// => [Error It has to be at least 2 characthers length.]

validate('a', { is: String, len: [2, 7], name: "Title" });
// => [Error "Title" has to be at least 2 characthers length.]
```
