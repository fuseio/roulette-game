import { createSlice } from '@reduxjs/toolkit'
const connectModalSlice = createSlice({
    name: 'connectModal',
    initialState: false,
    reducers: {
        setConnectModal(state) {
            return !state
        }
    }
})

export const { setConnectModal } = connectModalSlice.actions

export const toggleConnectModal = () => {
    return async dispatch => {
        dispatch(setConnectModal())
    }
}

export default connectModalSlice.reducer
