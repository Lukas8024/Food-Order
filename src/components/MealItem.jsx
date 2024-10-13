import Button from './UI/Button.jsx'

import { currencyFormater } from '../util/formatting.js'
import { useContext } from 'react'
import CartContext from '../store/CartContext.jsx'

export default function MealItem({ meal }) {
	const cartCTx = useContext(CartContext)

	function handleAddMealToCart() {
		cartCTx.addItem(meal)
	}

	return (
		<li className='meal-item'>
			<article>
				<img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
				<div>
					<h3>{meal.name}</h3>
					<p className='meal-item-price'>{currencyFormater.format(meal.price)}</p>
					<p className='meal-item-description'>{meal.description}</p>
				</div>
				<p className='meal-item-actions'>
					<Button onClick={handleAddMealToCart}>Add to Cart</Button>
				</p>
			</article>
		</li>
	)
}
