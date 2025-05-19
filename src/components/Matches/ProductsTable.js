import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import "./Product.css";

const PRODUCT_DATA = [
	{ id: 1, name: "Wireless Earbuds", category: "Electronics", price: 59.99, stock: 143, sales: 1200 },
	{ id: 2, name: "Leather Wallet", category: "Accessories", price: 39.99, stock: 89, sales: 800 },
	{ id: 3, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 56, sales: 650 },
	{ id: 4, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 210, sales: 950 },
	{ id: 5, name: "Coffee Maker", category: "Home", price: 79.99, stock: 78, sales: 720 },
];

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(PRODUCT_DATA);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = PRODUCT_DATA.filter(
			(product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term)
		);

		setFilteredProducts(filtered);
	};

	return (
		<motion.div
			className='products-table'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='products-table-header'>
				<h2 className='products-table-title'>Liste des Matchs</h2>
				<div className='products-table-search'>
					<input
						type='text'
						placeholder='Search products...'
						className='products-table-search-input'
						onChange={handleSearch}
						value={searchTerm}
					/>
					<Search className='products-table-search-icon' size={18} />
				</div>
			</div>

			<div className='products-table-container'>
				<table className='products-table-content'>
					<thead>
						<tr>
							<th className='products-table-header-cell'>Nom</th>
							
							<th className='products-table-header-cell'>Prix</th>
							<th className='products-table-header-cell'>Stock</th>
							<th className='products-table-header-cell'>Ventes</th>
							<th className='products-table-header-cell'>Actions</th>
						</tr>
					</thead>

					<tbody className='products-table-body'>
						{filteredProducts.map((product) => (
							<motion.tr
								key={product.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='products-table-cell products-table-cell-name'>
									<img
										src='https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww'
										alt='Product img'
										className='products-table-image'
									/>
									{product.name}
								</td>
								
								<td className='products-table-cell'>${product.price.toFixed(2)}</td>
								<td className='products-table-cell'>{product.stock}</td>
								<td className='products-table-cell'>{product.sales}</td>
								<td className='products-table-cell'>
									<button className='products-table-action-edit'>
										<Edit size={18} />
									</button>
									<button className='products-table-action-delete'>
										<Trash2 size={18} />
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};
export default ProductsTable;
