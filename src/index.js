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

function hasSvgImageArgument(path) {
  return path.get('arguments').length > 1 &&
    path.get('arguments')[0].isStringLiteral({value: 'image'})
}

function getPropertyValue(path, propertyName) {

  if (path.get('arguments')[1].isObjectExpression()) {

    let props = path.get('arguments')[1].get("properties");

    for (let prop of props) {

      if (!prop.isProperty()) continue;

      let key = prop.get("key");

      if (key.isIdentifier({name: propertyName})) {
        return prop.get("value");
      }

    }
  }
}

function isURL(url) {

  let lowerURL = url.toLowerCase()
  return lowerURL.startsWith('http://') || lowerURL.startsWith('https://') || lowerURL.startsWith('data:')

}

function transformImgSrcNodePath(imgSrcNodePath, t) {

  if (imgSrcNodePath.isStringLiteral() && !imgSrcNodePath._img_import_processed) {

    imgSrcNodePath._img_import_processed = true;

    return createImport( imgSrcNodePath.node.value , t);

  } else {

    return imgSrcNodePath;

  }


}

function transformSvgImageHrefNodePath(svgImageHrefNodePath, t) {

  if (svgImageHrefNodePath.isStringLiteral() && !svgImageHrefNodePath._img_import_processed) {

    svgImageHrefNodePath._img_import_processed = true;

    return createImport( svgImageHrefNodePath.node.value , t);

  } else {

    return svgImageHrefNodePath;

  }


}

function parseSrcSetValue( srcSetValue ) {

  const imgList = srcSetValue.split(',').map(function ( img ) {
    const [imgSrc,descriptor]=img.trim().split(' ');
    return {imgSrc,descriptor}
  })

  return imgList;

}

function createImport( imgSrc , t){

  // Override transformation
  if (imgSrc.startsWith('!')) {
    return t.stringLiteral(imgSrc.substring(1));
  }

  // Ignore if src is an absolute URL
  if (isURL(imgSrc)) {
    return t.stringLiteral(imgSrc);
  }

  // cache import identifiers.
  let imgImportIdentifier = imgImportIdentifiers[imgSrc]

  if (!imgImportIdentifier) {
    imgImportIdentifier = rootScope.generateUidIdentifier('image');
    imgImportIdentifiers[imgSrc] = imgImportIdentifier
  }

  // We need to access the default import since Babel shim non
  // CommonJS modules.
  let imgImportDefaultIdentifier = t.memberExpression(
    imgImportIdentifier, t.identifier("default"))

  return imgImportDefaultIdentifier;

}

function transformImgSrcSetNodePath(imgSrcSetValueNodePath, t) {

  if (imgSrcSetValueNodePath.isStringLiteral() ) {

    let srcSetValue = imgSrcSetValueNodePath.node.value;

    let srcSetList = parseSrcSetValue(srcSetValue);

    const srcSetValues = srcSetList.map(function (srcSetElement) {

      const imgSrc = createImport(srcSetElement.imgSrc,t);
      const descriptor = ( srcSetElement.descriptor ) ?
        t.stringLiteral(srcSetElement.descriptor) : t.stringLiteral('')

      return {imgSrc,descriptor}

    })

    const srcSetExpression = srcSetValues.reduce(function (prev, current,i) {

      let exp =  t.binaryExpression( '+',
        t.binaryExpression( '+', current.imgSrc , t.stringLiteral(' ') ),
        current.descriptor );

      if ( i < srcSetValues.length - 1 ){
        exp = t.binaryExpression( '+', exp, t.stringLiteral(', '))
      }

      if ( prev ){
        exp = t.binaryExpression( '+' ,  prev , exp )
      }

      return exp;

    },null)

    return srcSetExpression;

  } else {
    return imgSrcSetValueNodePath;
  }

}

export default function ({types: t}) {

  return {
    visitor: {

      CallExpression(path, state) {

        // is a React.createElement("img" .... )
        if (isReactCreateElement(path) && hasImgArgument(path)) {

          // process src
          let imgSrcValueNodePath = getPropertyValue(path,'src');

          if (imgSrcValueNodePath) {

            let newSrcValueNodePath = transformImgSrcNodePath(imgSrcValueNodePath, t)

            imgSrcValueNodePath.replaceWith(newSrcValueNodePath);

          }



          // process srcSet
          let imgSrcSetValueNodePath = getPropertyValue(path,'srcSet');

          if ( imgSrcSetValueNodePath ){

            let newSrcSetValueNodePath = transformImgSrcSetNodePath(imgSrcSetValueNodePath, t)

            imgSrcSetValueNodePath.replaceWith(newSrcSetValueNodePath)

          }


        } else if (isReactCreateElement(path) && hasSvgImageArgument(path)) {

          // process href
          let svgImageHrefValueNodePath = getPropertyValue(path,'href');

          if (svgImageHrefValueNodePath) {

            let newSvgImageHrefValueNodePath = transformSvgImageHrefNodePath(svgImageHrefValueNodePath, t)

            svgImageHrefValueNodePath.replaceWith(newSvgImageHrefValueNodePath);

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
