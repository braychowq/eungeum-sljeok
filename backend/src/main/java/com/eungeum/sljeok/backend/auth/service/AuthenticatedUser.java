package com.eungeum.sljeok.backend.auth.service;

import com.eungeum.sljeok.backend.auth.domain.UserRole;
import com.eungeum.sljeok.backend.auth.domain.UserStatus;

public record AuthenticatedUser(
    String userId,
    String displayName,
    UserRole role,
    UserStatus status,
    boolean onboardingCompleted) {}
