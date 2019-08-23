  
  export default function transformer(file, api) {
    const j = api.jscodeshift;
  
    function extractFeatures(jpath) {
      console.log("pv", jpath.get().value.callee.property.name);
      const decorators = {};
      let module; //egnyte.API.storage -> module="storage"
      jpath
        .find(j.MemberExpression, {object:{property:{name:"API"}}})
        .forEach(p => {
          module = p.value.property.name;
        });
  
      jpath.find(j.CallExpression).forEach(p => {
        console.log(p.value.callee.property.name, p.scope);
        //skip nested functions, because .find wouldn't
        if (p.scope.depth > 1) {
          return;
        }
        decorators[p.value.callee.property.name] = {
          name: p.value.callee.property.name,
          arguments: p.value.arguments
        };
      });
      const features = {
        finalMethod: {
          name: jpath.get().value.callee.property.name,
          arguments: jpath.get().value.arguments
        },
        decorators: decorators,
        module
      };
      console.dir(features);
      return features;
    }
    const translations={
        customizeRequest:'modifyRequest'
    }
    function translateName(name){
        return translations[name] || name
    }
    function transferDecoratorsToProps(decorators) {
      return Object.keys(decorators).map(name =>
        j.property("init", j.literal(translateName(name)), decorators[name].arguments[0])
      );
    }
  
    function createReplacement(path) {
      const features = extractFeatures(path);
      const callProperties = transferDecoratorsToProps(features.decorators);
      // reminder: show autocomplete for j.
      return j.callExpression(
        j.memberExpression(
          j.memberExpression(
            j.memberExpression(j.identifier("egnyte"), j.identifier("API"), false),
            j.identifier(features.module)
          ),
          j.identifier(features.finalMethod.name)
        ),
        [j.objectExpression(callProperties.filter(a => a))]
      );
    }
  
    function grabChainUntilFirstThen(path, previous) {
      if (path.value.callee && path.value.callee.property.name === "then") {
        // found a .then call
        return j(previous);
      }
      let result;
      j(path)
        .closest(j.CallExpression)
        .forEach(path2 => {
          result = grabChainUntilFirstThen(path2, path);
        });
  
      return result;
    }
    return j(file.source)
      .find(j.Identifier, {name: "egnyte"}) //find egnyte
      // .filter(ident => ident.value.name === "egnyte") 
      .closest(j.MemberExpression, {property:{name:"API"}}) //find a wrapping member expression
      // now we only have egnyte.API
      .forEach(path => {
        const replacementTarget = grabChainUntilFirstThen(path);
        const replacement = createReplacement(replacementTarget);
        replacementTarget.replaceWith(replacement); 
        //no need to return anything, references stay intact, can mutate in place
      })
      .toSource();
  }