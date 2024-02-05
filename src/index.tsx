import * as ImageManipulator from "expo-image-manipulator"
import { ControlBar } from "image-crop/src/ControlBar"
import { EditingWindow } from "image-crop/src/EditingWindow"
import { OperationBar } from "image-crop/src/OperationBar/OperationBar"
import { Processing } from "image-crop/src/Processing"
import { editingModeState, imageDataState, processingState, readyState } from "image-crop/src/Store"
import UniversalModal from "image-crop/src/UniversalModal"
import { EditorContext } from "image-crop/src/contexts/EditorContext"
import * as React from "react"
import { SafeAreaView, StatusBar, StyleSheet } from "react-native"
import { RecoilRoot, useRecoilState } from "recoil"

export type Mode = "full" | "crop-only"

export type TransformOperations = "crop" | "rotate"
export type AdjustmentOperations = "blur"
export type EditingOperations = TransformOperations | AdjustmentOperations

export function ImageEditorView(props: ImageEditorProps) {
  const { mode = "full" } = props

  const [ready] = useRecoilState(readyState)
  const [processing] = useRecoilState(processingState)

  return (
    <>
      {ready ? (
        <SafeAreaView style={styles.container}>
          <EditingWindow />
          <ControlBar />
          {mode === "full" && <OperationBar />}
        </SafeAreaView>
      ) : null}
      {processing ? <Processing /> : null}
    </>
  )
}

export const ImageEditorViewMemo = React.memo(ImageEditorView)

export interface ImageEditorProps {
  visible: boolean
  onCloseEditor: () => void
  image?: ImageManipulator.ImageResult
  fixedCropAspectRatio?: number
  minimumCropDimensions?: {
    width: number
    height: number
  }
  onEditingComplete: (result: any) => void
  lockAspectRatio?: boolean
  throttleBlur?: boolean
  mode?: Mode
  allowedTransformOperations?: TransformOperations[]
  allowedAdjustmentOperations?: AdjustmentOperations[]
  asView?: boolean
}

function ImageEditorCore(props: ImageEditorProps) {
  const {
    mode = "full",
    throttleBlur = true,
    minimumCropDimensions = { width: 0, height: 0 },
    fixedCropAspectRatio: fixedAspectRatio = 1.6,
    lockAspectRatio = false,
    allowedTransformOperations,
    allowedAdjustmentOperations,
  } = props

  const [, setImageData] = useRecoilState(imageDataState)
  const [, setReady] = useRecoilState(readyState)
  const [, setEditingMode] = useRecoilState(editingModeState)

  // Initialise the image data when it is set through the props
  React.useEffect(() => {
    const initialise = async () => {
      if (props.image) {
        const enableEditor = () => {
          setReady(true)
        }
        setImageData({
          uri: props.image?.uri,
          width: props?.image?.width,
          height: props?.image?.height,
        })
        enableEditor()
      }
    }
    initialise()
  }, [props.image])

  const onCloseEditor = () => {
    props.onCloseEditor()
  }

  React.useEffect(() => {
    // Reset the state of things and only render the UI
    // when this state has been initialised
    if (!props.visible) {
      setReady(false)
    }
    // Check if ther mode is set to crop only if this is the case then set the editingMode
    // to crop
    if (mode === "crop-only") {
      setEditingMode("crop")
    }
  }, [props.visible])

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
      }}
    >
      <SafeAreaView style={{ height: "100%" }}>
        <StatusBar translucent barStyle={"light-content"} />
        {props.asView ? (
          <ImageEditorView {...props} />
        ) : (
          <UniversalModal
            animationType="slide"
            visible={props.visible}
            statusBarTranslucent
            transparent
          >
            <ImageEditorViewMemo {...props} />
          </UniversalModal>
        )}
      </SafeAreaView>
    </EditorContext.Provider>
  )
}

const ImageEditorCoreMemo = React.memo(ImageEditorCore)

export function ImageEditor(props: ImageEditorProps) {
  return (
    <RecoilRoot>
      <SafeAreaView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ImageEditorCoreMemo {...props} />
      </SafeAreaView>
    </RecoilRoot>
  )
}

export default React.memo(ImageEditor)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
})
