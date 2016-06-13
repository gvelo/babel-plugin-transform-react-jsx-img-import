import * as t from 'babel-types'
import _ from 'lodash'

let imgImportIdentifiers = {};
let rootScope;

function isReactCreateElement(path) {
  return path.get('callee').matchesPattern('React.createElement')
}

function hasImgArgument(path) {
  return path.get('arguments').length > 1 &&
         path.get('arguments')[0].isStringLiteral({value:'img'})
}

function getImgSrcNodePath (path) {

  if ( path.get('arguments')[1].isObjectExpression() ){

    let props = path.get('arguments')[1].get("properties");

    for ( let prop of props ){

      if (!prop.isProperty()) continue;

      let key = prop.get("key");

      if( key.isIdentifier( { name: 'src' } ) ){
        return prop.get("value");
      }

    }
  }
}


export default function ({ types: t }) {

  return {
    visitor: {

      CallExpression(path, state) {

        if( isReactCreateElement( path ) &&  hasImgArgument( path )  ){

          let imgSrcNodePath = getImgSrcNodePath( path );

          if ( imgSrcNodePath && imgSrcNodePath.isStringLiteral() ) {

              let srcValue = imgSrcNodePath.node.value;

              // cache import identifiers.
              let imgImportIdentifier = imgImportIdentifiers[srcValue]

              if( !imgImportIdentifier ){
                imgImportIdentifier = rootScope.generateUidIdentifier('image');
                imgImportIdentifiers[srcValue]=imgImportIdentifier
              }

              // We need to access the default import since Babel shim non
              // CommonJS modules.
              let imgImportDefaultIdentifier = t.memberExpression(
                imgImportIdentifier, t.identifier("default") )

              imgSrcNodePath.replaceWith(imgImportDefaultIdentifier);

          }
        }
      },

      Program: {

        exit(path,state){

          const importDeclarations = _.map(imgImportIdentifiers,(imgImportIdentifier,imgSrcLiteral) => {
            return t.importDeclaration(
              [t.importNamespaceSpecifier( imgImportIdentifier )] ,
              t.stringLiteral(imgSrcLiteral) )
          })

          path.unshiftContainer('body', importDeclarations);

        },
        enter(path,state){
          imgImportIdentifiers = {};
          rootScope=path.scope;
        }

      }
    }
  }
}
