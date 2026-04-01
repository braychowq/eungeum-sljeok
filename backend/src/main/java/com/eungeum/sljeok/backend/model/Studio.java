package com.eungeum.sljeok.backend.model;

import java.util.List;

public record Studio(
    String id,
    String district,
    String name,
    String price,
    String description,
    List<String> tags,
    String imageUrl
) {}
