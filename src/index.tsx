import * as ImageManipulator from 'expo-image-manipulator';
import { ControlBar } from 'image-crop/src/ControlBar';
import { EditingWindow } from 'image-crop/src/EditingWindow';
import { OperationBar } from 'image-crop/src/OperationBar/OperationBar';
import { Processing } from 'image-crop/src/Processing';
import {
	editingModeState,
	imageDataState,
	processingState,
	readyState,
} from 'image-crop/src/Store';
import { UniversalModal } from 'image-crop/src/UniversalModal';
import { EditorContext } from 'image-crop/src/contexts/EditorContext';
import * as React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecoilRoot, useRecoilState } from 'recoil';

export type Mode = 'full' | 'crop-only';

export type TransformOperations = 'crop' | 'rotate';
export type AdjustmentOperations = 'blur';
export type EditingOperations = TransformOperations | AdjustmentOperations;

export interface ImageEditorProps {
	visible: boolean;
	onCloseEditor: () => void;
	imageUri: string | undefined;
	fixedCropAspectRatio?: number;
	minimumCropDimensions?: {
		width: number;
		height: number;
	};
	onEditingComplete: (result: any) => void;
	lockAspectRatio?: boolean;
	throttleBlur?: boolean;
	mode?: Mode;
	allowedTransformOperations?: TransformOperations[];
	allowedAdjustmentOperations?: AdjustmentOperations[];
	asView?: boolean;
}

function ImageEditorCore(props: ImageEditorProps) {
	//
	const {
		mode = 'full',
		throttleBlur = true,
		minimumCropDimensions = { width: 0, height: 0 },
		fixedCropAspectRatio: fixedAspectRatio = 1.6,
		lockAspectRatio = false,
		allowedTransformOperations,
		allowedAdjustmentOperations,
	} = props;

	const [, setImageData] = useRecoilState(imageDataState);
	const [, setReady] = useRecoilState(readyState);
	const [, setEditingMode] = useRecoilState(editingModeState);

	// Initialise the image data when it is set through the props
	React.useEffect(() => {
		const initialise = async () => {
			if (props.imageUri) {
				const enableEditor = () => {
					setReady(true);
				};
				const { width: pickerWidth, height: pickerHeight } = await ImageManipulator.manipulateAsync(
					props.imageUri,
					[],
				);
				setImageData({
					uri: props.imageUri,
					width: pickerWidth,
					height: pickerHeight,
				});
				enableEditor();
			}
		};
		initialise();
	}, [props.imageUri]);

	const onCloseEditor = () => {
		props.onCloseEditor();
	};

	React.useEffect(() => {
		// Reset the state of things and only render the UI
		// when this state has been initialised
		if (!props.visible) {
			setReady(false);
		}
		// Check if ther mode is set to crop only if this is the case then set the editingMode
		// to crop
		if (mode === 'crop-only') {
			setEditingMode('crop');
		}
	}, [props.visible]);

	return (
		<EditorContext.Provider
			value={{
				mode,
				minimumCropDimensions,
				lockAspectRatio,
				fixedAspectRatio,
				throttleBlur,
				allowedTransformOperations,
				allowedAdjustmentOperations,
				onCloseEditor,
				onEditingComplete: props.onEditingComplete,
			}}>
			<SafeAreaView>
				<StatusBar translucent barStyle={'light-content'} />
				{props.asView ? (
					<ImageEditorView {...props} />
				) : (
					<UniversalModal
						visible={props.visible}
						presentationStyle='fullScreen'
						statusBarTranslucent>
						<ImageEditorView {...props} />
					</UniversalModal>
				)}
			</SafeAreaView>
		</EditorContext.Provider>
	);
}

export function ImageEditorView(props: ImageEditorProps) {
	const { mode = 'full' } = props;

	const [ready, setReady] = useRecoilState(readyState);
	const [processing, setProcessing] = useRecoilState(processingState);

	return (
		<>
			{ready ? (
				<SafeAreaView style={styles.container}>
					<ControlBar />
					<EditingWindow />
					{mode === 'full' && <OperationBar />}
				</SafeAreaView>
			) : null}
			{processing ? <Processing /> : null}
		</>
	);
}

export function ImageEditor(props: ImageEditorProps) {
	return (
		<RecoilRoot>
			<SafeAreaView>
				<ImageEditorCore {...props} />
			</SafeAreaView>
		</RecoilRoot>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#222',
	},
});
