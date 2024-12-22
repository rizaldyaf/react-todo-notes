export function setConfig(config) {
	return {
		type:"SET_CONFIG",
		payload:config,
	}
}

export function setData(data) {
	return {
		type:"SET_DATA",
		payload:data
	}
}

export function setNotes(notes) {
	return {
		type:"SET_NOTES",
		payload:notes
	}
}