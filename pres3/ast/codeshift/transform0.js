export default function transformer(file, api) {
    const j = api.jscodeshift;
  
    return j(file.source)
      .find(j.Identifier, {name:"then"})
      .forEach(path => {
        j(path).replaceWith("THIS"); 
      })
      .toSource();
  }