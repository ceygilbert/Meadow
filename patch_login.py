with open('pages/admin/Login.tsx', 'r') as f:
    content = f.read()

target = """        try {
          localStorage.setItem(`meadow_auth_profile_${data.session.user.id}`, JSON.stringify(profile));
          localStorage.setItem('meadow_auth_profile_current', JSON.stringify(profile));
          localStorage.setItem('meadow_last_active_user_id', data.session.user.id);
        } catch (e) {
          console.warn("Failed to cache profile in localStorage:", e);
        }"""

replacement = """        try {
          localStorage.setItem(`meadow_auth_profile_${data.session.user.id}`, JSON.stringify(profile));
          localStorage.setItem('meadow_auth_profile_current', JSON.stringify(profile));
          localStorage.setItem('meadow_last_active_user_id', data.session.user.id);
        } catch (e) {
          console.warn("Failed to cache profile in localStorage:", e);
        }

        // --- NEW: Log login to txt file via backend API ---
        try {
          fetch('/api/log-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanEmail,
              role: profile.role,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent
            })
          }).catch(err => console.warn("Failed to send login log:", err));
        } catch (e) {
          console.warn("Error calling log api", e);
        }
        // ------------------------------------------------"""

content = content.replace(target, replacement)

with open('pages/admin/Login.tsx', 'w') as f:
    f.write(content)
