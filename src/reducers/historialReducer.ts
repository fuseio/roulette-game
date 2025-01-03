import { createSlice } from '@reduxjs/toolkit'
import contractsService from '../services/contractsService';
const historialSlice = createSlice({
    name: 'historial',
    initialState: "",
    reducers:{
        setHistorial(state, action){
            return action.payload
        }
    }
})

export const {setHistorial} = historialSlice.actions

export const loadHistorial = (acc, walletClient) => {
    return async dispatch =>{
        const historial = await contractsService.historial(acc, walletClient)
        dispatch(setHistorial(historial))
    }
}

export default historialSlice.reducer