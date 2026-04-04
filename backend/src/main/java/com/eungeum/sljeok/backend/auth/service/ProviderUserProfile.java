package com.eungeum.sljeok.backend.auth.service;

public record ProviderUserProfile(
    String providerUserId, String email, boolean emailVerified, String nickname) {}
