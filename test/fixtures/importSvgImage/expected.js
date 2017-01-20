"use strict";

var _avatar = require("avatar.png");

var _image = _interopRequireWildcard(_avatar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var profile = React.createElement(
  "svg",
  null,
  React.createElement("image", { href: _image.default, x: "50", y: "50" })
);
