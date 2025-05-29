import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import { slotImages } from "../../data/slotImages";
import Api from "../../api";

const Main = () => {
	const [matrix, setMatrix] = useState(null);
	const [spinningMatrix, setSpinningMatrix] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		let intervalId;
		if (loading) {
			intervalId = setInterval(() => {
				setSpinningMatrix(generateRandomMatrix(4, 5, 7));
			}, 100);
		}
		return () => clearInterval(intervalId);
	}, [loading]);

	const generateRandomMatrix = (x, y, max) => {
		return Array.from({ length: y }, () =>
				Array.from({ length: x }, () => Math.floor(Math.random() * (max + 1)))
		);
	};

	const handleClick = () => {
		setLoading(true);
		setError(null);
		setMatrix(null);

		Api.getMatrix({ x: 5, y: 3, max: 7 })
				.then(res => {
					setTimeout(() => {
						setMatrix(res.data.matrix);
						setLoading(false);
						setSpinningMatrix(null);
					}, 2000);
				})
				.catch(err => {
					setError('Error: ' + err.message);
					setLoading(false);
					setSpinningMatrix(null);
				});
	};

	const displayMatrix = loading ? spinningMatrix : matrix;

	return (
			<div className={styles.wrapper}>
				<div className={styles.slothContainer}>
					<div className={styles.reel}>
						{displayMatrix && displayMatrix.map((row, rowIndex) => (
								<div
										key={rowIndex}
										className={`${styles.row} ${loading ? styles.spinning : styles.bounce}`}
								>
									{row.map((cell, i) => (
											<img key={i} src={slotImages[cell]} alt={`icon_${cell}`} />
									))}
								</div>
						))}
					</div>
					<div onClick={handleClick} className={styles.spin}>
						<img src="/assets/images/spin.png" alt="Spin" />
					</div>
				</div>
			</div>
	);
};

export default Main;
