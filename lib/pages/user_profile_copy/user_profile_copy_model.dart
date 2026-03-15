import '/components/profile_stat_item_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'user_profile_copy_widget.dart' show UserProfileCopyWidget;
import 'package:flutter/material.dart';

class UserProfileCopyModel extends FlutterFlowModel<UserProfileCopyWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for ProfileStatItem component.
  late ProfileStatItemModel profileStatItemModel1;
  // Model for ProfileStatItem component.
  late ProfileStatItemModel profileStatItemModel2;
  // Model for ProfileStatItem component.
  late ProfileStatItemModel profileStatItemModel3;

  @override
  void initState(BuildContext context) {
    profileStatItemModel1 = createModel(context, () => ProfileStatItemModel());
    profileStatItemModel2 = createModel(context, () => ProfileStatItemModel());
    profileStatItemModel3 = createModel(context, () => ProfileStatItemModel());
  }

  @override
  void dispose() {
    profileStatItemModel1.dispose();
    profileStatItemModel2.dispose();
    profileStatItemModel3.dispose();
  }
}
