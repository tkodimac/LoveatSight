import '/components/profile_stat_item_model.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'user_profile_widget.dart' show UserProfileWidget;
import 'package:flutter/material.dart';

class UserProfileModel extends FlutterFlowModel<UserProfileWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for displayName TextField widget.
  FocusNode? displayNameFocusNode;
  TextEditingController? displayNameTextController;
  String? Function(BuildContext, String?)? displayNameTextControllerValidator;

  // State field(s) for bio TextField widget.
  FocusNode? bioFocusNode;
  TextEditingController? bioTextController;
  String? Function(BuildContext, String?)? bioTextControllerValidator;

  // Model for profileStatItem component (Knocks).
  late ProfileStatItemModel profileStatItemModel1;
  // Model for profileStatItem component (Reveals).
  late ProfileStatItemModel profileStatItemModel2;
  // Model for profileStatItem component (Matches).
  late ProfileStatItemModel profileStatItemModel3;

  @override
  void initState(BuildContext context) {
    displayNameTextController ??= TextEditingController(text: 'Julian');
    displayNameFocusNode ??= FocusNode();

    bioTextController ??= TextEditingController(
      text:
          'Searching for a spark in the dark. Love deep conversations and late night city walks.',
    );
    bioFocusNode ??= FocusNode();

    profileStatItemModel1 = createModel(context, () => ProfileStatItemModel());
    profileStatItemModel2 = createModel(context, () => ProfileStatItemModel());
    profileStatItemModel3 = createModel(context, () => ProfileStatItemModel());
  }

  @override
  void dispose() {
    displayNameFocusNode?.dispose();
    displayNameTextController?.dispose();

    bioFocusNode?.dispose();
    bioTextController?.dispose();

    profileStatItemModel1.maybeDispose();
    profileStatItemModel2.maybeDispose();
    profileStatItemModel3.maybeDispose();
  }
}
