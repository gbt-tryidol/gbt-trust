import { configureStore } from "@reduxjs/toolkit";
import { treeReducer, eventReducer, updateReducer, userReducer, bankReducer, teamReducer, transferReducer } from "./reducers";

// import {} from "./reducers";

export const store = configureStore({
	reducer: {
		user: userReducer,
		update: updateReducer,
		tree: treeReducer,
		event: eventReducer,
		bank: bankReducer,
		team: teamReducer,
		transfer: transferReducer,
	},
});
