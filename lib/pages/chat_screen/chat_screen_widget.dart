import '/flutter_flow/flutter_flow_icon_button.dart';
import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'dart:ui';
import '/index.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'chat_screen_model.dart';
export 'chat_screen_model.dart';

class ChatScreenWidget extends StatefulWidget {
  const ChatScreenWidget({super.key});

  static String routeName = 'ChatScreen';
  static String routePath = '/chatScreen';

  @override
  State<ChatScreenWidget> createState() => _ChatScreenWidgetState();
}

class _ChatScreenWidgetState extends State<ChatScreenWidget> {
  late ChatScreenModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => ChatScreenModel());

    _model.textController ??= TextEditingController();
    _model.textFieldFocusNode ??= FocusNode();
  }

  @override
  void dispose() {
    _model.dispose();
    super.dispose();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Panic button handler
  // ──────────────────────────────────────────────────────────────────────────

  Future<void> _onPanicPressed() async {
    // Step 1 – Show confirmation dialog.
    final confirmed = await showDialog<bool>(
      context: context,
      barrierDismissible: false,
      builder: (dialogContext) => AlertDialog(
        backgroundColor: const Color(0xFF1A0D2E),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
          side: BorderSide(
            color: FlutterFlowTheme.of(context).error,
            width: 1.5,
          ),
        ),
        title: Row(
          children: [
            Icon(
              Icons.gpp_maybe_rounded,
              color: FlutterFlowTheme.of(context).error,
              size: 22.0,
            ),
            const SizedBox(width: 8.0),
            Text(
              'PANIC',
              style: GoogleFonts.inter(
                color: FlutterFlowTheme.of(context).error,
                fontSize: 18.0,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
        content: Text(
          'Are you sure? This will instantly delete the entire chat and all messages. No undo.',
          style: GoogleFonts.inter(
            color: FlutterFlowTheme.of(context).primaryText,
            fontSize: 14.0,
            fontWeight: FontWeight.w400,
            height: 1.5,
          ),
        ),
        actionsPadding:
            const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        actions: [
          // Cancel – dismiss without doing anything.
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: Text(
              'Cancel',
              style: GoogleFonts.inter(
                color: FlutterFlowTheme.of(context).secondaryText,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          // Confirm – proceed with deletion.
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: FlutterFlowTheme.of(context).error,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8.0),
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 10.0,
              ),
            ),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: Text(
              'Yes, Panic',
              style: GoogleFonts.inter(
                fontWeight: FontWeight.w800,
                fontSize: 13.0,
              ),
            ),
          ),
        ],
      ),
    );

    // Step 2 – If the user confirmed, trigger deletion (spinner is shown
    //          inside deleteMatchAndNavigate via isDeleting flag).
    if (confirmed == true && mounted) {
      await _model.deleteMatchAndNavigate(context, () => setState(() {}));
    }
  }

  @override
  Widget build(BuildContext context) {
    // ── Loading overlay ──────────────────────────────────────────────────────
    // When deletion is in progress, render a full-screen dimmed spinner on top
    // of the regular chat UI so the user gets clear visual feedback.
    return Stack(
      children: [
        // ── Main chat scaffold ───────────────────────────────────────────────
        Scaffold(
          key: scaffoldKey,
          backgroundColor: FlutterFlowTheme.of(context).primaryBackground,
          body: SafeArea(
            top: true,
            child: Stack(
              children: [
                // Background gradient blobs
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFF0F0716), Color(0xFF09040E)],
                      stops: [0.5, 0.7],
                      begin: AlignmentDirectional(0.0, 1.0),
                      end: AlignmentDirectional(0, -1.0),
                    ),
                  ),
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Opacity(
                      opacity: 0.15,
                      child: ClipRect(
                        child: ImageFiltered(
                          imageFilter:
                              ImageFilter.blur(sigmaX: 40.0, sigmaY: 40.0),
                          child: Container(
                            width: 120.0,
                            height: 120.0,
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context).primary,
                              borderRadius: BorderRadius.circular(9999.0),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Opacity(
                      opacity: 0.15,
                      child: ClipRect(
                        child: ImageFiltered(
                          imageFilter:
                              ImageFilter.blur(sigmaX: 60.0, sigmaY: 60.0),
                          child: Container(
                            width: 180.0,
                            height: 180.0,
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context).accent1,
                              borderRadius: BorderRadius.circular(9999.0),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Opacity(
                      opacity: 0.15,
                      child: ClipRect(
                        child: ImageFiltered(
                          imageFilter:
                              ImageFilter.blur(sigmaX: 50.0, sigmaY: 50.0),
                          child: Container(
                            width: 100.0,
                            height: 100.0,
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context).secondary,
                              borderRadius: BorderRadius.circular(9999.0),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),

                // ── Main content column ────────────────────────────────────
                Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // ── Top bar ──────────────────────────────────────────────
                    ClipRRect(
                      child: BackdropFilter(
                        filter:
                            ImageFilter.blur(sigmaX: 12.0, sigmaY: 12.0),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Container(
                            decoration: BoxDecoration(
                              border: Border.all(
                                color:
                                    FlutterFlowTheme.of(context).divider,
                                width: 1.0,
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.max,
                              mainAxisAlignment:
                                  MainAxisAlignment.start,
                              crossAxisAlignment:
                                  CrossAxisAlignment.center,
                              children: [
                                // Back button
                                FlutterFlowIconButton(
                                  buttonSize: 40.0,
                                  icon: Icon(
                                    Icons.arrow_back_rounded,
                                    color: FlutterFlowTheme.of(context)
                                        .primaryText,
                                    size: 24.0,
                                  ),
                                  onPressed: () {
                                    context.safePop();
                                  },
                                ),

                                // Avatar + Name (tappable → UserProfile)
                                GestureDetector(
                                  onTap: () {
                                    context.pushNamed(
                                        UserProfileWidget.routeName);
                                  },
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                  // Avatar
                                  Align(
                                    alignment:
                                        AlignmentDirectional(0.0, 0.0),
                                    child: Stack(
                                      alignment: AlignmentDirectional(
                                          0.0, 0.0),
                                      children: [
                                        Container(
                                          width: 48.0,
                                          height: 48.0,
                                          decoration: BoxDecoration(
                                            color:
                                                const Color(0xFF1A1221),
                                            borderRadius:
                                                BorderRadius.circular(
                                                    9999.0),
                                            border: Border.all(
                                              color:
                                                  const Color(0x44A855F7),
                                              width: 1.0,
                                            ),
                                          ),
                                          child: const Icon(
                                            Icons.person_rounded,
                                            color: Color(0xFF2D1B4E),
                                            size: 32.0,
                                          ),
                                        ),
                                        Opacity(
                                          opacity: 0.3,
                                          child: Container(
                                            width: 52.0,
                                            height: 52.0,
                                            decoration: BoxDecoration(
                                              borderRadius:
                                                  BorderRadius.circular(
                                                      9999.0),
                                              border: Border.all(
                                                color:
                                                    FlutterFlowTheme.of(
                                                            context)
                                                        .primary,
                                                width: 2.0,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 10.0),
                                  // Name + status
                                  Column(
                                    mainAxisSize: MainAxisSize.min,
                                    mainAxisAlignment:
                                        MainAxisAlignment.start,
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
                                            'Mysterious Soul',
                                            style: FlutterFlowTheme.of(
                                                    context)
                                                .titleMedium
                                                .override(
                                                  font: GoogleFonts.inter(
                                                    fontWeight:
                                                        FontWeight.w600,
                                                    fontStyle:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .titleMedium
                                                            .fontStyle,
                                                  ),
                                                  color:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .primaryText,
                                                  fontSize: 17.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight:
                                                      FontWeight.w600,
                                                  fontStyle:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .titleMedium
                                                          .fontStyle,
                                                  lineHeight: 1.4,
                                                ),
                                          ),
                                          Icon(
                                            Icons.verified_rounded,
                                            color:
                                                FlutterFlowTheme.of(
                                                        context)
                                                    .primary,
                                            size: 14.0,
                                          ),
                                        ].divide(
                                            const SizedBox(width: 4.0)),
                                      ),
                                      Text(
                                        'Heartbeat matching...',
                                        style: FlutterFlowTheme.of(
                                                context)
                                            .labelSmall
                                            .override(
                                              font: GoogleFonts.inter(
                                                fontWeight:
                                                    FontWeight.w600,
                                                fontStyle:
                                                    FlutterFlowTheme.of(
                                                            context)
                                                        .labelSmall
                                                        .fontStyle,
                                              ),
                                              color:
                                                  FlutterFlowTheme.of(
                                                          context)
                                                      .success,
                                              fontSize: 11.0,
                                              letterSpacing: 0.0,
                                              fontWeight: FontWeight.w600,
                                              fontStyle:
                                                  FlutterFlowTheme.of(
                                                          context)
                                                      .labelSmall
                                                      .fontStyle,
                                              lineHeight: 1.2,
                                            ),
                                      ),
                                    ].divide(const SizedBox(height: 2.0)),
                                  ),
                                    ],
                                  ),
                                ),

                                // ── Action buttons (heart + PANIC) ──────────
                                Padding(
                                  padding:
                                      const EdgeInsetsDirectional.fromSTEB(
                                          0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment:
                                        MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      // Heart / reveal button
                                      FlutterFlowIconButton(
                                        buttonSize: 40.0,
                                        icon: Icon(
                                          Icons.favorite_border_rounded,
                                          color: FlutterFlowTheme.of(
                                                  context)
                                              .primary,
                                          size: 24.0,
                                        ),
                                        onPressed: () async {
                                          context.pushNamed(
                                            PaywallModalWidget.routeName,
                                            extra: <String, dynamic>{
                                              '__transition_info__':
                                                  const TransitionInfo(
                                                hasTransition: true,
                                                transitionType:
                                                    PageTransitionType
                                                        .bottomToTop,
                                              ),
                                            },
                                          );
                                        },
                                      ),

                                      // ── RED PANIC BUTTON ─────────────────
                                      GestureDetector(
                                        onTap: _onPanicPressed,
                                        child: Container(
                                          decoration: BoxDecoration(
                                            color:
                                                const Color(0xFF3D0C0C),
                                            borderRadius:
                                                BorderRadius.circular(
                                                    9999.0),
                                            border: Border.all(
                                              color:
                                                  FlutterFlowTheme.of(
                                                          context)
                                                      .error,
                                              width: 1.0,
                                            ),
                                          ),
                                          child: Padding(
                                            padding:
                                                const EdgeInsetsDirectional
                                                    .fromSTEB(
                                                    16.0, 4.0, 16.0, 4.0),
                                            child: Row(
                                              mainAxisSize:
                                                  MainAxisSize.max,
                                              mainAxisAlignment:
                                                  MainAxisAlignment.start,
                                              crossAxisAlignment:
                                                  CrossAxisAlignment
                                                      .center,
                                              children: [
                                                Icon(
                                                  Icons.gpp_maybe_rounded,
                                                  color:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .error,
                                                  size: 14.0,
                                                ),
                                                Text(
                                                  'PANIC',
                                                  style:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .labelSmall
                                                          .override(
                                                            font: GoogleFonts
                                                                .inter(
                                                              fontWeight:
                                                                  FontWeight
                                                                      .w800,
                                                              fontStyle:
                                                                  FlutterFlowTheme.of(
                                                                          context)
                                                                      .labelSmall
                                                                      .fontStyle,
                                                            ),
                                                            color: FlutterFlowTheme
                                                                    .of(context)
                                                                .error,
                                                            fontSize: 11.0,
                                                            letterSpacing:
                                                                0.0,
                                                            fontWeight:
                                                                FontWeight
                                                                    .w800,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .labelSmall
                                                                    .fontStyle,
                                                            lineHeight:
                                                                1.2,
                                                          ),
                                                ),
                                              ].divide(const SizedBox(
                                                  width: 4.0)),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ].divide(const SizedBox(width: 8.0)),
                                  ),
                                ),
                              ].divide(const SizedBox(width: 16.0)),
                            ),
                          ),
                        ),
                      ),
                    ),

                    // ── Messages list ────────────────────────────────────────
                    Expanded(
                      flex: 1,
                      child: Container(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: SingleChildScrollView(
                            primary: false,
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                // Date chip
                                Container(
                                  alignment: AlignmentDirectional(0.0, 0.0),
                                  child: Padding(
                                    padding:
                                        const EdgeInsetsDirectional.fromSTEB(
                                            0.0, 0.0, 0.0, 24.0),
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF1C1226),
                                        borderRadius:
                                            BorderRadius.circular(9999.0),
                                        border: Border.all(
                                          color: FlutterFlowTheme.of(context)
                                              .divider,
                                          width: 1.0,
                                        ),
                                      ),
                                      child: Padding(
                                        padding: const EdgeInsetsDirectional
                                            .fromSTEB(24.0, 8.0, 24.0, 8.0),
                                        child: Text(
                                          'Conversation Started Oct 24',
                                          style: FlutterFlowTheme.of(context)
                                              .labelSmall
                                              .override(
                                                font: GoogleFonts.inter(
                                                  fontWeight: FontWeight.w600,
                                                  fontStyle:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .labelSmall
                                                          .fontStyle,
                                                ),
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .secondaryText,
                                                fontSize: 11.0,
                                                letterSpacing: 0.0,
                                                fontWeight: FontWeight.w600,
                                                fontStyle:
                                                    FlutterFlowTheme.of(context)
                                                        .labelSmall
                                                        .fontStyle,
                                                lineHeight: 1.2,
                                              ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),

                                // Message – incoming
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryBackground,
                                              borderRadius:
                                                  BorderRadius.circular(20.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      24.0, 16.0, 24.0, 16.0),
                                              child: Text(
                                                'Hey there! I saw your profile. Your bio about late night jazz is intriguing.',
                                                style:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .override(
                                                          font:
                                                              GoogleFonts.inter(
                                                            fontWeight:
                                                                FontWeight.w300,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .fontStyle,
                                                          ),
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryText,
                                                          fontSize: 15.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w300,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .fontStyle,
                                                          lineHeight: 1.4,
                                                        ),
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.start,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Text(
                                                '10:00 PM',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                      lineHeight: 1.2,
                                                    ),
                                              ),
                                              const SizedBox(
                                                  width: 0.0, height: 0.0),
                                            ].divide(
                                                const SizedBox(width: 4.0)),
                                          ),
                                        ].divide(const SizedBox(height: 4.0)),
                                      ),
                                    ],
                                  ),
                                ),

                                // Message – outgoing
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primary,
                                              boxShadow: const [
                                                BoxShadow(
                                                  blurRadius: 2.0,
                                                  color: Color(0x1A000000),
                                                  offset: Offset(0.0, 1.0),
                                                  spreadRadius: 0.0,
                                                )
                                              ],
                                              borderRadius:
                                                  BorderRadius.circular(20.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      24.0, 16.0, 24.0, 16.0),
                                              child: Text(
                                                'Jazz is my escape. There\'s something magical about the improvisation.',
                                                style:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .override(
                                                          font:
                                                              GoogleFonts.inter(
                                                            fontWeight:
                                                                FontWeight.w300,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .fontStyle,
                                                          ),
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryBackground,
                                                          fontSize: 15.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w300,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .fontStyle,
                                                          lineHeight: 1.4,
                                                        ),
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.end,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Text(
                                                '10:02 PM',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                      lineHeight: 1.2,
                                                    ),
                                              ),
                                              Icon(
                                                Icons.done_all_rounded,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .accent1,
                                                size: 12.0,
                                              ),
                                            ].divide(
                                                const SizedBox(width: 4.0)),
                                          ),
                                        ].divide(const SizedBox(height: 4.0)),
                                      ),
                                    ],
                                  ),
                                ),

                                // Message – incoming
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryBackground,
                                              borderRadius:
                                                  BorderRadius.circular(20.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      24.0, 16.0, 24.0, 16.0),
                                              child: Text(
                                                'I love that! Do you play any instruments yourself?',
                                                style:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .override(
                                                          font:
                                                              GoogleFonts.inter(
                                                            fontWeight:
                                                                FontWeight.w300,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .fontStyle,
                                                          ),
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryText,
                                                          fontSize: 15.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w300,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .fontStyle,
                                                          lineHeight: 1.4,
                                                        ),
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.start,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Text(
                                                '10:03 PM',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                      lineHeight: 1.2,
                                                    ),
                                              ),
                                              const SizedBox(
                                                  width: 0.0, height: 0.0),
                                            ].divide(
                                                const SizedBox(width: 4.0)),
                                          ),
                                        ].divide(const SizedBox(height: 4.0)),
                                      ),
                                    ],
                                  ),
                                ),

                                // Message – outgoing
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primary,
                                              boxShadow: const [
                                                BoxShadow(
                                                  blurRadius: 2.0,
                                                  color: Color(0x1A000000),
                                                  offset: Offset(0.0, 1.0),
                                                  spreadRadius: 0.0,
                                                )
                                              ],
                                              borderRadius:
                                                  BorderRadius.circular(20.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      24.0, 16.0, 24.0, 16.0),
                                              child: Text(
                                                'Thanks! It\'s the best way to unwind. Do you have a favorite spot in London?',
                                                style:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .override(
                                                          font:
                                                              GoogleFonts.inter(
                                                            fontWeight:
                                                                FontWeight.w300,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .fontStyle,
                                                          ),
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryBackground,
                                                          fontSize: 15.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w300,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .fontStyle,
                                                          lineHeight: 1.4,
                                                        ),
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.end,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Text(
                                                '10:05 PM',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                      lineHeight: 1.2,
                                                    ),
                                              ),
                                              Icon(
                                                Icons.done_all_rounded,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .accent1,
                                                size: 12.0,
                                              ),
                                            ].divide(
                                                const SizedBox(width: 4.0)),
                                          ),
                                        ].divide(const SizedBox(height: 4.0)),
                                      ),
                                    ],
                                  ),
                                ),

                                // Message – incoming
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryBackground,
                                              borderRadius:
                                                  BorderRadius.circular(20.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      24.0, 16.0, 24.0, 16.0),
                                              child: Text(
                                                'There\'s a hidden basement club in Soho. I\'d love to show you sometime!',
                                                style:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .override(
                                                          font:
                                                              GoogleFonts.inter(
                                                            fontWeight:
                                                                FontWeight.w300,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .fontStyle,
                                                          ),
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryText,
                                                          fontSize: 15.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w300,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .fontStyle,
                                                          lineHeight: 1.4,
                                                        ),
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.start,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Text(
                                                '10:06 PM',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                      lineHeight: 1.2,
                                                    ),
                                              ),
                                              const SizedBox(
                                                  width: 0.0, height: 0.0),
                                            ].divide(
                                                const SizedBox(width: 4.0)),
                                          ),
                                        ].divide(const SizedBox(height: 4.0)),
                                      ),
                                    ],
                                  ),
                                ),

                                // Message – incoming (subscribe prompt)
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .secondaryBackground,
                                              borderRadius:
                                                  BorderRadius.circular(20.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      24.0, 16.0, 24.0, 16.0),
                                              child: Text(
                                                'Maybe we can move this to ***** (subscribe) or call me at ***** (subscribe)?',
                                                style:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .override(
                                                          font:
                                                              GoogleFonts.inter(
                                                            fontWeight:
                                                                FontWeight.w300,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .fontStyle,
                                                          ),
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryText,
                                                          fontSize: 15.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w300,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .fontStyle,
                                                          lineHeight: 1.4,
                                                        ),
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.start,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Text(
                                                '10:07 PM',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                      lineHeight: 1.2,
                                                    ),
                                              ),
                                              const SizedBox(
                                                  width: 0.0, height: 0.0),
                                            ].divide(
                                                const SizedBox(width: 4.0)),
                                          ),
                                        ].divide(const SizedBox(height: 4.0)),
                                      ),
                                    ],
                                  ),
                                ),

                                // Message – outgoing (safety reply)
                                Padding(
                                  padding: const EdgeInsetsDirectional.fromSTEB(
                                      0.0, 0.0, 0.0, 16.0),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.max,
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.center,
                                    children: [
                                      Column(
                                        mainAxisSize: MainAxisSize.min,
                                        mainAxisAlignment:
                                            MainAxisAlignment.start,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.end,
                                        children: [
                                          Container(
                                            decoration: BoxDecoration(
                                              color:
                                                  FlutterFlowTheme.of(context)
                                                      .primary,
                                              boxShadow: const [
                                                BoxShadow(
                                                  blurRadius: 2.0,
                                                  color: Color(0x1A000000),
                                                  offset: Offset(0.0, 1.0),
                                                  spreadRadius: 0.0,
                                                )
                                              ],
                                              borderRadius:
                                                  BorderRadius.circular(20.0),
                                            ),
                                            child: Padding(
                                              padding:
                                                  const EdgeInsetsDirectional
                                                      .fromSTEB(
                                                      24.0, 16.0, 24.0, 16.0),
                                              child: Text(
                                                'Safety first! Let\'s keep talking here for a bit. 💜',
                                                style:
                                                    FlutterFlowTheme.of(context)
                                                        .bodyMedium
                                                        .override(
                                                          font:
                                                              GoogleFonts.inter(
                                                            fontWeight:
                                                                FontWeight.w300,
                                                            fontStyle:
                                                                FlutterFlowTheme.of(
                                                                        context)
                                                                    .bodyMedium
                                                                    .fontStyle,
                                                          ),
                                                          color: FlutterFlowTheme
                                                                  .of(context)
                                                              .primaryBackground,
                                                          fontSize: 15.0,
                                                          letterSpacing: 0.0,
                                                          fontWeight:
                                                              FontWeight.w300,
                                                          fontStyle:
                                                              FlutterFlowTheme.of(
                                                                      context)
                                                                  .bodyMedium
                                                                  .fontStyle,
                                                          lineHeight: 1.4,
                                                        ),
                                              ),
                                            ),
                                          ),
                                          Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.end,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Text(
                                                '10:08 PM',
                                                style: FlutterFlowTheme.of(
                                                        context)
                                                    .labelSmall
                                                    .override(
                                                      font: GoogleFonts.inter(
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        fontStyle:
                                                            FlutterFlowTheme.of(
                                                                    context)
                                                                .labelSmall
                                                                .fontStyle,
                                                      ),
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                      fontSize: 10.0,
                                                      letterSpacing: 0.0,
                                                      fontWeight:
                                                          FontWeight.w600,
                                                      fontStyle:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .labelSmall
                                                              .fontStyle,
                                                      lineHeight: 1.2,
                                                    ),
                                              ),
                                              Icon(
                                                Icons.done_all_rounded,
                                                color:
                                                    FlutterFlowTheme.of(context)
                                                        .accent1,
                                                size: 12.0,
                                              ),
                                            ].divide(
                                                const SizedBox(width: 4.0)),
                                          ),
                                        ].divide(const SizedBox(height: 4.0)),
                                      ),
                                    ],
                                  ),
                                ),
                              ].divide(const SizedBox(height: 16.0)),
                            ),
                          ),
                        ),
                      ),
                    ),

                    // ── Message input bar ────────────────────────────────────
                    ClipRRect(
                      child: BackdropFilter(
                        filter:
                            ImageFilter.blur(sigmaX: 20.0, sigmaY: 20.0),
                        child: Padding(
                          padding: const EdgeInsetsDirectional.fromSTEB(
                              24.0, 16.0, 24.0, 16.0),
                          child: Container(
                            decoration: BoxDecoration(
                              color: FlutterFlowTheme.of(context)
                                  .secondaryBackground,
                              border: Border.all(
                                color: FlutterFlowTheme.of(context).divider,
                                width: 1.0,
                              ),
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              mainAxisAlignment: MainAxisAlignment.start,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                Container(
                                  child: Align(
                                    alignment: AlignmentDirectional(0.0, 0.0),
                                    child: Padding(
                                      padding:
                                          const EdgeInsetsDirectional.fromSTEB(
                                              0.0, 0.0, 0.0, 8.0),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.max,
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.center,
                                        children: [
                                          Icon(
                                            Icons.auto_awesome_rounded,
                                            color:
                                                FlutterFlowTheme.of(context)
                                                    .accent1,
                                            size: 16.0,
                                          ),
                                          Text(
                                            'Reveal their face with Flame subscription',
                                            style: FlutterFlowTheme.of(context)
                                                .labelSmall
                                                .override(
                                                  font: GoogleFonts.inter(
                                                    fontWeight: FontWeight.w600,
                                                    fontStyle:
                                                        FlutterFlowTheme.of(
                                                                context)
                                                            .labelSmall
                                                            .fontStyle,
                                                  ),
                                                  color:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .accent1,
                                                  fontSize: 11.0,
                                                  letterSpacing: 0.0,
                                                  fontWeight: FontWeight.w600,
                                                  fontStyle:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .labelSmall
                                                          .fontStyle,
                                                  lineHeight: 1.2,
                                                ),
                                          ),
                                        ].divide(const SizedBox(width: 8.0)),
                                      ),
                                    ),
                                  ),
                                ),
                                Row(
                                  mainAxisSize: MainAxisSize.max,
                                  mainAxisAlignment: MainAxisAlignment.start,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Expanded(
                                      flex: 1,
                                      child: Container(
                                        decoration: BoxDecoration(
                                          color: FlutterFlowTheme.of(context)
                                              .primaryBackground,
                                          borderRadius:
                                              BorderRadius.circular(9999.0),
                                          border: Border.all(
                                            color:
                                                FlutterFlowTheme.of(context)
                                                    .divider,
                                            width: 1.0,
                                          ),
                                        ),
                                        child: Padding(
                                          padding: const EdgeInsetsDirectional
                                              .fromSTEB(20.0, 4.0, 20.0, 4.0),
                                          child: Row(
                                            mainAxisSize: MainAxisSize.max,
                                            mainAxisAlignment:
                                                MainAxisAlignment.start,
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            children: [
                                              Expanded(
                                                flex: 1,
                                                child: TextFormField(
                                                  controller:
                                                      _model.textController,
                                                  focusNode:
                                                      _model.textFieldFocusNode,
                                                  obscureText: false,
                                                  decoration: InputDecoration(
                                                    hintText:
                                                        'Type a message...',
                                                    hintStyle: TextStyle(
                                                      color:
                                                          FlutterFlowTheme.of(
                                                                  context)
                                                              .secondaryText,
                                                    ),
                                                    enabledBorder:
                                                        InputBorder.none,
                                                    focusedBorder:
                                                        InputBorder.none,
                                                    errorBorder:
                                                        InputBorder.none,
                                                    focusedErrorBorder:
                                                        InputBorder.none,
                                                  ),
                                                  style: const TextStyle(),
                                                  validator: _model
                                                      .textControllerValidator
                                                      .asValidator(context),
                                                ),
                                              ),
                                              FlutterFlowIconButton(
                                                buttonSize: 40.0,
                                                icon: Icon(
                                                  Icons
                                                      .sentiment_satisfied_alt_rounded,
                                                  color:
                                                      FlutterFlowTheme.of(
                                                              context)
                                                          .secondaryText,
                                                  size: 22.0,
                                                ),
                                                onPressed: () {
                                                  print(
                                                      'Emoji button pressed ...');
                                                },
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                    Container(
                                      width: 52.0,
                                      height: 52.0,
                                      decoration: BoxDecoration(
                                        color: FlutterFlowTheme.of(context)
                                            .primary,
                                        boxShadow: const [
                                          BoxShadow(
                                            blurRadius: 8.0,
                                            color: Color(0x1A000000),
                                            offset: Offset(0.0, 4.0),
                                            spreadRadius: 0.0,
                                          )
                                        ],
                                        borderRadius:
                                            BorderRadius.circular(9999.0),
                                      ),
                                      alignment:
                                          AlignmentDirectional(0.0, 0.0),
                                      child: Icon(
                                        Icons.send_rounded,
                                        color: FlutterFlowTheme.of(context)
                                            .primaryBackground,
                                        size: 24.0,
                                      ),
                                    ),
                                  ].divide(const SizedBox(width: 16.0)),
                                ),
                              ].divide(const SizedBox(height: 16.0)),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),

        // ── Deletion loading overlay ─────────────────────────────────────────
        // Rendered on top of the scaffold only while _model.isDeleting is true.
        if (_model.isDeleting)
          Container(
            color: Colors.black.withOpacity(0.65),
            child: Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const CircularProgressIndicator(
                    valueColor:
                        AlwaysStoppedAnimation<Color>(Color(0xFFEF4444)),
                    strokeWidth: 3.0,
                  ),
                  const SizedBox(height: 16.0),
                  Text(
                    'Deleting chat...',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontSize: 14.0,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }
}
