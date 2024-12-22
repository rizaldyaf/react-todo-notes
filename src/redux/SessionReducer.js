
const SessionReducer = (state = {
	config:null,
    data:{
        notes:[
			{id:"123", title:"Hello", content:"hello **world**", dateModified:"2024-12-12T00:00:00Z", color:"lightgreen"},
		],
        checklists:[],
        boards:[]
    }
},action)=>{
	switch (action.type){
		case 'SET_CONFIG':
			state = {
				...state,
				config: action.payload
			}
			break
		case "SET_DATA":
			state = {
				...state,
				data:action.payload
			}
			break
		case "SET_NOTES":
			state = {
				...state,
				data:{
                    ...state.data,
                    notes:action.payload
                }
			}
			break
		default : break
	}
	return state;
}

export default SessionReducer