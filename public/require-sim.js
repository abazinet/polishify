/**
 * very cheap require like module loader.
 * 
 * not support relational filepath. this will search by the display name of object or the name of function.
 * 
  * 1. If you export like that:
  * 
  * ```
  * var Main = React.createClass({
  * ...snip...
  * });
  * 
  * export default Main;
  * ```
  * 
  * , you can import like that:
  * 
  * ```
  * import Main from 'Main';
  * ```
  * 
  * 2. You can't export const. So you need set object to `module.storedModules` object directly.
  * 
  * ```
  * const App = connect(mapStateToProps, mapDispatchToProps)(Main);
  * 
  * module.storedModules['App'] = App;
  * ```
  * 
  * note: `'App'` is the name to use require it. `App` is object that you want to store.
  * 
  * ```
  * import App from 'App';
  * ```
  * 
  * 3. if you want to export only functions, please create class has filename.
  * 
  * if you want :
  * 
  * `actionCreators.jsx`
  * 
  * ```
  * export changeDoneState = function(index){
  * }
  * ```
  * 
  * please convert like following:
  * 
  * `actionCreators.jsx`
  * 
  * ```
  * class actionCreators{}
  * 
  * actionCreators.changeDoneState = function(index){
  * }
  * 
  * export default actionCreators;
  * ```
  * 
  * so, you can import like that:
  * 
  * ```
  * import * as actionCreators from actionCreators;
  * ```
  * 
  * 
  * 4. you can import object that belongs to window object.
  * 
  * ```
  * import React from 'React';
  * ```
  * 
 * 
*/
    window.module = {
      storedModules: {}
    };
    window.exports = {};
    Object.defineProperty(module, "exports", {
      set: function(module){
        
        var name = module.displayName;
        if(!name && module.name)
          name = module.name;
        
        if(!name){
          throw new Error('[require-sim] module name can\'t detected.' 
                          + ' please store the module to '
                          + '`module.storedModules[\'name\'] ` directry.' );
        }
        
        if(!this.storedModules[name]){
          this.storedModules[name] = module;
        }else{
          throw new Error("[require-sim] duplicate module " + name + "");
        }
         
      }
    });
    
    window.require = function(name){
      
      storedModules = window.module.storedModules;
      
      if(storedModules[name]) return storedModules[name];
      if(window[name]) return window[name];
      
      console.log('[require-sim] "' + name + '" not found.');
      return undefined;
    };
    