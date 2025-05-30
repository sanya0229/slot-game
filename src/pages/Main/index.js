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
	const [activeCols, setActiveCols] = useState([false, false, false, false, false]);

	useEffect(() => {
		if (loading) {
			let col = -1;
			const startNext = () => {
				col++;
				if (col < 5) {
					setActiveCols((prev) => {
						const updated = [...prev];
						updated[col] = 'bounceStart';
						return updated;
					});
					setTimeout(() => {
						setActiveCols((prev) => {
							const updated = [...prev];
							updated[col] = 'spin';
							return updated;
						});
						setTimeout(startNext, 200);
					}, 220);
				}
			};
			startNext();
		} else {
			setActiveCols([false, false, false, false, false]);
		}
	}, [loading]);

	useEffect(() => {
		let interval;
		if (loading) {
			interval = setInterval(() => {
				const next = generateRandomMatrix(5, 3, 7);
				setSpinningMatrix((prev) =>
						next.map((row, y) =>
								row.map((_, x) =>
										stoppedCols[x]
												? finalMatrix[y][x]
												: activeCols[x] === 'spin'
														? next[y][x]
														: prev[y][x]
								)
						)
				);
			}, 50);
		}
		return () => clearInterval(interval);
	}, [loading, stoppedCols, finalMatrix, activeCols]);

	useEffect(() => {
		if (finalMatrix && loading) {
			let col = -1;
			const stopNext = () => {
				col++;
				if (col < 5) {
					setActiveCols((prev) => {
						const updated = [...prev];
						updated[col] = 'bounceEnd';
						return updated;
					});
					setStoppedCols((prev) => {
						const updated = [...prev];
						updated[col] = true;
						return updated;
					});
					setTimeout(() => {
						setActiveCols((prev) => {
							const updated = [...prev];
							updated[col] = false;
							return updated;
						});
						if (col < 4) {
							setTimeout(stopNext, 200);
						} else {
							setTimeout(() => {
								setMatrix(finalMatrix);
								setLoading(false);
							}, 300);
						}
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
		if (loading) return;
		setLoading(true);
		setFinalMatrix(null);
		setMatrix(null);
		setStoppedCols([false, false, false, false, false]);
		Api.getMatrix({ x: 3, y: 5, max: 7, maxDelay: 3 })
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
								displayMatrix[0].map((_, colIndex) => {
									let colClass = '';
									if (activeCols[colIndex] === 'bounceStart') {
										colClass = styles.bounceStart;
									} else if (activeCols[colIndex] === 'spin') {
										colClass = styles.spinning;
									} else if (activeCols[colIndex] === 'bounceEnd') {
										colClass = styles.bounceEnd;
									}
									return (
											<div key={colIndex} className={`${styles.row} ${colClass}`}>
												{displayMatrix.map((row, rowIndex) => (
														<img
																key={`${rowIndex}-${colIndex}`}
																src={slotImages[row[colIndex]]}
																alt={`icon_${row[colIndex]}`}
														/>
												))}
											</div>
									);
								})}
					</div>
					<div
							onClick={handleClick}
							className={`${styles.spin} ${loading ? styles.loading : ''}`}
					>
						{loading ? (
								<img src="/slots/assets/images/loading.png" alt="" />
						) : (
								<img src="/slots/assets/images/spin.png" alt="Spin" />
						)}
					</div>
				</div>
			</div>
	);
};

export default Main;
