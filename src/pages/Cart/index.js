import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    MdRemoveCircleOutline,
    MdAddCircleOutline,
    MdDelete,
    MdRemoveShoppingCart,
} from 'react-icons/md';
import { Container, ProductTable, Total, EmptyCart } from './styles';
import * as CartActions from '../../store/modules/cart/actions';
import { formatPrice } from '../../util/format';

export default function Cart() {
    const total = useSelector(state =>
        formatPrice(
            state.cart.reduce((totalSum, product) => {
                return totalSum + product.price * product.amount;
            }, 0)
        )
    );
    const cart = useSelector(state =>
        state.cart.map(product => ({
            ...product,
            subTotal: formatPrice(product.price * product.amount),
        }))
    );
    const dispatch = useDispatch();
    function increment(product) {
        dispatch(
            CartActions.updateAmountRequest(product.id, product.amount + 1)
        );
    }
    function decrement(product) {
        dispatch(
            CartActions.updateAmountRequest(product.id, product.amount - 1)
        );
    }
    return (
        <Container>
            {String(total) !== 'R$ 0,00' ? (
                <>
                    <ProductTable>
                        <thead>
                            <tr>
                                <th> </th>
                                <th>PRODUTO</th>
                                <th>QTDE</th>
                                <th>SUBTOTAL</th>
                                <th> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(product => (
                                <tr key={product.id}>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                        />
                                    </td>
                                    <td>
                                        <strong>{product.title}</strong>
                                        <span>{product.priceFormatted}</span>
                                    </td>
                                    <td>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decrement(product)
                                                }
                                            >
                                                <MdRemoveCircleOutline
                                                    size={20}
                                                    color="#c85b6c"
                                                />
                                            </button>
                                            <input
                                                type="number"
                                                readOnly
                                                value={product.amount}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increment(product)
                                                }
                                            >
                                                <MdAddCircleOutline
                                                    size={20}
                                                    color="#c85b6c"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                    <td>
                                        <strong>{product.subTotal}</strong>
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                dispatch(
                                                    CartActions.removeFromCart(
                                                        product.id
                                                    )
                                                )
                                            }
                                        >
                                            <MdDelete
                                                size={20}
                                                color="#c85b6c"
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </ProductTable>
                    <footer>
                        <button type="button">Finalizar pedido</button>
                        <Total>
                            <span>TOTAL</span>
                            <strong>{total}</strong>
                        </Total>
                    </footer>
                </>
            ) : (
                <EmptyCart>
                    <MdRemoveShoppingCart size={40} color="#c85b6c" />
                    Não existem produtos no seu carrinho!
                    <Link to="/">Clique aqui para continuar comprando!</Link>
                </EmptyCart>
            )}
        </Container>
    );
}
