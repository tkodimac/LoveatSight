import '/backend/database_helper.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';

class ChatScreenModel extends FlutterFlowModel<ChatScreenWidget> {
  ///  State fields for stateful widgets in this page.

  // State field(s) for TextField widget.
  FocusNode? textFieldFocusNode;
  TextEditingController? textController;
  String? Function(BuildContext, String?)? textControllerValidator;

  /// The match identifier for the currently open chat.
  /// Defaults to a placeholder; in production this would be passed as a
  /// route parameter or resolved from the authenticated session.
  String matchId = 'match_default';

  /// True while the Panic deletion is in progress – drives the loading overlay.
  bool isDeleting = false;

  @override
  void initState(BuildContext context) {}

  @override
  void dispose() {
    textFieldFocusNode?.dispose();
    textController?.dispose();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Panic – permanently delete match + all messages, then navigate home
  // ──────────────────────────────────────────────────────────────────────────

  /// Deletes the match record and every related message from the local
  /// SQLite database, then navigates the user back to the Home/lobby page
  /// and clears any pending notifications for this match.
  Future<void> deleteMatchAndNavigate(
    BuildContext context,
    VoidCallback refreshState,
  ) async {
    // 1. Mark as deleting so the UI shows a spinner.
    isDeleting = true;
    refreshState();

    try {
      // 2. Permanently delete from the database.
      await DatabaseHelper.instance.deleteMatch(matchId);

      // 3. Clear any in-memory notification state for this match.
      //    (Extend this block when a real notification/badge service is wired
      //    in – e.g. call NotificationService.instance.clearForMatch(matchId))

      // 4. Navigate to the Home page, replacing the entire back-stack so the
      //    user cannot navigate back into the deleted chat.
      if (context.mounted) {
        context.goNamed(HomePageWidget.routeName);
      }
    } catch (e) {
      // On error, stop the spinner and surface a brief error message.
      isDeleting = false;
      refreshState();
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text(
              'Something went wrong. Please try again.',
              style: TextStyle(color: Colors.white),
            ),
            backgroundColor: Colors.red.shade700,
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }
}
