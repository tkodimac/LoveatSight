import '/flutter_flow/flutter_flow_util.dart';
import '/index.dart';
import 'package:flutter/material.dart';

class UserProfileModel extends FlutterFlowModel<UserProfileWidget> {
  // ── Editable display name ────────────────────────────────────────────────
  FocusNode? displayNameFocusNode;
  TextEditingController? displayNameController;
  String? Function(BuildContext, String?)? displayNameValidator;

  // ── Editable bio ─────────────────────────────────────────────────────────
  FocusNode? bioFocusNode;
  TextEditingController? bioController;
  String? Function(BuildContext, String?)? bioValidator;

  // ── Stats (would be fetched from DB / API in production) ─────────────────
  int knocksSentThisMonth = 12;
  int revealsUsedThisMonth = 4;
  int totalMatches = 7;

  // ── Subscription ─────────────────────────────────────────────────────────
  /// 'Spark' or 'Flame'
  String subscriptionTier = 'Flame';
  String subscriptionExpiry = 'Renews 12 Apr 2026';

  @override
  void initState(BuildContext context) {
    displayNameController ??= TextEditingController(text: 'Julian');
    displayNameFocusNode ??= FocusNode();
    bioController ??= TextEditingController(
      text:
          'Searching for a spark in the dark. Love deep conversations and late night city walks.',
    );
    bioFocusNode ??= FocusNode();
  }

  @override
  void dispose() {
    displayNameFocusNode?.dispose();
    displayNameController?.dispose();
    bioFocusNode?.dispose();
    bioController?.dispose();
  }

  // ── Auth actions ─────────────────────────────────────────────────────────

  /// Logs the user out and navigates to the splash / login screen.
  Future<void> logout(BuildContext context) async {
    // TODO: call your real auth service here, e.g.:
    //   await AuthService.instance.signOut();
    if (context.mounted) {
      context.goNamed(SplashScreenWidget.routeName);
    }
  }

  /// Permanently deletes the account (shows a confirmation dialog first).
  Future<void> deleteAccount(BuildContext context) async {
    final confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: const Color(0xFF1A0D2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
          side: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
        ),
        title: Text(
          'Delete Account?',
          style: TextStyle(
            color: const Color(0xFFEF4444),
            fontSize: 18.0,
            fontWeight: FontWeight.w800,
          ),
        ),
        content: const Text(
          'This will permanently erase your profile, matches, and all messages. This action cannot be undone.',
          style: TextStyle(
            color: Color(0xFFF5F5F7),
            fontSize: 14.0,
            height: 1.5,
          ),
        ),
        actionsPadding:
            const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text(
              'Cancel',
              style: TextStyle(
                color: Color(0xFF94A3B8),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
              ),
              padding: const EdgeInsets.symmetric(
                  horizontal: 20.0, vertical: 10.0),
            ),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text(
              'Yes, Delete',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13.0),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true && context.mounted) {
      // TODO: call your real account deletion API here.
      // For now, navigate to splash as a placeholder.
      context.goNamed(SplashScreenWidget.routeName);
    }
  }
}
