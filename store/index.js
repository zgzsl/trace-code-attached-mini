import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		zsCodeNumber:"",
		activeZs:0
	},
	mutations: {
		setZsCodeNumber(state,option){
			state.zsCodeNumber=option
		},
		setActiveZs(state,option){
			state.activeZs=option
		},
	}
})

export default store
