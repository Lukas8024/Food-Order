import { useContext } from 'react'

import Modal from './UI/Modal.jsx'
import CartContext from '../store/CartContext.jsx'
import { currencyFormater } from '../util/formatting.js'
import Input from './UI/Input.jsx'
import UserProgressContext from '../store/UserProgressContext.jsx'
import Button from './UI/Button.jsx'
import useHttp from '../hooks/useHttp.js'
import Error from './Error.jsx'

const requestConfig = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
}

export default function Checkout() {
	const cartCtx = useContext(CartContext)
	const UserProgressCtx = useContext(UserProgressContext)

	const { data, isLoading: isSending, error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig)

	const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0)

	function handleClose() {
		UserProgressCtx.hideCheckout()
	}

	function handleFinish() {
		UserProgressCtx.hideCheckout()
		cartCtx.clearCart()
		clearData()
	}

	function handleSubmit(event) {
		event.preventDefault()

		const fd = new FormData(event.target)
		const customerData = Object.fromEntries(fd.entries()) // { e-mail: test@example.com }

		sendRequest(
			JSON.stringify({
				order: {
					items: cartCtx.items,
					customer: customerData,
				},
			})
		)
	}

	let actions = (
		<>
			<Button textOnly type='button' onClick={handleClose}>
				Close
			</Button>
			<Button>Submit Order</Button>
		</>
	)

	if (isSending) {
		actions = <span>Sending order data...</span>
	}

	if (data && !error){
		return <Modal open={UserProgressCtx.progress === 'checkout'} onClose={handleFinish}>
			<h2>Success!</h2>
			<p>Your order was submitted successfully.</p>
			<p>We will get back to you with more detail via email within the next few minutes.</p>
			<p className='modal-actions'>
				<Button onClick={handleFinish}>Okay</Button>
			</p>
		</Modal>
	}

	return (
		<Modal open={UserProgressCtx.progress === 'checkout'} onClose={handleClose}>
			<form onSubmit={handleSubmit}>
				<h2>Checkout</h2>
				<p>Total Amount: {currencyFormater.format(cartTotal)}</p>

				<Input label='Full Name' type='text' id='name' />
				<Input label='E-Mail Adress' type='email' id='email' />
				<Input label='Street' type='text' id='street' />
				<div className='control-row'>
					<Input label='Postal Code' type='text' id='postal-code' />
					<Input label='City' type='text' id='city' />
				</div>

				{error && <Error title='Failed to submit error' message={error} />}

				<p className='modal-actions'>{actions}</p>
			</form>
		</Modal>
	)
}
