package com.eungeum.sljeok.backend.model;

public record CommunityPost(
    String id,
    String category,
    String title,
    String body,
    String date,
    String imageUrl
) {}
