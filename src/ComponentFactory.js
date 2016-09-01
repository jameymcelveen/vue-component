/**
 * Created by Jamey McElveen on 9/1/16.
 */

import Http from './Http'
import TemplateParser from './TemplateParser';

export default class ComponentFactory {

  static build(src, callback) {
    Http.GET(src, (data, err) => {
      if(err) {
        console.error(err);
        callback(null);
      } else {
        let template = TemplateParser.parse(data);
        let script = mutateScript(src, template);
        console.log(script);
        let func = new Function('Vue', script);
        callback(func);
      }
    });
  }

}


function mutateScript(url, template) {
  let componentName = url.substring(url.lastIndexOf('/')+1).split('.')[0];
  let objectName = snakeToCamel(componentName);
  console.log(JSON.stringify(template));
  var rx = /(^\s*)(?:export\s+default|module\.exports\s*=)\s*{(.*)/g;
  var replacement = '$1var ' + objectName + ' = {$2';
  let script =  template.script || 'export default {}';
    script = script.replace(rx, replacement);
  let t = template.template.replace(/"/g, "\\\"");
  script += '\n\n' + objectName + '.template = "' + t + '";\n'+
    'Vue.component("'+componentName+'", '+objectName+');';
  return script;
}

function snakeToCamel(s){
  return s.replace(/(\-\w)/g, function(m){return m[1].toUpperCase();});
}
