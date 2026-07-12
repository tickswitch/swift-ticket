// Enforces the password rules shown in the auth UI checklist.
// Backend also validates (min length); this gives immediate client feedback.
export const passwordRules = [
  { test: (p: string) => p.length >= 8, label: "8+ characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "Uppercase letter" },
  { test: (p: string) => /[a-z]/.test(p), label: "Lowercase letter" },
  { test: (p: string) => /\d/.test(p), label: "Number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "Special character" },
];

export const isStrongPassword = (password: string): boolean =>
  passwordRules.every((rule) => rule.test(password));

// Returns the first unmet rule's label, or null if the password is strong.
export const firstPasswordError = (password: string): string | null => {
  const failed = passwordRules.find((rule) => !rule.test(password));
  return failed ? `Password needs: ${failed.label.toLowerCase()}` : null;
};
