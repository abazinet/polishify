import { createStore, applyMiddleware } from 'Redux';
import thunk from 'ReduxThunk';
import reducer from 'reducer';

module.storedModules['store'] = createStore(
  reducer,
  applyMiddleware(thunk)
);