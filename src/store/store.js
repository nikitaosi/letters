import { _PRODUCTION_ } from 'environs';
import prodStore from './store.prod';
import devStore from './store.dev'
export default _PRODUCTION_ ? prodStore : devStore;
