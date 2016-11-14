# babel-plugin-transform-react-jsx-img-import

![Build Status](https://img.shields.io/travis/gvelo/babel-plugin-transform-react-jsx-img-import.svg)
![Coverage](https://img.shields.io/coveralls/gvelo/babel-plugin-transform-react-jsx-img-import.svg)
![Downloads](https://img.shields.io/npm/dm/babel-plugin-transform-react-jsx-img-import.svg)
![Downloads](https://img.shields.io/npm/dt/babel-plugin-transform-react-jsx-img-import.svg)
![npm version](https://img.shields.io/npm/v/babel-plugin-transform-react-jsx-img-import.svg)
![dependencies](https://img.shields.io/david/gvelo/babel-plugin-transform-react-jsx-img-import.svg)
![dev dependencies](https://img.shields.io/david/dev/gvelo/babel-plugin-transform-react-jsx-img-import.svg)
![License](https://img.shields.io/npm/l/babel-plugin-transform-react-jsx-img-import.svg)

Generate imports for jsx img elements. A handy transform for use in webpack workflows.


## Exclude elements from transformation

Prefix a img src with "!" to exclude it from the transformation.

```javascript
var profile = <div>
  <img src="!avatar.png" className="profile" />
</div>;
```


## Example

### In

```javascript
var profile = <div>
  <img src="avatar.png" className="profile" />
  <h3>{[user.firstName, user.lastName].join(' ')}</h3>
</div>;
```

### Out

```javascript
var _avatar = require("avatar.png");

var _image = _interopRequireWildcard(_avatar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var profile = React.createElement( "div", null,
  React.createElement("img", { src: _image.default, className: "profile" }),
  React.createElement( "h3", null, [user.firstName, user.lastName].join(' ') )
);

```


## Installation

Install it via npm:

```shell
npm install babel-plugin-transform-react-jsx-img-import
```

## Usage

### Via .babelrc (Recommended)
.babelrc

```javascript
{
  "plugins": ["transform-react-jsx-img-import"]
}
```

### Via CLI

```shell
$ babel --plugins transform-react-jsx-img-import script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["transform-react-jsx-img-import"]
});
```


## License

MIT
