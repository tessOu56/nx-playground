// jsdom implements window.scrollTo as a not-implemented stub that logs an
// error. Vue Router calls it after navigation; a no-op keeps CI output clean.
window.scrollTo = () => {}
