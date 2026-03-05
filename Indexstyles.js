/* ═══════════════════════════════════════════════════════════
   Indexstyles.js — NothingButTheTruth Master JS
   All new JavaScript goes in this file.
   ═══════════════════════════════════════════════════════════ */

// ----------------------------------------------------------
//  Firebase SDK imports (modular, from CDN)
// ----------------------------------------------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
         signInWithEmailAndPassword, signInWithPopup, signInAnonymously,
         GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider, sendPasswordResetEmail, sendEmailVerification,
         updateProfile, signOut, linkWithCredential, EmailAuthProvider
       } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp
       } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ----------------------------------------------------------
//  Firebase Init (single source of truth)
// ----------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAFb6AHyBQZwMOrUtgf_-6WJgbmYA4hS8o",
  authDomain: "nothingbutthetruth-1cd23.firebaseapp.com",
  projectId: "nothingbutthetruth-1cd23",
  storageBucket: "nothingbutthetruth-1cd23.appspot.com",
  messagingSenderId: "253692400115",
  appId: "1:253692400115:web:7eb36acdf69382d28d0286",
  measurementId: "G-LXVCQNJ6VJ"
};

const app  = initializeApp(firebaseConfig, "nbtt-auth");
const auth = getAuth(app);
const db   = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

// ----------------------------------------------------------
//  DOM References
// ----------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function ready(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    fn();
  }
}

ready(() => {
  // ---- Elements ----
  const overlay        = $("#authOverlay");
  const closeBtn       = $("#authClose");
  const tabs           = $$(".auth-tab");
  const panels         = $$(".auth-panel");
  const navAuthBtn     = $("#navAuthBtn");
  const sidebarSignInBtn = $("#sidebarSignInBtn");
  const sidebarSignOutBtn = $("#sidebarSignOutBtn");

  // Sign In
  const signinForm     = $("#signinForm");
  const signinEmail    = $("#signinEmail");
  const signinPassword = $("#signinPassword");
  const signinError    = $("#signinError");

  // Sign Up
  const signupForm     = $("#signupForm");
  const signupName     = $("#signupName");
  const signupEmail    = $("#signupEmail");
  const signupPassword = $("#signupPassword");
  const signupConfirm  = $("#signupConfirm");
  const signupError    = $("#signupError");
  const pwFill         = $("#pwFill");
  const pwLabel        = $("#pwLabel");

  // Forgot
  const forgotForm     = $("#forgotForm");
  const forgotEmail    = $("#forgotEmail");
  const forgotError    = $("#forgotError");
  const forgotSuccess  = $("#forgotSuccess");
  const forgotLink     = $("#authForgotLink");
  const backToSignin   = $("#authBackToSignin");

  // Google & Anonymous
  const googleSignInBtn  = $("#googleSignInBtn");
  const googleSignUpBtn  = $("#googleSignUpBtn");
  const facebookSignInBtn = $("#facebookSignInBtn");
  const facebookSignUpBtn = $("#facebookSignUpBtn");
  const githubSignInBtn = $("#githubSignInBtn");
  const githubSignUpBtn = $("#githubSignUpBtn");
  const instagramSignInBtn = $("#instagramSignInBtn");
  const instagramSignUpBtn = $("#instagramSignUpBtn");
  const tiktokSignInBtn = $("#tiktokSignInBtn");
  const tiktokSignUpBtn = $("#tiktokSignUpBtn");
  const anonSignInBtn    = $("#anonSignInBtn");

  // Sidebar profile
  const sidebarSignedOut = $("#sidebarSignedOut");
  const sidebarSignedIn  = $("#sidebarSignedIn");
  const sidebarProfile = $("#sidebarProfile");
  const sidebarAvatar    = $("#sidebarAvatar");
  const sidebarUserName  = $("#sidebarUserName");
  const sidebarUserEmail = $("#sidebarUserEmail");
  const sidebarUserMode  = $("#sidebarUserMode");
  const sidebarBackdrop  = $("#sidebarBackdrop");

  const noSignInBtn      = $("#noSignInBtn");
  const activatePublicBtn = $("#activatePublicBtn");
  const activateAnonBtn  = $("#activateAnonBtn");

  let pendingAccessMode = null;

  // ---- Helpers ----
  function openAuthModal() {
    if (!overlay) return;
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    switchTab("signin");
  }

  function closeAuthModal() {
    if (!overlay) return;
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    clearErrors();
  }

  function switchTab(tabName) {
    tabs.forEach(t => {
      const active = t.dataset.tab === tabName;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    panels.forEach(p => p.classList.remove("active"));
    if (tabName === "signin")  $("#authPanelSignin")?.classList.add("active");
    if (tabName === "signup")  $("#authPanelSignup")?.classList.add("active");
    if (tabName === "forgot")  $("#authPanelForgot")?.classList.add("active");
    clearErrors();
  }

  function clearErrors() {
    [signinError, signupError, forgotError, forgotSuccess].forEach(el => {
      if (el) el.textContent = "";
    });
  }

  function showError(el, msg) {
    if (el) el.textContent = msg;
  }

  function showProviderSetupHelp(targetErrorEl, providerName) {
    showError(
      targetErrorEl,
      `${providerName} sign-in needs one extra setup step in Firebase. Use Google/Facebook/GitHub/email for now.`
    );
  }

  function ensureSidebarPrivacyWrap() {
    if (!sidebarProfile) return;

    let wrap = document.getElementById("sidebarPrivacyWrap");
    let note = sidebarProfile.querySelector(".sidebar-privacy-note");

    if (!wrap && note) {
      wrap = document.createElement("div");
      wrap.id = "sidebarPrivacyWrap";
      wrap.className = "sidebar-privacy-wrap";
      note.parentNode.insertBefore(wrap, note);
      wrap.appendChild(note);
    }

    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "sidebarPrivacyWrap";
      wrap.className = "sidebar-privacy-wrap";
      wrap.innerHTML = '<p class="sidebar-privacy-note"><i class="fas fa-lock"></i> Everything here is <strong>free</strong>. No sign in = <strong>limited</strong>. Public sign in = <strong>unlimited + public profile</strong>. Anonymous sign in = <strong>unlimited + private profile</strong>. <a href="account-options.html" class="sidebar-privacy-link">If you don’t understand then click here</a>.</p>';
    }

    if (wrap.parentElement !== sidebarProfile) {
      sidebarProfile.appendChild(wrap);
    }
  }

  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.dataset.origHtml = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span> Please wait…';
    } else {
      btn.disabled = false;
      if (btn.dataset.origHtml) btn.innerHTML = btn.dataset.origHtml;
    }
  }

  function setSidebarOpenState(isOpen) {
    const hamburger = $(".hamburger");
    const sidebar = $(".sidebar");
    if (!hamburger || !sidebar) return;

    hamburger.classList.toggle("active", isOpen);
    sidebar.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    sidebar.setAttribute("aria-hidden", isOpen ? "false" : "true");

    if (sidebarBackdrop) {
      sidebarBackdrop.classList.toggle("active", isOpen);
      sidebarBackdrop.setAttribute("aria-hidden", isOpen ? "false" : "true");
    }

    document.body.classList.toggle("sidebar-open", isOpen);
  }

  function normalizeMode(mode, user) {
    if (mode === "public-unlimited" || mode === "anonymous-unlimited") return mode;
    if (user?.isAnonymous) return "anonymous-unlimited";
    return "public-unlimited";
  }

  function modeLabel(mode) {
    if (mode === "anonymous-unlimited") return "Anonymous Account · Private · Unlimited";
    return "Public Account · Public Profile · Unlimited";
  }

  function friendlyError(code) {
    const map = {
      "auth/email-already-in-use": "This email already has an account. Try signing in instead.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password should be at least 8 characters.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Try again or reset it.",
      "auth/invalid-credential": "Incorrect email or password. Please try again.",
      "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
      "auth/popup-closed-by-user": "Sign-in popup was closed. Try again when you're ready.",
      "auth/network-request-failed": "Network error. Check your connection and try again.",
      "auth/user-disabled": "This account has been disabled. Contact support.",
    };
    return map[code] || "Something went wrong. Please try again.";
  }

  // ---- Password Strength ----
  function updatePasswordStrength(pw) {
    if (!pwFill || !pwLabel) return;
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { w: "0%",   c: "#555",    l: "" },
      { w: "20%",  c: "#f87171", l: "Weak" },
      { w: "40%",  c: "#fb923c", l: "Fair" },
      { w: "60%",  c: "#fbbf24", l: "Good" },
      { w: "80%",  c: "#34d399", l: "Strong" },
      { w: "100%", c: "#22c55e", l: "Excellent" },
    ];
    const lvl = levels[Math.min(score, 5)];
    pwFill.style.width = lvl.w;
    pwFill.style.background = lvl.c;
    pwLabel.textContent = lvl.l;
    pwLabel.style.color = lvl.c;
  }

  // ---- Password Visibility Toggle ----
  $$(".auth-pw-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.parentElement.querySelector("input");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.innerHTML = show ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
    });
  });

  // ---- Firestore User Profile ----
  async function createUserProfile(user) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref).catch(() => null);
    const defaultMode = normalizeMode(pendingAccessMode, user);
    const visibility = defaultMode === "public-unlimited" ? "public" : "private";

    if (snap && snap.exists()) {
      // Returning user — update lastLogin
      const existing = snap.data() || {};
      const updates = {
        lastLogin: serverTimestamp(),
      };

      if (!existing.accountMode) updates.accountMode = defaultMode;
      if (!existing.profileVisibility) updates.profileVisibility = visibility;
      if (typeof existing.unlimitedAccess !== "boolean") updates.unlimitedAccess = true;
      if (typeof existing.isPublicProfile !== "boolean") updates.isPublicProfile = visibility === "public";

      if (pendingAccessMode && existing.accountMode !== pendingAccessMode) {
        updates.accountMode = pendingAccessMode;
        updates.profileVisibility = pendingAccessMode === "public-unlimited" ? "public" : "private";
        updates.unlimitedAccess = true;
        updates.isPublicProfile = pendingAccessMode === "public-unlimited";
      }

      await updateDoc(ref, updates).catch(() => {});
      pendingAccessMode = null;

      return {
        ...existing,
        accountMode: updates.accountMode || existing.accountMode || defaultMode,
        profileVisibility: updates.profileVisibility || existing.profileVisibility || visibility,
      };
    }

    // Migrate localStorage data into the new profile
    const savedVerses = [];
    try {
      const raw = localStorage.getItem("savedVerses");
      if (raw) savedVerses.push(...JSON.parse(raw));
    } catch (_) {}

    const challengeProgress = {};
    try {
      const raw = localStorage.getItem("challengeProgress");
      if (raw) Object.assign(challengeProgress, JSON.parse(raw));
    } catch (_) {}

    await setDoc(ref, {
      displayName: user.displayName || "Anonymous Believer",
      email: user.email || null,
      isAnonymous: user.isAnonymous || false,
      accountMode: defaultMode,
      profileVisibility: visibility,
      isPublicProfile: visibility === "public",
      unlimitedAccess: true,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      savedVerses,
      challengeProgress,
      gameScores: {},
      pollVotes: {},
    }).catch((e) => console.warn("Profile create failed:", e));

    pendingAccessMode = null;

    return {
      accountMode: defaultMode,
      profileVisibility: visibility,
    };
  }

  // ---- UI State Manager ----
  function updateUI(user, profileData = null) {
    if (user) {
      // Signed in
      const mode = normalizeMode(profileData?.accountMode, user);
      const isAnonMode = mode === "anonymous-unlimited";
      const name = isAnonMode ? "Anonymous Believer" : (user.displayName || "Believer");
      const initial = name.charAt(0).toUpperCase();
      const email = isAnonMode ? "Private anonymous account" : (user.email || "Public account");

      // Navbar button
      if (navAuthBtn) {
        navAuthBtn.innerHTML = `<span class="nav-auth-avatar">${initial}</span><span class="nav-auth-label">${name.split(" ")[0]}</span>`;
      }

      // Sidebar
      if (sidebarSignedOut) sidebarSignedOut.style.display = "none";
      if (sidebarSignedIn) sidebarSignedIn.style.display = "block";
      if (sidebarAvatar) sidebarAvatar.textContent = initial;
      if (sidebarUserName) sidebarUserName.textContent = name;
      if (sidebarUserEmail) sidebarUserEmail.textContent = email;
      if (sidebarUserMode) sidebarUserMode.textContent = modeLabel(mode);

      closeAuthModal();
    } else {
      // Signed out
      if (navAuthBtn) {
        navAuthBtn.innerHTML = '<i class="fas fa-user-circle" aria-hidden="true"></i><span class="nav-auth-label">Sign In</span>';
      }
      if (sidebarSignedOut) sidebarSignedOut.style.display = "block";
      if (sidebarSignedIn)  sidebarSignedIn.style.display = "none";
      if (sidebarUserMode) sidebarUserMode.textContent = "";
    }
  }

  // ---- Auth State Listener ----
  onAuthStateChanged(auth, async (user) => {
    ensureSidebarPrivacyWrap();
    if (user) {
      const profileData = await createUserProfile(user);
      updateUI(user, profileData);
    } else {
      pendingAccessMode = null;
      updateUI(null);
    }
  });

  // ---- Event: Open / Close Modal ----
  navAuthBtn?.addEventListener("click", () => {
    if (auth.currentUser) {
      // Already signed in — open sidebar instead
      setSidebarOpenState(true);
    } else {
      openAuthModal();
    }
  });

  sidebarSignInBtn?.addEventListener("click", () => {
    // Close sidebar first
    setSidebarOpenState(false);
    openAuthModal();
  });

  ensureSidebarPrivacyWrap();

  closeBtn?.addEventListener("click", closeAuthModal);
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeAuthModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay?.classList.contains("active")) closeAuthModal();
  });

  // ---- Event: Tab Switching ----
  tabs.forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });
  noSignInBtn?.addEventListener("click", () => {
    closeAuthModal();
  });
  activatePublicBtn?.addEventListener("click", () => {
    switchTab("signup");
  });
  activateAnonBtn?.addEventListener("click", async () => {
    clearErrors();
    pendingAccessMode = "anonymous-unlimited";
    try {
      await signInAnonymously(auth);
    } catch (err) {
      pendingAccessMode = null;
      showError(signinError, friendlyError(err.code));
    }
  });
  forgotLink?.addEventListener("click", (e) => { e.preventDefault(); switchTab("forgot"); });
  backToSignin?.addEventListener("click", (e) => { e.preventDefault(); switchTab("signin"); });

  // ---- Event: Password Strength ----
  signupPassword?.addEventListener("input", () => updatePasswordStrength(signupPassword.value));

  // ---- Event: Sign In with Email ----
  signinForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    const email = signinEmail.value.trim();
    const pw    = signinPassword.value;
    if (!email || !pw) return showError(signinError, "Please fill in all fields.");
    const btn = signinForm.querySelector(".auth-submit-btn");
    setLoading(btn, true);
    try {
      pendingAccessMode = "public-unlimited";
      await signInWithEmailAndPassword(auth, email, pw);
    } catch (err) {
      pendingAccessMode = null;
      showError(signinError, friendlyError(err.code));
    }
    setLoading(btn, false);
  });

  // ---- Event: Sign Up with Email ----
  signupForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    const name    = signupName.value.trim() || "Anonymous Believer";
    const email   = signupEmail.value.trim();
    const pw      = signupPassword.value;
    const confirm = signupConfirm.value;

    if (!email || !pw) return showError(signupError, "Email and password are required.");
    if (pw.length < 8) return showError(signupError, "Password must be at least 8 characters.");
    if (pw !== confirm) return showError(signupError, "Passwords do not match.");

    const btn = signupForm.querySelector(".auth-submit-btn");
    setLoading(btn, true);
    try {
      pendingAccessMode = "public-unlimited";
      // If currently anonymous, link instead of creating new
      if (auth.currentUser?.isAnonymous) {
        const cred = EmailAuthProvider.credential(email, pw);
        await linkWithCredential(auth.currentUser, cred);
        await updateProfile(auth.currentUser, { displayName: name });
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, pw);
        await updateProfile(result.user, { displayName: name });
        await sendEmailVerification(result.user).catch(() => {});
      }
      updateUI(auth.currentUser, { accountMode: "public-unlimited" });
    } catch (err) {
      pendingAccessMode = null;
      showError(signupError, friendlyError(err.code));
    }
    setLoading(btn, false);
  });

  // ---- Event: Forgot Password ----
  forgotForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();
    const email = forgotEmail.value.trim();
    if (!email) return showError(forgotError, "Please enter your email.");
    const btn = forgotForm.querySelector(".auth-submit-btn");
    setLoading(btn, true);
    try {
      await sendPasswordResetEmail(auth, email);
      if (forgotSuccess) forgotSuccess.textContent = "Reset link sent! Check your inbox (and spam folder).";
    } catch (err) {
      showError(forgotError, friendlyError(err.code));
    }
    setLoading(btn, false);
  });

  // ---- Event: Google Sign-In ----
  async function handleProviderSignIn(provider, errorTarget, mode = "public-unlimited") {
    clearErrors();
    pendingAccessMode = mode;
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      pendingAccessMode = null;
      showError(errorTarget || signinError, friendlyError(err.code));
    }
  }

  googleSignInBtn?.addEventListener("click", () => handleProviderSignIn(googleProvider, signinError));
  googleSignUpBtn?.addEventListener("click", () => handleProviderSignIn(googleProvider, signupError));
  facebookSignInBtn?.addEventListener("click", () => handleProviderSignIn(facebookProvider, signinError));
  facebookSignUpBtn?.addEventListener("click", () => handleProviderSignIn(facebookProvider, signupError));
  githubSignInBtn?.addEventListener("click", () => handleProviderSignIn(githubProvider, signinError));
  githubSignUpBtn?.addEventListener("click", () => handleProviderSignIn(githubProvider, signupError));
  instagramSignInBtn?.addEventListener("click", () => showProviderSetupHelp(signinError, "Instagram"));
  instagramSignUpBtn?.addEventListener("click", () => showProviderSetupHelp(signupError, "Instagram"));
  tiktokSignInBtn?.addEventListener("click", () => showProviderSetupHelp(signinError, "TikTok"));
  tiktokSignUpBtn?.addEventListener("click", () => showProviderSetupHelp(signupError, "TikTok"));

  // ---- Event: Anonymous Sign-In ----
  anonSignInBtn?.addEventListener("click", async () => {
    clearErrors();
    try {
      pendingAccessMode = "anonymous-unlimited";
      await signInAnonymously(auth);
    } catch (err) {
      pendingAccessMode = null;
      showError(signinError, friendlyError(err.code));
    }
  });

  // ---- Event: Sign Out ----
  sidebarSignOutBtn?.addEventListener("click", async () => {
    try {
      await signOut(auth);
      updateUI(null);
      // Close sidebar
      setSidebarOpenState(false);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  });

  // ---- Share Link Enhancer ----
  function toAbsoluteUrl(href) {
    try {
      return new URL(href, window.location.origin).toString();
    } catch {
      return null;
    }
  }

  async function shareContent(url, title) {
    const shareData = {
      title: title || document.title,
      text: title || "Check this out",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (_) {}
    }

    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard.");
    } catch (_) {
      prompt("Copy this link:", url);
    }
  }

  function getCardShareUrl(card) {
    if (!card) return null;
    if (card.dataset.shareUrl) return toAbsoluteUrl(card.dataset.shareUrl);

    if (card.classList.contains("video-card")) {
      const wrapper = card.querySelector(".video-wrapper[id]");
      const id = wrapper?.id;
      const base = toAbsoluteUrl("all-videos.html");
      if (!base) return null;
      return id ? `${base}#${id}` : base;
    }

    const directHref = card.getAttribute("href");
    if (directHref) return toAbsoluteUrl(directHref);
    const nestedLink = card.querySelector("a[href]");
    if (nestedLink) return toAbsoluteUrl(nestedLink.getAttribute("href"));
    return null;
  }

  function getCardShareTitle(card) {
    const heading = card.querySelector("h3, h2");
    if (heading?.textContent) return heading.textContent.trim();
    return "Shared from NothingButTheTruth";
  }

  function attachShareButtons() {
    const selectors = [
      ".game-card",
      ".video-card",
      ".myth-short-card",
    ];

    document.querySelectorAll(selectors.join(",")).forEach((card) => {
      if (card.querySelector(".content-share-btn")) return;
      const shareUrl = getCardShareUrl(card);
      if (!shareUrl) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "content-share-btn";
      btn.setAttribute("aria-label", "Share this");
      btn.innerHTML = '<i class="fas fa-share-alt"></i>';

      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await shareContent(shareUrl, getCardShareTitle(card));
      });

      card.appendChild(btn);
    });
  }

  attachShareButtons();

  // ---- Mark loaded ----
  document.documentElement.dataset.indexstylesJs = "loaded";
});
