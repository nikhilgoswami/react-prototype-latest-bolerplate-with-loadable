import {
  configureStore,
  Action,
  StateFromReducersMapObject,
  Dispatch,
  AnyAction,
  // EnhancedStore,
  ThunkDispatch
} from '@reduxjs/toolkit'

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import { ThunkAction } from 'redux-thunk'

import { createReducer, rootReducer } from './rootReducer'
import { pokemonApi } from 'api'


const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, createReducer());

const initStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
    devTools: String(process.env.NODE_ENV).trim() !== 'production'
  })

export type Store = ReturnType<typeof initStore>
export type RootState = StateFromReducersMapObject<typeof rootReducer>
export type AppDispatch = Store['dispatch']
export type AppThunk = ThunkAction<void, RootState, unknown, Action>

export const useAppDispatch = (): Dispatch<AnyAction> &
ThunkDispatch<RootState, undefined, AnyAction> => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export { initStore }
