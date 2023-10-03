import { Blur } from 'image-crop/src/OperationBar/Blur';
import { Crop } from 'image-crop/src/OperationBar/Crop';
import { OperationSelection } from 'image-crop/src/OperationBar/OperationSelection';
import { Rotate } from 'image-crop/src/OperationBar/Rotate';
import { editingModeState } from 'image-crop/src/Store';
import * as React from 'react';
import { useState } from 'react';
import { Animated, LayoutRectangle, StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';

export function OperationBar() {
	//
	const [editingMode] = useRecoilState(editingModeState);

	const getOperationWindow = () => {
		switch (editingMode) {
			case 'crop':
				return <Crop />;
			case 'rotate':
				return <Rotate />;
			case 'blur':
				return <Blur />;
			default:
				return null;
		}
	};

	return (
		<View style={styles.container}>
			<OperationSelection />
			{editingMode !== 'operation-select' && (
				<View style={[styles.container, { position: 'absolute' }]}>{getOperationWindow()}</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		height: 160,
		width: '100%',
		backgroundColor: '#333',
		justifyContent: 'center',
	},
});
