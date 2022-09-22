import { createSlice } from "@reduxjs/toolkit";
import { uiActions } from "./ui-slice";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalQuantity: 0,
        changed: false,
    },
    reducers: {
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItem = state.items.find(
                (item) => item.id === newItem.id
            );
            state.totalQuantity++;
            state.changed = true;
            if (!existingItem) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.title,
                });
            } else {
                existingItem.quantity++;
                existingItem.totalPrice =
                    existingItem.totalPrice + newItem.price;
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItem = state.items.find((item) => item.id === id);
            state.totalQuantity--;
            if (existingItem.quantity === 1) {
                state.items = state.items.filter((item) => item.id !== id);
            } else {
                existingItem.quantity--;
                existingItem.totalPrice =
                    existingItem.totalPrice - existingItem.price;
            }
        },
        getCart(state, action) {
            const { items, totalQuantity } = action.payload;
            state.items = items;
            state.totalQuantity = totalQuantity;
            state.changed = false;
        },
    },
});

export const saveCart = (cart) => {
    return async (dispatch) => {
        dispatch(
            uiActions.showNotification({
                status: "pending",
                message: "Saving cart please wait...",
                title: "Saving cart",
            })
        );
        try {
            const response = await fetch(
                "https://react-http-24a9a-default-rtdb.firebaseio.com/cart.json",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        items: cart.items,
                        totalQuantity: cart.totalQuantity,
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Saving cart failed!");
            }
            dispatch(
                uiActions.showNotification({
                    status: "success",
                    message: "Saving cart Success!",
                    title: "Success!",
                })
            );
        } catch (e) {
            dispatch(
                uiActions.showNotification({
                    status: "error",
                    message: e.message,
                    title: "Error!",
                })
            );
        }
    };
};
export const fetchCart = () => {
    return async (dispatch) => {
        try {
            const response = await fetch(
                "https://react-http-24a9a-default-rtdb.firebaseio.com/cart.json"
            );
            if (!response.ok) {
                throw new Error("Fetching cart Failed!");
            }
            const data = await response.json();
            console.log(data);
            if (!data) {
                dispatch(
                    uiActions.showNotification({
                        title: "Success!",
                        status: "success",
                        message: "No data Found",
                    })
                );
                return;
            }

            dispatch(
                cartActions.getCart({
                    items: data.items || [],
                    totalQuantity: data.totalQuantity,
                })
            );
        } catch (e) {
            dispatch(
                uiActions.showNotification({
                    title: "Error!",
                    status: "error",
                    message: e.message,
                })
            );
        }
    };
};

export const cartActions = cartSlice.actions;

export default cartSlice;
