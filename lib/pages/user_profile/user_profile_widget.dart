import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import 'dart:ui';
import '/index.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'user_profile_model.dart';
export 'user_profile_model.dart';

// ─────────────────────────────────────────────────────────────────────────────
// Heartbeat pulse glow animation widget
// ─────────────────────────────────────────────────────────────────────────────

class _PulseGlow extends StatefulWidget {
  final Widget child;
  final Color glowColor;
  final double maxRadius;

  const _PulseGlow({
    required this.child,
    required this.glowColor,
    this.maxRadius = 80.0,
  });

  @override
  State<_PulseGlow> createState() => _PulseGlowState();
}

class _PulseGlowState extends State<_PulseGlow>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scale;
  late Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();

    _scale = Tween<double>(begin: 0.85, end: 1.18).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _opacity = Tween<double>(begin: 0.55, end: 0.0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        // Outer pulse ring
        AnimatedBuilder(
          animation: _controller,
          builder: (_, __) => Opacity(
            opacity: _opacity.value,
            child: Transform.scale(
              scale: _scale.value,
              child: Container(
                width: widget.maxRadius,
                height: widget.maxRadius,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: widget.glowColor.withAlpha(60),
                ),
              ),
            ),
          ),
        ),
        // Middle pulse ring (offset phase)
        AnimatedBuilder(
          animation: _controller,
          builder: (_, __) {
            final t = (_controller.value + 0.3) % 1.0;
            final scale = 0.85 + t * 0.33;
            final opacity = (0.55 * (1.0 - t)).clamp(0.0, 1.0);
            return Opacity(
              opacity: opacity,
              child: Transform.scale(
                scale: scale,
                child: Container(
                  width: widget.maxRadius * 0.85,
                  height: widget.maxRadius * 0.85,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: widget.glowColor.withAlpha(40),
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
// Main page
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

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Opens the Paywall modal using a bottom-to-top slide transition.
  void _openPaywall() {
    context.pushNamed(
      PaywallModalWidget.routeName,
      extra: <String, dynamic>{
        '__transition_info__': const TransitionInfo(
          hasTransition: true,
          transitionType: PageTransitionType.bottomToTop,
        ),
      },
    );
  }

  /// Builds a single settings row with icon, label, and optional chevron.
  Widget _settingsRow({
    required IconData icon,
    required String label,
    VoidCallback? onTap,
    bool showDivider = true,
    Color? labelColor,
    Color? iconColor,
  }) {
    final theme = FlutterFlowTheme.of(context);
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          splashColor: Colors.transparent,
          focusColor: Colors.transparent,
          hoverColor: Colors.transparent,
          highlightColor: Colors.transparent,
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: Row(
              children: [
                Icon(
                  icon,
                  color: iconColor ?? theme.secondaryText,
                  size: 22.0,
                ),
                const SizedBox(width: 16.0),
                Expanded(
                  child: Text(
                    label,
                    style: GoogleFonts.inter(
                      color: labelColor ?? theme.primaryText,
                      fontSize: 17.0,
                      fontWeight: FontWeight.w300,
                      height: 1.5,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                if (onTap != null && labelColor == null)
                  Icon(
                    Icons.chevron_right_rounded,
                    color: theme.hint,
                    size: 20.0,
                  ),
              ],
            ),
          ),
        ),
        if (showDivider)
          Divider(color: FlutterFlowTheme.of(context).divider, height: 1.0),
      ],
    );
  }

  // ── Stats card ─────────────────────────────────────────────────────────────

  Widget _statItem(String value, String label) {
    final theme = FlutterFlowTheme.of(context);
    return Expanded(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: GoogleFonts.interTight(
              color: theme.primaryText,
              fontSize: 24.0,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4.0),
          Text(
            label,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              color: theme.secondaryText,
              fontSize: 11.0,
              fontWeight: FontWeight.w500,
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }

  // ── Build ──────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    final theme = FlutterFlowTheme.of(context);

    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.light,
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: theme.primaryBackground,
        body: Stack(
          children: [
            // ── Ambient background glows ──────────────────────────────────
            Positioned.fill(
              child: Stack(
                children: [
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
                              color: theme.primary,
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
                              color: theme.accent1,
                              borderRadius: BorderRadius.circular(9999.0),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ── Main scrollable content ───────────────────────────────────
            SafeArea(
              top: true,
              child: SingleChildScrollView(
                padding: const EdgeInsets.only(bottom: 40.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // ── Top bar ──────────────────────────────────────────
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16.0, vertical: 8.0),
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () => context.safePop(),
                            icon: Icon(
                              Icons.arrow_back_rounded,
                              color: theme.primaryText,
                              size: 24.0,
                            ),
                          ),
                          Expanded(
                            child: Text(
                              'My Profile',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.interTight(
                                color: theme.primaryText,
                                fontSize: 20.0,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          // Placeholder to balance the back button
                          const SizedBox(width: 48.0),
                        ],
                      ),
                    ),

                    const SizedBox(height: 8.0),

                    // ── Avatar with heartbeat pulse glow ─────────────────
                    _PulseGlow(
                      glowColor: theme.primary,
                      maxRadius: 160.0,
                      child: Container(
                        width: 120.0,
                        height: 120.0,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [theme.primary, theme.accent1],
                            begin: Alignment.topRight,
                            end: Alignment.bottomLeft,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: theme.primary.withAlpha(100),
                              blurRadius: 24.0,
                              spreadRadius: 4.0,
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(3.0),
                          child: ClipOval(
                            child: Container(
                              color: theme.primaryBackground,
                              child: Padding(
                                padding: const EdgeInsets.all(2.0),
                                child: ClipOval(
                                  child: CachedNetworkImage(
                                    fadeInDuration: Duration.zero,
                                    fadeOutDuration: Duration.zero,
                                    imageUrl:
                                        'https://dimg.dreamflow.cloud/v1/image/abstract purple aesthetic profile male',
                                    width: 114.0,
                                    height: 114.0,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20.0),

                    // ── Editable display name ────────────────────────────
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: theme.secondaryBackground,
                          borderRadius: BorderRadius.circular(16.0),
                          border: Border.all(
                            color: theme.divider,
                            width: 1.0,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16.0, vertical: 4.0),
                          child: Row(
                            children: [
                              Icon(Icons.person_outline_rounded,
                                  color: theme.secondaryText, size: 20.0),
                              const SizedBox(width: 12.0),
                              Expanded(
                                child: TextField(
                                  controller: _model.displayNameController,
                                  focusNode: _model.displayNameFocusNode,
                                  style: GoogleFonts.interTight(
                                    color: theme.primaryText,
                                    fontSize: 22.0,
                                    fontWeight: FontWeight.w700,
                                  ),
                                  decoration: InputDecoration(
                                    border: InputBorder.none,
                                    hintText: 'Display name',
                                    hintStyle: GoogleFonts.interTight(
                                      color: theme.hint,
                                      fontSize: 22.0,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                  textInputAction: TextInputAction.done,
                                  onSubmitted: (_) =>
                                      _model.displayNameFocusNode?.unfocus(),
                                ),
                              ),
                              Icon(Icons.edit_rounded,
                                  color: theme.primary, size: 18.0),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20.0),

                    // ── Subscription badge ───────────────────────────────
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: theme.secondaryBackground,
                          borderRadius: BorderRadius.circular(20.0),
                          border: Border.all(
                            color: theme.primary.withAlpha(80),
                            width: 1.0,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: theme.primary.withAlpha(30),
                              blurRadius: 12.0,
                              spreadRadius: 0.0,
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Row(
                            children: [
                              // Tier icon
                              Container(
                                width: 48.0,
                                height: 48.0,
                                decoration: BoxDecoration(
                                  color: theme.primary.withAlpha(30),
                                  borderRadius: BorderRadius.circular(14.0),
                                ),
                                child: Icon(
                                  _model.subscriptionTier == 'Flame'
                                      ? Icons.local_fire_department_rounded
                                      : Icons.bolt_rounded,
                                  color: theme.primary,
                                  size: 26.0,
                                ),
                              ),
                              const SizedBox(width: 14.0),
                              // Tier info
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          _model.subscriptionTier,
                                          style: GoogleFonts.interTight(
                                            color: theme.primaryText,
                                            fontSize: 17.0,
                                            fontWeight: FontWeight.w700,
                                          ),
                                        ),
                                        const SizedBox(width: 8.0),
                                        Container(
                                          decoration: BoxDecoration(
                                            color: theme.primary,
                                            borderRadius:
                                                BorderRadius.circular(9999.0),
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8.0, vertical: 2.0),
                                          child: Text(
                                            'ACTIVE',
                                            style: GoogleFonts.inter(
                                              color: theme.primaryBackground,
                                              fontSize: 10.0,
                                              fontWeight: FontWeight.w700,
                                              letterSpacing: 0.5,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 2.0),
                                    Text(
                                      _model.subscriptionExpiry,
                                      style: GoogleFonts.inter(
                                        color: theme.secondaryText,
                                        fontSize: 12.0,
                                        fontWeight: FontWeight.w400,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Manage button
                              GestureDetector(
                                onTap: _openPaywall,
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      colors: [
                                        theme.primary,
                                        theme.accent1,
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(12.0),
                                  ),
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 14.0, vertical: 8.0),
                                  child: Text(
                                    'Manage',
                                    style: GoogleFonts.inter(
                                      color: Colors.white,
                                      fontSize: 13.0,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20.0),

                    // ── Stats row ────────────────────────────────────────
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: theme.secondaryBackground,
                          borderRadius: BorderRadius.circular(20.0),
                          border: Border.all(
                            color: theme.divider,
                            width: 1.0,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                              vertical: 20.0, horizontal: 8.0),
                          child: Row(
                            children: [
                              _statItem(
                                _model.knocksSentThisMonth.toString(),
                                'Knocks\nThis Month',
                              ),
                              Container(
                                width: 1.0,
                                height: 40.0,
                                color: theme.divider,
                              ),
                              _statItem(
                                _model.revealsUsedThisMonth.toString(),
                                'Reveals\nThis Month',
                              ),
                              Container(
                                width: 1.0,
                                height: 40.0,
                                color: theme.divider,
                              ),
                              _statItem(
                                _model.totalMatches.toString(),
                                'Total\nMatches',
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20.0),

                    // ── Editable bio ─────────────────────────────────────
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: theme.secondaryBackground,
                          borderRadius: BorderRadius.circular(20.0),
                          border: Border.all(
                            color: theme.divider,
                            width: 1.0,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.auto_awesome_rounded,
                                      color: theme.primary, size: 16.0),
                                  const SizedBox(width: 8.0),
                                  Text(
                                    'Bio',
                                    style: GoogleFonts.inter(
                                      color: theme.secondaryText,
                                      fontSize: 13.0,
                                      fontWeight: FontWeight.w600,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                  const Spacer(),
                                  Icon(Icons.edit_rounded,
                                      color: theme.primary, size: 16.0),
                                ],
                              ),
                              const SizedBox(height: 10.0),
                              TextField(
                                controller: _model.bioController,
                                focusNode: _model.bioFocusNode,
                                maxLines: 4,
                                maxLength: 200,
                                style: GoogleFonts.inter(
                                  color: theme.primaryText,
                                  fontSize: 15.0,
                                  fontWeight: FontWeight.w300,
                                  height: 1.6,
                                ),
                                decoration: InputDecoration(
                                  border: InputBorder.none,
                                  hintText: 'Tell the world who you are...',
                                  hintStyle: GoogleFonts.inter(
                                    color: theme.hint,
                                    fontSize: 15.0,
                                    fontWeight: FontWeight.w300,
                                  ),
                                  counterStyle: GoogleFonts.inter(
                                    color: theme.hint,
                                    fontSize: 11.0,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 20.0),

                    // ── Settings list ────────────────────────────────────
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: theme.secondaryBackground,
                          borderRadius: BorderRadius.circular(20.0),
                          border: Border.all(
                            color: theme.divider,
                            width: 1.0,
                          ),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20.0),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              _settingsRow(
                                icon: Icons.notifications_none_rounded,
                                label: 'Notifications',
                                onTap: () {},
                              ),
                              _settingsRow(
                                icon: Icons.shield_outlined,
                                label: 'Privacy & Safety',
                                onTap: () {},
                              ),
                              _settingsRow(
                                icon: Icons.manage_accounts_outlined,
                                label: 'Account Details',
                                onTap: () {},
                              ),
                              _settingsRow(
                                icon: Icons.help_outline_rounded,
                                label: 'Support Center',
                                onTap: () {},
                                showDivider: true,
                              ),
                              _settingsRow(
                                icon: Icons.logout_rounded,
                                label: 'Logout',
                                iconColor: theme.error,
                                labelColor: theme.error,
                                showDivider: false,
                                onTap: () async {
                                  await _model.logout(context);
                                },
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 24.0),

                    // ── Delete Account link ──────────────────────────────
                    GestureDetector(
                      onTap: () async {
                        await _model.deleteAccount(context);
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Text(
                          'Delete Account',
                          style: GoogleFonts.inter(
                            color: theme.error,
                            fontSize: 13.0,
                            fontWeight: FontWeight.w600,
                            decoration: TextDecoration.underline,
                            decorationColor: theme.error,
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 16.0),

                    // ── Footer branding ──────────────────────────────────
                    Column(
                      children: [
                        Text(
                          'love at first',
                          style: GoogleFonts.inter(
                            color: theme.primary,
                            fontSize: 13.0,
                            fontWeight: FontWeight.w200,
                          ),
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          'v1.0.4 • Made with 💜',
                          style: GoogleFonts.inter(
                            color: theme.hint,
                            fontSize: 11.0,
                            fontWeight: FontWeight.w200,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
