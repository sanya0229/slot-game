import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import { slotImages } from '../../data/slotImages';
import Api from '../../api';

const Main = () => {
	const [matrix, setMatrix] = useState(() => generateRandomMatrix(5, 3, 7));
	const [spinningMatrix, setSpinningMatrix] = useState(matrix);
	const [finalMatrix, setFinalMatrix] = useState(null);
	const [loading, setLoading] = useState(false);
	const [stoppedCols, setStoppedCols] = useState([false, false, false, false, false]);

	useEffect(() => {
		let interval;
		if (loading) {
			interval = setInterval(() => {
				setSpinningMatrix((prev) => {
					const next = generateRandomMatrix(5, 3, 7);
					return next.map((row, y) =>
							row.map((_, x) => (stoppedCols[x] ? finalMatrix[y][x] : next[y][x]))
					);
				});
			}, 100);
		}
		return () => clearInterval(interval);
	}, [loading, stoppedCols, finalMatrix]);

	useEffect(() => {
		if (finalMatrix && loading) {
			let col = -1;
			const stopNext = () => {
				setStoppedCols((prev) => {
					const updated = [...prev];
					updated[col] = true;
					return updated;
				});
				col++;
				if (col <= 3) {
					setTimeout(stopNext, 300);
				} else {
					setTimeout(() => {
						setMatrix(finalMatrix);
						setLoading(false);
					}, 300);
				}
			};
			stopNext();
		}
	}, [finalMatrix, loading]);

	function generateRandomMatrix(x, y, max) {
		return Array.from({ length: y }, () =>
				Array.from({ length: x }, () => Math.floor(Math.random() * (max + 1)))
		);
	}

	const handleClick = () => {
		setLoading(true);
		setFinalMatrix(null);
		setMatrix(null);
		setStoppedCols([false, false, false, false, false]);

		Api.getMatrix({ x: 3, y: 5, max: 7 })
				.then((res) => {
					setFinalMatrix(res.data.matrix);
				})
				.catch(() => {
					setLoading(false);
					setStoppedCols([true, true, true, true, true]);
				});
	};

	const displayMatrix = loading ? spinningMatrix : matrix;

	return (
			<div className={styles.wrapper}>
				<div className={styles.slothContainer}>
					<div className={styles.reel}>
						{displayMatrix &&
								displayMatrix[0].map((_, colIndex) => (
										<div
												key={colIndex}
												className={`${styles.row} ${
														loading && !stoppedCols[colIndex] ? styles.spinning : styles.bounce
												}`}
										>
											{displayMatrix.map((row, rowIndex) => (
													<img
															key={`${rowIndex}-${colIndex}`}
															src={slotImages[row[colIndex]]}
															alt={`icon_${row[colIndex]}`}
													/>
											))}
										</div>
								))}
					</div>
					<div onClick={handleClick} className={styles.spin}>
						<img src="/slots/assets/images/spin.png" alt="Spin" />
					</div>
				</div>
			</div>
	);
};

export default Main;
