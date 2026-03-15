import '/components/camera_preview_widget.dart';
import '/components/step_indicator_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'face_verify_page_widget.dart' show FaceVerifyPageWidget;
import 'package:flutter/material.dart';

class FaceVerifyPageModel extends FlutterFlowModel<FaceVerifyPageWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for CameraPreview component.
  late CameraPreviewModel cameraPreviewModel;
  // Model for StepIndicator component.
  late StepIndicatorModel stepIndicatorModel1;
  // Model for StepIndicator component.
  late StepIndicatorModel stepIndicatorModel2;
  // Model for StepIndicator component.
  late StepIndicatorModel stepIndicatorModel3;

  @override
  void initState(BuildContext context) {
    cameraPreviewModel = createModel(context, () => CameraPreviewModel());
    stepIndicatorModel1 = createModel(context, () => StepIndicatorModel());
    stepIndicatorModel2 = createModel(context, () => StepIndicatorModel());
    stepIndicatorModel3 = createModel(context, () => StepIndicatorModel());
  }

  @override
  void dispose() {
    cameraPreviewModel.dispose();
    stepIndicatorModel1.dispose();
    stepIndicatorModel2.dispose();
    stepIndicatorModel3.dispose();
  }
}
