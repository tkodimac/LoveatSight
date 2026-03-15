import '/components/date_dropdown_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'age_gate_screen_widget.dart' show AgeGateScreenWidget;
import 'package:flutter/material.dart';

class AgeGateScreenModel extends FlutterFlowModel<AgeGateScreenWidget> {
  ///  State fields for stateful widgets in this page.

  // Model for DateDropdown component.
  late DateDropdownModel dateDropdownModel1;
  // Model for DateDropdown component.
  late DateDropdownModel dateDropdownModel2;
  // Model for DateDropdown component.
  late DateDropdownModel dateDropdownModel3;

  @override
  void initState(BuildContext context) {
    dateDropdownModel1 = createModel(context, () => DateDropdownModel());
    dateDropdownModel2 = createModel(context, () => DateDropdownModel());
    dateDropdownModel3 = createModel(context, () => DateDropdownModel());
  }

  @override
  void dispose() {
    dateDropdownModel1.dispose();
    dateDropdownModel2.dispose();
    dateDropdownModel3.dispose();
  }
}
