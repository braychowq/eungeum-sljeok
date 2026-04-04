package com.eungeum.sljeok.backend.content.persistence;

import com.eungeum.sljeok.backend.content.domain.CommunityCategory;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CommunityCategoryConverter implements AttributeConverter<CommunityCategory, String> {
  @Override
  public String convertToDatabaseColumn(CommunityCategory attribute) {
    return attribute == null ? null : attribute.code();
  }

  @Override
  public CommunityCategory convertToEntityAttribute(String dbData) {
    return dbData == null ? null : CommunityCategory.from(dbData);
  }
}
