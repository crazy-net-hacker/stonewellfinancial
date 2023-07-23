import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers/index.js'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas/index'
import { composeWithDevTools } from 'redux-devtools-extension'

const initialState = {}
const sagaMiddleware = createSagaMiddleware()

// const store = compose(applyMiddleware(sagaMiddleware))(createStore)(rootReducer)
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSaga)

export default store
