import { editingModeState, imageDataState, processingState } from 'image-crop/src/Store';
import { IconButton } from 'image-crop/src/components/IconButton';
import { EditorContext } from 'image-crop/src/contexts/EditorContext';
import { usePerformCrop } from 'image-crop/src/customHooks/usePerformCrop';
import _ from 'lodash';
import * as React from 'react';
import { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRecoilState } from 'recoil';

function ControlBar() {
	//
	const [editingMode, setEditingMode] = useRecoilState(editingModeState);
	const [imageData] = useRecoilState(imageDataState);
	const [processing, setProcessing] = useRecoilState(processingState);
	const { mode, onCloseEditor, onEditingComplete } = useContext(EditorContext);

	const performCrop = usePerformCrop();

	const shouldDisableDoneButton = editingMode !== 'operation-select' && mode !== 'crop-only';

	const onFinishEditing = async () => {
		if (mode === 'full') {
			setProcessing(false);
			onEditingComplete(imageData);
			onCloseEditor();
		} else if (mode === 'crop-only') {
			await performCrop();
		}
	};

	const onPressBack = () => {
		if (mode === 'full') {
			if (editingMode === 'operation-select') {
				onCloseEditor();
			} else {
				setEditingMode('operation-select');
			}
		} else if (mode === 'crop-only') {
			onCloseEditor();
		}
	};

	// Complete the editing process if we are in crop only mode after the editingMode gets set
	// back to operation select (happens internally in usePerformCrop) - can't do it in onFinishEditing
	// else it gets stale state - may need to refactor the hook as this feels hacky
	useEffect(() => {
		if (mode === 'crop-only' && imageData.uri && editingMode === 'operation-select') {
			onEditingComplete(imageData);
			onCloseEditor();
		}
	}, [imageData, editingMode]);

	return (
		<View style={styles.container}>
			<IconButton iconID='arrow-back' text='Back' onPress={onPressBack} />
			<IconButton
				iconID='done'
				text='Save'
				onPress={onFinishEditing}
				disabled={shouldDisableDoneButton}
			/>
		</View>
	);
}

export { ControlBar };

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 80,
		backgroundColor: '#000',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 4,
	},
});
