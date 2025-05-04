import { createPinia } from 'pinia';
import  {createPersistedState}  from 'pinia-plugin-persistedstate';
const pinia = createPinia();
// 先不使用持久化存本地，方便刷新后就清除
// const persist = createPersistedState();
// pinia.use(persist);

export default pinia
