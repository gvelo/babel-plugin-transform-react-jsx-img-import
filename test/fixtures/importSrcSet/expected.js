"use strict";

var _avatar = require("avatar.png");

var _image = _interopRequireWildcard(_avatar);

var _img = require("images/img1.jpg");

var _image2 = _interopRequireWildcard(_img);

var _img2 = require("images/img2.jpg");

var _image3 = _interopRequireWildcard(_img2);

var _img3 = require("img1.jpg");

var _image4 = _interopRequireWildcard(_img3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var profile = React.createElement(
  "div",
  null,
  React.createElement("img", { src: _image.default, srcSet: _image2.default + " " + "" + ", " + (_image3.default + " " + "2x" + ", ") + (_image4.default + " " + "3x"), className: "profile" }),
  React.createElement(
    "h3",
    null,
    [user.firstName, user.lastName].join(' ')
  )
);
