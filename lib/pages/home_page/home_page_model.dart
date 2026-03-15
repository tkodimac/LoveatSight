import '/components/match_card_widget.dart';
import '/components/message_preview_widget.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/form_field_controller.dart';
import '/index.dart';
import 'home_page_widget.dart' show HomePageWidget;
import 'package:flutter/material.dart';

class HomePageModel extends FlutterFlowModel<HomePageWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for ChoiceChips widget.
  FormFieldController<List<String>>? choiceChipsValueController1;
  String? get choiceChipsValue1 =>
      choiceChipsValueController1?.value?.firstOrNull;
  set choiceChipsValue1(String? val) =>
      choiceChipsValueController1?.value = val != null ? [val] : [];
  // State field(s) for ChoiceChips widget.
  FormFieldController<List<String>>? choiceChipsValueController2;
  String? get choiceChipsValue2 =>
      choiceChipsValueController2?.value?.firstOrNull;
  set choiceChipsValue2(String? val) =>
      choiceChipsValueController2?.value = val != null ? [val] : [];
  // Model for MatchCard component.
  late MatchCardModel matchCardModel1;
  // Model for MatchCard component.
  late MatchCardModel matchCardModel2;
  // Model for MatchCard component.
  late MatchCardModel matchCardModel3;
  // Model for MatchCard component.
  late MatchCardModel matchCardModel4;
  // Model for MessagePreview component.
  late MessagePreviewModel messagePreviewModel1;
  // Model for MessagePreview component.
  late MessagePreviewModel messagePreviewModel2;
  // Model for MessagePreview component.
  late MessagePreviewModel messagePreviewModel3;

  @override
  void initState(BuildContext context) {
    matchCardModel1 = createModel(context, () => MatchCardModel());
    matchCardModel2 = createModel(context, () => MatchCardModel());
    matchCardModel3 = createModel(context, () => MatchCardModel());
    matchCardModel4 = createModel(context, () => MatchCardModel());
    messagePreviewModel1 = createModel(context, () => MessagePreviewModel());
    messagePreviewModel2 = createModel(context, () => MessagePreviewModel());
    messagePreviewModel3 = createModel(context, () => MessagePreviewModel());
  }

  @override
  void dispose() {
    matchCardModel1.dispose();
    matchCardModel2.dispose();
    matchCardModel3.dispose();
    matchCardModel4.dispose();
    messagePreviewModel1.dispose();
    messagePreviewModel2.dispose();
    messagePreviewModel3.dispose();
  }
}
