import _ from 'lodash'

let imgImportIdentifiers = {};
let rootScope;

function isReactCreateElement(path) {
  return path.get('callee').matchesPattern('React.createElement')
}

function hasImgArgument(path) {
  return path.get('arguments').length > 1 &&
    path.get('arguments')[0].isStringLiteral({value: 'img'})
}

function getImgSrcNodePath(path) {

  if (path.get('arguments')[1].isObjectExpression()) {

    let props = path.get('arguments')[1].get("properties");

    for (let prop of props) {

      if (!prop.isProperty()) continue;

      let key = prop.get("key");

      if (key.isIdentifier({name: 'src'})) {
        return prop.get("value");
      }

    }
  }
}

function isURL(url) {

  let lowerURL = url.toLowerCase()
  return lowerURL.startsWith('http://') || lowerURL.startsWith('https://')

}

function transformImgSrcNodePath(imgSrcNodePath, t) {

  if (imgSrcNodePath.isStringLiteral() && !imgSrcNodePath._img_import_processed) {

    let srcValue = imgSrcNodePath.node.value;

    // Override transformation
    if (srcValue.startsWith('!')) {
      imgSrcNodePath._img_import_processed = true
      return t.stringLiteral(srcValue.substring(1));
    }

    // Ignore if src is an absolute URL
    if (isURL(srcValue)) {
      return imgSrcNodePath
    }

    // cache import identifiers.
    let imgImportIdentifier = imgImportIdentifiers[srcValue]

    if (!imgImportIdentifier) {
      imgImportIdentifier = rootScope.generateUidIdentifier('image');
      imgImportIdentifiers[srcValue] = imgImportIdentifier
    }

    // We need to access the default import since Babel shim non
    // CommonJS modules.
    let imgImportDefaultIdentifier = t.memberExpression(
      imgImportIdentifier, t.identifier("default"))

    return imgImportDefaultIdentifier;

  } else {

    return imgSrcNodePath;

  }


}

export default function ({types: t}) {

  return {
    visitor: {

      CallExpression(path, state) {

        if (isReactCreateElement(path) && hasImgArgument(path)) {

          let imgSrcNodePath = getImgSrcNodePath(path);

          if (imgSrcNodePath) {

            let newSrcNodePath = transformImgSrcNodePath(imgSrcNodePath, t)

            imgSrcNodePath.replaceWith(newSrcNodePath);

          }
        }
      },

      Program: {

        exit(path, state){

          const importDeclarations = _.map(imgImportIdentifiers, (imgImportIdentifier, imgSrcLiteral) => {
            return t.importDeclaration(
              [t.importNamespaceSpecifier(imgImportIdentifier)],
              t.stringLiteral(imgSrcLiteral))
          })

          path.unshiftContainer('body', importDeclarations);

        },
        enter(path, state){
          imgImportIdentifiers = {};
          rootScope = path.scope;
        }

      }
    }
  }
}
