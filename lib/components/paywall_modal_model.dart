import '/components/tier_card_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'paywall_modal_widget.dart' show PaywallModalWidget;
import 'package:flutter/material.dart';

class PaywallModalModel extends FlutterFlowModel<PaywallModalWidget> {
  ///  State fields for stateful widgets in this component.

  // Model for TierCard component.
  late TierCardModel tierCardModel1;
  // Model for TierCard component.
  late TierCardModel tierCardModel2;

  @override
  void initState(BuildContext context) {
    tierCardModel1 = createModel(context, () => TierCardModel());
    tierCardModel2 = createModel(context, () => TierCardModel());
  }

  @override
  void dispose() {
    tierCardModel1.dispose();
    tierCardModel2.dispose();
  }
}
