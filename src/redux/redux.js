import {
    setConfig,
    setNotes,
    setData
} from './SessionActions'

export const mapStateToProps = (state) => {
    return {
        Session     : state.SessionReducer
    }
}

export const mapDispatchToProps = (dispatch) => {
	return {
		setConfig: (payload) => {
            dispatch(setConfig(payload))
        },
        setData: (payload) => {
            dispatch(setData(payload))
        },
        setNotes: (payload) => {
            dispatch(setNotes(payload))
        },
	}
}
