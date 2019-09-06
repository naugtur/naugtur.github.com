import jsc from 'jscodeshift' //feed the typescript engine

export default function transformer(file, api) {
    const j = api.jscodeshift;
  
    return j(file.source)
      .find(j.CallExpression, {arguments:[{params:[{name:"fileMetadata"}]}]})
      .find(j.Identifier, {name:"then"})
      .forEach(path => {
        j(path).replaceWith(jsc.identifier("catch")); 
      })
      .toSource();
  }