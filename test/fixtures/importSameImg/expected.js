"use strict";

var _avatar = require("avatar.png");

var _image = _interopRequireWildcard(_avatar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var profile = React.createElement(
  "div",
  null,
  React.createElement(
    "div",
    null,
    React.createElement("img", { src: _image.default, className: "profile" }),
    React.createElement(
      "h3",
      null,
      [user.firstName, user.lastName].join(' ')
    )
  ),
  React.createElement(
    "div",
    null,
    React.createElement("img", { src: _image.default })
  )
);
