import { createSlice } from "@reduxjs/toolkit";

const initialValues = {
    id: null,
    name: null,
}

export const loginSlice = createSlice({
    name: 'login',
    initialState: initialValues,
    reducers: {
        setUserId: (state, action) => {
            state.id = action.payload.id;
        },
        setUserdata: (state, action) => {
            state.name = action.payload.name;
        }
    }
})

export const { setUserId, setUserdata } = loginSlice.actions;
export default loginSlice.reducer;