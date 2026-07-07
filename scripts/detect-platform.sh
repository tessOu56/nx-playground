#!/usr/bin/env sh
# Detect host OS for dev scripts (windows / linux / darwin)
set -e
case "$(uname -s)" in
  Linux*) echo linux ;;
  Darwin*) echo darwin ;;
  MINGW*|MSYS*|CYGWIN*|Windows*) echo windows ;;
  *) echo unknown ;;
esac
