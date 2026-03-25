import '/components/profile_stat_item_widget.dart';
import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import 'dart:ui';
import '/index.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'user_profile_model.dart';
export 'user_profile_model.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Heartbeat pulse-glow animation (private to this file)
// ─────────────────────────────────────────────────────────────────────────────

class _HeartbeatPulse extends StatefulWidget {
  const _HeartbeatPulse({required this.child, required this.glowColor});

  final Widget child;
  final Color glowColor;

  @override
  State<_HeartbeatPulse> createState() => _HeartbeatPulseState();
}

class _HeartbeatPulseState extends State<_HeartbeatPulse>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _scale;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();
    _scale = Tween<double>(begin: 0.85, end: 1.18)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));
    _opacity = Tween<double>(begin: 0.55, end: 0.0)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Outer ring
        AnimatedBuilder(
          animation: _ctrl,
          builder: (_, __) => Opacity(
            opacity: _opacity.value,
            child: Transform.scale(
              scale: _scale.value,
              child: Container(
                width: 160.0,
                height: 160.0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.glowColor.withAlpha(55),
                ),
              ),
            ),
          ),
        ),
        // Inner ring (offset phase)
        AnimatedBuilder(
          animation: _ctrl,
          builder: (_, __) {
            final t = (_ctrl.value + 0.3) % 1.0;
            return Opacity(
              opacity: (0.55 * (1.0 - t)).clamp(0.0, 1.0),
              child: Transform.scale(
                scale: 0.85 + t * 0.33,
                child: Container(
                  width: 136.0,
                  height: 136.0,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: widget.glowColor.withAlpha(38),
                  ),
                ),
              ),
            );
          },
        ),
        widget.child,
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Page widget
// ─────────────────────────────────────────────────────────────────────────────

class UserProfileWidget extends StatefulWidget {
  const UserProfileWidget({super.key});

  static String routeName = 'UserProfile';
  static String routePath = '/userProfile';

  @override
  State<UserProfileWidget> createState() => _UserProfileWidgetState();
}

class _UserProfileWidgetState extends State<UserProfileWidget> {
  late UserProfileModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => UserProfileModel());
  }

  @override
  void dispose() {
    _model.dispose();
    super.dispose();
  }

  // ── Logout confirmation + navigation ──────────────────────────────────────

  Future<void> _onLogoutPressed() async {
    final confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
          side: BorderSide(
            color: FlutterFlowTheme.of(context).divider,
            width: 1.0,
          ),
        ),
        title: Text(
          'Sign Out?',
          style: FlutterFlowTheme.of(context).titleMedium.override(
                font: GoogleFonts.interTight(
                  fontWeight: FontWeight.w700,
                  fontStyle:
                      FlutterFlowTheme.of(context).titleMedium.fontStyle,
                ),
                color: FlutterFlowTheme.of(context).primaryText,
                letterSpacing: 0.0,
                fontWeight: FontWeight.w700,
                fontStyle:
                    FlutterFlowTheme.of(context).titleMedium.fontStyle,
              ),
        ),
        content: Text(
          'Are you sure you want to sign out?',
          style: FlutterFlowTheme.of(context).bodyMedium.override(
                font: GoogleFonts.inter(
                  fontWeight: FontWeight.w300,
                  fontStyle:
                      FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                ),
                color: FlutterFlowTheme.of(context).secondaryText,
                letterSpacing: 0.0,
                fontWeight: FontWeight.w300,
                fontStyle:
                    FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                lineHeight: 1.5,
              ),
        ),
        actionsPadding:
            const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(
              'Cancel',
              style: FlutterFlowTheme.of(context).labelMedium.override(
                    font: GoogleFonts.inter(
                      fontWeight: FontWeight.w600,
                      fontStyle: FlutterFlowTheme.of(context)
                          .labelMedium
                          .fontStyle,
                    ),
                    color: FlutterFlowTheme.of(context).secondaryText,
                    letterSpacing: 0.0,
                    fontWeight: FontWeight.w600,
                    fontStyle:
                        FlutterFlowTheme.of(context).labelMedium.fontStyle,
                  ),
            ),
          ),
          FFButtonWidget(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            text: 'Sign Out',
            options: FFButtonOptions(
              height: 36.0,
              padding: const EdgeInsetsDirectional.fromSTEB(
                  20.0, 0.0, 20.0, 0.0),
              iconPadding: const EdgeInsetsDirectional.fromSTEB(
                  0.0, 0.0, 0.0, 0.0),
              color: FlutterFlowTheme.of(context).error,
              textStyle: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w700,
                fontSize: 13.0,
              ),
              elevation: 0.0,
              borderRadius: BorderRadius.circular(22.0),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      // TODO: await AuthService.instance.signOut();
      context.goNamed(SplashScreenWidget.routeName);
    }
  }

  // ── Delete account confirmation + navigation ───────────────────────────────

  Future<void> _onDeleteAccountPressed() async {
    final confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: FlutterFlowTheme.of(context).secondaryBackground,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
          side: BorderSide(
            color: FlutterFlowTheme.of(context).error,
            width: 1.5,
          ),
        ),
        title: Row(
          children: [
            Icon(
              Icons.warning_amber_rounded,
              color: FlutterFlowTheme.of(context).error,
              size: 20.0,
            ),
            const SizedBox(width: 8.0),
            Text(
              'Delete Account?',
              style: FlutterFlowTheme.of(context).titleMedium.override(
                    font: GoogleFonts.interTight(
                      fontWeight: FontWeight.w700,
                      fontStyle: FlutterFlowTheme.of(context)
                          .titleMedium
                          .fontStyle,
                    ),
                    color: FlutterFlowTheme.of(context).error,
                    letterSpacing: 0.0,
                    fontWeight: FontWeight.w700,
                    fontStyle: FlutterFlowTheme.of(context)
                        .titleMedium
                        .fontStyle,
                  ),
            ),
          ],
        ),
        content: Text(
          'This will permanently erase your profile, matches, and all messages. This action cannot be undone.',
          style: FlutterFlowTheme.of(context).bodyMedium.override(
                font: GoogleFonts.inter(
                  fontWeight: FontWeight.w300,
                  fontStyle:
                      FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                ),
                color: FlutterFlowTheme.of(context).secondaryText,
                letterSpacing: 0.0,
                fontWeight: FontWeight.w300,
                fontStyle:
                    FlutterFlowTheme.of(context).bodyMedium.fontStyle,
                lineHeight: 1.5,
              ),
        ),
        actionsPadding:
            const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(
              'Cancel',
              style: FlutterFlowTheme.of(context).labelMedium.override(
                    font: GoogleFonts.inter(
                      fontWeight: FontWeight.w600,
                      fontStyle: FlutterFlowTheme.of(context)
                          .labelMedium
                          .fontStyle,
                    ),
                    color: FlutterFlowTheme.of(context).secondaryText,
                    letterSpacing: 0.0,
                    fontWeight: FontWeight.w600,
                    fontStyle: FlutterFlowTheme.of(context)
                        .labelMedium
                        .fontStyle,
                  ),
            ),
          ),
          FFButtonWidget(
            onPressed: () => Navigator.of(dialogContext).pop(true),
            text: 'Yes, Delete',
            options: FFButtonOptions(
              height: 36.0,
              padding: const EdgeInsetsDirectional.fromSTEB(
                  20.0, 0.0, 20.0, 0.0),
              iconPadding: const EdgeInsetsDirectional.fromSTEB(
                  0.0, 0.0, 0.0, 0.0),
              color: FlutterFlowTheme.of(context).error,
              textStyle: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w800,
                fontSize: 13.0,
              ),
              elevation: 0.0,
              borderRadius: BorderRadius.circular(22.0),
            ),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      // TODO: await AuthService.instance.deleteAccount();
      context.goNamed(SplashScreenWidget.routeName);
    }
  }

  // ── Reusable settings row ─────────────────────────────────────────────────

  Widget _settingsRow({
    required IconData iconData,
    required String title,
    required String subtitle,
    VoidCallback? onTap,
  }) {
    return Padding(
      padding: const EdgeInsetsDirectional.fromSTEB(0.0, 0.0, 0.0, 8.0),
      child: InkWell(
        splashColor: Colors.transparent,
        focusColor: Colors.transparent,
        hoverColor: Colors.transparent,
        highlightColor: Colors.transparent,
        onTap: onTap ?? () => print('$title pressed ...'),
        child: Container(
          decoration: BoxDecoration(
            color: FlutterFlowTheme.of(context).secondaryBackground,
            borderRadius: BorderRadius.circular(24.0),
            border: Border.all(
              color: FlutterFlowTheme.of(context).divider,
              width: 1.0,
            ),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  width: 40.0,
                  height: 40.0,
                  decoration: BoxDecoration(
                    color: const Color(0xFF2D1B4D),
                    borderRadius: BorderRadius.circular(16.0),
                  ),
                  alignment: const AlignmentDirectional(0.0, 0.0),
                  child: Icon(
                    iconData,
                    color: FlutterFlowTheme.of(context).primary,
                    size: 20.0,
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: FlutterFlowTheme.of(context)
                            .bodyMedium
                            .override(
                              font: GoogleFonts.inter(
                                fontWeight: FontWeight.w500,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .fontStyle,
                              ),
                              color:
                                  FlutterFlowTheme.of(context).primaryText,
                              fontSize: 15.0,
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.w500,
                              fontStyle: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .fontStyle,
                              lineHeight: 1.5,
                            ),
                      ),
                      Text(
                        subtitle,
                        style: FlutterFlowTheme.of(context)
                            .bodySmall
                            .override(
                              font: GoogleFonts.inter(
                                fontWeight: FontWeight.w300,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .bodySmall
                                    .fontStyle,
                              ),
                              color: FlutterFlowTheme.of(context)
                                  .secondaryText,
                              fontSize: 13.0,
                              letterSpacing: 0.0,
                              fontWeight: FontWeight.w300,
                              fontStyle: FlutterFlowTheme.of(context)
                                  .bodySmall
                                  .fontStyle,
                              lineHeight: 1.4,
                            ),
                      ),
                    ].divide(const SizedBox(height: 2.0)),
                  ),
                ),
                Icon(
                  Icons.chevron_right_rounded,
                  color: FlutterFlowTheme.of(context).hint,
                  size: 20.0,
                ),
              ].divide(const SizedBox(width: 16.0)),
            ),
          ),
        ),
      ),
    );
  }

  // ── Build ─────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: scaffoldKey,
      backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
      body: SafeArea(
        top: true,
        child: Stack(
          children: [
            // ── Ambient background glows ────────────────────────────────
            Opacity(
              opacity: 0.09,
              child: Align(
                alignment: const AlignmentDirectional(0.4, -0.55),
                child: ClipRect(
                  child: ImageFiltered(
                    imageFilter:
                        ImageFilter.blur(sigmaX: 110.0, sigmaY: 110.0),
                    child: Container(
                      width: 380.0,
                      height: 380.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).primary,
                        borderRadius: BorderRadius.circular(9999.0),
                      ),
                    ),
                  ),
                ),
              ),
            ),
            Opacity(
              opacity: 0.05,
              child: Align(
                alignment: const AlignmentDirectional(-0.7, 0.3),
                child: ClipRect(
                  child: ImageFiltered(
                    imageFilter:
                        ImageFilter.blur(sigmaX: 80.0, sigmaY: 80.0),
                    child: Container(
                      width: 220.0,
                      height: 220.0,
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).accent1,
                        borderRadius: BorderRadius.circular(9999.0),
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // ── Scrollable content ──────────────────────────────────────
            SingleChildScrollView(
              primary: false,
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // ── Top bar ─────────────────────────────────────────
                    Row(
                      mainAxisSize: MainAxisSize.max,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        // Back button
                        FlutterFlowIconButton(
                          borderRadius: 16.0,
                          buttonSize: 40.0,
                          fillColor: FlutterFlowTheme.of(context)
                              .secondaryBackground,
                          icon: Icon(
                            Icons.arrow_back_rounded,
                            color: FlutterFlowTheme.of(context).primaryText,
                            size: 20.0,
                          ),
                          onPressed: () => context.safePop(),
                        ),
                        // Page title
                        Text(
                          'My Profile',
                          style: FlutterFlowTheme.of(context)
                              .titleMedium
                              .override(
                                font: GoogleFonts.interTight(
                                  fontWeight: FontWeight.w600,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .titleMedium
                                      .fontStyle,
                                ),
                                color: FlutterFlowTheme.of(context)
                                    .primaryText,
                                fontSize: 18.0,
                                letterSpacing: 0.0,
                                fontWeight: FontWeight.w600,
                                fontStyle: FlutterFlowTheme.of(context)
                                    .titleMedium
                                    .fontStyle,
                                lineHeight: 1.4,
                              ),
                        ),
                        // Edit button
                        FlutterFlowIconButton(
                          borderRadius: 16.0,
                          buttonSize: 40.0,
                          fillColor: FlutterFlowTheme.of(context)
                              .secondaryBackground,
                          icon: Icon(
                            Icons.edit_note_rounded,
                            color: FlutterFlowTheme.of(context).primary,
                            size: 24.0,
                          ),
                          onPressed: () {
                            print('Edit button pressed ...');
                          },
                        ),
                      ],
                    ),

                    // ── Avatar section ──────────────────────────────────
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Align(
                          alignment: const AlignmentDirectional(0.0, 0.0),
                          child: _HeartbeatPulse(
                            glowColor: FlutterFlowTheme.of(context).primary,
                            child: Stack(
                              alignment:
                                  const AlignmentDirectional(0.0, 0.0),
                              children: [
                                // Outer glow ring
                                Container(
                                  width: 140.0,
                                  height: 140.0,
                                  decoration: BoxDecoration(
                                    borderRadius:
                                        BorderRadius.circular(9999.0),
                                    border: Border.all(
                                      color: const Color(0x336200EE),
                                      width: 1.0,
                                    ),
                                  ),
                                ),
                                // Avatar image ring
                                Container(
                                  width: 120.0,
                                  height: 120.0,
                                  decoration: BoxDecoration(
                                    borderRadius:
                                        BorderRadius.circular(9999.0),
                                    border: Border.all(
                                      color: FlutterFlowTheme.of(context)
                                          .primary,
                                      width: 2.0,
                                    ),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(4.0),
                                    child: ClipRRect(
                                      borderRadius:
                                          BorderRadius.circular(9999.0),
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color: FlutterFlowTheme.of(context)
                                              .secondaryBackground,
                                          borderRadius:
                                              BorderRadius.circular(9999.0),
                                        ),
                                        child: CachedNetworkImage(
                                          fadeInDuration:
                                              const Duration(milliseconds: 0),
                                          fadeOutDuration:
                                              const Duration(milliseconds: 0),
                                          imageUrl:
                                              'https://dimg.dreamflow.cloud/v1/image/abstract purple aesthetic profile male',
                                          width: 110.0,
                                          height: 110.0,
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                // Tier badge (bottom-right)
                                Align(
                                  alignment:
                                      const AlignmentDirectional(1.0, 1.0),
                                  child: Padding(
                                    padding:
                                        const EdgeInsetsDirectional.fromSTEB(
                                            0.0, 0.0, 10.0, 10.0),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .primary,
                                        boxShadow: const [
                                          BoxShadow(
                                            blurRadius: 4.0,
                                            color: Color(0x1A000000),
                                            offset: Offset(0.0, 2.0),
                                            spreadRadius: 0.0,
                                          )
                                        ],
                                        borderRadius:
                                            BorderRadius.circular(9999.0),
                                      ),
                                      child: Padding(
                                        padding: const EdgeInsetsDirectional
                                            .fromSTEB(12.0, 4.0, 12.0, 4.0),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          mainAxisAlignment:
                                              MainAxisAlignment.start,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.center,
                                          children: [
                                            Icon(
                                              Icons
                                                  .local_fire_department_rounded,
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primaryBackground,
                                              size: 14.0,
                                            ),
                                            Text(
                                              'FLAME',
                                              style: FlutterFlowTheme.of(
                                                      context)
                                                  .labelSmall
                                                  .override(
                                                    font: GoogleFonts.inter(
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                    ),
                                                    color:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .primaryBackground,
                                                    fontSize: 10.0,
                                                    letterSpacing: 0.5,
                                                    fontWeight: FontWeight.bold,
                                                    fontStyle:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .labelSmall
                                                            .fontStyle,
                                                  ),
                                            ),
                                          ].divide(const SizedBox(width: 4.0)),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Display name + location
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              valueOrDefault<String>(
                                _model.displayNameTextController?.text,
                                'Julian',
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .headlineSmall
                                  .override(
                                    font: GoogleFonts.interTight(
                                      fontWeight: FontWeight.w700,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .headlineSmall
                                          .fontStyle,
                                    ),
                                    color: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    fontSize: 24.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w700,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .headlineSmall
                                        .fontStyle,
                                    lineHeight: 1.3,
                                  ),
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.location_on_rounded,
                                  color:
                                      FlutterFlowTheme.of(context).secondaryText,
                                  size: 14.0,
                                ),
                                Text(
                                  'London, UK',
                                  style: FlutterFlowTheme.of(context)
                                      .labelMedium
                                      .override(
                                        font: GoogleFonts.inter(
                                          fontWeight: FontWeight.w400,
                                          fontStyle:
                                              FlutterFlowTheme.of(context)
                                                  .labelMedium
                                                  .fontStyle,
                                        ),
                                        color: FlutterFlowTheme.of(context)
                                            .secondaryText,
                                        fontSize: 13.0,
                                        letterSpacing: 0.0,
                                        fontWeight: FontWeight.w400,
                                        fontStyle:
                                            FlutterFlowTheme.of(context)
                                                .labelMedium
                                                .fontStyle,
                                        lineHeight: 1.4,
                                      ),
                                ),
                              ].divide(const SizedBox(width: 4.0)),
                            ),
                          ].divide(const SizedBox(height: 4.0)),
                        ),
                      ].divide(const SizedBox(height: 16.0)),
                    ),

                    // ── Editable display name ───────────────────────────
                    Container(
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(20.0),
                        border: Border.all(
                          color: FlutterFlowTheme.of(context).divider,
                          width: 1.0,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Display Name',
                              style: FlutterFlowTheme.of(context)
                                  .labelSmall
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.w600,
                                      fontStyle:
                                          FlutterFlowTheme.of(context)
                                              .labelSmall
                                              .fontStyle,
                                    ),
                                    color: FlutterFlowTheme.of(context)
                                        .secondaryText,
                                    fontSize: 11.0,
                                    letterSpacing: 0.5,
                                    fontWeight: FontWeight.w600,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .labelSmall
                                        .fontStyle,
                                  ),
                            ),
                            TextFormField(
                              controller: _model.displayNameTextController,
                              focusNode: _model.displayNameFocusNode,
                              autofocus: false,
                              textInputAction: TextInputAction.done,
                              obscureText: false,
                              decoration: InputDecoration(
                                isDense: true,
                                hintText: 'Your display name',
                                hintStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.w300,
                                        fontStyle:
                                            FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .fontStyle,
                                      ),
                                      color:
                                          FlutterFlowTheme.of(context).hint,
                                      fontSize: 15.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.w300,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
                                errorBorder: InputBorder.none,
                                focusedErrorBorder: InputBorder.none,
                                suffixIcon: Icon(
                                  Icons.edit_rounded,
                                  color: FlutterFlowTheme.of(context).primary,
                                  size: 16.0,
                                ),
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .titleSmall
                                  .override(
                                    font: GoogleFonts.interTight(
                                      fontWeight: FontWeight.w600,
                                      fontStyle:
                                          FlutterFlowTheme.of(context)
                                              .titleSmall
                                              .fontStyle,
                                    ),
                                    color: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    fontSize: 17.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w600,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .titleSmall
                                        .fontStyle,
                                    lineHeight: 1.4,
                                  ),
                              validator: _model
                                  .displayNameTextControllerValidator
                                  .asValidator(context),
                            ),
                          ].divide(const SizedBox(height: 6.0)),
                        ),
                      ),
                    ),

                    // ── Subscription badge ──────────────────────────────
                    Container(
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(20.0),
                        border: Border.all(
                          color: FlutterFlowTheme.of(context)
                              .primary
                              .withAlpha(80),
                          width: 1.0,
                        ),
                        boxShadow: [
                          BoxShadow(
                            blurRadius: 12.0,
                            color: FlutterFlowTheme.of(context)
                                .primary
                                .withAlpha(30),
                            offset: const Offset(0.0, 0.0),
                            spreadRadius: 0.0,
                          ),
                        ],
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Tier header row
                            Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Container(
                                  width: 44.0,
                                  height: 44.0,
                                  decoration: BoxDecoration(
                                    color: FlutterFlowTheme.of(context)
                                        .primary
                                        .withAlpha(30),
                                    borderRadius: BorderRadius.circular(14.0),
                                  ),
                                  alignment:
                                      const AlignmentDirectional(0.0, 0.0),
                                  child: Icon(
                                    Icons.local_fire_department_rounded,
                                    color:
                                        FlutterFlowTheme.of(context).primary,
                                    size: 24.0,
                                  ),
                                ),
                                Expanded(
                                  flex: 1,
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Text(
                                            'Flame',
                                            style: FlutterFlowTheme.of(context)
                                                .titleSmall
                                                .override(
                                                  font: GoogleFonts.interTight(
                                                    fontWeight: FontWeight.w700,
                                                    fontStyle:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .titleSmall
                                                            .fontStyle,
                                                  ),
                                                  color:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .primaryText,
                                                  fontSize: 16.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w700,
                                                  fontStyle:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .titleSmall
                                                          .fontStyle,
                                                  lineHeight: 1.4,
                                                ),
                                          ),
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primary,
                                              borderRadius:
                                                  BorderRadius.circular(9999.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      8.0, 2.0, 8.0, 2.0),
                                              child: Text(
                                                'ACTIVE',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w700,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .primaryBackground,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.5,
                                                      fontWeight:
                                                          FontWeight.w700,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                    ),
                                              ),
                                            ),
                                          ),
                                        ].divide(const SizedBox(width: 8.0)),
                                      ),
                                      Text(
                                        'Renews 12 Apr 2026',
                                        style: FlutterFlowTheme.of(context)
                                            .labelSmall
                                            .override(
                                              font: GoogleFonts.inter(
                                                fontWeight: FontWeight.w400,
                                                fontStyle:
                                                    FlutterFlowTheme.of(context)
                                                        .labelSmall
                                                        .fontStyle,
                                              ),
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryText,
                                              fontSize: 12.0,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w400,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .labelSmall
                                                      .fontStyle,
                                              lineHeight: 1.3,
                                            ),
                                      ),
                                    ].divide(const SizedBox(height: 2.0)),
                                  ),
                                ),
                              ].divide(const SizedBox(width: 14.0)),
                            ),
                            // Feature bullets
                            Column(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.check_circle_rounded,
                                      color: FlutterFlowTheme.of(context)
                                          .primary,
                                      size: 16.0,
                                    ),
                                    Text(
                                      'Unlimited Knocks & Reveals',
                                      style: FlutterFlowTheme.of(context)
                                          .bodySmall
                                          .override(
                                            font: GoogleFonts.inter(
                                              fontWeight: FontWeight.w300,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .bodySmall
                                                      .fontStyle,
                                            ),
                                            color: FlutterFlowTheme.of(context)
                                                .primaryText,
                                            fontSize: 13.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.w300,
                                            fontStyle:
                                                FlutterFlowTheme.of(context)
                                                    .bodySmall
                                                    .fontStyle,
                                            lineHeight: 1.4,
                                          ),
                                    ),
                                  ].divide(const SizedBox(width: 8.0)),
                                ),
                                Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.check_circle_rounded,
                                      color: FlutterFlowTheme.of(context)
                                          .primary,
                                      size: 16.0,
                                    ),
                                    Text(
                                      'See Who Knocked on You',
                                      style: FlutterFlowTheme.of(context)
                                          .bodySmall
                                          .override(
                                            font: GoogleFonts.inter(
                                              fontWeight: FontWeight.w300,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .bodySmall
                                                      .fontStyle,
                                            ),
                                            color: FlutterFlowTheme.of(context)
                                                .primaryText,
                                            fontSize: 13.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.w300,
                                            fontStyle:
                                                FlutterFlowTheme.of(context)
                                                    .bodySmall
                                                    .fontStyle,
                                            lineHeight: 1.4,
                                          ),
                                    ),
                                  ].divide(const SizedBox(width: 8.0)),
                                ),
                                Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.check_circle_rounded,
                                      color: FlutterFlowTheme.of(context)
                                          .primary,
                                      size: 16.0,
                                    ),
                                    Text(
                                      'Priority in Nearby Matches',
                                      style: FlutterFlowTheme.of(context)
                                          .bodySmall
                                          .override(
                                            font: GoogleFonts.inter(
                                              fontWeight: FontWeight.w300,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .bodySmall
                                                      .fontStyle,
                                            ),
                                            color: FlutterFlowTheme.of(context)
                                                .primaryText,
                                            fontSize: 13.0,
                                            letterSpacing: 0.0,
                                            fontWeight: FontWeight.w300,
                                            fontStyle:
                                                FlutterFlowTheme.of(context)
                                                    .bodySmall
                                                    .fontStyle,
                                            lineHeight: 1.4,
                                          ),
                                    ),
                                  ].divide(const SizedBox(width: 8.0)),
                                ),
                              ].divide(const SizedBox(height: 8.0)),
                            ),
                            // Manage Subscription button
                            FFButtonWidget(
                              onPressed: () async {
                                context.pushNamed(
                                  PaywallModalWidget.routeName,
                                  extra: <String, dynamic>{
                                    kTransitionInfoKey: const TransitionInfo(
                                      hasTransition: true,
                                      transitionType:
                                          PageTransitionType.bottomToTop,
                                    ),
                                  },
                                );
                              },
                              text: 'Manage Subscription',
                              options: FFButtonOptions(
                                width: double.infinity,
                                height: 44.0,
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                iconPadding:
                                    const EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 0.0),
                                color: const Color(0x226200EE),
                                textStyle: TextStyle(
                                  color:
                                      FlutterFlowTheme.of(context).primary,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14.0,
                                ),
                                elevation: 0.0,
                                borderRadius: BorderRadius.circular(22.0),
                              ),
                            ),
                          ].divide(const SizedBox(height: 16.0)),
                        ),
                      ),
                    ),

                    // ── Stats row ───────────────────────────────────────
                    Container(
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(20.0),
                        border: Border.all(
                          color: FlutterFlowTheme.of(context).divider,
                          width: 1.0,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 20.0, horizontal: 8.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Expanded(
                              flex: 1,
                              child: wrapWithModel(
                                model: _model.profileStatItemModel1,
                                updateCallback: () => safeSetState(() {}),
                                child: const ProfileStatItemWidget(
                                  value: 12,
                                  label: 'Knocks\nThis Month',
                                ),
                              ),
                            ),
                            Container(
                              width: 1.0,
                              height: 40.0,
                              color: FlutterFlowTheme.of(context).divider,
                            ),
                            Expanded(
                              flex: 1,
                              child: wrapWithModel(
                                model: _model.profileStatItemModel2,
                                updateCallback: () => safeSetState(() {}),
                                child: const ProfileStatItemWidget(
                                  value: 4,
                                  label: 'Reveals\nThis Month',
                                ),
                              ),
                            ),
                            Container(
                              width: 1.0,
                              height: 40.0,
                              color: FlutterFlowTheme.of(context).divider,
                            ),
                            Expanded(
                              flex: 1,
                              child: wrapWithModel(
                                model: _model.profileStatItemModel3,
                                updateCallback: () => safeSetState(() {}),
                                child: const ProfileStatItemWidget(
                                  value: 7,
                                  label: 'Total\nMatches',
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // ── Editable bio ────────────────────────────────────
                    Container(
                      decoration: BoxDecoration(
                        color: FlutterFlowTheme.of(context).secondaryBackground,
                        borderRadius: BorderRadius.circular(20.0),
                        border: Border.all(
                          color: FlutterFlowTheme.of(context).divider,
                          width: 1.0,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.auto_awesome_rounded,
                                      color:
                                          FlutterFlowTheme.of(context).primary,
                                      size: 14.0,
                                    ),
                                    Text(
                                      'BIO',
                                      style: FlutterFlowTheme.of(context)
                                          .labelSmall
                                          .override(
                                            font: GoogleFonts.inter(
                                              fontWeight: FontWeight.w600,
                                              fontStyle:
                                                  FlutterFlowTheme.of(context)
                                                      .labelSmall
                                                      .fontStyle,
                                            ),
                                            color: FlutterFlowTheme.of(context)
                                                .secondaryText,
                                            fontSize: 11.0,
                                            letterSpacing: 0.5,
                                            fontWeight: FontWeight.w600,
                                            fontStyle:
                                                FlutterFlowTheme.of(context)
                                                    .labelSmall
                                                    .fontStyle,
                                          ),
                                    ),
                                  ].divide(const SizedBox(width: 6.0)),
                                ),
                                Icon(
                                  Icons.edit_rounded,
                                  color: FlutterFlowTheme.of(context).primary,
                                  size: 16.0,
                                ),
                              ],
                            ),
                            TextFormField(
                              controller: _model.bioTextController,
                              focusNode: _model.bioFocusNode,
                              autofocus: false,
                              textInputAction: TextInputAction.newline,
                              obscureText: false,
                              maxLines: 4,
                              maxLength: 200,
                              decoration: InputDecoration(
                                isDense: true,
                                hintText: 'Tell the world who you are...',
                                hintStyle: FlutterFlowTheme.of(context)
                                    .bodyMedium
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.w300,
                                        fontStyle:
                                            FlutterFlowTheme.of(context)
                                                .bodyMedium
                                                .fontStyle,
                                      ),
                                      color:
                                          FlutterFlowTheme.of(context).hint,
                                      fontSize: 14.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.w300,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .bodyMedium
                                          .fontStyle,
                                    ),
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
                                errorBorder: InputBorder.none,
                                focusedErrorBorder: InputBorder.none,
                                counterStyle: FlutterFlowTheme.of(context)
                                    .labelSmall
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.w400,
                                        fontStyle:
                                            FlutterFlowTheme.of(context)
                                                .labelSmall
                                                .fontStyle,
                                      ),
                                      color:
                                          FlutterFlowTheme.of(context).hint,
                                      fontSize: 11.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.w400,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .labelSmall
                                          .fontStyle,
                                    ),
                              ),
                              style: FlutterFlowTheme.of(context)
                                  .bodyMedium
                                  .override(
                                    font: GoogleFonts.inter(
                                      fontWeight: FontWeight.w300,
                                      fontStyle:
                                          FlutterFlowTheme.of(context)
                                              .bodyMedium
                                              .fontStyle,
                                    ),
                                    color: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    fontSize: 14.0,
                                    letterSpacing: 0.0,
                                    fontWeight: FontWeight.w300,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .bodyMedium
                                        .fontStyle,
                                    lineHeight: 1.6,
                                  ),
                              validator: _model.bioTextControllerValidator
                                  .asValidator(context),
                            ),
                          ].divide(const SizedBox(height: 10.0)),
                        ),
                      ),
                    ),

                    // ── Account Settings section ────────────────────────
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 4.0),
                          child: Text(
                            'Account Settings',
                            style: FlutterFlowTheme.of(context)
                                .labelLarge
                                .override(
                                  font: GoogleFonts.inter(
                                    fontWeight: FontWeight.w600,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .labelLarge
                                        .fontStyle,
                                  ),
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  fontSize: 15.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .labelLarge
                                      .fontStyle,
                                  lineHeight: 1.3,
                                ),
                          ),
                        ),
                        _settingsRow(
                          iconData: Icons.notifications_none_rounded,
                          title: 'Notifications',
                          subtitle: 'Matches, messages, activity',
                        ),
                        _settingsRow(
                          iconData: Icons.shield_outlined,
                          title: 'Privacy & Safety',
                          subtitle: 'Blocked users, visibility',
                        ),
                        _settingsRow(
                          iconData: Icons.manage_accounts_outlined,
                          title: 'Account Details',
                          subtitle: 'Face verification, age, bio',
                        ),
                      ].divide(const SizedBox(height: 0.0)),
                    ),

                    // ── Support section ─────────────────────────────────
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              0.0, 0.0, 0.0, 4.0),
                          child: Text(
                            'Support',
                            style: FlutterFlowTheme.of(context)
                                .labelLarge
                                .override(
                                  font: GoogleFonts.inter(
                                    fontWeight: FontWeight.w600,
                                    fontStyle: FlutterFlowTheme.of(context)
                                        .labelLarge
                                        .fontStyle,
                                  ),
                                  color: FlutterFlowTheme.of(context)
                                      .secondaryText,
                                  fontSize: 15.0,
                                  letterSpacing: 0.0,
                                  fontWeight: FontWeight.w600,
                                  fontStyle: FlutterFlowTheme.of(context)
                                      .labelLarge
                                      .fontStyle,
                                  lineHeight: 1.3,
                                ),
                          ),
                        ),
                        _settingsRow(
                          iconData: Icons.help_outline_rounded,
                          title: 'Support Center',
                          subtitle: 'FAQs, contact us',
                        ),
                        _settingsRow(
                          iconData: Icons.description_outlined,
                          title: 'Terms of Service',
                          subtitle: 'Legal, privacy policy',
                        ),
                      ].divide(const SizedBox(height: 0.0)),
                    ),

                    // ── Logout + version + delete account ───────────────
                    Container(
                      child: Padding(
                        padding: const EdgeInsetsDirectional.fromSTEB(
                            0.0, 0.0, 0.0, 32.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            // Red logout button
                            FFButtonWidget(
                              onPressed: _onLogoutPressed,
                              text: 'Sign Out',
                              icon: const Icon(
                                Icons.logout_rounded,
                                size: 15.0,
                              ),
                              options: FFButtonOptions(
                                width: double.infinity,
                                height: 44.0,
                                padding: const EdgeInsetsDirectional.fromSTEB(
                                    0.0, 0.0, 0.0, 0.0),
                                iconPadding:
                                    const EdgeInsetsDirectional.fromSTEB(
                                        0.0, 0.0, 0.0, 0.0),
                                iconColor:
                                    FlutterFlowTheme.of(context).error,
                                color: Colors.transparent,
                                textStyle: TextStyle(
                                  color: FlutterFlowTheme.of(context).error,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14.0,
                                ),
                                elevation: 0.0,
                                borderRadius: BorderRadius.circular(22.0),
                              ),
                            ),
                            // Version string
                            Container(
                              alignment: const AlignmentDirectional(0.0, 0.0),
                              child: Text(
                                'App Version 1.0.4 (Beta)',
                                style: FlutterFlowTheme.of(context)
                                    .labelSmall
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.w600,
                                        fontStyle:
                                            FlutterFlowTheme.of(context)
                                                .labelSmall
                                                .fontStyle,
                                      ),
                                      color:
                                          FlutterFlowTheme.of(context).hint,
                                      fontSize: 11.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.w600,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .labelSmall
                                          .fontStyle,
                                      lineHeight: 1.2,
                                    ),
                              ),
                            ),
                            // Delete account link
                            InkWell(
                              splashColor: Colors.transparent,
                              focusColor: Colors.transparent,
                              hoverColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              onTap: _onDeleteAccountPressed,
                              child: Text(
                                'Delete Account',
                                style: FlutterFlowTheme.of(context)
                                    .labelSmall
                                    .override(
                                      font: GoogleFonts.inter(
                                        fontWeight: FontWeight.w600,
                                        fontStyle:
                                            FlutterFlowTheme.of(context)
                                                .labelSmall
                                                .fontStyle,
                                      ),
                                      color:
                                          FlutterFlowTheme.of(context).error,
                                      fontSize: 13.0,
                                      letterSpacing: 0.0,
                                      fontWeight: FontWeight.w600,
                                      fontStyle: FlutterFlowTheme.of(context)
                                          .labelSmall
                                          .fontStyle,
                                      decoration: TextDecoration.underline,
                                    ),
                              ),
                            ),
                          ].divide(const SizedBox(height: 16.0)),
                        ),
                      ),
                    ),
                  ].divide(const SizedBox(height: 24.0)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
