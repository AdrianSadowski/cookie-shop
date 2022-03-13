import Axios from 'axios';

/* selectors */
export const getAll = ({products}) => products.data;
export const getProduct = ({products}) => products.currentProduct;
export const getAllCart = ({products}) => products.cart;

/* action name creator */
const reducerName = 'products';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const FETCH_PRODUCTS = createActionName('FETCH_PRODUCTS');
const FETCH_ONE_PRODUCT = createActionName('FETCH_ONE_PRODUC');
const ADD_TO_CART = createActionName('ADD_TO_CART');
const REMOVE_FROM_CART = createActionName('REMOVE_FROM_CART');
const ADJUST_QTY = createActionName('ADJUST_QTY');
const CREATE_ORDER = createActionName('CREATE_ORDER');

/* action creators */
export const fetchStarted = payload => ({payload, type: FETCH_START});
export const fetchSuccess = payload => ({payload, type: FETCH_SUCCESS});
export const fetchError = payload => ({payload, type: FETCH_ERROR});
const fetchProducts = payload => ({payload, type: FETCH_PRODUCTS});
const fetchOneProduct = payload => ({payload, type: FETCH_ONE_PRODUCT});
export const addToCart = payload => ({payload, type: ADD_TO_CART});
export const removeFromCart = payload => ({payload, type: REMOVE_FROM_CART});
export const adjustQTY = (_id, value) => ({payload: {_id: _id, amount: value}, type: ADJUST_QTY});
export const createOrder = payload => ({payload, type: CREATE_ORDER});

/* thunk creators */
export const fetchAllProducts = () => async (dispatch, getState) => {
  const {products} = getState();

  if (!products.data.length) {
    dispatch(fetchStarted());
    await Axios.get('http://localhost:8000/api/products')
      .then(res => {
        dispatch(fetchProducts(res.data));
        dispatch(fetchSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  }
};

export const fetchProductById = productId => async (dispatch, getState) => {
  const {products} = getState();

  if (!products.currentProduct || products.currentProduct._id !== productId) {
    dispatch(fetchStarted());
    await Axios.get(`http://localhost:8000/api/products/${productId}`)
      .then(res => {
        dispatch(fetchOneProduct(res.data));
        dispatch(fetchSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchError(err.message || true));
      });
  }
};

/* reducer */
export const reducer = (statePart = [], action = {}) => {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        data: action.payload,
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
    case FETCH_ONE_PRODUCT: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: false,
        },
        currentProduct: action.payload,
      };
    }
    case ADD_TO_CART: {
      const itemIndex = statePart.cart.findIndex(item => {
        return item._id === action.payload._id;
      });

      if (itemIndex > -1 ) {
        console.log(itemIndex);
        statePart.cart[itemIndex].amount += action.payload.amount;
        return {
          ...statePart,
          cart: [...statePart.cart],
        };
      }

      return {
        ...statePart,
        cart: [...statePart.cart, action.payload],
      };
    }
    case REMOVE_FROM_CART:
      return {
        ...statePart,
        cart: statePart.cart.filter(product => product._id !== action.payload),
      };
    case ADJUST_QTY:
      return {
        ...statePart,
        cart: statePart.cart.map(product =>
          product._id === action.payload._id
            ? {...product, amount: +action.payload.amount}
            : product,
        ),
      };
    case CREATE_ORDER:
      return{
        ...statePart,
        order: [...statePart.order, action.payload],
        cart: [],
      };
    default:
      return statePart;
  }
};
