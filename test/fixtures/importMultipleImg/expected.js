"use strict";

var _img = require("/assets/img1.png");

var _image = _interopRequireWildcard(_img);

var _img2 = require("/assets/img2.png");

var _image2 = _interopRequireWildcard(_img2);

var _img3 = require("/assets/cdn/img1.png");

var _image3 = _interopRequireWildcard(_img3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var profile = React.createElement(
  "div",
  null,
  React.createElement(
    "div",
    null,
    React.createElement("img", { src: _image.default })
  ),
  React.createElement(
    "div",
    null,
    React.createElement("img", { src: _image2.default })
  ),
  React.createElement(
    "div",
    null,
    React.createElement("img", { src: _image3.default })
  )
);
