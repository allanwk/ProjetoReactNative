import { createSlice } from "@reduxjs/toolkit";

const initialValues = {
    id: null
}

export const vacinaSlice = createSlice({
    name: 'vacina',
    initialState: initialValues,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload.id;
        },
    }
})

export const { setId } = vacinaSlice.actions;
export default vacinaSlice.reducer;