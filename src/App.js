import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { fetchCart, saveCart } from "./store/cart-slice";

let isInitialLoad = true;

function App() {
    const showCart = useSelector((state) => state.ui.cartIsVisible);
    const { notification } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    useEffect(() => {
        if (isInitialLoad) {
            isInitialLoad = false;
            return;
        }
        if (cart.changed) dispatch(saveCart(cart));
    }, [cart, dispatch]);

    return (
        <>
            {notification !== null && (
                <Notification
                    status={notification.status}
                    title={notification.title}
                    message={notification.message}
                />
            )}
            <Layout>
                {showCart && <Cart />}
                <Products />
            </Layout>
        </>
    );
}

export default App;
